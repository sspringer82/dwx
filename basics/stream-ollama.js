import { Readable } from 'node:stream';
import readline from 'node:readline';

const baseUrl = process.env.BASE_URL ?? 'http://localhost:11434';
const apiPath = '/api/chat';
const model = 'llama3.2:1b';

export async function* ask(messages) {
  const response = await fetch(`${baseUrl}${apiPath}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages }),
  });

  const nodeStream = Readable.fromWeb(response.body);

  const lines = readline.createInterface({
    input: nodeStream,
    crlfDelay: Infinity,
  });

  for await (const line of lines) {
    if (line.trim()) {
      const data = JSON.parse(line);
      if (data.message && data.message.content) {
        yield data.message.content;
      }
    }
  }
}
