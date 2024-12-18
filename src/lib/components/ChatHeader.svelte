<!-- Chat header component -->
<script lang="ts">
  export let onClose: () => void;
</script>

<div class="chat-header">
  <h2>Chat Assistant</h2>
  <button class="close-button" on:click={onClose}>×</button>
</div>

<style>
  .chat-header {
    padding: 16px;
    background: #4169E1;
    color: white;
    border-radius: 12px 12px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  h2 {
    margin: 0;
    font-size: 20px;
  }

  .close-button {
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    line-height: 1;
  }
</style>