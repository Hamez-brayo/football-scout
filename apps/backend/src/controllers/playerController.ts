import { Request, Response } from 'express';
import prisma from '../config/database';

export const getPlayers = async (req: Request, res: Response) => {
  try {
    const players = await prisma.player.findMany({
      include: {
        stats: true,
      },
    });
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching players' });
  }
};

export const getPlayerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const player = await prisma.player.findUnique({
      where: { id: Number(id) },
      include: {
        stats: true,
      },
    });
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching player' });
  }
};

export const createPlayer = async (req: Request, res: Response) => {
  try {
    const { name, position, age, nationality, club, stats } = req.body;
    const player = await prisma.player.create({
      data: {
        name,
        position,
        age,
        nationality,
        club,
        stats: stats ? {
          create: stats
        } : undefined
      },
      include: {
        stats: true,
      },
    });
    res.status(201).json(player);
  } catch (error) {
    res.status(500).json({ error: 'Error creating player' });
  }
}; 