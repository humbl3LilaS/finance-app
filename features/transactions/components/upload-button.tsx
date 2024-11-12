import { IInitialCvsState } from "@/app/(dashboard)/transactions/page";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useCSVReader } from "react-papaparse";

type UploadButtonProps = {
	onUpload: (result: IInitialCvsState) => void;
};

const UploadButton = ({ onUpload }: UploadButtonProps) => {
	const { CSVReader } = useCSVReader();

	return (
		<CSVReader onUploadAccepted={onUpload}>
			{
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				({ getRootProps }: any) => (
					<Button {...getRootProps()}>
						<Upload className={"mr-2"} /> <span>Import</span>
					</Button>
				)
			}
		</CSVReader>
	);
};

export default UploadButton;
