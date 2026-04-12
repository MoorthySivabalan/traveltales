import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Clock,
  Plus,
  Copy,
  Sparkles,
  X,
  Filter,
  ChevronDown,
  ChevronUp,
  Train,
  Wallet,
  Lightbulb,
} from "lucide-react";
import {
  defaultPackages,
  regionOptions,
  durationOptions,
} from "../data/packagesData";
import {
  oneDayTrips,
  oneDayBaseCities,
  oneDayRegions,
  budgetOptions,
} from "../data/oneDayTrips";
import type { TravelPackage } from "../types/package";
import type { OneDayTrip } from "../data/oneDayTrips";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import { createTripFromPackage } from "../api/tripApi";

const tagColors: Record<string, string> = {
  "Most Popular": "bg-accent text-white",
  "Top Rated": "bg-brand text-white",
  Trending: "bg-emerald-500 text-white",
  Romantic: "bg-pink-500 text-white",
  Heritage: "bg-amber-600 text-white",
  Spiritual: "bg-purple-500 text-white",
  Nature: "bg-green-600 text-white",
  Adventure: "bg-orange-500 text-white",
  Beach: "bg-cyan-500 text-white",
  Mountains: "bg-slate-600 text-white",
};

const budgetColors = {
  budget:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  mid: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  premium:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

const budgetLabels = { budget: "Budget", mid: "Mid-range", premium: "Premium" };

// ── ONE DAY TRIP CARD ──
const OneDayCard = ({ trip, index }: { trip: OneDayTrip; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const { isLoggedIn } = useAuthStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.07 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 group"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={trip.image}
          alt={trip.destination}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {trip.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${tagColors[tag] || "bg-gray-700 text-white"}`}
            >
              {tag}
            </span>
          ))}
        </div>
        <div
          className={`absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full ${budgetColors[trip.budget]}`}
        >
          {budgetLabels[trip.budget]}
        </div>
        <div className="absolute bottom-3 left-3 text-white">
          <p className="font-serif text-lg">{trip.destination}</p>
          <p className="text-xs text-gray-300 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> From {trip.baseCity}
          </p>
        </div>
        <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <Clock className="w-3 h-3" /> 1 Day
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Quick costs */}
        <div className="flex gap-2 flex-wrap mb-3">
          {trip.transport.slice(0, 1).map((t, i) => (
            <span
              key={i}
              className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400"
            >
              <Train className="w-3 h-3" /> {t.cost || "Car only"}
            </span>
          ))}
          {trip.costs.slice(0, 1).map((c, i) => (
            <span
              key={i}
              className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400"
            >
              <Wallet className="w-3 h-3" /> Food: {c.amount}
            </span>
          ))}
        </div>

        {/* Itinerary toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between text-sm text-brand dark:text-blue-400 font-medium mb-2 hover:opacity-80 transition-opacity"
        >
          <span>View Itinerary</span>
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-3 space-y-1.5 border-l-2 border-brand/30 pl-3"
          >
            {trip.itinerary.map((item, i) => (
              <div key={i} className="flex gap-2 text-xs">
                <span className="text-brand dark:text-blue-400 shrink-0 font-medium w-14">
                  {item.time}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {item.activity}
                </span>
              </div>
            ))}
          </motion.div>
        )}

        {/* Tips */}
        {trip.tips.length > 0 && (
          <div className="flex items-start gap-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg">
            <Lightbulb className="w-3 h-3 shrink-0 mt-0.5" />
            <span>{trip.tips[0]}</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={async () => {
  if (!isLoggedIn) {
    toast.error("Please login to save this trip");
    return;
  }

  try {
    await createTripFromPackage(
  {
    id: trip.id,
    name: trip.destination,
    caption: `${trip.destination} one day trip`,
    state: trip.baseState,
    region: trip.region as any,
    duration: 1,
    image: trip.image,
    attractions: trip.tags,
    itinerary: trip.itinerary.map(i => `${i.time} - ${i.activity}`),
    pricing: {
      economy: { hotel: "N/A", transport: trip.transport[0]?.cost || "N/A" },
      premium: { hotel: "N/A", transport: trip.transport[0]?.cost || "N/A" }
    },
    tags: trip.tags,

    // 👇 ADD HERE
    isDefault: false,
    coordinates: []
  },
  "economy"
);

    toast.success("Trip saved to My Trips🎉");
  } catch (err) {
    console.error("SAVE ERROR:", err);
    toast.error("Failed to save trip");
  }
}}
            className="flex-1 text-center py-2 bg-brand/10 dark:bg-brand/20 hover:bg-brand text-brand hover:text-white dark:text-blue-400 dark:hover:text-white rounded-xl text-sm font-medium transition-all"
          >
            Save Trip
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-1 text-center py-2 border border-gray-200 dark:border-gray-700 hover:border-brand hover:text-brand dark:hover:border-blue-400 dark:hover:text-blue-400 text-gray-500 dark:text-gray-400 rounded-xl text-sm transition-all"
          >
            {expanded ? "Hide Plan" : "View Plan"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ── MULTI DAY CARD ──
const MultiDayCard = ({
  pkg,
  index,
}: {
  pkg: TravelPackage;
  index: number;
}) => {
  const { isLoggedIn } = useAuthStore();

  const handleEditCopy = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to save a copy");
      return;
    }
    try {
  const trip = await createTripFromPackage(pkg, "economy");
  toast.success("Package saved!");
  window.location.href = `/trip-editor/${trip._id}`;
} catch (error) {
  console.error("Save trip error:", error);
  toast.error("Failed to save. Try again.");
}
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.07 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group flex flex-col"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={pkg.image}
          alt={pkg.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {pkg.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${tagColors[tag] || "bg-gray-700 text-white"}`}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {pkg.duration} Days
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1 text-xs text-brand dark:text-blue-400 mb-1">
          <MapPin className="w-3 h-3" />
          {pkg.state}
        </div>
        <h3 className="font-serif text-lg text-navy dark:text-white mb-1">
          {pkg.name}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-3 flex-1">
          {pkg.caption}
        </p>

        <div className="flex flex-wrap gap-1 mb-4">
          {pkg.attractions.slice(0, 3).map((a) => (
            <span
              key={a}
              className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md"
            >
              {a}
            </span>
          ))}
          {pkg.attractions.length > 3 && (
            <span className="text-xs text-gray-400">
              +{pkg.attractions.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800 mb-4">
          <div>
            <p className="text-xs text-gray-400">Economy</p>
            <p className="text-sm font-semibold text-navy dark:text-white">
              {pkg.pricing.economy.transport.split(" ")[0]}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Premium</p>
            <p className="text-sm font-semibold text-navy dark:text-white">
              {pkg.pricing.premium.transport.split(" ")[0]}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/explore/${pkg.id}`}
            className="flex-1 text-center py-2.5 bg-brand/10 dark:bg-brand/20 hover:bg-brand text-brand hover:text-white dark:text-blue-400 dark:hover:text-white rounded-xl text-sm font-medium transition-all duration-200"
          >
            View Details
          </Link>
          <button
            onClick={handleEditCopy}
            className="flex items-center gap-1.5 px-3 py-2.5 border border-gray-200 dark:border-gray-700 hover:border-brand hover:text-brand dark:hover:border-blue-400 dark:hover:text-blue-400 text-gray-500 dark:text-gray-400 rounded-xl text-sm transition-all duration-200"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ── MAIN PAGE ──
const ExplorePackages = () => {
  const [activeTab, setActiveTab] = useState<"multiday" | "oneday">("multiday");
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createMode, setCreateMode] = useState<"ai" | "manual" | null>(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [manualForm, setManualForm] = useState({
    name: "",
    state: "",
    days: 5,
    description: "",
  });

  // Multi-day filters
  const [region, setRegion] = useState("All");
  const [duration, setDuration] = useState("All");
  const [tier, setTier] = useState("All");

  // One-day filters
  const [baseCity, setBaseCity] = useState("All");
  const [odRegion, setOdRegion] = useState("All");
  const [budget, setBudget] = useState("All");

  const filteredMultiDay = useMemo(() => {
    return defaultPackages.filter((pkg) => {
      const matchSearch =
        pkg.name.toLowerCase().includes(search.toLowerCase()) ||
        pkg.state.toLowerCase().includes(search.toLowerCase()) ||
        pkg.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchRegion = region === "All" || pkg.region === region;
      const matchDuration =
        duration === "All" ||
        (duration === "1-4 days" && pkg.duration <= 4) ||
        (duration === "5-7 days" && pkg.duration >= 5 && pkg.duration <= 7) ||
        (duration === "8+ days" && pkg.duration >= 8);
      return matchSearch && matchRegion && matchDuration;
    });
  }, [search, region, duration]);

  const filteredOneDay = useMemo(() => {
    return oneDayTrips.filter((trip) => {
      const matchSearch =
        trip.destination.toLowerCase().includes(search.toLowerCase()) ||
        trip.baseCity.toLowerCase().includes(search.toLowerCase()) ||
        trip.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchCity = baseCity === "All" || trip.baseCity === baseCity;
      const matchRegion = odRegion === "All" || trip.region === odRegion;
      const matchBudget =
        budget === "All" ||
        (budget === "Budget" && trip.budget === "budget") ||
        (budget === "Mid-range" && trip.budget === "mid") ||
        (budget === "Premium" && trip.budget === "premium");
      return matchSearch && matchCity && matchRegion && matchBudget;
    });
  }, [search, baseCity, odRegion, budget]);

  const FilterSection = ({
    label,
    options,
    value,
    onChange,
  }: {
    label: string;
    options: string[];
    value: string;
    onChange: (v: string) => void;
  }) => (
    <div className="mb-5">
      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
        {label}
      </p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-navy dark:text-white text-sm focus:outline-none focus:border-brand transition-all cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );

  const SidebarContent = () => (
    <div className="p-4">
      <p className="font-medium text-navy dark:text-white text-sm mb-4 flex items-center gap-2">
        <Filter className="w-4 h-4" /> Filters
      </p>

      {activeTab === "multiday" ? (
        <>
          <FilterSection
            label="Region"
            options={regionOptions}
            value={region}
            onChange={setRegion}
          />
          <FilterSection
            label="Duration"
            options={durationOptions}
            value={duration}
            onChange={setDuration}
          />
          <FilterSection
            label="Tier"
            options={["All", "Economy", "Premium"]}
            value={tier}
            onChange={setTier}
          />
        </>
      ) : (
        <>
          <FilterSection
            label="Base City"
            options={oneDayBaseCities}
            value={baseCity}
            onChange={setBaseCity}
          />
          <FilterSection
            label="Region"
            options={oneDayRegions}
            value={odRegion}
            onChange={setOdRegion}
          />
          <FilterSection
            label="Budget"
            options={budgetOptions}
            value={budget}
            onChange={setBudget}
          />
        </>
      )}

      <button
        onClick={() => {
          setRegion("All");
          setDuration("All");
          setTier("All");
          setBaseCity("All");
          setOdRegion("All");
          setBudget("All");
        }}
        className="w-full mt-2 py-2 text-xs text-gray-400 hover:text-brand dark:hover:text-blue-400 transition-colors"
      >
        Clear all filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">
      {/* ── HEADER ── */}
      <div className="bg-navy dark:bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-serif text-4xl md:text-5xl mb-2">
              Explore <span className="text-accent">Packages</span>
            </h1>
            <p className="text-gray-300 text-base max-w-xl">
              Browse multi-day packages and quick one-day getaways across India.
            </p>
          </motion.div>

          {/* Search + Create */}
          <div className="mt-6 flex gap-3 flex-wrap">
            <div className="flex-1 min-w-[240px] relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={
                  activeTab === "multiday"
                    ? "Search destination, state or tag..."
                    : "Search destination or city..."
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-brand transition-all"
              />
            </div>
            <button
              onClick={() => setShowMobileFilter(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all"
            >
              <Filter className="w-4 h-4" /> Filters
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-accent hover:bg-amber-500 text-white font-medium transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" /> Create Package
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex gap-2">
            <button
              onClick={() => setActiveTab("multiday")}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                activeTab === "multiday"
                  ? "bg-white text-navy"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              Multi-Day Packages
              <span className="ml-2 bg-brand/30 text-xs px-1.5 py-0.5 rounded-full">
                {filteredMultiDay.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("oneday")}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                activeTab === "oneday"
                  ? "bg-white text-navy"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              One Day Trips
              <span className="ml-2 bg-accent/40 text-xs px-1.5 py-0.5 rounded-full">
                {filteredOneDay.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* ── LEFT SIDEBAR (Desktop) ── */}
          <aside className="hidden lg:block w-52 shrink-0">
            <div className="sticky top-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
              <SidebarContent />
            </div>
          </aside>

          {/* ── MAIN GRID ── */}
          <main className="flex-1">
            {activeTab === "multiday" && (
              <>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                  {filteredMultiDay.length} packages found
                </p>
                {filteredMultiDay.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-gray-400">
                      No packages found. Try adjusting your filters.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredMultiDay.map((pkg, i) => (
                      <MultiDayCard key={pkg.id} pkg={pkg} index={i} />
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === "oneday" && (
              <>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                  {filteredOneDay.length} one-day trips found
                </p>
                {filteredOneDay.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-gray-400">
                      No trips found. Try adjusting your filters.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredOneDay.map((trip, i) => (
                      <OneDayCard key={trip.id} trip={trip} index={i} />
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* ── MOBILE FILTER DRAWER ── */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileFilter(false)}
          />
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            className="relative w-72 bg-white dark:bg-gray-900 h-full overflow-y-auto shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
              <span className="font-medium text-navy dark:text-white">
                Filters
              </span>
              <button onClick={() => setShowMobileFilter(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <SidebarContent />
          </motion.div>
        </div>
      )}

      {/* ── CREATE PACKAGE MODAL ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 dark:border-gray-800"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <div>
                <h2 className="font-serif text-xl text-navy dark:text-white">
                  Create Your Package
                </h2>
                <p className="text-gray-400 text-sm mt-0.5">
                  Choose how you want to plan
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setCreateMode(null);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!createMode && (
              <div className="p-6 grid grid-cols-2 gap-4">
                <button
                  onClick={() => setCreateMode("ai")}
                  className="p-5 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-brand text-left transition-all group"
                >
                  <Sparkles className="w-8 h-8 text-brand mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-medium text-navy dark:text-white mb-1">
                    Plan with AI
                  </h3>
                  <p className="text-gray-400 text-xs">
                    Chat with AI to build your itinerary
                  </p>
                </button>
                <button
                  onClick={() => setCreateMode("manual")}
                  className="p-5 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-accent text-left transition-all group"
                >
                  <Filter className="w-8 h-8 text-accent mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-medium text-navy dark:text-white mb-1">
                    Build Manually
                  </h3>
                  <p className="text-gray-400 text-xs">
                    Pick destinations yourself (max 10 days, within a state)
                  </p>
                </button>
              </div>
            )}

            {createMode === "ai" && (
              <div className="p-6">
                <button
                  onClick={() => setCreateMode(null)}
                  className="text-gray-400 hover:text-gray-600 text-sm mb-4 block"
                >
                  ← Back
                </button>
                <div className="bg-brand/10 dark:bg-brand/20 rounded-xl p-4 text-center">
                  <Sparkles className="w-10 h-10 text-brand mx-auto mb-3" />
                  <h3 className="font-serif text-lg text-navy dark:text-white mb-2">
                    AI Trip Planner
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                    Coming in Phase 6! Describe your dream trip and our AI will
                    generate a full itinerary.
                  </p>
                  <Link
                    to="/planner"
                    className="inline-flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium"
                    onClick={() => setShowCreateModal(false)}
                  >
                    <Sparkles className="w-4 h-4" /> Go to Trip Planner
                  </Link>
                </div>
              </div>
            )}

            {createMode === "manual" && (
              <div className="p-6">
                <button
                  onClick={() => setCreateMode(null)}
                  className="text-gray-400 hover:text-gray-600 text-sm mb-4 block"
                >
                  ← Back
                </button>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                      Package Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. My Goa Adventure"
                      value={manualForm.name}
                      onChange={(e) =>
                        setManualForm({ ...manualForm, name: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-navy dark:text-white focus:outline-none focus:border-brand text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Goa, Kerala..."
                      value={manualForm.state}
                      onChange={(e) =>
                        setManualForm({ ...manualForm, state: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-navy dark:text-white focus:outline-none focus:border-brand text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                      Number of Days{" "}
                      <span className="text-gray-400 font-normal">
                        (max 10)
                      </span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={manualForm.days}
                      onChange={(e) =>
                        setManualForm({
                          ...manualForm,
                          days: Math.min(10, parseInt(e.target.value) || 1),
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-navy dark:text-white focus:outline-none focus:border-brand text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                      Description
                    </label>
                    <textarea
                      placeholder="Tell us about your trip idea..."
                      value={manualForm.description}
                      onChange={(e) =>
                        setManualForm({
                          ...manualForm,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-navy dark:text-white focus:outline-none focus:border-brand text-sm resize-none"
                    />
                  </div>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    disabled={!manualForm.name || !manualForm.state}
                    className="w-full py-3 bg-accent hover:bg-amber-500 disabled:opacity-50 text-white rounded-xl font-medium transition-all"
                  >
                    Create My Package
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ExplorePackages;
