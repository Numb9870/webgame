import App from './App.vue';
import { createApp } from 'vue';
import { setupStore } from '@store/index';
import { setupI18n } from '@/locales/i18n';
import { setupRouter } from '@/router/index';
import { setupMitt } from '@/utils/mitt';

// 引入全局样式 和 iconfont 图标
import './style.css';
import '@/assets/js/iconfont.js';

// 创建Vue应用
const app = createApp(App);

// 初始化store
setupStore(app);
// 初始化i18n
setupI18n(app);
// 初始化路由
setupRouter(app);
// 初始化mitt
const Mit = setupMitt(app);

// 用于扩充组件实例类型以支持自定义全局属性。
declare module 'vue' {
  export interface ComponentCustomProperties {
    $Bus: typeof Mit;
  }
}

// 挂载Vue应用
app.mount('#app');
