import { createI18n } from 'vue-i18n';
import zhCn from './zh-CN.json';
import en from './en-US.json';

// 整合语言包
export const messages = {
  'zh-CN': zhCn,
  'en-US': en,
};

export function setupI18n(app: any) {
  // 创建i18n实例
  const i18n = createI18n({
    locale: 'zh-CN', // 默认语言
    fallbackLocale: 'zh-CN', // 回退语言
    messages, // 语言包
  });

  app.use(i18n);
}
