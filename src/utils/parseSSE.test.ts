import { describe, it, expect } from "vitest";
import parseSSE from "./parseSSE";

describe("parseSSE", () => {
  it("解析单条完整的 SSE 消息", () => {
    const chunk = 'data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n';
    const result = parseSSE(chunk, "");

    expect(result.messages).toEqual(["Hello"]);
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
    expect(result.buffer).toBe('data: {"choices":');
  });

  it("从上一次的 buffer 继续拼接解析", () => {
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

    let buffer = "";
    const allMessages: string[] = [];

    for (const chunk of chunks) {
      const result = parseSSE(chunk, buffer);
      buffer = result.buffer;
      allMessages.push(...result.messages);
    }

    expect(allMessages).toEqual(["Hello", " World"]);
    expect(buffer).toBe("");
  });
});
