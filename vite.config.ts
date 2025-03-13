import { defineConfig, loadEnv } from 'vite';
import { setup } from '@css-render/vue3-ssr';
import pluginInit from './vite/plugins';
import serverInit from './vite/server';

// vite配置
export default defineConfig(({ command, mode }) => {
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), '');
  // console.log('🚀 ~ defineConfig ~ command, mode, env:', command, mode, env);
  console.log('🚀 ~ defineConfig ~ command, mode:', command, mode);
  return {
    base: env.VITE_APP_BASE_URL,
    plugins: pluginInit(),
    server: serverInit(env),
    ssr: {
      noExternal: ['naive-ui', 'vueuc', 'date-fns'],
    },
    ssgOptions: {
      async onBeforePageRender(_, __, appCtx) {
        const { collect } = setup(appCtx.app);
        (appCtx as any).__collectStyle = collect;
        return undefined;
      },
      async onPageRendered(_, renderedHTML, appCtx) {
        return renderedHTML.replace(
          /<\/head>/,
          `${(appCtx as any).__collectStyle()}</head>`
        );
      },
    },
  };
});
