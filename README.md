# Hallo Welt

## Pausen

- 09:00         Start
- 10:45 - 11:15 Kaffeepause
- 13:00 - 14:00 Mittagspause
- 15:45 - 16:15 Kaffeepause
- 18:00         Ende

## WLAN

Name: DWX26_Attendee
PW: EnjoyDWX26

## Repo

https://github.com/sspringer82/dwx

## Links
- https://ollama.com/ ⭐
- https://github.com/ggml-org/llama.cpp
- https://lmstudio.ai/
- https://vllm.ai/
- https://openwebui.com/
- https://platform.openai.com/tokenizer
- Adobe NoLiMa Context: https://arxiv.org/abs/2502.05167
- https://github.com/adobe-research/NoLiMa
- MCP: https://modelcontextprotocol.io/docs/getting-started/intro
  - https://developer.chrome.com/blog/chrome-devtools-mcp
  - https://playwright.dev/docs/getting-started-mcp
  - https://github.com/github/github-mcp-server
  - https://github.com/atlassian/atlassian-mcp-server
- Skills: https://agentskills.io/home
- MCP TS SDK: https://github.com/modelcontextprotocol/typescript-sdk/blob/main/README.md
- https://www.langchain.com/blog/langgraph-studio-the-first-agent-ide


## ollama commands
- ollama ls => liste der lokalen Modelle
- ollama run llama3.2:1b => lädt Modell und stellt Prompt zur Verfügung
- ollama ps => zeigt die aktuell ausgeführten Modelle
- ollama pull llama3.2:1b => lädt das angegebene Modell herunter

## basic example with env support
node --env-file=.env index.basic.js

## MCP Inspector

npx @modelcontextprotocol/inspector


// RAG
// Server Debugging