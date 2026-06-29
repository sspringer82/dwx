import { streamOpenai } from './openai.js';

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

try {
  const tokenStream = await streamOpenai(messages);

  process.stdout.write('Streaming response from OpenAI: ');
  for await (const token of tokenStream) {
    const content = token.choices[0].delta.content;
    process.stdout.write(content);
  }
  console.log('\n');
} catch (error) {
  console.error('Error while streaming OpenAI:', error);
}
