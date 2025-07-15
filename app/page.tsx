import { promises as fs } from 'fs';
import path from 'path';
import Quiz from './components/Quiz';
import PaymentGate from "./components/PaymentGate";
import { QuizQuestion } from './types';
import { config } from './config';

async function getQuizData() {
  const filePath = path.join(process.cwd(), 'public/data/navigation-quiz.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  return JSON.parse(fileContents) as QuizQuestion[];
}

export default async function Home() {
  const quizQuestions = await getQuizData();
  
  return (
    <PaymentGate>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              {config.app.title}
            </h1>
            <p className="mt-3 text-xl text-gray-500">
              {config.app.description}
            </p>
          </div>
          <Quiz questions={quizQuestions} />
        </div>
      </div>
    </PaymentGate>
  );
}
