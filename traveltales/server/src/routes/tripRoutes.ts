import { Router } from "express";
import {
  getUserTrips,
  createTrip,
  updateTrip,
  deleteTrip,
  getTripById,
  saveTrip,
  createTripFromHotel
} from "../controllers/tripController";

import { protect } from "../middlewares/authMiddleware";

const router = Router();

/* ---------------- TRIP CRUD ---------------- */
router.get("/", protect, getUserTrips);
router.post("/", protect, createTrip);

/* ---------------- HOTEL BOOKING (IMPORTANT FIX) ---------------- */
router.post("/book-hotel", protect, createTripFromHotel);

/* ---------------- OTHER OPERATIONS ---------------- */
router.put("/:id", protect, updateTrip);
router.delete("/:id", protect, deleteTrip);
router.get("/:id", protect, getTripById);

/* ---------------- SAVE TRIP ---------------- */
router.post("/save/:tripId", protect, saveTrip);

export default router;