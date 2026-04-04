import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import Hotel from '../models/Hotel'

const hotels = [
  // ── RAJASTHAN ──
  {
    name: 'Rambagh Palace',
    city: 'Jaipur', state: 'Rajasthan', region: 'North India',
    address: 'Bhawani Singh Rd, Rambagh, Jaipur',
    rating: 4.9, reviews: 3240,
    pricePerNight: { economy: 8000, premium: 25000 },
    amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi', 'Gym', 'Bar', 'Room Service'],
    images: ['https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80'],
    description: 'A stunning heritage palace hotel offering royal Rajasthani hospitality.',
    coordinates: { lat: 26.8983, lng: 75.8069 },
    type: 'luxury', tags: ['Heritage', 'Palace', 'Pool'],
  },
  {
    name: 'Hotel Pearl Palace',
    city: 'Jaipur', state: 'Rajasthan', region: 'North India',
    address: 'Hari Kishan Somani Marg, Jaipur',
    rating: 4.4, reviews: 1820,
    pricePerNight: { economy: 1500, premium: 3500 },
    amenities: ['WiFi', 'Restaurant', 'Room Service', 'Parking'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80'],
    description: 'A charming budget hotel with colourful rooftop and great city views.',
    coordinates: { lat: 26.9124, lng: 75.7873 },
    type: 'budget', tags: ['Budget', 'Rooftop', 'Central'],
  },
  {
    name: 'Taj Jai Mahal Palace',
    city: 'Jaipur', state: 'Rajasthan', region: 'North India',
    address: 'Jacob Road, Civil Lines, Jaipur',
    rating: 4.8, reviews: 2100,
    pricePerNight: { economy: 9000, premium: 20000 },
    amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi', 'Tennis', 'Bar'],
    images: ['https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80'],
    description: 'A 32-acre palace estate offering unmatched Mughal architecture and luxury.',
    coordinates: { lat: 26.9260, lng: 75.8235 },
    type: 'luxury', tags: ['Luxury', 'Taj', 'Heritage'],
  },
  {
    name: 'Zostel Jaisalmer',
    city: 'Jaisalmer', state: 'Rajasthan', region: 'North India',
    address: 'Near Gadisar Lake, Jaisalmer',
    rating: 4.3, reviews: 980,
    pricePerNight: { economy: 600, premium: 1800 },
    amenities: ['WiFi', 'Common Room', 'Lockers', 'Rooftop'],
    images: ['https://images.unsplash.com/photo-1509840841025-9088ba78a826?w=600&q=80'],
    description: 'Popular backpacker hostel near Gadisar Lake with stunning fort views.',
    coordinates: { lat: 26.9157, lng: 70.9083 },
    type: 'budget', tags: ['Hostel', 'Budget', 'Backpacker'],
  },
  // ── KASHMIR ──
  {
    name: 'The Lalit Grand Palace',
    city: 'Srinagar', state: 'Jammu & Kashmir', region: 'North India',
    address: 'Gupkar Road, Srinagar',
    rating: 4.7, reviews: 1560,
    pricePerNight: { economy: 7000, premium: 18000 },
    amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi', 'Garden', 'Bar'],
    images: ['https://images.unsplash.com/photo-1566837945700-30057527ade0?w=600&q=80'],
    description: 'A heritage palace on the shores of Dal Lake with Himalayan panoramas.',
    coordinates: { lat: 34.0837, lng: 74.7973 },
    type: 'luxury', tags: ['Heritage', 'Lake View', 'Luxury'],
  },
  {
    name: 'Houseboat New Buckingham',
    city: 'Srinagar', state: 'Jammu & Kashmir', region: 'North India',
    address: 'Dal Lake, Boulevard Road, Srinagar',
    rating: 4.5, reviews: 870,
    pricePerNight: { economy: 3000, premium: 7000 },
    amenities: ['WiFi', 'Restaurant', 'Room Service', 'Shikara Ride'],
    images: ['https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=600&q=80'],
    description: 'Experience the magic of living on Dal Lake in a traditional Kashmiri houseboat.',
    coordinates: { lat: 34.0900, lng: 74.8200 },
    type: 'mid-range', tags: ['Houseboat', 'Dal Lake', 'Unique'],
  },
  // ── HIMACHAL ──
  {
    name: 'Wildflower Hall',
    city: 'Shimla', state: 'Himachal Pradesh', region: 'North India',
    address: 'Chharabra, Shimla',
    rating: 4.8, reviews: 1890,
    pricePerNight: { economy: 12000, premium: 28000 },
    amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi', 'Ski', 'Hiking'],
    images: ['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80'],
    description: 'A majestic mountain retreat set among cedar forests above Shimla.',
    coordinates: { lat: 31.1048, lng: 77.1734 },
    type: 'luxury', tags: ['Mountain View', 'Luxury', 'Spa'],
  },
  {
    name: 'Hotel Honeymoon Inn',
    city: 'Manali', state: 'Himachal Pradesh', region: 'North India',
    address: 'Old Manali Road, Manali',
    rating: 4.2, reviews: 1240,
    pricePerNight: { economy: 2000, premium: 5000 },
    amenities: ['WiFi', 'Restaurant', 'Parking', 'Mountain View'],
    images: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80'],
    description: 'Cozy hotel with stunning valley views, perfect for couples and trekkers.',
    coordinates: { lat: 32.2396, lng: 77.1887 },
    type: 'mid-range', tags: ['Mountain View', 'Valley', 'Cozy'],
  },
  // ── KERALA ──
  {
    name: 'Kumarakom Lake Resort',
    city: 'Kottayam', state: 'Kerala', region: 'South India',
    address: 'Kumarakom, Kottayam, Kerala',
    rating: 4.9, reviews: 2340,
    pricePerNight: { economy: 10000, premium: 30000 },
    amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi', 'Backwater Cruise', 'Yoga'],
    images: ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80'],
    description: 'An award-winning backwater resort with traditional Kerala architecture.',
    coordinates: { lat: 9.6110, lng: 76.4335 },
    type: 'luxury', tags: ['Backwaters', 'Luxury', 'Pool'],
  },
  {
    name: 'Zostel Kochi',
    city: 'Kochi', state: 'Kerala', region: 'South India',
    address: 'Fort Kochi, Ernakulam, Kerala',
    rating: 4.4, reviews: 1120,
    pricePerNight: { economy: 700, premium: 2000 },
    amenities: ['WiFi', 'Common Room', 'Breakfast', 'Lockers'],
    images: ['https://images.unsplash.com/photo-1580977276076-ae4b8c219b8e?w=600&q=80'],
    description: 'Vibrant hostel in the heart of Fort Kochi, steps from the Chinese fishing nets.',
    coordinates: { lat: 9.9312, lng: 76.2673 },
    type: 'budget', tags: ['Hostel', 'Fort Kochi', 'Budget'],
  },
  {
    name: 'Fragrant Nature Backwater Resort',
    city: 'Alleppey', state: 'Kerala', region: 'South India',
    address: 'Punnamada Lake, Alleppey',
    rating: 4.6, reviews: 980,
    pricePerNight: { economy: 5000, premium: 12000 },
    amenities: ['Pool', 'Restaurant', 'WiFi', 'Houseboat', 'Kayaking'],
    images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80'],
    description: 'Serene backwater resort with houseboat experiences and Kerala cuisine.',
    coordinates: { lat: 9.4981, lng: 76.3388 },
    type: 'mid-range', tags: ['Backwaters', 'Houseboat', 'Pool'],
  },
  // ── TAMIL NADU ──
  {
    name: 'ITC Grand Chola',
    city: 'Chennai', state: 'Tamil Nadu', region: 'South India',
    address: '63, Mount Road, Guindy, Chennai',
    rating: 4.8, reviews: 3100,
    pricePerNight: { economy: 9000, premium: 22000 },
    amenities: ['Pool', 'Spa', 'Multiple Restaurants', 'WiFi', 'Gym', 'Bar'],
    images: ['https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80'],
    description: 'Chennai\'s most iconic luxury hotel inspired by the grandeur of Chola temples.',
    coordinates: { lat: 13.0827, lng: 80.2707 },
    type: 'luxury', tags: ['Luxury', 'Business', 'Pool'],
  },
  {
    name: 'Hotel Sangam',
    city: 'Madurai', state: 'Tamil Nadu', region: 'South India',
    address: 'Alagarkoil Road, Madurai',
    rating: 4.3, reviews: 1450,
    pricePerNight: { economy: 2500, premium: 6000 },
    amenities: ['Pool', 'Restaurant', 'WiFi', 'Gym', 'Parking'],
    images: ['https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=600&q=80'],
    description: 'A comfortable hotel offering great views of the Meenakshi temple.',
    coordinates: { lat: 9.9252, lng: 78.1198 },
    type: 'mid-range', tags: ['Temple View', 'Pool', 'Central'],
  },
  // ── GOA ──
  {
    name: 'Taj Exotica Resort & Spa',
    city: 'South Goa', state: 'Goa', region: 'West India',
    address: 'Calwaddo, Benaulim, South Goa',
    rating: 4.9, reviews: 2780,
    pricePerNight: { economy: 15000, premium: 40000 },
    amenities: ['Beach', 'Pool', 'Spa', 'Multiple Restaurants', 'WiFi', 'Tennis', 'Watersports'],
    images: ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80'],
    description: 'Goa\'s finest luxury beach resort spread across 56 acres of lush gardens.',
    coordinates: { lat: 15.2993, lng: 73.9125 },
    type: 'luxury', tags: ['Beach', 'Luxury', 'Spa'],
  },
  {
    name: 'Zostel Goa',
    city: 'North Goa', state: 'Goa', region: 'West India',
    address: 'Anjuna Beach, North Goa',
    rating: 4.4, reviews: 2100,
    pricePerNight: { economy: 800, premium: 2500 },
    amenities: ['WiFi', 'Pool', 'Bar', 'Common Room', 'Beach Access'],
    images: ['https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=600&q=80'],
    description: 'Fun beachside hostel at Anjuna with a pool, bar and great party vibes.',
    coordinates: { lat: 15.5736, lng: 73.7404 },
    type: 'budget', tags: ['Beach', 'Hostel', 'Party'],
  },
  // ── MUMBAI ──
  {
    name: 'The Taj Mahal Palace',
    city: 'Mumbai', state: 'Maharashtra', region: 'West India',
    address: 'Apollo Bunder, Colaba, Mumbai',
    rating: 4.9, reviews: 5600,
    pricePerNight: { economy: 18000, premium: 55000 },
    amenities: ['Pool', 'Spa', 'Multiple Restaurants', 'WiFi', 'Gym', 'Sea View', 'Butler'],
    images: ['https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80'],
    description: 'India\'s most iconic hotel overlooking the Gateway of India since 1903.',
    coordinates: { lat: 18.9218, lng: 72.8330 },
    type: 'luxury', tags: ['Iconic', 'Sea View', 'Heritage'],
  },
  {
    name: 'Abode Bombay',
    city: 'Mumbai', state: 'Maharashtra', region: 'West India',
    address: 'Marine Lines, Mumbai',
    rating: 4.5, reviews: 1340,
    pricePerNight: { economy: 3500, premium: 8000 },
    amenities: ['WiFi', 'Restaurant', 'Bar', 'Rooftop', 'AC'],
    images: ['https://images.unsplash.com/photo-1609420879581-31ad5e2fcae6?w=600&q=80'],
    description: 'A boutique hotel in Marine Lines with a trendy rooftop bar.',
    coordinates: { lat: 18.9388, lng: 72.8258 },
    type: 'mid-range', tags: ['Boutique', 'Rooftop', 'Central'],
  },
  // ── DELHI ──
  {
    name: 'The Imperial New Delhi',
    city: 'Delhi', state: 'Delhi', region: 'North India',
    address: 'Janpath, New Delhi',
    rating: 4.8, reviews: 3400,
    pricePerNight: { economy: 12000, premium: 35000 },
    amenities: ['Pool', 'Spa', 'Multiple Restaurants', 'WiFi', 'Gym', 'Art Gallery', 'Bar'],
    images: ['https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80'],
    description: 'A legendary 1930s heritage hotel blending colonial elegance with modern luxury.',
    coordinates: { lat: 28.6219, lng: 77.2166 },
    type: 'luxury', tags: ['Heritage', 'Colonial', 'Luxury'],
  },
  {
    name: 'Zostel Delhi',
    city: 'Delhi', state: 'Delhi', region: 'North India',
    address: 'Paharganj, New Delhi',
    rating: 4.2, reviews: 2100,
    pricePerNight: { economy: 700, premium: 2000 },
    amenities: ['WiFi', 'Common Room', 'Lockers', 'Breakfast', 'AC'],
    images: ['https://images.unsplash.com/photo-1567449303183-ae0d6ed1498c?w=600&q=80'],
    description: 'Popular backpacker hostel in Paharganj, walking distance from New Delhi station.',
    coordinates: { lat: 28.6448, lng: 77.2167 },
    type: 'budget', tags: ['Hostel', 'Budget', 'Central'],
  },
  // ── UTTARAKHAND ──
  {
    name: 'Ananda in the Himalayas',
    city: 'Rishikesh', state: 'Uttarakhand', region: 'North India',
    address: 'The Palace Estate, Narendra Nagar, Rishikesh',
    rating: 4.9, reviews: 1870,
    pricePerNight: { economy: 25000, premium: 60000 },
    amenities: ['Spa', 'Yoga', 'Pool', 'Restaurant', 'WiFi', 'Meditation', 'Ayurveda'],
    images: ['https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=600&q=80'],
    description: 'India\'s top wellness retreat set in a Himalayan palace estate above Rishikesh.',
    coordinates: { lat: 30.0869, lng: 78.2676 },
    type: 'luxury', tags: ['Wellness', 'Yoga', 'Luxury'],
  },
  {
    name: 'Zostel Rishikesh',
    city: 'Rishikesh', state: 'Uttarakhand', region: 'North India',
    address: 'Laxman Jhula, Rishikesh',
    rating: 4.5, reviews: 3200,
    pricePerNight: { economy: 500, premium: 1500 },
    amenities: ['WiFi', 'Ganga View', 'Common Room', 'Yoga', 'Breakfast'],
    images: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80'],
    description: 'Stunning Ganga-view hostel at Laxman Jhula, perfect for budget travellers.',
    coordinates: { lat: 30.1169, lng: 78.3215 },
    type: 'budget', tags: ['Ganga View', 'Spiritual', 'Budget'],
  },
]

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!)
    console.log('MongoDB connected')

    await Hotel.deleteMany({})
    console.log('Cleared existing hotels')

    await Hotel.insertMany(hotels)
    console.log(`✅ Seeded ${hotels.length} hotels successfully!`)

    process.exit(0)
  } catch (err) {
    console.error('Seed failed:', err)
    process.exit(1)
  }
}

seed()