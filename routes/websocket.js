// routes/websocketRoutes.js
const express = require("express");
const WebSocket = require("ws");

function createWebSocketRoutes(clients) {
  const router = express.Router();

  router.post("/ws/:userid", express.json(), async (req, res) => {
    const { userid } = req.params;
    const message = req.body;

    try {
      const client = clients.get(userid);
      if (client && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
        console.log(`✅ Sent message to ${userid}:`, message);
        res.status(200).send("Message sent via WebSocket");
      } else {
        console.warn(`⚠️ WebSocket not connected for ${userid}`);
        res.status(404).send("WebSocket client not connected");
      }
    } catch (e) {
      console.error(`❌ WebSocket error for ${userid}:`, e.message);
      res.status(500).send("WebSocket error");
    }
  });

  return router;
}

module.exports = createWebSocketRoutes;
