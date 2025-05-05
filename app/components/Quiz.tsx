"use client";

import { useState, useEffect, useRef } from 'react';
import { QuizQuestion, QuizState } from '../types';
import QuizCard from './QuizCard';
import QuizProgress from './QuizProgress';
import QuizResults from './QuizResults';
import ConfirmationModal from './ConfirmationModal';
import JumpToQuestionModal from './JumpToQuestionModal';

interface QuizProps {
  questions: QuizQuestion[];
}

// Local storage key for saving quiz state
const QUIZ_STATE_KEY = 'navigation-quiz-state';

export default function Quiz({ questions }: QuizProps) {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    score: 0,
    answers: Array(questions.length).fill(null),
    isComplete: false
  });
  
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showJumpModal, setShowJumpModal] = useState(false);
  
  // Create a ref to store the timer ID
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  
  // Track the number of answered questions
  const answeredQuestions = quizState.answers.filter(answer => answer !== null).length;
  
  // Load saved state from local storage on component mount
  useEffect(() => {
    const loadSavedState = () => {
      try {
        const savedState = localStorage.getItem(QUIZ_STATE_KEY);
        if (savedState) {
          const parsedState = JSON.parse(savedState) as QuizState;
          
          // Make sure the saved state is compatible with the current questions
          if (parsedState.answers.length === questions.length) {
            setQuizState(parsedState);
          }
        }
      } catch (error) {
        console.error('Error loading quiz state from local storage:', error);
      }
      
      setIsLoading(false);
    };
    
    // Only run in the browser environment
    if (typeof window !== 'undefined') {
      loadSavedState();
    } else {
      setIsLoading(false);
    }
  }, [questions.length]);
  
  // Save state to local storage whenever it changes
  useEffect(() => {
    if (!isLoading && typeof window !== 'undefined') {
      localStorage.setItem(QUIZ_STATE_KEY, JSON.stringify(quizState));
    }
  }, [quizState, isLoading]);
  
  const currentQuestion = questions[quizState.currentQuestionIndex];
  
  // Function to move to the next question
  const moveToNextQuestion = () => {
    if (quizState.currentQuestionIndex < questions.length - 1) {
      // Wait for the flip animation to complete before showing the next question
      setTimeout(() => {
        setQuizState(prev => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1
        }));
        setShowResult(false);
      }, 500); // This matches the duration of the flip-out animation
    } else {
      // Quiz is complete
      setTimeout(() => {
        setQuizState(prev => ({
          ...prev,
          isComplete: true
        }));
      }, 500);
    }
  };

  const handleAnswer = (answer: string) => {
    // Update the answers array
    const newAnswers = [...quizState.answers];
    newAnswers[quizState.currentQuestionIndex] = answer;
    
    // Check if the answer is correct
    const isCorrect = answer === currentQuestion.correctAnswer;
    
    // Update the state
    setQuizState(prev => ({
      ...prev,
      answers: newAnswers,
      score: isCorrect ? prev.score + 1 : prev.score
    }));
    
    // Show the result with the checkmark/crossmark overlay
    setShowResult(true);
    
    // Set consistent timing based on user preference:
    // 1. Show overlay with checkmark/crossmark for 1.5 seconds
    // 2. Hide overlay but keep card with correct answer visible for 3.5 more seconds
    // 3. Total time before moving to next card: 5 seconds
    const totalDelay = 5000; // 5 seconds total before moving to next question
    
    // Move to the next question after the total delay
    // We'll use a timer ID so we can clear it if the user clicks 'Next' manually
    const timerId = setTimeout(() => {
      moveToNextQuestion();
    }, totalDelay);
    
    // Store the timer ID in the ref so we can clear it if needed
    timerRef.current = timerId;
  };
  
  const restartQuiz = () => {
    const newState = {
      currentQuestionIndex: 0,
      score: 0,
      answers: Array(questions.length).fill(null),
      isComplete: false
    };
    
    setQuizState(newState);
    setShowResult(false);
    
    // Clear saved state from local storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(QUIZ_STATE_KEY);
    }
  };
  
  // Function to reset the current quiz without completing it
  const resetQuiz = () => {
    setShowResetModal(true);
  };
  
  // Handle confirmation from the modal
  const handleResetConfirm = () => {
    restartQuiz();
    setShowResetModal(false);
  };
  
  // Handle cancellation from the modal
  const handleResetCancel = () => {
    setShowResetModal(false);
  };
  
  // Function to go to a random question
  const goToRandomQuestion = () => {
    if (questions.length <= 1) return;
    
    // Generate a random index different from the current one
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * questions.length);
    } while (randomIndex === quizState.currentQuestionIndex);
    
    // Update the state to go to the random question
    setQuizState(prev => ({
      ...prev,
      currentQuestionIndex: randomIndex
    }));
    
    // Reset the result display
    setShowResult(false);
  };
  
  // Function to open the jump to question modal
  const openJumpModal = () => {
    setShowJumpModal(true);
  };
  
  // Function to handle jumping to a specific question
  const handleJumpToQuestion = (questionNumber: number) => {
    // Convert from 1-based (UI) to 0-based (internal)
    const index = questionNumber - 1;
    
    // Validate the index
    if (index >= 0 && index < questions.length) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: index
      }));
      
      // Reset the result display
      setShowResult(false);
    }
    
    // Close the modal
    setShowJumpModal(false);
  };
  
  // Function to cancel jumping to a question
  const handleJumpCancel = () => {
    setShowJumpModal(false);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (quizState.isComplete) {
    return (
      <QuizResults 
        score={quizState.score} 
        totalQuestions={questions.length} 
        onRestart={restartQuiz} 
      />
    );
  }
  
  return (
    <div className="w-full max-w-xl mx-auto">
      <QuizProgress 
        currentQuestion={quizState.currentQuestionIndex + 1} 
        totalQuestions={questions.length} 
        score={quizState.score}
        answeredQuestions={answeredQuestions}
      />
      
      <QuizCard 
        question={currentQuestion} 
        onAnswer={handleAnswer} 
        showResult={showResult} 
        selectedAnswer={quizState.answers[quizState.currentQuestionIndex]}
        onNextQuestion={() => {
          // Clear the automatic timer when user manually clicks Next
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = undefined;
          }
          moveToNextQuestion();
        }}
      />
      
      <div className="mt-6 flex justify-center space-x-4">
        <button
          onClick={goToRandomQuestion}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium transition-colors flex items-center"
          title="Go to a random question"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
          Random
        </button>
        
        <button
          onClick={openJumpModal}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors flex items-center"
          title="Jump to specific question"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
          </svg>
          Jump To...
        </button>
        
        <button
          onClick={resetQuiz}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium transition-colors flex items-center"
          title="Reset the quiz"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Reset
        </button>
      </div>
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showResetModal}
        title="Reset Quiz"
        message="Are you sure you want to reset the quiz? Your progress will be lost."
        onConfirm={handleResetConfirm}
        onCancel={handleResetCancel}
      />
      
      {/* Jump to Question Modal */}
      <JumpToQuestionModal
        isOpen={showJumpModal}
        totalQuestions={questions.length}
        onJump={handleJumpToQuestion}
        onCancel={handleJumpCancel}
      />
    </div>
  );
}
