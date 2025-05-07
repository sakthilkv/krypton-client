import { Button } from '@/components/ui/button';
import { API_URL } from '@/constants';
import React, { useState } from 'react';

interface QuestionSubmitProps {
	questionData: string;
}

const QuestionSubmit: React.FC<QuestionSubmitProps> = ({ questionData }) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async () => {
		setIsSubmitting(true);
		setError(null);

		try {
			const cleanedData = questionData
				.replace(/```json/g, '') // Remove Markdown JSON tags
				.replace(/```/g, '') // Remove any remaining backticks
				.trim(); // Remove whitespace

			const response = await fetch(`${API_URL}/api/question/submit`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(JSON.parse(cleanedData)),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();
			console.log(result);
		} catch (error) {
			console.error('Error:', error);
			setError(error instanceof Error ? error.message : 'Unknown error');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div>
			<Button onClick={handleSubmit} disabled={isSubmitting}>
				{isSubmitting ? 'Submitting...' : 'Submit Questions'}
			</Button>
			{error && <p className="text-red-500">{error}</p>}
		</div>
	);
};

function Chat() {
	const [prompt, setPrompt] = useState('Explain how AI works');
	const [response, setResponse] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			// In production, move this to a backend endpoint
			const apiKey = 'AIzaSyCDtCGB58vRJMrLhaUTvd8ERR_D75dgsbA';
			const res = await fetch(
				`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,

				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						contents: [
							{
								parts: [{ text: prompt }],
							},
						],
					}),
				},
			);

			if (!res.ok) {
				throw new Error(`API request failed with status ${res.status}`);
			}

			const data = await res.json();
			const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
			setResponse(text);
		} catch (error) {
			console.error('Error:', error);
			setError(error instanceof Error ? error.message : 'Failed to fetch response');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="p-10">
			<h2 className="text-2xl font-bold mb-4">Ask Gemini AI</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<textarea
					className="h-96 w-full p-4 border rounded"
					value={prompt}
					onChange={(e) => setPrompt(e.target.value)}
				/>
				<br />
				<Button type="submit" disabled={isLoading}>
					{isLoading ? 'Sending...' : 'Send'}
				</Button>
			</form>

			{error && <p className="text-red-500 mt-4">{error}</p>}

			<div className="mt-8">
				<h3 className="text-xl font-semibold mb-2">Response:</h3>
				<pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">{response}</pre>
				<div className="mt-4">
					<QuestionSubmit questionData={response} />
				</div>
			</div>
		</div>
	);
}

export default Chat;
