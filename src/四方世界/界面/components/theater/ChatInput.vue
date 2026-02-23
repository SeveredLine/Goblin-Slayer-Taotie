<template>
  <div class="flex items-center gap-4">
    <textarea 
      v-model="inputText"
      @keydown.enter.exact.prevent="handleSend"
      placeholder="描述你的行动... (Enter发送，Shift+Enter换行)"
      class="flex-1 h-full bg-black/50 text-[#f5f5dc] border border-[#c59d5f]/40 rounded-sm p-3 outline-none focus:border-[#c59d5f] resize-none custom-scrollbar"
    ></textarea>
    
    <button 
      @click="handleSend"
      :disabled="chatStore.isGenerating || !inputText.trim()"
      class="h-full px-8 bg-gradient-to-b from-[#4a3b22] to-[#2a2214] border-2 border-[#c59d5f] text-[#c59d5f] font-bold tracking-widest hover:brightness-125 disabled:opacity-50 transition-all rounded-sm shadow-[0_0_10px_rgba(197,157,95,0.2)]"
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