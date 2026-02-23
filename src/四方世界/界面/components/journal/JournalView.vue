<template>
  <aside class="relative flex flex-col">
    <!-- 纸质纹理覆盖层 -->
    <div class="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://www.transparenttextures.com/patterns/old-wall.png')]"></div>

    <header class="h-14 flex border-b border-[#c59d5f]/30">
      <button 
        v-for="tab in tabs" :key="tab.id"
        @click="currentTab = tab.id"
        :class="['flex-1 font-bold tracking-wider transition-colors text-sm', 
                 currentTab === tab.id ? 'bg-[#c59d5f]/20 text-[#c59d5f] border-b-2 border-[#c59d5f]' : 'text-gray-500 hover:text-[#c59d5f]/70']"
      >
        {{ tab.name }}
      </button>
    </header>

    <div class="flex-1 overflow-y-auto p-5 custom-scrollbar relative z-10">
      <div v-if="!heroStore.isLoaded" class="text-center text-gray-500 mt-10">研读羊皮纸...</div>
      <template v-else>
        <HeroStats v-show="currentTab === 'hero'" />
        <Inventory v-show="currentTab === 'inv'" />
        <Equipment v-show="currentTab === 'equip'" />
        <SkillTree v-show="currentTab === 'skills'" />
      </template>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useHeroStore } from '../../stores/useHeroStore';
import HeroStats from './HeroStats.vue';
import Inventory from './Inventory.vue';
import Equipment from './Equipment.vue';
import SkillTree from './SkillTree.vue';

const heroStore = useHeroStore();
const currentTab = ref('hero');
const tabs = [
  { id: 'hero', name: '属性' },
  { id: 'equip', name: '武装' },
  { id: 'inv', name: '行囊' },
  { id: 'skills', name: '技艺' }
];
</script>