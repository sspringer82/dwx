import express from 'express';
import path from 'node:path';
import { ChatOpenAI } from '@langchain/openai';
import {
  RunnableSequence,
  RunnableWithMessageHistory,
  RunnableLambda,
} from '@langchain/core/runnables';
import { InMemoryChatMessageHistory } from '@langchain/core/chat_history';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { ChatMessageHistory } from '@langchain/community/stores/message/in_memory';
import { HumanMessage, AIMessage } from '@langchain/core/messages';

const app = express();
const port = process.env.PORT || 3001;
const publicDir = path.join(import.meta.dirname, 'public');

app.use(express.json());
app.use(express.static(publicDir));

// --- Memory Store ------------------------------------------------------------

const sessions = new Map();

function getMessageHistory(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, new ChatMessageHistory());
  }
  return sessions.get(sessionId);
}

// --- LangChain Model ---------------------------------------------------------

const model = new ChatOpenAI({
  configuration: {
    baseURL: 'http://localhost:11434/v1',
  },
  apiKey: 'ollama',
  model: 'llama3.2:1b',
});

// --- Base Pipeline -----------------------------------------------------------
const prompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    'You are a helpful AI.',
  ],
  new MessagesPlaceholder('history'),
  ['user', '{question}'],
]);

const baseChain = prompt.pipe(model);

const histories = new Map();

const chainWithHistory = new RunnableWithMessageHistory({
  runnable: baseChain,
  getMessageHistory: (sessionId) => {
    if (!histories.has(sessionId)) {
      histories.set(sessionId, new InMemoryChatMessageHistory());
    }

    return histories.get(sessionId);
  },
  inputMessagesKey: 'question',
  historyMessagesKey: 'history',
});

// --- Express Endpoint --------------------------------------------------------

app.post('/api/chat', async (req, res) => {
  const prompt = req.body?.prompt?.trim();
  const sessionId = req.body?.sessionId || 'default';

  if (!prompt) {
    res.status(400).json({ error: 'Prompt is required.' });
    return;
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Transfer-Encoding', 'chunked');

  try {
    const stream = await chainWithHistory.stream(
      { question: prompt },
      { configurable: { sessionId } },
    );

    for await (const chunk of stream) {
      if (chunk?.content) {
        res.write(chunk.content);
      }
    }

    res.end();
  } catch (err) {
    console.error('Chat request failed:', err);

    if (!res.headersSent) {
      res.status(500).json({ error: 'Could not reach Ollama.' });
      return;
    }

    res.write('\n\n[Error: Could not reach Ollama.]');
    res.end();
  }
});

// --- Start -------------------------------------------------------------------

app.listen(port, () => {
  console.log(`Chat app running at http://localhost:${port}`);
});
