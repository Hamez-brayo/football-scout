import express from 'express';
import { authenticateUser, AuthRequest } from '../middleware/auth';
import prisma from '../config/prisma';
import { storage } from '../config/firebase';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Upload media
router.post('/upload', authenticateUser, async (req: AuthRequest, res) => {
  try {
    const { file, type, title, description } = req.body;
    const userId = req.user!.uid;

    if (!file || !type) {
      return res.status(400).json({ error: 'File and type are required' });
    }

    // Generate a unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = `users/${userId}/media/${fileName}`;

    // Upload to Firebase Storage
    const bucket = storage.bucket();
    const fileUpload = bucket.file(filePath);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.type,
      },
    });

    // Handle upload errors
    stream.on('error', (error) => {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Failed to upload file' });
    });

    // Handle successful upload
    stream.on('finish', async () => {
      try {
        // Get the public URL
        const [url] = await fileUpload.getSignedUrl({
          action: 'read',
          expires: '03-01-2500', // Far future date
        });

        // Create media record in database
        const media = await prisma.media.create({
          data: {
            userId,
            type,
            url,
            title,
            description,
          },
        });

        res.json(media);
      } catch (error) {
        console.error('Error creating media record:', error);
        res.status(500).json({ error: 'Failed to create media record' });
      }
    });

    // Write the file
    stream.end(file.buffer);
  } catch (error) {
    console.error('Media upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's media
router.get('/user/:userId', authenticateUser, async (req: AuthRequest, res) => {
  try {
    const { userId } = req.params;

    // Verify user is requesting their own media
    if (userId !== req.user!.uid) {
      return res.status(403).json({ error: 'Unauthorized to access this media' });
    }

    const media = await prisma.media.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(media);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete media
router.delete('/:mediaId', authenticateUser, async (req: AuthRequest, res) => {
  try {
    const { mediaId } = req.params;
    const userId = req.user!.uid;

    // Get media record
    const media = await prisma.media.findUnique({
      where: { id: mediaId },
    });

    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    // Verify user owns the media
    if (media.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized to delete this media' });
    }

    // Delete from Firebase Storage
    const bucket = storage.bucket();
    const filePath = media.url.split('/').pop();
    if (filePath) {
      await bucket.file(`users/${userId}/media/${filePath}`).delete();
    }

    // Delete from database
    await prisma.media.delete({
      where: { id: mediaId },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 