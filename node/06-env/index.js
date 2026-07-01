console.log("Node native .env support demo");
console.log("NODE_ENV:", process.env.NODE_ENV ?? "<missing>");
console.log("API_URL:", process.env.API_URL ?? "<missing>");
console.log("FEATURE_FLAG:", process.env.FEATURE_FLAG ?? "<missing>");

const parsedPort = Number.parseInt(process.env.PORT ?? "", 10);
const port = Number.isNaN(parsedPort) ? 3000 : parsedPort;

console.log("PORT (parsed):", port);