import { createReadStream, createWriteStream } from 'node:fs';
import { Readable, Writable } from 'node:stream';
import { TransformStream } from 'node:stream/web';

function createLineEnricherStream() {
  let buffer = '';
  let lineNumber = 0;
  let totalWords = 0;
  let longestLineLength = 0;

  const processLine = (rawLine, controller) => {
    const line = rawLine.replace(/\r$/, '');
    if (!line.trim()) {
      return;
    }

    lineNumber += 1;

    const words = line.trim().split(/\s+/).length;
    const chars = line.length;
    const slug = line
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    totalWords += words;
    longestLineLength = Math.max(longestLineLength, chars);

    const enriched = `${String(lineNumber).padStart(3, '0')} | words:${String(words).padStart(2, '0')} | chars:${String(chars).padStart(3, '0')} | slug:${slug} | ${line}\n`;
    controller.enqueue(enriched);
  };

  return new TransformStream({
    transform(chunk, controller) {
      buffer += chunk;

      let newlineIndex = buffer.indexOf('\n');
      while (newlineIndex !== -1) {
        const line = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);
        processLine(line, controller);
        newlineIndex = buffer.indexOf('\n');
      }
    },
    flush(controller) {
      if (buffer.length > 0) {
        processLine(buffer, controller);
      }

      const summary = [
        '',
        '--- summary ---',
        `lines: ${lineNumber}`,
        `words: ${totalWords}`,
        `longest-line-chars: ${longestLineLength}`,
        '',
      ].join('\n');

      controller.enqueue(summary);
    },
  });
}

const inputPath = new URL('./input.txt', import.meta.url);
const outputPath = new URL('./output.txt', import.meta.url);

const source = Readable.toWeb(createReadStream(inputPath));
const destination = Writable.toWeb(createWriteStream(outputPath));

await source
  .pipeThrough(new TextDecoderStream())
  .pipeThrough(createLineEnricherStream())
  .pipeThrough(new TextEncoderStream())
  .pipeTo(destination);

console.log('Transformed input.txt -> output.txt using Node Web Streams.');
