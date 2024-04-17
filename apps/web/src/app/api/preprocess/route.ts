export async function POST(req: Request) {
  const { pdf_url } = await req.json();
  try {
    const response = await fetch(
      `${process.env.PREPROCESSOR_URL}/process_pdf`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pdf_url }),
      }
    );
    if (!response.ok) {
      console.error("Failed to process PDF:", response.statusText);
      return new Response(null, { status: 500 });
    }
    const result = await response.json();
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch: ", error);
    return new Response(null, { status: 500 });
  }
}
