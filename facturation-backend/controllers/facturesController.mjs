import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DB_PATH = path.join(process.cwd(), 'db', 'factures.json');

// Fonctions utilitaires
const readFactures = async () => {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erreur lecture factures:', error);
        return [];
    }
};

const writeFactures = async (factures) => {
    try {
        await fs.writeFile(DB_PATH, JSON.stringify(factures, null, 2));
        return true;
    } catch (error) {
        console.error('Erreur écriture factures:', error);
        return false;
    }
};

const generateNumeroFacture = (factures) => {
    const year = new Date().getFullYear();
    const count = factures.filter(f => f.numero.includes(year)).length + 1;
    return `FAC-${year}-${count.toString().padStart(3, '0')}`;
};

// Contrôleurs
export const getAllFactures = async (req, res) => {
    try {
        const factures = await readFactures();
        res.json(factures);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des factures' });
    }
};

export const getFactureById = async (req, res) => {
    try {
        const factures = await readFactures();
        const facture = factures.find(f => f.id === req.params.id);

        if (!facture) {
            return res.status(404).json({ error: 'Facture non trouvée' });
        }

        res.json(facture);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de la facture' });
    }
};

export const createFacture = async (req, res) => {
    try {
        const factures = await readFactures();
        const nouvelleFacture = {
            id: uuidv4(),
            numero: generateNumeroFacture(factures),
            ...req.body,
            dateEmission: req.body.dateEmission || new Date().toISOString().split('T')[0]
        };

        // Calcul automatique des montants
        const montantHT = nouvelleFacture.articles?.reduce((sum, article) =>
            sum + (article.quantite * article.prixUnitaire), 0) || 0;
        const tva = montantHT * 0.20;
        const montantTTC = montantHT + tva;

        nouvelleFacture.montantHT = montantHT;
        nouvelleFacture.tva = tva;
        nouvelleFacture.montantTTC = montantTTC;

        factures.push(nouvelleFacture);

        const success = await writeFactures(factures);
        if (!success) {
            return res.status(500).json({ error: 'Erreur lors de la sauvegarde' });
        }

        res.status(201).json(nouvelleFacture);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de la facture' });
    }
};

export const updateFacture = async (req, res) => {
    try {
        const factures = await readFactures();
        const index = factures.findIndex(f => f.id === req.params.id);

        if (index === -1) {
            return res.status(404).json({ error: 'Facture non trouvée' });
        }

        const factureModifiee = { ...factures[index], ...req.body };

        // Recalcul des montants si les articles ont changé
        if (req.body.articles) {
            const montantHT = factureModifiee.articles.reduce((sum, article) =>
                sum + (article.quantite * article.prixUnitaire), 0);
            const tva = montantHT * 0.20;
            const montantTTC = montantHT + tva;

            factureModifiee.montantHT = montantHT;
            factureModifiee.tva = tva;
            factureModifiee.montantTTC = montantTTC;
        }

        factures[index] = factureModifiee;

        const success = await writeFactures(factures);
        if (!success) {
            return res.status(500).json({ error: 'Erreur lors de la sauvegarde' });
        }

        res.json(factureModifiee);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la modification de la facture' });
    }
};

export const deleteFacture = async (req, res) => {
    try {
        const factures = await readFactures();
        const index = factures.findIndex(f => f.id === req.params.id);

        if (index === -1) {
            return res.status(404).json({ error: 'Facture non trouvée' });
        }

        factures.splice(index, 1);

        const success = await writeFactures(factures);
        if (!success) {
            return res.status(500).json({ error: 'Erreur lors de la sauvegarde' });
        }

        res.json({ message: 'Facture supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression de la facture' });
    }
};