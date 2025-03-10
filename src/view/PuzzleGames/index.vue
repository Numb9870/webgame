<template>
    <n-button @click="router.push({ name: 'GluttonousSnake' })">贪吃蛇</n-button>
</template>

<script setup lang='ts'>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style lang="scss" scoped></style>