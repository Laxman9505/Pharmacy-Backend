import { Request, Response } from "express";
import storeModel from "../modal/storeModal";
import { StoreInterface } from "../interfaces/storeInterfaces";

export async function getStoreDetail(req: Request, res: Response) {
  try {
    const storeDetail = await storeModel.findOne();
    if (storeDetail) {
      res.status(200).json(storeDetail);
    } else {
      res.status(404).json({ message: "Store details not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
}

export async function saveStoreDetail(req: Request, res: Response) {
  try {
    const { name, location, phoneNumber, email, currencySymbol } = req.body;
    const storeDetail = {
      storeDetails: { name, location, phoneNumber, email, currencySymbol },
      receiptConfiguration: req.body.receiptConfiguration,
      printerConfiguration: req.body.printerConfiguration,
    };
    const existingStoreDetail = await storeModel.findOne();
    if (existingStoreDetail) {
      existingStoreDetail.storeDetails = storeDetail.storeDetails;
      existingStoreDetail.receiptConfiguration =
        storeDetail.receiptConfiguration;
      existingStoreDetail.printerConfiguration =
        storeDetail.printerConfiguration;
      await existingStoreDetail.save();
      res.status(200).json({ message: "Store details updated successfully" });
    } else {
      const newStoreDetail = new storeModel(storeDetail);
      await newStoreDetail.save();
      res.status(201).json({ message: "Store details saved successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
}
