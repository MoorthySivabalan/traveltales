export interface DayPlan {
  day: number
  title: string
  description: string
}

export interface PackagePricing {
  economy: {
    hotel: string
    transport: string
    total?: string
  }
  premium: {
    hotel: string
    transport: string
    total?: string
  }
}

export type PackageRegion =
  | 'North India'
  | 'South India'
  | 'East India'
  | 'West India'
  | 'Central India'

export interface TravelPackage {
  id: number
  name: string
  caption: string
  region: PackageRegion
  state: string
  duration: number
  image: string
  attractions: string[]
  itinerary: string[]
  pricing: PackagePricing
  tags: string[]
  isDefault: boolean
}