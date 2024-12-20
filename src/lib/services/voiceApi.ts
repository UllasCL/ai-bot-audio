import type { VoiceAnalysisResponse } from '../types/voice';
import type { ApiError } from '../types/errors';

const API_URL = 'https://uat-arise.gonuclei.com/api/voice/analyze';

export async function analyzeVoice(audioBlob: Blob): Promise<VoiceAnalysisResponse> {
  try {
    const formData = new FormData();

    const audioFile = new File([audioBlob], 'recording.webm', {
      type: 'audio/webm',
      lastModified: Date.now()
    });

    formData.append('audio', audioFile);
    formData.append('request', JSON.stringify({
      provider: 'openai',
      voice: 'alloy'
    }));

    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: { message: `Request failed with status: ${response.status}` }
      }));
      throw new Error(errorData.error?.message || 'Failed to process audio');
    }

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('audio/')) {
      const audioBuffer = await response.arrayBuffer();
      const audioBlob = new Blob([audioBuffer], { type: contentType });
      const audioUrl = URL.createObjectURL(audioBlob);

      return {
        audioUrl,
        text: 'AI Voice Response'
      };
    }

    const result = await response.json();
    if (result.audio_url) {
      return {
        audioUrl: result.audio_url,
        text: result.text || 'AI Voice Response'
      };
    }

    throw new Error('Invalid response format from server');
  } catch (error) {
    console.error('Voice analysis error:', error);
    const apiError: ApiError = {
      message: error instanceof Error
          ? error.message
          : 'Failed to process voice recording. Please try again.',
      endpoint: API_URL,
      originalError: error
    };
    throw apiError;
  }
}
