// 计算时长
export function calDuration(startTime: number) {
  const time = Math.floor((Date.now() - startTime) / 1000);
  // 换算成时分秒
  return `${Math.floor(time / 3600)}:${Math.floor((time % 3600) / 60)}:${
    time % 60
  }`;
}
