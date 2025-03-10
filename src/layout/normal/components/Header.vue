<template>
    <div class="header">
        <div class="header-left">
            <TablerLayoutSidebarLeftCollapse color="#18a058" font-size="1rem" />
        </div>
        <div class="header-right">
            <n-button class="mr-2!" type="info" text @click="message.info('暂未开放')">注册</n-button>
            <n-button type="info" text @click="message.info('暂未开放')">登陆</n-button>
        </div>
    </div>
</template>

<script setup lang='ts'>
import TablerLayoutSidebarLeftCollapse from '~icons/tabler/layout-sidebar-left-collapse'
// import TablerLayoutSidebarRightCollapse from '~icons/tabler/layout-sidebar-right-collapse'
import { useMessage } from 'naive-ui'

// 实例化消息提示
const message = useMessage()

</script>

<style lang="scss" scoped>
.header {
    width: 100%;
    height: 60px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba($color: #18a058, $alpha: 0.4);
}
</style>