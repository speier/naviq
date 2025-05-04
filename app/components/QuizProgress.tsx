interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  score: number;
  answeredQuestions: number;
}

export default function QuizProgress({ currentQuestion, totalQuestions, score, answeredQuestions }: QuizProgressProps) {
  const progressPercentage = (currentQuestion / totalQuestions) * 100;
  const correctPercentage = answeredQuestions > 0 ? Math.round((score / answeredQuestions) * 100) : 0;
  
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Question {currentQuestion} of {totalQuestions}
        </span>
        <span className="text-sm font-medium text-gray-700">
          Score: {score} {answeredQuestions > 0 && <span className="text-blue-600">({correctPercentage}%)</span>}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
}
