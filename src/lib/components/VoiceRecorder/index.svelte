<script lang="ts">
  import RecordButton from './RecordButton.svelte';
  import AudioPlayer from './AudioPlayer.svelte';
  import { createVoiceRecorder } from '../../hooks/useVoiceRecorder';
  import type { VoiceAnalysisResponse } from '../../types/voice';

  const {
    isRecording,
    isProcessing,
    error,
    recordedAudio,
    analysisResult,
    toggleRecording
  } = createVoiceRecorder();
</script>

<div class="voice-recorder">
  <RecordButton 
    {isRecording}
    disabled={isProcessing}
    on:click={toggleRecording} 
  />

  {#if isProcessing}
    <div class="processing">Processing audio...</div>
  {/if}

  {#if error}
    <div class="error-message">{error}</div>
  {/if}

  {#if recordedAudio}
    <div class="audio-section">
      <span class="audio-label">Your recording:</span>
      <AudioPlayer audioURL={recordedAudio} />
    </div>
  {/if}

  {#if analysisResult?.audioUrl}
    <div class="audio-section">
      <span class="audio-label">AI response:</span>
      <AudioPlayer audioURL={analysisResult.audioUrl} />
    </div>
  {/if}
</div>

<style>
  .voice-recorder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
  }

  .processing {
    color: #666;
    font-size: 0.9rem;
  }

  .error-message {
    color: #dc3545;
    background: #ffe6e6;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.9rem;
  }

  .audio-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .audio-label {
    font-size: 0.9rem;
    color: #666;
  }
</style>