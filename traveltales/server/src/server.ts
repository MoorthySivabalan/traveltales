require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
import dotenv from 'dotenv'
dotenv.config() 
import app from './app'
import connectDB from './config/db'
const PORT = process.env.PORT || 5000
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`TravelTales server running on port ${PORT}`)
  })
})