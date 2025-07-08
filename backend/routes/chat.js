// backend/routes/chat.js
import express from 'express';
import Bot from '../models/Bot.js';
import { processFlow } from '../engine/flowEngine.js'; // Your execution logic

const router = express.Router();

router.post('/:botId', async (req, res) => {
  try {
    const bot = await Bot.findById(req.params.botId);
    if (!bot) return res.status(404).end();
    
    const response = await processFlow({
      flow: bot.flow,
      input: req.body.message,
      session: req.session // Maintain session state
    });

    res.json({ response });
  } catch (err) {
    res.status(500).json({ error: 'Execution failed' });
  }
});
