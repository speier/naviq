import { useState, useEffect } from 'react';
import { QuizQuestion } from '../types';

interface QuizCardProps {
  question: QuizQuestion;
  onAnswer: (answer: string) => void;
  showResult: boolean;
  selectedAnswer: string | null;
  onNextQuestion?: () => void; // Optional callback for when user wants to move to next question
}

export default function QuizCard({ question, onAnswer, showResult, selectedAnswer, onNextQuestion }: QuizCardProps) {
  const allAnswers = [question.correctAnswer, ...question.incorrectAnswers].filter(Boolean);
  const [shuffledAnswers, setShuffledAnswers] = useState(() => [...allAnswers].sort(() => Math.random() - 0.5));
  const [isFlipping, setIsFlipping] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  
  // Reshuffle answers when the question changes
  useEffect(() => {
    setShuffledAnswers([...allAnswers].sort(() => Math.random() - 0.5));
  }, [question.id]);
  
  // Handle the flip animation when showing result
  useEffect(() => {
    if (showResult) {
      // Check if the answer is correct inside the effect
      const isAnswerCorrect = selectedAnswer === question.correctAnswer;
      
      // Show overlay for 1.5 seconds, then hide it
      const overlayTimer = setTimeout(() => {
        setShowOverlay(false);
        
        // If the answer was correct, start flipping immediately after overlay
        if (isAnswerCorrect) {
          setIsFlipping(true);
        }
      }, 1500);
      
      // Start flip animation after showing the result for 15 seconds (only needed for incorrect answers)
      const flipTimer = setTimeout(() => {
        setIsFlipping(true);
      }, 15000);
      
      return () => {
        clearTimeout(overlayTimer);
        clearTimeout(flipTimer);
      };
    } else {
      setIsFlipping(false);
      setShowOverlay(true); // Reset overlay for next question
    }
  }, [showResult, selectedAnswer, question.correctAnswer]);


  const getButtonClass = (answer: string) => {
    if (!showResult) {
      return selectedAnswer === answer 
        ? 'bg-blue-600 text-white' 
        : 'bg-white text-gray-800 hover:bg-gray-100';
    }
    
    // After showing result, only highlight the correct answer in green
    if (answer === question.correctAnswer) {
      return 'bg-green-600 text-white';
    }
    
    // Only show the overlay for incorrect answers, don't highlight the button in red
    // if (selectedAnswer === answer && answer !== question.correctAnswer) {
    //   return 'bg-red-600 text-white';
    // }
    
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
          
          {/* OK button to manually move forward - only shown after overlay disappears for incorrect answers */}
          {showResult && !showOverlay && selectedAnswer !== question.correctAnswer && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => {
                  setIsFlipping(true);
                  // Notify parent component to move to next question
                  if (onNextQuestion) {
                    onNextQuestion();
                  }
                }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
              >
                OK, Next Question
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Overlay with checkmark or crossmark */}
      {showResult && showOverlay && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
          <div className={`flex items-center justify-center h-32 w-32 rounded-full ${selectedAnswer === question.correctAnswer ? 'bg-green-500' : 'bg-red-500'} animate-scale-in`}>
            {selectedAnswer === question.correctAnswer ? (
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
