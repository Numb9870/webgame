import { defineConfig, loadEnv } from 'vite';
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
  };
});
