<template>
  <div class="space-y-4">
    <!-- 财富 -->
    <div class="flex justify-between rounded-sm border border-[#c59d5f]/30 bg-black/40 p-3">
      <span class="font-bold text-yellow-500">🥇 {{ money.金币 || 0 }}</span>
      <span class="font-bold text-gray-300">🥈 {{ money.银币 || 0 }}</span>
      <span class="font-bold text-orange-400">🥉 {{ money.铜币 || 0 }}</span>
    </div>

    <!-- 背包分类 -->
    <div v-for="(items, cat) in validCategories" :key="cat">
      <h3 class="mb-2 border-b border-[#c59d5f]/30 pb-1 text-sm text-[#c59d5f]">{{ cat }}</h3>
      <div class="grid grid-cols-1 gap-2">
        <div v-for="(item, name) in items" :key="name" class="flex items-center justify-between border border-transparent bg-black/20 p-2 text-sm hover:border-[#c59d5f]/30">
          <span class="truncate pr-2">{{ name }}</span>
          <span class="text-gray-400">x{{ item.quantity || 1 }}</span>
        </div>
        <div v-if="Object.keys(items || {}).length === 0" class="text-xs text-gray-600 italic">空空如也</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useHeroStore } from '../../stores/useHeroStore';
const store = useHeroStore();

const bag = computed(() => store.heroData?.背包 || {});
const money = computed(() => bag.value.金钱 || {});

// 过滤掉金钱，只留物品分类
const validCategories = computed(() => {
  const result: Record<string, any> = {};
  ['消耗品', '材料', '杂物', '武器', '防具', '饰品'].forEach(cat => {
    if (bag.value[cat]) result[cat] = bag.value[cat];
  });
  return result;
});
</script>