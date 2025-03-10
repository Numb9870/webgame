import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
export default function createI18n(): any {
  return VueI18nPlugin({
    // 指定语言文件的位置
    include: 'src/locales/**.json', // 匹配语言文件的路径
    runtimeOnly: true, // 仅包含运行时需要的代码
  });
}
