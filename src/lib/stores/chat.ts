import { writable } from 'svelte/store';
import type { Message } from '../types/chat';

export const chatMessages = writable<Message[]>([]);
export const sessionId = writable<string | undefined>();

export function addMessage(message: Message) {
  chatMessages.update(messages => [...messages, message]);
}
