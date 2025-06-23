import React, { useState, useEffect } from 'react';
import './VoiceToggleSwitch.css';
import { speakText } from '../utils/speech'; // To announce change

function VoiceToggleSwitch() {
  // Default to enabled ('true') if no setting is found or if it's not explicitly 'false'
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(() => {
    const storedPreference = localStorage.getItem('voiceFeedbackEnabled');
    return storedPreference === null ? true : storedPreference === 'true';
  });

  useEffect(() => {
    localStorage.setItem('voiceFeedbackEnabled', String(isVoiceEnabled));
  }, [isVoiceEnabled]);

  const handleChange = () => {
    const newIsEnabled = !isVoiceEnabled;
    setIsVoiceEnabled(newIsEnabled);
    // Announce the change itself, but only if voice was just enabled, or if it was enabled and is now being disabled.
    // This specific announcement should bypass the global check temporarily for this one instance.
    if (newIsEnabled) {
        speakText("Voice feedback enabled.", 'en-US', null, true); // true to bypass global check for this one announcement
    } else {
        // Speak "disabled" using the voice before it's globally turned off by the check in speakText
        speakText("Voice feedback disabled.", 'en-US', null, true);
    }
  };

  return (
    <div className="voice-toggle-switch">
      <label htmlFor="voice-toggle" className="voice-toggle-label">
        <span role="img" aria-label="speaker icon" style={{ marginRight: '5px', fontSize: '1.1em', verticalAlign: 'middle'}}>🔊</span>
        Voice Feedback:
      </label>
      <label className="switch">
        <input
          type="checkbox"
          id="voice-toggle"
          checked={isVoiceEnabled}
          onChange={handleChange}
        />
        <span className="slider round"></span>
      </label>
    </div>
  );
}

export default VoiceToggleSwitch;
