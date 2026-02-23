<template>
  <main class="relative flex flex-col">
    <!-- 顶部装饰 -->
    <div class="absolute top-0 w-full h-8 bg-gradient-to-b from-[#c59d5f]/20 to-transparent pointer-events-none z-10"></div>
    
    <!-- 消息列表 -->
    <MessageList class="flex-1 overflow-y-auto p-8 custom-scrollbar scroll-smooth" />
    
    <!-- 输入与骰子区 -->
    <div class="border-t-2 border-[#c59d5f]/30 bg-[#151518] flex flex-col">
      <DiceRoller />
      <ChatInput class="h-28 p-4" />
    </div>
  </main>
</template>

<script setup lang="ts">
import MessageList from './MessageList.vue';
import ChatInput from './ChatInput.vue';
import DiceRoller from './DiceRoller.vue';
</script>