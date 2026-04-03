import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Pencil, Check, X, Save, MapPin, IndianRupee, Utensils, 
  Bus, Hotel, Ticket, ChevronDown, ChevronUp, Sparkles, RotateCcw } from "lucide-react";


interface DayPlan {
  day: number;
  title: string;
  places: string[];
  activities: string[];
  meals: string;
  transport: string;
  estimatedCost: number;
  editing: boolean;
}

interface CostBreakdown {
  hotel: number;
  transport: number;
  food: number;
  activities: number;
}

interface ChatMessage {
  role: "user" | "ai";
  text: string;
  timestamp: Date;
}

type BudgetTier = "budget" | "midrange" | "luxury";

// ─── Mock AI engine ────────────────────────────────────────────────────────────
// 🔁 TO SWAP LATER: replace `getMockResponse()` with a POST to /api/v1/ai/plan-trip

const MOCK_ITINERARIES: Record<
  string,
  { days: Omit<DayPlan, "editing">[]; cost: CostBreakdown }
> = {
  default: {
    days: [
      {
        day: 1,
        title: "Arrival & Local Exploration",
        places: ["City Centre", "Local Market", "Heritage Walk"],
        activities: [
          "Check-in to hotel",
          "Evening heritage walk",
          "Street food tour",
        ],
        meals: "Dinner at a local dhaba",
        transport: "Airport taxi + auto-rickshaw",
        estimatedCost: 3200,
      },
      {
        day: 2,
        title: "Main Attractions",
        places: ["Fort / Palace", "Museum", "Garden"],
        activities: [
          "Morning fort visit",
          "Museum tour",
          "Sunset at viewpoint",
        ],
        meals: "Breakfast at hotel · Lunch at café · Dinner at restaurant",
        transport: "Hired cab for the day",
        estimatedCost: 4100,
      },
      {
        day: 3,
        title: "Day Trip & Departure",
        places: ["Nearby Village / Hill", "Local Craft Shop"],
        activities: ["Morning day trip", "Souvenir shopping", "Departure"],
        meals: "Breakfast at hotel · Packed lunch",
        transport: "Shared cab + auto",
        estimatedCost: 2800,
      },
    ],
    cost: { hotel: 4500, transport: 3200, food: 2400, activities: 900 },
  },
  rajasthan: {
    days: [
      {
        day: 1,
        title: "Jaipur — The Pink City",
        places: ["Hawa Mahal", "City Palace", "Jantar Mantar"],
        activities: [
          "Hawa Mahal photo stop",
          "City Palace tour",
          "Jantar Mantar exploration",
        ],
        meals: "Dinner at Laxmi Misthan Bhandar",
        transport: "Auto-rickshaw + cycle rickshaw",
        estimatedCost: 3500,
      },
      {
        day: 2,
        title: "Amber Fort & Local Bazaars",
        places: ["Amber Fort", "Nahargarh Fort", "Johari Bazaar"],
        activities: [
          "Elephant ride at Amber",
          "Nahargarh sunset",
          "Bazaar shopping",
        ],
        meals:
          "Breakfast at hotel · Dal Baati Churma lunch · Dinner at rooftop",
        transport: "Hired car for the day",
        estimatedCost: 4800,
      },
      {
        day: 3,
        title: "Jodhpur — The Blue City",
        places: ["Mehrangarh Fort", "Jaswant Thada", "Clock Tower Market"],
        activities: [
          "Mehrangarh Fort tour",
          "Views from ramparts",
          "Market evening",
        ],
        meals: "Shahi Samosas at Janta Sweet Home · Dinner at Indique",
        transport: "Bus Jaipur→Jodhpur · Auto local",
        estimatedCost: 5200,
      },
      {
        day: 4,
        title: "Jaisalmer — The Golden City",
        places: ["Jaisalmer Fort", "Patwon Ki Haveli", "Sam Sand Dunes"],
        activities: [
          "Living fort exploration",
          "Haveli architecture tour",
          "Camel ride at dunes",
        ],
        meals: "Breakfast · Desert camp dinner",
        transport: "Sleeper bus Jodhpur→Jaisalmer",
        estimatedCost: 5800,
      },
      {
        day: 5,
        title: "Pushkar & Departure",
        places: ["Pushkar Lake", "Brahma Temple", "Savitri Temple"],
        activities: [
          "Holy lake circumambulation",
          "Brahma Temple visit",
          "Departure",
        ],
        meals: "Breakfast · Light lunch",
        transport: "Shared jeep + train",
        estimatedCost: 3100,
      },
    ],
    cost: { hotel: 7200, transport: 5800, food: 4200, activities: 2100 },
  },
  kashmir: {
    days: [
      {
        day: 1,
        title: "Srinagar Arrival & Dal Lake",
        places: ["Dal Lake", "Shikara Ghat", "Lal Chowk"],
        activities: [
          "Houseboat check-in",
          "Shikara ride at sunset",
          "Evening at Lal Chowk",
        ],
        meals: "Wazwan dinner on houseboat",
        transport: "Airport cab",
        estimatedCost: 6200,
      },
      {
        day: 2,
        title: "Mughal Gardens & Old City",
        places: ["Shalimar Bagh", "Nishat Bagh", "Hazratbal Shrine"],
        activities: [
          "Garden hopping",
          "Hazratbal visit",
          "Kashmiri handicraft shopping",
        ],
        meals: "Breakfast on houseboat · Lunch at Ahdoos · Light dinner",
        transport: "Auto + hired cab",
        estimatedCost: 4800,
      },
      {
        day: 3,
        title: "Gulmarg — Snow & Gondola",
        places: ["Gulmarg Gondola", "Khilanmarg Meadows", "St. Mary's Church"],
        activities: [
          "Gondola ride (Phase 1 & 2)",
          "Snow activities",
          "Skiing (seasonal)",
        ],
        meals: "Hotel breakfast · Packed lunch · Dinner at resort",
        transport: "Shared cab Srinagar→Gulmarg",
        estimatedCost: 7500,
      },
      {
        day: 4,
        title: "Pahalgam — Valley of Shepherds",
        places: ["Betaab Valley", "Aru Valley", "Chandanwari"],
        activities: [
          "Betaab Valley trek",
          "Horse riding at Aru",
          "River side picnic",
        ],
        meals: "All meals included at camp",
        transport: "Shared cab",
        estimatedCost: 5600,
      },
      {
        day: 5,
        title: "Sonamarg & Departure",
        places: ["Sonamarg Glacier", "Thajiwas Glacier", "Zero Point"],
        activities: [
          "Glacier walk",
          "Photography at Zero Point",
          "Departure from Srinagar",
        ],
        meals: "Breakfast · Lunch at dhaba",
        transport: "Hired car full day + airport drop",
        estimatedCost: 6800,
      },
    ],
    cost: { hotel: 12000, transport: 7500, food: 5500, activities: 3200 },
  },
  kerala: {
    days: [
      {
        day: 1,
        title: "Kochi — Fort & Backwaters",
        places: ["Fort Kochi", "Chinese Fishing Nets", "Mattancherry Palace"],
        activities: [
          "Chinese nets at sunrise",
          "Mattancherry spice tour",
          "Kathakali show",
        ],
        meals: "Breakfast · Seafood lunch at Grand Hotel · Dinner",
        transport: "Ferry + walking",
        estimatedCost: 4200,
      },
      {
        day: 2,
        title: "Alleppey Houseboat",
        places: ["Alleppey Backwaters", "Vembanad Lake", "Village Canals"],
        activities: [
          "Houseboat boarding",
          "Village canoe ride",
          "Sunset on lake",
        ],
        meals: "All meals on houseboat (Kerala Sadya)",
        transport: "AC houseboat",
        estimatedCost: 8500,
      },
      {
        day: 3,
        title: "Munnar — Tea Plantations",
        places: ["Eravikulam NP", "Tea Museum", "Top Station"],
        activities: [
          "Tea estate walk",
          "Nilgiri Tahr spotting",
          "Top Station viewpoint",
        ],
        meals: "Breakfast · Tea estate café · Dinner at resort",
        transport: "Hired cab",
        estimatedCost: 5800,
      },
    ],
    cost: { hotel: 9000, transport: 4800, food: 3600, activities: 1500 },
  },
};

const BUDGET_MULTIPLIERS: Record<BudgetTier, number> = {
  budget: 0.65,
  midrange: 1,
  luxury: 1.9,
};

function detectDestination(text: string): string {
  const t = text.toLowerCase();
  if (
    t.includes("rajasthan") ||
    t.includes("jaipur") ||
    t.includes("jodhpur") ||
    t.includes("jaisalmer")
  )
    return "rajasthan";
  if (t.includes("kashmir") || t.includes("srinagar") || t.includes("gulmarg"))
    return "kashmir";
  if (
    t.includes("kerala") ||
    t.includes("kochi") ||
    t.includes("alleppey") ||
    t.includes("munnar")
  )
    return "kerala";
  return "default";
}

async function getMockResponse(userMessage: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 1800)); // simulate network delay
  const dest = detectDestination(userMessage);
  const responses: Record<string, string> = {
    rajasthan:
      "Great choice! Rajasthan is magical. I've put together a 5-day itinerary covering Jaipur, Jodhpur, and Jaisalmer — the royal trio. You'll see palaces, forts, and the golden sand dunes. I've kept it balanced between sightseeing and local experiences. Check the itinerary on the right and feel free to edit any day!",
    kashmir:
      "Kashmir is breathtaking — truly heaven on earth! I've planned 5 days covering Srinagar's Dal Lake houseboats, the Mughal gardens, Gulmarg's gondola, Pahalgam's valleys, and Sonamarg's glaciers. It's a perfect mix of culture and nature. The itinerary is ready on the right — customize it to your taste!",
    kerala:
      "Kerala is pure bliss! I've planned 3 days — Fort Kochi's colonial charm, a full day on an Alleppey houseboat through the backwaters, and Munnar's misty tea plantations. The cost includes the houseboat which is a must-do. Edit any day on the right panel!",
    default:
      "I've created a flexible 3-day itinerary for you! It covers local exploration, main attractions, and a day trip. Since you haven't mentioned a specific destination, the places are placeholder — go ahead and edit each day on the right panel to match your destination. You can also tell me a specific place and I'll generate a detailed plan!",
  };
  return responses[dest];
}

// ─── Sub-components ────────────────────────────────────────────────────────────

const TypingIndicator = () => (
  <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none w-fit">
    <Bot className="w-4 h-4 text-brand shrink-0" />
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-brand rounded-full"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────

const TripPlanner = () => {
  const navigate = useNavigate();

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      text: "Hi! I'm your AI trip planner 🌏 Tell me where you'd like to go, how many days, and your budget — and I'll build a day-by-day itinerary for you!\n\nExample: \"Plan a 5-day trip to Rajasthan for 2 people on a mid-range budget\"",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Itinerary state
  const [days, setDays] = useState<DayPlan[]>([]);
  const [tripTitle, setTripTitle] = useState("");
  const [budgetTier, setBudgetTier] = useState<BudgetTier>("midrange");
  const [baseCost, setBaseCost] = useState<CostBreakdown | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ── Send message ──
  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userMsg: ChatMessage = {
      role: "user",
      text: trimmed,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const aiText = await getMockResponse(trimmed);
    // 🔁 BACKEND SWAP: replace getMockResponse() with:
    // const res = await fetch('/api/v1/ai/plan-trip', { method:'POST', body: JSON.stringify({ message: trimmed }) ... })
    // const { reply } = await res.json()

    const dest = detectDestination(trimmed);
    const itinerary = MOCK_ITINERARIES[dest] ?? MOCK_ITINERARIES.default;

    setDays(itinerary.days.map((d) => ({ ...d, editing: false })));
    setBaseCost(itinerary.cost);
    setTripTitle(
      dest === "default"
        ? "My India Trip"
        : dest.charAt(0).toUpperCase() + dest.slice(1) + " Adventure",
    );
    setExpandedDay(1);

    setIsTyping(false);
    setMessages((prev) => [
      ...prev,
      { role: "ai", text: aiText, timestamp: new Date() },
    ]);
  };

  // ── Edit day ──
  const toggleEdit = (dayNum: number) =>
    setDays((prev) =>
      prev.map((d) => (d.day === dayNum ? { ...d, editing: !d.editing } : d)),
    );

  const updateDay = (dayNum: number, field: keyof DayPlan, value: string) =>
    setDays((prev) =>
      prev.map((d) => (d.day === dayNum ? { ...d, [field]: value } : d)),
    );

  // ── Costs with tier multiplier ──
  const scaledCost = baseCost
    ? {
        hotel: Math.round(baseCost.hotel * BUDGET_MULTIPLIERS[budgetTier]),
        transport: Math.round(
          baseCost.transport * BUDGET_MULTIPLIERS[budgetTier],
        ),
        food: Math.round(baseCost.food * BUDGET_MULTIPLIERS[budgetTier]),
        activities: Math.round(
          baseCost.activities * BUDGET_MULTIPLIERS[budgetTier],
        ),
      }
    : null;

  const totalCost = scaledCost
    ? Object.values(scaledCost).reduce((a, b) => a + b, 0)
    : null;

  const costItems = scaledCost
    ? [
        {
          label: "Hotel",
          icon: <Hotel className="w-4 h-4" />,
          value: scaledCost.hotel,
          color: "bg-blue-500",
        },
        {
          label: "Transport",
          icon: <Bus className="w-4 h-4" />,
          value: scaledCost.transport,
          color: "bg-amber-500",
        },
        {
          label: "Food",
          icon: <Utensils className="w-4 h-4" />,
          value: scaledCost.food,
          color: "bg-emerald-500",
        },
        {
          label: "Activities",
          icon: <Ticket className="w-4 h-4" />,
          value: scaledCost.activities,
          color: "bg-purple-500",
        },
      ]
    : [];

  // ── Save trip (triggers auth redirect — swap with real auth check later) ──
  const handleSave = () => {
    // 🔁 BACKEND SWAP: check auth token from your authStore, if not logged in:
    navigate("/login");
  };

  const handleReset = () => {
    setMessages([
      {
        role: "ai",
        text: "Hi! I'm your AI trip planner 🌏 Tell me where you'd like to go, how many days, and your budget — and I'll build a day-by-day itinerary for you!\n\nExample: \"Plan a 5-day trip to Rajasthan for 2 people on a mid-range budget\"",
        timestamp: new Date(),
      },
    ]);
    setDays([]);
    setBaseCost(null);
    setTripTitle("");
    setExpandedDay(null);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">
      {/* ── Page header ── */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand/10 dark:bg-brand/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-brand" />
            </div>
            <div>
              <h1 className="font-serif text-xl text-navy dark:text-white">
                AI Trip Planner
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Describe your trip and get a full itinerary instantly
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-navy dark:hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* ── LEFT: Chat panel ── */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col h-[600px] shadow-sm">
            {/* Chat header */}
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <div className="w-8 h-8 bg-brand rounded-xl flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-navy dark:text-white">
                  TravelTales AI
                </p>
                <p className="text-xs text-emerald-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" />
                  Online
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === "ai"
                        ? "bg-brand"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    {msg.role === "ai" ? (
                      <Bot className="w-4 h-4 text-white" />
                    ) : (
                      <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`max-w-[78%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === "ai"
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-none"
                        : "bg-brand text-white rounded-2xl rounded-br-none"
                    }`}
                  >
                    {msg.text}
                    <p
                      className={`text-[10px] mt-1 ${msg.role === "ai" ? "text-gray-400" : "text-blue-200"}`}
                    >
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-end gap-2"
                >
                  <div className="w-7 h-7 rounded-full bg-brand flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <TypingIndicator />
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick prompts */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 flex gap-2 flex-wrap">
                {[
                  "5 days in Rajasthan",
                  "Kerala backwaters trip",
                  "Kashmir for 5 days",
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setInput(`Plan a ${prompt}`)}
                    className="text-xs bg-brand/10 dark:bg-brand/20 text-brand dark:text-blue-400 px-3 py-1.5 rounded-full hover:bg-brand hover:text-white dark:hover:bg-brand dark:hover:text-white transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input bar */}
            <div className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="e.g. Plan a 5-day Rajasthan trip for 2..."
                  className="flex-1 bg-transparent text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="w-8 h-8 bg-brand hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Itinerary panel ── */}
          <div className="flex flex-col gap-4">
            {/* Empty state */}
            {days.length === 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 h-[600px] flex flex-col items-center justify-center text-center px-8 shadow-sm">
                <div className="w-16 h-16 bg-brand/10 dark:bg-brand/20 rounded-2xl flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-brand" />
                </div>
                <h3 className="font-serif text-xl text-navy dark:text-white mb-2">
                  Your itinerary will appear here
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                  Chat with the AI on the left to generate a personalized
                  day-by-day travel plan.
                </p>
              </div>
            )}

            {/* Itinerary content */}
            {days.length > 0 && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
                >
                  {/* Itinerary header */}
                  <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-brand font-medium mb-0.5">
                        Your Itinerary
                      </p>
                      <h2 className="font-serif text-lg text-navy dark:text-white">
                        {tripTitle}
                      </h2>
                    </div>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 bg-brand hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all hover:scale-105 shadow-md shadow-blue-500/20"
                    >
                      <Save className="w-4 h-4" /> Save Trip
                    </button>
                  </div>

                  {/* Day cards */}
                  <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[420px] overflow-y-auto">
                    {days.map((day) => (
                      <div key={day.day} className="px-5 py-4">
                        {/* Day header */}
                        <div
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() =>
                            setExpandedDay(
                              expandedDay === day.day ? null : day.day,
                            )
                          }
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-brand text-white rounded-lg flex items-center justify-center text-sm font-bold shrink-0">
                              {day.day}
                            </div>
                            {day.editing ? (
                              <input
                                className="text-sm font-medium text-navy dark:text-white bg-gray-100 dark:bg-gray-800 rounded-lg px-2 py-1 outline-none border border-brand/50"
                                value={day.title}
                                onChange={(e) =>
                                  updateDay(day.day, "title", e.target.value)
                                }
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                              />
                            ) : (
                              <span className="text-sm font-medium text-navy dark:text-white">
                                {day.title}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 hidden sm:block">
                              ₹{day.estimatedCost.toLocaleString()}
                            </span>
                            {day.editing ? (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleEdit(day.day);
                                  }}
                                  className="w-7 h-7 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg flex items-center justify-center"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleEdit(day.day);
                                  }}
                                  className="w-7 h-7 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-100 hover:text-red-500 rounded-lg flex items-center justify-center"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleEdit(day.day);
                                }}
                                className="w-7 h-7 bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-brand/10 hover:text-brand rounded-lg flex items-center justify-center"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {expandedDay === day.day ? (
                              <ChevronUp className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </div>

                        {/* Expanded day details */}
                        <AnimatePresence>
                          {expandedDay === day.day && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-3 ml-11 space-y-3">
                                {/* Places */}
                                <div className="flex flex-wrap gap-1.5">
                                  {day.places.map((p) => (
                                    <span
                                      key={p}
                                      className="inline-flex items-center gap-1 text-xs bg-brand/10 dark:bg-brand/20 text-brand dark:text-blue-400 px-2 py-0.5 rounded-full"
                                    >
                                      <MapPin className="w-3 h-3" />
                                      {p}
                                    </span>
                                  ))}
                                </div>

                                {/* Activities */}
                                <ul className="space-y-1">
                                  {day.activities.map((a) => (
                                    <li
                                      key={a}
                                      className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5"
                                    >
                                      <span className="w-1 h-1 bg-brand rounded-full mt-1.5 shrink-0" />
                                      {a}
                                    </li>
                                  ))}
                                </ul>

                                {/* Meals & transport */}
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
                                    <p className="text-[10px] text-gray-400 mb-0.5 flex items-center gap-1">
                                      <Utensils className="w-3 h-3" /> Meals
                                    </p>
                                    <p className="text-xs text-gray-700 dark:text-gray-300">
                                      {day.meals}
                                    </p>
                                  </div>
                                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
                                    <p className="text-[10px] text-gray-400 mb-0.5 flex items-center gap-1">
                                      <Bus className="w-3 h-3" /> Transport
                                    </p>
                                    <p className="text-xs text-gray-700 dark:text-gray-300">
                                      {day.transport}
                                    </p>
                                  </div>
                                </div>

                                {/* Day cost */}
                                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                  <IndianRupee className="w-3.5 h-3.5" />
                                  Estimated:{" "}
                                  <span className="font-semibold text-navy dark:text-white">
                                    ₹{day.estimatedCost.toLocaleString()}
                                  </span>{" "}
                                  per person
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {/* ── Cost summary card ── */}
            {scaledCost && totalCost && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">
                      Estimated Total
                    </p>
                    <p className="font-serif text-2xl text-navy dark:text-white">
                      ₹{totalCost.toLocaleString()}
                      <span className="text-sm font-normal text-gray-400 ml-1">
                        / trip
                      </span>
                    </p>
                  </div>

                  {/* Budget tier toggle */}
                  <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1">
                    {(["budget", "midrange", "luxury"] as BudgetTier[]).map(
                      (tier) => (
                        <button
                          key={tier}
                          onClick={() => setBudgetTier(tier)}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium capitalize transition-all ${
                            budgetTier === tier
                              ? "bg-white dark:bg-gray-700 text-navy dark:text-white shadow-sm"
                              : "text-gray-500 dark:text-gray-400 hover:text-navy dark:hover:text-white"
                          }`}
                        >
                          {tier === "midrange"
                            ? "Mid"
                            : tier.charAt(0).toUpperCase() + tier.slice(1)}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                {/* Cost breakdown bars */}
                <div className="space-y-3">
                  {costItems.map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                          {item.icon} {item.label}
                        </div>
                        <span className="text-xs font-medium text-navy dark:text-white">
                          ₹{item.value.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${item.color} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(item.value / totalCost) * 100}%`,
                          }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Save CTA */}
                <button
                  onClick={handleSave}
                  className="mt-5 w-full bg-brand hover:bg-blue-600 text-white font-medium py-2.5 rounded-xl text-sm transition-all hover:scale-[1.02] shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save & Book This Trip
                </button>
                <p className="text-center text-xs text-gray-400 mt-2">
                  You'll be asked to log in to save your trip
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripPlanner;
