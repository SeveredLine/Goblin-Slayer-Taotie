<template>
  <div class="group relative flex h-12 w-12 cursor-pointer items-center justify-center rounded border border-[#5a4a3a] bg-[#1a1614] shadow-inner transition-colors hover:border-[#c59d5f]">
    <!-- 如果没有装备，显示底图图标 -->
    <i v-if="!item" :class="`fa-solid ${icon} text-xl text-[#3a302a]`"></i>
    
    <!-- 如果有装备，显示图片或首字 -->
    <div v-else class="flex h-full w-full items-center justify-center bg-[#2c2520] p-1 text-center text-xs leading-tight font-bold text-[#e0d6c8]">
      {{ itemName }}
    </div>

    <!-- 悬浮提示 (Tooltip) -->
    <div v-if="item" class="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-48 -translate-x-1/2 rounded border border-[#c59d5f] bg-black/90 p-2 text-left text-xs opacity-0 transition-opacity group-hover:opacity-100">
      <div class="mb-1 border-b border-gray-700 pb-1 font-bold text-[#c59d5f]">{{ itemName }}</div>
      <div class="text-gray-400">{{ itemDesc }}</div>
      <div v-if="item.tier" class="mt-1 text-[10px] text-blue-400 uppercase">{{ item.tier }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  icon: string;
  item: any; // 可能是字符串或对象
}>();

const itemName = computed(() => {
  if (!props.item) return '';
  return typeof props.item === 'string' ? props.item : props.item.name || props.item.名称;
});

const itemDesc = computed(() => {
  if (!props.item || typeof props.item === 'string') return '无详细信息';
  return props.item.description || props.item.描述 || '';
});
</script>