import { createApp } from 'vue';
import App from './App.vue';
import { setupRouter } from '@/router/index.ts';
import './style.css';

// 通用字体
import 'vfonts/Lato.css';
// 等宽字体
import 'vfonts/FiraCode.css';

// 创建Vue应用
const app = createApp(App);

// 初始化路由
setupRouter(app);

// 挂载Vue应用
app.mount('#app');
