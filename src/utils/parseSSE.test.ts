import { describe, it, expect } from "vitest";
import parseSSE from "./parseSSE";

// describe创建一个测试分组，把相关测试组织起来
describe("parseSSE", () => {

  // it : 要一个具体的测试场景
  it("解析单条完整的 SSE 消息", () => {

    // 构造输入 不一定要真的调用外部服务器，测试可以自己构造输入
    const chunk = 'data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n';

    // chunk + 旧 buffer = ''
    const result = parseSSE(chunk, "");

    // 期望messages最终等于["Hello"]  toEqual-深度比较
    expect(result.messages).toEqual(["Hello"]);
    // 这一段已经完整解析完了，所以不应该还有残留数据
    expect(result.buffer).toBe("");
  });

  it("解析一个 chunk 中的多条消息", () => {
    const chunk =
      'data: {"choices":[{"delta":{"content":"Hi"}}]}\n\n' +
      'data: {"choices":[{"delta":{"content":"there"}}]}\n\n';
    const result = parseSSE(chunk, "");

    expect(result.messages).toEqual(["Hi", "there"]);
    expect(result.buffer).toBe("");
  });

  it("处理不完整 chunk：未解析部分保留在 buffer 中", () => {
    const chunk =
      'data: {"choices":[{"delta":{"content":"Hi"}}]}\n\ndata: {"choices":';
    const result = parseSSE(chunk, "");

    expect(result.messages).toEqual(["Hi"]);

    // 验证解析器有没有正确处理跨chunk数据 
    expect(result.buffer).toBe('data: {"choices":');
  });

  it("从上一次的 buffer 继续拼接解析", () => {

    // 模拟真实网络情况
    const buffer = 'data: {"choices":';
    const chunk = '[{"delta":{"content":"world"}}]}\n\n';
    const result = parseSSE(chunk, buffer);

    expect(result.messages).toEqual(["world"]);
    expect(result.buffer).toBe("");
  });

  it("跳过 [DONE] 结束标记", () => {
    const chunk = "data: [DONE]\n\n";
    const result = parseSSE(chunk, "");

    expect(result.messages).toEqual([]);
    expect(result.buffer).toBe("");
  });


  // SSE(Server-Sent Event, 服务器推送事件)流结束时会出现data: [DONE]
  // 测试保证结束信号不会被当成AI回复
  it("[DONE] 后面仍有内容时只跳过 [DONE]", () => {
    const chunk =
      "data: [DONE]\n\ndata: " +
      '{"choices":[{"delta":{"content":"after"}}]}\n\n';
    const result = parseSSE(chunk, "");

    expect(result.messages).toEqual(["after"]);
  });

  it("忽略没有 delta.content 的消息", () => {
    const chunk = 'data: {"choices":[{"delta":{}}]}\n\n';
    const result = parseSSE(chunk, "");

    expect(result.messages).toEqual([]);
  });

  it("遇到非法 JSON 不抛异常，静默跳过", () => {
    const chunk = "data: {broken json}\n\n";
    const result = parseSSE(chunk, "");

    expect(result.messages).toEqual([]);
    expect(result.buffer).toBe("");
  });

  it("处理空输入", () => {
    const result = parseSSE("", "");

    expect(result.messages).toEqual([]);
    expect(result.buffer).toBe("");
  });

  it("模拟真实流式场景：多个 chunk 跨边界到达", () => {
    const chunks = [
      'data: {"choices":[{"delta":{"content":"Hel',
      'lo"}}]}\n\n',
      'data: {"choices":[{"delta":{"content":" ',
      'World"}}]}\n\ndata: [DONE]\n\n',
    ];

    // 缓冲区(Buffer，暂存数据)
    let buffer = "";
    // 准备一个数组用来保存目前解析出来的所有AI内容
    const allMessages: string[] = [];

    for (const chunk of chunks) {
      const result = parseSSE(chunk, buffer);
      // 把这一次解析剩下的、不完整的数据，保存下来，交给下一次解析。
      buffer = result.buffer;
      // ...展开语法
      allMessages.push(...result.messages);
    }

    expect(allMessages).toEqual(["Hello", " World"]);
    expect(buffer).toBe("");
  });
});
