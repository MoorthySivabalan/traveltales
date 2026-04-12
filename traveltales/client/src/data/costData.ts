export interface CostTier {
  hotel: number
  food: number
  car: number
  hText: string
  fText: string
  cText: string
}

export interface TripCostData {
  id: number
  name: string
  state: string
  defaultDays: number
  economy: CostTier
  premium: CostTier
  tips: string
}

export const tripCostData: TripCostData[] = [
  {
    id: 1,
    name: 'Magical Rajasthan',
    state: 'Rajasthan',
    defaultDays: 9,
    economy: {
      hotel: 2000, food: 500, car: 1800,
      hText: 'Budget Hotel: ₹2,000 (2 persons/day)',
      fText: 'Food: ₹400–₹600 (Local Thalis)',
      cText: 'Non-AC Car: ₹1,800/day',
    },
    premium: {
      hotel: 5000, food: 2000, car: 4000,
      hText: 'Luxury Hotel: ₹5,000 (2 persons/day)',
      fText: 'Food: ₹1,500–₹2,500 (Fine Dining)',
      cText: 'AC Car: ₹4,000/day',
    },
    tips: 'Shopping: Visit Johari Bazaar in Jaipur for gemstones and Sadar Bazaar in Jaisalmer for camel leather items.\n\nBest Time for Temples: Reach Karni Mata Temple (Bikaner) at 4:30 AM to see the morning rituals.\n\nBest Place to Eat: Chokhi Dhani (Jaipur) for a village-themed dinner.',
  },
  {
    id: 2,
    name: 'Romantic Udaipur Escapes',
    state: 'Rajasthan',
    defaultDays: 10,
    economy: {
      hotel: 2000, food: 500, car: 2500,
      hText: 'Budget Hotel: ₹2,000 (2 persons/day)',
      fText: 'Food: ₹400–₹600 (Local Thalis)',
      cText: 'Non-AC Car: ₹2,500/day',
    },
    premium: {
      hotel: 5000, food: 2000, car: 4000,
      hText: 'Luxury Hotel: ₹5,000 (2 persons/day)',
      fText: 'Food: ₹1,500–₹2,500 (Fine Dining)',
      cText: 'AC Car: ₹4,000/day',
    },
    tips: 'Shopping: Buy Pichwai paintings and miniature art from Hathi Pol Bazaar.\n\nBest Time for Temples: Visit Dilwara Temples (Mt Abu) between 12 PM and 5 PM.\n\nBest Place to Eat: Ambrai (Udaipur) for a sunset dinner by Lake Pichola.',
  },
  {
    id: 3,
    name: 'Heavenly Kashmir',
    state: 'Jammu & Kashmir',
    defaultDays: 6,
    economy: {
      hotel: 3000, food: 600, car: 2500,
      hText: 'Budget Hotel: ₹3,000 (2 persons/day)',
      fText: 'Food: ₹500–₹700 (Houseboat meals)',
      cText: 'Non-AC Car: ₹2,500/day',
    },
    premium: {
      hotel: 7000, food: 2400, car: 5000,
      hText: 'Luxury Hotel: ₹7,000 (2 persons/day)',
      fText: 'Food: ₹1,800–₹3,000 (Traditional Wazwan)',
      cText: 'AC Car: ₹5,000/day',
    },
    tips: 'Shopping: Buy authentic Saffron and Kani shawls from Government Emporiums.\n\nBest Time: Take the Shikara ride at 5 AM on Dal Lake to see the Floating Vegetable Market.\n\nBest Place to Eat: Ahdoos (Srinagar) for the famous 36-course Wazwan meal.',
  },
  {
    id: 4,
    name: 'Heritage Maharashtra Trails',
    state: 'Maharashtra',
    defaultDays: 5,
    economy: {
      hotel: 2000, food: 500, car: 2500,
      hText: 'Budget Hotel: ₹2,000 (2 persons/day)',
      fText: 'Food: ₹400–₹600 (Local Thalis)',
      cText: 'Non-AC Car: ₹2,500/day',
    },
    premium: {
      hotel: 5000, food: 2600, car: 3500,
      hText: 'Luxury Hotel: ₹5,000 (2 persons/day)',
      fText: 'Food: ₹1,800–₹3,500 (Boutique Dining)',
      cText: 'AC Car: ₹3,500/day',
    },
    tips: 'Shopping: Look for Paithani Silk Sarees and Himroo shawls in Aurangabad.\n\nBest Time for Temples: Book Shirdi Darshan tickets online at least 15 days in advance.\n\nBest Place to Eat: Bhoj Thali (Aurangabad) for a massive local vegetarian feast.',
  },
  {
    id: 5,
    name: 'Serene Himachal',
    state: 'Himachal Pradesh',
    defaultDays: 7,
    economy: {
      hotel: 3000, food: 550, car: 3500,
      hText: 'Budget Hotel: ₹3,000 (2 persons/day)',
      fText: 'Food: ₹450–₹650 (Dhabas)',
      cText: 'Non-AC Car: ₹3,500/day',
    },
    premium: {
      hotel: 5000, food: 2200, car: 5000,
      hText: 'Luxury Hotel: ₹5,000 (2 persons/day)',
      fText: 'Food: ₹1,600–₹2,800 (Cafe Culture)',
      cText: 'AC Car: ₹5,000/day',
    },
    tips: 'Shopping: Buy wooden toys at Lakkar Bazaar (Shimla) and woolens at the Tibetan Market (Manali).\n\nBest Time: Reach Solang Valley by 8:30 AM for the best paragliding slots.\n\nBest Place to Eat: Johnson\'s Cafe (Manali) for Himalayan Trout.',
  },
  {
    id: 6,
    name: 'Scenic Kumaon Retreats',
    state: 'Uttarakhand',
    defaultDays: 6,
    economy: {
      hotel: 3000, food: 500, car: 1666,
      hText: 'Budget Hotel: ₹15,000 (Total 5 Nights)',
      fText: 'Food: ₹400–₹600',
      cText: 'Budget Car (Sedan): ₹10,000 Total',
    },
    premium: {
      hotel: 6000, food: 1900, car: 2666,
      hText: 'Premium Hotel: ₹30,000 (Total 5 Nights)',
      fText: 'Food: ₹1,400–₹2,400',
      cText: 'Premium Car (SUV): ₹16,000 Total',
    },
    tips: 'Shopping: Buy local copperware in Almora and high-quality beeswax candles in Nainital.\n\nBest Time: Visit Snow View Point early morning for the clearest views of Nanda Devi.\n\nBest Place to Eat: Sakley\'s (Nainital) for traditional pastries and coffee.',
  },
  {
    id: 7,
    name: 'Colorful Gujarat',
    state: 'Gujarat',
    defaultDays: 7,
    economy: {
      hotel: 1500, food: 450, car: 1200,
      hText: 'Budget Stay: ₹9,000 (6 Nights)',
      fText: 'Food: ₹350–₹550',
      cText: 'Economy Train + Car: ₹6,000 Sedan',
    },
    premium: {
      hotel: 3000, food: 1600, car: 2400,
      hText: 'Premium Hotel: ₹18,000 (6 Nights)',
      fText: 'Food: ₹1,200–₹2,000',
      cText: 'Premium Train + Car: ₹9,000 SUV',
    },
    tips: 'Shopping: Buy Bandhani fabrics and Patola silk in Ahmedabad.\n\nBest Time: Visit the Statue of Unity for the Laser Show at 7 PM.\n\nBest Place to Eat: Agashiye (Ahmedabad) for a terrace-top Gujarati Thali experience.',
  },
  {
    id: 8,
    name: 'Divine Uttarakhand',
    state: 'Uttarakhand',
    defaultDays: 5,
    economy: {
      hotel: 1500, food: 500, car: 1400,
      hText: 'Budget Hotel: ₹6,000 (4 Nights)',
      fText: 'Food: ₹400–₹600',
      cText: 'Budget Car (Sedan): ₹7,000 Total',
    },
    premium: {
      hotel: 3500, food: 1900, car: 2200,
      hText: 'Premium Hotel: ₹14,000 (4 Nights)',
      fText: 'Food: ₹1,400–₹2,400',
      cText: 'Premium Car (SUV): ₹11,000 Total',
    },
    tips: 'Shopping: Buy aromatic oils in Rishikesh and local jams in Mussoorie.\n\nBest Time for Temples: Reach Har Ki Pauri 1 hour early for the Evening Ganga Aarti.\n\nBest Place to Eat: Chotiwala (Rishikesh) for traditional North Indian meals.',
  },
  {
    id: 9,
    name: 'Spiritual Puri & Konark',
    state: 'Odisha',
    defaultDays: 4,
    economy: {
      hotel: 1500, food: 400, car: 1750,
      hText: 'Budget Hotel: ₹6,000 (4 Days)',
      fText: 'Food: ₹300–₹500',
      cText: 'Sedan: ₹7,000 Total',
    },
    premium: {
      hotel: 3750, food: 1500, car: 2500,
      hText: 'Premium Hotel: ₹15,000 (4 Days)',
      fText: 'Food: ₹1,000–₹2,000',
      cText: 'SUV: ₹10,000 Total',
    },
    tips: 'Shopping: Look for Pattachitra paintings and Pipli appliqué handbags.\n\nBest Time: Visit Puri Beach at 5:30 AM to watch the local fishing community at work.\n\nBest Place to Eat: Wildgrass Restaurant (Puri) for authentic Odia seafood.',
  },
  {
    id: 10,
    name: 'Mystic Sikkim & Darjeeling',
    state: 'Sikkim & West Bengal',
    defaultDays: 7,
    economy: {
      hotel: 2000, food: 500, car: 2570,
      hText: 'Budget Hotel: ₹12,000 (6 Nights)',
      fText: 'Food: ₹400–₹600',
      cText: 'Budget Car: ₹18,000 (7 Days)',
    },
    premium: {
      hotel: 5000, food: 2000, car: 4285,
      hText: 'Premium Hotel: ₹30,000 (6 Nights)',
      fText: 'Food: ₹1,500–₹2,500',
      cText: 'Premium Car: ₹30,000 (7 Days)',
    },
    tips: 'Shopping: Buy Darjeeling Tea directly from tea estates and Tibetan prayer wheels.\n\nBest Time: Tiger Hill (Darjeeling) requires a 3:30 AM start to catch sunrise over Kanchenjunga.\n\nBest Place to Eat: Glenary\'s (Darjeeling) for English breakfast and Kunga\'s for Momos.',
  },
  {
    id: 11,
    name: 'Coastal City Escapes',
    state: 'Maharashtra & Goa',
    defaultDays: 6,
    economy: {
      hotel: 2400, food: 650, car: 1166,
      hText: 'Budget Hotel: ₹12,000 (5 Nights)',
      fText: 'Food: ₹500–₹800',
      cText: 'Local/Bike Rental: ₹7,000 Total',
    },
    premium: {
      hotel: 6000, food: 3750, car: 3000,
      hText: 'Premium Hotel: ₹30,000 (5 Nights)',
      fText: 'Food: ₹2,500–₹5,000',
      cText: 'Private Cab: ₹18,000 Total',
    },
    tips: 'Shopping: Street shop at Colaba Causeway (Mumbai) and Anjuna Flea Market (Goa) on Wednesdays.\n\nBest Time: Visit Palolem Beach (South Goa) for peace and Baga Beach for water sports.\n\nBest Place to Eat: Leopold Cafe (Mumbai) and Britto\'s (Baga Beach) for seafood.',
  },
  {
    id: 12,
    name: 'Historic Delhi & Agra',
    state: 'Delhi & Uttar Pradesh',
    defaultDays: 5,
    economy: {
      hotel: 2500, food: 575, car: 3000,
      hText: 'Budget Hotel: ₹10,000 (4 Nights)',
      fText: 'Food: ₹450–₹700',
      cText: 'Sedan: ₹15,000 (5 Days)',
    },
    premium: {
      hotel: 5000, food: 3000, car: 4000,
      hText: 'Premium Hotel: ₹20,000 (4 Nights)',
      fText: 'Food: ₹2,000–₹4,000',
      cText: 'SUV: ₹20,000 (5 Days)',
    },
    tips: 'Shopping: Chandni Chowk (Delhi) for bridal wear and Sadar Bazaar (Agra) for Petha.\n\nBest Time: Visit the Taj Mahal at sunrise (6 AM) for the softest lighting and fewer crowds.\n\nBest Place to Eat: Paranthe Wali Gali (Old Delhi) for legendary stuffed paranthas.',
  },
]