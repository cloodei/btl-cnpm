"use client";
import { ThemeProvider } from "next-themes";
import { createContext, useContext, useState } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
const QuizContext = createContext();

export default function Provider({ children }) {
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

function QuizProvider({ children }) {
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