<template>
  <n-config-provider :theme="darkTheme" :theme-overrides="themeOverrides">

  </n-config-provider>
</template>

<script setup lang='ts'>
import { darkTheme, type GlobalThemeOverrides } from 'naive-ui'

// 样式覆盖
const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#FF0000'
  },
  Button: {
    textColor: '#FF0000'
  }
}

console.log(darkTheme);
</script>

<style lang="scss" scoped></style>