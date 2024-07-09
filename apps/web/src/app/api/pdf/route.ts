export const runtime = 'nodejs';
export const maxDuration = 60;

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  console.log('getting api/pdf')
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  console.log({url})
    console.log({ requestUrl: request.url, url });

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer'
    });

    // Extract filename from the URL or use a default
    const urlParts = url.split('/');
    const filename = urlParts[urlParts.length - 1] || 'document.pdf';

    // Convert ArrayBuffer to Uint8Array
    const uint8Array = new Uint8Array(response.data);

    // Return the Uint8Array data and filename
    return NextResponse.json({
      filename: filename,
      data: Array.from(uint8Array) // Convert Uint8Array to regular array for JSON serialization
    });
  } catch (error) {
    console.error('Error fetching PDF:', error);
    return NextResponse.json(
      { error: 'Failed to fetch PDF' },
      { status: 500 }
    );
  }
}