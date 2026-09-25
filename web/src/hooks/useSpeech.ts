import { useCallback, useEffect, useRef, useState } from 'react';
import { pickPortugueseVoice, splitIntoChunks } from '@/utils/speech';

export type SpeechStatus = 'idle' | 'playing' | 'paused' | 'unavailable';

export function useSpeech() {
  const [status, setStatus] = useState<SpeechStatus>('idle');
  const supported =
    typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined';
  const queueRef = useRef<{ chunks: string[]; index: number }>({ chunks: [], index: 0 });
  const statusRef = useRef<SpeechStatus>('idle');

  const setStatusSafe = (s: SpeechStatus) => {
    statusRef.current = s;
    setStatus(s);
  };

  const hardStop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    queueRef.current = { chunks: [], index: 0 };
    setStatusSafe('idle');
  }, [supported]);

  useEffect(() => () => (supported ? window.speechSynthesis.cancel() : undefined), [supported]);

  const speakNext = useCallback(() => {
    if (!supported) return;
    const q = queueRef.current;
    if (q.index >= q.chunks.length) {
      setStatusSafe('idle');
      return;
    }
    const u = new SpeechSynthesisUtterance(q.chunks[q.index]);
    u.lang = 'pt-BR';
    u.rate = 1;
    const voice = pickPortugueseVoice(window.speechSynthesis);
    if (voice) u.voice = voice;
    u.onend = () => {
      q.index += 1;
      speakNext();
    };
    // `synthesis-failed`/`synthesis-unavailable`: o motor aceitou a chamada
    // mas não tem voz para falar (comum em Linux/containers e navegadores sem
    // vozes instaladas). Sem este tratamento o botão fica "tocando" em silêncio.
    u.onerror = (ev) => {
      const erro = (ev as SpeechSynthesisErrorEvent).error;
      setStatusSafe(
        erro === 'synthesis-failed' || erro === 'synthesis-unavailable'
          ? 'unavailable'
          : 'idle',
      );
    };
    window.speechSynthesis.speak(u);
  }, [supported]);

  const start = useCallback(
    (text: string) => {
      if (!supported || !text.trim()) return;
      // Sem vozes instaladas, `speak()` não emite som nenhum — avisar em vez
      // de fingir que está tocando.
      if (typeof SpeechSynthesisUtterance === 'undefined') {
        setStatusSafe('unavailable');
        return;
      }
      window.speechSynthesis.cancel();
      queueRef.current = { chunks: splitIntoChunks(text), index: 0 };
      setStatusSafe('playing');
      speakNext();
    },
    [supported, speakNext],
  );

  const pause = useCallback(() => {
    if (!supported || statusRef.current !== 'playing') return;
    window.speechSynthesis.pause();
    setStatusSafe('paused');
  }, [supported]);

  const resume = useCallback(() => {
    if (!supported || statusRef.current !== 'paused') return;
    window.speechSynthesis.resume();
    setStatusSafe('playing');
  }, [supported]);

  return { supported, status, start, pause, resume, stop: hardStop };
}
