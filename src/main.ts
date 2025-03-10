import { createApp } from 'vue';
import App from './App.vue';
import { setupRouter } from '@/router/index.ts';
import './style.css';

// 引入iconfont 图标
import '@/assets/js/iconfont.js';

// 创建Vue应用
const app = createApp(App);

// 初始化路由
setupRouter(app);

// 挂载Vue应用
app.mount('#app');
