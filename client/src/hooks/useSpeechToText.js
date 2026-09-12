import { useState, useRef } from 'react';

export function useSpeechToText(lang = 'hi-IN') {
  const [listening, setListening] = useState(false);
  const [supported] = useState('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  const recognitionRef = useRef(null);

  const startListening = (onResult) => {
    if (!supported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return { listening, supported, startListening, stopListening };
}