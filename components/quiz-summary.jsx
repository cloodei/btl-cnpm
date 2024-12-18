"use client";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, Trophy, Zap, CircleHelp, Goal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import QuizPageClient from "@/app/decks/[id]/quiz/quiz-client";

const initial = {
  opacity: 0,
  y: 20
};

const animation = {
  opacity: 1,
  y: 0
};

export function QuizSummary({ results, totalTime, totalQuestions, deckTitle, cards }) {
  const [retake, setRetake] = useState(false)
  const [pageLen, setPageLen] = useState(Math.min(5, results.length))

  if(retake) {
    return <QuizPageClient deckTitle={deckTitle} cards={cards} />
  }

  const router = useRouter()
  const stats = useMemo(() => {
    let correctAnswers = 0
    let answered = 0
    for(let i = 0; i != results.length; i++) {
      if(!results[i].isUnanswered) {
        answered++;
        if(results[i].isCorrect) {
          correctAnswers++;
        }
      }
    }
    const averageTime = answered ? (totalTime / answered).toFixed(1) + "s" : "N/A"
    const accuracy = ((correctAnswers / totalQuestions) * 100).toFixed(1) + "%"
    
    return [
      {
        icon: Trophy,
        label: "Final Score",
        value: `${correctAnswers}/${totalQuestions}`,
        color: "text-yellow-500",
      },
      {
        icon: Goal,
        label: "Accuracy",
        value: accuracy,
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
        value: averageTime,
        color: "text-purple-500",
      }
    ]
  }, [])
  
  return (
    <div className="min-h-[calc(100vh-48px)] bg-gradient-to-b from-background to-secondary/20 py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={initial}
          animate={animation}
          className="text-center sm:mb-12 mb-8"
        >
          <h1 className="sm:text-4xl text-3xl font-bold mb-2">Quiz Complete!</h1>
          <p className="sm:text-lg text-sm text-muted-foreground">Here's how you performed</p>
        </motion.div>

        <motion.div
          initial={initial}
          animate={animation}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center border-gray-300 dark:border-gray-800">
              <stat.icon className={`h-8 w-8 mx-auto mb-4 ${stat.color}`} />
              <p className="text-xs sm:text-sm text-muted-foreground sm:mb-2 mb-[5px]">{stat.label}</p>
              <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
            </Card>
          ))}
        </motion.div>

        <motion.div
          initial={initial}
          animate={animation}
          transition={{ delay: 0.2, staggerChildren: 0.1 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-semibold mb-6">Question Review</h2>
          {results.slice(0, pageLen).map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className={`pl-6 pt-[18px] pb-[22px] ${result.isUnanswered ? "border-[#969699d7] dark:border-[#435064] border-dashed" : (result.isCorrect ? "border-green-300 dark:border-green-900" : "border-red-300 dark:border-red-900")}`}>
                <div className="flex items-center gap-5">
                  {result.isUnanswered ? (
                    <CircleHelp className="h-6 w-6 text-gray-400 dark:text-gray-600 mb-1 mr-1 flex-shrink-0" />
                  ) : result.isCorrect ? (
                    <CheckCircle className="h-6 w-6 text-green-500 mb-1 mr-1 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-500 mb-1 mr-1 flex-shrink-0" />
                  )}
                  <div className="flex-1 pr-2">
                    <p className="font-semibold mb-[6px] whitespace-pre-line break-words">
                      {result.question}
                    </p>
                    <div className="text-xs pr-2">
                      {result.isUnanswered ? (
                        <>
                          <p className="text-muted-foreground whitespace-pre-line break-words">
                            Unanswered
                          </p>
                          <p className="text-muted-foreground whitespace-pre-line break-words mt-[2px]">
                            Answer: 
                            <span className="ml-1 text-green-500">
                              {result.correctAnswer}
                            </span>
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-muted-foreground whitespace-pre-line break-words">
                            Your answer: 
                            <span className={`ml-1 ${result.isCorrect ? "text-green-500" : "text-red-500"}`}>
                              {result.userAnswer}
                            </span>
                          </p>
                          {!result.isCorrect && (
                            <p className="text-muted-foreground whitespace-pre-line break-words mt-[2px]">
                              Correct answer: 
                              <span className="ml-1 text-green-500">
                                {result.correctAnswer}
                              </span>
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

          {(pageLen < results.length) && (
            <motion.div
              initial={initial}
              animate={animation}
              transition={{ delay: 0.25 }}
              className="flex justify-center mt-6"
            >
              <Button variant="outline" onClick={() => setPageLen(prev => Math.min(prev + 5, results.length))}>
                View More
              </Button>
            </motion.div>
          )}
        </motion.div>

        <div className="flex justify-center gap-4 mt-12">
          <Button variant="outline" size="lg" onMouseDown={(e) => {
            e.preventDefault();
            router.back();
          }}>
            Back to Deck
          </Button>

          <Button size="lg" onClick={() => setRetake(true)}>
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}