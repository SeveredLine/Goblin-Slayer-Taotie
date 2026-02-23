<template>
  <div class="flex gap-2 px-4 pt-2 pb-1 border-b border-[#c59d5f]/10">
    <span class="text-[#c59d5f]/60 text-xs leading-6">快捷掷骰:</span>
    <button v-for="dice in ['d20', 'd6', 'd100']" :key="dice" @click="roll(dice)"
            class="px-2 py-0.5 text-xs border border-[#c59d5f]/40 bg-black/40 text-[#c59d5f] hover:bg-[#c59d5f]/20 rounded-sm transition-colors">
      🎲 {{ dice }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from '../../stores/useChatStore';
const chatStore = useChatStore();

const roll = (dice: string) => {
  // 简单的快捷动作，直接发给模型
  chatStore.sendInput(`[进行一次 ${dice} 判定]`);
};
</script>