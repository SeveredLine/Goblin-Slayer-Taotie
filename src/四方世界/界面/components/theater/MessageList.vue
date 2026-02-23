<template>
  <div ref="scrollContainer">
    <div class="text-center text-[#c59d5f]/60 text-sm mb-8 tracking-widest">— 冒险纪元 —</div>
    
    <!-- 历史消息 -->
    <div v-for="(msg, idx) in chatStore.messages" :key="idx" class="mb-6 leading-relaxed text-lg">
      <span v-if="msg.role === 'user'" class="text-[#c59d5f] font-bold mr-2">▶ 玩家:</span>
      <span v-else-if="msg.role === 'assistant'" class="text-emerald-600/90 font-bold mr-2">▶ 旁白:</span>
      <span v-html="formatMessage(msg.message)"></span>
    </div>

    <!-- 流式生成中的消息 (打字机效果) -->
    <div v-if="chatStore.isGenerating && chatStore.streamingText" class="mb-6 leading-relaxed text-lg opacity-80">
      <span class="text-emerald-600/90 font-bold mr-2">▶ 旁白:</span>
      <span v-html="formatMessage(chatStore.streamingText)"></span>
      <span class="inline-block w-2 h-5 bg-[#c59d5f] animate-pulse align-middle ml-1"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { useChatStore } from '../../stores/useChatStore';

const chatStore = useChatStore();
const scrollContainer = ref<HTMLElement | null>(null);

const formatMessage = (text: string) => text ? text.replace(/\n/g, '<br/>') : '';

const scrollToBottom = async () => {
  await nextTick();
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
  }
};

// 监听消息变化自动滚动到底部
watch(() => chatStore.messages.length, scrollToBottom);
watch(() => chatStore.streamingText, scrollToBottom);
</script>