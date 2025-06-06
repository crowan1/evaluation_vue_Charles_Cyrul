import express from 'express';
import {
    getAllFactures,
    getFactureById,
    createFacture,
    updateFacture,
    deleteFacture
} from '../controllers/facturesController.mjs';

const router = express.Router();

// GET /api/factures - Récupérer toutes les factures
router.get('/', getAllFactures);

// GET /api/factures/:id - Récupérer une facture par ID
router.get('/:id', getFactureById);

// POST /api/factures - Créer une nouvelle facture
router.post('/', createFacture);

// PUT /api/factures/:id - Modifier une facture
router.put('/:id', updateFacture);

// DELETE /api/factures/:id - Supprimer une facture
router.delete('/:id', deleteFacture);

export default router;