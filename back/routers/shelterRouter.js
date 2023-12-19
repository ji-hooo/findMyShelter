import { Router } from "express";
import ShelterController from "../controllers/shelterController";
import errorMiddleware from "../middlewares/errorMiddleware";

const shelterRouter = Router();

shelterRouter.get("/home", ShelterController.getShelters);
shelterRouter.get("/shelters/:id", ShelterController.getShelter);
shelterRouter.get("/shelters/districts/:district", ShelterController.getDistrictShelter);

shelterRouter.use(errorMiddleware);

module.exports = shelterRouter;
