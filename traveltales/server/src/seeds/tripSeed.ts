import dotenv from 'dotenv'
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"])

dotenv.config()

import mongoose from 'mongoose'
import Trip from '../models/Trip'
import User from '../models/User' // ✅ Added

const trips = [
  {
    title: 'Magical Rajasthan Heritage Tour',
    destination: 'Jaipur & Udaipur',
    description: 'Explore the land of Kings. Visit the Pink City of Jaipur and the romantic lakes of Udaipur in this 5-day luxury experience.',
    price: 25000,
    duration: '5 Days / 4 Nights',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1000&auto=format&fit=crop',
    category: 'Heritage',
    rating: 4.8,
    tags: ['Palace', 'Culture', 'Photography'],
    featured: true
  },
  {
    title: 'Kashmir: Paradise on Earth',
    destination: 'Srinagar & Gulmarg',
    description: 'Experience the breathtaking beauty of the Himalayas. Stay in a traditional houseboat on Dal Lake and enjoy skiing in Gulmarg.',
    price: 32000,
    duration: '6 Days / 5 Nights',
    image: 'https://images.unsplash.com/photo-1566833917812-747683935cc2?q=80&w=1000&auto=format&fit=crop',
    category: 'Nature',
    rating: 4.9,
    tags: ['Snow', 'Mountains', 'Relaxation'],
    featured: true
  },
  {
    title: 'Goa Beach Party & Relax',
    destination: 'North & South Goa',
    description: 'The perfect mix of nightlife and serene beaches. Explore historic forts, hidden coves, and the best shacks in Goa.',
    price: 15000,
    duration: '4 Days / 3 Nights',
    image: 'https://images.unsplash.com/photo-1512783549216-3ce77a972e44?q=80&w=1000&auto=format&fit=crop',
    category: 'Beach',
    rating: 4.7,
    tags: ['Beach', 'Nightlife', 'Seafood'],
    featured: false
  },
  {
    title: 'Kerala Backwaters Escape',
    destination: 'Alleppey & Munnar',
    description: 'Cruise through the silent backwaters on a private houseboat and wake up to the lush green tea gardens of Munnar.',
    price: 22000,
    duration: '5 Days / 4 Nights',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000&auto=format&fit=crop',
    category: 'Nature',
    rating: 4.6,
    tags: ['Houseboat', 'Tea Garden', 'Spa'],
    featured: true
  },
  {
    title: 'Ancient Wonders of Maharashtra',
    destination: 'Aurangabad (Ajanta & Ellora)',
    description: 'Step back in time to witness the incredible rock-cut caves and world-class heritage sites of the 2nd century BCE.',
    price: 12000,
    duration: '3 Days / 2 Nights',
    image: 'https://images.unsplash.com/photo-1626595503022-794595e87a22?q=80&w=1000&auto=format&fit=crop',
    category: 'Heritage',
    rating: 4.5,
    tags: ['History', 'Caves', 'Spiritual'],
    featured: false
  }
]
const getDurationNumber = (durationStr: string) => {
  const match = durationStr.match(/\d+/)
  return match ? parseInt(match[0]) : 1
}

const seedTrips = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!)
    console.log('MongoDB connected for Trip Seeding')

    await Trip.deleteMany({})
    console.log('Cleared existing trips')

    // ✅ Get a user for userId
    const user = await User.findOne()
    if (!user) {
      throw new Error('No user found. Please seed users first.')
    }

    // ✅ Transform data (NO info lost)
    const formattedTrips = trips.map((trip) => ({
      ...trip, // keep all original fields
      name: trip.title, // required
      state: trip.destination, // required (mapped)
      duration: getDurationNumber(trip.duration), // convert to number
      userId: user._id // required
    }))

    await Trip.insertMany(formattedTrips)

    console.log(`✅ Seeded ${trips.length} trips successfully!`)
    process.exit(0)
  } catch (err) {
    console.error('Trip Seed failed:', err)
    process.exit(1)
  }
}

seedTrips()