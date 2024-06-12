export function getSelectedModel(): string {
    if (typeof window !== 'undefined') {
      const storedModel = localStorage.getItem('selectedModel');
      return storedModel || 'phi3:14b';
    } else {
      // Default model
      return 'phi3:14b';
    }
  }