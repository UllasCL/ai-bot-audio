// We'll use WebM format which is widely supported
export async function recordAudio(stream: MediaStream): Promise<Blob> {
  return new Promise((resolve) => {
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm'
    });
    
    const audioChunks: Blob[] = [];
    
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };
    
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      resolve(audioBlob);
    };
    
    mediaRecorder.start();
    return mediaRecorder;
  });
}

export function createAudioURL(blob: Blob): string {
  return URL.createObjectURL(blob);
}

export function revokeAudioURL(url: string): void {
  URL.revokeObjectURL(url);
}