import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { UserType } from '../types/user.type';

class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async registerUser(req: Request, res: Response) {
    try {
      const { firebaseUid, email, userType, phone, bio, address } = req.body;
      console.log('Registering user:', { firebaseUid, email, userType, phone, bio, address });

      if (!firebaseUid || !email) {
        console.error('Missing required fields:', { firebaseUid, email });
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const user = await this.userService.createUser(firebaseUid, email, userType as UserType | undefined, phone, bio, address);
      console.log('User registration successful:', user);
      return res.status(200).json(user);
    } catch (error) {
      console.error('Error registering user:', error);
      
      // Handle specific Prisma errors
      if (error.code === 'P2002') {
        return res.status(200).json({ 
          message: 'User already exists',
          user: await this.userService.getUserById(req.body.firebaseUid)
        });
      }
      
      return res.status(500).json({ 
        error: 'Failed to register user',
        details: error.message
      });
    }
  }
}

export default UserController; 
import { UserService } from '../services/user.service';
import { UserType } from '../types/user.type';

class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async registerUser(req: Request, res: Response) {
    try {
      const { firebaseUid, email, userType, phone, bio, address } = req.body;
      console.log('Registering user:', { firebaseUid, email, userType, phone, bio, address });

      if (!firebaseUid || !email) {
        console.error('Missing required fields:', { firebaseUid, email });
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const user = await this.userService.createUser(firebaseUid, email, userType as UserType | undefined, phone, bio, address);
      console.log('User registration successful:', user);
      return res.status(200).json(user);
    } catch (error) {
      console.error('Error registering user:', error);
      
      // Handle specific Prisma errors
      if (error.code === 'P2002') {
        return res.status(200).json({ 
          message: 'User already exists',
          user: await this.userService.getUserById(req.body.firebaseUid)
        });
      }
      
      return res.status(500).json({ 
        error: 'Failed to register user',
        details: error.message
      });
    }
  }
}

export default UserController; 
 