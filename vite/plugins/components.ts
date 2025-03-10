import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';

// 自动导入组件API
/**
 * 创建组件
 *
 * 本函数用于配置和自动导入项目中使用的组件
 * 主要通过指定组件位置和组件库解析器来实现自动导入功能
 */
export default function createComponents() {
  return Components({
    // 指定自定义组件位置，默认是src/components
    dirs: ['src/components'],
    // 配置需要自动导入的组件库
    resolvers: [NaiveUiResolver()],
  });
}
