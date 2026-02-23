<script setup lang="ts">
import { computed } from 'vue';
import { useCharacterStore } from '../store';

const store = useCharacterStore();
const data = computed(() => store.statData);

const attributes = ['力量', '敏捷', '感知', '知识', '魅力', '魔力', '信仰力'];
</script>

<template>
  <div class="skills-panel animate-fade-in space-y-6">
      
      <!-- 职业与等级 -->
      <section class="class-section p-4 border border-ancient-gold/20 bg-white/5 rounded flex justify-between items-center bg-gradient-to-r from-ancient-gold/10 to-transparent">
          <div>
              <h3 class="text-lg font-bold text-ancient-gold font-serif drop-shadow">{{ data?.主角?.公会信息?.所属公会 || '流浪者' }}</h3>
              <p class="text-sm text-gray-300 mt-1">
                  阶级 <span class="text-white font-bold">{{ data?.主角?.公会信息?.公会阶级 || '白瓷' }}</span> | 贡献 <span class="text-ancient-gold">{{ data?.主角?.公会信息?.当前贡献度 || 0 }}</span>
              </p>
          </div>
          <div class="w-12 h-12 bg-black/50 border-2 border-ancient-gold rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(197,157,95,0.3)]">
              <i class="fa-solid fa-medal text-xl text-ancient-gold"></i>
          </div>
      </section>

      <!-- 历练进度 -->
      <section class="progress-section p-4 border border-white/10 bg-black/30 rounded">
          <h3 class="text-sm font-bold text-gray-300 mb-3 flex items-center border-b border-gray-700 pb-1">
             <i class="fa-solid fa-seedling mr-2 text-forest-green"></i>历练进度
          </h3>
          <div class="space-y-3">
              <div v-for="attr in attributes" :key="attr" class="flex flex-col">
                  <div class="flex justify-between text-xs mb-1">
                      <span class="text-gray-400">{{ attr }}</span>
                      <span class="text-ancient-gold">{{ data?.主角?.历练进度?.[attr] || 0 }}%</span>
                  </div>
                  <div class="w-full bg-gray-800 rounded-full h-1.5 shadow-inner">
                      <div class="bg-gradient-to-r from-forest-green to-green-400 h-1.5 rounded-full transition-all duration-500 shadow-[0_0_5px_rgba(46,139,87,0.8)]" 
                           :style="{ width: `${data?.主角?.历练进度?.[attr] || 0}%` }"></div>
                  </div>
              </div>
          </div>
      </section>

      <!-- 技能树 -->
      <section class="skill-tree-section p-4 border border-ancient-gold/20 bg-white/5 rounded relative">
          <div class="absolute top-2 right-2 text-xs text-gray-400 bg-black/60 px-2 py-1 rounded border border-gray-700">
              技能点: <span class="text-ancient-gold font-bold">{{ data?.主角?.技能点 || 0 }}</span>
          </div>
          <h3 class="text-sm font-bold text-ancient-gold mb-4 flex items-center border-b border-ancient-gold/20 pb-1">
             <i class="fa-solid fa-book-journal-whills mr-2 text-arcane-blue"></i>已学技艺
          </h3>
          
          <div v-if="Object.keys(data?.主角?.技能列表 || {}).length === 0" class="text-center text-sm italic text-gray-500 py-4">
              暂无掌握任何技艺...
          </div>
          
          <div class="space-y-3">
              <div v-for="(skill, name) in data?.主角?.技能列表" :key="name" 
                   class="skill-card p-3 border border-gray-600 rounded bg-black/40 hover:border-arcane-blue/50 transition-colors">
                  <div class="flex justify-between items-start mb-1">
                      <h4 class="text-sm font-bold text-blue-200 flex items-center">
                          <i class="fa-solid fa-sparkles text-xs mr-1 text-arcane-blue"></i> {{ name }}
                      </h4>
                      <span class="text-[10px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-300 flex items-center border border-gray-700">
                          {{ (skill as any)?.level || '初级' }} ({{ (skill as any)?.熟练度 || 0 }}%)
                      </span>
                  </div>
                  <p class="text-[11px] text-gray-400 mt-1 italic leading-tight">{{ (skill as any)?.description || '暂无描述' }}</p>
                  
                  <!-- 熟练度条 -->
                  <div class="w-full bg-gray-900 rounded-full h-1 mt-2">
                      <div class="bg-arcane-blue h-1 rounded-full" :style="{ width: `${(skill as any)?.熟练度 || 0}%` }"></div>
                  </div>
              </div>
          </div>
      </section>

  </div>
</template>

<style scoped>
.text-ancient-gold { color: var(--color-ancient-gold, #c59d5f); }
.border-ancient-gold { border-color: var(--color-ancient-gold, #c59d5f); }

.text-forest-green { color: var(--color-forest-green, #2e8b57); }
.bg-forest-green { background-color: var(--color-forest-green, #2e8b57); }

.text-arcane-blue { color: var(--color-arcane-blue, #483d8b); }
.bg-arcane-blue { background-color: var(--color-arcane-blue, #483d8b); }
.border-arcane-blue\/50 { border-color: rgba(72, 61, 139, 0.5); }
</style>
