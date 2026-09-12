import { useStorageAsync } from '@vueuse/core'
import { ref } from 'vue'

import {
  appearanceConfKey,
  formDataBaseKey,
  formDataPresetKey,
  formDataPresetsKey,
} from '@/composables/conf'
import { VITE_VERSION } from '@/composables/useHelper'
import { confModelKey } from '@/composables/useModel'
import { statisticsKey, todayKey } from '@/composables/useStatistics'
import { sameCompanyKey, sameHrKey } from '@/entrypoints/boss/requests'
import { counter, ExtStorage } from '@/message'
import { errorHandle } from '@/utils'
import { logger } from '@/utils/logger'

export interface WebdavConf {
  url: string
  username: string
  password: string
  path: string
}

export interface BackupFile {
  app: 'boss-helper'
  version: number
  createdAt: number
  extensionVersion: string
  data: Record<string, unknown>
}

// WebDAV 配置含密码，使用 local: 前缀存入本机存储，避免进入会同步到账号服务器的 sync 区
export const webdavConf = useStorageAsync(
  'local:webdav-conf',
  {
    url: '',
    username: '',
    password: '',
    path: '/boss-helper/backup.json',
  },
  ExtStorage,
  { mergeDefaults: true },
)

const testing = ref(false)
const backingUp = ref(false)
const restoring = ref(false)
const cloudInfo = ref('')

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString('zh-CN')
}

// btoa 无法处理非 Latin1 字符(如中文用户名)，需先转为 UTF-8 字节流再编码
function toBase64(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)))
  return btoa(binary)
}

function getAuthHeaders(conf: WebdavConf): Record<string, string> {
  if (!conf.username && !conf.password) {
    return {}
  }
  return { Authorization: `Basic ${toBase64(`${conf.username}:${conf.password}`)}` }
}

function getBackupUrl(conf: WebdavConf): string {
  const base = conf.url.trim().replace(/\/+$/, '')
  const path = conf.path.trim().replace(/^\/+/, '')
  return `${base}/${path}`
}

async function webdavRequest(
  conf: WebdavConf,
  args: { method: string; url: string; headers?: Record<string, string>; body?: string },
) {
  return counter.webdavRequest({
    ...args,
    headers: { ...getAuthHeaders(conf), ...args.headers },
  })
}

/**
 * 备份清单：去重记录、筛选配置(含全部预设)、外观、AI 模型、统计数据。
 * key 与 contentScript 中 genKey 的前缀规则一致，前缀决定实际落入的存储区域。
 */
async function getBackupManifestKeys(): Promise<string[]> {
  const presets = await counter.storageGet<Array<{ label: string; value: string }>>(
    formDataPresetsKey,
    [],
  )
  const presetKeys = (presets ?? [])
    .filter((preset) => preset.value && preset.value !== 'default')
    .map((preset) => `${formDataBaseKey}-${preset.value}`)

  return [
    sameCompanyKey,
    sameHrKey,
    formDataPresetKey,
    formDataPresetsKey,
    formDataBaseKey,
    ...presetKeys,
    // 无前缀 key 经 genKey 归一化后存入 sync 区
    `sync:${appearanceConfKey}`,
    `sync:${confModelKey}`,
    todayKey,
    statisticsKey,
  ]
}

function parseBackup(body: string): BackupFile {
  const file = JSON.parse(body)
  if (
    !file ||
    typeof file !== 'object' ||
    file.app !== 'boss-helper' ||
    typeof file.version !== 'number' ||
    !file.data ||
    typeof file.data !== 'object'
  ) {
    throw new Error('云端文件不是有效的 BossHelper 备份')
  }
  if (file.version !== 1) {
    throw new Error(`备份格式版本(v${file.version})不受当前插件支持`)
  }
  return file
}

/**
 * 逐级 MKCOL 创建父目录。
 * 405 表示目录已存在；其余非成功状态不在此处中断，
 * 让后续 PUT 返回的真实错误来提示用户。
 */
async function ensureRemoteDirs(conf: WebdavConf) {
  const base = conf.url.trim().replace(/\/+$/, '')
  const segments = conf.path
    .trim()
    .replace(/^\/+|\/+$/g, '')
    .split('/')
  segments.pop() // 最后一段是文件名，无需创建
  let current = base
  for (const segment of segments) {
    if (!segment) {
      continue
    }
    current += `/${segment}`
    const res = await webdavRequest(conf, { method: 'MKCOL', url: current })
    if (![200, 201, 405].includes(res.status)) {
      logger.warn('WebDAV 创建目录未成功', current, res.status)
    }
  }
}

async function testConnection() {
  const conf = webdavConf.value
  const toast = useToast()
  if (!conf.url) {
    toast.add({ title: '请先填写 WebDAV 服务器地址', color: 'error' })
    return
  }
  testing.value = true
  cloudInfo.value = ''
  try {
    // 直接 GET 备份文件：一次请求即可同时验证连通性、认证和备份是否存在
    const res = await webdavRequest(conf, { method: 'GET', url: getBackupUrl(conf) })
    if (res.status === 401 || res.status === 403) {
      cloudInfo.value = '认证失败: 请检查用户名和密码(坚果云等服务需使用应用密码)'
    } else if (res.status === 404) {
      cloudInfo.value = '连接成功, 云端暂无备份'
    } else if (res.ok && res.body) {
      const file = parseBackup(res.body)
      cloudInfo.value = `连接成功, 云端备份时间: ${formatTime(file.createdAt)}`
    } else {
      cloudInfo.value = `连接失败: HTTP ${res.status} ${res.statusText}`
    }
  } catch (error) {
    cloudInfo.value = `连接失败: ${errorHandle(error)}`
  } finally {
    testing.value = false
  }
}

async function backupNow() {
  const conf = webdavConf.value
  const toast = useToast()
  if (!conf.url) {
    toast.add({ title: '请先填写 WebDAV 服务器地址', color: 'error' })
    return
  }
  backingUp.value = true
  try {
    const keys = await getBackupManifestKeys()
    const data: Record<string, unknown> = {}
    for (const key of keys) {
      // 不存在的 key 记为 null，恢复时据此清空本地对应数据，保证"以云端为准"
      data[key] = await counter.storageGet(key)
    }
    const file: BackupFile = {
      app: 'boss-helper',
      version: 1,
      createdAt: Date.now(),
      extensionVersion: VITE_VERSION,
      data,
    }

    await ensureRemoteDirs(conf)
    const res = await webdavRequest(conf, {
      method: 'PUT',
      url: getBackupUrl(conf),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(file, null, 2),
    })
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}${res.body ? `: ${res.body}` : ''}`)
    }

    cloudInfo.value = `备份成功: ${formatTime(file.createdAt)}`
    toast.add({ title: '备份成功', color: 'success' })
  } catch (error) {
    toast.add({ title: `备份失败: ${errorHandle(error)}`, color: 'error' })
    logger.error('WebDAV 备份失败', error)
  } finally {
    backingUp.value = false
  }
}

async function restoreNow() {
  const conf = webdavConf.value
  const toast = useToast()
  if (!conf.url) {
    toast.add({ title: '请先填写 WebDAV 服务器地址', color: 'error' })
    return
  }
  if (!confirm('恢复会用云端备份覆盖本地的去重记录、配置和统计数据, 确定继续吗?')) {
    return
  }
  restoring.value = true
  try {
    const res = await webdavRequest(conf, { method: 'GET', url: getBackupUrl(conf) })
    if (res.status === 404) {
      throw new Error('云端没有备份文件, 请先备份')
    }
    if (!res.ok || !res.body) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`)
    }
    const file = parseBackup(res.body)

    for (const [key, value] of Object.entries(file.data)) {
      if (value == null) {
        await counter.storageRm(key)
      } else {
        await counter.storageSet(key, value)
      }
    }

    cloudInfo.value = `已恢复云端备份: ${formatTime(file.createdAt)}`
    // 页面内的配置对象是启动时加载的内存副本，不刷新不会感知到存储变化
    toast.add({ title: '恢复成功, 请立即刷新页面使配置生效', color: 'success' })
  } catch (error) {
    toast.add({ title: `恢复失败: ${errorHandle(error)}`, color: 'error' })
    logger.error('WebDAV 恢复失败', error)
  } finally {
    restoring.value = false
  }
}

export function useBackup() {
  return {
    webdavConf,
    testing,
    backingUp,
    restoring,
    cloudInfo,
    testConnection,
    backupNow,
    restoreNow,
  }
}
