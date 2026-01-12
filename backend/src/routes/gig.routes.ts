import { Router } from "express";
import { allGigs, createGig } from "../controllers/gig.controller";
import isUserLoggedIn from "../middlewares/auth.middleware";

const gigRouter = Router();

gigRouter.get('/', allGigs);
gigRouter.post('/', isUserLoggedIn, createGig);

export default gigRouter;