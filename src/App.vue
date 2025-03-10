<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides" :locale="loacl" :date-locale="dateLocale">
    <n-message-provider>
      <router-view></router-view>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang='ts'>
import { darkTheme, zhCN, dateZhCN, enUS, dateEnUS, ruRU, dateRuRU } from 'naive-ui'
import { type GlobalThemeOverrides, type NLocale, type NDateLocale, type GlobalTheme } from 'naive-ui'

// 主题样式
const theme = ref<GlobalTheme | null>(null)
// 样式覆盖（aive-ui 导出了 GlobalThemeOverrides 类型帮助你定义主题）
const themeOverrides: GlobalThemeOverrides = {
}

// 语言包
const loacl = ref<NLocale | null>(zhCN)
const dateLocale = ref<NDateLocale | null>(dateZhCN)

</script>

<style lang="scss" scoped></style>