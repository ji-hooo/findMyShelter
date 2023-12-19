import ReviewService from "../services/reviewService";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

class ReviewController {
    static async getReviewByUserId(req, res, next) {
      try {
        const userToken = req.headers["authorization"]?.split(" ")[1] ?? "null";
        const secretKey = process.env.JWT_SECRET_KEY || "secret-key";
        const jwtDecoded = jwt.verify(userToken, secretKey);
        const user_id = jwtDecoded.user_id;
        const result = await ReviewService.getReviewByUserId({ user_id });
        res.status(StatusCodes.OK).json(result);
      } catch (e) {
        next(e);
      }
    }

    static async getReviewByShelterId(req, res, next) {
      try {
        const { shelter_id } = req.params;
        const result = await ReviewService.getReviewByShelterId({ shelter_id });
        res.status(StatusCodes.OK).json(result);
      } catch (e) {
        next(e);
      }
    }

    static async addReview(req, res, next) {
      try {
        const { shelter_id } = req.params;
        const { description, rating, nickname, name } = req.body;
        const userToken = req.headers["authorization"]?.split(" ")[1] ?? "null";
        const secretKey = process.env.JWT_SECRET_KEY || "secret-key";
        const jwtDecoded = jwt.verify(userToken, secretKey);
        const user_id = jwtDecoded.user_id;
        const result = await ReviewService.addReview({ description, rating, nickname, user_id, shelter_id, name })
        res.status(StatusCodes.CREATED).json(result)
      } catch (e) {
        next(e);
      }  
    }

    static async setReview(req, res, next) {
      try {
        const { review_id } = req.params;
        const { description, rating } = req.body;
        const result = await ReviewService.setReview({ review_id, toUpdate: { description, rating } });
        res.status(StatusCodes.OK).json(result)
      } catch (e) {
        next(e);
      }
    }

    static async deleteReview(req, res, next) {
      try {
        const { review_id } = req.params;
        const result = await ReviewService.deleteReview({ review_id });
        res.status(StatusCodes.NO_CONTENT).json(result)
      } catch (e) {
        next(e);
      }
    }
}
  
export default ReviewController;