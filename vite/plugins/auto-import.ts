import AutoImport from 'unplugin-auto-import/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';

// 自动引入API
/**
 * 创建自动导入配置的函数
 *
 * 该函数用于配置和返回一个自动导入的实例，以便在项目中自动导入常用的库和组件
 * 目前配置了自动导入 Vue、Vue Router 和 Pinia 这几个库
 * 同时，通过 ElementPlusResolver 解析器，该函数还支持自动导入 Element Plus 组件
 *
 */
export default function createAutoImport() {
    return AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        resolvers: [NaiveUiResolver()],
    });
}
