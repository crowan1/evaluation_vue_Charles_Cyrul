import express from 'express';
import {
    getAllClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient
} from '../controllers/clientsController.mjs';

const router = express.Router();

// GET /api/clients - Récupérer tous les clients
router.get('/', getAllClients);

// GET /api/clients/:id - Récupérer un client par ID
router.get('/:id', getClientById);

// POST /api/clients - Créer un nouveau client
router.post('/', createClient);

// PUT /api/clients/:id - Modifier un client
router.put('/:id', updateClient);

// DELETE /api/clients/:id - Supprimer un client
router.delete('/:id', deleteClient);

export default router;