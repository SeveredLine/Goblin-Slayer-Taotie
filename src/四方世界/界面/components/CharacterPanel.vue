<script setup lang="ts">
import { computed } from 'vue';
import { useCharacterStore } from '../store';

const store = useCharacterStore();
const data = computed(() => store.statData);

const attributes = ['力量', '敏捷', '感知', '知识', '魅力', '魔力', '信仰力'];
const equipSlots = [
  { id: '主手', cat: '武器' },
  { id: '副手', cat: '武器' },
  { id: '盔甲', cat: '防具' },
  { id: '饰品1', cat: '饰品' },
  { id: '饰品2', cat: '饰品' }
];

const getEquip = (slot: string, cat: string) => {
    const items = data.value?.主角?.装备?.[cat] || {};
    // 简化逻辑：按 key 匹配
    for (const [key, item] of Object.entries(items)) {
        if ((item as any)?.部位 === slot || key.includes(slot)) {
            return item;
        }
    }
    return null;
};
</script>

<template>
  <div class="character-panel animate-fade-in space-y-6">
      
      <!-- 状态槽 (Vitals) -->
      <section class="vitals-section grid grid-cols-1 gap-3">
          <!-- HP -->
          <div class="vital-bar bg-black/40 border border-blood-red/30 rounded p-1 relative h-8 flex items-center">
              <div class="absolute inset-y-0 left-0 bg-blood-red/60 transition-all duration-300 rounded-sm" 
                   :style="{ width: `${(data?.主角?.生命值?.当前值 / data?.主角?.生命值?.最大值) * 100}%` }"></div>
              <div class="relative w-full flex justify-between px-2 text-xs font-bold font-serif text-white drop-shadow-md">
                 <span class="flex items-center"><i class="fa-solid fa-heart mr-2"></i>生命值 (HP)</span>
                 <span>{{ data?.主角?.生命值?.当前值 || 0 }} / {{ data?.主角?.生命值?.最大值 || 0 }}</span>
              </div>
          </div>
          
          <!-- SP -->
          <div class="vital-bar bg-black/40 border border-forest-green/30 rounded p-1 relative h-8 flex items-center">
              <div class="absolute inset-y-0 left-0 bg-forest-green/60 transition-all duration-300 rounded-sm" 
                   :style="{ width: `${(data?.主角?.体力值?.当前值 / data?.主角?.体力值?.最大值) * 100}%` }"></div>
              <div class="relative w-full flex justify-between px-2 text-xs font-bold font-serif text-white drop-shadow-md">
                 <span class="flex items-center"><i class="fa-solid fa-bolt mr-2"></i>体力值 (SP)</span>
                 <span>{{ data?.主角?.体力值?.当前值 || 0 }} / {{ data?.主角?.体力值?.最大值 || 0 }}</span>
              </div>
          </div>

          <!-- MP -->
          <div class="vital-bar bg-black/40 border border-arcane-blue/30 rounded p-1 relative h-8 flex items-center">
              <div class="absolute inset-y-0 left-0 bg-arcane-blue/60 transition-all duration-300 rounded-sm" 
                   :style="{ width: `${(data?.主角?.魔力值?.当前值 / Math.max(1, data?.主角?.魔力值?.最大值)) * 100}%` }"></div>
              <div class="relative w-full flex justify-between px-2 text-xs font-bold font-serif text-white drop-shadow-md">
                 <span class="flex items-center"><i class="fa-solid fa-star mr-2"></i>魔力值 (MP)</span>
                 <span>{{ data?.主角?.魔力值?.当前值 || 0 }} / {{ data?.主角?.魔力值?.最大值 || 0 }}</span>
              </div>
          </div>
      </section>

      <!-- 属性雷达图容器 (此处用列表替代) -->
      <section class="attributes-section p-4 border border-ancient-gold/20 bg-white/5 rounded">
          <h3 class="text-sm font-bold text-ancient-gold mb-3 flex items-center border-b border-ancient-gold/20 pb-1">
             <i class="fa-solid fa-chart-pie mr-2"></i>基础属性
             <span class="ml-auto text-xs font-normal">等级: {{ data?.主角?.经验等级 || 1 }}</span>
          </h3>
          <div class="grid grid-cols-2 gap-2 text-sm">
             <div v-for="attr in attributes" :key="attr" class="flex justify-between items-center bg-black/30 px-2 py-1 rounded">
                 <span class="text-gray-300">{{ attr }}</span>
                 <span class="font-bold text-ancient-gold">{{ data?.主角?.能力?.[attr] || 0 }}</span>
             </div>
             <div class="flex justify-between items-center bg-black/30 px-2 py-1 rounded">
                 <span class="text-gray-300">护甲值</span>
                 <span class="font-bold text-gray-400">{{ data?.主角?.护甲值?.最大值 || 0 }}</span>
             </div>
          </div>
      </section>

      <!-- 装备槽 -->
      <section class="equipment-section p-4 border border-ancient-gold/20 bg-white/5 rounded">
          <h3 class="text-sm font-bold text-ancient-gold mb-3 flex items-center border-b border-ancient-gold/20 pb-1">
             <i class="fa-solid fa-user-shield mr-2"></i>当前装备
          </h3>
          <div class="grid grid-cols-2 gap-2">
              <div v-for="slot in equipSlots" :key="slot.id" class="equip-slot bg-black/40 border border-gray-600/50 p-2 rounded flex flex-col items-center justify-center min-h-[60px] cursor-pointer hover:border-ancient-gold/50 transition-colors">
                  <span class="text-[10px] text-gray-500 mb-1">{{ slot.id }}</span>
                  <span class="text-xs font-bold text-ancient-gold text-center break-words w-full" v-if="getEquip(slot.id, slot.cat)">
                      {{ (getEquip(slot.id, slot.cat) as any)?.name || '未知装备' }}
                  </span>
                  <span class="text-xs text-gray-600 italic" v-else>空</span>
              </div>
          </div>
      </section>

      <!-- 状态 Buff/Debuff -->
      <section class="status-section p-4 border border-ancient-gold/20 bg-white/5 rounded" v-if="Object.keys(data?.主角?.当前状态 || {}).length > 0">
          <h3 class="text-sm font-bold text-ancient-gold mb-3 flex items-center border-b border-ancient-gold/20 pb-1">
             <i class="fa-solid fa-masks-theater mr-2"></i>当前状态
          </h3>
          <div class="flex flex-wrap gap-2">
              <div v-for="(status, name) in (data?.主角?.当前状态 || {})" :key="name" 
                   class="status-icon bg-black text-xs px-2 py-1 rounded border border-gray-500 cursor-help"
                   :title="(status as any)?.description || ''">
                  {{ name }} <span v-if="(status as any)?.level">Lv.{{ (status as any)?.level }}</span>
              </div>
          </div>
      </section>

  </div>
</template>

<style scoped>
.text-blood-red { color: var(--color-blood-red, #8b0000); }
.bg-blood-red\/60 { background-color: rgba(139, 0, 0, 0.6); }
.border-blood-red\/30 { border-color: rgba(139, 0, 0, 0.3); }

.text-forest-green { color: var(--color-forest-green, #2e8b57); }
.bg-forest-green\/60 { background-color: rgba(46, 139, 87, 0.6); }
.border-forest-green\/30 { border-color: rgba(46, 139, 87, 0.3); }

.text-arcane-blue { color: var(--color-arcane-blue, #483d8b); }
.bg-arcane-blue\/60 { background-color: rgba(72, 61, 139, 0.6); }
.border-arcane-blue\/30 { border-color: rgba(72, 61, 139, 0.3); }

.text-ancient-gold { color: var(--color-ancient-gold, #c59d5f); }

.equip-slot {
    background: radial-gradient(circle, rgba(40,40,45,1) 0%, rgba(20,20,25,1) 100%);
    box-shadow: inset 0 0 10px rgba(0,0,0,0.8);
}
</style>
