import React, { useState, useEffect } from 'react';

interface Question {
	question: string;
	options: string[];
	answer: number;
	category: string;
}

const questions: Question[] = [
	{
		question: 'What does HTML stand for?',
		options: [
			'Hyper Text Markup Language',
			'Home Tool Markup Language',
			'Hyperlinks and Text Markup Language',
			'Hyper Text Makeup Language',
		],
		answer: 0,
		category: 'HTML',
	},
	{
		question: 'Which CSS property is used to change the text color of an element?',
		options: ['text-color', 'font-color', 'color', 'text-style'],
		answer: 2,
		category: 'CSS',
	},
	{
		question: 'Which of the following is used to declare a JavaScript variable?',
		options: ['var', 'let', 'const', 'All of the above'],
		answer: 3,
		category: 'JavaScript',
	},
	{
		question: 'Which HTML tag is used to link an external CSS file?',
		options: ['<script>', '<css>', '<style>', '<link>'],
		answer: 3,
		category: 'HTML',
	},
	{
		question: 'What does CSS stand for?',
		options: [
			'Computer Style Sheets',
			'Creative Style Sheets',
			'Cascading Style Sheets',
			'Colorful Style Sheets',
		],
		answer: 2,
		category: 'CSS',
	},
	{
		question: "How do you write 'Hello World' in an alert box in JavaScript?",
		options: [
			"alertBox('Hello World');",
			"msg('Hello World');",
			"alert('Hello World');",
			"msgBox('Hello World');",
		],
		answer: 2,
		category: 'JavaScript',
	},
];

const QuizGame: React.FC = () => {
	const [currentPlayer, setCurrentPlayer] = useState<number>(1);
	const [scores, setScores] = useState<number[]>([0, 0]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
	const [selectedOption, setSelectedOption] = useState<number | null>(null);
	const [showResult, setShowResult] = useState<boolean>(false);
	const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
	const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

	useEffect(() => {
		const shuffled = [...questions];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		setShuffledQuestions(shuffled);
	}, []);

	const currentQuestion = shuffledQuestions[currentQuestionIndex];

	const handleOptionSelect = (index: number) => {
		if (showResult) return;

		setSelectedOption(index);
		setShowResult(true);

		if (index === currentQuestion.answer) {
			const updatedScores = [...scores];
			updatedScores[currentPlayer - 1]++;
			setScores(updatedScores);
		}
	};

	const handleNext = () => {
		if (currentQuestionIndex < shuffledQuestions.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
			setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
			setSelectedOption(null);
			setShowResult(false);
		} else {
			setQuizCompleted(true);
		}
	};

	const restartQuiz = () => {
		setCurrentPlayer(1);
		setScores([0, 0]);
		setCurrentQuestionIndex(0);
		setSelectedOption(null);
		setShowResult(false);
		setQuizCompleted(false);
		const reshuffled = [...questions];
		for (let i = reshuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[reshuffled[i], reshuffled[j]] = [reshuffled[j], reshuffled[i]];
		}
		setShuffledQuestions(reshuffled);
	};

	if (shuffledQuestions.length === 0) return null;

	return (
		<div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
			<h1 className="text-2xl font-bold text-center mb-6 text-blue-800">
				Web Development Quiz Challenge
			</h1>

			<div className="flex justify-between mb-4">
				{[1, 2].map((p) => (
					<div
						key={p}
						className={`w-[48%] rounded-lg p-4 text-center ${
							currentPlayer === p ? 'bg-blue-100 border-2 border-blue-400' : 'bg-gray-100'
						}`}
					>
						<h2 className="text-blue-600 font-bold">Player {p}</h2>
						<div className="text-lg font-semibold">Score: {scores[p - 1]}</div>
					</div>
				))}
			</div>

			<div className="text-center font-bold text-white bg-blue-600 py-2 mb-4 rounded">
				Player {currentPlayer}'s Turn
			</div>

			{!quizCompleted ? (
				<div>
					<div className="bg-gray-50 p-4 rounded mb-4 font-medium">{currentQuestion.question}</div>
					<div className="grid gap-3">
						{currentQuestion.options.map((option, index) => {
							let className = 'px-4 py-2 rounded text-white font-semibold transition';
							if (!showResult) {
								className += ' bg-blue-500 hover:bg-blue-600';
							} else if (index === currentQuestion.answer) {
								className += ' bg-green-500';
							} else if (index === selectedOption && selectedOption !== currentQuestion.answer) {
								className += ' bg-red-500';
							} else {
								className += ' bg-gray-300 text-gray-700';
							}

							return (
								<button
									key={index}
									className={className}
									onClick={() => handleOptionSelect(index)}
									disabled={showResult}
								>
									{option}
								</button>
							);
						})}
					</div>
				</div>
			) : (
				<div className="text-center mt-6">
					<h2 className="text-xl font-bold text-gray-800 mb-2">Quiz Completed!</h2>
					<p className="text-lg font-medium text-gray-600">
						Final Scores - Player 1: {scores[0]}, Player 2: {scores[1]}
					</p>
				</div>
			)}

			<div className="mt-6 text-center">
				{showResult && !quizCompleted && (
					<p className="font-semibold mb-3 text-lg">
						{selectedOption === currentQuestion.answer ? (
							<span className="text-green-600">Correct!</span>
						) : (
							<span className="text-red-600">
								Incorrect! Correct answer: {currentQuestion.options[currentQuestion.answer]}
							</span>
						)}
					</p>
				)}

				{showResult && !quizCompleted ? (
					<button
						className="mt-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
						onClick={handleNext}
					>
						Next Question
					</button>
				) : quizCompleted ? (
					<button
						className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
						onClick={restartQuiz}
					>
						Restart Quiz
					</button>
				) : null}
			</div>
		</div>
	);
};

export default QuizGame;
