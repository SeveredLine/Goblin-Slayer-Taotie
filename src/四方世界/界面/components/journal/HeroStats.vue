<template>
  <div class="space-y-6">
    <!-- 状态条 -->
    <div class="space-y-3">
      <div class="relative h-6 bg-black/60 border border-[#c59d5f]/40 rounded-sm overflow-hidden">
        <div class="absolute h-full bg-red-800/80 transition-all duration-500" :style="{ width: percent(hero.生命值) + '%' }"></div>
        <div class="absolute inset-0 flex justify-center items-center text-xs font-bold drop-shadow-md">生命: {{ val(hero.生命值) }} / {{ max(hero.生命值) }}</div>
      </div>
      <div class="relative h-6 bg-black/60 border border-[#c59d5f]/40 rounded-sm overflow-hidden">
        <div class="absolute h-full bg-blue-800/80 transition-all duration-500" :style="{ width: percent(hero.魔力值) + '%' }"></div>
        <div class="absolute inset-0 flex justify-center items-center text-xs font-bold drop-shadow-md">魔力: {{ val(hero.魔力值) }} / {{ max(hero.魔力值) }}</div>
      </div>
      <div class="relative h-6 bg-black/60 border border-[#c59d5f]/40 rounded-sm overflow-hidden">
        <div class="absolute h-full bg-green-800/80 transition-all duration-500" :style="{ width: percent(hero.体力值) + '%' }"></div>
        <div class="absolute inset-0 flex justify-center items-center text-xs font-bold drop-shadow-md">体力: {{ val(hero.体力值) }} / {{ max(hero.体力值) }}</div>
      </div>
    </div>

    <!-- 基础属性 -->
    <div>
      <h3 class="text-[#c59d5f] border-b border-[#c59d5f]/30 mb-3 pb-1">基础能力</h3>
      <div class="grid grid-cols-3 gap-2">
        <div v-for="(v, k) in hero.能力 || {}" :key="k" class="bg-black/30 border border-[#c59d5f]/20 p-2 text-center rounded-sm">
          <div class="text-[#c59d5f]/70 text-xs">{{ k }}</div>
          <div class="text-xl font-bold text-[#f5f5dc]">{{ v }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useHeroStore } from '../../stores/useHeroStore';
const store = useHeroStore();
const hero = computed(() => store.heroData || {});

const val = (obj: any) => Number(obj?.当前值) || 0;
const max = (obj: any) => Number(obj?.最大值) || 1;
const percent = (obj: any) => Math.min(100, Math.max(0, (val(obj) / max(obj)) * 100));
</script>