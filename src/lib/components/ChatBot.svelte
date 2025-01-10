<script lang="ts">
  import { onMount } from 'svelte';
  import { chatMessages, sessionId, addMessage } from '../stores/chat';
  import { isLoading } from '../stores/loading';
  import { sendChatMessage } from '../api/chat';
  import { handleScroll, isAtBottom, scrollToBottom } from '../utils/scroll';
  import MessageList from './MessageList.svelte';
  import ChatInput from './chat/ChatInput.svelte';
  import ChatHeader from './ChatHeader.svelte';
  import type { Message, TextMessage, VoiceMessage } from '../types/chat';

  let isOpen = false;
  let chatContainer: HTMLElement;
  let isScrolling = false;

  onMount(() => {
    addMessage({
      text: "Hello! How can I help you today?",
      isBot: true,
      type: 'text'
    });
  });

  async function handleMessage(event: CustomEvent<TextMessage | VoiceMessage>) {
    const { type, content } = event.detail;

    // Create user message
    const userMessage: Message = {
      text: content,
      isBot: false,
      type,
      ...(type === 'voice' && { audioUrl: (event.detail as VoiceMessage).audioUrl })
    };

    addMessage(userMessage);

    try {
      isLoading.set(true);

      if (type === 'text') {
        // For text messages, make the chat API call
        console.log("calling api"
        )
        const response = await sendChatMessage({
          query: content,
          session_id: $sessionId
        });

        sessionId.set(response.session_id);

        addMessage({
          text: response.result,
          isBot: true,
          type: 'text'
        });
      }
      // For voice messages, we don't add any additional messages since
      // the response is already included in the audio URL
    } catch (error) {
      addMessage({
        text: "Sorry, I encountered an error. Please try again.",
        isBot: true,
        type: 'text'
      });
    } finally {
      isLoading.set(false);
      if (chatContainer) {
        scrollToBottom(chatContainer);
      }
    }
  }

  function handleError(event: CustomEvent<string>) {
    addMessage({
      text: event.detail,
      isBot: true,
      type: 'error'
    });
  }

  function handleScrollEvent(event: Event) {
    const container = event.target as HTMLElement;
    isScrolling = !isAtBottom(container);
  }

  function toggleChat() {
    isOpen = !isOpen;
  }

  $: if (chatContainer && $chatMessages.length && !isScrolling) {
    scrollToBottom(chatContainer);
  }
</script>

<div class="chat-container">
  <button
    class="chat-trigger"
    class:open={isOpen}
    on:click={toggleChat}
    aria-label={isOpen ? 'Close chat' : 'Open chat'}
  >
    {#if isOpen}
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    {:else}
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    {/if}
  </button>

  <div class="chat-window" class:visible={isOpen}>
    <ChatHeader onClose={toggleChat} />

    <MessageList
      bind:container={chatContainer}
      onScroll={handleScrollEvent}
    />

    {#if isScrolling}
      <button
        class="scroll-bottom"
        on:click={() => {
          scrollToBottom(chatContainer);
          isScrolling = false;
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 19V5M5 12l7 7 7-7"/>
        </svg>
      </button>
    {/if}

    <ChatInput
      on:send={handleMessage}
      on:error={handleError}
    />
  </div>
</div>

<style>
  .chat-container {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 1000;
  }

  .chat-trigger {
    width: 60px;
    height: 60px;
    border-radius: 30px;
    background: #4169E1;
    color: white;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  .chat-trigger:hover {
    transform: scale(1.05);
    background: #3154b3;
  }

  .chat-trigger.open {
    background: #3154b3;
    transform: rotate(180deg);
  }

  .chat-window {
    position: absolute;
    bottom: 80px;
    right: 0;
    width: 360px;
    height: 600px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    transform: scale(0.95);
    opacity: 0;
    pointer-events: none;
    transform-origin: bottom right;
    transition: all 0.3s ease;
  }

  .chat-window.visible {
    transform: scale(1);
    opacity: 1;
    pointer-events: all;
  }

  .scroll-bottom {
    position: absolute;
    right: 24px;
    bottom: 80px;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background: #4169E1;
    color: white;
    border: none;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
    z-index: 1;
  }

  .scroll-bottom:hover {
    transform: scale(1.05);
  }

  @media (max-width: 480px) {
    .chat-window {
      width: calc(100vw - 48px);
      height: calc(100vh - 120px);
      bottom: 80px;
    }
  }
</style>
