import dotenv from 'dotenv'
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"])

dotenv.config()

import mongoose from 'mongoose'
import Trip from '../models/Trip'
import User from '../models/User'
const oneDayTrips = [
  {
    id: 101,
    destination: 'Lonavala',
    baseCity: 'Mumbai',
    baseState: 'Maharashtra',
    region: 'West India',
    duration: '1 Day',
    itinerary: [
      { time: '5:30 AM', activity: 'Start from Mumbai' },
      { time: '7:30 AM', activity: 'Reach Lonavala' },
      { time: '8:00 AM', activity: 'Breakfast' },
      { time: '9:00 AM', activity: 'Tiger Point' },
      { time: '11:00 AM', activity: 'Bhushi Dam' },
      { time: '1:30 PM', activity: 'Lunch' },
      { time: '3:00 PM', activity: 'Karla Caves' },
      { time: '6:00 PM', activity: 'Return journey' },
      { time: '9:00 PM', activity: 'Reach Mumbai' },
    ],
    transport: [
      { mode: 'Train (Mumbai–Lonavala Express)', cost: '₹300–800 (2 persons)' },
      { mode: 'Car', cost: '₹2,500–3,500' },
    ],
    costs: [
      { label: 'Hotel (optional)', amount: '₹1,500–3,000' },
      { label: 'Food', amount: '₹1,000' },
    ],
    tips: ['Best time: Monsoon season', 'Avoid weekends for less crowd'],
    image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=600&q=80',
    tags: ['Nature', 'Monsoon', 'Waterfalls'],
    budget: 'budget',
  },
  {
    id: 102,
    destination: 'Alibaug',
    baseCity: 'Mumbai',
    baseState: 'Maharashtra',
    region: 'West India',
    duration: '1 Day',
    itinerary: [
      { time: '6:00 AM', activity: 'Start (ferry or road)' },
      { time: '9:00 AM', activity: 'Beach visit' },
      { time: '11:30 AM', activity: 'Kolaba Fort' },
      { time: '2:00 PM', activity: 'Lunch' },
      { time: '4:00 PM', activity: 'Relax at beach' },
      { time: '7:00 PM', activity: 'Return' },
    ],
    transport: [
      { mode: 'Train + Ferry', cost: '₹300–700' },
      { mode: 'Car', cost: '₹3,000–4,000' },
    ],
    costs: [
      { label: 'Hotel (optional)', amount: '₹2,000–4,000' },
      { label: 'Food', amount: '₹1,200' },
    ],
    tips: ['Try fresh seafood', 'Morning ferry is the best experience'],
    image: 'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?w=600&q=80',
    tags: ['Beach', 'Fort', 'Ferry'],
    budget: 'budget',
  },
  {
    id: 103,
    destination: 'Mahabalipuram',
    baseCity: 'Chennai',
    baseState: 'Tamil Nadu',
    region: 'South India',
    duration: '1 Day',
    itinerary: [
      { time: '6:00 AM', activity: 'Start from Chennai' },
      { time: '8:00 AM', activity: 'Shore Temple' },
      { time: '10:00 AM', activity: 'Five Rathas' },
      { time: '1:00 PM', activity: 'Lunch' },
      { time: '3:00 PM', activity: 'Beach visit' },
      { time: '6:30 PM', activity: 'Return to Chennai' },
    ],
    transport: [
      { mode: 'Train (Chennai–Chengalpattu)', cost: '₹200–400' },
      { mode: 'Car', cost: '₹2,000–3,000' },
    ],
    costs: [
      { label: 'Hotel (optional)', amount: '₹2,000' },
      { label: 'Food', amount: '₹1,000' },
    ],
    tips: ['Visit at sunrise for best photos', 'Buy stone crafts from local shops'],
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80',
    tags: ['Heritage', 'Temples', 'Beach'],
    budget: 'budget',
  },
  {
    id: 104,
    destination: 'Pulicat Lake',
    baseCity: 'Chennai',
    baseState: 'Tamil Nadu',
    region: 'South India',
    duration: '1 Day',
    itinerary: [
      { time: '6:00 AM', activity: 'Start from Chennai' },
      { time: '8:30 AM', activity: 'Bird watching' },
      { time: '12:30 PM', activity: 'Lunch' },
      { time: '3:00 PM', activity: 'Boating on the lake' },
      { time: '6:00 PM', activity: 'Return' },
    ],
    transport: [
      { mode: 'Train (Chennai–Sullurpeta)', cost: '₹200–400' },
      { mode: 'Car', cost: '₹2,500–3,500' },
    ],
    costs: [
      { label: 'Hotel (optional)', amount: '₹1,500' },
      { label: 'Food', amount: '₹800' },
    ],
    tips: ['Best visited November–February for migratory birds'],
    image: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=600&q=80',
    tags: ['Nature', 'Birds', 'Lake'],
    budget: 'budget',
  },
    {
    id: 105,
    destination: 'Araku Valley',
    baseCity: 'Visakhapatnam',
    baseState: 'Andhra Pradesh',
    region: 'South India',
    duration: '1 Day',
    itinerary: [
      { time: '6:00 AM', activity: 'Train from Vizag (Vistadome)' },
      { time: '10:00 AM', activity: 'Reach Araku Valley' },
      { time: '11:00 AM', activity: 'Coffee Museum' },
      { time: '2:00 PM', activity: 'Lunch' },
      { time: '4:00 PM', activity: 'Gardens & valley walks' },
      { time: '7:00 PM', activity: 'Return' },
    ],
    transport: [
      { mode: 'Train (Vistadome Express)', cost: '₹400–800' },
      { mode: 'Car', cost: '₹4,000–5,000' },
    ],
    costs: [
      { label: 'Hotel (optional)', amount: '₹2,000' },
      { label: 'Food', amount: '₹1,000' },
    ],
    tips: ['Window seat on the Vistadome is essential', 'Try Araku coffee'],
    image: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=600&q=80',
    tags: ['Scenic', 'Nature', 'Coffee'],
    budget: 'budget',
  },
  {
    id: 106,
    destination: 'Borra Caves',
    baseCity: 'Visakhapatnam',
    baseState: 'Andhra Pradesh',
    region: 'South India',
    duration: '1 Day',
    itinerary: [
      { time: '6:00 AM', activity: 'Start from Vizag' },
      { time: '9:30 AM', activity: 'Explore Borra Caves' },
      { time: '1:00 PM', activity: 'Lunch' },
      { time: '3:00 PM', activity: 'Nearby viewpoints' },
      { time: '7:00 PM', activity: 'Return' },
    ],
    transport: [
      { mode: 'Train (Vizag–Borra)', cost: '₹300–600' },
      { mode: 'Car', cost: '₹4,000' },
    ],
    costs: [
      { label: 'Hotel (optional)', amount: '₹1,500' },
      { label: 'Food', amount: '₹900' },
    ],
    tips: ['Can combine with Araku Valley for a full day'],
    image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=600&q=80',
    tags: ['Caves', 'Adventure', 'Nature'],
    budget: 'budget',
  },
  {
    id: 107,
    destination: 'Srisailam',
    baseCity: 'Hyderabad',
    baseState: 'Telangana',
    region: 'South India',
    duration: '1 Day',
    itinerary: [
      { time: '5:00 AM', activity: 'Start from Hyderabad' },
      { time: '9:00 AM', activity: 'Reach Srisailam temple' },
      { time: '12:30 PM', activity: 'Lunch' },
      { time: '2:00 PM', activity: 'Boat ride on Krishna river' },
      { time: '5:00 PM', activity: 'Explore local markets' },
      { time: '9:00 PM', activity: 'Return to Hyderabad' },
    ],
    transport: [
      { mode: 'Bus', cost: '₹500–800' },
      { mode: 'Car', cost: '₹3,500–4,500' },
    ],
    costs: [
      { label: 'Hotel (optional)', amount: '₹2,000–3,000' },
      { label: 'Food', amount: '₹1,200' },
    ],
    tips: ['Temple is crowded on weekends', 'Carry snacks for the long drive'],
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80',
    tags: ['Temple', 'Pilgrimage', 'River'],
    budget: 'budget',
  },
  {
    id: 108,
    destination: 'Nandi Hills',
    baseCity: 'Bangalore',
    baseState: 'Karnataka',
    region: 'South India',
    duration: '1 Day',
    itinerary: [
      { time: '4:30 AM', activity: 'Start from Bangalore' },
      { time: '6:00 AM', activity: 'Reach Nandi Hills for sunrise' },
      { time: '8:00 AM', activity: 'Breakfast' },
      { time: '10:00 AM', activity: 'Explore Tipu’s Drop & fort' },
      { time: '1:00 PM', activity: 'Lunch' },
      { time: '3:00 PM', activity: 'Relax and photography' },
      { time: '6:00 PM', activity: 'Return to Bangalore' },
    ],
    transport: [
      { mode: 'Bus', cost: '₹200–400' },
      { mode: 'Car', cost: '₹1,500–2,500' },
    ],
    costs: [
      { label: 'Hotel (optional)', amount: '₹2,000' },
      { label: 'Food', amount: '₹800' },
    ],
    tips: ['Best for sunrise views', 'Carry a jacket — it gets chilly'],
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80',
    tags: ['Hill Station', 'Sunrise', 'Nature'],
    budget: 'budget',
  },
  {
    id: 109,
    destination: 'Shivanasamudra Falls',
    baseCity: 'Bangalore',
    baseState: 'Karnataka',
    region: 'South India',
    duration: '1 Day',
    itinerary: [
      { time: '6:00 AM', activity: 'Start from Bangalore' },
      { time: '9:00 AM', activity: 'Reach Shivanasamudra' },
      { time: '10:00 AM', activity: 'View Gaganachukki Falls' },
      { time: '12:30 PM', activity: 'Lunch' },
      { time: '2:00 PM', activity: 'View Bharachukki Falls' },
      { time: '5:00 PM', activity: 'Return to Bangalore' },
    ],
    transport: [
      { mode: 'Bus', cost: '₹300–600' },
      { mode: 'Car', cost: '₹2,500–3,500' },
    ],
    costs: [
      { label: 'Hotel (optional)', amount: '₹2,000' },
      { label: 'Food', amount: '₹1,000' },
    ],
    tips: ['Best visited during monsoon for full flow'],
    image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=600&q=80',
    tags: ['Waterfalls', 'Nature', 'Photography'],
    budget: 'budget',
  },
  {
    id: 110,
    destination: 'Hogenakkal Falls',
    baseCity: 'Bangalore',
    baseState: 'Tamil Nadu',
    region: 'South India',
    duration: '1 Day',
    itinerary: [
      { time: '6:00 AM', activity: 'Start from Bangalore' },
      { time: '10:00 AM', activity: 'Reach Hogenakkal Falls' },
      { time: '11:00 AM', activity: 'Coracle boat ride' },
      { time: '1:00 PM', activity: 'Lunch (local fish fry)' },
      { time: '3:00 PM', activity: 'Explore nearby viewpoints' },
      { time: '6:00 PM', activity: 'Return to Bangalore' },
    ],
    transport: [
      { mode: 'Bus', cost: '₹400–700' },
      { mode: 'Car', cost: '₹3,000–4,000' },
    ],
    costs: [
      { label: 'Hotel (optional)', amount: '₹2,500' },
      { label: 'Food', amount: '₹1,200' },
    ],
    tips: ['Coracle rides are must-do', 'Carry extra clothes — you may get wet'],
    image: 'https://images.unsplash.com/photo-1626595503022-794595e87a22?w=600&q=80',
    tags: ['Waterfalls', 'Adventure', 'Nature'],
    budget: 'budget',
  },
  {
    id: 111,
    destination: 'Belur & Halebidu',
    baseCity: 'Bangalore',
    baseState: 'Karnataka',
    region: 'South India',
    duration: '1 Day',
    itinerary: [
      { time: '5:00 AM', activity: 'Start from Bangalore' },
      { time: '9:00 AM', activity: 'Reach Belur — Chennakesava Temple' },
      { time: '12:00 PM', activity: 'Lunch' },
      { time: '1:30 PM', activity: 'Visit Halebidu — Hoysaleswara Temple' },
      { time: '4:30 PM', activity: 'Photography & relax' },
      { time: '9:00 PM', activity: 'Return to Bangalore' },
    ],
    transport: [
      { mode: 'Bus', cost: '₹400–700' },
      { mode: 'Car', cost: '₹3,000–4,000' },
    ],
    costs: [
      { label: 'Hotel (optional)', amount: '₹2,500' },
      { label: 'Food', amount: '₹1,200' },
    ],
    tips: ['Carry water — temple complex is large', 'Best for heritage lovers'],
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80',
    tags: ['Heritage', 'Temples', 'Architecture'],
    budget: 'budget',
  },
  {
    id: 112,
    destination: 'Shravanabelagola',
    baseCity: 'Bangalore',
    baseState: 'Karnataka',
    region: 'South India',
    duration: '1 Day',
    itinerary: [
      { time: '6:00 AM', activity: 'Start from Bangalore' },
      { time: '9:00 AM', activity: 'Reach Shravanabelagola' },
      { time: '10:00 AM', activity: 'Climb Vindhyagiri hill — Gomateshwara statue' },
      { time: '1:00 PM', activity: 'Lunch' },
      { time: '3:00 PM', activity: 'Explore local temples' },
      { time: '7:00 PM', activity: 'Return to Bangalore' },
    ],
    transport: [
      { mode: 'Bus', cost: '₹300–600' },
      { mode: 'Car', cost: '₹2,500–3,500' },
    ],
    costs: [
      { label: 'Hotel (optional)', amount: '₹2,000' },
      { label: 'Food', amount: '₹1,000' },
    ],
    tips: ['Wear comfortable shoes — steep climb', 'Carry water bottles'],
    image: 'https://images.unsplash.com/photo-1626595503022-794595e87a22?w=600&q=80',
    tags: ['Pilgrimage', 'Heritage', 'Statue'],
    budget: 'budget',
  },
  {
    id: 113,
    destination: 'Mysore',
    baseCity: 'Bangalore',
    baseState: 'Karnataka',
    region: 'South India',
    duration: '1 Day',
    itinerary: [
      { time: '5:30 AM', activity: 'Start from Bangalore' },
      { time: '9:00 AM', activity: 'Reach Mysore Palace' },
      { time: '12:30 PM', activity: 'Lunch' },
      { time: '2:00 PM', activity: 'Visit Chamundi Hills' },
      { time: '4:00 PM', activity: 'Explore Mysore Zoo or local markets' },
      { time: '8:00 PM', activity: 'Return to Bangalore' },
    ],
    transport: [
      { mode: 'Train (Shatabdi Express)', cost: '₹400–800' },
      { mode: 'Car', cost: '₹3,000–4,000' },
    ],
    costs: [
      { label: 'Hotel (optional)', amount: '₹3,000' },
      { label: 'Food', amount: '₹1,500' },
    ],
    tips: ['Palace lighting on Sundays is spectacular', 'Try Mysore Pak sweet'],
    image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=600&q=80',
    tags: ['Heritage', 'Palace', 'Culture'],
    budget: 'budget',
  },
  {
    id: 114,
    destination: 'Hampi',
    baseCity: 'Bangalore',
    baseState: 'Karnataka',
    region: 'South India',
    duration: '1 Day',
    itinerary: [
      { time: '5:00 AM', activity: 'Start from Bangalore' },
      { time: '10:30 AM', activity: 'Reach Hampi — Virupaksha Temple' },
      { time: '1:00 PM', activity: 'Lunch' },
      { time: '2:30 PM', activity: 'Explore Vittala Temple & Stone Chariot' },
      { time: '5:00 PM', activity: 'Photography at sunset points' },
      { time: '9:30 PM', activity: 'Return to Bangalore' },
    ],
    transport: [
      { mode: 'Train (Bangalore–Hospet)', cost: '₹500–900' },
      { mode: 'Car', cost: '₹4,500–6,000' },
    ],
    costs: [
      { label: 'Hotel (optional)', amount: '₹3,000' },
      { label: 'Food', amount: '₹1,500' },
    ],
    tips: ['Carry water — ruins are spread out', 'Best for history enthusiasts'],
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80',
    tags: ['Heritage', 'Ruins', 'Temples'],
    budget: 'budget',
  },
  {
    id: 115,
    destination: 'Badami & Pattadakal',
    baseCity: 'Hubli',
    baseState: 'Karnataka',
    region: 'South India',
    duration: '1 Day',
    itinerary: [
      { time: '6:00 AM', activity: 'Start from Hubli' },
      { time: '9:00 AM', activity: 'Reach Badami — Cave Temples' },
      { time: '12:30 PM', activity: 'Lunch' },
      { time: '2:00 PM', activity: 'Visit Pattadakal — UNESCO site' },
      { time: '5:00 PM', activity: 'Explore Aihole nearby' },
      { time: '8:00 PM', activity: 'Return to Hubli' },
    ],
    transport: [
      { mode: 'Bus', cost: '₹400–700' },
      { mode: 'Car', cost: '₹3,500–4,500' },
    ],
    costs: [
      { label: 'Hotel (optional)', amount: '₹2,500' },
      { label: 'Food', amount: '₹1,200' },
    ],
    tips: ['Carry a hat — hot climate', 'Best for temple architecture lovers'],
    image: 'https://images.unsplash.com/photo-1626595503022-794595e87a22?w=600&q=80',
    tags: ['Heritage', 'Temples', 'Architecture'],
    budget: 'budget',
  },
  {
    id: 116,
    destination: 'Rameswaram',
    baseCity: 'Madurai',
    baseState: 'Tamil Nadu',
    region: 'South India',
    duration: '1 Day',
    itinerary: [
      { time: '5:00 AM', activity: 'Start from Madurai' },
      { time: '9:00 AM', activity: 'Reach Rameswaram — Ramanathaswamy Temple' },
      { time: '12:30 PM', activity: 'Lunch' },
      { time: '2:00 PM', activity: 'Visit Pamban Bridge' },
      { time: '4:00 PM', activity: 'Explore Dhanushkodi beach' },
      { time: '8:00 PM', activity: 'Return to Madurai' },
    ],
    transport: [
      { mode: 'Train (Madurai–Rameswaram)', cost: '₹300–600' },
      { mode: 'Car', cost: '₹3,500–4,500' },
    ],
    costs: [
      { label: 'Hotel (optional)', amount: '₹2,500' },
      { label: 'Food', amount: '₹1,200' },
    ],
    tips: ['Temple has strict dress code', 'Best visited in winter months'],
    image: 'https://images.unsplash.com/photo-1626595503022-794595e87a22?w=600&q=80',
    tags: ['Temple', 'Pilgrimage', 'Beach'],
    budget: 'budget',
  },
  {
    id: 117,
    destination: 'Kanchipuram',
    baseCity: 'Chennai',
    baseState: 'Tamil Nadu',
    region: 'South India',
    duration: '1 Day',
    itinerary: [
      { time: '6:00 AM', activity: 'Start from Chennai' },
      { time: '8:00 AM', activity: 'Visit Ekambareswarar Temple' },
      { time: '11:00 AM', activity: 'Kailasanathar Temple' },
      { time: '1:00 PM', activity: 'Lunch' },
      { time: '2:30 PM', activity: 'Explore silk weaving centers' },
      { time: '5:00 PM', activity: 'Varadaraja Perumal Temple' },
      { time: '7:00 PM', activity: 'Return to Chennai' },
    ],
    transport: [
      { mode: 'Train (Chennai–Kanchipuram)', cost: '₹200–400' },
      { mode: 'Car', cost: '₹2,000–3,000' },
    ],
    costs: [
      { label: 'Hotel (optional)', amount: '₹2,000' },
      { label: 'Food', amount: '₹1,000' },
    ],
    tips: ['Famous for silk sarees — shop locally', 'Best for temple architecture lovers'],
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80',
    tags: ['Heritage', 'Temples', 'Silk'],
    budget: 'budget',
  }
]
const getDurationNumber = (durationStr: string) => {
  const match = durationStr.match(/\d+/)
  return match ? parseInt(match[0]) : 1
}

const seedOneDayTrips = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!)
    console.log('MongoDB connected for One-Day Trip Seeding')

    const user = await User.findOne()
    if (!user) {
      throw new Error('No user found. Please seed users first.')
    }

    const formattedTrips = oneDayTrips.map(trip => ({
      name: trip.destination,
      state: trip.baseState,
      region: trip.region,
      duration: getDurationNumber(trip.duration),
      image: trip.image,
      attractions: trip.tags,
      itinerary: trip.itinerary.map(i => `${i.time} - ${i.activity}`),
      tier: trip.budget === "premium" ? "premium" : "economy",
      pricing: {
        economy: { hotel: "N/A", transport: "N/A" },
        premium: { hotel: "N/A", transport: "N/A" }
      },
      tags: trip.tags,
      isCustom: true,
      sourcePackageId: trip.id,
      travelDate: null,
      travellers: 2,
      notes: trip.tips.join("; "),
      userId: user._id
    }))

    await Trip.insertMany(formattedTrips)
    console.log(`Seeded ${oneDayTrips.length} one-day trips successfully!`)
    process.exit(0)
  } catch (err) {
    console.error('One-Day Trip Seed failed:', err)
    process.exit(1)
  }
}

seedOneDayTrips()
