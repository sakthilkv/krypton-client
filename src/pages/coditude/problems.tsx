import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { API_URL } from '@/constants';

type Question = {
	id: string;
	title: string;
};

const subjects = [
	{ name: 'Operating System', color: 'text-green-700' },
	{ name: 'Database Management System', color: 'text-blue-700' },
	{ name: 'Computer Networks', color: 'text-red-700' },
];

function Problem() {
	const [active, setActive] = useState('');
	const [questions, setQuestions] = useState<Question[]>([]);
	const [loading, setLoading] = useState(false);

	const fetchQuestions = async (subject: string) => {
		setLoading(true);
		try {
			const res = await fetch(`${API_URL}/api/questions?subject=${encodeURIComponent(subject)}`);
			const data = await res.json();
			setQuestions(data);
		} catch (err) {
			setQuestions([
				{ id: 'OS1', title: 'What is a process?' },
				{ id: 'OS2', title: 'Explain memory management in Operating Systems.' },
				{ id: 'OS3', title: 'What are the different types of operating systems?' },
			]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchQuestions(active);
	}, [active]);

	return (
		<div className="px-60">
			<div className="flex gap-4 p-4">
				{subjects.map((subject) => (
					<Button
						key={subject.name}
						variant="outline"
						onClick={() => setActive(subject.name)}
						className={`rounded-lg items-center justify-center p-2 flex font-bold ${
							active === subject.name
								? `bg-white ${subject.color} border-2 border-black`
								: `${subject.color}`
						}`}
					>
						{subject.name}
					</Button>
				))}
				<Button onClick={() => setActive('')}>Clear</Button>
			</div>

			<div className="border rounded h-full">
				{loading ? (
					<div className="text-gray-500 p-4">Loading questions...</div>
				) : (
					questions.map((item, index) => (
						<Link
							key={item.id}
							to={`/coditude/solve/${item.id}`}
							className={`block p-2 border-b ${
								index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
							} hover:bg-gray-200`}
						>
							<span className="font-mono text-gray-500 mr-2">{item.id} </span>
							{item.title}
						</Link>
					))
				)}
			</div>
		</div>
	);
}

export default Problem;
