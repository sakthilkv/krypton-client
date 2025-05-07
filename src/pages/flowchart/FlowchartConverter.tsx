import { useRef, useState, useEffect } from 'react';
import './FlowchartConverter.css';
import { Button } from '@/components/ui/button';
const SHAPES = {
	TERMINAL: { color: '#FF6B6B', shape: 'terminal' },
	PROCESS: { color: '#4ECDC4', shape: 'rectangle' },
	DECISION: { color: '#FFD166', shape: 'diamond' },
	IO: { color: '#A5D8FF', shape: 'parallelogram' },
};

function measureText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
	const words = text.split(' ');
	let line = '';
	const lines = [];

	for (let n = 0; n < words.length; n++) {
		const testLine = line + words[n] + ' ';
		const metrics = ctx.measureText(testLine);
		const testWidth = metrics.width;
		if (testWidth > maxWidth && n > 0) {
			lines.push(line);
			line = words[n] + ' ';
		} else {
			line = testLine;
		}
	}
	lines.push(line);

	const height = lines.length * 20;
	const width = Math.max(...lines.map((l) => ctx.measureText(l).width));
	return { width, height, lines };
}

function drawRoundedRect(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	radius: number,
) {
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	ctx.lineTo(x + width, y + height - radius);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	ctx.lineTo(x + radius, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	ctx.lineTo(x, y + radius);
	ctx.quadraticCurveTo(x, y, x + radius, y);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}

function drawArrow(
	ctx: CanvasRenderingContext2D,
	fromX: number,
	fromY: number,
	toX: number,
	toY: number,
) {
	ctx.beginPath();
	ctx.moveTo(fromX, fromY);
	ctx.lineTo(toX, toY);
	ctx.stroke();

	const angle = Math.atan2(toY - fromY, toX - fromX);
	const headLength = 10;
	ctx.beginPath();
	ctx.moveTo(toX, toY);
	ctx.lineTo(
		toX - headLength * Math.cos(angle - Math.PI / 6),
		toY - headLength * Math.sin(angle - Math.PI / 6),
	);
	ctx.lineTo(
		toX - headLength * Math.cos(angle + Math.PI / 6),
		toY - headLength * Math.sin(angle + Math.PI / 6),
	);
	ctx.lineTo(toX, toY);
	ctx.fill();
}

function processTextToSteps(text: string) {
	const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0);
	const steps: {
		text: string;
		type: keyof typeof SHAPES;
		depth: number;
		height: number;
		width: number;
	}[] = [];
	let depth = 0;

	for (let i = 0; i < sentences.length; i++) {
		let sentence = sentences[i].trim();
		if (sentence.length === 0) continue;
		sentence = sentence[0].toUpperCase() + sentence.slice(1);

		let type: keyof typeof SHAPES = 'PROCESS';
		if (i === 0 && /start|begin/i.test(sentence)) type = 'TERMINAL';
		else if (i === sentences.length - 1 && /end|stop|finish/i.test(sentence)) type = 'TERMINAL';
		else if (/if\s|when\s|check\s/i.test(sentence)) type = 'DECISION';
		else if (/input|output|read|write|print/i.test(sentence)) type = 'IO';

		if (type === 'DECISION') depth++;
		else if (/else|otherwise/i.test(sentence)) depth--;

		steps.push({
			text: sentence,
			type,
			depth,
			height: 0,
			width: 0,
		});
	}
	return steps;
}

const ParagraphToFlowchart = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const [paragraph, setParagraph] = useState(
		'Start the process. First, perform initial setup. Then check if condition A is met. If yes, proceed to step X. Else, perform step Y. Finally, end the process.',
	);

	useEffect(() => {
		drawFlowchart();
	}, [paragraph]);

	const drawFlowchart = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const padding = 40;
		const stepSpacing = 60;
		const steps = processTextToSteps(paragraph);

		ctx.font = '16px Arial';

		let maxWidth = 300;
		let totalHeight = padding * 2;

		steps.forEach((step) => {
			const { width, height } = measureText(ctx, step.text, maxWidth - 40);
			step['width'] = Math.max(width + 40, 120);
			step['height'] = height + 40;
			maxWidth = Math.max(maxWidth, step['width']);
			totalHeight += step['height'] + stepSpacing;
		});

		canvas.width = maxWidth + padding * 2;
		canvas.height = totalHeight;
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		let x = canvas.width / 2;
		let y = padding;

		steps.forEach((step, i) => {
			const shape = SHAPES[step.type];
			ctx.fillStyle = shape.color;
			ctx.strokeStyle = '#333';
			ctx.lineWidth = 2;

			switch (shape.shape) {
				case 'terminal':
					drawRoundedRect(ctx, x - step.width / 2, y, step.width, step.height, 20);
					break;
				case 'rectangle':
					drawRoundedRect(ctx, x - step.width / 2, y, step.width, step.height, 5);
					break;
				case 'diamond':
					ctx.beginPath();
					ctx.moveTo(x, y);
					ctx.lineTo(x + step.width / 2, y + step.height / 2);
					ctx.lineTo(x, y + step.height);
					ctx.lineTo(x - step.width / 2, y + step.height / 2);
					ctx.closePath();
					ctx.fill();
					ctx.stroke();
					break;
				case 'parallelogram':
					ctx.beginPath();
					ctx.moveTo(x - step.width / 2 + 20, y);
					ctx.lineTo(x + step.width / 2, y);
					ctx.lineTo(x + step.width / 2 - 20, y + step.height);
					ctx.lineTo(x - step.width / 2, y + step.height);
					ctx.closePath();
					ctx.fill();
					ctx.stroke();
					break;
			}

			ctx.fillStyle = 'black';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(step.text, x, y + step.height / 2);

			if (i < steps.length - 1) {
				drawArrow(ctx, x, y + step.height, x, y + step.height + stepSpacing / 2);
				y += step.height + stepSpacing;
			}
		});
	};

	const handleDownload = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const link = document.createElement('a');
		link.download = 'flowchart.png';
		link.href = canvas.toDataURL();
		link.click();
	};

	return (
		<div className="p-4 max-w-5xl mx-auto">
			<h1 className="text-2xl font-bold text-center mb-4">Paragraph to Flowchart</h1>
			<textarea
				ref={inputRef}
				className="w-full h-40 p-2 border border-gray-300 rounded mb-4"
				value={paragraph}
				onChange={(e) => setParagraph(e.target.value)}
			></textarea>
			<div className="flex gap-4 justify-center mb-4">
				<Button onClick={drawFlowchart} className="bg-green-500 text-white px-4 py-2 rounded">
					Generate
				</Button>
				<Button onClick={handleDownload} className="bg-blue-500 text-white px-4 py-2 rounded">
					Download
				</Button>
			</div>
			<div className="overflow-auto border border-gray-300">
				<canvas ref={canvasRef} className="mx-auto" />
			</div>
		</div>
	);
};

export default ParagraphToFlowchart;
