// vite开发服务器选项
// 导出一个默认的函数serverInit，用于初始化服务器配置
// 参数env是一个键值对的记录，其中键和值都是字符串
// 这个函数通过读取环境变量来配置服务器
export default function serverInit(env: Record<string, string>) {
  // 返回一个对象，包含服务器的配置
  return {
    // 开发服务器的主机名，从环境变量中读取
    host: env.VITE_DEV_HOST,
    // 开发服务器的端口，从环境变量中读取并转换为数字
    port: Number(env.VITE_DEV_PORT),
    // 是否在启动服务器时自动打开浏览器，这里设置为true
    open: true,
    // 代理设置，用于开发时解决跨域问题
    // [`${env.VITE_APP_BASE_API}`]是一个动态键名，表示所有以VITE_APP_BASE_API开头的请求都会被代理
    // target指定实际请求的目标服务器地址
    // changeOrigin设置为true，表示允许改变域名，解决跨域问题
    // rewrite是一个函数，用于重写请求路径，去除VITE_APP_BASE_API这部分
    proxy: {
      [`${env.VITE_DEV_BASE_API}`]: {
        target: env.VITE_DEV_SERVER_URL,
        changeOrigin: true,
        rewrite: (path: string) =>
          path.replace(new RegExp('^/' + env.VITE_DEV_BASE_API), ''),
      },
    },
  };
}
