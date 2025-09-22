const fs = require('fs');
const WebSocket = require('ws');
const path = require('path');

const PORT = 8080;
const OUTPUT_FILE = path.join(__dirname, 'streamed-audio.raw');

const wss = new WebSocket.Server({ port: PORT });

console.log(`WebSocket audio server listening on ws://localhost:${PORT}`);

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Create a write stream for each connection
  const writeStream = fs.createWriteStream(OUTPUT_FILE);

  ws.on('message', (data, isBinary) => {
    if (isBinary) {
      writeStream.write(data);
    }
  });

  ws.on('close', () => {
    writeStream.end();
    console.log('Client disconnected, audio file saved.');
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
    writeStream.end();
  });
});
