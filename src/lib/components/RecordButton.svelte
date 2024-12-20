<script lang="ts">
  import RecordIcon from './icons/RecordIcon.svelte';
  import StopIcon from './icons/StopIcon.svelte';
  import RecordingAnimation from './animations/RecordingAnimation.svelte';

  export let isRecording: boolean;
  export let isProcessing: boolean;
  export let disabled = false;
</script>

<button
        class="record-button"
        class:recording={isRecording}
        disabled={disabled || isProcessing}
        on:click
        aria-label={isRecording ? 'Stop recording' : 'Start voice recording'}
>
  {#if isRecording}
    <StopIcon />
    <RecordingAnimation />
  {:else}
    <RecordIcon />
  {/if}
</button>

<style>
  .record-button {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #4169E1;
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    position: relative;
    overflow: visible;
  }

  .record-button:hover:not(:disabled) {
    transform: scale(1.05);
    background: #3154b3;
  }

  .record-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: #a0a0a0;
    transform: none;
  }

  .record-button.recording {
    background: #dc3545;
    animation: pulse 1.5s infinite;
  }

  .record-button.recording:disabled {
    animation: none;
    background: #a0a0a0;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
</style>
