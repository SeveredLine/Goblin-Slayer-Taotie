import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ST_API } from '../utils/st-bridge';

export const useChatStore = defineStore('chat', () => {
  const messages = ref<any[]>([]);
  const isGenerating = ref(false);
  const streamingText = ref(''); // 当前正在流式生成的文本

  const fetchMessages = async () => {
    if (!ST_API.getChatMessages) return;
    const msgs = await ST_API.getChatMessages('0-latest', { include_swipes: false });
    messages.value = msgs || [];
  };

  const listenToChat = () => {
    if (!ST_API.eventOn || !ST_API.tavern_events) return;
    ST_API.eventOn(ST_API.tavern_events.CHAT_CHANGED, fetchMessages);
    ST_API.eventOn(ST_API.tavern_events.MESSAGE_RECEIVED, fetchMessages);

    // 监听流式输出
    ST_API.eventOn(ST_API.iframe_events.STREAM_TOKEN_RECEIVED_INCREMENTALLY, (text: string) => {
      streamingText.value += text;
    });
    ST_API.eventOn(ST_API.iframe_events.GENERATION_ENDED, () => {
      streamingText.value = ''; // 结束后清空临时流，交由 MESSAGE_RECEIVED 拉取最新楼层
      fetchMessages();
    });
  };

  const sendInput = async (text: string) => {
    if (!text.trim() || isGenerating.value) return;
    isGenerating.value = true;
    streamingText.value = '';
    
    try {
      // should_stream: true 开启酒馆底层流式传输
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

  return { messages, isGenerating, streamingText, sendInput, init };
});