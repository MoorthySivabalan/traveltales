import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Star,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  Sparkles,
  Calendar,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { defaultPackages } from "../data/packagesData";
import { useAuthStore } from "../store/authStore";
import { useTripStore } from "../store/tripStore";
import { createTripFromPackage } from "../api/tripApi";
import toast from "react-hot-toast";
import TripMapView from "../components/maps/TripMapView";

const PackageDetail = () => {
  const { id } = useParams();
  const { isLoggedIn } = useAuthStore();
  const addTrip = useTripStore((s) => s.addTrip);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const pkg = defaultPackages.find((p) => p.id === Number(id));

  const [tier, setTier] = useState<"economy" | "premium">("economy");
  const [expandedDay, setExpandedDay] = useState<number | null>(0);

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <h2 className="font-serif text-2xl text-navy dark:text-white mb-4">
            Package not found
          </h2>
          <Link to="/explore" className="text-brand hover:underline">
            ← Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const handleEditCopy = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to save a copy of this package");
      navigate("/login");
      return;
    }
    try {
      setSaving(true);
      const res = await createTripFromPackage(pkg, tier);
      addTrip(res.trip);
      toast.success("Package saved to your trips!");
      navigate("/dashboard");
    } catch {
      toast.error("Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">
      {/* ── HERO ── */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={pkg.image}
          alt={pkg.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center gap-2 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-3">
              {pkg.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium bg-brand text-white px-2.5 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="font-serif text-3xl md:text-5xl text-white mb-2">
              {pkg.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-300 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-accent" />
                {pkg.state}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-accent" />
                {pkg.duration} Days
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-accent text-accent" />
                4.8 Rating
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Caption */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed italic">
                "{pkg.caption}"
              </p>
            </div>

            {/* Attractions */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="font-serif text-2xl text-navy dark:text-white mb-4">
                Top Attractions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pkg.attractions.map((attraction, i) => (
                  <motion.div
                    key={attraction}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
                  >
                    <CheckCircle className="w-4 h-4 text-brand shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {attraction}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Map Section */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="font-serif text-2xl text-navy dark:text-white mb-4">
                Trip Route Map
              </h2>
              <TripMapView places={pkg.coordinates} height="380px" />
              <div className="flex flex-wrap gap-2 mt-4">
                {pkg.coordinates.map((place, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 text-xs bg-brand/10 dark:bg-brand/20 text-brand dark:text-blue-400 px-2.5 py-1 rounded-full"
                  >
                    <span className="w-4 h-4 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    {place.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Itinerary */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="font-serif text-2xl text-navy dark:text-white mb-6">
                Day-by-Day Itinerary
              </h2>
              <div className="space-y-3">
                {pkg.itinerary.map((day, i) => {
                  const isOpen = expandedDay === i;
                  const dayLabel = `Day ${i + 1}`;
                  const dayContent = day.replace(/^Day \d+[: ]*/, "");

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      viewport={{ once: true }}
                      className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedDay(isOpen ? null : i)}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold shrink-0">
                            {i + 1}
                          </div>
                          <span className="font-medium text-navy dark:text-white text-sm text-left">
                            {dayLabel}
                            {isOpen
                              ? ""
                              : ` — ${dayContent.slice(0, 50)}${dayContent.length > 50 ? "..." : ""}`}
                          </span>
                        </div>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-0">
                          <div className="ml-11 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-l-2 border-brand/30 pl-4">
                            {dayContent}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN — Sticky Sidebar ── */}
          <div className="space-y-5">
            <div className="sticky top-20 space-y-5">
              {/* Pricing Card */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                <h3 className="font-serif text-xl text-navy dark:text-white mb-4">
                  Select Package Tier
                </h3>

                {/* Tier Toggle */}
                <div className="flex gap-2 mb-5 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                  <button
                    onClick={() => setTier("economy")}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      tier === "economy"
                        ? "bg-white dark:bg-gray-700 text-navy dark:text-white shadow-sm"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    Economy
                  </button>
                  <button
                    onClick={() => setTier("premium")}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      tier === "premium"
                        ? "bg-white dark:bg-gray-700 text-navy dark:text-white shadow-sm"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    Premium
                  </button>
                </div>

                {/* Price Details */}
                <div className="space-y-3 mb-5">
                  <div className="flex items-start justify-between gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">
                        Hotel / Stay
                      </p>
                      <p className="text-sm font-medium text-navy dark:text-white">
                        {pkg.pricing[tier].hotel}
                      </p>
                    </div>
                    <MapPin className="w-4 h-4 text-brand shrink-0 mt-1" />
                  </div>
                  <div className="flex items-start justify-between gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Transport</p>
                      <p className="text-sm font-medium text-navy dark:text-white">
                        {pkg.pricing[tier].transport}
                      </p>
                    </div>
                    <Calendar className="w-4 h-4 text-brand shrink-0 mt-1" />
                  </div>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-5 pb-5 border-b border-gray-100 dark:border-gray-800">
                  <Clock className="w-4 h-4" />
                  <span>
                    {pkg.duration} Days · {pkg.region}
                  </span>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Link
                    to={`/checkout/${pkg.id}`}
                    className="w-full block text-center py-3 bg-brand hover:bg-navy text-white rounded-xl font-medium transition-all duration-200 hover:scale-[1.02]"
                  >
                    Book This Package
                  </Link>
                  <button
                    onClick={handleEditCopy}
                    disabled={saving}
                    className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 dark:border-gray-700 hover:border-brand dark:hover:border-blue-400 text-gray-600 dark:text-gray-300 hover:text-brand dark:hover:text-blue-400 rounded-xl text-sm font-medium transition-all disabled:opacity-60"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {saving ? "Saving..." : "Edit My Own Copy"}
                  </button>
                  <Link
                    to="/planner"
                    className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 dark:border-gray-700 hover:border-accent hover:text-accent text-gray-600 dark:text-gray-300 rounded-xl text-sm font-medium transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    Plan with AI Instead
                  </Link>
                </div>
              </div>

              {/* Quick Info Card */}
              <div className="bg-navy dark:bg-gray-900 rounded-2xl p-5 border border-gray-800">
                <h4 className="text-white font-medium text-sm mb-3">
                  Trip Summary
                </h4>
                <ul className="space-y-2">
                  <li className="flex justify-between text-sm">
                    <span className="text-gray-400">Destination</span>
                    <span className="text-white font-medium">{pkg.state}</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-white font-medium">
                      {pkg.duration} Days
                    </span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-gray-400">Region</span>
                    <span className="text-white font-medium">{pkg.region}</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-gray-400">Best For</span>
                    <span className="text-white font-medium">
                      {pkg.tags[0]}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;
