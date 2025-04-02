import { Router } from 'express';
import { getPlayers, getPlayerById, createPlayer } from '../controllers/playerController';

const router = Router();

// Player routes
router.get('/api/players', getPlayers);
router.get('/api/players/:id', getPlayerById);
router.post('/api/players', createPlayer);

export default router; 