import * as vite from 'vite';
import createVue from './vue';
import createAutoImport from './auto-import';
import createComponents from './components';
import creatResolve from './aliases';
import createI18n from './i18n';
import createIcons from './icons';
import createTailwindcss from './tailwindcss';

/**
 * 初始化插件列表
 * 本函数负责构建和返回Vite项目中使用的一系列插件
 */
export default function pluginInit() {
  const vitePlugins: vite.Plugin[] = [];
  // vite插件，用于支持在Vite中Vue的开发
  vitePlugins.push(createVue());
  // 自动导入API，减少手动导入的繁琐
  vitePlugins.push(createAutoImport());
  // 自动导入组件API，提升开发效率
  vitePlugins.push(createComponents());
  // 自动生成别名
  vitePlugins.push(creatResolve());
  // 自动导入图标
  vitePlugins.push(createIcons());
  // i18n
  vitePlugins.push(createI18n());
  // tailwindcss
  vitePlugins.push(createTailwindcss());

  return vitePlugins;
}
