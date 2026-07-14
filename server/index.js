import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { chatRoute } from './routes/chat.js'

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

app.post('/api/chat', chatRoute)

app.listen(PORT, () => {
  console.log(`后端服务已启动:http://localhost:${PORT}`)
})
