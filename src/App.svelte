<!-- Main App component -->
<script lang="ts">
  import ChatBot from './lib/components/ChatBot.svelte';
  import VoiceRecorder from './lib/components/VoiceRecorder.svelte';
  import { onMount } from 'svelte';

  let chatSimpleLoaded = false;

  function loadChatSimple() {
    if (chatSimpleLoaded) return;
    
    // Add the script tag
    const script = document.createElement('script');
    script.src = 'https://cdn.chatsimple.ai/chat-bot-loader.js';
    script.defer = true;
    document.body.appendChild(script);

    // Add the chat-bot element
    const chatBot = document.createElement('chat-bot');
    chatBot.setAttribute('platform_id', '5b44bc8b-9714-4a2b-92cf-1201bc585af6');
    chatBot.setAttribute('user_id', '2d5d0ff8-9f52-4f3c-b8d1-31312fc546e4');
    chatBot.setAttribute('chatbot_id', '3669fb30-0814-44a0-8e36-3223e05c55ae');
    
    const link = document.createElement('a');
    link.href = 'https://www.chatsimple.ai/?utm_source=widget&utm_medium=referral';
    link.textContent = 'chatsimple';
    chatBot.appendChild(link);
    
    document.body.appendChild(chatBot);
    chatSimpleLoaded = true;
  }
</script>

<main>
  <div>
    <a href="https://www.gonuclei.com/" target="_blank" rel="noreferrer">
      <img src="https://prod-arise-b2b-cdn.gonuclei.com/public/arise_b2b_prod_images/production/icons/nuclei_ic.png" class="logo" alt="Nuclei Logo" />
    </a>
    <h1>AI powered bot</h1>
<!--    <button class="click-me-btn" on:click={loadChatSimple}>Click Me</button>-->
  </div>
  <VoiceRecorder></VoiceRecorder>
<!--  <ChatBot/>-->
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .click-me-btn {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #4169E1;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-top: 10px;
  }
  .click-me-btn:hover {
    background-color: #3154b3;
  }
</style>
