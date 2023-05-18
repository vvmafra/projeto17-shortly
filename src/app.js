import express from "express"
import cors from "cors"
import dotenv from "dotenv"

const app = express()
app.use(cors())
app.use(express.json())
dotenv.config()

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Using port ${port}`))