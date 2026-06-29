const baseUrl = 'http://localhost:11434';
const apiPath = '/v1/chat/completions';
const model = 'llama3.2:1b';

export async function ask(messages) {
  const response = await fetch(`${baseUrl}${apiPath}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
    }),
  });

  const data = await response.json();

  return data.choices[0].message.content;
}

const messages = [
  { role: 'system', content: 'Answer very brifly, in the best case in just one word' },
  { role: 'user', content: 'What is the capital of France?' }
];



const answer = await ask(messages);
messages.push({ role: 'assistant', content: answer });
console.log('Answer:', answer);

messages.push({ role: 'user', content: 'What about USA?' });

const answerUSA = await ask(messages);
messages.push({ role: 'assistant', content: answerUSA });
console.log('Answer:', answerUSA);