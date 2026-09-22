import type { Request, Response } from 'express';
import express from 'express';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
