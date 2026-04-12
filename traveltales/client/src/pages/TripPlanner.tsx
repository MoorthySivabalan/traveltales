import { useState, useRef, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Send,
  Loader2,
  RotateCcw,
  Bot,
  User
} from 'lucide-react'

import { sendChatMessage } from '../api/aiApi'
import { createTripFromPackage } from '../api/tripApi'
import { useTripStore } from '../store/tripStore'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const suggestedPrompts = [
  'Plan a 5-day trip to Kerala backwaters',
  'Suggest a budget trip to Rajasthan for 2 people',
  'Best places to visit in Himachal in winter',
  'Plan a spiritual trip to Varanasi and Rishikesh',
  'Family trip to Ooty and Kodaikanal for 4 days',
]

const extractJson = (text: string) => {
  try {
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) return null
    return JSON.parse(match[0])
  } catch {
    return null
  }
}

const TripPlanner = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Namaste! 🙏 I'm your TravelTales AI planner. Tell me your dream destination, budget, and duration — I'll build a full India trip plan for you."
    }
  ])

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  // Track which message index is currently being saved to avoid global loading state
  const [savingIndex, setSavingIndex] = useState<number | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const addTrip = useTripStore((s) => s.addTrip)
  const navigate = useNavigate()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text?: string) => {
    const userText = text || input.trim()
    if (!userText || loading) return

    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: userText }
    ]

    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await sendChatMessage(newMessages)
      setMessages((prev) => [...prev, { role: 'assistant', content: res.reply }])
    } catch (err) {
      console.error(err)
      toast.error('AI service error')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTrip = async (content: string, index: number) => {
    const tripData = extractJson(content)

    if (!tripData) {
      toast.error('Invalid AI response format')
      return
    }

    try {
      setSavingIndex(index)
      const res = await createTripFromPackage(
        {
          id: Date.now(),
          name: tripData.name || 'My AI Trip',
          caption: tripData.caption || '',
          state: tripData.state || '',
          region: tripData.region || '',
          duration: tripData.duration || 1,
          image: '',
          attractions: tripData.attractions || [],
          itinerary: tripData.itinerary || [],
          pricing: tripData.estimatedCost || {
            economy: { hotel: '', transport: '' },
            premium: { hotel: '', transport: '' }
          },
          tags: ['AI Generated'],
          isDefault: false,
          coordinates: []
        },
        'economy'
      )

      addTrip(res.trip)
      toast.success('Trip saved!')
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      toast.error('Failed to save trip')
    } finally {
      setSavingIndex(null)
    }
  }

  // Memoized Message Component to prevent unnecessary re-renders
  const MessageBubble = ({ msg, index }: { msg: Message, index: number }) => {
    const isAI = msg.role === 'assistant'
    // Extract JSON once per message
    const tripData = useMemo(() => isAI ? extractJson(msg.content) : null, [msg.content, isAI])
    const isSaving = savingIndex === index

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex gap-3 ${isAI ? 'flex-row' : 'flex-row-reverse'}`}
      >
        <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${isAI ? 'bg-blue-600' : 'bg-green-600'} text-white`}>
          {isAI ? <Bot size={16} /> : <User size={16} />}
        </div>

        <div className={`max-w-[85%] ${!isAI && 'text-right'}`}>
          {tripData ? (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 text-left">
              <h3 className="font-bold text-gray-800">{tripData.name}</h3>
              <p className="text-xs text-blue-600 font-medium uppercase tracking-wider">
                {tripData.state} • {tripData.duration} Days
              </p>

              <div className="mt-3 space-y-2 border-l-2 border-blue-100 pl-3">
                {tripData.itinerary?.slice(0, 3).map((day: string, i: number) => (
                  <p key={i} className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-400">D{i + 1}</span> {day}
                  </p>
                ))}
                {tripData.itinerary?.length > 3 && <p className="text-xs text-gray-400 italic">...and more days</p>}
              </div>

              <button
                onClick={() => handleSaveTrip(msg.content, index)}
                disabled={savingIndex !== null}
                className="mt-4 w-full flex justify-center items-center gap-2 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg transition-colors text-sm font-medium"
              >
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : null}
                {isSaving ? 'Saving...' : 'Save to My Trips'}
              </button>
            </div>
          ) : (
            <div className={`px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap ${isAI ? 'bg-gray-200 text-gray-800 rounded-tl-none' : 'bg-blue-600 text-white rounded-tr-none'}`}>
              {msg.content}
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col max-w-2xl mx-auto border-x shadow-xl">
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-lg font-bold">TravelTales AI</h1>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-[10px] text-gray-400">AI Specialist Online</p>
          </div>
        </div>
        <button
          onClick={() => setMessages([{ role: 'assistant', content: "Let's plan your next trip!" }])}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
          title="Reset Chat"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
        {messages.map((m, i) => (
          <MessageBubble key={i} msg={m} index={i} />
        ))}
        {loading && (
          <div className="flex gap-2 items-center text-gray-400 text-sm italic">
            <Loader2 className="animate-spin" size={14} />
            Crafting your itinerary...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer / Input */}
      <div className="p-4 bg-white border-t">
        <div className="flex gap-2 mb-3 overflow-x-auto pb-2 no-scrollbar">
          {suggestedPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => sendMessage(p)}
              disabled={loading}
              className="whitespace-nowrap text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full border border-gray-200 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex gap-2 bg-gray-50 p-1 rounded-xl border focus-within:border-blue-400 transition-all">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 bg-transparent px-3 py-2 text-sm outline-none disabled:cursor-not-allowed"
            placeholder="Where do you want to go?"
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-all"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default TripPlanner;