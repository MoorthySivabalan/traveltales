import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  Trash2,
  Pencil,
  Plus,
  Calendar,
  Users,
  Loader2,
  PackageOpen,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useTripStore } from "../store/tripStore";
import { getUserTripsApi, deleteTripApi, updateTripApi } from "../api/tripApi";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user } = useAuthStore();
  const { trips, setTrips, removeTrip, updateTrip } = useTripStore();
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    travelDate: "",
    travellers: 2,
    notes: "",
    tier: "economy",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await getUserTripsApi();
        setTrips(res.trips);
      } catch {
        toast.error("Failed to load trips");
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this trip?")) return;
    try {
      await deleteTripApi(id);
      removeTrip(id);
      toast.success("Trip deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const startEdit = (trip: any) => {
    setEditingId(trip._id);
    setEditForm({
      name: trip.name,
      travelDate: trip.travelDate ? trip.travelDate.split("T")[0] : "",
      travellers: trip.travellers || 2,
      notes: trip.notes || "",
      tier: trip.tier || "economy",
    });
  };

  const handleUpdate = async (id: string) => {
    try {
      const res = await updateTripApi(id, editForm);
      updateTrip(id, res.trip);
      setEditingId(null);
      toast.success("Trip updated!");
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">
      {/* Header */}
      <div className="bg-navy dark:bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-blue-300 text-sm mb-1">Welcome back</p>
              <h1 className="font-serif text-3xl md:text-4xl">
                {user?.fullName?.split(" ")[0]}'s{" "}
                <span className="text-accent">Trips</span>
              </h1>
            </div>
            <Link
              to="/explore"
              className="flex items-center gap-2 px-4 py-2.5 bg-brand hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-all"
            >
              <Plus className="w-4 h-4" /> Add New Trip
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: "Saved Trips", value: trips.length },
              {
                label: "Upcoming",
                value: trips.filter(
                  (t) => t.travelDate && new Date(t.travelDate) > new Date(),
                ).length,
              },
              {
                label: "Custom Packages",
                value: trips.filter((t) => t.isCustom).length,
              },
              {
                label: "Total Days Planned",
                value: trips.reduce((acc, t) => acc + t.duration, 0),
              },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-xl p-4">
                <p className="text-2xl font-semibold text-white">
                  {stat.value}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trips Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-brand" />
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-20">
            <PackageOpen className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="font-serif text-2xl text-navy dark:text-white mb-2">
              No trips yet
            </h3>
            <p className="text-gray-400 mb-6">
              Browse packages and save your favourites here
            </p>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-xl font-medium hover:bg-navy transition-colors"
            >
              <Plus className="w-4 h-4" /> Explore Packages
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip, i) => (
              <motion.div
                key={trip._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={
                      trip.image ||
                      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80"
                    }
                    alt={trip.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        trip.tier === "premium"
                          ? "bg-purple-500 text-white"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {trip.tier === "premium" ? "Premium" : "Economy"}
                    </span>
                    {trip.isCustom && (
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-accent text-white">
                        Custom
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="font-serif text-lg">{trip.name}</p>
                    <p className="text-xs text-gray-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {trip.state}
                    </p>
                  </div>
                </div>

                {editingId === trip._id ? (
                  <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">
                        Trip Name
                      </label>
                      <input
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-navy dark:text-white text-sm focus:outline-none focus:border-brand"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">
                        Travel Date
                      </label>
                      <input
                        type="date"
                        value={editForm.travelDate}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            travelDate: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-navy dark:text-white text-sm focus:outline-none focus:border-brand"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">
                          Travellers
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={editForm.travellers}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              travellers: parseInt(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-navy dark:text-white text-sm focus:outline-none focus:border-brand"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">
                          Tier
                        </label>
                        <select
                          value={editForm.tier}
                          onChange={(e) =>
                            setEditForm({ ...editForm, tier: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-navy dark:text-white text-sm focus:outline-none focus:border-brand"
                        >
                          <option value="economy">Economy</option>
                          <option value="premium">Premium</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">
                        Notes
                      </label>
                      <textarea
                        value={editForm.notes}
                        onChange={(e) =>
                          setEditForm({ ...editForm, notes: e.target.value })
                        }
                        rows={2}
                        placeholder="Any special notes..."
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-navy dark:text-white text-sm focus:outline-none focus:border-brand resize-none"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleUpdate(trip._id)}
                        className="flex-1 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-navy transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex-1 py-2 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 rounded-lg text-sm transition-colors hover:border-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {trip.duration} days
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {trip.travellers} travellers
                      </span>
                      {trip.travelDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(trip.travelDate).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </span>
                      )}
                    </div>

                    {trip.notes && (
                      <p className="text-xs text-gray-400 italic mb-3 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                        "{trip.notes}"
                      </p>
                    )}

                    <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                      <button
                        onClick={() => navigate(`/trip-editor/${trip._id}`)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gray-200 dark:border-gray-700 hover:border-brand hover:text-brand dark:hover:border-blue-400 dark:hover:text-blue-400 text-gray-500 dark:text-gray-400 rounded-lg text-sm transition-all"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </button>
                      <Link
                        to={`/explore/${trip.sourcePackageId}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-brand/10 dark:bg-brand/20 hover:bg-brand text-brand hover:text-white dark:text-blue-400 dark:hover:text-white rounded-lg text-sm transition-all"
                      >
                        <MapPin className="w-3.5 h-3.5" /> View
                      </Link>
                      <button
                        onClick={() => handleDelete(trip._id)}
                        className="p-2 border border-gray-200 dark:border-gray-700 hover:border-red-400 hover:text-red-500 text-gray-400 rounded-lg transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
