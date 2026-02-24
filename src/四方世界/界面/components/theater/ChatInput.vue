<template>
  <div class="flex items-center gap-4">
    <textarea 
      v-model="inputText"
      placeholder="描述你的行动... (Enter发送，Shift+Enter换行)"
      class="custom-scrollbar h-full flex-1 resize-none rounded-sm border border-[#c59d5f]/40 bg-black/50 p-3 text-[#f5f5dc] outline-none focus:border-[#c59d5f]"
      @keydown.enter.exact.prevent="handleSend"
    ></textarea>
    
    <button 
      :disabled="chatStore.isGenerating || !inputText.trim()"
      class="h-full rounded-sm border-2 border-[#c59d5f] bg-linear-to-b from-[#4a3b22] to-[#2a2214] px-8 font-bold tracking-widest text-[#c59d5f] shadow-[0_0_10px_rgba(197,157,95,0.2)] transition-all hover:brightness-125 disabled:opacity-50"
      @click="handleSend"
    >
      {{ chatStore.isGenerating ? '推演中' : '行动' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useChatStore } from '../../stores/useChatStore';

const chatStore = useChatStore();
const inputText = ref('');

const handleSend = async () => {
  if (!inputText.value.trim() || chatStore.isGenerating) return;
  const text = inputText.value;
  inputText.value = '';
  await chatStore.sendInput(text);
};
</script>