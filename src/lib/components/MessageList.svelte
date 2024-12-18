<script lang="ts">
  import { chatMessages } from '../stores/chat';
  import { isLoading } from '../stores/loading';
  import ChatMessage from './ChatMessage.svelte';
  import Loader from './Loader.svelte';
  
  export let onScroll: (event: Event) => void;
  let container: HTMLElement;
</script>

<div 
  class="messages" 
  bind:this={container}
  on:scroll={onScroll}
>
  {#each $chatMessages as message}
    <ChatMessage {...message} />
  {/each}
  
  {#if $isLoading}
    <div class="loader-container">
      <div class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  {/if}
</div>

<style>
  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
  }

  .messages::-webkit-scrollbar {
    width: 6px;
  }

  .messages::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  .messages::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  .messages::-webkit-scrollbar-thumb:hover {
    background: #666;
  }

  .loader-container {
    align-self: flex-start;
    margin: 8px 0 8px 16px;
  }

  .typing-indicator {
    background-color: #f5f5f5;
    padding: 12px 16px;
    border-radius: 12px;
    display: flex;
    gap: 4px;
  }

  .typing-indicator span {
    width: 8px;
    height: 8px;
    background: #4169E1;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out;
  }

  .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
  .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }
</style>