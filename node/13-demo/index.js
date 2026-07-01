import { Readable } from 'node:stream';
import readline from 'node:readline';

const baseUrl = process.env.LLM_BASE_URL ?? 'http://localhost:11434';
const apiPath = process.env.LLM_API_PATH ?? '/v1/chat/completions';
const model = process.env.LLM_MODEL ?? 'llama3.2:1b';

export async function* ask(messages) {
  const response = await fetch(`${baseUrl}${apiPath}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
    }),
  });

  const nodeStream = Readable.fromWeb(response.body);

  const lines = readline.createInterface({
    input: nodeStream,
    crlfDelay: Infinity,
  });

  for await (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed === 'data: [DONE]') {
      continue;
    }

    if (trimmed.startsWith('data: ')) {
      const jsonStr = trimmed.slice(6);

      try {
        const data = JSON.parse(jsonStr);
        const token = data.choices[0]?.delta?.content;

        if (token) {
          yield token;
        }
      } catch (err) {
        console.error('Error parsing stream chunk:', err);
      }
    }
  }
}

const messages = [
  {
    role: 'system',
    content: 'You are a helpful and concise geography expert.',
  },
  { role: 'user', content: 'What is the capital of France?' },
];

try {
  const tokenStream = ask(messages);

  process.stdout.write('Streaming response from OpenAI: ');
  for await (const token of tokenStream) {
    process.stdout.write(token);
  }
  console.log('\n');
} catch (error) {
  console.error('Error while streaming OpenAI:', error);
}
