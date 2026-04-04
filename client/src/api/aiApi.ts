import axiosInstance from './axiosInstance'

export const sendChatMessage = async (
  messages: { role: 'user' | 'assistant'; content: string }[]
) => {
  const res = await axiosInstance.post('/ai/chat', { messages })
  return res.data
}