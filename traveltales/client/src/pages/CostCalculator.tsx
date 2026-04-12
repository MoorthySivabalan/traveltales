import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Calculator, MapPin, Users, Calendar,
  Hotel, Car, UtensilsCrossed, Lightbulb,
  TrendingUp, IndianRupee, Info
} from 'lucide-react'
import { tripCostData } from '../data/costData'
import { Link } from 'react-router-dom'

const GST_RATE = 0.18

const CostCalculator = () => {
  const [selectedId, setSelectedId] = useState(1)
  const [tier, setTier] = useState<'economy' | 'premium'>('economy')
  const [days, setDays] = useState(9)
  const [travellers, setTravellers] = useState(2)
  const [showTips, setShowTips] = useState(false)

  const trip = tripCostData.find(t => t.id === selectedId)!

  const costs = useMemo(() => {
    const selected = trip[tier]
    const rooms = Math.ceil(travellers / 2)
    const hotel = selected.hotel * days * rooms
    const food = selected.food * days * travellers
    const car = selected.car * days
    const subtotal = hotel + food + car
    const gst = Math.round(hotel * GST_RATE)
    const total = subtotal + gst
    return { hotel, food, car, subtotal, gst, total, selected }
  }, [trip, tier, days, travellers])

  const comparisonCosts = useMemo(() => {
    const rooms = Math.ceil(travellers / 2)
    const eco = trip.economy
    const pre = trip.premium
    const ecoTotal = (eco.hotel * days * rooms) + (eco.food * days * travellers) + (eco.car * days)
    const preTotal = (pre.hotel * days * rooms) + (pre.food * days * travellers) + (pre.car * days)
    return { economy: ecoTotal, premium: preTotal }
  }, [trip, days, travellers])

  const maxBar = Math.max(costs.hotel, costs.food, costs.car)

  const handleTripChange = (id: number) => {
    const found = tripCostData.find(t => t.id === id)!
    setSelectedId(id)
    setDays(found.defaultDays)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">

      {/* Header */}
      <div className="bg-navy dark:bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-serif text-4xl md:text-5xl">
                Cost <span className="text-accent">Calculator</span>
              </h1>
              <p className="text-gray-300 text-sm mt-1">
                Estimate your trip budget — hotel, food, transport & GST included
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT — Controls ── */}
          <div className="space-y-5">

            {/* Destination */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                <MapPin className="w-3.5 h-3.5" /> Destination
              </label>
              <select
                value={selectedId}
                onChange={e => handleTripChange(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-navy dark:text-white text-sm focus:outline-none focus:border-brand"
              >
                {tripCostData.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {trip.state}
              </p>
            </div>

            {/* Package Tier */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                <TrendingUp className="w-3.5 h-3.5" /> Package Tier
              </label>
              <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                {(['economy', 'premium'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTier(t)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium capitalize transition-all ${
                      tier === t
                        ? 'bg-white dark:bg-gray-700 text-navy dark:text-white shadow-sm'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Days */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                <Calendar className="w-3.5 h-3.5" /> Number of Days
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setDays(prev => Math.max(1, prev - 1))}
                  className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:border-brand hover:text-brand transition-colors font-bold text-xl"
                >−</button>
                <span className="flex-1 text-center text-3xl font-bold text-navy dark:text-white">
                  {days}
                </span>
                <button
                  onClick={() => setDays(prev => Math.min(30, prev + 1))}
                  className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:border-brand hover:text-brand transition-colors font-bold text-xl"
                >+</button>
              </div>
              <p className="text-xs text-gray-400 text-center mt-2">
                Recommended: {trip.defaultDays} days
              </p>
            </div>

            {/* Travellers */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                <Users className="w-3.5 h-3.5" /> Travellers
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setTravellers(prev => Math.max(1, prev - 1))}
                  className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:border-brand hover:text-brand transition-colors font-bold text-xl"
                >−</button>
                <span className="flex-1 text-center text-3xl font-bold text-navy dark:text-white">
                  {travellers}
                </span>
                <button
                  onClick={() => setTravellers(prev => Math.min(20, prev + 1))}
                  className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:border-brand hover:text-brand transition-colors font-bold text-xl"
                >+</button>
              </div>
              <p className="text-xs text-gray-400 text-center mt-2">
                Rooms needed: {Math.ceil(travellers / 2)}
              </p>
            </div>

            {/* Pro Tips Button */}
            <button
              onClick={() => setShowTips(!showTips)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-accent/10 dark:bg-accent/20 hover:bg-accent hover:text-white text-accent rounded-xl text-sm font-medium transition-all"
            >
              <Lightbulb className="w-4 h-4" />
              {showTips ? 'Hide' : 'Show'} Pro Travel Tips
            </button>

            {/* Tips */}
            {showTips && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-accent" />
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
                    Pro Tips for {trip.name}
                  </p>
                </div>
                {trip.tips.split('\n\n').map((tip, i) => (
                  <p key={i} className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed mb-2 last:mb-0">
                    {tip}
                  </p>
                ))}
              </motion.div>
            )}
          </div>

          {/* ── RIGHT — Results ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Total Cost Banner */}
            <motion.div
              key={`${selectedId}-${tier}-${days}-${travellers}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-navy dark:bg-gray-900 rounded-2xl p-6 border border-gray-800"
            >
              <p className="text-gray-400 text-sm mb-1">Estimated Total Cost</p>
              <div className="flex items-end justify-between flex-wrap gap-4">
                <div>
                  <p className="text-4xl md:text-5xl font-bold text-white">
                    ₹{costs.total.toLocaleString('en-IN')}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    for {days} days · {travellers} travellers · {tier}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-xs">Per person per day</p>
                  <p className="text-accent text-xl font-bold">
                    ₹{Math.round(costs.total / travellers / days).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Cost Breakdown */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="font-serif text-xl text-navy dark:text-white mb-5">
                Cost Breakdown
              </h2>

              <div className="space-y-5">
                {/* Hotel */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-brand/10 dark:bg-brand/20 rounded-lg flex items-center justify-center">
                        <Hotel className="w-4 h-4 text-brand" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-navy dark:text-white">Hotel / Stay</p>
                        <p className="text-xs text-gray-400">{costs.selected.hText}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-navy dark:text-white">
                      ₹{costs.hotel.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(costs.hotel / maxBar) * 100}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full bg-brand rounded-full"
                    />
                  </div>
                </div>

                {/* Food */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                        <UtensilsCrossed className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-navy dark:text-white">Food & Drinks</p>
                        <p className="text-xs text-gray-400">{costs.selected.fText}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-navy dark:text-white">
                      ₹{costs.food.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(costs.food / maxBar) * 100}%` }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className="h-full bg-amber-500 rounded-full"
                    />
                  </div>
                </div>

                {/* Transport */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                        <Car className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-navy dark:text-white">Transport</p>
                        <p className="text-xs text-gray-400">{costs.selected.cText}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-navy dark:text-white">
                      ₹{costs.car.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(costs.car / maxBar) * 100}%` }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="h-full bg-emerald-500 rounded-full"
                    />
                  </div>
                </div>

                {/* GST */}
                <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      GST on Hotel (18%)
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ₹{costs.gst.toLocaleString('en-IN')}
                  </p>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between py-3 border-t-2 border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-5 h-5 text-brand" />
                    <p className="font-semibold text-navy dark:text-white">Total Estimate</p>
                  </div>
                  <p className="text-xl font-bold text-navy dark:text-white">
                    ₹{costs.total.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>

            {/* Economy vs Premium Comparison */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="font-serif text-xl text-navy dark:text-white mb-5">
                Economy vs Premium
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-2xl border-2 transition-all ${
                  tier === 'economy'
                    ? 'border-brand bg-brand/5 dark:bg-brand/10'
                    : 'border-gray-100 dark:border-gray-800'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-navy dark:text-white">Economy</p>
                    {tier === 'economy' && (
                      <span className="text-xs bg-brand text-white px-2 py-0.5 rounded-full">
                        Selected
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-navy dark:text-white">
                    ₹{comparisonCosts.economy.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    ₹{Math.round(comparisonCosts.economy / travellers / days).toLocaleString('en-IN')}/person/day
                  </p>
                  <div className="mt-3 space-y-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      🏨 {trip.economy.hText}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      🍽️ {trip.economy.fText}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      🚗 {trip.economy.cText}
                    </p>
                  </div>
                  <button
                    onClick={() => setTier('economy')}
                    className="mt-3 w-full py-2 text-xs border border-brand text-brand rounded-lg hover:bg-brand hover:text-white transition-all"
                  >
                    Select Economy
                  </button>
                </div>

                <div className={`p-4 rounded-2xl border-2 transition-all ${
                  tier === 'premium'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10'
                    : 'border-gray-100 dark:border-gray-800'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-navy dark:text-white">Premium</p>
                    {tier === 'premium' && (
                      <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">
                        Selected
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-navy dark:text-white">
                    ₹{comparisonCosts.premium.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    ₹{Math.round(comparisonCosts.premium / travellers / days).toLocaleString('en-IN')}/person/day
                  </p>
                  <div className="mt-3 space-y-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      🏨 {trip.premium.hText}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      🍽️ {trip.premium.fText}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      🚗 {trip.premium.cText}
                    </p>
                  </div>
                  <button
                    onClick={() => setTier('premium')}
                    className="mt-3 w-full py-2 text-xs border border-purple-500 text-purple-500 rounded-lg hover:bg-purple-500 hover:text-white transition-all"
                  >
                    Select Premium
                  </button>
                </div>
              </div>

              {/* Savings note */}
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-between">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Premium costs {((comparisonCosts.premium / comparisonCosts.economy - 1) * 100).toFixed(0)}% more than Economy
                </p>
                <p className="text-xs font-medium text-navy dark:text-white">
                  Difference: ₹{(comparisonCosts.premium - comparisonCosts.economy).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3 flex-wrap">
              <Link
                to={`/explore/${selectedId}`}
                className="flex-1 text-center py-3 bg-brand hover:bg-navy text-white rounded-xl font-medium transition-all"
              >
                View Package Details
              </Link>
              <Link
                to="/hotels"
                className="flex-1 text-center py-3 border border-gray-200 dark:border-gray-700 hover:border-brand text-gray-600 dark:text-gray-300 hover:text-brand dark:hover:text-blue-400 rounded-xl font-medium transition-all"
              >
                Find Hotels
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CostCalculator