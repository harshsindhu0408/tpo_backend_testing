import express from "express";
import { createNOC } from "../controllers/nocController.js";
import { requireSignIn } from "../middlewares/authenticationMiddleware.js";
const router = express.Router();

router.route('/create-noc').post(requireSignIn, createNOC);

export default router;
