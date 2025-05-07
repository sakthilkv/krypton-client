import { useState } from 'react';
import Editor from '@monaco-editor/react';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const languages = ['python', 'cpp', 'java'] as const;
type Language = (typeof languages)[number];

const comments: Record<Language, string> = {
	python: '# Type your solution below\n',
	java: '// Type your solution below\n',
	cpp: '// Type your solution below\n',
};

function EditorPanel({ id, setResult }: { id: string; setResult: (result: any) => void }) {
	const [lang, setLang] = useState<Language>('python');
	const [code, setCode] = useState<string>(comments['python']);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async () => {
		setLoading(true);
		try {
			const res = await fetch('/api/submit', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id, lang, code }),
			});
			const data = await res.json();
			setResult(data);
		} catch (error) {
			setResult({
				case1: { output: 'error', expected: '' },
				case2: { output: '', expected: '' },
				case3: { output: '', expected: '' },
			});
		} finally {
			setLoading(false);
		}
	};

	return (
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
	);
}

export default EditorPanel;
