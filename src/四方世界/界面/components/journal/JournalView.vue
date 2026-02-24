<template>
  <div class="flex h-full flex-col bg-[#1e1b18]">
    <!-- Tab 导航栏 (类似书签) -->
    <div class="flex border-b border-[#4a3e35] bg-[#121010]">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        class="relative flex-1 border-r border-[#2c2520] py-3 text-sm font-bold tracking-wider transition-colors hover:bg-[#2c2520]"
        :class="currentTab === tab.id ? 'bg-[#241f1c] text-[#c59d5f]' : 'text-[#6b5b4b]'"
        @click="currentTab = tab.id"
      >
        {{ tab.name }}
        <!-- 激活时的底部高亮条 -->
        <div v-if="currentTab === tab.id" class="absolute bottom-0 left-0 h-[2px] w-full bg-[#c59d5f] shadow-[0_0_10px_#c59d5f]"></div>
      </button>
    </div>

    <!-- 内容区：羊皮纸风格 -->
    <div class="relative flex-1 overflow-hidden p-1">
      <!-- 背景纹理 -->
      <div class="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/parchment.png')] opacity-10"></div>
      
      <div class="custom-scrollbar h-full overflow-y-auto p-4">
        <!-- 动态组件渲染 + GSAP 过渡动画 -->
        <Transition mode="out-in" @enter="onEnter" @leave="onLeave">
          <component :is="activeComponent" :key="currentTab" />
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import { computed, ref } from 'vue';
import HeroStats from './HeroStats.vue';
import Inventory from './Inventory.vue';
// 暂时用 Inventory 占位其他 Tab
const currentTab = ref('character');

const tabs = [
  { id: 'character', name: 'CHARACTER' },
  { id: 'inventory', name: 'INVENTORY' },
  { id: 'skills', name: 'SKILLS' },
  { id: 'journal', name: 'JOURNAL' }
];

const activeComponent = computed(() => {
  switch (currentTab.value) {
    case 'character': return HeroStats;
    case 'inventory': return Inventory;
    default: return Inventory;
  }
});

// GSAP 进入动画
const onEnter = (el: Element, done: () => void) => {
  gsap.fromTo(el, 
    { opacity: 0, x: -10, filter: 'blur(4px)' }, 
    { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.3, ease: 'power2.out', onComplete: done }
  );
};

// GSAP 离开动画
const onLeave = (el: Element, done: () => void) => {
  gsap.to(el, { opacity: 0, x: 10, filter: 'blur(4px)', duration: 0.2, ease: 'power2.in', onComplete: done });
};
</script>