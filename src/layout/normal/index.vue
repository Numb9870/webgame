<template>
    <div class="layout">
        <Sidebar />
        <Content />
    </div>
</template>

<script setup lang='ts'>
import Sidebar from './components/Sidebar.vue';
import Content from './components/Content.vue'
</script>

<style lang="scss" scoped>
// 全局布局
.layout {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: flex;
}
</style>