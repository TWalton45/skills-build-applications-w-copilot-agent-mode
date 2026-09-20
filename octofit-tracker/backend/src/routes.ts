import { Router } from 'express';
import { Activity, Leaderboard, Team, User, Workout } from './models/index.js';

const router = Router();

function asyncHandler(handler: (request: any, response: any, next: any) => Promise<void>) {
  return (request: any, response: any, next: any) => {
    handler(request, response, next).catch(next);
  };
}

function createCrudRoutes(path: string, model: typeof User) {
  router.get(path, asyncHandler(async (request, response) => {
    const documents = await model.find(request.query).sort({ createdAt: -1 });
    response.json(documents);
  }));

  router.get(`${path}/:id`, asyncHandler(async (request, response) => {
    const document = await model.findById(request.params.id);
    if (!document) {
      response.status(404).json({ error: 'Resource not found' });
      return;
    }
    response.json(document);
  }));

  router.post(path, asyncHandler(async (request, response) => {
    const document = await model.create(request.body);
    response.status(201).json(document);
  }));

  router.patch(`${path}/:id`, asyncHandler(async (request, response) => {
    const document = await model.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
      runValidators: true,
    });
    if (!document) {
      response.status(404).json({ error: 'Resource not found' });
      return;
    }
    response.json(document);
  }));

  router.delete(`${path}/:id`, asyncHandler(async (request, response) => {
    const document = await model.findByIdAndDelete(request.params.id);
    if (!document) {
      response.status(404).json({ error: 'Resource not found' });
      return;
    }
    response.status(204).send();
  }));
}

createCrudRoutes('/users', User);
createCrudRoutes('/teams', Team);
createCrudRoutes('/activities', Activity);
createCrudRoutes('/workouts', Workout);

router.get('/leaderboard', asyncHandler(async (_request, response) => {
  const leaderboard = await Leaderboard.find().sort({ rank: 1 }).populate('userId', 'username displayName');
  response.json(leaderboard);
}));

export default router;