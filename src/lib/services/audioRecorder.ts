import { AudioConfig } from '../config/audio';
import type { RecordingError } from '../types/errors';

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private stream: MediaStream | null = null;

  async start(): Promise<void> {
    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error('Audio recording is not supported in this browser');
      }

      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: AudioConfig.RECORDING.CHANNEL_COUNT,
          sampleRate: AudioConfig.RECORDING.SAMPLE_RATE
        }
      });

      if (!MediaRecorder.isTypeSupported(AudioConfig.RECORDING.MIME_TYPE)) {
        throw new Error('WebM audio recording is not supported in this browser');
      }

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: AudioConfig.RECORDING.MIME_TYPE,
        audioBitsPerSecond: AudioConfig.RECORDING.BITS_PER_SECOND
      });

      this.chunks = [];
      this.setupRecordingHandlers();
      this.mediaRecorder.start();
    } catch (error) {
      throw this.createRecordingError(error);
    }
  }

  async stop(): Promise<Blob> {
    if (!this.mediaRecorder) {
      throw this.createRecordingError(new Error('No recording in progress'));
    }

    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        return reject(this.createRecordingError(new Error('No recording in progress')));
      }

      this.mediaRecorder.onstop = () => {
        try {
          const audioBlob = new Blob(this.chunks, { 
            type: AudioConfig.RECORDING.MIME_TYPE 
          });
          this.cleanup();
          resolve(audioBlob);
        } catch (error) {
          reject(this.createRecordingError(error));
        }
      };

      this.mediaRecorder.stop();
    });
  }

  private setupRecordingHandlers(): void {
    if (!this.mediaRecorder) return;

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.chunks.push(event.data);
      }
    };

    this.mediaRecorder.onerror = (event) => {
      console.error('MediaRecorder error:', event);
      this.cleanup();
    };
  }

  private cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    this.chunks = [];
    this.stream = null;
    this.mediaRecorder = null;
  }

  private createRecordingError(error: unknown): RecordingError {
    return {
      message: error instanceof Error ? error.message : 'Failed to record audio',
      details: 'Please check your microphone permissions',
      originalError: error
    };
  }
}