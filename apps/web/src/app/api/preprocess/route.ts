// app/api/upload.ts
import { NextRequest, NextResponse } from "next/server";
import {
	S3Client,
	PutObjectCommand,
	HeadObjectCommand,
} from "@aws-sdk/client-s3";
import axios from "axios";

const s3 = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
	},
});

export async function POST(req: NextRequest) {
	const { pdf_url } = await req.json();

	try {
		// Fetch the PDF file
		const response = await axios.get(pdf_url, {
			responseType: "arraybuffer",
		});
		const pdfData = Buffer.from(response.data);

		// Upload the PDF to S3
		const key = pdf_url.substring(pdf_url.lastIndexOf("/") + 1); // Extract the PDF ID from the URL
		if (!key.endsWith(".pdf")) {
			throw new Error("URL does not point to a valid PDF file");
		}
		// Define parameters for the S3 head object request
		const headParams = {
			Bucket: "treeline",
			Key: key,
		};
		try {
			// Attempt to retrieve metadata for the object to check its existence
			await s3.send(new HeadObjectCommand(headParams));
			// If the file exists, this line will execute without error
			return NextResponse.json({ message: "PDF exists", fileExisted: true });
		} catch (error) {
			// Handle errors during the head object command
			if ((error as { name: string }).name === "NotFound") {
				// If the file does not exist, it will throw an error with the message 'NotFound'
				// Prepare to upload the file since it does not exist
				const command = new PutObjectCommand({
					Bucket: "treeline",
					Key: key,
					Body: pdfData,
				});
				// Upload the PDF data to S3
				await s3.send(command);
			} else {
				// Rethrow the error if it is not a 'NotFound' error
				throw error;
			}
		}

		return NextResponse.json({
			message: "PDF uploaded successfully",
			fileExisted: false,
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Failed to upload PDF" },
			{ status: 500 },
		);
	}
}
