"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, BarChart3, CircleX, ArrowLeftFromLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { QuizSummary } from "@/components/quiz-summary";
import { useQuiz } from '@/contexts/QuizContext';
import { useRouter } from "next/navigation";

function shuffleArray(arr) {
  let res = [...arr];
  for(let i = res.length - 1; i > 0; i--) {
    let random = Math.floor(Math.random() * (i + 1));
    let temp = res[i];
    res[i] = res[random];
    res[random] = temp;
  }
  return res;
}

function generateAnswers(correctAnswer, allCards, useFront) {
  // const otherAnswers = allCards.map(card => useFront ? card.front : card.back).filter(answer => answer !== correctAnswer);
  // const uniqueAnswers = [...new Set(otherAnswers)];
  // const shuffledOthers = shuffleArray(uniqueAnswers).slice(0, 3);
  // return shuffleArray([...shuffledOthers, correctAnswer]);
  let wrongSet = new Set();
  for(const card of allCards) {
    wrongSet.add(useFront ? card.front : card.back);
  }
  wrongSet.delete(correctAnswer);
  const random = shuffleArray(shuffleArray(Array.from(wrongSet)));
  let res = [correctAnswer];
  while(res.length < 4 && random.length) {
    res.push(random.pop());
  }
  return shuffleArray(res);
}
// function generateAnswers(correctAnswer, allCards, useFront) {
//   let answerSet = new Set();
//   answerSet.add(correctAnswer);
//   let cardLength = allCards.length;
//   while(answerSet.size < 4 && answerSet.size < cardLength) {
//     const randomIndex = Math.floor(Math.random() * cardLength);
//     const answer = useFront ? allCards[randomIndex].front : allCards[randomIndex].back;
//     answerSet.add(answer);
//   }
//   return shuffleArray(Array.from(answerSet));
// }

const TIME_PER_QUESTION = 15;

export default function QuizPageClient({ deckTitle, cards }) {
  const [stage, setStage] = useState(1);  // 1: form | 2: countdown | 3: start
  const [countdown, setCountdown] = useState(3);
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

  const handleQuestionCountSubmit = (event) => {
    event.preventDefault();
    setQuestionCount(questionCount);
    setIsQuizActive(true);
    setStage(2);
  };

  useEffect(() => {
    if(isFinished) {
      setIsQuizActive(false)
    }
    return () => setIsQuizActive(false);
  }, [isFinished]);
  
  useEffect(() => {
    if(timeLeft > 0 && !isFinished) {
      const timer2 = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer2);
    }
    else if(timeLeft === 0 && !isFinished) {
      if(results.length < questions.length) {
        let endResult = Array(questions.length);
        // for(let i = currentQuestionIndex; i < questions.length; i++) {
        //   endResult.push({ question: questions[i].question, correctAnswer: questions[i].answer, userAnswer: null, isCorrect: false, isUnanswered: true });
        // }
        for(let i = 0; i < questions.length; i++) {
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
  }, [timeLeft, questions, currentQuestionIndex]);
  
  useEffect(() => {
    if(stage === 2 && countdown) {
      const timer1 = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer1);
    }
    else if(stage === 2 && !countdown) {
      setStage(3);
      const random = shuffleArray(cards);
      const pickAllQuestions = Array(questionCount);
      for(let i = 0; i < questionCount; i++) {
        const useFront = (Math.random() < 0.5);
        pickAllQuestions[i] = {
          ...random[i],
          question: (useFront ? random[i].back : random[i].front),
          answer: (useFront ? random[i].front : random[i].back),
          useFront
        };
      }
      const reShuffle = shuffleArray(shuffleArray(pickAllQuestions));
      setQuestions(reShuffle);
      setAnswers(generateAnswers(reShuffle[0].answer, cards, reShuffle[0].useFront));
      setTimeLeft(questionCount * TIME_PER_QUESTION);
    }
  }, [countdown, stage, questionCount]);

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    const currentQuestion = questions[currentQuestionIndex];
    setResults(prev => [...prev, { question: currentQuestion.question, correctAnswer: currentQuestion.answer, userAnswer: answer, isCorrect: answer === currentQuestion.answer }]);
    setTimeout(() => {
      if(currentQuestionIndex < questions.length - 1) {
        const nextQuestion = questions[currentQuestionIndex + 1];
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setAnswers(generateAnswers(nextQuestion.answer, cards, nextQuestion.useFront));
      }
      else {
        setIsFinished(true);
      }
    }, 500)
  };

  const handleTerminate = () => {
    if(results.length === questions.length) {
      setIsFinished(true);
      return;
    }
    const n = questions.length;
    let lastRes = new Array(n);
    for(let i = 0; i < n; i++) {
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
        <Card className="max-w-md mx-auto p-9 pt-[22px] relative shadow-[0_4px_16px_rgba(0,0,0,0.26)] dark:border-[#2c303f]">
          <div className="mb-6 pr-1" title={deckTitle}>
            <h1 className="text-3xl font-bold truncate">{deckTitle}</h1>
            <p className="text-sm text-muted-foreground">Test your knowledge</p>
          </div>
          <form onSubmit={handleQuestionCountSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Number of Questions (3 - {cards.length})
              </label>
              <Input 
                type="number"
                min="3"
                max={cards.length}
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
              />
            </div>
            <Button type="submit" className="w-full">Start Quiz</Button>
          </form>
          <Button variant="link" className="absolute -bottom-10 -left-2 transition duration-300 hover:underline" onClick={() => router.back()}>
            <ArrowLeftFromLine className="h-[22px] w-[22px]" />
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
        <div className="relative md:pr-12 pr-40 w-full">
          <h1 className="text-3xl font-bold mb-2 truncate" title={deckTitle}>{deckTitle} Quiz</h1>
          <p className="text-muted-foreground">Test your knowledge</p>
          <div className="absolute -bottom-3 right-2 flex md:gap-2 gap-1 items-center">
            <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-800">
              <Timer className="h-5 w-5 text-primary" />
              <span className="font-mono text-lg">{timeLeft}s</span>
            </div>
            <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-800">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span className="font-mono text-lg">{currentQuestionIndex + 1}/{questions.length}</span>
            </div>
          </div>
        </div>
        <Button variant="destructive" onClick={handleTerminate} className="absolute xl:-right-48 right-1 -top-1">
          <CircleX className="h-9 w-9 mr-1 text-4xl" size={40} />
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
                  className={`h-auto border-[#c6cbd1] dark:border-gray-700 py-4 px-6 text-lg whitespace-pre-line break-words text-center
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