import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Send, Sparkles, Loader2, MapPin,
  RotateCcw, Copy, CheckCircle, Bot, User
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

const isJsonResponse = (text: string) => {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      JSON.parse(jsonMatch[0])
      return true
    }
    return false
  } catch {
    return false
  }
}

const extractJson = (text: string) => {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) return JSON.parse(jsonMatch[0])
    return null
  } catch {
    return null
  }
}

const TripPlanner = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Namaste! 🙏 I'm your TravelTales AI planner. Tell me your dream destination, budget, and number of days — I'll create a personalized India trip plan for you!\n\nFor example: *\"Plan a 6-day trip to Kashmir for 2 people with a mid-range budget\"*"
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [savingTrip, setSavingTrip] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const addTrip = useTripStore(s => s.addTrip)
  const navigate = useNavigate()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text?: string) => {
    const userText = text || input.trim()
    if (!userText || loading) return

    const userMsg: Message = { role: 'user', content: userText }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await sendChatMessage(
        updatedMessages.filter(m => m.role === 'user' || m.role === 'assistant')
      )
      setMessages(prev => [...prev, { role: 'assistant', content: res.reply }])
    } catch {
      toast.error('AI service unavailable. Try again.')
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again!'
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTrip = async (content: string) => {
    const tripData = extractJson(content)
    if (!tripData) return

    try {
      setSavingTrip(true)
      const res = await createTripFromPackage({
        id: Date.now(),
        name: tripData.name,
        caption: tripData.caption || '',
        state: tripData.state,
        region: tripData.region,
        duration: tripData.duration,
        image: '',
        attractions: tripData.attractions || [],
        itinerary: tripData.itinerary || [],
        pricing: tripData.estimatedCost || {
          economy: { hotel: 'As per AI estimate', transport: 'As per AI estimate' },
          premium: { hotel: 'As per AI estimate', transport: 'As per AI estimate' },
        },
        tags: ['AI Generated'],
        isDefault: false,
        coordinates: [],
      }, 'economy')
      addTrip(res.trip)
      toast.success('Trip saved to your dashboard!')
      navigate('/dashboard')
    } catch {
      toast.error('Failed to save trip. Try again.')
    } finally {
      setSavingTrip(false)
    }
  }

  const resetChat = () => {
    setMessages([{
      role: 'assistant',
      content: "Namaste! 🙏 I'm your TravelTales AI planner. Tell me your dream destination, budget, and number of days — I'll create a personalized India trip plan for you!"
    }])
  }

  const MessageBubble = ({ msg, index }: { msg: Message; index: number }) => {
    const isAI = msg.role === 'assistant'
    const hasJson = isAI && isJsonResponse(msg.content)
    const tripData = hasJson ? extractJson(msg.content) : null

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex gap-3 ${isAI ? '' : 'flex-row-reverse'}`}
      >
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isAI
          ? 'bg-brand text-white'
          : 'bg-accent text-white'}`}
        >
          {isAI
            ? <Bot className="w-4 h-4" />
            : <User className="w-4 h-4" />
          }
        </div>

        {/* Bubble */}
        <div className={`max-w-[80%] ${isAI ? '' : 'items-end flex flex-col'}`}>
          {tripData ? (
            // Structured trip plan card
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
              {/* Trip header */}
              <div className="bg-navy dark:bg-gray-800 p-4">
                <div className="flex items-center gap-2 text-accent text-xs font-medium mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Generated Trip Plan
                </div>
                <h3 className="font-serif text-xl text-white">{tripData.name}</h3>
                <div className="flex gap-3 mt-1 text-gray-400 text-xs">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{tripData.state}
                  </span>
                  <span>{tripData.duration} Days</span>
                  <span>{tripData.region}</span>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Caption */}
                {tripData.caption && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                    "{tripData.caption}"
                  </p>
                )}

                {/* Attractions */}
                {tripData.attractions?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Top Attractions
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {tripData.attractions.map((a: string, i: number) => (
                        <span key={i} className="text-xs bg-brand/10 dark:bg-brand/20 text-brand dark:text-blue-400 px-2 py-0.5 rounded-full">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Itinerary */}
                {tripData.itinerary?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Itinerary
                    </p>
                    <div className="space-y-1.5">
                      {tripData.itinerary.map((day: string, i: number) => (
                        <div key={i} className="flex gap-2 text-sm">
                          <span className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold shrink-0">
                            {i + 1}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed pt-0.5">
                            {day.replace(/^Day \d+[: ]*/, '')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cost */}
                {tripData.estimatedCost && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Estimated Cost
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl">
                        <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">Economy</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{tripData.estimatedCost.economy?.hotel}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{tripData.estimatedCost.economy?.transport}</p>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-xl">
                        <p className="text-xs font-medium text-purple-700 dark:text-purple-400 mb-1">Premium</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{tripData.estimatedCost.premium?.hotel}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{tripData.estimatedCost.premium?.transport}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tips */}
                {tripData.tips?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Pro Tips
                    </p>
                    <ul className="space-y-1">
                      {tripData.tips.map((tip: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <CheckCircle className="w-3 h-3 text-green-500 shrink-0 mt-0.5" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Save button */}
                <button
                  onClick={() => handleSaveTrip(msg.content)}
                  disabled={savingTrip}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand hover:bg-navy text-white rounded-xl text-sm font-medium transition-all disabled:opacity-60"
                >
                  {savingTrip
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Copy className="w-4 h-4" />
                  }
                  {savingTrip ? 'Saving...' : 'Save to My Trips'}
                </button>
              </div>
            </div>
          ) : (
            // Regular text bubble
            <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${isAI
              ? 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300'
              : 'bg-brand text-white'}`}
            >
              {msg.content.split('\n').map((line, i) => (
                <p key={i} className={line === '' ? 'mt-2' : ''}>
                  {line.replace(/\*(.*?)\*/g, '$1')}
                </p>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans flex flex-col">

      {/* Header */}
      <div className="bg-navy dark:bg-gray-900 text-white py-6 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-xl">AI Trip Planner</h1>
              <p className="text-gray-400 text-xs">Powered by Claude AI</p>
            </div>
          </div>
          <button
            onClick={resetChat}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 space-y-5 overflow-y-auto">
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} index={i} />
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 px-4 py-3 rounded-2xl">
              <div className="flex gap-1.5 items-center">
                <div className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts */}
      {messages.length <= 1 && (
        <div className="max-w-4xl mx-auto w-full px-4 pb-3">
          <p className="text-xs text-gray-400 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => sendMessage(prompt)}
                className="text-xs px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-brand hover:text-brand dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all bg-white dark:bg-gray-900"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Ask me to plan your trip... e.g. Plan a 5-day Kerala trip"
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-navy dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand text-sm transition-all disabled:opacity-60"
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="px-4 py-3 bg-brand hover:bg-navy disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all hover:scale-105"
          >
            {loading
              ? <Loader2 className="w-5 h-5 animate-spin" />
              : <Send className="w-5 h-5" />
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default TripPlanner