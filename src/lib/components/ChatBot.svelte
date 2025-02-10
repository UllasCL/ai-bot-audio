<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import { chatMessages, sessionId, addMessage } from '../stores/chat';
  import { isLoading } from '../stores/loading';
  import { sendChatMessage } from '../api/chat';
  import { handleScroll, isAtBottom, scrollToBottom } from '../utils/scroll';
  import type { Message, TextMessage, VoiceMessage } from '../types/chat';

  let isOpen = true; // Set to true by default
  let chatContainer: HTMLElement;
  let isScrolling = false;
  let input = '';
  let shouldScroll = true;

  function formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  async function handleMessage(event: CustomEvent<TextMessage | VoiceMessage>) {
    const { type, content } = event.detail;
    shouldScroll = true;

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
    } catch (error) {
      addMessage({
        text: "Sorry, I encountered an error. Please try again.",
        isBot: true,
        type: 'text'
      });
    } finally {
      isLoading.set(false);
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
    shouldScroll = isAtBottom(container);
  }

  function toggleChat() {
    isOpen = !isOpen;
  }

  function handleSubmit() {
    if (!input.trim()) return;
    handleMessage(new CustomEvent('send', {
      detail: {
        type: 'text',
        content: input.trim()
      }
    }));
    input = '';
  }

  function autoResizeTextarea(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // Reset height
    const maxHeight = 60; // Set maximum height for 3 lines (adjust as needed)
    textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px'; // Set to scroll height or max height
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
    autoResizeTextarea(event); // Call the auto-resize function
  }

  onMount(() => {
    addMessage({
      text: "Hi, I am AI concierge.\nHow can I help you today?",
      isBot: true,
      type: 'text'
    });
  });

  afterUpdate(() => {
    if (shouldScroll && chatContainer) {
      scrollToBottom(chatContainer);
    }
  });

  $: if (chatContainer && $chatMessages.length && shouldScroll) {
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
    <header class="chat-header">
      <div class="header-content">
        <div class="avatar">
          <img src="/avatar.png" alt="AI concierge" />
        </div>
        <div class="title">Ask your AI concierge</div>
      </div>
      <button class="close-button" on:click={toggleChat}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </header>

    <div
            class="messages-container"
            bind:this={chatContainer}
            on:scroll={handleScrollEvent}
    >
      {#each $chatMessages as message}
        <div class="message {message.isBot ? 'bot' : 'user'}">
          {#if message.isBot}
            <div class="avatar">
              <img src="/avatar.png" alt="AI concierge" />
            </div>
          {/if}
          <div class="message-content">
            <div class="message-header">
              <span class="sender">{message.isBot ? 'Your AI concierge' : 'You'}</span>
              <span class="time">{formatTime(new Date())}</span>
            </div>
            <div class="message-text">
              {#if message.type === 'text'}
                {message.text}
              {:else if message.type === 'voice'}
                <audio controls src={message.audioUrl}></audio>
              {/if}
            </div>
          </div>
        </div>
      {/each}

      {#if $isLoading}
        <div class="message bot">
          <div class="avatar">
            <img src="/avatar.png" alt="AI concierge" />
          </div>
          <div class="message-content">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      {/if}
    </div>

    {#if isScrolling}
      <button
              class="scroll-bottom"
              on:click={() => {
          scrollToBottom(chatContainer);
          isScrolling = false;
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 19V5M5 12l7 7 7-7"/>
        </svg>
      </button>
    {/if}

    <div class="input-container">
      <div class="input-wrapper">
        <textarea
                class="message-input"
                placeholder="Ask a question"
                bind:value={input}
                on:keydown={handleKeyDown}
                rows="1"
                on:input={autoResizeTextarea}
        ></textarea>
        <button
                class="send-button"
                on:click={handleSubmit}
                disabled={!input.trim()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .chat-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
  }

  .chat-trigger {
    display: none; /* Hide the trigger button since we want it always open */
  }

  .chat-window {
    position: relative; /* Change from absolute to relative */
    bottom: auto;
    right: auto;
    width: 400px;
    height: 700px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    transform: scale(0.95);
    opacity: 0;
    pointer-events: none;
    transition: all 0.2s ease;
  }

  .chat-window.visible {
    transform: scale(1);
    opacity: 1;
    pointer-events: all;
  }

  .chat-header {
    padding: 16px 20px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: white;
    border-radius: 16px 16px 0 0;
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 16px;
    overflow: hidden;
    flex-shrink: 0;
  }

  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .title {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
  }

  .close-button {
    background: none;
    border: none;
    padding: 8px;
    cursor: pointer;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: background-color 0.2s;
  }

  .close-button:hover {
    background-color: #f5f5f5;
  }

  .messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    background-color: #f8f9fd;
  }

  .message {
    display: flex;
    gap: 12px;
    max-width: 85%;
  }

  .message.bot {
    align-self: flex-start;
    max-width: 95%;
  }

  .message.user {
    align-self: flex-end;
    flex-direction: row-reverse;
    max-width: 85%;
  }

  .message-content {
    background: white;
    padding: 12px 16px;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .message.bot .message-content {
    background: #E20074;
    color: white;
    padding: 12px 16px;
  }

  .message.user .message-content {
    background: #f0f0f0;
    color: #1a1a1a;
    padding: 12px 16px;
  }

  .message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
    font-size: 12px;
  }

  .message.bot .message-header {
    color: rgba(255, 255, 255, 0.9);
  }

  .message.user .message-header {
    color: #1a1a1a;
  }

  .sender {
    font-weight: 500;
  }

  .time {
    opacity: 0.8;
  }

  .message.user .time {
    color: #666;
  }

  .message-text {
    white-space: pre-line;
    line-height: 1.4;
    font-size: 14px;
    text-align: left; /* Add this to ensure left alignment */
  }

  .message.bot .message-text {
    font-size: 14px;
    line-height: 1.4;
    text-align: left; /* Change from center to left */
  }

  .message.user .message-text {
    text-align: left;
    font-size: 14px;
    line-height: 1.4;
  }

  .typing-indicator {
    display: flex;
    gap: 4px;
    padding: 8px 0;
  }

  .typing-indicator span {
    width: 8px;
    height: 8px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out;
  }

  .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
  .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }

  .scroll-bottom {
    position: absolute;
    right: 20px;
    bottom: 80px;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background: #E20074;
    color: white;
    border: none;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
    z-index: 1;
  }

  .scroll-bottom:hover {
    transform: scale(1.05);
  }

  .input-container {
    padding: 16px 20px;
    background: white;
    border-top: 1px solid #f0f0f0;
    border-radius: 0 0 16px 16px;
  }

  .input-wrapper {
    display: flex;
    gap: 12px;
    align-items: flex-end;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 8px 12px;
  }

  .message-input {
    flex: 1;
    border: none;
    padding: 4px 0;
    font-size: 14px;
    resize: none;
    max-height: 60px; /* Adjust based on your line height */
    overflow: hidden; /* Hide overflow */
    line-height: 1.5;
    font-family: inherit;
    background: transparent;
    color: #1a1a1a;
    text-align: left;
  }

  .message-input::placeholder {
    color: #666;
  }

  .message-input:focus {
    outline: none;
  }

  .send-button {
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    color: #E20074;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: all 0.2s;
  }

  .send-button:disabled {
    color: #ccc;
    cursor: not-allowed;
  }

  .send-button:not(:disabled):hover {
    background-color: #E20074;
  }

  @media (max-width: 480px) {
    .chat-window {
      width: calc(100vw - 32px);
      height: calc(100vh - 32px);
    }
  }
</style>
