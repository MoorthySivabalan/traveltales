import User from "../models/User";
import mongoose from "mongoose";
import { Response } from "express";
import Trip from "../models/Trip";
import type { AuthRequest } from "../middlewares/authMiddleware";

export const bookHotelAsTrip = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    const {
      hotel,
      checkIn,
      checkOut,
      guests,
      tier
    } = req.body;

    const trip = await Trip.create({
      userId,
      name: hotel.name,
      caption: `Hotel booking - ${hotel.name}`,
      state: hotel.state,
      region: hotel.region,
      duration: 1,
      image: hotel.images?.[0],
      attractions: hotel.amenities,
      itinerary: [],
      tier: tier || "economy",
      pricing: {
        economy: {
          hotel: hotel.pricePerNight.economy,
          transport: 0
        },
        premium: {
          hotel: hotel.pricePerNight.premium,
          transport: 0
        }
      },
      tags: hotel.tags,
      isCustom: true,
      sourcePackageId: null,
      travelDate: checkIn ? new Date(checkIn) : null,
      travellers: guests,
      notes: `Checkout: ${checkOut}`
    });

    await User.findByIdAndUpdate(userId, {
      $addToSet: { savedTrips: trip._id }
    });

    res.status(201).json({ trip });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Hotel booking failed" });
  }
};

export const createTripFromHotel = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { hotel, checkIn, checkOut, guests, tier } = req.body;

    if (!hotel) {
      res.status(400).json({ message: "Hotel data missing" });
      return;
    }

    const trip = await Trip.create({
      userId,
      name: hotel.name,
      caption: `Hotel booking - ${hotel.name}`,
      state: hotel.state,
      region: hotel.region,
      duration: 1,
      image: hotel.images?.[0] || "",
      attractions: hotel.amenities || [],
      itinerary: [],
      tier: tier || "economy",
      pricing: {
        economy: {
          hotel: hotel.pricePerNight?.economy || 0,
          transport: 0
        },
        premium: {
          hotel: hotel.pricePerNight?.premium || 0,
          transport: 0
        }
      },
      tags: hotel.tags || [],
      isCustom: true,
      sourcePackageId: null,
      travelDate: checkIn ? new Date(checkIn) : null,
      travellers: guests || 1,
      notes: checkOut ? `Checkout: ${checkOut}` : ""
    });

    await User.findByIdAndUpdate(userId, {
      $addToSet: { savedTrips: trip._id }
    });

    res.status(201).json({ trip });

  } catch (error) {
    console.error("HOTEL BOOKING ERROR:", error);
    res.status(500).json({ message: "Failed to book hotel" });
  }
};
export const getUserTrips = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const populatedUser = await User.findById(req.userId).populate("savedTrips");

    res.json({ trips: populatedUser?.savedTrips || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch trips" });
  }
};

export const forceAddTrip = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(400).json({ message: "User ID missing" });
    }

    const tripId = "69db58e12e0103c862b785e9";

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $addToSet: { savedTrips: tripId } },
      { new: true }
    );

    res.json({ message: "Trip added", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error" });
  }
};

export const createTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const trip = await Trip.create({
      ...req.body,
      userId
    });
    await User.findByIdAndUpdate(userId, {
      $addToSet: { savedTrips: trip._id }
    });

    res.status(201).json(trip);

  } catch (error) {
    console.error("CREATE TRIP ERROR:", error);
    res.status(500).json({ message: "Failed to create trip" });
  }
};
export const updateTrip = async (req: AuthRequest, res: Response) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    Object.assign(trip, req.body);
    await trip.save();

    res.json({ message: "Trip updated!", trip });
  } catch (err) {
    res.status(500).json({ message: "Failed to update trip" });
  }
};

export const saveTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tripId = req.params.tripId;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const alreadySaved = user.savedTrips.some(
      (id: mongoose.Types.ObjectId) => id.toString() === tripId
    );

    if (!alreadySaved) {
      user.savedTrips.push(tripId as any);
      await user.save();
    }

    res.status(200).json({
      message: "Trip saved successfully",
      savedTrips: user.savedTrips
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving trip" });
  }
};

export const deleteTrip = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tripId = req.params.id;

    if (!tripId) {
      res.status(400).json({ message: "Trip ID missing" });
      return;
    }

    const trip = await Trip.findByIdAndDelete(tripId);

    if (!trip) {
      res.status(404).json({ message: "Trip not found" });
      return;
    }

    if (req.userId) {
      await User.findByIdAndUpdate(req.userId, {
        $pull: { savedTrips: tripId }
      });
    }

    res.status(200).json({ message: "Trip deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting trip" });
  }
};

export const getTripById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!trip) {
      res.status(404).json({ message: "Trip not found" });
      return;
    }

    res.json({ trip });

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch trip" });
  }
};