<template>
    <div class="sidebar">
        <!-- sidebar logo -->
        <div class="sidebar-logo" @click="router.push('/')"></div>
        <!-- sidebar menu -->
        <div class="sidebar-menu">
            <n-menu :options="menuOptions" />
        </div>
    </div>
</template>

<script setup lang='ts'>

// 使用router
const router = useRouter()

// 渲染图标 
function renderIconFont(iconName: string) {
    return () => h('svg', { class: 'iconfont', 'aria-hidden': true }, h('use', { "xlink:href": `#${iconName}` }, () => ''))
}

const menuOptions = [
    {
        label: '动作游戏',
        key: 'pinball-1973',
        icon: renderIconFont("icon-ActionGames"),
    },
    {
        label: '角色扮演',
        key: 'pinball-1973',
        icon: renderIconFont("icon-RPG"),
    },
]


</script>
<style lang="scss" scoped>
.sidebar {
    width: 200px;
    height: 100%;
    border-right: 1px solid #18a058;
    overflow: hidden;

    .sidebar-logo {
        cursor: pointer;
        width: 200px;
        height: 60px;
        background: url('/src/assets/image/logo.png') no-repeat left/40%;
        position: relative;
        color: linear-gradient(120deg, #bd34fe, #41d1ff);

        &::after {
            content: "WebGame";
            bottom: 0;
            right: 5px;
            position: absolute;
            font-size: 1.5rem;
            // 使用 CSS 的线性渐变（linear-gradient）定义颜色渐变。
            background: linear-gradient(120deg, #bd34fe, #41d1ff);
            // 将背景应用于文本内容，而不是整个元素。
            background-clip: text;
            // 让文本填充颜色变为透明，以便背景的渐变颜色能够透过文本显示
            -webkit-text-fill-color: transparent;
        }
    }

    .sidebar-menu {
        margin-top: 20px;
    }
}
</style>