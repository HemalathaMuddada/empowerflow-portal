/**
 * Speaks the given text using the browser's Web Speech API.
 * @param {string} text The text to be spoken.
 * @param {string} lang The language code (e.g., 'en-US'). Defaults to 'en-US'.
 */
export const speakText = (text, lang = 'en-US') => {
  if (!('speechSynthesis' in window)) {
    console.warn('Browser does not support speech synthesis.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  // You can customize voice, pitch, rate here if desired
  // For example, to find available voices:
  // const voices = window.speechSynthesis.getVoices();
  // utterance.voice = voices.find(voice => voice.name === 'Google UK English Female'); // Example

  utterance.pitch = 1; // Range between 0 (lowest) and 2 (highest)
  utterance.rate = 1;  // Range between 0.1 (slowest) and 10 (fastest)

  window.speechSynthesis.speak(utterance);
};

/**
 * Generates a time-based greeting.
 * @returns {string} "Good morning", "Good afternoon", or "Good evening".
 */
export const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) {
    return 'Good morning';
  } else if (hour < 18) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
};
