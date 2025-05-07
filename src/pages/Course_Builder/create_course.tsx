import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { API_URL } from '@/constants';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog';
import { DialogHeader } from '@/components/ui/dialog';

// Define form schema
const formSchema = z.object({
	title: z.string().min(3, {
		message: 'Topic must be at least 3 characters.',
	}),
	difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
	days: z.number().min(2).max(7),
});

interface Topic {
	title: string;
	description: string;
	key_principles: string[];
	coding_task: {
		objective: string;
		function: string;
		constraints: string[];
	};
}

interface DailyLesson {
	day: number;
	topics: Topic[];
}

interface MCQ {
	question: string;
	options: {
		text: string;
		is_correct: boolean;
	}[];
	explanation: string;
}

interface CourseData {
	course_title: string;
	daily_lessons?: DailyLesson[];
	final_mcqs?: MCQ[];
}

// Type guard for CourseData
function isValidCourseData(data: any): data is CourseData {
	return (
		data &&
		typeof data.course_title === 'string' &&
		(data.daily_lessons ? Array.isArray(data.daily_lessons) : true) &&
		(data.final_mcqs ? Array.isArray(data.final_mcqs) : true)
	);
}

export default function CreateCourse() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			difficulty: 'Beginner',
			days: 2,
		},
	});

	const [courseData, setCourseData] = useState<CourseData | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
	const [score, setScore] = useState<number | null>(null);

	// Calculate score whenever user answers change
	const calculateScore = () => {
		if (!courseData?.final_mcqs) return 0;

		let correct = 0;
		courseData.final_mcqs.forEach((mcq, index) => {
			const userAnswerIndex = userAnswers[index];
			if (userAnswerIndex !== undefined && mcq.options[userAnswerIndex]?.is_correct) {
				correct++;
			}
		});
		return correct;
	};

	// Handle user answer selection
	const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
		setUserAnswers((prev) => ({
			...prev,
			[questionIndex]: optionIndex,
		}));

		// Recalculate score immediately
		const newScore = calculateScore();
		setScore(newScore);
	};
	const handleDownload = async () => {
		setIsLoading(true);
		try {
			const response = await fetch(`${API_URL}/api/generate_certificate`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: 'Sakthi LK',
					course_name: courseData?.course_title,
					duration: `${courseData?.daily_lessons?.length || 0} days`,
				}),
			});

			if (!response.ok) throw new Error('Failed to generate certificate');

			const { path } = await response.json();

			const fileResponse = await fetch(`${API_URL}/${path}`);
			if (!fileResponse.ok) throw new Error('Failed to fetch certificate file');

			const blob = await fileResponse.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;

			const filename = path.split('/').pop() || 'certificate.pdf';
			a.download = filename;
			a.click();

			setIsOpen(true);
		} catch (error) {
			console.error('Download failed:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setIsLoading(true);
		setError(null);
		setCourseData(null);

		try {
			const prompt = `Generate a structured course on ${values.title} for ${values.difficulty} learners spanning ${values.days} days. Format strictly as JSON with:

Daily Breakdown:


Detailed analogies (300+ characters)

Key principles (bullet points)

Interactive coding task (function signature + constraints)

End-of-Course MCQs:

5 questions minimum

Distractors based on common misconceptions

json
{
  "course_title": "Learn [Topic] in [X] Days",
  "daily_lessons": [
    {
      "day": 1,
      "topics": [
        {
          "title": "Concept Title (Analogy Form)",
          "description": "Detailed analogy (300+ chars). Example for DB indexing: 'Imagine a library with 1 million unsorted books. Finding 'War and Peace' would require checking every shelf—this is a full table scan. An index is like the library's catalog system: a separate, alphabetized list that points to exact shelf locations, reducing search time from O(n) to O(log n). Real-world systems like GPS route optimization use similar principles.'",
          "key_principles": [
            "Principle 1: [Core takeaway]",
            "Principle 2: [Performance implication]"
          ],
          "coding_task": {
            "objective": "Practical implementation goal",
            "function": "def demonstrate_concept(input):",
            "constraints": ["Constraint 1", "Constraint 2"]
          }
        }
      ]
    }
  ],
  "final_mcqs": [
    {
      "question": "Which analogy best describes [concept]?",
      "options": [
        {"text": "Correct analogy", "is_correct": true},
        {"text": "Plausible but incorrect analogy", "is_correct": false},
        {"text": "Common misconception", "is_correct": false}
      ],
      "explanation": "100+ char rationale for correct answer"
    }
  ]
}
Critical Requirements:

Descriptions: Minimum 300-character explanations with:

Real-world analogy (e.g., "Load balancers = airport check-in counters")

Technical deep dive (connect analogy to CS theory)

MCQs:

1 correct + 3 distractors (based on learner pitfalls)

Explanation of why each distractor is wrong

Zero jargon in analogies (e.g., "Threads = restaurant waiters taking orders")

Example MCQ (Topic: DNS)

json
{
  "question": "How is DNS similar to a smartphone contact list?",
  "options": [
    {"text": "Both map names to numerical identifiers (IPs/phone numbers)", "is_correct": true},
    {"text": "Both store data permanently without updates", "is_correct": false},
    {"text": "Both require manual entry for every new entry", "is_correct": false}
  ],
  "explanation": "DNS automatically resolves domain names to IPs (like contacts app showing a name instead of the raw number). The second option is wrong because DNS uses caching, and the third ignores dynamic updates."
}`;

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

			// Clean and parse the response
			const cleanedData = text
				.replace(/```json/g, '')
				.replace(/```/g, '')
				.trim();

			const parsedData = JSON.parse(cleanedData);

			if (!isValidCourseData(parsedData)) {
				throw new Error('Invalid course data structure received');
			}

			setCourseData(parsedData);
		} catch (error) {
			console.error('Error:', error);
			setError(error instanceof Error ? error.message : 'Failed to fetch response');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex w-full h-screen">
			<div className="flex-1 p-8 ">
				<h1 className="text-2xl font-bold mb-6">Create New Course</h1>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Course Topic</FormLabel>
									<FormControl>
										<Input placeholder="e.g., Advanced React" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="difficulty"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Difficulty Level</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select difficulty" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="Beginner">Beginner</SelectItem>
											<SelectItem value="Intermediate">Intermediate</SelectItem>
											<SelectItem value="Advanced">Advanced</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="days"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Course Duration (2-7 days)</FormLabel>
									<FormControl>
										<Input
											type="number"
											min={2}
											max={7}
											{...field}
											onChange={(e) => field.onChange(parseInt(e.target.value))}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" disabled={isLoading}>
							{isLoading ? 'Generating...' : 'Generate Course'}
						</Button>
					</form>
				</Form>
			</div>

			{/* Right Panel - Course Content */}
			<div className="flex-2 bg-muted/50 overflow-auto">
				{isLoading ? (
					<div className="flex items-center justify-center h-full">
						<p>Generating course content...</p>
					</div>
				) : error ? (
					<div className="p-6 text-red-500">{error}</div>
				) : courseData ? (
					<div className="p-6 max-w-4xl mx-auto">
						<h1 className="text-3xl font-bold mb-6">{courseData.course_title}</h1>

						{/* Daily Lessons */}
						{courseData.daily_lessons && courseData.daily_lessons.length > 0 ? (
							<Accordion type="single" collapsible className="w-full">
								{courseData.daily_lessons.map((day) => (
									<AccordionItem key={`day-${day.day}`} value={`day-${day.day}`}>
										<AccordionTrigger className="hover:no-underline">
											<div className="flex items-center space-x-4">
												<Badge variant="outline" className="text-sm">
													Day {day.day}
												</Badge>
												<h2 className="text-xl font-semibold text-left">
													{day.topics[0]?.title || 'Untitled Topic'}
													{day.topics.length > 1 && ` + ${day.topics.length - 1} more topics`}
												</h2>
											</div>
										</AccordionTrigger>
										<AccordionContent className="pb-0">
											<div className="space-y-6">
												{day.topics.map((topic, topicIndex) => (
													<Card key={`topic-${day.day}-${topicIndex}`} className="mb-6">
														<CardHeader>
															<CardTitle>{topic.title}</CardTitle>
														</CardHeader>
														<CardContent className="space-y-4">
															<div>
																<h3 className="font-medium mb-2">Description</h3>
																<p className="text-muted-foreground">{topic.description}</p>
															</div>

															{topic.key_principles && topic.key_principles.length > 0 && (
																<div>
																	<h3 className="font-medium mb-2">Key Principles</h3>
																	<ul className="list-disc pl-5 space-y-1 text-muted-foreground">
																		{topic.key_principles.map((principle, i) => (
																			<li key={`principle-${day.day}-${topicIndex}-${i}`}>
																				{principle}
																			</li>
																		))}
																	</ul>
																</div>
															)}

															{topic.coding_task && (
																<div>
																	<h3 className="font-medium mb-2">Coding Task</h3>
																	<div className="bg-muted p-4 rounded-md">
																		<p className="font-medium">{topic.coding_task.objective}</p>
																		<pre className="mt-2 bg-background p-2 rounded text-sm overflow-x-auto">
																			{topic.coding_task.function}
																		</pre>
																		{topic.coding_task.constraints &&
																			topic.coding_task.constraints.length > 0 && (
																				<div className="mt-2">
																					<h4 className="text-sm font-medium">Constraints:</h4>
																					<ul className="list-disc pl-5 text-sm text-muted-foreground">
																						{topic.coding_task.constraints.map((constraint, i) => (
																							<li key={`constraint-${day.day}-${topicIndex}-${i}`}>
																								{constraint}
																							</li>
																						))}
																					</ul>
																				</div>
																			)}
																	</div>
																</div>
															)}
														</CardContent>
													</Card>
												))}
											</div>
										</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>
						) : (
							<p className="text-muted-foreground">No daily lessons available</p>
						)}

						{/* Final MCQs */}
						{courseData.final_mcqs && courseData.final_mcqs.length > 0 ? (
							<div className="mt-12">
								<h2 className="text-2xl font-bold mb-6">Final Assessment</h2>
								<Card>
									<CardHeader>
										<CardTitle>Multiple Choice Questions</CardTitle>
										{score !== null && (
											<p className="text-sm text-muted-foreground">
												{score >= 4
													? ' - Certificate unlocked!'
													: ' - Answer more questions correctly to unlock certificate'}
											</p>
										)}
									</CardHeader>
									<CardContent className="space-y-6">
										{courseData.final_mcqs.map((mcq, i) => (
											<div key={`mcq-${i}`} className="space-y-3">
												<h3 className="font-medium">
													{i + 1}. {mcq.question}
												</h3>
												<div className="space-y-2">
													{mcq.options.map((option, j) => (
														<div
															key={`option-${i}-${j}`}
															className={`flex items-center space-x-3 p-2 rounded cursor-pointer 
                      ${userAnswers[i] === j ? 'bg-accent' : 'hover:bg-muted'}`}
															onClick={() => handleAnswerSelect(i, j)}
														>
															<div
																className={`w-4 h-4 rounded-full border flex items-center justify-center 
                      ${userAnswers[i] === j ? 'border-primary' : 'border-muted-foreground'}`}
															>
																{userAnswers[i] === j && (
																	<div className="w-2 h-2 rounded-full bg-primary"></div>
																)}
															</div>
															<span>{option.text}</span>
														</div>
													))}
												</div>
												{userAnswers[i] !== undefined && (
													<p className="text-sm text-muted-foreground mt-2">{mcq.explanation}</p>
												)}
											</div>
										))}
									</CardContent>
								</Card>

								{/* Certificate Download Button */}
								<div className="mt-6">
									<Dialog open={isOpen} onOpenChange={setIsOpen}>
										<DialogTrigger>
											<Button
												disabled={!courseData || !score || score < 4 || isLoading}
												onClick={handleDownload}
												className="mt-4"
											>
												{isLoading ? 'Generating...' : 'Download Certificate'}
											</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>Certificate Generated</DialogTitle>
											</DialogHeader>
											<div className="py-4">
												<p>Your certificate has been downloaded automatically.</p>
												<p className="text-sm text-muted-foreground mt-2">
													If the download didn't start, check your browser's download folder.
												</p>
											</div>
										</DialogContent>
									</Dialog>
								</div>
							</div>
						) : (
							<p className="text-muted-foreground mt-12">No assessment questions available</p>
						)}
					</div>
				) : (
					<div className="flex items-center justify-center h-full">
						<p className="text-muted-foreground">Generate a course to see the content here</p>
					</div>
				)}
			</div>
		</div>
	);
}
