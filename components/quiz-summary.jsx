"use client";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, Trophy, Zap, CircleHelp, Goal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import QuizPageClient from "@/app/decks/[id]/quiz/quiz-client";
import Link from "next/link";

export function QuizSummary({ results, totalTime, totalQuestions, deck }) {
  const [retake, setRetake] = useState(false);
  const [visibleResults, setVisibleResults] = useState(Math.min(5, results.length));
  if(retake) {
    return <QuizPageClient deck={deck} />;
  }
  const correctAnswers = results.filter(r => r.isCorrect).length
  const accuracy = (correctAnswers / totalQuestions) * 100
  const averageTime = totalTime / totalQuestions
  const stats = [
    {
      icon: Trophy,
      label: "Final Score",
      value: `${correctAnswers}/${totalQuestions}`,
      color: "text-yellow-500",
    },
    {
      icon: Goal,
      label: "Accuracy",
      value: `${accuracy.toFixed(1)}%`,
      color: "text-rose-500",
    },
    {
      icon: Clock,
      label: "Total Time",
      value: `${totalTime}s`,
      color: "text-green-500",
    },
    {
      icon: Zap,
      label: "Avg. Time per Question",
      value: `${averageTime.toFixed(2)}s`,
      color: "text-purple-500",
    },
  ]
  
  return (
    <div className="min-h-[calc(100vh-48px)] bg-gradient-to-b from-background to-secondary/20 py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Quiz Complete!</h1>
          <p className="text-muted-foreground text-lg">Here's how you performed</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center border-gray-300 dark:border-gray-800">
              <stat.icon className={`h-8 w-8 mx-auto mb-4 ${stat.color}`} />
              <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </Card>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-semibold mb-6">Question Review</h2>
          {results.slice(0, visibleResults).map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className={cn("pl-6 pt-[18px] pb-[22px]", result.isUnanswered ? "border-[#969699d7] dark:border-[#435064] border-dashed" : (result.isCorrect ? "border-green-300 dark:border-green-900" : "border-red-300 dark:border-red-900"))}>
                <div className="flex items-center gap-5">
                  {result.isUnanswered ? (
                    <CircleHelp className="h-7 w-7 text-gray-400 dark:text-gray-600 mb-1 flex-shrink-0" />
                  ) : result.isCorrect ? (
                    <CheckCircle className="h-6 w-6 text-green-500 mb-1 mr-1 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-500 mb-1 mr-1 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium mb-2">{result.question}</p>
                    <div className="text-sm pr-2">
                      {result.isUnanswered ? (
                        <p className="text-muted-foreground">
                          Not answered
                        </p>
                      ) : (
                        <>
                          <p className="text-muted-foreground">
                            Your answer: <span className={result.isCorrect ? "text-green-500" : "text-red-500"}>
                              {result.userAnswer}
                            </span>
                          </p>
                          {!result.isCorrect && (
                            <p className="text-muted-foreground">
                              Correct answer: <span className="text-green-500">{result.correctAnswer}</span>
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}

          {(visibleResults < results.length) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="flex justify-center mt-6"
            >
              <Button
                variant="outline"
                onClick={() => setVisibleResults(prev => Math.min(prev + 5, results.length))}
              >
                View More
              </Button>
            </motion.div>
          )}
        </motion.div>

        <div className="flex justify-center gap-4 mt-12">
          <Link href={`/decks/${deck.deck.id}`}>
            <Button variant="outline" size="lg">
              Back to Deck
            </Button>
          </Link>
          <Button size="lg" onClick={() => setRetake(true)}>
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}