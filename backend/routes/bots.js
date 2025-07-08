// backend/routes/bots.js
import express from 'express';
import Bot from '../models/Bot.js';

const router = express.Router();

// Middleware to verify JWT
const authenticate = (req, res, next) => {
  // ... JWT verification logic
};

router.get('/:id', authenticate, async (req, res) => {
  try {
    const bot = await Bot.findById(req.params.id);
    if (!bot) return res.status(404).end();
    res.json(bot);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const updatedBot = await Bot.findByIdAndUpdate(
      req.params.id,
      { flow: req.body.flow },
      { new: true }
    );
    res.json(updatedBot);
  } catch (err) {
    res.status(500).json({ error: 'Save failed' });
  }
});
