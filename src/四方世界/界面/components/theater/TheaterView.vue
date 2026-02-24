<template>
  <main class="relative flex flex-col">
    <!-- 顶部装饰 -->
    <div class="pointer-events-none absolute top-0 z-10 h-8 w-full bg-linear-to-b from-[#c59d5f]/20 to-transparent"></div>
    
    <!-- 消息列表 -->
    <MessageList class="custom-scrollbar flex-1 overflow-y-auto scroll-smooth p-8" />
    
    <!-- 输入与骰子区 -->
    <div class="flex flex-col border-t-2 border-[#c59d5f]/30 bg-[#151518]">
      <DiceRoller />
      <ChatInput class="h-28 p-4" />
    </div>
  </main>
</template>

<script setup lang="ts">
import ChatInput from './ChatInput.vue';
import DiceRoller from './DiceRoller.vue';
import MessageList from './MessageList.vue';
</script>