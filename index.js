import express from "express";
import { create } from "@open-wa/wa-automate";

const app = express();
const PORT = process.env.PORT || 3000;

create({
  sessionId: "render-session",
  headless: true,
  qrTimeout: 0,
  authTimeout: 0,
  cacheEnabled: false
}).then((client) => start(client));

function start(client) {
  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("✅ OpenWA is running on Render!");
  });

  // Example endpoint to send a message
  app.post("/send", async (req, res) => {
    const { to, message } = req.body;
    try {
      await client.sendText(to, message);
      res.json({ status: "sent" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // Example endpoint to fetch messages (you can expand this)
  app.get("/messages", async (req, res) => {
    const chats = await client.getAllChats();
    res.json(chats.map(c => c.name || c.id.user));
  });

  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}
