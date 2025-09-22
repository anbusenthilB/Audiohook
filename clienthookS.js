const fs = require('fs');
const WebSocket = require('ws');
const path = require('path');

const SERVER_URL = 'ws://localhost:8080';
const AUDIO_FILE = path.join(__dirname, 'random_audio.raw'); // Use a raw audio file

const ws = new WebSocket(SERVER_URL);

ws.on('open', () => {
  console.log('Connected to server. Streaming audio...');
  const readStream = fs.createReadStream(AUDIO_FILE, { highWaterMark: 4096 });

  readStream.on('data', (chunk) => {
    ws.send(chunk, { binary: true });
  });

  readStream.on('end', () => {
    ws.close();
    console.log('Audio streaming finished.');
  });
});

ws.on('close', () => {
  console.log('Connection closed.');
});

ws.on('error', (err) => {
  console.error('WebSocket error:', err);
});
