// store命名
import { StoreName } from '@store/store-name';

// 用户模块
export const useDictionaryStore = defineStore(StoreName.DICTIONARY, {
    state: (): {
        dictionary: Dictionary[];
    } => ({
        dictionary: [],
    }),
    actions: {
    }
    persist: {
        storage: sessionStorage,
    },
});
