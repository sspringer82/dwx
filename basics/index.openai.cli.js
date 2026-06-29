import { cliChat } from './cliChat.js';
import { streamOpenai } from './openai.js';

async function handleStreamResult(tokenStream) {
  process.stdout.write('AI: ');
  let result = '';
  for await (const token of tokenStream) {
    const content = token.choices[0].delta.content;
    result += content;
    process.stdout.write(content);
  }
  return result;
}

cliChat(
  "AI Ready! Ask anything (type 'exit' to quit).",
  streamOpenai,
  handleStreamResult,
);
