<template>
  <div class="space-y-6">
    <!-- 职业信息 -->
    <div>
      <h3 class="text-[#c59d5f] border-b border-[#c59d5f]/30 mb-2 pb-1 text-sm">当前职业</h3>
      <div v-for="(jobData, jobName) in jobs" :key="jobName" class="bg-black/30 p-3 border border-[#c59d5f]/20 rounded-sm">
        <div class="flex justify-between font-bold mb-1">
          <span>{{ jobName }}</span>
          <span class="text-[#c59d5f]">Lv.{{ jobData.当前等级 || 1 }}</span>
        </div>
        <div class="text-xs text-gray-400">经验: {{ jobData.当前经验 || 0 }} / {{ jobData.升级所需 || 1000 }}</div>
      </div>
    </div>

    <!-- 技能列表 -->
    <div>
      <h3 class="text-[#c59d5f] border-b border-[#c59d5f]/30 mb-2 pb-1 text-sm">掌握技艺</h3>
      <div class="space-y-2">
        <div v-for="(skill, name) in skills" :key="name" class="bg-black/20 p-2 text-sm border border-[#c59d5f]/10">
          <div class="flex justify-between mb-1">
            <span class="font-bold">{{ name }}</span>
            <span class="text-[#c59d5f]/80">[{{ skill.level || skill.等级 || '初级' }}]</span>
          </div>
          <div class="text-xs text-gray-500">{{ skill.description || '无描述' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useHeroStore } from '../../stores/useHeroStore';
const store = useHeroStore();
const jobs = computed(() => store.heroData?.职业 || {});
const skills = computed(() => store.heroData?.技能列表 || {});
</script>