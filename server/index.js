import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { chatRoute,upload } from './routes/chat.js'
import { summarySubtitle } from './routes/summarySubtitle.js'

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

// 解析请求
app.post('/api/chat', upload.none(), chatRoute)
app.post('/api/summarySubtitle', summarySubtitle)

app.listen(PORT, () => {
  console.log(`后端服务已启动:http://localhost:${PORT}`)
})