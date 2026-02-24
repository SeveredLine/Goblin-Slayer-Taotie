<template>
  <div ref="container" class="space-y-4">
    <div v-for="cat in ['武器', '防具', '饰品']" :key="cat" class="cat-section">
      <h3 class="mb-2 border-b border-[#c59d5f]/30 pb-1 text-sm text-[#c59d5f]">{{ cat }}</h3>
      <div class="space-y-2">
        <div v-for="(item, slot) in (equipData[cat] || {})" :key="slot" class="equip-item flex flex-col border border-[#c59d5f]/40 bg-[#1a1a1d] p-2 transition-colors hover:border-[#c59d5f]">
          <span class="mb-1 text-xs text-[#c59d5f]/60">[{{ slot }}]</span>
          <span class="font-bold text-[#e0cfbe]">{{ typeof item === 'string' ? item : (item.name || item.名称 || '未知') }}</span>
        </div>
        <div v-if="Object.keys(equipData[cat] || {}).length === 0" class="text-xs text-gray-600 italic">无装备</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import { computed, onMounted, ref } from 'vue';
import { useHeroStore } from '../../stores/useHeroStore';

const store = useHeroStore();
const equipData = computed(() => store.heroData?.装备 || {});

const container = ref<HTMLElement | null>(null);

onMounted(() => {
  if (container.value) {
    const items = container.value.querySelectorAll('.equip-item');
    gsap.fromTo(items, 
      { opacity: 0, x: -20 }, 
      { opacity: 1, x: 0, stagger: 0.1, duration: 0.4, ease: 'power2.out' }
    );
  }
});
</script>