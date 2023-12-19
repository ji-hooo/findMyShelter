import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import ReviewController from "../controllers/reviewController";

const reviewRouter = Router();

reviewRouter.get("/review/", login_required, ReviewController.getReviewByUserId);
reviewRouter.get("/review/:shelter_id", ReviewController.getReviewByShelterId);
reviewRouter.post("/review/:shelter_id", login_required, ReviewController.addReview);
reviewRouter.put("/review/:review_id", login_required, ReviewController.setReview);
reviewRouter.delete("/review/:review_id", login_required, ReviewController.deleteReview);

export { reviewRouter };