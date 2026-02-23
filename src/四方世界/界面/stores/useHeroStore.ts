import { defineStore } from 'pinia';
import { ref } from 'vue';
import { MvuBridge, _ } from '../utils/st-bridge';

export const useHeroStore = defineStore('hero', () => {
  const heroData = ref<any>({});
  const isLoaded = ref(false);

  const syncFromLatest = async () => {
    if (!MvuBridge.getMvuData) return;
    try {
      const vars = MvuBridge.getMvuData({ type: 'message', message_id: 'latest' });
      heroData.value = _.get(vars, 'stat_data.主角', {});
      isLoaded.value = true;
    } catch (e) {
      console.error('[HeroStore] 初始同步失败', e);
    }
  };

  const listenToMvu = () => {
    const eventName = MvuBridge.events.VARIABLE_UPDATE_ENDED;
    if (!eventName || !MvuBridge.instance) return;
    (window as any).eventOn?.(eventName, (newVars: any) => {
      heroData.value = _.cloneDeep(_.get(newVars, 'stat_data.主角', {}));
    });
  };

  const init = async () => {
    await syncFromLatest();
    listenToMvu();
  };

  return { heroData, isLoaded, init };
});