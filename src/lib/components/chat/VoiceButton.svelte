<script lang="ts">
  export let isRecording: boolean;
  export let isProcessing: boolean;
  export let disabled = false;
</script>

<button
        class="voice-button"
        class:recording={isRecording}
        class:processing={isProcessing}
        disabled={disabled || isProcessing}
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

  {#if isRecording}
    <div class="recording-animation">
      <div class="pulse-ring"></div>
      <div class="wave-container">
        {#each Array(5) as _, i}
          <div class="wave-bar" style="--delay: {i * 0.1}s"></div>
        {/each}
      </div>
      <div class="ripple"></div>
    </div>
  {/if}
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
    opacity: 0.6;
    cursor: not-allowed;
    background: #a0a0a0;
    transform: none;
  }

  .voice-button.recording {
    background: #dc3545;
    animation: pulse 1.5s ease-in-out infinite;
  }

  .voice-button.recording:disabled {
    animation: none;
    background: #a0a0a0;
  }

  /* Rest of the styles remain unchanged */
  .recording-animation {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .pulse-ring {
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: 50%;
    border: 2px solid #dc3545;
    animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
  }

  .wave-container {
    position: absolute;
    top: -16px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 2px;
    padding: 3px 6px;
    background: rgba(220, 53, 69, 0.15);
    border-radius: 10px;
  }

  .wave-bar {
    width: 2px;
    height: 8px;
    background: #dc3545;
    border-radius: 1px;
    animation: wave 0.5s ease-in-out infinite;
    animation-delay: var(--delay);
  }

  .ripple {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: rgba(220, 53, 69, 0.2);
    animation: ripple 2s linear infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.4);
    }
    70% {
      transform: scale(1.05);
      box-shadow: 0 0 0 10px rgba(220, 53, 69, 0);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(220, 53, 69, 0);
    }
  }

  @keyframes pulse-ring {
    0% {
      transform: scale(1);
      opacity: 0.5;
    }
    50% {
      transform: scale(1.2);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 0.5;
    }
  }

  @keyframes wave {
    0%, 100% {
      height: 8px;
    }
    50% {
      height: 16px;
    }
  }

  @keyframes ripple {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.4;
    }
    100% {
      transform: translate(-50%, -50%) scale(2.5);
      opacity: 0;
    }
  }
</style>
