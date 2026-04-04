import { Response } from 'express'
import type { AuthRequest } from '../middlewares/authMiddleware'
import Trip from '../models/Trip'

// GET all trips for logged-in user
export const getUserTrips = async (req: AuthRequest, res: Response) => {
  try {
    const trips = await Trip.find({ userId: req.userId }).sort({ createdAt: -1 })
    res.json({ trips })
  } catch {
    res.status(500).json({ message: 'Failed to fetch trips' })
  }
}

// POST create a trip (from package copy or custom)
export const createTrip = async (req: AuthRequest, res: Response) => {
  try {
    const trip = await Trip.create({ ...req.body, userId: req.userId })
    res.status(201).json({ message: 'Trip saved!', trip })
  } catch {
    res.status(500).json({ message: 'Failed to create trip' })
  }
}

// PUT update a trip
export const updateTrip = async (req: AuthRequest, res: Response) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.userId })
    if (!trip) return res.status(404).json({ message: 'Trip not found' })

    Object.assign(trip, req.body)
    await trip.save()
    res.json({ message: 'Trip updated!', trip })
  } catch {
    res.status(500).json({ message: 'Failed to update trip' })
  }
}

// DELETE a trip
export const deleteTrip = async (req: AuthRequest, res: Response) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.userId })
    if (!trip) return res.status(404).json({ message: 'Trip not found' })
    res.json({ message: 'Trip deleted!' })
  } catch {
    res.status(500).json({ message: 'Failed to delete trip' })
  }
}

// GET single trip
export const getTripById = async (req: AuthRequest, res: Response) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.userId })
    if (!trip) return res.status(404).json({ message: 'Trip not found' })
    res.json({ trip })
  } catch {
    res.status(500).json({ message: 'Failed to fetch trip' })
  }
}