<script lang="ts">
  export let isBot: boolean;
</script>

<div class="message-container {isBot ? 'bot' : 'user'}">
  <div class="message">
    <slot />
  </div>
</div>

<style>
  .message-container {
    width: 100%;
    margin: 8px 0;
    display: flex;
  }

  .message {
    max-width: 80%;
    padding: 12px 16px;
    border-radius: 12px;
    word-wrap: break-word;
  }

  .bot {
    justify-content: flex-start;
  }

  .bot .message {
    background-color: #f5f5f5;
    color: #333;
  }

  .user {
    justify-content: flex-end;
  }

  .user .message {
    background-color: #e3f2fd;
    color: #1565c0;
  }
</style>