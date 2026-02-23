<template>
  <div ref="appRoot" class="fixed inset-0 z-[999999] flex flex-row overflow-hidden bg-[#1a1a1d] text-[#f5f5dc] crpg-container opacity-0">
    <TheaterView class="w-[68%] h-full border-r-2 border-[#c59d5f]/50 bg-black/40 shadow-[inset_-10px_0_20px_rgba(0,0,0,0.5)]" />
    <JournalView class="w-[32%] h-full bg-[#1e1e24] shadow-[inset_10px_0_20px_rgba(0,0,0,0.5)]" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import TheaterView from './components/theater/TheaterView.vue';
import JournalView from './components/journal/JournalView.vue';
import { useChatStore } from './stores/useChatStore';
import { useHeroStore } from './stores/useHeroStore';
import gsap from 'gsap';

const appRoot = ref<HTMLElement | null>(null);
const chatStore = useChatStore();
const heroStore = useHeroStore();

onMounted(async () => {
  await heroStore.init();
  chatStore.init();
  if (appRoot.value) {
    gsap.to(appRoot.value, { opacity: 1, duration: 1.5, ease: 'power2.out' });
  }
});
</script>