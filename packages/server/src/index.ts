import express, { Request, Response } from 'express';
import { getUpdates, upgrade } from './controllers/controller';
import cors from 'cors';
import { fetchInfo, getProjects } from './service';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
// middleware that shouws the body raw
app.use(express.text({ type: 'text/plain' }));
app.use(express.json());

app.get('/', async (req: Request, res: Response) => {
    await getUpdates(req, res);
});

app.post('/upgrade', async (req: Request, res: Response) => {
    await upgrade(req, res);
});

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await fetchInfo();
});
