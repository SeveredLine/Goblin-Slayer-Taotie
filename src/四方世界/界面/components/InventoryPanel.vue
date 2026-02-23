<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCharacterStore } from '../store';

const store = useCharacterStore();
const data = computed(() => store.statData);

const inventoryCats = ['武器', '防具', '饰品', '消耗品', '材料', '杂物'];
const activeCat = ref('消耗品');

const getItems = (cat: string) => {
    return data.value?.主角?.背包?.[cat] || {};
};

const getMoney = (type: string) => {
    return data.value?.主角?.背包?.金钱?.[type] || 0;
};
</script>

<template>
  <div class="inventory-panel animate-fade-in flex flex-col h-full">
      
      <!-- 货币栏 -->
      <section class="money-section mb-4 flex justify-around p-3 border border-ancient-gold/30 bg-black/40 rounded shadow-inner">
          <div class="flex items-center" title="金币">
              <i class="fa-solid fa-coins text-yellow-500 mr-2 drop-shadow-md"></i>
              <span class="font-bold font-serif text-gray-200">{{ getMoney('金币') }}</span>
          </div>
          <div class="flex items-center" title="银币">
              <i class="fa-solid fa-coins text-gray-400 mr-2 drop-shadow-md"></i>
              <span class="font-bold font-serif text-gray-200">{{ getMoney('银币') }}</span>
          </div>
          <div class="flex items-center" title="铜币">
              <i class="fa-solid fa-coins text-amber-700 mr-2 drop-shadow-md"></i>
              <span class="font-bold font-serif text-gray-200">{{ getMoney('铜币') }}</span>
          </div>
      </section>

      <!-- 分类筛选器 -->
      <section class="filter-section flex flex-wrap gap-1 mb-4">
          <button v-for="cat in inventoryCats" :key="cat"
             @click="activeCat = cat"
             class="px-3 py-1 text-xs border rounded transition-colors"
             :class="activeCat === cat ? 'bg-ancient-gold/30 border-ancient-gold text-ancient-gold shadow-[0_0_8px_rgba(197,157,95,0.4)]' : 'bg-black/30 border-gray-600 text-gray-400 hover:border-gray-400'">
             {{ cat }}
          </button>
      </section>

      <!-- 物品网格 -->
      <section class="items-grid flex-1 overflow-y-auto custom-scrollbar border border-white/5 p-2 rounded bg-black/20">
          <div v-if="Object.keys(getItems(activeCat)).length === 0" class="flex items-center justify-center h-full text-gray-500 text-sm font-serif italic">
              行囊空空如也...
          </div>
          <div class="grid grid-cols-1 gap-2">
              <div v-for="(item, name) in getItems(activeCat)" :key="name" 
                   class="item-card flex items-start p-2 border border-gray-700 rounded bg-gradient-to-r from-black/60 to-transparent hover:border-ancient-gold/50 transition-colors cursor-pointer group">
                  <div class="item-icon w-10 h-10 shrink-0 bg-gray-800 rounded border border-gray-600 mr-3 flex items-center justify-center shadow-inner group-hover:border-ancient-gold text-gray-400">
                      <!-- 此处可根据 item.tier 或 type 换图标 -->
                      <i class="fa-solid fa-ring" v-if="activeCat === '饰品'"></i>
                      <i class="fa-solid fa-shield" v-else-if="activeCat === '防具'"></i>
                      <i class="fa-solid fa-khanda" v-else-if="activeCat === '武器'"></i>
                      <i class="fa-solid fa-flask" v-else-if="activeCat === '消耗品'"></i>
                      <i class="fa-solid fa-box-open" v-else></i>
                  </div>
                  <div class="item-info flex-1 min-w-0">
                      <div class="flex justify-between items-start">
                          <h4 class="text-sm font-bold text-gray-200 truncate group-hover:text-ancient-gold">{{ (item as any)?.name || name }}</h4>
                          <span class="text-xs text-gray-400 ml-2 shrink-0">x{{ (item as any)?.quantity || 1 }}</span>
                      </div>
                      <p class="text-[10px] text-gray-500 mt-1 line-clamp-2 italic">{{ (item as any)?.description || '暂无描述' }}</p>
                  </div>
              </div>
          </div>
      </section>

  </div>
</template>

<style scoped>
.text-ancient-gold { color: var(--color-ancient-gold, #c59d5f); }
.border-ancient-gold { border-color: var(--color-ancient-gold, #c59d5f); }
.bg-ancient-gold\/30 { background-color: rgba(197, 157, 95, 0.3); }

.item-card {
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(197, 157, 95, 0.5); border-radius: 2px; }
</style>
