import OpenAI from 'openai';


export async function POST(req) {
    const body = await req.text();  
    console.log(body)
    const openai = new OpenAI();
    const stream = openai.beta.chat.completions.stream({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: [{ role: 'user', content: body }],
    });

    return new Response(stream.toReadableStream());
  }