// store命名
import { StoreName } from '@store/store-name';
import { defineStore } from 'pinia';

// 用户模块
export const useSystemConfigStore = defineStore(StoreName.SYSTEMCONFIG, {
  state: (): SystemConfig => ({
    sidebar: {
      collapse: false,
    },
  }),
  actions: {},
  persist: {
    storage: localStorage,
  },
});
