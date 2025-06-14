// This file tells TypeScript that the 'YT' object will exist on the global window object.
// It also defines the type for the onYouTubeIframeAPIReady function.

declare global {
    interface Window {
      YT: any; // You can use 'any' for simplicity, or install @types/youtube for full typings
      onYouTubeIframeAPIReady?: () => void;
    }
  }
  
  // This line is needed to make this file a module.
  export {};