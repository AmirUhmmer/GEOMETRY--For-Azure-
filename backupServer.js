const express = require('express');
const session = require('cookie-session');
const path = require('path');
const { PORT, SERVER_SESSION_SECRET } = require('./config.js');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app); // <-- Use raw HTTP server

// 📒 Store all WebSocket clients by user ID
const clients = new Map();

// Setting cookies in Express
app.use(session({
  secret: SERVER_SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    secure: true,
    sameSite: 'None',
  }
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./routes/auth.js'));
app.use(require('./routes/hubs.js'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// ✅ Setup WebSocket server
const wss = new WebSocket.Server({ server, path: '/ws' });

wss.on('connection', (ws, req) => {
  console.log('🟢 WebSocket client connected');

  ws.on('message', (message) => {
    console.log('📩 Received:', message.toString());
    ws.send('Echo: ' + message);
  });

  ws.on('close', () => {
    console.log('🔴 WebSocket client disconnected');
  });
});

// ✅ Start server (HTTP + WS)
server.listen(PORT, () => console.log(`Server + WS listening on port ${PORT}...`));












// const express = require('express');
// const session = require('cookie-session');
// const path = require('path');
// const { PORT, SERVER_SESSION_SECRET } = require('./config.js');
// const http = require('http');
// const WebSocket = require('ws');

// const app = express();
// const server = http.createServer(app); // <-- Use raw HTTP server


// // Setting cookies in Express
// app.use(session({
//   secret: SERVER_SESSION_SECRET,
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     maxAge: 24 * 60 * 60 * 1000,
//     secure: true,
//     sameSite: 'None',
//   }
// }));

// app.use(express.static(path.join(__dirname, 'public')));

// app.use(require('./routes/auth.js'));
// app.use(require('./routes/hubs.js'));

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something went wrong!');
// });

// // ✅ Setup WebSocket server
// const wss = new WebSocket.Server({ server, path: '/ws' });

// wss.on('connection', (ws, req) => {
//   console.log('🟢 WebSocket client connected');

//   ws.on('message', (message) => {
//     console.log('📩 Received:', message.toString());
//     ws.send('Echo: ' + message);
//   });

//   ws.on('close', () => {
//     console.log('🔴 WebSocket client disconnected');
//   });
// });

// // ✅ Start server (HTTP + WS)
// server.listen(PORT, () => console.log(`Server + WS listening on port ${PORT}...`));
