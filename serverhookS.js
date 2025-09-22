const fs = require('fs');
const WebSocket = require('ws');
const path = require('path');
const http = require('http');

const PORT = process.env.PORT || 8080;
const OUTPUT_FILE = path.join(__dirname, 'streamed-audio.raw');

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('WebSocket server is running');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

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

server.listen(PORT, () => {
  console.log(`WebSocket server listening on port ${PORT}`);
});
