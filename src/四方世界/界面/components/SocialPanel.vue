<script setup lang="ts">
import { computed } from 'vue';
import { useCharacterStore } from '../store';

const store = useCharacterStore();
const relationships = computed(() => store.statData?.关系列表 || {});
const quests = computed(() => store.statData?.主角?.任务日志 || { 进行中: {}, 已完成: {} });

const hasRelations = computed(() => Object.keys(relationships.value).length > 0);
const hasActiveQuests = computed(() => Object.keys(quests.value?.进行中 || {}).length > 0);
</script>

<template>
  <div class="social-panel animate-fade-in space-y-6">
      
      <!-- 任务日志卷轴 -->
      <section class="quests-section p-4 border border-ancient-gold/30 bg-[#252219] rounded shadow-inner relative overflow-hidden">
          <div class="absolute inset-0 opacity-10 pointer-events-none" style="background-image: repeating-linear-gradient(0deg, transparent, transparent 19px, #000 20px);"></div>
          
          <h3 class="text-sm font-bold text-[#d4af37] mb-4 flex items-center border-b border-[#d4af37]/30 pb-2 drop-shadow">
             <i class="fa-solid fa-scroll mr-2"></i>任务手账
          </h3>
          
          <div v-if="!hasActiveQuests" class="text-sm text-gray-500 italic text-center py-2 font-serif">
              当前没有进行中的任务。
          </div>
          
          <div class="space-y-4 relative z-10" v-else>
              <div v-for="(quest, name) in quests?.进行中" :key="name" class="quest-item pl-4 border-l-2 border-[#8b0000]">
                  <h4 class="text-sm font-bold text-gray-200">{{ name }}</h4>
                  <p class="text-xs text-gray-400 mt-1 italic">{{ (quest as any)?.概况 || '不明' }}</p>
              </div>
          </div>
      </section>

      <!-- 羁绊列表 -->
      <section class="relationships-section p-4 border border-white/10 bg-black/30 rounded">
          <h3 class="text-sm font-bold text-gray-300 mb-4 flex items-center border-b border-gray-700 pb-1">
             <i class="fa-solid fa-users mr-2 text-pink-700"></i>人际羁绊
          </h3>

          <div v-if="!hasRelations" class="text-sm text-gray-500 italic text-center py-2">
              形单影只，尚未结识任何人。
          </div>
          
          <div class="grid grid-cols-1 gap-3" v-else>
              <div v-for="(npc, name) in relationships" :key="name" 
                   class="relation-card flex items-stretch border border-gray-700 rounded bg-gradient-to-r from-black to-black/50 hover:border-gray-500 transition-colors overflow-hidden">
                  
                  <div class="w-12 shrink-0 bg-gray-800 flex items-center justify-center border-r border-gray-700 relative">
                     <i class="fa-solid fa-user text-gray-500 text-xl"></i>
                     <div v-if="(npc as any)?.在场" class="absolute bottom-1 right-1 w-2 h-2 bg-green-500 rounded-full border border-black" title="在此地"></div>
                  </div>
                  
                  <div class="flex-1 p-2 min-w-0">
                      <div class="flex justify-between items-baseline mb-1">
                          <h4 class="text-sm font-bold text-gray-200 truncate">{{ name }}</h4>
                          <span class="text-[10px] text-gray-500 shrink-0 ml-2 border border-gray-600 px-1 rounded">{{ (npc as any)?.层级 || '白瓷' }}</span>
                      </div>
                      <p class="text-[10px] text-gray-400 truncate mb-2">{{ (npc as any)?.身份背景 || '来历不明' }}</p>
                      
                      <div class="flex items-center space-x-3 mt-1">
                          <!-- 好感度 -->
                          <div class="flex items-center text-[10px] text-gray-400 group cursor-help" title="好感度">
                              <i class="fa-solid fa-heart mr-1 scale-90 group-hover:text-pink-500 transition-colors"></i>
                              <span>{{ typeof (npc as any)?.好感度 === 'number' ? (npc as any)?.好感度 : '0' }}</span>
                          </div>
                          <!-- 信任度 -->
                          <div class="flex items-center text-[10px] text-gray-400 group cursor-help" title="信任度">
                              <i class="fa-solid fa-handshake mr-1 scale-90 group-hover:text-blue-400 transition-colors"></i>
                              <span>{{ typeof (npc as any)?.信任度 === 'number' ? (npc as any)?.信任度 : '0' }}</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

  </div>
</template>

<style scoped>
.text-ancient-gold { color: var(--color-ancient-gold, #c59d5f); }

.quests-section {
    /* 特殊手账风格 */
    box-shadow: inset 0 0 20px rgba(0,0,0,0.8), 0 4px 6px rgba(0,0,0,0.3);
}

.relation-card {
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
</style>
