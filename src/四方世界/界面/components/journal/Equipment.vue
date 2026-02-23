<template>
  <div class="space-y-4">
    <div v-for="cat in ['武器', '防具', '饰品']" :key="cat">
      <h3 class="text-[#c59d5f] border-b border-[#c59d5f]/30 mb-2 pb-1 text-sm">{{ cat }}</h3>
      <div class="space-y-2">
        <div v-for="(item, slot) in (equipData[cat] || {})" :key="slot" class="bg-[#1a1a1d] border border-[#c59d5f]/40 p-2 flex flex-col">
          <span class="text-xs text-[#c59d5f]/60 mb-1">[{{ slot }}]</span>
          <span class="font-bold">{{ typeof item === 'string' ? item : (item.name || item.名称 || '未知') }}</span>
        </div>
        <div v-if="Object.keys(equipData[cat] || {}).length === 0" class="text-xs text-gray-600 italic">无装备</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useHeroStore } from '../../stores/useHeroStore';
const store = useHeroStore();
const equipData = computed(() => store.heroData?.装备 || {});
</script>