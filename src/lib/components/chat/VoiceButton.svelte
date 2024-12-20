<script lang="ts">
  export let isRecording: boolean;
  export let isProcessing: boolean;
  export let disabled = false;
</script>

<button 
  class="voice-button" 
  class:recording={isRecording}
  class:processing={isProcessing}
  disabled={isProcessing}
  on:click
  aria-label={isRecording ? 'Stop recording' : 'Start voice recording'}
>
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    {#if isRecording}
      <rect x="6" y="4" width="12" height="16" rx="2" ry="2"></rect>
    {:else}
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="22"></line>
    {/if}
  </svg>
</button>

<style>
  .voice-button {
    position: relative;
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
    overflow: visible;
  }

  .voice-button:hover:not(:disabled) {
    background: #3154b3;
    transform: translateY(-1px);
  }

  .voice-button:disabled,
  .voice-button.processing {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
</style>
