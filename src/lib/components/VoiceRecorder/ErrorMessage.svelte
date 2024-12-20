<script lang="ts">
    export let message: string;
</script>

<div class="error-message" role="alert">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
    <span>{message}</span>
</div>

<style>
    .error-message {
        position: absolute;
        top: -32px;
        left: 50%;
        transform: translateX(-50%);
        background: #fee2e2;
        color: #dc2626;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 4px;
        white-space: nowrap;
        animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translate(-50%, -10px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
</style>
