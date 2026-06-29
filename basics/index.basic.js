import { ask as askOllama } from './http-ollama.js';
import { ask as streamOllama } from './stream-ollama.js';
import { ask as askOpenAI } from './http-openai.js';
import { ask as streamOpenai } from './stream-openai.js';

const messages = [
  {
    role: 'system',
    content: `
You always answer with the name of a city. 
Answer in JSON: {"city": "city name", "country": "country name"}
`,
  },
  { role: 'user', content: 'What is the capital of France?' },
];

// --- 1. HTTP Ollama Native (/api/chat) ---
try {
  const resultHttpOllama = await askOllama(messages);
  console.log('Result from Ollama:', resultHttpOllama);
} catch (error) {
  console.error('Error while asking ollama:', error);
}

// --- 2. Streaming Ollama Native (/api/chat) ---
try {
  const ollamaStream = streamOllama(messages);

  process.stdout.write('Streaming response from Ollama: ');
  for await (const token of ollamaStream) {
    process.stdout.write(token);
  }
  console.log('\n');
} catch (error) {
  console.error('Error while streaming ollama:', error);
}

// --- 3. HTTP OpenAI Compatible (/v1/chat/completions) ---
try {
  const resultHttpOpenAI = await askOpenAI(messages);
  console.log('Result from OpenAI:', resultHttpOpenAI);
} catch (error) {
  console.error('Error while asking OpenAI:', error);
}

// --- 4. Streaming OpenAI Compatible (/v1/chat/completions) ---
try {
  const tokenStream = streamOpenai(messages);

  process.stdout.write('Streaming response from OpenAI: ');
  for await (const token of tokenStream) {
    process.stdout.write(token);
  }
  console.log('\n');
} catch (error) {
  console.error('Error while streaming OpenAI:', error);
}
