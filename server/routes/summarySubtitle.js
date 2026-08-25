// DeepSeek API 配置
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
const DEEPSEEK_MODEL = 'deepseek-chat'

export async function summarySubtitle(req, res){
  // req: 前端发给我的东西
  // res: 我要返回给前端的东西
  try{
    // response:response 是 fetch() 返回的 Response 对象，它代表 DeepSeek 返回给你的 HTTP 响应
    const response = await fetch(DEEPSEEK_API_URL,{
      method: 'POST',  // 提交东西    GET：拿东西
      // 发送的格式：HTTP body是JSON
      // API鉴权
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      // body内：发送给ds的请求数据
      // 转成json字符串
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages:[
          {
            role: "system",
            content: '请根据下面这条用户消息，生成一个简短的会话标题。要求：1. 简洁 2. 能概括用户意图 3. 不超过10字 4. 不要解释 用户消息：'
          },
          {
            role: "user",
            content: req.body.userContent
          }
  
        ],
        stream: false,
      }),
    })
    // response.json()：将响应体转换为js对象
    const data = await response.json()
    // res.json()：将JS对象以JSON响应的形式发送给前端
    res.json(data)
  }catch(err){
    console.log(err)
  }
}