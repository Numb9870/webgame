<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides" :locale="locale" :date-locale="dateLocale">
    <n-message-provider>
      <router-view></router-view>
    </n-message-provider>
    <!-- 样式同步至 body -->
    <n-global-style />
  </n-config-provider>
</template>

<script setup lang='ts'>
import { darkTheme, useOsTheme, zhCN, dateZhCN, enUS, dateEnUS } from 'naive-ui'
import { type GlobalThemeOverrides, type NLocale, type NDateLocale, } from 'naive-ui'

// 组件实例化
const instance = getCurrentInstance()

// 主题样式
const osThemeRef = useOsTheme()
const theme = ref(osThemeRef.value === 'dark' ? darkTheme : null)
instance?.proxy?.$Bus.on('themeChange', (value: any) => {
  value ? theme.value = darkTheme : theme.value = null
})

// 样式覆盖（aive-ui 导出了 GlobalThemeOverrides 类型帮助你定义主题）
const themeOverrides: GlobalThemeOverrides = {
}

// 语言包
const locale = ref<NLocale | null>(zhCN)
const dateLocale = ref<NDateLocale | null>(dateZhCN)
instance?.proxy?.$Bus.on('languageChange', (key: any) => {
  switch (key) {
    case 'zh-CN':
      locale.value = zhCN
      dateLocale.value = dateZhCN
      break;
    case 'en-US':
      locale.value = enUS
      dateLocale.value = dateEnUS
      break;
    default:
      break;
  }
})
</script>

<style lang="scss" scoped></style>