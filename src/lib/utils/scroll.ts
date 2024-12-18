// Scroll utility functions
export function scrollToBottom(container: HTMLElement, behavior: ScrollBehavior = 'smooth') {
  if (!container) return;
  
  const scrollHeight = container.scrollHeight;
  const height = container.clientHeight;
  const maxScrollTop = scrollHeight - height;
  
  container.scrollTo({
    top: maxScrollTop,
    behavior
  });
}

export function isAtBottom(container: HTMLElement): boolean {
  if (!container) return true;
  const threshold = 100; // pixels from bottom
  const position = container.scrollHeight - container.scrollTop - container.clientHeight;
  return position < threshold;
}

export function handleScroll(container: HTMLElement, callback: (isAtBottom: boolean) => void) {
  callback(!isAtBottom(container));
}