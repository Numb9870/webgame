import { ViteAliases } from 'vite-aliases';

export default function creatResolve() {
  return ViteAliases({
    prefix: '@',
  });
}
