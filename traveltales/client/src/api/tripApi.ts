import axiosInstance from './axiosInstance'

export const getUserTripsApi = async () => {
  const res = await axiosInstance.get('/trips')
  return res.data
}


export const bookHotelApi = async (data: any) => {
  const res = await axiosInstance.post("/trips/book-hotel", data);
  return res.data;
};

export const createTripFromPackage = async (pkg: any, tier: string) => {
  try {
    const payload = {
      name: pkg.name,
      caption: pkg.caption,
      state: pkg.state,
      region: pkg.region,
      duration: pkg.duration,
      image: pkg.image,
      attractions: pkg.attractions,
      itinerary: pkg.itinerary,
      pricing: pkg.pricing,
      tags: pkg.tags,
      tier: tier,
      isCustom: true,
      sourcePackageId: pkg.id || 0,
      travellers: 2
    };
    console.log("SENDING PACKAGE:", pkg);
    const res = await axiosInstance.post("/trips", payload);
    return res.data;
  } catch (error) {
    console.error("API ERROR:", error);
    throw error;
  }
};

export const updateTripApi = async (id: string, data: Partial<any>) => {
  const res = await axiosInstance.put(`/trips/${id}`, data)
  return res.data
}

export const deleteTripApi = async (id: string) => {
  const res = await axiosInstance.delete(`/trips/${id}`)
  return res.data
}

/* ✅ NEW FUNCTION (DO NOT TOUCH ANYTHING ELSE) */
export const saveTripApi = async (tripId: string) => {
  const res = await axiosInstance.post(`/trips/save/${tripId}`)
  return res.data
}