import { Router } from "express";
import { verifyUserJWT } from "../middlewares/auth.middleware.js";
import {
  createGarbage,
  getAllGarbage,
  getGarbageById,
  updateGarbage,
  deleteGarbage,
} from "../controllers/garbage.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post(
  "/",
  upload.fields([
    {
      name: "images",
      maxCount: 5, // Limit to 5 images
    },
  ]),
  createGarbage
);
router.get("/", getAllGarbage);
router.get("/:id", getGarbageById);
router.patch(
  "/:id",
  upload.fields([
    {
      name: "images",
      maxCount: 5,
    },
  ]),
  updateGarbage
);
router.delete("/:id", deleteGarbage);

export default router;
