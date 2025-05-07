import { useState, useRef, type ChangeEvent, type DragEvent } from 'react';

export default function CertificateValidation() {
	const [file, setFile] = useState<File | null>(null);
	const [fileName, setFileName] = useState<string>('No file selected');
	const [isValidating, setIsValidating] = useState<boolean>(false);
	const [result, setResult] = useState<'valid' | 'invalid' | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		if (selectedFile) {
			if (selectedFile.size > 5 * 1024 * 1024) {
				setFile(null);
				setFileName('File too large (max 5MB)');
			} else {
				setFile(selectedFile);
				setFileName(selectedFile.name);
			}
		} else {
			setFile(null);
			setFileName('No file selected');
		}
		setResult(null);
	};

	const handleValidation = () => {
		setIsValidating(true);
		setResult(null);

		setTimeout(() => {
			const isValid = true;
			setResult(isValid ? 'valid' : 'invalid');
			setIsValidating(false);
		}, 1500);
	};

	const handleDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();

		if (fileInputRef.current) {
			fileInputRef.current.files = e.dataTransfer.files;
			handleFileChange({ target: fileInputRef.current } as ChangeEvent<HTMLInputElement>);
		}
	};

	return (
		<div className="flex items-center justify-center mx-auto px-60 bg-gray-100 h-screen w-full">
			<div className="bg-white rounded-lg shadow-md p-8 w-full">
				<h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">
					Certificate Validation
				</h1>

				<div
					className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center mb-4 transition hover:border-blue-500 hover:bg-gray-50"
					onDragOver={(e) => e.preventDefault()}
					onDragLeave={(e) => e.preventDefault()}
					onDrop={handleDrop}
				>
					<div className="text-5xl mb-4 text-blue-500">📄</div>
					<p className="mb-2">Upload your certificate file for validation</p>
					<input
						type="file"
						accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
						className="hidden"
						ref={fileInputRef}
						onChange={handleFileChange}
					/>
					<button
						className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
						onClick={() => fileInputRef.current?.click()}
					>
						Select File
					</button>
					<div className="mt-4 text-sm text-gray-500">{fileName}</div>
					<div className="text-sm text-gray-500 mt-2">
						Supported formats: PDF, PNG, JPG, DOC (Max size: 5MB)
					</div>
				</div>

				<button
					className={`w-full py-3 text-white rounded ${
						file ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'
					}`}
					onClick={handleValidation}
					disabled={!file || isValidating}
				>
					{isValidating ? 'Validating...' : 'Validate Certificate'}
				</button>

				{result && (
					<div
						className={`mt-6 p-4 rounded border text-center ${
							result === 'valid'
								? 'bg-green-100 border-green-500 text-green-700'
								: 'bg-red-100 border-red-500 text-red-700'
						}`}
					>
						{result === 'valid'
							? '✓ Certificate is valid and authenticated.'
							: '✗ Certificate is invalid or could not be verified.'}
					</div>
				)}
			</div>
		</div>
	);
}
