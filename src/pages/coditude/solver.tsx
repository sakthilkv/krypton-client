import { useState, useEffect } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Editor from '@monaco-editor/react';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { API_URL } from '@/constants';
import { useParams } from 'react-router-dom';

const languages = ['python3', 'cpp', 'java'] as const;
type Language = (typeof languages)[number];
type Result = {
	testCase: string;
	output: string;
	expectedOutput: string;
	status: string;
};
type Output = {
	success: boolean;
	testcases: Result[];
};
const comments: Record<Language, string> = {
	python3: '# Type your solution below\n',
	java: '// Type your solution below\n',
	cpp: '// Type your solution below\n',
};
interface TestCase {
	input: string;
	expectedOutput: string;
}
function Solver() {
	const [results, setResults] = useState<Output>({
		success: true,
		testcases: [
			{
				testCase: '',
				output: '',
				expectedOutput: '',
				status: '',
			},
			{
				testCase: '',
				output: '',
				expectedOutput: '',
				status: '',
			},
			{
				testCase: '',
				output: '',
				expectedOutput: '',
				status: '',
			},
		],
	});
	const [lang, setLang] = useState<Language>('python3');
	const [code, setCode] = useState<string>(comments['python3']);
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<{
		title: string;
		description: string;
		testcase: TestCase[];
	} | null>(null);
	const { id } = useParams();
	useEffect(() => {
		const fetchDetail = async () => {
			try {
				const res = await fetch(`${API_URL}/api/question/${id}`);
				const json = await res.json();
				setData(json);
			} catch (error) {
				setData({
					title: 'Error loading question',
					description: 'Could not fetch question details.',
					testcase: [],
				});
			}
		};

		fetchDetail();
	}, [id]);

	const handleSubmit = async () => {
		setLoading(true);
		try {
			const res = await fetch(`${API_URL}/api/submit`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id, lang, code }),
			});
			const data = await res.json();
			setResults(data);
		} catch (error) {
			setResults({
				success: true,
				testcases: [
					{
						testCase: 'hello',
						output: 'hello',
						expectedOutput: '#ifmmp#',
						status: 'Failed',
					},
					{
						testCase: 'abc',
						output: 'abc',
						expectedOutput: '#bdf#',
						status: 'Failed',
					},
					{
						testCase: 'xyz',
						output: 'xyz',
						expectedOutput: '#yz{#',
						status: 'Failed',
					},
				],
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<ResizablePanelGroup direction="horizontal" className="w-full h-screen rounded-lg border">
			<ResizablePanel defaultSize={50}>
				<div className="flex h-screen p-6 flex-col gap-3 w-full overflow-auto">
					<span className="text-2xl font-bold">{data?.title ?? 'Loading...'}</span>
					<h6 className="whitespace-pre-wrap">{data?.description ?? 'Fetching question...'}</h6>
					<span>Example Input/Output</span>

					{data?.testcase.map((item, index) => (
						<div key={index} className="flex flex-col gap-3 bg-gray-100 p-2 rounded">
							<div className="flex flex-col gap-3">
								<span className="text-xl font-bold">Input</span>
								<span>{item.input}</span>
							</div>
							<div className="flex flex-col">
								<span className="text-xl font-bold">Output</span>
								<span>{item.expectedOutput}</span>
							</div>
						</div>
					))}
				</div>
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel defaultSize={50}>
				<ResizablePanelGroup direction="vertical">
					<ResizablePanel defaultSize={70}>
						<div className="flex h-full justify-center p-3 flex-col gap-3 bg-white">
							<div className="flex gap-2 items-center justify-between px-5">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button className="rounded-sm" variant="outline">
											{lang}
											<ChevronDown className="ml-2 h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="rounded-none">
										{languages.map((l) => (
											<DropdownMenuItem
												key={l}
												onClick={() => {
													setLang(l);
													setCode(comments[l]);
												}}
											>
												{l}
											</DropdownMenuItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>

								<Button className="rounded-sm" onClick={handleSubmit} disabled={loading}>
									{loading ? 'Submitting...' : 'Submit'}
								</Button>
							</div>

							<Editor
								className="h-full w-full"
								language={lang}
								theme="vs-light"
								value={code}
								onChange={(val) => setCode(val || '')}
								options={{
									formatOnType: true,
									minimap: { enabled: false },
								}}
							/>
						</div>
					</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel defaultSize={75}>
						<div className="flex h-full p-6 bg-black/80">
							<Tabs defaultValue="case0" className="w-full">
								<TabsList className="gap-4">
									{results.testcases.map((r, index) => (
										<TabsTrigger key={index} value={`case${index}`}>
											<div className="flex justify-center items-center gap-3">
												<span
													className={`text-xl ${
														r.status === 'Passed' ? 'text-green-500' : 'text-red-500'
													}`}
												>
													•
												</span>
												{`Case ${index + 1}`}
											</div>
										</TabsTrigger>
									))}
								</TabsList>

								{results.testcases.map((r, index) => (
									<TabsContent key={index} value={`case${index}`}>
										<div className="space-y-2 text-white">
											<div>
												<strong>Input:</strong> {r.testCase}
											</div>
											<div>
												<strong>Output:</strong> {r.output}
											</div>
											<div>
												<strong>Expected:</strong> {r.expectedOutput}
											</div>
											<div>
												<strong>Status:</strong> {r.status}
											</div>
										</div>
									</TabsContent>
								))}
							</Tabs>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}

export default Solver;
