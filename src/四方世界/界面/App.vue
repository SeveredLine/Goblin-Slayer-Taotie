<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import CharacterPanel from './components/CharacterPanel.vue';
import InventoryPanel from './components/InventoryPanel.vue';
import SkillsPanel from './components/SkillsPanel.vue';
import SocialPanel from './components/SocialPanel.vue';
import { useCharacterStore } from './store';

const store = useCharacterStore();
const data = computed(() => store.statData);

const currentTab = ref('character');

const tabs = [
  { id: 'character', name: '角色' },
  { id: 'inventory', name: '行囊' },
  { id: 'skills', name: '技艺' },
  { id: 'social', name: '羁绊' },
  { id: 'map', name: '地图' }
];

onMounted(() => {
    console.log("App mounted. Data:", data.value);
});
</script>

<template>
  <div class="dnd-interface-container shadow-2xl relative flex flex-col h-full w-full pointer-events-auto overflow-hidden">
      <!-- 顶部的世界之窗 -->
      <header class="world-header p-4 border-b-2 flex flex-col justify-center shrink-0">
          <div class="flex items-center justify-between">
             <h2 class="text-xl font-bold font-serif location-text">{{ data?.主角?.所在地 || '未知的迷雾区域' }}</h2>
             <div class="time-indicator text-sm flex items-center">
                 <i class="fa-solid fa-clock mr-1 text-ancient-gold"></i>
                 <span>{{ data?.世界?.当前时间 || '时间静止' }}</span>
             </div>
          </div>
          <p class="text-xs text-gray-400 mt-1 italic">{{ data?.世界?.所在地概况 || '四周充满了神秘的气息。' }}</p>
      </header>
      
      <!-- 选项卡导航 -->
      <nav class="flex border-b font-serif shrink-0 tab-nav">
          <button 
              v-for="tab in tabs" 
              :key="tab.id"
              @click="currentTab = tab.id" 
              class="flex-1 py-2 text-sm text-center transition-colors duration-200"
              :class="currentTab === tab.id ? 'active-tab text-obsidian bg-ancient-gold font-bold' : 'text-gray-300 hover:bg-white/5'"
          >
              {{ tab.name }}
          </button>
      </nav>
      
      <!-- 内容区 -->
      <main class="flex-1 overflow-y-auto p-4 custom-scrollbar">
         <CharacterPanel v-if="currentTab === 'character'" />
         <InventoryPanel v-if="currentTab === 'inventory'" />
         <SkillsPanel v-if="currentTab === 'skills'" />
         <SocialPanel v-if="currentTab === 'social'" />
         <MapPanel v-if="currentTab === 'map'" />
      </main>
  </div>
</template>

<style scoped>
.dnd-interface-container {
    background-color: var(--color-obsidian, #1a1a1d);
    color: var(--color-parchment, #f5f5dc);
    /* 纸张纹理蒙版 */
    background-image: linear-gradient(rgba(26, 26, 29, 0.95), rgba(26, 26, 29, 0.95)), url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+');
    font-family: 'Noto Serif SC', serif, sans-serif;
    border-left: 2px solid var(--color-ancient-gold, #c59d5f);
}

.world-header {
    border-color: rgba(197, 157, 95, 0.3);
    background: linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 100%);
}

.location-text {
    text-shadow: 0 2px 4px rgba(0,0,0,0.8);
    color: var(--color-ancient-gold, #c59d5f);
}

.tab-nav {
    border-color: var(--color-ancient-gold, #c59d5f);
}

.active-tab {
    background: linear-gradient(180deg, var(--color-ancient-gold) 0%, #a37c44 100%);
    box-shadow: inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.4);
    text-shadow: 0 1px 1px rgba(255,255,255,0.3);
}

.text-ancient-gold {
    color: var(--color-ancient-gold, #c59d5f);
}
.bg-ancient-gold {
    background-color: var(--color-ancient-gold, #c59d5f);
}
.text-obsidian {
    color: var(--color-obsidian, #1a1a1d);
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0,0,0,0.2);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: var(--color-ancient-gold, #c59d5f);
    border-radius: 3px;
}

.animate-fade-in {
    animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
