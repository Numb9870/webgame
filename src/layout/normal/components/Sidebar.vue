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
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';

/* *********************************************实例化********************************************* */
// 引入router
const router = useRouter()
// 引入i18n
const { t } = useI18n();


/* *********************************************菜单配置********************************************* */
// 渲染图标 
function renderIconFont(iconName: string) {
    return () => h('svg', { class: 'iconfont', 'aria-hidden': true }, h('use', { "xlink:href": `#${iconName}` }, () => ''))
}
// 菜单配置
const menuOptions = [
    {
        label: () => h('span', {}, { default: () => t('sidebar.ActionGames') }),
        key: 'ActionGames',
        icon: renderIconFont("icon-ActionGames"),
    },
    {
        label: () => h('span', {}, { default: () => t('sidebar.RPG') }),
        key: 'RPG',
        icon: renderIconFont("icon-RPG"),
    },
    {
        label: () => h('span', {}, { default: () => t('sidebar.StrategyGames') }),
        key: 'StrategyGames',
        icon: renderIconFont("icon-StrategyGames"),
    },
    {
        label: () => h('span', {}, { default: () => t('sidebar.AdventureGames') }),
        key: 'AdventureGames',
        icon: renderIconFont("icon-AdventureGames"),
    },
    {
        label: () => h('span', {}, { default: () => t('sidebar.SimulationGames') }),
        key: 'SimulationGames',
        icon: renderIconFont("icon-SimulationGames"),
    },
    {
        label: () => h('span', {}, { default: () => t('sidebar.SportsGames') }),
        key: 'SportsGames',
        icon: renderIconFont("icon-SportsGames"),
    },
    {
        label: () => h('span', {}, { default: () => t('sidebar.FightingGames') }),
        key: 'FightingGames',
        icon: renderIconFont("icon-FightingGames"),
    },
    {
        label: () => h(
            RouterLink,
            {
                to: {
                    name: 'PuzzleGames',
                }
            },
            { default: () => t('sidebar.PuzzleGames') }
        ),
        key: 'PuzzleGames',
        icon: renderIconFont("icon-PuzzleGames"),
    },
    {
        label: () => h('span', {}, { default: () => t('sidebar.MusicGames') }),
        key: 'MusicGames',
        icon: renderIconFont("icon-MusicGames"),
    },
    {
        label: () => h('span', {}, { default: () => t('sidebar.MMO') }),
        key: 'MMO',
        icon: renderIconFont("icon-MMO"),
    },
    {
        label: () => h('span', {}, { default: () => t('sidebar.IndieGames') }),
        key: 'IndieGames',
        icon: renderIconFont("icon-IndieGames"),
    },
    {
        label: () => h('span', {}, { default: () => t('sidebar.SandboxGames') }),
        key: 'SandboxGames',
        icon: renderIconFont("icon-SandboxGames"),
    },
    {
        label: () => h('span', {}, { default: () => t('sidebar.CasualGames') }),
        key: 'CasualGames',
        icon: renderIconFont("icon-CasualGames"),
    },
    {
        label: () => h('span', {}, { default: () => t('sidebar.Roguelike') }),
        key: 'Roguelike',
        icon: renderIconFont("icon-Roguelike"),
    },
]


</script>

<style lang="scss" scoped>
.sidebar {
    width: 200px;
    min-width: 200px;
    height: 100%;
    border-right: 1px solid #18a058;
    overflow: hidden;
    transition: all 0.3s ease-in-out;

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