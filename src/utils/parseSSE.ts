export default function parseSSE(
  chunk: string ,
  buffer: string
){
  // 1. 拼接之前没有处理完的数据
  buffer += chunk;

  // 2. 按照SSE规则分割消息
  const parts = buffer.split("\n\n");

  // 最后一段可能是不完整数据
  // 所以保留下来
  buffer = parts.pop() || "";
  const messages: string[] = [];

  // 3. 处理完整消息
  for (const part of parts) {

    // 空字符串跳过
    if (!part.trim()) continue;

    // 去掉 SSE 的 data:
    const jsonString = part.replace(/^data:\s*/, "");

    // DeepSeek结束标志
    if(jsonString === "[DONE]"){
      continue;
    }

    try {

      const data = JSON.parse(jsonString);

      const content =
        data.choices?.[0]?.delta?.content;

      if(content){
        messages.push(content);
      }

    } catch(error){

      console.error(
        "SSE解析失败",
        error,
        part
      );
    }
  }
  return {
    messages,
    buffer
  };
}
