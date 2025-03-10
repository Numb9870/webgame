<template>
    <div class="header">
        <TablerLayoutSidebarLeftCollapse color="#18a058" font-size="1rem" />
        <div>
            <n-button type="info" text>注册</n-button>
            <n-button type="info" text>登陆</n-button>
        </div>
    </div>
</template>

<script setup lang='ts'>
import TablerLayoutSidebarLeftCollapse from '~icons/tabler/layout-sidebar-left-collapse'
// import TablerLayoutSidebarRightCollapse from '~icons/tabler/layout-sidebar-right-collapse'
</script>

<style lang="scss" scoped>
.header {
    width: 100%;
    height: 60px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba($color: #18a058, $alpha: 0.4);
}
</style>