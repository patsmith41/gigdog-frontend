// src/utils/youtubeAPILoader.ts

type Callback = () => void;

let isApiReady = false;
let isLoading = false;
const subscribers: Callback[] = [];

// This function can be called by any component that needs the YT API.
export function loadYouTubeAPI(callback: Callback): void {
  // If the API is already loaded and ready, just execute the callback immediately.
  if (isApiReady) {
    callback();
    return;
  }
  
  // Add the new callback to our list of subscribers.
  subscribers.push(callback);

  // If we are already in the process of loading the script, do nothing more.
  // The new callback will be executed when the script finishes loading.
  if (isLoading) {
    return;
  }

  // If this is the first component to ask for the API, start the loading process.
  isLoading = true;
  
  // Set up the global function that the YouTube script will call.
  (window as any).onYouTubeIframeAPIReady = () => {
    isApiReady = true;
    isLoading = false;
    // When the API is ready, call all the components that were waiting for it.
    subscribers.forEach(sub => sub());
    // Clear the subscribers list after calling them.
    subscribers.length = 0;
  };

  // Inject the script into the page.
  const script = document.createElement('script');
  script.src = 'https://www.youtube.com/iframe_api';
  document.body.appendChild(script);
}