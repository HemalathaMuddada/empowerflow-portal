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

  // Attempt to select a specific voice if a preference is given
  // This is highly browser/OS dependent.
  if (utterance.voice && preferredVoiceName) {
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find(voice => voice.name === preferredVoiceName);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
  }

  window.speechSynthesis.speak(utterance);
};

/**
 * Attempts to find a voice based on desired gender characteristics in its name.
 * This is a heuristic and might not always work.
 * @param {string} genderHint 'female', 'male', or null for any.
 * @returns {SpeechSynthesisVoice | null} A voice object or null.
 */
const findVoiceByGenderHint = (genderHint) => {
  if (!('speechSynthesis' in window) || !genderHint) {
    return null;
  }
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) {
    // Voices might load asynchronously.
    // console.warn("No voices loaded yet. May need to wait for onvoiceschanged event.");
    return null;
  }

  const hint = genderHint.toLowerCase();
  let foundVoice = voices.find(voice => voice.name.toLowerCase().includes(hint) && voice.lang.startsWith('en'));

  if (!foundVoice && hint === 'female') { // Broader search for common female voice names
    foundVoice = voices.find(voice => voice.name.match(/female|woman|girl|zira|susan/i) && voice.lang.startsWith('en'));
  } else if (!foundVoice && hint === 'male') { // Broader search for common male voice names
    foundVoice = voices.find(voice => voice.name.match(/male|man|boy|david|mark/i) && voice.lang.startsWith('en'));
  }

  return foundVoice || null;
};


/**
 * Speaks the logout message, attempting to use a gender-hinted voice.
 * @param {string} userName The name of the user logging out (for gender hint).
 */
export const speakLogoutMessage = (userName) => {
  const text = "You have logged out successfully.";
  let preferredVoice = null;

  // Simple heuristic for gender hint based on common English names
  // This is very basic and not foolproof.
  const lowerUserName = userName ? userName.toLowerCase() : "";
  // Add more names or use a library for better gender detection if needed for a real app.
  const femaleNames = ["jane", "sarah", "lisa", "emily", "jessica", "ashley", "amy"];
  const maleNames = ["john", "mike", "david", "chris", "james", "robert", "daniel"];

  let genderHint = null;
  if (femaleNames.some(name => lowerUserName.includes(name))) {
    genderHint = 'female';
  } else if (maleNames.some(name => lowerUserName.includes(name))) {
    genderHint = 'male';
  }

  // Get voices and try to select one
  // Voices may load asynchronously, so we might need to wait or retry.
  // For simplicity, we'll try to get them directly.
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
      preferredVoice = findVoiceByGenderHint(genderHint);
  } else {
      // If voices are not loaded yet, set up an event listener
      // and try again once they are loaded.
      window.speechSynthesis.onvoiceschanged = () => {
          const updatedVoices = window.speechSynthesis.getVoices();
          if (updatedVoices.length > 0) {
              const voiceForLogout = findVoiceByGenderHint(genderHint);
              speakText(text, 'en-US', voiceForLogout ? voiceForLogout.name : null);
              window.speechSynthesis.onvoiceschanged = null; // Remove listener after use
          }
      };
      // Fallback to speaking without specific voice if onvoiceschanged doesn't fire quickly
      // or if no suitable voice is found.
      speakText(text, 'en-US');
      return; // Exit early as the onvoiceschanged will handle it
  }

  speakText(text, 'en-US', preferredVoice ? preferredVoice.name : null);
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
