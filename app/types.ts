export interface QuizQuestion {
  id: number;
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  image?: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  answers: (string | null)[];
  isComplete: boolean;
}
