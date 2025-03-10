import Icons from 'unplugin-icons/vite';
import * as vite from 'vite';

export default function createIcons(): any {
  return Icons({
    compiler: 'vue3', // 指定编译器
    autoInstall: true, // 自动安装
  });
}
