// 解析formData工具
import multer from "multer";
// DeepSeek API 配置
const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_MODEL = "deepseek-chat";

const KIMI_API_KEY = process.env.KIMI_API_KEY;
const KIMI_API_URL = "https://api.moonshot.cn/v1/chat/completions";
const KIMI_MODEL = "kimi-k2.6";

const models = {
  "DeepSeek-v4-flash": {
    apiUrl: DEEPSEEK_API_URL,
    apiKey: DEEPSEEK_API_KEY,
    model: DEEPSEEK_MODEL,
    displayName: "DeepSeek-v4-flash",
  },
  "Kimi-k2.6": {
    apiUrl: KIMI_API_URL,
    apiKey: KIMI_API_KEY,
    model: KIMI_MODEL,
    displayName: "kimi-k2.6",
  },
};

// console.log('KIMI_API_KEY exists:', !!process.env.KIMI_API_KEY)
// console.log('KIMI_API_URL:', KIMI_API_URL)
// console.log('KIMI_MODEL:', KIMI_MODEL)
// res\req来自Node后端架构（Express）
// req.request,请求：前端发给服务器的数据
// response，响应：服务器返回给前端的数据

// 创建multer实例
export const upload = multer({
  storage: multer.memoryStorage(),
});
export async function chatRoute(req, res) {
  try {
    const { messages: messagesJson, model } = req.body;
    const messages = JSON.parse(messagesJson);
    const config = models[model];

    if (!config) {
      return res.status(400).json({ err: "不支持的模型" });
    }
    // 1. 参数校验：messages 必须是数组
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages 参数必须是数组" });
    }

    console.log(messages);

    // 2. 使用原生 fetch 调用 DeepSeek API（非流式）
    const response = await fetch(config.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        stream: true,
      }),
    });

    // 3. 处理 API 错误响应
    if (!response.ok) {
      const errorText = await response.text();
      console.error("DeepSeek API 错误：", response.status, errorText);
      return res.status(response.status).json({
        error: "调用 DeepSeek 失败",
        detail: errorText,
      });
    }

    res.setHeader("Connection", "keep-alive");
    // 设置响应头
    res.setHeader("Content-Type", "text/event-stream");
    // 不要缓存这个响应
    res.setHeader("Cache-Control", "no-cache");

    // 4. 解析并返回完整响应

    // 非流式代码 response.json()会等待全部结束
    // const data = await response.json()
    // return res.json(data)
    // const decoder = new TextDecoder();
    const reader = response.body?.getReader();

    if (!reader) {
      throw new Error("无法获取响应流");
    }
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      // 向浏览器发送一部分响应数据，但是发送后连接不会关闭
      res.write(value);
    }

    // http连接什么时候结束
    res.end();
  } catch (error) {
    console.error("服务器错误：", error.message);
    return res
      .status(500)
      .json({ error: "服务器内部错误", detail: error.message });
  }
}
