// DeepSeek API 配置
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
const DEEPSEEK_MODEL = 'deepseek-chat'

export async function chatRoute(req, res) {
  try {
    const { messages } = req.body

    // 1. 参数校验：messages 必须是数组
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages 参数必须是数组' })
    }

    // 2. 使用原生 fetch 调用 DeepSeek API（非流式）
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages,
        stream: false,
      }),
    })

    // 3. 处理 API 错误响应
    if (!response.ok) {
      const errorText = await response.text()
      console.error('DeepSeek API 错误：', response.status, errorText)
      return res.status(response.status).json({
        error: '调用 DeepSeek 失败',
        detail: errorText,
      })
    }

    // 4. 解析并返回完整响应
    const data = await response.json()
    return res.json(data)
  } catch (error) {
    console.error('服务器错误：', error.message)
    return res
      .status(500)
      .json({ error: '服务器内部错误', detail: error.message })
  }
}
