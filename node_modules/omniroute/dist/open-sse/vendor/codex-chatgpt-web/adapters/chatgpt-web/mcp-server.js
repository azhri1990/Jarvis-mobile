// open-sse/vendor/codex-chatgpt-web/adapters/chatgpt-web/mcp-server.ts
import { createHash } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as z from "zod/v4";

// open-sse/vendor/codex-chatgpt-web/types.ts
function namespacedToolName(namespace, name) {
  return namespace ? `${namespace}__${name}` : name;
}

// open-sse/vendor/codex-chatgpt-web/adapters/chatgpt-web/turn-broker.ts
import { randomBytes } from "node:crypto";
import { createConnection, createServer } from "node:net";
var MAX_BROKER_LINE_CHARS = 67108864;
function opaqueId(prefix) {
  return `${prefix}_${randomBytes(24).toString("base64url")}`;
}
function errorOf(value) {
  return value instanceof Error ? value : new Error(String(value));
}
async function callTurnBroker(socketPath, request, timeoutMs = 5e3) {
  const id = opaqueId("request");
  return new Promise((resolveCall, rejectCall) => {
    const socket = createConnection(socketPath);
    let buffered = "";
    let settled = false;
    const finishError = (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      socket.destroy();
      rejectCall(error);
    };
    const timer = setTimeout(
      () => finishError(new Error("ChatGPT web turn broker timed out")),
      timeoutMs
    );
    socket.setEncoding("utf8");
    socket.once(
      "error",
      (error) => finishError(new Error(`ChatGPT web turn broker unavailable: ${error.message}`))
    );
    socket.once("connect", () => socket.write(`${JSON.stringify({ id, ...request })}
`));
    socket.on("data", (chunk) => {
      if (settled) return;
      buffered += chunk;
      if (buffered.length > MAX_BROKER_LINE_CHARS) {
        finishError(new Error("ChatGPT web turn broker response exceeds size limit"));
        return;
      }
      const newline = buffered.indexOf("\n");
      if (newline < 0) return;
      let response;
      try {
        response = JSON.parse(buffered.slice(0, newline));
      } catch (error) {
        finishError(
          new Error(`ChatGPT web turn broker returned invalid JSON: ${errorOf(error).message}`)
        );
        return;
      }
      if (response.id !== id) {
        finishError(new Error("ChatGPT web turn broker response id mismatch"));
        return;
      }
      settled = true;
      clearTimeout(timer);
      socket.end();
      if (response.error) rejectCall(new Error(response.error));
      else resolveCall(response.result);
    });
  });
}

// open-sse/vendor/codex-chatgpt-web/adapters/chatgpt-web/mcp-server.ts
var bindingSchema = z.string().min(20).max(256).describe("Opaque binding_id returned by codex_bind_turn.");
var jsonArgumentsSchema = z.record(z.string(), z.unknown()).default({});
function scopeHash(value) {
  return createHash("sha256").update(value).digest("hex").slice(0, 12);
}
function requestScopeSummary(extra) {
  const meta = extra._meta && typeof extra._meta === "object" && !Array.isArray(extra._meta) ? Object.entries(extra._meta).sort(([left], [right]) => left.localeCompare(right)).map(([key, value]) => ({
    key,
    type: value === null ? "null" : Array.isArray(value) ? "array" : typeof value,
    ...typeof value === "string" ? { chars: value.length, hash: scopeHash(value) } : {}
  })) : [];
  const requestInfoKeys = extra.requestInfo && typeof extra.requestInfo === "object" ? Object.keys(extra.requestInfo).sort() : [];
  return JSON.stringify({
    requestId: String(extra.requestId),
    session: extra.sessionId ? { chars: extra.sessionId.length, hash: scopeHash(extra.sessionId) } : null,
    meta,
    requestInfoKeys
  });
}
function result(value, isError = false) {
  return {
    content: [{ type: "text", text: JSON.stringify(value) }],
    structuredContent: value,
    ...isError ? { isError: true } : {}
  };
}
function wireName(tool) {
  return namespacedToolName(tool.namespace, tool.name);
}
function exactTool(environment, name) {
  return environment.tools.find((tool) => !tool.namespace && tool.name === name);
}
function namedTool(environment, requestedWireName) {
  const tool = environment.tools.find((candidate) => wireName(candidate) === requestedWireName);
  if (!tool) throw new Error(`Codex tool is not available in this turn: ${requestedWireName}`);
  return tool;
}
function invocationTimeout(environment) {
  return Math.max(1, environment.expiresAt - Date.now());
}
function asMcpResult(value) {
  return {
    content: value.content,
    ...value.structuredContent !== void 0 && value.structuredContent !== null && typeof value.structuredContent === "object" ? { structuredContent: value.structuredContent } : {},
    ...value.isError ? { isError: true } : {},
    ...value._meta !== void 0 && value._meta !== null && typeof value._meta === "object" ? { _meta: value._meta } : {}
  };
}
function execGateway(environment) {
  const tool = exactTool(environment, "exec");
  return tool?.freeform ? tool : void 0;
}
function gatewayNestedToolName(toolName) {
  return toolName.replace(/[^A-Za-z0-9_$]/g, "_");
}
function execGatewayProgram(nestedToolName, freeform, payload) {
  const nestedInput = freeform ? payload.input ?? "" : payload.arguments ?? {};
  return [
    `const result = await tools[${JSON.stringify(gatewayNestedToolName(nestedToolName))}](${JSON.stringify(nestedInput)});`,
    "const emit = value => {",
    "  if (Array.isArray(value)) { for (const item of value) emit(item); return; }",
    '  if (value && typeof value === "object") {',
    '    if (value.type === "image") { image(value); return; }',
    '    if (value.type === "audio") { audio(value); return; }',
    '    if (value.type === "text" && typeof value.text === "string") { text(value.text); return; }',
    '    if (typeof value.image_url === "string" && typeof value.output_hint === "string") { generatedImage(value); return; }',
    '    if (typeof value.image_url === "string") { image(value.image_url, value.detail ?? "auto"); return; }',
    '    if (typeof value.audio_url === "string") { audio(value.audio_url); return; }',
    "    if (Array.isArray(value.content)) { for (const item of value.content) emit(item); return; }",
    "  }",
    "  text(value);",
    "};",
    "emit(result);"
  ].join("\n");
}
async function runChatGptMcpServer(options) {
  const server = new McpServer({ name: "codex-native", version: "3.0.0" });
  const environment = async (bindingId) => {
    const resolved = await callTurnBroker(options.brokerSocketPath, {
      method: "resolve",
      bindingId
    });
    if (resolved.environment.expiresAt <= Date.now()) throw new Error("Codex turn binding expired");
    return resolved.environment;
  };
  const invoke = async (bindingId, bound, tool, payload) => {
    const response = await callTurnBroker(
      options.brokerSocketPath,
      {
        method: "invoke",
        bindingId,
        wireName: wireName(tool),
        freeform: tool.freeform === true,
        ...tool.freeform ? { input: payload.input ?? "" } : { arguments: payload.arguments ?? {} }
      },
      invocationTimeout(bound)
    );
    return asMcpResult(response);
  };
  const invokeNative = (bindingId, bound, tool, payload) => {
    const gateway = execGateway(bound);
    return gateway && gateway !== tool ? invoke(bindingId, bound, gateway, {
      input: execGatewayProgram(wireName(tool), tool.freeform === true, payload)
    }) : invoke(bindingId, bound, tool, payload);
  };
  const invokeNestedNative = (bindingId, bound, nestedToolName, freeform, payload) => {
    const gateway = execGateway(bound);
    if (!gateway) {
      throw new Error(
        `This Codex turn did not advertise ${nestedToolName} or the native exec gateway`
      );
    }
    return invoke(bindingId, bound, gateway, {
      input: execGatewayProgram(nestedToolName, freeform, payload)
    });
  };
  server.registerTool(
    "codex_bind_turn",
    {
      title: "Bind this response to its Codex turn",
      description: "Idempotently claim the capability for the current outer Codex turn before calling its native tools.",
      inputSchema: { turn_token: z.string().min(20).max(256) },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async ({ turn_token }, extra) => {
      console.error(`[chatgpt-web-mcp] codex_bind_turn scope=${requestScopeSummary(extra)}`);
      const claimed = await callTurnBroker(options.brokerSocketPath, {
        method: "claim",
        token: turn_token
      });
      const commandTool = exactTool(claimed.environment, "exec_command") ?? exactTool(claimed.environment, "shell_command");
      const gateway = execGateway(claimed.environment);
      return result({
        binding_id: claimed.bindingId,
        harness_version: 3,
        execution: "outer_codex_native",
        cwd: claimed.environment.cwd,
        roots: claimed.environment.roots,
        writable_roots: claimed.environment.writableRoots,
        sandbox: claimed.environment.sandboxPolicy.type,
        expires_at: new Date(claimed.environment.expiresAt).toISOString(),
        tool_count: claimed.environment.tools.length,
        command_tool: commandTool ? wireName(commandTool) : gateway ? "exec_command" : null,
        outer_tool_gateway: gateway ? wireName(gateway) : null,
        capabilities: [
          "native_tool_loop",
          "session_history",
          "exec",
          "apply_patch",
          "images",
          "tool_registry"
        ]
      });
    }
  );
  server.registerTool(
    "codex_exec",
    {
      title: "Run a native Codex command",
      description: "Invoke the command tool advertised by the current outer Codex harness. A long-running command returns its native session_id.",
      inputSchema: {
        binding_id: bindingSchema,
        cmd: z.string().min(1).max(1e5),
        workdir: z.string().max(16384).optional(),
        yield_time_ms: z.number().int().min(250).max(3e4).optional(),
        max_output_tokens: z.number().int().min(1).max(1e6).optional(),
        tty: z.boolean().optional()
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: false
      }
    },
    async ({ binding_id, cmd, workdir, yield_time_ms, max_output_tokens, tty }, extra) => {
      console.error(`[chatgpt-web-mcp] codex_exec scope=${requestScopeSummary(extra)}`);
      const bound = await environment(binding_id);
      const tool = exactTool(bound, "exec_command") ?? exactTool(bound, "shell_command");
      const commandName = tool?.name ?? "exec_command";
      const args = commandName === "exec_command" ? {
        cmd,
        ...workdir ? { workdir } : {},
        ...yield_time_ms !== void 0 ? { yield_time_ms } : {},
        ...max_output_tokens !== void 0 ? { max_output_tokens } : {},
        ...tty !== void 0 ? { tty } : {}
      } : {
        command: cmd,
        ...workdir ? { workdir } : {},
        ...yield_time_ms !== void 0 ? { timeout_ms: yield_time_ms } : {}
      };
      return tool ? invokeNative(binding_id, bound, tool, { arguments: args }) : invokeNestedNative(binding_id, bound, commandName, false, { arguments: args });
    }
  );
  server.registerTool(
    "codex_write_stdin",
    {
      title: "Continue a native Codex command session",
      description: "Write characters to, or poll, a session_id returned by codex_exec.",
      inputSchema: {
        binding_id: bindingSchema,
        session_id: z.number().int().nonnegative(),
        chars: z.string().max(1e6).optional(),
        yield_time_ms: z.number().int().min(250).max(3e5).optional(),
        max_output_tokens: z.number().int().min(1).max(1e6).optional()
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: false
      }
    },
    async ({ binding_id, session_id, chars, yield_time_ms, max_output_tokens }) => {
      const bound = await environment(binding_id);
      const tool = exactTool(bound, "write_stdin");
      const payload = {
        arguments: {
          session_id,
          ...chars !== void 0 ? { chars } : {},
          ...yield_time_ms !== void 0 ? { yield_time_ms } : {},
          ...max_output_tokens !== void 0 ? { max_output_tokens } : {}
        }
      };
      return tool ? invokeNative(binding_id, bound, tool, payload) : invokeNestedNative(binding_id, bound, "write_stdin", false, payload);
    }
  );
  server.registerTool(
    "codex_apply_patch",
    {
      title: "Apply a native Codex patch",
      description: "Invoke the outer Codex apply_patch tool, producing a native file-change item in the Codex task.",
      inputSchema: { binding_id: bindingSchema, patch: z.string().min(1).max(5e6) },
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: false
      }
    },
    async ({ binding_id, patch }) => {
      const bound = await environment(binding_id);
      const tool = exactTool(bound, "apply_patch");
      if (!tool)
        return invokeNestedNative(binding_id, bound, "apply_patch", true, { input: patch });
      return tool.freeform ? invokeNative(binding_id, bound, tool, { input: patch }) : invokeNative(binding_id, bound, tool, { arguments: { input: patch } });
    }
  );
  server.registerTool(
    "codex_view_image",
    {
      title: "View an image through native Codex",
      description: "Invoke the outer Codex view_image tool and return its multimodal result to this same ChatGPT response.",
      inputSchema: {
        binding_id: bindingSchema,
        path: z.string().min(1).max(16384),
        detail: z.enum(["high", "original"]).optional()
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async ({ binding_id, path, detail }) => {
      const bound = await environment(binding_id);
      const tool = exactTool(bound, "view_image");
      const payload = { arguments: { path, ...detail ? { detail } : {} } };
      return tool ? invokeNative(binding_id, bound, tool, payload) : invokeNestedNative(binding_id, bound, "view_image", false, payload);
    }
  );
  server.registerTool(
    "codex_tool_inventory",
    {
      title: "Discover tools from the current Codex harness",
      description: "Search the exact tool registry supplied to the current outer Codex turn, including configured MCP/app tools.",
      inputSchema: {
        binding_id: bindingSchema,
        query: z.string().max(500).optional(),
        offset: z.number().int().min(0).max(1e5).default(0),
        limit: z.number().int().min(1).max(50).default(20),
        include_schema: z.boolean().default(true)
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async ({ binding_id, query, offset, limit, include_schema }) => {
      const bound = await environment(binding_id);
      const needle = query?.trim().toLowerCase();
      const matches = bound.tools.filter(
        (tool) => !needle || [wireName(tool), tool.name, tool.namespace ?? "", tool.description].join("\n").toLowerCase().includes(needle)
      );
      const page = matches.slice(offset, offset + limit).map((tool) => ({
        wire_name: wireName(tool),
        name: tool.name,
        namespace: tool.namespace ?? null,
        description: tool.description,
        kind: tool.freeform ? "freeform" : tool.toolSearch ? "tool_search" : "function",
        ...include_schema ? { parameters: tool.parameters } : {}
      }));
      return result({
        tools: page,
        total: matches.length,
        next_offset: offset + page.length < matches.length ? offset + page.length : null
      });
    }
  );
  server.registerTool(
    "codex_tool_call",
    {
      title: "Call any tool from the current Codex harness",
      description: "Invoke an exact wire_name returned by codex_tool_inventory. The outer Codex runtime performs the call, approvals, and UI lifecycle.",
      inputSchema: {
        binding_id: bindingSchema,
        wire_name: z.string().min(1).max(1e3),
        arguments: jsonArgumentsSchema.optional(),
        input: z.string().max(5e6).optional()
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: true
      }
    },
    async ({ binding_id, wire_name, arguments: args, input }) => {
      const bound = await environment(binding_id);
      const tool = namedTool(bound, wire_name);
      if (tool.freeform) {
        if (input === void 0) throw new Error(`Freeform Codex tool ${wire_name} requires input`);
        if (args && Object.keys(args).length > 0)
          throw new Error(`Freeform Codex tool ${wire_name} does not accept arguments`);
        return invokeNative(binding_id, bound, tool, { input });
      }
      if (input !== void 0)
        throw new Error(`Function Codex tool ${wire_name} does not accept freeform input`);
      return invokeNative(binding_id, bound, tool, { arguments: args ?? {} });
    }
  );
  await server.connect(new StdioServerTransport());
}
export {
  runChatGptMcpServer
};
