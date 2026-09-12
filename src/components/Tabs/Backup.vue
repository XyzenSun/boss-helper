<script lang="ts" setup>
import { useBackup } from '@/composables/useBackup'

const {
  webdavConf,
  testing,
  backingUp,
  restoring,
  cloudInfo,
  testConnection,
  backupNow,
  restoreNow,
} = useBackup()
</script>

<template>
  <div class="flex flex-col gap-3">
    <Alert
      id="backup-intro"
      show-icon
      color="primary"
      title="备份与恢复 (WebDAV)"
      description="将去重记录、筛选配置(含全部预设)、外观配置、AI模型配置和统计数据备份到你自己的 WebDAV 网盘, 换电脑或重装插件后可一键恢复。备份包含 AI 模型的 API Key, 请保管好网盘账号安全。恢复会以云端备份覆盖本地同名数据。"
    />
    <div class="grid grid-cols-2 gap-2">
      <UFormField
        class="col-span-2"
        label="服务器地址"
        data-help="WebDAV 服务地址。坚果云: https://dav.jianguoyun.com/dav/ ; Nextcloud: .../remote.php/dav/files/用户名/"
      >
        <UInput
          v-model="webdavConf.url"
          placeholder="https://dav.jianguoyun.com/dav/"
          class="w-full"
        />
      </UFormField>
      <UFormField label="用户名" data-help="WebDAV 账号用户名, 坚果云为注册邮箱">
        <UInput v-model="webdavConf.username" class="w-full" />
      </UFormField>
      <UFormField
        label="密码"
        data-help="WebDAV 密码。坚果云不能使用登录密码, 需在网页端 [安全选项 -> 添加应用密码] 中生成"
      >
        <UInput v-model="webdavConf.password" type="password" class="w-full" />
      </UFormField>
      <UFormField
        class="col-span-2"
        label="备份文件路径"
        data-help="备份文件在网盘中的存放位置, 上级目录不存在会自动创建。多台设备填相同路径即可共享同一份备份"
      >
        <UInput v-model="webdavConf.path" class="w-full" />
      </UFormField>
    </div>
    <div class="flex flex-wrap gap-2 items-center">
      <UButton color="neutral" variant="outline" :loading="testing" @click="testConnection">
        测试连接
      </UButton>
      <UButton color="primary" :loading="backingUp" @click="backupNow">立即备份</UButton>
      <UButton color="warning" :loading="restoring" @click="restoreNow">从云端恢复</UButton>
      <span v-if="cloudInfo" class="text-sm text-gray-500">{{ cloudInfo }}</span>
    </div>
  </div>
</template>
