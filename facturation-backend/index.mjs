import express from 'express';
import cors from 'cors';
import facturesRoutes from './routes/factures.mjs';
import clientsRoutes from './routes/clients.mjs';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/factures', facturesRoutes);
app.use('/api/clients', clientsRoutes);

// Route de base
app.get('/', (req, res) => {
    res.json({
        message: 'API de gestion de factures',
        version: '1.0.0',
        endpoints: {
            factures: '/api/factures',
            clients: '/api/clients'
        }
    });
});

app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route non trouvée',
        path: req.originalUrl
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Erreur interne du serveur',
        message: err.message
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📖 API disponible sur http://localhost:${PORT}`);
});