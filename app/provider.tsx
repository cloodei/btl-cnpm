"use client";
import { ThemeProvider } from "next-themes";
import { createContext, useContext, useState } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
const QuizContext = createContext<{
  isQuizActive: boolean,
  setIsQuizActive: (active: boolean) => void
}>({
  isQuizActive: false,
  setIsQuizActive: () => {}
});

type ProviderProps = {
  children: React.ReactNode;
};

export default function Provider({ children }: ProviderProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <QuizProvider>
          {children}
        </QuizProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

function QuizProvider({ children }: ProviderProps) {
  const [isQuizActive, setIsQuizActive] = useState(false);

  return (
    <QuizContext.Provider value={{ isQuizActive, setIsQuizActive }}>
      {children}
    </QuizContext.Provider>
  )
}

export function useQuiz() {
  return useContext(QuizContext);
}