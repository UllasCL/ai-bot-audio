<script lang="ts">
  export let isRecording: boolean;
  export let disabled: boolean = false;
</script>

<button 
  class="record-button" 
  class:recording={isRecording}
  {disabled}
  on:click
  aria-label={isRecording ? 'Stop recording' : 'Start recording'}
>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="22"></line>
  </svg>
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
  }

  .record-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .record-button:not(:disabled):hover {
    transform: scale(1.05);
    background: #3154b3;
  }

  .record-button.recording {
    background: #dc3545;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
</style>