var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};

// src/shared/constants/visionModels.ts
function isVisionModelId(modelId) {
  if (!modelId) return false;
  const normalized = String(modelId).toLowerCase();
  return VISION_MODEL_ID_FRAGMENTS.some((fragment) => normalized.includes(fragment));
}
var VISION_MODEL_ID_FRAGMENTS;
var init_visionModels = __esm({
  "src/shared/constants/visionModels.ts"() {
    VISION_MODEL_ID_FRAGMENTS = [
      "pixtral",
      "llava",
      "bakllava",
      "qwen-vl",
      "qwen2-vl",
      "qwen2.5-vl",
      "qwen3-vl",
      "qvq",
      "internvl",
      "minicpm-v",
      "moondream",
      "mimo-vl",
      "kimi-vl",
      "glm-4v",
      "glm-4.5v",
      "glm-4.6v",
      "gpt-4o",
      "gpt-4.1",
      "gpt-4-turbo",
      "gpt-4-vision",
      "gpt-5",
      "gemini-1.5",
      "gemini-2",
      "gemini-3",
      "gemini-exp",
      "claude-3",
      "claude-fable",
      "claude-opus-4",
      "claude-sonnet-4",
      "claude-haiku-4",
      "claude-fable",
      "mistral-medium-3",
      "minimax-m3",
      "kimi-k2.",
      "-vision",
      "multimodal"
    ];
  }
});

// src/lib/db/adapters/runtimeRequire.ts
import { createRequire as createRequire3 } from "node:module";
function esmRuntimeRequire(specifier) {
  return createRequire3(import.meta.url)(specifier);
}
function runtimeRequire(specifier) {
  if (typeof __require === "function") {
    switch (specifier) {
      case "better-sqlite3":
        return __require("better-sqlite3");
      case "node:sqlite":
        return __require("node:sqlite");
      case "bun:sqlite":
        return __require("bun:sqlite");
      case "sql.js":
        return __require("sql.js");
      case "sqlite-vec":
        return __require("sqlite-vec");
    }
  }
  return esmRuntimeRequire(specifier);
}
var init_runtimeRequire = __esm({
  "src/lib/db/adapters/runtimeRequire.ts"() {
  }
});

// src/lib/buildPhase.ts
function isNextBuildPhase() {
  return process.env.NEXT_PHASE === "phase-production-build" || process.env.OMNIROUTE_BUILDING === "1" || process.env.npm_lifecycle_event === "build";
}
var init_buildPhase = __esm({
  "src/lib/buildPhase.ts"() {
  }
});

// src/lib/db/adapters/betterSqliteAdapter.ts
function createBetterSqliteAdapter(db) {
  return {
    driver: "better-sqlite3",
    get open() {
      return db.open;
    },
    get name() {
      return db.name;
    },
    get inTransaction() {
      return db.inTransaction;
    },
    prepare(sql) {
      const stmt = db.prepare(sql);
      return {
        run: (...params) => stmt.run(...params),
        get: (...params) => stmt.get(...params),
        all: (...params) => stmt.all(...params)
      };
    },
    exec(sql) {
      db.exec(sql);
    },
    pragma(pragmaStr, options) {
      return db.pragma(pragmaStr, options);
    },
    transaction(fn) {
      return db.transaction(fn);
    },
    immediate(fn) {
      db.transaction(fn).immediate();
    },
    async backup(destination) {
      await db.backup(destination);
    },
    checkpoint(mode = "TRUNCATE") {
      try {
        db.pragma(`wal_checkpoint(${mode})`);
      } catch {
      }
    },
    close() {
      db.close();
    },
    get raw() {
      return db;
    }
  };
}
var init_betterSqliteAdapter = __esm({
  "src/lib/db/adapters/betterSqliteAdapter.ts"() {
  }
});

// src/lib/db/adapters/bunSqliteAdapter.ts
import fs6 from "node:fs";
function normalizeRunResult(result) {
  return {
    changes: Number(result.changes ?? 0),
    lastInsertRowid: Number(result.lastInsertRowid ?? 0)
  };
}
function normalizeParams(params) {
  if (params.length !== 1) return params;
  const [first] = params;
  if (first === null || typeof first !== "object" || Array.isArray(first) || first instanceof Uint8Array || typeof Buffer !== "undefined" && Buffer.isBuffer(first)) {
    return params;
  }
  const expanded = {};
  for (const [key, value] of Object.entries(first)) {
    if (/^[:@$]/.test(key)) {
      expanded[key] = value;
    } else {
      expanded[`@${key}`] = value;
      expanded[`:${key}`] = value;
      expanded[`$${key}`] = value;
    }
  }
  return [expanded];
}
function createBunSqliteAdapter(db, filePath) {
  let isOpen = true;
  return {
    driver: "bun:sqlite",
    get open() {
      return isOpen;
    },
    get name() {
      return filePath;
    },
    prepare(sql) {
      const statement = db.query(sql);
      return {
        run(...params) {
          return normalizeRunResult(statement.run(...normalizeParams(params)));
        },
        get(...params) {
          return statement.get(...normalizeParams(params));
        },
        all(...params) {
          return statement.all(...normalizeParams(params));
        }
      };
    },
    exec(sql) {
      db.exec(sql);
    },
    pragma(pragmaStr, options) {
      const statement = db.query(`PRAGMA ${pragmaStr}`);
      if (options?.simple) {
        const row = statement.get();
        return row ? Object.values(row)[0] ?? null : null;
      }
      return statement.all();
    },
    transaction(fn) {
      return db.transaction(fn);
    },
    immediate(fn) {
      const transaction = db.transaction(fn);
      if (typeof transaction.immediate === "function") {
        transaction.immediate();
        return;
      }
      db.exec("BEGIN IMMEDIATE");
      try {
        fn();
        db.exec("COMMIT");
      } catch (error) {
        try {
          db.exec("ROLLBACK");
        } catch {
        }
        throw error;
      }
    },
    async backup(destination) {
      if (filePath === ":memory:") return;
      try {
        db.exec("PRAGMA wal_checkpoint(TRUNCATE)");
      } catch {
      }
      await fs6.promises.copyFile(filePath, destination);
    },
    checkpoint(mode = "TRUNCATE") {
      try {
        db.exec(`PRAGMA wal_checkpoint(${mode})`);
      } catch {
      }
    },
    close() {
      if (!isOpen) return;
      db.close();
      isOpen = false;
    },
    get raw() {
      return db;
    }
  };
}
var init_bunSqliteAdapter = __esm({
  "src/lib/db/adapters/bunSqliteAdapter.ts"() {
  }
});

// src/lib/db/adapters/nodeSqliteShared.ts
import fs7 from "node:fs";
function toPlainRow(row) {
  if (row === null || typeof row !== "object") return row;
  return { ...row };
}
function normalizeBindParams(params) {
  const [first] = params;
  const isLoneNamedParamsObject = params.length === 1 && first !== null && typeof first === "object" && !Array.isArray(first) && !Buffer.isBuffer(first) && !(first instanceof Uint8Array);
  if (isLoneNamedParamsObject) {
    const source = first;
    const normalized = {};
    for (const key of Object.keys(source)) {
      normalized[key] = source[key] === void 0 ? null : source[key];
    }
    return [normalized];
  }
  return params.map((value) => value === void 0 ? null : value);
}
function createNodeSqliteAdapterFromDatabase(db, filePath, onClose) {
  let _isOpen = true;
  let transactionDepth = 0;
  const stmtCache = /* @__PURE__ */ new Map();
  function finalizeStatement(stmt) {
    if (stmt && "finalize" in stmt) {
      try {
        stmt.finalize();
      } catch {
      }
    }
  }
  function getCached(sql) {
    let entry = stmtCache.get(sql);
    if (entry) {
      stmtCache.delete(sql);
      stmtCache.set(sql, entry);
    } else {
      const stmt = db.prepare(sql);
      stmt.setAllowUnknownNamedParameters?.(true);
      if (stmtCache.size >= MAX_STMT_CACHE_SIZE) {
        const oldestKey = stmtCache.keys().next().value;
        if (oldestKey !== void 0) {
          finalizeStatement(stmtCache.get(oldestKey)?.stmt);
          stmtCache.delete(oldestKey);
        }
      }
      entry = { stmt };
      stmtCache.set(sql, entry);
    }
    return entry.stmt;
  }
  function runSavepoint(fn, ...args) {
    const sp = `sp_${Math.random().toString(36).slice(2)}`;
    db.exec(`SAVEPOINT "${sp}"`);
    try {
      const result = fn(...args);
      db.exec(`RELEASE "${sp}"`);
      return result;
    } catch (err) {
      try {
        db.exec(`ROLLBACK TO "${sp}"`);
        db.exec(`RELEASE "${sp}"`);
      } catch {
      }
      throw err;
    }
  }
  function runImmediate(fn) {
    if (transactionDepth > 0) {
      runSavepoint(fn);
      return;
    }
    db.exec("BEGIN IMMEDIATE");
    transactionDepth += 1;
    try {
      fn();
      db.exec("COMMIT");
    } catch (error) {
      try {
        db.exec("ROLLBACK");
      } catch {
      }
      throw error;
    } finally {
      transactionDepth -= 1;
    }
  }
  function close() {
    try {
      onClose?.();
    } catch {
    }
    try {
      for (const entry of stmtCache.values()) {
        finalizeStatement(entry.stmt);
      }
      stmtCache.clear();
    } catch {
    }
    try {
      db.close();
    } catch {
    }
    _isOpen = false;
  }
  return {
    driver: "node:sqlite",
    get open() {
      return _isOpen;
    },
    get name() {
      return filePath;
    },
    prepare(sql) {
      const stmt = getCached(sql);
      return {
        run(...params) {
          const r = stmt.run(...normalizeBindParams(params));
          return {
            changes: Number(r.changes ?? 0),
            lastInsertRowid: Number(r.lastInsertRowid ?? 0)
          };
        },
        get(...params) {
          return toPlainRow(stmt.get(...normalizeBindParams(params)));
        },
        all(...params) {
          return stmt.all(...normalizeBindParams(params)).map(
            (row) => toPlainRow(row)
          );
        }
      };
    },
    exec(sql) {
      db.exec(sql);
    },
    pragma(pragmaStr, options) {
      const sql = `PRAGMA ${pragmaStr}`;
      if (options?.simple) {
        const row = db.prepare(sql).get();
        if (!row) return null;
        return Object.values(row)[0] ?? null;
      }
      return db.prepare(sql).all();
    },
    transaction(fn) {
      return (...args) => {
        transactionDepth += 1;
        try {
          return runSavepoint(fn, ...args);
        } finally {
          transactionDepth -= 1;
        }
      };
    },
    immediate(fn) {
      runImmediate(fn);
    },
    async backup(destination) {
      const { backup } = await import("node:sqlite");
      if (typeof backup === "function") {
        await backup(db, destination);
        return;
      }
      try {
        db.exec("PRAGMA wal_checkpoint(TRUNCATE)");
      } catch {
      }
      await fs7.promises.copyFile(filePath, destination);
    },
    checkpoint(mode = "TRUNCATE") {
      try {
        db.exec(`PRAGMA wal_checkpoint(${mode})`);
      } catch {
      }
    },
    close,
    get raw() {
      return db;
    }
  };
}
var MAX_STMT_CACHE_SIZE;
var init_nodeSqliteShared = __esm({
  "src/lib/db/adapters/nodeSqliteShared.ts"() {
    MAX_STMT_CACHE_SIZE = 200;
  }
});

// src/lib/db/adapters/driverFactory.ts
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
function createBetterSqliteProbe(options) {
  const {
    platform = process.platform,
    execPath = process.execPath,
    spawn = spawnSync,
    timeoutMs = 5e3
  } = options;
  let verdict = null;
  return () => {
    if (verdict !== null) return verdict;
    if (platform !== "win32") {
      verdict = true;
      return verdict;
    }
    try {
      const result = spawn(execPath, ["-e", "require('better-sqlite3')(':memory:')"], {
        timeout: timeoutMs,
        stdio: "ignore",
        cwd: process.cwd(),
        windowsHide: true
      });
      verdict = result.status === 0;
    } catch {
      verdict = false;
    }
    return verdict;
  };
}
function requireSqliteDriver(moduleName) {
  switch (moduleName) {
    case "bun:sqlite":
      return runtimeRequire("bun:sqlite");
    case "better-sqlite3":
      return runtimeRequire("better-sqlite3");
    case "node:sqlite":
      return runtimeRequire("node:sqlite");
    default:
      throw new Error(`Unsupported SQLite driver module: ${moduleName}`);
  }
}
function toNodeSqliteOptions(options) {
  const nodeOptions = {};
  if (options?.readonly === true) {
    nodeOptions.readOnly = true;
  }
  if (typeof options?.timeout === "number") {
    nodeOptions.timeout = options.timeout;
  }
  return Object.keys(nodeOptions).length > 0 ? nodeOptions : void 0;
}
function logSwallowedDriverError(driver, err) {
  const message = err instanceof Error ? err.message : String(err);
  console.debug(`[DB] Sync driver '${driver}' failed to open, will try next driver: ${message}`);
}
function getSqlJsCache() {
  if (!globalThis.__omnirouteSqlJsAdapters) {
    globalThis.__omnirouteSqlJsAdapters = /* @__PURE__ */ new Map();
  }
  return globalThis.__omnirouteSqlJsAdapters;
}
function getSqlJsPreInitErrorCache() {
  if (!globalThis.__omnirouteSqlJsPreInitErrors) {
    globalThis.__omnirouteSqlJsPreInitErrors = /* @__PURE__ */ new Map();
  }
  return globalThis.__omnirouteSqlJsPreInitErrors;
}
function getSqlJsPreInitError(filePath) {
  return getSqlJsPreInitErrorCache().get(filePath);
}
function createSyncDriverFactory(load, betterSqliteProbe) {
  const mayLoadBetterSqlite = betterSqliteProbe ?? (() => true);
  return function tryOpenSync2(filePath, options) {
    if (process.versions.bun) {
      try {
        const { Database } = load("bun:sqlite");
        if (options?.fileMustExist === true && filePath !== ":memory:" && !existsSync(filePath)) {
          throw new Error(`SQLite file does not exist: ${filePath}`);
        }
        const bunOptions = {};
        if (options?.readonly === true) bunOptions.readonly = true;
        if (options?.create === false && filePath !== ":memory:") bunOptions.create = false;
        const db = Object.keys(bunOptions).length > 0 ? new Database(filePath, bunOptions) : new Database(filePath);
        return createBunSqliteAdapter(db, filePath);
      } catch (err) {
        logSwallowedDriverError("bun:sqlite", err);
      }
    }
    if (!process.versions.bun && !isNextBuildPhase() && mayLoadBetterSqlite()) {
      try {
        const BetterSqlite = load("better-sqlite3");
        const db = new BetterSqlite(filePath, options);
        return createBetterSqliteAdapter(db);
      } catch (err) {
        logSwallowedDriverError("better-sqlite3", err);
      }
    }
    if (!process.versions.bun) {
      const [maj, min] = (process.versions.node ?? "0.0").split(".").map(Number);
      if (maj > 22 || maj === 22 && min >= 5) {
        try {
          if (options?.fileMustExist === true && filePath !== ":memory:" && !existsSync(filePath)) {
            throw new Error(`SQLite file does not exist: ${filePath}`);
          }
          const { DatabaseSync } = load("node:sqlite");
          const nodeOptions = toNodeSqliteOptions(options);
          const db = nodeOptions ? new DatabaseSync(filePath, nodeOptions) : new DatabaseSync(filePath);
          return createNodeSqliteAdapterFromDatabase(db, filePath);
        } catch (err) {
          logSwallowedDriverError("node:sqlite", err);
        }
      }
    }
    return null;
  };
}
function isPackBootForcedSqlJsSmoke(env) {
  return env.OMNIROUTE_PACK_BOOT_SMOKE === "1" && env.OMNIROUTE_PACK_BOOT_FORCE_SQLJS === "1";
}
function tryOpenSync(filePath, options) {
  if (isPackBootForcedSqlJsSmoke(process.env)) return null;
  return openSyncDriver(filePath, options);
}
function getSqlJsAdapter(filePath) {
  return getSqlJsCache().get(filePath) ?? null;
}
var openSyncDriver;
var init_driverFactory = __esm({
  "src/lib/db/adapters/driverFactory.ts"() {
    init_runtimeRequire();
    init_buildPhase();
    init_betterSqliteAdapter();
    init_bunSqliteAdapter();
    init_nodeSqliteShared();
    openSyncDriver = createSyncDriverFactory(requireSqliteDriver, createBetterSqliteProbe({}));
  }
});

// src/lib/db/probeUtils.ts
function isTransientProbeError(error) {
  const message = error instanceof Error ? error.message : String(error);
  return /SQLITE_BUSY|SQLITE_PROTOCOL|SQLITE_IOERR|ENOENT/i.test(message);
}
function syncSleep(ms) {
  if (typeof SharedArrayBuffer !== "undefined" && typeof Atomics !== "undefined") {
    try {
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
      return;
    } catch {
    }
  }
  const deadline = Date.now() + ms;
  while (Date.now() < deadline) {
  }
}
function retryProbeIfTransient(sqliteFile, probeError, openDb, closeDb) {
  if (!isTransientProbeError(probeError)) return false;
  const retryDelays = [500, 1e3, 2e3];
  for (let i = 0; i < retryDelays.length; i++) {
    syncSleep(retryDelays[i]);
    try {
      const retryAdapter = openDb(sqliteFile, { readonly: true });
      closeDb(retryAdapter);
      return true;
    } catch {
    }
  }
  console.warn(
    `[DB] All ${retryDelays.length} transient probe retries exhausted \u2014 declaring corruption`
  );
  return false;
}
var init_probeUtils = __esm({
  "src/lib/db/probeUtils.ts"() {
  }
});

// src/lib/dataPaths.ts
import path6 from "path";
import os5 from "os";
import fs8 from "fs";
function fallbackHomeDir() {
  const envHome = process.env.HOME || process.env.USERPROFILE;
  if (typeof envHome === "string" && envHome.trim().length > 0) {
    return path6.resolve(envHome);
  }
  return os5.tmpdir();
}
function safeHomeDir() {
  try {
    return os5.homedir();
  } catch {
    return fallbackHomeDir();
  }
}
function normalizeConfiguredPath(dir) {
  if (typeof dir !== "string") return null;
  const trimmed = dir.trim();
  if (!trimmed) return null;
  return path6.resolve(trimmed);
}
function getLegacyDotDataDir() {
  return path6.join(safeHomeDir(), `.${APP_NAME}`);
}
function getDefaultDataDir() {
  const homeDir = safeHomeDir();
  const legacyDir = getLegacyDotDataDir();
  if (fs8.existsSync(legacyDir)) {
    try {
      if (fs8.statSync(legacyDir).isDirectory()) {
        return legacyDir;
      }
    } catch {
    }
  }
  if (process.platform === "win32") {
    const appData = process.env.APPDATA || path6.join(homeDir, "AppData", "Roaming");
    return path6.join(appData, APP_NAME);
  }
  const xdgConfigHome = normalizeConfiguredPath(process.env.XDG_CONFIG_HOME);
  if (xdgConfigHome) {
    return path6.join(xdgConfigHome, APP_NAME);
  }
  return legacyDir;
}
function resolveDataDir2({ isCloud: isCloud3 = false } = {}) {
  if (isCloud3) return "/tmp";
  const configured = normalizeConfiguredPath(process.env.DATA_DIR);
  if (configured) return configured;
  return getDefaultDataDir();
}
function isTestContext() {
  return process.env.NODE_ENV === "test" || !!process.env.VITEST || !!process.env.NODE_TEST_CONTEXT || process.execArgv.includes("--test") || process.argv.includes("--test");
}
function resolveWritableDataDir({ isCloud: isCloud3 = false } = {}) {
  const resolved = resolveDataDir2({ isCloud: isCloud3 });
  if (isCloud3) return resolved;
  if (!process.env.DATA_DIR && isTestContext() && process.env.OMNIROUTE_ALLOW_DEFAULT_DATA_DIR !== "1") {
    if (!testContextDataDir) {
      testContextDataDir = fs8.mkdtempSync(path6.join(os5.tmpdir(), `${APP_NAME}-testctx-`));
      console.warn(
        `[DATA_DIR] test context without DATA_DIR \u2192 using '${testContextDataDir}' instead of '${resolved}'. Set DATA_DIR explicitly (or load tests/_setup/isolateDataDir.ts) to silence this.`
      );
    }
    return testContextDataDir;
  }
  const configured = normalizeConfiguredPath(process.env.DATA_DIR);
  if (!configured) return resolved;
  try {
    fs8.mkdirSync(resolved, { recursive: true });
    return resolved;
  } catch (err) {
    const code = err?.code;
    if (code === "EACCES" || code === "EPERM") {
      const fallback = getDefaultDataDir();
      console.warn(
        `[DATA_DIR] '${resolved}' is not writable (${code}) \u2192 falling back to '${fallback}'`
      );
      return fallback;
    }
    throw err;
  }
}
var APP_NAME, testContextDataDir;
var init_dataPaths = __esm({
  "src/lib/dataPaths.ts"() {
    APP_NAME = "omniroute";
    testContextDataDir = null;
  }
});

// src/types/databaseSettings.ts
var DEFAULT_DATABASE_SETTINGS;
var init_databaseSettings = __esm({
  "src/types/databaseSettings.ts"() {
    DEFAULT_DATABASE_SETTINGS = {
      logs: {
        detailedLogsEnabled: false,
        callLogPipelineEnabled: false,
        maxDetailSizeKb: 10,
        ringBufferSize: 500
      },
      backup: {
        autoBackupEnabled: false,
        autoBackupFrequency: "never",
        keepLastNBackups: 5
      },
      cache: {
        semanticCacheEnabled: true,
        semanticCacheMaxSize: 100,
        semanticCacheTTL: 18e5,
        promptCacheEnabled: true,
        promptCacheStrategy: "auto",
        alwaysPreserveClientCache: "auto",
        // Keep in sync with CATALOG_CACHE_TTL_MS_DEFAULT
        // (src/app/api/v1/models/catalogCache.ts) — this value is what actually takes
        // effect, since catalog.ts reads it as `dbSettings.cache?.modelCatalogCacheTtlMs
        // ?? CATALOG_CACHE_TTL_MS_DEFAULT` and the `??` never falls through while a
        // default is declared here. Guarded by tests/unit/v1-models-catalog-ttl.test.ts.
        modelCatalogCacheTtlMs: 6e4
      },
      retention: {
        quotaSnapshots: 7,
        compressionAnalytics: 30,
        mcpAudit: 30,
        configAudit: 30,
        a2aEvents: 30,
        callLogs: 30,
        usageHistory: 30,
        memoryEntries: 30,
        domainCostHistory: 30,
        compressionCacheStats: 30,
        xpAuditLog: 30,
        compressionRunTelemetry: 30,
        autoCleanupEnabled: true
      },
      aggregation: {
        enabled: true,
        rawDataRetentionDays: 30,
        granularity: "daily"
      },
      optimization: {
        autoVacuumMode: "FULL",
        scheduledVacuum: "weekly",
        vacuumHour: 2,
        pageSize: 4096,
        cacheSize: 65536,
        optimizeOnStartup: true
      }
    };
  }
});

// src/shared/utils/testProcess.ts
function isAutomatedTestProcess(argv = typeof process !== "undefined" ? [...process.argv, ...process.execArgv] : [], env = typeof process !== "undefined" ? process.env : {}) {
  if (env.NODE_ENV === "test") return true;
  if (env.VITEST !== void 0) return true;
  if (!Array.isArray(argv)) return false;
  return argv.some((arg) => typeof arg === "string" && (TEST_TOKEN_RE.test(arg) || TEST_RUNNER_RE.test(arg)));
}
var TEST_TOKEN_RE, TEST_RUNNER_RE;
var init_testProcess = __esm({
  "src/shared/utils/testProcess.ts"() {
    TEST_TOKEN_RE = /(^|[\\/.-])tests?([\\/.-]|$)/i;
    TEST_RUNNER_RE = /(^|[\\/])(vitest|jest|mocha|ava|tap)(\.[cm]?js)?$/i;
  }
});

// src/lib/db/migrationRunner/constants.ts
var RENAMED_MIGRATION_COMPATIBILITY, LEGACY_VERSION_SLOT_MIGRATIONS, SUPERSEDED_DUPLICATE_MIGRATIONS, PHYSICAL_SCHEMA_SENTINELS, INITIAL_SCHEMA_SENTINELS, OPTIONAL_FTS5_MIGRATION_VERSIONS;
var init_constants = __esm({
  "src/lib/db/migrationRunner/constants.ts"() {
    RENAMED_MIGRATION_COMPATIBILITY = [
      {
        fromVersion: "022",
        fromName: "call_logs_summary_storage",
        toVersion: "025",
        toName: "call_logs_summary_storage"
      },
      {
        fromVersion: "028",
        fromName: "provider_connection_max_concurrent",
        toVersion: "029",
        toName: "provider_connection_max_concurrent"
      },
      {
        fromVersion: "028",
        fromName: "compression_settings",
        toVersion: "034",
        toName: "compression_settings"
      },
      {
        fromVersion: "032",
        fromName: "create_reasoning_cache",
        toVersion: "033",
        toName: "create_reasoning_cache"
      },
      {
        fromVersion: "032",
        fromName: "compression_analytics",
        toVersion: "038",
        toName: "compression_analytics"
      },
      {
        fromVersion: "033",
        fromName: "compression_cache_stats",
        toVersion: "039",
        toName: "compression_cache_stats"
      },
      {
        fromVersion: "041",
        fromName: "session_account_affinity",
        toVersion: "050",
        toName: "session_account_affinity"
      },
      {
        fromVersion: "051",
        fromName: "usage_history_service_tier",
        toVersion: "054",
        toName: "usage_history_service_tier"
      },
      {
        fromVersion: "052",
        fromName: "manifest_routing",
        toVersion: "059",
        toName: "manifest_routing"
      },
      {
        fromVersion: "056",
        fromName: "manifest_routing",
        toVersion: "059",
        toName: "manifest_routing"
      },
      {
        fromVersion: "123",
        fromName: "windsurf_to_devin_desktop",
        toVersion: "151",
        toName: "windsurf_to_devin_desktop"
      },
      {
        fromVersion: "124",
        fromName: "windsurf_to_devin_desktop",
        toVersion: "151",
        toName: "windsurf_to_devin_desktop"
      },
      {
        fromVersion: "125",
        fromName: "windsurf_to_devin_desktop",
        toVersion: "151",
        toName: "windsurf_to_devin_desktop"
      },
      {
        fromVersion: "126",
        fromName: "windsurf_to_devin_desktop",
        toVersion: "151",
        toName: "windsurf_to_devin_desktop"
      },
      {
        fromVersion: "127",
        fromName: "windsurf_to_devin_desktop",
        toVersion: "151",
        toName: "windsurf_to_devin_desktop"
      },
      {
        fromVersion: "128",
        fromName: "windsurf_to_devin_desktop",
        toVersion: "151",
        toName: "windsurf_to_devin_desktop"
      },
      {
        fromVersion: "131",
        fromName: "windsurf_to_devin_desktop",
        toVersion: "151",
        toName: "windsurf_to_devin_desktop"
      },
      {
        // 133 collided with 133_call_logs_session_tag once that landed on release.
        fromVersion: "133",
        fromName: "windsurf_to_devin_desktop",
        toVersion: "151",
        toName: "windsurf_to_devin_desktop"
      },
      {
        // 135 and 136 are canonical release migrations now.
        fromVersion: "135",
        fromName: "windsurf_to_devin_desktop",
        toVersion: "151",
        toName: "windsurf_to_devin_desktop"
      },
      {
        fromVersion: "136",
        fromName: "windsurf_to_devin_desktop",
        toVersion: "151",
        toName: "windsurf_to_devin_desktop"
      },
      {
        // 139 and 140 are occupied by CCR and connection runtime state.
        fromVersion: "139",
        fromName: "windsurf_to_devin_desktop",
        toVersion: "151",
        toName: "windsurf_to_devin_desktop"
      },
      {
        fromVersion: "140",
        fromName: "windsurf_to_devin_desktop",
        toVersion: "151",
        toName: "windsurf_to_devin_desktop"
      },
      {
        // 143 is the API-key cache mode; 144–145 are the stacked Radar caches.
        fromVersion: "143",
        fromName: "windsurf_to_devin_desktop",
        toVersion: "151",
        toName: "windsurf_to_devin_desktop"
      },
      {
        // 144 was published by this PR before the Radar reservation landed.
        fromVersion: "144",
        fromName: "windsurf_to_devin_desktop",
        toVersion: "151",
        toName: "windsurf_to_devin_desktop"
      },
      {
        fromVersion: "134",
        fromName: "ccr_blocks",
        toVersion: "139",
        toName: "ccr_blocks"
      },
      {
        fromVersion: "139",
        fromName: "job_registry",
        toVersion: "146",
        toName: "job_registry"
      },
      {
        // The cumulative Radar branch used 143 before 143_api_key_cache_default_mode
        // landed on release/v3.8.50. Rehome already-applied Radar rows to the next
        // free slot so the canonical API-key migration can still run.
        fromVersion: "143",
        fromName: "radar_local_model_state",
        toVersion: "153",
        toName: "radar_local_model_state"
      }
    ];
    LEGACY_VERSION_SLOT_MIGRATIONS = [
      { version: "028", name: "evals_tables" },
      { version: "029", name: "webhooks_templates" },
      { version: "030", name: "mcp_scopes_api_keys" },
      { version: "031", name: "api_keys_expires" },
      { version: "032", name: "detailed_logs_warnings" },
      { version: "033", name: "provider_connections_block_extra_usage" },
      { version: "033", name: "add_batch_id_to_call_logs" },
      { version: "046", name: "remove_status_from_files" },
      { version: "051", name: "remove_status_from_files" }
    ];
    SUPERSEDED_DUPLICATE_MIGRATIONS = [
      {
        version: "041",
        name: "session_account_affinity",
        supersededByVersion: "050",
        supersededByName: "session_account_affinity"
      }
    ];
    PHYSICAL_SCHEMA_SENTINELS = [
      { version: "028", tableName: "batches", description: "batches table" },
      { version: "024", tableName: "sync_tokens", description: "sync_tokens table" },
      { version: "022", tableName: "memory_fts", description: "memory_fts virtual table" },
      { version: "019", tableName: "context_handoffs", description: "context_handoffs table" },
      {
        version: "064",
        tableName: "session_model_history",
        description: "session_model_history table"
      },
      { version: "017", tableName: "version_manager", description: "version_manager table" },
      { version: "016", tableName: "skill_executions", description: "skill_executions table" },
      { version: "015", tableName: "memories", description: "memories table" },
      { version: "013", tableName: "quota_snapshots", description: "quota_snapshots table" },
      { version: "011", tableName: "webhooks", description: "webhooks table" },
      { version: "010", tableName: "model_combo_mappings", description: "model_combo_mappings table" },
      { version: "008", tableName: "registered_keys", description: "registered_keys table" },
      { version: "006", tableName: "request_detail_logs", description: "request_detail_logs table" },
      { version: "004", tableName: "proxy_registry", description: "proxy_registry table" },
      { version: "002", tableName: "mcp_tool_audit", description: "mcp_tool_audit table" }
    ];
    INITIAL_SCHEMA_SENTINELS = ["provider_connections", "combos", "call_logs"];
    OPTIONAL_FTS5_MIGRATION_VERSIONS = /* @__PURE__ */ new Set(["022", "023"]);
  }
});

// src/lib/db/migrationRunner/extraDirs.ts
import fs9 from "fs";
import path7 from "path";
function parseExtraMigrationDirs(raw) {
  if (typeof raw !== "string" || raw.trim().length === 0) return [];
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const entry of raw.split(path7.delimiter)) {
    const spec = entry.trim();
    if (spec.length === 0) continue;
    const separator = spec.indexOf("=");
    if (separator <= 0) {
      throw new Error(
        `[Migration] Invalid ${EXTRA_MIGRATIONS_DIRS_ENV} entry "${spec}": expected "namespace=directory" (entries separated by "${path7.delimiter}").`
      );
    }
    const namespace = spec.slice(0, separator).trim();
    const rawDir = spec.slice(separator + 1).trim();
    if (!NAMESPACE_PATTERN.test(namespace) || namespace.length > MAX_NAMESPACE_LENGTH) {
      throw new Error(
        `[Migration] Invalid namespace "${namespace}" in ${EXTRA_MIGRATIONS_DIRS_ENV}: must match ${NAMESPACE_PATTERN} and be at most ${MAX_NAMESPACE_LENGTH} characters (it becomes the recorded version prefix, e.g. "${namespace || "ee"}-134").`
      );
    }
    if (seen.has(namespace)) {
      throw new Error(
        `[Migration] Duplicate namespace "${namespace}" in ${EXTRA_MIGRATIONS_DIRS_ENV}: each namespace maps to exactly one directory.`
      );
    }
    if (rawDir.length === 0) {
      throw new Error(
        `[Migration] Empty directory for namespace "${namespace}" in ${EXTRA_MIGRATIONS_DIRS_ENV}.`
      );
    }
    const dir = path7.resolve(rawDir);
    if (!fs9.existsSync(dir)) {
      throw new Error(
        `[Migration] Directory for namespace "${namespace}" does not exist: ${dir}. A directory listed in ${EXTRA_MIGRATIONS_DIRS_ENV} is required schema \u2014 remove the entry if it is no longer shipped.`
      );
    }
    if (!fs9.statSync(dir).isDirectory()) {
      throw new Error(
        `[Migration] Path for namespace "${namespace}" is not a directory: ${dir}.`
      );
    }
    seen.add(namespace);
    out.push({ namespace, dir });
  }
  return out;
}
function readNamespacedMigrationFiles(entry) {
  const parsed = fs9.readdirSync(entry.dir).filter((f) => f.endsWith(".sql")).map((filename) => {
    const match = filename.match(MIGRATION_FILE_PATTERN);
    if (!match) return null;
    return { number: match[1], name: match[2], filename };
  }).filter(Boolean);
  const byNumber = /* @__PURE__ */ new Map();
  for (const f of parsed) {
    if (!byNumber.has(f.number)) byNumber.set(f.number, []);
    byNumber.get(f.number).push(f.name);
  }
  const collisions = [...byNumber.entries()].filter(([, names]) => names.length > 1);
  if (collisions.length > 0) {
    const summary = collisions.map(([number, names]) => `${entry.namespace}-${number} \u2192 [${names.join(", ")}]`).join("; ");
    throw new Error(
      `[Migration] Migration version collision detected in ${entry.dir}: ${summary}. Each migration file must have a unique numeric prefix within its namespace.`
    );
  }
  return parsed.sort((a, b) => Number.parseInt(a.number, 10) - Number.parseInt(b.number, 10)).map((f) => ({
    version: `${entry.namespace}-${f.number}`,
    name: f.name,
    path: path7.join(entry.dir, f.filename)
  }));
}
function getExtraMigrationFiles() {
  const entries = parseExtraMigrationDirs(process.env[EXTRA_MIGRATIONS_DIRS_ENV]);
  if (entries.length === 0) return [];
  return entries.flatMap((entry) => readNamespacedMigrationFiles(entry));
}
var EXTRA_MIGRATIONS_DIRS_ENV, NAMESPACE_PATTERN, MAX_NAMESPACE_LENGTH, MIGRATION_FILE_PATTERN;
var init_extraDirs = __esm({
  "src/lib/db/migrationRunner/extraDirs.ts"() {
    EXTRA_MIGRATIONS_DIRS_ENV = "OMNIROUTE_EXTRA_MIGRATIONS_DIRS";
    NAMESPACE_PATTERN = /^[a-z][a-z0-9]*$/;
    MAX_NAMESPACE_LENGTH = 16;
    MIGRATION_FILE_PATTERN = /^(\d+)_(.+)\.sql$/;
  }
});

// src/lib/db/backupRetention.ts
import fs10 from "fs";
import path8 from "path";
function parsePositiveInt(value, fallback) {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}
function parseNonNegativeInt(value, fallback) {
  if (value === void 0) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
}
function getBackupFamilyBase(filename) {
  if (filename.endsWith("-wal") || filename.endsWith("-shm")) return filename.slice(0, -4);
  if (filename.endsWith("-journal")) return filename.slice(0, -8);
  return filename;
}
function collectBackupFamilies(backupDir) {
  if (!fs10.existsSync(backupDir)) return [];
  const families = /* @__PURE__ */ new Map();
  for (const name of fs10.readdirSync(backupDir)) {
    if (!name.startsWith("db_")) continue;
    const base = getBackupFamilyBase(name);
    const filePath = path8.join(backupDir, name);
    let stat;
    try {
      stat = fs10.statSync(filePath);
    } catch {
      continue;
    }
    const family = families.get(base) || {
      base,
      hasPrimary: false,
      primaryMtimeMs: 0,
      latestMtimeMs: 0,
      files: []
    };
    family.files.push(name);
    family.latestMtimeMs = Math.max(family.latestMtimeMs, stat.mtimeMs);
    if (name === base && name.endsWith(".sqlite")) {
      family.hasPrimary = true;
      family.primaryMtimeMs = stat.mtimeMs;
    }
    families.set(base, family);
  }
  return [...families.values()];
}
function pruneBackupDirectory(options) {
  const { backupDir } = options;
  const maxFiles = Math.max(1, options.maxFiles);
  const retentionDays = Math.max(0, options.retentionDays);
  if (!fs10.existsSync(backupDir)) {
    return {
      deletedBackupFamilies: 0,
      deletedFiles: 0,
      keptBackupFamilies: 0,
      maxFiles,
      retentionDays
    };
  }
  const cutoffMs = retentionDays > 0 ? Date.now() - retentionDays * 24 * 60 * 60 * 1e3 : 0;
  const families = collectBackupFamilies(backupDir);
  const primaryFamilies = families.filter((family) => family.hasPrimary).sort((a, b) => b.primaryMtimeMs - a.primaryMtimeMs);
  const keepPrimaryBases = new Set(primaryFamilies.slice(0, maxFiles).map((family) => family.base));
  let deletedBackupFamilies = 0;
  let deletedFiles = 0;
  for (const family of families) {
    const isOverflowPrimary = family.hasPrimary && !keepPrimaryBases.has(family.base);
    const isExpired = retentionDays > 0 && family.latestMtimeMs < cutoffMs;
    const isOrphan = !family.hasPrimary;
    if (!isOverflowPrimary && !isExpired && !isOrphan) continue;
    deletedBackupFamilies += 1;
    for (const name of family.files) {
      try {
        fs10.unlinkSync(path8.join(backupDir, name));
        deletedFiles += 1;
      } catch {
      }
    }
  }
  return {
    deletedBackupFamilies,
    deletedFiles,
    keptBackupFamilies: collectBackupFamilies(backupDir).filter((family) => family.hasPrimary).length,
    maxFiles,
    retentionDays
  };
}
var MAX_DB_BACKUPS, DEFAULT_DB_BACKUP_RETENTION_DAYS;
var init_backupRetention = __esm({
  "src/lib/db/backupRetention.ts"() {
    MAX_DB_BACKUPS = 20;
    DEFAULT_DB_BACKUP_RETENTION_DAYS = 0;
  }
});

// src/lib/db/migrationRunner.ts
import fs11 from "fs";
import path9 from "path";
import { fileURLToPath } from "url";
function resolveMigrationsDir() {
  const configuredDir = process.env.OMNIROUTE_MIGRATIONS_DIR;
  if (typeof configuredDir === "string" && configuredDir.trim().length > 0) {
    return path9.resolve(configuredDir);
  }
  const checkLocations = (basePath) => {
    const locations = [
      path9.join(basePath, "migrations"),
      path9.join(basePath, "src", "lib", "db", "migrations"),
      path9.join(basePath, "app", "src", "lib", "db", "migrations")
    ];
    for (const loc of locations) {
      if (fs11.existsSync(loc)) return loc;
    }
    return null;
  };
  try {
    let currentDir = path9.dirname(fileURLToPath(import.meta.url));
    while (currentDir !== path9.dirname(currentDir)) {
      const found = checkLocations(currentDir);
      if (found) return found;
      currentDir = path9.dirname(currentDir);
    }
  } catch {
  }
  const metaUrl = import.meta.url;
  if (typeof metaUrl === "string" && metaUrl.startsWith("file://")) {
    try {
      const rawPath = decodeURIComponent(
        metaUrl.replace(/^file:\/\/\//, "/").replace(/^file:\/\//, "")
      );
      let currentDir = path9.dirname(path9.resolve(rawPath));
      while (currentDir !== path9.dirname(currentDir)) {
        const found = checkLocations(currentDir);
        if (found) return found;
        currentDir = path9.dirname(currentDir);
      }
    } catch {
    }
  }
  const fromCwd = checkLocations(process.cwd());
  if (fromCwd) return fromCwd;
  throw new Error(
    "[Migration] Could not resolve migrations directory. Set OMNIROUTE_MIGRATIONS_DIR."
  );
}
function resolveMaxPendingMigrations() {
  const raw = process.env.OMNIROUTE_MAX_PENDING_MIGRATIONS;
  if (typeof raw === "string" && raw.trim().length > 0) {
    const parsed = Number.parseInt(raw.trim(), 10);
    if (Number.isFinite(parsed) && parsed >= 0) {
      return parsed;
    }
  }
  return DEFAULT_MAX_PENDING_MIGRATIONS_ON_EXISTING_DB;
}
function ensureMigrationsTable(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS _omniroute_migrations (
      version TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}
function isOptionalFts5Migration(migration) {
  return OPTIONAL_FTS5_MIGRATION_VERSIONS.has(migration.version);
}
function supportsFts5(db) {
  const cached = fts5SupportCache.get(db);
  if (cached !== void 0) {
    return cached;
  }
  try {
    const probeTable = `__omniroute_fts5_probe_${crypto.randomUUID().replace(/-/g, "_")}`;
    db.transaction(() => {
      db.exec(`CREATE VIRTUAL TABLE "${probeTable}" USING fts5(content);`);
      db.exec(`DROP TABLE "${probeTable}";`);
    })();
    fts5SupportCache.set(db, true);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/no such module:\s*fts5/i.test(message)) {
      fts5SupportCache.set(db, false);
      return false;
    }
    throw error;
  }
}
function isDeferredUnsupportedMigration(db, migration) {
  return isOptionalFts5Migration(migration) && !supportsFts5(db);
}
function getMigrationFiles() {
  if (!fs11.existsSync(MIGRATIONS_DIR)) return getExtraMigrationFiles();
  const files = fs11.readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith(".sql")).sort().map((filename) => {
    const match = filename.match(/^(\d+)_(.+)\.sql$/);
    if (!match) return null;
    return {
      version: match[1],
      name: match[2],
      path: path9.join(MIGRATIONS_DIR, filename)
    };
  }).filter(Boolean);
  const byVersion = /* @__PURE__ */ new Map();
  for (const f of files) {
    if (!byVersion.has(f.version)) byVersion.set(f.version, []);
    byVersion.get(f.version).push(f.name);
  }
  const realCollisions = [];
  for (const [version, names] of byVersion.entries()) {
    if (names.length <= 1) continue;
    const liveNames = names.filter(
      (name) => !SUPERSEDED_DUPLICATE_MIGRATIONS.some((sup) => sup.version === version && sup.name === name)
    );
    if (liveNames.length > 1) {
      realCollisions.push({ version, names: liveNames });
    }
  }
  if (realCollisions.length > 0) {
    const summary = realCollisions.map((c) => `version=${c.version} \u2192 [${c.names.join(", ")}]`).join("; ");
    throw new Error(
      `Migration version collision detected: ${summary}. Each migration file must have a unique numeric prefix. Rename one of the colliding files (and add a retroactive guard in isSchemaAlreadyApplied for DBs that already applied the old number). See _tasks/features-v3.8.4/9route/POST-MERGE-AUDIT.md.`
    );
  }
  return [...files, ...getExtraMigrationFiles()];
}
function filterSupersededDuplicateMigrations(files) {
  return files.filter((file) => {
    const superseded = SUPERSEDED_DUPLICATE_MIGRATIONS.find(
      (migration) => migration.version === file.version && migration.name === file.name
    );
    if (!superseded) {
      return true;
    }
    const hasReplacement = files.some(
      (candidate) => candidate.version === superseded.supersededByVersion && candidate.name === superseded.supersededByName
    );
    if (!hasReplacement) {
      return true;
    }
    console2.warn(
      `[Migration] Ignoring superseded duplicate migration ${file.version}_${file.name}; ${superseded.supersededByVersion}_${superseded.supersededByName} is the canonical slot.`
    );
    return false;
  });
}
function getAppliedVersions(db) {
  const rows = db.prepare("SELECT version FROM _omniroute_migrations").all();
  return new Set(rows.map((r) => r.version));
}
function getAppliedRecords(db) {
  return db.prepare("SELECT version, name FROM _omniroute_migrations ORDER BY version").all();
}
function hasTable(db, tableName) {
  const row = db.prepare("SELECT name FROM sqlite_master WHERE type IN ('table', 'view') AND name = ?").get(tableName);
  return Boolean(row?.name);
}
function hasColumn(db, tableName, columnName) {
  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
  return columns.some((column) => column.name === columnName);
}
function ensureColumn(db, tableName, columnName, ddl) {
  if (!hasColumn(db, tableName, columnName)) {
    db.exec(ddl);
  }
}
function isSchemaAlreadyApplied(db, migration) {
  switch (migration.version) {
    case "003":
      return hasColumn(db, "provider_nodes", "chat_path");
    case "095":
      return hasColumn(db, "provider_nodes", "custom_headers_json");
    case "005":
      return hasColumn(db, "combos", "system_message");
    case "007":
      return hasColumn(db, "call_logs", "request_type");
    case "009":
      return hasColumn(db, "call_logs", "requested_model");
    case "018":
      return hasColumn(db, "call_logs", "tokens_cache_read") && hasColumn(db, "call_logs", "tokens_cache_creation") && hasColumn(db, "call_logs", "tokens_reasoning");
    case "020":
      return hasColumn(db, "combos", "sort_order");
    case "021":
      return hasColumn(db, "call_logs", "combo_step_id") && hasColumn(db, "call_logs", "combo_execution_key");
    case "023":
      return hasColumn(db, "memories", "memory_id");
    case "025":
      return hasColumn(db, "call_logs", "detail_state") && hasColumn(db, "call_logs", "request_summary");
    case "026":
      return hasColumn(db, "call_logs", "cache_source");
    case "027":
      return hasColumn(db, "skills", "mode");
    case "028":
      return hasTable(db, "batches") && hasTable(db, "files");
    case "029":
      return hasColumn(db, "provider_connections", "max_concurrent");
    case "040":
      return hasColumn(db, "proxy_registry", "source");
    case "041":
      if (migration.name === "session_account_affinity") {
        return hasTable(db, "session_account_affinity");
      }
      return hasColumn(db, "compression_analytics", "actual_prompt_tokens") && hasColumn(db, "compression_analytics", "actual_completion_tokens") && hasColumn(db, "compression_analytics", "actual_total_tokens") && hasColumn(db, "compression_analytics", "receipt_source") && hasColumn(db, "compression_analytics", "validation_fallback") && hasColumn(db, "compression_analytics", "output_mode");
    case "042":
      return hasTable(db, "compression_combos") && hasTable(db, "compression_combo_assignments") && hasColumn(db, "compression_analytics", "compression_combo_id") && hasColumn(db, "compression_analytics", "engine");
    case "045":
      return hasColumn(db, "call_logs", "tokens_compressed");
    case "053":
      return !hasColumn(db, "files", "status");
    case "054":
      return hasColumn(db, "usage_history", "service_tier");
    case "062":
      return hasColumn(db, "usage_history", "combo_strategy");
    case "070":
      return hasColumn(db, "webhooks", "kind") && hasColumn(db, "webhooks", "metadata_encrypted");
    case "071":
      return hasColumn(db, "version_manager", "logs_buffer_path") && hasColumn(db, "version_manager", "provider_expose") && hasColumn(db, "version_manager", "last_sync_at");
    case "073":
      return hasColumn(db, "memories", "needs_reindex");
    case "085":
      return hasTable(db, "quota_pools") && hasTable(db, "quota_allocations");
    case "088":
      return hasTable(db, "quota_groups") && hasColumn(db, "quota_pools", "group_id");
    case "089":
      return hasColumn(db, "api_keys", "disable_non_public_models");
    case "090":
      return hasTable(db, "plugin_metrics");
    case "091":
      return hasTable(db, "plugin_analytics");
    case "117":
      return hasColumn(db, "proxy_assignments", "position");
    // Retroactive guard for the 135/136 renumber (#8523 landed onto slots already taken
    // by #8908/#9515): a DB that ran these under the old numbers already has the column,
    // and a bare ALTER TABLE ADD COLUMN would throw on the re-run under the new number.
    case "137":
      return hasColumn(db, "version_manager", "auto_restart_adopted");
    case "138":
      return hasColumn(db, "upstream_proxy_config", "fallback_backend");
    case "139":
      return hasTable(db, "ccr_blocks");
    case "140":
      return hasTable(db, "connection_runtime_state");
    case "143":
      return hasColumn(db, "api_keys", "cache_default_mode");
    case "153":
      return hasTable(db, "radar_local_model_state");
    case "159":
      if (migration.name !== "rename_freepik_to_magnific") return false;
      if (!hasTable(db, "provider_connections")) return false;
      return db.prepare("SELECT 1 FROM provider_connections WHERE provider = 'freepik' LIMIT 1").get() == null;
    default:
      return false;
  }
}
function applyApiKeyLifecycleMigration(db) {
  ensureColumn(db, "api_keys", "revoked_at", "ALTER TABLE api_keys ADD COLUMN revoked_at TEXT");
  ensureColumn(db, "api_keys", "expires_at", "ALTER TABLE api_keys ADD COLUMN expires_at TEXT");
  ensureColumn(db, "api_keys", "last_used_at", "ALTER TABLE api_keys ADD COLUMN last_used_at TEXT");
  ensureColumn(db, "api_keys", "key_prefix", "ALTER TABLE api_keys ADD COLUMN key_prefix TEXT");
  ensureColumn(db, "api_keys", "ip_allowlist", "ALTER TABLE api_keys ADD COLUMN ip_allowlist TEXT");
  ensureColumn(db, "api_keys", "scopes", "ALTER TABLE api_keys ADD COLUMN scopes TEXT");
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_api_keys_revoked_at ON api_keys(revoked_at);
    CREATE INDEX IF NOT EXISTS idx_api_keys_expires_at ON api_keys(expires_at);
  `);
}
function applyCompressionReceiptsMigration(db) {
  ensureColumn(
    db,
    "compression_analytics",
    "actual_prompt_tokens",
    "ALTER TABLE compression_analytics ADD COLUMN actual_prompt_tokens INTEGER"
  );
  ensureColumn(
    db,
    "compression_analytics",
    "actual_completion_tokens",
    "ALTER TABLE compression_analytics ADD COLUMN actual_completion_tokens INTEGER"
  );
  ensureColumn(
    db,
    "compression_analytics",
    "actual_total_tokens",
    "ALTER TABLE compression_analytics ADD COLUMN actual_total_tokens INTEGER"
  );
  ensureColumn(
    db,
    "compression_analytics",
    "actual_cache_read_tokens",
    "ALTER TABLE compression_analytics ADD COLUMN actual_cache_read_tokens INTEGER"
  );
  ensureColumn(
    db,
    "compression_analytics",
    "actual_cache_write_tokens",
    "ALTER TABLE compression_analytics ADD COLUMN actual_cache_write_tokens INTEGER"
  );
  ensureColumn(
    db,
    "compression_analytics",
    "estimated_usd_saved",
    "ALTER TABLE compression_analytics ADD COLUMN estimated_usd_saved REAL"
  );
  ensureColumn(
    db,
    "compression_analytics",
    "mcp_description_tokens_saved",
    "ALTER TABLE compression_analytics ADD COLUMN mcp_description_tokens_saved INTEGER DEFAULT 0"
  );
  ensureColumn(
    db,
    "compression_analytics",
    "multimodal_skip_count",
    "ALTER TABLE compression_analytics ADD COLUMN multimodal_skip_count INTEGER DEFAULT 0"
  );
  ensureColumn(
    db,
    "compression_analytics",
    "receipt_source",
    "ALTER TABLE compression_analytics ADD COLUMN receipt_source TEXT"
  );
  ensureColumn(
    db,
    "compression_analytics",
    "validation_fallback",
    "ALTER TABLE compression_analytics ADD COLUMN validation_fallback INTEGER DEFAULT 0"
  );
  ensureColumn(
    db,
    "compression_analytics",
    "output_mode",
    "ALTER TABLE compression_analytics ADD COLUMN output_mode TEXT"
  );
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_compression_analytics_request_id
      ON compression_analytics(request_id);
    CREATE INDEX IF NOT EXISTS idx_compression_analytics_receipt_source
      ON compression_analytics(receipt_source);
  `);
}
function applyCompressionCombosMigration(db, migrationPath) {
  const sql = fs11.readFileSync(migrationPath, "utf-8");
  db.exec(sql);
  ensureColumn(
    db,
    "compression_analytics",
    "compression_combo_id",
    "ALTER TABLE compression_analytics ADD COLUMN compression_combo_id TEXT"
  );
  ensureColumn(
    db,
    "compression_analytics",
    "engine",
    "ALTER TABLE compression_analytics ADD COLUMN engine TEXT"
  );
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_compression_analytics_combo_engine
      ON compression_analytics(compression_combo_id, engine);
  `);
}
function inferPhysicalSchemaBaseline(db) {
  for (const sentinel of PHYSICAL_SCHEMA_SENTINELS) {
    if (hasTable(db, sentinel.tableName)) {
      return {
        version: sentinel.version,
        description: sentinel.description
      };
    }
  }
  const hasInitialSchema = INITIAL_SCHEMA_SENTINELS.every((tableName) => hasTable(db, tableName));
  if (hasInitialSchema) {
    return {
      version: "001",
      description: "initial schema tables"
    };
  }
  return null;
}
function getPlausiblePendingCount(files, baselineVersion) {
  const baseline = Number.parseInt(baselineVersion, 10);
  return files.filter((file) => Number.parseInt(file.version, 10) > baseline).length;
}
function detectNameMismatches(appliedRecords, files) {
  const appliedByName = new Map(appliedRecords.map((r) => [r.version, r.name]));
  const mismatches = [];
  for (const file of files) {
    const appliedName = appliedByName.get(file.version);
    if (appliedName && appliedName !== file.name) {
      mismatches.push({
        version: file.version,
        appliedName,
        diskName: file.name
      });
    }
  }
  return mismatches;
}
function reconcileRenumberedMigrations(db, files) {
  let repaired = false;
  for (const compatibility of RENAMED_MIGRATION_COMPATIBILITY) {
    const hasTargetFile = files.some(
      (file) => file.version === compatibility.toVersion && file.name === compatibility.toName
    );
    const hasSourceFile = files.some(
      (file) => file.version === compatibility.fromVersion && file.name !== compatibility.fromName
    );
    if (!hasTargetFile || !hasSourceFile) {
      continue;
    }
    const legacyRow = db.prepare("SELECT version, name FROM _omniroute_migrations WHERE version = ? AND name = ?").get(compatibility.fromVersion, compatibility.fromName);
    if (!legacyRow) {
      continue;
    }
    const targetRow = db.prepare("SELECT version FROM _omniroute_migrations WHERE version = ?").get(compatibility.toVersion);
    const applyRepair = db.transaction(() => {
      if (targetRow) {
        db.prepare("DELETE FROM _omniroute_migrations WHERE version = ? AND name = ?").run(
          compatibility.fromVersion,
          compatibility.fromName
        );
      } else {
        db.prepare(
          "UPDATE _omniroute_migrations SET version = ?, name = ? WHERE version = ? AND name = ?"
        ).run(
          compatibility.toVersion,
          compatibility.toName,
          compatibility.fromVersion,
          compatibility.fromName
        );
      }
    });
    applyRepair();
    repaired = true;
    console2.warn(
      `[Migration] Reconciled renamed migration ${compatibility.fromVersion}_${compatibility.fromName} to ${compatibility.toVersion}_${compatibility.toName} to preserve pending migrations.`
    );
    const residualRow = db.prepare("SELECT version, name FROM _omniroute_migrations WHERE version = ?").get(compatibility.fromVersion);
    if (residualRow) {
      console2.warn(
        `[Migration] \u26A0\uFE0F  Residual row at version ${compatibility.fromVersion} (name: "${residualRow.name}") still present after compat rewrite \u2014 removing to unblock new migration at this version slot.`
      );
      db.prepare("DELETE FROM _omniroute_migrations WHERE version = ?").run(
        compatibility.fromVersion
      );
    }
  }
  return repaired;
}
function rehomeLegacyVersionSlotMigrations(db, files) {
  let repaired = false;
  const diskNamesByVersion = new Map(files.map((file) => [file.version, file.name]));
  for (const legacy of LEGACY_VERSION_SLOT_MIGRATIONS) {
    const diskName = diskNamesByVersion.get(legacy.version);
    if (!diskName || diskName === legacy.name) {
      continue;
    }
    const legacyRow = db.prepare("SELECT version, name FROM _omniroute_migrations WHERE version = ? AND name = ?").get(legacy.version, legacy.name);
    if (!legacyRow) {
      continue;
    }
    const legacyVersion = `legacy-${legacy.version}-${legacy.name}`;
    const applyRepair = db.transaction(() => {
      const existingLegacyRow = db.prepare("SELECT version FROM _omniroute_migrations WHERE version = ?").get(legacyVersion);
      if (existingLegacyRow) {
        db.prepare("DELETE FROM _omniroute_migrations WHERE version = ? AND name = ?").run(
          legacy.version,
          legacy.name
        );
        return;
      }
      db.prepare("UPDATE _omniroute_migrations SET version = ? WHERE version = ? AND name = ?").run(
        legacyVersion,
        legacy.version,
        legacy.name
      );
    });
    applyRepair();
    repaired = true;
    console2.warn(
      `[Migration] Rehomed legacy migration ${legacy.version}_${legacy.name} to ${legacyVersion} so current ${legacy.version}_${diskName} can apply.`
    );
  }
  return repaired;
}
function readStoredBackupSetting(db, key, min) {
  try {
    const row = db.prepare("SELECT value FROM key_value WHERE namespace = ? AND key = ?").get("dbBackup", key);
    if (!row?.value) return void 0;
    const parsed = JSON.parse(row.value);
    return Number.isInteger(parsed) && parsed >= min ? parsed : void 0;
  } catch {
    return void 0;
  }
}
function pruneMigrationBackups(db, backupDir) {
  try {
    const maxFiles = process.env.DB_BACKUP_MAX_FILES ? parsePositiveInt(process.env.DB_BACKUP_MAX_FILES, MAX_DB_BACKUPS) : readStoredBackupSetting(db, "maxFiles", 1) ?? MAX_DB_BACKUPS;
    const retentionDays = process.env.DB_BACKUP_RETENTION_DAYS ? parseNonNegativeInt(process.env.DB_BACKUP_RETENTION_DAYS, DEFAULT_DB_BACKUP_RETENTION_DAYS) : readStoredBackupSetting(db, "retentionDays", 0) ?? DEFAULT_DB_BACKUP_RETENTION_DAYS;
    const result = pruneBackupDirectory({ backupDir, maxFiles, retentionDays });
    if (result.deletedFiles > 0) {
      console2.log(
        `[Migration] Pruned ${result.deletedFiles} old backup file(s) (${result.keptBackupFamilies} kept, maxFiles=${maxFiles}, retentionDays=${retentionDays}).`
      );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console2.warn(`[Migration] Failed to prune old backups: ${message}`);
  }
}
function createPreMigrationBackup(db) {
  try {
    const sqliteFile = db.name;
    if (!sqliteFile || sqliteFile === ":memory:") return null;
    const backupDir = path9.join(path9.dirname(sqliteFile), "db_backups");
    if (!fs11.existsSync(backupDir)) {
      fs11.mkdirSync(backupDir, { recursive: true });
    }
    const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
    const backupPath = path9.join(backupDir, `db_${timestamp}_pre-migration.sqlite`);
    const escapedBackupPath = backupPath.replace(/'/g, "''");
    db.exec(`VACUUM INTO '${escapedBackupPath}'`);
    console2.log(`[Migration] Pre-migration backup created: ${backupPath}`);
    pruneMigrationBackups(db, backupDir);
    return backupPath;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console2.warn(`[Migration] Failed to create pre-migration backup: ${message}`);
    return null;
  }
}
function runMigrations(db, options) {
  const isNewDb = options?.isNewDb === true;
  ensureMigrationsTable(db);
  const files = filterSupersededDuplicateMigrations(getMigrationFiles());
  rehomeLegacyVersionSlotMigrations(db, files);
  reconcileRenumberedMigrations(db, files);
  const applied = getAppliedVersions(db);
  const appliedRecords = getAppliedRecords(db);
  const mismatches = detectNameMismatches(appliedRecords, files);
  if (mismatches.length > 0) {
    console2.error(
      `[Migration] \u26A0\uFE0F  CRITICAL: ${mismatches.length} migration version(s) have been renumbered!`
    );
    for (const m of mismatches) {
      console2.error(
        `  Version ${m.version}: applied as "${m.appliedName}" but disk has "${m.diskName}"`
      );
    }
    console2.error(
      `[Migration] This indicates migrations were renumbered between releases, which can cause the migration runner to skip or re-run migrations incorrectly.`
    );
    console2.error(
      `[Migration] The version-only tracking will skip these (version already applied), but please report this to the OmniRoute maintainers.`
    );
  }
  const numericApplied = Array.from(applied).map((v) => Number.parseInt(v, 10)).filter((n) => !Number.isNaN(n));
  const highestApplied = numericApplied.length > 0 ? Math.max(...numericApplied) : 0;
  const pending2 = files.filter((f) => {
    const isMissing = !applied.has(f.version);
    if (isMissing && Number(f.version) < highestApplied) {
      console2.warn(
        `[Migration] \u{1F504} RECONCILIATION: Found missing intermediate migration ${f.version}_${f.name} (highest applied is ${highestApplied}). This gap will be back-filled to ensure schema integrity.`
      );
    }
    return isMissing;
  });
  const deferredUnsupported = pending2.filter(
    (migration) => isDeferredUnsupportedMigration(db, migration)
  );
  const actionablePending = pending2.filter(
    (migration) => !deferredUnsupported.some((deferred) => deferred.version === migration.version)
  );
  if (pending2.length === 0) {
    return 0;
  }
  if (deferredUnsupported.length > 0) {
    const summary = deferredUnsupported.map((migration) => `${migration.version}_${migration.name}`).join(", ");
    console2.warn(
      `[Migration] Deferring optional FTS5 migrations on driver ${db.driver}: ${summary}. Memory search will fall back until a SQLite driver with FTS5 support is available.`
    );
  }
  const isTestEnvironment = isAutomatedTestProcess();
  const maxPendingMigrations = resolveMaxPendingMigrations();
  const isFreshSeedOnly = applied.size === 1 && applied.has("001") && inferPhysicalSchemaBaseline(db) === null && hasTable(db, "provider_connections");
  if (!isTestEnvironment && !isNewDb && !isFreshSeedOnly && process.env.DISABLE_SQLITE_AUTO_BACKUP !== "true" && maxPendingMigrations > 0 && applied.size > 0 && actionablePending.length > maxPendingMigrations) {
    const physicalBaseline = inferPhysicalSchemaBaseline(db);
    const plausiblePendingCount = physicalBaseline ? getPlausiblePendingCount(files, physicalBaseline.version) : null;
    if (plausiblePendingCount !== null && actionablePending.length <= plausiblePendingCount) {
      console2.warn(
        `[Migration] Allowing ${actionablePending.length} pending migrations on an existing database because the physical schema only proves ${physicalBaseline?.version} (${physicalBaseline?.description}).`
      );
    } else {
      const schemaHint = physicalBaseline && plausiblePendingCount !== null ? ` Physical schema already shows ${physicalBaseline.version} (${physicalBaseline.description}), so at most ${plausiblePendingCount} pending migration(s) are expected from a legitimate upgrade.` : "";
      const bypassHint = ` To bypass this check (e.g. after restoring a backup where the migration tracking table was wiped), set OMNIROUTE_MAX_PENDING_MIGRATIONS=0 in your server.env or DATA_DIR/.env and restart.`;
      const msg = `[Migration] \u{1F6D1} ABORT: Detected ${actionablePending.length} pending migrations on an existing database (threshold is ${maxPendingMigrations}). This usually means the migration tracking table was accidentally wiped. Running all migrations from scratch will cause data loss or schema errors.` + schemaHint + bypassHint;
      if (memoizedSafetyAbort && memoizedSafetyAbort.message === msg) {
        console2.error(
          `[Migration] \u{1F6D1} ABORT (repeat \u2014 see earlier detail): ${actionablePending.length} pending > threshold ${maxPendingMigrations}. Set OMNIROUTE_MAX_PENDING_MIGRATIONS=0 to bypass.`
        );
        throw memoizedSafetyAbort;
      }
      console2.error(msg);
      memoizedSafetyAbort = new MigrationSafetyAbortError(msg);
      throw memoizedSafetyAbort;
    }
  }
  if (applied.size > 0 && process.env.DISABLE_SQLITE_AUTO_BACKUP !== "true") {
    createPreMigrationBackup(db);
  }
  let count2 = 0;
  for (const migration of pending2) {
    if (isDeferredUnsupportedMigration(db, migration)) {
      continue;
    }
    const applyMigration = db.transaction(() => {
      if (isSchemaAlreadyApplied(db, migration)) {
        console2.warn(
          `[Migration] Skipped executing ${migration.version}_${migration.name} as schema changes are already present (Idempotency check).`
        );
      } else if (migration.version === "032") {
        applyApiKeyLifecycleMigration(db);
      } else if (migration.version === "041" && migration.name === "compression_receipts") {
        applyCompressionReceiptsMigration(db);
      } else if (migration.version === "042") {
        applyCompressionCombosMigration(db, migration.path);
      } else {
        const sql = fs11.readFileSync(migration.path, "utf-8");
        db.exec(sql);
      }
      db.prepare("INSERT INTO _omniroute_migrations (version, name) VALUES (?, ?)").run(
        migration.version,
        migration.name
      );
    });
    try {
      applyMigration();
      count2++;
      console2.log(`[Migration] Applied: ${migration.version}_${migration.name}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("duplicate column name")) {
        const applyMarkerOnly = db.transaction(() => {
          db.prepare(
            "INSERT OR IGNORE INTO _omniroute_migrations (version, name) VALUES (?, ?)"
          ).run(migration.version, migration.name);
        });
        applyMarkerOnly();
        count2++;
        console2.log(
          `[Migration] Applied (column pre-exists): ${migration.version}_${migration.name}`
        );
      } else {
        console2.error(`[Migration] FAILED: ${migration.version}_${migration.name} \u2014 ${message}`);
        throw err;
      }
    }
  }
  if (count2 > 0) {
    console2.log(`[Migration] ${count2} migration(s) applied successfully.`);
  }
  try {
    if (appliedRecords.some((m) => m.name.startsWith("051_"))) {
      insertDefaultDatabaseSettings(db);
    }
  } catch (error) {
    console2.error("Error inserting default database settings:", error);
  }
  return count2;
}
function insertDefaultDatabaseSettings(db) {
  const tx = db.transaction(() => {
    for (const [section, values] of Object.entries(DEFAULT_DATABASE_SETTINGS)) {
      for (const [key, value] of Object.entries(values)) {
        db.prepare("INSERT OR IGNORE INTO key_value (namespace, key, value) VALUES (?, ?, ?)").run(
          "databaseSettings",
          `${section}.${key}`,
          JSON.stringify(value)
        );
      }
    }
  });
  try {
    db.immediate(() => {
      tx();
    });
  } catch (error) {
    console2.error("Transaction error inserting default settings:", error);
    throw error;
  }
}
var isNodeTestRunnerChild, console2, MIGRATIONS_DIR, DEFAULT_MAX_PENDING_MIGRATIONS_ON_EXISTING_DB, MigrationSafetyAbortError, memoizedSafetyAbort, fts5SupportCache;
var init_migrationRunner = __esm({
  "src/lib/db/migrationRunner.ts"() {
    init_databaseSettings();
    init_testProcess();
    init_constants();
    init_extraDirs();
    init_backupRetention();
    isNodeTestRunnerChild = typeof process.env.NODE_TEST_CONTEXT === "string";
    console2 = {
      log: (...args) => {
        if (!isNodeTestRunnerChild) globalThis.console.log(...args);
      },
      warn: (...args) => {
        if (!isNodeTestRunnerChild) globalThis.console.warn(...args);
      },
      error: (...args) => {
        globalThis.console.error(...args);
      }
    };
    MIGRATIONS_DIR = resolveMigrationsDir();
    DEFAULT_MAX_PENDING_MIGRATIONS_ON_EXISTING_DB = 50;
    MigrationSafetyAbortError = class extends Error {
      constructor(message) {
        super(message);
        this.name = "MigrationSafetyAbortError";
      }
    };
    memoizedSafetyAbort = null;
    fts5SupportCache = /* @__PURE__ */ new WeakMap();
  }
});

// src/lib/combos/steps.ts
function isRecord3(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}
function toTrimmedString(value) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}
function toWeight(value) {
  const parsed = typeof value === "number" ? value : typeof value === "string" && value.trim().length > 0 ? Number(value) : 0;
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.min(100, parsed));
}
function collectComboNames(allCombos) {
  const names = /* @__PURE__ */ new Set();
  if (!allCombos) return names;
  if (!Array.isArray(allCombos) && typeof allCombos[Symbol.iterator] === "function" && !(isRecord3(allCombos) && Array.isArray(allCombos.combos))) {
    for (const value of allCombos) {
      const name = toTrimmedString(value);
      if (name) names.add(name);
    }
    return names;
  }
  const combosFromRecord = isRecord3(allCombos) && Array.isArray(allCombos.combos) ? allCombos.combos : [];
  const combos = Array.isArray(allCombos) ? allCombos : combosFromRecord;
  for (const combo of combos) {
    const name = typeof combo === "string" ? toTrimmedString(combo) : toTrimmedString(combo?.name);
    if (name) names.add(name);
  }
  return names;
}
function parseProviderId(model) {
  const trimmed = model.trim();
  const slashIndex = trimmed.indexOf("/");
  if (slashIndex <= 0) return null;
  const providerId = trimmed.slice(0, slashIndex).trim();
  return providerId.length > 0 ? providerId : null;
}
function parseProviderWildcardPattern(target) {
  const trimmed = target.trim();
  const slashIndex = trimmed.indexOf("/");
  if (slashIndex <= 0) return null;
  const providerId = trimmed.slice(0, slashIndex).trim();
  const modelPattern = trimmed.slice(slashIndex + 1).trim();
  if (!providerId || !modelPattern.includes("*")) return null;
  return { providerId, modelPattern };
}
function toFullModelString(model, providerId) {
  const trimmedModel = model.trim();
  if (trimmedModel.includes("/")) return trimmedModel;
  const normalizedProviderId = toTrimmedString(providerId);
  return normalizedProviderId ? `${normalizedProviderId}/${trimmedModel}` : trimmedModel;
}
function slugify(value) {
  const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return slug.length > 0 ? slug : "step";
}
function buildStepId(kind, comboName, index, seed) {
  const kindSlug = kind === "combo-ref" ? "ref" : kind === "provider-wildcard" ? "wildcard" : "model";
  const parts = [slugify(comboName || "combo"), kindSlug, String(index + 1), slugify(seed)];
  return parts.join("-").slice(0, 200);
}
function shouldTreatAsComboRef(target, providerId, options) {
  if (providerId) return false;
  const comboNames = collectComboNames(options.allCombos);
  return comboNames.has(target) || target === toTrimmedString(options.comboName);
}
function normalizeComboStep(value, options = {}) {
  const comboName = toTrimmedString(options.comboName);
  const index = typeof options.index === "number" ? options.index : 0;
  if (typeof value === "string") {
    const target = toTrimmedString(value);
    if (!target) return null;
    if (shouldTreatAsComboRef(target, null, options)) {
      return {
        id: buildStepId("combo-ref", comboName, index, target),
        kind: "combo-ref",
        comboName: target,
        weight: 0
      };
    }
    const wildcardPattern2 = parseProviderWildcardPattern(target);
    if (wildcardPattern2) {
      return {
        id: buildStepId(
          "provider-wildcard",
          comboName,
          index,
          `${wildcardPattern2.providerId}/${wildcardPattern2.modelPattern}`
        ),
        kind: "provider-wildcard",
        providerId: wildcardPattern2.providerId,
        modelPattern: wildcardPattern2.modelPattern,
        weight: 0
      };
    }
    const providerId2 = parseProviderId(target);
    return {
      id: buildStepId("model", comboName, index, target),
      kind: "model",
      model: target,
      ...providerId2 ? { providerId: providerId2 } : {},
      weight: 0
    };
  }
  if (!isRecord3(value)) return null;
  const explicitId = toTrimmedString(value.id);
  const weight = toWeight(value.weight);
  const label = toTrimmedString(value.label);
  const prompt = toTrimmedString(value.prompt);
  const fallbackOnlyOnQuotaExhaustion = value.fallbackOnlyOnQuotaExhaustion === true;
  if (value.kind === "combo-ref") {
    const comboRefName = toTrimmedString(value.comboName);
    if (!comboRefName) return null;
    return {
      id: explicitId || buildStepId("combo-ref", comboName, index, comboRefName),
      kind: "combo-ref",
      comboName: comboRefName,
      weight,
      ...label ? { label } : {},
      ...fallbackOnlyOnQuotaExhaustion ? { fallbackOnlyOnQuotaExhaustion: true } : {}
    };
  }
  if (value.kind === "provider-wildcard") {
    const providerId2 = toTrimmedString(value.providerId) || toTrimmedString(value.provider) || parseProviderId(toTrimmedString(value.model) || "");
    if (!providerId2) return null;
    const modelPattern = toTrimmedString(value.modelPattern) || "*";
    const connectionId2 = value.connectionId === null ? null : toTrimmedString(value.connectionId) || void 0;
    const allowedConnectionIds2 = Array.isArray(value.allowedConnectionIds) ? value.allowedConnectionIds.map((connId) => toTrimmedString(connId)).filter((connId) => !!connId) : void 0;
    return {
      id: explicitId || buildStepId(
        "provider-wildcard",
        comboName,
        index,
        connectionId2 ? `${providerId2}/${modelPattern}:${connectionId2}` : `${providerId2}/${modelPattern}`
      ),
      kind: "provider-wildcard",
      providerId: providerId2,
      modelPattern,
      ...connectionId2 !== void 0 ? { connectionId: connectionId2 } : {},
      weight,
      ...label ? { label } : {},
      ...allowedConnectionIds2 && allowedConnectionIds2.length > 0 ? { allowedConnectionIds: allowedConnectionIds2 } : {}
    };
  }
  const rawModel = toTrimmedString(value.model);
  if (!rawModel) return null;
  const isExplicitModel = value.kind === "model";
  const providerId = toTrimmedString(value.providerId) || toTrimmedString(value.provider) || parseProviderId(rawModel);
  const wildcardPattern = parseProviderWildcardPattern(rawModel);
  if (wildcardPattern) {
    const connectionId2 = value.connectionId === null ? null : toTrimmedString(value.connectionId) || void 0;
    const allowedConnectionIds2 = Array.isArray(value.allowedConnectionIds) ? value.allowedConnectionIds.map((connId) => toTrimmedString(connId)).filter((connId) => !!connId) : void 0;
    return {
      id: explicitId || buildStepId(
        "provider-wildcard",
        comboName,
        index,
        connectionId2 ? `${wildcardPattern.providerId}/${wildcardPattern.modelPattern}:${connectionId2}` : `${wildcardPattern.providerId}/${wildcardPattern.modelPattern}`
      ),
      kind: "provider-wildcard",
      providerId: wildcardPattern.providerId,
      modelPattern: wildcardPattern.modelPattern,
      ...connectionId2 !== void 0 ? { connectionId: connectionId2 } : {},
      weight,
      ...label ? { label } : {},
      ...allowedConnectionIds2 && allowedConnectionIds2.length > 0 ? { allowedConnectionIds: allowedConnectionIds2 } : {}
    };
  }
  if (!isExplicitModel && shouldTreatAsComboRef(rawModel, providerId, options)) {
    return {
      id: explicitId || buildStepId("combo-ref", comboName, index, rawModel),
      kind: "combo-ref",
      comboName: rawModel,
      weight,
      ...label ? { label } : {}
    };
  }
  const model = toFullModelString(rawModel, providerId);
  const connectionId = value.connectionId === null ? null : toTrimmedString(value.connectionId) || void 0;
  const tags = Array.isArray(value.tags) ? value.tags.map((tag) => toTrimmedString(tag)).filter((tag) => !!tag) : void 0;
  const allowedConnectionIds = Array.isArray(value.allowedConnectionIds) ? value.allowedConnectionIds.map((connId) => toTrimmedString(connId)).filter((connId) => !!connId) : void 0;
  return {
    id: explicitId || buildStepId("model", comboName, index, connectionId ? `${model}:${connectionId}` : model),
    kind: "model",
    model,
    ...providerId ? { providerId } : {},
    ...connectionId !== void 0 ? { connectionId } : {},
    weight,
    ...label ? { label } : {},
    ...prompt ? { prompt } : {},
    ...tags && tags.length > 0 ? { tags } : {},
    ...allowedConnectionIds && allowedConnectionIds.length > 0 ? { allowedConnectionIds } : {},
    ...fallbackOnlyOnQuotaExhaustion ? { fallbackOnlyOnQuotaExhaustion: true } : {}
  };
}
var init_steps = __esm({
  "src/lib/combos/steps.ts"() {
  }
});

// src/lib/db/healthCheck.ts
function describeDbDriver(db) {
  return {
    name: db.driver,
    degraded: db.driver === "sql.js" || db.name === IN_MEMORY_DB_NAME
  };
}
function isRecord4(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}
function toTrimmedString2(value) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}
function parseJsonRecord(value) {
  try {
    const parsed = JSON.parse(value);
    return isRecord4(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
function hasRows(db, table) {
  const row = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(table);
  return row?.name === table;
}
function hasProviderConnection(db, connectionId) {
  const row = db.prepare("SELECT 1 AS ok FROM provider_connections WHERE id = ? LIMIT 1").get(connectionId);
  return row?.ok === 1;
}
function isValidIsoTimestamp(value) {
  if (typeof value !== "string" || value.trim().length === 0) return false;
  return !Number.isNaN(Date.parse(value));
}
function buildRepairNote(message, checkedAt) {
  return `[db-health:${checkedAt}] ${message}`;
}
function buildDisabledCombo(row, checkedAt) {
  const now = checkedAt;
  return {
    id: row.id,
    name: row.name,
    version: 2,
    strategy: "priority",
    models: [],
    config: {},
    isActive: false,
    isHidden: false,
    sortOrder: typeof row.sort_order === "number" ? row.sort_order : 0,
    createdAt: row.created_at || now,
    updatedAt: now,
    repairNote: buildRepairNote("Combo payload was rebuilt after invalid JSON was detected.", now)
  };
}
function normalizeComboModels(models) {
  return Array.isArray(models) ? models : [];
}
function repairComboRows(db, rows, checkedAt, options) {
  if (rows.length === 0) return { issueCount: 0, repairedCount: 0 };
  const existingComboNames = new Set(rows.map((row) => row.name));
  let issueCount = 0;
  let repairedCount = 0;
  const updateComboStmt = db.prepare("UPDATE combos SET data = ?, updated_at = ? WHERE id = ?");
  for (const row of rows) {
    const parsed = parseJsonRecord(row.data);
    if (!parsed) {
      issueCount += 1;
      if (options.autoRepair) {
        const repaired = buildDisabledCombo(row, checkedAt);
        updateComboStmt.run(JSON.stringify(repaired), checkedAt, row.id);
        repairedCount += 1;
      }
      continue;
    }
    const currentModels = normalizeComboModels(parsed.models);
    if (currentModels.length === 0) continue;
    const nextModels = [];
    let removedSteps = 0;
    let clearedConnectionPins = 0;
    let normalizedLegacyComboRefs = 0;
    for (const [index, rawStep] of currentModels.entries()) {
      if (!isRecord4(rawStep)) {
        if (typeof rawStep === "string") {
          const normalizedStep = normalizeComboStep(rawStep, {
            comboName: row.name,
            index,
            allCombos: existingComboNames
          });
          if (normalizedStep?.kind === "combo-ref") {
            if (normalizedStep.comboName === row.name || !existingComboNames.has(normalizedStep.comboName)) {
              removedSteps += 1;
              continue;
            }
            nextModels.push(normalizedStep);
            normalizedLegacyComboRefs += 1;
            continue;
          }
        }
        nextModels.push(rawStep);
        continue;
      }
      if (rawStep.kind === "combo-ref") {
        const comboName = toTrimmedString2(rawStep.comboName);
        if (!comboName || comboName === row.name || !existingComboNames.has(comboName)) {
          removedSteps += 1;
          continue;
        }
        nextModels.push(rawStep);
        continue;
      }
      const connectionId = toTrimmedString2(rawStep.connectionId);
      if (connectionId && !hasProviderConnection(db, connectionId)) {
        const repairedStep = { ...rawStep };
        delete repairedStep.connectionId;
        nextModels.push(repairedStep);
        clearedConnectionPins += 1;
        continue;
      }
      nextModels.push(rawStep);
    }
    if (removedSteps === 0 && clearedConnectionPins === 0 && normalizedLegacyComboRefs === 0) {
      continue;
    }
    issueCount += removedSteps + clearedConnectionPins + normalizedLegacyComboRefs;
    if (!options.autoRepair) continue;
    const nextCombo = {
      ...parsed,
      models: nextModels,
      updatedAt: checkedAt,
      repairNote: buildRepairNote(
        [
          removedSteps > 0 ? `${removedSteps} broken combo step(s) removed.` : null,
          clearedConnectionPins > 0 ? `${clearedConnectionPins} missing connection pin(s) cleared.` : null,
          normalizedLegacyComboRefs > 0 ? `${normalizedLegacyComboRefs} legacy combo ref step(s) canonicalized.` : null
        ].filter(Boolean).join(" "),
        checkedAt
      ),
      ...nextModels.length === 0 ? { isActive: false } : {}
    };
    updateComboStmt.run(JSON.stringify(nextCombo), checkedAt, row.id);
    repairedCount += removedSteps + clearedConnectionPins + normalizedLegacyComboRefs;
  }
  return { issueCount, repairedCount };
}
function getBrokenQuotaSnapshotRowIds(db) {
  if (!hasRows(db, "quota_snapshots")) return [];
  const brokenRowIds = /* @__PURE__ */ new Set();
  const rows = db.prepare("SELECT id, provider, connection_id, created_at FROM quota_snapshots").all();
  for (const row of rows) {
    const connectionId = toTrimmedString2(row.connection_id);
    const missingConnection = !!connectionId && !hasProviderConnection(db, connectionId);
    const invalidTimestamp = !isValidIsoTimestamp(row.created_at);
    if ((missingConnection || invalidTimestamp) && typeof row.id === "number") {
      brokenRowIds.add(row.id);
    }
  }
  return Array.from(brokenRowIds);
}
function countOrphanQuotaSnapshots(db) {
  return getBrokenQuotaSnapshotRowIds(db).length;
}
function repairQuotaSnapshots(db) {
  if (!hasRows(db, "quota_snapshots")) return 0;
  const brokenRowIds = getBrokenQuotaSnapshotRowIds(db);
  if (brokenRowIds.length === 0) return 0;
  const deleteByRowId = db.prepare("DELETE FROM quota_snapshots WHERE id = ?");
  let repaired = 0;
  for (const rowId of brokenRowIds) {
    repaired += deleteByRowId.run(rowId).changes;
  }
  return repaired;
}
function countOrphanDomainRows(db, table) {
  if (!hasRows(db, table)) return 0;
  const row = db.prepare(
    `SELECT COUNT(*) AS count
       FROM ${table}
       WHERE api_key_id NOT IN (SELECT id FROM api_keys)`
  ).get();
  return row?.count || 0;
}
function repairOrphanDomainRows(db, table) {
  if (!hasRows(db, table)) return 0;
  return db.prepare(`DELETE FROM ${table} WHERE api_key_id NOT IN (SELECT id FROM api_keys)`).run().changes;
}
function countInvalidJsonRows(db, table, column) {
  if (!hasRows(db, table)) return 0;
  const rows = db.prepare(`SELECT ${column} FROM ${table}`).all();
  let invalid = 0;
  for (const row of rows) {
    const raw = row[column];
    if (raw == null && column === "options") continue;
    if (typeof raw !== "string") {
      invalid += 1;
      continue;
    }
    try {
      JSON.parse(raw);
    } catch {
      invalid += 1;
    }
  }
  return invalid;
}
function repairInvalidJsonRows(db, table, column) {
  if (!hasRows(db, table)) return 0;
  const rows = db.prepare(`SELECT rowid, ${column} FROM ${table}`).all();
  const deleteByRowId = db.prepare(`DELETE FROM ${table} WHERE rowid = ?`);
  const clearOptionsByRowId = db.prepare(
    "UPDATE domain_circuit_breakers SET options = NULL WHERE rowid = ?"
  );
  let repaired = 0;
  for (const row of rows) {
    const raw = row[column];
    if (raw == null && table === "domain_circuit_breakers") {
      continue;
    }
    if (typeof raw !== "string") {
      if (table === "domain_circuit_breakers") {
        repaired += clearOptionsByRowId.run(row.rowid).changes;
        continue;
      }
      deleteByRowId.run(row.rowid);
      repaired += 1;
      continue;
    }
    try {
      JSON.parse(raw);
    } catch {
      if (table === "domain_circuit_breakers") {
        repaired += clearOptionsByRowId.run(row.rowid).changes;
        continue;
      }
      deleteByRowId.run(row.rowid);
      repaired += 1;
    }
  }
  return repaired;
}
function getSchemaVersionIssueCount(db, expectedSchemaVersion) {
  if (!hasRows(db, "db_meta")) return 0;
  const row = db.prepare("SELECT value FROM db_meta WHERE key = 'schema_version'").get();
  const current = typeof row?.value === "string" ? row.value : null;
  return current === expectedSchemaVersion ? 0 : 1;
}
function repairSchemaVersion(db, expectedSchemaVersion) {
  if (!hasRows(db, "db_meta")) return 0;
  return db.prepare("INSERT OR REPLACE INTO db_meta (key, value) VALUES ('schema_version', ?)").run(expectedSchemaVersion).changes;
}
function runDbHealthCheck(db, options = {}) {
  const autoRepair = options.autoRepair === true;
  const expectedSchemaVersion = options.expectedSchemaVersion || "1";
  const checkedAt = (/* @__PURE__ */ new Date()).toISOString();
  const issues = [];
  if (pagerCorruption) {
    issues.push({
      type: "integrity_check_failed",
      table: "sqlite",
      description: `Pager reported SQLITE_CORRUPT during ${pagerCorruption.source}: ${pagerCorruption.message}`,
      count: 1
    });
  }
  let repairedCount = 0;
  let backupCreated = false;
  let backupAttempted = false;
  const ensureBackupBeforeRepair = () => {
    if (!autoRepair || backupAttempted || typeof options.createBackupBeforeRepair !== "function") {
      return;
    }
    backupAttempted = true;
    backupCreated = options.createBackupBeforeRepair();
  };
  if (!options.skipIntegrityCheck) {
    const integrityCheck = db.pragma("quick_check");
    if (integrityCheck[0]?.quick_check !== "ok") {
      issues.push({
        type: "integrity_check_failed",
        table: "sqlite",
        description: "SQLite integrity_check returned a non-ok status.",
        count: 1
      });
    }
  }
  if (hasRows(db, "combos")) {
    const comboRows = db.prepare(
      "SELECT id, name, data, sort_order, created_at, updated_at FROM combos ORDER BY name COLLATE NOCASE ASC"
    ).all();
    const comboRepair = repairComboRows(db, comboRows, checkedAt, { autoRepair });
    if (comboRepair.issueCount > 0) {
      issues.push({
        type: "broken_reference",
        table: "combos",
        description: "Combos contained broken combo references, legacy combo refs, invalid JSON, or pinned connections that no longer exist.",
        count: comboRepair.issueCount
      });
      if (autoRepair) {
        ensureBackupBeforeRepair();
        repairedCount += comboRepair.repairedCount;
      }
    }
  }
  const orphanQuotaCount = countOrphanQuotaSnapshots(db);
  if (orphanQuotaCount > 0) {
    issues.push({
      type: "stale_snapshot",
      table: "quota_snapshots",
      description: "Quota snapshots referenced missing connections or contained invalid timestamps.",
      count: orphanQuotaCount
    });
    if (autoRepair) {
      ensureBackupBeforeRepair();
      repairedCount += repairQuotaSnapshots(db);
    }
  }
  const orphanBudgets = countOrphanDomainRows(db, "domain_budgets");
  if (orphanBudgets > 0) {
    issues.push({
      type: "broken_reference",
      table: "domain_budgets",
      description: "Domain budgets referenced API keys that no longer exist.",
      count: orphanBudgets
    });
    if (autoRepair) {
      ensureBackupBeforeRepair();
      repairedCount += repairOrphanDomainRows(db, "domain_budgets");
    }
  }
  const orphanCostHistory = countOrphanDomainRows(db, "domain_cost_history");
  if (orphanCostHistory > 0) {
    issues.push({
      type: "broken_reference",
      table: "domain_cost_history",
      description: "Domain cost history referenced API keys that no longer exist.",
      count: orphanCostHistory
    });
    if (autoRepair) {
      ensureBackupBeforeRepair();
      repairedCount += repairOrphanDomainRows(db, "domain_cost_history");
    }
  }
  const invalidFallbackChains = countInvalidJsonRows(db, "domain_fallback_chains", "chain");
  if (invalidFallbackChains > 0) {
    issues.push({
      type: "invalid_state",
      table: "domain_fallback_chains",
      description: "Fallback chain rows contained invalid JSON payloads.",
      count: invalidFallbackChains
    });
    if (autoRepair) {
      ensureBackupBeforeRepair();
      repairedCount += repairInvalidJsonRows(db, "domain_fallback_chains", "chain");
    }
  }
  const invalidLockoutState = countInvalidJsonRows(db, "domain_lockout_state", "attempts");
  if (invalidLockoutState > 0) {
    issues.push({
      type: "invalid_state",
      table: "domain_lockout_state",
      description: "Lockout state rows contained invalid JSON payloads.",
      count: invalidLockoutState
    });
    if (autoRepair) {
      ensureBackupBeforeRepair();
      repairedCount += repairInvalidJsonRows(db, "domain_lockout_state", "attempts");
    }
  }
  const invalidBreakerOptions = countInvalidJsonRows(db, "domain_circuit_breakers", "options");
  if (invalidBreakerOptions > 0) {
    issues.push({
      type: "invalid_state",
      table: "domain_circuit_breakers",
      description: "Circuit breaker option payloads were invalid JSON.",
      count: invalidBreakerOptions
    });
    if (autoRepair) {
      ensureBackupBeforeRepair();
      repairedCount += repairInvalidJsonRows(db, "domain_circuit_breakers", "options");
    }
  }
  const schemaVersionIssues = getSchemaVersionIssueCount(db, expectedSchemaVersion);
  if (schemaVersionIssues > 0) {
    issues.push({
      type: "invalid_state",
      table: "db_meta",
      description: `db_meta.schema_version did not match expected version ${expectedSchemaVersion}.`,
      count: schemaVersionIssues
    });
    if (autoRepair) {
      ensureBackupBeforeRepair();
      repairedCount += repairSchemaVersion(db, expectedSchemaVersion);
    }
  }
  return {
    isHealthy: issues.length === 0,
    issues,
    repairedCount,
    backupCreated,
    autoRepair,
    checkedAt,
    driver: describeDbDriver(db)
  };
}
var IN_MEMORY_DB_NAME, pagerCorruption;
var init_healthCheck = __esm({
  "src/lib/db/healthCheck.ts"() {
    init_steps();
    IN_MEMORY_DB_NAME = ":memory:";
    pagerCorruption = null;
  }
});

// src/lib/db/stateReset.ts
var init_stateReset = __esm({
  "src/lib/db/stateReset.ts"() {
  }
});

// src/shared/constants/featureFlagDefinitions.ts
var init_featureFlagDefinitions = __esm({
  "src/shared/constants/featureFlagDefinitions.ts"() {
  }
});

// src/lib/db/backup.ts
var BACKUP_THROTTLE_MS;
var init_backup = __esm({
  "src/lib/db/backup.ts"() {
    init_core();
    init_stateReset();
    init_backupRetention();
    init_testProcess();
    BACKUP_THROTTLE_MS = 60 * 60 * 1e3;
  }
});

// src/lib/db/readCache.ts
function invalidateModelCatalogCache() {
  modelCatalogCacheVersion++;
}
function invalidateDbCache(scope, id) {
  if (!scope || scope === "settings") settingsCache.invalidate();
  if (!scope || scope === "pricing") pricingCache.invalidate();
  if (!scope || scope === "connections") {
    connectionsCache.invalidate();
    rawConnectionsCache.invalidate();
    if (id) {
      connectionByIdCache.invalidate(id);
    } else {
      connectionByIdCache.invalidate();
    }
  }
  if (!scope || scope === "nodes") nodesCache.invalidate();
  if (!scope || scope === "combos") combosCacheVersion++;
  invalidateModelCatalogCache();
}
var TTLCache, SETTINGS_TTL_MS, PRICING_TTL_MS, CONNECTIONS_TTL_MS, settingsCache, pricingCache, connectionsCache, rawConnectionsCache, connectionByIdCache, nodesCache, lkgpCache, combosCacheVersion, modelCatalogCacheVersion;
var init_readCache = __esm({
  "src/lib/db/readCache.ts"() {
    TTLCache = class {
      cache = /* @__PURE__ */ new Map();
      ttlMs;
      maxSize;
      constructor(ttlMs, maxSize) {
        this.ttlMs = ttlMs;
        this.maxSize = maxSize ?? 0;
      }
      get(key) {
        const entry = this.cache.get(key);
        if (!entry) return void 0;
        if (Date.now() > entry.expiresAt) {
          this.cache.delete(key);
          return void 0;
        }
        this.cache.delete(key);
        this.cache.set(key, entry);
        return entry.value;
      }
      set(key, value) {
        if (this.maxSize > 0 && this.cache.size >= this.maxSize && !this.cache.has(key)) {
          const oldest = this.cache.keys().next().value;
          if (oldest !== void 0) this.cache.delete(oldest);
        }
        this.cache.set(key, { value, expiresAt: Date.now() + this.ttlMs });
      }
      invalidate(key) {
        if (key) {
          this.cache.delete(key);
        } else {
          this.cache.clear();
        }
      }
    };
    SETTINGS_TTL_MS = 5e3;
    PRICING_TTL_MS = 3e4;
    CONNECTIONS_TTL_MS = 5e3;
    settingsCache = new TTLCache(SETTINGS_TTL_MS);
    pricingCache = new TTLCache(PRICING_TTL_MS);
    connectionsCache = new TTLCache(CONNECTIONS_TTL_MS, 500);
    rawConnectionsCache = new TTLCache(CONNECTIONS_TTL_MS, 500);
    connectionByIdCache = new TTLCache(
      CONNECTIONS_TTL_MS,
      1e4
    );
    nodesCache = new TTLCache(CONNECTIONS_TTL_MS);
    lkgpCache = new TTLCache(SETTINGS_TTL_MS);
    combosCacheVersion = 0;
    modelCatalogCacheVersion = 0;
  }
});

// src/lib/db/models/modelCatalogWriteSignals.ts
var init_modelCatalogWriteSignals = __esm({
  "src/lib/db/models/modelCatalogWriteSignals.ts"() {
    init_backup();
    init_readCache();
  }
});

// src/lib/db/featureFlags.ts
var init_featureFlags = __esm({
  "src/lib/db/featureFlags.ts"() {
    init_featureFlagDefinitions();
    init_core();
    init_modelCatalogWriteSignals();
  }
});

// src/shared/utils/featureFlags.ts
var init_featureFlags2 = __esm({
  "src/shared/utils/featureFlags.ts"() {
    init_featureFlags();
    init_featureFlagDefinitions();
  }
});

// src/lib/piiSanitizer.ts
var init_piiSanitizer = __esm({
  "src/lib/piiSanitizer.ts"() {
    init_featureFlags2();
  }
});

// src/lib/logPayloads.ts
function parseStoredPayload(value) {
  if (typeof value !== "string" || value.trim().length === 0) return null;
  try {
    return JSON.parse(value);
  } catch {
    return { _rawText: value };
  }
}
var init_logPayloads = __esm({
  "src/lib/logPayloads.ts"() {
    init_piiSanitizer();
  }
});

// src/lib/db/optimizationSettings.ts
function parseKeyValueJson(raw) {
  if (raw === null || raw === void 0) return void 0;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}
function isRecord5(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function normalizeAutoVacuumMode(value, fallback) {
  return typeof value === "string" && value in AUTO_VACUUM_MODE_TO_PRAGMA ? value : fallback;
}
function normalizePageSizeBytes(value, fallback) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  const pageSize = Math.floor(numeric);
  if (pageSize < 512 || pageSize > 65536 || pageSize % 512 !== 0) return fallback;
  return pageSize;
}
function normalizeVacuumHour(value, fallback) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.min(23, Math.max(0, Math.floor(numeric)));
}
function normalizeStoredCacheSizeKb(value, fallback) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  const cacheSizeKb = Math.floor(numeric);
  if (cacheSizeKb < 1 || cacheSizeKb > 1e6) return fallback;
  return cacheSizeKb;
}
function requireCacheSizeKb(value) {
  if (!Number.isInteger(value) || value < 1 || value > 1e6) {
    throw new Error("cache_size must be a positive KiB value between 1 and 1000000");
  }
  return value;
}
function mergeOptimizationSettings(target, value) {
  if (!isRecord5(value)) return target;
  return {
    ...target,
    autoVacuumMode: normalizeAutoVacuumMode(value.autoVacuumMode, target.autoVacuumMode),
    scheduledVacuum: typeof value.scheduledVacuum === "string" && ["never", "daily", "weekly", "monthly"].includes(value.scheduledVacuum) ? value.scheduledVacuum : target.scheduledVacuum,
    vacuumHour: normalizeVacuumHour(value.vacuumHour, target.vacuumHour),
    pageSize: normalizePageSizeBytes(value.pageSize, target.pageSize),
    cacheSize: normalizeStoredCacheSizeKb(value.cacheSize, target.cacheSize),
    optimizeOnStartup: typeof value.optimizeOnStartup === "boolean" ? value.optimizeOnStartup : target.optimizeOnStartup
  };
}
function readDatabaseOptimizationSettings(db) {
  let settings = { ...DEFAULT_DATABASE_SETTINGS.optimization };
  try {
    const rows = db.prepare("SELECT namespace, key, value FROM key_value WHERE namespace IN (?, ?)").all("settings", "databaseSettings");
    const byNamespace = {
      settings: {},
      databaseSettings: {}
    };
    for (const row of rows) {
      byNamespace[row.namespace] ??= {};
      byNamespace[row.namespace][row.key] = parseKeyValueJson(row.value);
    }
    const mainSettings = byNamespace.settings ?? {};
    const databaseSettingsValue = mainSettings.databaseSettings;
    if (isRecord5(databaseSettingsValue)) {
      settings = mergeOptimizationSettings(settings, databaseSettingsValue.optimization);
    }
    settings = mergeOptimizationSettings(settings, mainSettings.optimization);
    const databaseSettings = byNamespace.databaseSettings ?? {};
    const optimizeOnStartup = databaseSettings["optimization.optimizeOnStartup"] ?? databaseSettings.optimizeOnStartup;
    settings = mergeOptimizationSettings(settings, databaseSettings.optimization);
    settings = {
      ...settings,
      autoVacuumMode: normalizeAutoVacuumMode(
        databaseSettings["optimization.autoVacuumMode"] ?? databaseSettings.autoVacuumMode,
        settings.autoVacuumMode
      ),
      pageSize: normalizePageSizeBytes(
        databaseSettings["optimization.pageSize"] ?? databaseSettings.pageSize,
        settings.pageSize
      ),
      cacheSize: normalizeStoredCacheSizeKb(
        databaseSettings["optimization.cacheSize"] ?? databaseSettings.cacheSize,
        settings.cacheSize
      ),
      optimizeOnStartup: typeof optimizeOnStartup === "boolean" ? optimizeOnStartup : settings.optimizeOnStartup
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[DB] Failed to read database optimization settings; using defaults: ${message}`);
  }
  return settings;
}
function setCacheSizeForDb(db, cacheSizeKb) {
  const normalizedCacheSizeKb = requireCacheSizeKb(cacheSizeKb);
  const currentCacheSize = db.pragma("cache_size", { simple: true });
  const targetCacheSize = -normalizedCacheSizeKb;
  if (currentCacheSize === targetCacheSize) {
    console.log(`[DB] cache_size already set to ${normalizedCacheSizeKb}KB`);
    return;
  }
  console.log(
    `[DB] Changing cache_size from ${Math.abs(currentCacheSize)}KB to ${normalizedCacheSizeKb}KB`
  );
  db.pragma(`cache_size = ${targetCacheSize}`);
  const newCacheSize = db.pragma("cache_size", { simple: true });
  if (newCacheSize !== targetCacheSize) {
    throw new Error(
      `cache_size change did not take effect (expected ${targetCacheSize}, got ${newCacheSize})`
    );
  }
  console.log(`[DB] cache_size changed to ${Math.abs(newCacheSize)}KB`);
}
function applyPersistentOptimizationPragmas(db, settings) {
  const targetAutoVacuum = AUTO_VACUUM_MODE_TO_PRAGMA[settings.autoVacuumMode];
  const targetPageSize = normalizePageSizeBytes(
    settings.pageSize,
    DEFAULT_DATABASE_SETTINGS.optimization.pageSize
  );
  const currentAutoVacuum = db.pragma("auto_vacuum", { simple: true });
  const currentPageSize = db.pragma("page_size", { simple: true });
  if (currentAutoVacuum === targetAutoVacuum && currentPageSize === targetPageSize) return;
  const originalJournalMode = String(
    db.pragma("journal_mode", { simple: true }) ?? ""
  ).toUpperCase();
  const shouldRestoreWal = originalJournalMode === "WAL";
  console.log(
    `[DB] Applying persistent optimization settings (auto_vacuum ${currentAutoVacuum}->${targetAutoVacuum}, page_size ${currentPageSize}->${targetPageSize})`
  );
  try {
    if (shouldRestoreWal) db.pragma("journal_mode = DELETE");
    db.pragma(`auto_vacuum = ${targetAutoVacuum}`);
    db.pragma(`page_size = ${targetPageSize}`);
    db.exec("VACUUM");
  } finally {
    if (shouldRestoreWal) {
      try {
        db.pragma("journal_mode = WAL");
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn(`[DB] Failed to restore WAL mode after optimization settings: ${message}`);
      }
    }
  }
  const newAutoVacuum = db.pragma("auto_vacuum", { simple: true });
  const newPageSize = db.pragma("page_size", { simple: true });
  if (newAutoVacuum !== targetAutoVacuum || newPageSize !== targetPageSize) {
    throw new Error(
      `database optimization settings did not take effect (auto_vacuum expected ${targetAutoVacuum}, got ${newAutoVacuum}; page_size expected ${targetPageSize}, got ${newPageSize})`
    );
  }
}
function applyDatabaseOptimizationSettingsForDb(db, settings, options) {
  if (options.applyPersistent) applyPersistentOptimizationPragmas(db, settings);
  setCacheSizeForDb(
    db,
    normalizeStoredCacheSizeKb(settings.cacheSize, DEFAULT_DATABASE_SETTINGS.optimization.cacheSize)
  );
}
function applyStoredDatabaseOptimizationSettings(db) {
  const settings = readDatabaseOptimizationSettings(db);
  applyDatabaseOptimizationSettingsForDb(db, settings, {
    applyPersistent: false
  });
}
var AUTO_VACUUM_MODE_TO_PRAGMA;
var init_optimizationSettings = __esm({
  "src/lib/db/optimizationSettings.ts"() {
    init_databaseSettings();
    AUTO_VACUUM_MODE_TO_PRAGMA = {
      NONE: 0,
      FULL: 1,
      INCREMENTAL: 2
    };
  }
});

// src/lib/logEnv.ts
function parsePositiveInt2(value, fallback) {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}
function parseBoolean(value, fallback) {
  if (!value) return fallback;
  const normalized = value.trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  return fallback;
}
function getCallLogPipelineMaxSizeBytes() {
  return parsePositiveInt2(
    process.env.CALL_LOG_PIPELINE_MAX_SIZE_KB,
    DEFAULT_CALL_LOG_PIPELINE_MAX_SIZE_KB
  ) * 1024;
}
function isChatDebugFileEnabled() {
  if (parseBoolean(process.env.CHAT_DEBUG_FILE, false)) return true;
  return process.env.APP_LOG_LEVEL?.trim().toLowerCase() === "debug";
}
var DEFAULT_APP_LOG_MAX_SIZE, DEFAULT_CALL_LOG_PIPELINE_MAX_SIZE_KB;
var init_logEnv = __esm({
  "src/lib/logEnv.ts"() {
    init_dataPaths();
    DEFAULT_APP_LOG_MAX_SIZE = 50 * 1024 * 1024;
    DEFAULT_CALL_LOG_PIPELINE_MAX_SIZE_KB = 512;
  }
});

// src/lib/usage/callLogArtifacts.ts
import fs12 from "node:fs";
import path10 from "node:path";
function buildArtifactRelativePath(timestamp, id) {
  const parsed = new Date(timestamp);
  const safeTimestamp = (Number.isNaN(parsed.getTime()) ? (/* @__PURE__ */ new Date()).toISOString() : parsed.toISOString()).replace(/[:]/g, "-");
  const dateFolder = safeTimestamp.slice(0, 10);
  return path10.posix.join(dateFolder, `${safeTimestamp}_${id}.json`);
}
function computeArtifactChecksum(serialized) {
  const bytes = Buffer.from(serialized);
  let hash = 2166136261;
  for (const byte of bytes) {
    hash ^= byte;
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}
function truncateArtifactForStorage(artifact) {
  const pipeline = artifact.pipeline;
  if (!pipeline?.streamChunks) return artifact;
  return {
    ...artifact,
    pipeline: {
      ...pipeline,
      streamChunks: {
        provider: pipeline.streamChunks.provider?.length ? [STREAM_CHUNKS_OMITTED_FOR_SIZE_LIMIT] : void 0,
        openai: pipeline.streamChunks.openai?.length ? [STREAM_CHUNKS_OMITTED_FOR_SIZE_LIMIT] : void 0,
        client: pipeline.streamChunks.client?.length ? [STREAM_CHUNKS_OMITTED_FOR_SIZE_LIMIT] : void 0
      }
    }
  };
}
function omitOversizedPipeline(artifact) {
  if (!artifact.pipeline) return artifact;
  return {
    ...artifact,
    pipeline: {
      error: {
        _omniroute_truncated: true,
        reason: SIZE_LIMIT_EXCEEDED_REASON
      }
    }
  };
}
function getArtifactMaxBytes(artifact) {
  return artifact.pipeline ? getCallLogPipelineMaxSizeBytes() : MAX_CALL_LOG_ARTIFACT_BYTES;
}
function buildMinimalArtifactForSizeLimit(artifact) {
  return {
    schemaVersion: artifact.schemaVersion,
    summary: artifact.summary,
    requestBody: OMITTED_FOR_SIZE_LIMIT,
    responseBody: OMITTED_FOR_SIZE_LIMIT,
    error: artifact.error ? OMITTED_FOR_SIZE_LIMIT : null,
    pipeline: {
      error: {
        _omniroute_truncated: true,
        reason: SIZE_LIMIT_EXCEEDED_REASON
      }
    }
  };
}
function serializeFinalSizeLimitFallback(artifact, maxBytes) {
  const withSummary = JSON.stringify(buildMinimalArtifactForSizeLimit(artifact));
  if (Buffer.byteLength(withSummary) <= maxBytes) {
    return withSummary;
  }
  return JSON.stringify({
    schemaVersion: artifact.schemaVersion,
    _omniroute_truncated: true,
    reason: SIZE_LIMIT_EXCEEDED_REASON
  });
}
function serializeArtifactForStorage(artifact) {
  if (isChatDebugFileEnabled()) {
    return JSON.stringify(artifact, null, 2);
  }
  const maxBytes = getArtifactMaxBytes(artifact);
  const serialized = JSON.stringify(artifact);
  if (Buffer.byteLength(serialized) <= maxBytes) {
    return serialized;
  }
  const truncated = JSON.stringify(truncateArtifactForStorage(artifact));
  if (Buffer.byteLength(truncated) <= maxBytes) {
    return truncated;
  }
  const withoutPipeline = JSON.stringify(omitOversizedPipeline(artifact));
  if (Buffer.byteLength(withoutPipeline) <= maxBytes) {
    return withoutPipeline;
  }
  const minimal = JSON.stringify({
    ...omitOversizedPipeline(artifact),
    requestBody: OMITTED_FOR_SIZE_LIMIT,
    responseBody: OMITTED_FOR_SIZE_LIMIT,
    error: artifact.error ? OMITTED_FOR_SIZE_LIMIT : null
  });
  if (Buffer.byteLength(minimal) <= maxBytes) {
    return minimal;
  }
  return serializeFinalSizeLimitFallback(artifact, maxBytes);
}
function writeCallArtifact(artifact, relativePath = buildArtifactRelativePath(artifact.summary.timestamp, artifact.summary.id)) {
  if (!CALL_LOGS_DIR || isBuildPhase2) return null;
  const absPath = path10.join(CALL_LOGS_DIR, relativePath);
  const tmpPath = `${absPath}.${process.pid}.${Date.now()}.tmp`;
  try {
    const serialized = serializeArtifactForStorage(artifact);
    const sizeBytes = Buffer.byteLength(serialized);
    const fileChecksum = computeArtifactChecksum(serialized);
    fs12.mkdirSync(path10.dirname(absPath), { recursive: true });
    fs12.writeFileSync(tmpPath, serialized);
    fs12.renameSync(tmpPath, absPath);
    return {
      relPath: relativePath,
      sizeBytes,
      sha256: fileChecksum
    };
  } catch (error) {
    try {
      fs12.rmSync(tmpPath, { force: true });
    } catch {
    }
    console.error("[callLogs] Failed to write request artifact:", error.message);
    return null;
  }
}
var isCloud2, isBuildPhase2, DATA_DIR2, CALL_LOGS_DIR, MAX_CALL_LOG_ARTIFACT_BYTES, SIZE_LIMIT_EXCEEDED_REASON, OMITTED_FOR_SIZE_LIMIT, STREAM_CHUNKS_OMITTED_FOR_SIZE_LIMIT;
var init_callLogArtifacts = __esm({
  "src/lib/usage/callLogArtifacts.ts"() {
    init_dataPaths();
    init_logEnv();
    isCloud2 = typeof globalThis.caches === "object" && globalThis.caches !== null;
    isBuildPhase2 = process.env.NEXT_PHASE === "phase-production-build" || process.env.OMNIROUTE_BUILDING === "1";
    DATA_DIR2 = resolveDataDir2({ isCloud: isCloud2 });
    CALL_LOGS_DIR = isCloud2 ? null : path10.join(DATA_DIR2, "call_logs");
    MAX_CALL_LOG_ARTIFACT_BYTES = 512 * 1024;
    SIZE_LIMIT_EXCEEDED_REASON = "call_log_artifact_size_limit_exceeded";
    OMITTED_FOR_SIZE_LIMIT = "[omitted: call log artifact size limit exceeded]";
    STREAM_CHUNKS_OMITTED_FOR_SIZE_LIMIT = "[stream chunks omitted: call log artifact size limit exceeded]";
  }
});

// src/lib/db/encryption.ts
import { createCipheriv, createDecipheriv, randomBytes, scryptSync, createHash } from "crypto";
function getStaticKey() {
  if (_staticKey !== null) return _staticKey;
  const secret = process.env.STORAGE_ENCRYPTION_KEY;
  if (!secret || typeof secret !== "string" || secret.trim().length === 0) return null;
  try {
    _staticKey = scryptSync(secret, STATIC_SALT, KEY_LENGTH);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `[Encryption] Failed to derive key from STORAGE_ENCRYPTION_KEY: ${message}. Generate a valid key with: openssl rand -base64 32`
    );
    return null;
  }
  return _staticKey;
}
function getLegacyDynamicKey() {
  if (_legacyDynamicKey !== null) return _legacyDynamicKey;
  const secret = process.env.STORAGE_ENCRYPTION_KEY;
  if (!secret || typeof secret !== "string" || secret.trim().length === 0) return null;
  const dynamicSalt = createHash("sha256").update(secret).digest().slice(0, 16);
  try {
    _legacyDynamicKey = scryptSync(secret, dynamicSalt, KEY_LENGTH);
  } catch {
    return null;
  }
  return _legacyDynamicKey;
}
function isEncryptionEnabled() {
  return !!process.env.STORAGE_ENCRYPTION_KEY;
}
function encrypt(plaintext) {
  if (!plaintext || typeof plaintext !== "string") return plaintext;
  const key = getStaticKey();
  if (!key) {
    console.warn(
      "[Encryption] STORAGE_ENCRYPTION_KEY not set. Storing plaintext (passthrough mode)."
    );
    return plaintext;
  }
  if (plaintext.startsWith(PREFIX)) return plaintext;
  try {
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(plaintext, "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag().toString("hex");
    return `${PREFIX}${iv.toString("hex")}:${encrypted}:${authTag}`;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `[Encryption] Encryption failed: ${message}. Check your STORAGE_ENCRYPTION_KEY \u2014 generate one with: openssl rand -base64 32`
    );
    return plaintext;
  }
}
function migrateLegacyEncryptedString(ciphertext) {
  if (!isEncryptionEnabled()) return { updated: false, value: ciphertext };
  if (!ciphertext || ciphertext.trim().length === 0) return { updated: false, value: ciphertext };
  if (!ciphertext.startsWith(PREFIX)) return { updated: false, value: ciphertext };
  const staticKey = getStaticKey();
  const legacyKey = getLegacyDynamicKey();
  if (!staticKey) return { updated: false, value: null };
  const rawPayload = ciphertext.slice(PREFIX.length);
  const parts = rawPayload.split(":");
  if (parts.length !== 3) return { updated: false, value: ciphertext };
  const [ivHex, encryptedHex, authTagHex] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");
  const tryDecryptWithKey = (key) => {
    try {
      const decipher = createDecipheriv(ALGORITHM, key, iv, {
        authTagLength: AUTH_TAG_LENGTH
      });
      decipher.setAuthTag(authTag);
      let decrypted = decipher.update(encrypted, void 0, "utf8");
      decrypted += decipher.final("utf8");
      return decrypted;
    } catch {
      return null;
    }
  };
  if (tryDecryptWithKey(staticKey) !== null) {
    return { updated: false, value: ciphertext };
  }
  if (legacyKey) {
    const legacyDecrypted = tryDecryptWithKey(legacyKey);
    if (legacyDecrypted !== null) {
      return { updated: true, value: encrypt(legacyDecrypted) };
    }
  }
  return { updated: false, value: ciphertext };
}
var ALGORITHM, IV_LENGTH, KEY_LENGTH, AUTH_TAG_LENGTH, PREFIX, STATIC_SALT, _staticKey, _legacyDynamicKey;
var init_encryption = __esm({
  "src/lib/db/encryption.ts"() {
    ALGORITHM = "aes-256-gcm";
    IV_LENGTH = 16;
    KEY_LENGTH = 32;
    AUTH_TAG_LENGTH = 16;
    PREFIX = "enc:v1:";
    STATIC_SALT = "omniroute-field-encryption-v1";
    _staticKey = null;
    _legacyDynamicKey = null;
  }
});

// src/lib/db/caseMapping.ts
function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}
function rowToCamel(row) {
  if (!row) return null;
  const result = {};
  for (const [k, v] of Object.entries(row)) {
    const camelKey = toCamelCase(k);
    if (BOOLEAN_CAMEL_COLUMNS.has(camelKey)) {
      result[camelKey] = v === 1 || v === true;
    } else if (camelKey === "providerSpecificData" && typeof v === "string") {
      try {
        result[camelKey] = JSON.parse(v);
      } catch {
        result[camelKey] = v;
      }
    } else if (camelKey.endsWith("Json")) {
      const baseKey = camelKey.slice(0, -"Json".length);
      if (typeof v === "string") {
        try {
          result[baseKey] = JSON.parse(v);
        } catch {
          result[baseKey] = null;
        }
      } else {
        result[baseKey] = v == null ? null : v;
      }
    } else {
      result[camelKey] = v;
    }
  }
  return result;
}
var BOOLEAN_CAMEL_COLUMNS;
var init_caseMapping = __esm({
  "src/lib/db/caseMapping.ts"() {
    BOOLEAN_CAMEL_COLUMNS = /* @__PURE__ */ new Set([
      "isActive",
      "rateLimitProtection",
      "proxyEnabled",
      "perKeyProxyEnabled",
      "quotaVisible"
    ]);
  }
});

// src/lib/db/apiKeys/modelAccessMode.ts
function hasLegacyModelRestriction(value) {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (trimmed === "" || trimmed === "[]" || trimmed === "null") return false;
  try {
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? parsed.length > 0 : parsed !== null;
  } catch {
    return true;
  }
}
function parseModelAccessMode(value, rawAllowedModels) {
  if (hasLegacyModelRestriction(rawAllowedModels)) return "restricted";
  return value === "restricted" ? "restricted" : "all";
}
var init_modelAccessMode = __esm({
  "src/lib/db/apiKeys/modelAccessMode.ts"() {
  }
});

// src/lib/db/schemaColumns.ts
function ensureProviderConnectionsColumns(db) {
  try {
    const columns = db.prepare("PRAGMA table_info(provider_connections)").all();
    const columnNames = new Set(columns.map((column) => String(column.name ?? "")));
    for (const [column, type] of [
      ["auth_type", "TEXT"],
      ["name", "TEXT"],
      ["email", "TEXT"],
      ["display_name", "TEXT"],
      ["provider_specific_data", "TEXT"],
      ["rate_limit_protection", "INTEGER DEFAULT 0"],
      ["last_used_at", "TEXT"],
      ["default_model", "TEXT"]
      // legacy-schema hole; later data migrations read it
    ]) {
      if (!columnNames.has(column)) {
        db.exec(`ALTER TABLE provider_connections ADD COLUMN ${column} ${type}`);
        console.log(`[DB] Added provider_connections.${column} column`);
      }
    }
    if (!columnNames.has("group")) {
      db.exec('ALTER TABLE provider_connections ADD COLUMN "group" TEXT');
      console.log('[DB] Added provider_connections."group" column');
    }
    if (!columnNames.has("max_concurrent")) {
      db.exec("ALTER TABLE provider_connections ADD COLUMN max_concurrent INTEGER");
      console.log("[DB] Added provider_connections.max_concurrent column");
    }
    if (!columnNames.has("proxy_enabled")) {
      db.exec(
        "ALTER TABLE provider_connections ADD COLUMN proxy_enabled INTEGER NOT NULL DEFAULT 1"
      );
      console.log("[DB] Added provider_connections.proxy_enabled column");
    }
    if (!columnNames.has("per_key_proxy_enabled")) {
      db.exec(
        "ALTER TABLE provider_connections ADD COLUMN per_key_proxy_enabled INTEGER NOT NULL DEFAULT 0"
      );
      console.log("[DB] Added provider_connections.per_key_proxy_enabled column");
    }
    if (!columnNames.has("quota_visible")) {
      db.exec(
        "ALTER TABLE provider_connections ADD COLUMN quota_visible INTEGER NOT NULL DEFAULT 1"
      );
      console.log("[DB] Added provider_connections.quota_visible column");
    }
    if (!columnNames.has("quota_window_thresholds_json")) {
      db.exec("ALTER TABLE provider_connections ADD COLUMN quota_window_thresholds_json TEXT");
      console.log("[DB] Added provider_connections.quota_window_thresholds_json column");
    }
    if (!columnNames.has("rate_limit_overrides_json")) {
      db.exec("ALTER TABLE provider_connections ADD COLUMN rate_limit_overrides_json TEXT");
      console.log("[DB] Added provider_connections.rate_limit_overrides_json column");
    }
    if (!columnNames.has("refresh_token")) {
      db.exec("ALTER TABLE provider_connections ADD COLUMN refresh_token TEXT");
      console.log("[DB] Added provider_connections.refresh_token column");
    }
    db.exec(
      "CREATE INDEX IF NOT EXISTS idx_pc_max_concurrent ON provider_connections(provider, max_concurrent)"
    );
    db.exec(
      "CREATE INDEX IF NOT EXISTS idx_pc_auth_active_refresh ON provider_connections(auth_type, is_active, refresh_token)"
    );
    db.exec(
      "CREATE INDEX IF NOT EXISTS idx_pc_provider_auth_type ON provider_connections(provider, auth_type)"
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn("[DB] Failed to verify provider_connections schema:", message);
  }
}
function ensureUsageHistoryAccountIndex(db) {
  try {
    db.exec("CREATE INDEX IF NOT EXISTS idx_uh_account_key ON usage_history(account_key)");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn("[DB] Failed to verify usage_history account index:", message);
  }
}
function ensureUsageHistoryColumns(db) {
  try {
    const columns = db.prepare("PRAGMA table_info(usage_history)").all();
    const columnNames = new Set(columns.map((column) => String(column.name ?? "")));
    if (!columnNames.has("success")) {
      db.exec("ALTER TABLE usage_history ADD COLUMN success INTEGER DEFAULT 1");
      console.log("[DB] Added usage_history.success column");
    }
    if (!columnNames.has("latency_ms")) {
      db.exec("ALTER TABLE usage_history ADD COLUMN latency_ms INTEGER DEFAULT 0");
      console.log("[DB] Added usage_history.latency_ms column");
    }
    if (!columnNames.has("ttft_ms")) {
      db.exec("ALTER TABLE usage_history ADD COLUMN ttft_ms INTEGER DEFAULT 0");
      console.log("[DB] Added usage_history.ttft_ms column");
    }
    if (!columnNames.has("error_code")) {
      db.exec("ALTER TABLE usage_history ADD COLUMN error_code TEXT");
      console.log("[DB] Added usage_history.error_code column");
    }
    if (!columnNames.has("service_tier")) {
      db.exec("ALTER TABLE usage_history ADD COLUMN service_tier TEXT DEFAULT 'standard'");
      console.log("[DB] Added usage_history.service_tier column");
    }
    db.exec("CREATE INDEX IF NOT EXISTS idx_uh_service_tier ON usage_history(service_tier)");
    if (!columnNames.has("combo_strategy")) {
      db.exec("ALTER TABLE usage_history ADD COLUMN combo_strategy TEXT DEFAULT 'direct'");
      console.log("[DB] Added usage_history.combo_strategy column");
    }
    db.exec("CREATE INDEX IF NOT EXISTS idx_uh_combo_strategy ON usage_history(combo_strategy)");
    if (!columnNames.has("account_key")) {
      db.exec("ALTER TABLE usage_history ADD COLUMN account_key TEXT");
      console.log("[DB] Added usage_history.account_key column");
    }
    if (!columnNames.has("account_label")) {
      db.exec("ALTER TABLE usage_history ADD COLUMN account_label TEXT");
      console.log("[DB] Added usage_history.account_label column");
    }
    if (!columnNames.has("account_label_priority")) {
      db.exec("ALTER TABLE usage_history ADD COLUMN account_label_priority INTEGER DEFAULT 0");
      console.log("[DB] Added usage_history.account_label_priority column");
    }
    db.exec(
      "CREATE INDEX IF NOT EXISTS idx_uh_provider_model_timestamp ON usage_history(provider, model, timestamp)"
    );
    db.exec(
      `CREATE INDEX IF NOT EXISTS idx_uh_dedup ON usage_history(
        timestamp,
        COALESCE(provider, ''),
        COALESCE(model, ''),
        COALESCE(connection_id, ''),
        COALESCE(api_key_id, ''),
        tokens_input,
        tokens_output
      )`
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn("[DB] Failed to verify usage_history schema:", message);
  }
}
function ensureCallLogsColumns(db) {
  try {
    const columns = db.prepare("PRAGMA table_info(call_logs)").all();
    const columnNames = new Set(columns.map((column) => String(column.name ?? "")));
    if (!columnNames.has("artifact_relpath")) {
      db.exec("ALTER TABLE call_logs ADD COLUMN artifact_relpath TEXT");
      console.log("[DB] Added call_logs.artifact_relpath column");
    }
    if (!columnNames.has("has_pipeline_details")) {
      db.exec("ALTER TABLE call_logs ADD COLUMN has_pipeline_details INTEGER DEFAULT 0");
      console.log("[DB] Added call_logs.has_pipeline_details column");
    }
    if (!columnNames.has("requested_model")) {
      db.exec("ALTER TABLE call_logs ADD COLUMN requested_model TEXT DEFAULT NULL");
      console.log("[DB] Added call_logs.requested_model column");
    }
    if (!columnNames.has("request_type")) {
      db.exec("ALTER TABLE call_logs ADD COLUMN request_type TEXT DEFAULT NULL");
      console.log("[DB] Added call_logs.request_type column");
    }
    if (!columnNames.has("tokens_cache_read")) {
      db.exec("ALTER TABLE call_logs ADD COLUMN tokens_cache_read INTEGER DEFAULT NULL");
      console.log("[DB] Added call_logs.tokens_cache_read column");
    }
    if (!columnNames.has("tokens_cache_creation")) {
      db.exec("ALTER TABLE call_logs ADD COLUMN tokens_cache_creation INTEGER DEFAULT NULL");
      console.log("[DB] Added call_logs.tokens_cache_creation column");
    }
    if (!columnNames.has("tokens_reasoning")) {
      db.exec("ALTER TABLE call_logs ADD COLUMN tokens_reasoning INTEGER DEFAULT NULL");
      console.log("[DB] Added call_logs.tokens_reasoning column");
    }
    if (!columnNames.has("cache_source")) {
      db.exec("ALTER TABLE call_logs ADD COLUMN cache_source TEXT DEFAULT 'upstream'");
      console.log("[DB] Added call_logs.cache_source column");
    }
    if (!columnNames.has("combo_step_id")) {
      db.exec("ALTER TABLE call_logs ADD COLUMN combo_step_id TEXT DEFAULT NULL");
      console.log("[DB] Added call_logs.combo_step_id column");
    }
    if (!columnNames.has("combo_execution_key")) {
      db.exec("ALTER TABLE call_logs ADD COLUMN combo_execution_key TEXT DEFAULT NULL");
      console.log("[DB] Added call_logs.combo_execution_key column");
    }
    if (!columnNames.has("error_summary")) {
      db.exec("ALTER TABLE call_logs ADD COLUMN error_summary TEXT DEFAULT NULL");
      console.log("[DB] Added call_logs.error_summary column");
    }
    if (!columnNames.has("detail_state")) {
      db.exec("ALTER TABLE call_logs ADD COLUMN detail_state TEXT DEFAULT 'none'");
      console.log("[DB] Added call_logs.detail_state column");
    }
    if (!columnNames.has("artifact_size_bytes")) {
      db.exec("ALTER TABLE call_logs ADD COLUMN artifact_size_bytes INTEGER DEFAULT NULL");
      console.log("[DB] Added call_logs.artifact_size_bytes column");
    }
    if (!columnNames.has("artifact_sha256")) {
      db.exec("ALTER TABLE call_logs ADD COLUMN artifact_sha256 TEXT DEFAULT NULL");
      console.log("[DB] Added call_logs.artifact_sha256 column");
    }
    if (!columnNames.has("has_request_body")) {
      db.exec("ALTER TABLE call_logs ADD COLUMN has_request_body INTEGER DEFAULT 0");
      console.log("[DB] Added call_logs.has_request_body column");
    }
    if (!columnNames.has("has_response_body")) {
      db.exec("ALTER TABLE call_logs ADD COLUMN has_response_body INTEGER DEFAULT 0");
      console.log("[DB] Added call_logs.has_response_body column");
    }
    if (!columnNames.has("request_summary")) {
      db.exec("ALTER TABLE call_logs ADD COLUMN request_summary TEXT DEFAULT NULL");
      console.log("[DB] Added call_logs.request_summary column");
    }
    if (!columnNames.has("correlation_id")) {
      db.exec("ALTER TABLE call_logs ADD COLUMN correlation_id TEXT DEFAULT NULL");
      console.log("[DB] Added call_logs.correlation_id column");
    }
    if (!columnNames.has("model_pinned")) {
      db.exec("ALTER TABLE call_logs ADD COLUMN model_pinned INTEGER DEFAULT 0");
      console.log("[DB] Added call_logs.model_pinned column");
    }
    if (!columnNames.has("session_tag")) {
      db.exec("ALTER TABLE call_logs ADD COLUMN session_tag TEXT DEFAULT NULL");
      console.log("[DB] Added call_logs.session_tag column");
    }
    db.exec(
      "CREATE INDEX IF NOT EXISTS idx_call_logs_requested_model ON call_logs(requested_model)"
    );
    db.exec("CREATE INDEX IF NOT EXISTS idx_call_logs_request_type ON call_logs(request_type)");
    db.exec(
      "CREATE INDEX IF NOT EXISTS idx_cl_combo_target ON call_logs(combo_name, combo_execution_key, timestamp)"
    );
    db.exec("CREATE INDEX IF NOT EXISTS idx_cl_correlation_id ON call_logs(correlation_id)");
    db.exec("CREATE INDEX IF NOT EXISTS idx_cl_session_tag ON call_logs(session_tag)");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn("[DB] Failed to verify call_logs schema:", message);
  }
}
function hasTable2(db, tableName) {
  return Boolean(
    db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName)
  );
}
function quoteIdentifier(identifier) {
  return `"${identifier.replace(/"/g, '""')}"`;
}
function getTableColumns(db, tableName) {
  return db.prepare(`PRAGMA table_info(${quoteIdentifier(tableName)})`).all().map((column) => String(column.name ?? "")).filter((column) => column.length > 0);
}
var init_schemaColumns = __esm({
  "src/lib/db/schemaColumns.ts"() {
  }
});

// src/lib/db/core.ts
import path11 from "path";
import fs13 from "fs";
function isNativeSqliteLoadError(error) {
  const message = error instanceof Error ? error.message : String(error);
  const code = getErrorCode(error);
  return message.includes("Module did not self-register") || message.includes("NODE_MODULE_VERSION") || message.includes("ERR_DLOPEN_FAILED") || // bun and similar runtimes that skip the postinstall script never download
  // the prebuilt *.node binary, so `bindings()` fails with this message
  // before any DLOPEN even happens (#2358).
  message.includes("Could not locate the bindings file") || message.includes("Cannot find module 'better-sqlite3'") || code === "ERR_DLOPEN_FAILED" || code === "MODULE_NOT_FOUND";
}
function isSqliteDriverUnavailableError(error) {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes("Nenhum driver SQLite dispon\xEDvel") || message.includes("Chame ensureDbInitialized() no startup") || message.includes("sql.js WASM ainda n\xE3o foi pr\xE9-inicializado");
}
function getErrorCode(error) {
  if (!error || typeof error !== "object" || !("code" in error)) return void 0;
  const code = error.code;
  return typeof code === "string" ? code : void 0;
}
function closeProbeIfSafe(adapter) {
  if (!adapter || adapter.driver === "sql.js") return;
  if (adapter.open) adapter.close();
}
function openSqliteDatabase(sqliteFile, options) {
  const adapter = tryOpenSync(sqliteFile, options);
  if (adapter) return adapter;
  const sqlJs = getSqlJsAdapter(sqliteFile);
  if (sqlJs) return sqlJs;
  const preInitError = getSqlJsPreInitError(sqliteFile);
  const syncDrivers = process.versions.bun ? "bun:sqlite (failed)" : "better-sqlite3 (failed), node:sqlite (unavailable)";
  if (preInitError) {
    throw new Error(
      `[DB] Nenhum driver SQLite dispon\xEDvel para '${sqliteFile}'. Drivers testados: ${syncDrivers}, sql.js (falhou: ${preInitError}).`
    );
  }
  throw new Error(
    `[DB] Nenhum driver SQLite dispon\xEDvel para '${sqliteFile}'. Chame ensureDbInitialized() no startup. Drivers testados: ${syncDrivers}. sql.js WASM ainda n\xE3o foi pr\xE9-inicializado.`
  );
}
function getDb() {
  return globalThis.__omnirouteDb ?? null;
}
function setDb(db) {
  if (db) {
    globalThis.__omnirouteDb = db;
  } else {
    delete globalThis.__omnirouteDb;
  }
}
function checkpointDb(db, mode = "TRUNCATE") {
  if (isCloud || isBuildPhase || !SQLITE_FILE) return false;
  db.pragma(`wal_checkpoint(${mode})`);
  return true;
}
function summarizePreservedTables(tables) {
  if (tables.length === 0) return "none";
  return tables.map((table) => `${table.table}(${table.rowCount})`).join(", ");
}
function summarizeSkippedTables(tables) {
  if (tables.length === 0) return "none";
  return tables.map((table) => `${table.table}(${table.rowCount}/${table.maxRows}: ${table.reason})`).join(", ");
}
function listProbeFailureBackups(sqliteFile) {
  const directory = path11.dirname(sqliteFile);
  const baseName = path11.basename(sqliteFile);
  const prefix = `${baseName}.probe-failed-`;
  if (!fs13.existsSync(directory)) return [];
  return fs13.readdirSync(directory).filter((name) => name.startsWith(prefix)).map((name) => ({
    path: path11.join(directory, name),
    timestamp: Number(name.slice(prefix.length))
  })).sort((left, right) => {
    const leftTimestamp = Number.isFinite(left.timestamp) ? left.timestamp : 0;
    const rightTimestamp = Number.isFinite(right.timestamp) ? right.timestamp : 0;
    return rightTimestamp - leftTimestamp || right.path.localeCompare(left.path);
  }).map((backup) => backup.path);
}
function captureCriticalDbState(sqliteFile) {
  const snapshot = {
    captureSucceeded: false,
    captureError: null,
    preservedTables: [],
    skippedTables: []
  };
  if (!fs13.existsSync(sqliteFile)) {
    snapshot.captureSucceeded = true;
    return snapshot;
  }
  let probe = null;
  try {
    probe = openSqliteDatabase(sqliteFile, { readonly: true });
    for (const tableSpec of CRITICAL_DB_TABLES) {
      if (!hasTable2(probe, tableSpec.table)) continue;
      const maxRows = tableSpec.maxRows ?? DEFAULT_CRITICAL_TABLE_ROW_LIMIT;
      const rows = tableSpec.readRows?.(probe) ?? probe.prepare(`SELECT * FROM ${quoteIdentifier(tableSpec.table)}`).all();
      const rowCount = rows.length;
      if (rowCount === 0) continue;
      if (rowCount > maxRows) {
        snapshot.skippedTables.push({
          table: tableSpec.table,
          rowCount,
          maxRows,
          reason: "row_limit_exceeded"
        });
        continue;
      }
      snapshot.preservedTables.push({
        table: tableSpec.table,
        rowCount,
        maxRows,
        columns: getTableColumns(probe, tableSpec.table),
        rows
      });
    }
    snapshot.captureSucceeded = true;
    return snapshot;
  } catch (error) {
    snapshot.captureError = error instanceof Error ? error.message : String(error);
    return snapshot;
  } finally {
    try {
      closeProbeIfSafe(probe);
    } catch {
    }
  }
}
function restoreCriticalDbState(db, snapshot) {
  const restoredTables = [];
  const restore = db.transaction(() => {
    for (const table of snapshot.preservedTables) {
      if (table.rows.length === 0) continue;
      if (!hasTable2(db, table.table)) {
        throw new Error(`Current schema is missing preserved table "${table.table}"`);
      }
      const currentColumns = new Set(getTableColumns(db, table.table));
      const restoreColumns = table.columns.filter((column) => currentColumns.has(column));
      if (restoreColumns.length === 0) {
        throw new Error(`No compatible columns remain for preserved table "${table.table}"`);
      }
      const sql = `INSERT OR REPLACE INTO ${quoteIdentifier(table.table)} (${restoreColumns.map((column) => quoteIdentifier(column)).join(", ")}) VALUES (${restoreColumns.map(() => "?").join(", ")})`;
      const insert = db.prepare(sql);
      for (const row of table.rows) {
        insert.run(...restoreColumns.map((column) => row[column] ?? null));
      }
      restoredTables.push(table);
    }
  });
  restore();
  return restoredTables;
}
function cleanupRecreatedSqliteFiles(sqliteFile) {
  for (const filePath of [
    sqliteFile,
    `${sqliteFile}-wal`,
    `${sqliteFile}-shm`,
    `${sqliteFile}-journal`
  ]) {
    try {
      if (fs13.existsSync(filePath)) fs13.unlinkSync(filePath);
    } catch {
    }
  }
}
function parseLegacyError(value) {
  if (typeof value !== "string" || value.trim().length === 0) return null;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
function offloadLegacyCallLogDetails(db) {
  if (!hasTable2(db, "call_logs_v1_legacy")) return;
  const pendingRows = db.prepare(
    `
      SELECT legacy.*
      FROM call_logs_v1_legacy AS legacy
      JOIN call_logs AS current ON current.id = legacy.id
      WHERE current.detail_state = 'legacy-inline'
      ORDER BY legacy.timestamp ASC
    `
  ).all();
  if (pendingRows.length === 0) {
    db.exec("DROP TABLE IF EXISTS call_logs_v1_legacy");
    return;
  }
  const updateStmt = db.prepare(`
    UPDATE call_logs
    SET artifact_relpath = @artifactRelPath,
        artifact_size_bytes = @artifactSizeBytes,
        artifact_sha256 = @artifactSha256,
        detail_state = 'ready'
    WHERE id = @id
  `);
  const markMissingStmt = db.prepare(`
    UPDATE call_logs
    SET detail_state = 'missing',
        artifact_relpath = NULL,
        artifact_size_bytes = NULL,
        artifact_sha256 = NULL
    WHERE id = ?
  `);
  let failed = 0;
  const tx = db.transaction(() => {
    for (const row of pendingRows) {
      const artifact = {
        schemaVersion: 5,
        summary: {
          id: row.id,
          timestamp: row.timestamp || (/* @__PURE__ */ new Date()).toISOString(),
          method: row.method || "POST",
          path: row.path || "/v1/chat/completions",
          status: row.status || 0,
          model: row.model || "-",
          requestedModel: row.requested_model || null,
          provider: row.provider || "-",
          account: row.account || "-",
          connectionId: row.connection_id || null,
          duration: row.duration || 0,
          tokens: {
            in: row.tokens_in || 0,
            out: row.tokens_out || 0,
            cacheRead: row.tokens_cache_read ?? null,
            cacheWrite: row.tokens_cache_creation ?? null,
            reasoning: row.tokens_reasoning ?? null,
            compressed: row.tokens_compressed ?? null
          },
          requestType: row.request_type || null,
          sourceFormat: row.source_format || null,
          targetFormat: row.target_format || null,
          apiKeyId: row.api_key_id || null,
          apiKeyName: row.api_key_name || null,
          comboName: row.combo_name || null,
          comboStepId: row.combo_step_id || null,
          comboExecutionKey: row.combo_execution_key || null
        },
        requestBody: parseStoredPayload(row.request_body),
        responseBody: parseStoredPayload(row.response_body),
        error: parseLegacyError(row.error)
      };
      const artifactResult = writeCallArtifact(
        artifact,
        buildArtifactRelativePath(artifact.summary.timestamp, artifact.summary.id)
      );
      if (!artifactResult) {
        failed++;
        markMissingStmt.run(row.id);
        continue;
      }
      updateStmt.run({
        id: row.id,
        artifactRelPath: artifactResult.relPath,
        artifactSizeBytes: artifactResult.sizeBytes,
        artifactSha256: artifactResult.sha256
      });
    }
  });
  tx();
  if (failed > 0) {
    console.warn(
      `[DB] Kept call_logs_v1_legacy after partial call log offload (${failed} failed row(s)).`
    );
    return;
  }
  db.exec("DROP TABLE IF EXISTS call_logs_v1_legacy");
  try {
    db.pragma("wal_checkpoint(TRUNCATE)");
    db.exec("VACUUM");
    console.log(`[DB] Offloaded ${pendingRows.length} legacy call log detail row(s) to artifacts.`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn("[DB] Legacy call log compaction finished without VACUUM:", message);
  }
}
function shouldRunStartupDbHealthCheck() {
  if (process.env.OMNIROUTE_FORCE_DB_HEALTHCHECK === "1") return true;
  return !isAutomatedTestProcess();
}
function createManagedDbBackup(db, reason) {
  const isTest = isAutomatedTestProcess();
  if (isTest) return false;
  try {
    const backupDir = DB_BACKUPS_DIR || path11.join(DATA_DIR, "db_backups");
    if (!fs13.existsSync(backupDir)) {
      fs13.mkdirSync(backupDir, { recursive: true });
    }
    const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
    const backupPath = path11.join(backupDir, `db_${timestamp}_${reason}.sqlite`);
    const escapedBackupPath = backupPath.replace(/'/g, "''");
    db.exec(`VACUUM INTO '${escapedBackupPath}'`);
    console.log(`[DB] Backup created (${reason}): ${backupPath}`);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[DB] Failed to create ${reason} backup:`, message);
    return false;
  }
}
function createHealthCheckBackup(db) {
  return createManagedDbBackup(db, "health-check-repair");
}
function autoMigrateLegacyEncryptedConnections(db) {
  const rows = db.prepare("SELECT * FROM provider_connections").all();
  const updateStmt = db.prepare(
    "UPDATE provider_connections SET api_key = @apiKey, id_token = @idToken, access_token = @accessToken, refresh_token = @refreshToken, updated_at = @updatedAt WHERE id = @id"
  );
  const encryptedFields = ["apiKey", "idToken", "accessToken", "refreshToken"];
  let migratedCount = 0;
  let backupCreated = false;
  for (const row of rows) {
    const camelRow = rowToCamel(row);
    if (!camelRow) continue;
    let updatedRow = false;
    for (const field of encryptedFields) {
      if (typeof camelRow[field] !== "string") continue;
      const { updated, value } = migrateLegacyEncryptedString(camelRow[field]);
      if (updated) {
        camelRow[field] = value;
        updatedRow = true;
      }
    }
    if (!updatedRow) continue;
    if (!backupCreated) {
      createManagedDbBackup(db, "legacy-encryption-migration");
      backupCreated = true;
    }
    updateStmt.run({
      id: camelRow.id,
      apiKey: camelRow.apiKey ?? null,
      idToken: camelRow.idToken ?? null,
      accessToken: camelRow.accessToken ?? null,
      refreshToken: camelRow.refreshToken ?? null,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    migratedCount++;
  }
  if (migratedCount > 0) {
    invalidateDbCache("connections");
    console.log(`[DB] Auto-migrated ${migratedCount} connection(s) to new static-salt encryption.`);
  }
  return migratedCount;
}
function getDbHealthCheckIntervalMs() {
  const rawValue = process.env.OMNIROUTE_DB_HEALTHCHECK_INTERVAL_MS;
  if (typeof rawValue === "string" && rawValue.trim().length > 0) {
    const parsed = Number(rawValue);
    if (Number.isFinite(parsed) && parsed >= 0) {
      return parsed;
    }
  }
  return 6 * 60 * 60 * 1e3;
}
function clearDbHealthCheckScheduler() {
  if (dbHealthCheckTimer) {
    clearInterval(dbHealthCheckTimer);
    dbHealthCheckTimer = null;
  }
}
function startDbHealthCheckScheduler(db) {
  clearDbHealthCheckScheduler();
  if (isCloud || isBuildPhase || isAutomatedTestProcess()) return;
  const intervalMs = getDbHealthCheckIntervalMs();
  if (intervalMs <= 0) return;
  dbHealthCheckTimer = setInterval(() => {
    try {
      if (!db.open) return;
      runDbHealthCheck(db, {
        autoRepair: true,
        skipIntegrityCheck: process.env.OMNIROUTE_SKIP_DB_HEALTHCHECK === "1",
        expectedSchemaVersion: "1",
        createBackupBeforeRepair: () => createHealthCheckBackup(db)
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn("[DB] Periodic health-check failed:", message);
    }
  }, intervalMs);
  dbHealthCheckTimer.unref?.();
}
function getWalTruncateIntervalMs() {
  const rawValue = process.env.OMNIROUTE_WAL_TRUNCATE_INTERVAL_MS;
  if (typeof rawValue === "string" && rawValue.trim().length > 0) {
    const parsed = Number(rawValue);
    if (Number.isFinite(parsed) && parsed >= 0) {
      return parsed;
    }
  }
  return 6 * 60 * 60 * 1e3;
}
function clearWalTruncateScheduler() {
  if (walTruncateTimer) {
    clearInterval(walTruncateTimer);
    walTruncateTimer = null;
  }
}
function startWalTruncateScheduler(db) {
  clearWalTruncateScheduler();
  if (isCloud || isBuildPhase || isAutomatedTestProcess()) return;
  const intervalMs = getWalTruncateIntervalMs();
  if (intervalMs <= 0) return;
  walTruncateTimer = setInterval(() => {
    try {
      if (!db.open) return;
      if (checkpointDb(db, "TRUNCATE")) {
        console.log("[DB] Periodic SQLite WAL checkpoint completed (TRUNCATE).");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn("[DB] Periodic WAL truncate failed:", message);
    }
  }, intervalMs);
  walTruncateTimer.unref?.();
}
function getDbInstance() {
  const existing = getDb();
  if (existing) return existing;
  if (isCloud || isBuildPhase) {
    if (isBuildPhase) {
      console.log("[DB] Build phase detected \u2014 using no-op SQLite stub (never queried)");
      const noopStatement = {
        run: () => ({ changes: 0, lastInsertRowid: 0 }),
        get: () => void 0,
        all: () => []
      };
      const stubDb = {
        driver: "sql.js",
        open: true,
        name: ":memory:",
        prepare: () => noopStatement,
        exec: () => {
        },
        pragma: () => void 0,
        transaction: (fn) => fn,
        immediate: (fn) => fn(),
        backup: async () => {
        },
        checkpoint: () => {
        },
        close: () => {
        },
        raw: null
      };
      setDb(stubDb);
      return stubDb;
    }
    const memoryDb = openSqliteDatabase(":memory:");
    memoryDb.pragma("journal_mode = WAL");
    memoryDb.exec(SCHEMA_SQL);
    ensureUsageHistoryColumns(memoryDb);
    ensureUsageHistoryAccountIndex(memoryDb);
    ensureCallLogsColumns(memoryDb);
    ensureProviderConnectionsColumns(memoryDb);
    setDb(memoryDb);
    return memoryDb;
  }
  const sqliteFile = SQLITE_FILE;
  if (!sqliteFile) {
    throw new Error("SQLITE_FILE is unavailable for local mode");
  }
  const jsonDbFile = JSON_DB_FILE;
  const probeFailureBackups = listProbeFailureBackups(sqliteFile);
  if (!fs13.existsSync(sqliteFile) && probeFailureBackups.length > 0) {
    if ((globalThis.__omnirouteDbProbeRestoreCount = (globalThis.__omnirouteDbProbeRestoreCount || 0) + 1) > 3) {
      throw new Error(
        `[DB] Aborting startup: probe-failed/restore loop detected after 3 attempts. The preserved database at ${path11.dirname(sqliteFile)} is unloadable under this runtime. Remove the probe-failed backups (storage.sqlite.probe-failed-*) from ${path11.dirname(
          sqliteFile
        )} and restart, or restore the database from a known-good backup.`
      );
    }
    const latestBackup = probeFailureBackups[0];
    try {
      fs13.renameSync(latestBackup, sqliteFile);
      console.log(
        `[DB] Auto-restored preserved database from previous probe failure: ${path11.basename(latestBackup)}`
      );
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      throw new Error(
        `[DB] Manual recovery required before startup. Failed to auto-restore preserved database ${latestBackup}: ${msg}. Restore the preserved file or another backup to ${sqliteFile} before restarting.`
      );
    }
  }
  let preservedCriticalState = {
    captureSucceeded: true,
    captureError: null,
    preservedTables: [],
    skippedTables: []
  };
  let failedProbePath = null;
  let failedProbeMessage = null;
  let isNewDb = !fs13.existsSync(sqliteFile);
  if (fs13.existsSync(sqliteFile)) {
    try {
      const probe = openSqliteDatabase(sqliteFile, { readonly: true });
      const probeHasProviderConnections = !!probe.prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='provider_connections'"
      ).get();
      const probeHasCombos = !!probe.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='combos'").get();
      if (probeHasProviderConnections && !probeHasCombos) {
        isNewDb = true;
      }
      const hasOldSchema = probe.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='schema_migrations'").get();
      if (hasOldSchema) {
        let hasData = false;
        try {
          const count2 = probe.prepare("SELECT COUNT(*) as c FROM provider_connections").get();
          hasData = Boolean(count2 && count2.c > 0);
        } catch {
        }
        closeProbeIfSafe(probe);
        if (hasData) {
          console.log(
            `[DB] Old schema_migrations table found but data exists \u2014 preserving data (#146)`
          );
          const fixDb = openSqliteDatabase(sqliteFile);
          try {
            fixDb.exec("DROP TABLE IF EXISTS schema_migrations");
            fixDb.pragma("wal_checkpoint(TRUNCATE)");
          } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            console.warn("[DB] Could not clean up old schema table:", message);
          } finally {
            closeProbeIfSafe(fixDb);
          }
        } else {
          const oldPath = sqliteFile + ".old-schema";
          console.log(
            `[DB] Old incompatible schema detected (empty) \u2014 renaming to ${path11.basename(oldPath)}`
          );
          fs13.renameSync(sqliteFile, oldPath);
          for (const ext of ["-wal", "-shm"]) {
            try {
              if (fs13.existsSync(sqliteFile + ext)) fs13.unlinkSync(sqliteFile + ext);
            } catch {
            }
          }
        }
      } else {
        closeProbeIfSafe(probe);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      console.warn("[DB] Could not probe existing DB:", message);
      if (isNativeSqliteLoadError(e) || isSqliteDriverUnavailableError(e) || message.includes("could not be found")) {
        throw e;
      }
      if (/out of memory|allocation failure|Array buffer allocation failed|allocation failed/i.test(
        message
      )) {
        if ((globalThis.__omnirouteDbOomFailureCount = (globalThis.__omnirouteDbOomFailureCount || 0) + 1) > 3) {
          throw new Error(
            `[DB] Aborting startup: persistent out-of-memory probing ${sqliteFile} after 3 attempts. Increase the V8 heap with NODE_OPTIONS=--max-old-space-size=4096 (or higher) \u2014 the current heap is insufficient for this database \u2014 and restart, or shrink/restore the database from a backup. Original error: ${message}`
          );
        }
        throw new Error(
          `[DB] Out of memory while probing ${sqliteFile}. The bundled sql.js driver loads the entire file into WASM memory; increase the V8 heap with NODE_OPTIONS=--max-old-space-size=4096 (or higher) and restart, or restore the database from a backup. Original error: ${message}`
        );
      }
      if (!retryProbeIfTransient(sqliteFile, e, openSqliteDatabase, closeProbeIfSafe)) {
        preservedCriticalState = captureCriticalDbState(sqliteFile);
        const failedPath = sqliteFile + `.probe-failed-${Date.now()}`;
        try {
          fs13.renameSync(sqliteFile, failedPath);
          console.warn(`[DB] Renamed corrupt DB to ${path11.basename(failedPath)}`);
          failedProbePath = failedPath;
          failedProbeMessage = message;
        } catch {
        }
      }
    }
  }
  if (failedProbePath) {
    const hasUnsafeSkippedTables = preservedCriticalState.skippedTables.length > 0;
    const missingSnapshot = !preservedCriticalState.captureSucceeded;
    if (hasUnsafeSkippedTables || missingSnapshot) {
      const details = missingSnapshot ? `snapshot_failed=${preservedCriticalState.captureError || "unknown"}` : `skipped_tables=${summarizeSkippedTables(preservedCriticalState.skippedTables)}`;
      throw new Error(
        `[DB] Manual recovery required after probe failure. Preserved database: ${failedProbePath}. Automatic recovery was aborted because ${details}. Original probe error: ${failedProbeMessage || "unknown"}.`
      );
    }
  }
  const db = openSqliteDatabase(sqliteFile);
  db.pragma("journal_mode = WAL");
  db.pragma("busy_timeout = 2000");
  db.pragma("synchronous = NORMAL");
  db.pragma(`cache_size = -${DEFAULT_DATABASE_SETTINGS.optimization.cacheSize}`);
  db.pragma("temp_store = MEMORY");
  db.exec(SCHEMA_SQL);
  ensureProviderConnectionsColumns(db);
  ensureUsageHistoryColumns(db);
  ensureCallLogsColumns(db);
  db.exec(`
    CREATE TABLE IF NOT EXISTS _omniroute_migrations (
      version TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    INSERT OR IGNORE INTO _omniroute_migrations (version, name)
    VALUES ('001', 'initial_schema');
  `);
  runMigrations(db, { isNewDb });
  ensureUsageHistoryAccountIndex(db);
  applyStoredDatabaseOptimizationSettings(db);
  try {
    const mmapRow = db.prepare("SELECT value FROM key_value WHERE namespace = ? AND key = ?").get("databaseSettings", "mmapSize");
    const mmapSize = mmapRow ? Math.max(0, parseInt(mmapRow.value, 10) || 0) : 268435456;
    if (mmapSize > 0) {
      db.pragma(`mmap_size = ${mmapSize}`);
    }
  } catch {
  }
  offloadLegacyCallLogDetails(db);
  if (jsonDbFile && fs13.existsSync(jsonDbFile)) {
    migrateFromJson(db, jsonDbFile);
  }
  if (failedProbePath && preservedCriticalState.preservedTables.length > 0) {
    try {
      const restoredTables = restoreCriticalDbState(db, preservedCriticalState);
      console.log(
        `[DB] Restored preserved critical DB state after probe failure: ${summarizePreservedTables(
          restoredTables
        )}`
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      try {
        closeProbeIfSafe(db);
      } catch {
      }
      cleanupRecreatedSqliteFiles(sqliteFile);
      throw new Error(
        `[DB] Automatic recovery aborted after probe failure. Preserved database: ${failedProbePath}. Restore failure: ${message}.`
      );
    }
  }
  const versionStmt = db.prepare(
    "INSERT OR REPLACE INTO db_meta (key, value) VALUES ('schema_version', '1')"
  );
  versionStmt.run();
  if (shouldRunStartupDbHealthCheck()) {
    const skipIntegrityCheck = process.env.OMNIROUTE_SKIP_DB_HEALTHCHECK === "1";
    if (skipIntegrityCheck) {
      console.log("[DB] Health check skipped (OMNIROUTE_SKIP_DB_HEALTHCHECK=1)");
    }
    runDbHealthCheck(db, {
      autoRepair: true,
      expectedSchemaVersion: "1",
      skipIntegrityCheck,
      createBackupBeforeRepair: () => createHealthCheckBackup(db)
    });
  }
  setDb(db);
  try {
    autoMigrateLegacyEncryptedConnections(db);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[DB] Legacy encryption migration failed: ${message}`);
  }
  startDbHealthCheckScheduler(db);
  startWalTruncateScheduler(db);
  console.log(
    `[DB] SQLite database ready: ${sqliteFile} (DATA_DIR=${path11.resolve(DATA_DIR)}, SQLITE_FILE=${path11.resolve(sqliteFile)})`
  );
  return db;
}
function migrateFromJson(db, jsonPath) {
  try {
    const raw = fs13.readFileSync(jsonPath, "utf-8");
    const data = JSON.parse(raw);
    const connCount = (data.providerConnections || []).length;
    const nodeCount = (data.providerNodes || []).length;
    const keyCount = (data.apiKeys || []).length;
    if (connCount === 0 && nodeCount === 0 && keyCount === 0) {
      console.log("[DB] db.json has no data to migrate, skipping");
      fs13.renameSync(jsonPath, jsonPath + ".empty");
      return;
    }
    console.log(
      `[DB] Migrating db.json \u2192 SQLite (${connCount} connections, ${nodeCount} nodes, ${keyCount} keys)...`
    );
    const migrate = db.transaction(() => {
      const insertConn = db.prepare(`
        INSERT OR REPLACE INTO provider_connections (
          id, provider, auth_type, name, email, priority, is_active,
          access_token, refresh_token, expires_at, token_expires_at,
          scope, project_id, test_status, error_code, last_error,
          last_error_at, last_error_type, last_error_source, backoff_level,
          rate_limited_until, health_check_interval, last_health_check_at,
          last_tested, api_key, id_token, provider_specific_data,
          expires_in, display_name, global_priority, default_model,
          token_type, consecutive_use_count, rate_limit_protection, last_used_at, created_at, updated_at
        ) VALUES (
          @id, @provider, @authType, @name, @email, @priority, @isActive,
          @accessToken, @refreshToken, @expiresAt, @tokenExpiresAt,
          @scope, @projectId, @testStatus, @errorCode, @lastError,
          @lastErrorAt, @lastErrorType, @lastErrorSource, @backoffLevel,
          @rateLimitedUntil, @healthCheckInterval, @lastHealthCheckAt,
          @lastTested, @apiKey, @idToken, @providerSpecificData,
          @expiresIn, @displayName, @globalPriority, @defaultModel,
          @tokenType, @consecutiveUseCount, @rateLimitProtection, @lastUsedAt, @createdAt, @updatedAt
        )
      `);
      for (const conn of data.providerConnections || []) {
        insertConn.run({
          id: conn.id,
          provider: conn.provider,
          authType: conn.authType || "oauth",
          name: conn.name || null,
          email: conn.email || null,
          priority: conn.priority || 0,
          isActive: conn.isActive === false ? 0 : 1,
          accessToken: conn.accessToken || null,
          refreshToken: conn.refreshToken || null,
          expiresAt: conn.expiresAt || null,
          tokenExpiresAt: conn.tokenExpiresAt || null,
          scope: conn.scope || null,
          projectId: conn.projectId || null,
          testStatus: conn.testStatus || null,
          errorCode: conn.errorCode || null,
          lastError: conn.lastError || null,
          lastErrorAt: conn.lastErrorAt || null,
          lastErrorType: conn.lastErrorType || null,
          lastErrorSource: conn.lastErrorSource || null,
          backoffLevel: conn.backoffLevel || 0,
          rateLimitedUntil: conn.rateLimitedUntil || null,
          healthCheckInterval: conn.healthCheckInterval || null,
          lastHealthCheckAt: conn.lastHealthCheckAt || null,
          lastTested: conn.lastTested || null,
          apiKey: conn.apiKey || null,
          idToken: conn.idToken || null,
          providerSpecificData: conn.providerSpecificData ? JSON.stringify(conn.providerSpecificData) : null,
          expiresIn: conn.expiresIn || null,
          displayName: conn.displayName || null,
          globalPriority: conn.globalPriority || null,
          defaultModel: conn.defaultModel || null,
          tokenType: conn.tokenType || null,
          consecutiveUseCount: conn.consecutiveUseCount || 0,
          lastUsedAt: conn.lastUsedAt || null,
          rateLimitProtection: conn.rateLimitProtection === true || conn.rateLimitProtection === 1 ? 1 : 0,
          createdAt: conn.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
          updatedAt: conn.updatedAt || (/* @__PURE__ */ new Date()).toISOString()
        });
      }
      const insertNode = db.prepare(`
        INSERT OR REPLACE INTO provider_nodes (id, type, name, prefix, api_type, base_url, created_at, updated_at)
        VALUES (@id, @type, @name, @prefix, @apiType, @baseUrl, @createdAt, @updatedAt)
      `);
      for (const node of data.providerNodes || []) {
        insertNode.run({
          id: node.id,
          type: node.type,
          name: node.name,
          prefix: node.prefix || null,
          apiType: node.apiType || null,
          baseUrl: node.baseUrl || null,
          createdAt: node.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
          updatedAt: node.updatedAt || (/* @__PURE__ */ new Date()).toISOString()
        });
      }
      const insertKv = db.prepare(
        "INSERT OR REPLACE INTO key_value (namespace, key, value) VALUES (?, ?, ?)"
      );
      for (const [alias, model] of Object.entries(data.modelAliases || {})) {
        insertKv.run("modelAliases", alias, JSON.stringify(model));
      }
      for (const [toolName, mappings] of Object.entries(data.mitmAlias || {})) {
        insertKv.run("mitmAlias", toolName, JSON.stringify(mappings));
      }
      for (const [key, value] of Object.entries(data.settings || {})) {
        insertKv.run("settings", key, JSON.stringify(value));
      }
      for (const [provider, models] of Object.entries(data.pricing || {})) {
        insertKv.run("pricing", provider, JSON.stringify(models));
      }
      for (const [providerId, models] of Object.entries(data.customModels || {})) {
        insertKv.run("customModels", providerId, JSON.stringify(models));
      }
      if (data.proxyConfig) {
        insertKv.run("proxyConfig", "global", JSON.stringify(data.proxyConfig.global || null));
        insertKv.run("proxyConfig", "providers", JSON.stringify(data.proxyConfig.providers || {}));
        insertKv.run("proxyConfig", "combos", JSON.stringify(data.proxyConfig.combos || {}));
        insertKv.run("proxyConfig", "keys", JSON.stringify(data.proxyConfig.keys || {}));
      }
      const insertCombo = db.prepare(`
        INSERT OR REPLACE INTO combos (id, name, data, sort_order, created_at, updated_at)
        VALUES (@id, @name, @data, @sortOrder, @createdAt, @updatedAt)
      `);
      for (const [index, combo] of (data.combos || []).entries()) {
        const normalizedCombo = {
          ...combo,
          sortOrder: typeof combo.sortOrder === "number" ? combo.sortOrder : index + 1
        };
        insertCombo.run({
          id: normalizedCombo.id,
          name: normalizedCombo.name,
          data: JSON.stringify(normalizedCombo),
          sortOrder: normalizedCombo.sortOrder,
          createdAt: normalizedCombo.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
          updatedAt: normalizedCombo.updatedAt || (/* @__PURE__ */ new Date()).toISOString()
        });
      }
      const insertKey = db.prepare(`
        INSERT OR REPLACE INTO api_keys (id, name, key, machine_id, model_access_mode, allowed_models, no_log, created_at)
        VALUES (@id, @name, @key, @machineId, @modelAccessMode, @allowedModels, @noLog, @createdAt)
      `);
      for (const apiKey of data.apiKeys || []) {
        insertKey.run({
          id: apiKey.id,
          name: apiKey.name,
          key: apiKey.key,
          machineId: apiKey.machineId || null,
          modelAccessMode: parseModelAccessMode(apiKey.modelAccessMode, apiKey.allowedModels),
          allowedModels: JSON.stringify(apiKey.allowedModels || []),
          noLog: apiKey.noLog ? 1 : 0,
          createdAt: apiKey.createdAt || (/* @__PURE__ */ new Date()).toISOString()
        });
      }
    });
    migrate();
    const migratedPath = jsonPath + ".migrated";
    fs13.renameSync(jsonPath, migratedPath);
    console.log(`[DB] \u2713 Migration complete. Original saved as ${migratedPath}`);
    const legacyBackupDir = path11.join(DATA_DIR, "db_backups");
    if (fs13.existsSync(legacyBackupDir)) {
      const jsonBackups = fs13.readdirSync(legacyBackupDir).filter((f) => f.endsWith(".json"));
      if (jsonBackups.length > 0) {
        console.log(
          `[DB] Note: ${jsonBackups.length} legacy .json backups remain in ${legacyBackupDir}`
        );
      }
    }
  } catch (err) {
    console.error("[DB] Migration from db.json failed:", err.message);
  }
}
var isCloud, isBuildPhase, DATA_DIR, LEGACY_DATA_DIR, SQLITE_FILE, JSON_DB_FILE, DB_BACKUPS_DIR, DEFAULT_CRITICAL_TABLE_ROW_LIMIT, SKIP_PRESERVE_NAMESPACES, CRITICAL_DB_TABLES, SCHEMA_SQL, dbHealthCheckTimer, walTruncateTimer;
var init_core = __esm({
  "src/lib/db/core.ts"() {
    init_driverFactory();
    init_probeUtils();
    init_dataPaths();
    init_buildPhase();
    init_migrationRunner();
    init_healthCheck();
    init_stateReset();
    init_logPayloads();
    init_databaseSettings();
    init_optimizationSettings();
    init_callLogArtifacts();
    init_encryption();
    init_readCache();
    init_caseMapping();
    init_testProcess();
    init_modelAccessMode();
    init_caseMapping();
    init_schemaColumns();
    isCloud = typeof globalThis.caches === "object" && globalThis.caches !== null;
    isBuildPhase = isNextBuildPhase();
    DATA_DIR = resolveWritableDataDir({ isCloud });
    LEGACY_DATA_DIR = isCloud ? null : getLegacyDotDataDir();
    SQLITE_FILE = isCloud ? null : path11.join(DATA_DIR, "storage.sqlite");
    JSON_DB_FILE = isCloud ? null : path11.join(DATA_DIR, "db.json");
    DB_BACKUPS_DIR = isCloud ? null : path11.join(DATA_DIR, "db_backups");
    DEFAULT_CRITICAL_TABLE_ROW_LIMIT = 1e4;
    SKIP_PRESERVE_NAMESPACES = /* @__PURE__ */ new Set([
      "syncedAvailableModels",
      "providerLimitsCache",
      "lkgp",
      "gemini_thought_signatures"
    ]);
    CRITICAL_DB_TABLES = [
      {
        table: "key_value",
        maxRows: 1e4,
        readRows(db) {
          return (db.prepare("SELECT namespace, key, value FROM key_value").all() ?? []).filter(
            (row) => typeof row.namespace !== "string" || !SKIP_PRESERVE_NAMESPACES.has(row.namespace)
          );
        }
      },
      { table: "provider_connections", maxRows: 5e3 },
      { table: "provider_nodes", maxRows: 5e3 },
      { table: "combos", maxRows: 5e3 },
      { table: "api_keys", maxRows: 5e3 },
      { table: "proxy_registry", maxRows: 5e3 },
      { table: "proxy_assignments", maxRows: 1e4 },
      { table: "model_combo_mappings", maxRows: 5e3 },
      { table: "sync_tokens", maxRows: 5e3 },
      { table: "registered_keys", maxRows: 1e4 },
      { table: "provider_key_limits", maxRows: 1e4 },
      { table: "account_key_limits", maxRows: 1e4 },
      { table: "upstream_proxy_config", maxRows: 5e3 },
      { table: "webhooks", maxRows: 5e3 }
    ];
    if (!isCloud && !fs13.existsSync(DATA_DIR)) {
      try {
        fs13.mkdirSync(DATA_DIR, { recursive: true });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(
          `[DB] Cannot create data directory '${DATA_DIR}': ${msg}
[DB] Set the DATA_DIR environment variable to a writable path, e.g.:
[DB]   DATA_DIR=/path/to/writable/dir omniroute`
        );
      }
    }
    SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS provider_connections (
    id TEXT PRIMARY KEY,
    provider TEXT NOT NULL,
    auth_type TEXT,
    name TEXT,
    email TEXT,
    priority INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    access_token TEXT,
    refresh_token TEXT,
    expires_at TEXT,
    token_expires_at TEXT,
    scope TEXT,
    project_id TEXT,
    test_status TEXT,
    error_code TEXT,
    last_error TEXT,
    last_error_at TEXT,
    last_error_type TEXT,
    last_error_source TEXT,
    backoff_level INTEGER DEFAULT 0,
    rate_limited_until TEXT,
    health_check_interval INTEGER,
    last_health_check_at TEXT,
    last_tested TEXT,
    api_key TEXT,
    id_token TEXT,
    provider_specific_data TEXT,
    expires_in INTEGER,
    display_name TEXT,
    global_priority INTEGER,
    default_model TEXT,
    token_type TEXT,
    consecutive_use_count INTEGER DEFAULT 0,
    rate_limit_protection INTEGER DEFAULT 0,
    last_used_at TEXT,
    "group" TEXT,
    max_concurrent INTEGER,
    proxy_enabled INTEGER NOT NULL DEFAULT 1,
    per_key_proxy_enabled INTEGER NOT NULL DEFAULT 0,
    quota_visible INTEGER NOT NULL DEFAULT 1,
    quota_window_thresholds_json TEXT,
    rate_limit_overrides_json TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_pc_provider ON provider_connections(provider);
  CREATE INDEX IF NOT EXISTS idx_pc_active ON provider_connections(is_active);
  CREATE INDEX IF NOT EXISTS idx_pc_priority ON provider_connections(provider, priority);

  CREATE TABLE IF NOT EXISTS provider_nodes (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    prefix TEXT,
    api_type TEXT,
    base_url TEXT,
    chat_path TEXT,
    models_path TEXT,
    custom_headers_json TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS key_value (
    namespace TEXT NOT NULL,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    PRIMARY KEY (namespace, key)
  );

  CREATE TABLE IF NOT EXISTS combos (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    data TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS api_keys (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    key TEXT NOT NULL UNIQUE,
    machine_id TEXT,
    allowed_models TEXT DEFAULT '[]',
    no_log INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_ak_key ON api_keys(key);

  CREATE TABLE IF NOT EXISTS db_meta (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS usage_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    provider TEXT,
    model TEXT,
    connection_id TEXT,
    account_key TEXT,
    account_label TEXT,
    account_label_priority INTEGER DEFAULT 0,
    api_key_id TEXT,
    api_key_name TEXT,
    tokens_input INTEGER DEFAULT 0,
    tokens_output INTEGER DEFAULT 0,
    tokens_cache_read INTEGER DEFAULT 0,
    tokens_cache_creation INTEGER DEFAULT 0,
    tokens_reasoning INTEGER DEFAULT 0,
    service_tier TEXT DEFAULT 'standard',
    status TEXT,
    success INTEGER DEFAULT 1,
    latency_ms INTEGER DEFAULT 0,
    ttft_ms INTEGER DEFAULT 0,
    error_code TEXT,
    timestamp TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_uh_timestamp ON usage_history(timestamp);
  CREATE INDEX IF NOT EXISTS idx_uh_provider ON usage_history(provider);
  CREATE INDEX IF NOT EXISTS idx_uh_model ON usage_history(model);

  CREATE TABLE IF NOT EXISTS call_logs (
    id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    method TEXT,
    path TEXT,
    status INTEGER,
    model TEXT,
    requested_model TEXT,
    provider TEXT,
    account TEXT,
    connection_id TEXT,
    duration INTEGER DEFAULT 0,
    tokens_in INTEGER DEFAULT 0,
    tokens_out INTEGER DEFAULT 0,
    tokens_cache_read INTEGER DEFAULT NULL,
    tokens_cache_creation INTEGER DEFAULT NULL,
    tokens_reasoning INTEGER DEFAULT NULL,
    tokens_compressed INTEGER DEFAULT NULL,
    cache_source TEXT DEFAULT "upstream",
    request_type TEXT,
    source_format TEXT,
    target_format TEXT,
    api_key_id TEXT,
    api_key_name TEXT,
    combo_name TEXT,
    combo_step_id TEXT,
    combo_execution_key TEXT,
    error_summary TEXT,
    detail_state TEXT DEFAULT 'none',
    artifact_relpath TEXT,
    artifact_size_bytes INTEGER DEFAULT NULL,
    artifact_sha256 TEXT DEFAULT NULL,
    has_request_body INTEGER DEFAULT 0,
    has_response_body INTEGER DEFAULT 0,
    has_pipeline_details INTEGER DEFAULT 0,
    request_summary TEXT,
    correlation_id TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_cl_timestamp ON call_logs(timestamp);
  CREATE INDEX IF NOT EXISTS idx_cl_status ON call_logs(status);

  CREATE TABLE IF NOT EXISTS proxy_logs (
    id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    status TEXT,
    proxy_type TEXT,
    proxy_host TEXT,
    proxy_port INTEGER,
    level TEXT,
    level_id TEXT,
    provider TEXT,
    target_url TEXT,
    public_ip TEXT,
    latency_ms INTEGER DEFAULT 0,
    error TEXT,
    connection_id TEXT,
    combo_id TEXT,
    account TEXT,
    tls_fingerprint INTEGER DEFAULT 0
  );
  CREATE INDEX IF NOT EXISTS idx_pl_timestamp ON proxy_logs(timestamp);
  CREATE INDEX IF NOT EXISTS idx_pl_status ON proxy_logs(status);
  CREATE INDEX IF NOT EXISTS idx_pl_provider ON proxy_logs(provider);

  -- Domain State Persistence (Phase 5)
  CREATE TABLE IF NOT EXISTS domain_fallback_chains (
    model TEXT PRIMARY KEY,
    chain TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS domain_budgets (
    api_key_id TEXT PRIMARY KEY,
    daily_limit_usd REAL NOT NULL,
    weekly_limit_usd REAL DEFAULT 0,
    monthly_limit_usd REAL DEFAULT 0,
    warning_threshold REAL DEFAULT 0.8,
    reset_interval TEXT DEFAULT 'daily',
    reset_time TEXT DEFAULT '00:00',
    budget_reset_at INTEGER,
    last_budget_reset_at INTEGER,
    warning_emitted_at INTEGER,
    warning_period_start INTEGER
  );

  CREATE TABLE IF NOT EXISTS domain_budget_reset_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    api_key_id TEXT NOT NULL,
    reset_interval TEXT NOT NULL,
    previous_spend REAL NOT NULL DEFAULT 0,
    reset_at INTEGER NOT NULL,
    next_reset_at INTEGER NOT NULL,
    period_start INTEGER NOT NULL,
    period_end INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_dbrl_key_reset ON domain_budget_reset_logs(api_key_id, reset_at DESC);

  CREATE TABLE IF NOT EXISTS domain_cost_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    api_key_id TEXT NOT NULL,
    cost REAL NOT NULL,
    timestamp INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_dch_key ON domain_cost_history(api_key_id);
  CREATE INDEX IF NOT EXISTS idx_dch_ts ON domain_cost_history(timestamp);

  CREATE TABLE IF NOT EXISTS domain_lockout_state (
    identifier TEXT PRIMARY KEY,
    attempts TEXT NOT NULL,
    locked_until INTEGER
  );

  CREATE TABLE IF NOT EXISTS domain_circuit_breakers (
    name TEXT PRIMARY KEY,
    state TEXT NOT NULL DEFAULT 'CLOSED',
    failure_count INTEGER DEFAULT 0,
    last_failure_time INTEGER,
    options TEXT
  );

  CREATE TABLE IF NOT EXISTS semantic_cache (
    id TEXT PRIMARY KEY,
    signature TEXT NOT NULL UNIQUE,
    model TEXT NOT NULL,
    prompt_hash TEXT NOT NULL,
    response TEXT NOT NULL,
    tokens_saved INTEGER DEFAULT 0,
    hit_count INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_sc_sig ON semantic_cache(signature);
  CREATE INDEX IF NOT EXISTS idx_sc_model ON semantic_cache(model);

  CREATE TABLE IF NOT EXISTS quota_snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    provider TEXT NOT NULL,
    connection_id TEXT NOT NULL,
    window_key TEXT NOT NULL,
    remaining_percentage REAL,
    is_exhausted INTEGER DEFAULT 0,
    next_reset_at TEXT,
    window_duration_ms INTEGER,
    raw_data TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_quota_snapshots_provider_time ON quota_snapshots(provider, created_at);
  CREATE INDEX IF NOT EXISTS idx_quota_snapshots_connection_time ON quota_snapshots(connection_id, created_at);
  CREATE INDEX IF NOT EXISTS idx_quota_snapshots_created_at ON quota_snapshots(created_at);
`;
    dbHealthCheckTimer = null;
    walTruncateTimer = null;
  }
});

// src/lib/db/ccrBlocks.ts
function persistCcrBlock(row) {
  const db = getDbInstance();
  db.prepare(
    `INSERT OR REPLACE INTO ccr_blocks (
       principal_id, hash, content, bytes, chars, lines,
       content_type, source, created_at, last_accessed_at, expires_at
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    row.principalId,
    row.hash,
    row.content,
    row.bytes,
    row.chars,
    row.lines,
    row.contentType,
    row.source,
    row.createdAt,
    row.lastAccessedAt,
    row.expiresAt
  );
  if (++writesSincePrune >= PRUNE_EVERY_N_WRITES) {
    writesSincePrune = 0;
    pruneExpiredCcrBlocks(Date.now());
  }
}
function deleteCcrBlockRow(principalId, hash) {
  getDbInstance().prepare(`DELETE FROM ccr_blocks WHERE principal_id = ? AND hash = ?`).run(principalId, hash);
}
function pruneExpiredCcrBlocks(now) {
  const result = getDbInstance().prepare(`DELETE FROM ccr_blocks WHERE expires_at <= ?`).run(now);
  return result.changes ?? 0;
}
var PRUNE_EVERY_N_WRITES, writesSincePrune;
var init_ccrBlocks = __esm({
  "src/lib/db/ccrBlocks.ts"() {
    init_core();
    PRUNE_EVERY_N_WRITES = 200;
    writesSincePrune = 0;
  }
});

// open-sse/services/compression/compressionWorker.ts
import { parentPort } from "node:worker_threads";

// open-sse/services/compression/ultraHeuristic.ts
var STOPWORDS = /* @__PURE__ */ new Set([
  "a",
  "an",
  "the",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "shall",
  "can",
  "need",
  "dare",
  "ought",
  "used",
  "i",
  "we",
  "you",
  "he",
  "she",
  "it",
  "they",
  "me",
  "us",
  "him",
  "her",
  "them",
  "my",
  "our",
  "your",
  "his",
  "its",
  "their",
  "this",
  "that",
  "these",
  "those",
  "and",
  "but",
  "or",
  "nor",
  "for",
  "yet",
  "so",
  "as",
  "at",
  "by",
  "in",
  "of",
  "on",
  "to",
  "up",
  "via",
  "with",
  "from",
  "into",
  "onto",
  "upon",
  "about",
  "just",
  "very",
  "really",
  "quite",
  "rather",
  "also",
  "too",
  "even",
  "still",
  "already",
  "always",
  "never",
  "often",
  "usually",
  "sometimes",
  "here",
  "there"
]);
var FORCE_PRESERVE_RE = /\d|https?:\/\/|[._\/\\]|Error:|Exception:|```/i;
function scoreToken(token) {
  if (FORCE_PRESERVE_RE.test(token)) return 1;
  const lower = token.toLowerCase();
  if (STOPWORDS.has(lower)) return 0.1;
  if (token.length <= 2) return 0.2;
  if (/^[A-Z]/.test(token)) return 0.8;
  if (token.length >= 6) return 0.7;
  return 0.5;
}
function pruneByScore(text, keepRate = 0.5, minScore = 0.3) {
  if (!text || keepRate >= 1) return text;
  const tokens = text.split(/(\s+)/);
  const wordTokens = tokens.filter((t) => !/^\s+$/.test(t));
  const targetKeep = Math.ceil(wordTokens.length * keepRate);
  const scored = wordTokens.map((t, i) => ({ t, i, score: scoreToken(t) }));
  const sorted = [...scored].sort((a, b) => a.score - b.score);
  const toPrune = /* @__PURE__ */ new Set();
  let pruned = 0;
  for (const { i, score } of sorted) {
    if (pruned >= wordTokens.length - targetKeep) break;
    if (score < minScore) {
      toPrune.add(i);
      pruned++;
    }
  }
  let wordIdx = 0;
  return tokens.map((t) => {
    if (/^\s+$/.test(t)) return t;
    const keep = !toPrune.has(wordIdx);
    wordIdx++;
    return keep ? t : "";
  }).join("").replace(/\s{2,}/g, " ").trim();
}

// src/shared/utils/tiktokenCounter.ts
import { createRequire } from "module";
var _require = createRequire(import.meta.url);
function tokenizerContextFromBody(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return {};
  const record = body;
  return {
    provider: typeof record.provider === "string" ? record.provider : void 0,
    model: typeof record.model === "string" ? record.model : void 0
  };
}
var encoders = /* @__PURE__ */ new Map();
var MAX_EXACT_TOKEN_COUNT_CHARS = 5e4;
var BASE64_DATA_URI_RE = /data:image\/[a-z0-9.+-]+;base64,[A-Za-z0-9+/=]+/gi;
function stripBase64DataUris(text) {
  return text.replace(BASE64_DATA_URI_RE, "");
}
function normalize(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}
function isCodexTokenizerContext(context) {
  const provider = normalize(context?.provider);
  const model = normalize(context?.model);
  return provider === "codex" || provider === "cx" || model.startsWith("codex/") || model.startsWith("cx/") || model.includes("codex");
}
function resolveTokenizerEncoding(context) {
  return isCodexTokenizerContext(context) ? "o200k_base" : "cl100k_base";
}
function getEncoder(encoding) {
  const cached = encoders.get(encoding);
  if (cached) return cached;
  let tiktoken = null;
  try {
    tiktoken ??= _require("js-tiktoken");
    const created = tiktoken.getEncoding(encoding);
    encoders.set(encoding, created);
    return created;
  } catch {
    throw new Error(`js-tiktoken not available: cannot create encoder for ${encoding}`);
  }
}
function countTextTokens(text, context) {
  if (!text || typeof text !== "string") return 0;
  const stripped = stripBase64DataUris(text);
  if (stripped.length > MAX_EXACT_TOKEN_COUNT_CHARS) {
    return Math.ceil(stripped.length / 4);
  }
  try {
    return getEncoder(resolveTokenizerEncoding(context)).encode(stripped).length;
  } catch {
    return Math.ceil(stripped.length / 4);
  }
}

// open-sse/services/compression/engineCatalog.ts
var ENGINE_CATALOG = {
  "session-dedup": {
    id: "session-dedup",
    label: "Session Dedup",
    stackPriority: 3,
    isSingleMode: false,
    description: "Cross-turn block deduplication.",
    guidance: {
      tradeoffs: "Lossless \u2014 elides only text already sent earlier in the same session; nothing is summarized or dropped. Negligible latency overhead.",
      lossy: false,
      cacheImpact: "low"
    }
  },
  ccr: {
    id: "ccr",
    label: "CCR (Retrieval)",
    stackPriority: 4,
    isSingleMode: false,
    description: "Content-addressed retrieval markers.",
    guidance: {
      tradeoffs: "Lossless \u2014 replaces large repeated/contiguous blocks with content-addressed references instead of deleting them; the original content stays retrievable.",
      lossy: false,
      cacheImpact: "low"
    }
  },
  lite: {
    id: "lite",
    label: "Lite",
    stackPriority: 5,
    isSingleMode: true,
    description: "Whitespace/format cleanup.",
    guidance: {
      tradeoffs: "Safest mode (~15% savings, <1ms latency): whitespace/dedup/formatting cleanup only, zero semantic change. Always safe to leave on.",
      lossy: false,
      cacheImpact: "none"
    }
  },
  rtk: {
    id: "rtk",
    label: "RTK",
    stackPriority: 10,
    levels: ["minimal", "standard", "aggressive"],
    isSingleMode: true,
    description: "Command-output filtering.",
    guidance: {
      tradeoffs: "Strips ANSI noise, progress bars, and repeated lines from command/tool output while preserving failures, warnings, and summaries (60-90% upstream savings). The 'aggressive' level trims more tail context than 'minimal'/'standard'.",
      lossy: true,
      cacheImpact: "moderate"
    }
  },
  "codex-responses": {
    id: "codex-responses",
    label: "Responses Tool Output",
    stackPriority: 12,
    isSingleMode: true,
    description: "Conservative compression for supported Responses tool outputs.",
    guidance: {
      tradeoffs: "Lossless-first JSON and bounded diagnostic compression for shell, patch, search, and build outputs. Protected tools and uncertain shapes pass through unchanged.",
      lossy: true,
      cacheImpact: "low"
    }
  },
  headroom: {
    id: "headroom",
    label: "Headroom",
    stackPriority: 15,
    isSingleMode: false,
    description: "Tabular JSON compaction.",
    guidance: {
      tradeoffs: "Lossless columnar compaction (SmartCrusher) of homogeneous JSON-array payloads into a compact '[N rows]' form \u2014 no data is discarded.",
      lossy: false,
      cacheImpact: "low"
    }
  },
  relevance: {
    id: "relevance",
    label: "Relevance",
    stackPriority: 18,
    isSingleMode: true,
    description: "Extractive sentence scoring against the last user query.",
    guidance: {
      tradeoffs: "Drops sentences scored as less relevant to the last user query \u2014 output depends on the query, so it can omit context a later turn needs.",
      lossy: true,
      cacheImpact: "moderate"
    }
  },
  caveman: {
    id: "caveman",
    label: "Caveman",
    stackPriority: 20,
    levels: ["lite", "full", "ultra"],
    isSingleMode: true,
    description: "Rule-based prose compression.",
    guidance: {
      tradeoffs: "Rule-based prose condensation (~30% savings at 'full'): strips filler and hedging while preserving meaning, but rewrites text so it is not byte-identical to the original.",
      lossy: true,
      cacheImpact: "moderate"
    }
  },
  aggressive: {
    id: "aggressive",
    label: "Aggressive",
    stackPriority: 30,
    isSingleMode: true,
    description: "Summarize + age old turns.",
    guidance: {
      tradeoffs: "Summarizes and progressively ages older turns (~50% savings) \u2014 trades older-turn fidelity for context headroom in long sessions; summarized turns can't be perfectly reconstructed.",
      lossy: true,
      cacheImpact: "high"
    }
  },
  llmlingua: {
    id: "llmlingua",
    label: "LLMLingua (SLM)",
    stackPriority: 35,
    isSingleMode: false,
    description: "Semantic pruning (ONNX).",
    guidance: {
      tradeoffs: "Semantic token pruning via a small ONNX classifier \u2014 removes individual tokens judged low-information. Fail-opens (returns the original text) on any error, so the worst case is no savings, never corruption.",
      lossy: true,
      cacheImpact: "high"
    }
  },
  ultra: {
    id: "ultra",
    label: "Ultra",
    stackPriority: 40,
    isSingleMode: true,
    description: "Heuristic token pruning (+ optional SLM).",
    guidance: {
      tradeoffs: "Maximum-compression mode (~75% savings): heuristic pruning, code-block thinning, and binary-search truncation. Highest risk of losing context a later turn depended on \u2014 best reserved for hitting context limits.",
      lossy: true,
      cacheImpact: "high"
    }
  },
  omniglyph: {
    id: "omniglyph",
    label: "OmniGlyph",
    stackPriority: 90,
    isSingleMode: true,
    description: "Contexto-como-imagem (Claude Fable 5, rota direta).",
    guidance: {
      tradeoffs: "Experimental context-as-image encoding routed directly to Claude Fable 5 only \u2014 the most aggressive and least broadly compatible option; not recommended as a general-purpose default.",
      lossy: true,
      cacheImpact: "high"
    }
  }
};
var ENGINE_IDS = Object.values(ENGINE_CATALOG).sort((a, b) => a.stackPriority - b.stackPriority).map((e) => e.id);
function engineMeta(id) {
  return ENGINE_CATALOG[id];
}

// open-sse/services/compression/engines/mcpAccessibility/constants.ts
var MCP_ACCESSIBILITY_DEFAULTS = {
  maxTextChars: 5e4,
  collapseThreshold: 30,
  collapseKeepHead: 10,
  collapseKeepTail: 5,
  minLengthToProcess: 2e3,
  preserveRefPattern: /\[ref=e\d+\]/g
};
var DEFAULT_MCP_ACCESSIBILITY_CONFIG = {
  enabled: true,
  maxTextChars: MCP_ACCESSIBILITY_DEFAULTS.maxTextChars,
  collapseThreshold: MCP_ACCESSIBILITY_DEFAULTS.collapseThreshold,
  collapseKeepHead: MCP_ACCESSIBILITY_DEFAULTS.collapseKeepHead,
  collapseKeepTail: MCP_ACCESSIBILITY_DEFAULTS.collapseKeepTail,
  minLengthToProcess: MCP_ACCESSIBILITY_DEFAULTS.minLengthToProcess
};
var MCP_ACCESSIBILITY_TAIL_RESERVE = 300;
var MCP_ACCESSIBILITY_MIN_MAX_TEXT_CHARS = MCP_ACCESSIBILITY_TAIL_RESERVE * 2;

// open-sse/services/compression/types.ts
var DEFAULT_CODEX_RESPONSES_CONFIG = {
  enabled: false,
  minBytes: 512,
  maxOutputBytes: 2 * 1024 * 1024,
  maxCandidateBytes: 512 * 1024,
  maxLines: 160,
  minSearchMatches: 8,
  minLogLines: 24,
  preserveToolNames: [
    "Read",
    "Glob",
    "Grep",
    "Write",
    "Edit",
    "WebSearch",
    "WebFetch",
    "read",
    "glob",
    "grep",
    "write",
    "edit",
    "web_search",
    "web_fetch"
  ]
};
var DEFAULT_COMPRESSION_CONFIG = {
  enabled: false,
  defaultMode: "off",
  autoTriggerMode: "lite",
  autoTriggerTokens: 0,
  cacheMinutes: 5,
  preserveSystemPrompt: true,
  preserveSystemPromptMode: "always",
  mcpDescriptionCompressionEnabled: true,
  comboOverrides: {},
  compressionComboId: null,
  stackedPipeline: [
    { engine: "rtk", intensity: "standard" },
    { engine: "caveman", intensity: "full" }
  ],
  engines: Object.fromEntries(ENGINE_IDS.map((id) => [id, { enabled: false }])),
  activeComboId: null,
  ultraEngine: "heuristic",
  ultraSlmPrewarm: false,
  liveZone: { enabled: false },
  lite: { compressToolResults: true },
  codexResponsesConfig: { ...DEFAULT_CODEX_RESPONSES_CONFIG }
};
var DEFAULT_CAVEMAN_CONFIG = {
  enabled: false,
  compressRoles: ["user"],
  skipRules: [],
  minMessageLength: 50,
  // Protect code blocks, inline code, file paths, URLs, and error/stack lines
  // from caveman compression so signal-carrying content is never mangled.
  preservePatterns: [
    "```[\\s\\S]*?```",
    "`[^`\\n]+`",
    "\\b(https?://\\S+)",
    "(?:^|\\s)(\\.{0,2}/[\\w./\\-]+)",
    "^\\s*(Error|TypeError|RangeError|SyntaxError|ReferenceError):",
    "^\\s+at\\s"
  ],
  intensity: "lite"
};
var DEFAULT_RTK_CONFIG = {
  enabled: false,
  intensity: "minimal",
  applyToToolResults: true,
  applyToCodeBlocks: false,
  applyToAssistantMessages: false,
  enabledFilters: [],
  disabledFilters: [],
  maxLinesPerResult: 120,
  maxCharsPerResult: 12e3,
  deduplicateThreshold: 3,
  customFiltersEnabled: true,
  trustProjectFilters: false,
  rawOutputRetention: "never",
  rawOutputMaxBytes: 1048576,
  rawOutputMaxFiles: 1e5,
  rawOutputMaxAgeDays: 30,
  enableGrouping: false,
  groupingThreshold: 3,
  stripCodeComments: false,
  preserveDocstrings: true,
  enableRenderers: false
};
var DEFAULT_AGGRESSIVE_CONFIG = {
  thresholds: { fullSummary: 5, moderate: 3, light: 2, verbatim: 2 },
  toolStrategies: {
    fileContent: true,
    grepSearch: true,
    shellOutput: true,
    json: true,
    errorMessage: true
  },
  summarizerEnabled: true,
  maxTokensPerMessage: 2048,
  minSavingsThreshold: 0.05
};
var DEFAULT_ULTRA_CONFIG = {
  enabled: false,
  compressionRate: 0.5,
  minScoreThreshold: 0.3,
  slmFallbackToAggressive: true,
  maxTokensPerMessage: 0
};

// open-sse/services/compression/stats.ts
import {
  anthropicImageTokens,
  ANTHROPIC_IMAGE_BLOCK_OVERHEAD_TOKENS,
  openAIVisionTokens
} from "omniglyph";
var CHARS_PER_TOKEN = 4;
function isAnthropicPngImageBlock(value) {
  if (!value || typeof value !== "object") return false;
  const block = value;
  if (block.type !== "image") return false;
  const source = block.source;
  if (!source || typeof source !== "object") return false;
  return source.type === "base64" && source.media_type === "image/png" && typeof source.data === "string";
}
function isOpenAIChatPngImagePart(value) {
  if (!value || typeof value !== "object") return false;
  const part = value;
  const image = part.image_url;
  return part.type === "image_url" && !!image && typeof image === "object" && typeof image.url === "string" && image.url.startsWith("data:image/png;base64,");
}
function isOpenAIResponsesPngImagePart(value) {
  const part = value;
  return !!part && part.type === "input_image" && typeof part.image_url === "string" && part.image_url.startsWith("data:image/png;base64,");
}
function pngDimensionsFromDataUrl(value) {
  const marker = ";base64,";
  const markerIndex = value.indexOf(marker);
  if (markerIndex < 0) return null;
  return decodePngDimensions(value.slice(markerIndex + marker.length));
}
function decodePngDimensions(base64) {
  try {
    const prefix = base64.slice(0, 64);
    const bytes = Buffer.from(prefix, "base64");
    if (bytes.length < 24) return null;
    const PNG_SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10];
    for (let i = 0; i < PNG_SIGNATURE.length; i++) {
      if (bytes[i] !== PNG_SIGNATURE[i]) return null;
    }
    const width = bytes.readUInt32BE(16);
    const height = bytes.readUInt32BE(20);
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
      return null;
    }
    return { width, height };
  } catch {
    return null;
  }
}
function charTokensOf(value) {
  if (value === null || value === void 0) return 0;
  const str = typeof value === "string" ? value : JSON.stringify(value);
  return Math.ceil(str.length / CHARS_PER_TOKEN);
}
function blankImageBlocksAndSumImageTokens(body) {
  let imageTokens = 0;
  const model = typeof body.model === "string" ? body.model : "";
  const clone = { ...body };
  const processContentArray = (content) => {
    if (!Array.isArray(content)) return content;
    return content.map((block) => {
      if (isAnthropicPngImageBlock(block)) {
        const dims = decodePngDimensions(block.source.data);
        if (!dims) return block;
        imageTokens += anthropicImageTokens(dims.width, dims.height, "standard");
        imageTokens += ANTHROPIC_IMAGE_BLOCK_OVERHEAD_TOKENS;
        return { ...block, source: { ...block.source, data: "" } };
      }
      if (isOpenAIChatPngImagePart(block)) {
        const dims = pngDimensionsFromDataUrl(block.image_url.url);
        if (!dims) return block;
        imageTokens += openAIVisionTokens(model, dims.width, dims.height);
        return { ...block, image_url: { ...block.image_url, url: "" } };
      }
      if (isOpenAIResponsesPngImagePart(block)) {
        const dims = pngDimensionsFromDataUrl(block.image_url);
        if (!dims) return block;
        imageTokens += openAIVisionTokens(model, dims.width, dims.height);
        return { ...block, image_url: "" };
      }
      return block;
    });
  };
  if (Array.isArray(clone.messages)) {
    clone.messages = clone.messages.map((message) => {
      if (!message || typeof message !== "object") return message;
      const m = message;
      if (!Array.isArray(m.content)) return message;
      return { ...m, content: processContentArray(m.content) };
    });
  }
  if (Array.isArray(clone.system)) {
    clone.system = processContentArray(clone.system);
  }
  if (Array.isArray(clone.input)) {
    clone.input = clone.input.map((item) => {
      if (!item || typeof item !== "object") return item;
      const record = item;
      return Array.isArray(record.content) ? { ...record, content: processContentArray(record.content) } : record;
    });
  }
  return { clone, imageTokens };
}
function estimateCompressionTokens(text) {
  if (!text) return 0;
  if (typeof text === "string") {
    return charTokensOf(text);
  }
  try {
    const tokenizerContext = tokenizerContextFromBody(text);
    const useExactTokenizer = isCodexTokenizerContext(tokenizerContext);
    const { clone, imageTokens } = blankImageBlocksAndSumImageTokens(
      text
    );
    if (imageTokens === 0) {
      return useExactTokenizer ? countTextTokens(JSON.stringify(text), tokenizerContext) : charTokensOf(text);
    }
    return useExactTokenizer ? countTextTokens(JSON.stringify(clone), tokenizerContext) + imageTokens : charTokensOf(clone) + imageTokens;
  } catch {
    return charTokensOf(text);
  }
}
function createCompressionStats(originalBody, compressedBody, mode, techniquesUsed, rulesApplied, durationMs) {
  const originalTokens = estimateCompressionTokens(originalBody);
  const compressedTokens = estimateCompressionTokens(compressedBody);
  const savingsPercent = originalTokens > 0 ? Math.round((originalTokens - compressedTokens) / originalTokens * 1e4) / 100 : 0;
  return {
    originalTokens,
    compressedTokens,
    savingsPercent,
    techniquesUsed,
    mode,
    timestamp: Date.now(),
    ...rulesApplied && rulesApplied.length > 0 ? { rulesApplied } : {},
    ...durationMs !== void 0 ? { durationMs } : {}
  };
}

// open-sse/services/compression/hardBudget.ts
var UNIT_PRESERVE_RE = /\d|https?:\/\/|(?:Error|Exception|TypeError|RangeError|SyntaxError|ReferenceError|Traceback):|```|^\s*at\s|\/[\w.-]+\/|[A-Za-z_]\w*=\S/i;
function scoreUnit(unit) {
  const words = unit.split(/\s+/).filter(Boolean);
  if (words.length === 0) return 0.5;
  const total = words.reduce((sum, w) => sum + scoreToken(w), 0);
  return total / words.length;
}
function mustPreserve(unit) {
  return UNIT_PRESERVE_RE.test(unit);
}
function splitUnits(text) {
  return text.split(/\n/).flatMap((line) => {
    if (line.trim() === "") return [line];
    if (!UNIT_PRESERVE_RE.test(line) && line.length > 60) {
      const sentences = line.split(/(?<=[.!?])\s+/);
      return sentences.length > 1 ? sentences : [line];
    }
    return [line];
  });
}
function tagUnits(units, tokenizerContext) {
  return units.map((u, i) => ({
    i,
    u,
    tokens: countTextTokens(u, tokenizerContext),
    score: scoreUnit(u),
    preserve: mustPreserve(u)
  }));
}
function dropToTarget(tagged, targetTokens) {
  const dropped = /* @__PURE__ */ new Set();
  let tokCount = tagged.reduce((s, x) => s + x.tokens, 0);
  const candidates = tagged.filter((x) => !x.preserve).sort((a, b) => a.score - b.score);
  for (const candidate of candidates) {
    if (tokCount <= targetTokens) break;
    dropped.add(candidate.i);
    tokCount -= candidate.tokens;
  }
  return dropped;
}
function rebuildText(tagged, dropped) {
  return tagged.filter((x) => !dropped.has(x.i)).map((x) => x.u).join("\n");
}
function compressText(text, targetTokens, tokenizerContext) {
  const currentTokens = countTextTokens(text, tokenizerContext);
  if (currentTokens <= targetTokens) return text;
  const units = splitUnits(text);
  if (units.length <= 1) return text;
  const tagged = tagUnits(units, tokenizerContext);
  const dropped = dropToTarget(tagged, targetTokens);
  if (dropped.size === 0) return text;
  return rebuildText(tagged, dropped);
}
function extractMessages(body) {
  const msgs = body.messages;
  if (!Array.isArray(msgs)) return [];
  return msgs;
}
function applyHardBudget(body, opts) {
  const { targetTokens, targetRatio } = opts;
  if (targetTokens == null && targetRatio == null) {
    return { body, compressed: false, stats: null };
  }
  const messages = extractMessages(body);
  if (messages.length === 0) return { body, compressed: false, stats: null };
  const tokenizerContext = tokenizerContextFromBody(body);
  const totalText = messages.map((m) => typeof m.content === "string" ? m.content : JSON.stringify(m.content)).join(" ");
  const totalTokens = countTextTokens(totalText, tokenizerContext);
  const effectiveTarget = targetTokens != null ? targetTokens : Math.floor(totalTokens * targetRatio);
  if (totalTokens <= effectiveTarget) {
    return { body, compressed: false, stats: null };
  }
  const newMessages = messages.map((m) => {
    if (typeof m.content !== "string") return m;
    const msgTokens = countTextTokens(m.content, tokenizerContext);
    const perMsgTarget = totalTokens > 0 ? Math.floor(effectiveTarget * (msgTokens / totalTokens)) : effectiveTarget;
    const out = compressText(m.content, perMsgTarget, tokenizerContext);
    return out === m.content ? m : { ...m, content: out };
  });
  const changed = newMessages.some((m, i) => JSON.stringify(m) !== JSON.stringify(messages[i]));
  const usedMessages = changed ? newMessages : messages;
  const resultTokens = countTextTokens(
    usedMessages.map((m) => typeof m.content === "string" ? m.content : JSON.stringify(m.content)).join(" "),
    tokenizerContext
  );
  const overBudget = resultTokens > effectiveTarget;
  if (!changed && !overBudget) {
    return { body, compressed: false, stats: null };
  }
  const newBody = changed ? { ...body, messages: newMessages } : body;
  const stats = createCompressionStats(body, newBody, "stacked", ["hard-budget"]);
  if (overBudget) {
    const warning = `hard-budget: could not reach target (${resultTokens} > ${effectiveTarget}; preserved content exceeds budget)`;
    stats.validationWarnings = [...stats.validationWarnings ?? [], warning];
  }
  return { body: newBody, compressed: changed, stats };
}

// open-sse/services/compression/messageContent.ts
function isTextBlock(value) {
  return !!value && typeof value === "object" && "text" in value && typeof value.text === "string" && (value.type === void 0 || value.type === "text" || value.type === "input_text");
}
function extractTextContent(content) {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  const textParts = [];
  for (const part of content) {
    if (isTextBlock(part) && part.text) {
      textParts.push(part.text);
    }
  }
  return textParts.join("\n");
}
function mapTextContent(msg, transform) {
  if (typeof msg.content === "string") {
    return { ...msg, content: transform(msg.content, 0) };
  }
  if (!Array.isArray(msg.content)) return msg;
  let textIndex = 0;
  let changed = false;
  const content = msg.content.map((part) => {
    if (!isTextBlock(part)) return part;
    const nextText = transform(part.text ?? "", textIndex);
    textIndex++;
    if (nextText === part.text) return part;
    changed = true;
    return { ...part, text: nextText };
  });
  return changed ? { ...msg, content } : msg;
}
function replaceTextContent(msg, newText) {
  if (typeof msg.content === "string" || !Array.isArray(msg.content)) {
    return { ...msg, content: newText };
  }
  let replaced = false;
  const content = msg.content.flatMap((part) => {
    if (!isTextBlock(part)) return [part];
    if (!replaced) {
      replaced = true;
      return [{ ...part, text: newText }];
    }
    const partText = part.text ?? "";
    if (partText && !newText.includes(partText)) return [part];
    return [];
  });
  if (!replaced) {
    return { ...msg, content: [{ type: "text", text: newText }, ...msg.content] };
  }
  return { ...msg, content };
}

// open-sse/services/compression/preservation.ts
var SENTINEL_PREFIX = "\0OMNI_CAVEMAN";
function randomSentinelSeed() {
  const bytes = new Uint8Array(8);
  const cryptoLike = globalThis.crypto;
  if (cryptoLike?.getRandomValues) {
    cryptoLike.getRandomValues(bytes);
    return `r${Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")}`;
  }
  return `r${Math.random().toString(36).slice(2)}`;
}
function ensureGlobal(pattern) {
  const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
  return new RegExp(pattern.source, flags);
}
function compileUserPatterns(patterns) {
  if (!patterns?.length) return [];
  const compiled = [];
  for (const pattern of patterns) {
    try {
      compiled.push({
        pattern: typeof pattern === "string" ? new RegExp(pattern, "g") : ensureGlobal(pattern),
        kind: "custom"
      });
    } catch {
    }
  }
  return compiled;
}
function replacePattern(text, pattern, kind, addBlock) {
  pattern.lastIndex = 0;
  return text.replace(pattern, (match) => {
    if (!match) return match;
    if (match.includes(SENTINEL_PREFIX)) return match;
    return addBlock(match, kind);
  });
}
function findFencedCodeBlocks(text) {
  const blocks = [];
  extractFencedCodeBlocks(text, (content) => {
    blocks.push(content);
    return content;
  });
  return blocks;
}
function extractPreservedBlocks(text, options = {}) {
  const blocks = [];
  const seed = randomSentinelSeed();
  let counter = 0;
  const addBlock = (content, kind) => {
    const placeholder = `${SENTINEL_PREFIX}_${seed}_${counter}\0`;
    blocks.push({ placeholder, content, kind });
    counter++;
    return placeholder;
  };
  let result = text;
  result = extractFrontmatter(result, addBlock);
  result = extractFencedCodeBlocks(result, (content) => addBlock(content, "fenced_code"));
  const builtIns = [
    { pattern: /\$\$[\s\S]*?\$\$/g, kind: "math_block" },
    { pattern: /\\\[[\s\S]*?\\\]/g, kind: "math_block" },
    // #4795: exclude `\` from the catch-all branch so a backslash is only ever
    // consumed by the escape branch `\\.`. The previous `[^$\n]` overlapped with
    // `\\.`, making a run of consecutive backslashes (e.g. unmatched `$` + a
    // Windows path) exponentially ambiguous → catastrophic backtracking (ReDoS).
    {
      pattern: /(?<!\$)\$(?![\s$\d])(?:\\.|[^$\n\\]){1,160}?(?<!\s)\$(?!\$)/g,
      kind: "math_inline"
    },
    { pattern: /\\begin\{[A-Za-z*]+\}[\s\S]*?\\end\{[A-Za-z*]+\}/g, kind: "latex_block" },
    { pattern: /^#{1,6}\s+.+$/gm, kind: "markdown_heading" },
    { pattern: /^\s*\|.*\|\s*$/gm, kind: "markdown_table" },
    { pattern: /^\s*\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)+\|?\s*$/gm, kind: "markdown_table" },
    { pattern: /^\s*#(?:set|show|let|import|include)\b.+$/gm, kind: "typst_directive" },
    { pattern: /`[^`\n]+`/g, kind: "inline_code" },
    { pattern: /\[[^\]\n]+\]\([^) \n]+(?:\s+"[^"]*")?\)/g, kind: "markdown_link" },
    { pattern: /\bhttps?:\/\/[^\s)\]"'>]+/gi, kind: "url" },
    { pattern: /\b[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+\b/g, kind: "const_case" },
    { pattern: /\bprocess\.env\.[A-Za-z_][A-Za-z0-9_]*\b/g, kind: "env_var" },
    { pattern: /\$[A-Z_][A-Z0-9_]*\b/g, kind: "env_var" },
    { pattern: /\b\d+(?:\.\d+){1,3}(?:[-+][A-Za-z0-9.-]+)?\b/g, kind: "version" },
    { pattern: /\b[a-zA-Z_$][\w$]*(?:\.[a-zA-Z_$][\w$]*)+\(\)?/g, kind: "dotted_identifier" },
    { pattern: /\b[A-Za-z_$][\w$]*\s*\([^()\n]*\)/g, kind: "function_call" },
    {
      pattern: /(?:^|\s)(?:\.{0,2}\/[A-Za-z0-9_@./-]+|[A-Za-z]:\\[A-Za-z0-9_.\\/-]+)/g,
      kind: "file_path"
    },
    {
      pattern: /\b(?:TypeError|ReferenceError|SyntaxError|RangeError|URIError|EvalError|Error|Exception):[^\n]+/g,
      kind: "error_message"
    }
  ];
  for (const { pattern, kind } of [...builtIns, ...compileUserPatterns(options.preservePatterns)]) {
    result = replacePattern(result, ensureGlobal(pattern), kind, addBlock);
  }
  return { text: result, blocks };
}
function preserveSpans(text, spans) {
  if (!spans.length) return { text, blocks: [] };
  const seed = randomSentinelSeed();
  const blocks = [];
  let result = "";
  let cursor = 0;
  let counter = 0;
  for (const span of spans) {
    if (span.start < cursor || span.end > text.length || span.start >= span.end) continue;
    const placeholder = `${SENTINEL_PREFIX}_${seed}_${counter}\0`;
    blocks.push({ placeholder, content: text.slice(span.start, span.end), kind: span.kind });
    result += text.slice(cursor, span.start) + placeholder;
    cursor = span.end;
    counter++;
  }
  result += text.slice(cursor);
  return { text: result, blocks };
}
function extractFrontmatter(text, addBlock) {
  if (!text.startsWith("---\n")) return text;
  const close = text.indexOf("\n---", 4);
  if (close === -1) return text;
  const closeEnd = text.indexOf("\n", close + 4);
  const end = closeEnd === -1 ? text.length : closeEnd + 1;
  return `${addBlock(text.slice(0, end), "frontmatter")}${text.slice(end)}`;
}
function extractFencedCodeBlocks(text, addBlock) {
  const lines = text.match(/[^\n]*(?:\n|$)/g) ?? [text];
  let output = "";
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line === "" && i === lines.length - 1) break;
    const opening = line.match(/^([ \t]{0,3})(`{3,}|~{3,})[^\n]*(?:\n|$)/);
    if (!opening) {
      output += line;
      i++;
      continue;
    }
    const fence = opening[2];
    const fenceChar = fence[0];
    const minLen = fence.length;
    let block = line;
    let j = i + 1;
    let closed = false;
    while (j < lines.length) {
      const candidate = lines[j];
      block += candidate;
      const closeMatch = candidate.match(/^([ \t]{0,3})(`{3,}|~{3,})\s*(?:\n|$)/);
      if (closeMatch && closeMatch[2][0] === fenceChar && closeMatch[2].length >= minLen) {
        closed = true;
        break;
      }
      j++;
    }
    if (!closed) {
      output += line;
      i++;
      continue;
    }
    output += addBlock(block);
    i = j + 1;
  }
  return output;
}
function restorePreservedBlocks(text, blocks) {
  let result = text;
  for (const block of blocks) {
    result = result.split(block.placeholder).join(block.content);
  }
  return result;
}

// open-sse/services/compression/fidelityGate.ts
var CRITICAL_KINDS = /* @__PURE__ */ new Set([
  "url",
  "const_case",
  "env_var",
  "version",
  "dotted_identifier",
  "function_call",
  "file_path",
  "inline_code"
]);
var NUMERIC_RE = /\d[\d.,]{0,40}/g;
var JSON_KEY_RE = /"([A-Za-z_$][\w$-]{0,80})"\s*:/g;
var HUNK_RE = /@@ -\d{1,9}(?:,\d{1,9})? \+\d{1,9}(?:,\d{1,9})? @@/g;
function survivalRatio(needles, haystack) {
  if (needles.length === 0) return 1;
  let survived = 0;
  for (const n of needles) if (haystack.includes(n)) survived++;
  return survived / needles.length;
}
function uniq(values) {
  return Array.from(new Set(values));
}
function checkFidelity(inputText, outputText, cfg) {
  try {
    const tokens = uniq(
      extractPreservedBlocks(inputText).blocks.filter((b) => CRITICAL_KINDS.has(b.kind)).map((b) => b.content.trim()).filter((c) => c.length > 0)
    );
    const minTok = (cfg.minTokenSurvivalPercent ?? 95) / 100;
    const tokRatio = survivalRatio(tokens, outputText);
    if (tokRatio < minTok) {
      return {
        passed: false,
        failedInvariant: "protected-tokens",
        detail: `tokens protegidos ${Math.round(tokRatio * 100)}% < ${Math.round(minTok * 100)}%`
      };
    }
    if (cfg.checkDiffHunks !== false) {
      for (const h of uniq(inputText.match(HUNK_RE) ?? [])) {
        if (!outputText.includes(h)) {
          return {
            passed: false,
            failedInvariant: "diff-hunks",
            detail: `hunk "${h}" ausente no output`
          };
        }
      }
    }
    if (cfg.checkNumericIntegrity !== false) {
      for (const num of uniq(inputText.match(NUMERIC_RE) ?? [])) {
        if (!outputText.includes(num)) {
          return {
            passed: false,
            failedInvariant: "numeric",
            detail: `n\xFAmero "${num}" ausente no output`
          };
        }
      }
    }
    const keys = uniq(Array.from(inputText.matchAll(JSON_KEY_RE), (m) => m[1]));
    if (keys.length > 0) {
      const minKey = (cfg.minJsonKeyPercent ?? 90) / 100;
      const keyRatio = survivalRatio(
        keys.map((k) => `"${k}"`),
        outputText
      );
      if (keyRatio < minKey) {
        return {
          passed: false,
          failedInvariant: "json-keys",
          detail: `chaves JSON ${Math.round(keyRatio * 100)}% < ${Math.round(minKey * 100)}%`
        };
      }
    }
    return { passed: true };
  } catch {
    return { passed: true };
  }
}

// open-sse/services/compression/engines/registry.ts
var ENGINES = /* @__PURE__ */ new Map();
function assertValidEngine(engine) {
  if (!engine?.id || typeof engine.apply !== "function" || typeof engine.compress !== "function" || typeof engine.getConfigSchema !== "function" || typeof engine.validateConfig !== "function") {
    throw new Error("Invalid compression engine registration");
  }
}
function registerEngine(engine, defaultConfig = {}) {
  assertValidEngine(engine);
  const validation = engine.validateConfig(defaultConfig);
  if (!validation.valid) {
    throw new Error(`Invalid default config for ${engine.id}: ${validation.errors.join("; ")}`);
  }
  ENGINES.set(engine.id, {
    engine,
    enabled: true,
    config: { ...defaultConfig }
  });
}
function registerCompressionEngine(engine) {
  registerEngine(engine);
}
function getEngine(id) {
  return ENGINES.get(id)?.engine ?? null;
}
function getCompressionEngine(id) {
  return getEngine(id);
}
function getEngineEntry(id) {
  return ENGINES.get(id) ?? null;
}

// open-sse/services/compression/fidelityGateStep.ts
function bodyToText(body) {
  const messages = body.messages;
  if (!Array.isArray(messages)) return "";
  return messages.map((m) => extractTextContent(m.content)).join("\n");
}
function gateAdvance(result, inputBody, fidelityGate, acc, engineId) {
  if (!fidelityGate?.enabled) return true;
  if (engineId && getCompressionEngine(engineId)?.sampling) return true;
  const verdict = checkFidelity(bodyToText(inputBody), bodyToText(result.body), fidelityGate);
  if (verdict.passed) return true;
  if (result.stats) {
    const last = acc.breakdown[acc.breakdown.length - 1];
    if (last) {
      last.rejected = true;
      last.rejectReason = verdict.detail ?? verdict.failedInvariant;
      last.compressedTokens = last.originalTokens;
      last.savingsPercent = 0;
    }
  }
  acc.fallbackApplied = true;
  return false;
}

// open-sse/services/compression/lite.ts
init_visionModels();
function normalizeMessageWhitespace(content) {
  if (!content) return "";
  return content.replace(/\n{3,}/g, "\n\n").replace(/[ \t]+$/gm, "");
}
function modelSupportsVision(model) {
  return isVisionModelId(model);
}
function collapseWhitespace(body, options = {}) {
  if (!body.messages) return { body, applied: false };
  let applied = false;
  const messages = body.messages.map((msg) => {
    if (options.preserveSystemPrompt === true && msg.role === "system") return msg;
    if (typeof msg.content !== "string") return msg;
    const normalized = normalizeMessageWhitespace(msg.content);
    if (normalized !== msg.content) applied = true;
    return { ...msg, content: normalized };
  });
  return { body: { ...body, messages }, applied };
}
function dedupSystemPrompt(body, options = {}) {
  if (!body.messages) return { body, applied: false };
  if (options.preserveSystemPrompt === true) return { body, applied: false };
  const seen = /* @__PURE__ */ new Set();
  let applied = false;
  const messages = body.messages.filter((msg) => {
    if (msg.role !== "system" || typeof msg.content !== "string") return true;
    const key = msg.content.trim().slice(0, 200);
    if (seen.has(key)) {
      applied = true;
      return false;
    }
    seen.add(key);
    return true;
  });
  return { body: { ...body, messages }, applied };
}
var TOOL_TRUNCATION_LOOKBACK = 80;
function isWordChar(char) {
  return char !== void 0 && /\S/.test(char);
}
function findWhitespaceBackward(content, cutIndex) {
  const windowStart = Math.max(0, cutIndex - TOOL_TRUNCATION_LOOKBACK);
  for (let i = cutIndex; i > windowStart; i--) {
    if (!isWordChar(content[i - 1])) return i - 1;
  }
  return -1;
}
function findWhitespaceForward(content, cutIndex) {
  const windowEnd = Math.min(content.length, cutIndex + TOOL_TRUNCATION_LOOKBACK);
  for (let i = cutIndex; i < windowEnd; i++) {
    if (!isWordChar(content[i])) return i;
  }
  return -1;
}
function backOffToWordBoundary(content, cutIndex) {
  const onWordBoundary = !isWordChar(content[cutIndex - 1]) || !isWordChar(content[cutIndex]);
  if (onWordBoundary) return cutIndex;
  const backward = findWhitespaceBackward(content, cutIndex);
  if (backward !== -1) return backward;
  const forward = findWhitespaceForward(content, cutIndex);
  if (forward !== -1) return forward;
  return cutIndex;
}
function compressToolResults(body) {
  if (!body.messages) return { body, applied: false };
  const MAX_TOOL_LENGTH = 2e3;
  let applied = false;
  const messages = body.messages.map((msg) => {
    if (msg.role !== "tool" || typeof msg.content !== "string") return msg;
    if (msg.content.length <= MAX_TOOL_LENGTH) return msg;
    applied = true;
    const cutIndex = backOffToWordBoundary(msg.content, MAX_TOOL_LENGTH);
    return {
      ...msg,
      content: msg.content.slice(0, cutIndex) + "\n...[truncated]"
    };
  });
  return { body: { ...body, messages }, applied };
}
function removeRedundantContent(body, options = {}) {
  if (!body.messages) return { body, applied: false };
  let applied = false;
  const messages = [];
  for (let i = 0; i < body.messages.length; i++) {
    const msg = body.messages[i];
    if (options.preserveSystemPrompt === true && msg.role === "system") {
      messages.push(msg);
      continue;
    }
    const contentStr = typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content);
    if (i > 0 && body.messages[i - 1].role === msg.role && typeof body.messages[i - 1].content === "string" && body.messages[i - 1].content === contentStr) {
      applied = true;
      continue;
    }
    messages.push(msg);
  }
  return { body: { ...body, messages }, applied };
}
function replaceImageUrls(body, options) {
  if (!body.messages) return { body, applied: false };
  const supportsVision = typeof options === "object" && options !== null ? options.supportsVision : typeof options === "string" ? modelSupportsVision(options) : void 0;
  if (supportsVision !== false) return { body, applied: false };
  let applied = false;
  const messages = body.messages.map((msg) => {
    if (!Array.isArray(msg.content)) return msg;
    const newContent = msg.content.map((part) => {
      if (typeof part === "object" && part !== null && part.type === "image_url" && typeof part.image_url === "object" && part.image_url?.url) {
        const url = String(
          part.image_url.url
        );
        if (url.startsWith("data:image/")) {
          applied = true;
          const format = url.slice(url.indexOf("/") + 1, url.indexOf(";")) || "unknown";
          return { type: "text", text: `[image: ${format}]` };
        }
      }
      return part;
    });
    return { ...msg, content: newContent };
  });
  return { body: { ...body, messages }, applied };
}
function applyLiteCompression(body, options) {
  const originalBody = body;
  let current = body;
  const techniquesApplied = [];
  const r1 = collapseWhitespace(current, options);
  current = r1.body;
  if (r1.applied) techniquesApplied.push("whitespace");
  const r2 = dedupSystemPrompt(current, options);
  current = r2.body;
  if (r2.applied) techniquesApplied.push("system-dedup");
  if (options?.compressToolResults !== false) {
    const r3 = compressToolResults(current);
    current = r3.body;
    if (r3.applied) techniquesApplied.push("tool-compress");
  }
  const r4 = removeRedundantContent(current, options);
  current = r4.body;
  if (r4.applied) techniquesApplied.push("redundant-remove");
  const r5 = replaceImageUrls(current, options);
  current = r5.body;
  if (r5.applied) techniquesApplied.push("image-placeholder");
  const compressed = techniquesApplied.length > 0;
  const stats = compressed ? createCompressionStats(
    originalBody,
    current,
    "lite",
    techniquesApplied
  ) : null;
  return {
    body: current,
    compressed,
    stats
  };
}

// open-sse/services/compression/ruleLoader.ts
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
var VALID_CONTEXTS = /* @__PURE__ */ new Set(["all", "user", "system", "assistant"]);
var VALID_CATEGORIES = /* @__PURE__ */ new Set(["filler", "context", "structural", "dedup", "terse", "ultra"]);
var VALID_INTENSITIES = /* @__PURE__ */ new Set(["lite", "full", "ultra"]);
var cache = /* @__PURE__ */ new Map();
var rulesDirCache = null;
function normalizeReplacementKey(value) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}
function compileReplacement(rule) {
  if (!rule.replacementMap) return rule.replacement ?? "";
  const normalizedMap = new Map(
    Object.entries(rule.replacementMap).map(([key, value]) => [normalizeReplacementKey(key), value])
  );
  const fallback = rule.replacement;
  return (match) => {
    const normalized = normalizeReplacementKey(match);
    if (normalizedMap.has(normalized)) return normalizedMap.get(normalized) ?? "";
    return fallback ?? match;
  };
}
function getRuleFlags(rule) {
  return rule.flags ?? "gi";
}
function getModuleDir() {
  const anchors = [process.cwd()];
  const argv1 = process.argv[1];
  if (typeof argv1 === "string" && argv1) anchors.push(path.dirname(argv1));
  const rel = path.join("open-sse", "services", "compression");
  for (const anchor of anchors) {
    let dir = path.resolve(anchor);
    for (let i = 0; i <= 8; i++) {
      if (fs.existsSync(path.join(dir, rel))) return dir;
      const parent = path.dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  }
  return path.join(os.homedir(), ".omniroute");
}
function getRulesDir() {
  if (rulesDirCache) return rulesDirCache;
  const root = getModuleDir();
  const candidates = [
    path.join(root, "open-sse", "services", "compression", "rules"),
    path.join(root, "app", "open-sse", "services", "compression", "rules")
  ];
  rulesDirCache = candidates.find((candidate, index) => {
    return candidates.indexOf(candidate) === index && fs.existsSync(candidate);
  }) ?? candidates[0];
  return rulesDirCache;
}
function compileRule(rule, source) {
  try {
    const flags = getRuleFlags(rule);
    return {
      name: rule.name,
      pattern: new RegExp(rule.pattern, flags),
      replacement: compileReplacement(rule),
      context: rule.context ?? "all",
      category: rule.category ?? "filler",
      minIntensity: rule.minIntensity ?? "lite",
      description: rule.description
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid Caveman rule pattern in ${source}:${rule.name}: ${message}`);
  }
}
function validateRulePack(pack) {
  const errors = [];
  if (!pack || typeof pack !== "object") {
    return { valid: false, errors: ["Rule pack must be an object"] };
  }
  const value = pack;
  if (typeof value.language !== "string" || !value.language.trim()) {
    errors.push("language must be a non-empty string");
  }
  if (typeof value.category !== "string" || !value.category.trim()) {
    errors.push("category must be a non-empty string");
  }
  if (!Array.isArray(value.rules)) {
    errors.push("rules must be an array");
  } else {
    value.rules.forEach((rule, index) => {
      if (!rule || typeof rule !== "object") {
        errors.push(`rules[${index}] must be an object`);
        return;
      }
      const entry = rule;
      const flags = typeof entry.flags === "string" ? entry.flags : "gi";
      if (typeof entry.name !== "string" || !entry.name.trim()) {
        errors.push(`rules[${index}].name must be a non-empty string`);
      }
      if (typeof entry.pattern !== "string" || !entry.pattern.trim()) {
        errors.push(`rules[${index}].pattern must be a non-empty string`);
      } else {
        try {
          new RegExp(entry.pattern, flags);
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          errors.push(`rules[${index}].pattern is invalid: ${message}`);
        }
      }
      if (entry.flags !== void 0 && typeof entry.flags !== "string") {
        errors.push(`rules[${index}].flags must be a string`);
      }
      if (entry.replacement !== void 0 && typeof entry.replacement !== "string") {
        errors.push(`rules[${index}].replacement must be a string`);
      }
      if (entry.replacementMap !== void 0) {
        if (!entry.replacementMap || typeof entry.replacementMap !== "object" || Array.isArray(entry.replacementMap)) {
          errors.push(`rules[${index}].replacementMap must be an object`);
        } else {
          Object.entries(entry.replacementMap).forEach(([key, replacement]) => {
            if (!key.trim()) {
              errors.push(`rules[${index}].replacementMap contains an empty key`);
            }
            if (typeof replacement !== "string") {
              errors.push(`rules[${index}].replacementMap.${key} must be a string`);
            }
          });
        }
      }
      if (typeof entry.replacement !== "string" && entry.replacementMap === void 0) {
        errors.push(`rules[${index}] must define replacement or replacementMap`);
      }
      if (entry.context !== void 0 && !VALID_CONTEXTS.has(entry.context)) {
        errors.push(`rules[${index}].context is invalid`);
      }
      if (entry.category !== void 0 && !VALID_CATEGORIES.has(entry.category)) {
        errors.push(`rules[${index}].category is invalid`);
      }
      if (entry.minIntensity !== void 0 && !VALID_INTENSITIES.has(entry.minIntensity)) {
        errors.push(`rules[${index}].minIntensity is invalid`);
      }
    });
  }
  return { valid: errors.length === 0, errors };
}
function readPack(language, category) {
  const filename = path.join(getRulesDir(), language, `${category}.json`);
  if (!fs.existsSync(filename)) return null;
  const parsed = JSON.parse(fs.readFileSync(filename, "utf8"));
  const validation = validateRulePack(parsed);
  if (!validation.valid) {
    throw new Error(
      `Invalid Caveman rule pack ${language}/${category}: ${validation.errors.join("; ")}`
    );
  }
  return parsed;
}
function loadRulePack(language, category, options = {}) {
  const key = `${getRulesDir()}:${language}:${category}`;
  if (cache.has(key) && !options.refresh) return cache.get(key) ?? [];
  const pack = readPack(language, category);
  if (!pack) {
    cache.set(key, []);
    return [];
  }
  const rules = pack.rules.map((rule) => compileRule(rule, `${language}/${category}`));
  cache.set(key, rules);
  return rules;
}
function loadAllRulesForLanguage(language, options = {}) {
  const key = `${getRulesDir()}:${language}:*`;
  if (cache.has(key) && !options.refresh) return cache.get(key) ?? [];
  const languageDir = path.join(getRulesDir(), language);
  if (!fs.existsSync(languageDir)) {
    cache.set(key, []);
    return [];
  }
  const rules = fs.readdirSync(languageDir).filter((entry) => entry.endsWith(".json")).sort().flatMap((entry) => loadRulePack(language, path.basename(entry, ".json"), options));
  cache.set(key, rules);
  return rules;
}

// open-sse/services/compression/cavemanRules.ts
var CAVEMAN_RULES = [
  // ── Category 1: Filler Removal (10+ rules) ──────────────────────────
  {
    name: "redundant_phrasing",
    pattern: /\b(?:make sure to|be sure to|due to the fact that|the reason is because|it is important to|you should|remember to)\b\s*/gi,
    replacement: (match) => {
      const map = {
        "make sure to": "ensure ",
        "be sure to": "ensure ",
        "due to the fact that": "because ",
        "the reason is because": "because ",
        "it is important to": "",
        "you should": "",
        "remember to": ""
      };
      return map[match.trim().toLowerCase()] ?? "";
    },
    context: "all",
    category: "structural",
    minIntensity: "full",
    description: "Replace verbose stock phrases with shorter equivalents."
  },
  {
    name: "pleasantries",
    pattern: /(?<!make\s)(?<!be\s)\b(?:i'?d be happy to|i would be happy to|i'?d be glad to|i would be glad to|glad to help|happy to|thank you|thanks|no problem|you'?re welcome|absolutely|certainly|of course|sure)\b[,.!?\s]*/gi,
    replacement: "",
    context: "all",
    category: "filler",
    minIntensity: "lite",
    description: "Drop conversational acknowledgements that do not change request meaning."
  },
  {
    name: "polite_framing",
    pattern: /\b(?:please|kindly|could you please|would you please|can you please|I would like you to|I want you to|I need you to)\b\s*/gi,
    replacement: "",
    context: "all",
    category: "filler",
    minIntensity: "lite"
  },
  {
    name: "hedging",
    pattern: /\b(?:it seems like|it appears that|I think that|I believe that|probably|possibly|maybe it)\b\s*/gi,
    replacement: "",
    context: "all",
    category: "filler",
    minIntensity: "lite"
  },
  {
    name: "verbose_instructions",
    pattern: /\b(?:provide a detailed explanation of|give me a comprehensive explanation of|write an in-depth explanation of|create a thorough explanation of|provide a detailed|give me a comprehensive|write an in-depth|create a thorough|explain in detail)\b/gi,
    replacement: (match) => {
      const map = {
        "provide a detailed explanation of": "explain ",
        "give me a comprehensive explanation of": "explain ",
        "write an in-depth explanation of": "explain ",
        "create a thorough explanation of": "explain ",
        "provide a detailed": "provide ",
        "give me a comprehensive": "give ",
        "write an in-depth": "write ",
        "create a thorough": "create ",
        "explain in detail": "explain "
      };
      const lower = match.toLowerCase();
      return map[lower] ?? match;
    },
    context: "all",
    category: "filler",
    minIntensity: "lite"
  },
  {
    name: "filler_adverbs",
    pattern: /(?<![a-z])\b(?:basically|essentially|actually|literally|simply|currently)\b\s*/gi,
    replacement: "",
    context: "all",
    category: "filler",
    minIntensity: "lite"
  },
  {
    name: "articles",
    pattern: /\b(?:[Aa]n|[Aa]|[Tt]he)\s+(?=[a-z])/g,
    replacement: "",
    context: "all",
    category: "terse",
    minIntensity: "full",
    description: "Remove English articles from prose while protected technical tokens stay intact."
  },
  {
    name: "filler_phrases",
    pattern: /^(?:I want to|I need to|I'd like to|I'm looking for)\b\s*/gim,
    replacement: "",
    context: "user",
    category: "filler",
    minIntensity: "lite"
  },
  {
    name: "redundant_openers",
    pattern: /^(?:Hi there|Hello|Good morning|Hey)\s*[,.!?\s]?\s*/gim,
    replacement: "",
    context: "user",
    category: "filler",
    minIntensity: "lite"
  },
  {
    name: "verbose_requests",
    pattern: /\b(?:I was wondering if you could|Would it be possible to)\b\s*/gi,
    replacement: "",
    context: "user",
    category: "filler",
    minIntensity: "lite"
  },
  {
    name: "leader_phrases",
    pattern: /^(?:i'?ll|i will|i can|i'?d|let me|you can|we will|we can|let'?s)\s+(?=[a-z])/gim,
    replacement: "",
    context: "all",
    category: "terse",
    minIntensity: "full",
    description: "Remove leading helper phrases before the actual instruction or answer."
  },
  {
    name: "self_reference",
    pattern: /^(?:I am trying to|I am working on|I have been)\b\s*/gim,
    replacement: "",
    context: "user",
    category: "filler",
    minIntensity: "lite"
  },
  {
    name: "excessive_gratitude",
    pattern: /\b(?:Thank you so much|Thanks in advance|I really appreciate)\b[,.!?\s]*/gi,
    replacement: "",
    context: "all",
    category: "filler",
    minIntensity: "lite"
  },
  {
    name: "qualifier_removal",
    pattern: /\b(?:a bit|a little|somewhat|kind of|sort of)\b\s*/gi,
    replacement: "",
    context: "all",
    category: "filler",
    minIntensity: "lite"
  },
  // ── Category 2: Context Condensation (8+ rules) ──────────────────────
  {
    name: "compound_collapse",
    pattern: /\band any potential\b/gi,
    replacement: "",
    context: "all",
    category: "context",
    minIntensity: "full"
  },
  {
    name: "explanatory_prefix",
    pattern: /\b(?:The function appears to be handling|The code seems to|The class is|This module is)\b/gi,
    replacement: (match) => {
      const map = {
        "the function appears to be handling": "Function:",
        "the code seems to": "Code:",
        "the class is": "Class:",
        "this module is": "Module:"
      };
      return map[match.toLowerCase()] ?? match;
    },
    context: "all",
    category: "context",
    minIntensity: "lite"
  },
  {
    name: "question_to_directive",
    pattern: /\b(?:Can you explain why|Could you show me how|Would you tell me|Can you tell me)\b\s*/gi,
    replacement: (match) => {
      const trimmed = match.trimEnd().toLowerCase();
      const map = {
        "can you explain why": "Explain why ",
        "could you show me how": "Show how ",
        "would you tell me": "Tell me ",
        "can you tell me": "Tell me "
      };
      return map[trimmed] ?? match;
    },
    context: "user",
    category: "context",
    minIntensity: "lite"
  },
  {
    name: "context_setup",
    pattern: /\b(?:I have the following code|Here is my code|Below is the code)\b\s*[:.]?\s*/gi,
    replacement: "Code:",
    context: "user",
    category: "context",
    minIntensity: "lite"
  },
  {
    name: "intent_clarification",
    pattern: /\b(?:What I'm trying to do is|My objective is to|What I need is|I'm aiming to)\b\s*/gi,
    replacement: "Goal:",
    context: "user",
    category: "context",
    minIntensity: "lite"
  },
  {
    name: "background_removal",
    pattern: /\b(?:As you may know,?\s*|As we discussed earlier,?\s*)/gi,
    replacement: "",
    context: "all",
    category: "context",
    minIntensity: "lite"
  },
  {
    name: "meta_commentary",
    pattern: /^(?:Note that|Keep in mind that|Remember that)\b\s*/gim,
    replacement: "",
    context: "all",
    category: "context",
    minIntensity: "lite"
  },
  {
    name: "purpose_statement",
    pattern: /\b(?:for the purpose of|with the goal of|in an effort to|for every)\b/gi,
    replacement: (match) => {
      const map = {
        "for the purpose of": "for",
        "with the goal of": "to",
        "in an effort to": "to",
        "for every": "per"
      };
      return map[match.toLowerCase()] ?? match;
    },
    context: "all",
    category: "context",
    minIntensity: "lite"
  },
  // ── Category 3: Structural Compression (7+ rules) ────────────────────
  {
    name: "list_conjunction",
    pattern: /,\s*and also\s+|,\s*as well as\s+/gi,
    replacement: ", ",
    context: "all",
    category: "structural",
    minIntensity: "full"
  },
  {
    name: "purpose_phrases",
    pattern: /\b(?:in order to|so as to)\b\s*/gi,
    replacement: "to ",
    context: "all",
    category: "structural",
    minIntensity: "lite"
  },
  {
    name: "redundant_quantifiers",
    pattern: /\b(?:each and every single|each and every|any and all)\b/gi,
    replacement: (match) => {
      const map = {
        "each and every single": "each",
        "each and every": "each",
        "any and all": "all"
      };
      return map[match.toLowerCase()] ?? match;
    },
    context: "all",
    category: "structural",
    minIntensity: "full"
  },
  {
    name: "verbose_connectors",
    pattern: /\b(?:furthermore|additionally|moreover|in addition)\b\s*/gi,
    replacement: "also ",
    context: "all",
    category: "structural",
    minIntensity: "lite"
  },
  {
    name: "transition_removal",
    pattern: /^(?:On the other hand,?\s*|In contrast,?\s*|However,?\s*)/gim,
    replacement: "",
    context: "all",
    category: "structural",
    minIntensity: "lite"
  },
  {
    name: "emphasis_removal",
    pattern: /\b(?:very|really|extremely|highly|quite)\s+(?=[a-z])/gi,
    replacement: "",
    context: "all",
    category: "structural",
    minIntensity: "lite"
  },
  {
    name: "passive_voice",
    pattern: /\b(?:is being used|is being called|is being generated|was created|was generated|was implemented)\b/gi,
    replacement: (match) => {
      const map = {
        "is being used": "uses",
        "is being called": "calls",
        "is being generated": "generated",
        "was created": "created",
        "was generated": "generated",
        "was implemented": "implemented"
      };
      return map[match.toLowerCase()] ?? match;
    },
    context: "all",
    category: "structural",
    minIntensity: "full"
  },
  // ── Category 4: Multi-Turn Dedup (5+ rules) ─────────────────────────
  {
    name: "repeated_context",
    pattern: /\b(?:As we discussed earlier|As mentioned before|As previously stated|As I said before)\b[,.]?\s*/gi,
    replacement: "See above. ",
    context: "all",
    category: "dedup",
    minIntensity: "lite"
  },
  {
    name: "repeated_question",
    pattern: /\b(?:Same question as before|I asked this earlier|This is the same question)\b[,.]?\s*/gi,
    replacement: "[same question] ",
    context: "user",
    category: "dedup",
    minIntensity: "lite"
  },
  {
    name: "reestablished_context",
    pattern: /\b(?:Going back to the code above|Referring back to|Returning to)\b\s*/gi,
    replacement: "Re: ",
    context: "all",
    category: "dedup",
    minIntensity: "lite"
  },
  {
    name: "summary_replacement",
    pattern: /\b(?:To summarize what we've discussed|In summary of our conversation|To recap)\b[,.]?\s*/gi,
    replacement: "Summary: ",
    context: "assistant",
    category: "dedup",
    minIntensity: "lite"
  },
  // ── Category 5: Ultra Abbreviations ─────────────────────────────────
  {
    name: "ultra_abbreviations",
    pattern: /\b(?:database|configuration|function|request|response|implementation|authentication|authorization|application|dependency|dependencies)\b/gi,
    replacement: (match) => {
      const map = {
        database: "DB",
        configuration: "config",
        function: "fn",
        request: "req",
        response: "res",
        implementation: "impl",
        authentication: "auth",
        authorization: "authz",
        application: "app",
        dependency: "dep",
        dependencies: "deps"
      };
      return map[match.toLowerCase()] ?? match;
    },
    context: "all",
    category: "ultra",
    minIntensity: "ultra"
  }
];
var INTENSITY_RANK = { lite: 0, full: 1, ultra: 2 };
function getRulesForContext(context, intensity = "full", language = "en") {
  const rank = INTENSITY_RANK[intensity] ?? INTENSITY_RANK.full;
  const fileRules = language ? loadAllRulesForLanguage(language) : [];
  const rules = fileRules.length > 0 ? fileRules : CAVEMAN_RULES;
  const selected = rules.filter((rule) => {
    const minRank = INTENSITY_RANK[rule.minIntensity ?? "lite"];
    return (rule.context === "all" || rule.context === context) && minRank <= rank;
  });
  return selected.length > 0 ? selected : CAVEMAN_RULES.filter((rule) => {
    const minRank = INTENSITY_RANK[rule.minIntensity ?? "lite"];
    return (rule.context === "all" || rule.context === context) && minRank <= rank;
  });
}

// open-sse/services/compression/validation.ts
function requireExactPresence(label, originalItems, compressed, errors) {
  for (const item of originalItems) {
    if (!compressed.includes(item)) {
      const preview = collapseWhitespaceForPreview(item).slice(0, 80);
      errors.push(`${label} changed or missing: ${preview}`);
    }
  }
}
function isPreviewWhitespace(char) {
  return char === " " || char === "	" || char === "\n" || char === "\r" || char === "\f" || char === "\v";
}
function isHorizontalWhitespace(char) {
  return char === " " || char === "	";
}
function isAsciiDigit(char) {
  return !!char && char >= "0" && char <= "9";
}
function isAsciiUpper(char) {
  return !!char && char >= "A" && char <= "Z";
}
function isAsciiLetter(char) {
  return !!char && (char >= "A" && char <= "Z" || char >= "a" && char <= "z");
}
function isAsciiAlphaNumeric(char) {
  return !!char && (isAsciiLetter(char) || isAsciiDigit(char));
}
function isWordChar2(char) {
  return !!char && (isAsciiAlphaNumeric(char) || char === "_");
}
function isUrlTerminator(char) {
  return isPreviewWhitespace(char) || char === ")" || char === "]" || char === '"' || char === "'" || char === ">";
}
function collapseWhitespaceForPreview(text) {
  let output = "";
  let previousWasWhitespace = false;
  let changed = false;
  for (const char of text) {
    if (isPreviewWhitespace(char)) {
      if (!previousWasWhitespace) {
        output += " ";
      } else {
        changed = true;
      }
      if (char !== " ") changed = true;
      previousWasWhitespace = true;
      continue;
    }
    output += char;
    previousWasWhitespace = false;
  }
  return changed ? output : text;
}
function validateCompression(original, compressed) {
  const errors = [];
  const warnings = [];
  if (typeof original !== "string" || typeof compressed !== "string") {
    return {
      valid: false,
      errors: ["validation received non-string input"],
      warnings,
      fallbackApplied: true
    };
  }
  if (original.length > 0 && compressed.trim().length === 0) {
    errors.push("compressed text is empty");
  }
  requireExactPresence("fenced code block", findFencedCodeBlocks(original), compressed, errors);
  requireExactPresence("inline code", collectInlineCode(original), compressed, errors);
  requireExactPresence("URL", collectUrls(original), compressed, errors);
  requireExactPresence("markdown link", collectMarkdownLinks(original), compressed, errors);
  requireExactPresence("frontmatter", collectFrontmatter(original), compressed, errors);
  requireExactPresence("heading", collectHeadings(original), compressed, errors);
  requireExactPresence("table row", collectTableRows(original), compressed, errors);
  requireExactPresence("math block", collectMathBlocks(original), compressed, errors);
  requireExactPresence("inline math", collectInlineMath(original), compressed, errors);
  requireExactPresence("LaTeX block", collectLatexBlocks(original), compressed, errors);
  requireExactPresence("version", collectVersions(original), compressed, errors);
  requireExactPresence("CONST_CASE", collectConstCase(original), compressed, errors);
  const originalFenceCount = findFencedCodeBlocks(original).length;
  const compressedFenceCount = findFencedCodeBlocks(compressed).length;
  if (compressedFenceCount < originalFenceCount) {
    errors.push(
      `fenced code block count dropped: ${originalFenceCount} -> ${compressedFenceCount}`
    );
  }
  if (compressed.length > original.length) {
    warnings.push("compressed text is longer than original");
  }
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    fallbackApplied: errors.length > 0
  };
}
function collectInlineCode(text) {
  const matches = [];
  for (let index = 0; index < text.length; index++) {
    if (text[index] !== "`") continue;
    const end = text.indexOf("`", index + 1);
    if (end === -1) break;
    const content = text.slice(index + 1, end);
    if (content.length > 0 && !content.includes("\n")) {
      matches.push(text.slice(index, end + 1));
      index = end;
    }
  }
  return matches;
}
function collectUrls(text) {
  const matches = [];
  for (let index = 0; index < text.length; index++) {
    const startsWithHttp = text.startsWith("http://", index);
    const startsWithHttps = text.startsWith("https://", index);
    if (!startsWithHttp && !startsWithHttps) continue;
    if (index > 0 && isWordChar2(text[index - 1])) continue;
    let end = index + (startsWithHttps ? "https://".length : "http://".length);
    while (end < text.length && !isUrlTerminator(text[end])) {
      end++;
    }
    if (end > index) {
      matches.push(text.slice(index, end));
      index = end - 1;
    }
  }
  return matches;
}
function collectMarkdownLinks(text) {
  const matches = [];
  for (let index = 0; index < text.length; index++) {
    if (text[index] !== "[") continue;
    const labelEnd = text.indexOf("]", index + 1);
    if (labelEnd === -1 || labelEnd - index - 1 > 1e3) continue;
    if (text.slice(index + 1, labelEnd).includes("\n")) continue;
    if (text[labelEnd + 1] !== "(") continue;
    const targetStart = labelEnd + 2;
    const maxTargetEnd = Math.min(text.length, targetStart + 2e3);
    let targetEnd = -1;
    for (let cursor = targetStart; cursor < maxTargetEnd; cursor++) {
      if (text[cursor] === "\n") break;
      if (text[cursor] === ")") {
        targetEnd = cursor;
        break;
      }
    }
    if (targetEnd !== -1) {
      matches.push(text.slice(index, targetEnd + 1));
      index = targetEnd;
    }
  }
  return matches;
}
function collectFrontmatter(text) {
  if (!text.startsWith("---\n")) return [];
  const close = text.indexOf("\n---", 4);
  if (close === -1) return [];
  const closeEnd = text.indexOf("\n", close + 4);
  const end = closeEnd === -1 ? text.length : closeEnd + 1;
  return [text.slice(0, end)];
}
function collectHeadings(text) {
  return collectLines(text).filter((line) => {
    let markerCount = 0;
    while (markerCount < line.length && line[markerCount] === "#") {
      markerCount++;
    }
    if (markerCount < 1 || markerCount > 6) return false;
    if (!isPreviewWhitespace(line[markerCount] ?? "")) return false;
    for (let index = markerCount + 1; index < line.length; index++) {
      if (!isPreviewWhitespace(line[index])) return true;
    }
    return false;
  });
}
function collectTableRows(text) {
  return collectLines(text).filter((line) => {
    let index = 0;
    while (index < line.length && isHorizontalWhitespace(line[index])) {
      index++;
    }
    if (line[index] !== "|") return false;
    let pipeCount = 0;
    for (; index < line.length; index++) {
      if (line[index] === "|") pipeCount++;
    }
    return pipeCount >= 2;
  });
}
function collectLines(text) {
  const lines = [];
  let start = 0;
  for (let index = 0; index < text.length; index++) {
    if (text[index] !== "\n") continue;
    lines.push(text.slice(start, index));
    start = index + 1;
  }
  lines.push(text.slice(start));
  return lines;
}
function collectMathBlocks(text) {
  const matches = [];
  let index = 0;
  while (index < text.length) {
    const start = text.indexOf("$$", index);
    if (start === -1) break;
    const end = text.indexOf("$$", start + 2);
    if (end === -1) break;
    if (end - start - 2 <= 1e4) {
      matches.push(text.slice(start, end + 2));
      index = end + 2;
    } else {
      index = start + 2;
    }
  }
  return matches;
}
function collectInlineMath(text) {
  const matches = [];
  for (let index = 0; index < text.length; index++) {
    if (text[index] !== "$") continue;
    if (text[index - 1] === "$") continue;
    const next = text[index + 1];
    if (!next || isPreviewWhitespace(next) || next === "$" || isAsciiDigit(next)) continue;
    const maxEnd = Math.min(text.length, index + 1 + 160);
    for (let cursor = index + 1; cursor < maxEnd; cursor++) {
      const char = text[cursor];
      if (char === "\n") break;
      if (char === "\\") {
        cursor++;
        continue;
      }
      if (char !== "$") continue;
      if (isPreviewWhitespace(text[cursor - 1] ?? "")) continue;
      if (text[cursor + 1] === "$") continue;
      matches.push(text.slice(index, cursor + 1));
      index = cursor;
      break;
    }
  }
  return matches;
}
function collectLatexBlocks(text) {
  const matches = [];
  let index = 0;
  while (index < text.length) {
    const start = text.indexOf("\\begin{", index);
    if (start === -1) break;
    const envStart = start + "\\begin{".length;
    const envEnd = text.indexOf("}", envStart);
    if (envEnd === -1 || envEnd - envStart < 1 || envEnd - envStart > 50) {
      index = envStart;
      continue;
    }
    const env = text.slice(envStart, envEnd);
    if (![...env].every((char) => isAsciiLetter(char) || char === "*")) {
      index = envStart;
      continue;
    }
    const closeToken = `\\end{${env}}`;
    const closeStart = text.indexOf(closeToken, envEnd + 1);
    if (closeStart === -1) {
      index = envEnd + 1;
      continue;
    }
    if (closeStart - envEnd - 1 <= 1e4) {
      const end = closeStart + closeToken.length;
      matches.push(text.slice(start, end));
      index = end;
    } else {
      index = envEnd + 1;
    }
  }
  return matches;
}
function collectVersions(text) {
  const matches = [];
  for (let index = 0; index < text.length; index++) {
    if (!isAsciiDigit(text[index])) continue;
    if (index > 0 && isWordChar2(text[index - 1])) continue;
    let cursor = readDigits(text, index);
    let dotGroups = 0;
    while (dotGroups < 3 && text[cursor] === "." && isAsciiDigit(text[cursor + 1])) {
      cursor = readDigits(text, cursor + 1);
      dotGroups++;
    }
    if (dotGroups < 1) continue;
    if ((text[cursor] === "-" || text[cursor] === "+") && isVersionSuffixChar(text[cursor + 1])) {
      cursor++;
      while (cursor < text.length && isVersionSuffixChar(text[cursor])) {
        cursor++;
      }
    }
    if (isWordChar2(text[cursor])) continue;
    matches.push(text.slice(index, cursor));
    index = cursor - 1;
  }
  return matches;
}
function readDigits(text, start) {
  let cursor = start;
  while (cursor < text.length && isAsciiDigit(text[cursor])) {
    cursor++;
  }
  return cursor;
}
function isVersionSuffixChar(char) {
  return !!char && (isAsciiAlphaNumeric(char) || char === "." || char === "-");
}
function collectConstCase(text) {
  const matches = [];
  for (let index = 0; index < text.length; index++) {
    if (!isAsciiUpper(text[index])) continue;
    if (index > 0 && isWordChar2(text[index - 1])) continue;
    let cursor = index + 1;
    let hasUnderscore = false;
    while (cursor < text.length) {
      const char = text[cursor];
      if (char === "_") {
        if (!isAsciiUpper(text[cursor + 1]) && !isAsciiDigit(text[cursor + 1])) break;
        hasUnderscore = true;
        cursor++;
        continue;
      }
      if (!isAsciiUpper(char) && !isAsciiDigit(char)) break;
      cursor++;
    }
    if (!hasUnderscore || isWordChar2(text[cursor])) continue;
    matches.push(text.slice(index, cursor));
    index = cursor - 1;
  }
  return matches;
}

// open-sse/services/compression/languageDetector.ts
var LANGUAGE_HINTS = {
  it: [/\b(?:perche|perché|pero|però|cioe|cioè|quindi|potresti|vorrei|adesso|errore|grazie|devo|voglio|questo|quello|anche|sono|molto)\b/i],
  "pt-BR": [/\b(?:voce|você|preciso|arquivo|codigo|código|erro|falha|obrigado)\b/i],
  // NOTE: English-ambiguous words are intentionally excluded — "error" (es) and
  // "configuration" (fr) are identical in English and would misclassify English text.
  // Spanish/French keep their distinctive native spellings (fallo / erreur, etc).
  es: [/\b(?:necesito|archivo|codigo|código|fallo|gracias|puedes)\b/i],
  de: [/\b(?:ich|datei|fehler|bitte|kannst|konfiguration|danke)\b/i],
  fr: [/\b(?:fichier|erreur|merci|peux|besoin)\b/i],
  ru: [/\b(?:\u044d\u0442\u043e|\u0447\u0442\u043e|\u043a\u0430\u043a|\u0435\u0441\u043b\u0438|\u0447\u0442\u043e\u0431\u044b|\u043a\u043e\u0442\u043e\u0440\u044b\u0439|\u043c\u043e\u0436\u0435\u0442|\u043d\u0443\u0436\u043d\u043e|\u0435\u0441\u0442\u044c|\u0431\u044b\u043b\u043e|\u0431\u0443\u0434\u0435\u0442|\u043c\u043e\u0436\u043d\u043e|\u0434\u043e\u043b\u0436\u0435\u043d|\u0444\u0430\u0439\u043b|\u043e\u0448\u0438\u0431\u043a\u0430|\u043f\u0440\u043e\u0431\u043b\u0435\u043c\u0430|\u0434\u0430\u043d\u043d\u044b\u0435)\b/i, /[\u0430-\u044f\u0451]/i],
  ja: [/[\u3040-\u30ff]/],
  id: [/\b(?:saya|kamu|anda|dengan|untuk|yang|tidak|bisa|terima\s+kasih|dari)\b/i]
};
function detectCompressionLanguage(text) {
  if (/[一-鿿]/.test(text) && !/[぀-ヿ]/.test(text)) {
    return "zh";
  }
  let best = "en";
  let bestScore = 0;
  for (const [language, patterns] of Object.entries(LANGUAGE_HINTS)) {
    let score = 0;
    for (const pattern of patterns) {
      const global = pattern.flags.includes("g") ? pattern : new RegExp(pattern.source, pattern.flags + "g");
      const matches = text.match(global);
      if (matches) score += matches.length;
    }
    if (score > bestScore) {
      bestScore = score;
      best = language;
    }
  }
  return best;
}

// open-sse/services/compression/toolResultCompressor.ts
var ANSI_RE = /\x1b\[[0-9;]*[a-zA-Z]/g;
var SHELL_PROMPT_RE = /\$\s/;
var JSON_PREFIX_RE = /^\s*[{[]/;
var COMPRESSED_MARKER_RE = /^\[COMPRESSED:/;
function isCodeLikeLine(rawLine) {
  const line = rawLine.trimStart();
  return line.startsWith("import ") || line.startsWith("export ") || line.startsWith("function ") || line.startsWith("class ") || line.startsWith("const ") || line.startsWith("let ") || line.startsWith("var ") || line.startsWith("return ") || line.startsWith("if(") || line.startsWith("if (") || line.startsWith("for(") || line.startsWith("for (") || line.startsWith("while(") || line.startsWith("while (");
}
function parseGrepLinePath(line) {
  const firstColon = line.indexOf(":");
  if (firstColon <= 0) return null;
  const secondColon = line.indexOf(":", firstColon + 1);
  if (secondColon === -1) return null;
  const lineNumber = line.slice(firstColon + 1, secondColon);
  if (!lineNumber || ![...lineNumber].every((char) => char >= "0" && char <= "9")) {
    return null;
  }
  const filePath = line.slice(0, firstColon);
  if (!filePath || /\s/.test(filePath)) return null;
  return filePath;
}
function hasErrorLikeOutput(content) {
  const lower = content.toLowerCase();
  return lower.includes("error:") || lower.includes("error ") || lower.includes("[error]") || lower.includes("exception:") || lower.includes("exception ") || lower.includes("[exception]") || lower.includes("traceback");
}
function compressFileContent(content) {
  const lines = content.split("\n");
  if (lines.length < 3) return null;
  if (!lines.some(isCodeLikeLine)) return null;
  const keep = 20;
  const tail = 5;
  if (lines.length <= keep + tail) return content;
  const head = lines.slice(0, keep).join("\n");
  const tailLines = lines.slice(-tail).join("\n");
  const elided = lines.length - keep - tail;
  return `${head}
\u2026 [${elided} lines elided] \u2026
${tailLines}`;
}
function compressGrepSearch(content) {
  const lines = content.split("\n");
  const grepLines = lines.filter((line) => parseGrepLinePath(line) !== null);
  if (grepLines.length === 0) return null;
  const paths = /* @__PURE__ */ new Set();
  for (const line of grepLines) {
    const filePath = parseGrepLinePath(line);
    if (filePath) paths.add(filePath);
  }
  const top30 = grepLines.slice(0, 30);
  const remaining = grepLines.length - top30.length;
  let result = top30.join("\n");
  if (remaining > 0) {
    result += `
\u2026 [${remaining} more matches]`;
  }
  result += `
Files: ${[...paths].join(", ")}`;
  return result;
}
function compressShellOutput(content) {
  const hasAnsi = ANSI_RE.test(content);
  const hasPrompt = SHELL_PROMPT_RE.test(content);
  if (!hasAnsi && !hasPrompt) return null;
  let cleaned = content.replace(ANSI_RE, "");
  const lines = cleaned.split("\n");
  const last50 = lines.slice(-50);
  const deduped = [];
  for (const line of last50) {
    if (deduped.length === 0 || line !== deduped[deduped.length - 1]) {
      deduped.push(line);
    }
  }
  return deduped.join("\n");
}
function compressJson(content) {
  if (content.length <= 2e3) return null;
  if (!JSON_PREFIX_RE.test(content)) return null;
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    return null;
  }
  if (Array.isArray(parsed)) {
    const arr = parsed;
    if (arr.length <= 7) return content;
    const head = arr.slice(0, 5);
    const tail = arr.slice(-2);
    return JSON.stringify({ type: "array", total: arr.length, first5: head, last2: tail }, null, 2);
  }
  if (typeof parsed === "object" && parsed !== null) {
    const obj = parsed;
    const keys = Object.keys(obj);
    const summary = {};
    for (const key of keys.slice(0, 20)) {
      const val = obj[key];
      if (typeof val === "object" && val !== null) {
        summary[key] = `{\u2026${Object.keys(val).length} keys}`;
      } else {
        summary[key] = val;
      }
    }
    if (keys.length > 20) {
      summary[`_remaining_${keys.length - 20}_keys`] = true;
    }
    return JSON.stringify(summary, null, 2);
  }
  return null;
}
function compressErrorMessage(content) {
  if (!hasErrorLikeOutput(content)) return null;
  const lines = content.split("\n");
  const errorLine = lines[0] || "";
  const stackLines = lines.slice(1);
  const head = stackLines.slice(0, 10);
  const tail = stackLines.length > 10 ? stackLines.slice(-3) : [];
  const middle = stackLines.length > 13 ? [`\u2026 [${stackLines.length - 13} frames elided] \u2026`] : [];
  const result = [errorLine, ...head, ...middle, ...tail].join("\n");
  return result;
}
function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}
function isAnthropicToolResultBlock(value) {
  return !!value && typeof value === "object" && value.type === "tool_result";
}
function compressAnthropicToolResultBlock(block, opts) {
  const content = block.content;
  if (typeof content === "string") {
    if (!content || COMPRESSED_MARKER_RE.test(content)) return { block, saved: 0 };
    const result = compressToolResult(content, opts);
    if (result.strategy === "none" || result.saved <= 0) return { block, saved: 0 };
    return { block: { ...block, content: result.compressed }, saved: result.saved };
  }
  if (Array.isArray(content)) {
    let saved = 0;
    let changed = false;
    const nextContent = content.map((part) => {
      if (!part || typeof part !== "object" || part.type !== "text" || typeof part.text !== "string") {
        return part;
      }
      const text = part.text;
      if (!text || COMPRESSED_MARKER_RE.test(text)) return part;
      const result = compressToolResult(text, opts);
      if (result.strategy === "none" || result.saved <= 0) return part;
      saved += result.saved;
      changed = true;
      return { ...part, text: result.compressed };
    });
    if (!changed) return { block, saved: 0 };
    return { block: { ...block, content: nextContent }, saved };
  }
  return { block, saved: 0 };
}
function compressToolResult(content, opts) {
  if (opts.fileContent) {
    const result = compressFileContent(content);
    if (result !== null) {
      return {
        compressed: result,
        strategy: "fileContent",
        saved: estimateTokens(content) - estimateTokens(result)
      };
    }
  }
  if (opts.grepSearch) {
    const result = compressGrepSearch(content);
    if (result !== null) {
      return {
        compressed: result,
        strategy: "grepSearch",
        saved: estimateTokens(content) - estimateTokens(result)
      };
    }
  }
  if (opts.shellOutput) {
    const result = compressShellOutput(content);
    if (result !== null) {
      return {
        compressed: result,
        strategy: "shellOutput",
        saved: estimateTokens(content) - estimateTokens(result)
      };
    }
  }
  if (opts.json) {
    const result = compressJson(content);
    if (result !== null) {
      return {
        compressed: result,
        strategy: "json",
        saved: estimateTokens(content) - estimateTokens(result)
      };
    }
  }
  if (opts.errorMessage) {
    const result = compressErrorMessage(content);
    if (result !== null) {
      return {
        compressed: result,
        strategy: "errorMessage",
        saved: estimateTokens(content) - estimateTokens(result)
      };
    }
  }
  return { compressed: content, strategy: "none", saved: 0 };
}

// open-sse/services/compression/caveman.ts
var RULE_KEYWORDS = {
  redundant_phrasing: ["make sure", "be sure"],
  redundant_because: ["due to the fact", "the reason is because"],
  redundant_directive: ["it is important", "you should", "remember to"],
  pleasantries: [
    "sure",
    "certainly",
    "of course",
    "happy to",
    "thanks",
    "thank you",
    "glad to help",
    "glad to",
    "no problem",
    "you're welcome",
    "youre welcome",
    "absolutely"
  ],
  polite_framing: [
    "please",
    "kindly",
    "could you please",
    "would you please",
    "can you please",
    "i would like you",
    "i want you",
    "i need you"
  ],
  hedging: [
    "it seems like",
    "it appears that",
    "i think that",
    "i believe that",
    "probably",
    "possibly",
    "maybe it"
  ],
  verbose_instructions: [
    "provide a detailed",
    "give me a comprehensive",
    "write an in-depth",
    "create a thorough",
    "explain in detail"
  ],
  filler_adverbs: ["basically", "essentially", "actually", "literally", "simply", "currently"],
  filler_phrases: ["i want to", "i need to", "i'd like to", "i'm looking for"],
  redundant_openers: ["hi there", "hello", "good morning", "hey"],
  verbose_requests: ["i was wondering", "would it be possible"],
  leader_phrases: [
    "i'll",
    "i will",
    "i can",
    "i'd",
    "let me",
    "you can",
    "we will",
    "we can",
    "let's"
  ],
  self_reference: ["i am trying to", "i am working on", "i have been"],
  excessive_gratitude: ["thank you so much", "thanks in advance", "i really appreciate"],
  qualifier_removal: ["a bit", "a little", "somewhat", "kind of", "sort of"],
  softeners: ["if possible", "when you get a chance", "at your convenience", "just wondering"],
  uncertainty_fillers: ["i guess", "i suppose", "more or less", "in a way"],
  assistant_fillers: ["here's", "below is", "this is"],
  compound_collapse: ["and any potential"],
  explanatory_prefix: [
    "the function appears to be handling",
    "the code seems to",
    "the class is",
    "this module is"
  ],
  question_to_directive: [
    "can you explain why",
    "could you show me how",
    "would you tell me",
    "can you tell me"
  ],
  context_setup: ["i have the following code", "here is my code", "below is the code"],
  intent_clarification: [
    "what i'm trying to do",
    "my objective is to",
    "what i need is",
    "i'm aiming to"
  ],
  background_removal: ["as you may know", "as we discussed earlier"],
  meta_commentary: ["note that", "keep in mind", "remember that"],
  purpose_statement: ["for the purpose of", "with the goal of", "in an effort to", "for every"],
  list_conjunction: ["and also", "as well as"],
  purpose_phrases: ["in order to", "so as to"],
  redundant_quantifiers: ["each and every", "any and all"],
  all_quantifier: ["any and all"],
  verbose_connectors: ["furthermore", "additionally", "moreover", "in addition"],
  transition_removal: ["on the other hand", "in contrast", "however"],
  emphasis_removal: ["very", "really", "extremely", "highly", "quite"],
  passive_voice: [
    "is being used",
    "is being called",
    "is being generated",
    "was created",
    "was generated",
    "was implemented"
  ],
  repeated_context: [
    "as we discussed earlier",
    "as mentioned before",
    "as previously stated",
    "as i said before"
  ],
  repeated_question: [
    "same question as before",
    "i asked this earlier",
    "this is the same question"
  ],
  reestablished_context: ["going back to the code above", "referring back to", "returning to"],
  summary_replacement: ["to summarize", "in summary of our conversation", "to recap"],
  ultra_abbreviations: ["database"],
  ultra_config_abbreviation: ["configuration"],
  ultra_function_abbreviation: ["function"],
  ultra_request_abbreviation: ["request"],
  ultra_response_abbreviation: ["response"],
  ultra_implementation_abbreviation: ["implementation"],
  ultra_authentication_abbreviation: ["authentication"],
  ultra_authorization_abbreviation: ["authorization"],
  ultra_application_abbreviation: ["application"],
  ultra_dependency_abbreviation: ["dependency", "dependencies"],
  ultra_common_abbreviations: [
    "implementation",
    "authentication",
    "authorization",
    "application",
    "dependency",
    "dependencies"
  ]
};
var ARTICLE_HINT_RE = /\b(?:a|an|the)\b/;
function shouldAttemptRule(ruleName, lowerText) {
  if (ruleName === "articles") {
    ARTICLE_HINT_RE.lastIndex = 0;
    return ARTICLE_HINT_RE.test(lowerText);
  }
  const keywords = RULE_KEYWORDS[ruleName];
  return !keywords || keywords.some((keyword) => lowerText.includes(keyword));
}
function applyRulesToText(text, rules) {
  let result = text;
  const lowerResult = text.toLowerCase();
  const appliedRules = [];
  for (const rule of rules) {
    if (!shouldAttemptRule(rule.name, lowerResult)) continue;
    const before = result;
    const { pattern, replacement } = rule;
    if (typeof replacement === "function") {
      const fn = replacement;
      result = result.replace(pattern, (...args) => {
        const match = args[0];
        return fn(match, ...args.slice(1, -2));
      });
    } else {
      result = result.replace(pattern, replacement);
    }
    if (result !== before) {
      appliedRules.push(rule.name);
    }
  }
  return { text: result, appliedRules };
}
function cleanupArtifacts(text) {
  if (!text) return "";
  return text.replace(/[ \t]{2,}/g, " ").replace(/[ \t]+([,.;:!?])/g, "$1").replace(/([.!?]){2,}/g, (m) => m[m.length - 1]).replace(/[ \t]+$/gm, "").replace(/\n{3,}/g, "\n\n").replace(/^\n+/, "").replace(/\n+$/, "");
}
function isCodeDominantText(text) {
  const lines = text.split("\n").filter((line) => line.trim().length > 0);
  if (lines.length < 3) return false;
  const codeLikeCount = lines.filter(isCodeLikeLine).length;
  return codeLikeCount / lines.length >= 0.3;
}
function recapitalizeSentences(text) {
  return text.replace(/(^|[.!?][ \t]|\n[ \t]*)([a-z])/g, (_match, prefix, char) => {
    return `${prefix}${char.toUpperCase()}`;
  });
}
function createCavemanStats(originalTokens, compressedTokens, techniquesUsed, rulesApplied, durationMs) {
  const savingsPercent = originalTokens > 0 ? Math.round((originalTokens - compressedTokens) / originalTokens * 1e4) / 100 : 0;
  return {
    originalTokens,
    compressedTokens,
    savingsPercent,
    techniquesUsed,
    mode: "standard",
    timestamp: Date.now(),
    ...rulesApplied && rulesApplied.length > 0 ? { rulesApplied } : {},
    durationMs
  };
}
function compileUserPreservePatterns(patterns) {
  const compiled = [];
  const warnings = [];
  for (const pattern of patterns) {
    try {
      compiled.push(new RegExp(pattern, "g"));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      warnings.push(`Invalid preservePatterns regex ignored: ${pattern} (${message})`);
    }
  }
  return { patterns: compiled, warnings };
}
var PROTECTED_STRUCTURE_RE = /```|~~~|`|https?:\/\/|\[[^\]\n]{1,1000}\]\([^)[ \t\n]{1,2000}(?:[ \t]+"[^"]{0,1000}")?\)|^#{1,6}\s+|^[ \t]*\|(?:[^|\n]{0,1000}\|){1,100}[ \t]*$|\$\$|\\\[|\\begin\{|^\s*#(?:set|show|let|import|include)\b|\b[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+\b|\bprocess\.env\.[A-Za-z_][A-Za-z0-9_]*\b|\$[A-Z_][A-Z0-9_]*\b|\b\d+(?:\.\d+){1,3}(?:[-+][A-Za-z0-9.-]+)?\b|\b[a-zA-Z_$][\w$]*(?:\.[a-zA-Z_$][\w$]*)+\(\)?|\b[A-Za-z_$][\w$]*[ \t]*\([^()\n]{0,1000}\)|(?:^|\s)(?:\.{0,2}\/[A-Za-z0-9_@./-]+|[A-Za-z]:\\[A-Za-z0-9_.\\/-]+)|\b(?:TypeError|ReferenceError|SyntaxError|RangeError|URIError|EvalError|Error|Exception):[^\n]{0,1000}/im;
var PROTECTED_STRUCTURE_PREFILTER_RE = /[`~\[\]\|$#\\/:_()0-9]/;
function hasProtectedStructure(text) {
  if (!PROTECTED_STRUCTURE_PREFILTER_RE.test(text)) return false;
  PROTECTED_STRUCTURE_RE.lastIndex = 0;
  return PROTECTED_STRUCTURE_RE.test(text);
}
function cavemanCompress(body, options) {
  const startMs = performance.now();
  const config = { ...DEFAULT_CAVEMAN_CONFIG, ...options };
  const emptyResult = () => ({
    body,
    compressed: false,
    stats: createCompressionStats(
      body,
      body,
      "standard",
      []
    )
  });
  if (!config.enabled) {
    return emptyResult();
  }
  if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
    return emptyResult();
  }
  let totalOriginalTokens = 0;
  let totalCompressedTokens = 0;
  const allAppliedRules = [];
  const validationWarnings = [];
  const validationErrors = [];
  let fallbackApplied = false;
  let preservedBlockCount = 0;
  const customPreservation = compileUserPreservePatterns(config.preservePatterns ?? []);
  validationWarnings.push(...customPreservation.warnings);
  const compressedMessages = body.messages.map((msg) => {
    if (typeof msg.content !== "string" && !Array.isArray(msg.content)) {
      return msg;
    }
    const contentStr = typeof msg.content === "string" ? msg.content : msg.content.map(
      (part) => part && typeof part === "object" && "text" in part && typeof part.text === "string" ? part.text : ""
    ).filter(Boolean).join("\n");
    totalOriginalTokens += estimateCompressionTokens(contentStr);
    if (!contentStr || contentStr.length < config.minMessageLength) {
      totalCompressedTokens += estimateCompressionTokens(contentStr);
      return msg;
    }
    if (!config.compressRoles.includes(msg.role)) {
      totalCompressedTokens += estimateCompressionTokens(contentStr);
      return msg;
    }
    const compressTextPart = (textPart) => {
      if (!textPart || textPart.length < config.minMessageLength) return textPart;
      const shouldPreserve = customPreservation.patterns.length > 0 || hasProtectedStructure(textPart);
      const { text: extractedText, blocks } = shouldPreserve ? extractPreservedBlocks(textPart, {
        preservePatterns: customPreservation.patterns
      }) : { text: textPart, blocks: [] };
      preservedBlockCount += blocks.length;
      const detectedLanguage = config.autoDetectLanguage ? detectCompressionLanguage(textPart) : config.language ?? "en";
      const enabledPacks = config.enabledLanguagePacks ?? ["en", detectedLanguage];
      const language = config.autoDetectLanguage ? detectedLanguage : enabledPacks.includes(detectedLanguage) ? detectedLanguage : enabledPacks.includes("en") ? "en" : detectedLanguage;
      const rules = getRulesForContext(msg.role, config.intensity, language).filter(
        (rule) => !config.skipRules.includes(rule.name)
      );
      const { text: rulesApplied, appliedRules } = applyRulesToText(extractedText, rules);
      allAppliedRules.push(...appliedRules);
      const normalized = isCodeDominantText(rulesApplied) ? rulesApplied : recapitalizeSentences(cleanupArtifacts(rulesApplied));
      const cleaned2 = blocks.length > 0 ? cleanupArtifacts(restorePreservedBlocks(normalized, blocks)) : normalized;
      if (shouldPreserve || blocks.length > 0) {
        const validation = validateCompression(textPart, cleaned2);
        validationWarnings.push(...validation.warnings);
        if (!validation.valid) {
          validationErrors.push(...validation.errors);
          fallbackApplied = true;
          return textPart;
        }
      }
      return cleaned2;
    };
    const compressedMessage = mapTextContent(msg, compressTextPart);
    const cleaned = typeof compressedMessage.content === "string" ? compressedMessage.content : Array.isArray(compressedMessage.content) ? compressedMessage.content.map(
      (part) => part && typeof part === "object" && "text" in part && typeof part.text === "string" ? part.text : ""
    ).filter(Boolean).join("\n") : contentStr;
    totalCompressedTokens += estimateCompressionTokens(cleaned);
    return compressedMessage;
  });
  const durationMs = performance.now() - startMs;
  const uniqueRules = [...new Set(allAppliedRules)];
  const stats = createCavemanStats(
    totalOriginalTokens,
    totalCompressedTokens,
    uniqueRules.length > 0 ? ["caveman-rules"] : [],
    uniqueRules.length > 0 ? uniqueRules : void 0,
    Math.round(durationMs * 100) / 100
  );
  if (validationWarnings.length > 0) stats.validationWarnings = [...new Set(validationWarnings)];
  if (validationErrors.length > 0) stats.validationErrors = [...new Set(validationErrors)];
  if (fallbackApplied) stats.fallbackApplied = true;
  if (preservedBlockCount > 0) stats.preservedBlockCount = preservedBlockCount;
  const compressed = totalCompressedTokens < totalOriginalTokens;
  const result = {
    body: { ...body, messages: compressedMessages },
    compressed,
    stats
  };
  return result;
}

// open-sse/services/compression/progressiveAging.ts
var COMPRESSED_MARKER_RE2 = /^\[COMPRESSED:/;
var JSON_PREFIX_RE2 = /^\s*[{[]/;
var FENCE_RE = /^\s*```/;
function estimateTokens2(text) {
  return Math.ceil(text.length / 4);
}
function structuredKind(text) {
  const trimmed = text.trim();
  if (FENCE_RE.test(trimmed) && trimmed.endsWith("```")) return "fenced";
  if (JSON_PREFIX_RE2.test(trimmed)) {
    try {
      JSON.parse(trimmed);
      return "json";
    } catch {
      return null;
    }
  }
  return null;
}
function tagAged(tier, originalText, compressed) {
  const kind = structuredKind(originalText);
  if (kind === "json") {
    return originalText;
  }
  if (kind === "fenced") {
    return `[COMPRESSED:aging:${tier}]
${originalText}`;
  }
  return `[COMPRESSED:aging:${tier}] ${compressed}`;
}
function setContent(msg, newContent) {
  return replaceTextContent(msg, newContent);
}
function applyAging(messages, thresholds, summarizer, preserveSystemPrompt = true, spareUserIndex) {
  const t = thresholds ?? DEFAULT_AGGRESSIVE_CONFIG.thresholds;
  const sum = summarizer ?? {
    summarize: (msgs) => {
      const typed2 = msgs;
      const last = typed2.filter((m) => m.role === "assistant").pop();
      return last ? extractTextContent(last.content).slice(0, 200) : "";
    }
  };
  const typed = messages;
  if (typed.length === 0) return { messages: [], saved: 0 };
  const lastUserIdx = spareUserIndex !== void 0 ? spareUserIndex : typed.findLastIndex((m) => m.role === "user");
  const totalMessages = typed.length;
  const result = [];
  let saved = 0;
  for (let i = 0; i < typed.length; i++) {
    const msg = typed[i];
    const text = extractTextContent(msg.content);
    if (preserveSystemPrompt && msg.role === "system" || COMPRESSED_MARKER_RE2.test(text) || i === lastUserIdx) {
      result.push(msg);
      continue;
    }
    const distanceFromEnd = totalMessages - 1 - i;
    if (distanceFromEnd <= t.verbatim) {
      result.push(msg);
    } else if (distanceFromEnd <= t.light) {
      const compressed = applyLiteCompression({ messages: [msg] });
      if (compressed?.body?.messages?.[0]?.content) {
        const newContent = typeof compressed.body.messages[0].content === "string" ? compressed.body.messages[0].content : extractTextContent(compressed.body.messages[0].content);
        const tagged = tagAged("light", text, newContent);
        saved += estimateTokens2(text) - estimateTokens2(tagged);
        result.push(setContent(msg, tagged));
      } else {
        result.push(msg);
      }
    } else if (distanceFromEnd <= t.moderate) {
      const compressed = cavemanCompress({ messages: [msg] });
      if (compressed?.body?.messages?.[0]?.content) {
        const newContent = typeof compressed.body.messages[0].content === "string" ? compressed.body.messages[0].content : extractTextContent(compressed.body.messages[0].content);
        const tagged = tagAged("moderate", text, newContent);
        saved += estimateTokens2(text) - estimateTokens2(tagged);
        result.push(setContent(msg, tagged));
      } else {
        result.push(msg);
      }
    } else {
      if (msg.role === "assistant") {
        const summary = sum.summarize([msg]);
        const tagged = tagAged("fullSummary", text, summary);
        saved += estimateTokens2(text) - estimateTokens2(tagged);
        result.push(setContent(msg, tagged));
      } else if (msg.role === "user") {
        const firstLine = text.split("\n")[0]?.slice(0, 120) ?? "";
        const tagged = tagAged("fullSummary", text, firstLine);
        saved += estimateTokens2(text) - estimateTokens2(tagged);
        result.push(setContent(msg, tagged));
      } else {
        result.push(msg);
      }
    }
  }
  return { messages: result, saved: Math.max(0, saved) };
}

// open-sse/services/compression/summarizer.ts
var COMPRESSED_MARKER_RE3 = /^\[COMPRESSED:/;
var INTENT_TRIGGERS = /^(?:request|fix|implement|add|remove|update|refactor|create|delete|change|build)\s*:/i;
var FILE_EXTENSIONS = /* @__PURE__ */ new Set([
  "ts",
  "tsx",
  "js",
  "jsx",
  "py",
  "md",
  "json",
  "sql",
  "css",
  "html",
  "yaml",
  "yml",
  "sh",
  "rb",
  "go",
  "rs",
  "java",
  "c",
  "cpp",
  "h",
  "hpp"
]);
function stripTokenPunctuation(token) {
  let start = 0;
  let end = token.length;
  const leading = /* @__PURE__ */ new Set(["'", '"', "`", "(", "[", "{"]);
  const trailing = /* @__PURE__ */ new Set(["'", '"', "`", ")", "]", "}", ",", ";", ":"]);
  while (start < end && leading.has(token[start])) start++;
  while (end > start && trailing.has(token[end - 1])) end--;
  return token.slice(start, end);
}
function getKnownFilePathToken(token) {
  const clean = stripTokenPunctuation(token);
  const lastDot = clean.lastIndexOf(".");
  if (lastDot <= 0 || lastDot === clean.length - 1) return null;
  const extension = clean.slice(lastDot + 1).toLowerCase();
  if (!FILE_EXTENSIONS.has(extension)) return null;
  if (!clean.includes("/") && !clean.includes(".")) return null;
  return clean;
}
function extractFilePathTokens(text) {
  const paths = [];
  for (const token of text.split(/\s+/)) {
    const filePath = getKnownFilePathToken(token);
    if (filePath) paths.push(filePath);
  }
  return paths;
}
function extractErrorSnippets(text) {
  const snippets = [];
  for (const segment of text.split(/[.\n]/)) {
    const trimmed = segment.trim();
    if (!trimmed) continue;
    const lower = trimmed.toLowerCase();
    if (trimmed.includes("TypeError:") || trimmed.includes("ReferenceError:") || trimmed.includes("SyntaxError:") || trimmed.includes("RangeError:") || trimmed.includes("URIError:") || trimmed.includes("EvalError:") || trimmed.includes("Error:") || trimmed.includes("Exception:") || lower.includes("error ts")) {
      snippets.push(trimmed);
    }
  }
  return snippets;
}
function extractIntents(messages) {
  const intents = [];
  for (const msg of messages) {
    if (msg.role !== "user") continue;
    const text = extractText(msg.content);
    if (!text) continue;
    const firstLine = text.split("\n")[0]?.trim();
    if (firstLine && INTENT_TRIGGERS.test(firstLine)) {
      intents.push(firstLine.slice(0, 120));
    } else if (intents.length === 0 && firstLine) {
      intents.push(firstLine.slice(0, 120));
    }
  }
  return intents;
}
function extractFilePaths(messages) {
  const paths = /* @__PURE__ */ new Set();
  for (const msg of messages) {
    const text = extractText(msg.content);
    if (!text) continue;
    const matches = extractFilePathTokens(text);
    for (const m of matches) {
      paths.add(m);
    }
  }
  return [...paths].slice(0, 20);
}
function extractErrors(messages) {
  const errors = [];
  for (const msg of messages) {
    const text = extractText(msg.content);
    if (!text) continue;
    for (const match of extractErrorSnippets(text)) errors.push(match.slice(0, 150));
  }
  return errors.slice(0, 10);
}
function extractLastDecision(messages) {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "assistant") {
      const text = extractText(messages[i].content);
      if (text) return text;
    }
  }
  return "";
}
function trimCodeFences(text) {
  let output = "";
  let cursor = 0;
  while (cursor < text.length) {
    const start = text.indexOf("```", cursor);
    if (start === -1) {
      output += text.slice(cursor);
      break;
    }
    const openingLineEnd = text.indexOf("\n", start + 3);
    if (openingLineEnd === -1) {
      output += text.slice(cursor);
      break;
    }
    const closeStart = text.indexOf("\n```", openingLineEnd + 1);
    if (closeStart === -1) {
      output += text.slice(cursor);
      break;
    }
    const closeEnd = closeStart + 4;
    const opening = text.slice(start, openingLineEnd);
    const code = text.slice(openingLineEnd + 1, closeStart);
    const lines = code.split("\n");
    output += text.slice(cursor, start);
    if (lines.length <= 4) {
      output += text.slice(start, closeEnd);
    } else {
      const head = lines.slice(0, 3).join("\n");
      const tail = lines[lines.length - 1];
      output += `${opening}
${head}
\u2026
${tail}
\`\`\``;
    }
    cursor = closeEnd;
  }
  return output;
}
function extractText(content) {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content.filter(
      (p) => typeof p === "object" && p !== null && "text" in p
    ).map((p) => p.text ?? "").join("\n");
  }
  return "";
}
var RuleBasedSummarizer = class {
  summarize(messages, opts) {
    const maxLen = opts?.maxLen ?? 2e3;
    const preserveCode = opts?.preserveCode ?? true;
    const typed = messages;
    const filtered = typed.filter((msg) => {
      const text = extractText(msg.content);
      if (!text || text.trim().length === 0) return false;
      return !COMPRESSED_MARKER_RE3.test(text);
    });
    if (filtered.length === 0) return "";
    const intents = extractIntents(filtered);
    const files = extractFilePaths(filtered);
    const errors = extractErrors(filtered);
    const decision = extractLastDecision(filtered);
    const parts = ["[COMPRESSED:summary]"];
    if (intents.length > 0) {
      parts.push(`Intents: ${intents.join("; ")}.`);
    }
    if (files.length > 0) {
      parts.push(`Files touched: ${files.join(", ")}.`);
    }
    if (errors.length > 0) {
      parts.push(`Errors: ${errors.join("; ")}.`);
    }
    if (decision) {
      const processed = preserveCode ? trimCodeFences(decision) : decision;
      parts.push(`Last decision: ${processed.slice(0, 200)}.`);
    }
    let result = parts.join(" ");
    if (result.length > maxLen) {
      result = result.slice(0, maxLen - 3) + "...";
    }
    return result;
  }
};

// open-sse/services/compression/aggressive.ts
var COMPRESSED_MARKER_RE4 = /^\[COMPRESSED:/;
function setContent2(msg, newContent) {
  return replaceTextContent(msg, newContent);
}
function estimateTokens3(text) {
  return Math.ceil(text.length / 4);
}
function compressAggressive(messages, config, stats) {
  const cfg = {
    ...DEFAULT_AGGRESSIVE_CONFIG,
    ...config,
    thresholds: { ...DEFAULT_AGGRESSIVE_CONFIG.thresholds, ...config?.thresholds ?? {} },
    toolStrategies: {
      ...DEFAULT_AGGRESSIVE_CONFIG.toolStrategies,
      ...config?.toolStrategies ?? {}
    }
  };
  const summarizer = new RuleBasedSummarizer();
  const resultStats = stats ?? {
    originalTokens: 0,
    compressedTokens: 0,
    savingsPercent: 0,
    techniquesUsed: [],
    mode: "aggressive",
    timestamp: Date.now()
  };
  const originalTokens = messages.reduce(
    (sum, m) => sum + estimateTokens3(extractTextContent(m.content)),
    0
  );
  resultStats.originalTokens = originalTokens;
  let currentMessages = [...messages];
  let summarizerSavings = 0;
  let toolResultSavings = 0;
  let agingSavings = 0;
  const lastUserIdx = currentMessages.findLastIndex((m) => m.role === "user");
  try {
    const afterToolResult = currentMessages.map((msg) => {
      if (cfg.preserveSystemPrompt !== false && msg.role === "system") return msg;
      if (msg.role === "tool" || msg.role === "function") {
        const text = extractTextContent(msg.content);
        if (!text || COMPRESSED_MARKER_RE4.test(text)) return msg;
        const result = compressToolResult(text, cfg.toolStrategies);
        if (result.strategy === "none" || result.saved <= 0) return msg;
        toolResultSavings += result.saved;
        return setContent2(msg, result.compressed);
      }
      if (!Array.isArray(msg.content)) return msg;
      if (!msg.content.some(isAnthropicToolResultBlock)) return msg;
      let blockSavings = 0;
      const nextContent = msg.content.map((part) => {
        if (!isAnthropicToolResultBlock(part)) return part;
        const { block, saved } = compressAnthropicToolResultBlock(part, cfg.toolStrategies);
        blockSavings += saved;
        return block;
      });
      if (blockSavings <= 0) return msg;
      toolResultSavings += blockSavings;
      return { ...msg, content: nextContent };
    });
    currentMessages = afterToolResult;
  } catch (err) {
  }
  try {
    const agingResult = applyAging(
      currentMessages,
      cfg.thresholds,
      summarizer,
      cfg.preserveSystemPrompt !== false,
      lastUserIdx
    );
    agingSavings = agingResult.saved;
    currentMessages = agingResult.messages;
  } catch (err) {
  }
  if (cfg.summarizerEnabled) {
    try {
      currentMessages = currentMessages.map((msg, idx) => {
        if (cfg.preserveSystemPrompt !== false && msg.role === "system") return msg;
        if (idx === lastUserIdx) return msg;
        const text = extractTextContent(msg.content);
        if (!text || COMPRESSED_MARKER_RE4.test(text)) return msg;
        if (text.length <= cfg.maxTokensPerMessage * 4) return msg;
        const summary = summarizer.summarize([msg], {
          maxLen: cfg.maxTokensPerMessage,
          preserveCode: true
        });
        if (summary && summary.length < text.length) {
          summarizerSavings += estimateTokens3(text) - estimateTokens3(summary);
          const finalSummary = COMPRESSED_MARKER_RE4.test(summary) ? summary : `[COMPRESSED:summary] ${summary}`;
          return setContent2(msg, finalSummary);
        }
        return msg;
      });
    } catch (err) {
    }
  }
  const compressedTokens = currentMessages.reduce(
    (sum, m) => sum + estimateTokens3(extractTextContent(m.content)),
    0
  );
  resultStats.compressedTokens = compressedTokens;
  resultStats.savingsPercent = originalTokens > 0 ? (originalTokens - compressedTokens) / originalTokens * 100 : 0;
  if (resultStats.savingsPercent < cfg.minSavingsThreshold * 100) {
    try {
      const cavemanResult = cavemanCompress(
        {
          messages: currentMessages
        },
        { enabled: true }
      );
      if (cavemanResult?.compressed && cavemanResult.body?.messages) {
        const rawMsgs = cavemanResult.body.messages;
        const candidateMsgs = rawMsgs.map(
          (msg, idx) => idx === lastUserIdx ? currentMessages[idx] : msg
        );
        const candidateTokens = candidateMsgs.reduce(
          (sum, m) => sum + estimateTokens3(extractTextContent(m.content)),
          0
        );
        const candidateSavings = originalTokens > 0 ? (originalTokens - candidateTokens) / originalTokens * 100 : 0;
        if (candidateSavings > resultStats.savingsPercent) {
          currentMessages = candidateMsgs;
          resultStats.compressedTokens = candidateTokens;
          resultStats.savingsPercent = candidateSavings;
          resultStats.techniquesUsed.push("caveman-fallback");
        }
      }
    } catch (err) {
    }
    try {
      const liteResult = applyLiteCompression(
        { messages: currentMessages },
        { preserveSystemPrompt: cfg.preserveSystemPrompt !== false }
      );
      if (liteResult?.compressed && liteResult.body?.messages) {
        const rawMsgs = liteResult.body.messages;
        const candidateMsgs = rawMsgs.map(
          (msg, idx) => idx === lastUserIdx ? currentMessages[idx] : msg
        );
        const candidateTokens = candidateMsgs.reduce(
          (sum, m) => sum + estimateTokens3(extractTextContent(m.content)),
          0
        );
        const candidateSavings = originalTokens > 0 ? (originalTokens - candidateTokens) / originalTokens * 100 : 0;
        if (candidateSavings > resultStats.savingsPercent) {
          currentMessages = candidateMsgs;
          resultStats.compressedTokens = candidateTokens;
          resultStats.savingsPercent = candidateSavings;
          resultStats.techniquesUsed.push("lite-fallback");
        }
      }
    } catch (err) {
    }
  }
  resultStats.techniquesUsed.push(
    ...toolResultSavings > 0 ? ["toolResult"] : [],
    ...agingSavings > 0 ? ["aging"] : [],
    ...summarizerSavings > 0 ? ["summarizer"] : []
  );
  resultStats.aggressive = {
    summarizerSavings,
    toolResultSavings,
    agingSavings
  };
  return { messages: currentMessages, stats: resultStats };
}

// open-sse/services/compression/engines/llmlingua/worker.ts
import { Worker } from "node:worker_threads";
import path3 from "node:path";
import fs3 from "node:fs";
import { pathToFileURL } from "node:url";

// open-sse/services/compression/engines/llmlingua/constants.ts
var DEFAULT_LLMLINGUA_MODEL = "tinybert";
var LLMLINGUA_MODELS = {
  tinybert: {
    id: "tinybert",
    hfRepo: "atjsh/llmlingua-2-js-tinybert-meetingbank",
    factory: "WithBERTMultilingual",
    dtype: "fp32",
    subfolder: "",
    sizeMB: 57,
    label: "TinyBERT (57MB, fast \u2014 default)"
  },
  "bert-base": {
    id: "bert-base",
    hfRepo: "Arcoldd/llmlingua4j-bert-base-onnx",
    factory: "WithBERTMultilingual",
    dtype: "fp32",
    subfolder: "",
    sizeMB: 710,
    label: "BERT-base (710MB, higher accuracy)"
  }
};
var LLMLINGUA_WORKER_TIMEOUT_MS = 5e3;
var LLMLINGUA_WORKER_IDLE_MS = 3e5;

// open-sse/services/compression/engines/llmlingua/modelStore.ts
function resolveLlmlinguaModel(modelId) {
  if (typeof modelId === "string" && modelId.length > 0 && LLMLINGUA_MODELS[modelId]) {
    return LLMLINGUA_MODELS[modelId];
  }
  return LLMLINGUA_MODELS[DEFAULT_LLMLINGUA_MODEL];
}

// open-sse/utils/optionalPacks.ts
import os2 from "node:os";
import path2 from "node:path";
import fs2 from "node:fs";
var OPTIONAL_PACK_NAMES = ["ml-runtime", "browser-runtime"];
function resolveDataDir(override) {
  return override || process.env.DATA_DIR || path2.join(os2.homedir(), ".omniroute");
}
function packsRootDir(dataDirOverride) {
  return path2.join(resolveDataDir(dataDirOverride), "packs");
}
function packInstallDir(name, dataDirOverride) {
  return path2.join(packsRootDir(dataDirOverride), name);
}
function packNodeModulesDir(name, dataDirOverride) {
  return path2.join(packInstallDir(name, dataDirOverride), "node_modules");
}
function installedPackNodePaths(dataDirOverride) {
  const entries = [];
  for (const name of OPTIONAL_PACK_NAMES) {
    const dir = packNodeModulesDir(name, dataDirOverride);
    try {
      if (fs2.statSync(dir).isDirectory()) entries.push(dir);
    } catch {
    }
  }
  return entries;
}
function packMemberInstalled(memberRelPath, dataDirOverride) {
  const segments = memberRelPath.split(/[\\/]/).filter(Boolean);
  if (segments[0] === "node_modules") segments.shift();
  if (segments.length === 0) return false;
  for (const nodeModulesDir of installedPackNodePaths(dataDirOverride)) {
    if (fs2.existsSync(path2.join(nodeModulesDir, ...segments))) return true;
  }
  return false;
}

// open-sse/services/compression/engines/llmlingua/worker.ts
var FIRST_CALL_TIMEOUT_MS = 6e4;
var GATE_DEP_REL = path3.join("node_modules", "@atjsh", "llmlingua-2", "package.json");
var WORKER_JS_REL = path3.join(
  "open-sse",
  "services",
  "compression",
  "engines",
  "llmlingua",
  "onnxWorker.js"
);
var WORKER_TS_REL = path3.join(
  "open-sse",
  "services",
  "compression",
  "engines",
  "llmlingua",
  "onnxWorker.ts"
);
var MAX_WALK_UP = 8;
function firstAncestorWith(anchors, relPath) {
  for (const anchor of anchors) {
    if (!anchor) continue;
    let dir = path3.resolve(anchor);
    for (let i = 0; i <= MAX_WALK_UP; i++) {
      if (fs3.existsSync(path3.join(dir, relPath))) return dir;
      const parent = path3.dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  }
  return null;
}
function runtimeAnchors() {
  const anchors = [process.cwd()];
  const argv1 = process.argv[1];
  if (typeof argv1 === "string" && argv1) anchors.push(path3.dirname(argv1));
  return anchors;
}
var _depsAvailable = null;
function depsAvailable() {
  if (_depsAvailable !== null) return _depsAvailable;
  _depsAvailable = firstAncestorWith(runtimeAnchors(), GATE_DEP_REL) !== null || packMemberInstalled(GATE_DEP_REL);
  return _depsAvailable;
}
var worker = null;
var nextId = 1;
var pending = /* @__PURE__ */ new Map();
var queue = [];
var busy = false;
var warmedModels = /* @__PURE__ */ new Set();
var idleTimer = null;
function resolveWorkerFile() {
  const anchors = runtimeAnchors();
  const jsRoot = firstAncestorWith(anchors, WORKER_JS_REL);
  if (jsRoot) return { workerFile: path3.join(jsRoot, WORKER_JS_REL), execArgv: [] };
  const tsRoot = firstAncestorWith(anchors, WORKER_TS_REL);
  if (tsRoot)
    return { workerFile: path3.join(tsRoot, WORKER_TS_REL), execArgv: ["--import", "tsx/esm"] };
  return { workerFile: path3.join(process.cwd(), WORKER_JS_REL), execArgv: [] };
}
function bumpIdleTimer() {
  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    resetWorker();
  }, LLMLINGUA_WORKER_IDLE_MS);
  if (typeof idleTimer.unref === "function") idleTimer.unref();
}
function resetWorker() {
  const w = worker;
  worker = null;
  if (idleTimer) {
    clearTimeout(idleTimer);
    idleTimer = null;
  }
  for (const [, entry] of pending) {
    clearTimeout(entry.timer);
    entry.resolve(entry.originalText);
  }
  pending.clear();
  busy = false;
  warmedModels.clear();
  if (w) {
    try {
      void w.terminate();
    } catch {
    }
  }
}
function ensureWorker() {
  if (worker) return worker;
  const { workerFile, execArgv } = resolveWorkerFile();
  const absoluteWorkerFile = path3.resolve(workerFile);
  const w = new Worker(pathToFileURL(absoluteWorkerFile).href, { execArgv });
  w.on("message", (reply) => {
    const entry = pending.get(reply.id);
    if (entry) {
      clearTimeout(entry.timer);
      pending.delete(reply.id);
      if (reply.ok) warmedModels.add(entry.modelKey);
      entry.resolve(reply.text);
    }
    busy = false;
    pump();
  });
  const failOpenAndRespawn = () => {
    failAllPending();
    if (worker === w) worker = null;
    busy = false;
  };
  w.on("error", failOpenAndRespawn);
  w.on("exit", failOpenAndRespawn);
  worker = w;
  return w;
}
function failAllPending() {
  for (const [id, entry] of pending) {
    clearTimeout(entry.timer);
    pending.delete(id);
    entry.resolve(entry.originalText);
  }
}
function pump() {
  if (busy) return;
  const item = queue.shift();
  if (!item) return;
  busy = true;
  bumpIdleTimer();
  let w;
  try {
    w = ensureWorker();
  } catch {
    busy = false;
    item.resolve(item.text);
    pump();
    return;
  }
  const id = nextId++;
  const modelKey = resolveLlmlinguaModel(item.opts?.model).id;
  const warm = warmedModels.has(modelKey);
  const timeoutMs = warm ? LLMLINGUA_WORKER_TIMEOUT_MS : FIRST_CALL_TIMEOUT_MS;
  const timer = setTimeout(() => {
    const entry = pending.get(id);
    if (entry) {
      pending.delete(id);
      entry.resolve(item.text);
    }
    busy = false;
    pump();
  }, timeoutMs);
  if (typeof timer.unref === "function") timer.unref();
  pending.set(id, {
    // Warming is decided by the reply handler (success only) — not here, so a
    // timeout/error fail-open never marks the model warm.
    resolve: item.resolve,
    timer,
    originalText: item.text,
    modelKey
  });
  try {
    w.postMessage({
      id,
      text: item.text,
      model: item.opts?.model,
      compressionRate: item.opts?.compressionRate,
      modelPath: item.opts?.modelPath
    });
  } catch {
    clearTimeout(timer);
    pending.delete(id);
    item.resolve(item.text);
    if (worker === w) worker = null;
    busy = false;
    pump();
  }
}
var workerBackend = async (text, opts) => {
  if (!depsAvailable()) {
    return text;
  }
  return new Promise((resolve) => {
    queue.push({ text, opts, resolve });
    pump();
  });
};

// open-sse/services/compression/ultra.ts
var COMPRESSED_PREFIX = "[COMPRESSED:";
function pruneProseOnly(text, rate, minScore) {
  const { text: withPlaceholders, blocks } = extractPreservedBlocks(text);
  if (blocks.length === 0) return pruneByScore(text, rate, minScore);
  const placeholderToContent = new Map(blocks.map((b) => [b.placeholder, b.content]));
  const escaped = blocks.map((b) => b.placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const splitRe = new RegExp(`(${escaped.join("|")})`, "g");
  return withPlaceholders.split(splitRe).map((part) => {
    if (!part) return "";
    const preserved = placeholderToContent.get(part);
    if (preserved !== void 0) return preserved;
    return pruneByScore(part, rate, minScore);
  }).join("");
}
function ultraCompressHeuristic(messages, config = {}, tier = "heuristic") {
  const start = Date.now();
  const effectiveConfig = {
    ...DEFAULT_ULTRA_CONFIG,
    ...config
  };
  const { compressionRate, minScoreThreshold, maxTokensPerMessage } = effectiveConfig;
  let originalChars = 0;
  let compressedChars = 0;
  const compressed = messages.map((msg) => {
    if (effectiveConfig.preserveSystemPrompt !== false && msg.role === "system") return msg;
    const text = extractTextContent(msg.content);
    if (!text) return msg;
    if (text.startsWith(COMPRESSED_PREFIX)) return msg;
    if (maxTokensPerMessage > 0 && Math.ceil(text.length / 4) <= maxTokensPerMessage) {
      return msg;
    }
    let messageOriginalChars = 0;
    let messageCompressedChars = 0;
    const next = mapTextContent(msg, (textPart) => {
      if (!textPart || textPart.startsWith(COMPRESSED_PREFIX)) return textPart;
      messageOriginalChars += textPart.length;
      const pruned = pruneProseOnly(textPart, compressionRate, minScoreThreshold);
      messageCompressedChars += pruned.length;
      return pruned;
    });
    originalChars += messageOriginalChars;
    compressedChars += messageCompressedChars;
    return next;
  });
  const originalTokens = Math.ceil(originalChars / 4);
  const compressedTokens = Math.ceil(compressedChars / 4);
  const savingsPercent = originalTokens > 0 ? Math.round((originalTokens - compressedTokens) / originalTokens * 100 * 10) / 10 : 0;
  const stats = {
    originalTokens,
    compressedTokens,
    savingsPercent,
    techniquesUsed: ["ultra-heuristic-pruning"],
    mode: "ultra",
    timestamp: Date.now(),
    durationMs: Date.now() - start,
    ultraTier: tier
  };
  return { messages: compressed, stats };
}

// open-sse/services/compression/pipelineGuards.ts
function guardPipelineInflation(input) {
  const { originalTokens, compressedTokens } = input;
  if (originalTokens > 0 && compressedTokens > originalTokens) {
    return { body: input.originalBody, inflated: true };
  }
  return { body: input.compressedBody, inflated: false };
}
function applyStackedInflationGuard(originalBody, currentBody, compressed, stats) {
  if (!compressed) return { body: currentBody, compressed, stats };
  const inflation = guardPipelineInflation({
    originalBody,
    compressedBody: currentBody,
    originalTokens: stats.originalTokens,
    compressedTokens: stats.compressedTokens
  });
  if (!inflation.inflated) return { body: currentBody, compressed, stats };
  const inflatedTokens = stats.compressedTokens;
  const warnings = new Set(stats.validationWarnings ?? []);
  warnings.add(
    `pipeline-inflation-guard: stacked output (${inflatedTokens} tok) did not shrink input (${stats.originalTokens} tok); reverted to original`
  );
  stats.validationWarnings = Array.from(warnings);
  stats.fallbackApplied = true;
  stats.compressedTokens = stats.originalTokens;
  stats.savingsPercent = 0;
  return { body: inflation.body, compressed: false, stats };
}

// open-sse/services/compression/pipelineEngineBreaker.ts
var DEFAULT_PIPELINE_BREAKER = {
  enabled: false,
  failureThreshold: 3,
  cooldownMs: 3e4
};
var _state = /* @__PURE__ */ new Map();
function get(engine) {
  let s = _state.get(engine);
  if (!s) {
    s = { failures: 0, openedUntil: null };
    _state.set(engine, s);
  }
  return s;
}
function toNonNegativeInt(raw, fallback) {
  if (raw === void 0) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : fallback;
}
function resolvePipelineBreakerConfig(partial, env = process.env) {
  const enabled = partial?.enabled ?? env.COMPRESSION_PIPELINE_BREAKER_ENABLED === "true";
  const failureThreshold = partial?.failureThreshold ?? toNonNegativeInt(
    env.COMPRESSION_PIPELINE_BREAKER_THRESHOLD,
    DEFAULT_PIPELINE_BREAKER.failureThreshold
  );
  const cooldownMs = partial?.cooldownMs ?? toNonNegativeInt(
    env.COMPRESSION_PIPELINE_BREAKER_COOLDOWN_MS,
    DEFAULT_PIPELINE_BREAKER.cooldownMs
  );
  return {
    enabled: enabled === true,
    failureThreshold: Math.max(1, failureThreshold),
    cooldownMs: Math.max(0, cooldownMs)
  };
}
function canRunEngine(engine, config, now = Date.now()) {
  if (!config.enabled) return true;
  const s = get(engine);
  if (s.openedUntil == null) return true;
  if (now >= s.openedUntil) {
    s.openedUntil = null;
    s.failures = Math.max(0, config.failureThreshold - 1);
    return true;
  }
  return false;
}
function recordEngineFailure(engine, config, now = Date.now()) {
  if (!config.enabled) return;
  const s = get(engine);
  s.failures += 1;
  if (s.failures >= config.failureThreshold) {
    s.openedUntil = now + config.cooldownMs;
  }
}
function recordEngineSuccess(engine, config) {
  if (!config.enabled) return;
  const s = get(engine);
  s.failures = 0;
  s.openedUntil = null;
}

// open-sse/services/compression/stackedStepCore.ts
function createStackAccumulator() {
  return {
    techniques: /* @__PURE__ */ new Set(),
    rules: /* @__PURE__ */ new Set(),
    breakdown: [],
    rtkRawOutputPointers: [],
    validationWarnings: /* @__PURE__ */ new Set(),
    validationErrors: /* @__PURE__ */ new Set(),
    fallbackApplied: false
  };
}
function decideStep(result, bailout) {
  if (!result.compressed) return { advance: false };
  const minGain = Math.max(0, bailout.minGainPercent ?? 10);
  const gain = result.stats?.savingsPercent ?? 0;
  if (gain < minGain) return { advance: false };
  return { advance: true };
}
function recordNullStatsStep(acc, engineId) {
  acc.validationWarnings.add(`${engineId}: skipped (no eligible content)`);
}
function mergeStackStep(acc, engineId, result) {
  if (!result.stats) {
    recordNullStatsStep(acc, engineId);
    acc.breakdown.push({
      engine: engineId,
      originalTokens: 0,
      compressedTokens: 0,
      savingsPercent: 0,
      techniquesUsed: []
    });
    return;
  }
  result.stats.techniquesUsed.forEach((technique) => acc.techniques.add(technique));
  result.stats.rulesApplied?.forEach((rule) => acc.rules.add(rule));
  result.stats.rtkRawOutputPointers?.forEach((pointer) => acc.rtkRawOutputPointers.push(pointer));
  result.stats.validationWarnings?.forEach((warning) => acc.validationWarnings.add(warning));
  result.stats.validationErrors?.forEach((error) => acc.validationErrors.add(error));
  acc.fallbackApplied = acc.fallbackApplied || result.stats.fallbackApplied === true;
  acc.breakdown.push({
    engine: engineId,
    originalTokens: result.stats.originalTokens,
    compressedTokens: result.stats.compressedTokens,
    savingsPercent: result.stats.savingsPercent,
    techniquesUsed: result.stats.techniquesUsed,
    ...result.stats.rulesApplied ? { rulesApplied: result.stats.rulesApplied } : {},
    ...result.stats.durationMs !== void 0 ? { durationMs: result.stats.durationMs } : {},
    // O agregado do pipeline soma tokens de todas as engines; a contabilidade
    // física do omniglyph só faz sentido no passo que a produziu.
    ...result.stats.omniglyph ? { omniglyph: result.stats.omniglyph } : {}
  });
}

// open-sse/services/compression/stepDetailConfig.ts
function resolveStepDetailConfig(engine, config) {
  switch (engine) {
    case "lite":
      return config?.lite ?? {};
    case "headroom":
      return config?.headroom ?? {};
    case "session-dedup":
      return config?.sessionDedup ?? {};
    case "ccr":
      return config?.ccr ?? {};
    default:
      return {};
  }
}

// open-sse/services/compression/bodyAdapter.ts
var CODEX_RESPONSE_ITEM_META = /* @__PURE__ */ Symbol("codexResponseItemMeta");
var RESPONSES_MESSAGE_TYPES = /* @__PURE__ */ new Set([
  "message",
  "function_call_output",
  "custom_tool_call_output",
  "local_shell_call_output",
  "apply_patch_call_output"
]);
var COMPRESSION_INPUT_INDEX = /* @__PURE__ */ Symbol("compressionInputIndex");
var KIRO_TOOL_RESULT_PATH = /* @__PURE__ */ Symbol("kiroToolResultPath");
function isRecord(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}
function normalizeRole(role, fallback) {
  return typeof role === "string" && role.length > 0 ? role : fallback;
}
function toChatContent(content, fallbackOutput) {
  return content === void 0 ? fallbackOutput : content;
}
function fromChatContent(nextContent, originalContent) {
  if (Array.isArray(originalContent) && typeof nextContent === "string") {
    let replaced = false;
    const mapped = originalContent.map((part) => {
      if (!isRecord(part) || typeof part.text !== "string") return part;
      if (replaced) return { ...part, text: "" };
      replaced = true;
      return { ...part, text: nextContent };
    });
    return replaced ? mapped : originalContent;
  }
  return nextContent;
}
function customToolOutputToChatContent(rawOutput) {
  if (typeof rawOutput !== "string") {
    if (isRecord(rawOutput) && typeof rawOutput.output === "string") return rawOutput.output;
    return rawOutput;
  }
  try {
    const parsed = JSON.parse(rawOutput);
    if (isRecord(parsed) && typeof parsed.output === "string") return parsed.output;
  } catch {
  }
  return rawOutput;
}
function restoreCustomToolOutput(nextContent, originalOutput) {
  if (typeof originalOutput === "string") {
    try {
      const parsed = JSON.parse(originalOutput);
      if (isRecord(parsed) && typeof parsed.output === "string") {
        return JSON.stringify({ ...parsed, output: nextContent });
      }
    } catch {
    }
  }
  if (isRecord(originalOutput) && typeof originalOutput.output === "string") {
    return { ...originalOutput, output: nextContent };
  }
  return fromChatContent(nextContent, originalOutput);
}
function responsesToolOutputField(item) {
  return item.output !== null && item.output !== void 0 ? "output" : "content";
}
function responsesItemToMessage(item) {
  const type = typeof item.type === "string" ? item.type : "message";
  if (!RESPONSES_MESSAGE_TYPES.has(type)) return null;
  if (type === "function_call_output" || type === "custom_tool_call_output" || type === "local_shell_call_output" || type === "apply_patch_call_output") {
    const rawOutput = item.output ?? item.content;
    const isObjectOutput = rawOutput !== null && rawOutput !== void 0 && typeof rawOutput === "object" && !Array.isArray(rawOutput);
    return {
      role: "tool",
      content: type === "custom_tool_call_output" ? customToolOutputToChatContent(rawOutput) : isObjectOutput ? JSON.stringify(rawOutput) : toChatContent(rawOutput),
      [CODEX_RESPONSE_ITEM_META]: { type, eligible: false }
    };
  }
  return {
    role: normalizeRole(item.role, "user"),
    content: toChatContent(item.content, item.output)
  };
}
var DEFAULT_CODEX_PROTECTED_TOOL_NAMES = /* @__PURE__ */ new Set([
  "read",
  "glob",
  "grep",
  "write",
  "edit",
  "websearch",
  "webfetch",
  "web_search",
  "web_fetch"
]);
function markCodexResponseEligibility(messages, inputItems, preserveToolNames = []) {
  const protectedNames = /* @__PURE__ */ new Set([
    ...DEFAULT_CODEX_PROTECTED_TOOL_NAMES,
    ...preserveToolNames.map((name) => name.trim().toLowerCase())
  ]);
  const functionCalls = /* @__PURE__ */ new Map();
  const skippedCallIds = /* @__PURE__ */ new Set();
  for (const raw of inputItems) {
    if (!isRecord(raw) || raw.type !== "function_call") continue;
    if (typeof raw.call_id !== "string" || raw.call_id.length === 0) continue;
    const name = typeof raw.name === "string" ? raw.name : "";
    functionCalls.set(raw.call_id, name);
    if (protectedNames.has(name.trim().toLowerCase()) || name === "headless_retrieval" || name.endsWith("__headless_retrieval")) {
      skippedCallIds.add(raw.call_id);
    }
  }
  for (const message of messages) {
    const meta = message[CODEX_RESPONSE_ITEM_META];
    if (!meta) continue;
    if (meta.type === "local_shell_call_output" || meta.type === "apply_patch_call_output") {
      meta.eligible = true;
      continue;
    }
    if (meta.type !== "function_call_output") continue;
    const rawIndex = message[COMPRESSION_INPUT_INDEX];
    const rawItem = typeof rawIndex === "number" ? inputItems[rawIndex] : null;
    const callId = isRecord(rawItem) && typeof rawItem.call_id === "string" ? rawItem.call_id : "";
    meta.eligible = callId.length > 0 && functionCalls.has(callId) && !skippedCallIds.has(callId);
  }
}
function messageToResponsesItem(message, originalItem) {
  const type = typeof originalItem.type === "string" ? originalItem.type : "message";
  if (type === "function_call_output" || type === "custom_tool_call_output" || type === "local_shell_call_output" || type === "apply_patch_call_output") {
    const outputField = responsesToolOutputField(originalItem);
    const originalOutput = originalItem[outputField];
    return {
      ...originalItem,
      [outputField]: type === "custom_tool_call_output" ? restoreCustomToolOutput(message.content, originalOutput) : fromChatContent(message.content, originalOutput)
    };
  }
  return {
    ...originalItem,
    content: fromChatContent(message.content, originalItem.content)
  };
}
function hasTextContent(message) {
  if (typeof message.content === "string") return message.content.length > 0;
  if (!Array.isArray(message.content)) return false;
  return message.content.some(
    (part) => isRecord(part) && typeof part.text === "string" && part.text.length > 0
  );
}
function isInlineBase64ImageUrl(value) {
  return typeof value === "string" && /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(value);
}
function hasInlineImageContent(message) {
  if (!Array.isArray(message.content)) return false;
  return message.content.some((part) => {
    if (!isRecord(part)) return false;
    if (part.type === "input_image" && isInlineBase64ImageUrl(part.image_url)) return true;
    if (part.type === "image_url") {
      const imageUrl = part.image_url;
      if (isInlineBase64ImageUrl(imageUrl)) return true;
      return isRecord(imageUrl) && isInlineBase64ImageUrl(imageUrl.url);
    }
    if (part.type === "image") {
      if (isInlineBase64ImageUrl(part.image)) return true;
      const source = part.source;
      return isRecord(source) && source.type === "base64" && typeof source.data === "string";
    }
    const inlineData = part.inlineData ?? part.inline_data;
    return isRecord(inlineData) && typeof inlineData.data === "string";
  });
}
function hasCompressibleContent(message) {
  return hasTextContent(message) || hasInlineImageContent(message);
}
function adaptBodyForCompression(body, preserveToolNames = []) {
  if (Array.isArray(body.messages)) {
    return {
      body,
      adapted: false,
      restore: (compressedBody) => compressedBody
    };
  }
  if (isRecord(body.conversationState)) {
    return adaptKiroBodyForCompression(body);
  }
  if (!Array.isArray(body.input) && typeof body.input !== "string") {
    return {
      body,
      adapted: false,
      restore: (compressedBody) => compressedBody
    };
  }
  const inputItems = Array.isArray(body.input) ? body.input : [{ type: "message", role: "user", content: body.input }];
  const mappings = [];
  const messages = [];
  inputItems.forEach((item, index) => {
    if (!isRecord(item)) return;
    const message = responsesItemToMessage(item);
    if (!message || !hasCompressibleContent(message)) return;
    mappings.push({ index, item });
    messages.push({ ...message, [COMPRESSION_INPUT_INDEX]: index });
  });
  markCodexResponseEligibility(messages, inputItems, preserveToolNames);
  if (messages.length === 0) {
    return {
      body,
      adapted: false,
      restore: (compressedBody) => compressedBody
    };
  }
  const bodyWithoutInput = { ...body };
  delete bodyWithoutInput.input;
  const mappedIndexSet = new Set(mappings.map((mapping) => mapping.index));
  return {
    body: { ...bodyWithoutInput, messages },
    adapted: true,
    restore(compressedBody, options = {}) {
      const dropMissingMappedItems = options.dropMissingMappedItems === true;
      const compressedMessagesByIndex = /* @__PURE__ */ new Map();
      if (Array.isArray(compressedBody.messages)) {
        for (const message of compressedBody.messages) {
          if (typeof message[COMPRESSION_INPUT_INDEX] === "number") {
            compressedMessagesByIndex.set(message[COMPRESSION_INPUT_INDEX], message);
          }
        }
      }
      if (!dropMissingMappedItems) {
        const nextInput2 = [...inputItems];
        mappings.forEach((mapping) => {
          const compressedMessage = compressedMessagesByIndex.get(mapping.index);
          if (!compressedMessage) return;
          nextInput2[mapping.index] = messageToResponsesItem(compressedMessage, mapping.item);
        });
        const rest2 = { ...compressedBody };
        delete rest2.messages;
        if (typeof body.input === "string") {
          const first = nextInput2[0];
          return { ...rest2, input: isRecord(first) ? first.content ?? body.input : body.input };
        }
        return { ...rest2, input: nextInput2 };
      }
      const nextInput = [];
      const survivingOutputKeys = /* @__PURE__ */ new Set();
      inputItems.forEach((item, index) => {
        if (mappedIndexSet.has(index)) {
          const compressedMessage = compressedMessagesByIndex.get(index);
          if (!compressedMessage) return;
          const mapping = mappings.find((entry) => entry.index === index);
          if (!mapping) return;
          const restored = messageToResponsesItem(compressedMessage, mapping.item);
          nextInput.push(restored);
          if (isRecord(restored) && (restored.type === "function_call_output" || restored.type === "custom_tool_call_output" || restored.type === "local_shell_call_output" || restored.type === "apply_patch_call_output") && typeof restored.call_id === "string") {
            survivingOutputKeys.add(`${restored.type}:${restored.call_id}`);
          }
          return;
        }
        nextInput.push(item);
      });
      const cleanedInput = nextInput.filter((item) => {
        if (!isRecord(item)) return true;
        const t = item.type;
        if (t !== "function_call" && t !== "custom_tool_call" && t !== "local_shell_call" && t !== "apply_patch_call") {
          return true;
        }
        if (typeof item.call_id !== "string" || item.call_id.length === 0) return true;
        const hadMappedOutput = mappings.some((mapping) => {
          const original = mapping.item;
          return (original.type === "function_call_output" || original.type === "custom_tool_call_output" || original.type === "local_shell_call_output" || original.type === "apply_patch_call_output") && original.call_id === item.call_id;
        });
        if (!hadMappedOutput) return true;
        const outputType = item.type === "custom_tool_call" ? "custom_tool_call_output" : "function_call_output";
        return survivingOutputKeys.has(`${outputType}:${item.call_id}`);
      });
      const rest = { ...compressedBody };
      delete rest.messages;
      if (typeof body.input === "string") {
        const first = cleanedInput[0];
        return { ...rest, input: isRecord(first) ? first.content ?? body.input : body.input };
      }
      return { ...rest, input: cleanedInput };
    }
  };
}
function adaptKiroBodyForCompression(body) {
  const state = body.conversationState;
  const history = Array.isArray(state.history) ? state.history : [];
  const currentMessage = isRecord(state.currentMessage) ? state.currentMessage : null;
  const messages = [];
  const collectFrom = (container, scope, historyIndex) => {
    const uim = container.userInputMessage;
    if (!isRecord(uim)) return;
    const ctx = uim.userInputMessageContext;
    if (!isRecord(ctx)) return;
    const toolResults = ctx.toolResults;
    if (!Array.isArray(toolResults)) return;
    toolResults.forEach((tr, trIdx) => {
      if (!isRecord(tr)) return;
      if (tr.status === "error") return;
      const content = tr.content;
      if (!Array.isArray(content)) return;
      content.forEach((part, partIdx) => {
        if (!isRecord(part)) return;
        if (typeof part.text !== "string" || part.text.length === 0) return;
        messages.push({
          role: "tool",
          content: part.text,
          [KIRO_TOOL_RESULT_PATH]: {
            scope,
            historyIndex,
            toolResultIndex: trIdx,
            contentIndex: partIdx
          }
        });
      });
    });
  };
  history.forEach((entry, idx) => {
    if (!isRecord(entry)) return;
    collectFrom(entry, "history", idx);
  });
  if (currentMessage) collectFrom(currentMessage, "currentMessage", -1);
  if (messages.length === 0) {
    return {
      body,
      adapted: false,
      restore: (compressedBody) => compressedBody
    };
  }
  return {
    body: { ...body, messages },
    adapted: true,
    restore(compressedBody) {
      const rewrites = /* @__PURE__ */ new Map();
      if (Array.isArray(compressedBody.messages)) {
        for (const message of compressedBody.messages) {
          const path12 = message[KIRO_TOOL_RESULT_PATH];
          if (!path12) continue;
          let nextText = null;
          if (typeof message.content === "string") {
            nextText = message.content;
          } else if (Array.isArray(message.content)) {
            const firstText = message.content.find(
              (part) => isRecord(part) && typeof part.text === "string"
            );
            if (firstText) nextText = firstText.text;
          }
          if (nextText === null) continue;
          rewrites.set(kiroPathKey(path12), nextText);
        }
      }
      const nextState = { ...state };
      if (history.length > 0) {
        nextState.history = history.map((entry, idx) => {
          if (!isRecord(entry)) return entry;
          return rewriteKiroEntry(entry, "history", idx, rewrites);
        });
      }
      if (currentMessage) {
        nextState.currentMessage = rewriteKiroEntry(currentMessage, "currentMessage", -1, rewrites);
      }
      const rest = { ...compressedBody };
      delete rest.messages;
      return { ...rest, conversationState: nextState };
    }
  };
}
function kiroPathKey(path12) {
  return `${path12.scope}|${path12.historyIndex}|${path12.toolResultIndex}|${path12.contentIndex}`;
}
function rewriteKiroEntry(entry, scope, historyIndex, rewrites) {
  const uim = entry.userInputMessage;
  if (!isRecord(uim)) return entry;
  const ctx = uim.userInputMessageContext;
  if (!isRecord(ctx)) return entry;
  const toolResults = ctx.toolResults;
  if (!Array.isArray(toolResults)) return entry;
  let entryChanged = false;
  const nextToolResults = toolResults.map((tr, trIdx) => {
    if (!isRecord(tr)) return tr;
    const content = tr.content;
    if (!Array.isArray(content)) return tr;
    let trChanged = false;
    const nextContent = content.map((part, partIdx) => {
      if (!isRecord(part) || typeof part.text !== "string") return part;
      const key = kiroPathKey({
        scope,
        historyIndex,
        toolResultIndex: trIdx,
        contentIndex: partIdx
      });
      const rewritten = rewrites.get(key);
      if (rewritten === void 0 || rewritten === part.text) return part;
      trChanged = true;
      return { ...part, text: rewritten };
    });
    if (!trChanged) return tr;
    entryChanged = true;
    return { ...tr, content: nextContent };
  });
  if (!entryChanged) return entry;
  return {
    ...entry,
    userInputMessage: {
      ...uim,
      userInputMessageContext: { ...ctx, toolResults: nextToolResults }
    }
  };
}

// open-sse/services/compression/engines/cavemanAdapter.ts
var CAVEMAN_INTENSITIES = ["lite", "full", "ultra"];
var CAVEMAN_SCHEMA = [
  {
    key: "intensity",
    type: "select",
    label: "Intensity",
    defaultValue: "full",
    options: CAVEMAN_INTENSITIES.map((value) => ({ value, label: value }))
  },
  {
    key: "minMessageLength",
    type: "number",
    label: "Minimum message length",
    defaultValue: 50,
    min: 0,
    max: 1e4
  },
  {
    key: "enabled",
    type: "boolean",
    label: "Enabled",
    defaultValue: true
  }
];
var AGGRESSIVE_SCHEMA = [
  {
    key: "summarizerEnabled",
    type: "boolean",
    label: "Summarizer enabled",
    defaultValue: DEFAULT_AGGRESSIVE_CONFIG.summarizerEnabled
  },
  {
    key: "maxTokensPerMessage",
    type: "number",
    label: "Max tokens per message",
    defaultValue: DEFAULT_AGGRESSIVE_CONFIG.maxTokensPerMessage,
    min: 256,
    max: 32768
  },
  {
    key: "minSavingsThreshold",
    type: "number",
    label: "Minimum savings threshold",
    defaultValue: DEFAULT_AGGRESSIVE_CONFIG.minSavingsThreshold,
    min: 0,
    max: 1
  },
  {
    key: "preserveSystemPrompt",
    type: "boolean",
    label: "Preserve system prompt",
    defaultValue: true
  }
];
var ULTRA_SCHEMA = [
  {
    key: "enabled",
    type: "boolean",
    label: "Enabled",
    defaultValue: DEFAULT_ULTRA_CONFIG.enabled
  },
  {
    key: "compressionRate",
    type: "number",
    label: "Compression rate",
    defaultValue: DEFAULT_ULTRA_CONFIG.compressionRate,
    min: 0,
    max: 1
  },
  {
    key: "minScoreThreshold",
    type: "number",
    label: "Minimum score threshold",
    defaultValue: DEFAULT_ULTRA_CONFIG.minScoreThreshold,
    min: 0,
    max: 1
  },
  {
    key: "slmFallbackToAggressive",
    type: "boolean",
    label: "Fallback to aggressive",
    defaultValue: DEFAULT_ULTRA_CONFIG.slmFallbackToAggressive
  },
  {
    key: "modelPath",
    type: "string",
    label: "Model path",
    defaultValue: ""
  },
  {
    key: "maxTokensPerMessage",
    type: "number",
    label: "Max tokens per message",
    defaultValue: DEFAULT_ULTRA_CONFIG.maxTokensPerMessage,
    min: 0,
    max: 32768
  },
  {
    key: "preserveSystemPrompt",
    type: "boolean",
    label: "Preserve system prompt",
    defaultValue: true
  }
];
function isRecord2(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}
function validateBoolean(config, key, errors) {
  if (config[key] !== void 0 && typeof config[key] !== "boolean") {
    errors.push(`${key} must be a boolean`);
  }
}
function validateNumberRange(config, key, min, max, errors) {
  const value = config[key];
  if (value === void 0) return;
  if (typeof value !== "number" || !Number.isFinite(value) || value < min || value > max) {
    errors.push(`${key} must be a number between ${min} and ${max}`);
  }
}
function validateCavemanLikeConfig(config) {
  const errors = [];
  if (config.intensity !== void 0 && !CAVEMAN_INTENSITIES.includes(config.intensity)) {
    errors.push("intensity must be lite, full, or ultra");
  }
  if (config.minMessageLength !== void 0 && (typeof config.minMessageLength !== "number" || config.minMessageLength < 0)) {
    errors.push("minMessageLength must be a non-negative number");
  }
  if (config.enabled !== void 0 && typeof config.enabled !== "boolean") {
    errors.push("enabled must be a boolean");
  }
  return { valid: errors.length === 0, errors };
}
function validateAggressiveConfig(config) {
  const errors = [];
  validateBoolean(config, "summarizerEnabled", errors);
  validateBoolean(config, "preserveSystemPrompt", errors);
  validateNumberRange(config, "maxTokensPerMessage", 256, 32768, errors);
  validateNumberRange(config, "minSavingsThreshold", 0, 1, errors);
  if (config.thresholds !== void 0) {
    if (!isRecord2(config.thresholds)) {
      errors.push("thresholds must be an object");
    } else {
      for (const key of ["fullSummary", "moderate", "light", "verbatim"]) {
        validateNumberRange(config.thresholds, key, 1, 100, errors);
      }
    }
  }
  if (config.toolStrategies !== void 0) {
    if (!isRecord2(config.toolStrategies)) {
      errors.push("toolStrategies must be an object");
    } else {
      for (const key of ["fileContent", "grepSearch", "shellOutput", "json", "errorMessage"]) {
        validateBoolean(config.toolStrategies, key, errors);
      }
    }
  }
  return { valid: errors.length === 0, errors };
}
function validateUltraConfig(config) {
  const errors = [];
  validateBoolean(config, "enabled", errors);
  validateBoolean(config, "slmFallbackToAggressive", errors);
  validateBoolean(config, "preserveSystemPrompt", errors);
  validateNumberRange(config, "compressionRate", 0, 1, errors);
  validateNumberRange(config, "minScoreThreshold", 0, 1, errors);
  validateNumberRange(config, "maxTokensPerMessage", 0, 32768, errors);
  if (config.modelPath !== void 0 && typeof config.modelPath !== "string") {
    errors.push("modelPath must be a string");
  }
  return { valid: errors.length === 0, errors };
}
var LITE_SCHEMA = [
  {
    key: "preserveSystemPrompt",
    type: "boolean",
    label: "Preserve system prompt",
    defaultValue: true
  },
  {
    key: "compressToolResults",
    type: "boolean",
    label: "Proactively truncate long tool results",
    description: "Truncates tool results over 2,000 characters during Lite compression. Emergency overflow protection may still trim content when the context exceeds the model budget.",
    defaultValue: true
  }
];
function validateLiteConfig(config) {
  const errors = [];
  if (config.preserveSystemPrompt !== void 0 && typeof config.preserveSystemPrompt !== "boolean") {
    errors.push("preserveSystemPrompt must be a boolean");
  }
  validateBoolean(config, "compressToolResults", errors);
  return { valid: errors.length === 0, errors };
}
var liteEngine = {
  id: "lite",
  name: "Lite",
  description: "Fast whitespace, tool-result and image URL reduction.",
  icon: "compress",
  targets: ["messages", "tool_results"],
  stackable: true,
  stackPriority: 5,
  metadata: {
    id: "lite",
    name: "Lite",
    description: "Fast whitespace, tool-result and image URL reduction.",
    inputScope: "messages",
    targetLatencyMs: 1,
    supportsPreview: true,
    stable: true
  },
  apply(body, options) {
    const adapter = adaptBodyForCompression(body);
    const stepCompressToolResults = options?.stepConfig?.compressToolResults;
    const result = applyLiteCompression(adapter.body, {
      ...options,
      preserveSystemPrompt: options?.config?.preserveSystemPrompt !== false,
      // buildStepOptions() already merges global config.lite with explicit step.config
      // (step wins) into stepConfig, so consume that single effective value instead of
      // AND-ing root and step values — an explicit step `true` must override a global `false`.
      compressToolResults: typeof stepCompressToolResults === "boolean" ? stepCompressToolResults : options?.config?.lite?.compressToolResults ?? true
    });
    return adapter.adapted ? { ...result, body: adapter.restore(result.body) } : result;
  },
  compress(body, config) {
    return this.apply(body, { stepConfig: config });
  },
  getConfigSchema() {
    return LITE_SCHEMA;
  },
  validateConfig(config) {
    return validateLiteConfig(config);
  }
};
var cavemanEngine = {
  id: "caveman",
  name: "Caveman",
  description: "Rule-based message compression with preservation and validation.",
  icon: "compress",
  targets: ["messages"],
  stackable: true,
  stackPriority: 20,
  metadata: {
    id: "caveman",
    name: "Caveman",
    description: "Rule-based message compression with preservation and validation.",
    inputScope: "messages",
    targetLatencyMs: 1,
    supportsPreview: true,
    stable: true
  },
  apply(body, options) {
    const adapter = adaptBodyForCompression(body);
    const explicitCavemanConfig = options?.config?.cavemanConfig;
    const explicitStepConfig = options?.stepConfig;
    const explicitEnabled = explicitCavemanConfig && "enabled" in explicitCavemanConfig || explicitStepConfig && "enabled" in explicitStepConfig;
    const enabledDefault = explicitEnabled ? {} : { enabled: true };
    const cavemanConfig = {
      ...enabledDefault,
      ...explicitCavemanConfig ?? {},
      ...explicitStepConfig ?? {},
      ...options?.config?.languageConfig?.enabled ? {
        language: options.config.languageConfig.defaultLanguage,
        autoDetectLanguage: options.config.languageConfig.autoDetect,
        enabledLanguagePacks: options.config.languageConfig.enabledPacks
      } : {},
      ...options?.config?.preserveSystemPrompt !== false ? {
        compressRoles: (options?.config?.cavemanConfig?.compressRoles ?? ["user"]).filter(
          (role) => role !== "system"
        )
      } : {}
    };
    const result = cavemanCompress(
      adapter.body,
      cavemanConfig
    );
    return adapter.adapted ? { ...result, body: adapter.restore(result.body) } : result;
  },
  compress(body, config) {
    return this.apply(body, { stepConfig: config });
  },
  getConfigSchema() {
    return CAVEMAN_SCHEMA;
  },
  validateConfig(config) {
    return validateCavemanLikeConfig(config);
  }
};
var aggressiveEngine = {
  id: "aggressive",
  name: "Aggressive",
  description: "Summarization, tool result compression and progressive aging.",
  icon: "speed",
  targets: ["messages", "tool_results"],
  stackable: true,
  stackPriority: 30,
  metadata: {
    id: "aggressive",
    name: "Aggressive",
    description: "Summarization, tool result compression and progressive aging.",
    inputScope: "messages",
    targetLatencyMs: 5,
    supportsPreview: true,
    stable: true
  },
  apply(body, options) {
    const adapter = adaptBodyForCompression(body);
    const messages = adapter.body.messages ?? [];
    if (!Array.isArray(messages) || messages.length === 0) {
      return { body, compressed: false, stats: null };
    }
    const aggressiveConfig = {
      ...options?.config?.aggressive ?? {},
      ...options?.stepConfig ?? {},
      preserveSystemPrompt: options?.config?.preserveSystemPrompt !== false
    };
    const result = compressAggressive(messages, aggressiveConfig);
    const compressedBody = { ...adapter.body, messages: result.messages };
    return {
      body: adapter.restore(compressedBody),
      compressed: result.stats.savingsPercent > 0,
      stats: createCompressionStats(
        adapter.body,
        compressedBody,
        "aggressive",
        ["aggressive"],
        result.stats.rulesApplied,
        result.stats.durationMs
      )
    };
  },
  compress(body, config) {
    return this.apply(body, { stepConfig: config });
  },
  getConfigSchema() {
    return AGGRESSIVE_SCHEMA;
  },
  validateConfig(config) {
    return validateAggressiveConfig(config);
  }
};
var ultraEngine = {
  id: "ultra",
  name: "Ultra",
  description: "Heuristic token pruning with optional local SLM fallback.",
  icon: "bolt",
  targets: ["messages"],
  stackable: true,
  stackPriority: 40,
  metadata: {
    id: "ultra",
    name: "Ultra",
    description: "Heuristic token pruning with optional local SLM fallback.",
    inputScope: "messages",
    targetLatencyMs: 5,
    supportsPreview: true,
    stable: true
  },
  apply(body, options) {
    const adapter = adaptBodyForCompression(body);
    const messages = adapter.body.messages ?? [];
    if (!Array.isArray(messages) || messages.length === 0) {
      return { body, compressed: false, stats: null };
    }
    const ultraConfig = {
      ...options?.config?.ultra ?? {},
      ...options?.stepConfig ?? {},
      preserveSystemPrompt: options?.config?.preserveSystemPrompt !== false
    };
    const result = ultraCompressHeuristic(messages, ultraConfig);
    const compressedBody = { ...adapter.body, messages: result.messages };
    return {
      body: adapter.restore(compressedBody),
      compressed: result.stats.savingsPercent > 0,
      stats: createCompressionStats(
        adapter.body,
        compressedBody,
        "ultra",
        ["ultra"],
        result.stats.rulesApplied,
        result.stats.durationMs
      )
    };
  },
  compress(body, config) {
    return this.apply(body, { stepConfig: config });
  },
  getConfigSchema() {
    return ULTRA_SCHEMA;
  },
  validateConfig(config) {
    return validateUltraConfig(config);
  }
};

// open-sse/services/compression/engines/rtk/splitCompositeCommand.ts
function lastCommandSegment(command) {
  if (!command) return command;
  const segments = [];
  let current = 0;
  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  let inBacktick = false;
  const push = (end) => {
    segments.push(command.slice(current, end));
  };
  for (let i = 0; i < command.length; i++) {
    const ch = command[i];
    if (inSingle) {
      if (ch === "'") inSingle = false;
      continue;
    }
    if (inBacktick) {
      if (ch === "`") inBacktick = false;
      continue;
    }
    if (inDouble) {
      if (ch === '"') inDouble = false;
      if (ch === "$" && command[i + 1] === "(") {
        depth++;
        i++;
      }
      continue;
    }
    if (depth > 0) {
      if (ch === "(") depth++;
      else if (ch === ")") depth--;
      continue;
    }
    if (ch === "'") {
      inSingle = true;
      continue;
    }
    if (ch === '"') {
      inDouble = true;
      continue;
    }
    if (ch === "`") {
      inBacktick = true;
      continue;
    }
    if (ch === "$" && command[i + 1] === "(") {
      depth++;
      i++;
      continue;
    }
    if (ch === "(") {
      depth++;
      continue;
    }
    if (ch === "&" && command[i + 1] === "&") {
      push(i);
      i += 1;
      current = i + 1;
      continue;
    }
    if (ch === "|" && command[i + 1] === "|") {
      push(i);
      i += 1;
      current = i + 1;
      continue;
    }
    if (ch === ";") {
      push(i);
      current = i + 1;
      continue;
    }
  }
  push(command.length);
  if (segments.length === 1) {
    return command;
  }
  for (let i = segments.length - 1; i >= 0; i--) {
    const trimmed = segments[i].trim();
    if (trimmed) return trimmed;
  }
  return command;
}

// open-sse/services/compression/engines/rtk/commandDetector.ts
var COMMAND_PREFIXES = [
  "git",
  "make",
  "gradle",
  "gradlew",
  "dotnet",
  "terraform",
  "tofu",
  "opentofu",
  "systemctl",
  "npm",
  "pnpm",
  "yarn",
  "vitest",
  "jest",
  "pytest",
  "python",
  "go",
  "cargo",
  "tsc",
  "eslint",
  "webpack",
  "vite",
  "biome",
  "prettier",
  "turbo",
  "nx",
  "playwright",
  "ruff",
  "mypy",
  "pip",
  "uv",
  "poetry",
  "golangci-lint",
  "bundle",
  "rubocop",
  "kubectl",
  "composer",
  "gh",
  "docker",
  "aws",
  "gcloud",
  "ssh",
  "rsync",
  "curl",
  "wget",
  "ls",
  "find",
  "grep",
  "rg",
  "ag",
  "ps",
  "df",
  "du"
];
var COMMAND_PREFIX_PATTERN = new RegExp(`^(?:${COMMAND_PREFIXES.join("|")})\\b`);
var DETECTORS = [
  {
    type: "git-status",
    category: "git",
    commandPatterns: [/^git\s+status\b/i],
    contentPatterns: [
      /^On branch /m,
      /^Changes (?:not staged|to be committed)/m,
      /^Untracked files:/m
    ]
  },
  {
    type: "git-branch",
    category: "git",
    commandPatterns: [/^git\s+branch\b/i, /^git\s+checkout\b/i, /^git\s+switch\b/i],
    contentPatterns: [/^\*\s+\S+/m, /Switched to (?:a new )?branch/i, /Already on ['"][^'"]+['"]/i]
  },
  {
    type: "git-diff",
    category: "git",
    commandPatterns: [/^git\s+diff\b/i, /^git\s+show\b/i],
    contentPatterns: [/^diff --git /m, /^@@\s+-\d+,\d+\s+\+\d+,\d+\s+@@/m]
  },
  {
    type: "git-log",
    category: "git",
    commandPatterns: [/^git\s+log\b/i],
    contentPatterns: [/^commit [0-9a-f]{7,40}/m, /^Author: /m]
  },
  {
    type: "make",
    category: "build",
    commandPatterns: [/^make\b/i],
    contentPatterns: [/^make\[\d+\]: (?:Entering|Leaving) directory/m, /make: \*\*\* /]
  },
  {
    type: "gradle",
    category: "build",
    commandPatterns: [/^(?:gradle|gradlew|\.\/gradlew)\b/i],
    contentPatterns: [/^> Task :/m, /^BUILD (?:SUCCESSFUL|FAILED)\b/m]
  },
  {
    type: "dotnet",
    category: "build",
    commandPatterns: [/^dotnet\s+(?:build|test|run|restore|publish|pack|msbuild)\b/i, /^dotnet\b/i],
    contentPatterns: [/^Build (?:succeeded|FAILED)\b/m, /\b(?:error|warning) CS\d+\b/m]
  },
  {
    type: "terraform-plan",
    category: "infra",
    commandPatterns: [/^terraform\s+plan\b/i],
    contentPatterns: [/Terraform will perform the following actions:/, /Plan: \d+ to add/i]
  },
  {
    type: "tofu-plan",
    category: "infra",
    commandPatterns: [/^(?:tofu|opentofu)\s+plan\b/i],
    contentPatterns: [/OpenTofu will perform the following actions:/, /Plan: \d+ to add/i]
  },
  {
    type: "systemctl-status",
    category: "infra",
    commandPatterns: [/^systemctl\s+status\b/i],
    contentPatterns: [/^\s*Loaded:\s+/m, /^\s*Active:\s+/m, /^●\s+\S+\.service/m]
  },
  {
    type: "test-vitest",
    category: "test",
    commandPatterns: [/^vitest\b/i, /^npm\s+(?:run\s+)?test:vitest\b/i],
    contentPatterns: [/\bvitest\b/i, /^ ✓ /m, /^ ❯ /m, /Test Files\s+\d+\s+(?:passed|failed)/i]
  },
  {
    type: "test-jest",
    category: "test",
    commandPatterns: [/^jest\b/i, /^npm\s+(?:run\s+)?test\b/i],
    contentPatterns: [/Test Suites:\s+\d+/i, /Tests:\s+\d+/i, /^PASS\s+/m, /^FAIL\s+/m]
  },
  {
    type: "test-pytest",
    category: "test",
    commandPatterns: [/^pytest\b/i, /^python\s+-m\s+pytest\b/i],
    contentPatterns: [/=+\s+(?:\d+\s+)?(?:passed|failed|errors?)/i, /^E\s+/m, /^FAILED /m]
  },
  {
    type: "test-cargo",
    category: "test",
    commandPatterns: [/^cargo\s+test\b/i, /^cargo\s+nextest\b/i],
    contentPatterns: [
      /^running \d+ tests?/m,
      /^test\s+[\w:.-]+\s+\.\.\.\s+(?:ok|FAILED|ignored)/m,
      /test result:\s+(?:ok|FAILED)/i
    ]
  },
  {
    type: "test-go",
    category: "test",
    commandPatterns: [/^go\s+test\b/i],
    contentPatterns: [/^(?:ok|FAIL)\s+[\w./-]+\s+[\d.]+s/m, /^--- FAIL: /m, /^panic: /m]
  },
  {
    type: "build-typescript",
    category: "build",
    commandPatterns: [/^tsc\b/i, /^npm\s+run\s+typecheck\b/i],
    contentPatterns: [/TS\d{4}:/, /error TS\d{4}/i]
  },
  {
    type: "build-eslint",
    category: "build",
    commandPatterns: [/^eslint\b/i, /^npm\s+run\s+lint\b/i],
    contentPatterns: [/\s+\d+:\d+\s+(?:error|warning)\s+/, /✖\s+\d+\s+problems?/]
  },
  {
    type: "build-webpack",
    category: "build",
    commandPatterns: [/^webpack\b/i, /^npx\s+webpack\b/i, /^npm\s+run\s+build:webpack\b/i],
    contentPatterns: [
      /webpack\s+\d/i,
      /compiled (?:successfully|with \d+ errors?)/i,
      /asset .+\.js/i
    ]
  },
  {
    type: "build-vite",
    category: "build",
    commandPatterns: [/^vite\s+build\b/i, /^npm\s+run\s+build\b/i, /^pnpm\s+build\b/i],
    contentPatterns: [/vite v[\d.]+/i, /✓ built in/i, /transforming \(\d+\)/i]
  },
  {
    type: "biome",
    category: "build",
    commandPatterns: [/^biome\b/i, /^npx\s+biome\b/i],
    contentPatterns: [/lint\/[A-Za-z0-9/.-]+/, /Checked \d+ files? in/i]
  },
  {
    type: "prettier",
    category: "build",
    commandPatterns: [/^prettier\b/i, /^npx\s+prettier\b/i],
    contentPatterns: [/^Checking formatting\.\.\./m, /Code style issues found/i]
  },
  {
    type: "turbo",
    category: "build",
    commandPatterns: [/^turbo\b/i, /^npx\s+turbo\b/i],
    contentPatterns: [/^• Packages in scope:/m, /^Tasks:\s+\d+\s+successful/m]
  },
  {
    type: "nx",
    category: "build",
    commandPatterns: [/^nx\b/i, /^npx\s+nx\b/i],
    contentPatterns: [/^NX\s+/m, /^> nx run /m]
  },
  {
    type: "playwright",
    category: "test",
    commandPatterns: [/^playwright\s+test\b/i, /^npx\s+playwright\s+test\b/i],
    contentPatterns: [/Running \d+ tests? using \d+ workers?/i, /^\s+\d+ failed/m]
  },
  {
    type: "npm-install",
    category: "package",
    commandPatterns: [/^(?:npm|pnpm|yarn)\s+(?:install|add|update)\b/i],
    contentPatterns: [
      /added \d+ packages/i,
      /packages are looking for funding/i,
      /audited \d+ packages/i
    ]
  },
  {
    type: "npm-audit",
    category: "package",
    commandPatterns: [/^(?:npm|pnpm|yarn)\s+audit\b/i],
    contentPatterns: [/found \d+ vulnerabilities/i, /\b(?:low|moderate|high|critical)\b/i]
  },
  {
    type: "ruff",
    category: "build",
    commandPatterns: [/^ruff\b/i, /^uv\s+run\s+ruff\b/i],
    contentPatterns: [/^[\w./-]+\.py:\d+:\d+:\s+[A-Z]\d+/m, /Found \d+ errors?\./i]
  },
  {
    type: "mypy",
    category: "build",
    commandPatterns: [/^mypy\b/i, /^python\s+-m\s+mypy\b/i],
    contentPatterns: [/^[\w./-]+\.py:\d+:\s+error:/m, /Found \d+ errors? in \d+ files?/i]
  },
  {
    type: "pip",
    category: "package",
    commandPatterns: [/^pip\s+(?:install|download|uninstall)\b/i, /^python\s+-m\s+pip\b/i],
    contentPatterns: [/^Collecting /m, /^Successfully installed /m]
  },
  {
    type: "uv-sync",
    category: "package",
    commandPatterns: [/^uv\s+sync\b/i, /^uv\s+pip\s+install\b/i],
    contentPatterns: [/^Resolved \d+ packages?/m, /^Installed \d+ packages?/m]
  },
  {
    type: "poetry-install",
    category: "package",
    commandPatterns: [/^poetry\s+install\b/i],
    contentPatterns: [/^Installing dependencies from lock file/m, /^Package operations:/m]
  },
  {
    type: "golangci-lint",
    category: "build",
    commandPatterns: [/^golangci-lint\b/i],
    contentPatterns: [/^[\w./-]+\.go:\d+:\d+:/m, /^\d+ issues?:/m]
  },
  {
    type: "bundle-install",
    category: "package",
    commandPatterns: [/^bundle\s+install\b/i],
    contentPatterns: [/^Fetching gem metadata from /m, /^Bundle complete!/m]
  },
  {
    type: "rubocop",
    category: "build",
    commandPatterns: [/^rubocop\b/i, /^bundle\s+exec\s+rubocop\b/i],
    contentPatterns: [/^Inspecting \d+ files/m, /^[\w./-]+\.rb:\d+:\d+:\s+[A-Z]:/m]
  },
  {
    type: "docker-ps",
    category: "docker",
    commandPatterns: [/^docker\s+ps\b/i],
    contentPatterns: [/^CONTAINER ID\s+IMAGE\s+COMMAND/m]
  },
  {
    type: "docker-logs",
    category: "docker",
    commandPatterns: [/^docker\s+logs\b/i, /^docker\s+compose\s+logs\b/i],
    contentPatterns: [
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/m,
      /\b(?:ERROR|WARN|INFO)\b/,
      /^Attaching to /m
    ]
  },
  {
    type: "aws",
    category: "cloud",
    commandPatterns: [/^aws\b/i],
    contentPatterns: [/An error occurred \([A-Za-z0-9]+\) when calling/, /^(?:upload|download): /m]
  },
  {
    type: "gcloud",
    category: "cloud",
    commandPatterns: [/^gcloud\b/i],
    contentPatterns: [/^ERROR: \(gcloud\./m, /^Updated property \[/m]
  },
  {
    type: "ssh",
    category: "cloud",
    commandPatterns: [/^ssh\b/i],
    contentPatterns: [
      /Permission denied \(/,
      /Host key verification failed/,
      /Connection timed out/
    ]
  },
  {
    type: "rsync",
    category: "cloud",
    commandPatterns: [/^rsync\b/i],
    contentPatterns: [/^sending incremental file list/m, /^rsync error:/m]
  },
  {
    type: "curl",
    category: "cloud",
    commandPatterns: [/^curl\b/i],
    contentPatterns: [/curl: \(\d+\)/, /^HTTP\/\d(?:\.\d)? \d{3}/m]
  },
  {
    type: "wget",
    category: "cloud",
    commandPatterns: [/^wget\b/i],
    contentPatterns: [/^--\d{4}-\d{2}-\d{2}/m, /^ERROR \d{3}:/m]
  },
  {
    type: "json-output",
    category: "generic",
    commandPatterns: [/^jq\b/i, /^cat\s+.*\.json\b/i],
    contentPatterns: [/^\s*[\[{][\s\S]*[\]}]\s*$/]
  },
  {
    type: "shell-ls",
    category: "shell",
    commandPatterns: [/^ls(?:\s+-[A-Za-z]+)?\b/i],
    contentPatterns: [/^total \d+/m, /^\S+\s+\S+\s+\d+\s+\w+\s+\d{1,2}\s+/m]
  },
  {
    type: "shell-find",
    category: "shell",
    commandPatterns: [/^find\b/i],
    contentPatterns: [/^(?:\.{1,2}|\/|[\w.-]+\/).+/m]
  },
  {
    type: "shell-grep",
    category: "shell",
    commandPatterns: [/^(?:grep|rg|ag)\b/i],
    contentPatterns: [
      /^[\w./-]+\.(?:ts|tsx|js|jsx|py|go|rs|java|rb|md|json|ya?ml|txt):\d*:/m,
      /^[\w./-]+\/[\w./-]+:\d*:/m
    ]
  },
  {
    type: "shell-ps",
    category: "shell",
    commandPatterns: [/^ps\b/i],
    contentPatterns: [/^(?:USER\s+PID|\s*PID\s+)/m]
  },
  {
    type: "shell-df",
    category: "shell",
    commandPatterns: [/^df\b/i],
    contentPatterns: [/^Filesystem\s+.*Use%/m]
  },
  {
    type: "shell-du",
    category: "shell",
    commandPatterns: [/^du\b/i],
    contentPatterns: [/^\d+(?:\.\d+)?[KMGTP]?\s+\S+/m]
  },
  {
    type: "error-stacktrace",
    category: "generic",
    commandPatterns: [],
    contentPatterns: [
      /Traceback \(most recent call last\):/,
      /^\s+at\s+\S+\s+\(.+:\d+:\d+\)/m,
      /^panic: /m,
      /^thread '[^']+' panicked at/m
    ]
  },
  {
    type: "generic-error",
    category: "generic",
    commandPatterns: [],
    contentPatterns: [/Error:/, /Exception:/, /Traceback \(most recent call last\):/]
  }
];
function detectCommandFromText(text) {
  const firstLines = text.split(/\r?\n/).slice(0, 4);
  for (const line of firstLines) {
    const trimmed = line.trim().replace(/^\$\s+/, "");
    if (!trimmed) continue;
    if (COMMAND_PREFIX_PATTERN.test(trimmed)) {
      return lastCommandSegment(trimmed);
    }
  }
  return null;
}
function detectCommandType(text, command) {
  const detectedCommand = lastCommandSegment(command?.trim() || detectCommandFromText(text) || "") || null;
  let best = null;
  for (const detector of DETECTORS) {
    const matchedPatterns = [];
    const commandMatched = Boolean(detectedCommand) && detector.commandPatterns.some((pattern) => {
      const matched = pattern.test(detectedCommand ?? "");
      if (matched) matchedPatterns.push(pattern.source);
      return matched;
    });
    const contentMatches = detector.contentPatterns.filter((pattern) => {
      const matched = pattern.test(text);
      if (matched) matchedPatterns.push(pattern.source);
      return matched;
    }).length;
    if (!commandMatched && contentMatches === 0) continue;
    const confidence = Math.min(1, (commandMatched ? 0.55 : 0) + contentMatches * 0.25);
    if (!best || confidence > best.confidence) {
      best = {
        type: detector.type,
        command: detectedCommand,
        confidence,
        category: detector.category,
        matchedPatterns
      };
    }
  }
  return best ?? {
    type: "unknown",
    command: detectedCommand,
    confidence: detectedCommand ? 0.35 : 0.1,
    category: "generic",
    matchedPatterns: []
  };
}

// open-sse/services/compression/engines/rtk/configSchema.ts
var RTK_SCHEMA = [
  {
    key: "intensity",
    type: "select",
    label: "Intensity",
    defaultValue: DEFAULT_RTK_CONFIG.intensity,
    options: [
      { value: "minimal", label: "minimal" },
      { value: "standard", label: "standard" },
      { value: "aggressive", label: "aggressive" }
    ]
  },
  {
    key: "applyToToolResults",
    type: "boolean",
    label: "Apply to tool results",
    defaultValue: DEFAULT_RTK_CONFIG.applyToToolResults
  },
  {
    key: "applyToAssistantMessages",
    type: "boolean",
    label: "Apply to assistant messages",
    defaultValue: DEFAULT_RTK_CONFIG.applyToAssistantMessages
  },
  {
    key: "applyToCodeBlocks",
    type: "boolean",
    label: "Apply to code blocks",
    defaultValue: DEFAULT_RTK_CONFIG.applyToCodeBlocks
  },
  {
    key: "maxLinesPerResult",
    type: "number",
    label: "Max lines per result",
    defaultValue: DEFAULT_RTK_CONFIG.maxLinesPerResult,
    min: 0,
    max: 5e3
  },
  {
    key: "maxCharsPerResult",
    type: "number",
    label: "Max chars per result",
    defaultValue: DEFAULT_RTK_CONFIG.maxCharsPerResult,
    min: 0,
    max: 5e5
  },
  {
    key: "deduplicateThreshold",
    type: "number",
    label: "Deduplicate threshold",
    defaultValue: DEFAULT_RTK_CONFIG.deduplicateThreshold,
    min: 2,
    max: 100
  },
  {
    key: "rawOutputRetention",
    type: "select",
    label: "Raw output retention",
    defaultValue: DEFAULT_RTK_CONFIG.rawOutputRetention,
    options: [
      { value: "never", label: "never" },
      { value: "failures", label: "failures" },
      { value: "always", label: "always" }
    ]
  },
  {
    key: "rawOutputMaxFiles",
    type: "number",
    label: "Max raw-output files (oldest purged beyond this)",
    defaultValue: DEFAULT_RTK_CONFIG.rawOutputMaxFiles,
    min: 1,
    max: 1e7
  },
  {
    key: "rawOutputMaxAgeDays",
    type: "number",
    label: "Max raw-output age (days)",
    defaultValue: DEFAULT_RTK_CONFIG.rawOutputMaxAgeDays,
    min: 1,
    max: 3650
  },
  {
    key: "enableRenderers",
    type: "boolean",
    label: "Semantic renderers",
    defaultValue: DEFAULT_RTK_CONFIG.enableRenderers
  }
];
function validateRtkEngineConfig(config) {
  const errors = [];
  if (config.intensity !== void 0 && config.intensity !== "minimal" && config.intensity !== "standard" && config.intensity !== "aggressive") {
    errors.push("intensity must be minimal, standard, or aggressive");
  }
  for (const key of [
    "enabled",
    "applyToToolResults",
    "applyToAssistantMessages",
    "applyToCodeBlocks"
  ]) {
    if (config[key] !== void 0 && typeof config[key] !== "boolean") {
      errors.push(`${key} must be a boolean`);
    }
  }
  for (const key of ["maxLinesPerResult", "maxCharsPerResult", "deduplicateThreshold"]) {
    if (config[key] !== void 0 && (typeof config[key] !== "number" || config[key] < 0)) {
      errors.push(`${key} must be a non-negative number`);
    }
  }
  if (config.enabledFilters !== void 0 && !Array.isArray(config.enabledFilters)) {
    errors.push("enabledFilters must be an array");
  }
  if (config.disabledFilters !== void 0 && !Array.isArray(config.disabledFilters)) {
    errors.push("disabledFilters must be an array");
  }
  if (config.rawOutputRetention !== void 0 && config.rawOutputRetention !== "never" && config.rawOutputRetention !== "failures" && config.rawOutputRetention !== "always") {
    errors.push("rawOutputRetention must be never, failures, or always");
  }
  for (const key of ["rawOutputMaxFiles", "rawOutputMaxAgeDays"]) {
    if (config[key] !== void 0 && (typeof config[key] !== "number" || config[key] < 1)) {
      errors.push(`${key} must be a positive number`);
    }
  }
  return { valid: errors.length === 0, errors };
}

// open-sse/services/compression/engines/rtk/deduplicator.ts
function deduplicateRepeatedLines(text, options = {}) {
  const threshold = Math.max(2, Math.floor(options.threshold ?? 3));
  const lines = text.split(/\r?\n/);
  const output = [];
  let collapsed = 0;
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    let runLength = 1;
    while (index + runLength < lines.length && lines[index + runLength] === line) {
      runLength++;
    }
    if (line.trim() && runLength >= threshold) {
      output.push(line);
      output.push(`[line repeated ${runLength - 1}x]`);
      output.push(`[rtk:dropped ${runLength - 1} repeated lines]`);
      collapsed += runLength - 1;
      index += runLength - 1;
      continue;
    }
    output.push(line);
  }
  return { text: output.join("\n"), collapsed };
}

// open-sse/services/compression/engines/rtk/grouper.ts
function normalizeLine(line) {
  let s = line;
  s = s.replace(/\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?/g, "<N>");
  s = s.replace(/\[\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\]/g, "[<N>]");
  s = s.replace(/\b[0-9a-fA-F]{6,40}\b/g, "<N>");
  s = s.replace(/\bv?\d+\.\d+\.\d+(?:\.\d+)*\b/g, "<N>");
  s = s.replace(/\b\d+\b/g, "<N>");
  s = s.replace(/\s+/g, " ");
  return s.trim();
}
function groupSimilarLines(text, options = {}) {
  const threshold = Math.max(2, Math.floor(options.threshold ?? 3));
  const lines = text.split(/\r?\n/);
  const output = [];
  let grouped = 0;
  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    const normalised = normalizeLine(line);
    let runLength = 1;
    while (index + runLength < lines.length && normalizeLine(lines[index + runLength]) === normalised) {
      runLength++;
    }
    if (runLength >= threshold) {
      output.push(`${line} [rtk:grouped \xD7${runLength}]`);
      grouped += runLength - 1;
      index += runLength;
    } else {
      output.push(line);
      index++;
    }
  }
  return { text: output.join("\n"), grouped };
}

// open-sse/services/compression/engines/rtk/filterLoader.ts
import fs4 from "node:fs";
import path4 from "node:path";
import os3 from "node:os";
import crypto3 from "node:crypto";

// open-sse/services/compression/engines/rtk/filterSchema.ts
import { z } from "zod";
var rtkFilterCategorySchema = z.enum([
  "git",
  "test",
  "build",
  "shell",
  "docker",
  "package",
  "infra",
  "cloud",
  "generic"
]);
var rtkReplaceRuleSchema = z.object({
  pattern: z.string().min(1),
  replacement: z.string()
}).strict();
var rtkMatchOutputRuleSchema = z.object({
  pattern: z.string().min(1),
  message: z.string(),
  unless: z.string().min(1).optional()
}).strict();
var rtkInlineTestSchema = z.object({
  name: z.string().min(1),
  input: z.string(),
  expected: z.string(),
  command: z.string().optional()
}).strict();
var rtkFilterMatchSchema = z.object({
  commands: z.array(z.string().min(1)).default([]),
  patterns: z.array(z.string().min(1)).default([]),
  outputTypes: z.array(z.string().min(1)).default([])
}).strict();
var rtkFilterRulesSchema = z.object({
  stripAnsi: z.boolean().default(false),
  replace: z.array(rtkReplaceRuleSchema).default([]),
  matchOutput: z.array(rtkMatchOutputRuleSchema).default([]),
  includePatterns: z.array(z.string()).default([]),
  dropPatterns: z.array(z.string()).default([]),
  collapsePatterns: z.array(z.string()).default([]),
  deduplicate: z.boolean().default(false),
  truncateLineAt: z.number().int().min(0).default(0),
  maxLines: z.number().int().min(0).default(0),
  headLines: z.number().int().min(0).default(20),
  tailLines: z.number().int().min(0).default(20),
  onEmpty: z.string().default(""),
  filterStderr: z.boolean().default(false)
}).strict();
var rtkFilterPreserveSchema = z.object({
  errorPatterns: z.array(z.string()).default([]),
  summaryPatterns: z.array(z.string()).default([])
}).strict();
var rtkFilterPackSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  description: z.string().default(""),
  category: rtkFilterCategorySchema,
  priority: z.number().int().min(0).max(100).default(50),
  match: rtkFilterMatchSchema,
  rules: rtkFilterRulesSchema.default({}),
  preserve: rtkFilterPreserveSchema.default(
    {}
  ),
  tests: z.array(rtkInlineTestSchema).default([])
}).strict();
var legacyRtkFilterSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().default(""),
  commandTypes: z.array(z.string().min(1)).min(1),
  category: rtkFilterCategorySchema,
  priority: z.number().int().min(0).max(100).default(50),
  stripPatterns: z.array(z.string()).default([]),
  keepPatterns: z.array(z.string()).default([]),
  priorityPatterns: z.array(z.string()).default([]),
  collapsePatterns: z.array(z.string()).default([]),
  stripAnsi: z.boolean().default(false),
  replace: z.array(rtkReplaceRuleSchema).default([]),
  matchOutput: z.array(rtkMatchOutputRuleSchema).default([]),
  truncateLineAt: z.number().int().min(0).default(0),
  onEmpty: z.string().default(""),
  filterStderr: z.boolean().default(false),
  maxLines: z.number().int().min(0).default(0),
  preserveHead: z.number().int().min(0).default(20),
  preserveTail: z.number().int().min(0).default(20),
  tests: z.array(rtkInlineTestSchema).default([])
}).strict();
var rtkFilterSchema = z.union([rtkFilterPackSchema, legacyRtkFilterSchema]);
function isCanonicalFilter(value) {
  return "label" in value && "match" in value && "rules" in value;
}
function isReDoSProne(pattern) {
  return /\([^()]*(?:[+*]|\{\d+,\})[^()]*\)\s*(?:[+*]|\{\d+,\})/.test(pattern);
}
function dropReDoSProne(patterns) {
  return patterns.filter((p) => !isReDoSProne(p));
}
function validateRtkFilter(value) {
  const parsed = rtkFilterSchema.parse(value);
  if (!isCanonicalFilter(parsed)) {
    const collapse = dropReDoSProne(parsed.collapsePatterns);
    return {
      ...parsed,
      stripPatterns: dropReDoSProne(parsed.stripPatterns),
      keepPatterns: dropReDoSProne(parsed.keepPatterns),
      priorityPatterns: dropReDoSProne(parsed.priorityPatterns),
      collapsePatterns: collapse,
      replace: parsed.replace.filter((r) => !isReDoSProne(r.pattern)),
      matchOutput: parsed.matchOutput.filter((r) => !isReDoSProne(r.pattern)),
      commandPatterns: [],
      matchPatterns: [],
      deduplicate: collapse.length > 0
    };
  }
  const preservePatterns = [...parsed.preserve.errorPatterns, ...parsed.preserve.summaryPatterns];
  return {
    id: parsed.id,
    name: parsed.label,
    description: parsed.description,
    commandTypes: parsed.match.outputTypes,
    commandPatterns: dropReDoSProne(parsed.match.commands),
    matchPatterns: dropReDoSProne(parsed.match.patterns),
    category: parsed.category,
    priority: parsed.priority,
    stripPatterns: dropReDoSProne(parsed.rules.dropPatterns),
    keepPatterns: dropReDoSProne(parsed.rules.includePatterns),
    priorityPatterns: dropReDoSProne(preservePatterns),
    collapsePatterns: dropReDoSProne(parsed.rules.collapsePatterns),
    stripAnsi: parsed.rules.stripAnsi,
    replace: parsed.rules.replace.filter((r) => !isReDoSProne(r.pattern)),
    matchOutput: parsed.rules.matchOutput.filter((r) => !isReDoSProne(r.pattern)),
    truncateLineAt: parsed.rules.truncateLineAt,
    onEmpty: parsed.rules.onEmpty,
    filterStderr: parsed.rules.filterStderr,
    deduplicate: parsed.rules.deduplicate,
    maxLines: parsed.rules.maxLines,
    preserveHead: parsed.rules.headLines,
    preserveTail: parsed.rules.tailLines,
    tests: parsed.tests
  };
}

// open-sse/services/compression/engines/rtk/tomlCompatibility.ts
import crypto2 from "node:crypto";
import { parse as parseToml } from "smol-toml";
import { z as z2 } from "zod";

// open-sse/services/compression/engines/rtk/smartTruncate.ts
function smartTruncate(text, options = {}) {
  const maxChars = Math.max(0, Math.floor(options.maxChars ?? 0));
  const maxLines = Math.max(0, Math.floor(options.maxLines ?? 0));
  const lines = text.split(/\r?\n/);
  const overLineLimit = maxLines > 0 && lines.length > maxLines;
  const overCharLimit = maxChars > 0 && text.length > maxChars;
  if (!overLineLimit && !overCharLimit) {
    return { text, truncated: false, droppedLines: 0 };
  }
  const preserveHead = Math.max(0, Math.floor(options.preserveHead ?? 20));
  const preserveTail = Math.max(0, Math.floor(options.preserveTail ?? 20));
  const priorityPatterns = options.priorityPatterns ?? [];
  const priorityLines = priorityPatterns.length ? lines.filter((line) => priorityPatterns.some((pattern) => pattern.test(line))) : [];
  const head = lines.slice(0, preserveHead);
  const tail = preserveTail > 0 ? lines.slice(-preserveTail) : [];
  const selected = [...head];
  for (const line of priorityLines) {
    if (!selected.includes(line)) selected.push(line);
  }
  const tailStart = lines.length - tail.length;
  tail.forEach((line, offset) => {
    const originalIndex = tailStart + offset;
    if (originalIndex >= preserveHead && !selected.includes(line)) selected.push(line);
  });
  const droppedLines = Math.max(0, lines.length - selected.length);
  let result = [
    ...selected.slice(0, head.length),
    `[rtk:truncated ${droppedLines} lines]`,
    ...selected.slice(head.length)
  ].join("\n");
  if (maxChars > 0 && result.length > maxChars) {
    const marker = "\n[rtk:truncated by chars]\n";
    const budget = Math.max(0, maxChars - marker.length);
    if (budget === 0) {
      result = marker.slice(0, maxChars);
      return { text: result, truncated: true, droppedLines };
    }
    const headChars = Math.ceil(budget * 0.55);
    const tailChars = Math.max(0, budget - headChars);
    const tailText = tailChars > 0 ? result.slice(-tailChars) : "";
    result = `${result.slice(0, headChars)}${marker}${tailText}`;
    if (result.length > maxChars) result = result.slice(0, maxChars);
  }
  return { text: result, truncated: true, droppedLines };
}

// open-sse/services/compression/engines/rtk/lineFilter.ts
var regexCache = /* @__PURE__ */ new Map();
function cachedRegExp(pattern, flags) {
  const key = `${pattern}::${flags}`;
  const cached = regexCache.get(key);
  if (cached) return cached;
  try {
    const re = new RegExp(pattern, flags);
    regexCache.set(key, re);
    return re;
  } catch {
    return null;
  }
}
function compilePatterns(patterns) {
  return patterns.flatMap((pattern) => {
    const re = cachedRegExp(pattern, "i");
    return re ? [re] : [];
  });
}
function compileGlobalPattern(pattern) {
  return cachedRegExp(pattern, "g");
}
function compileBlobPattern(pattern) {
  return cachedRegExp(pattern, "im");
}
function stripAnsi(text) {
  return text.replace(/\u001b\[[0-?]*[ -/]*[@-~]/g, "");
}
function normalizeStderrPrefix(line) {
  return line.replace(/^\s*(?:stderr|err)\s*(?:\||:)\s*/i, "");
}
function applyRtkTomlLineLimits(lines, filter, appliedRules) {
  const head = filter.rtkTomlHeadLines;
  const tail = filter.rtkTomlTailLines;
  const total = lines.length;
  if (head !== void 0 && tail !== void 0) {
    if (total > head + tail) {
      lines = [
        ...lines.slice(0, head),
        `... (${total - head - tail} lines omitted)`,
        ...tail > 0 ? lines.slice(-tail) : []
      ];
      appliedRules.push(`${filter.id}:rtk-head-tail`);
    }
  } else if (head !== void 0 && total > head) {
    lines = [...lines.slice(0, head), `... (${total - head} lines omitted)`];
    appliedRules.push(`${filter.id}:rtk-head`);
  } else if (tail !== void 0 && total > tail) {
    lines = [`... (${total - tail} lines omitted)`, ...tail > 0 ? lines.slice(-tail) : []];
    appliedRules.push(`${filter.id}:rtk-tail`);
  }
  const maxLines = filter.rtkTomlMaxLines;
  if (maxLines !== void 0 && lines.length > maxLines) {
    const dropped = lines.length - maxLines;
    lines = [...lines.slice(0, maxLines), `... (${dropped} lines truncated)`];
    appliedRules.push(`${filter.id}:rtk-max-lines`);
  }
  return lines;
}
function truncateUnicodeSafe(line, maxChars) {
  if (maxChars <= 0) return line;
  const chars = Array.from(line);
  if (chars.length <= maxChars) return line;
  if (maxChars <= 3) return chars.slice(0, maxChars).join("");
  return `${chars.slice(0, maxChars - 3).join("")}...`;
}
function applyLineFilter(text, filter) {
  const stripPatterns = compilePatterns(filter.stripPatterns);
  const keepPatterns = compilePatterns(filter.keepPatterns);
  const collapsePatterns = compilePatterns(filter.collapsePatterns);
  const priorityPatterns = compilePatterns(filter.priorityPatterns);
  const appliedRules = [];
  let lines = text.split(/\r?\n/);
  if (filter.sourceFormat === "rtk-toml-v1" && lines.at(-1) === "") lines.pop();
  const originalLineCount = lines.length;
  if (filter.stripAnsi) {
    const stripped = lines.map(stripAnsi);
    if (stripped.join("\n") !== lines.join("\n")) {
      appliedRules.push(`${filter.id}:strip-ansi`);
    }
    lines = stripped;
  }
  if (filter.filterStderr) {
    const normalized = lines.map(normalizeStderrPrefix);
    if (normalized.join("\n") !== lines.join("\n")) {
      appliedRules.push(`${filter.id}:filter-stderr`);
    }
    lines = normalized;
  }
  for (const rule of filter.replace) {
    const pattern = compileGlobalPattern(rule.pattern);
    if (!pattern) continue;
    const replaced = lines.map((line) => line.replace(pattern, rule.replacement));
    if (replaced.join("\n") !== lines.join("\n")) {
      appliedRules.push(`${filter.id}:replace`);
    }
    lines = replaced;
  }
  if (filter.matchOutput.length > 0) {
    const blob = lines.join("\n");
    for (const rule of filter.matchOutput) {
      const pattern = compileBlobPattern(rule.pattern);
      if (!pattern?.test(blob)) continue;
      const unless = rule.unless ? compileBlobPattern(rule.unless) : null;
      if (unless?.test(blob)) continue;
      appliedRules.push(`${filter.id}:match-output`);
      return {
        text: rule.message,
        strippedLines: Math.max(0, originalLineCount - 1),
        keptByRule: false,
        appliedRules
      };
    }
  }
  if (stripPatterns.length > 0) {
    lines = lines.filter((line) => !stripPatterns.some((pattern) => pattern.test(line)));
    if (lines.length !== originalLineCount) appliedRules.push(`${filter.id}:strip`);
  }
  if (keepPatterns.length > 0) {
    const kept = lines.filter((line) => keepPatterns.some((pattern) => pattern.test(line)));
    if (kept.length > 0) {
      lines = kept;
      appliedRules.push(`${filter.id}:keep`);
    }
  }
  if (collapsePatterns.length > 0) {
    const seen = /* @__PURE__ */ new Set();
    lines = lines.filter((line) => {
      if (!collapsePatterns.some((pattern) => pattern.test(line))) return true;
      const key = line.trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    appliedRules.push(`${filter.id}:collapse`);
  }
  if (filter.truncateLineAt > 0) {
    const truncatedLines = lines.map((line) => truncateUnicodeSafe(line, filter.truncateLineAt));
    if (truncatedLines.join("\n") !== lines.join("\n")) {
      lines = truncatedLines;
      appliedRules.push(`${filter.id}:truncate-line`);
    }
  }
  if (filter.deduplicate) {
    const deduped = deduplicateRepeatedLines(lines.join("\n"));
    if (deduped.collapsed > 0) {
      lines = deduped.text.split(/\r?\n/);
      appliedRules.push(`${filter.id}:deduplicate`);
    }
  }
  if (filter.sourceFormat === "rtk-toml-v1") {
    lines = applyRtkTomlLineLimits(lines, filter, appliedRules);
    const output2 = lines.join("\n");
    const finalOutput = output2.trim().length === 0 && filter.onEmpty ? filter.onEmpty : output2;
    return {
      text: finalOutput,
      strippedLines: Math.max(0, originalLineCount - finalOutput.split(/\r?\n/).length),
      keptByRule: keepPatterns.length > 0,
      appliedRules
    };
  }
  const truncated = smartTruncate(lines.join("\n"), {
    maxLines: filter.maxLines,
    preserveHead: filter.preserveHead,
    preserveTail: filter.preserveTail,
    priorityPatterns
  });
  if (truncated.truncated) appliedRules.push(`${filter.id}:truncate`);
  const output = truncated.text.trim().length === 0 && filter.onEmpty ? filter.onEmpty : truncated.text;
  return {
    text: output,
    strippedLines: Math.max(0, originalLineCount - output.split(/\r?\n/).length),
    keptByRule: keepPatterns.length > 0,
    appliedRules
  };
}

// open-sse/services/compression/engines/rtk/tomlCompatibility.ts
var MAX_TOML_BYTES = 1024 * 1024;
var replaceRuleSchema = z2.object({
  pattern: z2.string().min(1),
  replacement: z2.string()
}).strict();
var matchOutputRuleSchema = z2.object({
  pattern: z2.string().min(1),
  message: z2.string(),
  unless: z2.string().min(1).optional()
}).strict();
var filterSchema = z2.object({
  description: z2.string().optional(),
  match_command: z2.string().min(1),
  strip_ansi: z2.boolean().optional(),
  filter_stderr: z2.boolean().optional(),
  strip_lines_matching: z2.array(z2.string()).optional(),
  keep_lines_matching: z2.array(z2.string()).optional(),
  replace: z2.array(replaceRuleSchema).optional(),
  match_output: z2.array(matchOutputRuleSchema).optional(),
  truncate_lines_at: z2.number().int().min(0).optional(),
  head_lines: z2.number().int().min(0).optional(),
  tail_lines: z2.number().int().min(0).optional(),
  max_lines: z2.number().int().min(0).optional(),
  on_empty: z2.string().optional()
}).strict();
var inlineTestSchema = z2.object({
  name: z2.string().min(1),
  input: z2.string(),
  expected: z2.string()
}).strict();
var fileSchema = z2.object({
  schema_version: z2.literal(1),
  filters: z2.record(z2.string().min(1), filterSchema).default({}),
  tests: z2.record(z2.string().min(1), z2.array(inlineTestSchema)).default({})
}).strict();
function arrayOrEmpty(value) {
  return value ?? [];
}
function numberOrZero(value) {
  return value ?? 0;
}
var RtkTomlCompatibilityError = class extends Error {
  publicMessage;
  constructor(message) {
    super("RTK TOML schema v1 compatibility error");
    this.name = "RtkTomlCompatibilityError";
    this.publicMessage = message;
  }
};
function compatibilityError(message) {
  return new RtkTomlCompatibilityError(message);
}
function categoryFor(name, commandPattern) {
  const value = `${name} ${commandPattern}`.toLowerCase();
  if (/\b(?:git|gh)\b/.test(value)) return "git";
  if (/\b(?:test|jest|vitest|pytest|cargo test|go test|rspec|playwright)\b/.test(value)) {
    return "test";
  }
  if (/\b(?:build|tsc|eslint|ruff|clippy|gradle|make|next|vite|webpack)\b/.test(value)) {
    return "build";
  }
  if (/\b(?:docker|kubectl|podman|compose)\b/.test(value)) return "docker";
  if (/\b(?:npm|pnpm|yarn|bun|pip|poetry|uv|bundle|composer)\b/.test(value)) {
    return "package";
  }
  if (/\b(?:terraform|tofu|ansible|helm|pulumi)\b/.test(value)) return "infra";
  if (/\b(?:aws|gcloud|az|cloudflare)\b/.test(value)) return "cloud";
  if (/\b(?:ls|find|grep|rg|df|du|ps|systemctl|ssh|rsync)\b/.test(value)) return "shell";
  return "generic";
}
function regexFields(filter) {
  return [
    { field: "match_command", pattern: filter.match_command },
    ...(filter.strip_lines_matching ?? []).map((pattern) => ({
      field: "strip_lines_matching",
      pattern
    })),
    ...(filter.keep_lines_matching ?? []).map((pattern) => ({
      field: "keep_lines_matching",
      pattern
    })),
    ...(filter.replace ?? []).map(({ pattern }) => ({ field: "replace.pattern", pattern })),
    ...(filter.match_output ?? []).flatMap(({ pattern, unless }) => [
      { field: "match_output.pattern", pattern },
      ...unless ? [{ field: "match_output.unless", pattern: unless }] : []
    ])
  ];
}
function validateRegexes(name, filter) {
  for (const { field, pattern } of regexFields(filter)) {
    if (isReDoSProne(pattern)) {
      throw compatibilityError(`filter '${name}' has an unsafe regex in ${field}`);
    }
    try {
      new RegExp(pattern);
    } catch {
      throw compatibilityError(`filter '${name}' has an invalid regex in ${field}`);
    }
  }
}
function toDefinition(name, filter, tests) {
  if ((filter.strip_lines_matching?.length ?? 0) > 0 && (filter.keep_lines_matching?.length ?? 0) > 0) {
    throw compatibilityError(
      `filter '${name}' cannot combine strip_lines_matching with keep_lines_matching`
    );
  }
  validateRegexes(name, filter);
  return {
    id: name,
    name,
    description: filter.description ?? "",
    commandTypes: [],
    commandPatterns: [filter.match_command],
    matchPatterns: [],
    category: categoryFor(name, filter.match_command),
    priority: 50,
    stripPatterns: arrayOrEmpty(filter.strip_lines_matching),
    keepPatterns: arrayOrEmpty(filter.keep_lines_matching),
    priorityPatterns: [],
    collapsePatterns: [],
    stripAnsi: filter.strip_ansi ?? false,
    replace: arrayOrEmpty(filter.replace),
    matchOutput: arrayOrEmpty(filter.match_output),
    truncateLineAt: numberOrZero(filter.truncate_lines_at),
    onEmpty: filter.on_empty ?? "",
    filterStderr: false,
    deduplicate: false,
    maxLines: numberOrZero(filter.max_lines),
    preserveHead: 0,
    preserveTail: 0,
    rtkTomlHeadLines: filter.head_lines,
    rtkTomlTailLines: filter.tail_lines,
    rtkTomlMaxLines: filter.max_lines,
    sourceFormat: "rtk-toml-v1",
    tests
  };
}
function comparable(value) {
  return value.replace(/\n+$/g, "");
}
function tomlSyntaxLocation(error) {
  if (typeof error !== "object" || error === null) return "";
  const { line, column } = error;
  if (!Number.isSafeInteger(line) || !Number.isSafeInteger(column)) return "";
  return ` (line ${line}, column ${column})`;
}
function parseRtkTomlV1(content) {
  if (Buffer.byteLength(content, "utf8") > MAX_TOML_BYTES) {
    throw compatibilityError(`file exceeds the ${MAX_TOML_BYTES}-byte limit`);
  }
  let raw;
  try {
    raw = parseToml(content);
  } catch (error) {
    throw compatibilityError(`invalid TOML syntax${tomlSyntaxLocation(error)}`);
  }
  const parsed = fileSchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const field = issue?.path.length ? issue.path.join(".") : "document";
    throw compatibilityError(`${field}: ${issue?.message ?? "invalid document"}`);
  }
  if (Object.keys(parsed.data.filters).length === 0) {
    throw compatibilityError("document contains no filters");
  }
  for (const testName of Object.keys(parsed.data.tests)) {
    if (!(testName in parsed.data.filters)) {
      throw compatibilityError(`tests reference unknown filter '${testName}'`);
    }
  }
  const filters = Object.entries(parsed.data.filters).map(
    ([name, filter]) => toDefinition(name, filter, parsed.data.tests[name] ?? [])
  );
  const outcomes = filters.flatMap(
    (filter) => filter.tests.map((test) => {
      const actual = comparable(applyLineFilter(test.input, filter).text);
      const expected = comparable(test.expected);
      return {
        filterId: filter.id,
        testName: test.name,
        passed: actual === expected,
        actual,
        expected
      };
    })
  );
  const filtersWithoutTests = filters.filter((filter) => filter.tests.length === 0).map((filter) => filter.id);
  const warnings = filtersWithoutTests.map(
    (id) => `Filter '${id}' has no inline tests and should be reviewed before installation`
  );
  for (const [id, filter] of Object.entries(parsed.data.filters)) {
    if (filter.filter_stderr) {
      warnings.push(
        `Filter '${id}': filter_stderr is accepted as a no-op because OmniRoute receives already-captured tool output`
      );
    }
  }
  return {
    schemaVersion: 1,
    sha256: crypto2.createHash("sha256").update(content).digest("hex"),
    filters,
    outcomes,
    filtersWithoutTests,
    warnings,
    passed: outcomes.every((outcome) => outcome.passed)
  };
}

// open-sse/services/compression/engines/rtk/filterLoader.ts
var cache2 = null;
var cacheKey = null;
var diagnostics = [];
var regexCache2 = /* @__PURE__ */ new Map();
function cachedMatchPattern(pattern, value) {
  const key = `${pattern}::im`;
  let re = regexCache2.get(key);
  if (!re) {
    try {
      re = new RegExp(pattern, "im");
      regexCache2.set(key, re);
    } catch {
      return false;
    }
  }
  return re.test(value);
}
function getModuleDir2() {
  const anchors = [process.cwd()];
  const argv1 = process.argv[1];
  if (typeof argv1 === "string" && argv1) anchors.push(path4.dirname(argv1));
  const rel = path4.join("open-sse", "services", "compression");
  for (const anchor of anchors) {
    let dir = path4.resolve(anchor);
    for (let i = 0; i <= 8; i++) {
      if (fs4.existsSync(path4.join(dir, rel))) return dir;
      const parent = path4.dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  }
  return path4.join(os3.homedir(), ".omniroute");
}
function getFiltersDir() {
  const root = getModuleDir2();
  const candidates = [
    path4.join(root, "open-sse", "services", "compression", "engines", "rtk", "filters"),
    path4.join(root, "app", "open-sse", "services", "compression", "engines", "rtk", "filters")
  ];
  return candidates.find((candidate, index) => {
    return candidates.indexOf(candidate) === index && fs4.existsSync(candidate);
  }) ?? candidates[0];
}
function getDataDir() {
  return process.env.DATA_DIR || path4.join(os3.homedir(), ".omniroute");
}
function sha256(value) {
  return crypto3.createHash("sha256").update(value).digest("hex");
}
function projectFiltersTrusted(filtersPath, trustProjectFilters = false) {
  if (trustProjectFilters) return true;
  if (process.env.OMNIROUTE_RTK_TRUST_PROJECT_FILTERS === "1") return true;
  const trustPath = path4.join(path4.dirname(filtersPath), "trust.json");
  if (!fs4.existsSync(trustPath)) return false;
  try {
    const filtersHash = sha256(fs4.readFileSync(filtersPath, "utf8"));
    const trust = JSON.parse(fs4.readFileSync(trustPath, "utf8"));
    const isToml = filtersPath.endsWith(".toml");
    const trustedHash = isToml ? typeof trust.filtersTomlSha256 === "string" ? trust.filtersTomlSha256 : null : typeof trust.filtersSha256 === "string" ? trust.filtersSha256 : typeof trust.trustedFiltersSha256 === "string" ? trust.trustedFiltersSha256 : null;
    if (!trustedHash) return false;
    return trustedHash === filtersHash ? true : "changed";
  } catch {
    return false;
  }
}
function collectFilterSources(options = {}) {
  const sources = [];
  if (options.customFiltersEnabled !== false) {
    collectProjectFilterSources(sources, options);
    collectGlobalFilterSources(sources);
  }
  collectBuiltinFilterSources(sources);
  return sources;
}
function collectProjectFilterSources(sources, options) {
  const projectCandidates = [
    { path: path4.join(process.cwd(), ".rtk", "filters.toml"), format: "rtk-toml-v1" },
    { path: path4.join(process.cwd(), ".rtk", "filters.json"), format: "omniroute-json" }
  ];
  for (const candidate of projectCandidates) {
    if (!fs4.existsSync(candidate.path)) continue;
    const trusted = projectFiltersTrusted(candidate.path, options.trustProjectFilters === true);
    if (trusted === true) {
      sources.push({ source: "project", ...candidate, trusted: true });
      continue;
    }
    diagnostics.push({
      source: "project",
      format: candidate.format,
      path: candidate.path,
      level: "warning",
      message: trusted === "changed" ? "Project RTK filters changed after trust and were skipped" : "Project RTK filters are untrusted and were skipped"
    });
  }
}
function collectGlobalFilterSources(sources) {
  const globalCandidates = [
    { path: path4.join(getDataDir(), "rtk", "filters.toml"), format: "rtk-toml-v1" },
    { path: path4.join(getDataDir(), "rtk", "filters.json"), format: "omniroute-json" }
  ];
  for (const candidate of globalCandidates) {
    if (fs4.existsSync(candidate.path)) {
      sources.push({ source: "global", ...candidate, trusted: true });
    }
  }
}
function collectBuiltinFilterSources(sources) {
  const builtinDir = getFiltersDir();
  if (fs4.existsSync(builtinDir)) {
    let builtinFiles = [];
    try {
      builtinFiles = fs4.readdirSync(builtinDir).filter((entry) => entry.endsWith(".json")).sort();
    } catch {
      builtinFiles = [];
    }
    for (const file of builtinFiles) {
      sources.push({
        source: "builtin",
        path: path4.join(builtinDir, file),
        trusted: true,
        format: "omniroute-json"
      });
    }
  }
}
function parseFilterFile(source) {
  try {
    const content = fs4.readFileSync(source.path, "utf8");
    const definitions = source.format === "rtk-toml-v1" ? (() => {
      const result = parseRtkTomlV1(content);
      if (!result.passed) {
        throw new Error("one or more inline tests failed");
      }
      for (const warning of result.warnings) {
        diagnostics.push({
          source: source.source,
          format: source.format,
          path: source.path,
          level: "warning",
          message: warning
        });
      }
      return result.filters;
    })() : (() => {
      const parsed = JSON.parse(content);
      const entries = Array.isArray(parsed) ? parsed : [parsed];
      return entries.map(validateRtkFilter);
    })();
    return definitions.map((definition) => ({
      ...definition,
      source: source.source,
      sourceFormat: definition.sourceFormat ?? source.format
    }));
  } catch (error) {
    const message = error instanceof RtkTomlCompatibilityError ? error.publicMessage : error instanceof Error ? error.message : String(error);
    if (source.source === "builtin") {
      throw new Error(`Invalid RTK filter ${path4.basename(source.path)}: ${message}`);
    }
    diagnostics.push({
      source: source.source,
      format: source.format,
      path: source.path,
      level: "warning",
      message: `Invalid custom RTK filter skipped: ${message}`
    });
    return [];
  }
}
function loadRtkFilters(options = {}) {
  const currentCacheKey = [
    process.cwd(),
    getDataDir(),
    options.customFiltersEnabled === false ? "builtin-only" : "custom",
    options.trustProjectFilters === true ? "trusted-project" : "trust-file",
    process.env.OMNIROUTE_RTK_TRUST_PROJECT_FILTERS === "1" ? "env-trust" : "env-normal"
  ].join("|");
  if (cache2 && cacheKey === currentCacheKey && !options.refresh) return cache2;
  diagnostics = [];
  const filters = [];
  for (const source of collectFilterSources(options)) {
    filters.push(...parseFilterFile(source));
  }
  const sourceRank = { project: 3, global: 2, builtin: 1 };
  const formatRank = { "rtk-toml-v1": 2, "omniroute-json": 1 };
  const sorted = filters.sort(
    (a, b) => sourceRank[b.source ?? "builtin"] - sourceRank[a.source ?? "builtin"] || formatRank[b.sourceFormat ?? "omniroute-json"] - formatRank[a.sourceFormat ?? "omniroute-json"] || b.priority - a.priority || a.id.localeCompare(b.id)
  );
  cache2 = sorted;
  cacheKey = currentCacheKey;
  return sorted;
}
function matchRtkFilter(text, command, options = {}) {
  const detection = detectCommandType(text, command);
  const detectedCommand = detection.command ?? command ?? "";
  const filters = loadRtkFilters(options);
  for (const source of ["project", "global", "builtin"]) {
    const scoped = filters.filter((filter) => (filter.source ?? "builtin") === source);
    const matched = scoped.find(
      (filter) => filter.sourceFormat === "rtk-toml-v1" && detectedCommand && filter.commandPatterns.some((pattern) => cachedMatchPattern(pattern, detectedCommand))
    ) ?? scoped.find((filter) => filter.commandTypes.includes(detection.type)) ?? scoped.find(
      (filter) => detectedCommand && filter.commandPatterns.some((pattern) => cachedMatchPattern(pattern, detectedCommand))
    ) ?? scoped.find(
      (filter) => filter.matchPatterns.some((pattern) => cachedMatchPattern(pattern, text))
    );
    if (matched) return matched;
  }
  return filters.find((filter) => filter.commandTypes.includes("generic-output")) ?? null;
}

// open-sse/services/compression/engines/rtk/codeStripper.ts
import { createRequire as createRequire2 } from "node:module";
var typeScriptModule;
var warnedMissingTypeScript = false;
var loadTypeScriptModule = defaultLoadTypeScriptModule;
function defaultLoadTypeScriptModule() {
  try {
    const requireFromHere = createRequire2(import.meta.url);
    return requireFromHere("typescript");
  } catch {
    return null;
  }
}
function resolveTypeScript() {
  if (typeScriptModule === void 0) {
    typeScriptModule = loadTypeScriptModule();
    if (!typeScriptModule && !warnedMissingTypeScript) {
      warnedMissingTypeScript = true;
      console.warn(
        "[compression/rtk] optional dependency 'typescript' is not installed; skipping AST-based code-comment stripping (compression still works). Install 'typescript' to re-enable it."
      );
    }
  }
  return typeScriptModule;
}
var LANGUAGE_ALIASES = {
  js: "javascript",
  jsx: "javascript",
  javascript: "javascript",
  ts: "typescript",
  tsx: "typescript",
  typescript: "typescript",
  py: "python",
  python: "python",
  rs: "rust",
  rust: "rust",
  go: "go",
  rb: "ruby",
  ruby: "ruby",
  java: "java"
};
function normalizeCodeLanguage(language) {
  if (!language) return "unknown";
  return LANGUAGE_ALIASES[language.trim().toLowerCase()] ?? "unknown";
}
function detectCodeLanguage(text) {
  if (/\b(?:interface|type)\s+\w+\s*=|:\s*(?:string|number|boolean)\b/.test(text)) {
    return "typescript";
  }
  if (/\b(?:const|let|function|import|export)\b|=>/.test(text)) return "javascript";
  if (/\bdef\s+\w+\(|\bimport\s+\w+|print\(/.test(text)) return "python";
  if (/\bfn\s+\w+\(|\blet\s+mut\b|println!\(/.test(text)) return "rust";
  if (/\bfunc\s+\w+\(|package\s+\w+/.test(text)) return "go";
  if (/\bclass\s+\w+|System\.out\.println/.test(text)) return "java";
  if (/\bdef\s+\w+|puts\s+|end\s*$/.test(text)) return "ruby";
  return "unknown";
}
function stripJsTsComments(text, preserveDocstrings) {
  const ts = resolveTypeScript();
  if (!ts) return text;
  const source = ts.createSourceFile(
    "snippet.tsx",
    text,
    ts.ScriptTarget.Latest,
    /* setParentNodes */
    true,
    ts.ScriptKind.TSX
  );
  let hasJsx = false;
  const detectJsx = (node) => {
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node) || ts.isJsxFragment(node)) {
      hasJsx = true;
      return;
    }
    if (!hasJsx) ts.forEachChild(node, detectJsx);
  };
  detectJsx(source);
  if (hasJsx) return text;
  const ranges = /* @__PURE__ */ new Map();
  const collect = (node) => {
    for (const range of ts.getLeadingCommentRanges(text, node.getFullStart()) ?? []) {
      ranges.set(range.pos, range);
    }
    for (const range of ts.getTrailingCommentRanges(text, node.getEnd()) ?? []) {
      ranges.set(range.pos, range);
    }
    ts.forEachChild(node, collect);
  };
  collect(source);
  if (ranges.size === 0) return text;
  let result = text;
  for (const range of [...ranges.values()].sort((a, b) => b.pos - a.pos)) {
    if (preserveDocstrings && text.startsWith("/**", range.pos)) continue;
    result = result.slice(0, range.pos) + result.slice(range.end);
  }
  return result;
}
function stripCode(text, language = "unknown", options = {}) {
  const resolvedLanguage = language === "unknown" ? detectCodeLanguage(text) : language;
  const opts = {
    // Opt-in (default false): historically this flag was read but never applied,
    // so the effective behaviour was "preserve". Keeping the default at preserve
    // avoids a silent production change; callers opt in with removeComments:true.
    removeComments: options.removeComments === true,
    removeEmptyLines: options.removeEmptyLines !== false,
    collapseWhitespace: options.collapseWhitespace !== false,
    preserveDocstrings: options.preserveDocstrings === true
  };
  const originalLines = text.split(/\r?\n/).length;
  let result = text;
  if (opts.removeComments && (resolvedLanguage === "javascript" || resolvedLanguage === "typescript")) {
    result = stripJsTsComments(result, opts.preserveDocstrings);
  }
  if (opts.removeEmptyLines) result = result.replace(/^\s*$(?:\r?\n)?/gm, "");
  if (opts.collapseWhitespace) {
    result = result.split(/\r?\n/).map((line) => line.replace(/[ \t]+$/g, "")).join("\n");
  }
  result = result.replace(/^\s*\n/, "").replace(/\n\s*$/, "");
  const strippedLines = Math.max(0, originalLines - (result ? result.split(/\r?\n/).length : 0));
  return { text: result, strippedLines, language: resolvedLanguage };
}

// open-sse/services/compression/engines/rtk/rawOutput.ts
import fs5 from "node:fs";
import fsp from "node:fs/promises";
import path5 from "node:path";
import os4 from "node:os";
import crypto4 from "node:crypto";
var SECRET_PATTERNS = [
  [/\b(sk-[A-Za-z0-9_-]{16,})\b/g, "[REDACTED_OPENAI_KEY]"],
  [/\b(xox[baprs]-[A-Za-z0-9-]{16,})\b/g, "[REDACTED_SLACK_TOKEN]"],
  [/\b(AKIA[0-9A-Z]{16})\b/g, "[REDACTED_AWS_KEY]"],
  // key=value / key: value for common credential field names (flat alternation — no nesting,
  // so no ReDoS). Covers names the bare token/secret/password set misses (private_key, etc).
  [
    /((?:api[_-]?key|api[_-]?token|access[_-]?key|access[_-]?token|client[_-]?secret|auth[_-]?token|private[_-]?key|secret[_-]?key|credentials?|token|secret|password)\s*[:=]\s*)("[^"]+"|'[^']+'|[^\s]+)/gi,
    "$1[REDACTED]"
  ],
  // Authorization / Proxy-Authorization with Bearer OR Basic (curl -v emits Basic <base64>).
  [/((?:Proxy-)?Authorization:\s*(?:Bearer|Basic)\s+)[A-Za-z0-9._~+/-]+=*/gi, "$1[REDACTED]"]
];
function dataDir() {
  return process.env.DATA_DIR || path5.join(os4.homedir(), ".omniroute");
}
function safeId(seed) {
  return crypto4.createHash("sha256").update(seed).digest("hex").slice(0, 24);
}
function safeUtf8Slice(value, maxBytes) {
  if (maxBytes <= 0 || Buffer.byteLength(value, "utf8") <= maxBytes) return value;
  let bytes = 0;
  let output = "";
  for (const char of value) {
    const len = Buffer.byteLength(char, "utf8");
    if (bytes + len > maxBytes) break;
    output += char;
    bytes += len;
  }
  return `${output}

--- truncated at ${maxBytes} bytes ---`;
}
function redactRtkRawOutput(value) {
  let redacted = false;
  let text = value;
  for (const [pattern, replacement] of SECRET_PATTERNS) {
    const next = text.replace(pattern, (...args) => {
      redacted = true;
      return typeof replacement === "string" ? replacement.replace("$1", args[1] ?? "") : replacement;
    });
    text = next;
  }
  return { text, redacted };
}
function isLikelyFailureOutput(value) {
  return /\b(error|failed|failure|exception|traceback|panic|fatal|critical|TS\d{4}|FAIL)\b/i.test(
    value
  );
}
var RAW_OUTPUT_BUCKET_LEN = 2;
var LEGACY_FLAT_SCAN_GUARD = 1e5;
function rawOutputDir() {
  return path5.join(dataDir(), "rtk", "raw-output");
}
function bucketDir(id) {
  return path5.join(rawOutputDir(), id.slice(0, RAW_OUTPUT_BUCKET_LEN));
}
function maybePersistRtkRawOutput(raw, options) {
  if (options.retention === "never") return null;
  const failure = options.failure ?? isLikelyFailureOutput(raw);
  if (options.retention === "failures" && !failure) return null;
  if (raw.trim().length === 0) return null;
  const maxBytes = Math.max(1024, Math.floor(options.maxBytes ?? 1048576));
  const redaction = redactRtkRawOutput(safeUtf8Slice(raw, maxBytes));
  const now = Date.now();
  const commandSlug = (options.command || "tool-output").replace(/[^A-Za-z0-9_-]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 48);
  const id = safeId(`${now}:${commandSlug}:${raw.length}:${redaction.text}`);
  const dir = bucketDir(id);
  const fileName = `${now}-${commandSlug || "tool-output"}-${id}.log`;
  const filePath = path5.join(dir, fileName);
  try {
    fs5.mkdirSync(dir, { recursive: true });
    fs5.writeFileSync(filePath, redaction.text);
  } catch {
    return null;
  }
  try {
    const metaPath = filePath.replace(/\.log$/, ".meta.json");
    fs5.writeFileSync(
      metaPath,
      JSON.stringify({
        command: options.command ?? null,
        timestamp: now,
        failure,
        redacted: redaction.redacted,
        bytes: Buffer.byteLength(redaction.text, "utf8")
      })
    );
  } catch {
  }
  return {
    id,
    path: filePath,
    bytes: Buffer.byteLength(redaction.text, "utf8"),
    sha256: crypto4.createHash("sha256").update(redaction.text).digest("hex"),
    redacted: redaction.redacted
  };
}
var PURGE_THROTTLE_MS = 6e4;
var lastRawOutputPurgeAt = 0;
async function mapLimit(items, limit, fn) {
  let index = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (index < items.length) {
      const item = items[index++];
      await fn(item);
    }
  });
  await Promise.all(workers);
}
async function purgeRtkRawOutput(opts = {}) {
  const now = Date.now();
  if (now - lastRawOutputPurgeAt < PURGE_THROTTLE_MS) {
    return { skipped: true, scanned: 0, deleted: 0, errors: 0 };
  }
  lastRawOutputPurgeAt = now;
  const maxAgeDays = Math.max(1, Math.floor(opts.maxAgeDays ?? 30));
  const maxFiles = Math.max(1, Math.floor(opts.maxFiles ?? 1e5));
  const maxAgeMs = maxAgeDays * 864e5;
  const dir = rawOutputDir();
  const result = { skipped: false, scanned: 0, deleted: 0, errors: 0 };
  if (!fs5.existsSync(dir)) return result;
  try {
    const candidates = [];
    const flat = await fsp.readdir(dir);
    if (flat.length > LEGACY_FLAT_SCAN_GUARD) {
      console.warn(
        `[rtk-raw-output] legacy flat store has ${flat.length} entries; purge skips flat scan this run (one-off manual cleanup recommended)`
      );
    } else {
      for (const name of flat) {
        if (!name.endsWith(".log")) continue;
        candidates.push({
          file: path5.join(dir, name),
          meta: path5.join(dir, name.replace(/\.log$/, ".meta.json")),
          ts: parseInt(name, 10) || 0
        });
      }
    }
    for (const entry of flat) {
      if (entry.length !== RAW_OUTPUT_BUCKET_LEN) continue;
      const subPath = path5.join(dir, entry);
      let isDir = false;
      try {
        isDir = (await fsp.stat(subPath)).isDirectory();
      } catch {
        continue;
      }
      if (!isDir) continue;
      let subEntries;
      try {
        subEntries = await fsp.readdir(subPath);
      } catch {
        continue;
      }
      for (const name of subEntries) {
        if (!name.endsWith(".log")) continue;
        candidates.push({
          file: path5.join(subPath, name),
          meta: path5.join(subPath, name.replace(/\.log$/, ".meta.json")),
          ts: parseInt(name, 10) || 0
        });
      }
    }
    result.scanned = candidates.length;
    const agedOut = candidates.filter((c) => c.ts > 0 && now - c.ts > maxAgeMs);
    const remaining = candidates.filter((c) => !agedOut.includes(c));
    remaining.sort((a, b) => b.ts - a.ts || (a.file < b.file ? 1 : -1));
    const keep = new Set(remaining.slice(0, maxFiles).map((c) => c.file));
    const overflow = remaining.filter((c) => !keep.has(c.file));
    await mapLimit([...agedOut, ...overflow], 32, async (c) => {
      try {
        await fsp.unlink(c.file);
        result.deleted++;
      } catch {
        result.errors++;
      }
      if (c.meta) {
        try {
          await fsp.unlink(c.meta);
        } catch {
        }
      }
    });
    if (result.deleted > 0 || result.errors > 0) {
      console.log(
        `[rtk-raw-output] purge: scanned=${result.scanned} deleted=${result.deleted} errors=${result.errors} (maxFiles=${maxFiles}, maxAgeDays=${maxAgeDays})`
      );
    }
  } catch (err) {
    console.warn("[rtk-raw-output] purge failed:", err.message);
    result.errors++;
  }
  return result;
}
function scheduleRtkRawOutputPurge(opts = {}) {
  setImmediate(() => {
    void purgeRtkRawOutput(opts).catch(() => {
    });
  });
}

// open-sse/services/compression/engines/rtk/renderers/types.ts
var NO_RENDER = (text) => ({ text, changed: false, renderer: "" });

// open-sse/services/compression/engines/rtk/renderers/gitDiff.ts
function renderGitDiff(text, _detection) {
  if (!text.includes("@@ ")) {
    return NO_RENDER(text);
  }
  const kept = [];
  for (const line of text.split("\n")) {
    if (line.startsWith("diff --git ") || line.startsWith("@@ ")) {
      kept.push(line);
    } else if (/^[+-](?![+-])/.test(line)) {
      kept.push(line);
    }
  }
  const out = kept.join("\n");
  if (out === text) return NO_RENDER(text);
  return { text: out, changed: true, renderer: "git-diff" };
}

// open-sse/services/compression/engines/rtk/renderers/testGreen.ts
function renderTestGreen(text, _detection) {
  const stripped = text.replace(/\[[0-9;]*m/g, "");
  if (/\bFAIL\b/.test(stripped)) return NO_RENDER(text);
  if (/✖/.test(stripped)) return NO_RENDER(text);
  if (/Error/.test(stripped)) return NO_RENDER(text);
  if (/Traceback/.test(stripped)) return NO_RENDER(text);
  if (/AssertionError/.test(stripped)) return NO_RENDER(text);
  const failedMatch = stripped.match(/(\d+)\s+failed/i) ?? stripped.match(/failed[:\s]+(\d+)/i);
  if (failedMatch && parseInt(failedMatch[1], 10) > 0) return NO_RENDER(text);
  const summary = extractSummaryLine(stripped);
  if (!summary) return NO_RENDER(text);
  return { text: summary, changed: true, renderer: "test-green" };
}
function extractSummaryLine(text) {
  const lines = text.split("\n");
  for (const line of lines) {
    if (/={3,}\s+\d+\s+passed/.test(line)) return line.trim();
  }
  for (const line of lines) {
    if (/Tests:\s+\d+\s+passed/.test(line)) return line.trim();
  }
  for (const line of lines) {
    if (/\d+\s+tests?\s+passed/i.test(line)) return line.trim();
  }
  if (text.trim() === "" || text.trim().startsWith("\n")) {
    return "ESLint: 0 problems found";
  }
  return null;
}

// open-sse/services/compression/engines/rtk/renderers/terraformPlan.ts
function renderTerraformPlan(text, _detection) {
  if (/^No changes\./m.test(text)) return NO_RENDER(text);
  const planMatch = text.match(/Plan:\s+(\d+)\s+to add,\s+(\d+)\s+to change,\s+(\d+)\s+to destroy/);
  if (!planMatch) return NO_RENDER(text);
  const [, add, change, destroy] = planMatch;
  const summary = `Plan: +${add} ~${change} -${destroy}`;
  const resources = [];
  for (const line of text.split("\n")) {
    const m = line.match(/^\s+#\s+(\S+)\s+will\s+be\s+\S+/);
    if (m) {
      resources.push(`  # ${m[1]} will be ${line.trim().replace(/^#\s+\S+\s+will\s+be\s+/, "")}`);
    }
  }
  const out = [summary, ...resources].join("\n");
  return { text: out, changed: true, renderer: "terraform-plan" };
}

// open-sse/services/compression/engines/rtk/renderers/structuredTable.ts
var MAX_TABLE_ROWS = 200;
var MAX_COLUMNS = 5;
var PRIORITY_KEYS = ["name", "id", "status", "type", "kind"];
function renderStructuredTable(text, _detection) {
  const parsed = tryParse(text.trim());
  if (!parsed) return NO_RENDER(text);
  if (!Array.isArray(parsed) || parsed.length < 2) return NO_RENDER(text);
  const items = parsed;
  if (!items.every((item) => item !== null && typeof item === "object" && !Array.isArray(item))) {
    return NO_RENDER(text);
  }
  const objects = items;
  const keyCount = {};
  for (const obj of objects) {
    for (const [k, v] of Object.entries(obj)) {
      if (v === null || typeof v !== "object") {
        keyCount[k] = (keyCount[k] ?? 0) + 1;
      }
    }
  }
  if (Object.keys(keyCount).length === 0) return NO_RENDER(text);
  const threshold = Math.floor(objects.length / 2);
  const candidateKeys = Object.entries(keyCount).filter(([, count2]) => count2 >= threshold).map(([k]) => k);
  const priorityChosen = PRIORITY_KEYS.filter((k) => candidateKeys.includes(k));
  const rest = candidateKeys.filter((k) => !PRIORITY_KEYS.includes(k)).sort((a, b) => (keyCount[b] ?? 0) - (keyCount[a] ?? 0));
  const columns = [...priorityChosen, ...rest].slice(0, MAX_COLUMNS);
  if (columns.length === 0) return NO_RENDER(text);
  const rows = objects.slice(0, MAX_TABLE_ROWS);
  const extra = objects.length > MAX_TABLE_ROWS ? objects.length - MAX_TABLE_ROWS : 0;
  const header = columns.join("	");
  const body = rows.map((obj) => columns.map((k) => String(obj[k] ?? "")).join("	")).join("\n");
  const out = extra > 0 ? `${header}
${body}
\u2026 (+${extra} more)` : `${header}
${body}`;
  return { text: out, changed: true, renderer: "structured-table" };
}
function tryParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(text.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

// open-sse/services/compression/engines/rtk/renderers/index.ts
var REGISTRY = {};
REGISTRY["git-diff"] = renderGitDiff;
REGISTRY["test-pytest"] = renderTestGreen;
REGISTRY["test-jest"] = renderTestGreen;
REGISTRY["test-vitest"] = renderTestGreen;
REGISTRY["build-eslint"] = renderTestGreen;
REGISTRY["terraform-plan"] = renderTerraformPlan;
REGISTRY["tofu-plan"] = renderTerraformPlan;
REGISTRY["aws"] = renderStructuredTable;
REGISTRY["json-output"] = renderStructuredTable;
function applyRenderer(text, detection, config) {
  const r = REGISTRY[detection.type];
  if (!r) return NO_RENDER(text);
  if (config.renderers && config.renderers.length > 0 && !config.renderers.includes(detection.type)) {
    return NO_RENDER(text);
  }
  return r(text, detection);
}

// open-sse/services/compression/engines/rtk/index.ts
var SHELL_TOOL_NAME_RE = /\b(bash|shell|terminal|run_command|execute_command|exec|command)\b/;
function hasCacheControlMarker(part) {
  return !!part && typeof part === "object" && part.cache_control !== void 0 && part.cache_control !== null;
}
function resolveToolMeta(toolId, lookup) {
  const meta = toolId ? lookup.get(toolId) : null;
  if (!meta) return { command: null, skipFilters: false };
  if (SHELL_TOOL_NAME_RE.test(meta.toolName.toLowerCase())) {
    return { command: meta.command, skipFilters: false };
  }
  return { command: null, skipFilters: true };
}
function mergeRtkConfig(base, override) {
  const merged = { ...DEFAULT_RTK_CONFIG, ...base ?? {}, ...override ?? {} };
  return {
    ...merged,
    intensity: merged.intensity === "minimal" || merged.intensity === "standard" || merged.intensity === "aggressive" ? merged.intensity : DEFAULT_RTK_CONFIG.intensity,
    enabledFilters: Array.isArray(merged.enabledFilters) ? merged.enabledFilters.filter((id) => typeof id === "string") : [],
    disabledFilters: Array.isArray(merged.disabledFilters) ? merged.disabledFilters.filter((id) => typeof id === "string") : [],
    maxLinesPerResult: typeof merged.maxLinesPerResult === "number" && Number.isFinite(merged.maxLinesPerResult) ? Math.max(0, Math.floor(merged.maxLinesPerResult)) : DEFAULT_RTK_CONFIG.maxLinesPerResult,
    maxCharsPerResult: typeof merged.maxCharsPerResult === "number" && Number.isFinite(merged.maxCharsPerResult) ? Math.max(0, Math.floor(merged.maxCharsPerResult)) : DEFAULT_RTK_CONFIG.maxCharsPerResult,
    deduplicateThreshold: typeof merged.deduplicateThreshold === "number" && Number.isFinite(merged.deduplicateThreshold) ? Math.max(2, Math.floor(merged.deduplicateThreshold)) : DEFAULT_RTK_CONFIG.deduplicateThreshold,
    customFiltersEnabled: typeof merged.customFiltersEnabled === "boolean" ? merged.customFiltersEnabled : DEFAULT_RTK_CONFIG.customFiltersEnabled,
    trustProjectFilters: typeof merged.trustProjectFilters === "boolean" ? merged.trustProjectFilters : DEFAULT_RTK_CONFIG.trustProjectFilters,
    rawOutputRetention: merged.rawOutputRetention === "never" || merged.rawOutputRetention === "failures" || merged.rawOutputRetention === "always" ? merged.rawOutputRetention : DEFAULT_RTK_CONFIG.rawOutputRetention,
    rawOutputMaxBytes: typeof merged.rawOutputMaxBytes === "number" && Number.isFinite(merged.rawOutputMaxBytes) ? Math.max(1024, Math.floor(merged.rawOutputMaxBytes)) : DEFAULT_RTK_CONFIG.rawOutputMaxBytes,
    rawOutputMaxFiles: typeof merged.rawOutputMaxFiles === "number" && Number.isFinite(merged.rawOutputMaxFiles) ? Math.max(1, Math.floor(merged.rawOutputMaxFiles)) : DEFAULT_RTK_CONFIG.rawOutputMaxFiles,
    rawOutputMaxAgeDays: typeof merged.rawOutputMaxAgeDays === "number" && Number.isFinite(merged.rawOutputMaxAgeDays) ? Math.max(1, Math.floor(merged.rawOutputMaxAgeDays)) : DEFAULT_RTK_CONFIG.rawOutputMaxAgeDays
  };
}
function shouldCompressMessage(message, config) {
  if (config.applyToToolResults && Array.isArray(message.content) && message.content.some(isAnthropicToolResultBlock))
    return true;
  if (message.role === "tool")
    return config.applyToToolResults || config.applyToCodeBlocks && hasCodeFence(message.content);
  if (message.role === "assistant")
    return config.applyToAssistantMessages || config.applyToCodeBlocks && hasCodeFence(message.content);
  return false;
}
function hasCodeFence(content) {
  if (!content) return false;
  if (typeof content === "string") return /```/.test(content);
  if (!Array.isArray(content)) return false;
  return content.some(
    (part) => isTextBlock(part) && typeof part.text === "string" && /```/.test(part.text)
  );
}
function codeOnlyConfig(config) {
  return config.applyToCodeBlocks && !config.applyToToolResults && !config.applyToAssistantMessages;
}
function processRtkCodeBlocksOnly(content, config) {
  const techniquesUsed = [];
  const rulesApplied = [];
  const rawOutputPointers = [];
  const processText = (text) => {
    let compressed2 = false;
    const nextText = text.replace(/```([\s\S]*?)```/g, (match) => {
      const processed = processRtkText(match, { config });
      techniquesUsed.push(...processed.techniquesUsed);
      rulesApplied.push(...processed.rulesApplied);
      if (processed.rawOutputPointers) rawOutputPointers.push(...processed.rawOutputPointers);
      if (!processed.compressed) return match;
      compressed2 = true;
      return processed.text;
    });
    return { text: compressed2 ? nextText : text, compressed: compressed2 };
  };
  if (typeof content === "string") {
    const processed = processText(content);
    return {
      content: processed.text,
      compressed: processed.compressed,
      techniquesUsed,
      rulesApplied,
      rawOutputPointers
    };
  }
  if (!Array.isArray(content)) {
    return { content, compressed: false, techniquesUsed, rulesApplied, rawOutputPointers };
  }
  let compressed = false;
  const nextContent = content.map((part) => {
    if (!isTextBlock(part) || !part.text) return part;
    const processed = processText(part.text);
    if (!processed.compressed) return part;
    compressed = true;
    return { ...part, text: processed.text };
  });
  return {
    content: compressed ? nextContent : content,
    compressed,
    techniquesUsed,
    rulesApplied,
    rawOutputPointers
  };
}
function processRtkText(text, options = {}) {
  const config = mergeRtkConfig(options.config);
  const originalTokens = estimateCompressionTokens(text);
  const techniquesUsed = [];
  const rulesApplied = [];
  const rawOutputPointers = [];
  let result = text;
  const detection = detectCommandType(text, options.command);
  const hasGenericErrorMarkers = /Error:|Exception:|Traceback \(most recent call last\):/.test(
    text
  );
  const isDocumentLikeRead = detection.type === "unknown" && !detection.command && !hasGenericErrorMarkers;
  let matchedFilterPatterns = [];
  if (!options.skipFilters && !isDocumentLikeRead) {
    const filter = matchRtkFilter(text, detection.command, {
      customFiltersEnabled: config.customFiltersEnabled,
      trustProjectFilters: config.trustProjectFilters
    });
    if (filter && !config.disabledFilters.includes(filter.id)) {
      if (config.enabledFilters.length === 0 || config.enabledFilters.includes(filter.id)) {
        const filtered = applyLineFilter(result, {
          ...filter,
          maxLines: effectiveMaxLines(filter.maxLines || config.maxLinesPerResult, config.intensity)
        });
        result = filtered.text;
        if (filtered.appliedRules.length > 0) {
          techniquesUsed.push("rtk-filter");
          rulesApplied.push(...filtered.appliedRules);
        }
        matchedFilterPatterns = filter.priorityPatterns;
      }
    }
  }
  if (config.enableRenderers) {
    try {
      const rendered = applyRenderer(result, detection, config);
      if (rendered.changed) {
        result = rendered.text;
        techniquesUsed.push(`rtk-render:${rendered.renderer}`);
        rulesApplied.push(`rtk:render:${rendered.renderer}`);
      }
    } catch {
    }
  }
  if (config.applyToCodeBlocks) {
    let strippedCodeBlocks = 0;
    result = result.replace(
      /```([A-Za-z0-9_+.-]*)\r?\n([\s\S]*?)```/g,
      (match, languageHint, code) => {
        const stripped = stripCode(code, normalizeCodeLanguage(languageHint), {
          // Opt-in comment removal (default off = no silent production change). Docstrings/JSDoc
          // are preserved unless explicitly disabled.
          removeComments: config.stripCodeComments === true,
          preserveDocstrings: config.preserveDocstrings !== false
        });
        if (stripped.strippedLines <= 0 && stripped.text === code.trim()) return match;
        strippedCodeBlocks++;
        const fenceLanguage = languageHint?.trim() || stripped.language;
        return `\`\`\`${fenceLanguage}
${stripped.text}
\`\`\``;
      }
    );
    if (strippedCodeBlocks > 0) {
      techniquesUsed.push("rtk-code-strip");
      rulesApplied.push("rtk:code-strip");
    }
  }
  const deduped = deduplicateRepeatedLines(result, { threshold: config.deduplicateThreshold });
  if (deduped.collapsed > 0) {
    result = deduped.text;
    techniquesUsed.push("rtk-dedup");
    rulesApplied.push("rtk:dedup");
  }
  if (config.enableGrouping) {
    const grouped = groupSimilarLines(result, {
      threshold: config.groupingThreshold
    });
    if (grouped.grouped > 0) {
      result = grouped.text;
      techniquesUsed.push("rtk-grouping");
      rulesApplied.push("rtk:grouping");
    }
  }
  const defaultPriorityPatterns = [/error|failed|exception|traceback|TS\d{4}|FAIL|✖/i];
  const filterPriorityPatterns = matchedFilterPatterns.flatMap((pattern) => {
    try {
      return [new RegExp(pattern, "i")];
    } catch {
      return [];
    }
  });
  const truncated = isDocumentLikeRead ? { text: result, truncated: false, droppedLines: 0 } : smartTruncate(result, {
    maxLines: effectiveMaxLines(config.maxLinesPerResult, config.intensity),
    maxChars: config.maxCharsPerResult,
    preserveHead: config.intensity === "aggressive" ? 16 : 24,
    preserveTail: config.intensity === "aggressive" ? 16 : 24,
    priorityPatterns: [...defaultPriorityPatterns, ...filterPriorityPatterns]
  });
  if (truncated.truncated) {
    result = truncated.text;
    techniquesUsed.push("rtk-truncate");
    rulesApplied.push("rtk:truncate");
  }
  const compressedTokens = estimateCompressionTokens(result);
  if (compressedTokens < originalTokens) {
    const pointer = maybePersistRtkRawOutput(text, {
      retention: config.rawOutputRetention,
      command: detection.command,
      maxBytes: config.rawOutputMaxBytes
    });
    if (pointer) {
      rawOutputPointers.push(pointer);
      techniquesUsed.push("rtk-raw-output-retention");
      rulesApplied.push("rtk:raw-output-retention");
    }
    if (config.rawOutputRetention !== "never") {
      scheduleRtkRawOutputPurge({
        maxFiles: config.rawOutputMaxFiles,
        maxAgeDays: config.rawOutputMaxAgeDays
      });
    }
  }
  return {
    text: result,
    compressed: compressedTokens < originalTokens,
    originalTokens,
    compressedTokens,
    techniquesUsed: [...new Set(techniquesUsed)],
    rulesApplied: [...new Set(rulesApplied)],
    ...rawOutputPointers.length > 0 ? { rawOutputPointers } : {}
  };
}
function processToolResultBlocks(content, config, toolCallLookup) {
  const techniquesUsed = [];
  const rulesApplied = [];
  const rawOutputPointers = [];
  if (!Array.isArray(content)) {
    return { content, compressed: false, techniquesUsed, rulesApplied, rawOutputPointers };
  }
  const collect = (processed) => {
    techniquesUsed.push(...processed.techniquesUsed);
    rulesApplied.push(...processed.rulesApplied);
    if (processed.rawOutputPointers) rawOutputPointers.push(...processed.rawOutputPointers);
  };
  let compressed = false;
  const nextContent = content.map((part) => {
    if (!isAnthropicToolResultBlock(part)) return part;
    if (hasCacheControlMarker(part)) return part;
    const toolUseId = typeof part.tool_use_id === "string" ? part.tool_use_id : null;
    const { command, skipFilters } = resolveToolMeta(toolUseId, toolCallLookup);
    const inner = part.content;
    if (typeof inner === "string") {
      if (!inner) return part;
      const processed = processRtkText(inner, { config, command, skipFilters });
      collect(processed);
      if (!processed.compressed) return part;
      compressed = true;
      return { ...part, content: processed.text };
    }
    if (Array.isArray(inner)) {
      let blockChanged = false;
      const nextInner = inner.map((sub) => {
        if (!isTextBlock(sub) || !sub.text) return sub;
        if (hasCacheControlMarker(sub)) return sub;
        const processed = processRtkText(sub.text, { config, command, skipFilters });
        collect(processed);
        if (!processed.compressed) return sub;
        blockChanged = true;
        compressed = true;
        return { ...sub, text: processed.text };
      });
      return blockChanged ? { ...part, content: nextInner } : part;
    }
    return part;
  });
  return {
    content: compressed ? nextContent : content,
    compressed,
    techniquesUsed,
    rulesApplied,
    rawOutputPointers
  };
}
function processRtkContent(content, config, options) {
  if (codeOnlyConfig(config)) {
    return processRtkCodeBlocksOnly(content, config);
  }
  const techniquesUsed = [];
  const rulesApplied = [];
  const rawOutputPointers = [];
  const collect = (processed) => {
    techniquesUsed.push(...processed.techniquesUsed);
    rulesApplied.push(...processed.rulesApplied);
    if (processed.rawOutputPointers) rawOutputPointers.push(...processed.rawOutputPointers);
  };
  if (typeof content === "string") {
    if (!content) {
      return { content, compressed: false, techniquesUsed, rulesApplied, rawOutputPointers };
    }
    const processed = processRtkText(content, {
      config,
      command: options?.command,
      skipFilters: options?.skipFilters
    });
    collect(processed);
    return {
      content: processed.compressed ? processed.text : content,
      compressed: processed.compressed,
      techniquesUsed,
      rulesApplied,
      rawOutputPointers
    };
  }
  if (!Array.isArray(content)) {
    return { content, compressed: false, techniquesUsed, rulesApplied, rawOutputPointers };
  }
  let compressed = false;
  const nextContent = content.map((part) => {
    if (!isTextBlock(part) || !part.text) return part;
    const processed = processRtkText(part.text, {
      config,
      command: options?.command,
      skipFilters: options?.skipFilters
    });
    collect(processed);
    if (!processed.compressed) return part;
    compressed = true;
    return { ...part, text: processed.text };
  });
  return {
    content: compressed ? nextContent : content,
    compressed,
    techniquesUsed,
    rulesApplied,
    rawOutputPointers
  };
}
function effectiveMaxLines(base, intensity) {
  const factor = intensity === "aggressive" ? 0.5 : intensity === "minimal" ? 1.5 : 1;
  return Math.max(1, Math.round(base * factor));
}
function applyRtkCompression(body, options = {}) {
  const start = performance.now();
  const stepConfig = options.stepConfig && options.stepConfig.enabled === void 0 ? { enabled: true, ...options.stepConfig } : options.stepConfig;
  const explicitConfig = options.config && Object.keys(options.config).length > 0;
  const baseConfig = !explicitConfig && !stepConfig ? { enabled: true } : options.config ?? {};
  const config = mergeRtkConfig(baseConfig, stepConfig);
  if (!config.enabled) return { body, compressed: false, stats: null };
  const adapter = adaptBodyForCompression(body);
  const messages = adapter.body.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return { body, compressed: false, stats: null };
  }
  const allTechniques = [];
  const allRules = [];
  const rawOutputPointers = [];
  const toolCallLookup = /* @__PURE__ */ new Map();
  for (const msg of messages) {
    if (msg.role !== "assistant") continue;
    const toolCalls = msg.tool_calls;
    if (Array.isArray(toolCalls)) {
      for (const tc of toolCalls) {
        if (!tc || typeof tc !== "object") continue;
        const id = typeof tc.id === "string" ? tc.id : null;
        if (!id) continue;
        const fn = tc.function;
        if (!fn || typeof fn !== "object") continue;
        const toolName = typeof fn.name === "string" ? fn.name : "";
        let command = null;
        if (typeof fn.arguments === "string") {
          try {
            const args = JSON.parse(fn.arguments);
            command = typeof args.command === "string" ? args.command : typeof args.cmd === "string" ? args.cmd : null;
          } catch {
          }
        }
        toolCallLookup.set(id, { toolName, command });
      }
    }
    if (Array.isArray(msg.content)) {
      for (const part of msg.content) {
        if (!part || typeof part !== "object" || part.type !== "tool_use") continue;
        const id = typeof part.id === "string" ? part.id : null;
        if (!id) continue;
        const toolName = typeof part.name === "string" ? part.name : "";
        const input = part.input;
        let command = null;
        if (input && typeof input === "object") {
          command = typeof input.command === "string" ? input.command : typeof input.cmd === "string" ? input.cmd : null;
        }
        toolCallLookup.set(id, { toolName, command });
      }
    }
  }
  const compressedMessages = messages.map((message) => {
    if (!shouldCompressMessage(message, config)) return message;
    if (Array.isArray(message.content) && message.content.some(isAnthropicToolResultBlock)) {
      const processed2 = processToolResultBlocks(message.content, config, toolCallLookup);
      allTechniques.push(...processed2.techniquesUsed);
      allRules.push(...processed2.rulesApplied);
      rawOutputPointers.push(...processed2.rawOutputPointers);
      if (!processed2.compressed) return message;
      return { ...message, content: processed2.content };
    }
    let command = null;
    let skipFilters = false;
    if (message.role === "tool") {
      const callId = typeof message.tool_call_id === "string" ? message.tool_call_id : null;
      ({ command, skipFilters } = resolveToolMeta(callId, toolCallLookup));
    }
    const processed = processRtkContent(message.content, config, { command, skipFilters });
    allTechniques.push(...processed.techniquesUsed);
    allRules.push(...processed.rulesApplied);
    rawOutputPointers.push(...processed.rawOutputPointers);
    if (!processed.compressed) return message;
    return {
      ...message,
      content: processed.content
    };
  });
  const anyMessageChanged = compressedMessages.some(
    (message, index) => message !== messages[index]
  );
  if (!anyMessageChanged) {
    return { body, compressed: false, stats: null };
  }
  const compressedBody = { ...adapter.body, messages: compressedMessages };
  const stats = createCompressionStats(
    adapter.body,
    compressedBody,
    "rtk",
    [...new Set(allTechniques)],
    allRules.length > 0 ? [...new Set(allRules)] : void 0,
    Math.round((performance.now() - start) * 100) / 100
  );
  stats.engine = "rtk";
  if (rawOutputPointers.length > 0) {
    stats.rtkRawOutputPointers = rawOutputPointers;
  }
  return {
    body: adapter.restore(compressedBody),
    compressed: stats.compressedTokens < stats.originalTokens,
    stats
  };
}
var rtkEngine = {
  id: "rtk",
  name: "RTK",
  description: "Command-aware tool output compression with declarative filters.",
  icon: "filter_alt",
  targets: ["tool_results", "code_blocks"],
  stackable: true,
  stackPriority: 10,
  metadata: {
    id: "rtk",
    name: "RTK",
    description: "Command-aware tool output compression with declarative filters.",
    inputScope: "tool-results",
    targetLatencyMs: 5,
    supportsPreview: true,
    stable: true
  },
  apply(body, options) {
    return applyRtkCompression(body, {
      config: options?.config?.rtkConfig,
      stepConfig: options?.stepConfig
    });
  },
  compress(body, config) {
    return this.apply(body, { stepConfig: config });
  },
  getConfigSchema() {
    return RTK_SCHEMA;
  },
  validateConfig(config) {
    return validateRtkEngineConfig(config);
  }
};

// open-sse/services/compression/engines/session-dedup/index.ts
import crypto6 from "node:crypto";

// open-sse/services/compression/engines/ccr/index.ts
init_ccrBlocks();
import crypto5 from "node:crypto";

// open-sse/services/compression/engines/ccr/ccrQuery.ts
import safeRegex from "safe-regex";

// open-sse/services/compression/engines/ccr/protocolInstruction.ts
var CCR_RETRIEVE_TOOL_NAME = "omniroute_ccr_retrieve";
var CCR_PROTOCOL_MARKER_SENTINEL = "[CCR protocol]";
var CCR_PROTOCOL_INSTRUCTION = `${CCR_PROTOCOL_MARKER_SENTINEL} This conversation uses content-compression-retrieve (CCR). When you see a marker like \`[CCR retrieve hash=<24hex> chars=N]\` in a message, it means the full original text (N characters) was stored and replaced with this marker to save space \u2014 call the \`${CCR_RETRIEVE_TOOL_NAME}\` tool with that hash to get the original text back verbatim. Copy the hash EXACTLY as written \u2014 all 24 hexadecimal characters, never truncated, abbreviated, or reformatted \u2014 a single wrong character will make the retrieval fail. If you instead see a marker like \`[dedup:ref sha=...]\`, it means that content already appeared earlier in this conversation \u2014 look back in the message history for it; do NOT call ${CCR_RETRIEVE_TOOL_NAME} for a dedup reference.`;
function callerSupportsCcrRetrieve(body) {
  const tools = body["tools"];
  if (!Array.isArray(tools)) return false;
  return tools.some((tool) => {
    const t = tool;
    const flatName = typeof t?.name === "string" ? t.name : void 0;
    const nestedName = typeof t?.function?.name === "string" ? t.function.name : void 0;
    return flatName === CCR_RETRIEVE_TOOL_NAME || nestedName === CCR_RETRIEVE_TOOL_NAME;
  });
}
function messageContainsSentinel(message) {
  const content = message?.content;
  if (typeof content === "string") return content.includes(CCR_PROTOCOL_MARKER_SENTINEL);
  if (Array.isArray(content)) {
    return content.some(
      (part) => part && typeof part === "object" && typeof part["text"] === "string" && part["text"].includes(
        CCR_PROTOCOL_MARKER_SENTINEL
      )
    );
  }
  return false;
}
function injectCcrProtocolInstruction(messages, body) {
  if (!callerSupportsCcrRetrieve(body)) return messages;
  if (messages.some((message) => messageContainsSentinel(message))) return messages;
  const instructionMessage = {
    role: "system",
    content: CCR_PROTOCOL_INSTRUCTION
  };
  return [instructionMessage, ...messages];
}

// open-sse/services/compression/engines/ccr/index.ts
var ENGINE_ID = "ccr";
var DEFAULT_MIN_CHARS = 600;
var RETRIEVAL_THRESHOLD = 3;
var RETRIEVAL_RAMP_FACTOR_DEFAULT = 2;
var MAX_CCR_ENTRIES = 5e3;
var MAX_CCR_BLOCK_BYTES = 2 * 1024 * 1024;
var MAX_CCR_PRINCIPAL_BYTES = 16 * 1024 * 1024;
var MAX_CCR_GLOBAL_BYTES = 64 * 1024 * 1024;
var DEFAULT_CCR_TTL_SECONDS = 24 * 60 * 60;
var MAX_CCR_TTL_SECONDS = 7 * 24 * 60 * 60;
var MAX_CCR_MCP_FULL_BYTES = 256 * 1024;
var ccrStore = /* @__PURE__ */ new Map();
var retrievalCounts = /* @__PURE__ */ new Map();
var principalBytesMap = /* @__PURE__ */ new Map();
var ccrTotalBytes = 0;
var lifecycleByPrincipal = /* @__PURE__ */ new Map();
var ANON = "__anon__";
function buildStoreKey(hash, principalId) {
  return `${principalId ?? ANON} ${hash}`;
}
var MAX_DURABLE_BLOCK_BYTES = 512 * 1024;
var isCloudRuntime = typeof globalThis.caches === "object" && globalThis.caches !== null;
function durableTierEnabled() {
  return !isCloudRuntime && process.env.COMPRESSION_CCR_DURABLE_STORE !== "false";
}
var loggedDurableErrors = /* @__PURE__ */ new Set();
function warnDurableError(operation, error) {
  if (process.env.NODE_ENV === "test") return;
  if (loggedDurableErrors.has(operation)) return;
  if (loggedDurableErrors.size >= 20) {
    const first = loggedDurableErrors.values().next().value;
    if (first !== void 0) loggedDurableErrors.delete(first);
  }
  loggedDurableErrors.add(operation);
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`[ccr] durable ${operation} failed: ${message}`);
}
var MAX_PENDING_DURABLE_WRITES = 1e3;
var pendingDurableWrites = 0;
var droppedDurableWrites = 0;
function deferDurable(operation, work, droppable = false) {
  if (droppable && pendingDurableWrites >= MAX_PENDING_DURABLE_WRITES) {
    droppedDurableWrites++;
    return;
  }
  pendingDurableWrites++;
  setImmediate(() => {
    pendingDurableWrites--;
    try {
      work();
    } catch (error) {
      warnDurableError(operation, error);
    }
  });
}
function persistEntry(entry) {
  if (!durableTierEnabled()) return;
  if (entry.bytes > MAX_DURABLE_BLOCK_BYTES) return;
  const snapshot = { ...entry };
  deferDurable("persist", () => persistCcrBlock(snapshot), true);
}
function forgetEntry(hash, principalId) {
  if (!durableTierEnabled()) return;
  deferDurable("delete", () => deleteCcrBlockRow(principalId, hash));
}
function mutableLifecycleCounters(principalId) {
  const existing = lifecycleByPrincipal.get(principalId);
  if (existing) return existing;
  const counters = { expiredEvictions: 0, capacityEvictions: 0, rejectedStores: 0 };
  lifecycleByPrincipal.set(principalId, counters);
  return counters;
}
function publicMetadata(entry) {
  const { principalId: _principalId, content: _content, ...metadata } = entry;
  return {
    ...metadata,
    retrievalCount: retrievalCounts.get(buildStoreKey(entry.hash, entry.principalId)) ?? 0
  };
}
function removeEntry(key, reason) {
  const entry = ccrStore.get(key);
  if (!entry) return false;
  ccrStore.delete(key);
  ccrTotalBytes = Math.max(0, ccrTotalBytes - entry.bytes);
  const remainingPrincipalBytes = Math.max(
    0,
    (principalBytesMap.get(entry.principalId) ?? 0) - entry.bytes
  );
  if (remainingPrincipalBytes === 0) principalBytesMap.delete(entry.principalId);
  else principalBytesMap.set(entry.principalId, remainingPrincipalBytes);
  const counters = mutableLifecycleCounters(entry.principalId);
  if (reason === "expired") {
    counters.expiredEvictions++;
    forgetEntry(entry.hash, entry.principalId);
  }
  if (reason === "capacity") counters.capacityEvictions++;
  return true;
}
function purgeExpired(now = Date.now()) {
  for (const [key, entry] of ccrStore) {
    if (entry.expiresAt <= now) removeEntry(key, "expired");
  }
}
function principalBytes(principalId) {
  return principalBytesMap.get(principalId) ?? 0;
}
function evictOldestMatching(predicate) {
  for (const [key, entry] of ccrStore) {
    if (predicate(entry)) return removeEntry(key, "capacity");
  }
  return false;
}
function normalizeTtlSeconds(value) {
  if (!Number.isFinite(value) || value === void 0) return DEFAULT_CCR_TTL_SECONDS;
  return Math.max(60, Math.min(MAX_CCR_TTL_SECONDS, Math.floor(value)));
}
function hashContent(text) {
  return crypto5.createHash("sha256").update(text).digest("hex").slice(0, 24);
}
function rejectStore(hash, owner, reason) {
  mutableLifecycleCounters(owner).rejectedStores++;
  return { stored: false, hash, reason };
}
function enforcePrincipalBudget(owner, bytes) {
  while (principalBytes(owner) + bytes > MAX_CCR_PRINCIPAL_BYTES && evictOldestMatching((entry) => entry.principalId === owner)) {
  }
  return principalBytes(owner) + bytes <= MAX_CCR_PRINCIPAL_BYTES;
}
function enforceGlobalBudget(owner, bytes) {
  const overBudget = () => ccrStore.size >= MAX_CCR_ENTRIES || ccrTotalBytes + bytes > MAX_CCR_GLOBAL_BYTES;
  while (overBudget()) {
    if (evictOldestMatching((entry) => entry.principalId === owner)) continue;
    if (evictOldestMatching(() => true)) continue;
    break;
  }
  return ccrTotalBytes + bytes <= MAX_CCR_GLOBAL_BYTES;
}
function tryStoreBlock(text, principalId, options = {}) {
  const hash = hashContent(text);
  const owner = principalId ?? ANON;
  const key = buildStoreKey(hash, principalId);
  const now = options.now ?? Date.now();
  purgeExpired(now);
  const existing = ccrStore.get(key);
  if (existing) {
    existing.lastAccessedAt = now;
    existing.expiresAt = now + normalizeTtlSeconds(options.ttlSeconds) * 1e3;
    ccrStore.delete(key);
    ccrStore.set(key, existing);
    return { stored: true, hash, metadata: publicMetadata(existing) };
  }
  const bytes = Buffer.byteLength(text, "utf8");
  if (bytes > MAX_CCR_BLOCK_BYTES) {
    return rejectStore(hash, owner, "block_too_large");
  }
  if (!enforcePrincipalBudget(owner, bytes)) {
    return rejectStore(hash, owner, "principal_budget_exceeded");
  }
  if (!enforceGlobalBudget(owner, bytes)) {
    return rejectStore(hash, owner, "global_budget_exceeded");
  }
  const ttlSeconds = normalizeTtlSeconds(options.ttlSeconds);
  const entry = {
    hash,
    principalId: owner,
    content: text,
    bytes,
    chars: text.length,
    lines: text.length === 0 ? 0 : text.split("\n").length,
    contentType: options.contentType?.trim().slice(0, 128) || "text/plain",
    source: options.source ?? "compression",
    createdAt: now,
    lastAccessedAt: now,
    expiresAt: now + ttlSeconds * 1e3
  };
  ccrStore.set(key, entry);
  ccrTotalBytes += bytes;
  principalBytesMap.set(owner, principalBytes(owner) + bytes);
  persistEntry(entry);
  return { stored: true, hash, metadata: publicMetadata(entry) };
}
function effectiveMinChars(baseMinChars, hash, principalId, rampFactor) {
  const count2 = retrievalCounts.get(buildStoreKey(hash, principalId)) ?? 0;
  if (count2 >= RETRIEVAL_THRESHOLD) return Number.POSITIVE_INFINITY;
  if (count2 <= 0 || rampFactor <= 1) return baseMinChars;
  return Math.round(baseMinChars * (1 + (rampFactor - 1) * count2));
}
function resolveRetrievalRampFactor(env = process.env) {
  const raw = env.COMPRESSION_CCR_RETRIEVAL_RAMP_FACTOR;
  if (raw === void 0) return RETRIEVAL_RAMP_FACTOR_DEFAULT;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 1 ? n : RETRIEVAL_RAMP_FACTOR_DEFAULT;
}
function buildCcrMarker(hash, charCount) {
  return `[CCR retrieve hash=${hash} chars=${charCount}]`;
}
var MARKER_PREAMBLE_CHARS = 200;
function buildCcrReplacementText(text, marker) {
  const preamble = text.slice(0, MARKER_PREAMBLE_CHARS).trimEnd();
  return `${preamble}\u2026 ${marker}`;
}
function maybeCcrReplace(text, minChars, principalId, rampFactor) {
  if (text.length < minChars) {
    return { text, replaced: false, hash: null };
  }
  const hash = hashContent(text);
  if (text.length < effectiveMinChars(minChars, hash, principalId, rampFactor)) {
    return { text, replaced: false, hash: null };
  }
  const marker = buildCcrMarker(hash, text.length);
  const replacement = buildCcrReplacementText(text, marker);
  if (replacement.length >= text.length) {
    return { text, replaced: false, hash: null };
  }
  const stored = tryStoreBlock(text, principalId, { source: "compression" });
  if (!stored.stored) return { text, replaced: false, hash: null };
  return { text: replacement, replaced: true, hash };
}
function processMessages(messages, minChars, principalId, rampFactor) {
  let replacedCount = 0;
  const result = messages.map((msg) => {
    if (msg.role === "system") return { ...msg };
    if (msg.role === "tool") return { ...msg };
    if (msg.role === "user" && Array.isArray(msg.content)) {
      const parts = msg.content;
      if (parts.length > 0 && parts.every((p) => p?.["type"] === "tool_result")) {
        return { ...msg };
      }
    }
    if (typeof msg.content === "string") {
      const { text, replaced } = maybeCcrReplace(msg.content, minChars, principalId, rampFactor);
      if (replaced) {
        replacedCount++;
        return { ...msg, content: text };
      }
      return { ...msg };
    }
    if (Array.isArray(msg.content)) {
      let changed = false;
      const newContent = msg.content.map((part) => {
        if (part?.["type"] !== "text" || typeof part?.["text"] !== "string") return part;
        const { text, replaced } = maybeCcrReplace(
          part["text"],
          minChars,
          principalId,
          rampFactor
        );
        if (replaced) {
          changed = true;
          replacedCount++;
          return { ...part, text };
        }
        return part;
      });
      if (changed) {
        return { ...msg, content: newContent };
      }
      return { ...msg };
    }
    return { ...msg };
  });
  return { messages: result, replacedCount };
}
var CCR_SCHEMA = [
  {
    key: "enabled",
    type: "boolean",
    label: "Enabled",
    defaultValue: true
  },
  {
    key: "minChars",
    type: "number",
    label: "Minimum block characters",
    description: "Minimum character count for a block to be a CCR candidate.",
    defaultValue: DEFAULT_MIN_CHARS,
    min: 100,
    max: 1e6
  },
  {
    key: "retrievalRampFactor",
    type: "number",
    label: "Retrieval ramp factor (H8)",
    description: "How steeply frequently-retrieved blocks resist compression. Each prior retrieval raises the effective minimum block size linearly; 1 disables the ramp (binary skip at the threshold only).",
    defaultValue: RETRIEVAL_RAMP_FACTOR_DEFAULT,
    min: 1,
    max: 100
  }
];
function validateCcrConfig(config) {
  const errors = [];
  if (config["enabled"] !== void 0 && typeof config["enabled"] !== "boolean") {
    errors.push("enabled must be a boolean");
  }
  if (config["minChars"] !== void 0) {
    const v = config["minChars"];
    if (typeof v !== "number" || !Number.isFinite(v) || v < 1) {
      errors.push("minChars must be a positive number");
    }
  }
  if (config["retrievalRampFactor"] !== void 0) {
    const v = config["retrievalRampFactor"];
    if (typeof v !== "number" || !Number.isFinite(v) || v < 1) {
      errors.push("retrievalRampFactor must be a number >= 1");
    }
  }
  return { valid: errors.length === 0, errors };
}
var ccrEngine = {
  id: ENGINE_ID,
  name: "CCR (Content-Compression-Retrieve)",
  description: "Replaces large blocks of text with content-addressed retrieve markers `[CCR retrieve hash=<24hex> chars=N]`. The original block is stored and retrievable via the `omniroute_ccr_retrieve` MCP tool (H4). Store is principal-scoped: only the storing principal can retrieve their blocks.",
  icon: "archive",
  targets: ["messages"],
  stackable: true,
  // stackPriority 4 = runs just after session-dedup (3), before headroom (15),
  // caveman (20), aggressive (30), ultra (40).
  stackPriority: 4,
  metadata: {
    id: ENGINE_ID,
    name: "CCR (Content-Compression-Retrieve)",
    description: "Reversible compression: large blocks \u2192 retrieve marker. Original retrievable via MCP tool (H4). Principal-scoped for tenant isolation.",
    inputScope: "messages",
    targetLatencyMs: 1,
    supportsPreview: true,
    stable: true
  },
  apply(body, options) {
    const stepConfig = options?.stepConfig ?? {};
    if (stepConfig["enabled"] === false) {
      return { body, compressed: false, stats: null };
    }
    let callerCanRetrieve = false;
    try {
      callerCanRetrieve = callerSupportsCcrRetrieve(body);
    } catch (err) {
      console.warn(
        "[compression/ccr] callerSupportsCcrRetrieve threw; skipping compression:",
        err instanceof Error ? err.message : err
      );
      callerCanRetrieve = false;
    }
    if (!callerCanRetrieve) {
      return { body, compressed: false, stats: null };
    }
    const minChars = typeof stepConfig["minChars"] === "number" ? stepConfig["minChars"] : DEFAULT_MIN_CHARS;
    const rampFactor = typeof stepConfig["retrievalRampFactor"] === "number" ? stepConfig["retrievalRampFactor"] : resolveRetrievalRampFactor();
    const messages = body["messages"];
    if (!Array.isArray(messages) || messages.length === 0) {
      return { body, compressed: false, stats: null };
    }
    const start = performance.now();
    const { messages: newMessages, replacedCount } = processMessages(
      messages,
      minChars,
      options?.principalId,
      rampFactor
    );
    if (replacedCount === 0) {
      return { body, compressed: false, stats: null };
    }
    const messagesWithProtocol = injectCcrProtocolInstruction(newMessages, body);
    const newBody = { ...body, messages: messagesWithProtocol };
    const durationMs = Math.round(performance.now() - start);
    const stats = createCompressionStats(
      body,
      newBody,
      "stacked",
      ["ccr"],
      [`ccr-replaced-${replacedCount}-blocks`],
      durationMs
    );
    return { body: newBody, compressed: true, stats };
  },
  compress(body, config) {
    return this.apply(body, { stepConfig: config ?? {} });
  },
  getConfigSchema() {
    return CCR_SCHEMA;
  },
  validateConfig(config) {
    return validateCcrConfig(config);
  }
};

// open-sse/services/compression/engines/session-dedup/fuzzy.ts
var MAX_FUZZY_BLOCKS = 200;
function fnv1a(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function shingles(text, k = 3) {
  const words = text.split(/\s+/).filter(Boolean);
  const out = /* @__PURE__ */ new Set();
  if (words.length < k) return out;
  for (let i = 0; i + k <= words.length; i++) {
    out.add(fnv1a(words.slice(i, i + k).join(" ")));
  }
  return out;
}
function jaccard(a, b) {
  if (a.size === 0 && b.size === 0) return 0;
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  let inter = 0;
  for (const x of small) if (large.has(x)) inter++;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}
function findNearDuplicates(blocks, minJaccard, maxBlocks, shingleSize = 3) {
  if (blocks.length > maxBlocks) return [];
  const sets = blocks.map((b) => shingles(b.text, shingleSize));
  const out = [];
  for (let i = 0; i < blocks.length; i++) {
    let best = -1;
    let bestSim = 0;
    for (let j = 0; j < i; j++) {
      const sim = jaccard(sets[i], sets[j]);
      if (sim >= minJaccard && sim > bestSim) {
        bestSim = sim;
        best = j;
      }
    }
    if (best >= 0) {
      out.push({ block: blocks[i], matchedIndex: blocks[best].index, similarity: bestSim });
    }
  }
  return out;
}
function applyFuzzyPass(messages, opts) {
  try {
    const blocks = [];
    for (let i = 0; i < messages.length; i++) {
      const m = messages[i];
      if (m.role === "system") continue;
      if (typeof m.content === "string" && m.content.length >= opts.minBlockChars) {
        blocks.push({ text: m.content, index: i });
      }
    }
    if (blocks.length < 2) return { messages, fuzzyCount: 0 };
    const nearDups = findNearDuplicates(blocks, opts.minJaccard, opts.maxBlocks, opts.shingleSize);
    if (nearDups.length === 0) return { messages, fuzzyCount: 0 };
    const replacements = /* @__PURE__ */ new Map();
    for (const nd of nearDups) {
      const stored = tryStoreBlock(nd.block.text, opts.principalId, { source: "session-dedup" });
      if (!stored.stored) continue;
      const marker = buildCcrMarker(stored.hash, nd.block.text.length);
      if (marker.length < nd.block.text.length) replacements.set(nd.block.index, marker);
    }
    if (replacements.size === 0) return { messages, fuzzyCount: 0 };
    const out = messages.map(
      (m, i) => replacements.has(i) ? { ...m, content: replacements.get(i) } : m
    );
    return { messages: out, fuzzyCount: replacements.size };
  } catch {
    return { messages, fuzzyCount: 0 };
  }
}
function runFuzzyPass(messages, stepConfig, minBlockChars, principalId) {
  const raw = stepConfig["fuzzy"];
  const cfg = typeof raw === "boolean" ? { enabled: raw } : raw;
  if (!cfg?.enabled) return { messages, fuzzyCount: 0 };
  return applyFuzzyPass(messages, {
    minJaccard: typeof cfg.minJaccard === "number" ? cfg.minJaccard : 0.85,
    shingleSize: typeof cfg.shingleSize === "number" ? cfg.shingleSize : 3,
    maxBlocks: MAX_FUZZY_BLOCKS,
    minBlockChars,
    principalId
  });
}

// open-sse/services/compression/engines/session-dedup/index.ts
var ENGINE_ID2 = "session-dedup";
var DEFAULT_MIN_BLOCK_CHARS = 80;
var MIN_BLOCK_LINES = 3;
var MAX_SUFFIX_STARTS = 2e3;
var MAX_TOTAL_BLOCK_BYTES = 8 * 1024 * 1024;
function hashBlock(text) {
  return crypto6.createHash("sha256").update(text).digest("hex").slice(0, 24);
}
function findSuffixBlocks(lines, minBlockChars) {
  const n = lines.length;
  const seen = /* @__PURE__ */ new Set();
  const results = [];
  const maxStarts = Math.min(n, MAX_SUFFIX_STARTS);
  let totalBlockBytes = 0;
  for (let start = 0; start < maxStarts; start++) {
    const block = lines.slice(start).join("\n");
    const blockLines = n - start;
    if (blockLines >= MIN_BLOCK_LINES && block.length >= minBlockChars && !seen.has(block)) {
      seen.add(block);
      results.push({ block, startLine: start });
      totalBlockBytes += block.length;
      if (totalBlockBytes >= MAX_TOTAL_BLOCK_BYTES) break;
    }
  }
  return results;
}
function dedupeWithinMessage(text, minBlockChars) {
  const lines = text.split("\n");
  const blocks = findSuffixBlocks(lines, minBlockChars);
  if (blocks.length < 2) return { deduped: text, changed: false };
  const blockFreq = /* @__PURE__ */ new Map();
  for (const { block } of blocks) {
    blockFreq.set(block, (blockFreq.get(block) || 0) + 1);
  }
  const sortedBlocks = [...blocks].sort((a, b) => {
    const freqDiff = (blockFreq.get(b.block) || 0) - (blockFreq.get(a.block) || 0);
    return freqDiff !== 0 ? freqDiff : b.block.length - a.block.length;
  });
  let result = text;
  let changed = false;
  for (const { block } of sortedBlocks) {
    const occurrences = (result.match(new RegExp(block.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
    if (occurrences < 2) continue;
    const sha = hashBlock(block);
    const marker = `[dedup:ref sha=${sha}]`;
    let count2 = 0;
    result = result.replace(new RegExp(block.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), () => {
      count2++;
      return count2 === 1 ? block : marker;
    });
    changed = true;
  }
  return { deduped: result, changed };
}
function dedupMessageTexts(msgTexts, minBlockChars) {
  const deduped = /* @__PURE__ */ new Map();
  let dedupCount = 0;
  if (msgTexts.length === 1) {
    const { text, msgIdx } = msgTexts[0];
    const { deduped: dedupedText, changed } = dedupeWithinMessage(text, minBlockChars);
    if (changed) {
      deduped.set(msgIdx, dedupedText);
      dedupCount++;
    }
    return { deduped, dedupCount };
  }
  const firstSeen = /* @__PURE__ */ new Map();
  for (const { msgIdx, text } of msgTexts) {
    const lines = text.split("\n");
    const blocks = findSuffixBlocks(lines, minBlockChars);
    for (const { block } of blocks) {
      const sha = hashBlock(block);
      if (!firstSeen.has(sha)) {
        firstSeen.set(sha, { ownerMsgIdx: msgIdx, block });
      }
    }
  }
  for (const { msgIdx, text } of msgTexts) {
    const lines = text.split("\n");
    const blocks = findSuffixBlocks(lines, minBlockChars);
    const dupBlocks = [];
    for (const { block } of blocks) {
      const sha = hashBlock(block);
      const owner = firstSeen.get(sha);
      if (owner && owner.ownerMsgIdx < msgIdx && owner.block === block) {
        dupBlocks.push({ block, sha });
      }
    }
    if (dupBlocks.length === 0) continue;
    dupBlocks.sort((a, b) => b.block.length - a.block.length);
    let result = text;
    let changed = false;
    const replaced = /* @__PURE__ */ new Set();
    for (const { block, sha } of dupBlocks) {
      if ([...replaced].some((r) => r.includes(block))) continue;
      const idx = result.indexOf(block);
      if (idx !== -1) {
        const marker = `[dedup:ref sha=${sha}]`;
        result = result.slice(0, idx) + marker + result.slice(idx + block.length);
        changed = true;
        replaced.add(block);
        break;
      }
    }
    if (changed) {
      deduped.set(msgIdx, result);
      dedupCount++;
    }
  }
  return { deduped, dedupCount };
}
function processMessages2(messages, minBlockChars) {
  const msgTexts = [];
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (msg.role === "system") continue;
    if (typeof msg.content === "string") {
      msgTexts.push({ msgIdx: i, text: msg.content });
    } else if (Array.isArray(msg.content)) {
      for (let p = 0; p < msg.content.length; p++) {
        const part = msg.content[p];
        if (part["type"] === "text" && typeof part["text"] === "string") {
          msgTexts.push({ msgIdx: i * 1e5 + p + 1, text: part["text"] });
        }
      }
    }
  }
  if (msgTexts.length === 0) {
    return { messages, dedupCount: 0 };
  }
  const { deduped, dedupCount } = dedupMessageTexts(msgTexts, minBlockChars);
  if (dedupCount === 0) {
    return { messages, dedupCount: 0 };
  }
  const result = messages.map((msg, i) => {
    if (msg.role === "system") return { ...msg };
    if (typeof msg.content === "string") {
      const replacement = deduped.get(i);
      return replacement !== void 0 ? { ...msg, content: replacement } : { ...msg };
    }
    if (Array.isArray(msg.content)) {
      let changed = false;
      const newContent = msg.content.map((part, p) => {
        if (part["type"] !== "text" || typeof part["text"] !== "string") return part;
        const key = i * 1e5 + p + 1;
        const replacement = deduped.get(key);
        if (replacement !== void 0) {
          changed = true;
          return { ...part, text: replacement };
        }
        return part;
      });
      return changed ? { ...msg, content: newContent } : { ...msg };
    }
    return { ...msg };
  });
  return { messages: result, dedupCount };
}
var SESSION_DEDUP_SCHEMA = [
  {
    key: "enabled",
    type: "boolean",
    label: "Enabled",
    defaultValue: true
  },
  {
    key: "minBlockChars",
    type: "number",
    label: "Minimum block characters",
    description: "Minimum character count for a suffix block to be a dedup candidate.",
    defaultValue: DEFAULT_MIN_BLOCK_CHARS,
    min: 1,
    max: 1e5
  },
  {
    key: "fuzzy",
    type: "boolean",
    label: "Fuzzy near-duplicate dedup",
    description: "Opt-in: replace whole messages ~85%+ similar to an earlier one with a recoverable CCR marker.",
    defaultValue: false
  }
];
function validateSessionDedupConfig(config) {
  const errors = [];
  if (config["enabled"] !== void 0 && typeof config["enabled"] !== "boolean") {
    errors.push("enabled must be a boolean");
  }
  if (config["minBlockChars"] !== void 0) {
    const v = config["minBlockChars"];
    if (typeof v !== "number" || !Number.isFinite(v) || v < 1) {
      errors.push("minBlockChars must be a positive number");
    }
  }
  if (config["fuzzy"] !== void 0) {
    const f = config["fuzzy"];
    if (typeof f === "object" && f !== null) {
      const fe = f["enabled"];
      if (fe !== void 0 && typeof fe !== "boolean") errors.push("fuzzy.enabled must be a boolean");
    } else if (typeof f !== "boolean") {
      errors.push("fuzzy must be an object { enabled } or a boolean");
    }
  }
  return { valid: errors.length === 0, errors };
}
var sessionDedupEngine = {
  id: ENGINE_ID2,
  name: "Session Dedup",
  description: "Content-addressed cross-turn deduplication: replaces repeated multi-line blocks with short reference markers (R11/N2/TO1, TokenMizer blueprint).",
  icon: "content_copy",
  targets: ["messages"],
  stackable: true,
  // stackPriority 3 = runs BEFORE lite (5), caveman (20), aggressive (30), ultra (40).
  // Dedup first so downstream engines operate on already-deduplicated content.
  stackPriority: 3,
  metadata: {
    id: ENGINE_ID2,
    name: "Session Dedup",
    description: "Content-addressed cross-turn deduplication: replaces repeated multi-line blocks with short reference markers.",
    inputScope: "messages",
    targetLatencyMs: 1,
    supportsPreview: true,
    stable: true
  },
  apply(body, options) {
    const stepConfig = options?.stepConfig ?? {};
    if (stepConfig["enabled"] === false) {
      return { body, compressed: false, stats: null };
    }
    const minBlockChars = typeof stepConfig["minBlockChars"] === "number" ? stepConfig["minBlockChars"] : DEFAULT_MIN_BLOCK_CHARS;
    const messages = body["messages"];
    if (!Array.isArray(messages) || messages.length === 0) {
      return { body, compressed: false, stats: null };
    }
    const start = performance.now();
    const { messages: exactMessages, dedupCount } = processMessages2(
      messages,
      minBlockChars
    );
    const { messages: finalMessages, fuzzyCount } = runFuzzyPass(
      exactMessages,
      stepConfig,
      minBlockChars,
      options?.principalId
    );
    if (dedupCount + fuzzyCount === 0) {
      return { body, compressed: false, stats: null };
    }
    const newBody = { ...body, messages: finalMessages };
    const durationMs = Math.round(performance.now() - start);
    const techniques = ["session-dedup"];
    if (fuzzyCount > 0) techniques.push("fuzzy-dedup");
    const rules = [];
    if (dedupCount > 0) rules.push(`deduplicated-${dedupCount}-blocks`);
    if (fuzzyCount > 0) rules.push(`fuzzy-${fuzzyCount}-blocks`);
    const stats = createCompressionStats(body, newBody, "stacked", techniques, rules, durationMs);
    return { body: newBody, compressed: true, stats };
  },
  compress(body, config) {
    return this.apply(body, { stepConfig: config ?? {} });
  },
  getConfigSchema() {
    return SESSION_DEDUP_SCHEMA;
  },
  validateConfig(config) {
    return validateSessionDedupConfig(config);
  }
};

// open-sse/services/compression/engines/headroom/gcf/scalar.ts
var JSON_NUMBER_RE = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/;
var NUMERIC_LIKE_RE = /^[+-]\.?\d|^\.\d|^0\d/;
var INLINE_ARRAY_RE = /\[[^\]]*\]\s*:/;
function needsQuote(s) {
  if (s === "") return true;
  if (s === "-" || s === "~" || s === "^" || s === "true" || s === "false") return true;
  if (JSON_NUMBER_RE.test(s)) return true;
  if (NUMERIC_LIKE_RE.test(s)) return true;
  if (s[0] === " " || s[s.length - 1] === " ") return true;
  if (s[0] === "#" || s[0] === "@" || s[0] === ".") return true;
  if (INLINE_ARRAY_RE.test(s)) return true;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c === 34 || c === 92 || c < 32 || c === 10 || c === 13 || c === 124 || c === 44)
      return true;
    if (c >= 128 && c <= 159) return true;
    if (c > 127 && (c === 160 || c === 8232 || c === 8233 || c === 65279 || c === 5760 || c >= 8192 && c <= 8202 || c === 8239 || c === 8287 || c === 12288))
      return true;
  }
  return false;
}
function quoteString(s) {
  let out = '"';
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    switch (c) {
      case 34:
        out += '\\"';
        break;
      case 92:
        out += "\\\\";
        break;
      case 8:
        out += "\\b";
        break;
      case 12:
        out += "\\f";
        break;
      case 10:
        out += "\\n";
        break;
      case 13:
        out += "\\r";
        break;
      case 9:
        out += "\\t";
        break;
      default:
        if (c < 32) {
          out += "\\u" + c.toString(16).padStart(4, "0");
        } else {
          out += s[i];
        }
    }
  }
  return out + '"';
}
function formatScalar(v, delimiter = 0) {
  if (v === null || v === void 0) return "-";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") return formatNumber(v);
  const s = String(v);
  if (needsQuote(s) || delimiter && s.includes(String.fromCharCode(delimiter))) {
    return quoteString(s);
  }
  return s;
}
function formatNumber(f) {
  if (Object.is(f, -0)) return "-0";
  if (f === 0) return "0";
  const abs = Math.abs(f);
  if (abs >= 1e-6 && abs < 9007199254740992) {
    return toPreciseDecimal(f);
  }
  let s = f.toExponential();
  s = s.replace(/[eE]\+?0*(\d)/, "e+$1").replace(/[eE]-0*(\d)/, "e-$1");
  return s;
}
function toPreciseDecimal(f) {
  return String(f);
}
var BARE_KEY_RE = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
function isBareKey(s) {
  return BARE_KEY_RE.test(s);
}
function formatKey(s) {
  return isBareKey(s) ? s : quoteString(s);
}

// open-sse/services/compression/engines/headroom/gcf/generic.ts
function indent(depth) {
  return "  ".repeat(depth);
}
function encodeGeneric(data, opts) {
  let out = "GCF profile=generic\n";
  out += encodeRootValue(data, opts);
  return out;
}
function encodeRootValue(v, opts) {
  if (v === null || v === void 0) return "=-\n";
  if (Array.isArray(v)) return encodeRootArray(v, opts);
  if (typeof v === "object") return encodeObject(v, 0, opts);
  return `=${formatScalar(v, 0)}
`;
}
function encodeObject(obj, depth, opts) {
  const prefix = indent(depth);
  let out = "";
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    const fk = formatKey(key);
    if (Array.isArray(value)) {
      out += encodeNamedArray(fk, value, depth, opts);
    } else if (typeof value === "object" && value !== null) {
      out += `${prefix}## ${fk}
`;
      out += encodeObject(value, depth + 1, opts);
    } else {
      out += `${prefix}${fk}=${formatScalar(value, 0)}
`;
    }
  }
  return out;
}
function encodeRootArray(arr, opts) {
  if (arr.length === 0) return "## [0]\n";
  if (allPrimitives(arr)) {
    const vals = arr.map((v) => formatScalar(v, 44));
    return `## [${arr.length}]: ${vals.join(",")}
`;
  }
  const fields = tabularFields(arr);
  if (fields) return encodeTabular("## ", arr, fields, 0, opts);
  return encodeExpanded("## ", arr, 0, opts);
}
function encodeNamedArray(name, arr, depth, opts) {
  const prefix = indent(depth);
  if (arr.length === 0) return `${prefix}## ${name} [0]
`;
  if (allPrimitives(arr)) {
    const vals = arr.map((v) => formatScalar(v, 44));
    return `${prefix}${name}[${arr.length}]: ${vals.join(",")}
`;
  }
  const fields = tabularFields(arr);
  if (fields) return encodeTabular(`${prefix}## ${name} `, arr, fields, depth, opts);
  return encodeExpanded(`${prefix}## ${name} `, arr, depth, opts);
}
function tabularFields(arr) {
  if (arr.length === 0) return null;
  const fieldOrder = [];
  const seen = /* @__PURE__ */ new Set();
  for (const item of arr) {
    if (typeof item !== "object" || item === null || Array.isArray(item)) return null;
    for (const k of Object.keys(item)) {
      if (!seen.has(k)) {
        fieldOrder.push(k);
        seen.add(k);
      }
    }
  }
  return fieldOrder.length > 0 ? fieldOrder : null;
}
function inlineSchemaFields(arr, fieldName) {
  const first = arr[0];
  if (!first || !Object.prototype.hasOwnProperty.call(first, fieldName)) return null;
  const firstVal = first[fieldName];
  if (firstVal === null || firstVal === void 0 || typeof firstVal !== "object" || Array.isArray(firstVal))
    return null;
  let canonicalKeys = null;
  for (const item of arr) {
    const obj = item;
    if (!Object.prototype.hasOwnProperty.call(obj, fieldName) || obj[fieldName] === null || obj[fieldName] === void 0) continue;
    const v = obj[fieldName];
    if (typeof v !== "object" || Array.isArray(v)) return null;
    const keys = Object.keys(v);
    for (const k of keys) {
      const val = v[k];
      if (val !== null && val !== void 0 && typeof val === "object") return null;
    }
    if (!canonicalKeys) {
      canonicalKeys = keys;
    } else {
      if (keys.length !== canonicalKeys.length) return null;
      for (let i = 0; i < keys.length; i++) {
        if (keys[i] !== canonicalKeys[i]) return null;
      }
    }
  }
  if (!canonicalKeys || canonicalKeys.length < 3) return null;
  return canonicalKeys;
}
function sharedArraySchema(arr, fieldName) {
  const first = arr[0];
  if (!first || !Object.prototype.hasOwnProperty.call(first, fieldName)) return null;
  const firstVal = first[fieldName];
  if (!Array.isArray(firstVal)) return null;
  let canonicalFields = null;
  for (const item of arr) {
    const obj = item;
    if (!Object.prototype.hasOwnProperty.call(obj, fieldName) || obj[fieldName] === null || obj[fieldName] === void 0) continue;
    const v = obj[fieldName];
    if (!Array.isArray(v)) return null;
    const fields = tabularFields(v);
    if (!fields) return null;
    for (const arrItem of v) {
      if (typeof arrItem !== "object" || arrItem === null) return null;
      for (const val of Object.values(arrItem)) {
        if (val !== null && val !== void 0 && typeof val === "object") return null;
      }
    }
    if (!canonicalFields) {
      canonicalFields = fields;
    } else {
      if (fields.length !== canonicalFields.length) return null;
      for (let i = 0; i < fields.length; i++) {
        if (fields[i] !== canonicalFields[i]) return null;
      }
    }
  }
  return canonicalFields;
}
function isUnsafeKey(k) {
  return k === "__proto__" || k === "constructor" || k === "prototype";
}
function analyzeFlattenable(arr, fieldName, parentPath) {
  if (fieldName.includes(">")) return null;
  let canonicalShape = null;
  for (const item of arr) {
    const obj = item;
    if (!Object.prototype.hasOwnProperty.call(obj, fieldName) || obj[fieldName] === void 0) continue;
    if (obj[fieldName] === null) {
      if (parentPath !== "") return null;
      continue;
    }
    const v = obj[fieldName];
    if (typeof v !== "object" || Array.isArray(v)) return null;
    const keys = Object.keys(v);
    if (!canonicalShape) {
      canonicalShape = /* @__PURE__ */ Object.create(null);
      for (const k of keys) {
        if (k.includes(">") || isUnsafeKey(k)) return null;
        const val = v[k];
        if (val !== null && val !== void 0 && typeof val === "object" && !Array.isArray(val)) {
          canonicalShape[k] = "nested";
        } else if (Array.isArray(val)) {
          return null;
        } else {
          canonicalShape[k] = "scalar";
        }
      }
    } else {
      if (keys.length !== Object.keys(canonicalShape).length) return null;
      for (const k of keys) {
        if (!Object.prototype.hasOwnProperty.call(canonicalShape, k)) return null;
        const val = v[k];
        const expected = canonicalShape[k];
        if (expected === "scalar") {
          if (val !== null && val !== void 0 && typeof val === "object") return null;
        } else if (expected === "nested") {
          if (val !== null && val !== void 0) {
            if (typeof val !== "object" || Array.isArray(val)) return null;
          }
        }
      }
    }
  }
  if (!canonicalShape) return null;
  const currentPath = parentPath ? parentPath + ">" + fieldName : fieldName;
  const parentKeys = parentPath ? [...parentPath.split(">"), fieldName] : [fieldName];
  const leaves = [];
  for (const k of Object.keys(canonicalShape)) {
    if (canonicalShape[k] === "scalar") {
      leaves.push({ path: currentPath + ">" + k, keys: [...parentKeys, k] });
    } else {
      const subArr = arr.map((item) => {
        const obj = item;
        if (!Object.prototype.hasOwnProperty.call(obj, fieldName) || obj[fieldName] === null || obj[fieldName] === void 0)
          return {};
        return obj[fieldName];
      });
      const subLeaves = analyzeFlattenable(subArr, k, currentPath);
      if (!subLeaves || subLeaves.length === 0) return null;
      leaves.push(...subLeaves);
    }
  }
  if (leaves.length > 0) {
    for (const item of arr) {
      const obj = item;
      if (!Object.prototype.hasOwnProperty.call(obj, fieldName) || obj[fieldName] === null || obj[fieldName] === void 0) continue;
      const allNull = leaves.every((leaf) => {
        const val = resolveKeyChain(item, leaf.keys);
        return val.exists && val.value === null;
      });
      if (allNull) return null;
    }
  }
  return leaves;
}
function resolveKeyChain(item, keys) {
  if (keys.length === 0) return { value: void 0, exists: false };
  const obj = item;
  if (typeof obj !== "object" || obj === null) return { value: void 0, exists: false };
  if (!Object.prototype.hasOwnProperty.call(obj, keys[0])) return { value: void 0, exists: false };
  let current = obj[keys[0]];
  if (current === null || current === void 0) return { value: current, exists: true };
  for (let i = 1; i < keys.length; i++) {
    if (typeof current !== "object" || current === null) return { value: void 0, exists: false };
    const c = current;
    if (!Object.prototype.hasOwnProperty.call(c, keys[i])) return { value: void 0, exists: false };
    current = c[keys[i]];
  }
  return { value: current, exists: true };
}
function encodeTabular(headerPrefix, arr, fields, depth, opts) {
  const prefix = indent(depth);
  const flattenMap = /* @__PURE__ */ new Map();
  if (!opts?.noFlatten) {
    for (const f of fields) {
      const leaves = analyzeFlattenable(arr, f, "");
      if (leaves && leaves.length > 0) {
        flattenMap.set(f, leaves);
      }
    }
  }
  const gtFields = /* @__PURE__ */ new Set();
  for (const f of fields) {
    if (!flattenMap.has(f) && f.includes(">")) {
      gtFields.add(f);
    }
  }
  const columns = [];
  for (const f of fields) {
    if (gtFields.has(f)) continue;
    const leaves = flattenMap.get(f);
    if (leaves) {
      for (const leaf of leaves) {
        columns.push({
          headerName: formatKey(leaf.path),
          colType: "flat",
          field: f,
          keys: leaf.keys
        });
      }
    } else {
      columns.push({ headerName: formatKey(f), colType: "original", field: f, keys: [] });
    }
  }
  if (columns.length === 0) {
    return encodeExpanded(headerPrefix, arr, depth, opts);
  }
  const inlineSchemas = /* @__PURE__ */ new Map();
  const sharedArrSchemas = /* @__PURE__ */ new Map();
  for (const f of fields) {
    if (flattenMap.has(f)) continue;
    const ifs = inlineSchemaFields(arr, f);
    if (ifs) inlineSchemas.set(f, ifs);
    const sas = sharedArraySchema(arr, f);
    if (sas) sharedArrSchemas.set(f, sas);
  }
  const headerFields = columns.map((c) => c.headerName);
  let out = `${headerPrefix}[${arr.length}]{${headerFields.join(",")}}
`;
  for (let i = 0; i < arr.length; i++) {
    const obj = arr[i];
    const cells = [];
    const attachments = [];
    let rowHasAttachment = false;
    for (const col of columns) {
      if (col.colType === "flat") {
        if (!Object.prototype.hasOwnProperty.call(obj, col.keys[0])) {
          cells.push("~");
        } else {
          const topVal = obj[col.keys[0]];
          if (topVal === null || topVal === void 0) {
            cells.push(topVal === null ? "-" : "~");
          } else {
            const resolved = resolveKeyChain(obj, col.keys);
            if (!resolved.exists) {
              cells.push("~");
            } else if (resolved.value === null || resolved.value === void 0) {
              cells.push("-");
            } else {
              cells.push(formatScalar(resolved.value, 124));
            }
          }
        }
        continue;
      }
      const f = col.field;
      if (!Object.prototype.hasOwnProperty.call(obj, f)) {
        cells.push("~");
        continue;
      }
      const v = obj[f];
      if (v === null || v === void 0) {
        cells.push("-");
        continue;
      }
      if (typeof v === "object") {
        const ifs = inlineSchemas.get(f);
        if (ifs && !Array.isArray(v)) {
          if (i === 0) {
            const fmtIF = ifs.map((k) => formatKey(k));
            cells.push(`^{${fmtIF.join(",")}}`);
          } else {
            cells.push("^");
          }
          attachments.push({ name: f, value: v, inline: true, inlineFields: ifs });
        } else {
          cells.push("^");
          attachments.push({ name: f, value: v, inline: false });
        }
        rowHasAttachment = true;
      } else {
        cells.push(formatScalar(v, 124));
      }
    }
    for (const f of fields) {
      if (!gtFields.has(f)) continue;
      if (!Object.prototype.hasOwnProperty.call(obj, f)) continue;
      rowHasAttachment = true;
      attachments.push({ name: f, value: obj[f], inline: false });
    }
    const row = cells.join("|");
    if (rowHasAttachment) {
      out += `${prefix}@${i} ${row}
`;
    } else {
      out += `${prefix}${row}
`;
    }
    for (const att of attachments) {
      const fk = formatKey(att.name);
      if (att.inline && att.inlineFields) {
        const vals = att.inlineFields.map((inf) => {
          const val = att.value[inf];
          if (val === void 0) return "~";
          return formatScalar(val, 124);
        });
        out += `${prefix}${vals.join("|")}
`;
      } else if (Array.isArray(att.value)) {
        const sas = sharedArrSchemas.get(att.name);
        if (sas && i > 0) {
          out += encodeAttachmentArrayShared(
            prefix,
            fk,
            att.value,
            depth + 2,
            sas,
            opts
          );
        } else {
          out += encodeAttachmentArray(prefix, fk, att.value, depth + 2, opts);
        }
      } else if (typeof att.value === "object" && att.value !== null) {
        out += `${prefix}.${fk} {}
`;
        out += encodeObject(att.value, depth + 2, opts);
      } else {
        if (att.value === null || att.value === void 0) {
          out += `${prefix}.${fk} =-
`;
        } else {
          out += `${prefix}.${fk} =${formatScalar(att.value, 0)}
`;
        }
      }
    }
  }
  return out;
}
function encodeAttachmentArray(attPrefix, fk, arr, depth, opts) {
  if (arr.length === 0) return `${attPrefix}.${fk} [0]
`;
  if (allPrimitives(arr)) {
    const vals = arr.map((v) => formatScalar(v, 44));
    return `${attPrefix}.${fk} [${arr.length}]: ${vals.join(",")}
`;
  }
  const fields = tabularFields(arr);
  if (fields) return encodeTabular(`${attPrefix}.${fk} `, arr, fields, depth, opts);
  return encodeExpanded(`${attPrefix}.${fk} `, arr, depth, opts);
}
function encodeAttachmentArrayShared(attPrefix, fk, arr, depth, sharedFields, opts) {
  if (arr.length === 0) return `${attPrefix}.${fk} [0]
`;
  if (allPrimitives(arr)) {
    const vals = arr.map((v) => formatScalar(v, 44));
    return `${attPrefix}.${fk} [${arr.length}]: ${vals.join(",")}
`;
  }
  const fields = tabularFields(arr);
  if (fields && fields.length === sharedFields.length && fields.every((f, i) => f === sharedFields[i])) {
    const prefix = indent(depth);
    let out = `${attPrefix}.${fk} [${arr.length}]
`;
    for (const item of arr) {
      const obj = item;
      const cells = sharedFields.map((f) => {
        if (!Object.prototype.hasOwnProperty.call(obj, f)) return "~";
        if (obj[f] === null || obj[f] === void 0) return "-";
        return formatScalar(obj[f], 124);
      });
      out += `${prefix}${cells.join("|")}
`;
    }
    return out;
  }
  return encodeAttachmentArray(attPrefix, fk, arr, depth, opts);
}
function encodeExpanded(headerPrefix, arr, depth, opts) {
  const prefix = indent(depth);
  let out = `${headerPrefix}[${arr.length}]
`;
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (Array.isArray(item)) {
      out += encodeExpandedArrayItem(prefix, i, item, depth, opts);
    } else if (typeof item === "object" && item !== null) {
      out += `${prefix}@${i} {}
`;
      out += encodeObject(item, depth + 1, opts);
    } else {
      out += `${prefix}@${i} =${formatScalar(item, 0)}
`;
    }
  }
  return out;
}
function encodeExpandedArrayItem(prefix, idx, arr, depth, opts) {
  if (arr.length === 0) return `${prefix}@${idx} [0]
`;
  if (allPrimitives(arr)) {
    const vals = arr.map((v) => formatScalar(v, 44));
    return `${prefix}@${idx} [${arr.length}]: ${vals.join(",")}
`;
  }
  const fields = tabularFields(arr);
  if (fields) return encodeTabular(`${prefix}@${idx} `, arr, fields, depth + 1, opts);
  return encodeExpanded(`${prefix}@${idx} `, arr, depth + 1, opts);
}
function allPrimitives(arr) {
  return arr.every((v) => typeof v !== "object" || v === null);
}

// open-sse/services/compression/engines/headroom/toon.ts
import { encode as toonEncode, decode as toonDecode } from "@toon-format/toon";
var TOON_FENCE_OPEN = "```toon";
var TOON_FENCE_CLOSE = "```";
function encodeToonBlock(arr) {
  try {
    return toonEncode(arr);
  } catch {
    return null;
  }
}
function wrapToon(blockContent) {
  return `${TOON_FENCE_OPEN}
${blockContent}
${TOON_FENCE_CLOSE}`;
}

// open-sse/services/compression/engines/headroom/tabular.ts
var GCF_FENCE_OPEN = "```gcf-generic";
var GCF_FENCE_CLOSE = "```";
function encodeGcfBlock(arr) {
  return encodeGeneric(arr);
}
function wrapGcf(blockContent) {
  return `${GCF_FENCE_OPEN}
${blockContent}
${GCF_FENCE_CLOSE}`;
}
function encodeTabularBlock(arr) {
  return encodeGcfBlock(arr);
}
function wrapTabular(blockContent) {
  return wrapGcf(blockContent);
}

// open-sse/services/compression/engines/headroom/smartcrusher.ts
var DEFAULT_MIN_ROWS = 8;
var JSON_FENCE_RE = /```json\n([\s\S]*?)\n```/g;
function allObjects(arr) {
  for (const item of arr) {
    if (item === null || typeof item !== "object" || Array.isArray(item)) return false;
  }
  return true;
}
function tryCompactJson(jsonStr, minRows = DEFAULT_MIN_ROWS) {
  let parsed;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    return null;
  }
  if (!Array.isArray(parsed) || parsed.length < minRows) return null;
  if (!allObjects(parsed)) return null;
  const arr = parsed;
  const compact = pickSmallestEncoding(arr);
  if (compact.length >= jsonStr.length) return null;
  return compact;
}
function pickSmallestEncoding(arr) {
  const gcf = wrapTabular(encodeTabularBlock(arr));
  const toonInner = encodeToonBlock(arr);
  if (toonInner !== null) {
    const toon = wrapToon(toonInner);
    if (toon.length < gcf.length) return toon;
  }
  return gcf;
}
function crushText(text, minRows = DEFAULT_MIN_ROWS) {
  const trimmed = text.trimStart();
  if (trimmed.startsWith("[")) {
    const compacted = tryCompactJson(text.trim(), minRows);
    if (compacted !== null) return compacted;
  }
  let result = text;
  let offset = 0;
  const regex = new RegExp(JSON_FENCE_RE.source, "g");
  let match;
  while ((match = regex.exec(text)) !== null) {
    const fullMatch = match[0];
    const innerJson = match[1];
    const compacted = tryCompactJson(innerJson.trim(), minRows);
    if (compacted !== null) {
      const start = match.index + offset;
      const end = start + fullMatch.length;
      result = result.slice(0, start) + compacted + result.slice(end);
      offset += compacted.length - fullMatch.length;
    }
  }
  return result;
}
function crushMessages(messages, minRows = DEFAULT_MIN_ROWS) {
  let changed = false;
  const result = messages.map((msg) => {
    if (msg.role === "system" || msg.role === "developer") return { ...msg };
    if (typeof msg.content === "string") {
      const crushed = crushText(msg.content, minRows);
      if (crushed !== msg.content) {
        changed = true;
        return { ...msg, content: crushed };
      }
      return { ...msg };
    }
    if (Array.isArray(msg.content)) {
      let contentChanged = false;
      const newContent = msg.content.map((part) => {
        if (part["type"] !== "text" || typeof part["text"] !== "string") return part;
        const crushed = crushText(part["text"], minRows);
        if (crushed !== part["text"]) {
          contentChanged = true;
          return { ...part, text: crushed };
        }
        return part;
      });
      if (contentChanged) {
        changed = true;
        return { ...msg, content: newContent };
      }
      return { ...msg };
    }
    return { ...msg };
  });
  return { messages: result, changed };
}

// open-sse/services/compression/engines/headroom/index.ts
var ENGINE_ID3 = "headroom";
var HEADROOM_SCHEMA = [
  {
    key: "enabled",
    type: "boolean",
    label: "Enabled",
    defaultValue: true
  },
  {
    key: "minRows",
    type: "number",
    label: "Minimum rows to compact",
    description: "Minimum number of rows in a homogeneous JSON array to trigger tabular compaction. Default: 8.",
    defaultValue: DEFAULT_MIN_ROWS,
    min: 2,
    max: 1e4
  }
];
function validateHeadroomConfig(config) {
  const errors = [];
  if (config["enabled"] !== void 0 && typeof config["enabled"] !== "boolean") {
    errors.push("enabled must be a boolean");
  }
  if (config["minRows"] !== void 0) {
    const v = config["minRows"];
    if (typeof v !== "number" || !Number.isFinite(v) || v < 2) {
      errors.push("minRows must be a number \u2265 2");
    }
  }
  return { valid: errors.length === 0, errors };
}
var headroomEngine = {
  id: ENGINE_ID3,
  name: "Headroom SmartCrusher",
  description: "Lossless tabular compaction of homogeneous JSON arrays (H3 + N5 + GP5'). Replaces repetitive JSON arrays with compact columnar blocks, including explicit [N rows] count markers for auditability.",
  icon: "compress",
  targets: ["messages", "tool_results"],
  stackable: true,
  // stackPriority 15 = between rtk (10) and caveman (20), as specified in headroom-plano.
  stackPriority: 15,
  metadata: {
    id: ENGINE_ID3,
    name: "Headroom SmartCrusher",
    description: "Lossless tabular compaction of homogeneous JSON arrays with [N rows] count markers.",
    inputScope: "messages",
    targetLatencyMs: 5,
    supportsPreview: true,
    stable: true
  },
  apply(body, options) {
    const stepConfig = options?.stepConfig ?? {};
    if (stepConfig["enabled"] === false) {
      return { body, compressed: false, stats: null };
    }
    const minRows = typeof stepConfig["minRows"] === "number" ? stepConfig["minRows"] : DEFAULT_MIN_ROWS;
    const messages = body["messages"];
    if (!Array.isArray(messages) || messages.length === 0) {
      return { body, compressed: false, stats: null };
    }
    const start = performance.now();
    const { messages: crushedMessages, changed } = crushMessages(
      messages,
      minRows
    );
    if (!changed) {
      return { body, compressed: false, stats: null };
    }
    const newBody = {
      ...body,
      messages: crushedMessages
    };
    const durationMs = Math.round(performance.now() - start);
    const stats = createCompressionStats(
      body,
      newBody,
      "stacked",
      ["headroom-smartcrusher"],
      ["tabular-compaction"],
      durationMs
    );
    return { body: newBody, compressed: true, stats };
  },
  compress(body, config) {
    return this.apply(body, { stepConfig: config ?? {} });
  },
  getConfigSchema() {
    return HEADROOM_SCHEMA;
  },
  validateConfig(config) {
    return validateHeadroomConfig(config);
  }
};

// open-sse/services/compression/engines/llmlingua/index.ts
var _backend = null;
function resolveBackend() {
  return _backend ?? workerBackend;
}
function splitProseAndPreserved(text) {
  const { text: withPlaceholders, blocks } = extractPreservedBlocks(text);
  if (blocks.length === 0) {
    return [{ kind: "prose", text }];
  }
  const segments = [];
  const placeholderToOriginal = new Map(blocks.map((b) => [b.placeholder, b.content]));
  const escapedPhs = blocks.map((b) => b.placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const splitRe = new RegExp(`(${escapedPhs.join("|")})`, "g");
  const parts = withPlaceholders.split(splitRe);
  for (const part of parts) {
    if (!part) continue;
    const original = placeholderToOriginal.get(part);
    if (original !== void 0) {
      segments.push({ kind: "preserved", text: original });
    } else {
      segments.push({ kind: "prose", text: part });
    }
  }
  return segments;
}
async function compressProseText(text, backend, opts) {
  if (!text.trim()) return { text, didCompress: false };
  try {
    const compressed = await backend(text, opts);
    if (typeof compressed === "string" && compressed.length < text.length) {
      return { text: compressed, didCompress: true };
    }
    return { text, didCompress: false };
  } catch {
    return { text, didCompress: false };
  }
}
async function compressMessageText(text, backend, opts) {
  const segments = splitProseAndPreserved(text);
  let anyCompressed = false;
  const parts = [];
  for (const seg of segments) {
    if (seg.kind === "preserved") {
      parts.push(seg.text);
    } else {
      const { text: out, didCompress } = await compressProseText(seg.text, backend, opts);
      parts.push(out);
      if (didCompress) anyCompressed = true;
    }
  }
  return { text: parts.join(""), didCompress: anyCompressed };
}
async function processMessages3(messages, backend, opts) {
  let compressedCount = 0;
  const result = [];
  for (const msg of messages) {
    if (msg.role === "system") {
      result.push({ ...msg });
      continue;
    }
    try {
      if (typeof msg.content === "string") {
        const { text, didCompress } = await compressMessageText(msg.content, backend, opts);
        if (didCompress) {
          compressedCount++;
          result.push({ ...msg, content: text });
        } else {
          result.push({ ...msg });
        }
      } else if (Array.isArray(msg.content)) {
        let changed = false;
        const newContent = [];
        for (const part of msg.content) {
          if (part["type"] === "text" && typeof part["text"] === "string") {
            const { text, didCompress } = await compressMessageText(
              part["text"],
              backend,
              opts
            );
            if (didCompress) {
              changed = true;
              compressedCount++;
              newContent.push({ ...part, text });
            } else {
              newContent.push(part);
            }
          } else {
            newContent.push(part);
          }
        }
        result.push(changed ? { ...msg, content: newContent } : { ...msg });
      } else {
        result.push({ ...msg });
      }
    } catch {
      result.push({ ...msg });
    }
  }
  return { messages: result, compressedCount };
}
var LLMLINGUA_SCHEMA = [
  { key: "enabled", type: "boolean", label: "Enabled", defaultValue: true },
  {
    key: "model",
    type: "select",
    label: "Model",
    defaultValue: DEFAULT_LLMLINGUA_MODEL,
    options: Object.values(LLMLINGUA_MODELS).map((m) => ({ value: m.id, label: m.label }))
  },
  {
    key: "minTokens",
    type: "number",
    label: "Min tokens (floor)",
    defaultValue: 2e3,
    min: 0,
    max: 1e5
  },
  {
    key: "compressionRate",
    type: "number",
    label: "Compression rate (keep ratio)",
    defaultValue: 0.5,
    min: 0.1,
    max: 0.9
  },
  { key: "modelPath", type: "string", label: "Model path (offline override)", defaultValue: "" }
];
function validateLlmlinguaConfig(config) {
  const errors = [];
  if (config["enabled"] !== void 0 && typeof config["enabled"] !== "boolean") {
    errors.push("enabled must be a boolean");
  }
  if (config["model"] !== void 0) {
    const model = config["model"];
    if (typeof model !== "string" || !(model in LLMLINGUA_MODELS)) {
      errors.push("model must be one of: " + Object.keys(LLMLINGUA_MODELS).join(", "));
    }
  }
  if (config["minTokens"] !== void 0) {
    const minTokens = config["minTokens"];
    if (typeof minTokens !== "number" || Number.isNaN(minTokens) || minTokens < 0) {
      errors.push("minTokens must be a number >= 0");
    }
  }
  if (config["compressionRate"] !== void 0) {
    const rate = config["compressionRate"];
    if (typeof rate !== "number" || Number.isNaN(rate) || rate < 0.1 || rate > 0.9) {
      errors.push("compressionRate must be a number between 0.1 and 0.9");
    }
  }
  if (config["modelPath"] !== void 0 && typeof config["modelPath"] !== "string") {
    errors.push("modelPath must be a string");
  }
  return { valid: errors.length === 0, errors };
}
var ENGINE_ID4 = "llmlingua";
var llmlinguaEngine = {
  id: ENGINE_ID4,
  name: "LLMLingua-2 (Semantic Pruning)",
  description: "Async semantic token pruning via LLMLingua-2 (ONNX/worker-thread backend). Compresses prose in non-system messages; fenced code blocks and other preserved constructs are never altered. Fail-opens on any backend error. Production backend: @atjsh/llmlingua-2 (TinyBERT 57 MB default, BERT-base optional) in a worker thread; model lazy-downloaded to DATA_DIR. Optional deps \u2014 fail-opens if not installed.",
  icon: "brain",
  targets: ["messages"],
  stackable: true,
  // stackPriority 35: runs after structural engines (CCR=4, session-dedup=3,
  // headroom=15, caveman=20) but before ultra (40). Semantic pruning is more
  // effective on already-structurally-compressed text.
  stackPriority: 35,
  metadata: {
    id: ENGINE_ID4,
    name: "LLMLingua-2 (Semantic Pruning)",
    description: "ONNX-based semantic token classification. Compresses prose only; code blocks and preserved constructs are protected. Fail-open on model/worker error.",
    inputScope: "messages",
    targetLatencyMs: 200,
    supportsPreview: false,
    // Stable. The worker model itself was VPS-validated (real prose 209→107 ch, ok=true),
    // but the EARLIER "walk-up + optional-deps gate confirmed in the bundle" claim was
    // wrong: the Next standalone bundle (webpack) froze `import.meta.url` to the build path
    // and stubbed `createRequire`, so in production the gate was always false and the worker
    // never spawned (it silently fell back to the aggressive summarizer). Fixed in B-SLM —
    // worker.ts now resolves deps + worker file from runtime anchors (cwd / argv[1]). The
    // optional deps must also be co-located into dist/node_modules (#4286) to actually run.
    stable: true
  },
  /**
   * Synchronous pass-through.
   *
   * The real compression is async-only (worker-thread model). The sync path
   * exists only so this engine is safe in sync stacked pipelines — it does
   * nothing and returns the body unchanged. `applyStackedCompressionAsync`
   * will call `applyAsync` instead.
   */
  apply(body) {
    return { body, compressed: false, stats: null };
  },
  /**
   * Async compression path.
   *
   * For each non-system message, splits text into prose/preserved segments,
   * sends only prose to the backend, and re-stitches with preserved segments
   * (fenced code, inline code, math, etc.) untouched.
   *
   * Fail-open contract:
   *   - Backend rejection/error per prose segment → segment kept as-is.
   *   - Any unexpected outer error → original body returned, no throw.
   */
  async applyAsync(body, options) {
    const stepConfig = options?.stepConfig ?? {};
    if (stepConfig["enabled"] === false) {
      return { body, compressed: false, stats: null };
    }
    const messages = body["messages"];
    if (!Array.isArray(messages) || messages.length === 0) {
      return { body, compressed: false, stats: null };
    }
    const minTokens = typeof stepConfig["minTokens"] === "number" ? stepConfig["minTokens"] : 2e3;
    if (minTokens > 0) {
      const nonSystemText = messages.filter((m) => m.role !== "system").map((m) => typeof m.content === "string" ? m.content : JSON.stringify(m.content ?? "")).join("\n");
      if (estimateCompressionTokens(nonSystemText) < minTokens) {
        return { body, compressed: false, stats: null };
      }
    }
    const backendOpts = {
      model: typeof stepConfig["model"] === "string" ? stepConfig["model"] : void 0,
      compressionRate: typeof stepConfig["compressionRate"] === "number" ? stepConfig["compressionRate"] : void 0,
      modelPath: typeof stepConfig["modelPath"] === "string" && stepConfig["modelPath"] ? stepConfig["modelPath"] : void 0
    };
    try {
      const backend = resolveBackend();
      const start = performance.now();
      const { messages: newMessages, compressedCount } = await processMessages3(
        messages,
        backend,
        backendOpts
      );
      if (compressedCount === 0) {
        return { body, compressed: false, stats: null };
      }
      const newBody = { ...body, messages: newMessages };
      const durationMs = Math.round(performance.now() - start);
      const stats = createCompressionStats(
        body,
        newBody,
        "stacked",
        [ENGINE_ID4],
        [`llmlingua-compressed-${compressedCount}-messages`],
        durationMs
      );
      return { body: newBody, compressed: true, stats };
    } catch {
      return { body, compressed: false, stats: null };
    }
  },
  compress(body, config) {
    return this.apply(body, { stepConfig: config ?? {} });
  },
  getConfigSchema() {
    return LLMLINGUA_SCHEMA;
  },
  validateConfig(config) {
    return validateLlmlinguaConfig(config);
  }
};

// open-sse/services/compression/engines/ionizer/sample.ts
var MAX_IONIZER_ROWS = 1e5;
function fnv1a2(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(seed) {
  let a = seed >>> 0;
  return function() {
    a |= 0;
    a = a + 1831565813 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function isErrorRow(row) {
  for (const key of Object.keys(row)) {
    if (/error|fail|exception|stderr|denied/i.test(key) && row[key]) return true;
  }
  for (const k of ["status", "statusCode", "code"]) {
    const v = row[k];
    if (typeof v === "number" && v >= 400 && v <= 599) return true;
  }
  return false;
}
function seededSample(pool, k, seed) {
  if (k >= pool.length) return pool.slice();
  const idx = pool.map((_, i) => i);
  const rand = mulberry32(seed);
  for (let i = 0; i < k; i++) {
    const j = i + Math.floor(rand() * (idx.length - i));
    const tmp = idx[i];
    idx[i] = idx[j];
    idx[j] = tmp;
  }
  return idx.slice(0, k).sort((a, b) => a - b).map((i) => pool[i]);
}
function ionize(rows, opts) {
  const n = rows.length;
  if (n <= opts.targetRows) return { kept: rows, keptCount: n, totalCount: n };
  const keep = /* @__PURE__ */ new Set();
  const seenKeys = /* @__PURE__ */ new Set();
  for (let i = 0; i < n; i++) {
    let novel = false;
    for (const key of Object.keys(rows[i])) {
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        novel = true;
      }
    }
    if (novel) keep.add(i);
  }
  for (let i = 0; i < n; i++) if (isErrorRow(rows[i])) keep.add(i);
  for (let i = 0; i < Math.min(opts.firstK, n); i++) keep.add(i);
  for (let i = Math.max(0, n - opts.lastK); i < n; i++) keep.add(i);
  if (keep.size < opts.targetRows) {
    const middle = [];
    for (let i = 0; i < n; i++) if (!keep.has(i)) middle.push(i);
    const need = opts.targetRows - keep.size;
    for (const idx of seededSample(middle, need, opts.seed)) keep.add(idx);
  }
  const keptIdx = [...keep].sort((a, b) => a - b);
  return { kept: keptIdx.map((i) => rows[i]), keptCount: keptIdx.length, totalCount: n };
}
function isPlainObjectArray(v) {
  return Array.isArray(v) && v.every((el) => el !== null && typeof el === "object" && !Array.isArray(el));
}
function applyIonizerPass(messages, opts) {
  try {
    let ionizedCount = 0;
    const out = messages.map((m) => {
      if (m.role === "system" || typeof m.content !== "string") return m;
      const serialized = m.content;
      let parsed;
      try {
        parsed = JSON.parse(serialized);
      } catch {
        return m;
      }
      if (!Array.isArray(parsed) || parsed.length <= opts.threshold) return m;
      if (parsed.length > MAX_IONIZER_ROWS) return m;
      if (!isPlainObjectArray(parsed)) return m;
      const res = ionize(parsed, {
        targetRows: opts.targetRows,
        firstK: 3,
        lastK: 3,
        seed: fnv1a2(serialized)
      });
      if (res.keptCount >= res.totalCount) return m;
      const stored = tryStoreBlock(serialized, opts.principalId, {
        contentType: "application/json",
        source: "ionizer"
      });
      if (!stored.stored) return m;
      const marker = `[ionizer: kept ${res.keptCount}/${res.totalCount} rows; full \u2192 CCR retrieve hash=${stored.hash} chars=${serialized.length}]`;
      const newContent = `${JSON.stringify(res.kept)}
${marker}`;
      if (newContent.length >= serialized.length) return m;
      ionizedCount++;
      return { ...m, content: newContent };
    });
    return ionizedCount > 0 ? { messages: out, ionizedCount } : { messages, ionizedCount: 0 };
  } catch {
    return { messages, ionizedCount: 0 };
  }
}
function runIonizerPass(messages, stepConfig, principalId) {
  if (stepConfig["enabled"] === false) return { messages, ionizedCount: 0 };
  const threshold = typeof stepConfig["threshold"] === "number" ? stepConfig["threshold"] : 200;
  const targetRows = typeof stepConfig["targetRows"] === "number" ? stepConfig["targetRows"] : 50;
  return applyIonizerPass(messages, { threshold, targetRows, principalId });
}

// open-sse/services/compression/engines/ionizer/index.ts
var ENGINE_ID5 = "ionizer";
var IONIZER_SCHEMA = [
  { key: "enabled", type: "boolean", label: "Enabled", defaultValue: true },
  {
    key: "threshold",
    type: "number",
    label: "Row threshold",
    description: "Only arrays with more than this many object rows are sampled. Default: 200.",
    defaultValue: 200,
    min: 2,
    max: 1e6
  },
  {
    key: "targetRows",
    type: "number",
    label: "Target kept rows",
    description: "Approximate number of rows kept inline after sampling. Default: 50.",
    defaultValue: 50,
    min: 1,
    max: 1e5
  }
];
function validateIonizerConfig(config) {
  const errors = [];
  if (config["enabled"] !== void 0 && typeof config["enabled"] !== "boolean") {
    errors.push("enabled must be a boolean");
  }
  for (const k of ["threshold", "targetRows"]) {
    if (config[k] !== void 0) {
      const v = config[k];
      if (typeof v !== "number" || !Number.isFinite(v) || v < 1) {
        errors.push(`${k} must be a positive number`);
      }
    }
  }
  return { valid: errors.length === 0, errors };
}
var ionizerEngine = {
  id: ENGINE_ID5,
  name: "Ionizer",
  description: "Lossy statistical sampling of oversized homogeneous JSON arrays. Keeps schema + error rows + first/last rows + a seeded uniform middle sample inline; stores the whole array in CCR for recovery. Complements headroom (lossless) as the fallback when columnar still overflows.",
  icon: "filter_alt",
  targets: ["messages"],
  stackable: true,
  // stackPriority 13 = between rtk (10) and headroom (15): sample raw rows BEFORE headroom
  // losslessly compacts the survivors.
  stackPriority: 13,
  sampling: true,
  metadata: {
    id: ENGINE_ID5,
    name: "Ionizer",
    description: "Lossy statistical sampling of oversized homogeneous JSON arrays, reversible via CCR.",
    inputScope: "messages",
    targetLatencyMs: 2,
    supportsPreview: true,
    stable: true
  },
  apply(body, options) {
    const stepConfig = options?.stepConfig ?? {};
    if (stepConfig["enabled"] === false) {
      return { body, compressed: false, stats: null };
    }
    const messages = body["messages"];
    if (!Array.isArray(messages) || messages.length === 0) {
      return { body, compressed: false, stats: null };
    }
    const start = performance.now();
    const { messages: finalMessages, ionizedCount } = runIonizerPass(
      messages,
      stepConfig,
      options?.principalId
    );
    if (ionizedCount === 0) {
      return { body, compressed: false, stats: null };
    }
    const newBody = { ...body, messages: finalMessages };
    const durationMs = Math.round(performance.now() - start);
    const stats = createCompressionStats(
      body,
      newBody,
      "stacked",
      ["ionizer"],
      [`ionizer-${ionizedCount}-arrays-sampled`],
      durationMs
    );
    return { body: newBody, compressed: true, stats };
  },
  compress(body, config) {
    return this.apply(body, { stepConfig: config ?? {} });
  },
  getConfigSchema() {
    return IONIZER_SCHEMA;
  },
  validateConfig(config) {
    return validateIonizerConfig(config);
  }
};

// open-sse/services/compression/engines/relevance/configSchema.ts
var RELEVANCE_SCHEMA = [
  {
    key: "enabled",
    type: "boolean",
    label: "Enabled",
    defaultValue: false
  },
  {
    key: "overlapThreshold",
    type: "number",
    label: "Overlap threshold",
    description: "Sentences with Jaccard overlap below this are candidates for removal.",
    defaultValue: 0.1,
    min: 0,
    max: 1
  },
  {
    key: "budgetPercent",
    type: "number",
    label: "Budget percent",
    description: "Target fraction of original character count to retain (0\u20131).",
    defaultValue: 0.5,
    min: 0.1,
    max: 1
  },
  {
    key: "boilerplateWeight",
    type: "number",
    label: "Boilerplate weight",
    description: "Weight applied to boilerplate penalty when scoring sentences.",
    defaultValue: 0.5,
    min: 0,
    max: 1
  }
];
function validateRelevanceConfig(config) {
  const errors = [];
  if (config.enabled !== void 0 && typeof config.enabled !== "boolean") {
    errors.push("enabled must be a boolean");
  }
  for (const key of ["overlapThreshold", "budgetPercent", "boilerplateWeight"]) {
    if (config[key] !== void 0) {
      const v = config[key];
      if (typeof v !== "number" || v < 0 || v > 1) {
        errors.push(`${key} must be a number between 0 and 1`);
      }
    }
  }
  return { valid: errors.length === 0, errors };
}
function resolveRelevanceConfig(stepConfig) {
  return {
    enabled: typeof stepConfig.enabled === "boolean" ? stepConfig.enabled : false,
    overlapThreshold: typeof stepConfig.overlapThreshold === "number" ? stepConfig.overlapThreshold : 0.1,
    budgetPercent: typeof stepConfig.budgetPercent === "number" ? stepConfig.budgetPercent : 0.5,
    boilerplateWeight: typeof stepConfig.boilerplateWeight === "number" ? stepConfig.boilerplateWeight : 0.5
  };
}

// open-sse/services/compression/engines/relevance/scorer.ts
var BOILERPLATE_TOKENS = /* @__PURE__ */ new Set([
  "please",
  "note",
  "important",
  "indeed",
  "certainly",
  "basically",
  "essentially",
  "obviously",
  "clearly",
  "simply",
  "just",
  "really",
  "actually",
  "honestly",
  "conclusion",
  "summary",
  "hope",
  "understand",
  "thing",
  "things",
  "something"
]);
function tokenize(text) {
  const lower = text.toLowerCase();
  const tokens = [];
  let start = -1;
  for (let i = 0; i <= lower.length; i++) {
    const ch = i < lower.length ? lower.charCodeAt(i) : -1;
    const isAlnum = ch !== -1 && (ch >= 97 && ch <= 122 || ch >= 48 && ch <= 57);
    if (isAlnum) {
      if (start === -1) start = i;
    } else {
      if (start !== -1) {
        tokens.push(lower.slice(start, i));
        start = -1;
      }
    }
  }
  return tokens;
}
function jaccard2(setA, setB) {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const t of setA) {
    if (setB.has(t)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}
function boilerplateScore(tokens) {
  if (tokens.length === 0) return 0;
  let count2 = 0;
  for (const t of tokens) {
    if (BOILERPLATE_TOKENS.has(t)) count2++;
  }
  return count2 / tokens.length;
}
function scoreSentences(sentences, query, cfg) {
  if (sentences.length === 0) return [];
  if (!query || query.trim().length === 0) return sentences.map(() => 0);
  const queryTokens = new Set(tokenize(query));
  return sentences.map((sentence) => {
    const sentTokens = tokenize(sentence);
    if (sentTokens.length === 0) return 0;
    const sentSet = new Set(sentTokens);
    const overlap = jaccard2(sentSet, queryTokens);
    const boilerplate = boilerplateScore(sentTokens) * cfg.boilerplateWeight;
    return Math.max(0, overlap - boilerplate);
  });
}

// open-sse/services/compression/engines/relevance/index.ts
var SENTENCE_PRESERVE_RE = /\d|https?:\/\/|(?:Error|Exception|TypeError|RangeError|SyntaxError|ReferenceError|Traceback):|```|^\s*at\s|\/[\w.-]+\/|\w+=\S/i;
var SENTENCE_SPLIT_RE = /(?<=[.!?]\s)/;
function extractText2(content) {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content.map((block) => {
      if (block && typeof block === "object" && "text" in block) {
        return String(block.text);
      }
      return "";
    }).join(" ");
  }
  return "";
}
function splitSentences(text) {
  return text.split(SENTENCE_SPLIT_RE).filter((s) => s.trim().length > 0);
}
function applyRelevanceToText(text, query, cfg) {
  const sentences = splitSentences(text);
  if (sentences.length <= 1) return { result: text, changed: false };
  const scores = scoreSentences(sentences, query, cfg);
  const totalChars = text.length;
  const budget = Math.floor(totalChars * cfg.budgetPercent);
  const indexed = sentences.map((s, i) => ({ s, i, score: scores[i] }));
  const sorted = [...indexed].sort((a, b) => b.score - a.score);
  const keepSet = /* @__PURE__ */ new Set();
  for (const { s, i } of indexed) {
    if (SENTENCE_PRESERVE_RE.test(s)) keepSet.add(i);
  }
  let kept = 0;
  for (const { s, i, score } of sorted) {
    if (keepSet.has(i)) continue;
    if (kept >= budget) break;
    if (score >= cfg.overlapThreshold) {
      keepSet.add(i);
      kept += s.length + 1;
    }
  }
  if (keepSet.size === 0 && sorted.length > 0) keepSet.add(sorted[0].i);
  if (keepSet.size === sentences.length) return { result: text, changed: false };
  const ordered = indexed.filter(({ i }) => keepSet.has(i)).sort((a, b) => a.i - b.i);
  const result = ordered.map(({ s }) => s).join("");
  return { result, changed: result !== text };
}
var relevanceEngine = {
  id: "relevance",
  name: "Relevance",
  description: "Extractive sentence scoring against the last user query.",
  icon: "target",
  targets: ["messages"],
  stackable: true,
  stackPriority: 18,
  metadata: {
    id: "relevance",
    name: "Relevance",
    description: "Extractive sentence scoring against the last user query.",
    inputScope: "messages",
    targetLatencyMs: 2,
    supportsPreview: true,
    stable: true
  },
  apply(body, options) {
    try {
      const messages = body.messages;
      if (!Array.isArray(messages)) return { body, compressed: false, stats: null };
      const cfg = resolveRelevanceConfig(options?.stepConfig ?? {});
      let query = "";
      for (let i = messages.length - 1; i >= 0; i--) {
        const msg = messages[i];
        if (msg.role === "user") {
          query = extractText2(msg.content).trim();
          break;
        }
      }
      if (!query) return { body, compressed: false, stats: null };
      let anyChanged = false;
      const newMessages = messages.map((msg) => {
        const m = msg;
        if (m.role !== "user") return msg;
        if (typeof m.content === "string") {
          const { result, changed } = applyRelevanceToText(m.content, query, cfg);
          if (!changed) return msg;
          anyChanged = true;
          return { ...m, content: result };
        }
        if (Array.isArray(m.content)) {
          const textBlocks = m.content.filter(
            (b) => b && typeof b === "object" && "text" in b
          );
          if (textBlocks.length !== 1) return msg;
          const { result, changed } = applyRelevanceToText(
            String(textBlocks[0].text),
            query,
            cfg
          );
          if (!changed) return msg;
          anyChanged = true;
          const newContent = m.content.map(
            (block) => block === textBlocks[0] ? { ...block, text: result } : block
          );
          return { ...m, content: newContent };
        }
        return msg;
      });
      if (!anyChanged) return { body, compressed: false, stats: null };
      const newBody = { ...body, messages: newMessages };
      const stats = createCompressionStats(body, newBody, "stacked", ["relevance-extract"]);
      return { body: newBody, compressed: true, stats };
    } catch {
      return { body, compressed: false, stats: null };
    }
  },
  compress(body, config) {
    return this.apply(body, { stepConfig: config });
  },
  getConfigSchema() {
    return RELEVANCE_SCHEMA;
  },
  validateConfig(config) {
    return validateRelevanceConfig(config);
  }
};

// open-sse/services/compression/engines/llm/index.ts
var noopBackend = async (text) => text;
var _backend2 = null;
function resolveBackend2() {
  return _backend2 ?? noopBackend;
}
function splitProseAndPreserved2(text) {
  const { text: withPlaceholders, blocks } = extractPreservedBlocks(text);
  if (blocks.length === 0) return [{ kind: "prose", text }];
  const placeholderToOriginal = new Map(blocks.map((b) => [b.placeholder, b.content]));
  const escaped = blocks.map((b) => b.placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const splitRe = new RegExp(`(${escaped.join("|")})`, "g");
  const segments = [];
  for (const part of withPlaceholders.split(splitRe)) {
    if (!part) continue;
    const original = placeholderToOriginal.get(part);
    segments.push(
      original !== void 0 ? { kind: "preserved", text: original } : { kind: "prose", text: part }
    );
  }
  return segments;
}
async function compressProseText2(text, backend, opts) {
  if (!text.trim()) return { text, didCompress: false };
  try {
    const compressed = await backend(text, opts);
    if (typeof compressed === "string" && compressed.length < text.length) {
      return { text: compressed, didCompress: true };
    }
    return { text, didCompress: false };
  } catch {
    return { text, didCompress: false };
  }
}
async function compressMessageText2(text, backend, opts) {
  const segments = splitProseAndPreserved2(text);
  let anyCompressed = false;
  const parts = [];
  for (const seg of segments) {
    if (seg.kind === "preserved") {
      parts.push(seg.text);
    } else {
      const { text: out, didCompress } = await compressProseText2(seg.text, backend, opts);
      parts.push(out);
      if (didCompress) anyCompressed = true;
    }
  }
  return { text: parts.join(""), didCompress: anyCompressed };
}
async function processMessages4(messages, backend, opts) {
  let compressedCount = 0;
  const result = [];
  for (const msg of messages) {
    if (msg.role === "system") {
      result.push({ ...msg });
      continue;
    }
    try {
      if (typeof msg.content === "string") {
        const { text, didCompress } = await compressMessageText2(msg.content, backend, opts);
        if (didCompress) {
          compressedCount++;
          result.push({ ...msg, content: text });
        } else {
          result.push({ ...msg });
        }
      } else if (Array.isArray(msg.content)) {
        let changed = false;
        const newContent = [];
        for (const part of msg.content) {
          if (part["type"] === "text" && typeof part["text"] === "string") {
            const { text, didCompress } = await compressMessageText2(
              part["text"],
              backend,
              opts
            );
            if (didCompress) {
              changed = true;
              compressedCount++;
              newContent.push({ ...part, text });
            } else {
              newContent.push(part);
            }
          } else {
            newContent.push(part);
          }
        }
        result.push(changed ? { ...msg, content: newContent } : { ...msg });
      } else {
        result.push({ ...msg });
      }
    } catch {
      result.push({ ...msg });
    }
  }
  return { messages: result, compressedCount };
}
var LLM_COMPRESSOR_SCHEMA = [
  // Default OFF: this tier costs an extra model call and mutates the payload, so it is
  // opt-in (Hard Rule #20 spirit) — never on by default.
  { key: "enabled", type: "boolean", label: "Enabled", defaultValue: false },
  { key: "model", type: "string", label: "Compression model", defaultValue: "" },
  {
    key: "minTokens",
    type: "number",
    label: "Min tokens (floor)",
    defaultValue: 2e3,
    min: 0,
    max: 1e5
  },
  {
    key: "compressionRate",
    type: "number",
    label: "Compression rate (keep ratio)",
    defaultValue: 0.5,
    min: 0.1,
    max: 0.9
  }
];
function validateLlmCompressorConfig(config) {
  const errors = [];
  if (config["enabled"] !== void 0 && typeof config["enabled"] !== "boolean") {
    errors.push("enabled must be a boolean");
  }
  if (config["model"] !== void 0 && typeof config["model"] !== "string") {
    errors.push("model must be a string");
  }
  if (config["minTokens"] !== void 0) {
    const v = config["minTokens"];
    if (typeof v !== "number" || Number.isNaN(v) || v < 0) errors.push("minTokens must be a number >= 0");
  }
  if (config["compressionRate"] !== void 0) {
    const v = config["compressionRate"];
    if (typeof v !== "number" || Number.isNaN(v) || v < 0.1 || v > 0.9) {
      errors.push("compressionRate must be a number between 0.1 and 0.9");
    }
  }
  return { valid: errors.length === 0, errors };
}
var ENGINE_ID6 = "llm";
var llmCompressorEngine = {
  id: ENGINE_ID6,
  name: "LLM Compressor (opt-in)",
  description: "Opt-in LLM-tier compression: condenses the prose of non-system messages via a pluggable chat-completion backend. Default-off and a no-op until an operator both enables it and wires a real backend; fenced code blocks and system messages are never sent to the model. Fail-opens on any backend error.",
  icon: "robot",
  targets: ["messages"],
  stackable: true,
  // Runs after llmlingua (35) but before ultra (40); semantic LLM rewriting is most useful
  // once cheaper structural/semantic passes have already reduced the prose.
  stackPriority: 38,
  metadata: {
    id: ENGINE_ID6,
    name: "LLM Compressor (opt-in)",
    description: "Opt-in LLM-tier prose compression via a pluggable backend. Default-off / no-op; code blocks and system messages are protected; fail-open on backend error.",
    inputScope: "messages",
    targetLatencyMs: 1500,
    supportsPreview: false,
    stable: true
  },
  /** Synchronous pass-through — the real work is async-only (`applyAsync`). */
  apply(body) {
    return { body, compressed: false, stats: null };
  },
  async applyAsync(body, options) {
    const stepConfig = options?.stepConfig ?? {};
    if (stepConfig["enabled"] !== true) {
      return { body, compressed: false, stats: null };
    }
    const messages = body["messages"];
    if (!Array.isArray(messages) || messages.length === 0) {
      return { body, compressed: false, stats: null };
    }
    const minTokens = typeof stepConfig["minTokens"] === "number" ? stepConfig["minTokens"] : 2e3;
    if (minTokens > 0) {
      const nonSystemText = messages.filter((m) => m.role !== "system").map((m) => typeof m.content === "string" ? m.content : JSON.stringify(m.content ?? "")).join("\n");
      if (estimateCompressionTokens(nonSystemText) < minTokens) {
        return { body, compressed: false, stats: null };
      }
    }
    const backendOpts = {
      model: typeof stepConfig["model"] === "string" ? stepConfig["model"] : void 0,
      compressionRate: typeof stepConfig["compressionRate"] === "number" ? stepConfig["compressionRate"] : void 0
    };
    try {
      const backend = resolveBackend2();
      const start = performance.now();
      const { messages: newMessages, compressedCount } = await processMessages4(
        messages,
        backend,
        backendOpts
      );
      if (compressedCount === 0) {
        return { body, compressed: false, stats: null };
      }
      const newBody = { ...body, messages: newMessages };
      const durationMs = Math.round(performance.now() - start);
      const stats = createCompressionStats(
        body,
        newBody,
        "stacked",
        [ENGINE_ID6],
        [`llm-compressed-${compressedCount}-messages`],
        durationMs
      );
      return { body: newBody, compressed: true, stats };
    } catch {
      return { body, compressed: false, stats: null };
    }
  },
  compress(body, config) {
    return this.apply(body, { stepConfig: config ?? {} });
  },
  getConfigSchema() {
    return LLM_COMPRESSOR_SCHEMA;
  },
  validateConfig(config) {
    return validateLlmCompressorConfig(config);
  }
};

// open-sse/services/compression/engines/readLifecycle/index.ts
var ENGINE_ID7 = "read-lifecycle";
var READ_NAMES = /* @__PURE__ */ new Set(["read", "read_file", "readfile", "view", "view_file", "cat"]);
var WRITE_NAMES = /* @__PURE__ */ new Set([
  "write",
  "write_file",
  "writefile",
  "edit",
  "edit_file",
  "multiedit",
  "str_replace",
  "str_replace_editor",
  "str_replace_based_edit_tool",
  "apply_patch",
  "create_file",
  "update_file"
]);
function classifyTool(name) {
  if (typeof name !== "string") return null;
  const lc = name.trim().toLowerCase();
  if (READ_NAMES.has(lc)) return "read";
  if (WRITE_NAMES.has(lc)) return "write";
  return null;
}
function isRecord6(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}
function extractPath(input) {
  if (!isRecord6(input)) return null;
  for (const key of ["file_path", "path", "filePath", "filename", "file", "target_file"]) {
    const v = input[key];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}
function parseMaybeJson(value) {
  if (isRecord6(value)) return value;
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  return null;
}
function extractInvocations(messages) {
  const invocations = [];
  const readPathByCallId = /* @__PURE__ */ new Map();
  let order = 0;
  for (const msg of messages) {
    if (Array.isArray(msg?.content)) {
      for (const block of msg.content) {
        if (!isRecord6(block) || block.type !== "tool_use") continue;
        const kind = classifyTool(block.name);
        const callId = typeof block.id === "string" ? block.id : null;
        const path12 = extractPath(block.input);
        if (kind && callId && path12) {
          invocations.push({ callId, kind, path: path12, order: order++ });
          if (kind === "read") readPathByCallId.set(callId, path12);
        }
      }
    }
    if (Array.isArray(msg?.tool_calls)) {
      for (const call of msg.tool_calls) {
        if (!isRecord6(call)) continue;
        const fn = isRecord6(call.function) ? call.function : null;
        const kind = classifyTool(fn?.name);
        const callId = typeof call.id === "string" ? call.id : null;
        const path12 = extractPath(parseMaybeJson(fn?.arguments));
        if (kind && callId && path12) {
          invocations.push({ callId, kind, path: path12, order: order++ });
          if (kind === "read") readPathByCallId.set(callId, path12);
        }
      }
    }
  }
  return { invocations, readPathByCallId };
}
function findSupersededReadCallIds(invocations) {
  const superseded = /* @__PURE__ */ new Set();
  for (const inv of invocations) {
    if (inv.kind !== "read") continue;
    const hasLater = invocations.some((o) => o.path === inv.path && o.order > inv.order);
    if (hasLater) superseded.add(inv.callId);
  }
  return superseded;
}
function stubFor(path12) {
  return `[read superseded \u2014 "${path12}" was re-read or modified later in the conversation; the current content appears below]`;
}
function replaceResultText(content, stub) {
  if (typeof content === "string") return stub;
  if (Array.isArray(content)) {
    return content.map(
      (part) => isRecord6(part) && part.type === "text" && typeof part.text === "string" ? { ...part, text: stub } : part
    );
  }
  return stub;
}
function collapseSupersededReads(messages, superseded, readPathByCallId) {
  if (superseded.size === 0) return { messages, collapsedCount: 0 };
  let collapsedCount = 0;
  const out = messages.map((msg) => {
    if (msg?.role === "tool" && typeof msg.tool_call_id === "string" && superseded.has(msg.tool_call_id)) {
      collapsedCount++;
      const path12 = readPathByCallId.get(msg.tool_call_id) ?? "file";
      return { ...msg, content: stubFor(path12) };
    }
    if (Array.isArray(msg?.content)) {
      let changed = false;
      const newContent = msg.content.map((block) => {
        if (isRecord6(block) && block.type === "tool_result" && typeof block.tool_use_id === "string" && superseded.has(block.tool_use_id)) {
          changed = true;
          collapsedCount++;
          const path12 = readPathByCallId.get(block.tool_use_id) ?? "file";
          return { ...block, content: replaceResultText(block.content, stubFor(path12)) };
        }
        return block;
      });
      if (changed) return { ...msg, content: newContent };
    }
    return msg;
  });
  return { messages: out, collapsedCount };
}
var SCHEMA = [
  { key: "enabled", type: "boolean", label: "Enabled", defaultValue: false }
];
function validate(config) {
  const errors = [];
  if (config["enabled"] !== void 0 && typeof config["enabled"] !== "boolean") {
    errors.push("enabled must be a boolean");
  }
  return { valid: errors.length === 0, errors };
}
var readLifecycleEngine = {
  id: ENGINE_ID7,
  name: "Read Lifecycle (opt-in)",
  description: "Collapses stale/superseded file-Read tool results: when the same path is re-read or modified later in the conversation, earlier Reads are replaced with a short stub, keeping the current Read intact. Lossy + opt-in (default off). Supports Anthropic and OpenAI tool shapes.",
  icon: "history",
  targets: ["messages"],
  stackable: true,
  // Runs early (before content engines) so stale reads are gone before other passes work on them.
  stackPriority: 5,
  metadata: {
    id: ENGINE_ID7,
    name: "Read Lifecycle (opt-in)",
    description: "Collapse superseded file-Read tool results (same path re-read/modified later). Lossy, opt-in, default off. Anthropic + OpenAI shapes.",
    inputScope: "messages",
    targetLatencyMs: 2,
    supportsPreview: true,
    stable: true
  },
  apply(body, options) {
    const stepConfig = options?.stepConfig ?? {};
    if (stepConfig["enabled"] !== true) {
      return { body, compressed: false, stats: null };
    }
    const messages = body["messages"];
    if (!Array.isArray(messages) || messages.length === 0) {
      return { body, compressed: false, stats: null };
    }
    try {
      const start = performance.now();
      const { invocations, readPathByCallId } = extractInvocations(messages);
      const superseded = findSupersededReadCallIds(invocations);
      const { messages: newMessages, collapsedCount } = collapseSupersededReads(
        messages,
        superseded,
        readPathByCallId
      );
      if (collapsedCount === 0) {
        return { body, compressed: false, stats: null };
      }
      const newBody = { ...body, messages: newMessages };
      const durationMs = Math.round(performance.now() - start);
      const stats = createCompressionStats(
        body,
        newBody,
        "stacked",
        [ENGINE_ID7],
        [`read-lifecycle-collapsed-${collapsedCount}`],
        durationMs
      );
      return { body: newBody, compressed: true, stats };
    } catch {
      return { body, compressed: false, stats: null };
    }
  },
  compress(body, config) {
    return this.apply(body, { stepConfig: config ?? {} });
  },
  getConfigSchema() {
    return SCHEMA;
  },
  validateConfig(config) {
    return validate(config);
  }
};

// open-sse/services/compression/omniglyphTelemetry.ts
import {
  normalizeAccounting
} from "omniglyph";
function toAccountingProvider(provider) {
  const normalized = typeof provider === "string" ? provider.trim().toLowerCase() : "";
  if (normalized === "anthropic" || normalized === "claude") return "anthropic";
  if (normalized === "openai" || normalized === "codex" || normalized === "chatgpt") {
    return "openai";
  }
  if (normalized === "xai" || normalized === "grok") return "xai";
  return "unknown";
}
function count(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : void 0;
}
function buildOmniGlyphAccounting(params) {
  const { info } = params;
  const provider = toAccountingProvider(params.provider);
  const normalized = normalizeAccounting({
    provider,
    ...params.model ? { model: params.model } : {},
    originalBytes: params.originalBytes,
    transformedBytes: params.transformedBytes,
    ...count(info?.baselineImagedTokens) !== void 0 ? { estimatedOriginalInputTokens: info.baselineImagedTokens } : {},
    ...count(info?.imageTokens) !== void 0 ? { estimatedTransformedInputTokens: info.imageTokens } : {},
    ...count(info?.imageTokens) !== void 0 ? { imageTokens: info.imageTokens } : {},
    ...params.durationMs !== void 0 ? { proxyAddedLatencyMs: params.durationMs } : {}
  });
  const chars = {
    ...count(info?.origChars) !== void 0 ? { original: info.origChars } : {},
    ...count(info?.compressedChars) !== void 0 ? { imaged: info.compressedChars } : {},
    ...count(info?.staticChars) !== void 0 ? { static: info.staticChars } : {},
    ...count(info?.dynamicChars) !== void 0 ? { dynamic: info.dynamicChars } : {},
    ...count(info?.outgoingTextChars) !== void 0 ? { outgoingText: info.outgoingTextChars } : {}
  };
  return {
    provider: normalized.provider,
    ...normalized.model ? { model: normalized.model } : {},
    bytes: normalized.bytes,
    tokens: {
      ...normalized.tokens.estimatedOriginalInput !== void 0 ? { estimatedOriginalInput: normalized.tokens.estimatedOriginalInput } : {},
      ...normalized.tokens.estimatedActualInput !== void 0 ? { estimatedActualInput: normalized.tokens.estimatedActualInput } : {},
      ...normalized.tokens.estimatedReduced !== void 0 ? { estimatedReduced: normalized.tokens.estimatedReduced } : {},
      ...normalized.tokens.image !== void 0 ? { image: normalized.tokens.image } : {}
    },
    savings: normalized.savings,
    images: {
      count: count(info?.imageCount) ?? 0,
      bytes: count(info?.imageBytes) ?? 0,
      ...count(info?.imagePixels) !== void 0 ? { pixels: info.imagePixels } : {}
    },
    chars,
    ...count(info?.dynamicBlockCount) !== void 0 ? { dynamicBlockCount: info.dynamicBlockCount } : {},
    ...normalized.latency.proxyAddedMs !== void 0 ? { latencyMs: normalized.latency.proxyAddedMs } : {}
  };
}

// open-sse/services/compression/engines/omniglyphAdapter.ts
import {
  isOmniGlyphSupportedModelForScope,
  mergeCompressionProfileOptions,
  resolveCompressionProfile,
  transformAnthropicMessages,
  transformOpenAIChatCompletions,
  transformOpenAIResponses
} from "omniglyph";
import { isModelImageable } from "omniglyph/applicability";
var MEASURED_MODEL_SCOPE = "coding-safe";
var DEFAULT_PROFILE = "aggressive";
function resolveProfileName(options) {
  const step = options?.stepConfig?.profile;
  if (typeof step === "string" && step.trim()) return step;
  const global = options?.config?.omniglyph?.profile;
  if (typeof global === "string" && global.trim()) return global;
  return DEFAULT_PROFILE;
}
function isModelWithinScope(model, scope) {
  if (!isOmniGlyphSupportedModelForScope(model, MEASURED_MODEL_SCOPE)) return false;
  return isOmniGlyphSupportedModelForScope(model, scope);
}
function skip(body, reason) {
  try {
    return {
      body,
      compressed: false,
      stats: createCompressionStats(body, body, "stacked", [`skip:${reason}`])
    };
  } catch {
    return { body, compressed: false, stats: null };
  }
}
function isClaudeFormat(body) {
  const messages = body.messages;
  if (!Array.isArray(messages)) return false;
  return !messages.some((m) => m?.role === "system");
}
function inferWireFormat(body) {
  if (Array.isArray(body.input) || typeof body.instructions === "string") {
    return "openai-responses";
  }
  if (!isClaudeFormat(body)) return "openai";
  return "claude";
}
function resolveWireFormat(body, options) {
  const stage = options?.compressionStage ?? "pre-translation";
  const requested = stage === "post-translation" ? options?.targetFormat : options?.sourceFormat;
  if (requested === "claude" || requested === "openai" || requested === "openai-responses") {
    return requested;
  }
  if (requested) return null;
  return inferWireFormat(body);
}
async function applyOmniglyph(body, options) {
  const model = options?.model ?? body.model ?? "";
  if (options?.supportsVision !== true) return skip(body, "no_vision");
  if (options?.providerTransport !== "direct") return skip(body, "transport_not_direct");
  if (options?.imageTransportFidelity !== void 0 && options.imageTransportFidelity !== "byte-preserving") {
    return skip(
      body,
      options.imageTransportFidelity === "resizes" ? "transport_resizes_images" : "transport_fidelity_unknown"
    );
  }
  const stage = options?.compressionStage ?? "pre-translation";
  const wireFormat = resolveWireFormat(body, options);
  const sourceWireFormat = options?.sourceFormat ?? wireFormat;
  if (stage === "pre-translation" && options?.targetFormat && sourceWireFormat && options.targetFormat !== sourceWireFormat) {
    return skip(body, "requires_post_translation");
  }
  if (stage === "pre-translation" && wireFormat !== "claude") {
    return skip(body, "requires_post_translation");
  }
  if (!wireFormat) return skip(body, "target_format_not_supported");
  if (wireFormat === "claude" && !isClaudeFormat(body)) {
    return skip(body, "source_format_not_claude");
  }
  if (wireFormat === "openai" && !Array.isArray(body.messages)) {
    return skip(body, "source_format_not_openai");
  }
  if (wireFormat === "openai-responses" && !Array.isArray(body.input) && typeof body.input !== "string") {
    return skip(body, "source_format_not_openai_responses");
  }
  let profile;
  try {
    profile = resolveCompressionProfile(resolveProfileName(options));
  } catch {
    return skip(body, "invalid_profile");
  }
  if (profile.name === "passthrough") return skip(body, "profile_passthrough");
  if (!isModelWithinScope(model, profile.name)) {
    return skip(body, "model_not_approved");
  }
  const preserveSystemPrompt = (typeof options?.stepConfig?.preserveSystemPrompt === "boolean" ? options.stepConfig.preserveSystemPrompt : options?.config?.preserveSystemPrompt) === true;
  if (preserveSystemPrompt && wireFormat !== "claude") {
    return skip(body, "system_preservation_unsupported_on_wire");
  }
  if (!isModelImageable(model)) return skip(body, "model_not_imageable");
  const started = Date.now();
  let outBody;
  let accounting;
  try {
    const transformBody = wireFormat !== "claude" && model && body.model !== model ? { ...body, model } : body;
    const encoded = new TextEncoder().encode(JSON.stringify(transformBody));
    const overrides = preserveSystemPrompt ? { compressSystem: false } : {};
    const openAIOptions = mergeCompressionProfileOptions(profile, overrides);
    const result = wireFormat === "claude" ? await transformAnthropicMessages({
      body: encoded,
      model,
      options: { ...overrides, profile: profile.name }
    }) : wireFormat === "openai" ? await transformOpenAIChatCompletions(encoded, openAIOptions) : await transformOpenAIResponses(encoded, openAIOptions);
    const applied = "applied" in result ? result.applied : result.info.compressed;
    if (!applied) return skip(body, result.info?.reason ?? "not_profitable");
    outBody = JSON.parse(new TextDecoder().decode(result.body));
    if (transformBody !== body && body.model !== void 0) outBody.model = body.model;
    accounting = buildOmniGlyphAccounting({
      provider: options?.provider,
      model,
      originalBytes: encoded.byteLength,
      transformedBytes: result.body.byteLength,
      info: result.info,
      durationMs: Date.now() - started
    });
  } catch {
    return skip(body, "transform_error");
  }
  const stats = createCompressionStats(
    body,
    outBody,
    "stacked",
    ["omniglyph:context-as-image"],
    void 0,
    Date.now() - started
  );
  if (accounting) stats.omniglyph = accounting;
  return { body: outBody, compressed: true, stats };
}
var omniglyphEngine = {
  id: "omniglyph",
  name: "OmniGlyph",
  description: "Contexto-como-imagem para Claude Fable 5 na rota direta medida; wires GPT nativos ficam dispon\xEDveis apenas ap\xF3s recibo de fidelidade do provedor.",
  icon: "image",
  targets: ["messages", "tool_results"],
  stackable: true,
  stackPriority: 90,
  // por último: RTK/Caveman limpam texto antes; omniglyph imageia o residual
  sampling: true,
  // perda intencional + factsheet → fidelity gate pula por design
  metadata: {
    id: "omniglyph",
    name: "OmniGlyph",
    description: "Contexto-como-imagem para Claude Fable 5 na rota direta medida; transformadores GPT nativos permanecem fail-closed at\xE9 valida\xE7\xE3o do provedor.",
    inputScope: "mixed",
    targetLatencyMs: 250,
    // render+encode PNG de páginas grandes
    supportsPreview: true,
    stable: false,
    // P1: preview — promover após o e2e P3 (30/30 via OmniRoute)
    executionStages: ["pre-translation", "post-translation"]
  },
  // Contrato da interface: engines async-only mantêm apply síncrono como pass-through seguro.
  apply(body) {
    return { body, compressed: false, stats: null };
  },
  applyAsync: applyOmniglyph,
  compress(body, config) {
    return this.apply(body, { stepConfig: config });
  },
  getConfigSchema() {
    return [];
  },
  validateConfig() {
    return { valid: true, errors: [] };
  }
};

// open-sse/services/compression/engines/codexResponses/index.ts
var ENGINE_ID8 = "codex-responses";
function countCodexTokens(text) {
  if (!text) return 0;
  return countTextTokens(text, { provider: "codex" });
}
var SUPPORTED_TYPES = /* @__PURE__ */ new Set([
  "function_call_output",
  "local_shell_call_output",
  "apply_patch_call_output"
]);
var DIFF_HUNK_RE = /^@@{1,2}\s+-\d+(?:,\d+)?(?:\s+-\d+(?:,\d+)?)*\s+\+\d+(?:,\d+)?(?:,\d+)?\s+@@{1,2}/m;
var SEARCH_LINE_RE = /^\s*(?:[\w./-]+:\d+(?::\d+)?:|\d+(?::\d+)?[-:])\s*\S/m;
var IMPORTANT_LOG_RE = /(?:^|\b)(?:error|warning|warn|failed|failure|fatal|panic|exception|traceback|assertion|exit\s+code)\b/i;
var BUILD_RE = /\b(?:build|compile|test|lint|npm|yarn|pnpm|mix|make|cargo|gradle|maven|pytest|rspec|exunit)\b/i;
var CODEX_SCHEMA = [
  { key: "enabled", type: "boolean", label: "Enabled", defaultValue: false },
  {
    key: "minBytes",
    type: "number",
    label: "Minimum output bytes",
    defaultValue: DEFAULT_CODEX_RESPONSES_CONFIG.minBytes,
    min: 0,
    max: 2e6
  },
  {
    key: "maxOutputBytes",
    type: "number",
    label: "Maximum output bytes",
    defaultValue: DEFAULT_CODEX_RESPONSES_CONFIG.maxOutputBytes,
    min: 1,
    max: 1e7
  },
  {
    key: "maxCandidateBytes",
    type: "number",
    label: "Maximum candidate bytes",
    defaultValue: DEFAULT_CODEX_RESPONSES_CONFIG.maxCandidateBytes,
    min: 1,
    max: 2e6
  },
  {
    key: "maxLines",
    type: "number",
    label: "Maximum retained lines",
    defaultValue: DEFAULT_CODEX_RESPONSES_CONFIG.maxLines,
    min: 1,
    max: 1e4
  }
];
function isRecord7(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}
function bounded(value, fallback, min, max) {
  return typeof value === "number" && Number.isFinite(value) ? Math.min(max, Math.max(min, Math.floor(value))) : fallback;
}
function mergeConfig(options) {
  const source = options?.config?.codexResponsesConfig ?? {};
  const step = options?.stepConfig ?? {};
  const merged = { ...DEFAULT_CODEX_RESPONSES_CONFIG, ...source, ...step };
  return {
    ...DEFAULT_CODEX_RESPONSES_CONFIG,
    enabled: merged.enabled !== false,
    minBytes: bounded(merged.minBytes, DEFAULT_CODEX_RESPONSES_CONFIG.minBytes, 0, 2e6),
    maxOutputBytes: bounded(
      merged.maxOutputBytes,
      DEFAULT_CODEX_RESPONSES_CONFIG.maxOutputBytes,
      1,
      1e7
    ),
    maxCandidateBytes: bounded(
      merged.maxCandidateBytes,
      DEFAULT_CODEX_RESPONSES_CONFIG.maxCandidateBytes,
      1,
      2e6
    ),
    maxLines: bounded(merged.maxLines, DEFAULT_CODEX_RESPONSES_CONFIG.maxLines, 1, 1e4),
    minSearchMatches: bounded(
      merged.minSearchMatches,
      DEFAULT_CODEX_RESPONSES_CONFIG.minSearchMatches,
      2,
      1e4
    ),
    minLogLines: bounded(merged.minLogLines, DEFAULT_CODEX_RESPONSES_CONFIG.minLogLines, 2, 1e4),
    preserveToolNames: Array.isArray(merged.preserveToolNames) ? merged.preserveToolNames.filter((name) => typeof name === "string") : DEFAULT_CODEX_RESPONSES_CONFIG.preserveToolNames
  };
}
function minifyJson(text) {
  try {
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed) && !isRecord7(parsed)) return null;
    return JSON.stringify(parsed);
  } catch {
    return null;
  }
}
function collapseLines(text, config) {
  const lines = text.split(/\r?\n/);
  if (lines.length < config.minLogLines) return null;
  const important = lines.map((line, index) => ({ line, index })).filter(
    ({ line }) => IMPORTANT_LOG_RE.test(line) || /^(?:\s*(?:at\s|File\s|\S+[:(]\d+))/.test(line)
  ).map(({ index }) => index);
  if (important.length === 0 && !BUILD_RE.test(text)) return null;
  const keep = /* @__PURE__ */ new Set();
  for (let index = 0; index < Math.min(8, lines.length); index++) keep.add(index);
  for (let index = Math.max(0, lines.length - 8); index < lines.length; index++) keep.add(index);
  for (const index of important) {
    for (let offset = -2; offset <= 2; offset++) {
      if (index + offset >= 0 && index + offset < lines.length) keep.add(index + offset);
    }
  }
  const indexes = [...keep].sort((a, b) => a - b).slice(0, config.maxLines);
  const output = [];
  let previous = -1;
  for (const index of indexes) {
    if (index - previous > 1)
      output.push(`[compressed log output: omitted ${index - previous - 1} lines]`);
    output.push(lines[index]);
    previous = index;
  }
  if (previous < lines.length - 1)
    output.push(`[compressed log output: omitted ${lines.length - previous - 1} lines]`);
  return output.join("\n");
}
function compactDiff(text, config) {
  if (!DIFF_HUNK_RE.test(text)) return null;
  const lines = text.split(/\r?\n/);
  const output = [];
  let changedSinceContext = 0;
  for (const line of lines) {
    const changed = line.startsWith("+") || line.startsWith("-") || line.startsWith("@@");
    if (changed) {
      output.push(line);
      changedSinceContext = 0;
    } else if (changedSinceContext < 2) {
      output.push(line);
      changedSinceContext++;
    }
  }
  return output.length < lines.length && output.length <= config.maxLines * 4 ? output.join("\n") : null;
}
function compactSearch(text, config) {
  const lines = text.split(/\r?\n/);
  const matches = lines.filter((line) => SEARCH_LINE_RE.test(line));
  if (matches.length < config.minSearchMatches) return null;
  const grouped = /* @__PURE__ */ new Map();
  for (const line of matches) {
    const path12 = line.trim().split(/:\d/)[0].split(/-\d/)[0];
    const group = grouped.get(path12) ?? [];
    if (group.length < 3) group.push(line.trim());
    grouped.set(path12, group);
  }
  const output = [...grouped.entries()].map(([path12, entries]) => [path12, ...entries].join("\n")).join("\n");
  return output.length < text.length ? output : null;
}
function candidateRewrite(text, config) {
  if (Buffer.byteLength(text, "utf8") < config.minBytes) return null;
  if (Buffer.byteLength(text, "utf8") > config.maxCandidateBytes) return null;
  const json = minifyJson(text);
  const diff = compactDiff(text, config);
  const search = compactSearch(text, config);
  const log = collapseLines(text, config);
  return [json, diff, search, log].filter((value) => typeof value === "string").sort((a, b) => Buffer.byteLength(a) - Buffer.byteLength(b))[0] ?? null;
}
function rewriteText(value, config) {
  if (typeof value !== "string") return null;
  if (Buffer.byteLength(value, "utf8") > config.maxOutputBytes) return null;
  const rewritten = candidateRewrite(value, config);
  if (!rewritten || Buffer.byteLength(rewritten) >= Buffer.byteLength(value)) return null;
  if (countCodexTokens(rewritten) >= countCodexTokens(value)) {
    return null;
  }
  return rewritten;
}
function hasLossyRewriteCandidate(text, config) {
  if (typeof text !== "string") return false;
  return compactDiff(text, config) !== null || compactSearch(text, config) !== null || collapseLines(text, config) !== null;
}
function protectedByConfig(meta) {
  return !SUPPORTED_TYPES.has(meta.type) || !meta.eligible;
}
var codexResponsesEngine = {
  id: ENGINE_ID8,
  name: "Responses Tool Output",
  description: "Conservative lossless-first compression for supported Responses tool outputs.",
  icon: "data_object",
  targets: ["tool_results"],
  stackable: true,
  stackPriority: 12,
  metadata: {
    id: ENGINE_ID8,
    name: "Responses Tool Output",
    description: "Compresses eligible shell, patch, search, build, and JSON outputs.",
    inputScope: "tool-results",
    targetLatencyMs: 5,
    supportsPreview: true,
    stable: true
  },
  apply(body, options) {
    const config = mergeConfig(options);
    if (!config.enabled || !Array.isArray(body.messages)) {
      return { body, compressed: false, stats: null };
    }
    let changed = false;
    const messages = body.messages.map((raw) => {
      if (!isRecord7(raw) || raw.role !== "tool") return raw;
      const meta = raw[CODEX_RESPONSE_ITEM_META];
      if (!meta || typeof meta.type !== "string" || meta.eligible !== true) return raw;
      const typeMeta = { type: meta.type, eligible: true };
      if (protectedByConfig(typeMeta)) return raw;
      if (meta.type === "local_shell_call_output" && hasLossyRewriteCandidate(raw.content, config)) {
        return raw;
      }
      const next = rewriteText(raw.content, config);
      if (next === null) return raw;
      changed = true;
      return { ...raw, content: next };
    });
    if (!changed) return { body, compressed: false, stats: null };
    const nextBody = { ...body, messages };
    const stats = createCompressionStats(body, nextBody, "codex-responses", [ENGINE_ID8]);
    const originalTokens = countCodexTokens(JSON.stringify(body));
    const compressedTokens = countCodexTokens(JSON.stringify(nextBody));
    stats.originalTokens = originalTokens;
    stats.compressedTokens = compressedTokens;
    stats.savingsPercent = originalTokens > 0 ? Math.round((originalTokens - compressedTokens) / originalTokens * 1e4) / 100 : 0;
    return { body: nextBody, compressed: stats.compressedTokens < stats.originalTokens, stats };
  },
  compress(body, config) {
    return this.apply(body, { stepConfig: config });
  },
  getConfigSchema() {
    return CODEX_SCHEMA;
  },
  validateConfig(config) {
    const errors = [];
    for (const [key, min, max] of [
      ["minBytes", 0, 2e6],
      ["maxOutputBytes", 1, 1e7],
      ["maxCandidateBytes", 1, 2e6],
      ["maxLines", 1, 1e4],
      ["minSearchMatches", 2, 1e4],
      ["minLogLines", 2, 1e4]
    ]) {
      if (config[key] !== void 0 && (typeof config[key] !== "number" || config[key] < min || config[key] > max)) {
        errors.push(`${key} must be between ${min} and ${max}`);
      }
    }
    if (config.enabled !== void 0 && typeof config.enabled !== "boolean")
      errors.push("enabled must be boolean");
    return { valid: errors.length === 0, errors };
  }
};

// open-sse/services/compression/engines/index.ts
var registered = false;
function registerBuiltinCompressionEngines() {
  if (registered && getCompressionEngine(liteEngine.id)) return;
  registered = true;
  if (!getCompressionEngine(liteEngine.id)) registerCompressionEngine(liteEngine);
  const engines = [
    { id: "caveman", engine: cavemanEngine },
    { id: "aggressive", engine: aggressiveEngine },
    { id: "ultra", engine: ultraEngine },
    { id: "rtk", engine: rtkEngine },
    { id: "codex-responses", engine: codexResponsesEngine },
    { id: "session-dedup", engine: sessionDedupEngine },
    { id: "headroom", engine: headroomEngine },
    { id: "ccr", engine: ccrEngine },
    { id: "llmlingua", engine: llmlinguaEngine },
    { id: "ionizer", engine: ionizerEngine },
    { id: "relevance", engine: relevanceEngine },
    { id: "llm", engine: llmCompressorEngine },
    { id: "read-lifecycle", engine: readLifecycleEngine },
    { id: "omniglyph", engine: omniglyphEngine }
  ];
  for (const { id, engine } of engines) {
    if (!getCompressionEngine(id)) registerCompressionEngine(engine);
  }
}

// open-sse/utils/cacheControlPolicy.ts
var CACHING_PROVIDERS = /* @__PURE__ */ new Set([
  "claude",
  "anthropic",
  "zai",
  "deepseek",
  // Kimi Code's OpenAI protocol requires prompt_cache_key for Coding Plan
  // cache affinity. The OAuth card and hidden API-key compatibility ID share
  // the same upstream API.
  "kimi-coding",
  "kimi-coding-apikey",
  // #3088 — Xiaomi MiMo honors OpenAI-format cache_control breakpoints. Without
  // this entry, shouldPreserveCacheControl() returns false for Claude Code
  // clients and filterToOpenAIFormat() strips cache_control, so Xiaomi never
  // sees the cache hints and every request is a cache miss.
  "xiaomi-mimo",
  // #3955 — OpenAI / Codex / Azure-OpenAI use AUTOMATIC prefix caching: the longest
  // matching prefix of a request is cached upstream WITHOUT any explicit cache_control
  // markers. They must count as caching providers so the cache-aware compression guard
  // preserves the cacheable prefix (system prompt / earliest messages) instead of
  // rewriting it and forcing a cache miss. This also activates the intended
  // `prompt_cache_key` cache-routing hint for OpenAI in chatCore.
  "openai",
  "codex",
  "azure",
  // #2069 — DashScope's OpenAI-compatible endpoints (Alibaba Model Studio and
  // Qwen Cloud pay-as-you-go, upstream "alicode"/"alicode-intl") natively honor
  // `cache_control: {type:"ephemeral"}` breakpoints. Without these entries
  // shouldPreserveCacheControl() returns false for Claude Code clients and the
  // OpenAI-format translator strips cache_control, so DashScope never sees the
  // hints and every request is a cache miss.
  "alibaba",
  "alibaba-cn",
  "qwen-cloud"
]);
function providerSupportsCaching(provider, targetFormat, connectionCacheOverride) {
  if (typeof connectionCacheOverride?.supportsPromptCaching === "boolean") {
    return connectionCacheOverride.supportsPromptCaching;
  }
  if (!provider) return false;
  if (CACHING_PROVIDERS.has(provider.toLowerCase())) return true;
  if (targetFormat === "claude") return true;
  return false;
}

// open-sse/services/compression/cachingAware.ts
function isRecord8(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function normalizeString(value) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}
function inferProviderFromModel(model) {
  const normalized = normalizeString(model);
  if (!normalized) return null;
  const slashIndex = normalized.indexOf("/");
  if (slashIndex <= 0) return null;
  return normalized.slice(0, slashIndex).toLowerCase();
}
function hasOwnCacheControl(value) {
  return isRecord8(value) && value.cache_control !== void 0 && value.cache_control !== null;
}
function arrayHasCacheControl(values) {
  return Array.isArray(values) && values.some((value) => hasCacheControl(value));
}
function hasCacheControl(value) {
  if (hasOwnCacheControl(value)) return true;
  if (Array.isArray(value)) return value.some((item) => hasCacheControl(item));
  if (!isRecord8(value)) return false;
  if (arrayHasCacheControl(value.system)) return true;
  if (arrayHasCacheControl(value.tools)) return true;
  if (arrayHasCacheControl(value.messages)) return true;
  if (arrayHasCacheControl(value.input)) return true;
  if (arrayHasCacheControl(value.contents)) return true;
  if (isRecord8(value.request) && arrayHasCacheControl(value.request.contents)) return true;
  if (isRecord8(value.content) || Array.isArray(value.content)) {
    return hasCacheControl(value.content);
  }
  return false;
}
function detectCachingContext(body, context = {}) {
  const bodyRecord = isRecord8(body) ? body : {};
  const provider = normalizeString(context.provider)?.toLowerCase() ?? inferProviderFromModel(context.model) ?? inferProviderFromModel(bodyRecord.model);
  const targetFormat = normalizeString(context.targetFormat)?.toLowerCase() ?? null;
  return {
    hasCacheControl: hasCacheControl(body),
    provider,
    targetFormat,
    isCachingProvider: providerSupportsCaching(provider, targetFormat, context.connectionCacheOverride)
  };
}

// open-sse/services/compression/deriveDefaultPlan.ts
var SINGLE_MODE_OF = {
  lite: "lite",
  caveman: "standard",
  aggressive: "aggressive",
  ultra: "ultra",
  rtk: "rtk",
  "codex-responses": "codex-responses",
  omniglyph: "omniglyph"
};
function deriveDefaultPlan(engines, masterEnabled) {
  if (!masterEnabled) return { mode: "off", stackedPipeline: [] };
  const onIds = Object.keys(ENGINE_CATALOG).filter((id) => engines[id]?.enabled === true);
  if (onIds.length === 0) return { mode: "off", stackedPipeline: [] };
  if (onIds.length === 1 && engineMeta(onIds[0]).isSingleMode) {
    return { mode: SINGLE_MODE_OF[onIds[0]], stackedPipeline: [] };
  }
  const ordered = onIds.sort((a, b) => engineMeta(a).stackPriority - engineMeta(b).stackPriority);
  const stackedPipeline = ordered.map((id) => {
    const level = engines[id]?.level;
    return level ? { engine: id, intensity: level } : { engine: id };
  });
  return { mode: "stacked", stackedPipeline };
}

// open-sse/services/compression/riskGate/riskPatterns.ts
var MAX_PEM_LEN = 4096;
var RISK_PATTERNS = [
  {
    category: "private_key",
    regex: new RegExp(
      `-----BEGIN [A-Z0-9 ]{0,40}PRIVATE KEY-----[\\s\\S]{1,${MAX_PEM_LEN}}?-----END [A-Z0-9 ]{0,40}PRIVATE KEY-----`,
      "g"
    )
  },
  {
    category: "secret_assignment",
    regex: /\b(?:api[_-]?key|secret|token|password|passwd|bearer|authorization|client[_-]?secret)\b[ \t]{0,20}[:=][ \t]{0,20}["']?[A-Za-z0-9._\-+/]{8,200}/gi
  },
  {
    category: "stack_trace",
    regex: /^\s{0,8}(?:at\s+\S.{0,300}|File ".{1,300}", line \d{1,9}|Traceback \(most recent call last\):|[A-Za-z_.]{1,80}(?:Error|Exception):.{0,300})$/gm
  },
  {
    // Single DDL hit; the ">=2 DDL" promotion rule is enforced in riskGate.ts.
    category: "db_migration",
    regex: /\b(?:CREATE|ALTER|DROP)\s+(?:TABLE|INDEX|SCHEMA|DATABASE|COLUMN)\b/gi
  },
  {
    category: "legal",
    regex: /\bWITHOUT WARRANTY\b|\bPermission is hereby granted\b|^SPDX-License-Identifier:.{0,200}$|\bCopyright \(c\)\b|\bAll rights reserved\b/gim
  }
];

// open-sse/services/compression/riskGate/riskGate.ts
var SHORT_SECTION = 200;
var MIN_DDL = 2;
var VCS_LINE = /^(?:commit [0-9a-f]{7,40}|diff --git |@@ |[+-]{3} )/m;
var DIFF_HUNK_LINE = /^[+-]/;
function isLikelyVcsContext(text) {
  return VCS_LINE.test(text);
}
function collectRegexHits(text, enabled) {
  const hits = [];
  for (const { category, regex } of RISK_PATTERNS) {
    if (!enabled.has(category)) continue;
    regex.lastIndex = 0;
    let m;
    while ((m = regex.exec(text)) !== null) {
      if (m[0].length === 0) {
        regex.lastIndex++;
        continue;
      }
      hits.push({ start: m.index, end: m.index + m[0].length, category });
    }
  }
  return hits;
}
function inDiffHunk(text, start) {
  const lineStart = text.lastIndexOf("\n", start - 1) + 1;
  return DIFF_HUNK_LINE.test(text.slice(lineStart, lineStart + 1));
}
function detectK8sSecret(text) {
  const hits = [];
  const kindRe = /^kind:[ \t]*Secret\b/gm;
  let m;
  while ((m = kindRe.exec(text)) !== null) {
    const prevSep = text.lastIndexOf("\n---", m.index);
    const docStart = prevSep === -1 ? 0 : prevSep + 1;
    const nextSep = text.indexOf("\n---", m.index);
    const docEnd = nextSep === -1 ? text.length : nextSep + 1;
    const doc = text.slice(docStart, docEnd);
    if (/^\s*(?:data|stringData):/m.test(doc)) {
      hits.push({ start: docStart, end: docEnd, category: "k8s_secret" });
    }
  }
  return hits;
}
function mergeSpans(spans) {
  if (spans.length <= 1) return spans;
  const sorted = [...spans].sort((a, b) => a.start - b.start);
  const out = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const last = out[out.length - 1];
    const cur = sorted[i];
    if (cur.start <= last.end) {
      last.end = Math.max(last.end, cur.end);
    } else {
      out.push(cur);
    }
  }
  return out;
}
function detectRiskSpans(text, cfg) {
  try {
    if (!cfg.enabled) return [];
    if (!text) return [];
    const enabled = new Set(
      cfg.categories?.length ? cfg.categories : ["stack_trace", "private_key", "secret_assignment", "k8s_secret", "db_migration", "legal"]
    );
    const vcs = isLikelyVcsContext(text);
    const regexHits = collectRegexHits(text, enabled);
    const k8sHits = enabled.has("k8s_secret") ? detectK8sSecret(text) : [];
    const ddl = regexHits.filter((h) => h.category === "db_migration" && !(vcs && inDiffHunk(text, h.start)));
    const ddlPromoted = ddl.length >= MIN_DDL ? [{ start: ddl[0].start, end: ddl[ddl.length - 1].end, category: "db_migration" }] : [];
    const guarded = regexHits.filter(
      (h) => h.category === "secret_assignment" || h.category === "stack_trace" || h.category === "legal"
    );
    const selfEvident = regexHits.filter((h) => h.category === "private_key");
    const signalCount = selfEvident.length + (ddlPromoted.length ? 1 : 0) + k8sHits.length + guarded.length;
    const shortSection = !vcs && text.length < SHORT_SECTION;
    const guardedPromoted = signalCount >= 2 || shortSection ? guarded : [];
    const promoted = [
      ...selfEvident.map((h) => ({ start: h.start, end: h.end, category: h.category })),
      ...k8sHits.map((h) => ({ start: h.start, end: h.end, category: h.category })),
      ...ddlPromoted,
      ...guardedPromoted.map((h) => ({ start: h.start, end: h.end, category: h.category }))
    ];
    return mergeSpans(promoted);
  } catch {
    return [];
  }
}

// open-sse/services/compression/riskGate/riskGateStep.ts
function maskString(text, cfg, tally) {
  const spans = detectRiskSpans(text, cfg);
  if (!spans.length) return { masked: text, blocks: [] };
  for (const s of spans) tally[s.category] = (tally[s.category] ?? 0) + 1;
  const { text: masked, blocks } = preserveSpans(
    text,
    spans.map((s) => ({ start: s.start, end: s.end, kind: `risk_${s.category}` }))
  );
  return { masked, blocks };
}
function applyRiskMask(body, cfg) {
  const tally = {};
  const allBlocks = [];
  const messages = body.messages;
  if (!Array.isArray(messages)) {
    return { maskedBody: body, blocks: [], stats: { spansProtected: 0, categories: {} } };
  }
  let changed = false;
  const maskedMessages = messages.map((msg) => {
    const m = msg;
    if (typeof m.content === "string") {
      const { masked, blocks } = maskString(m.content, cfg, tally);
      if (!blocks.length) return msg;
      changed = true;
      allBlocks.push(...blocks);
      return { ...m, content: masked };
    }
    if (Array.isArray(m.content)) {
      let partChanged = false;
      const parts = m.content.map((p) => {
        if (p && p.type === "text" && typeof p.text === "string") {
          const { masked, blocks } = maskString(p.text, cfg, tally);
          if (!blocks.length) return p;
          partChanged = true;
          allBlocks.push(...blocks);
          return { ...p, text: masked };
        }
        return p;
      });
      if (!partChanged) return msg;
      changed = true;
      return { ...m, content: parts };
    }
    return msg;
  });
  const maskedBody = changed ? { ...body, messages: maskedMessages } : body;
  return {
    maskedBody,
    blocks: allBlocks,
    stats: { spansProtected: allBlocks.length, categories: tally }
  };
}
function restoreRiskBlocks(body, blocks) {
  if (!blocks.length) return body;
  const messages = body.messages;
  if (!Array.isArray(messages)) return body;
  const restoreParts = (content) => {
    if (typeof content === "string") return restorePreservedBlocks(content, blocks);
    if (Array.isArray(content)) {
      return content.map(
        (p) => p && p.type === "text" && typeof p.text === "string" ? { ...p, text: restorePreservedBlocks(p.text, blocks) } : p
      );
    }
    return content;
  };
  return {
    ...body,
    messages: messages.map((msg) => {
      const m = msg;
      if (typeof m.content === "string" || Array.isArray(m.content)) {
        return { ...m, content: restoreParts(m.content) };
      }
      return msg;
    })
  };
}

// open-sse/services/compression/riskGate/strategyWrap.ts
function resolveRiskGate(options) {
  const rg = options?.riskGate ?? options?.config?.riskGate;
  return rg?.enabled ? rg : void 0;
}
function attach(result, mask) {
  if (mask.blocks.length) result.body = restoreRiskBlocks(result.body, mask.blocks);
  if (result.stats) result.stats.riskGate = mask.stats;
  return result;
}
function withRiskGate(body, riskGate, run) {
  if (!riskGate) return run(body);
  const mask = applyRiskMask(body, riskGate);
  return attach(run(mask.maskedBody), mask);
}

// open-sse/services/compression/quantumLock/quantumPatterns.ts
var TAIL_DELIM = "\u27E6QUANTUMLOCK\u27E7";
var placeholderFor = (i) => `\u27E6Q${i}\u27E7`;
var QUANTUM_PATTERNS = [
  // JWTs start with base64url of `{"` → "eyJ". Run first so the whole token wins.
  // Trailing negative-lookahead (not \b): a JWT signature can END in base64url `-`/`_`,
  // where \b would misfire (it needs a following word char) and let the token escape detection.
  {
    category: "jwt",
    pattern: /\beyJ[A-Za-z0-9_-]{8,512}\.[A-Za-z0-9_-]{8,512}\.[A-Za-z0-9_-]{8,512}(?![A-Za-z0-9_-])/g
  },
  // Prefixed API keys (stripe/github/slack shapes).
  {
    category: "api_key_shape",
    pattern: /\b(?:sk|pk|rk|ghp|gho|xox[baprs])[-_][A-Za-z0-9]{16,200}\b/g
  },
  // Bearer tokens. Bounded whitespace ([ \t]{1,4}) per the file convention (no unbounded \s+).
  {
    category: "api_key_shape",
    pattern: /\bBearer[ \t]{1,4}[A-Za-z0-9._-]{16,400}\b/g
  },
  // Canonical UUID. Runs before long_hex so its inner hex is not re-claimed.
  {
    category: "uuid",
    pattern: /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi
  },
  // Correlation / request ids.
  {
    category: "request_id",
    pattern: /\b(?:req|trace|span|corr|request)[-_][A-Za-z0-9]{6,128}\b/gi
  },
  // Digests / SHAs. After uuid/jwt so it never eats their inner hex.
  { category: "long_hex", pattern: /\b[0-9a-f]{16,128}\b/gi },
  // 10- or 13-digit unix epoch in the 2001–2033 window (leading 1). LAST so it never
  // fragments a longer token already claimed above.
  { category: "unix_ts", pattern: /\b1[0-9]{9}(?:[0-9]{3})?\b/g }
];

// open-sse/services/compression/quantumLock/quantumLock.ts
function detectVolatileSpans(text, cfg) {
  if (!text) return [];
  const allow = cfg.categories && cfg.categories.length > 0 ? new Set(cfg.categories) : null;
  const raw = [];
  try {
    QUANTUM_PATTERNS.forEach(({ category, pattern }, prio) => {
      if (allow && !allow.has(category)) return;
      pattern.lastIndex = 0;
      let m;
      while ((m = pattern.exec(text)) !== null) {
        if (m[0].length === 0) {
          pattern.lastIndex++;
          continue;
        }
        raw.push({ start: m.index, end: m.index + m[0].length, category, prio });
      }
    });
  } catch {
    return [];
  }
  raw.sort((a, b) => a.start - b.start || b.end - a.end || a.prio - b.prio);
  const merged = [];
  let lastEnd = -1;
  for (const s of raw) {
    if (s.start >= lastEnd) {
      merged.push({ start: s.start, end: s.end, category: s.category });
      lastEnd = s.end;
    }
  }
  return merged;
}

// open-sse/services/compression/quantumLock/quantumLockStep.ts
var emptyStats = () => ({ fragments: 0, categories: {} });
function isRecord9(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}
function systemTextOf(msg) {
  return typeof msg.content === "string" ? msg.content : "";
}
function applyQuantumLock(body, cfg, _ctx) {
  const messages = body.messages;
  if (!Array.isArray(messages)) return { body, stats: emptyStats() };
  const idx = messages.findIndex((m) => isRecord9(m) && m.role === "system");
  if (idx === -1) return { body, stats: emptyStats() };
  const sys = messages[idx];
  const text = systemTextOf(sys);
  if (!text) return { body, stats: emptyStats() };
  if (text.includes(TAIL_DELIM)) return { body, stats: emptyStats() };
  const spans = detectVolatileSpans(text, cfg);
  if (spans.length === 0) return { body, stats: emptyStats() };
  let out = "";
  let cursor = 0;
  const values = [];
  const categories = {};
  spans.forEach((span, i) => {
    out += text.slice(cursor, span.start) + placeholderFor(i);
    values.push(text.slice(span.start, span.end));
    categories[span.category] = (categories[span.category] ?? 0) + 1;
    cursor = span.end;
  });
  out += text.slice(cursor);
  const tail = `

${TAIL_DELIM}
${values.map((v, i) => `${placeholderFor(i)}=${v}`).join("\n")}`;
  const newMessages = messages.slice();
  newMessages[idx] = { ...sys, content: out + tail };
  return {
    body: { ...body, messages: newMessages },
    stats: { fragments: values.length, categories }
  };
}

// open-sse/services/compression/quantumLock/strategyWrap.ts
function resolveQuantumLock(options) {
  const ql = options?.config?.quantumLock;
  return ql?.enabled ? ql : void 0;
}
function quantumCachingContext(body, options) {
  const ctx = detectCachingContext(body, options?.cachingContext ?? { model: options?.model });
  return { isCachingProvider: ctx.isCachingProvider };
}
function attachQuantumLockStats(result, qlStats) {
  if (result.stats) {
    result.stats.quantumLock = qlStats;
    return result;
  }
  const carrier = {
    originalTokens: 0,
    compressedTokens: 0,
    savingsPercent: 0,
    techniquesUsed: ["quantum-lock"],
    mode: "off",
    timestamp: Date.now(),
    quantumLock: qlStats
  };
  return { ...result, stats: carrier };
}
function withQuantumLock(body, ql, ctx, run) {
  if (!ql || !ctx.isCachingProvider) return run(body);
  const { body: locked, stats } = applyQuantumLock(body, ql, ctx);
  const result = run(locked);
  if (stats.fragments > 0) return attachQuantumLockStats(result, stats);
  return result;
}

// open-sse/services/compression/entrypointWrap.ts
function withCompressionEntrypointGuards(body, options, run) {
  return withQuantumLock(
    body,
    resolveQuantumLock(options),
    quantumCachingContext(body, options),
    (quantumBody) => withRiskGate(quantumBody, resolveRiskGate(options), (riskBody) => run(riskBody))
  );
}

// open-sse/services/compression/resultMemo.ts
import crypto7 from "node:crypto";
var MEMO_CAP = 5e3;
var memoMap = /* @__PURE__ */ new Map();
var DETERMINISTIC_ENGINES = /* @__PURE__ */ new Set(["lite", "caveman", "rtk"]);
var DETERMINISTIC_MODES = /* @__PURE__ */ new Set(["lite", "standard", "rtk"]);
function isDeterministicMode(mode, config) {
  if (mode === "stacked") {
    const pipeline = config?.stackedPipeline;
    if (!pipeline || pipeline.length === 0) return false;
    return pipeline.every((step) => DETERMINISTIC_ENGINES.has(step.engine));
  }
  return DETERMINISTIC_MODES.has(mode);
}
function sha256hex(text) {
  return crypto7.createHash("sha256").update(text).digest("hex");
}
function makeMemoKey(body, mode, config, principalId, model, supportsVision) {
  const bodyHash = sha256hex(JSON.stringify(body));
  const isVisionDependent = usesVisionDependentEngine(mode, config);
  return sha256hex(
    JSON.stringify({
      bodyHash,
      mode,
      config,
      principalId: principalId ?? null,
      model: isVisionDependent ? model ?? null : null,
      supportsVision: isVisionDependent ? supportsVision ?? null : null
    })
  );
}
function usesVisionDependentEngine(mode, config) {
  if (mode === "lite") return true;
  if (mode === "standard") return true;
  if (mode === "stacked") {
    const pipeline = config?.stackedPipeline;
    if (!pipeline || pipeline.length === 0) return false;
    return pipeline.some((step) => step.engine === "lite");
  }
  return false;
}
function boundedSet(key, value) {
  if (!memoMap.has(key) && memoMap.size >= MEMO_CAP) {
    const firstKey = memoMap.keys().next().value;
    if (firstKey !== void 0) {
      memoMap.delete(firstKey);
    }
  }
  memoMap.set(key, value);
}
function memoLookup(key) {
  const hit = memoMap.get(key);
  if (!hit) return null;
  return JSON.parse(JSON.stringify(hit));
}
function memoStore(key, result) {
  boundedSet(key, JSON.parse(JSON.stringify(result)));
}

// open-sse/services/compression/strategySelector.ts
function applyCompression(body, mode, options) {
  return withCompressionEntrypointGuards(body, options, (b) => runCompression(b, mode, options));
}
function runCompression(body, mode, options) {
  if (mode === "off") {
    return { body, compressed: false, stats: null };
  }
  if (options?.config?.memoizeCompressionResults === true && // Only memoize for an explicit principal — a missing principalId would collapse
  // authenticated callers into the shared anonymous (null) key space and let one
  // principal receive another's cached body. No principal ⇒ skip the cache.
  typeof options?.principalId === "string" && options.principalId.length > 0 && isDeterministicMode(mode, options.config)) {
    const key = makeMemoKey(
      body,
      mode,
      options.config,
      options.principalId,
      options.model,
      options.supportsVision
    );
    const hit = memoLookup(key);
    if (hit) return hit;
    const result = runCompression({ ...body }, mode, {
      ...options,
      config: { ...options.config, memoizeCompressionResults: false }
    });
    memoStore(key, result);
    return memoLookup(key);
  }
  if (mode === "rtk") {
    return applyRtkCompression(body, {
      // Selecting the "rtk" mode IS the enable signal — run it even if the per-engine
      // rtkConfig.enabled flag is off (that flag gates stacked steps). (B-MODE-ENGINE-DECOUPLE)
      config: { ...options?.config?.rtkConfig ?? {}, enabled: true }
    });
  }
  if (mode === "codex-responses") {
    const adapter2 = adaptBodyForCompression(
      body,
      options?.config?.codexResponsesConfig?.preserveToolNames
    );
    const result = codexResponsesEngine.apply(adapter2.body, {
      ...options,
      config: options?.config,
      stepConfig: { enabled: true }
    });
    return adapter2.adapted ? { ...result, body: adapter2.restore(result.body) } : result;
  }
  if (mode === "omniglyph") {
    return { body, compressed: false, stats: null };
  }
  const adapter = adaptBodyForCompression(
    body,
    options?.config?.codexResponsesConfig?.preserveToolNames
  );
  const compressionBody = adapter.body;
  if (mode === "lite") {
    const result = applyLiteCompression(compressionBody, {
      ...options,
      preserveSystemPrompt: options?.config?.preserveSystemPrompt !== false,
      ...options?.config?.lite
    });
    return adapter.adapted ? { ...result, body: adapter.restore(result.body) } : result;
  }
  if (mode === "stacked") {
    const result = applyStackedCompression(
      compressionBody,
      options?.config?.stackedPipeline,
      options
    );
    return adapter.adapted ? { ...result, body: adapter.restore(result.body) } : result;
  }
  if (mode === "standard") {
    const cavemanConfig = {
      ...options?.config?.cavemanConfig ?? {},
      ...options?.config?.languageConfig?.enabled ? {
        language: options.config.languageConfig.defaultLanguage,
        autoDetectLanguage: options.config.languageConfig.autoDetect,
        enabledLanguagePacks: options.config.languageConfig.enabledPacks
      } : {},
      ...options?.config?.preserveSystemPrompt !== false ? {
        compressRoles: (options?.config?.cavemanConfig?.compressRoles ?? ["user"]).filter(
          (role) => role !== "system"
        )
      } : {},
      // Selecting the "standard" mode runs caveman regardless of the per-engine
      // cavemanConfig.enabled flag (that flag gates stacked steps). (B-MODE-ENGINE-DECOUPLE)
      enabled: true
    };
    const result = cavemanCompress(
      compressionBody,
      cavemanConfig
    );
    return adapter.adapted ? { ...result, body: adapter.restore(result.body) } : result;
  }
  if (mode === "aggressive") {
    const messages = compressionBody.messages ?? [];
    if (!Array.isArray(messages) || messages.length === 0) {
      return { body, compressed: false, stats: null };
    }
    const aggressiveConfig = {
      ...options?.config?.aggressive ?? {},
      preserveSystemPrompt: options?.config?.preserveSystemPrompt !== false
    };
    const result = compressAggressive(messages, aggressiveConfig);
    const compressedBody = { ...compressionBody, messages: result.messages };
    return {
      body: adapter.restore(compressedBody),
      compressed: result.stats.savingsPercent > 0,
      stats: createCompressionStats(
        compressionBody,
        compressedBody,
        mode,
        ["aggressive"],
        result.stats.rulesApplied,
        result.stats.durationMs
      )
    };
  }
  if (mode === "ultra") {
    const messages = compressionBody.messages ?? [];
    if (!Array.isArray(messages) || messages.length === 0) {
      return { body, compressed: false, stats: null };
    }
    const ultraConfig = {
      ...options?.config?.ultra ?? {},
      preserveSystemPrompt: options?.config?.preserveSystemPrompt !== false
    };
    const result = ultraCompressHeuristic(messages, ultraConfig);
    const compressedBody = { ...compressionBody, messages: result.messages };
    return {
      body: adapter.restore(compressedBody),
      compressed: result.stats.savingsPercent > 0,
      stats: {
        ...createCompressionStats(
          compressionBody,
          compressedBody,
          mode,
          ["ultra"],
          result.stats.rulesApplied,
          result.stats.durationMs
        ),
        ultraTier: result.stats.ultraTier
      }
    };
  }
  return { body, compressed: false, stats: null };
}
function normalizePipelineStep(step) {
  if (typeof step !== "string") return step;
  if (step === "standard") return { engine: "caveman" };
  if (step === "rtk" || step === "codex-responses") return { engine: step };
  if (step === "lite" || step === "aggressive" || step === "ultra") return { engine: step };
  return { engine: "caveman" };
}
function reportEngineStep(onStep, stepIndex, totalSteps, engine, result) {
  if (!onStep) return;
  const s = result.stats;
  onStep({
    stepIndex,
    totalSteps,
    engine,
    state: result.compressed ? "done" : "skipped",
    originalTokens: s?.originalTokens ?? 0,
    compressedTokens: s?.compressedTokens ?? s?.originalTokens ?? 0,
    savingsPercent: s?.savingsPercent ?? 0,
    ...s?.durationMs !== void 0 ? { durationMs: s.durationMs } : {}
  });
}
function resolveStackSteps(pipeline, config) {
  if (pipeline && pipeline.length > 0) return pipeline.map(normalizePipelineStep);
  const engines = config?.engines;
  if (engines && Object.values(engines).some((e) => e?.enabled === true)) {
    const derived = deriveDefaultPlan(engines, true);
    if (derived.mode === "stacked" && derived.stackedPipeline.length > 0) {
      return derived.stackedPipeline;
    }
  }
  return [
    { engine: "rtk", intensity: "standard" },
    { engine: "caveman", intensity: "full" }
  ];
}
function buildStepOptions(step, options) {
  const stepConfig = {
    ...resolveStepDetailConfig(step.engine, options?.config),
    ...step.config ?? {},
    ...step.intensity ? { intensity: step.intensity } : {}
  };
  if (step.engine === "codex-responses" && stepConfig.enabled === void 0) {
    stepConfig.enabled = true;
  }
  return {
    ...options,
    compressionComboId: options?.compressionComboId ?? options?.config?.compressionComboId,
    principalId: options?.principalId,
    stepConfig
  };
}
function canRunAtCompressionStage(engine, stage) {
  const effectiveStage = stage ?? "pre-translation";
  const stages = engine.metadata?.executionStages;
  return stages ? stages.includes(effectiveStage) : effectiveStage === "pre-translation";
}
function finalizeStackedResult(originalBody, currentBody, compressed, acc, start, compressionComboId) {
  const stats = createCompressionStats(
    originalBody,
    currentBody,
    "stacked",
    Array.from(acc.techniques),
    acc.rules.size > 0 ? Array.from(acc.rules) : void 0,
    Math.round((performance.now() - start) * 100) / 100
  );
  stats.engine = "stacked";
  stats.compressionComboId = compressionComboId ?? null;
  stats.engineBreakdown = acc.breakdown;
  if (acc.validationWarnings.size > 0) {
    stats.validationWarnings = Array.from(acc.validationWarnings);
  }
  if (acc.validationErrors.size > 0) {
    stats.validationErrors = Array.from(acc.validationErrors);
  }
  if (acc.fallbackApplied) {
    stats.fallbackApplied = true;
  }
  if (acc.rtkRawOutputPointers.length > 0) {
    const seenPointers = /* @__PURE__ */ new Set();
    stats.rtkRawOutputPointers = acc.rtkRawOutputPointers.filter((pointer) => {
      if (seenPointers.has(pointer.id)) return false;
      seenPointers.add(pointer.id);
      return true;
    });
  }
  return applyStackedInflationGuard(originalBody, currentBody, compressed, stats);
}
function recordStepFailure(acc, engineId, err, ctx) {
  if (ctx.breakerOn) recordEngineFailure(engineId, ctx.breaker);
  acc.validationErrors.add(
    `${engineId}: bailed out \u2014 ${err instanceof Error ? err.message : String(err)}`
  );
  acc.fallbackApplied = true;
}
function commitStepResult(acc, step, result, currentBody, ctx) {
  if (ctx.breakerOn) recordEngineSuccess(step.engine, ctx.breaker);
  mergeStackStep(acc, step.engine, result);
  const advance = ctx.bailout?.enabled ? decideStep(result, ctx.bailout).advance : result.compressed;
  if (advance && gateAdvance(result, currentBody, ctx.fidelityGate, acc, step.engine)) {
    return { body: result.body, advanced: true };
  }
  return { body: currentBody, advanced: false };
}
function applyStackedCompression(body, pipeline, options) {
  return withRiskGate(
    body,
    resolveRiskGate(options),
    (b) => runStackedCompression(b, pipeline, options)
  );
}
function runStackedCompression(body, pipeline, options) {
  const steps = resolveStackSteps(pipeline, options?.config);
  registerBuiltinCompressionEngines();
  let currentBody = body;
  let compressed = false;
  const acc = createStackAccumulator();
  const start = performance.now();
  const bailout = options?.bailout;
  const breaker = resolvePipelineBreakerConfig(
    options?.circuitBreaker ?? options?.config?.pipelineCircuitBreaker
  );
  const breakerOn = breaker.enabled;
  const fidelityGate = options?.fidelityGate ?? options?.config?.fidelityGate;
  const onStep = options?.onEngineStep;
  const totalSteps = steps.length;
  let stepIdx = 0;
  for (const step of steps) {
    const engine = getCompressionEngine(step.engine);
    if (!engine) {
      acc.validationErrors.add(`Unknown compression engine: "${step.engine}"`);
      continue;
    }
    if (!canRunAtCompressionStage(engine, options?.compressionStage)) {
      acc.validationWarnings.add(
        `${step.engine}: skipped (stage ${options?.compressionStage ?? "pre-translation"})`
      );
      continue;
    }
    if (getEngineEntry(step.engine)?.enabled === false) {
      acc.validationWarnings.add(`${step.engine}: skipped (engine disabled in registry)`);
      continue;
    }
    if (breakerOn && !canRunEngine(step.engine, breaker)) {
      acc.validationWarnings.add(`${step.engine}: skipped (pipeline circuit-breaker open)`);
      continue;
    }
    const ctx = { bailout, breakerOn, breaker, fidelityGate };
    let result;
    if (bailout?.enabled || breakerOn) {
      try {
        result = engine.apply(currentBody, buildStepOptions(step, options));
      } catch (err) {
        recordStepFailure(acc, step.engine, err, ctx);
        continue;
      }
    } else {
      result = engine.apply(currentBody, buildStepOptions(step, options));
    }
    const committed = commitStepResult(acc, step, result, currentBody, ctx);
    currentBody = committed.body;
    if (committed.advanced) compressed = true;
    if (!bailout?.enabled) reportEngineStep(onStep, stepIdx++, totalSteps, step.engine, result);
  }
  if (options?.config?.targetTokens != null || options?.config?.targetRatio != null) {
    const hbResult = applyHardBudget(currentBody, {
      targetTokens: options.config.targetTokens,
      targetRatio: options.config.targetRatio
    });
    if (hbResult.compressed) {
      mergeStackStep(acc, "hard-budget", hbResult);
      currentBody = hbResult.body;
      compressed = true;
    } else {
      hbResult.stats?.validationWarnings?.forEach((w) => acc.validationWarnings.add(w));
    }
  }
  return finalizeStackedResult(
    body,
    currentBody,
    compressed,
    acc,
    start,
    options?.compressionComboId ?? options?.config?.compressionComboId
  );
}

// open-sse/services/compression/compressionWorker.ts
if (!parentPort) throw new Error("compressionWorker must run in a worker thread");
parentPort.on("message", (job) => {
  try {
    const onEngineStep = (step) => parentPort.postMessage({
      id: job.id,
      type: "step",
      step
    });
    const result = job.mode === "stacked" ? applyStackedCompression(job.body, job.options?.config?.stackedPipeline, {
      ...job.options,
      onEngineStep
    }) : applyCompression(job.body, job.mode, job.options);
    parentPort.postMessage({
      id: job.id,
      type: "result",
      result
    });
  } catch (error) {
    parentPort.postMessage({
      id: job.id,
      type: "error",
      error: error instanceof Error ? error.message : String(error)
    });
  }
});
