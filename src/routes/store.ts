/** @format */

import express, { Router } from "express";
import { getStoreDetail, saveStoreDetail } from "../contollers/storeController";

const router: Router = express.Router();

router.get("/getStoreDetail", getStoreDetail);
router.post("/saveStoreDetail", saveStoreDetail);

export default router;
