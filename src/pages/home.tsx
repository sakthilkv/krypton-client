import { Button } from '@/components/ui/button';
import { ArrowUpRight, Badge, BadgeCheck, Hammer, ScrollText, Workflow } from 'lucide-react';
import hero from '@/assets/hero.jpg';
import { Link } from 'react-router-dom';

const features = [
	{
		icon: ScrollText,
		title: 'Coditude: Coding Platform',
		description: 'Learn beginner to advanced level Computer Science thru story telling and coding.',
		link: '/coditude/problem-statements',
	},
	{
		icon: Hammer,
		title: 'AI Course Builder',
		description: 'Build your custom tailorised course module in seconds.',
		link: '/builder',
	},
	{
		icon: BadgeCheck,
		title: 'Certificate Validation',
		description: "Validate your certificates to verify it's authenticity.",
		link: '/certificate-validation',
	},
	{
		icon: Workflow,
		title: 'Content to FlowChart',
		description:
			'Turn your long and detailed content into minimalistic flowchart of easy understanding.',
		link: '/flow-chart',
	},
];

function Home() {
	return (
		<div className="flex flex-col gap-3 h-screen w-full">
			<div className="h-screen flex flex-col items-center justify-center">
				<div className="h-screen items-center max-w-screen-xl w-full mx-auto grid lg:grid-cols-2 gap-12 px-6 py-12">
					<div>
						<Badge className="bg-gradient-to-br via-70% from-primary via-muted/30 to-primary rounded-full py-1 border-none">
							Just released v1.0.0
						</Badge>
						<h1 className="mt-6  text-4xl md:text-5xl lg:text-[2.75rem] xl:text-5xl font-bold !leading-[1.2]">
							An E-Learning Platform that bridges the gap between user and content.
						</h1>
						<p className="mt-6 max-w-[60ch] text-lg">
							Krypton provides multiple modules to help students learn computer science concepts
							like Stack to Operating System, All In One Platform.
						</p>
						<div className="mt-12 flex items-center gap-4">
							<Button size="lg" className="rounded-full text-base">
								Get Started <ArrowUpRight className="!h-5 !w-5" />
							</Button>
							<Button variant="outline" size="lg" className="rounded-full text-base shadow-none">
								<Hammer className="!h-5 !w-5" /> AI Course Builder
							</Button>
						</div>
					</div>
					<div className="w-full aspect-video bg-accent rounded-xl">
						<img src={hero} alt="" />
					</div>
				</div>
			</div>
			<div className="mt-[-80px]">
				<h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-center">
					Unleash Your Creativity
				</h2>
				<div className="mt-10 sm:mt-16 grid sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-screen-lg mx-auto px-6">
					{features.map((feature) => (
						<Link to={feature.link}>
							<div key={feature.title} className="flex flex-col border rounded-xl py-6 px-5">
								<div className="mb-3 h-10 w-10 flex items-center justify-center bg-muted rounded-full">
									<feature.icon className="h-6 w-6" />
								</div>
								<span className="text-lg font-semibold">{feature.title}</span>
								<p className="mt-1 text-foreground/80 text-[15px]">{feature.description}</p>
							</div>
						</Link>
					))}
				</div>
			</div>
			<div className="h-52">.</div>
		</div>
	);
}

export default Home;
