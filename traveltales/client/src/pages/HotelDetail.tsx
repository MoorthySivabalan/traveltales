import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { bookHotelApi } from "../api/tripApi";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Star,
  MapPin,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Waves,
  CheckCircle,
  Calendar,
  Users,
  Loader2,
  Phone,
  Mail,
} from "lucide-react";
import { getHotelByIdApi } from "../api/hotelApi";
import TripMapView from "../components/maps/TripMapView";
import { useAuthStore } from "../store/authStore";

interface Hotel {
  _id: string;
  name: string;
  city: string;
  state: string;
  region: string;
  address: string;
  nearestLandmark?: string;
  howToReach?: string;
  builtYear?: number;
  rating: number;
  reviews: number;
  pricePerNight: { economy: number; premium: number };
  amenities: string[];
  images: string[];
  description: string;
  type: "budget" | "mid-range" | "luxury";
  tags: string[];
  coordinates: { lat: number; lng: number };
}

const amenityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="w-4 h-4" />,
  Pool: <Waves className="w-4 h-4" />,
  Gym: <Dumbbell className="w-4 h-4" />,
  Parking: <Car className="w-4 h-4" />,
  Restaurant: <Coffee className="w-4 h-4" />,
};

const typeColors = {
  budget:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "mid-range":
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  luxury:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [tier, setTier] = useState<"economy" | "premium">("economy");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [nights, setNights] = useState(1);

  useEffect(() => {
  const fetchHotel = async () => {
    try {
      const res = await getHotelByIdApi(id!)
     setHotel(res?.hotel || null)
    } catch {
      toast.error("Hotel not found")
      navigate("/hotels")
    } finally {
      setLoading(false)
    }
  }
  fetchHotel()
}, [id])

useEffect(() => {
  if (checkIn && checkOut) {
    const diff = Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24),
    )
    if (diff > 0) setNights(diff)
  }
}, [checkIn, checkOut])
  const totalPrice = hotel
    ? hotel.pricePerNight[tier] * nights * Math.ceil(guests / 2)
    : 0;

  const handleBook = async () => {
  if (!isLoggedIn) {
    toast.error("Please login to book");
    navigate("/login");
    return;
  }

  if (!checkIn || !checkOut) {
    toast.error("Please select check-in and check-out dates");
    return;
  }

  try {
    const payload = {
      hotel: {
        name: hotel?.name,
        state: hotel?.state,
        region: hotel?.region,
        images: hotel?.images,
        amenities: hotel?.amenities,
        pricePerNight: hotel?.pricePerNight,
        tags: hotel?.tags
      },
      checkIn,
      checkOut,
      guests,
      tier
    };

    const res = await bookHotelApi(payload);

    toast.success("Hotel booked successfully!");

    // OPTIONAL: redirect to dashboard
    navigate("/dashboard");

    console.log("BOOKED:", res);
  } catch (error: any) {
    console.error(error);
    toast.error(
      error?.response?.data?.message || "Booking failed"
    );
  }
};
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  if (!hotel) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">
      {/* Hero Image */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={hotel.images[0]}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center gap-2 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-2">
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${typeColors[hotel.type]}`}
              >
                {hotel.type}
              </span>
              {hotel.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium bg-brand text-white px-2.5 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="font-serif text-3xl md:text-5xl text-white mb-2">
              {hotel.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-300 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-accent" />
                {hotel.address}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-accent text-accent" />
                {hotel.rating} ({hotel.reviews.toLocaleString("en-IN")} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="font-serif text-2xl text-navy dark:text-white mb-3">
                About
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {hotel.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="font-serif text-2xl text-navy dark:text-white mb-4">
                Amenities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {hotel.amenities.map((amenity) => (
                  <motion.div
                    key={amenity}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
                  >
                    <div className="text-brand">
                      {amenityIcons[amenity] || (
                        <CheckCircle className="w-4 h-4" />
                      )}
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {amenity}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="font-serif text-2xl text-navy dark:text-white mb-4">
                Location
              </h2>
              <TripMapView
                places={[
                  {
                    lat: hotel.coordinates.lat,
                    lng: hotel.coordinates.lng,
                    label: hotel.name,
                  },
                ]}
                height="300px"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-brand" />
                {hotel.address}
              </p>
            </div>

            {/* Contact */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              {hotel.nearestLandmark && (
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4 text-brand" />
                  <span>Nearest: {hotel.nearestLandmark}</span>
                </div>
              )}
              {hotel.howToReach && (
                <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <Car className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                  <span>{hotel.howToReach}</span>
                </div>
              )}
              {hotel.builtYear && (
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4 text-brand" />
                  <span>Est. {hotel.builtYear}</span>
                </div>
              )}
              <h2 className="font-serif text-2xl text-navy dark:text-white mb-4">
                Contact
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4 text-brand" />
                  <span>+91 9876543210</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4 text-brand" />
                  <span>
                    reservations@{hotel.name.toLowerCase().replace(/\s/g, "")}
                    .com
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4 text-brand" />
                  <span>
                    {hotel.city}, {hotel.state}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column — Booking Card */}
          <div className="space-y-5">
            <div className="sticky top-20 space-y-5">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                <h3 className="font-serif text-xl text-navy dark:text-white mb-4">
                  Book This Hotel
                </h3>

                {/* Tier Toggle */}
                <div className="flex gap-2 mb-5 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                  {(["economy", "premium"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTier(t)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                        tier === t
                          ? "bg-white dark:bg-gray-700 text-navy dark:text-white shadow-sm"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* Price */}
                <div className="text-center mb-5 p-3 bg-brand/10 dark:bg-brand/20 rounded-xl">
                  <p className="text-xs text-gray-400 mb-1">Price per night</p>
                  <p className="text-3xl font-bold text-navy dark:text-white">
                    ₹{hotel.pricePerNight[tier].toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs text-gray-400">per room ({tier})</p>
                </div>

                {/* Dates */}
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="text-xs font-medium text-gray-400 block mb-1.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Check-in
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-navy dark:text-white text-sm focus:outline-none focus:border-brand"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400 block mb-1.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Check-out
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      min={checkIn || new Date().toISOString().split("T")[0]}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-navy dark:text-white text-sm focus:outline-none focus:border-brand"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400 mb-1.5 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> Guests
                    </label>
                    <div className="flex items-center gap-3 mt-1.5">
                      <button
                        onClick={() =>
                          setGuests((prev) => Math.max(1, prev - 1))
                        }
                        className="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:border-brand hover:text-brand transition-colors font-bold text-lg"
                      >
                        −
                      </button>
                      <span className="w-12 text-center font-semibold text-navy dark:text-white">
                        {guests}
                      </span>
                      <button
                        onClick={() =>
                          setGuests((prev) => Math.min(20, prev + 1))
                        }
                        className="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:border-brand hover:text-brand transition-colors font-bold text-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                {checkIn && checkOut && nights > 0 && (
                  <div className="space-y-2 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm">
                    <div className="flex justify-between text-gray-500 dark:text-gray-400">
                      <span>
                        ₹{hotel.pricePerNight[tier].toLocaleString("en-IN")} ×{" "}
                        {nights} nights
                      </span>
                      <span>
                        ₹
                        {(hotel.pricePerNight[tier] * nights).toLocaleString(
                          "en-IN",
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-500 dark:text-gray-400">
                      <span>Rooms ({Math.ceil(guests / 2)})</span>
                      <span>× {Math.ceil(guests / 2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500 dark:text-gray-400">
                      <span>GST (18%)</span>
                      <span>
                        ₹{Math.round(totalPrice * 0.18).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold text-navy dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span>Total</span>
                      <span>
                        ₹{Math.round(totalPrice * 1.18).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBook}
                  className="w-full py-3 bg-brand hover:bg-navy text-white rounded-xl font-medium transition-all hover:scale-[1.02]"
                >
                  Book Now
                </button>
              </div>

              {/* Quick Info */}
              <div className="bg-navy dark:bg-gray-900 rounded-2xl p-5 border border-gray-800">
                <h4 className="text-white font-medium text-sm mb-3">
                  Hotel Summary
                </h4>
                <ul className="space-y-2">
                  {[
                    {
                      label: "Location",
                      value: `${hotel.city}, ${hotel.state}`,
                    },
                    { label: "Region", value: hotel.region },
                    { label: "Type", value: hotel.type },
                    {
                      label: "Rating",
                      value: `${hotel.rating} ⭐ (${hotel.reviews.toLocaleString("en-IN")} reviews)`,
                    },
                  ].map((item) => (
                    <li
                      key={item.label}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-400">{item.label}</span>
                      <span className="text-white font-medium capitalize">
                        {item.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;
