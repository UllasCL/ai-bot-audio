<script lang="ts">
  export let disabled = false;
</script>

<button 
  class="send-button"
  {disabled}
  on:click
  aria-label="Send message"
>
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
</button>

<style>
  .send-button {
    min-width: 44px;
    height: 44px;
    padding: 0;
    background: #4169E1;
    color: white;
    border: none;
    border-radius: 22px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.3s ease;
  }

  .send-button:hover:not(:disabled) {
    background: #3154b3;
  }

  .send-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
</style>