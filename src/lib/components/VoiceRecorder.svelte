<script lang="ts">
  import { onDestroy } from 'svelte';
  import RecordButton from './RecordButton.svelte';
  import AudioPlayer from './AudioPlayer.svelte';
  import { AudioRecorder } from '../services/audioRecorder';
  import { analyzeVoice } from '../services/voiceApi';
  import type { VoiceAnalysisResponse } from '../types/voice';
  import type { BaseError } from '../types/errors';

  let isRecording = false;
  let audioURL: string | null = null;
  let audioRecorder = new AudioRecorder();
  let analysisResult: VoiceAnalysisResponse | null = null;
  let error: string | null = null;
  let isProcessing = false;

  onDestroy(() => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
  });

  async function toggleRecording() {
    try {
      error = null;
      
      if (isRecording) {
        await stopRecording();
      } else {
        await startRecording();
      }
    } catch (err) {
      handleError(err as BaseError);
    } finally {
      isProcessing = false;
    }
  }

  async function startRecording() {
    await audioRecorder.start();
    isRecording = true;
    analysisResult = null;
  }

  async function stopRecording() {
    isProcessing = true;
    const audioBlob = await audioRecorder.stop();
    isRecording = false;
    
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
    
    audioURL = URL.createObjectURL(audioBlob);

    try {
      analysisResult = await analyzeVoice(audioBlob);
    } catch (err) {
      throw err;
    }
  }

  function handleError(err: BaseError) {
    console.error('Recording error:', err);
    error = err.message;
    isRecording = false;
  }
</script>

<div class="voice-recorder">
  <RecordButton 
    {isRecording}
    disabled={isProcessing}
    on:click={toggleRecording} 
  />

  {#if isProcessing}
    <div class="processing">
      Processing audio...
    </div>
  {/if}

  {#if error}
    <div class="error-message">
      {error}
    </div>
  {/if}

  {#if audioURL}
    <AudioPlayer {audioURL} />
  {/if}

  {#if analysisResult?.audioUrl}
    <AudioPlayer audioURL={analysisResult.audioUrl} />
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
    margin-top: 0.5rem;
    font-size: 0.9rem;
  }
</style>