// node
import path from 'node:path';

// vite-plugin
import vue from '@vitejs/plugin-vue';
import VueDevTools from 'vite-plugin-vue-devtools';

// unplugin-auto-import
import AutoImport from 'unplugin-auto-import/vite';

// unplugin-vue-components
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';

// vite.config.ts
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  // 配置路径别名
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
      '~': path.resolve(process.cwd()),
    },
  },
  // 插件配置
  plugins: [
    // 添加 vue 支持
    vue(),
    // 添加vue-devtools
    VueDevTools(),
    // 自动导入
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        {
          'naive-ui': [
            'useDialog',
            'useMessage',
            'useNotification',
            'useLoadingBar',
          ],
        },
      ],
    }),
    // 组件自动按需引入
    Components({
      resolvers: [NaiveUiResolver()],
    }),
  ],
});
