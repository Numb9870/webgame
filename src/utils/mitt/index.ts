import mitt from 'mitt';

export function setupMitt(app: any) {
  // 挂载mitt
  const Mit = mitt();
  // 注册全局属性
  app.config.globalProperties.$Bus = Mit;
  return Mit;
}
