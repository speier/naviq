interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

export default function QuizResults({ score, totalQuestions, onRestart }: QuizResultsProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  const incorrectAnswers = totalQuestions - score;
  const incorrectPercentage = Math.round((incorrectAnswers / totalQuestions) * 100);
  
  let message = "";
  let messageClass = "";
  
  if (percentage >= 90) {
    message = "Excellent! You're a navigation expert!";
    messageClass = "text-green-600";
  } else if (percentage >= 70) {
    message = "Great job! You have solid navigation knowledge.";
    messageClass = "text-blue-600";
  } else if (percentage >= 50) {
    message = "Good effort! Keep studying to improve your navigation skills.";
    messageClass = "text-yellow-600";
  } else {
    message = "You need more practice with navigation concepts.";
    messageClass = "text-red-600";
  }
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-3xl p-8 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz Complete!</h2>
      
      <div className="mb-6">
        <div className="text-5xl font-bold mb-2">{percentage}%</div>
        <div className="text-lg">
          You scored <span className="font-semibold">{score}</span> out of <span className="font-semibold">{totalQuestions}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{score}</div>
          <div className="text-sm text-green-700">Correct Answers</div>
          <div className="text-lg font-medium text-green-600">{percentage}%</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{incorrectAnswers}</div>
          <div className="text-sm text-red-700">Incorrect Answers</div>
          <div className="text-lg font-medium text-red-600">{incorrectPercentage}%</div>
        </div>
      </div>
      
      <p className={`text-lg font-medium mb-8 ${messageClass}`}>{message}</p>
      
      <button
        onClick={onRestart}
        className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
      >
        Take Quiz Again
      </button>
    </div>
  );
}
