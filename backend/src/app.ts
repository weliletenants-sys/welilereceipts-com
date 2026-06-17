import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import fs from 'fs';

import authRoutes from './routes/auth.routes';
import walletsRoutes from './routes/wallets.routes';
import rentRequestsRoutes from './routes/rent-requests.routes';
import applicationsRoutes from './routes/applications.routes';
import uploadRoutes from './routes/upload.routes';
import supporterRoutes from './routes/supporter.routes';
import tenantRoutes from './routes/tenant.routes';
import agentRoutes from './routes/agent.routes';
import cfoRoutes from './routes/cfo.routes';
import tenantOpsRoutes from './routes/tenant-ops.routes';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}
app.use('/uploads', express.static('uploads'));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/wallets', walletsRoutes);
app.use('/rent-requests', rentRequestsRoutes);
app.use('/applications', applicationsRoutes);
app.use('/upload', uploadRoutes);
app.use('/supporter', supporterRoutes);
app.use('/tenant', tenantRoutes);
app.use('/agent', agentRoutes);
app.use('/cfo', cfoRoutes);
app.use('/tenant-ops', tenantOpsRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

export default app;
