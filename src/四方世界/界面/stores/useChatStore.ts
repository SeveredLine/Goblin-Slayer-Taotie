import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ST_API } from '../utils/st-bridge';

export const useChatStore = defineStore('chat', () => {
  const messages = ref<any[]>([]);
  const isGenerating = ref(false);
  const streamingText = ref('');

  const fetchMessages = async () => {
    try {
      // 优先尝试 JS-Runner API (注意范围是 '0-' 代表全部)
      if (ST_API.getChatMessages) {
        const msgs = await ST_API.getChatMessages('0-', { include_swipes: false });
        if (msgs && msgs.length > 0) {
          messages.value = msgs;
          return;
        }
      }
      
      // 暴力回退：直接去酒馆内存里捞聊天记录
      const parentWin = window.parent as any;
      const context = parentWin.SillyTavern?.getContext?.();
      if (context && context.chat) {
        messages.value = context.chat.map((msg: any, idx: number) => ({
          message_id: idx,
          role: msg.is_user ? 'user' : 'assistant',
          message: msg.mes
        }));
      }
    } catch (e) {
      console.error('[ChatStore] 获取聊天记录失败', e);
    }
  };

  const listenToChat = () => {
    if (!ST_API.eventOn || !ST_API.tavern_events) return;
    ST_API.eventOn(ST_API.tavern_events.CHAT_CHANGED, fetchMessages);
    ST_API.eventOn(ST_API.tavern_events.MESSAGE_RECEIVED, fetchMessages);
    
    ST_API.eventOn(ST_API.iframe_events.STREAM_TOKEN_RECEIVED_INCREMENTALLY, (text: string) => {
      streamingText.value += text;
    });
    ST_API.eventOn(ST_API.iframe_events.GENERATION_ENDED, () => {
      streamingText.value = ''; 
      fetchMessages();
    });
  };

  const sendInput = async (text: string) => {
    if (!text.trim() || isGenerating.value) return;
    isGenerating.value = true;
    streamingText.value = '';
    
    try {
      // 通过 JS-Runner 让酒馆开始生成
      await ST_API.generate({ user_input: text, should_stream: true });
    } catch (e) {
      console.error('[ChatStore] 生成失败', e);
    } finally {
      isGenerating.value = false;
    }
  };

  const init = () => {
    fetchMessages();
    listenToChat();
  };

  return { messages, isGenerating, streamingText, sendInput, fetchMessages, init };
});