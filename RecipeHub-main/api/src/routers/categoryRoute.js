import express from "express";
import categoryController from "../controllers/categoryController.js";
import roleBasedAccess from "../middlewares/roleBasedAccess.js";
import { ADMIN } from "../constants/role.js";

const router = express.Router();

router.post("/", roleBasedAccess(ADMIN), categoryController.createCategory);

export default router;
