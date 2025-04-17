import type { ChatResponse, ChatRequest } from '../types/chat';

export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  const response = await fetch('https://preprod-web.gonuclei.com/api/chat/complete/internal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) {
    throw new Error('Failed to send message');
  }
  
  return response.json();
}
