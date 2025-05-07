import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Atom, BadgeCheck, Hammer, ScrollText, Workflow } from 'lucide-react';
import { Link } from 'react-router-dom';

function Header() {
	return (
		<div className="flex justify-between items-center p-4 h-16 sticky top-0 z-10 shadow-md border-b-2 md:px-50 dark:bg-black bg-white">
			<div className="flex gap-3 items-center">
				<Link to="/" className="flex gap-1 items-center">
					<Atom size={25} color="blue" />
					<h1 className="font-bold font-mono tracking-widest text-lg text-blue-700">KRYPTON</h1>
				</Link>
				<div className="flex">
					<Link to="/coditude/problem-statements" className="flex gap-1 items-center">
						<Button variant={'link'} className="text-md text-gray-800">
							<ScrollText />
							Problem Statements
						</Button>
					</Link>
					<Link to="/builder" className="flex gap-1 items-center">
						<Button variant={'link'} className="text-md text-gray-800">
							<Hammer />
							AI Course Builder
						</Button>
					</Link>
					<Link to="/certificate-validation" className="flex gap-1 items-center">
						<Button variant={'link'} className="text-md text-gray-800">
							<BadgeCheck />
							Certificate Validation
						</Button>
					</Link>
					<Link to="/flow-chart" className="flex gap-1 items-center">
						<Button variant={'link'} className="text-md text-gray-800">
							<Workflow />
							Content to Flow Chart
						</Button>
					</Link>
					<Link to="/quiz" className="flex gap-1 items-center">
						<Button variant={'link'} className="text-md text-gray-800">
							<Workflow />
							Quiz
						</Button>
					</Link>
					<Link to="/troy" className="flex gap-1 items-center">
						<Button variant={'link'} className="text-md text-gray-800">
							<Workflow />
							Troy
						</Button>
					</Link>
				</div>
			</div>
			<div className="flex gap-5 items-center">
				{/* <Button className="">
					<Bell />
				</Button>
				<DropdownMenu>
					<DropdownMenuTrigger>
						<div className="border-2  flex gap-3 p-2 rounded-lg items-center dark:bg-black bg-white">
							<Plus size={20} />
							<ChevronDown size={20} />
						</div>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem>
							<Book size={16} /> New repository
						</DropdownMenuItem>
						<DropdownMenuItem>
							<BookCopy size={16} /> Import repository
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<FolderKanban size={16} />
							New Project
						</DropdownMenuItem>
						<DropdownMenuItem>
							<SquareScissors />
							New gist
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu> */}
				<Link to="/login">
					<Avatar className="h-11 w-11 cursor-pointer">
						<AvatarImage src="https://github.com/sakthilkv.png" />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
				</Link>
			</div>
		</div>
	);
}

export default Header;
