import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCharacterStore = defineStore('character', () => {
    // 基础数据保存处
    const statData = ref<any>({});
    
    // 获取数据的辅助函数
    const fetchData = () => {
        // 获取当前楼层消息所在的 MVU 变量
        const variables = Mvu.getMvuData({ type: 'message', message_id: getCurrentMessageId() });
        statData.value = _.cloneDeep(_.get(variables, 'stat_data', {}));
    };

    // 初始获取
    fetchData();

    // 监听 Mvu 的变量更新完成事件来刷新本数据
    eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, () => {
        fetchData();
    });

    return {
        statData
    };
});
