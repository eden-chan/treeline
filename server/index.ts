import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || '',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME

// Function to normalize the key
function normalizeKey(url: string): string {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  let filename = pathname.split('/').pop() || 'file';
  filename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  if (!filename.toLowerCase().endsWith('.pdf')) {
    filename += '.pdf';
  }
  const hash = Bun.hash(url).toString(16);
  return `${hash.substring(0, 8)}-${filename}`;
}

// Function to check if file exists and upload if it doesn't
async function checkAndUploadFile(key: string, fileBuffer: Buffer): Promise<boolean> {
  const headParams = {
    Bucket: S3_BUCKET_NAME,
    Key: key,
  };
  try {
    await s3Client.send(new HeadObjectCommand(headParams));
    console.log(`File ${key} already exists in the bucket.`);
    return true;
  } catch (error: any) {
    if (error.name === "NotFound") {
      console.log(`File ${key} does not exist. Uploading...`);
      const command = new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: key,
        Body: fileBuffer,
        ContentType: 'application/pdf'
      });
      await s3Client.send(command);
      console.log(`File ${key} uploaded successfully.`);
      return true;
    }
    throw error;
  }
}

const server = Bun.serve({
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  async fetch(req) {
    // Handle CORS
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Expose-Headers': 'Content-Length, X-Kuma-Revision',
          'Access-Control-Max-Age': '600',
          'Access-Control-Allow-Credentials': 'true',
        },
      });
    }

    const url = new URL(req.url);
    if (url.pathname === '/get-hosted-pdf-url') {
      const fileUrl = url.searchParams.get('url');
      
      if (!fileUrl) {
        return new Response(JSON.stringify({ error: 'No file URL provided' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      try {
        // Download the file
        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const fileBuffer = Buffer.from(await response.arrayBuffer());

        // Generate a normalized key for the file
        const key = normalizeKey(fileUrl);

        // Check if file exists and upload if it doesn't
        await checkAndUploadFile(key, fileBuffer);

        // Generate a presigned URL for the file
        const getObjectParams = {
          Bucket: S3_BUCKET_NAME,
          Key: key
        };
        const presignedUrl = await getSignedUrl(s3Client, new GetObjectCommand(getObjectParams), { expiresIn: 3600 });
        console.log('Presigned URL:', presignedUrl);

        return new Response(JSON.stringify({ url: presignedUrl }), {
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to process the file' }), {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    } else {
      return new Response("Not Found", { status: 404 });
    }
  },
});

console.log(`Server started on http://localhost:${server.port}`);