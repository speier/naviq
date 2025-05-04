import { useState } from 'react';

interface JumpToQuestionModalProps {
  isOpen: boolean;
  totalQuestions: number;
  onJump: (questionNumber: number) => void;
  onCancel: () => void;
}

export default function JumpToQuestionModal({ isOpen, totalQuestions, onJump, onCancel }: JumpToQuestionModalProps) {
  const [questionNumber, setQuestionNumber] = useState(1);
  
  if (!isOpen) return null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onJump(questionNumber);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden transform transition-all">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h3 className="text-lg font-medium text-gray-900">Jump to Question</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="px-4 py-5">
          <div className="mb-4">
            <label htmlFor="questionNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Enter question number (1-{totalQuestions})
            </label>
            <input
              type="number"
              id="questionNumber"
              min={1}
              max={totalQuestions}
              value={questionNumber}
              onChange={(e) => setQuestionNumber(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Jump
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
