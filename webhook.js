// pages/api/telegram/webhook.js
export default function handler(req, res) {
  if (req.method === 'POST') {
    // process telegram updates here
    // e.g. console.log(req.body)
    res.status(200).json({ ok: true });
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
