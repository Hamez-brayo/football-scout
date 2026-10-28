import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  NetworkProfileSchema,
  NetworkOrganisationSchema,
  NetworkPostSchema,
  NetworkOpportunitySchema,
} from '@vysion/shared';
import { authenticate, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { networkService as service } from './service';

const router = Router();
router.use(authenticate);
function handle(action: (req: AuthRequest, actor: string) => Promise<unknown>, status = 200) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError(401, 'UNAUTHORIZED', 'Authentication required'));
      return;
    }
    action(req, req.user.id)
      .then((data) =>
        res.status(status).json({
          success: true,
          data,
          timestamp: new Date().toISOString(),
        }),
      )
      .catch(next);
  };
}
router.get(
  '/me',
  handle((req, actor) => service.profile(actor, actor)),
);
router.patch(
  '/me',
  handle((req, actor) => service.updateProfile(actor, NetworkProfileSchema.parse(req.body))),
);
router.get(
  '/profiles',
  handle((req, actor) =>
    service.profiles(
      actor,
      req.query,
      z.string().trim().max(120).optional().parse(req.query.search),
    ),
  ),
);
router.get(
  '/profiles/:id',
  handle((req, actor) => service.profile(req.params.id, actor)),
);
router.get(
  '/organisations',
  handle((req, actor) => service.organisations(actor, req.query)),
);
router.post(
  '/organisations',
  handle(
    (req, actor) => service.createOrganisation(actor, NetworkOrganisationSchema.parse(req.body)),
    201,
  ),
);
router.get(
  '/organisations/:id',
  handle((req, actor) => service.organisation(req.params.id, actor)),
);
router.patch(
  '/organisations/:id',
  handle((req, actor) =>
    service.updateOrganisation(
      req.params.id,
      actor,
      NetworkOrganisationSchema.partial().parse(req.body),
    ),
  ),
);
router.patch(
  '/organisations/:id/membership',
  handle((req, actor) =>
    service.membership(
      req.params.id,
      actor,
      z.object({ joined: z.boolean() }).strict().parse(req.body).joined,
    ),
  ),
);
router.get(
  '/connections',
  handle((req, actor) => service.connections(actor, req.query)),
);
router.post(
  '/connections',
  handle(
    (req, actor) =>
      service.requestConnection(
        actor,
        z
          .object({ recipientId: z.string().min(1).max(100) })
          .strict()
          .parse(req.body).recipientId,
      ),
    201,
  ),
);
router.patch(
  '/connections/:id',
  handle((req, actor) =>
    service.respondConnection(
      req.params.id,
      actor,
      z
        .object({ status: z.enum(['ACCEPTED', 'DECLINED']) })
        .strict()
        .parse(req.body).status,
    ),
  ),
);
router.get(
  '/connections/:id/messages',
  handle((req, actor) => service.messages(req.params.id, actor, req.query)),
);
router.post(
  '/connections/:id/messages',
  handle(
    (req, actor) =>
      service.sendMessage(
        req.params.id,
        actor,
        z
          .object({ body: z.string().trim().min(1).max(2000) })
          .strict()
          .parse(req.body).body,
      ),
    201,
  ),
);
router.get(
  '/posts',
  handle((req, actor) => service.posts(actor, req.query)),
);
router.post(
  '/posts',
  handle((req, actor) => service.createPost(actor, NetworkPostSchema.parse(req.body)), 201),
);
router.delete(
  '/posts/:id',
  handle((req, actor) => service.deletePost(req.params.id, actor)),
);
router.get(
  '/opportunities',
  handle((req, actor) => service.opportunities(actor, req.query)),
);
router.post(
  '/opportunities',
  handle(
    (req, actor) => service.createOpportunity(actor, NetworkOpportunitySchema.parse(req.body)),
    201,
  ),
);
router.patch(
  '/opportunities/:id',
  handle((req, actor) => {
    z.object({ status: z.literal('CLOSED') })
      .strict()
      .parse(req.body);
    return service.closeOpportunity(req.params.id, actor);
  }),
);
export default router;
