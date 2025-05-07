import { useState, useEffect } from 'react';

const CourseModuleTracker = () => {
	const [currentModule, setCurrentModule] = useState(0);
	const [startTimes, setStartTimes] = useState<(Date | null)[]>([]);
	const [endTimes, setEndTimes] = useState<(Date | null)[]>([]);
	const [wordCounts, setWordCounts] = useState<number[]>([]);
	const [showSummary, setShowSummary] = useState(false);
	const [summaryData, setSummaryData] = useState<any>(null);

	const modules = [
		{
			id: 1,
			title: 'Module 1: Introduction',
			content: [
				'This module introduces the basics of reading comprehension, focusing on how reading speed can be increased while still retaining a good level of understanding. The primary goal is to get familiar with the idea that speed reading is not about skipping over information but about processing it faster without losing meaning. Throughout this module, you will practice techniques such as skimming and chunking to understand how quickly you can grasp the main points of the text. The first step is understanding the importance of pacing your reading based on the material. While some texts are better suited to slow, detailed reading, others can be processed more quickly. This skill is essential in a world where time is limited and the ability to absorb information quickly can improve your productivity.',
				'To start, the basic idea behind speed reading is to read faster without losing comprehension. This module covers foundational techniques like eliminating subvocalization, which is the silent pronouncing of words in your mind while reading. Subvocalization slows down your reading speed because your brain is focusing on forming each word rather than processing groups of words. Once you get comfortable with eliminating subvocalization, the next step is to increase your reading speed by expanding your peripheral vision to take in more words at once. This module will serve as a guide to gradually building the skills you need to read faster, with enough time spent on understanding the material.',
			],
		},
		{
			id: 2,
			title: 'Module 2: Intermediate Concepts',
			content: [
				'This module builds upon the basics of speed reading and introduces intermediate strategies. By now, you should be aware of some basic techniques like skimming, chunking, and reducing subvocalization. At this stage, we will dive deeper into applying these strategies to larger and more complex texts. Chunking involves grouping words together to form visual blocks, allowing you to read faster by seeing multiple words in one glance. Similarly, skimming is a technique that helps you to quickly identify the main ideas or points of a text without reading every word. These strategies are especially useful for scanning longer passages of text for information, such as academic papers, articles, and business reports.',
				'Another important concept covered in this module is scanning, which involves quickly searching for specific information or details in a text. Scanning is particularly effective when you are looking for particular data, dates, or terms within a larger body of content. The ability to scan a document efficiently is essential when you need to gather specific facts without getting bogged down by unnecessary details. In addition to these strategies, you will also learn how to pace your reading depending on the type of material. For example, when reading complex material, you may want to slow down and read more carefully, while lighter materials can be skimmed quickly. This module will help you apply these techniques to different contexts for maximum efficiency.',
			],
		},
		{
			id: 3,
			title: 'Module 3: Advanced Techniques',
			content: [
				"Building on the intermediate strategies covered earlier, this module introduces more advanced techniques that will push your reading speed to new heights. The first technique we'll cover is using your peripheral vision to enhance your ability to read multiple words at a time. Most readers tend to focus on individual words, but peripheral vision allows you to capture more content with less effort. By expanding your field of view, you can significantly increase your reading speed. Another technique to explore is minimizing eye fixations. Typically, when reading, your eyes move from one word to the next, often making several stops on each line. The fewer stops you make, the faster you'll be able to read.",
				"Furthermore, this module will introduce the concept of silent reading without subvocalization. Although you may still hear the words in your head, the key is to stop mentally pronouncing every word aloud, which can slow down your reading speed. By eliminating this habit, you will begin to notice a faster pace of reading. Additionally, we'll discuss how to set reading goals. This involves setting specific targets for how many words you want to read in a set time period, pushing yourself to meet those goals, and tracking your progress. It's important to challenge yourself to read faster, but also to maintain comprehension. This module will equip you with the tools needed to read quickly and efficiently without losing your ability to understand the material.",
			],
		},
		{
			id: 4,
			title: 'Module 4: Real-World Scenarios',
			content: [
				"In this module, we'll take the skills you've learned so far and apply them to real-world reading scenarios. Speed reading isn't just for books and academic papers; it's a valuable skill for navigating emails, news articles, reports, and more. The techniques of skimming, scanning, and chunking can be applied to everyday reading tasks, helping you to quickly absorb information and make decisions based on key points. When reading business reports or emails, for instance, you don't always need to read every word. Instead, you can focus on the most important details—facts, figures, conclusions—by skimming the document.",
				"Another key concept in this module is adapting your reading strategy based on the material. For instance, when reading dense, complex material like legal contracts, it's crucial to slow down and read more carefully. On the other hand, lighter materials, such as social media posts or news articles, can often be skimmed for the essential points. Learning when to adjust your pace based on context is an important part of mastering speed reading. In this module, we will explore the different ways you can tailor your reading approach for different types of content to maximize your reading speed while maintaining comprehension and focus.",
			],
		},
		{
			id: 5,
			title: 'Module 5: Final Summary',
			content: [
				"Welcome to the final module of this course! In this section, we will review the key concepts and strategies you've learned throughout the course and provide guidance on how to continue developing your reading skills. We've covered various speed reading techniques, including skimming, chunking, scanning, and eliminating subvocalization. You've also learned how to apply these techniques to different types of reading materials, including books, reports, and emails. As you continue to practice, you'll find that your reading speed will naturally increase while your comprehension remains intact.",
				"To continue improving, it's important to set realistic goals for your reading practice. Try setting specific targets for how much you want to read in a given time period, and challenge yourself to reach those targets. Keep track of your progress and review your goals periodically. Additionally, remember that consistency is key—reading regularly and applying these techniques will lead to long-term improvement. We hope you feel more confident in your ability to read quickly and efficiently, and that you'll continue to practice these techniques to become a more effective reader. Good luck with your future reading endeavors!",
			],
		},
	];

	useEffect(() => {
		const initialStartTimes = Array(modules.length).fill(null);
		const initialEndTimes = Array(modules.length).fill(null);
		const initialWordCounts = modules.map((m) => m.content.join(' ').split(/\s+/).length);

		setStartTimes(initialStartTimes);
		setEndTimes(initialEndTimes);
		setWordCounts(initialWordCounts);
		handleStartModule(0);
	}, []);

	const handleStartModule = (index: number) => {
		setStartTimes((prev) => {
			const updated = [...prev];
			updated[index] = new Date();
			return updated;
		});
		setCurrentModule(index);
	};

	const handleNextModule = (index: number) => {
		setEndTimes((prev) => {
			const updated = [...prev];
			updated[index] = new Date();
			return updated;
		});
		if (index + 1 < modules.length) handleStartModule(index + 1);
	};

	const handleFinishCourse = () => {
		setEndTimes((prev) => {
			const updated = [...prev];
			updated[modules.length - 1] = new Date();
			return updated;
		});
		setTimeout(() => {
			generateSummary();
			setShowSummary(true);
		}, 100);
	};

	const generateSummary = () => {
		let totalTime = 0;
		let totalWPS = 0;
		const wpsList: number[] = [];
		const moduleDetails = [];

		for (let i = 0; i < modules.length; i++) {
			const start = startTimes[i]?.getTime();
			const end = endTimes[i]?.getTime();

			if (!start || !end) continue;

			const timeSpent = (end - start) / 1000;
			const words = wordCounts[i];
			const wps = parseFloat((words / timeSpent).toFixed(2));
			const tpw = (timeSpent / words).toFixed(2);

			wpsList.push(wps);
			totalTime += timeSpent;
			totalWPS += wps;

			moduleDetails.push({
				module: i + 1,
				timeSpent: timeSpent.toFixed(2),
				words,
				timePerWord: tpw,
				wordsPerSecond: wps,
			});
		}

		const avgWPS = totalWPS / wpsList.length;
		const variance =
			wpsList.reduce((sum, val) => sum + Math.pow(val - avgWPS, 2), 0) / wpsList.length;
		const consistency = Math.sqrt(variance).toFixed(2);

		const reader_type =
			avgWPS > 6
				? 'Skimmer (Very Fast Reader)'
				: avgWPS > 3
				? 'Balanced Reader'
				: 'Slow / Deep Reader';
		const behavior =
			parseFloat(consistency) > 1.5 ? 'Inconsistent reading pattern' : 'Consistent engagement';

		const drop_off = (wpsList[wpsList.length - 1] - wpsList[0]).toFixed(2);
		const drop_pattern =
			parseFloat(drop_off) < -2
				? 'Likely lost focus or skipped later modules'
				: parseFloat(drop_off) > 2
				? 'Accelerated reading pace (possible skimming)'
				: 'Steady reading pace';

		setSummaryData({
			moduleDetails,
			avgTime: (totalTime / wpsList.length).toFixed(2),
			avgWPS: avgWPS.toFixed(2),
			reader_type,
			consistency,
			behavior,
			drop_off,
			drop_pattern,
		});
	};

	return (
		<div
			style={{ fontFamily: 'Arial, sans-serif', background: '#1e1e2f', color: '#fff', padding: 20 }}
		>
			<h1>Course Module</h1>

			{modules.map((module, index) => (
				<div
					key={module.id}
					style={{
						display: currentModule === index ? 'block' : 'none',
						marginBottom: 20,
						padding: 15,
						background: '#2c2c3c',
						borderRadius: 10,
					}}
				>
					<h2>{module.title}</h2>
					{module.content.map((paragraph, pIndex) => (
						<p key={pIndex}>{paragraph}</p>
					))}
					<button
						onClick={
							index < modules.length - 1 ? () => handleNextModule(index) : handleFinishCourse
						}
						style={{
							marginTop: 10,
							padding: '10px 20px',
							background: '#00bcd4',
							border: 'none',
							color: 'white',
							cursor: 'pointer',
							borderRadius: 5,
						}}
					>
						{index < modules.length - 1 ? 'Next Module' : 'Finish Course'}
					</button>
				</div>
			))}

			{showSummary && summaryData && (
				<div style={{ marginTop: 30 }}>
					<h2>Summary</h2>
					<p>Average WPS: {summaryData.avgWPS}</p>
					<p>Reader Type: {summaryData.reader_type}</p>
					<p>Consistency: {summaryData.consistency}</p>
					<p>Behavior: {summaryData.behavior}</p>
					<p>Drop-off in WPS: {summaryData.drop_off}</p>
					<p>Drop-off Pattern: {summaryData.drop_pattern}</p>
					<h3>Module Breakdown</h3>
					<ul>
						{summaryData.moduleDetails.map((d: any, i: number) => (
							<li key={i}>
								Module {d.module}: {d.words} words in {d.timeSpent}s → {d.wordsPerSecond} WPS
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default CourseModuleTracker;
