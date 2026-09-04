module.exports=[362225,e=>{"use strict";var t=e.i(253395),r=e.i(294733);let n=new Set(["daily","weekly","monthly"]),a=/^(\d{2}):(\d{2})$/,o=new Map;function s(e,t=0){if("number"==typeof e&&Number.isFinite(e))return e;if("string"==typeof e&&e.trim().length>0){let r=Number(e);return Number.isFinite(r)?r:t}return t}function i(e){if(!Array.isArray(e))return[];let t=[];for(let r of e){if(!r||"object"!=typeof r||Array.isArray(r))continue;let e=s(r.cost,NaN),n=s(r.timestamp,NaN);Number.isFinite(e)&&Number.isFinite(n)&&t.push({cost:e,timestamp:n})}return t}function l(e){return e.reduce((e,t)=>e+t.cost,0)}function u(e){if("string"==typeof e){let t=e.trim().match(a);if(t){let e=Math.min(Math.max(parseInt(t[1],10),0),23),r=Math.min(Math.max(parseInt(t[2],10),0),59);return`${String(e).padStart(2,"0")}:${String(r).padStart(2,"0")}`}}return"00:00"}function c(e){let t=s(e,NaN);return Number.isFinite(t)&&t>0?t:null}function d(e,t,r,n,a){return Date.UTC(e,t,r,n,a,0,0)}function p(e,t="00:00",r=Date.now()){let n,o=new Date(r),[s,i]=(n=u(t).match(a))?[parseInt(n[1],10),parseInt(n[2],10)]:[0,0],l=o.getUTCFullYear(),c=o.getUTCMonth(),_=o.getUTCDate();if("weekly"===e){let e=(o.getUTCDay()+6)%7,t=d(l,c,_-e,s,i);return r>=t?{periodStartAt:t,nextResetAt:d(l,c,_-e+7,s,i)}:{periodStartAt:d(l,c,_-e-7,s,i),nextResetAt:t}}if("monthly"===e){let e=d(l,c,1,s,i);return r>=e?{periodStartAt:e,nextResetAt:d(l,c+1,1,s,i)}:{periodStartAt:d(l,c-1,1,s,i),nextResetAt:e}}let E=d(l,c,_,s,i);return r>=E?{periodStartAt:E,nextResetAt:d(l,c,_+1,s,i)}:{periodStartAt:d(l,c,_-1,s,i),nextResetAt:E}}function _(e){return"monthly"===e.resetInterval?e.monthlyLimitUsd>0?e.monthlyLimitUsd:e.dailyLimitUsd:"weekly"===e.resetInterval&&e.weeklyLimitUsd>0?e.weeklyLimitUsd:e.dailyLimitUsd}function E(e,a,d=Date.now(),_={}){let g={dailyLimitUsd:Math.max(0,s(a.dailyLimitUsd)),weeklyLimitUsd:Math.max(0,s(a.weeklyLimitUsd)),monthlyLimitUsd:Math.max(0,s(a.monthlyLimitUsd)),warningThreshold:Math.min(Math.max(s(a.warningThreshold,.8),0),1),resetInterval:function(e){if("string"==typeof e){let t=e.trim().toLowerCase();if(n.has(t))return t}return"daily"}(a.resetInterval),resetTime:u(a.resetTime),budgetResetAt:c(a.budgetResetAt),lastBudgetResetAt:c(a.lastBudgetResetAt),warningEmittedAt:c(a.warningEmittedAt),warningPeriodStart:c(a.warningPeriodStart)},m=p(g.resetInterval,g.resetTime,d),S=null!==g.lastBudgetResetAt&&m.periodStartAt>g.lastBudgetResetAt;if(S&&!1!==_.logReset){let n=function(e,n,a){try{return l(i((0,t.loadCostEntriesInRange)(e,n,a)))+r.spendBatchWriter.getPendingCostTotal(e,n,a)}catch{return 0}}(e,g.lastBudgetResetAt,m.periodStartAt);try{(0,t.saveBudgetResetLog)({apiKeyId:e,resetInterval:g.resetInterval,previousSpend:n,resetAt:m.periodStartAt,nextResetAt:m.nextResetAt,periodStart:m.periodStartAt,periodEnd:m.nextResetAt})}catch{}}let f={...g,budgetResetAt:m.nextResetAt,lastBudgetResetAt:m.periodStartAt,warningEmittedAt:S?null:g.warningEmittedAt,warningPeriodStart:S?null:g.warningPeriodStart};if((g.budgetResetAt!==f.budgetResetAt||g.lastBudgetResetAt!==f.lastBudgetResetAt||g.warningEmittedAt!==f.warningEmittedAt||g.warningPeriodStart!==f.warningPeriodStart||g.dailyLimitUsd!==f.dailyLimitUsd||g.weeklyLimitUsd!==f.weeklyLimitUsd||g.monthlyLimitUsd!==f.monthlyLimitUsd||g.warningThreshold!==f.warningThreshold||g.resetInterval!==f.resetInterval||g.resetTime!==f.resetTime)&&!1!==_.persist)try{(0,t.saveBudget)(e,f)}catch{}return o.set(e,f),f}function g(e){let r=o.get(e);if(r)return E(e,r);try{let r=(0,t.loadBudget)(e);if(r)return E(e,r)}catch{}return null}e.s(["checkBudget",0,function(e,n=0){let a=g(e);if(!a)return{allowed:!0,dailyUsed:0,dailyLimit:0,warningReached:!1,remaining:0,periodUsed:0,activeLimitUsd:0,resetInterval:null,resetTime:null,budgetResetAt:null,lastBudgetResetAt:null,periodStartAt:null};let s=p(a.resetInterval,a.resetTime),i=function(e,n){try{return(0,t.loadCostTotal)(e,n)+r.spendBatchWriter.getPendingCostTotal(e,n)}catch{return 0}}(e,s.periodStartAt),l=i+n,u=_(a),c=u>0&&l>=u*a.warningThreshold,d=Math.max(u-l,0);if(c&&a.warningPeriodStart!==s.periodStartAt){let r={...a,warningEmittedAt:Date.now(),warningPeriodStart:s.periodStartAt};o.set(e,r);try{var E;let n;(0,t.saveBudget)(e,r),E=s.nextResetAt,n=u>0?(l/u*100).toFixed(1):"0.0",console.warn(`[BudgetWarning] ${e} reached ${n}% of ${r.resetInterval} budget ($${l.toFixed(4)} / $${u.toFixed(2)}) — next reset ${new Date(E).toISOString()}`)}catch{}}return u>0&&l>u?{allowed:!1,reason:`${a.resetInterval[0].toUpperCase()}${a.resetInterval.slice(1)} budget exceeded: $${l.toFixed(4)} / $${u.toFixed(2)}`,dailyUsed:i,dailyLimit:u,warningReached:!0,remaining:d,periodUsed:i,activeLimitUsd:u,resetInterval:a.resetInterval,resetTime:a.resetTime,budgetResetAt:s.nextResetAt,lastBudgetResetAt:s.periodStartAt,periodStartAt:s.periodStartAt}:{allowed:!0,dailyUsed:i,dailyLimit:u,warningReached:c,remaining:d,periodUsed:i,activeLimitUsd:u,resetInterval:a.resetInterval,resetTime:a.resetTime,budgetResetAt:s.nextResetAt,lastBudgetResetAt:s.periodStartAt,periodStartAt:s.periodStartAt}},"deleteBudget",0,function(e){o.delete(e),(0,r.discardSpendBatchEntries)(e);try{(0,t.deleteBudget)(e),(0,t.deleteCostEntries)(e)}catch{}},"getBudget",0,g,"getBudgetWindow",0,p,"getCostSummary",0,function(e){let n=new Date,a=new Date(n);a.setHours(0,0,0,0);let o=new Date(n.getFullYear(),n.getMonth(),1),s=g(e),u=s?p(s.resetInterval,s.resetTime):null;try{let n=[...i((0,t.loadCostEntries)(e,a.getTime())),...r.spendBatchWriter.getBufferedEntries(e,a.getTime())],c=[...i((0,t.loadCostEntries)(e,o.getTime())),...r.spendBatchWriter.getBufferedEntries(e,o.getTime())],d=null!==u?[...i((0,t.loadCostEntries)(e,u.periodStartAt)),...r.spendBatchWriter.getBufferedEntries(e,u.periodStartAt)]:[],p=l(n),E=l(c),g=l(d),m=s?_(s):0;return{dailyTotal:p,monthlyTotal:E,totalEntries:c.length,budget:s,totalCostToday:p,totalCostMonth:E,totalCostPeriod:g,activeLimitUsd:m,resetInterval:s?.resetInterval??null,resetTime:s?.resetTime??null,budgetResetAt:u?.nextResetAt??s?.budgetResetAt??null,lastBudgetResetAt:u?.periodStartAt??s?.lastBudgetResetAt??null,periodStartAt:u?.periodStartAt??null,nextResetAt:u?.nextResetAt??null,dailyLimitUsd:s?.dailyLimitUsd??0,weeklyLimitUsd:s?.weeklyLimitUsd??0,monthlyLimitUsd:s?.monthlyLimitUsd??0,warningThreshold:s?.warningThreshold??null}}catch{return{dailyTotal:0,monthlyTotal:0,totalEntries:0,budget:s,totalCostToday:0,totalCostMonth:0,totalCostPeriod:0,activeLimitUsd:s?_(s):0,resetInterval:s?.resetInterval??null,resetTime:s?.resetTime??null,budgetResetAt:s?.budgetResetAt??null,lastBudgetResetAt:s?.lastBudgetResetAt??null,periodStartAt:s?.lastBudgetResetAt??null,nextResetAt:s?.budgetResetAt??null,dailyLimitUsd:s?.dailyLimitUsd??0,weeklyLimitUsd:s?.weeklyLimitUsd??0,monthlyLimitUsd:s?.monthlyLimitUsd??0,warningThreshold:s?.warningThreshold??null}}},"getDailyTotal",0,function(e){let n=new Date;n.setHours(0,0,0,0);try{return l(i((0,t.loadCostEntries)(e,n.getTime())))+r.spendBatchWriter.getPendingCostTotal(e,n.getTime())}catch{return 0}},"recordCost",0,function(e,t){try{r.spendBatchWriter.increment(e,t,Date.now())}catch{}},"resetCostData",0,function(){o.clear(),(0,r.resetSpendBatchWriterForTests)();try{(0,t.deleteAllCostData)()}catch{}},"setBudget",0,function(e,t){return E(e,t,Date.now(),{logReset:!1,persist:!0})},"syncAllBudgetSchedules",0,function(e=Date.now()){let r=0,n=0;try{let a=(0,t.loadAllBudgets)();for(let[t,o]of Object.entries(a)){r+=1;let a=E(t,o,e,{logReset:!0,persist:!0});o.lastBudgetResetAt!==a.lastBudgetResetAt&&(n+=1)}}catch{}return{processed:r,resetCount:n}}])},775957,e=>{"use strict";var t=e.i(899378);function r(e){return{pattern:e.pattern,source:e.source,created_at:e.created_at}}e.s(["getAllBypassPatterns",0,function(){return(0,t.getDbInstance)().prepare("SELECT pattern, source, created_at FROM agent_bridge_bypass ORDER BY source ASC, pattern ASC").all().map(r)},"getUserBypassPatterns",0,function(){return(0,t.getDbInstance)().prepare("SELECT pattern FROM agent_bridge_bypass WHERE source = 'user' ORDER BY pattern ASC").all().map(e=>e.pattern)},"replaceUserBypassPatterns",0,function(e){let r=(0,t.getDbInstance)(),n=new Date().toISOString(),a=r.prepare("DELETE FROM agent_bridge_bypass WHERE source = 'user'"),o=r.prepare("INSERT INTO agent_bridge_bypass (pattern, source, created_at) VALUES (?, 'user', ?)");r.transaction(()=>{for(let t of(a.run(),e))o.run(t,n)})()},"seedDefaultBypassPatterns",0,function(e){let r=(0,t.getDbInstance)(),n=new Date().toISOString(),a=r.prepare("INSERT OR IGNORE INTO agent_bridge_bypass (pattern, source, created_at) VALUES (?, 'default', ?)");r.transaction(()=>{for(let t of e)a.run(t,n)})()}])},51829,e=>{"use strict";var t=e.i(899378),r=e.i(510902);let n=new Set(["antigravity","claude-code","kiro"]);function a(e){return(0,t.getDbInstance)().prepare("SELECT agent_id, source_model, target_model, updated_at FROM agent_bridge_mappings WHERE agent_id = ? ORDER BY source_model ASC").all(e)}e.s(["deleteMapping",0,function(e,r){(0,t.getDbInstance)().prepare("DELETE FROM agent_bridge_mappings WHERE agent_id = ? AND source_model = ?").run(e,r)},"getMappingsForAgent",0,a,"setMappings",0,function(e,r){let n=(0,t.getDbInstance)(),a=new Date().toISOString(),o=n.prepare("DELETE FROM agent_bridge_mappings WHERE agent_id = ?"),s=n.prepare(`INSERT INTO agent_bridge_mappings (agent_id, source_model, target_model, updated_at)
     VALUES (?, ?, ?, ?)`);n.transaction(()=>{for(let t of(o.run(e),r))s.run(e,t.source,t.target,a)})()},"syncAgentBridgeMappingsToMitmAlias",0,function(e){if(!n.has(e))return;let t=a(e),o={};for(let e of t)o[e.source_model]=e.target_model;(0,r.setMitmAliasAll)(e,o)}])},343379,e=>{"use strict";var t=e.i(899378);function r(e){return{agent_id:e.agent_id,dns_enabled:1===e.dns_enabled,cert_trusted:1===e.cert_trusted,setup_completed:1===e.setup_completed,last_started_at:e.last_started_at,last_error:e.last_error}}function n(e){let n=(0,t.getDbInstance)().prepare("SELECT * FROM agent_bridge_state WHERE agent_id = ?").get(e);return n?r(n):null}e.s(["getAgentBridgeState",0,n,"getAllAgentBridgeStates",0,function(){return(0,t.getDbInstance)().prepare("SELECT * FROM agent_bridge_state ORDER BY agent_id ASC").all().map(r)},"setLastError",0,function(e,r){(0,t.getDbInstance)().prepare(`INSERT INTO agent_bridge_state (agent_id, last_error)
     VALUES (?, ?)
     ON CONFLICT(agent_id) DO UPDATE SET last_error = excluded.last_error`).run(e,r)},"setLastStarted",0,function(e,r){(0,t.getDbInstance)().prepare(`INSERT INTO agent_bridge_state (agent_id, last_started_at)
     VALUES (?, ?)
     ON CONFLICT(agent_id) DO UPDATE SET last_started_at = excluded.last_started_at`).run(e,r)},"upsertAgentBridgeState",0,function(e){let r=(0,t.getDbInstance)();if(n(e.agent_id)){let t=[],n=[];if(void 0!==e.dns_enabled&&(t.push("dns_enabled = ?"),n.push(+!!e.dns_enabled)),void 0!==e.cert_trusted&&(t.push("cert_trusted = ?"),n.push(+!!e.cert_trusted)),void 0!==e.setup_completed&&(t.push("setup_completed = ?"),n.push(+!!e.setup_completed)),void 0!==e.last_started_at&&(t.push("last_started_at = ?"),n.push(e.last_started_at)),void 0!==e.last_error&&(t.push("last_error = ?"),n.push(e.last_error)),0===t.length)return;n.push(e.agent_id),r.prepare(`UPDATE agent_bridge_state SET ${t.join(", ")} WHERE agent_id = ?`).run(...n)}else r.prepare(`INSERT INTO agent_bridge_state
         (agent_id, dns_enabled, cert_trusted, setup_completed, last_started_at, last_error)
       VALUES (?, ?, ?, ?, ?, ?)`).run(e.agent_id,void 0!==e.dns_enabled?+!!e.dns_enabled:0,void 0!==e.cert_trusted?+!!e.cert_trusted:0,void 0!==e.setup_completed?+!!e.setup_completed:0,e.last_started_at??null,e.last_error??null)}])},496425,e=>{"use strict";var t=e.i(899378);e.s(["getErrorTypeBreakdown",0,function(e,r){return(0,t.getDbInstance)().prepare(`
      SELECT
        COALESCE(error_type, 'unclassified') AS errorType,
        COUNT(*) AS count
      FROM call_logs
      ${e} ${e?"AND":"WHERE"} (status >= 400 OR error_summary IS NOT NULL)
      GROUP BY 1
      ORDER BY count DESC, errorType ASC
      `).all(r).map(e=>({errorType:String(e.errorType),count:Number(e.count)}))},"getFallbackStats",0,function(e,r){return(0,t.getDbInstance)().prepare(`
      SELECT
        SUM(CASE WHEN (combo_name IS NULL OR combo_name = '') THEN 1 ELSE 0 END) as total,
        SUM(CASE WHEN requested_model IS NOT NULL AND requested_model != '' AND (combo_name IS NULL OR combo_name = '') THEN 1 ELSE 0 END) as with_requested,
        SUM(CASE
          WHEN (combo_name IS NULL OR combo_name = '')
           AND requested_model IS NOT NULL
           AND requested_model != ''
           AND model IS NOT NULL
           AND model != ''
          THEN 1 ELSE 0 END
        ) as fallback_eligible,
        SUM(CASE
          WHEN (combo_name IS NULL OR combo_name = '')
           AND requested_model IS NOT NULL
           AND requested_model != ''
           AND model IS NOT NULL
           AND model != ''
           AND LOWER(CASE WHEN instr(requested_model, '/') > 0 THEN substr(requested_model, instr(requested_model, '/') + 1) ELSE requested_model END) != LOWER(model)
          THEN 1 ELSE 0 END
        ) as fallbacks
      FROM call_logs
      ${e}
    `).get(r)??{total:0,with_requested:0,fallback_eligible:0,fallbacks:0}},"getProviderMetrics",0,function(){return(0,t.getDbInstance)().prepare(`SELECT
          c.provider,
          COUNT(*) as totalRequests,
          SUM(CASE WHEN status >= 200 AND status < 400 THEN 1 ELSE 0 END) as totalSuccesses,
          ROUND(AVG(duration)) as avgLatencyMs,
          MAX(timestamp) as lastRequestAt,
          MAX(
            CASE
              WHEN (status IS NOT NULL AND (status < 200 OR status >= 400))
                OR error_summary IS NOT NULL
              THEN timestamp
              ELSE NULL
            END
          ) as lastErrorAt,
          (
            SELECT c2.status
            FROM call_logs c2
            WHERE c2.provider = c.provider
            ORDER BY c2.timestamp DESC, c2.id DESC
            LIMIT 1
          ) as lastStatus,
          (
            SELECT c3.status
            FROM call_logs c3
            WHERE c3.provider = c.provider
              AND (
                (c3.status IS NOT NULL AND (c3.status < 200 OR c3.status >= 400))
                OR c3.error_summary IS NOT NULL
              )
            ORDER BY c3.timestamp DESC, c3.id DESC
            LIMIT 1
          ) as lastErrorStatus
        FROM call_logs c
        WHERE c.provider IS NOT NULL AND c.provider != '-'
          AND EXISTS (
            SELECT 1 FROM provider_connections pc WHERE pc.provider = c.provider
          )
        GROUP BY c.provider`).all()},"getProviderUsageSince",0,function(e){return(0,t.getDbInstance)().prepare(`SELECT
          c.provider,
          COUNT(*) as requests,
          SUM(CASE WHEN c.status >= 200 AND c.status < 400 THEN 1 ELSE 0 END) as successes,
          ROUND(AVG(c.duration)) as avgLatencyMs,
          MAX(c.timestamp) as lastRequestAt
        FROM call_logs c
        WHERE c.provider IS NOT NULL AND c.provider != '-'
          AND c.timestamp >= @since
          AND EXISTS (
            SELECT 1 FROM provider_connections pc WHERE pc.provider = c.provider
          )
        GROUP BY c.provider`).all({since:e})},"getRecentSearchLogs",0,function(){return(0,t.getDbInstance)().prepare(`
        SELECT request_summary, provider, timestamp
        FROM call_logs
        WHERE request_type = 'search'
        ORDER BY timestamp DESC
        LIMIT 10
      `).all()},"getSearchAggregateStats",0,function(e){return(0,t.getDbInstance)().prepare(`SELECT
          COUNT(*) as total,
          COALESCE(SUM(CASE WHEN timestamp >= ? THEN 1 ELSE 0 END), 0) as today,
          COALESCE(SUM(CASE WHEN status >= 400 OR error_summary IS NOT NULL THEN 1 ELSE 0 END), 0) as errors,
          AVG(CASE WHEN duration > 0 THEN duration END) as avg_duration,
          COALESCE(SUM(CASE WHEN duration > 0 AND duration < 5 THEN 1 ELSE 0 END), 0) as cached
         FROM call_logs
         WHERE request_type = 'search'`).get(e)??{total:0,today:0,errors:0,avg_duration:null,cached:0}},"getSearchProviderCounts",0,function(){return(0,t.getDbInstance)().prepare(`SELECT provider, COUNT(*) as cnt
         FROM call_logs WHERE request_type = 'search'
         GROUP BY provider ORDER BY cnt DESC`).all()},"getSearchProviderStats",0,function(){return(0,t.getDbInstance)().prepare(`
        SELECT provider, COUNT(*) as requests,
          CAST(AVG(duration) AS INTEGER) as avg_latency_ms
        FROM call_logs
        WHERE request_type = 'search'
        GROUP BY provider
      `).all()}])},568730,e=>{"use strict";var t=e.i(899378);let r=0;function n(e,r){(0,t.getDbInstance)().prepare("DELETE FROM ccr_blocks WHERE principal_id = ? AND hash = ?").run(e,r)}function a(e){return(0,t.getDbInstance)().prepare("DELETE FROM ccr_blocks WHERE expires_at <= ?").run(e).changes??0}e.s(["countCcrBlocks",0,function(e){let r=(0,t.getDbInstance)(),n=void 0===e?r.prepare("SELECT COUNT(*) AS n FROM ccr_blocks").get():r.prepare("SELECT COUNT(*) AS n FROM ccr_blocks WHERE principal_id = ?").get(e);return n?.n??0},"deleteAllCcrBlocks",0,function(){(0,t.getDbInstance)().prepare("DELETE FROM ccr_blocks").run()},"deleteCcrBlockRow",0,n,"loadCcrBlock",0,function(e,r,a){let o=(0,t.getDbInstance)().prepare(`SELECT content, bytes, chars, lines, content_type, source,
              created_at, last_accessed_at, expires_at
         FROM ccr_blocks WHERE principal_id = ? AND hash = ?`).get(e,r);return o?o.expires_at<=a?(n(e,r),null):{principalId:e,hash:r,content:o.content,bytes:o.bytes,chars:o.chars,lines:o.lines,contentType:o.content_type,source:o.source,createdAt:o.created_at,lastAccessedAt:o.last_accessed_at,expiresAt:o.expires_at}:null},"persistCcrBlock",0,function(e){(0,t.getDbInstance)().prepare(`INSERT OR REPLACE INTO ccr_blocks (
       principal_id, hash, content, bytes, chars, lines,
       content_type, source, created_at, last_accessed_at, expires_at
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(e.principalId,e.hash,e.content,e.bytes,e.chars,e.lines,e.contentType,e.source,e.createdAt,e.lastAccessedAt,e.expiresAt),++r>=200&&(r=0,a(Date.now()))},"pruneExpiredCcrBlocks",0,a,"resetCcrBlockPruneCounter",0,function(){r=0},"touchCcrBlock",0,function(e,r,n){(0,t.getDbInstance)().prepare("UPDATE ccr_blocks SET last_accessed_at = ? WHERE principal_id = ? AND hash = ?").run(n,e,r)}])},983427,e=>{"use strict";var t=e.i(899378);let r=null,n=[["actual_prompt_tokens","INTEGER"],["actual_completion_tokens","INTEGER"],["actual_total_tokens","INTEGER"],["actual_cache_read_tokens","INTEGER"],["actual_cache_write_tokens","INTEGER"],["estimated_usd_saved","REAL"],["mcp_description_tokens_saved","INTEGER DEFAULT 0"],["multimodal_skip_count","INTEGER DEFAULT 0"],["receipt_source","TEXT"],["validation_fallback","INTEGER DEFAULT 0"],["output_mode","TEXT"],["compression_combo_id","TEXT"],["engine","TEXT"],["rtk_raw_output_pointer","TEXT"],["rtk_raw_output_bytes","INTEGER"],["rtk_raw_output_pointers","TEXT"],["rtk_raw_output_total_bytes","INTEGER"],["skip_reason","TEXT"]];function a(){let e=(0,t.getDbInstance)();if(r===e)return;let a=new Set(e.prepare("PRAGMA table_info(compression_analytics)").all().map(e=>e.name));for(let[t,r]of n)a.has(t)||e.exec(`ALTER TABLE compression_analytics ADD COLUMN ${t} ${r}`);r=e}function o(e){let r=(0,t.getDbInstance)();a(),r.prepare(`
    INSERT INTO compression_analytics (
      timestamp, combo_id, compression_combo_id, engine, provider, mode, original_tokens, compressed_tokens, tokens_saved,
      duration_ms, request_id, actual_prompt_tokens, actual_completion_tokens,
      actual_total_tokens, actual_cache_read_tokens, actual_cache_write_tokens,
      estimated_usd_saved, mcp_description_tokens_saved, multimodal_skip_count,
      receipt_source, validation_fallback, output_mode, rtk_raw_output_pointer, rtk_raw_output_bytes,
      rtk_raw_output_pointers, rtk_raw_output_total_bytes, skip_reason
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(e.timestamp,e.combo_id??null,e.compression_combo_id??null,e.engine??e.mode,e.provider??null,e.mode,e.original_tokens,e.compressed_tokens,e.tokens_saved,e.duration_ms??null,e.request_id??null,e.actual_prompt_tokens??null,e.actual_completion_tokens??null,e.actual_total_tokens??null,e.actual_cache_read_tokens??null,e.actual_cache_write_tokens??null,e.estimated_usd_saved??null,e.mcp_description_tokens_saved??0,e.multimodal_skip_count??0,e.receipt_source??null,+!!e.validation_fallback,e.output_mode??null,e.rtk_raw_output_pointer??null,e.rtk_raw_output_bytes??null,e.rtk_raw_output_pointers??null,e.rtk_raw_output_total_bytes??null,e.skip_reason??null)}let s=null;function i(){let e=(0,t.getDbInstance)();s!==e&&(e.exec(`
    CREATE TABLE IF NOT EXISTS compression_engine_breakdown (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL,
      request_id TEXT,
      engine TEXT NOT NULL,
      original_tokens INTEGER NOT NULL DEFAULT 0,
      compressed_tokens INTEGER NOT NULL DEFAULT 0,
      tokens_saved INTEGER NOT NULL DEFAULT 0,
      duration_ms INTEGER
    );
    CREATE INDEX IF NOT EXISTS idx_ceb_engine_ts ON compression_engine_breakdown(engine, timestamp);
    CREATE INDEX IF NOT EXISTS idx_ceb_request ON compression_engine_breakdown(request_id);
  `),s=e)}function l(e){if("number"==typeof e&&Number.isFinite(e))return Math.max(0,Math.floor(e));if("string"==typeof e&&e.trim()){let t=Number(e);if(Number.isFinite(t))return Math.max(0,Math.floor(t))}return null}function u(e,t){return e?`${e} AND ${t}`:`WHERE ${t}`}e.s(["attachCompressionUsageReceipt",0,function(e,r,n="provider"){if(!e||!r||"object"!=typeof r)return;let o=l(r.prompt_tokens),s=l(r.completion_tokens),i=l(r.total_tokens)??(o??0)+(s??0),u=r.prompt_tokens_details&&"object"==typeof r.prompt_tokens_details?r.prompt_tokens_details:{},c=l(r.cache_read_input_tokens??r.cached_tokens??u.cached_tokens),d=l(r.cache_creation_input_tokens??u.cache_creation_tokens);if(null===o&&null===s&&i<=0)return;let p=(0,t.getDbInstance)();a(),p.prepare(`
    UPDATE compression_analytics
    SET actual_prompt_tokens = ?,
        actual_completion_tokens = ?,
        actual_total_tokens = ?,
        actual_cache_read_tokens = ?,
        actual_cache_write_tokens = ?,
        receipt_source = ?
    WHERE request_id = ?
      AND id = (
        SELECT id FROM compression_analytics
        WHERE request_id = ?
        ORDER BY id DESC
        LIMIT 1
      )
  `).run(o,s,i,c,d,n,e,e)},"getCompressionAnalyticsSummary",0,function(e){let r=(0,t.getDbInstance)();a();let n=null;"24h"===e?n=new Date(Date.now()-864e5).toISOString():"7d"===e?n=new Date(Date.now()-6048e5).toISOString():"30d"===e&&(n=new Date(Date.now()-2592e6).toISOString());let o=n?"WHERE timestamp >= ?":"",s=n?[n]:[],i=u(o,"skip_reason IS NULL"),l=r.prepare(`
    SELECT
      COUNT(*) as total,
      COALESCE(SUM(tokens_saved), 0) as totalSaved,
      COALESCE(AVG(CASE WHEN original_tokens > 0 THEN CAST(tokens_saved AS REAL) / original_tokens * 100 ELSE 0 END), 0) as avgPct,
      COALESCE(AVG(duration_ms), 0) as avgDur
    FROM compression_analytics ${i}
  `).get(...s),c=r.prepare(`
    SELECT mode, COUNT(*) as cnt, COALESCE(SUM(tokens_saved), 0) as saved,
      COALESCE(AVG(CASE WHEN original_tokens > 0 THEN CAST(tokens_saved AS REAL) / original_tokens * 100 ELSE 0 END), 0) as avgPct
    FROM compression_analytics ${i}
    GROUP BY mode
  `).all(...s),d=r.prepare(`
    SELECT mode, COUNT(*) as cnt
    FROM compression_analytics ${u(o,"skip_reason IS NOT NULL")}
    GROUP BY mode
  `).all(...s),p={};for(let e of c)p[e.mode]={count:e.cnt,tokensSaved:e.saved,avgSavingsPct:Math.round(e.avgPct),skipped:0};for(let e of d)p[e.mode]?p[e.mode].skipped=e.cnt:p[e.mode]={count:0,tokensSaved:0,avgSavingsPct:0,skipped:e.cnt};let _=r.prepare(`
    SELECT COALESCE(engine, mode) as engine, COUNT(*) as cnt, COALESCE(SUM(tokens_saved), 0) as saved,
      COALESCE(AVG(CASE WHEN original_tokens > 0 THEN CAST(tokens_saved AS REAL) / original_tokens * 100 ELSE 0 END), 0) as avgPct
    FROM compression_analytics ${i}
    GROUP BY COALESCE(engine, mode)
  `).all(...s),E={};for(let e of _)E[e.engine]={count:e.cnt,tokensSaved:e.saved,avgSavingsPct:Math.round(e.avgPct)};let g=r.prepare(`
    SELECT compression_combo_id as compressionComboId, COUNT(*) as cnt,
      COALESCE(SUM(tokens_saved), 0) as saved
    FROM compression_analytics ${u(i,"compression_combo_id IS NOT NULL")}
    GROUP BY compression_combo_id ORDER BY cnt DESC
  `).all(...s),m={};for(let e of g)m[e.compressionComboId??"unknown"]={count:e.cnt,tokensSaved:e.saved};let S=r.prepare(`
    SELECT provider, COUNT(*) as cnt, COALESCE(SUM(tokens_saved), 0) as saved
    FROM compression_analytics ${i}
    GROUP BY provider ORDER BY cnt DESC
  `).all(...s),f={};for(let e of S)f[e.provider??"unknown"]={count:e.cnt,tokensSaved:e.saved};let y=new Map,h=new Date;for(let e=23;e>=0;e--){let t=new Date(h.getTime()-60*e*6e4).toISOString().substring(0,14)+"00:00Z";y.set(t,{hour:t,count:0,tokensSaved:0})}for(let e of r.prepare(`
    SELECT strftime('%Y-%m-%dT%H:00:00Z', timestamp) as hour,
      COUNT(*) as cnt, COALESCE(SUM(tokens_saved), 0) as saved
    FROM compression_analytics
    WHERE timestamp >= ? AND skip_reason IS NULL
    GROUP BY hour ORDER BY hour ASC
  `).all(new Date(h.getTime()-864e5).toISOString()))y.has(e.hour)&&y.set(e.hour,{hour:e.hour,count:e.cnt,tokensSaved:e.saved});let b=Array.from(y.values()),R=r.prepare(`
    SELECT receipt_source as source, COUNT(*) as cnt,
      COALESCE(SUM(actual_prompt_tokens), 0) as prompt,
      COALESCE(SUM(actual_completion_tokens), 0) as completion,
      COALESCE(SUM(actual_total_tokens), 0) as total,
      COALESCE(SUM(actual_cache_read_tokens), 0) as cacheRead,
      COALESCE(SUM(actual_cache_write_tokens), 0) as cacheWrite,
      COALESCE(SUM(estimated_usd_saved), 0) as usdSaved
    FROM compression_analytics ${u(i,"receipt_source IS NOT NULL")}
    GROUP BY receipt_source
  `).all(...s),T={requestsWithReceipts:0,promptTokens:0,completionTokens:0,totalTokens:0,cacheReadTokens:0,cacheWriteTokens:0,estimatedUsdSaved:0,bySource:{}};for(let e of R){let t=e.source??"unknown";T.requestsWithReceipts+=e.cnt,T.promptTokens+=e.prompt,T.completionTokens+=e.completion,T.totalTokens+=e.total,T.cacheReadTokens+=e.cacheRead,T.cacheWriteTokens+=e.cacheWrite,T.estimatedUsdSaved+=e.usdSaved,T.bySource[t]=e.cnt}let I=r.prepare(`
    SELECT COUNT(*) as cnt
    FROM compression_analytics ${u(i,"validation_fallback = 1")}
  `).get(...s),D=r.prepare(`
    SELECT COUNT(*) as cnt, COALESCE(SUM(mcp_description_tokens_saved), 0) as saved
    FROM compression_analytics ${u(i,"mcp_description_tokens_saved > 0")}
  `).get(...s),O=r.prepare(`
    SELECT skip_reason as reason, COUNT(*) as cnt
    FROM compression_analytics ${u(o,"skip_reason IS NOT NULL")}
    GROUP BY skip_reason
  `).all(...s),v={},N=0;for(let e of O)v[e.reason??"unknown"]=e.cnt,N+=e.cnt;return{totalRequests:l?.total??0,totalTokensSaved:l?.totalSaved??0,avgSavingsPct:Math.round(l?.avgPct??0),avgDurationMs:Math.round(l?.avgDur??0),byMode:p,byEngine:E,byCompressionCombo:m,byProvider:f,last24h:b,totalSkipped:N,bySkipReason:v,validationFallbacks:I?.cnt??0,realUsage:T,mcpDescriptionCompression:{snapshots:D?.cnt??0,estimatedTokensSaved:D?.saved??0}}},"getPerEngineAnalytics",0,function(e,r=7){let n=(0,t.getDbInstance)();a(),i();let o=new Date(Date.now()-864e5*r).toISOString(),s=n.prepare(`SELECT COUNT(*) AS runs,
              COALESCE(SUM(original_tokens), 0) AS original,
              COALESCE(SUM(compressed_tokens), 0) AS compressed,
              COALESCE(SUM(tokens_saved), 0) AS saved
       FROM compression_engine_breakdown
       WHERE engine = ? AND timestamp >= ?`).get(e,o),l=n.prepare(`SELECT COUNT(*) AS runs,
              COALESCE(SUM(original_tokens), 0) AS original,
              COALESCE(SUM(compressed_tokens), 0) AS compressed,
              COALESCE(SUM(tokens_saved), 0) AS saved
       FROM compression_analytics
       WHERE COALESCE(engine, mode) = ? AND timestamp >= ?
         AND (
           request_id IS NULL
           OR request_id NOT IN (
             SELECT request_id FROM compression_engine_breakdown WHERE request_id IS NOT NULL
           )
         )`).get(e,o),u=s.runs+l.runs,c=s.original+l.original,d=s.compressed+l.compressed;return{engineId:e,runs:u,tokensSaved:Math.max(0,s.saved+l.saved),avgSavingsPercent:c>0?Math.round((c-d)/c*1e3)/10:0,days:r}},"insertCompressionAnalyticsRow",0,o,"insertCompressionEngineBreakdown",0,function(e){if(!e.length)return;let r=(0,t.getDbInstance)();i();let n=r.prepare(`INSERT INTO compression_engine_breakdown
       (timestamp, request_id, engine, original_tokens, compressed_tokens, tokens_saved, duration_ms)
     VALUES (?, ?, ?, ?, ?, ?, ?)`);r.transaction(e=>{for(let t of e)n.run(t.timestamp,t.request_id??null,t.engine,t.original_tokens,t.compressed_tokens,t.tokens_saved,t.duration_ms??null)})(e)},"recordContextEditingTelemetry",0,function(e,t,r="claude"){let n=t?.clearedInputTokens??0;Number.isFinite(n)&&!(n<=0)&&o({timestamp:new Date().toISOString(),provider:r,mode:"context-editing",engine:"context-editing",original_tokens:n,compressed_tokens:0,tokens_saved:n,request_id:e?`${e}::context-editing`:null})}])},894278,e=>{"use strict";var t=e.i(899378);e.s(["getCacheStatsSummary",0,function(e){let r=(0,t.getDbInstance)();e&&e.toISOString();let n=e?r.prepare("SELECT COUNT(*) as totalRequests, AVG(net_savings) as avgNetSavings, SUM(estimated_cache_hit) * 1.0 / COUNT(*) as cacheHitRate FROM compression_cache_stats WHERE created_at >= ?").get(e.toISOString()):r.prepare("SELECT COUNT(*) as totalRequests, AVG(net_savings) as avgNetSavings, SUM(estimated_cache_hit) * 1.0 / COUNT(*) as cacheHitRate FROM compression_cache_stats").get();if(!n||0===n.totalRequests)return{totalRequests:0,avgNetSavings:0,cacheHitRate:0,byProvider:{}};let a=e?r.prepare("SELECT provider, COUNT(*) as count, AVG(net_savings) as avgNetSavings, SUM(estimated_cache_hit) * 1.0 / COUNT(*) as cacheHitRate FROM compression_cache_stats WHERE created_at >= ? GROUP BY provider").all(e.toISOString()):r.prepare("SELECT provider, COUNT(*) as count, AVG(net_savings) as avgNetSavings, SUM(estimated_cache_hit) * 1.0 / COUNT(*) as cacheHitRate FROM compression_cache_stats GROUP BY provider").all(),o={};for(let e of a)o[e.provider]={count:e.count,avgNetSavings:e.avgNetSavings,cacheHitRate:e.cacheHitRate};return{totalRequests:n.totalRequests,avgNetSavings:n.avgNetSavings??0,cacheHitRate:n.cacheHitRate??0,byProvider:o}},"recordCacheStats",0,function(e){let r=(0,t.getDbInstance)(),n=`INSERT INTO compression_cache_stats (
    provider, 
    model, 
    compression_mode, 
    cache_control_present, 
    estimated_cache_hit, 
    tokens_saved_compression, 
    tokens_saved_caching, 
    net_savings
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;r.prepare(n).run(e.provider,e.model??"",e.compressionMode,+!!e.cacheControlPresent,+!!e.estimatedCacheHit,e.tokensSavedCompression,e.tokensSavedCaching,e.netSavings)}])},926028,e=>{"use strict";var t=e.i(689960),r=e.i(935050),n=e.i(899378),a=e.i(529646);let o="default-caveman",s="Standard Savings",i="Default RTK + Caveman compression pipeline";function l(){return[{engine:"rtk",intensity:"standard"},{engine:"caveman",intensity:"full"}]}function u(e,t){if(Array.isArray(e))return e;if("string"!=typeof e)return t;try{let r=JSON.parse(e);return Array.isArray(r)?r:t}catch{return t}}let c=["lite","caveman","aggressive","ultra","rtk","headroom","session-dedup","ccr","llmlingua","relevance","codex-responses"];function d(e){return u(e,[]).filter(e=>e&&"object"==typeof e&&c.includes(String(e.engine)))}function p(){let e=(0,n.getDbInstance)();e.exec(`
    CREATE TABLE IF NOT EXISTS compression_combos (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      pipeline TEXT NOT NULL DEFAULT '[]',
      language_packs TEXT DEFAULT '["en"]',
      output_mode INTEGER DEFAULT 0,
      output_mode_intensity TEXT DEFAULT 'full',
      is_default INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS compression_combo_assignments (
      id TEXT PRIMARY KEY,
      compression_combo_id TEXT NOT NULL REFERENCES compression_combos(id) ON DELETE CASCADE,
      routing_combo_id TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(routing_combo_id)
    );

    CREATE INDEX IF NOT EXISTS idx_compression_combos_default
      ON compression_combos(is_default);
    CREATE INDEX IF NOT EXISTS idx_compression_combo_assignments_combo
      ON compression_combo_assignments(compression_combo_id);
    CREATE INDEX IF NOT EXISTS idx_compression_combo_assignments_routing
      ON compression_combo_assignments(routing_combo_id);
  `),e.prepare(`
    INSERT OR IGNORE INTO compression_combos (
      id, name, description, pipeline, language_packs, output_mode, output_mode_intensity, is_default
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(o,s,i,JSON.stringify(l()),JSON.stringify(["en"]),0,"full",1),function(){let e=(0,n.getDbInstance)(),t=e.prepare("SELECT name, description, pipeline FROM compression_combos WHERE id = ?").get(o);if(!t)return;let r=String(t.description??"");String(t.name??"")===s&&("Default Caveman compression pipeline"===r||r===i)&&function(e){if(1!==e.length)return!1;let[t]=e;return"caveman"===t.engine&&(void 0===t.intensity||"full"===t.intensity)}(d(t.pipeline))&&e.prepare(`
    UPDATE compression_combos
    SET description = ?, pipeline = ?, updated_at = ?
    WHERE id = ?
  `).run(i,JSON.stringify(l()),new Date().toISOString(),o)}()}function _(e){let t;if(!e)return null;let r=(0,a.rowToCamel)(e);return{id:String(r.id),name:String(r.name??""),description:String(r.description??""),pipeline:d(r.pipeline),languagePacks:[...new Set((t=u(r.languagePacks,["en"]).filter(e=>"string"==typeof e&&e.trim().length>0)).length>0?t.map(e=>e.trim()):["en"])],outputMode:!!r.outputMode,outputModeIntensity:String(r.outputModeIntensity??"full"),isDefault:!!r.isDefault,createdAt:String(r.createdAt??""),updatedAt:String(r.updatedAt??"")}}function E(e){if(!e)return null;let t=(0,a.rowToCamel)(e);return{id:String(t.id),compressionComboId:String(t.compressionComboId),routingComboId:String(t.routingComboId),createdAt:String(t.createdAt??"")}}function g(e,r){let n=new Date().toISOString();return{id:r?.id??e.id??(0,t.v4)(),name:e.name?.trim()||r?.name||"Compression Combo",description:e.description??r?.description??"",pipeline:e.pipeline&&e.pipeline.length>0?e.pipeline:r?.pipeline&&r.pipeline.length>0?r.pipeline:l(),languagePacks:e.languagePacks&&e.languagePacks.length>0?e.languagePacks:r?.languagePacks&&r.languagePacks.length>0?r.languagePacks:["en"],outputMode:e.outputMode??r?.outputMode??!1,outputModeIntensity:e.outputModeIntensity??r?.outputModeIntensity??"full",isDefault:e.isDefault??r?.isDefault??!1,createdAt:r?.createdAt??n,updatedAt:n}}function m(e){return p(),_((0,n.getDbInstance)().prepare("SELECT * FROM compression_combos WHERE id = ?").get(e))}function S(){return p(),_((0,n.getDbInstance)().prepare("SELECT * FROM compression_combos WHERE is_default = 1 ORDER BY updated_at DESC LIMIT 1").get())}let f={"session-dedup":3,ccr:4,lite:5,rtk:10,headroom:15,caveman:20,aggressive:30,llmlingua:35,ultra:40,"codex-responses":12};e.s(["assignRoutingCombo",0,function(e,a){return p(),!!m(e)&&!!a.trim()&&((0,n.getDbInstance)().prepare(`
      INSERT OR REPLACE INTO compression_combo_assignments (
        id, compression_combo_id, routing_combo_id, created_at
      )
      VALUES (?, ?, ?, ?)
    `).run((0,t.v4)(),e,a.trim(),new Date().toISOString()),(0,r.backupDbFile)("pre-write"),!0)},"createCompressionCombo",0,function(e){p();let t=(0,n.getDbInstance)(),a=g(e);return t.transaction(()=>{a.isDefault&&t.prepare("UPDATE compression_combos SET is_default = 0").run(),t.prepare(`
      INSERT INTO compression_combos (
        id, name, description, pipeline, language_packs, output_mode, output_mode_intensity,
        is_default, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(a.id,a.name,a.description,JSON.stringify(a.pipeline),JSON.stringify(a.languagePacks),+!!a.outputMode,a.outputModeIntensity,+!!a.isDefault,a.createdAt,a.updatedAt)})(),(0,r.backupDbFile)("pre-write"),m(a.id)},"deleteCompressionCombo",0,function(e){p();let t=m(e);if(!t||t.isDefault)return!1;let a=(0,n.getDbInstance)().prepare("DELETE FROM compression_combos WHERE id = ?").run(e);return a.changes>0&&(0,r.backupDbFile)("pre-write"),a.changes>0},"getAssignmentsForCompressionCombo",0,function(e){return p(),(0,n.getDbInstance)().prepare("SELECT * FROM compression_combo_assignments WHERE compression_combo_id = ? ORDER BY routing_combo_id").all(e).map(E).filter(e=>null!==e)},"getCompressionCombo",0,m,"getCompressionComboForRoutingCombo",0,function(e){return p(),_((0,n.getDbInstance)().prepare(`
      SELECT c.*
      FROM compression_combos c
      JOIN compression_combo_assignments a ON a.compression_combo_id = c.id
      WHERE a.routing_combo_id = ?
      LIMIT 1
    `).get(e))},"getDefaultCompressionCombo",0,S,"listCompressionCombos",0,function(){return p(),(0,n.getDbInstance)().prepare("SELECT * FROM compression_combos ORDER BY is_default DESC, name COLLATE NOCASE ASC").all().map(_).filter(e=>null!==e)},"setDefaultCompressionCombo",0,function(e){if(p(),!m(e))return!1;let t=(0,n.getDbInstance)(),a=new Date().toISOString();return t.transaction(()=>{t.prepare("UPDATE compression_combos SET is_default = 0").run(),t.prepare("UPDATE compression_combos SET is_default = 1, updated_at = ? WHERE id = ?").run(a,e)})(),(0,r.backupDbFile)("pre-write"),!0},"setEngineInDefaultCombo",0,function(e,t,a){if(!c.includes(e))return null;p();let o=S();if(!o)return null;let s=[...o.pipeline];if(t){let t=s.findIndex(t=>t.engine===e);t>=0?void 0!==a&&(s[t]={...s[t],config:a}):s.push({engine:e,...a?{config:a}:{}}),s.sort((e,t)=>(f[e.engine]??50)-(f[t.engine]??50))}else s=s.filter(t=>t.engine!==e);let i=(0,n.getDbInstance)(),l=new Date().toISOString();return i.prepare("UPDATE compression_combos SET pipeline = ?, updated_at = ? WHERE id = ?").run(JSON.stringify(s),l,o.id),(0,r.backupDbFile)("pre-write"),m(o.id)},"unassignRoutingCombo",0,function(e,t){p();let a=(0,n.getDbInstance)().prepare("DELETE FROM compression_combo_assignments WHERE compression_combo_id = ? AND routing_combo_id = ?").run(e,t);return a.changes>0&&(0,r.backupDbFile)("pre-write"),a.changes>0},"updateAssignments",0,function(e,a){if(p(),!m(e))return!1;let o=[...new Set(a.map(e=>e.trim()).filter(Boolean))],s=(0,n.getDbInstance)();return s.transaction(()=>{if(s.prepare("DELETE FROM compression_combo_assignments WHERE compression_combo_id = ?").run(e),o.length>0){let r=s.prepare("DELETE FROM compression_combo_assignments WHERE routing_combo_id = ?"),n=s.prepare(`
        INSERT INTO compression_combo_assignments (
          id, compression_combo_id, routing_combo_id, created_at
        )
        VALUES (?, ?, ?, ?)
      `);for(let a of o)r.run(a),n.run((0,t.v4)(),e,a,new Date().toISOString())}})(),(0,r.backupDbFile)("pre-write"),!0},"updateCompressionCombo",0,function(e,t){p();let a=m(e);if(!a)return null;let o=g(t,a),s=(0,n.getDbInstance)();return s.transaction(()=>{o.isDefault&&s.prepare("UPDATE compression_combos SET is_default = 0").run(),s.prepare(`
      UPDATE compression_combos
      SET name = ?, description = ?, pipeline = ?, language_packs = ?, output_mode = ?,
          output_mode_intensity = ?, is_default = ?, updated_at = ?
      WHERE id = ?
    `).run(o.name,o.description,JSON.stringify(o.pipeline),JSON.stringify(o.languagePacks),+!!o.outputMode,o.outputModeIntensity,+!!o.isDefault,o.updatedAt,e)})(),(0,r.backupDbFile)("pre-write"),m(e)}])},747369,e=>{"use strict";var t=e.i(899378);function r(){(0,t.getDbInstance)().exec(`
    CREATE TABLE IF NOT EXISTS compression_run_telemetry (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp INTEGER NOT NULL,
      request_id TEXT,
      model TEXT,
      provider TEXT,
      source TEXT,
      tokens_before INTEGER NOT NULL,
      tokens_after INTEGER NOT NULL,
      ratio REAL,
      cost_delta REAL,
      output_styles TEXT,
      output_style_bypass TEXT,
      output_tokens INTEGER
    )
  `)}e.s(["getCompressionRunTelemetrySummary",0,function(){let e=(0,t.getDbInstance)();r();let n=e.prepare(`SELECT tokens_before, tokens_after, output_styles, output_style_bypass, output_tokens
       FROM compression_run_telemetry`).all(),a={totalRuns:n.length,totalTokensSaved:0,runsWithStyles:0,bypassCount:0,totalOutputTokens:0,appliedStyleCounts:{}};for(let e of n)if(a.totalTokensSaved+=Math.max(0,e.tokens_before-e.tokens_after),a.totalOutputTokens+=e.output_tokens??0,e.output_style_bypass&&(a.bypassCount+=1),e.output_styles){a.runsWithStyles+=1;try{for(let t of JSON.parse(e.output_styles))a.appliedStyleCounts[t.id]=(a.appliedStyleCounts[t.id]??0)+1}catch{}}return a},"insertCompressionRunTelemetryRow",0,function(e){try{let n=(0,t.getDbInstance)();r(),n.prepare(`INSERT INTO compression_run_telemetry (
        timestamp, request_id, model, provider, source,
        tokens_before, tokens_after, ratio, cost_delta,
        output_styles, output_style_bypass, output_tokens
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(Date.now(),e.requestId??null,e.model??null,e.provider??null,e.source??null,e.tokensBefore,e.tokensAfter,e.ratio,e.costDelta??null,e.outputStyles&&e.outputStyles.length>0?JSON.stringify(e.outputStyles):null,e.outputStyleBypass??null,e.outputTokens??null)}catch{}}])},870766,e=>{"use strict";var t=e.i(899378);let r="antigravityCreditBalance";function n(e){try{return JSON.parse(e)}catch{return null}}e.s(["getAllPersistedCreditBalances",0,function(){let e=new Map;if(t.isBuildPhase||t.isCloud)return e;for(let a of(0,t.getDbInstance)().prepare("SELECT key, value FROM key_value WHERE namespace = ?").all(r)){let t=n(a.value);t&&"number"==typeof t.balance&&e.set(a.key,t.balance)}return e},"getPersistedCreditBalance",0,function(e){if(t.isBuildPhase||t.isCloud)return null;let a=(0,t.getDbInstance)().prepare("SELECT value FROM key_value WHERE namespace = ? AND key = ?").get(r,e);if(!a?.value)return null;let o=n(a.value);return o&&"number"==typeof o.balance?o.balance:null},"persistCreditBalance",0,function(e,n){if(t.isBuildPhase||t.isCloud)return;let a=(0,t.getDbInstance)(),o={balance:n,updatedAt:new Date().toISOString()};a.prepare("INSERT OR REPLACE INTO key_value (namespace, key, value) VALUES (?, ?, ?)").run(r,e,JSON.stringify(o))}])},54572,e=>{"use strict";var t=e.i(254799),r=e.i(899378),n=e.i(935050);function a(e){return{id:String(e.id??""),source:String(e.source??"1proxy"),host:String(e.host??""),port:Number(e.port)||0,type:String(e.type??"http"),countryCode:null!=e.country_code?String(e.country_code):null,qualityScore:null!=e.quality_score?Number(e.quality_score):null,latencyMs:null!=e.latency_ms?Number(e.latency_ms):null,anonymity:null!=e.anonymity?String(e.anonymity):null,lastValidated:null!=e.last_validated?String(e.last_validated):null,inPool:1===e.in_pool||!0===e.in_pool,poolProxyId:null!=e.pool_proxy_id?String(e.pool_proxy_id):null,createdAt:String(e.created_at??""),updatedAt:String(e.updated_at??"")}}async function o(e){let n=(0,r.getDbInstance)(),a=new Date().toISOString(),o=n.prepare("SELECT id FROM free_proxies WHERE source = ? AND host = ? AND port = ?").get(e.source,e.host,e.port);if(o?.id)return n.prepare(`UPDATE free_proxies
       SET type = ?, country_code = ?, quality_score = ?, latency_ms = ?,
           anonymity = ?, last_validated = ?, updated_at = ?
       WHERE id = ?`).run(e.type,e.countryCode??null,e.qualityScore??null,e.latencyMs??null,e.anonymity??null,e.lastValidated??a,a,o.id),{id:o.id,action:"updated"};let s=(0,t.randomUUID)();return n.prepare(`INSERT INTO free_proxies
     (id, source, host, port, type, country_code, quality_score, latency_ms,
      anonymity, last_validated, in_pool, pool_proxy_id, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NULL, ?, ?)`).run(s,e.source,e.host,e.port,e.type,e.countryCode??null,e.qualityScore??null,e.latencyMs??null,e.anonymity??null,e.lastValidated??a,a,a),{id:s,action:"created"}}async function s(e){let t=(0,r.getDbInstance)(),n=[],o="SELECT * FROM free_proxies WHERE 1=1";e?.sources?.length&&(o+=` AND source IN (${e.sources.map(()=>"?").join(",")})`,n.push(...e.sources)),e?.protocol&&(o+=" AND type = ?",n.push(e.protocol)),e?.country&&(o+=" AND country_code = ?",n.push(e.country.toUpperCase())),e?.minQuality!=null&&(o+=" AND quality_score >= ?",n.push(e.minQuality)),e?.onlyInPool&&(o+=" AND in_pool = 1"),e?.onlyNotInPool&&(o+=" AND in_pool = 0"),e?.search&&(o+=" AND host LIKE ?",n.push(`%${e.search}%`));let s=e?.sortBy==="latency"?"ORDER BY latency_ms IS NULL, latency_ms ASC":e?.sortBy==="recent"?"ORDER BY last_validated DESC":"ORDER BY quality_score DESC, last_validated DESC";return o+=` ${s}`,e?.limit&&(o+=" LIMIT ?",n.push(e.limit),e?.offset&&(o+=" OFFSET ?",n.push(e.offset))),t.prepare(o).all(...n).map(a)}async function i(e){let t=(0,r.getDbInstance)(),n=[],a="SELECT COUNT(*) AS count FROM free_proxies WHERE 1=1";e?.sources?.length&&(a+=` AND source IN (${e.sources.map(()=>"?").join(",")})`,n.push(...e.sources)),e?.protocol&&(a+=" AND type = ?",n.push(e.protocol)),e?.country&&(a+=" AND country_code = ?",n.push(e.country.toUpperCase())),e?.minQuality!=null&&(a+=" AND quality_score >= ?",n.push(e.minQuality)),e?.onlyInPool&&(a+=" AND in_pool = 1"),e?.onlyNotInPool&&(a+=" AND in_pool = 0"),e?.search&&(a+=" AND host LIKE ?",n.push(`%${e.search}%`));let o=t.prepare(a).get(...n),s=o?.count;return"number"==typeof s?s:Number(s??0)}async function l(e,t){return(await s({sources:[e],protocol:t.protocol,country:t.country,minQuality:t.minQuality,limit:t.limit})).map(e=>({source:e.source,host:e.host,port:e.port,type:e.type,countryCode:e.countryCode,qualityScore:e.qualityScore,latencyMs:e.latencyMs,anonymity:e.anonymity,lastValidated:e.lastValidated}))}async function u(e){let t=(0,r.getDbInstance)().prepare("SELECT * FROM free_proxies WHERE id = ?").get(e);return t?a(t):null}async function c(e,t){let a=(0,r.getDbInstance)(),o=new Date().toISOString();a.prepare("UPDATE free_proxies SET in_pool = 1, pool_proxy_id = ?, updated_at = ? WHERE id = ?").run(t,o,e),(0,n.backupDbFile)("pre-write")}async function d(e,a){let o=(0,r.getDbInstance)(),s=new Date().toISOString(),i=(0,t.randomUUID)(),l=o.transaction(()=>{let t=o.prepare("SELECT id, in_pool FROM free_proxies WHERE id = ? LIMIT 1").get(e);return t?.id?(o.prepare(`INSERT INTO proxy_registry
        (id, name, type, host, port, username, password, region, notes, status, source, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, '', '', NULL, NULL, 'active', ?, ?, ?)`).run(i,a.name,a.type,a.host,Number(a.port),a.source,s,s),o.prepare("UPDATE free_proxies SET in_pool = 1, pool_proxy_id = ?, updated_at = ? WHERE id = ?").run(i,s,e),i):null})();return l&&(0,n.backupDbFile)("pre-write"),l}async function p(e){let t=(0,r.getDbInstance)().prepare("DELETE FROM free_proxies WHERE id = ?").run(e);return(0,n.backupDbFile)("pre-write"),t.changes>0}async function _(e){let t=(0,r.getDbInstance)().prepare("DELETE FROM free_proxies WHERE source = ? AND in_pool = 0").run(e);return(0,n.backupDbFile)("pre-write"),t.changes}async function E(e,t){let a=(0,r.getDbInstance)(),o=a.prepare("SELECT id, host, port FROM free_proxies WHERE source = ? AND in_pool = 0").all(e).filter(e=>!t.has(`${e.host}:${e.port}`)).map(e=>e.id);if(0===o.length)return 0;let s=o.map(()=>"?").join(","),i=a.prepare(`DELETE FROM free_proxies WHERE id IN (${s})`).run(...o);return(0,n.backupDbFile)("pre-write"),i.changes}let g="free_proxies",m="last_sync_at";async function S(e){let t=(0,r.getDbInstance)(),a=e??new Date().toISOString();return t.prepare("INSERT OR REPLACE INTO key_value (namespace, key, value) VALUES (?, ?, ?)").run(g,m,a),(0,n.backupDbFile)("pre-write"),a}async function f(){let e,t=(0,r.getDbInstance)(),n=t.prepare(`SELECT COUNT(*) as total,
              SUM(CASE WHEN in_pool = 1 THEN 1 ELSE 0 END) as in_pool_count,
              AVG(quality_score) as avg_quality,
              MAX(last_validated) as last_sync_at
       FROM free_proxies`).get(),a=t.prepare("SELECT source, COUNT(*) as count FROM free_proxies GROUP BY source ORDER BY count DESC").all(),o=(e=t.prepare("SELECT value FROM key_value WHERE namespace = ? AND key = ?").get(g,m),e?.value!=null?String(e.value):null),s=null!=n.last_sync_at?String(n.last_sync_at):null;return{total:Number(n.total)||0,inPool:Number(n.in_pool_count)||0,avgQuality:null!=n.avg_quality?Math.round(Number(n.avg_quality)):null,bySource:a.map(e=>({source:String(e.source),count:Number(e.count)})),lastSyncAt:o??s}}async function y(e,t){let a=(0,r.getDbInstance)(),o=new Date().toISOString();a.prepare("INSERT OR REPLACE INTO free_proxy_sync_errors (source, errors, updated_at) VALUES (?, ?, ?)").run(e,JSON.stringify(t),o),(0,n.backupDbFile)("pre-write")}async function h(e){(0,r.getDbInstance)().prepare("DELETE FROM free_proxy_sync_errors WHERE source = ?").run(e),(0,n.backupDbFile)("pre-write")}async function b(){let e=(0,r.getDbInstance)().prepare("SELECT source, errors FROM free_proxy_sync_errors").all(),t={};for(let r of e)if(r.source)try{let e=JSON.parse(r.errors);t[r.source]=Array.isArray(e)?e.map(String):[String(r.errors)]}catch{t[r.source]=[String(r.errors)]}return t}e.s(["clearFreeProxiesBySource",0,_,"clearFreeProxySyncErrors",0,h,"countFreeProxies",0,i,"deleteFreeProxy",0,p,"getFreeProxyById",0,u,"getFreeProxyStats",0,f,"getFreeProxySyncErrors",0,b,"listFreeProxies",0,s,"listFreeProxiesBySource",0,l,"markFreeProxyInPool",0,c,"promoteFreeProxyToPool",0,d,"pruneStaleFreeProxies",0,E,"recordFreeProxySync",0,S,"recordFreeProxySyncErrors",0,y,"upsertFreeProxy",0,o])},850803,e=>{"use strict";var t=e.i(899378),r=e.i(436231);function n(){return(0,t.getDbInstance)()}function a(e){let t=n().prepare("SELECT COALESCE(SUM(amount), 0) AS total FROM token_ledger WHERE to_api_key_id = ?").get(e),r=n().prepare("SELECT COALESCE(SUM(amount), 0) AS total FROM token_ledger WHERE from_api_key_id = ?").get(e);return t.total-r.total}e.s(["addXp",0,function(e,t,a,o){n().prepare(`INSERT INTO xp_audit_log (api_key_id, action, xp_earned, metadata)
     VALUES (?, ?, ?, ?)`).run(e,t,a,o??null),n().prepare(`INSERT INTO user_levels (api_key_id, total_xp, current_level, updated_at)
     VALUES (?, ?, ?, datetime('now'))
     ON CONFLICT(api_key_id)
     DO UPDATE SET total_xp = total_xp + excluded.total_xp, updated_at = datetime('now')`).run(e,a,(0,r.calculateLevel)(a))},"connectServer",0,function(e,t,r,a){n().prepare(`INSERT OR REPLACE INTO community_servers (id, name, url, api_key_hash)
     VALUES (?, ?, ?, ?)`).run(e,t,r,a)},"createInviteToken",0,function(e,t,r,a,o,s){n().prepare(`INSERT INTO invite_tokens (id, code, token_hash, created_by, server_url, max_uses)
     VALUES (?, ?, ?, ?, ?, ?)`).run(e,t,r,a,o??null,s??1)},"disconnectServer",0,function(e){n().prepare("UPDATE community_servers SET status = 'disconnected' WHERE id = ?").run(e)},"getAggregateXp",0,function(){let e=n().prepare(`SELECT COALESCE(SUM(total_xp), 0) AS total_xp,
              COALESCE(MAX(current_level), 1) AS current_level,
              MAX(updated_at) AS updated_at
       FROM user_levels`).get();return{apiKeyId:"*",totalXp:e?.total_xp??0,currentLevel:e?.current_level??1,updatedAt:e?.updated_at??""}},"getAllEarnedBadges",0,function(){return n().prepare(`SELECT ub.badge_id, MIN(ub.unlocked_at) AS unlocked_at,
              bd.name, bd.description, bd.icon, bd.category, bd.rarity
       FROM user_badges ub
       JOIN badge_definitions bd ON bd.id = ub.badge_id
       GROUP BY ub.badge_id`).all().map(e=>({apiKeyId:"*",badgeId:e.badge_id,unlockedAt:e.unlocked_at,badgeName:e.name,badgeDescription:e.description,badgeIcon:e.icon,badgeCategory:e.category,badgeRarity:e.rarity}))},"getBadgeDefinitions",0,function(e){let t=e?"SELECT * FROM badge_definitions WHERE category = ?":"SELECT * FROM badge_definitions";return(e?n().prepare(t).all(e):n().prepare(t).all()).map(e=>({id:e.id,name:e.name,description:e.description,icon:e.icon,category:e.category,rarity:e.rarity,criteria:e.criteria,hidden:e.hidden,createdAt:e.created_at}))},"getBadges",0,function(e){return n().prepare(`SELECT ub.api_key_id, ub.badge_id, ub.unlocked_at,
            bd.name, bd.description, bd.icon, bd.category, bd.rarity
     FROM user_badges ub
     JOIN badge_definitions bd ON bd.id = ub.badge_id
     WHERE ub.api_key_id = ?`).all(e).map(e=>({apiKeyId:e.api_key_id,badgeId:e.badge_id,unlockedAt:e.unlocked_at,badgeName:e.name,badgeDescription:e.description,badgeIcon:e.icon,badgeCategory:e.category,badgeRarity:e.rarity}))},"getBalance",0,a,"getConnectedServerByKeyHash",0,function(e){return n().prepare("SELECT id FROM community_servers WHERE api_key_hash = ? AND status = 'connected'").get(e)},"getHistory",0,function(e,t){return n().prepare(`SELECT * FROM token_ledger
     WHERE from_api_key_id = ? OR to_api_key_id = ?
     ORDER BY created_at DESC LIMIT ?`).all(e,e,t).map(e=>({id:e.id,fromApiKeyId:e.from_api_key_id,toApiKeyId:e.to_api_key_id,amount:e.amount,reason:e.reason,idempotencyKey:e.idempotency_key,createdAt:e.created_at}))},"getInviteByCode",0,function(e){let t=n().prepare("SELECT * FROM invite_tokens WHERE code = ?").get(e);return t?{id:t.id,code:t.code,tokenHash:t.token_hash,createdBy:t.created_by,usedBy:t.used_by,serverUrl:t.server_url,maxUses:t.max_uses,useCount:t.use_count,expiresAt:t.expires_at,revokedAt:t.revoked_at,createdAt:t.created_at}:null},"getLeaderboardNeighbors",0,function(e,t,r=5){let a=n(),o=a.prepare("SELECT score FROM leaderboard WHERE api_key_id = ? AND scope = ?").get(e,t);if(!o)return{above:[],below:[]};let s=a.prepare(`SELECT api_key_id, score FROM leaderboard
       WHERE scope = ? AND score > ?
       ORDER BY score ASC LIMIT ?`).all(t,o.score,r),i=a.prepare(`SELECT api_key_id, score FROM leaderboard
       WHERE scope = ? AND score < ?
       ORDER BY score DESC LIMIT ?`).all(t,o.score,r);return{above:s.reverse().map(e=>({apiKeyId:e.api_key_id,score:e.score})),below:i.map(e=>({apiKeyId:e.api_key_id,score:e.score}))}},"getRank",0,function(e,t){let r=n().prepare("SELECT score FROM leaderboard WHERE api_key_id = ? AND scope = ?").get(e,t);return r?n().prepare("SELECT COUNT(*) + 1 AS rank FROM leaderboard WHERE scope = ? AND score > ?").get(t,r.score).rank:0},"getTopN",0,function(e,t,r=0){let a=Number.isFinite(t)?Math.min(Math.max(Math.trunc(t),0),200):0,o=Number.isFinite(r)?Math.max(Math.trunc(r),0):0;return n().prepare(`SELECT api_key_id, scope, score, updated_at FROM leaderboard
     WHERE scope = ? ORDER BY score DESC LIMIT ? OFFSET ?`).all(e,a,o).map(e=>({apiKeyId:e.api_key_id,scope:e.scope,score:e.score,updatedAt:e.updated_at}))},"getXp",0,function(e){let t=n().prepare("SELECT api_key_id, total_xp, current_level, updated_at FROM user_levels WHERE api_key_id = ?").get(e);return t?{apiKeyId:t.api_key_id,totalXp:t.total_xp,currentLevel:t.current_level,updatedAt:t.updated_at}:null},"hasBadge",0,function(e,t){return!!n().prepare("SELECT 1 FROM user_badges WHERE api_key_id = ? AND badge_id = ? LIMIT 1").get(e,t)},"listServers",0,function(){return n().prepare("SELECT id, name, url, connected_at, last_sync_at, status, error_message FROM community_servers").all().map(e=>({id:e.id,name:e.name,url:e.url,connectedAt:e.connected_at,lastSyncAt:e.last_sync_at,status:e.status,errorMessage:e.error_message}))},"redeemInvite",0,function(e,t){return n().prepare(`UPDATE invite_tokens
     SET use_count = use_count + 1, used_by = ?
     WHERE code = ? AND revoked_at IS NULL
       AND use_count < max_uses
       AND (expires_at IS NULL OR expires_at > datetime('now'))`).run(t,e).changes>0},"revokeInvite",0,function(e){n().prepare("UPDATE invite_tokens SET revoked_at = datetime('now') WHERE id = ?").run(e)},"rotateLeaderboardScope",0,function(e){let t=n(),r="weekly"===e?`week_${new Date().toISOString().slice(0,10)}`:`month_${new Date().toISOString().slice(0,7)}`;if(t.prepare("SELECT COUNT(*) AS cnt FROM leaderboard WHERE scope = ?").get(r).cnt>0)return;let a=t.prepare("SELECT api_key_id, score, updated_at FROM leaderboard WHERE scope = ?").all(e);if(a.length>0){let e=t.prepare("INSERT OR IGNORE INTO leaderboard (api_key_id, scope, score, updated_at) VALUES (?, ?, ?, ?)");for(let t of a)e.run(t.api_key_id,r,t.score,t.updated_at)}t.prepare("DELETE FROM leaderboard WHERE scope = ?").run(e)},"transferTokens",0,function(e,r,n,o,s){let i=(0,t.getDbInstance)();return i.transaction(()=>i.prepare("SELECT id FROM token_ledger WHERE idempotency_key = ?").get(s)?{success:!0}:a(e)<n?{success:!1,error:"insufficient_balance"}:(i.prepare(`INSERT INTO token_ledger (from_api_key_id, to_api_key_id, amount, reason, idempotency_key)
         VALUES (?, ?, ?, ?, ?)`).run(e,r,n,o,s),{success:!0}))()},"unlockBadge",0,function(e,t){n().prepare("INSERT OR IGNORE INTO user_badges (api_key_id, badge_id) VALUES (?, ?)").run(e,t)},"updateLevel",0,function(e,t){n().prepare(`INSERT INTO user_levels (api_key_id, total_xp, current_level, updated_at)
     VALUES (?, 0, ?, datetime('now'))
     ON CONFLICT(api_key_id)
     DO UPDATE SET current_level = ?, updated_at = datetime('now')`).run(e,t,t)},"updateScore",0,function(e,t,r){n().prepare(`INSERT INTO leaderboard (api_key_id, scope, score, updated_at)
     VALUES (?, ?, ?, datetime('now'))
     ON CONFLICT(api_key_id, scope)
     DO UPDATE SET score = score + excluded.score, updated_at = datetime('now')`).run(e,t,r)}])},682815,e=>{"use strict";var t=e.i(899378);function r(e){return{host:e.host,enabled:1===e.enabled,label:e.label,kind:e.kind,added_at:e.added_at,last_seen_at:e.last_seen_at}}e.s(["addCustomHost",0,function(e,r="custom",n){let a=(0,t.getDbInstance)(),o=new Date().toISOString();a.prepare(`INSERT OR IGNORE INTO inspector_custom_hosts (host, enabled, label, kind, added_at)
     VALUES (?, 1, ?, ?, ?)`).run(e,n??null,r,o)},"isCustomHost",0,function(e){return void 0!==(0,t.getDbInstance)().prepare("SELECT 1 AS found FROM inspector_custom_hosts WHERE host = ? AND enabled = 1").get(e)},"listCustomHosts",0,function(e){let n=(0,t.getDbInstance)();return(e?.enabledOnly===!0?n.prepare("SELECT * FROM inspector_custom_hosts WHERE enabled = 1 ORDER BY host ASC").all():n.prepare("SELECT * FROM inspector_custom_hosts ORDER BY host ASC").all()).map(r)},"removeCustomHost",0,function(e){(0,t.getDbInstance)().prepare("DELETE FROM inspector_custom_hosts WHERE host = ?").run(e)},"toggleCustomHost",0,function(e,r){(0,t.getDbInstance)().prepare("UPDATE inspector_custom_hosts SET enabled = ? WHERE host = ?").run(+!!r,e)},"touchLastSeen",0,function(e){let r=(0,t.getDbInstance)(),n=new Date().toISOString();r.prepare("UPDATE inspector_custom_hosts SET last_seen_at = ? WHERE host = ?").run(n,e)}])},422359,e=>{"use strict";var t=e.i(899378);function r(e){return{id:e.id,type:e.type,cron:e.cron,intervalMs:e.interval_ms,enabled:1===e.enabled,envFlag:e.env_flag,config:e.config?JSON.parse(e.config):{},createdAt:e.created_at,updatedAt:e.updated_at}}function n(e){return{id:e.id,jobId:e.job_id,startedAt:e.started_at,finishedAt:e.finished_at,status:e.status,errorMessage:e.error_message,recordsAffected:e.records_affected??0,durationMs:e.duration_ms}}e.s(["cleanupOrphanedRuns",0,function(e=5){let r=(0,t.getDbInstance)(),n=new Date(Date.now()-6e4*e).toISOString();r.prepare(`UPDATE job_runs
     SET status = 'failure',
         error_message = 'orphaned: exceeded timeout',
         finished_at = datetime('now')
     WHERE status = 'running' AND started_at < ?`).run(n)},"getAllJobs",0,function(){return(0,t.getDbInstance)().prepare("SELECT * FROM jobs ORDER BY id").all().map(r)},"getJob",0,function(e){let n=(0,t.getDbInstance)().prepare("SELECT * FROM jobs WHERE id = ?").get(e);return n?r(n):null},"getRuns",0,function(e,r=20){return(0,t.getDbInstance)().prepare("SELECT * FROM job_runs WHERE job_id = ? ORDER BY started_at DESC LIMIT ?").all(e,r).map(n)},"pruneRuns",0,function(e,r=100,n=30){let a=(0,t.getDbInstance)(),o=new Date(Date.now()-864e5*n).toISOString();a.prepare(`DELETE FROM job_runs
     WHERE job_id = ?
       AND id NOT IN (
         SELECT id FROM job_runs WHERE job_id = ? ORDER BY started_at DESC LIMIT ?
       )
       AND started_at < ?`).run(e,e,r,o)},"recordRun",0,function(e,r,n={}){let a=(0,t.getDbInstance)(),o=n.startedAt??new Date().toISOString(),s="running"===r?null:n.startedAt&&null!=n.durationMs?new Date(new Date(n.startedAt).getTime()+n.durationMs).toISOString():new Date().toISOString();a.prepare(`INSERT INTO job_runs (job_id, started_at, finished_at, status, error_message, records_affected, duration_ms)
     VALUES (?, ?, ?, ?, ?, ?, ?)`).run(e,o,s,r,n.errorMessage??null,n.recordsAffected??0,n.durationMs??null)},"updateJobEnabled",0,function(e,r){(0,t.getDbInstance)().prepare("UPDATE jobs SET enabled = ?, updated_at = datetime('now') WHERE id = ?").run(+!!r,e)},"upsertJob",0,function(e){(0,t.getDbInstance)().prepare(`INSERT INTO jobs (id, type, cron, interval_ms, enabled, env_flag, config, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
     ON CONFLICT(id) DO UPDATE SET
       type = excluded.type,
       cron = excluded.cron,
       interval_ms = excluded.interval_ms,
       env_flag = excluded.env_flag,
       config = excluded.config,
       updated_at = datetime('now')`).run(e.id,e.type,e.cron,e.intervalMs,+!!e.enabled,e.envFlag,JSON.stringify(e.config??{}),e.createdAt)}])},68392,e=>{"use strict";let t=e.i(295177).routingConfigRepositories.modelComboMappings;e.s(["createModelComboMapping",0,function(e){return t.create(e)},"deleteModelComboMapping",0,function(e){return t.deleteById(e)},"getModelComboMappingById",0,function(e){return t.findById(e)},"getModelComboMappings",0,function(e){return t.list(e)},"resolveComboForModel",0,function(e){return t.resolveForModel(e)},"updateModelComboMapping",0,function(e,r){return t.update(e,r)}])},469960,e=>{"use strict";var t=e.i(899378),r=e.i(529646);function n(e){let t=(0,r.rowToCamel)(e)??{};return{model:String(t.model??""),source:String(t.source??""),category:String(t.category??""),score:"number"==typeof t.score?t.score:0,eloRaw:"number"==typeof t.eloRaw?t.eloRaw:null,confidence:"string"==typeof t.confidence?t.confidence:null,syncedAt:String(t.syncedAt??""),expiresAt:"string"==typeof t.expiresAt?t.expiresAt:null}}function a(e,r){let a=(0,t.getDbInstance)().prepare(`SELECT * FROM model_intelligence
       WHERE model = ? AND category = ?
         AND source IN ('user_override', 'arena_elo', 'models_dev_tier')
         AND (expires_at IS NULL OR datetime(expires_at) > datetime('now'))
       ORDER BY CASE source
         WHEN 'user_override' THEN 1
         WHEN 'arena_elo' THEN 2
         WHEN 'models_dev_tier' THEN 3
       END
       LIMIT 1`).get(e,r);return a?n(a):null}function o(e){(0,t.getDbInstance)().prepare(`INSERT OR REPLACE INTO model_intelligence
       (model, source, category, score, elo_raw, confidence, synced_at, expires_at)
     VALUES (?, ?, ?, ?, ?, ?, datetime('now'), ?)`).run(e.model,e.source,e.category,e.score,e.eloRaw??null,e.confidence??null,e.expiresAt??null)}function s(e,r,n){return((0,t.getDbInstance)().prepare(`DELETE FROM model_intelligence
       WHERE model = ? AND source = ? AND category = ?`).run(e,r,n).changes??0)>0}e.s(["bulkUpsertModelIntelligence",0,function(e){if(0===e.length)return 0;let r=(0,t.getDbInstance)(),n=r.prepare(`INSERT OR REPLACE INTO model_intelligence
       (model, source, category, score, elo_raw, confidence, synced_at, expires_at)
     VALUES (?, ?, ?, ?, ?, ?, datetime('now'), ?)`);return r.transaction(()=>{let t=0;for(let r of e)n.run(r.model,r.source,r.category,r.score,r.eloRaw??null,r.confidence??null,r.expiresAt??null),t++;return t})()},"deleteExpiredIntelligence",0,function(e){let r=(0,t.getDbInstance)(),n=["expires_at IS NOT NULL","datetime(expires_at) < datetime('now')"],a=[];e&&(n.push("source = ?"),a.push(e));let o=n.join(" AND ");return r.prepare(`DELETE FROM model_intelligence WHERE ${o}`).run(...a).changes??0},"deleteModelIntelligence",0,s,"deleteModelIntelligenceBySource",0,function(e){return(0,t.getDbInstance)().prepare("DELETE FROM model_intelligence WHERE source = ?").run(e).changes??0},"deleteUserFitnessOverrideEntry",0,function(e,t){return s(e.toLowerCase(),"user_override",t.toLowerCase())},"getModelIntelligence",0,a,"getModelIntelligenceBySource",0,function(e,r,a){let o=(0,t.getDbInstance)().prepare(`SELECT * FROM model_intelligence
       WHERE model = ? AND source = ? AND category = ?
         AND (expires_at IS NULL OR datetime(expires_at) > datetime('now'))`).get(e,r,a);return o?n(o):null},"getResolvedTaskFitness",0,function(e,t){let r=a(e,t);return r?r.score:null},"listModelIntelligence",0,function(e){let r=(0,t.getDbInstance)(),a=[],o=[];e?.source&&(a.push("source = ?"),o.push(e.source)),e?.category&&(a.push("category = ?"),o.push(e.category));let s=a.length>0?`WHERE ${a.join(" AND ")}`:"",i=`SELECT * FROM model_intelligence ${s} ORDER BY model ASC, source ASC, category ASC`;return r.prepare(i).all(...o).map(n)},"setUserFitnessOverrideEntry",0,function(e,t,r){o({model:e.toLowerCase(),source:"user_override",category:t.toLowerCase(),score:Math.max(0,Math.min(1,r)),eloRaw:null,confidence:null,expiresAt:null})},"upsertModelIntelligence",0,o])},131470,e=>{"use strict";var t=e.i(899378);let r=(0,e.i(758303).logger)("DB_PLUGINS");function n(e){return{id:e.id,name:e.name,version:e.version,description:e.description,author:e.author,license:e.license,main:e.main,source:e.source,tags:e.tags,status:e.status,enabled:e.enabled,manifest:e.manifest,config:e.config,configSchema:e.config_schema,hooks:e.hooks,permissions:e.permissions,pluginDir:e.plugin_dir,errorMessage:e.error_message,installedAt:e.installed_at,updatedAt:e.updated_at,activatedAt:e.activated_at}}function a(e){let r=(0,t.getDbInstance)().prepare("SELECT * FROM plugins WHERE name = ?").get(e);return r?n(r):null}e.s(["deletePlugin",0,function(e){let n=(0,t.getDbInstance)().prepare("DELETE FROM plugins WHERE name = ?").run(e);return n.changes>0&&r.info("plugin.deleted",{name:e}),n.changes>0},"getPluginAnalytics",0,function(e){return(0,t.getDbInstance)().prepare(`SELECT plugin_name, hook, duration_ms, success, error_message, created_at
       FROM plugin_analytics
       WHERE plugin_name = ?
       ORDER BY created_at DESC`).all(e).map(e=>({pluginName:e.plugin_name,hook:e.hook,durationMs:e.duration_ms,success:1===e.success,errorMessage:e.error_message,createdAt:e.created_at}))},"getPluginAnalyticsSummary",0,function(e){let r=(0,t.getDbInstance)().prepare(`SELECT
         COUNT(*) AS total,
         SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) AS successes,
         SUM(CASE WHEN success = 0 THEN 1 ELSE 0 END) AS failures,
         AVG(duration_ms) AS avg_duration
       FROM plugin_analytics
       WHERE plugin_name = ?`).get(e);return{totalCalls:r?.total??0,successCount:r?.successes??0,failureCount:r?.failures??0,avgDurationMs:r?.avg_duration??0}},"getPluginById",0,function(e){let r=(0,t.getDbInstance)().prepare("SELECT * FROM plugins WHERE id = ?").get(e);return r?n(r):null},"getPluginByName",0,a,"insertPlugin",0,function(e){let n=(0,t.getDbInstance)(),o=new Date().toISOString();n.prepare(`INSERT INTO plugins (
      id, name, version, description, author, license, main, source, tags,
      status, enabled, manifest, config, config_schema, hooks, permissions,
      plugin_dir, installed_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(e.id,e.name,e.version,e.description??null,e.author??null,e.license??"MIT",e.main,e.source??"local",JSON.stringify(e.tags??[]),e.status??"installed",+!!e.enabled,JSON.stringify(e.manifest),JSON.stringify(e.config??{}),JSON.stringify(e.configSchema??{}),JSON.stringify(e.hooks??[]),JSON.stringify(e.permissions??[]),e.pluginDir,o,o),r.info("plugin.inserted",{id:e.id,name:e.name});let s=a(e.name);if(!s)throw Error(`Failed to retrieve plugin '${e.name}' after insertion`);return s},"listPlugins",0,function(e){let r=(0,t.getDbInstance)();return(e?r.prepare("SELECT * FROM plugins WHERE status = ? ORDER BY name").all(e):r.prepare("SELECT * FROM plugins ORDER BY name").all()).map(n)},"pluginExists",0,function(e){return!!(0,t.getDbInstance)().prepare("SELECT 1 FROM plugins WHERE name = ?").get(e)},"updatePluginConfig",0,function(e,r){let n=(0,t.getDbInstance)(),a=new Date().toISOString();return n.prepare("UPDATE plugins SET config = ?, updated_at = ? WHERE name = ?").run(JSON.stringify(r),a,e).changes>0},"updatePluginStatus",0,function(e,n,a){let o=(0,t.getDbInstance)(),s=new Date().toISOString(),i="active"===n?s:null,l=o.prepare(`UPDATE plugins SET status = ?, enabled = ?, error_message = ?,
       updated_at = ?, activated_at = COALESCE(?, activated_at)
       WHERE name = ?`).run(n,+("active"===n),a??null,s,i,e);return l.changes>0&&r.info("plugin.status_updated",{name:e,status:n}),l.changes>0}])},829422,e=>{"use strict";var t=e.i(268372),r=e.i(899378);let n="providerLimitsCache";function a(e){try{return JSON.parse(e)}catch{return null}}function o(e){return e&&"object"==typeof e&&!Array.isArray(e)?e:null}function s(e){let{billing:r,...n}=e,a=(0,t.sanitizeProviderBillingStatus)(r);return a?{...n,billing:a}:n}function i(e){let r=o(e);if(!r)return null;let n="string"==typeof r.fetchedAt&&r.fetchedAt.trim()?r.fetchedAt:null;if(!n)return null;let a=Number(r.bankedResetCredits),s=(0,t.sanitizeProviderBillingStatus)(r.billing);return{quotas:o(r.quotas),plan:r.plan??null,message:"string"==typeof r.message?r.message:null,fetchedAt:n,source:"string"==typeof r.source?r.source:null,...Number.isFinite(a)?{bankedResetCredits:a}:{},...s?{billing:s}:{}}}e.s(["deleteProviderLimitsCache",0,function(e){r.isBuildPhase||r.isCloud||(0,r.getDbInstance)().prepare("DELETE FROM key_value WHERE namespace = ? AND key = ?").run(n,e)},"getAllProviderLimitsCache",0,function(){if(r.isBuildPhase||r.isCloud)return{};let e=(0,r.getDbInstance)().prepare("SELECT key, value FROM key_value WHERE namespace = ?").all(n),t={};for(let r of e){let e=i(a(r.value));e&&(t[r.key]=e)}return t},"getProviderLimitsCache",0,function(e){if(r.isBuildPhase||r.isCloud)return null;let t=(0,r.getDbInstance)().prepare("SELECT value FROM key_value WHERE namespace = ? AND key = ?").get(n,e);return t?.value?i(a(t.value)):null},"setProviderLimitsCache",0,function(e,t){let a=s(t);return r.isBuildPhase||r.isCloud||(0,r.getDbInstance)().prepare("INSERT OR REPLACE INTO key_value (namespace, key, value) VALUES (?, ?, ?)").run(n,e,JSON.stringify(a)),a},"setProviderLimitsCacheBatch",0,function(e){if(r.isBuildPhase||r.isCloud||0===e.length)return 0;let t=(0,r.getDbInstance)(),a=t.prepare("INSERT OR REPLACE INTO key_value (namespace, key, value) VALUES (?, ?, ?)");return t.transaction(e=>{for(let t of e)a.run(n,t.connectionId,JSON.stringify(s(t.entry)))})(e),e.length}])},683844,e=>{"use strict";var t=e.i(899378);e.s(["EGRESS_IP_LOOKUP_WINDOW_MS",0,864e5,"exportProxyLogsSince",0,function(e){return(0,t.getDbInstance)().prepare("SELECT * FROM proxy_logs WHERE timestamp >= @since ORDER BY timestamp DESC").all({since:e})},"getRecentEgressIpForConnection",0,function(e,r){let n=(0,t.getDbInstance)().prepare(`SELECT egress_ip, timestamp FROM proxy_logs
       WHERE connection_id = ? AND egress_ip IS NOT NULL AND timestamp >= ?
       ORDER BY timestamp DESC LIMIT 1`).get(e,r);return n?{egressIp:n.egress_ip,at:n.timestamp}:null}])},188693,e=>{"use strict";var t=e.i(899378);function r(e){if("number"==typeof e&&Number.isFinite(e))return e;if("string"==typeof e&&e.trim()){let t=Number(e);return Number.isFinite(t)?t:null}return null}function n(e){return null!==e&&Number.isFinite(e)?Math.max(0,Math.min(100,e)):null}function a(e){let t=n(e);return null===t?null:Math.max(0,Math.min(100,100-t))}function o(e,t){return null!==e&&(t<=1&&e>t||e-t>=5)}function s(e){if(!e)return null;let t=Date.parse(e);return Number.isFinite(t)?new Date(t).toISOString():null}function i(e){let t=s(e);return t?t.slice(0,10):null}function l(e,r,u=Date.now()){let c=function(e,r,n=Date.now()){if(!e||!r)return null;let a=i(r);if(!a)return null;let o=(0,t.getDbInstance)(),l=new Date(n).toISOString();try{for(let t of o.prepare(`
        SELECT
          window_started_at as windowStartedAt,
          window_resets_at as windowResetsAt,
          observed_at as observedAt
        FROM provider_quota_reset_events
        WHERE connection_id = @connectionId
          AND LOWER(window_key) LIKE '%weekly%'
          AND LOWER(window_key) NOT LIKE '%sonnet%'
          AND observed_at <= @nowIso
        ORDER BY observed_at DESC, id DESC
      `).all({connectionId:e,nowIso:l}))if(i(t.windowResetsAt)===a)return s(t.windowStartedAt);return null}catch(e){if(e instanceof Error&&e.message.includes("no such table"))return null;throw e}}(e,r,u),d=function(e,r,l=Date.now()){if(!e||!r)return null;let u=i(r);if(!u)return null;let c=(0,t.getDbInstance)(),d=new Date(l).toISOString();try{let t=c.prepare(`
        SELECT
          next_reset_at as nextResetAt,
          remaining_percentage as remainingPercentage,
          created_at as createdAt
        FROM quota_snapshots
        WHERE connection_id = @connectionId
          AND LOWER(window_key) LIKE '%weekly%'
          AND LOWER(window_key) NOT LIKE '%sonnet%'
          AND created_at <= @nowIso
        ORDER BY created_at ASC, id ASC
      `).all({connectionId:e,nowIso:d}),r=null,l=null,p=null;for(let e of t){let t=s(e.createdAt);if(!t||i(e.nextResetAt)!==u)continue;r||(r=t);let c=a(n(e.remainingPercentage));null!==c&&(o(p,c)&&(l=t),p=c)}if(l)return{windowStartIso:l,resetDrop:!0};if(r)return{windowStartIso:r,resetDrop:!1};return null}catch(e){if(e instanceof Error&&e.message.includes("no such table"))return null;throw e}}(e,r,u);if(!c&&!d)return null;if(!c&&d)return{windowStartIso:d.windowStartIso,source:"observed_snapshot_reset"};if(c&&!d)return{windowStartIso:c,source:"recorded_reset_event"};let p=Date.parse(c),_=Date.parse(d.windowStartIso);return d.resetDrop&&Number.isFinite(p)&&Number.isFinite(_)&&_>p?{windowStartIso:d.windowStartIso,source:"observed_snapshot_reset"}:{windowStartIso:c,source:"recorded_reset_event"}}e.s(["getProviderQuotaWindowStart",0,l,"getProviderQuotaWindowStartIso",0,function(e,t,r=Date.now()){return l(e,t,r)?.windowStartIso??null},"recordProviderQuotaResetEventIfChanged",0,function(e){let l;if(!e.connectionId||!e.windowKey||!(((l=e.windowKey.toLowerCase().replace(/[^a-z0-9]+/g," ").trim()).includes("weekly")||l.includes("7d"))&&!l.includes("sonnet")))return;let u=s(e.currentResetAt);if(!u)return;let c=e.previousObservation??function(e,n){let a=(0,t.getDbInstance)();try{let t=a.prepare(`
        SELECT
          next_reset_at as nextResetAt,
          remaining_percentage as remainingPercentage
        FROM quota_snapshots
        WHERE connection_id = ?
          AND LOWER(window_key) = LOWER(?)
          AND next_reset_at IS NOT NULL
        ORDER BY created_at DESC, id DESC
        LIMIT 1
      `).get(e,n);if(!t)return null;return{resetAt:t.nextResetAt,remainingPercentage:r(t.remainingPercentage)}}catch(e){if(e instanceof Error&&e.message.includes("no such table"))return null;throw e}}(e.connectionId,e.windowKey),d=s(c?.resetAt??null);if(!d)return;let p=Date.parse(d),_=Date.parse(u);if(!Number.isFinite(p)||!Number.isFinite(_))return;let E=n(r(c?.remainingPercentage)),g=n(r(e.currentRemainingPercentage)),m=s(e.observedAt??null)??new Date().toISOString(),S=a(E),f=a(g),y=_>p&&i(d)!==i(u),h=i(d)===i(u)&&null!==f&&o(S,f);if(!y&&!h)return;let b=y?d:m;try{(0,t.getDbInstance)().prepare(`
      INSERT OR IGNORE INTO provider_quota_reset_events
        (provider, connection_id, window_key, window_started_at, window_resets_at,
         observed_at, previous_remaining_percentage, new_remaining_percentage,
         previous_used_percentage, new_used_percentage, raw_data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(e.provider,e.connectionId,e.windowKey,b,u,m,E,g,S,f,null)}catch(e){if(e instanceof Error&&e.message.includes("no such table"))return;throw e}}])},517551,e=>{"use strict";var t=e.i(899378),r=e.i(529646);let n=0;e.s(["cleanupOldSnapshots",0,function(e=90){let r=Date.now();if(r-n<216e5)return 0;let a=(0,t.getDbInstance)(),o=new Date(Date.now()-24*e*36e5).toISOString();try{let e=a.prepare("DELETE FROM quota_snapshots WHERE created_at < ?").run(o);return n=r,e.changes}catch(e){if(e?.message?.includes("no such table"))return 0;throw e}},"getAggregatedSnapshots",0,function(e){let r=(0,t.getDbInstance)(),n=["created_at >= ?"],a=[e.since];e.provider&&(n.push("provider = ?"),a.push(e.provider)),e.until&&(n.push("created_at <= ?"),a.push(e.until));let o=60*Number(e.bucketMinutes);if(!Number.isFinite(o)||o<=0)throw Error("Invalid bucket size");let s="connection"===e.aggregateBy?"bucket, provider, connection_id, window_key":"bucket, provider, window_key",i="connection"===e.aggregateBy?"provider || ':' || connection_id as provider":"provider";try{let e=`
      SELECT
        datetime((strftime('%s', created_at) / ${o}) * ${o}, 'unixepoch') as bucket,
        ${i},
        AVG(remaining_percentage) as remainingPct,
        MAX(is_exhausted) as isExhausted,
        window_key
      FROM quota_snapshots
      WHERE ${n.join(" AND ")}
      GROUP BY ${s}
      ORDER BY bucket ASC
    `;return r.prepare(e).all(...a).map(e=>({timestamp:e.bucket,provider:e.provider,remainingPct:e.remainingPct??0,isExhausted:1===e.isExhausted,windowKey:e.windowKey}))}catch(e){if(e?.message?.includes("no such table"))return[];throw e}},"getLatestQuotaSnapshotsForConnection",0,function(e){let n=(0,t.getDbInstance)();try{return n.prepare(`SELECT * FROM (
           SELECT *, ROW_NUMBER() OVER (
             PARTITION BY window_key ORDER BY created_at DESC, id DESC
           ) AS rn
           FROM quota_snapshots
           WHERE connection_id = ?
         )
         WHERE rn = 1`).all(e).map(e=>(0,r.rowToCamel)(e))}catch(e){if(e?.message?.includes("no such table"))return[];throw e}},"getQuotaSnapshots",0,function(e){let n=(0,t.getDbInstance)(),a=["created_at >= ?"],o=[e.since];e.provider&&(a.push("provider = ?"),o.push(e.provider)),e.connectionId&&(a.push("connection_id = ?"),o.push(e.connectionId)),e.until&&(a.push("created_at <= ?"),o.push(e.until));try{let e=`SELECT * FROM quota_snapshots WHERE ${a.join(" AND ")} ORDER BY created_at ASC`;return n.prepare(e).all(...o).map(e=>(0,r.rowToCamel)(e))}catch(e){if(e?.message?.includes("no such table"))return[];throw e}},"saveQuotaSnapshot",0,function(e){let r=(0,t.getDbInstance)(),n=new Date().toISOString();try{r.prepare(`INSERT INTO quota_snapshots
       (provider, connection_id, window_key, remaining_percentage, is_exhausted,
        next_reset_at, window_duration_ms, raw_data, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(e.provider,e.connection_id,e.window_key,e.remaining_percentage,e.is_exhausted,e.next_reset_at,e.window_duration_ms,e.raw_data,n)}catch(e){if(e?.message?.includes("no such table"))return void console.warn("[QuotaSnapshots] Skipping save: quota_snapshots table not found. Awaiting migration.");throw e}}])},984844,e=>{"use strict";var t=e.i(899378),r=e.i(507238);let n=/^[a-z0-9][a-z0-9._-]{0,99}$/i,a=/[\u0000-\u001f\u007f]/;function o(e,t){let r="string"==typeof e?e.trim():"",o="string"==typeof t?t.trim():"";return!n.test(r)||o.length<1||o.length>200||a.test(o)?null:{provider:r,modelId:o}}function s(e){return{provider:e.provider,modelId:e.model_id,displayName:e.display_name,enabled:null===e.enabled?null:1===e.enabled,tombstoned:1===e.tombstoned,updatedAt:e.updated_at}}function i(e,r){return(0,t.getDbInstance)().prepare(`SELECT provider, model_id, display_name, enabled, tombstoned, updated_at
         FROM radar_local_model_state WHERE provider = ? AND model_id = ?`).get(e,r)??null}function l(e){let r=(0,t.getDbInstance)();null!==e.displayName||null!==e.enabled||e.tombstoned?r.prepare(`INSERT INTO radar_local_model_state
       (provider, model_id, display_name, enabled, tombstoned, updated_at)
     VALUES (?, ?, ?, ?, ?, datetime('now'))
     ON CONFLICT(provider, model_id) DO UPDATE SET
       display_name = excluded.display_name,
       enabled = excluded.enabled,
       tombstoned = excluded.tombstoned,
       updated_at = excluded.updated_at`).run(e.provider,e.modelId,e.displayName,null===e.enabled?null:+!!e.enabled,+!!e.tombstoned):r.prepare("DELETE FROM radar_local_model_state WHERE provider = ? AND model_id = ?").run(e.provider,e.modelId)}function u(){return(0,t.getDbInstance)().prepare(`SELECT provider, model_id, display_name, enabled, tombstoned, updated_at
       FROM radar_local_model_state ORDER BY provider, model_id`).all().map(s)}e.s(["clearRadarLocalModelOverride",0,function(e,r){let n=o(e,r);return!!n&&((0,t.getDbInstance)().transaction(()=>{let e=i(n.provider,n.modelId);l({...n,displayName:null,enabled:null,tombstoned:e?.tombstoned===1})})(),!0)},"getRadarCache",0,function(){return(0,t.getDbInstance)().prepare("SELECT version, tier, payload, signature, fetched_at AS fetchedAt FROM radar_feed_cache WHERE id = 1").get()??null},"getRadarIntelCache",0,function(){return(0,t.getDbInstance)().prepare("SELECT version, tier, payload, signature, supporter_identity AS supporterIdentity, fetched_at AS fetchedAt FROM radar_intel_cache WHERE id = 1").get()??null},"getRadarLocalMergeState",0,function(){let e=new Map,t=new Set;for(let r of u()){let n=`${r.provider}:${r.modelId}`,a={};null!==r.displayName&&(a.displayName=r.displayName),null!==r.enabled&&(a.enabled=r.enabled),Object.keys(a).length>0&&e.set(n,a),r.tombstoned&&t.add(n)}return{localOverrides:e,tombstones:t}},"getRadarOffersCache",0,function(){return(0,t.getDbInstance)().prepare("SELECT version, tier, payload, signature, fetched_at AS fetchedAt FROM radar_offers_cache WHERE id = 1").get()??null},"getRadarReferralsCache",0,function(){return(0,t.getDbInstance)().prepare("SELECT generated_at AS generatedAt, tier, payload, signature, fetched_at AS fetchedAt FROM radar_referrals_cache WHERE id = 1").get()??null},"getRadarSettings",0,function(){let e=(0,t.getDbInstance)().prepare("SELECT opt_in, supporter_key_encrypted, updated_at FROM radar_settings WHERE id = 1").get();return{optIn:1===e.opt_in,supporterKey:(0,r.decrypt)(e.supporter_key_encrypted)??null,updatedAt:e.updated_at}},"listRadarLocalModelState",0,u,"setRadarCache",0,function(e){let r=(0,t.getDbInstance)(),n=e.fetchedAt??new Date().toISOString();r.prepare(`INSERT INTO radar_feed_cache (id, version, tier, payload, signature, fetched_at)
     VALUES (1, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       version    = excluded.version,
       tier       = excluded.tier,
       payload    = excluded.payload,
       signature  = excluded.signature,
       fetched_at = excluded.fetched_at`).run(e.version,e.tier,e.payload,e.signature,n)},"setRadarIntelCache",0,function(e){let r=e.fetchedAt??new Date().toISOString();(0,t.getDbInstance)().prepare(`INSERT INTO radar_intel_cache
         (id, version, tier, payload, signature, supporter_identity, fetched_at)
       VALUES (1, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         version = excluded.version,
         tier = excluded.tier,
         payload = excluded.payload,
         signature = excluded.signature,
         supporter_identity = excluded.supporter_identity,
         fetched_at = excluded.fetched_at`).run(e.version,e.tier,e.payload,e.signature,e.supporterIdentity,r)},"setRadarKey",0,function(e){let n=(0,t.getDbInstance)(),a=null!==e?(0,r.encrypt)(e):null,o=n.prepare("UPDATE radar_settings SET supporter_key_encrypted = ?, updated_at = datetime('now') WHERE id = 1"),s=n.prepare("DELETE FROM radar_feed_cache WHERE id = 1"),i=n.prepare("DELETE FROM radar_referrals_cache WHERE id = 1"),l=n.prepare("DELETE FROM radar_offers_cache WHERE id = 1"),u=n.prepare("DELETE FROM radar_intel_cache WHERE id = 1");n.transaction(()=>{o.run(a),s.run(),i.run(),l.run(),u.run()})()},"setRadarLocalModelOverride",0,function(e,r,n){let s=o(e,r);if(!s||!n||"object"!=typeof n)return!1;let u=Object.keys(n);if(0===u.length||u.some(e=>"displayName"!==e&&"enabled"!==e)||Object.hasOwn(n,"enabled")&&null!==n.enabled&&"boolean"!=typeof n.enabled)return!1;let c=function(e){if(void 0===e)return;if(null===e)return null;if("string"!=typeof e)return;let t=e.trim();if(!(t.length<1||t.length>160||a.test(t)))return t}(n.displayName);return(!Object.hasOwn(n,"displayName")||void 0!==c)&&((0,t.getDbInstance)().transaction(()=>{let e=i(s.provider,s.modelId);l({...s,displayName:Object.hasOwn(n,"displayName")?c??null:e?.display_name??null,enabled:Object.hasOwn(n,"enabled")?n.enabled??null:e?.enabled===null||e?.enabled===void 0?null:1===e.enabled,tombstoned:e?.tombstoned===1})})(),!0)},"setRadarModelTombstone",0,function(e,r,n){let a=o(e,r);return!!a&&"boolean"==typeof n&&((0,t.getDbInstance)().transaction(()=>{let e=i(a.provider,a.modelId);l({...a,displayName:e?.display_name??null,enabled:e?.enabled===null||e?.enabled===void 0?null:1===e.enabled,tombstoned:n})})(),!0)},"setRadarOffersCache",0,function(e){let r=e.fetchedAt??new Date().toISOString();(0,t.getDbInstance)().prepare(`INSERT INTO radar_offers_cache (id, version, tier, payload, signature, fetched_at)
       VALUES (1, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         version = excluded.version,
         tier = excluded.tier,
         payload = excluded.payload,
         signature = excluded.signature,
         fetched_at = excluded.fetched_at`).run(e.version,e.tier,e.payload,e.signature,r)},"setRadarOptIn",0,function(e){(0,t.getDbInstance)().prepare("UPDATE radar_settings SET opt_in = ?, updated_at = datetime('now') WHERE id = 1").run(+!!e)},"setRadarReferralsCache",0,function(e){let r=(0,t.getDbInstance)(),n=e.fetchedAt??new Date().toISOString();r.prepare(`INSERT INTO radar_referrals_cache (id, generated_at, tier, payload, signature, fetched_at)
     VALUES (1, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       generated_at = excluded.generated_at,
       tier         = excluded.tier,
       payload      = excluded.payload,
       signature    = excluded.signature,
       fetched_at   = excluded.fetched_at`).run(e.generatedAt,e.tier,e.payload,e.signature,n)}])},795769,e=>{"use strict";var t=e.i(666680),r=e.i(899378),n=e.i(529646);function a(e){let t=(0,r.getDbInstance)().prepare("SELECT * FROM relay_tokens WHERE id = ?").get(e);return t?{...(0,n.rowToCamel)(t),enabled:1===t.enabled}:null}e.s(["checkRateLimit",0,function(e,t){let a=(0,r.getDbInstance)(),o=t;if(!o){let t=a.prepare("SELECT * FROM relay_tokens WHERE id = ?").get(e);if(!t)return{allowed:!1,remaining:0,resetIn:0};o=(0,n.rowToCamel)(t)}let s=Math.floor(Date.now()/1e3),i=60*Math.floor(s/60),l=86400*Math.floor(s/86400),u=a.prepare("SELECT request_count, cost FROM relay_rate_limits WHERE token_id = ? AND window_start = ?").get(e,i),c=u?.request_count||0;if(c>=o.maxRequestsPerMinute)return{allowed:!1,remaining:0,resetIn:60-s%60};let d=a.prepare("SELECT SUM(request_count) as total FROM relay_rate_limits WHERE token_id = ? AND window_start >= ?").get(e,l),p=d?.total||0;return p>=o.maxRequestsPerDay?{allowed:!1,remaining:0,resetIn:86400-s%86400}:{allowed:!0,remaining:Math.min(o.maxRequestsPerMinute-c,o.maxRequestsPerDay-p),resetIn:60-s%60}},"createRelayToken",0,function(a){let o=(0,r.getDbInstance)(),s="rl_"+(0,t.randomBytes)(16).toString("hex"),i="relay_"+(0,t.randomBytes)(24).toString("hex"),l=function(t){let{createHash:r}=e.r(666680);return r("sha256").update(t).digest("hex")}(i),u=Math.floor(Date.now()/1e3),c="rl_"+i.slice(6,14);o.prepare(`
    INSERT INTO relay_tokens (id, name, token_hash, token_prefix, description, combo_id, allowed_models,
      max_tokens_per_request, max_requests_per_minute, max_requests_per_day, max_cost_per_day,
      enabled, created_at, updated_at, expires_at, metadata)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?)
  `).run(s,a.name,l,c,a.description||"",a.comboId||null,JSON.stringify(a.allowedModels||["*"]),a.maxTokensPerRequest||128e3,a.maxRequestsPerMinute||60,a.maxRequestsPerDay||1e4,a.maxCostPerDay||0,u,u,a.expiresAt||null,JSON.stringify(a.metadata||{}));let d=o.prepare("SELECT * FROM relay_tokens WHERE id = ?").get(s);return{...(0,n.rowToCamel)(d),rawToken:i}},"deleteRelayToken",0,function(e){(0,r.getDbInstance)().prepare("DELETE FROM relay_tokens WHERE id = ?").run(e)},"getRelayLogs",0,function(e,t=50){let n=(0,r.getDbInstance)();return e?n.prepare("SELECT * FROM relay_logs WHERE token_id = ? ORDER BY created_at DESC LIMIT ?").all(e,t):n.prepare("SELECT * FROM relay_logs ORDER BY created_at DESC LIMIT ?").all(t)},"getRelayToken",0,a,"getRelayTokenByHash",0,function(e){let t=(0,r.getDbInstance)().prepare("SELECT * FROM relay_tokens WHERE token_hash = ? AND enabled = 1").get(e);return t?{...(0,n.rowToCamel)(t),enabled:1===t.enabled}:null},"getRelayTokens",0,function(){return(0,r.getDbInstance)().prepare("SELECT * FROM relay_tokens ORDER BY created_at DESC").all().map(e=>({...(0,n.rowToCamel)(e),enabled:1===e.enabled}))},"getRelayUsage",0,function(e,t){let n=(0,r.getDbInstance)().prepare("SELECT COUNT(*) as request_count, COALESCE(SUM(cost), 0) as total_cost FROM relay_logs WHERE token_id = ? AND created_at >= ?").get(e,t);return{requestCount:n.request_count,totalCost:n.total_cost}},"recordRelayUsage",0,function(e,t){let n=(0,r.getDbInstance)(),a=Math.floor(Date.now()/1e3),o=60*Math.floor(a/60);n.prepare(`
    INSERT INTO relay_rate_limits (token_id, window_start, request_count, cost)
    VALUES (?, ?, 1, ?)
    ON CONFLICT(token_id, window_start) DO UPDATE SET
      request_count = request_count + 1,
      cost = cost + ?
  `).run(e,o,t.cost||0,t.cost||0),n.prepare("UPDATE relay_tokens SET last_used_at = ? WHERE id = ?").run(a,e),n.prepare(`
    INSERT INTO relay_logs (token_id, request_id, model, prompt_tokens, completion_tokens, cost,
      status, status_code, latency_ms, client_ip, user_agent, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(e,t.requestId||null,t.model||null,t.promptTokens||0,t.completionTokens||0,t.cost||0,t.status||"success",t.statusCode||200,t.latencyMs||0,t.clientIp||null,t.userAgent||null,a)},"toggleRelayToken",0,function(e,t){let n=(0,r.getDbInstance)(),o=Math.floor(Date.now()/1e3);return n.prepare("UPDATE relay_tokens SET enabled = ?, updated_at = ? WHERE id = ?").run(+!!t,o,e),a(e)},"updateRelayToken",0,function(e,t){let n=(0,r.getDbInstance)(),o=Math.floor(Date.now()/1e3),s=["updated_at = ?"],i=[o];return void 0!==t.name&&(s.push("name = ?"),i.push(t.name)),void 0!==t.description&&(s.push("description = ?"),i.push(t.description)),void 0!==t.comboId&&(s.push("combo_id = ?"),i.push(t.comboId)),void 0!==t.allowedModels&&(s.push("allowed_models = ?"),i.push(JSON.stringify(t.allowedModels))),void 0!==t.maxTokensPerRequest&&(s.push("max_tokens_per_request = ?"),i.push(t.maxTokensPerRequest)),void 0!==t.maxRequestsPerMinute&&(s.push("max_requests_per_minute = ?"),i.push(t.maxRequestsPerMinute)),void 0!==t.maxRequestsPerDay&&(s.push("max_requests_per_day = ?"),i.push(t.maxRequestsPerDay)),void 0!==t.maxCostPerDay&&(s.push("max_cost_per_day = ?"),i.push(t.maxCostPerDay)),i.push(e),n.prepare(`UPDATE relay_tokens SET ${s.join(", ")} WHERE id = ?`).run(...i),a(e)}])},790883,e=>{"use strict";var t=e.i(899378),r=e.i(607798),n=e.i(843890);function a(e){return e&&"object"==typeof e?e:{}}let o=new Set(["localhost","127.0.0.1","::1"]);function s(e){return"dario"===e?"dario":"cliproxyapi"}function i(e){let t=null;if(e.cliproxyapi_model_mapping&&"string"==typeof e.cliproxyapi_model_mapping)try{t=JSON.parse(e.cliproxyapi_model_mapping)}catch{t=null}return{id:e.id,providerId:e.provider_id,mode:e.mode,cliproxyapiModelMapping:t,nativePriority:e.native_priority,cliproxyapiPriority:e.cliproxyapi_priority,enabled:1===e.enabled||!0===e.enabled,family:"string"==typeof e.family?e.family:"auto",fallbackBackend:s(e.fallback_backend),createdAt:e.created_at,updatedAt:e.updated_at}}async function l(){return(0,t.getDbInstance)().prepare("SELECT * FROM upstream_proxy_config ORDER BY provider_id").all().map(e=>i(a(e)))}async function u(e){let r=(0,t.getDbInstance)().prepare("SELECT * FROM upstream_proxy_config WHERE provider_id = ?").get(e);return r?i(a(r)):null}async function c(e){let r=(0,t.getDbInstance)(),n=e.mode??"native",a=void 0!==e.cliproxyapiModelMapping?JSON.stringify(e.cliproxyapiModelMapping):null,o=e.nativePriority??1,i=e.cliproxyapiPriority??2,l=+(!1!==e.enabled),c=e.family??"auto",d=s(e.fallbackBackend);return r.prepare(`INSERT INTO upstream_proxy_config
     (provider_id, mode, cliproxyapi_model_mapping, native_priority, cliproxyapi_priority, enabled, family, fallback_backend, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
     ON CONFLICT(provider_id) DO UPDATE SET
       mode = excluded.mode,
       cliproxyapi_model_mapping = excluded.cliproxyapi_model_mapping,
       native_priority = excluded.native_priority,
       cliproxyapi_priority = excluded.cliproxyapi_priority,
       enabled = excluded.enabled,
       family = excluded.family,
       fallback_backend = excluded.fallback_backend,
       updated_at = datetime('now')`).run(e.providerId,n,a,o,i,l,c,d),u(e.providerId)}async function d(e,r){let n=(0,t.getDbInstance)();if(!await u(e))throw Error(`Provider ${e} not found`);let a=["updated_at = datetime('now')"],o=[];return void 0!==r.mode&&(a.push("mode = ?"),o.push(r.mode)),void 0!==r.cliproxyapiModelMapping&&(a.push("cliproxyapi_model_mapping = ?"),o.push(null===r.cliproxyapiModelMapping?null:JSON.stringify(r.cliproxyapiModelMapping))),void 0!==r.nativePriority&&(a.push("native_priority = ?"),o.push(r.nativePriority)),void 0!==r.cliproxyapiPriority&&(a.push("cliproxyapi_priority = ?"),o.push(r.cliproxyapiPriority)),void 0!==r.enabled&&(a.push("enabled = ?"),o.push(+(!0===r.enabled))),void 0!==r.family&&(a.push("family = ?"),o.push(r.family)),void 0!==r.fallbackBackend&&(a.push("fallback_backend = ?"),o.push(s(r.fallbackBackend))),o.push(e),n.prepare(`UPDATE upstream_proxy_config SET ${a.join(", ")} WHERE provider_id = ?`).run(...o),u(e)}async function p(e){return(0,t.getDbInstance)().prepare("DELETE FROM upstream_proxy_config WHERE provider_id = ?").run(e).changes>0}async function _(e){return(0,t.getDbInstance)().prepare("SELECT * FROM upstream_proxy_config WHERE mode = ? AND enabled = 1 ORDER BY provider_id").all(e).map(e=>i(a(e)))}async function E(e){let t=await u(e);if(!t)return[];let r=[];return t.enabled&&(r.push({executor:"native",priority:t.nativePriority}),"cliproxyapi"===t.mode?r.push({executor:"cliproxyapi",priority:t.cliproxyapiPriority}):"dario"===t.mode?r.push({executor:"dario",priority:t.cliproxyapiPriority}):"fallback"===t.mode&&r.push({executor:t.fallbackBackend,priority:t.cliproxyapiPriority})),r.sort((e,t)=>e.priority-t.priority),r}e.s(["deleteUpstreamProxyConfig",0,p,"getFallbackChainForProvider",0,E,"getProvidersByMode",0,_,"getUpstreamProxyConfig",0,u,"getUpstreamProxyConfigs",0,l,"updateUpstreamProxyConfig",0,d,"upsertUpstreamProxyConfig",0,c,"validateProxyUrl",0,function(e){try{let t=new URL(e);if(!["http:","https:"].includes(t.protocol))return{valid:!1,error:`Unsupported protocol "${t.protocol}" — use http or https`};if(function(e){let t,a=(0,n.normalizeHost)(e),s=(0,r.mappedIpv4Host)(a)??a;return!(o.has(a)||o.has(s))&&((0,r.isCloudMetadataHost)(a)||(0,n.isPrivateHost)(a)||(t=Number.parseInt(s.split(".")[0],10),4===(0,n.ipVersion)(s)&&t>=224&&t<=239))}(t.hostname))return{valid:!1,error:`Proxy URL cannot point to private/internal address "${t.hostname}"`};return{valid:!0,url:e}}catch{return{valid:!1,error:`Invalid URL: "${e}"`}}}])},441273,e=>{"use strict";var t=e.i(899378);e.s(["sumUsageTokensThisMonth",0,function(e=(0,t.getDbInstance)()){try{let t=e.prepare(`SELECT
           COALESCE((
             SELECT SUM(tokens_input + tokens_output)
             FROM usage_history
             WHERE timestamp >= strftime('%Y-%m-01T00:00:00.000Z','now')
               AND timestamp < strftime('%Y-%m-01T00:00:00.000Z','now','+1 month')
           ), 0) +
           COALESCE((
             SELECT SUM(total_input_tokens + total_output_tokens)
             FROM daily_usage_summary
             WHERE date >= strftime('%Y-%m-01', 'now')
           ), 0) AS used`).get();return t?.used??0}catch{return 0}}])},13985,e=>{"use strict";var t=e.i(899378);function r(e){if(null===e)return null;try{return JSON.stringify(e)}catch{return null}}function n(e){let t=e&&"object"==typeof e?e:{};return{id:"number"==typeof t.id?t.id:0,tool:"string"==typeof t.tool?t.tool:"",currentVersion:null===t.current_version?null:"string"==typeof t.current_version?t.current_version:null,installedVersion:null===t.installed_version?null:"string"==typeof t.installed_version?t.installed_version:null,pinnedVersion:null===t.pinned_version?null:"string"==typeof t.pinned_version?t.pinned_version:null,binaryPath:null===t.binary_path?null:"string"==typeof t.binary_path?t.binary_path:null,status:"string"==typeof t.status?t.status:"not_installed",pid:null===t.pid?null:"number"==typeof t.pid?t.pid:null,port:"number"==typeof t.port?t.port:8317,apiKey:null===t.api_key?null:"string"==typeof t.api_key?t.api_key:null,managementKey:null===t.management_key?null:"string"==typeof t.management_key?t.management_key:null,autoUpdate:1===t.auto_update||!0===t.auto_update||"1"===t.auto_update,autoStart:1===t.auto_start||!0===t.auto_start||"1"===t.auto_start,autoRestartAdopted:1===t.auto_restart_adopted||!0===t.auto_restart_adopted||"1"===t.auto_restart_adopted,lastHealthCheck:null===t.last_health_check?null:"string"==typeof t.last_health_check?t.last_health_check:null,lastUpdateCheck:null===t.last_update_check?null:"string"==typeof t.last_update_check?t.last_update_check:null,healthStatus:"string"==typeof t.health_status?t.health_status:"unknown",configOverrides:function(e){if(!e||"string"!=typeof e||""===e.trim())return null;try{let t=JSON.parse(e);return"object"==typeof t&&null!==t?t:null}catch{return null}}(t.config_overrides),errorMessage:null===t.error_message?null:"string"==typeof t.error_message?t.error_message:null,createdAt:"string"==typeof t.created_at?t.created_at:"",updatedAt:"string"==typeof t.updated_at?t.updated_at:"",logsBufferPath:null===t.logs_buffer_path?null:"string"==typeof t.logs_buffer_path?t.logs_buffer_path:null,providerExpose:1===t.provider_expose||!0===t.provider_expose||"1"===t.provider_expose,lastSyncAt:null===t.last_sync_at?null:"string"==typeof t.last_sync_at?t.last_sync_at:null}}async function a(){return(0,t.getDbInstance)().prepare("SELECT * FROM version_manager").all().map(n)}async function o(e){let r=(0,t.getDbInstance)().prepare("SELECT * FROM version_manager WHERE tool = ?").get(e);return r?n(r):null}async function s(e){(0,t.getDbInstance)().prepare(`
    INSERT INTO version_manager (
      tool, current_version, installed_version, pinned_version, binary_path,
      status, pid, port, api_key, management_key, auto_update, auto_start,
      health_status, config_overrides, error_message, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    ON CONFLICT(tool) DO UPDATE SET
      current_version = excluded.current_version,
      installed_version = excluded.installed_version,
      pinned_version = excluded.pinned_version,
      binary_path = excluded.binary_path,
      status = excluded.status,
      pid = excluded.pid,
      port = excluded.port,
      api_key = excluded.api_key,
      management_key = excluded.management_key,
      auto_update = excluded.auto_update,
      auto_start = excluded.auto_start,
      health_status = excluded.health_status,
      config_overrides = excluded.config_overrides,
      error_message = excluded.error_message,
      updated_at = datetime('now')
  `).run(e.tool,e.currentVersion??null,e.installedVersion??null,e.pinnedVersion??null,e.binaryPath??null,e.status??"not_installed",e.pid??null,e.port??8317,e.apiKey??null,e.managementKey??null,void 0!==e.autoUpdate?+!!e.autoUpdate:1,void 0!==e.autoStart?+!!e.autoStart:0,e.healthStatus??"unknown",r(e.configOverrides??null),e.errorMessage??null);let n=await o(e.tool);if(!n)throw Error("Failed to retrieve inserted version manager tool");return n}async function i(e,n){let a=(0,t.getDbInstance)();if(!await o(e))return null;let s=new Set(["currentVersion","installedVersion","pinnedVersion","binaryPath","status","pid","port","apiKey","managementKey","autoUpdate","autoStart","autoRestartAdopted","healthStatus","configOverrides","errorMessage","logsBufferPath","providerExpose","lastSyncAt"]),i=["updated_at = datetime('now')"],l={tool:e};for(let[e,t]of Object.entries(n)){if(!s.has(e))continue;let n=e.replace(/([A-Z])/g,"_$1").toLowerCase();"configOverrides"===e?(i.push("config_overrides = @configOverrides"),l.configOverrides=r(t)):"autoUpdate"===e||"autoStart"===e||"autoRestartAdopted"===e||"providerExpose"===e?(i.push(`${n} = @${e}`),l[e]=+(!0===t)):null===t?i.push(`${n} = null`):(i.push(`${n} = @${e}`),l[e]=t)}return a.prepare(`UPDATE version_manager SET ${i.join(", ")} WHERE tool = @tool`).run(l),o(e)}async function l(e){return(0,t.getDbInstance)().prepare("DELETE FROM version_manager WHERE tool = ?").run(e).changes>0}async function u(e,r){return(0,t.getDbInstance)().prepare("UPDATE version_manager SET health_status = ?, last_health_check = datetime('now') WHERE tool = ?").run(r,e).changes>0}async function c(e,r,n){return(0,t.getDbInstance)().prepare(`UPDATE version_manager SET ${r} = ?, updated_at = datetime('now') WHERE tool = ?`).run(n,e).changes>0}async function d(e,r,n,a){return(0,t.getDbInstance)().prepare(void 0!==n?"UPDATE version_manager SET status = ?, pid = ?, error_message = ?, updated_at = datetime('now') WHERE tool = ?":"UPDATE version_manager SET status = ?, error_message = ?, updated_at = datetime('now') WHERE tool = ?").run(...void 0!==n?[r,n,a??null,e]:[r,a??null,e]).changes>0}async function p(e){return o(e)}let _=new Set(["logsBufferPath","providerExpose","lastSyncAt","status","pid","port","apiKey","autoStart","autoRestartAdopted","autoUpdate","healthStatus","errorMessage","currentVersion","installedVersion","binaryPath"]);async function E(e,t,r){if(!_.has(t))throw Error(`updateServiceField: field "${t}" is not in the allowed list`);return i(e,{[t]:r})}e.s(["deleteVersionManagerTool",0,l,"getServiceRow",0,p,"getVersionManagerStatus",0,a,"getVersionManagerTool",0,o,"setToolStatus",0,d,"updateServiceField",0,E,"updateToolHealth",0,u,"updateToolVersion",0,c,"updateVersionManagerTool",0,i,"upsertVersionManagerTool",0,s])},446908,e=>{"use strict";var t=e.i(899378),r=e.i(719201);e.s(["getDeliveries",0,function(e,r){return(0,t.getDbInstance)().prepare(`SELECT id, webhook_id, event_type, status, http_status, latency_ms, error, created_at
       FROM webhook_deliveries
       WHERE webhook_id = ?
       ORDER BY created_at DESC, id DESC
       LIMIT ?`).all(e,r)},"insertDelivery",0,function(e){let n=(0,t.getDbInstance)(),a=n.prepare(`INSERT INTO webhook_deliveries
       (webhook_id, event_type, status, http_status, latency_ms, error, payload_snapshot)
     VALUES (?, ?, ?, ?, ?, ?, ?)`),o=n.prepare(`DELETE FROM webhook_deliveries
     WHERE webhook_id = ?
       AND id NOT IN (
         SELECT id FROM webhook_deliveries
         WHERE webhook_id = ?
         ORDER BY created_at DESC, id DESC
         LIMIT ?
       )`),s=null!=e.error&&(0,r.sanitizeErrorMessage)(e.error)||null;n.transaction(()=>{a.run(e.webhookId,e.eventType,e.status,e.httpStatus??null,e.latencyMs??null,s,e.payloadSnapshot??null),o.run(e.webhookId,e.webhookId,100)})()}])},879032,e=>{"use strict";var t=e.i(899378),r=e.i(254799);function n(e){return{...e,kind:e.kind||"custom",events:JSON.parse(e.events||'["*"]'),enabled:1===e.enabled}}function a(e){let r=(0,t.getDbInstance)().prepare("SELECT * FROM webhooks WHERE id = ?").get(e);return r?n(r):null}e.s(["createWebhook",0,function(e){let n=(0,t.getDbInstance)(),o=r.default.randomUUID(),s=e.secret||`whsec_${r.default.randomBytes(24).toString("hex")}`,i=e.kind||"custom";return n.prepare(`INSERT INTO webhooks (id, url, events, secret, description, kind, metadata_encrypted)
       VALUES (?, ?, ?, ?, ?, ?, ?)`).run(o,e.url,JSON.stringify(e.events||["*"]),s,e.description||"",i,e.metadataEncrypted??null),a(o)},"deleteWebhook",0,function(e){return(0,t.getDbInstance)().prepare("DELETE FROM webhooks WHERE id = ?").run(e).changes>0},"disableWebhooksWithHighFailures",0,function(e=10){return(0,t.getDbInstance)().prepare("UPDATE webhooks SET enabled = 0 WHERE failure_count >= ? AND enabled = 1").run(e).changes},"getEnabledWebhooks",0,function(){return(0,t.getDbInstance)().prepare("SELECT * FROM webhooks WHERE enabled = 1").all().map(n)},"getWebhook",0,a,"getWebhooks",0,function(e){let r=(0,t.getDbInstance)(),a=e?.limit,o=e?.offset??0,s="SELECT * FROM webhooks ORDER BY created_at DESC",i=[];void 0!==a&&(s+=" LIMIT ? OFFSET ?",i.push(a,o));let l=r.prepare(s).all(...i),u=r.prepare("SELECT count(*) as cnt FROM webhooks").get().cnt;return{webhooks:l.map(n),total:u}},"recordWebhookDelivery",0,function(e,r,n){let a=(0,t.getDbInstance)();n?a.prepare("UPDATE webhooks SET last_triggered_at = datetime('now'), last_status = ?, failure_count = 0 WHERE id = ?").run(r,e):a.prepare("UPDATE webhooks SET last_triggered_at = datetime('now'), last_status = ?, failure_count = failure_count + 1 WHERE id = ?").run(r,e)},"updateWebhook",0,function(e,r){let n=(0,t.getDbInstance)(),o=a(e);if(!o)return null;let s=[],i=[];return(void 0!==r.url&&(s.push("url = ?"),i.push(r.url)),void 0!==r.events&&(s.push("events = ?"),i.push(JSON.stringify(r.events))),void 0!==r.secret&&(s.push("secret = ?"),i.push(r.secret)),void 0!==r.enabled&&(s.push("enabled = ?"),i.push(+!!r.enabled)),void 0!==r.description&&(s.push("description = ?"),i.push(r.description)),void 0!==r.kind&&(s.push("kind = ?"),i.push(r.kind)),void 0!==r.metadataEncrypted&&(s.push("metadata_encrypted = ?"),i.push(r.metadataEncrypted)),0===s.length)?o:(i.push(e),n.prepare(`UPDATE webhooks SET ${s.join(", ")} WHERE id = ?`).run(...i),a(e))}])},436231,e=>{"use strict";e.s(["calculateLevel",0,function(e){return e<=0?1:Math.max(1,Math.floor(Math.pow(2.5*e/100,.4)))},"getLevelTier",0,function(e){return e>=76?"diamond":e>=51?"platinum":e>=26?"gold":e>=11?"silver":"bronze"},"getLevelTitle",0,function(e){return e>=76?"Legend":e>=51?"Master":e>=26?"Expert":e>=11?"Explorer":"Beginner"}])},751183,e=>{"use strict";var t=e.i(899378),r=e.i(403122),n=e.i(935050);let a=["litellm"],o=parseInt(process.env.PRICING_SYNC_INTERVAL||"86400",10),s=Number.isFinite(o)&&o>0?1e3*o:864e5,i=(process.env.PRICING_SYNC_SOURCES||"litellm").split(",").map(e=>e.trim()).filter(e=>a.includes(e)),l={openai:["openai","cx"],anthropic:["anthropic","cc"],vertex_ai:["gemini"],"vertex_ai-anthropic_models":["anthropic"],google:["gemini"],deepseek:["ds"],groq:["groq"],together_ai:["openrouter"],bedrock:["kr"],fireworks_ai:["fireworks"],cerebras:["cerebras"],nvidia_nim:["nvidia"],siliconflow:["siliconflow"],"vertex_ai-language_models":["gemini"],"vertex_ai-mistral_models":["mistral"],gemini:["gemini"],bedrock_converse:["kr"],cloudflare:["cf"],stability:["stability-ai"]},u=null,c=null,d=0,p=s;async function _(){let e=await fetch("https://raw.githubusercontent.com/BerriAI/litellm/main/model_prices_and_context_window.json",{signal:AbortSignal.timeout(3e4)});if(!e.ok)throw Error(`LiteLLM fetch failed [${e.status}]: ${e.statusText}`);let t=await e.text();try{return JSON.parse(t)}catch{throw Error(`LiteLLM returned invalid JSON (${t.slice(0,100)}...)`)}}function E(e){return e&&"object"==typeof e?e:{}}let g=null,m=-1;function S(e){let a=(0,t.getDbInstance)(),o=a.prepare("DELETE FROM key_value WHERE namespace = 'pricing_synced'"),s=a.prepare("INSERT INTO key_value (namespace, key, value) VALUES ('pricing_synced', ?, ?)");a.transaction(()=>{for(let[t,r]of(o.run(),Object.entries(e)))s.run(t,JSON.stringify(r))})(),(0,n.backupDbFile)("pre-write"),(0,r.invalidateDbCache)("pricing")}let f="pricing_sync_status",y="last_sync";async function h(e){let r=e?.sources||i,n=e?.dryRun??!1,o=r.filter(e=>a.includes(e)),s=r.filter(e=>!a.includes(e));if(0===o.length){let e=a.join(", ");return{success:!1,modelCount:0,providerCount:0,source:r.join(","),dryRun:n,error:`No valid sources provided. Supported: ${e}. Invalid: ${s.join(", ")}`}}try{let e={};for(let t of o)if("litellm"===t){let t=await _(),r=function(e){let t={};for(let[r,n]of Object.entries(e)){let e=["input_cost_per_second","output_cost_per_second","input_cost_per_image","output_cost_per_image","input_cost_per_pixel","output_cost_per_pixel","input_cost_per_character","output_cost_per_character","input_cost_per_video_per_second","output_cost_per_video_per_second","search_unit_cost","ocr_cost_per_page"],a=null!=n.input_cost_per_token||null!=n.output_cost_per_token,o=e.some(e=>null!=n[e]);if(!a&&!o)continue;let s=1e6*(n.input_cost_per_token||0),i={input:Math.round(1e3*s)/1e3,output:Math.round(1e3*(1e6*(n.output_cost_per_token||0)))/1e3};for(let t of(n.mode&&(i.mode=n.mode),null!=n.cache_read_input_token_cost&&(i.cached=Math.round(1e6*n.cache_read_input_token_cost*1e3)/1e3),null!=n.cache_creation_input_token_cost&&(i.cache_creation=Math.round(1e6*n.cache_creation_input_token_cost*1e3)/1e3),e)){let e=n[t];"number"==typeof e&&Number.isFinite(e)&&(i[t]=e)}let u=r.indexOf("/"),c=u>=0?r.slice(u+1):r,d=n.litellm_provider||"",p=l[d];if(p)for(let e of p)t[e]||(t[e]={}),t[e][c]=i;else d&&(t[d]||(t[d]={}),t[d][c]=i)}return t}(t);for(let[t,n]of Object.entries(r))e[t]||(e[t]={}),Object.assign(e[t],n)}let r=Object.values(e).reduce((e,t)=>e+Object.keys(t).length,0),a=Object.keys(e).length;if(!n){var u;S(e),c=new Date().toISOString(),d=r,u=c,(0,t.getDbInstance)().prepare("INSERT INTO key_value (namespace, key, value) VALUES (?, ?, ?) ON CONFLICT(namespace, key) DO UPDATE SET value = excluded.value").run(f,y,JSON.stringify({lastSyncTime:u,lastSyncModelCount:r}))}return{success:!0,modelCount:r,providerCount:a,source:o.join(","),dryRun:n,...s.length>0?{warnings:[`Unknown sources ignored: ${s.join(", ")}`]}:{},...n?{data:e}:{}}}catch(t){let e=t instanceof Error?t.message:String(t);return console.warn("[PRICING_SYNC] Sync failed:",e),{success:!1,modelCount:0,providerCount:0,source:r.join(","),dryRun:n,error:e}}}function b(e){if(u)return;let t=e??s;p=t,console.log(`[PRICING_SYNC] Starting periodic sync every ${t/1e3}s`),h().then(e=>{e.success&&console.log(`[PRICING_SYNC] Initial sync complete: ${e.modelCount} models from ${e.providerCount} providers`)}).catch(e=>{console.warn("[PRICING_SYNC] Initial sync error:",e instanceof Error?e.message:e)}),(u=setInterval(()=>{h().then(e=>{e.success&&console.log(`[PRICING_SYNC] Periodic sync complete: ${e.modelCount} models`)}).catch(e=>{console.warn("[PRICING_SYNC] Periodic sync error:",e instanceof Error?e.message:e)})},t))&&"object"==typeof u&&"unref"in u&&u.unref?.()}async function R(){"true"!==process.env.PRICING_SYNC_ENABLED?console.log("[PRICING_SYNC] Disabled (set PRICING_SYNC_ENABLED=true to enable)"):b()}e.s(["clearSyncedPricing",0,function(){(0,t.getDbInstance)().prepare("DELETE FROM key_value WHERE namespace = 'pricing_synced'").run(),(0,n.backupDbFile)("pre-write"),(0,r.invalidateDbCache)("pricing")},"getSyncStatus",0,function(){let e="true"===process.env.PRICING_SYNC_ENABLED,r=null===c?function(){let e=E((0,t.getDbInstance)().prepare("SELECT value FROM key_value WHERE namespace = ? AND key = ?").get(f,y)),r="string"==typeof e.value?e.value:null;if(!r)return null;try{let e=JSON.parse(r);if("string"!=typeof e.lastSyncTime)return null;return{lastSyncTime:e.lastSyncTime,lastSyncModelCount:"number"==typeof e.lastSyncModelCount?e.lastSyncModelCount:0}}catch{return null}}():null,n=c??r?.lastSyncTime??null;return{enabled:e,lastSync:n,lastSyncModelCount:null!==c?d:r?.lastSyncModelCount??0,nextSync:e&&n?new Date(new Date(n).getTime()+p).toISOString():null,intervalMs:p,sources:i}},"getSyncedPricing",0,function(){let e=(0,r.getModelCatalogCacheVersion)();if(null!==g&&m===e)return g;let n=(0,t.getDbInstance)().prepare("SELECT key, value FROM key_value WHERE namespace = 'pricing_synced'").all(),a={};for(let e of n){let t=E(e),r="string"==typeof t.key?t.key:null,n="string"==typeof t.value?t.value:null;if(r&&null!==n)try{a[r]=JSON.parse(n)}catch{console.warn(`[PRICING_SYNC] Corrupted data for provider "${r}", skipping`)}}return g=a,m=e,a},"initPricingSync",0,R,"saveSyncedPricing",0,S,"startPeriodicSync",0,b,"stopPeriodicSync",0,function(){u&&(clearInterval(u),u=null,console.log("[PRICING_SYNC] Periodic sync stopped"))},"syncPricingFromSources",0,h])},294733,e=>{"use strict";var t=e.i(253395);class r{buffer=[];inFlightEntries=[];discardedApiKeyIds=new Set;timer=null;started=!1;flushPromise=null;persistEntries;logger;flushIntervalMs;maxBufferSize;constructor(e={}){this.persistEntries=e.persistEntries||t.batchSaveCostEntries,this.logger=e.logger||console,this.flushIntervalMs=e.flushIntervalMs??function(){let e=Number.parseInt(process.env.OMNIROUTE_SPEND_FLUSH_INTERVAL_MS||"",10);return Number.isFinite(e)&&e>0?e:6e4}(),this.maxBufferSize=e.maxBufferSize??function(){let e=Number.parseInt(process.env.OMNIROUTE_SPEND_MAX_BUFFER_SIZE||"",10);return Number.isFinite(e)&&e>0?e:1e3}()}start(){this.started||(this.started=!0,this.timer=setInterval(()=>{this.flush()},this.flushIntervalMs),this.timer.unref?.())}increment(e,t,r=Date.now()){var n;let a=(n={apiKeyId:e,cost:t,timestamp:r},n?.apiKeyId&&Number.isFinite(n.cost)&&!(n.cost<=0)?{apiKeyId:n.apiKeyId,cost:n.cost,timestamp:Number.isFinite(n.timestamp)?n.timestamp:Date.now()}:null);a&&(this.start(),this.discardedApiKeyIds.delete(a.apiKeyId),this.buffer.push(a),this.buffer.length>=this.maxBufferSize&&this.flush())}getBufferedEntries(e,t=0,r=1/0){return[...this.inFlightEntries,...this.buffer].filter(n=>n.apiKeyId===e&&n.timestamp>=t&&n.timestamp<r)}getPendingCostTotal(e,t=0,r=1/0){return this.getBufferedEntries(e,t,r).reduce((e,t)=>e+t.cost,0)}discardEntries(e){this.discardedApiKeyIds.add(e),this.buffer=this.buffer.filter(t=>t.apiKeyId!==e),this.inFlightEntries=this.inFlightEntries.filter(t=>t.apiKeyId!==e)}async flush(){if(this.flushPromise)return this.flushPromise;if(0===this.buffer.length)return{flushedEntries:0,uniqueKeys:0,requeued:!1};let e=[...this.buffer];return this.buffer=[],this.inFlightEntries=e,this.flushPromise=(async()=>{let t=e.filter(e=>!this.discardedApiKeyIds.has(e.apiKeyId)),r=new Set(t.map(e=>e.apiKeyId)).size;try{return t.length>0&&await this.persistEntries(t),this.logger.log(`[SpendWriter] Flushed ${t.length} cost entr${1===t.length?"y":"ies"} across ${r} key(s)`),{flushedEntries:t.length,uniqueKeys:r,requeued:!1}}catch(n){this.buffer=[...t,...this.buffer];let e=n instanceof Error?n.message:String(n);return this.logger.error(`[SpendWriter] Flush error: ${e}`),{flushedEntries:0,uniqueKeys:r,requeued:!0}}finally{this.inFlightEntries=[],this.flushPromise=null}})(),this.flushPromise}async stop(){return this.timer&&(clearInterval(this.timer),this.timer=null),this.started=!1,this.flush()}resetForTests(){this.timer&&(clearInterval(this.timer),this.timer=null),this.started=!1,this.buffer=[],this.inFlightEntries=[],this.discardedApiKeyIds.clear(),this.flushPromise=null}}let n=new r;async function a(){return n.flush()}async function o(){return n.stop()}e.s(["SpendBatchWriter",0,r,"discardSpendBatchEntries",0,function(e){n.discardEntries(e)},"flushSpendBatchWriter",0,a,"resetSpendBatchWriterForTests",0,function(){n.resetForTests()},"spendBatchWriter",0,n,"startSpendBatchWriter",0,function(){n.start()},"stopSpendBatchWriter",0,o])},640163,e=>{"use strict";let t="https://grok.com/build?_s=usage";function r(e){return e&&"object"==typeof e&&!Array.isArray(e)?e:null}function n(e){return"number"==typeof e&&Number.isSafeInteger(e)&&e>=0?e:void 0}e.s(["GROK_BUILD_ADDITIONAL_CREDITS_URL",0,t,"sanitizeGrokBillingStatus",0,function(e){let a=r(e);if(!a||"USD"!==a.currency||a.additionalCreditsUrl!==t)return;let o=r(a.autoTopUp);if(!o||"boolean"!=typeof o.available)return;let s=o.available,i=s&&"boolean"==typeof o.enabled?o.enabled:void 0,l=n(a.extraCreditsMinorUnits),u=!0===i?n(o.thresholdMinorUnits):void 0,c=!0===i?n(o.amountMinorUnits):void 0,d=!0===i?n(o.maxMonthlyMinorUnits):void 0;return{currency:"USD",...void 0!==l?{extraCreditsMinorUnits:l}:{},autoTopUp:{available:s,...void 0!==i?{enabled:i}:{},...void 0!==u?{thresholdMinorUnits:u}:{},...void 0!==c?{amountMinorUnits:c}:{},...void 0!==d?{maxMonthlyMinorUnits:d}:{}},additionalCreditsUrl:t}}])},381610,e=>{"use strict";let t="https://www.kimi.com/membership/subscription?tab=quota&aff=omniroute";function r(e){return"number"==typeof e&&Number.isSafeInteger(e)&&e>=0?e:void 0}let n=/^[A-Za-z]{3}$/,a=new Set(["enabled","disabled","frozen","unavailable"]);e.s(["KIMI_CODE_ADDITIONAL_CREDITS_URL",0,t,"sanitizeKimiBillingStatus",0,function(e){let o=e&&"object"==typeof e&&!Array.isArray(e)?e:null;if(!o||o.additionalCreditsUrl!==t)return;let s="string"==typeof o.currency&&n.test(o.currency)?o.currency.toUpperCase():void 0,i="string"==typeof o.extraUsageStatus&&a.has(o.extraUsageStatus)?o.extraUsageStatus:void 0;if(!s||!i)return;let l=r(o.extraCreditsMinorUnits),u=r(o.monthlyUsedMinorUnits),c=r(o.monthlyLimitMinorUnits),d="boolean"==typeof o.monthlyLimitEnabled?o.monthlyLimitEnabled:void 0;return{currency:s,...void 0!==l?{extraCreditsMinorUnits:l}:{},...void 0!==u?{monthlyUsedMinorUnits:u}:{},...void 0!==d?{monthlyLimitEnabled:d}:{},...void 0!==c?{monthlyLimitMinorUnits:c}:{},extraUsageStatus:i,additionalCreditsUrl:t}}])},268372,e=>{"use strict";var t=e.i(640163),r=e.i(381610);e.s(["sanitizeProviderBillingStatus",0,function(e){return(0,t.sanitizeGrokBillingStatus)(e)??(0,r.sanitizeKimiBillingStatus)(e)}])}];

//# sourceMappingURL=src_0fts0ll._.js.map