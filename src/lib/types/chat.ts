// Chat related types
export interface Message {
  text: string;
  isBot: boolean;
  audioUrl?: string;
  type?: 'text' | 'voice' | 'error';
}

export interface ChatResponse {
  result: string;
  session_id: string;
  audioUrl?: string;
}

export interface ChatRequest {
  query: string;
  session_id?: string;
  partnerId?: string;
}

export interface VoiceMessage {
  type: 'voice';
  content: string;
  audioUrl: string;
}

export interface TextMessage {
  type: 'text';
  content: string;
}
