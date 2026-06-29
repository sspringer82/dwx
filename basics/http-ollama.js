const baseUrl = 'http://localhost:11434';
const apiPath = '/api/chat';
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
  return data.message.content;
}
