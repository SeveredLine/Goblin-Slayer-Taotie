<template>
  <div class="fixed inset-0 z-999999 overflow-hidden bg-black font-serif select-none">
    
    <!-- 1. 开场动画层 -->
    <IntroSequence v-if="gameState === 'INTRO'" @complete="enterCreation" />

    <!-- 2. 全屏角色创建层 -->
    <AdventurerCreator v-else-if="gameState === 'CREATOR'" @created="enterGame" />

    <!-- 3. 主游戏界面 (参考图布局) -->
    <div v-else-if="gameState === 'GAME'" class="flex h-full w-full flex-col bg-[#110e0e] text-[#a89f91]">
      
      <!-- 顶部：状态栏 (Top Bar) -->
      <header class="relative z-20 flex h-16 items-center justify-between border-b-2 border-[#4a3e35] bg-linear-to-b from-[#2c2520] to-[#1a1614] px-6 shadow-lg">
        <!-- 左侧：装饰性标题 -->
        <div class="text-xl font-bold tracking-widest text-[#c59d5f] drop-shadow-md">
          <i class="fa-solid fa-dragon mr-2"></i>THEATER OF FATE
        </div>

        <!-- 中间：时钟与世界状态 (SVG 模拟时钟) -->
        <div class="absolute top-0 left-1/2 flex h-24 w-64 -translate-x-1/2 flex-col items-center justify-center rounded-b-xl border-x-2 border-b-2 border-[#c59d5f] bg-[#1a1614] shadow-xl">
           <div class="mb-1 text-xs tracking-widest text-[#8b7355] uppercase">World Time</div>
           <div class="text-2xl font-bold text-[#f5f5dc]">{{ currentTime || '08:00 AM' }}</div>
           <div class="text-xs text-[#5a4a3a]">Weather: Overcast</div>
        </div>

        <!-- 右侧：功能按钮区 -->
        <div class="flex gap-4">
          <button class="text-[#8b5b4b] transition-colors hover:text-red-500" title="返回酒馆" @click="exitClient">
            <i class="fa-solid fa-door-open text-2xl"></i>
          </button>
        </div>
      </header>

      <!-- 核心内容区：左右分栏 -->
      <div class="relative flex flex-1 overflow-hidden">
        
        <!-- 左侧：剧场 (Chat) -->
        <main class="relative flex flex-1 flex-col bg-[#e6dccf] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
          <div class="pointer-events-none absolute inset-0 z-10 shadow-[inset_0_0_50px_rgba(0,0,0,0.3)]"></div>
          
          <!-- 消息流 -->
          <TheaterView class="relative z-0 flex-1" />
        </main>

        <!-- 右侧：手札 (Journal) -->
        <aside class="relative z-20 flex w-[450px] flex-col border-l-4 border-[#2c2520] bg-[#1a1614] shadow-2xl">
          <JournalView />
        </aside>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import IntroSequence from './components/IntroSequence.vue';
import AdventurerCreator from './components/creation/AdventurerCreator.vue';
import JournalView from './components/journal/JournalView.vue';
import TheaterView from './components/theater/TheaterView.vue';
import { useChatStore } from './stores/useChatStore';
import { useHeroStore } from './stores/useHeroStore';

const heroStore = useHeroStore();
const chatStore = useChatStore();

// 状态机：INTRO -> CREATOR -> GAME
const gameState = ref<'INTRO' | 'CREATOR' | 'GAME'>('GAME'); // 默认进游戏检测

const currentTime = computed(() => '战后十年 / 初醒之月'); // 可从 store 获取

// 初始化检测
onMounted(async () => {
  await heroStore.init();
  chatStore.init();

  const hasSeenIntro = sessionStorage.getItem('dnd_has_seen_intro');

  // 如果没有名字，或者是本会话第一次加载，播放开场动画
  if (!heroStore.heroData?.姓名 || !hasSeenIntro) {
    gameState.value = 'INTRO';
    sessionStorage.setItem('dnd_has_seen_intro', 'true');
  } else {
    gameState.value = 'GAME';
  }
});

const enterCreation = () => {
  gameState.value = 'CREATOR';
};

const enterGame = () => {
  gameState.value = 'GAME';
  // 重新拉取数据
  heroStore.init();
};

const exitClient = () => {
  const event = new CustomEvent('dnd-crpg-close');
  window.parent.document.dispatchEvent(event);
};
</script>