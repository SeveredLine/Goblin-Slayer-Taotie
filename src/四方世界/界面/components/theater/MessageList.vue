<template>
  <div ref="scrollContainer">
    <div class="mb-8 text-center text-sm tracking-widest text-[#c59d5f]/60">— 冒险纪元 —</div>
    
    <!-- 历史消息用 TransitionGroup 包裹实现入场 GSAP 动画 -->
    <TransitionGroup tag="div" :css="false" @enter="onMessageEnter">
      <div v-for="(msg, idx) in chatStore.messages" :key="idx" class="message-item mb-6 text-lg leading-relaxed">
        <span v-if="msg.role === 'user'" class="mr-2 font-bold text-[#c59d5f]">▶ 玩家:</span>
        <span v-else-if="msg.role === 'assistant'" class="mr-2 font-bold text-emerald-600/90">▶ 旁白:</span>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span v-html="formatMessage(msg.message)"></span>
      </div>
    </TransitionGroup>

    <!-- 流式生成中的消息 (打字机效果) -->
    <div v-if="chatStore.isGenerating && chatStore.streamingText" class="mb-6 text-lg leading-relaxed opacity-80">
      <span class="mr-2 font-bold text-emerald-600/90">▶ 旁白:</span>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <span v-html="formatMessage(chatStore.streamingText)"></span>
      <span class="ml-1 inline-block h-5 w-2 animate-pulse bg-[#c59d5f] align-middle"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import { nextTick, ref, watch } from 'vue';
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

const onMessageEnter = (el: Element, done: () => void) => {
  gsap.fromTo(el,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', onComplete: done }
  );
};

// 监听消息变化自动滚动到底部
watch(() => chatStore.messages.length, scrollToBottom);
watch(() => chatStore.streamingText, () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
  }
});
</script>