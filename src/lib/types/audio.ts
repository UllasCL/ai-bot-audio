export interface VoiceAnalysisRequest {
  provider: string;
  voice: string;
}

export interface VoiceAnalysisResponse {
  // Add specific response type properties based on API response
  result?: string;
  error?: string;
}