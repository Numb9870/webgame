import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';

import createAutoImport from './auto-import';
import createComponents from './components';
import creatResolve from './aliases';

/**
 * 初始化插件列表
 * 本函数负责构建和返回Vite项目中使用的一系列插件
 */
export default function pluginInit() {
  // vite插件，用于支持在Vite中Vue的开发
  const vitePlugins = [
    vue(),
    tailwindcss(),
    Icons({
      compiler: 'vue3', // 指定编译器
      autoInstall: true, // 自动安装
    }),
  ];
  // 自动导入API，减少手动导入的繁琐
  vitePlugins.push(createAutoImport());
  // 自动导入组件API，提升开发效率
  vitePlugins.push(createComponents());
  // 自动生成别名
  vitePlugins.push(creatResolve());
  return vitePlugins;
}
