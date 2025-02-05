<script lang="ts">
    import { onMount } from 'svelte';
    import type { ChatResponse, ChatRequest } from './types';

    let messages: { text: string; isUser: boolean; timestamp: Date }[] = [];
    let inputValue = '';
    let sessionId = '';
    let isNumericInput = false;
    let product = '';
    let isLoading = false;
    let messagesContainer: HTMLElement;

    // Scroll to bottom when new messages arrive
    $: if (messages.length && messagesContainer) {
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 0);
    }

    function formatTime(date: Date): string {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    async function sendMessage() {
        // For numeric input, check if the value is a valid number
        if (isNumericInput && isNaN(Number(inputValue))) return;
        // For text input, check if there's any non-whitespace content
        if (!isNumericInput && !inputValue.trim()) return;

        // Convert number to string for numeric input
        const currentInput = isNumericInput ? String(Number(inputValue)) : inputValue.trim();

        // Add user message to chat
        messages = [...messages, { text: currentInput, isUser: true, timestamp: new Date() }];

        const request: ChatRequest = {
            query: currentInput,
            request_type: isNumericInput ? 'DISCOUNT' : 'CHAT',
        };

        // Only add session_id if it exists
        if (sessionId) {
            request.session_id = sessionId;
        }

        // Only add product if it exists
        if (product) {
            request.product = product;
        }

        try {
            isLoading = true;
            const response = await fetch('http://localhost:8000/chat/complete/test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Tenant-Key': '80d1f996-916f-11ed-a1eb-0242ac120002'
                },
                body: JSON.stringify(request)
            });

            const data: ChatResponse = await response.json();

            sessionId = data.session_id;
            if (data.product) {
                product = data.product;
            }
            isNumericInput = data.response_type === 'DISCOUNT';

            messages = [...messages, { text: data.result, isUser: false, timestamp: new Date() }];
        } catch (error) {
            console.error('Error:', error);
            messages = [...messages, {
                text: 'Sorry, there was an error processing your request.',
                isUser: false,
                timestamp: new Date()
            }];
        } finally {
            isLoading = false;
            inputValue = ''; // Clear input after the request is complete
        }
    }

    function handleKeyPress(event: KeyboardEvent) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    }

    function clearChat() {
        messages = [];
        sessionId = '';
        product = '';
        isNumericInput = false;
    }
</script>

<div class="chat-container">
    <div class="chat-header">
        <h2>Chat Assistant</h2>
        <button class="clear-button" on:click={clearChat}>Clear Chat</button>
    </div>

    <div class="messages" bind:this={messagesContainer}>
        {#if messages.length === 0}
            <div class="welcome-message">
                <h3>👋 Welcome!</h3>
                <p>How can I assist you today?</p>
            </div>
        {/if}

        {#each messages as message}
            <div class="message-wrapper {message.isUser ? 'user' : 'bot'}">
                <div class="message">
                    <div class="message-header">
                        <span class="sender">{message.isUser ? 'You' : 'Assistant'}</span>
                        <span class="timestamp">{formatTime(message.timestamp)}</span>
                    </div>
                    <p>{message.text}</p>
                </div>
            </div>
        {/each}

        {#if isLoading}
            <div class="message-wrapper bot">
                <div class="message loading">
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        {/if}
    </div>

    <div class="input-container">
        {#if isNumericInput}
            <input
                    type="number"
                    bind:value={inputValue}
                    on:keypress={handleKeyPress}
                    placeholder="Enter your monthly bill amount..."
                    disabled={isLoading}
                    class="input-field"
            />export type FAQ
        {:else}
      <textarea
              bind:value={inputValue}
              on:keypress={handleKeyPress}
              placeholder="Type your message..."
              rows="1"
              disabled={isLoading}
              class="input-field"
      ></textarea>
        {/if}
        <button
                class="send-button"
                on:click={sendMessage}
                disabled={isLoading || (isNumericInput ? isNaN(Number(inputValue)) : !inputValue.trim())}
        >
            {#if isLoading}
                <div class="button-loader"></div>
            {:else}
                Send
            {/if}
        </button>
    </div>
</div>

<style>
    .chat-container {
        max-width: 800px;
        margin: 0 auto;
        height: 90vh;
        display: flex;
        flex-direction: column;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }

    .chat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem;
        background: #f8f9fa;
        border-bottom: 1px solid #e9ecef;
    }

    .chat-header h2 {
        margin: 0;
        font-size: 1.25rem;
        color: #212529;
    }

    .clear-button {
        background: transparent;
        color: #6c757d;
        border: 1px solid #6c757d;
        padding: 0.375rem 0.75rem;
        font-size: 0.875rem;
        border-radius: 4px;
        transition: all 0.2s ease;
    }

    .clear-button:hover {
        background: #6c757d;
        color: white;
    }

    .messages {
        flex-grow: 1;
        overflow-y: auto;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        background: #f8f9fa;
    }

    .welcome-message {
        text-align: center;
        color: #6c757d;
        margin: auto;
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .welcome-message h3 {
        margin: 0;
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
    }

    .message-wrapper {
        display: flex;
        margin-bottom: 0.5rem;
    }

    .message-wrapper.user {
        justify-content: flex-end;
    }

    .message {
        max-width: 80%;
        padding: 0.75rem 1rem;
        border-radius: 1rem;
        position: relative;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.25rem;
        font-size: 0.75rem;
    }

    .sender {
        font-weight: 600;
    }

    .timestamp {
        color: #6c757d;
    }

    .message-wrapper.user .message {
        background: #0d6efd;
        color: white;
        border-bottom-right-radius: 0.25rem;
    }

    .message-wrapper.bot .message {
        background: white;
        color: #212529;
        border-bottom-left-radius: 0.25rem;
    }

    .message p {
        margin: 0;
        line-height: 1.4;
        white-space: pre-wrap;
        word-wrap: break-word;
    }

    .input-container {
        padding: 1rem;
        background: white;
        border-top: 1px solid #e9ecef;
        display: flex;
        gap: 0.5rem;
    }

    .input-field {
        flex-grow: 1;
        padding: 0.75rem 1rem;
        border: 2px solid #dee2e6;
        border-radius: 0.5rem;
        font-size: 1rem;
        resize: none;
        background: white;
        color: #212529;
        transition: all 0.2s ease;
    }

    .input-field:focus {
        outline: none;
        border-color: #0d6efd;
        box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.25);
    }

    .input-field::placeholder {
        color: #6c757d;
    }

    .send-button {
        padding: 0.75rem 1.5rem;
        background: #0d6efd;
        color: white;
        border: none;
        border-radius: 0.5rem;
        font-weight: 500;
        cursor: pointer;
        min-width: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    }

    .send-button:hover:not(:disabled) {
        background: #0b5ed7;
        transform: translateY(-1px);
    }

    .send-button:disabled {
        background: #6c757d;
        cursor: not-allowed;
        opacity: 0.7;
    }

    .typing-indicator {
        display: flex;
        gap: 0.5rem;
        padding: 0.5rem;
    }

    .typing-indicator span {
        width: 8px;
        height: 8px;
        background: #6c757d;
        border-radius: 50%;
        animation: bounce 1.4s infinite ease-in-out;
    }

    .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
    .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

    @keyframes bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
    }

    .button-loader {
        width: 16px;
        height: 16px;
        border: 2px solid #ffffff;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }
</style>
