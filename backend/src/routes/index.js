import { Router } from 'express';
import users from '../services/users/routes/index.js';

const routes = Router();

routes.use('/', users);

export default routes;
