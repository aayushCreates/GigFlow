import { Router } from "express";
import isUserLoggedIn from "../middlewares/auth.middleware";
import { submitBid, bidDetails, hireBid, userBids } from "../controllers/bid.controller";

const bidRouter = Router();

bidRouter.post("/", isUserLoggedIn, submitBid);
bidRouter.get("/my-bids", isUserLoggedIn, userBids);
bidRouter.get("/:gigId", isUserLoggedIn, bidDetails);
bidRouter.patch("/:bidId/hire", isUserLoggedIn, hireBid);

export default bidRouter;
