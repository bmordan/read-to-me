import { createContext, useContext, useState, ReactNode } from 'react';

interface TranscriptContextType {
  transcript: string;
  setTranscript: (text: string) => void;
  clearTranscript: () => void;
}

const TranscriptContext = createContext<TranscriptContextType | undefined>(undefined);

export function TranscriptProvider({ children }: { children: ReactNode }) {
  const [transcript, setTranscriptState] = useState<string>('');

  const setTranscript = (text: string) => {
    setTranscriptState(text);
  };

  const clearTranscript = () => {
    setTranscriptState('');
  };

  return (
    <TranscriptContext.Provider value={{ transcript, setTranscript, clearTranscript }}>
      {children}
    </TranscriptContext.Provider>
  );
}

export function useTranscript() {
  const context = useContext(TranscriptContext);
  if (context === undefined) {
    throw new Error('useTranscript must be used within a TranscriptProvider');
  }
  return context;
}

