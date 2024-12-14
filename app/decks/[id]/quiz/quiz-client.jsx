"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, BarChart3, ArrowLeftFromLine, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { QuizSummary } from "@/components/quiz-summary";
import { useQuiz } from '@/contexts/QuizContext';
import { useRouter } from "next/navigation";

const shuffleArray = (arr) => {
  let res = [...arr];
  for(let i = res.length - 1; i; i--) {
    const random = Math.floor(Math.random() * (i + 1));
    let temp = res[i];
    res[i] = res[random];
    res[random] = temp;
  }
  return res;
}

const generateAnswers = (correctAnswer, allCards, useFront) => {
  let wrongSet = new Set();
  for(const card of allCards) {
    wrongSet.add(useFront ? card.front : card.back);
  }
  wrongSet.delete(correctAnswer);
  let res = [correctAnswer];
  const random = shuffleArray(shuffleArray(Array.from(wrongSet)));
  while(res.length != 4 && random.length) {
    res.push(random.pop());
  }
  return shuffleArray(res);
}

const TIME_PER_QUESTION = 15;

export default function QuizPageClient({ deckTitle, cards }) {
  const [stage, setStage] = useState(1);
  const [countdown, setCountdown] = useState(-1);
  const [questionCount, setQuestionCount] = useState(Math.min(10, cards.length));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(-100);
  const [isFinished, setIsFinished] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [results, setResults] = useState([]);
  const { setIsQuizActive } = useQuiz();
  const router = useRouter();

  const handleQuestionCountSubmit = (e) => {
    e.preventDefault();
    setQuestionCount(questionCount);
    setIsQuizActive(true);
    setStage(2);
    setCountdown(3);
  };

  useEffect(() => {
    if(isFinished) {
      setIsQuizActive(false)
    }
    return () => setIsQuizActive(false);
  }, [isFinished]);
  
  useEffect(() => {
    let timer2;
    if(stage === 2 && countdown > 0) {
      timer2 = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    else if(stage === 2 && countdown === 0) {
      const pickQuestions = Array(questionCount);
      for(let i = 0; i != questionCount; i++) {
        const useFront = (Math.random() < 0.5);
        pickQuestions[i] = {
          question: useFront ? cards[i].back : cards[i].front,
          answer: useFront ? cards[i].front : cards[i].back,
          useFront
        };
      }
      const reShuffle = shuffleArray(shuffleArray(shuffleArray(shuffleArray(pickQuestions))));
      setStage(3);
      setQuestions(reShuffle);
      setAnswers(generateAnswers(reShuffle[0].answer, cards, reShuffle[0].useFront));
      setTimeLeft(questionCount * TIME_PER_QUESTION);
    }
    return () => clearInterval(timer2);
  }, [countdown]);
  
  useEffect(() => {
    let timer1;
    if(timeLeft > 0 && !isFinished) {
      timer1 = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    else if(timeLeft === 0 && !isFinished) {
      if(results.length < questions.length) {
        let endResult = Array(questions.length);
        for(let i = 0; i != questions.length; i++) {
          endResult[i] = (i < currentQuestionIndex) ? results[i] : {
            question: questions[i].question,
            correctAnswer: questions[i].answer,
            userAnswer: null,
            isCorrect: false,
            isUnanswered: true
          };
        }
        setResults(endResult);
      }
      setIsFinished(true);
    }
    return () => clearInterval(timer1);
  }, [timeLeft]);

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    const currentQuestion = questions[currentQuestionIndex];
    setResults(prev => [...prev, {
      question: currentQuestion.question,
      correctAnswer: currentQuestion.answer,
      userAnswer: answer,
      isCorrect: answer === currentQuestion.answer
    }]);
    if(currentQuestionIndex === questions.length - 1) {
      setIsFinished(true);
      return;
    }
    setTimeout(() => {
      const nextQuestion = questions[currentQuestionIndex + 1];
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setAnswers(generateAnswers(nextQuestion.answer, cards, nextQuestion.useFront));
    }, 500)
  };

  const handleTerminate = () => {
    const n = questions.length;
    let lastRes = Array(n);
    for(let i = 0; i != n; i++) {
      lastRes[i] = (i < currentQuestionIndex) ? results[i] : {
        question: questions[i].question,
        correctAnswer: questions[i].answer,
        userAnswer: null,
        isCorrect: false,
        isUnanswered: true
      };
    }
    setResults(lastRes);
    setIsFinished(true);
  };

  if(stage === 1) {
    return (
      <div className="min-h-[calc(100vh-48px)] bg-gradient-to-t from-background to-secondary/30 pt-[52px] px-5">
        <Card className="max-w-[384px] md:max-w-lg mx-auto md:p-9 p-7 md:pt-[22px] pt-4 relative shadow-[0_4px_10px_rgba(0,0,0,0.33)] dark:border-[#25262c]">
          <div className="mb-4 pr-1" title={deckTitle}>
            <h1 className="text-xl md:text-2xl tracking-tight font-semibold truncate mb-[3px]">{deckTitle}</h1>
            <p className="text-xs text-muted-foreground">Test your knowledge</p>
          </div>
          <form onSubmit={handleQuestionCountSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Number of Questions (4 - {cards.length})
              </label>
              <Input 
                type="number"
                min={4}
                max={cards.length}
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
              />
            </div>
            <Button type="submit" className="w-full">Start Quiz</Button>
          </form>
          <Button variant="link" className="absolute -bottom-10 -left-2 transition duration-300 hover:underline" onClick={() => router.back()}>
            <ArrowLeftFromLine className="h-[22px] w-[22px] mr-2" />
            Return
          </Button>
        </Card>
      </div>
    );
  }
  if(stage === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-t from-background to-secondary/30 flex items-center justify-center">
        <motion.div
          key={countdown}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          className="text-8xl font-bold"
        >
          {countdown}
        </motion.div>
      </div>
    );
  }
  if(isFinished) {
    return <QuizSummary results={results} deckTitle={deckTitle} cards={cards} totalTime={questionCount * TIME_PER_QUESTION - timeLeft} totalQuestions={questions.length} />;
  }

  return (
  <div className="min-h-screen bg-gradient-to-t from-background to-secondary/30 pb-6 pt-10 px-4">
    <div className="max-w-4xl mx-auto">
      <div className="relative flex justify-between items-center mb-8">
        <div className="relative pr-40 lg:pr-36 xl:pr-0 w-full">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 truncate" title={deckTitle}>{deckTitle} Quiz</h1>
          <p className="text-muted-foreground text-sm max-sm:text-xs">Test your knowledge</p>
          <div className="absolute -bottom-[25px] right-2 flex md:gap-2 gap-1 items-center">
            <div className="flex items-center gap-2 bg-card sm:px-4 sm:py-2 px-3 py-[6px] rounded-lg border border-gray-300 dark:border-gray-800">
              <Timer className="h-5 w-5 text-primary" />
              <span className="font-mono text-lg">{timeLeft}s</span>
            </div>
            <div className="flex items-center gap-2 bg-card sm:px-4 sm:py-2 px-3 py-[6px] rounded-lg border border-gray-300 dark:border-gray-800">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span className="font-mono text-lg">{currentQuestionIndex + 1}/{questions.length}</span>
            </div>
          </div>
        </div>
        <Button variant="destructive" onClick={handleTerminate} className="absolute xl:-right-48 right-1 -top-1">
          <X className="mr-1 text-4xl" size={22} />
          Exit Quiz
        </Button>
      </div>
      <Progress value={(currentQuestionIndex + 1) / questions.length * 100} className="mb-8" />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-8"
        >
          <Card className="p-8 shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
            <h2 className="text-2xl font-semibold text-center mb-8 whitespace-pre-line break-words">
              {questions[currentQuestionIndex]?.question}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {answers.map((answer, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`
                    h-auto border-[#c6cbd1] dark:border-gray-700 py-4 px-6 text-lg whitespace-pre-line break-words text-center
                    ${selectedAnswer !== null ? 'cursor-not-allowed' : 'hover:bg-accent'}
                  `}
                  onClick={() => handleAnswer(answer)}
                  disabled={selectedAnswer !== null}
                >
                  {answer}
                </Button>
              ))}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  </div>
  );
}