import { useState, useEffect } from 'react';
import { QuizQuestion } from '../types';

interface QuizCardProps {
  question: QuizQuestion;
  onAnswer: (answer: string) => void;
  showResult: boolean;
  selectedAnswer: string | null;
}

export default function QuizCard({ question, onAnswer, showResult, selectedAnswer }: QuizCardProps) {
  const allAnswers = [question.correctAnswer, ...question.incorrectAnswers].filter(Boolean);
  const [shuffledAnswers, setShuffledAnswers] = useState(() => [...allAnswers].sort(() => Math.random() - 0.5));
  const [isFlipping, setIsFlipping] = useState(false);
  
  // Reshuffle answers when the question changes
  useEffect(() => {
    setShuffledAnswers([...allAnswers].sort(() => Math.random() - 0.5));
  }, [question.id]);
  
  // Determine if the selected answer is correct
  const isCorrect = selectedAnswer === question.correctAnswer;
  
  // Handle the flip animation when showing result
  useEffect(() => {
    if (showResult) {
      // Start flip animation after showing the result for 1.5 seconds
      const timer = setTimeout(() => {
        setIsFlipping(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    } else {
      setIsFlipping(false);
    }
  }, [showResult]);

  const getButtonClass = (answer: string) => {
    if (!showResult) {
      return selectedAnswer === answer 
        ? 'bg-blue-600 text-white' 
        : 'bg-white text-gray-800 hover:bg-gray-100';
    }
    
    if (answer === question.correctAnswer) {
      return 'bg-green-600 text-white';
    }
    
    if (selectedAnswer === answer && answer !== question.correctAnswer) {
      return 'bg-red-600 text-white';
    }
    
    return 'bg-white text-gray-800';
  };

  return (
    <div className={`relative w-full ${isFlipping ? 'card-flip' : ''}`}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full transition-opacity duration-300">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4"><span className="mr-2 text-blue-600">{question.id}.</span>{question.question}</h2>
          
          {question.image && (
            <div className="mb-4 flex justify-center">
              <img 
                src={question.image} 
                alt="Question illustration" 
                className="max-h-64 rounded-md"
              />
            </div>
          )}
          
          <div className="space-y-3">
            {shuffledAnswers.map((answer) => (
              <button
                key={answer}
                onClick={() => !showResult && onAnswer(answer)}
                disabled={showResult}
                className={`w-full p-3 rounded-md border transition-colors ${getButtonClass(answer)}`}
              >
                {answer}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Overlay with checkmark or crossmark */}
      {showResult && !isFlipping && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
          <div className={`flex items-center justify-center h-32 w-32 rounded-full ${isCorrect ? 'bg-green-500' : 'bg-red-500'} animate-scale-in`}>
            {isCorrect ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
