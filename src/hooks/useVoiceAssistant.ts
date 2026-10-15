import { useState, useEffect, useRef, useCallback } from 'react';
import { parseVoiceCommand } from '../utils/voiceCommands.ts';
import type { VoiceIntent } from '../types/dermatology.ts';

interface UseVoiceAssistantProps {
  onCommand: (intent: VoiceIntent) => void;
}

export function useVoiceAssistant({ onCommand }: UseVoiceAssistantProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastResponse, setLastResponse] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const onCommandRef = useRef(onCommand);

  useEffect(() => {
    onCommandRef.current = onCommand;
  }, [onCommand]);

  // Initialize SpeechRecognition if available in browser
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setErrorMessage(null);
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);

          // If result is final, execute command
          const lastResult = event.results[event.results.length - 1];
          if (lastResult.isFinal) {
            const finalPhrase = lastResult[0].transcript.trim();
            if (finalPhrase.length > 0) {
              const intent = parseVoiceCommand(finalPhrase);
              onCommandRef.current(intent);
            }
          }
        };

        recognition.onerror = (event: any) => {
          if (event.error !== 'no-speech') {
            console.warn('SpeechRecognition error:', event.error);
            setErrorMessage(`Microphone notice: ${event.error}`);
          }
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch (e) {
        console.warn('Failed to initialize SpeechRecognition:', e);
      }
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      stopSpeaking();
    };
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setErrorMessage('Speech recognition is not supported in this browser. You can still use the text voice assistant bar.');
      return;
    }
    try {
      recognitionRef.current.start();
      setIsListening(true);
      setErrorMessage(null);
    } catch (e: any) {
      if (e.name !== 'InvalidStateError') {
        console.warn('Could not start recognition:', e);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Speech output: Try server TTS endpoint first, fallback to browser speechSynthesis
  const speakText = useCallback(async (text: string) => {
    stopSpeaking();
    setIsSpeaking(true);
    setLastResponse(text);

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
          audioRef.current = audio;
          audio.onended = () => setIsSpeaking(false);
          audio.onerror = () => {
            playBrowserSpeech(text);
          };
          await audio.play();
          return;
        }
      }
    } catch (err) {
      console.warn('Server TTS failed, falling back to browser speech:', err);
    }

    playBrowserSpeech(text);
  }, []);

  const playBrowserSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  return {
    isSupported,
    isListening,
    isSpeaking,
    transcript,
    lastResponse,
    errorMessage,
    startListening,
    stopListening,
    toggleListening,
    speakText,
    stopSpeaking,
  };
}
