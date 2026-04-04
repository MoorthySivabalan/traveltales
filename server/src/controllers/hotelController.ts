import { Request, Response } from "express";
import Hotel from "../models/Hotel";

export const getHotels = async (req: Request, res: Response) => {
  try {
    const {
      city,
      state,
      region,
      type,
      minPrice,
      maxPrice,
      rating,
      search,
      page = 1,
      limit = 12,
    } = req.query;

    const filter: any = {};

    if (city) filter.city = { $regex: new RegExp(city as string, "i") };
    if (state) filter.state = { $regex: new RegExp(state as string, "i") };
    if (region) filter.region = region;
    if (type) filter.type = type;
    if (rating) filter.rating = { $gte: Number(rating) };
    if (minPrice || maxPrice) {
      filter["pricePerNight.economy"] = {};
      if (minPrice) filter["pricePerNight.economy"].$gte = Number(minPrice);
      if (maxPrice) filter["pricePerNight.economy"].$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { name: { $regex: new RegExp(search as string, "i") } },
        { city: { $regex: new RegExp(search as string, "i") } },
        { state: { $regex: new RegExp(search as string, "i") } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Hotel.countDocuments(filter);
    const hotels = await Hotel.find(filter)
      .sort({ rating: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      hotels,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch {
    res.status(500).json({ message: "Failed to fetch hotels" });
  }
};

export const getHotelById = async (req: Request, res: Response) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    res.json({ hotel });
  } catch {
    res.status(500).json({ message: "Failed to fetch hotel" });
  }
};

export const getHotelsByCity = async (req: Request, res: Response) => {
  try {
    const city = req.params.city as string;
    const hotels = await Hotel.find({
      city: { $regex: new RegExp(city, "i") },
    }).sort({ rating: -1 });
    res.json({ hotels });
  } catch {
    res.status(500).json({ message: "Failed to fetch hotels" });
  }
};
