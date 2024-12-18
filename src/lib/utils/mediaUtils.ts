import { AudioConfig } from '../config/audio';

export function getSupportedMimeType(): string {
  // Prioritize WebM format as it's widely supported
  const mimeTypes = ['audio/webm', 'audio/webm;codecs=opus'];
  
  for (const type of mimeTypes) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  
  throw new Error('No supported audio format found');
}