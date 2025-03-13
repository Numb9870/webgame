<template>
    <div class="content">
        <Header />
        <div class="content-view">
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup lang='ts'>
import Header from './Header.vue'
</script>

<style lang="scss" scoped>
.content {
    width: calc(100vw - 200px);
    min-width: 1000px;
    height: 100vh;

    .content-view {
        width: calc(100vw - 200px);
        min-width: 1000px;
        height: calc(100vh - 60px);
        padding: 10px;
    }
}
</style>