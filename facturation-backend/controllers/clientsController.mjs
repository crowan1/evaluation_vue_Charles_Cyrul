import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DB_PATH = path.join(process.cwd(), 'db', 'clients.json');

// Fonctions utilitaires
const readClients = async () => {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erreur lecture clients:', error);
        return [];
    }
};

const writeClients = async (clients) => {
    try {
        await fs.writeFile(DB_PATH, JSON.stringify(clients, null, 2));
        return true;
    } catch (error) {
        console.error('Erreur écriture clients:', error);
        return false;
    }
};

// Contrôleurs
export const getAllClients = async (req, res) => {
    try {
        const clients = await readClients();
        res.json(clients);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des clients' });
    }
};

export const getClientById = async (req, res) => {
    try {
        const clients = await readClients();
        const client = clients.find(c => c.id === req.params.id);

        if (!client) {
            return res.status(404).json({ error: 'Client non trouvé' });
        }

        res.json(client);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du client' });
    }
};

export const createClient = async (req, res) => {
    try {
        const clients = await readClients();
        const nouveauClient = {
            id: uuidv4(),
            ...req.body,
            dateCreation: new Date().toISOString().split('T')[0],
            statut: req.body.statut || 'actif'
        };

        clients.push(nouveauClient);

        const success = await writeClients(clients);
        if (!success) {
            return res.status(500).json({ error: 'Erreur lors de la sauvegarde' });
        }

        res.status(201).json(nouveauClient);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du client' });
    }
};

export const updateClient = async (req, res) => {
    try {
        const clients = await readClients();
        const index = clients.findIndex(c => c.id === req.params.id);

        if (index === -1) {
            return res.status(404).json({ error: 'Client non trouvé' });
        }

        const clientModifie = { ...clients[index], ...req.body };
        clients[index] = clientModifie;

        const success = await writeClients(clients);
        if (!success) {
            return res.status(500).json({ error: 'Erreur lors de la sauvegarde' });
        }

        res.json(clientModifie);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la modification du client' });
    }
};

export const deleteClient = async (req, res) => {
    try {
        const clients = await readClients();
        const index = clients.findIndex(c => c.id === req.params.id);

        if (index === -1) {
            return res.status(404).json({ error: 'Client non trouvé' });
        }

        clients.splice(index, 1);

        const success = await writeClients(clients);
        if (!success) {
            return res.status(500).json({ error: 'Erreur lors de la sauvegarde' });
        }

        res.json({ message: 'Client supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression du client' });
    }
};