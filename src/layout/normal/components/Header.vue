<template>
    <div class="header">
        <div class="header-left">

        </div>
        <!-- 右侧内容 -->
        <div class="header-right">
            <!-- 主题切换 -->
            <n-popover trigger="hover">
                <template #trigger>
                    <div class="theme">
                        <n-switch v-model:value="theme" @update:value="handleThemeChange">
                            <template #checked-icon>
                                <n-icon :component="LineMdSunnyFilledLoopToMoonFilledAltLoopTransition" />
                            </template>
                            <template #unchecked-icon>
                                <n-icon :component="LineMdSunRisingTwotoneLoop" />
                            </template>
                        </n-switch>
                    </div>
                </template>
                <span>{{ t('popover.themeChange') }}</span>
            </n-popover>

            <!-- 语言选择 -->
            <div class="language">
                <n-dropdown trigger="hover" :show-arrow="true" :options="languageOptions"
                    @select="handleLanguageSelect">
                    <n-button text>
                        <template #icon>
                            <n-icon>
                                <CilLanguage />
                            </n-icon>
                        </template>
                    </n-button>
                </n-dropdown>
            </div>

            <!-- 用户信息 -->
            <div class="user">
                <n-button class="mr-2!" type="info" text @click="message.info('暂未开放')">{{ t('register') }}</n-button>
                <n-button type="info" text @click="message.info('暂未开放')">{{ t('login') }}</n-button>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import LineMdSunnyFilledLoopToMoonFilledAltLoopTransition from '~icons/line-md/sunny-filled-loop-to-moon-filled-alt-loop-transition'
import LineMdSunRisingTwotoneLoop from '~icons/line-md/sun-rising-twotone-loop'
import CilLanguage from '~icons/cil/language'
import { useMessage, useOsTheme } from 'naive-ui'
import { useI18n } from 'vue-i18n';

/* *********************************************实例化********************************************* */
// 引入i18n
const { t, locale } = useI18n();
// 实例化消息提示
const message = useMessage()
// 组件实例化
const instance = getCurrentInstance()
// 获取系统主题
const osThemeRef = useOsTheme()

/* *********************************************切换主题********************************************* */
const theme = ref(osThemeRef.value === 'dark' ? true : false)
const handleThemeChange = (value: boolean) => {
    // UI 组件主题切换
    instance?.proxy?.$Bus.emit('themeChange', value)
}


/* *********************************************切换语言********************************************* */
// 语言选项
const languageOptions = [
    { label: '简体中文', key: 'zh-CN' },
    { label: 'English', key: 'en-US' },
]
// 语言选择事件
const handleLanguageSelect = (key: string) => {
    // i18n切换
    locale.value = key
    // ui组件国际化切换
    instance?.proxy?.$Bus.emit('languageChange', key)
}
</script>

<style lang="scss" scoped>
.header {
    width: 100%;
    height: 60px;
    padding: 0 20px 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba($color: #18a058, $alpha: 0.4);

    .header-right {
        display: flex;
        gap: 20px;

        .language {
            display: flex;
            align-items: center;
        }

        .user {
            text-align: center;
            width: 100px;
        }
    }
}
</style>