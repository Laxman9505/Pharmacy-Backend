import express, { Router } from "express";
import { getDashboardData } from "../contollers/dashboardController";

const router: Router = express.Router();

router.get("/getDashboardData", getDashboardData);

export default router;
