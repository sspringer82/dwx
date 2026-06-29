import { writeFileSync } from 'fs';
import { StateGraph, START, END, Annotation } from '@langchain/langgraph';

const GraphState = Annotation.Root({
  text: Annotation(),
});

function uppercaseNode(state) {
  return { text: state.text.toUpperCase() };
}

function reverse(state) {
  return { text: state.text.split('').reverse().join('') };
}

const workflow = new StateGraph(GraphState)

  .addNode('transformer', uppercaseNode)
  .addNode('reverser', reverse)

  .addEdge(START, 'transformer')
  .addEdge('transformer', 'reverser')
  .addEdge('reverser', END);

const graph = workflow.compile();
const result = await graph.invoke({ text: 'hello langgraph js' });

console.log(result.text);

const pngBlob = await graph.getGraph().drawMermaidPng();
const pngBuffer = Buffer.from(await pngBlob.arrayBuffer());
writeFileSync('graph.png', pngBuffer);
console.log('graph.png saved');
