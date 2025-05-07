import { Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Solver from './pages/coditude/solver';
import Problem from './pages/coditude/problems';
import Chat from './pages/tutor/chat';
import CreateCourse from './pages/Course_Builder/create_course';
import Home from './pages/home';
import CertificateValidation from './pages/validation/certificate_validation';
import FlowchartConverter from './pages/flowchart/FlowchartConverter';
import LoginPage from './pages/auth/loginpage';
import QuizGame from './pages/quizGame/quizGame';
import CourseModuleTracker from './pages/troy/CourseModuleTracker';

function App() {
	return (
		<div>
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/coditude">
					<Route path="problem-statements" element={<Problem />} />
					<Route path="solve/:id" element={<Solver />} />
				</Route>
				<Route path="/tutor" element={<Chat />} />
				<Route path="/builder" element={<CreateCourse />} />
				<Route path="/certificate-validation" element={<CertificateValidation />} />
				<Route path="/flow-chart" element={<FlowchartConverter />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/quiz" element={<QuizGame />} />
				<Route path="/troy" element={<CourseModuleTracker />} />
			</Routes>
		</div>
	);
}

export default App;
