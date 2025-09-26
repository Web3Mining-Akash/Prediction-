// Vercel Serverless Function - issues JWTs
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }
    const body = req.body || {};
    const userId = body.userId || 'guest';
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ error: 'JWT_SECRET not configured on server' });
      return;
    }
    const token = jwt.sign({ sub: userId }, secret, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
