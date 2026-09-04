module.exports=[10947,e=>{"use strict";var t=e.i(991110),n=e.i(471801);let r=new Set(["daily","weekly","monthly"]),a=/^(\d{2}):(\d{2})$/,i=new Map;function o(e,t=0){if("number"==typeof e&&Number.isFinite(e))return e;if("string"==typeof e&&e.trim().length>0){let n=Number(e);return Number.isFinite(n)?n:t}return t}function s(e){if("string"==typeof e){let t=e.trim().match(a);if(t){let e=Math.min(Math.max(parseInt(t[1],10),0),23),n=Math.min(Math.max(parseInt(t[2],10),0),59);return`${String(e).padStart(2,"0")}:${String(n).padStart(2,"0")}`}}return"00:00"}function l(e){let t=o(e,NaN);return Number.isFinite(t)&&t>0?t:null}function u(e,t,n,r,a){return Date.UTC(e,t,n,r,a,0,0)}function c(e,t="00:00",n=Date.now()){let r,i=new Date(n),[o,l]=(r=s(t).match(a))?[parseInt(r[1],10),parseInt(r[2],10)]:[0,0],d=i.getUTCFullYear(),p=i.getUTCMonth(),_=i.getUTCDate();if("weekly"===e){let e=(i.getUTCDay()+6)%7,t=u(d,p,_-e,o,l);return n>=t?{periodStartAt:t,nextResetAt:u(d,p,_-e+7,o,l)}:{periodStartAt:u(d,p,_-e-7,o,l),nextResetAt:t}}if("monthly"===e){let e=u(d,p,1,o,l);return n>=e?{periodStartAt:e,nextResetAt:u(d,p+1,1,o,l)}:{periodStartAt:u(d,p-1,1,o,l),nextResetAt:e}}let E=u(d,p,_,o,l);return n>=E?{periodStartAt:E,nextResetAt:u(d,p,_+1,o,l)}:{periodStartAt:u(d,p,_-1,o,l),nextResetAt:E}}function d(e,a,u=Date.now(),p={}){let _={dailyLimitUsd:Math.max(0,o(a.dailyLimitUsd)),weeklyLimitUsd:Math.max(0,o(a.weeklyLimitUsd)),monthlyLimitUsd:Math.max(0,o(a.monthlyLimitUsd)),warningThreshold:Math.min(Math.max(o(a.warningThreshold,.8),0),1),resetInterval:function(e){if("string"==typeof e){let t=e.trim().toLowerCase();if(r.has(t))return t}return"daily"}(a.resetInterval),resetTime:s(a.resetTime),budgetResetAt:l(a.budgetResetAt),lastBudgetResetAt:l(a.lastBudgetResetAt),warningEmittedAt:l(a.warningEmittedAt),warningPeriodStart:l(a.warningPeriodStart)},E=c(_.resetInterval,_.resetTime,u),g=null!==_.lastBudgetResetAt&&E.periodStartAt>_.lastBudgetResetAt;if(g&&!1!==p.logReset){let r=function(e,r,a){try{return(function(e){if(!Array.isArray(e))return[];let t=[];for(let n of e){if(!n||"object"!=typeof n||Array.isArray(n))continue;let e=o(n.cost,NaN),r=o(n.timestamp,NaN);Number.isFinite(e)&&Number.isFinite(r)&&t.push({cost:e,timestamp:r})}return t})((0,t.loadCostEntriesInRange)(e,r,a)).reduce((e,t)=>e+t.cost,0)+n.spendBatchWriter.getPendingCostTotal(e,r,a)}catch{return 0}}(e,_.lastBudgetResetAt,E.periodStartAt);try{(0,t.saveBudgetResetLog)({apiKeyId:e,resetInterval:_.resetInterval,previousSpend:r,resetAt:E.periodStartAt,nextResetAt:E.nextResetAt,periodStart:E.periodStartAt,periodEnd:E.nextResetAt})}catch{}}let m={..._,budgetResetAt:E.nextResetAt,lastBudgetResetAt:E.periodStartAt,warningEmittedAt:g?null:_.warningEmittedAt,warningPeriodStart:g?null:_.warningPeriodStart};if((_.budgetResetAt!==m.budgetResetAt||_.lastBudgetResetAt!==m.lastBudgetResetAt||_.warningEmittedAt!==m.warningEmittedAt||_.warningPeriodStart!==m.warningPeriodStart||_.dailyLimitUsd!==m.dailyLimitUsd||_.weeklyLimitUsd!==m.weeklyLimitUsd||_.monthlyLimitUsd!==m.monthlyLimitUsd||_.warningThreshold!==m.warningThreshold||_.resetInterval!==m.resetInterval||_.resetTime!==m.resetTime)&&!1!==p.persist)try{(0,t.saveBudget)(e,m)}catch{}return i.set(e,m),m}e.s(["checkBudget",0,function(e,r=0){var a;let o=function(e){let n=i.get(e);if(n)return d(e,n);try{let n=(0,t.loadBudget)(e);if(n)return d(e,n)}catch{}return null}(e);if(!o)return{allowed:!0,dailyUsed:0,dailyLimit:0,warningReached:!1,remaining:0,periodUsed:0,activeLimitUsd:0,resetInterval:null,resetTime:null,budgetResetAt:null,lastBudgetResetAt:null,periodStartAt:null};let s=c(o.resetInterval,o.resetTime),l=function(e,r){try{return(0,t.loadCostTotal)(e,r)+n.spendBatchWriter.getPendingCostTotal(e,r)}catch{return 0}}(e,s.periodStartAt),u=l+r,p="monthly"===o.resetInterval?o.monthlyLimitUsd>0?o.monthlyLimitUsd:o.dailyLimitUsd:"weekly"===o.resetInterval&&o.weeklyLimitUsd>0?o.weeklyLimitUsd:o.dailyLimitUsd,_=p>0&&u>=p*o.warningThreshold,E=Math.max(p-u,0);if(_&&o.warningPeriodStart!==s.periodStartAt){let n={...o,warningEmittedAt:Date.now(),warningPeriodStart:s.periodStartAt};i.set(e,n);try{let r;(0,t.saveBudget)(e,n),a=s.nextResetAt,r=p>0?(u/p*100).toFixed(1):"0.0",console.warn(`[BudgetWarning] ${e} reached ${r}% of ${n.resetInterval} budget ($${u.toFixed(4)} / $${p.toFixed(2)}) — next reset ${new Date(a).toISOString()}`)}catch{}}return p>0&&u>p?{allowed:!1,reason:`${o.resetInterval[0].toUpperCase()}${o.resetInterval.slice(1)} budget exceeded: $${u.toFixed(4)} / $${p.toFixed(2)}`,dailyUsed:l,dailyLimit:p,warningReached:!0,remaining:E,periodUsed:l,activeLimitUsd:p,resetInterval:o.resetInterval,resetTime:o.resetTime,budgetResetAt:s.nextResetAt,lastBudgetResetAt:s.periodStartAt,periodStartAt:s.periodStartAt}:{allowed:!0,dailyUsed:l,dailyLimit:p,warningReached:_,remaining:E,periodUsed:l,activeLimitUsd:p,resetInterval:o.resetInterval,resetTime:o.resetTime,budgetResetAt:s.nextResetAt,lastBudgetResetAt:s.periodStartAt,periodStartAt:s.periodStartAt}},"getBudgetWindow",0,c,"recordCost",0,function(e,t){try{n.spendBatchWriter.increment(e,t,Date.now())}catch{}},"syncAllBudgetSchedules",0,function(e=Date.now()){let n=0,r=0;try{let a=(0,t.loadAllBudgets)();for(let[t,i]of Object.entries(a)){n+=1;let a=d(t,i,e,{logReset:!0,persist:!0});i.lastBudgetResetAt!==a.lastBudgetResetAt&&(r+=1)}}catch{}return{processed:n,resetCount:r}}])},452415,e=>{"use strict";var t=e.i(830471);function n(e){return{pattern:e.pattern,source:e.source,created_at:e.created_at}}e.s(["getAllBypassPatterns",0,function(){return(0,t.getDbInstance)().prepare("SELECT pattern, source, created_at FROM agent_bridge_bypass ORDER BY source ASC, pattern ASC").all().map(n)},"getUserBypassPatterns",0,function(){return(0,t.getDbInstance)().prepare("SELECT pattern FROM agent_bridge_bypass WHERE source = 'user' ORDER BY pattern ASC").all().map(e=>e.pattern)},"replaceUserBypassPatterns",0,function(e){let n=(0,t.getDbInstance)(),r=new Date().toISOString(),a=n.prepare("DELETE FROM agent_bridge_bypass WHERE source = 'user'"),i=n.prepare("INSERT INTO agent_bridge_bypass (pattern, source, created_at) VALUES (?, 'user', ?)");n.transaction(()=>{for(let t of(a.run(),e))i.run(t,r)})()},"seedDefaultBypassPatterns",0,function(e){let n=(0,t.getDbInstance)(),r=new Date().toISOString(),a=n.prepare("INSERT OR IGNORE INTO agent_bridge_bypass (pattern, source, created_at) VALUES (?, 'default', ?)");n.transaction(()=>{for(let t of e)a.run(t,r)})()}])},758677,e=>{"use strict";var t=e.i(830471),n=e.i(694050);let r=new Set(["antigravity","claude-code","kiro"]);function a(e){return(0,t.getDbInstance)().prepare("SELECT agent_id, source_model, target_model, updated_at FROM agent_bridge_mappings WHERE agent_id = ? ORDER BY source_model ASC").all(e)}e.s(["deleteMapping",0,function(e,n){(0,t.getDbInstance)().prepare("DELETE FROM agent_bridge_mappings WHERE agent_id = ? AND source_model = ?").run(e,n)},"getMappingsForAgent",0,a,"setMappings",0,function(e,n){let r=(0,t.getDbInstance)(),a=new Date().toISOString(),i=r.prepare("DELETE FROM agent_bridge_mappings WHERE agent_id = ?"),o=r.prepare(`INSERT INTO agent_bridge_mappings (agent_id, source_model, target_model, updated_at)
     VALUES (?, ?, ?, ?)`);r.transaction(()=>{for(let t of(i.run(e),n))o.run(e,t.source,t.target,a)})()},"syncAgentBridgeMappingsToMitmAlias",0,function(e){if(!r.has(e))return;let t=a(e),i={};for(let e of t)i[e.source_model]=e.target_model;(0,n.setMitmAliasAll)(e,i)}])},326151,e=>{"use strict";var t=e.i(830471);function n(e){return{agent_id:e.agent_id,dns_enabled:1===e.dns_enabled,cert_trusted:1===e.cert_trusted,setup_completed:1===e.setup_completed,last_started_at:e.last_started_at,last_error:e.last_error}}function r(e){let r=(0,t.getDbInstance)().prepare("SELECT * FROM agent_bridge_state WHERE agent_id = ?").get(e);return r?n(r):null}e.s(["getAgentBridgeState",0,r,"getAllAgentBridgeStates",0,function(){return(0,t.getDbInstance)().prepare("SELECT * FROM agent_bridge_state ORDER BY agent_id ASC").all().map(n)},"setLastError",0,function(e,n){(0,t.getDbInstance)().prepare(`INSERT INTO agent_bridge_state (agent_id, last_error)
     VALUES (?, ?)
     ON CONFLICT(agent_id) DO UPDATE SET last_error = excluded.last_error`).run(e,n)},"setLastStarted",0,function(e,n){(0,t.getDbInstance)().prepare(`INSERT INTO agent_bridge_state (agent_id, last_started_at)
     VALUES (?, ?)
     ON CONFLICT(agent_id) DO UPDATE SET last_started_at = excluded.last_started_at`).run(e,n)},"upsertAgentBridgeState",0,function(e){let n=(0,t.getDbInstance)();if(r(e.agent_id)){let t=[],r=[];if(void 0!==e.dns_enabled&&(t.push("dns_enabled = ?"),r.push(+!!e.dns_enabled)),void 0!==e.cert_trusted&&(t.push("cert_trusted = ?"),r.push(+!!e.cert_trusted)),void 0!==e.setup_completed&&(t.push("setup_completed = ?"),r.push(+!!e.setup_completed)),void 0!==e.last_started_at&&(t.push("last_started_at = ?"),r.push(e.last_started_at)),void 0!==e.last_error&&(t.push("last_error = ?"),r.push(e.last_error)),0===t.length)return;r.push(e.agent_id),n.prepare(`UPDATE agent_bridge_state SET ${t.join(", ")} WHERE agent_id = ?`).run(...r)}else n.prepare(`INSERT INTO agent_bridge_state
         (agent_id, dns_enabled, cert_trusted, setup_completed, last_started_at, last_error)
       VALUES (?, ?, ?, ?, ?, ?)`).run(e.agent_id,void 0!==e.dns_enabled?+!!e.dns_enabled:0,void 0!==e.cert_trusted?+!!e.cert_trusted:0,void 0!==e.setup_completed?+!!e.setup_completed:0,e.last_started_at??null,e.last_error??null)}])},899403,e=>{"use strict";var t=e.i(995031),n=e.i(830471);function r(e){return e&&"object"==typeof e?e:{}}function a(e){let t=r(e);return{id:String(t.id??""),apiKeyId:"string"==typeof t.api_key_id?t.api_key_id:null,fingerprintHash:String(t.fingerprint_hash??""),turnCount:Number(t.turn_count??1),firstSeenAt:String(t.first_seen_at??""),lastSeenAt:String(t.last_seen_at??"")}}function i(e){let t,n=r(e);return{...{id:String((t=r(e)).id??""),conversationId:String(t.conversation_id??""),parentId:"string"==typeof t.parent_id?t.parent_id:null,role:String(t.role??""),contentHash:String(t.content_hash??""),lastCorrelationId:"string"==typeof t.last_correlation_id?t.last_correlation_id:null,firstSeenAt:String(t.first_seen_at??""),lastSeenAt:String(t.last_seen_at??"")},seq:Number(n.seq??0)}}e.s(["createAgenticConversation",0,function(e){let r=(0,n.getDbInstance)(),a=new Date().toISOString(),i=e.id||`conv_${(0,t.v4)()}`;return r.prepare(`INSERT INTO agentic_conversations
       (id, api_key_id, fingerprint_hash, last_message_count, last_messages_hash, turn_count, first_seen_at, last_seen_at)
     VALUES (?, ?, ?, 0, '', 1, ?, ?)`).run(i,e.apiKeyId,e.fingerprintHash,a,a),{id:i,apiKeyId:e.apiKeyId,fingerprintHash:e.fingerprintHash,turnCount:1,firstSeenAt:a,lastSeenAt:a}},"findAgenticConversationsByFingerprint",0,function(e){return(0,n.getDbInstance)().prepare("SELECT * FROM agentic_conversations WHERE fingerprint_hash = ? ORDER BY last_seen_at DESC LIMIT 20").all(e).map(a)},"getConversationTurnIndex",0,function(e){let t=(0,n.getDbInstance)().prepare("SELECT id, parent_id, content_hash FROM conversation_turn_nodes WHERE conversation_id = ?").all(e),a=new Set,i=new Map,o=new Set;for(let e of t){let t=r(e),n=String(t.id??""),s="string"==typeof t.parent_id?t.parent_id:null,l=String(t.content_hash??"");if(a.add(n),s&&o.add(s),!l)continue;let u=i.get(l);u?u.push(n):i.set(l,[n])}return{nodeIds:a,byContentHash:i,parentsWithChildren:o}},"getConversationTurnPage",0,function(e,t={}){let r=(0,n.getDbInstance)(),a=Math.max(1,Math.min(t.limit??20,500));if(null!=t.afterSeq)return{nodes:r.prepare(`SELECT rowid as seq, * FROM conversation_turn_nodes
         WHERE conversation_id = ? AND rowid > ? ORDER BY rowid ASC`).all(e,t.afterSeq).map(i),hasMore:!1};let o=null!=t.beforeSeq?r.prepare(`SELECT rowid as seq, * FROM conversation_turn_nodes
             WHERE conversation_id = ? AND rowid < ? ORDER BY rowid DESC LIMIT ?`).all(e,t.beforeSeq,a+1):r.prepare(`SELECT rowid as seq, * FROM conversation_turn_nodes
             WHERE conversation_id = ? ORDER BY rowid DESC LIMIT ?`).all(e,a+1),s=o.length>a;return{nodes:(s?o.slice(0,a):o).reverse().map(i),hasMore:s}},"insertConversationTurnNodes",0,function(e,t,r){if(0===r.length)return;let a=(0,n.getDbInstance)(),i=new Date().toISOString(),o=a.prepare(`INSERT OR IGNORE INTO conversation_turn_nodes
       (id, conversation_id, parent_id, role, content_hash, last_correlation_id, first_seen_at, last_seen_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);a.transaction(n=>{for(let r of n)o.run(r.id,e,r.parentId,r.role,r.contentHash,t,i,i)})(r)},"listMultiTurnConversations",0,function(e={}){let t=(0,n.getDbInstance)(),i=Math.max(1,Math.min(e.limit??50,200)),o=Math.max(0,e.offset??0),s=r(t.prepare(`SELECT COUNT(*) as c FROM agentic_conversations ac
         WHERE (SELECT COUNT(*) FROM conversation_turn_nodes n WHERE n.conversation_id = ac.id) >= 2`).get()).c,l=t.prepare(`SELECT ac.*, latest.id as last_call_log_id, latest.model as last_model,
              latest.provider as last_provider, latest.status as last_status
       FROM agentic_conversations ac
       LEFT JOIN (
         SELECT cl1.id, cl1.session_tag, cl1.model, cl1.provider, cl1.status
         FROM call_logs cl1
         WHERE cl1.timestamp = (
           SELECT MAX(cl2.timestamp) FROM call_logs cl2 WHERE cl2.session_tag = cl1.session_tag
         )
       ) latest ON latest.session_tag = ac.id
       WHERE (SELECT COUNT(*) FROM conversation_turn_nodes n WHERE n.conversation_id = ac.id) >= 2
       ORDER BY ac.last_seen_at DESC
       LIMIT ? OFFSET ?`).all(i,o);return{total:Number(s??0),rows:l.map(e=>{let t=r(e);return{...a(t),lastCallLogId:"string"==typeof t.last_call_log_id?t.last_call_log_id:null,lastModel:"string"==typeof t.last_model?t.last_model:null,lastProvider:"string"==typeof t.last_provider?t.last_provider:null,lastStatus:"number"==typeof t.last_status?t.last_status:null}})}},"resolveCallLogIdsByCorrelationIds",0,function(e){let t=[...new Set(e.filter(Boolean))],a=new Map;if(0===t.length)return a;let i=(0,n.getDbInstance)(),o=t.map(()=>"?").join(",");for(let e of i.prepare(`SELECT id, correlation_id FROM call_logs WHERE correlation_id IN (${o})`).all(...t)){let t=r(e),n="string"==typeof t.correlation_id?t.correlation_id:null,i="string"==typeof t.id?t.id:null;n&&i&&!a.has(n)&&a.set(n,i)}return a},"touchOrCreateExternalConversation",0,function(e,t){let r=(0,n.getDbInstance)(),a=new Date().toISOString();r.prepare("SELECT id FROM agentic_conversations WHERE id = ?").get(e)?r.prepare("UPDATE agentic_conversations SET turn_count = turn_count + 1, last_seen_at = ? WHERE id = ?").run(a,e):r.prepare(`INSERT INTO agentic_conversations
       (id, api_key_id, fingerprint_hash, last_message_count, last_messages_hash, turn_count, first_seen_at, last_seen_at)
     VALUES (?, ?, '', 0, '', 1, ?, ?)`).run(e,t.apiKeyId,a,a)},"updateAgenticConversation",0,function(e,t){(0,n.getDbInstance)().prepare("UPDATE agentic_conversations SET turn_count = ?, last_seen_at = ? WHERE id = ?").run(t.turnCount,new Date().toISOString(),e)}])},204366,e=>{"use strict";var t=e.i(830471);function n(e){return{apiKeyId:e.api_key_id,sourceType:e.source_type,token:e.token,baseUrl:e.base_url,vaultPath:e.vault_path,enabled:1===e.enabled}}e.s(["deleteApiKeyContextSource",0,function(e,n){(0,t.getDbInstance)().prepare("DELETE FROM api_key_context_sources WHERE api_key_id = ? AND source_type = ?").run(e,n)},"getApiKeyContextSource",0,function(e,r){if(!e)return null;let a=(0,t.getDbInstance)().prepare("SELECT * FROM api_key_context_sources WHERE api_key_id = ? AND source_type = ? AND enabled = 1").get(e,r);return a?n(a):null},"listApiKeyContextSources",0,function(e){return(0,t.getDbInstance)().prepare("SELECT * FROM api_key_context_sources WHERE api_key_id = ?").all(e).map(n)},"setApiKeyContextSource",0,function(e,n,r){let a=(0,t.getDbInstance)(),i=a.prepare("SELECT * FROM api_key_context_sources WHERE api_key_id = ? AND source_type = ?").get(e,n),o=new Date().toISOString();i?a.prepare(`UPDATE api_key_context_sources SET
        token = COALESCE(?, token),
        base_url = COALESCE(?, base_url),
        vault_path = COALESCE(?, vault_path),
        enabled = COALESCE(?, enabled),
        updated_at = ?
      WHERE api_key_id = ? AND source_type = ?`).run(r.token??null,r.baseUrl??null,r.vaultPath??null,void 0!==r.enabled?+!!r.enabled:null,o,e,n):a.prepare(`INSERT INTO api_key_context_sources
        (api_key_id, source_type, token, base_url, vault_path, enabled, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(e,n,r.token??null,r.baseUrl??null,r.vaultPath??null,void 0!==r.enabled?+!!r.enabled:1,o,o)}])},807836,e=>{"use strict";var t=e.i(666680),n=e.i(830471);function r(e){return{id:e.id,apiKeyId:e.api_key_id,autoChannel:e.auto_channel,connectionId:e.connection_id,excluded:1===e.excluded,createdAt:e.created_at}}async function a(e,t){return e&&t?new Set((0,n.getDbInstance)().prepare(`SELECT connection_id FROM auto_candidate_overrides
       WHERE api_key_id = ? AND auto_channel = ? AND excluded = 1`).all(e,t).map(e=>e.connection_id)):new Set}async function i(e,a,i,o){let s=(0,n.getDbInstance)(),l=(0,t.randomUUID)(),u=new Date().toISOString();return s.prepare(`INSERT INTO auto_candidate_overrides
       (id, api_key_id, auto_channel, connection_id, excluded, created_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(api_key_id, auto_channel, connection_id)
     DO UPDATE SET excluded = excluded.excluded`).run(l,e,a,i,+!!o,u),r(s.prepare(`SELECT id, api_key_id, auto_channel, connection_id, excluded, created_at
       FROM auto_candidate_overrides
       WHERE api_key_id = ? AND auto_channel = ? AND connection_id = ?`).get(e,a,i))}async function o(e,t){return e&&t?(0,n.getDbInstance)().prepare(`SELECT id, api_key_id, auto_channel, connection_id, excluded, created_at
       FROM auto_candidate_overrides
       WHERE api_key_id = ? AND auto_channel = ?
       ORDER BY created_at ASC`).all(e,t).map(r):[]}e.s(["getExcludedConnectionIds",0,a,"listOverrides",0,o,"setExcluded",0,i])},301435,e=>{"use strict";var t=e.i(830471),n=e.i(330485),r=e.i(773412),a=e.i(995031);function i(e){let t=(0,n.rowToCamel)(e);if(t.metadata&&"string"==typeof t.metadata)try{t.metadata=JSON.parse(t.metadata)}catch{t.metadata=null}if(t.errors&&"string"==typeof t.errors)try{t.errors=JSON.parse(t.errors)}catch{t.errors=null}if(t.usage&&"string"==typeof t.usage)try{t.usage=JSON.parse(t.usage)}catch{t.usage=null}let r=e=>{if("number"==typeof e&&Number.isFinite(e))return e;if(null==e)return null;let t=Number(e);return Number.isFinite(t)?t:null};return t.createdAt=r(t.createdAt)??0,t.inProgressAt=r(t.inProgressAt),t.expiresAt=r(t.expiresAt),t.finalizingAt=r(t.finalizingAt),t.completedAt=r(t.completedAt),t.failedAt=r(t.failedAt),t.expiredAt=r(t.expiredAt),t.cancellingAt=r(t.cancellingAt),t.cancelledAt=r(t.cancelledAt),t}function o(e){if(null==e)return null;if("string"!=typeof e)return e;try{return JSON.parse(e)}catch{return null}}function s(e){let n=(0,t.getDbInstance)().prepare("SELECT * FROM batches WHERE id = ?").get(e);return n?i(n):null}e.s(["countBatchItemCheckpoints",0,function(e){let n=(0,t.getDbInstance)().prepare("SELECT COUNT(*) AS c FROM batch_item_checkpoints WHERE batch_id = ?").get(e);return n?Number(n.c):0},"countBatches",0,function(e){let n=(0,t.getDbInstance)();if(e){let t=n.prepare("SELECT COUNT(*) as c FROM batches WHERE api_key_id = ?").get(e);return t?Number(t.c):0}{let e=n.prepare("SELECT COUNT(*) as c FROM batches").get();return e?Number(e.c):0}},"createBatch",0,function(e){let r=(0,t.getDbInstance)(),i="batch_"+(0,a.v4)().replaceAll("-","").substring(0,24),o=Math.floor(Date.now()/1e3),s={...e,id:i,createdAt:o,status:e.status||"validating",requestCountsTotal:0,requestCountsCompleted:0,requestCountsFailed:0,errors:e.errors||null,model:e.model||null,usage:e.usage||null,outputExpiresAfterSeconds:e.outputExpiresAfterSeconds||null,outputExpiresAfterAnchor:e.outputExpiresAfterAnchor||null},l=(0,n.objToSnake)({...s,metadata:s.metadata?JSON.stringify(s.metadata):null,errors:s.errors?JSON.stringify(s.errors):null,usage:s.usage?JSON.stringify(s.usage):null}),u=Object.keys(l),c=Object.values(l),d=u.map(()=>"?").join(", ");return r.prepare(`INSERT INTO batches (${u.join(", ")}) VALUES (${d})`).run(...c),s},"deleteBatch",0,function(e){let n=(0,t.getDbInstance)(),a=s(e);if(!a)return!1;if(n.prepare("DELETE FROM batch_item_checkpoints WHERE batch_id = ?").run(e),a.inputFileId)try{(0,r.deleteFile)(a.inputFileId)}catch{}if(a.outputFileId)try{(0,r.deleteFile)(a.outputFileId)}catch{}if(a.errorFileId)try{(0,r.deleteFile)(a.errorFileId)}catch{}return n.prepare("DELETE FROM batches WHERE id = ?").run(e).changes>0},"deleteCompletedBatches",0,function(){let e=(0,t.getDbInstance)(),n=e.prepare("SELECT input_file_id, output_file_id, error_file_id FROM batches WHERE status = 'completed'").all(),a=new Set;for(let e of n)e.input_file_id&&a.add(e.input_file_id),e.output_file_id&&a.add(e.output_file_id),e.error_file_id&&a.add(e.error_file_id);let i=0;for(let e of a)try{(0,r.deleteFile)(e)&&i++}catch{}return e.prepare("DELETE FROM batch_item_checkpoints WHERE batch_id IN (SELECT id FROM batches WHERE status = 'completed')").run(),{deletedBatches:e.prepare("DELETE FROM batches WHERE status = 'completed'").run().changes,deletedFiles:i}},"ensureBatchItemCheckpoints",0,function(e,n){if(0===n.length)return;let r=(0,t.getDbInstance)(),a=Math.floor(Date.now()/1e3),i=r.prepare(`
    INSERT OR IGNORE INTO batch_item_checkpoints (
      batch_id,
      line_number,
      custom_id,
      status,
      result_json,
      error_json,
      created_at,
      updated_at
    )
    VALUES (?, ?, ?, 'pending', NULL, NULL, ?, ?)
  `);r.transaction(()=>{for(let t of n)i.run(e,t.lineNumber,t.customId,a,a)})()},"getBatch",0,s,"getPendingBatches",0,function(){return(0,t.getDbInstance)().prepare("SELECT * FROM batches WHERE status IN ('validating', 'in_progress', 'finalizing', 'cancelling')").all().map(e=>i(e))},"getTerminalBatches",0,function(){return(0,t.getDbInstance)().prepare("SELECT * FROM batches WHERE status IN ('completed', 'failed', 'cancelled', 'expired') ORDER BY created_at ASC").all().map(e=>i(e))},"listBatchItemCheckpoints",0,function(e){return(0,t.getDbInstance)().prepare(`
      SELECT batch_id, line_number, custom_id, status, result_json, error_json, created_at, updated_at
      FROM batch_item_checkpoints
      WHERE batch_id = ?
      ORDER BY line_number ASC
    `).all(e).map(e=>({batchId:e.batch_id,lineNumber:Number(e.line_number),customId:e.custom_id??null,status:e.status,result:o(e.result_json),error:o(e.error_json),createdAt:Number(e.created_at),updatedAt:Number(e.updated_at)}))},"listBatches",0,function(e,n=20,r){let a=(0,t.getDbInstance)(),o=r?s(r):null;return(e?o?a.prepare("SELECT * FROM batches WHERE api_key_id = ? AND (created_at < ? OR (created_at = ? AND id < ?)) ORDER BY created_at DESC, id DESC LIMIT ?").all(e,o.createdAt,o.createdAt,r,n):a.prepare("SELECT * FROM batches WHERE api_key_id = ? ORDER BY created_at DESC, id DESC LIMIT ?").all(e,n):o?a.prepare("SELECT * FROM batches WHERE (created_at < ? OR (created_at = ? AND id < ?)) ORDER BY created_at DESC, id DESC LIMIT ?").all(o.createdAt,o.createdAt,r,n):a.prepare("SELECT * FROM batches ORDER BY created_at DESC, id DESC LIMIT ?").all(n)).map(e=>i(e))},"markBatchItemError",0,function(e,n,r){let a=(0,t.getDbInstance)(),i=Math.floor(Date.now()/1e3);a.prepare(`
    UPDATE batch_item_checkpoints
    SET custom_id = ?,
        status = 'errored',
        result_json = NULL,
        error_json = ?,
        updated_at = ?
    WHERE batch_id = ? AND line_number = ?
  `).run(n.customId,JSON.stringify(r),i,e,n.lineNumber)},"markBatchItemProcessing",0,function(e,n){let r=(0,t.getDbInstance)(),a=Math.floor(Date.now()/1e3);r.prepare(`
    INSERT INTO batch_item_checkpoints (
      batch_id,
      line_number,
      custom_id,
      status,
      result_json,
      error_json,
      created_at,
      updated_at
    )
    VALUES (?, ?, ?, 'processing', NULL, NULL, ?, ?)
    ON CONFLICT(batch_id, line_number) DO UPDATE SET
      custom_id = excluded.custom_id,
      status = 'processing',
      result_json = NULL,
      error_json = NULL,
      updated_at = excluded.updated_at
  `).run(e,n.lineNumber,n.customId,a,a)},"markBatchItemResult",0,function(e,n,r){let a=(0,t.getDbInstance)(),i=Math.floor(Date.now()/1e3);a.prepare(`
    UPDATE batch_item_checkpoints
    SET custom_id = ?,
        status = 'completed',
        result_json = ?,
        error_json = NULL,
        updated_at = ?
    WHERE batch_id = ? AND line_number = ?
  `).run(n.customId,JSON.stringify(r),i,e,n.lineNumber)},"updateBatch",0,function(e,r){let a=(0,t.getDbInstance)(),i=(0,n.objToSnake)(r);i.metadata&&"string"!=typeof i.metadata&&(i.metadata=JSON.stringify(i.metadata)),i.errors&&"string"!=typeof i.errors&&(i.errors=JSON.stringify(i.errors)),i.usage&&"string"!=typeof i.usage&&(i.usage=JSON.stringify(i.usage));let o=Object.keys(i);if(0===o.length)return!1;let s=o.map(e=>`${e} = ?`).join(", "),l=Object.values(i);return a.prepare(`UPDATE batches SET ${s} WHERE id = ?`).run(...l,e).changes>0}])},734252,e=>{"use strict";var t=e.i(830471);e.s(["getFallbackStats",0,function(e,n){return(0,t.getDbInstance)().prepare(`
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
    `).get(n)??{total:0,with_requested:0,fallback_eligible:0,fallbacks:0}},"getProviderMetrics",0,function(){return(0,t.getDbInstance)().prepare(`SELECT
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
        GROUP BY c.provider`).all()},"getRecentSearchLogs",0,function(){return(0,t.getDbInstance)().prepare(`
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
      `).all()}])},547053,e=>{"use strict";var t=e.i(682611),n=e.i(830471),r=e.i(584513);let a="ccDiscoveryAliases",i="EXPOSE_CC_DISCOVERY_ALIASES";function o(e){return`provider:${e}`}function s(e,t){return`model:${e}/${t}`}function l(e){return"on"===e||"off"===e?e:null}function u(){let e;if("1"===(e=process.env[i])||"true"===e)return{enabled:!0,source:"env"};let n=(0,t.getFeatureFlagOverride)(i);return void 0!==n?{enabled:"true"===n||"1"===n,source:"db"}:{enabled:!1,source:"default"}}e.s(["getCcAliasGlobalState",0,u,"getCcAliasModelSetting",0,function(e,t){let r=(0,n.getDbInstance)().prepare("SELECT value FROM key_value WHERE namespace = ? AND key = ?").get(a,s(e,t));return l(r?.value)},"getCcAliasProviderSetting",0,function(e){let t=(0,n.getDbInstance)().prepare("SELECT value FROM key_value WHERE namespace = ? AND key = ?").get(a,o(e));return l(t?.value)},"getCcAliasSettingsBulk",0,function(){let e=(0,n.getDbInstance)().prepare("SELECT key, value FROM key_value WHERE namespace = ?").all(a),t=new Map,r=new Map;for(let n of e){let e=l(n.value);null!==e&&(n.key.startsWith("provider:")?t.set(n.key.slice(9),e):n.key.startsWith("model:")&&r.set(n.key.slice(6),e))}return{providers:t,models:r}},"isCcAliasGlobalEnabled",0,function(){return u().enabled},"resolveCcAliasEnabled",0,function(e){return"on"===e.model||"off"!==e.model&&("on"===e.provider||"off"!==e.provider&&e.global)},"setCcAliasModelSetting",0,function(e,t,i){let o=(0,n.getDbInstance)(),l=s(e,t);if(null===i){o.prepare("DELETE FROM key_value WHERE namespace = ? AND key = ?").run(a,l),(0,r.finishModelCatalogWriteWithoutBackup)();return}o.prepare("INSERT OR REPLACE INTO key_value (namespace, key, value) VALUES (?, ?, ?)").run(a,l,i),(0,r.finishModelCatalogWriteWithoutBackup)()},"setCcAliasProviderSetting",0,function(e,t){let i=(0,n.getDbInstance)(),s=o(e);if(null===t){i.prepare("DELETE FROM key_value WHERE namespace = ? AND key = ?").run(a,s),(0,r.finishModelCatalogWriteWithoutBackup)();return}i.prepare("INSERT OR REPLACE INTO key_value (namespace, key, value) VALUES (?, ?, ?)").run(a,s,t),(0,r.finishModelCatalogWriteWithoutBackup)()}])},727242,e=>{"use strict";var t=e.i(830471);let n="ccDiscoveryMetrics",r="req:total",a="discovery:hits",i="req:model:";function o(e){(0,t.getDbInstance)().prepare(`INSERT INTO key_value (namespace, key, value) VALUES (?, ?, '1')
       ON CONFLICT(namespace, key)
       DO UPDATE SET value = CAST(CAST(value AS INTEGER) + 1 AS TEXT)`).run(n,e)}e.s(["getCcDiscoveryMetrics",0,function(){try{let e=(0,t.getDbInstance)().prepare("SELECT key, value FROM key_value WHERE namespace = ?").all(n),o=0,s=0,l={};for(let t of e){if("string"!=typeof t.key)continue;let e="string"==typeof t.value?parseInt(t.value,10):Number(t.value),n=Number.isFinite(e)&&e>=0?e:0;t.key===r?o=n:t.key===a?s=n:t.key.startsWith(i)&&(l[t.key.slice(i.length)]=n)}return{aliasRequests:o,discoveryHits:s,byModel:l}}catch{return{aliasRequests:0,discoveryHits:0,byModel:{}}}},"incrementCcAliasRequestCount",0,function(e){try{o(r),"string"==typeof e&&e.length>0&&o(`${i}${e}`)}catch{}},"incrementCcDiscoveryHitCount",0,function(){try{o(a)}catch{}}])},993053,e=>{"use strict";var t=e.i(830471);function n(e){let t;if(e.models)try{let n=JSON.parse(e.models);Array.isArray(n)&&(t=n.map(String))}catch{t=void 0}return{id:e.id,providerId:e.provider_id,method:e.method,endpoint:e.endpoint,authType:e.auth_type??"none",models:t,rateLimit:e.rate_limit,feasibility:e.feasibility??0,riskLevel:e.risk_level??"none",status:e.status,notes:e.notes,discoveredAt:e.discovered_at,verifiedAt:e.verified_at}}function r(e){let r=(0,t.getDbInstance)().prepare("SELECT * FROM discovery_results WHERE id = ?").get(e);return r?n(r):null}e.s(["deleteDiscoveryResult",0,function(e){return(0,t.getDbInstance)().prepare("DELETE FROM discovery_results WHERE id = ?").run(e).changes>0},"getDiscoveryResultById",0,r,"getDiscoveryResults",0,function(e){let r=(0,t.getDbInstance)();return(e?r.prepare("SELECT * FROM discovery_results WHERE provider_id = ? ORDER BY discovered_at DESC, id DESC").all(e):r.prepare("SELECT * FROM discovery_results ORDER BY discovered_at DESC, id DESC").all()).map(n)},"markVerified",0,function(e){return 0===(0,t.getDbInstance)().prepare("UPDATE discovery_results SET status = 'verified', verified_at = datetime('now') WHERE id = ?").run(e).changes?null:r(e)},"upsertDiscoveryResult",0,function(e){let r=(0,t.getDbInstance)(),a=e.models?JSON.stringify(e.models):null;return r.prepare(`INSERT INTO discovery_results
       (provider_id, method, endpoint, auth_type, models, rate_limit, feasibility, risk_level, status, notes)
     VALUES (@provider_id, @method, @endpoint, @auth_type, @models, @rate_limit, @feasibility, @risk_level, @status, @notes)
     ON CONFLICT(provider_id, method, endpoint) DO UPDATE SET
       auth_type = excluded.auth_type,
       models = excluded.models,
       rate_limit = excluded.rate_limit,
       feasibility = excluded.feasibility,
       risk_level = excluded.risk_level,
       status = excluded.status,
       notes = excluded.notes`).run({provider_id:e.providerId,method:e.method,endpoint:e.endpoint??null,auth_type:e.authType,models:a,rate_limit:e.rateLimit??null,feasibility:e.feasibility,risk_level:e.riskLevel,status:e.status,notes:e.notes??null}),n(r.prepare(`SELECT * FROM discovery_results
       WHERE provider_id = ? AND method = ? AND ifnull(endpoint, '') = ifnull(?, '')`).get(e.providerId,e.method,e.endpoint??null))}])},974008,e=>{"use strict";var t=e.i(666680),n=e.i(830471),r=e.i(330485);function a(e,t,n){return e.prepare(`PRAGMA table_info(${t})`).all().some(e=>e&&"string"==typeof e.name&&e.name===n)}function i(e){e.prepare(`CREATE TABLE IF NOT EXISTS eval_suites (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`).run(),a(e,"eval_suites","description")||e.prepare("ALTER TABLE eval_suites ADD COLUMN description TEXT").run(),a(e,"eval_suites","created_at")||e.prepare("ALTER TABLE eval_suites ADD COLUMN created_at TEXT NOT NULL DEFAULT ''").run(),a(e,"eval_suites","updated_at")||e.prepare("ALTER TABLE eval_suites ADD COLUMN updated_at TEXT NOT NULL DEFAULT ''").run(),e.prepare(`CREATE TABLE IF NOT EXISTS eval_cases (
      id TEXT PRIMARY KEY,
      suite_id TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      name TEXT NOT NULL,
      model TEXT,
      input_json TEXT NOT NULL,
      expected_strategy TEXT NOT NULL,
      expected_value TEXT,
      tags_json TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`).run(),a(e,"eval_cases","sort_order")||e.prepare("ALTER TABLE eval_cases ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0").run(),a(e,"eval_cases","model")||e.prepare("ALTER TABLE eval_cases ADD COLUMN model TEXT").run(),a(e,"eval_cases","input_json")||e.prepare("ALTER TABLE eval_cases ADD COLUMN input_json TEXT NOT NULL DEFAULT '{}'").run(),a(e,"eval_cases","expected_strategy")||e.prepare("ALTER TABLE eval_cases ADD COLUMN expected_strategy TEXT NOT NULL DEFAULT 'contains'").run(),a(e,"eval_cases","expected_value")||e.prepare("ALTER TABLE eval_cases ADD COLUMN expected_value TEXT").run(),a(e,"eval_cases","tags_json")||e.prepare("ALTER TABLE eval_cases ADD COLUMN tags_json TEXT").run(),a(e,"eval_cases","created_at")||e.prepare("ALTER TABLE eval_cases ADD COLUMN created_at TEXT NOT NULL DEFAULT ''").run(),a(e,"eval_cases","updated_at")||e.prepare("ALTER TABLE eval_cases ADD COLUMN updated_at TEXT NOT NULL DEFAULT ''").run(),e.prepare("CREATE INDEX IF NOT EXISTS idx_eval_suites_updated_at ON eval_suites(updated_at DESC)").run(),e.prepare("CREATE INDEX IF NOT EXISTS idx_eval_cases_suite_order ON eval_cases(suite_id, sort_order ASC, created_at ASC)").run()}function o(e){if(e&&"object"==typeof e&&!Array.isArray(e))return e;if("string"!=typeof e||0===e.trim().length)return{};try{let t=JSON.parse(e);return t&&"object"==typeof t&&!Array.isArray(t)?t:{}}catch{return{}}}function s(e){let t=Number(e);return Number.isFinite(t)?t:0}function l(e){var t;let n=e&&"object"==typeof e&&!Array.isArray(e)?e:{},r=s(n.max_tokens),a={messages:Array.isArray(t=n.messages)?t.map(e=>{if(!e||"object"!=typeof e||Array.isArray(e))return null;let t="string"==typeof e.role?e.role.trim():"",n="string"==typeof e.content?e.content:"";return t&&n.trim()?{role:t,content:n}:null}).filter(e=>null!==e):[]};return r>0&&(a.max_tokens=Math.floor(r)),a}function u(e){let t=e&&"object"==typeof e&&!Array.isArray(e)?e:{},n="string"==typeof t.strategy?t.strategy.trim():"",r="string"==typeof t.value&&t.value.trim().length>0?t.value:void 0;return{strategy:"exact"===n||"regex"===n||"custom"===n?n:"contains",...r?{value:r}:{}}}function c(e,t){return`${e}:${"string"==typeof t&&t.trim().length>0?t.trim():"__default__"}`}function d(e){let t,n,a,i,l=(0,r.rowToCamel)(e);if(!l)return null;let u=o(l.summary??l.summaryJson),d=Object.fromEntries(Object.entries(o(l.outputs??l.outputsJson)).filter(e=>"string"==typeof e[0]).map(([e,t])=>[e,"string"==typeof t?t:String(t??"")]));return{id:"string"==typeof l.id?l.id:"",runGroupId:"string"==typeof l.runGroupId&&l.runGroupId.trim().length>0?l.runGroupId:null,suiteId:"string"==typeof l.suiteId?l.suiteId:"",suiteName:"string"==typeof l.suiteName?l.suiteName:"",target:(t=l.targetType,a="string"==typeof(n=l.targetId)&&n.trim().length>0?n.trim():null,{type:i="combo"===t||"model"===t||"suite-default"===t?t:"suite-default",id:a,key:c(i,a),label:"string"==typeof l.targetLabel&&l.targetLabel.trim().length>0?l.targetLabel.trim():"combo"===i?`Combo: ${a||"Unknown"}`:"model"===i?`Model: ${a||"Unknown"}`:"Suite defaults"}),apiKeyId:"string"==typeof l.apiKeyId&&l.apiKeyId.trim().length>0?l.apiKeyId:null,avgLatencyMs:s(l.avgLatencyMs),summary:{total:s(u.total??l.total),passed:s(u.passed??l.passed),failed:s(u.failed??l.failed),passRate:s(u.passRate??l.passRate)},results:function(e){if(Array.isArray(e))return e.filter(e=>!!e&&"object"==typeof e&&!Array.isArray(e));if("string"!=typeof e||0===e.trim().length)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t.filter(e=>!!e&&"object"==typeof e&&!Array.isArray(e)):[]}catch{return[]}}(l.results??l.resultsJson),outputs:d,createdAt:"string"==typeof l.createdAt?l.createdAt:""}}function p(e={}){let t=(0,n.getDbInstance)(),r=[],a=[];e.suiteId&&(r.push("suite_id = ?"),a.push(e.suiteId)),e.runGroupId&&(r.push("run_group_id = ?"),a.push(e.runGroupId));let i=Number.isFinite(Number(e.limit))?Math.min(200,Math.max(1,Math.floor(Number(e.limit)))):20;a.push(i);let o=`SELECT *
    FROM eval_runs
    ${r.length>0?`WHERE ${r.join(" AND ")}`:""}
    ORDER BY created_at DESC
    LIMIT ?`;return t.prepare(o).all(...a).map(e=>d(e)).filter(e=>null!==e)}function _(){let e=(0,n.getDbInstance)();i(e);let t=e.prepare("SELECT * FROM eval_suites ORDER BY updated_at DESC, created_at DESC").all(),a=e.prepare("SELECT * FROM eval_cases ORDER BY suite_id ASC, sort_order ASC, created_at ASC, id ASC").all(),c=new Map;for(let e of a){let t=function(e){let t=(0,r.rowToCamel)(e);if(!t)return null;let n=l(o(t.input??t.inputJson)),a=u({strategy:t.expectedStrategy,value:t.expectedValue});return{id:"string"==typeof t.id?t.id:"",suiteId:"string"==typeof t.suiteId?t.suiteId:"",name:"string"==typeof t.name?t.name:"",..."string"==typeof t.model&&t.model.trim().length>0?{model:t.model.trim()}:{},input:n,expected:a,tags:function(e){if(Array.isArray(e))return e.filter(e=>"string"==typeof e).map(e=>e.trim()).filter(e=>e.length>0);if("string"!=typeof e||0===e.trim().length)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t.filter(e=>"string"==typeof e).map(e=>e.trim()).filter(e=>e.length>0):[]}catch{return[]}}(t.tags??t.tagsJson),sortOrder:s(t.sortOrder),createdAt:"string"==typeof t.createdAt?t.createdAt:"",updatedAt:"string"==typeof t.updatedAt?t.updatedAt:""}}(e);if(!t||!t.suiteId)continue;let n=c.get(t.suiteId)||[];n.push(t),c.set(t.suiteId,n)}return t.map(e=>{var t;let n,a=(0,r.rowToCamel)(e),i=a&&"string"==typeof a.id?a.id:"";return t=c.get(i)||[],(n=(0,r.rowToCamel)(e))?{id:"string"==typeof n.id?n.id:"",name:"string"==typeof n.name?n.name:"",..."string"==typeof n.description&&n.description.trim().length>0?{description:n.description}:{},source:"custom",caseCount:t.length,cases:t,createdAt:"string"==typeof n.createdAt?n.createdAt:"",updatedAt:"string"==typeof n.updatedAt?n.updatedAt:""}:null}).filter(e=>null!==e)}function E(e){let t=e.trim();return t&&_().find(e=>e.id===t)||null}e.s(["deleteCustomEvalSuite",0,function(e){let t=(0,n.getDbInstance)();i(t);let r=e.trim();if(!r)return!1;t.prepare("BEGIN").run();try{t.prepare("DELETE FROM eval_cases WHERE suite_id = ?").run(r);let e=t.prepare("DELETE FROM eval_suites WHERE id = ?").run(r);return t.prepare("COMMIT").run(),e.changes>0}catch(e){throw t.prepare("ROLLBACK").run(),e}},"getCustomEvalSuite",0,E,"getEvalScorecard",0,function(e={}){var t;let n,r,a=p({suiteId:e.suiteId,limit:e.limit||50});if(0===a.length)return null;let i=new Map;for(let e of a){let t=`${e.suiteId}:${e.target.key}`;i.has(t)||i.set(t,e)}return n=(t=Array.from(i.values()).map(e=>({suiteId:`${e.suiteId}:${e.target.key}`,suiteName:`${e.suiteName} \xb7 ${e.target.label}`,results:e.results,summary:e.summary}))).reduce((e,t)=>e+t.summary.total,0),r=t.reduce((e,t)=>e+t.summary.passed,0),{suites:t.length,totalCases:n,totalPassed:r,overallPassRate:n>0?Math.round(r/n*100):0,perSuite:t.map(e=>({id:e.suiteId,name:e.suiteName,passRate:e.summary.passRate}))}},"listCustomEvalSuites",0,_,"listEvalRuns",0,p,"listModelEvalRunsForRouting",0,function(e){let t=[...new Set(e.targetIds.map(e=>e.trim()).filter(Boolean))].slice(0,200);if(0===t.length)return[];let r=Array.isArray(e.suiteIds)?[...new Set(e.suiteIds.map(e=>e.trim()).filter(Boolean))].slice(0,50):[],a=(0,n.getDbInstance)(),i=["target_type = 'model'"],o=[];i.push(`target_id IN (${t.map(()=>"?").join(", ")})`),o.push(...t),r.length>0&&(i.push(`suite_id IN (${r.map(()=>"?").join(", ")})`),o.push(...r));let s=Number(e.maxAgeHours);Number.isFinite(s)&&s>0&&(i.push("created_at >= ?"),o.push(new Date(Date.now()-60*s*6e4).toISOString()));let l=Number.isFinite(Number(e.limit))?Math.min(1e3,Math.max(1,Math.floor(Number(e.limit)))):Math.min(1e3,Math.max(50,t.length*Math.max(3,r.length||5)*2));return o.push(l),a.prepare(`SELECT *
       FROM eval_runs
       WHERE ${i.join(" AND ")}
       ORDER BY created_at DESC
       LIMIT ?`).all(...o).map(e=>d(e)).filter(e=>null!==e)},"saveCustomEvalSuite",0,function(e){let r=(0,n.getDbInstance)();i(r);let a=new Date().toISOString(),o="string"==typeof e.id&&e.id.trim().length>0?e.id.trim():(0,t.randomUUID)(),s=e.name.trim(),c="string"==typeof e.description&&e.description.trim().length>0?e.description.trim():null;if(!s)throw Error("Suite name is required");if(!Array.isArray(e.cases)||0===e.cases.length)throw Error("At least one eval case is required");r.prepare("BEGIN").run();try{r.prepare("SELECT id FROM eval_suites WHERE id = ?").get(o)?r.prepare(`UPDATE eval_suites
         SET name = ?, description = ?, updated_at = ?
         WHERE id = ?`).run(s,c,a,o):r.prepare(`INSERT INTO eval_suites (id, name, description, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?)`).run(o,s,c,a,a),r.prepare("DELETE FROM eval_cases WHERE suite_id = ?").run(o),e.cases.forEach((e,n)=>{let i="string"==typeof e.id&&e.id.trim().length>0?e.id.trim():(0,t.randomUUID)(),s=e.name.trim(),c="string"==typeof e.model&&e.model.trim().length>0?e.model.trim():null,d=l(e.input),p=u(e.expected),_=Array.isArray(e.tags)?e.tags.map(e=>e.trim()).filter(e=>e.length>0):[];if(!s)throw Error(`Case ${n+1} is missing a name`);if(0===d.messages.length)throw Error(`Case ${n+1} must include at least one message`);if(("contains"===p.strategy||"exact"===p.strategy||"regex"===p.strategy)&&!p.value)throw Error(`Case ${n+1} must include an expected value`);r.prepare(`INSERT INTO eval_cases
          (id, suite_id, sort_order, name, model, input_json, expected_strategy, expected_value,
           tags_json, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(i,o,n,s,c,JSON.stringify(d),p.strategy,p.value||null,JSON.stringify(_),a,a)}),r.prepare("COMMIT").run()}catch(e){throw r.prepare("ROLLBACK").run(),e}let d=E(o);if(!d)throw Error("Failed to persist eval suite");return d},"saveEvalRun",0,function(e){let r=(0,n.getDbInstance)(),a=e.createdAt||new Date().toISOString(),i=(0,t.randomUUID)(),o="string"==typeof e.target.id&&e.target.id.trim().length>0?e.target.id.trim():null,s=Number.isFinite(Number(e.avgLatencyMs))?Math.max(0,Math.round(Number(e.avgLatencyMs))):0;return r.prepare(`INSERT INTO eval_runs
      (id, run_group_id, suite_id, suite_name, target_type, target_id, target_label, api_key_id,
       pass_rate, total, passed, failed, avg_latency_ms, summary_json, results_json, outputs_json, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(i,e.runGroupId||null,e.suiteId,e.suiteName,e.target.type,o,e.target.label,e.apiKeyId||null,e.summary.passRate,e.summary.total,e.summary.passed,e.summary.failed,s,JSON.stringify(e.summary),JSON.stringify(e.results||[]),JSON.stringify(e.outputs||{}),a),{id:i,runGroupId:e.runGroupId||null,suiteId:e.suiteId,suiteName:e.suiteName,target:{type:e.target.type,id:o,key:c(e.target.type,o),label:e.target.label},apiKeyId:e.apiKeyId||null,avgLatencyMs:s,summary:e.summary,results:e.results||[],outputs:e.outputs||{},createdAt:a}},"serializeEvalTargetKey",0,c])},196164,e=>{"use strict";var t=e.i(666680),n=e.i(830471),r=e.i(330485);let a=/^vlo_[A-Za-z0-9_-]{43}$/,i=()=>(0,n.getDbInstance)(),o=e=>(0,r.rowToCamel)(e);function s(e){let t=Date.parse(e??new Date().toISOString());if(!Number.isFinite(t))throw Error("now must be a valid ISO timestamp");return new Date(t).toISOString()}function l(e,t){let n=Math.min(18e5,Math.max(1e3,t??12e4));return new Date(Date.parse(e)+n).toISOString()}function u(e){if(!a.test(e))throw Error("lease owner must use the canonical vlo_ base64url format");return(0,t.createHash)("sha256").update(e).digest("hex")}function c(e){let t;if(i().immediate(()=>t=e()),void 0===t)throw Error("lease transaction did not produce a result");return t}function d(e){return i().prepare(`UPDATE exclusive_connection_leases
       SET state = 'EXPIRED', ended_at = ?, end_reason = 'TTL_EXPIRED'
       WHERE state = 'ACTIVE' AND expires_at <= ?`).run(e,e).changes}function p(e,t){return i().prepare(`SELECT * FROM exclusive_connection_leases WHERE state = 'ACTIVE' AND ${e} = ?`).get(t)}function _(e){let t=i().prepare(`INSERT INTO exclusive_connection_leases
       (lease_owner_hash, api_key_id, provider, connection_id, generation, state,
        acquired_at, renewed_at, expires_at)
       VALUES (?, ?, ?, ?, ?, 'ACTIVE', ?, ?, ?)`).run(e.ownerHash,e.apiKeyId,e.provider,e.connectionId,e.generation,e.now,e.now,l(e.now,e.ttlMs));return o(i().prepare("SELECT * FROM exclusive_connection_leases WHERE id = ?").get(t.lastInsertRowid))}function E(e){return e instanceof Error&&(/UNIQUE constraint failed: exclusive_connection_leases\.(connection_id|lease_owner_hash)/i.test(e.message)||/idx_exclusive_lease_active_(connection|owner)/i.test(e.message))}function g(e,t){let n=p("lease_owner_hash",e);return n?{kind:"OWNER_ALREADY_ACTIVE",lease:o(n)}:{kind:"CONNECTION_BUSY",retryAfter:p("connection_id",t)?.expires_at??null}}function m(e){return c(()=>{var t,n;d(e.now);let r=1===i().prepare(e.sql).run(...e.args).changes,a=(t=e.ownerHash,n=e.generation,i().prepare(`SELECT * FROM exclusive_connection_leases
       WHERE lease_owner_hash = ? AND generation = ? ORDER BY id DESC LIMIT 1`).get(t,n));return r||e.accept?.(a)?{kind:e.kind,lease:o(a)}:{kind:"STALE"}})}function y(e){return c(()=>d(s(e)))}e.s(["LEASE_OWNER_PATTERN",0,a,"acquireExclusiveConnectionLease",0,function(e){let t=u(e.leaseOwnerId),n=s(e.now);try{return c(()=>{d(n);let r=p("lease_owner_hash",t);if(r)return r.api_key_id!==e.apiKeyId||r.connection_id!==e.connectionId?{kind:"OWNER_ALREADY_ACTIVE",lease:o(r)}:(i().prepare(`UPDATE exclusive_connection_leases SET renewed_at = ?, expires_at = ?,
             provider = ? WHERE id = ? AND state = 'ACTIVE' AND api_key_id = ?`).run(n,l(n,e.ttlMs),e.provider,r.id,e.apiKeyId),{kind:"REUSED",lease:o(p("lease_owner_hash",t))});let a=p("connection_id",e.connectionId);return a?{kind:"CONNECTION_BUSY",retryAfter:a.expires_at}:{kind:"ACQUIRED",lease:_({...e,ownerHash:t,generation:function(e){let t=Number(i().prepare("SELECT COALESCE(MAX(generation), 0) AS generation FROM exclusive_connection_leases WHERE lease_owner_hash = ?").get(e).generation)+1;if(!Number.isSafeInteger(t)||t<=0)throw Error("lease generation exhausted");return t}(t),now:n})}})}catch(n){if(!E(n))throw n;return g(t,e.connectionId)}},"assertExclusiveConnectionLeaseFence",0,function(e){let t=u(e.leaseOwnerId);y(e.now);let n=p("lease_owner_hash",t);if(!n)return{kind:"REQUIRED"};if(n.generation!==e.generation)return{kind:"STALE"};let r=o(n);return n.api_key_id!==e.apiKeyId?{kind:"AUTHORIZATION_MISMATCH",lease:r}:n.connection_id===e.connectionId?{kind:"VALID",lease:r}:{kind:"CONNECTION_MISMATCH",lease:r}},"getActiveExclusiveConnectionLease",0,function(e,t){let n=u(e);y(t);let r=p("lease_owner_hash",n);return r?o(r):null},"getExclusiveLeaseOccupancy",0,function(e,t){return(y(t),0===e.length)?new Map:new Map(i().prepare(`SELECT connection_id, lease_owner_hash, expires_at FROM exclusive_connection_leases
       WHERE state = 'ACTIVE' AND connection_id IN (${e.map(()=>"?").join(", ")})`).all(...e).map(e=>[e.connection_id,{leaseOwnerHash:e.lease_owner_hash,expiresAt:e.expires_at}]))},"hashLeaseOwnerId",0,u,"invalidateExclusiveConnectionLease",0,function(e){let t=u(e.leaseOwnerId),n=s(e.now);return m({ownerHash:t,generation:e.generation,now:n,kind:"INVALIDATED",sql:`UPDATE exclusive_connection_leases SET state = 'INVALIDATED', ended_at = ?, end_reason = ?
          WHERE lease_owner_hash = ? AND generation = ? AND api_key_id = ?
          AND state = 'ACTIVE' AND expires_at > ?`,args:[n,e.reason,t,e.generation,e.apiKeyId,n]})},"isExclusiveConnectionActivelyLeased",0,function(e,t){return!!e&&(y(t),void 0!==p("connection_id",e))},"reconcileExpiredExclusiveConnectionLeases",0,y,"releaseExclusiveConnectionLease",0,function(e){let t=u(e.leaseOwnerId),n=s(e.now);return m({ownerHash:t,generation:e.generation,now:n,kind:"RELEASED",sql:`UPDATE exclusive_connection_leases SET state = 'RELEASED', ended_at = ?, end_reason = ?
          WHERE lease_owner_hash = ? AND generation = ? AND api_key_id = ?
          AND state = 'ACTIVE' AND expires_at > ?`,args:[n,e.reason??"OWNER_EXIT",t,e.generation,e.apiKeyId,n],accept:t=>t?.state==="RELEASED"&&t.api_key_id===e.apiKeyId})},"renewExclusiveConnectionLease",0,function(e){let t=u(e.leaseOwnerId),n=s(e.now);return m({ownerHash:t,generation:e.generation,now:n,kind:"RENEWED",sql:`UPDATE exclusive_connection_leases SET renewed_at = ?, expires_at = ?
          WHERE lease_owner_hash = ? AND generation = ? AND api_key_id = ?
          AND state = 'ACTIVE' AND expires_at > ?`,args:[n,l(n,e.ttlMs),t,e.generation,e.apiKeyId,n]})},"transitionExclusiveConnectionLease",0,function(e){let t=u(e.leaseOwnerId),n=s(e.now);try{return c(()=>{d(n);let r=p("lease_owner_hash",t);if(!r||r.generation!==e.generation||r.api_key_id!==e.apiKeyId)return{kind:"STALE"};if(r.connection_id===e.connectionId)return{kind:"REUSED",lease:o(r)};let a=p("connection_id",e.connectionId);return a?{kind:"CONNECTION_BUSY",retryAfter:a.expires_at}:(i().prepare(`UPDATE exclusive_connection_leases SET state = 'INVALIDATED', ended_at = ?,
           end_reason = ? WHERE id = ? AND state = 'ACTIVE'`).run(n,e.reason,r.id),{kind:"TRANSITIONED",lease:_({...e,ownerHash:t,now:n})})})}catch(n){if(!E(n))throw n;return g(t,e.connectionId)}}])},773412,e=>{"use strict";var t=e.i(830471),n=e.i(330485),r=e.i(995031),a=e.i(138435);let i="id, bytes, created_at, filename, purpose, mime_type, api_key_id, expires_at, deleted_at";function o(e){let r=(0,t.getDbInstance)().prepare(`SELECT ${i} FROM files WHERE id = ? AND deleted_at IS NULL`).get(e);return r?(0,n.rowToCamel)(r):null}e.s(["countFiles",0,function(e={}){let n=(0,t.getDbInstance)(),{apiKeyId:r,purpose:a}=e,i="SELECT COUNT(*) as c FROM files WHERE deleted_at IS NULL",o=[];r&&(i+=" AND api_key_id = ?",o.push(r)),a&&(i+=" AND purpose = ?",o.push(a));let s=n.prepare(i).get(...o);return s?Number(s.c):0},"createFile",0,function(e){let n=(0,t.getDbInstance)(),i="file-"+(0,r.v4)().replaceAll("-","").substring(0,24),o=Math.floor(Date.now()/1e3),s=e.expiresAt;void 0===s&&"batch"===e.purpose&&(s=o+a.DEFAULT_BATCH_EXPIRATION_SECONDS);let l={id:i,bytes:e.bytes,createdAt:o,filename:e.filename,purpose:e.purpose,content:e.content??null,mimeType:e.mimeType??null,apiKeyId:e.apiKeyId??null,expiresAt:s??null,deletedAt:null};return n.prepare(`
    INSERT INTO files (id, bytes, created_at, filename, purpose, content, mime_type, api_key_id, expires_at, deleted_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(l.id,l.bytes,l.createdAt,l.filename,l.purpose,l.content,l.mimeType,l.apiKeyId,l.expiresAt,l.deletedAt),l},"deleteFile",0,function(e){return(0,t.getDbInstance)().prepare("UPDATE files SET deleted_at = ?, content = NULL WHERE id = ?").run(Math.floor(Date.now()/1e3),e).changes>0},"formatFileResponse",0,function(e){let t="number"==typeof e.createdAt&&Number.isFinite(e.createdAt)?e.createdAt:0,n="number"==typeof e.expiresAt&&Number.isFinite(e.expiresAt)?e.expiresAt:null;return{id:e.id,bytes:e.bytes,created_at:t,filename:e.filename,object:"file",purpose:e.purpose,expires_at:n}},"getFile",0,o,"getFileContent",0,function(e){let n=(0,t.getDbInstance)().prepare("SELECT content FROM files WHERE id = ? AND deleted_at IS NULL").get(e);return n?.content?Buffer.isBuffer(n.content)?n.content:Buffer.from(n.content):null},"listFiles",0,function(e={}){let r=(0,t.getDbInstance)(),{apiKeyId:a,purpose:s,limit:l=20,after:u,order:c="desc"}=e,d=`SELECT ${i} FROM files WHERE deleted_at IS NULL`,p=[];if(a&&(d+=" AND api_key_id = ?",p.push(a)),s&&(d+=" AND purpose = ?",p.push(s)),u){let e=o(u);e&&("desc"===c?d+=" AND (created_at < ? OR (created_at = ? AND id < ?))":d+=" AND (created_at > ? OR (created_at = ? AND id > ?))",p.push(e.createdAt,e.createdAt,u))}return d+=` ORDER BY created_at ${"asc"===c?"ASC":"DESC"}, id ${"asc"===c?"ASC":"DESC"} LIMIT ?`,p.push(l),r.prepare(d).all(...p).map(e=>(0,n.rowToCamel)(e))}])},127441,e=>{"use strict";var t=e.i(682611),n=e.i(830471);let r="functionalGatewayMirrors",a="EXPOSE_FUNCTIONAL_GATEWAY_MIRRORS";function i(e){return"on"===e||"off"===e?e:null}function o(e){return`provider:${e}`}function s(e){return`model:${e}`}function l(){let e;if("1"===(e=process.env[a])||"true"===e)return{enabled:!0,source:"env"};let n=(0,t.getFeatureFlagOverride)(a);return void 0!==n?{enabled:"true"===n||"1"===n,source:"db"}:{enabled:!1,source:"default"}}e.s(["getFunctionalGatewayGlobalState",0,l,"getFunctionalGatewayModelSetting",0,function(e){let t=(0,n.getDbInstance)().prepare("SELECT value FROM key_value WHERE namespace = ? AND key = ?").get(r,s(e));return i(t?.value)},"getFunctionalGatewayProviderSetting",0,function(e){let t=(0,n.getDbInstance)().prepare("SELECT value FROM key_value WHERE namespace = ? AND key = ?").get(r,o(e));return i(t?.value)},"getFunctionalGatewaySettingsBulk",0,function(){let e=(0,n.getDbInstance)().prepare("SELECT key, value FROM key_value WHERE namespace = ?").all(r),t=new Map,a=new Map;for(let n of e){let e=i(n.value);null!==e&&(n.key.startsWith("provider:")?t.set(n.key.slice(9),e):n.key.startsWith("model:")&&a.set(n.key.slice(6),e))}return{providers:t,models:a}},"isFunctionalGatewayGlobalEnabled",0,function(){return l().enabled},"setFunctionalGatewayModelSetting",0,function(e,t){let a=(0,n.getDbInstance)(),i=s(e);null===t?a.prepare("DELETE FROM key_value WHERE namespace = ? AND key = ?").run(r,i):a.prepare("INSERT OR REPLACE INTO key_value (namespace, key, value) VALUES (?, ?, ?)").run(r,i,t)},"setFunctionalGatewayProviderSetting",0,function(e,t){let a=(0,n.getDbInstance)(),i=o(e);null===t?a.prepare("DELETE FROM key_value WHERE namespace = ? AND key = ?").run(r,i):a.prepare("INSERT OR REPLACE INTO key_value (namespace, key, value) VALUES (?, ?, ?)").run(r,i,t)}])},339176,e=>{"use strict";var t=e.i(830471);function n(e){return{host:e.host,enabled:1===e.enabled,label:e.label,kind:e.kind,added_at:e.added_at,last_seen_at:e.last_seen_at}}e.s(["addCustomHost",0,function(e,n="custom",r){let a=(0,t.getDbInstance)(),i=new Date().toISOString();a.prepare(`INSERT OR IGNORE INTO inspector_custom_hosts (host, enabled, label, kind, added_at)
     VALUES (?, 1, ?, ?, ?)`).run(e,r??null,n,i)},"isCustomHost",0,function(e){return void 0!==(0,t.getDbInstance)().prepare("SELECT 1 AS found FROM inspector_custom_hosts WHERE host = ? AND enabled = 1").get(e)},"listCustomHosts",0,function(e){let r=(0,t.getDbInstance)();return(e?.enabledOnly===!0?r.prepare("SELECT * FROM inspector_custom_hosts WHERE enabled = 1 ORDER BY host ASC").all():r.prepare("SELECT * FROM inspector_custom_hosts ORDER BY host ASC").all()).map(n)},"removeCustomHost",0,function(e){(0,t.getDbInstance)().prepare("DELETE FROM inspector_custom_hosts WHERE host = ?").run(e)},"toggleCustomHost",0,function(e,n){(0,t.getDbInstance)().prepare("UPDATE inspector_custom_hosts SET enabled = ? WHERE host = ?").run(+!!n,e)},"touchLastSeen",0,function(e){let n=(0,t.getDbInstance)(),r=new Date().toISOString();n.prepare("UPDATE inspector_custom_hosts SET last_seen_at = ? WHERE host = ?").run(r,e)}])},680516,e=>{"use strict";var t=e.i(830471);let n="interception_rules",r=null;function a(e){return null!==e&&"object"==typeof e&&!Array.isArray(e)}function i(e){return"string"==typeof e&&e.trim().length>0?e.trim():null}function o(e){return"boolean"==typeof e?e:void 0}function s(e){return"firecrawl"===e||"jina"===e||"tavily"===e?e:void 0}function l(e){return i(e)?(null===r&&(r=function(){let e=function(e){let n=(0,t.getDbInstance)().prepare("SELECT key, value FROM key_value WHERE namespace = ?").all(e),r={};for(let e of n)r[e.key]=function(e){if("string"!=typeof e)return e;try{return JSON.parse(e)}catch{return e}}(e.value);return r}(n),r=new Map;for(let[t,n]of Object.entries(e)){let e=function(e){if(!a(e))return null;let t=function(e){let t={};if(!a(e))return t;for(let[n,r]of Object.entries(e)){let e=function(e){if(!a(e))return null;let t={interceptSearch:o(e.interceptSearch),interceptFetch:o(e.interceptFetch),fetchBackend:s(e.fetchBackend),fetchProxyUrl:i(e.fetchProxyUrl)??void 0};return Object.values(t).some(e=>void 0!==e)?t:null}(r);e&&(t[n]=e)}return t}(e.models);return{interceptSearch:o(e.interceptSearch),interceptFetch:o(e.interceptFetch),fetchBackend:s(e.fetchBackend),fetchProxyUrl:i(e.fetchProxyUrl)??void 0,models:Object.keys(t).length>0?t:void 0}}(n);e&&r.set(t,e)}return r}()),r).get(e)??null:null}e.s(["deleteInterceptionRules",0,function(e){let a=i(e);a&&((0,t.getDbInstance)().prepare("DELETE FROM key_value WHERE namespace = ? AND key = ?").run(n,a),r=null)},"getInterceptionRules",0,l,"resolveInterceptFetch",0,function(e,t){let n=i(e);if(!n)return;let r=l(n);if(!r)return;let a=i(t);return a&&r.models?.[a]?.interceptFetch!==void 0?r.models[a].interceptFetch:r.interceptFetch},"resolveInterceptSearch",0,function(e,t){let n=i(e);if(!n)return;let r=l(n);if(!r)return;let a=i(t);return a&&r.models?.[a]?.interceptSearch!==void 0?r.models[a].interceptSearch:r.interceptSearch},"setInterceptionRules",0,function(e,a){let o=i(e);if(!o)return;let s=(0,t.getDbInstance)().prepare("INSERT OR REPLACE INTO key_value (namespace, key, value) VALUES (?, ?, ?)"),l={interceptSearch:a.interceptSearch,interceptFetch:a.interceptFetch,fetchBackend:a.fetchBackend,fetchProxyUrl:a.fetchProxyUrl,models:a.models&&Object.keys(a.models).length>0?a.models:void 0};s.run(n,o,JSON.stringify(l)),r=null}])},24854,e=>{"use strict";var t=e.i(830471);function n(e){return{id:e.id,type:e.type,cron:e.cron,intervalMs:e.interval_ms,enabled:1===e.enabled,envFlag:e.env_flag,config:e.config?JSON.parse(e.config):{},createdAt:e.created_at,updatedAt:e.updated_at}}function r(e){return{id:e.id,jobId:e.job_id,startedAt:e.started_at,finishedAt:e.finished_at,status:e.status,errorMessage:e.error_message,recordsAffected:e.records_affected??0,durationMs:e.duration_ms}}e.s(["cleanupOrphanedRuns",0,function(e=5){let n=(0,t.getDbInstance)(),r=new Date(Date.now()-6e4*e).toISOString();n.prepare(`UPDATE job_runs
     SET status = 'failure',
         error_message = 'orphaned: exceeded timeout',
         finished_at = datetime('now')
     WHERE status = 'running' AND started_at < ?`).run(r)},"getAllJobs",0,function(){return(0,t.getDbInstance)().prepare("SELECT * FROM jobs ORDER BY id").all().map(n)},"getJob",0,function(e){let r=(0,t.getDbInstance)().prepare("SELECT * FROM jobs WHERE id = ?").get(e);return r?n(r):null},"getRuns",0,function(e,n=20){return(0,t.getDbInstance)().prepare("SELECT * FROM job_runs WHERE job_id = ? ORDER BY started_at DESC LIMIT ?").all(e,n).map(r)},"pruneRuns",0,function(e,n=100,r=30){let a=(0,t.getDbInstance)(),i=new Date(Date.now()-864e5*r).toISOString();a.prepare(`DELETE FROM job_runs
     WHERE job_id = ?
       AND id NOT IN (
         SELECT id FROM job_runs WHERE job_id = ? ORDER BY started_at DESC LIMIT ?
       )
       AND started_at < ?`).run(e,e,n,i)},"recordRun",0,function(e,n,r={}){let a=(0,t.getDbInstance)(),i=r.startedAt??new Date().toISOString(),o="running"===n?null:r.startedAt&&null!=r.durationMs?new Date(new Date(r.startedAt).getTime()+r.durationMs).toISOString():new Date().toISOString();a.prepare(`INSERT INTO job_runs (job_id, started_at, finished_at, status, error_message, records_affected, duration_ms)
     VALUES (?, ?, ?, ?, ?, ?, ?)`).run(e,i,o,n,r.errorMessage??null,r.recordsAffected??0,r.durationMs??null)},"updateJobEnabled",0,function(e,n){(0,t.getDbInstance)().prepare("UPDATE jobs SET enabled = ?, updated_at = datetime('now') WHERE id = ?").run(+!!n,e)},"upsertJob",0,function(e){(0,t.getDbInstance)().prepare(`INSERT INTO jobs (id, type, cron, interval_ms, enabled, env_flag, config, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
     ON CONFLICT(id) DO UPDATE SET
       type = excluded.type,
       cron = excluded.cron,
       interval_ms = excluded.interval_ms,
       env_flag = excluded.env_flag,
       config = excluded.config,
       updated_at = datetime('now')`).run(e.id,e.type,e.cron,e.intervalMs,+!!e.enabled,e.envFlag,JSON.stringify(e.config??{}),e.createdAt)}])},673604,e=>{"use strict";var t=e.i(830471);let n="local_corpus",r="root_path";function a(){try{let e=(0,t.getDbInstance)().prepare("SELECT value FROM key_value WHERE namespace = ? AND key = ?").get(n,r);if("string"!=typeof e?.value)return null;let a=JSON.parse(e.value);return"string"==typeof a&&a.trim()?a:null}catch{return null}}e.s(["clearLocalCorpusRoot",0,function(){(0,t.getDbInstance)().prepare("DELETE FROM key_value WHERE namespace = ? AND key = ?").run(n,r)},"getLocalCorpusConfig",0,function(){let e=a();return{rootPath:e,configured:null!==e}},"getLocalCorpusRoot",0,a,"setLocalCorpusRoot",0,function(e){(0,t.getDbInstance)().prepare("INSERT OR REPLACE INTO key_value (namespace, key, value) VALUES (?, ?, ?)").run(n,r,JSON.stringify(e))}])},697387,e=>{"use strict";var t=e.i(830471);function n(){let e=(0,t.getDbInstance)().prepare("SELECT active_dim, embedding_signature, last_reset_at, vec_loaded FROM memory_vec_meta WHERE id = 1").get();return e?{activeDim:e.active_dim,embeddingSignature:e.embedding_signature,lastResetAt:e.last_reset_at,vecLoaded:1===e.vec_loaded}:{activeDim:null,embeddingSignature:null,lastResetAt:null,vecLoaded:!1}}e.s(["countMemoryReindexPending",0,function(){return(0,t.getDbInstance)().prepare("SELECT COUNT(*) AS cnt FROM memories WHERE needs_reindex = 1").get().cnt},"getMemoryReindexQueue",0,function(e){return(0,t.getDbInstance)().prepare(`SELECT id, content, COALESCE(key, '') AS key
       FROM memories
       WHERE needs_reindex = 1
       ORDER BY created_at ASC
       LIMIT ?`).all(e)},"getMemoryVecMeta",0,n,"markAllMemoriesNeedReindex",0,function(){return(0,t.getDbInstance)().prepare("UPDATE memories SET needs_reindex = 1").run().changes},"markMemoryNeedsReindex",0,function(e,n){(0,t.getDbInstance)().prepare("UPDATE memories SET needs_reindex = ? WHERE id = ?").run(+!!n,e)},"setMemoryVecMeta",0,function(e){let r=(0,t.getDbInstance)(),a=n(),i="activeDim"in e?e.activeDim??null:a.activeDim,o="embeddingSignature"in e?e.embeddingSignature??null:a.embeddingSignature,s="lastResetAt"in e?e.lastResetAt??null:a.lastResetAt,l="vecLoaded"in e?+!!e.vecLoaded:+!!a.vecLoaded;r.prepare(`INSERT OR REPLACE INTO memory_vec_meta
       (id, active_dim, embedding_signature, last_reset_at, vec_loaded)
     VALUES (1, ?, ?, ?, ?)`).run(i,o,s,l)}])},639015,e=>{"use strict";var t=e.i(830471);function n(e){return{name:e.name,description:e.description,priority:e.priority,scope:"combo"===e.scope_type&&e.combo_id?{type:"combo",comboId:e.combo_id}:{type:"global"},enabled:1===e.enabled,code:e.code,createdAt:e.created_at,updatedAt:e.updated_at,runCount:e.run_count,lastError:e.last_error||void 0}}function r(e){return{name:e.name,description:e.description,priority:e.priority,scope_type:e.scope.type,combo_id:"combo"===e.scope.type?e.scope.comboId:null,enabled:+!!e.enabled,code:e.code,created_at:e.createdAt||new Date().toISOString(),updated_at:new Date().toISOString(),run_count:e.runCount||0,last_error:e.lastError}}function a(e){let r=(0,t.getDbInstance)().prepare("SELECT * FROM middleware_hooks WHERE name = ?").get(e);return r?n(r):void 0}e.s(["cleanupHookLogs",0,function(e=1e4){return(0,t.getDbInstance)().prepare(`
    DELETE FROM middleware_logs WHERE id NOT IN (
      SELECT id FROM middleware_logs ORDER BY timestamp DESC LIMIT ?
    )
  `).run(e).changes},"createMiddlewareHook",0,function(e){let n=(0,t.getDbInstance)(),i=r(e);return i.created_at=new Date().toISOString(),i.updated_at=i.created_at,n.prepare(`
    INSERT INTO middleware_hooks (name, description, priority, scope_type, combo_id, enabled, code, created_at, updated_at, run_count, last_error)
    VALUES (@name, @description, @priority, @scope_type, @combo_id, @enabled, @code, @created_at, @updated_at, @run_count, @last_error)
  `).run(i),a(e.name)},"deleteMiddlewareHook",0,function(e){return(0,t.getDbInstance)().prepare("DELETE FROM middleware_hooks WHERE name = ?").run(e).changes>0},"getAllMiddlewareHooks",0,function(){return(0,t.getDbInstance)().prepare("SELECT * FROM middleware_hooks ORDER BY priority ASC, name ASC").all().map(n)},"getComboMiddlewareHooks",0,function(e){return(0,t.getDbInstance)().prepare("SELECT * FROM middleware_hooks WHERE enabled = 1 AND (scope_type = 'global' OR (scope_type = 'combo' AND combo_id = ?)) ORDER BY priority ASC").all(e).map(n)},"getEnabledMiddlewareHooks",0,function(){return(0,t.getDbInstance)().prepare("SELECT * FROM middleware_hooks WHERE enabled = 1 ORDER BY priority ASC").all().map(n)},"getHookLogs",0,function(e,n=50){let r=(0,t.getDbInstance)();return(e?r.prepare("SELECT * FROM middleware_logs WHERE hook_name = ? ORDER BY timestamp DESC LIMIT ?").all(e,n):r.prepare("SELECT * FROM middleware_logs ORDER BY timestamp DESC LIMIT ?").all(n)).map(e=>({id:e.id,hookName:e.hook_name,requestId:e.request_id,durationMs:e.duration_ms,mutated:1===e.mutated,skipped:1===e.skipped,error:e.error,timestamp:e.timestamp}))},"getMiddlewareHook",0,a,"insertHookLog",0,function(e){(0,t.getDbInstance)().prepare(`
    INSERT INTO middleware_logs (id, hook_name, request_id, duration_ms, mutated, skipped, error, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(e.id,e.hookName,e.requestId,e.durationMs,+!!e.mutated,+!!e.skipped,e.error||null,e.timestamp)},"recordHookExecution",0,function(e,n){let r=(0,t.getDbInstance)();n?r.prepare("UPDATE middleware_hooks SET run_count = run_count + 1, last_error = ?, updated_at = datetime('now') WHERE name = ?").run(n,e):r.prepare("UPDATE middleware_hooks SET run_count = run_count + 1, last_error = NULL, updated_at = datetime('now') WHERE name = ?").run(e)},"updateMiddlewareHook",0,function(e,n){let i=a(e);if(!i)return;let o=r({...i,...n,updatedAt:new Date().toISOString()});return(0,t.getDbInstance)().prepare(`
    UPDATE middleware_hooks SET
      description = @description,
      priority = @priority,
      scope_type = @scope_type,
      combo_id = @combo_id,
      enabled = @enabled,
      code = @code,
      updated_at = @updated_at,
      run_count = @run_count,
      last_error = @last_error
    WHERE name = @name
  `).run(o),a(e)}])},896326,e=>{"use strict";var t=e.i(446786),n=e.i(814747),r=e.i(146379);function a(){try{if(process.versions.bun)return(0,r.runtimeRequire)("bun:sqlite").Database;return(0,r.runtimeRequire)("better-sqlite3")}catch{return null}}function i(e=!1){return e?{readonly:!0}:{readwrite:!0,create:!0}}let o=()=>n.default.join(n.default.join(t.default.homedir(),".omp","agent"),"agent.db");e.s(["deleteOmpCredentials",0,function(e){let t=a();if(!t)return;let n=new t(o(),i());n.prepare("DELETE FROM auth_credentials WHERE provider = ?").run(e),n.close()},"getOmpCredentials",0,function(e){let t=a();if(!t)return{hasOmniRoute:!1,baseUrl:null,apiKey:null};let n=o();try{let r=new t(n,i(!0)),a=r.prepare("SELECT data FROM auth_credentials WHERE provider = ? AND credential_type = 'api_key'").get(e);if(r.close(),a?.data){let e=JSON.parse(a.data);return{hasOmniRoute:!0,baseUrl:e.baseUrl||null,apiKey:e.apiKey||null}}return{hasOmniRoute:!1,baseUrl:null,apiKey:null}}catch{return{hasOmniRoute:!1,baseUrl:null,apiKey:null}}},"saveOmpCredentials",0,function(e,t,n){let r=a();if(!r)return;let s=new r(o(),i());s.prepare("DELETE FROM auth_credentials WHERE provider = ?").run(e),s.prepare("INSERT INTO auth_credentials (provider, credential_type, data, disabled_cause, identity_key, created_at, updated_at) VALUES (?, ?, ?, NULL, NULL, ?, ?)").run(e,"api_key",JSON.stringify({apiKey:t,baseUrl:n}),Math.floor(Date.now()/1e3),Math.floor(Date.now()/1e3)),s.close()}])},61499,e=>{"use strict";var t=e.i(254799),n=e.i(830471),r=e.i(335273);function a(e){return e&&"object"==typeof e?e:{}}function i(e){let t=a(e);return{id:"string"==typeof t.id?t.id:"",name:"string"==typeof t.name?t.name:"",type:"string"==typeof t.type?t.type:"http",host:"string"==typeof t.host?t.host:"",port:Number(t.port)||0,region:"string"==typeof t.region?t.region:null,notes:"string"==typeof t.notes?t.notes:null,status:"string"==typeof t.status?t.status:"active",source:"string"==typeof t.source?t.source:"oneproxy",qualityScore:"number"==typeof t.quality_score?t.quality_score:null,latencyMs:"number"==typeof t.latency_ms?t.latency_ms:null,anonymity:"string"==typeof t.anonymity?t.anonymity:null,googleAccess:1===t.google_access||!0===t.google_access,lastValidated:"string"==typeof t.last_validated?t.last_validated:null,countryCode:"string"==typeof t.country_code?t.country_code:null,createdAt:"string"==typeof t.created_at?t.created_at:"",updatedAt:"string"==typeof t.updated_at?t.updated_at:""}}async function o(e){let t=(0,n.getDbInstance)(),r="SELECT * FROM proxy_registry WHERE source = 'oneproxy' AND status = 'active'",a=[];return e?.protocol&&(r+=" AND type = ?",a.push(e.protocol)),e?.countryCode&&(r+=" AND country_code = ?",a.push(e.countryCode)),e?.minQuality!=null&&(r+=" AND quality_score >= ?",a.push(e.minQuality)),r+=" ORDER BY quality_score DESC, last_validated DESC",e?.limit&&(r+=" LIMIT ?",a.push(e.limit)),t.prepare(r).all(...a).map(i)}async function s(){let e,t=(0,n.getDbInstance)(),r={total:Number((e=a(t.prepare(`SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        AVG(quality_score) as avg_quality,
        MAX(last_validated) as last_validated
       FROM proxy_registry WHERE source = 'oneproxy'`).get())).total)||0,active:Number(e.active)||0,avgQuality:null!==e.avg_quality&&void 0!==e.avg_quality?Math.round(100*Number(e.avg_quality))/100:null,lastValidated:"string"==typeof e.last_validated?e.last_validated:null},i=t.prepare("SELECT type as protocol, COUNT(*) as count FROM proxy_registry WHERE source = 'oneproxy' GROUP BY type ORDER BY count DESC").all(),o=t.prepare("SELECT country_code as countryCode, COUNT(*) as count FROM proxy_registry WHERE source = 'oneproxy' AND country_code IS NOT NULL GROUP BY country_code ORDER BY count DESC LIMIT 20").all();return{...r,byProtocol:i.map(e=>({protocol:String(e.protocol||"unknown"),count:Number(e.count)||0})),byCountry:o.map(e=>({countryCode:String(e.countryCode||"unknown"),count:Number(e.count)||0}))}}async function l(e){let a=(0,n.getDbInstance)(),i=new Date().toISOString(),o=`${e.protocol?.toUpperCase()||"HTTP"} - ${e.countryCode||"Unknown"} - ${e.ip}`,s=a.prepare("SELECT id FROM proxy_registry WHERE host = ? AND port = ? AND source = 'oneproxy'").get(e.ip,e.port);if(s?.id)return a.prepare(`UPDATE proxy_registry
       SET status = ?, quality_score = ?, latency_ms = ?, anonymity = ?,
           google_access = ?, last_validated = ?, country_code = ?, updated_at = ?
       WHERE id = ?`).run("active",e.qualityScore??null,e.latencyMs??null,e.anonymity??null,+!!e.googleAccess,e.lastValidated??i,e.countryCode??null,i,s.id),(0,r.backupDbFile)("pre-write"),{proxy:await u(s.id),action:"updated"};let l=(0,t.randomUUID)();return a.prepare(`INSERT INTO proxy_registry
     (id, name, type, host, port, region, notes, status, source,
      quality_score, latency_ms, anonymity, google_access, last_validated, country_code,
      created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(l,o,e.protocol||"http",e.ip,e.port,e.countryCode??null,null,"active","oneproxy",e.qualityScore??null,e.latencyMs??null,e.anonymity??null,+!!e.googleAccess,e.lastValidated??i,e.countryCode??null,i,i),(0,r.backupDbFile)("pre-write"),{proxy:await u(l),action:"created"}}async function u(e){let t=(0,n.getDbInstance)().prepare("SELECT * FROM proxy_registry WHERE id = ? AND source = 'oneproxy'").get(e);return t?i(t):null}async function c(e){let t=(0,n.getDbInstance)().prepare("DELETE FROM proxy_registry WHERE id = ? AND source = 'oneproxy'").run(e);return(0,r.backupDbFile)("pre-write"),t.changes>0}async function d(){let e=(0,n.getDbInstance)().prepare("DELETE FROM proxy_registry WHERE source = 'oneproxy'").run();return(0,r.backupDbFile)("pre-write"),e.changes}async function p(e){let t=(0,n.getDbInstance)(),r=e?.strategy||"quality",a="SELECT * FROM proxy_registry WHERE source = 'oneproxy' AND status = 'active'";switch(r){case"quality":a+=" ORDER BY quality_score DESC, latency_ms ASC LIMIT 1";break;case"random":a+=" ORDER BY RANDOM() LIMIT 1";break;case"sequential":a+=" ORDER BY last_validated ASC LIMIT 1"}let o=t.prepare(a).get();return o?i(o):null}async function _(e,t){let a=(0,n.getDbInstance)().prepare(`UPDATE proxy_registry
       SET quality_score = MAX(0, COALESCE(quality_score, 50) - 10),
           status = CASE WHEN COALESCE(quality_score, 50) <= 10 THEN 'inactive' ELSE status END,
           updated_at = datetime('now')
       WHERE host = ? AND port = ? AND source = 'oneproxy'`).run(e,t);return(0,r.backupDbFile)("pre-write"),a.changes>0}e.s(["clearAllOneproxyProxies",0,d,"deleteOneproxyProxy",0,c,"getOneproxyProxyById",0,u,"getOneproxyProxyForRotation",0,p,"getOneproxyStats",0,s,"listOneproxyProxies",0,o,"markOneproxyProxyFailed",0,_,"upsertOneproxyProxy",0,l])},767382,e=>{"use strict";var t=e.i(830471),n=e.i(666680);function r(e){let t={};try{let n=JSON.parse(e.params_json);null===n||"object"!=typeof n||Array.isArray(n)||(t=n)}catch{t={}}return{id:e.id,name:e.name,endpoint:e.endpoint,model:e.model,system:e.system,params:t,created_at:e.created_at}}function a(e){let n=(0,t.getDbInstance)().prepare("SELECT * FROM playground_presets WHERE id = ? LIMIT 1").get(e);return n?r(n):null}e.s(["createPlaygroundPreset",0,function(e){let r=(0,t.getDbInstance)(),i=(0,n.randomUUID)(),o=JSON.stringify(e.params??{}),s=e.system??null;return r.prepare("INSERT INTO playground_presets (id, name, endpoint, model, system, params_json) VALUES (?, ?, ?, ?, ?, ?)").run(i,e.name,e.endpoint,e.model,s,o),a(i)},"deletePlaygroundPreset",0,function(e){return(0,t.getDbInstance)().prepare("DELETE FROM playground_presets WHERE id = ?").run(e).changes>0},"getPlaygroundPreset",0,a,"listPlaygroundPresets",0,function(e){let n=(0,t.getDbInstance)(),a=e?.limit,i=e?.offset??0,o="SELECT * FROM playground_presets ORDER BY created_at DESC",s=[];void 0!==a&&(o+=" LIMIT ? OFFSET ?",s.push(a,i));let l=n.prepare(o).all(...s),u=n.prepare("SELECT count(*) as cnt FROM playground_presets").get();return{items:l.map(r),total:u.cnt}},"updatePlaygroundPreset",0,function(e,n){let r=(0,t.getDbInstance)(),i=a(e);if(!i)return null;let o=[],s=[];return(void 0!==n.name&&(o.push("name = ?"),s.push(n.name)),void 0!==n.endpoint&&(o.push("endpoint = ?"),s.push(n.endpoint)),void 0!==n.model&&(o.push("model = ?"),s.push(n.model)),"system"in n&&(o.push("system = ?"),s.push(n.system??null)),void 0!==n.params&&(o.push("params_json = ?"),s.push(JSON.stringify(n.params))),0===o.length)?i:(s.push(e),r.prepare(`UPDATE playground_presets SET ${o.join(", ")} WHERE id = ?`).run(...s),a(e))}])},954147,e=>{"use strict";var t=e.i(830471);function n(){return(0,t.getDbInstance)()}function r(e){let t=[];try{t=JSON.parse(e.dimensions_json)}catch{t=[]}return{connectionId:e.connection_id,provider:e.provider,dimensions:t,source:e.source}}e.s(["deletePlan",0,function(e){return n().prepare("DELETE FROM provider_plans WHERE connection_id = ?").run(e).changes>0},"getPlan",0,function(e){let t=n().prepare(`SELECT connection_id, provider, dimensions_json, source, updated_at
       FROM provider_plans WHERE connection_id = ?`).get(e);return t?r(t):null},"listPlans",0,function(){return n().prepare(`SELECT connection_id, provider, dimensions_json, source, updated_at
       FROM provider_plans ORDER BY provider ASC`).all().map(r)},"upsertPlan",0,function(e,t,r,a){let i=new Date().toISOString(),o=JSON.stringify(r);n().prepare(`INSERT INTO provider_plans (connection_id, provider, dimensions_json, source, updated_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(connection_id)
       DO UPDATE SET
         provider = excluded.provider,
         dimensions_json = excluded.dimensions_json,
         source = excluded.source,
         updated_at = excluded.updated_at`).run(e,t,o,a,i)}])},913184,e=>{"use strict";var t=e.i(830471);function n(){return(0,t.getDbInstance)()}e.s(["gcOlderThan",0,function(e){return n().prepare("DELETE FROM quota_consumption WHERE updated_at < ?").run(e).changes},"getBucket",0,function(e,t,r){let a=n().prepare(`SELECT consumed FROM quota_consumption
       WHERE api_key_id = ? AND dimension_key = ? AND bucket_index = ?`).get(e,t,r);return a?.consumed??0},"getPair",0,function(e,t,r){let a=n().prepare(`SELECT consumed FROM quota_consumption
       WHERE api_key_id = ? AND dimension_key = ? AND bucket_index = ?`).get(e,t,r),i=n().prepare(`SELECT consumed FROM quota_consumption
       WHERE api_key_id = ? AND dimension_key = ? AND bucket_index = ?`).get(e,t,r-1);return{curr:a?.consumed??0,prev:i?.consumed??0}},"incrementBucket",0,function(e,t,r,a,i){n().prepare(`INSERT INTO quota_consumption (api_key_id, dimension_key, bucket_index, consumed, updated_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(api_key_id, dimension_key, bucket_index)
       DO UPDATE SET
         consumed = consumed + excluded.consumed,
         updated_at = excluded.updated_at`).run(e,t,r,a,i)},"sumPoolDimension",0,function(e,t){let r=n().prepare(`SELECT COALESCE(SUM(consumed), 0) AS total
       FROM quota_consumption
       WHERE dimension_key = ? AND bucket_index = ?`).get(e,t),a=n().prepare(`SELECT COALESCE(SUM(consumed), 0) AS total
       FROM quota_consumption
       WHERE dimension_key = ? AND bucket_index = ?`).get(e,t-1);return{currTotal:r?.total??0,prevTotal:a?.total??0}}])},608455,e=>{"use strict";var t=e.i(830471),n=e.i(687267);function r(){return(0,t.getDbInstance)()}function a(e){return{id:e.id,name:e.name,createdAt:e.created_at}}e.s(["createGroup",0,function(e){let t=crypto.randomUUID(),n=new Date().toISOString();return r().prepare("INSERT INTO quota_groups (id, name, created_at) VALUES (?, ?, ?)").run(t,e,n),{id:t,name:e,createdAt:n}},"deleteGroup",0,function(e){if("group-demo"===e)throw Error("Cannot delete the protected seed group 'group-demo'. Reassign its pools to another group first.");let t=r().prepare("SELECT COUNT(*) AS cnt FROM quota_pools WHERE group_id = ?").get(e);if(t&&t.cnt>0)throw Error(`Group '${e}' has pools; reassign or delete them first.`);return r().prepare("DELETE FROM quota_groups WHERE id = ?").run(e).changes>0},"getGroup",0,function(e){let t=r().prepare("SELECT id, name, created_at FROM quota_groups WHERE id = ?").get(e);return t?a(t):null},"getGroupName",0,function(e){let t=r().prepare("SELECT name FROM quota_groups WHERE id = ?").get(e);return t?t.name:null},"listGroups",0,function(){return r().prepare("SELECT id, name, created_at FROM quota_groups ORDER BY created_at ASC").all().map(a)},"renameGroup",0,function(e,t){return r().prepare("UPDATE quota_groups SET name = ? WHERE id = ?").run(t,e).changes>0&&((0,n.invalidateModelCatalogCache)(),!0)}])},160769,e=>{"use strict";var t=e.i(830471);function n(e){return{poolId:e.pool_id,apiKeyId:e.api_key_id,model:e.model,capValue:e.cap_value,capUnit:e.cap_unit}}function r(){return(0,t.getDbInstance)()}e.s(["deleteModelCap",0,function(e,t,n){r().prepare(`DELETE FROM quota_allocation_model_caps
       WHERE pool_id = ? AND api_key_id = ? AND model = ?`).run(e,t,n)},"getModelCap",0,function(e,t,a){let i=r().prepare(`SELECT pool_id, api_key_id, model, cap_value, cap_unit
       FROM quota_allocation_model_caps
       WHERE pool_id = ? AND api_key_id = ? AND model = ?`).get(e,t,a);return i?n(i):null},"listModelCaps",0,function(e,t){return r().prepare(`SELECT pool_id, api_key_id, model, cap_value, cap_unit
       FROM quota_allocation_model_caps
       WHERE pool_id = ? AND api_key_id = ?`).all(e,t).map(n)},"setModelCap",0,function(e){r().prepare(`INSERT INTO quota_allocation_model_caps
         (pool_id, api_key_id, model, cap_value, cap_unit)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(pool_id, api_key_id, model) DO UPDATE SET
         cap_value = excluded.cap_value,
         cap_unit  = excluded.cap_unit`).run(e.poolId,e.apiKeyId,e.model,e.capValue,e.capUnit)}])},858013,e=>e.a(async(t,n)=>{try{var r=e.i(830471),a=e.i(950412),i=e.i(687267),o=t([a]);[a]=o.then?(await o)():o;let f=new Map,A=new Set;function s(e,t){let n=f.get(e),r=n?n.catch(()=>void 0).then(t):t();f.set(e,r);let a=()=>{f.get(e)===r&&f.delete(e)};return r.then(a,a),r}async function l(t){try{let{syncQuotaCombos:n}=await e.A(544839);await n(t)}catch(e){console.warn("[quota-pools] syncQuotaCombos failed (non-fatal):",e?.message)}}async function u(t){try{let{removeQuotaCombosForPool:n}=await e.A(544839);await n(t)}catch(e){console.warn("[quota-pools] removeQuotaCombosForPool failed (non-fatal):",e?.message)}}function c(){return(0,r.getDbInstance)()}function d(e){if(!e||e.length<=1)return;let t=c(),n=e.map(()=>"?").join(","),r=t.prepare(`SELECT DISTINCT provider FROM provider_connections WHERE id IN (${n})`).all(...e).map(e=>e.provider).filter(Boolean);if(new Set(r).size>1)throw Error(`A quota pool must use a single provider (got: ${[...new Set(r)].join(", ")})`)}let O=new Set(["hard","soft","burst"]);function p(e){var t;let n={apiKeyId:e.api_key_id,weight:e.weight,policy:(t=e.policy,O.has(t)?t:"hard")};return null!=e.cap_value&&(n.capValue=e.cap_value),null!=e.cap_unit&&(n.capUnit=e.cap_unit),n}function _(e,t){var n,r;let a;return{id:e.id,connectionId:e.connection_id,connectionIds:(n=e.id,r=e.connection_id,(a=c().prepare("SELECT connection_id FROM quota_pool_connections WHERE pool_id = ? ORDER BY created_at ASC").all(n)).length>0?a.map(e=>e.connection_id):r?[r]:[]),name:e.name,groupId:e.group_id||"group-demo",createdAt:e.created_at,allocations:t}}function E(e){if(0===e.length)return[];let t=e.map(e=>e.id),n=t.map(()=>"?").join(","),r=c(),a=r.prepare(`SELECT pool_id, api_key_id, weight, cap_value, cap_unit, policy FROM quota_allocations WHERE pool_id IN (${n})`).all(...t),i=new Map;for(let e of a){let t=i.get(e.pool_id);t?t.push(e):i.set(e.pool_id,[e])}let o=r.prepare(`SELECT pool_id, connection_id FROM quota_pool_connections WHERE pool_id IN (${n}) ORDER BY created_at ASC`).all(...t),s=new Map;for(let e of o){let t=s.get(e.pool_id);t?t.push(e.connection_id):s.set(e.pool_id,[e.connection_id])}return e.map(e=>({id:e.id,connectionId:e.connection_id,connectionIds:s.get(e.id)||[e.connection_id],name:e.name,groupId:e.group_id||"group-demo",createdAt:e.created_at,allocations:(i.get(e.id)||[]).map(p)}))}function g(e){return c().prepare("SELECT pool_id, api_key_id, weight, cap_value, cap_unit, policy FROM quota_allocations WHERE pool_id = ?").all(e).map(p)}function m(e){let t=e?.limit,n=e?.offset,r="SELECT id, connection_id, name, group_id, created_at FROM quota_pools ORDER BY created_at ASC",a=[];void 0!==t&&t>0&&(r+=" LIMIT ?",a.push(t),void 0!==n&&(r+=" OFFSET ?",a.push(n)));let i=c().prepare(r).all(...a),o=c().prepare("SELECT count(*) as cnt FROM quota_pools").get();return{items:E(i),total:o.cnt}}function y(e){let t=crypto.randomUUID(),n=new Date().toISOString(),r=e.connectionIds&&e.connectionIds.length>0?e.connectionIds:[e.connectionId],a=r[0];e.connectionIds&&e.connectionIds.length>1&&d(e.connectionIds);let o=e.groupId||"group-demo",u=c();u.transaction(()=>{u.prepare("INSERT INTO quota_pools (id, connection_id, name, group_id, created_at) VALUES (?, ?, ?, ?, ?)").run(t,a,e.name,o,n);let i=u.prepare("INSERT OR IGNORE INTO quota_pool_connections (pool_id, connection_id) VALUES (?, ?)");for(let e of r)i.run(t,e);if(e.allocations&&e.allocations.length>0){let n=u.prepare(`INSERT INTO quota_allocations (pool_id, api_key_id, weight, cap_value, cap_unit, policy)
         VALUES (?, ?, ?, ?, ?, ?)`);for(let r of e.allocations)n.run(t,r.apiKeyId,r.weight,r.capValue??null,r.capUnit??null,r.policy)}})();let p=_({id:t,connection_id:a,name:e.name,group_id:o,created_at:n},g(t));return s(t,()=>l(t)),(0,i.invalidateModelCatalogCache)(),p}function S(e=[]){return JSON.stringify(e.map(e=>({apiKeyId:e.apiKeyId,weight:e.weight,capValue:e.capValue??null,capUnit:e.capUnit??null,policy:e.policy})).sort((e,t)=>e.apiKeyId.localeCompare(t.apiKeyId)))}function T(e,t){if(A.has(e))return null;let n=c(),r=n.prepare("SELECT id, connection_id, name, group_id, created_at FROM quota_pools WHERE id = ?").get(e);if(!r)return null;t.connectionIds&&t.connectionIds.length>1&&d(t.connectionIds),n.transaction(()=>{if(void 0!==t.name&&(n.prepare("UPDATE quota_pools SET name = ? WHERE id = ?").run(t.name,e),r.name=t.name),void 0!==t.groupId&&(n.prepare("UPDATE quota_pools SET group_id = ? WHERE id = ?").run(t.groupId,e),r.group_id=t.groupId),void 0!==t.connectionIds&&t.connectionIds.length>0){let a=t.connectionIds[0];n.prepare("DELETE FROM quota_pool_connections WHERE pool_id = ?").run(e);let i=n.prepare("INSERT OR IGNORE INTO quota_pool_connections (pool_id, connection_id) VALUES (?, ?)");for(let n of t.connectionIds)i.run(e,n);n.prepare("UPDATE quota_pools SET connection_id = ? WHERE id = ?").run(a,e),r.connection_id=a}if(void 0!==t.allocations){n.prepare("DELETE FROM quota_allocations WHERE pool_id = ?").run(e);let r=n.prepare(`INSERT INTO quota_allocations (pool_id, api_key_id, weight, cap_value, cap_unit, policy)
         VALUES (?, ?, ?, ?, ?, ?)`);for(let n of t.allocations)r.run(e,n.apiKeyId,n.weight,n.capValue??null,n.capUnit??null,n.policy)}})();let a=_(r,g(e));return s(e,()=>l(e)),(0,i.invalidateModelCatalogCache)(),a}async function R(e){if(A.has(e)||!c().prepare("SELECT id FROM quota_pools WHERE id = ?").get(e))return!1;A.add(e);let t=s(e,async()=>{await u(e);let t=c();return!(t.transaction(()=>(t.prepare("DELETE FROM quota_pool_connections WHERE pool_id = ?").run(e),t.prepare(`UPDATE api_keys SET allowed_quotas = COALESCE(
         (SELECT json_group_array(value) FROM json_each(api_keys.allowed_quotas) WHERE value != ?),
         '[]')
       WHERE allowed_quotas IS NOT NULL AND allowed_quotas != '[]'
         AND EXISTS (SELECT 1 FROM json_each(api_keys.allowed_quotas) WHERE value = ?)`).run(e,e),t.prepare("DELETE FROM quota_pools WHERE id = ?").run(e)))().changes<=0)&&((0,a.clearApiKeyCaches)(),(0,i.invalidateModelCatalogCache)(),!0)}),n=()=>A.delete(e);return t.then(n,n),t}e.s(["createPool",0,y,"deletePool",0,R,"ensurePool",0,function(e){let t=e.connectionIds&&e.connectionIds.length>0?e.connectionIds:[e.connectionId],n=e.groupId||"group-demo",r=m().items.find(t=>t.name===e.name&&t.groupId===n);if(!r)return{pool:y(e),created:!0,updated:!1};let a=void 0!==e.allocations&&S(r.allocations)!==S(e.allocations),i=r.connectionIds.length!==t.length||r.connectionIds.some(e=>!t.includes(e));if(!a&&!i)return{pool:r,created:!1,updated:!1};let o={connectionIds:t};void 0!==e.allocations&&(o.allocations=e.allocations),void 0!==e.groupId&&(o.groupId=e.groupId);let s=T(r.id,o);if(!s)throw Error(`Quota pool disappeared during ensure: ${r.id}`);return{pool:s,created:!1,updated:!0}},"getPool",0,function(e){let t=c().prepare("SELECT id, connection_id, name, group_id, created_at FROM quota_pools WHERE id = ?").get(e);return t?E([t])[0]:null},"getPoolsByGroup",0,function(e,t,n){let r="SELECT id, connection_id, name, group_id, created_at FROM quota_pools WHERE group_id = ? ORDER BY created_at ASC",a=[e];void 0!==t&&t>0&&(r+=" LIMIT ?",a.push(t),void 0!==n&&(r+=" OFFSET ?",a.push(n)));let i=c().prepare(r).all(...a);return E(i)},"listAllocationsForApiKey",0,function(e){return c().prepare(`SELECT pool_id, api_key_id, weight, cap_value, cap_unit, policy
       FROM quota_allocations
       WHERE api_key_id = ?`).all(e).map(e=>({poolId:e.pool_id,allocation:p(e)}))},"listPools",0,m,"updatePool",0,T,"upsertAllocations",0,function(e,t){if(A.has(e))return;let n=c(),r=t.reduce((e,t)=>e+(Number.isFinite(t.weight)?t.weight:0),0),a=0===r&&t.length>0?t.map(e=>({...e,weight:100/t.length})):t,i=n.prepare("SELECT id, connection_id, name, group_id, created_at FROM quota_pools WHERE id = ?").get(e),o=[e];if(i?.group_id){let e=n.prepare("SELECT id FROM quota_pools WHERE group_id = ?").all(i.group_id);e.length>0&&(o=e.map(e=>e.id))}n.transaction(()=>{let e=n.prepare(`INSERT INTO quota_allocations (pool_id, api_key_id, weight, cap_value, cap_unit, policy)
       VALUES (?, ?, ?, ?, ?, ?)`);for(let t of o)for(let r of(n.prepare("DELETE FROM quota_allocations WHERE pool_id = ?").run(t),a))e.run(t,r.apiKeyId,r.weight,r.capValue??null,r.capUnit??null,r.policy)})(),s(e,()=>l(e))}]),n()}catch(e){n(e)}},!1),556826,e=>{"use strict";var t=e.i(830471),n=e.i(330485);let r=0;e.s(["cleanupOldSnapshots",0,function(e=90){let n=Date.now();if(n-r<216e5)return 0;let a=(0,t.getDbInstance)(),i=new Date(Date.now()-24*e*36e5).toISOString();try{let e=a.prepare("DELETE FROM quota_snapshots WHERE created_at < ?").run(i);return r=n,e.changes}catch(e){if(e?.message?.includes("no such table"))return 0;throw e}},"getAggregatedSnapshots",0,function(e){let n=(0,t.getDbInstance)(),r=["created_at >= ?"],a=[e.since];e.provider&&(r.push("provider = ?"),a.push(e.provider)),e.until&&(r.push("created_at <= ?"),a.push(e.until));let i=60*Number(e.bucketMinutes);if(!Number.isFinite(i)||i<=0)throw Error("Invalid bucket size");let o="connection"===e.aggregateBy?"bucket, provider, connection_id, window_key":"bucket, provider, window_key",s="connection"===e.aggregateBy?"provider || ':' || connection_id as provider":"provider";try{let e=`
      SELECT
        datetime((strftime('%s', created_at) / ${i}) * ${i}, 'unixepoch') as bucket,
        ${s},
        AVG(remaining_percentage) as remainingPct,
        MAX(is_exhausted) as isExhausted,
        window_key
      FROM quota_snapshots
      WHERE ${r.join(" AND ")}
      GROUP BY ${o}
      ORDER BY bucket ASC
    `;return n.prepare(e).all(...a).map(e=>({timestamp:e.bucket,provider:e.provider,remainingPct:e.remainingPct??0,isExhausted:1===e.isExhausted,windowKey:e.windowKey}))}catch(e){if(e?.message?.includes("no such table"))return[];throw e}},"getLatestQuotaSnapshotsForConnection",0,function(e){let r=(0,t.getDbInstance)();try{return r.prepare(`SELECT * FROM (
           SELECT *, ROW_NUMBER() OVER (
             PARTITION BY window_key ORDER BY created_at DESC, id DESC
           ) AS rn
           FROM quota_snapshots
           WHERE connection_id = ?
         )
         WHERE rn = 1`).all(e).map(e=>(0,n.rowToCamel)(e))}catch(e){if(e?.message?.includes("no such table"))return[];throw e}},"getQuotaSnapshots",0,function(e){let r=(0,t.getDbInstance)(),a=["created_at >= ?"],i=[e.since];e.provider&&(a.push("provider = ?"),i.push(e.provider)),e.connectionId&&(a.push("connection_id = ?"),i.push(e.connectionId)),e.until&&(a.push("created_at <= ?"),i.push(e.until));try{let e=`SELECT * FROM quota_snapshots WHERE ${a.join(" AND ")} ORDER BY created_at ASC`;return r.prepare(e).all(...i).map(e=>(0,n.rowToCamel)(e))}catch(e){if(e?.message?.includes("no such table"))return[];throw e}},"saveQuotaSnapshot",0,function(e){let n=(0,t.getDbInstance)(),r=new Date().toISOString();try{n.prepare(`INSERT INTO quota_snapshots
       (provider, connection_id, window_key, remaining_percentage, is_exhausted,
        next_reset_at, window_duration_ms, raw_data, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(e.provider,e.connection_id,e.window_key,e.remaining_percentage,e.is_exhausted,e.next_reset_at,e.window_duration_ms,e.raw_data,r)}catch(e){if(e?.message?.includes("no such table"))return void console.warn("[QuotaSnapshots] Skipping save: quota_snapshots table not found. Awaiting migration.");throw e}}])},707708,e=>{"use strict";var t=e.i(254799),n=e.i(995031),r=e.i(830471),a=e.i(330485);function i(){return new Date().toISOString().slice(0,10)}function o(){return new Date().toISOString().slice(0,13)}function s(e){return e&&"string"==typeof e?(0,t.createHash)("sha256").update(e).digest("hex"):""}function l(e,t,n,r){let a=i(),s=o();e.prepare(`
    UPDATE ${t}
    SET daily_issued = CASE WHEN last_reset_day <> ? THEN 0 ELSE daily_issued END,
        hourly_issued = CASE WHEN last_reset_hour <> ? THEN 0 ELSE hourly_issued END,
        last_reset_day = ?,
        last_reset_hour = ?
    WHERE ${n} = ?
  `).run(a,s,a,s,r)}e.s(["checkQuota",0,function(e="",t=""){let n=(0,r.getDbInstance)();if(i(),o(),e){l(n,"provider_key_limits","provider",e);let t=n.prepare("SELECT * FROM provider_key_limits WHERE provider = ?").get(e);if(t){if(null!==t.hourly_issue_limit&&t.hourly_issued>=t.hourly_issue_limit)return{allowed:!1,errorCode:"PROVIDER_QUOTA_EXCEEDED",errorMessage:`Hourly issue limit (${t.hourly_issue_limit}) reached for provider '${e}'`,provider:e};if(null!==t.daily_issue_limit&&t.daily_issued>=t.daily_issue_limit)return{allowed:!1,errorCode:"PROVIDER_QUOTA_EXCEEDED",errorMessage:`Daily issue limit (${t.daily_issue_limit}) reached for provider '${e}'`,provider:e};if(null!==t.max_active_keys){let{activeCount:r}=n.prepare("SELECT COUNT(*) as activeCount FROM registered_keys WHERE provider = ? AND is_active = 1").get(e);if(r>=t.max_active_keys)return{allowed:!1,errorCode:"MAX_ACTIVE_KEYS_EXCEEDED",errorMessage:`Max active keys (${t.max_active_keys}) reached for provider '${e}'`,provider:e,providerActiveKeys:r}}}}if(t){l(n,"account_key_limits","account_id",t);let e=n.prepare("SELECT * FROM account_key_limits WHERE account_id = ?").get(t);if(e){if(null!==e.hourly_issue_limit&&e.hourly_issued>=e.hourly_issue_limit)return{allowed:!1,errorCode:"ACCOUNT_QUOTA_EXCEEDED",errorMessage:`Hourly issue limit (${e.hourly_issue_limit}) reached for account '${t}'`,accountId:t};if(null!==e.daily_issue_limit&&e.daily_issued>=e.daily_issue_limit)return{allowed:!1,errorCode:"ACCOUNT_QUOTA_EXCEEDED",errorMessage:`Daily issue limit (${e.daily_issue_limit}) reached for account '${t}'`,accountId:t};if(null!==e.max_active_keys){let{activeCount:r}=n.prepare("SELECT COUNT(*) as activeCount FROM registered_keys WHERE account_id = ? AND is_active = 1").get(t);if(r>=e.max_active_keys)return{allowed:!1,errorCode:"MAX_ACTIVE_KEYS_EXCEEDED",errorMessage:`Max active keys (${e.max_active_keys}) reached for account '${t}'`,accountId:t,accountActiveKeys:r}}}}return{allowed:!0}},"getAccountKeyLimit",0,function(e){let t=(0,r.getDbInstance)().prepare("SELECT * FROM account_key_limits WHERE account_id = ?").get(e);return t?(0,a.rowToCamel)(t):null},"getProviderKeyLimit",0,function(e){let t=(0,r.getDbInstance)().prepare("SELECT * FROM provider_key_limits WHERE provider = ?").get(e);return t?(0,a.rowToCamel)(t):null},"getRegisteredKey",0,function(e){let t=(0,r.getDbInstance)().prepare("SELECT * FROM registered_keys WHERE id = ?").get(e);return t?(0,a.rowToCamel)(t):null},"incrementRegisteredKeyUsage",0,function(e){(0,r.getDbInstance)().prepare(`
    UPDATE registered_keys
    SET daily_used = daily_used + 1, hourly_used = hourly_used + 1, updated_at = datetime('now')
    WHERE id = ?
  `).run(e)},"issueRegisteredKey",0,function(e){let u=(0,r.getDbInstance)(),{name:c,provider:d="",accountId:p="",idempotencyKey:_,expiresAt:E,dailyBudget:g,hourlyBudget:m}=e;if(_){let e=u.prepare("SELECT * FROM registered_keys WHERE idempotency_key = ?").get(_);if(e)return{idempotencyConflict:!0,existing:(0,a.rowToCamel)(e)}}let y="ork_"+(0,t.randomBytes)(24).toString("base64url"),S=(0,n.v4)(),T=s(y),R=y.slice(0,12);u.prepare(`
    INSERT INTO registered_keys
      (id, key, key_prefix, name, provider, account_id, idempotency_key, expires_at, daily_budget, hourly_budget, last_reset_day, last_reset_hour)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(S,T,R,c,d,p,_??null,E??null,g??null,m??null,i(),o()),d&&(l(u,"provider_key_limits","provider",d),u.prepare(`
      INSERT INTO provider_key_limits (provider, daily_issued, hourly_issued, last_reset_day, last_reset_hour)
      VALUES (?, 1, 1, ?, ?)
      ON CONFLICT(provider) DO UPDATE SET
        daily_issued = daily_issued + 1,
        hourly_issued = hourly_issued + 1,
        updated_at = datetime('now')
    `).run(d,i(),o())),p&&(l(u,"account_key_limits","account_id",p),u.prepare(`
      INSERT INTO account_key_limits (account_id, daily_issued, hourly_issued, last_reset_day, last_reset_hour)
      VALUES (?, 1, 1, ?, ?)
      ON CONFLICT(account_id) DO UPDATE SET
        daily_issued = daily_issued + 1,
        hourly_issued = hourly_issued + 1,
        updated_at = datetime('now')
    `).run(p,i(),o()));let f=u.prepare("SELECT * FROM registered_keys WHERE id = ?").get(S);return{...(0,a.rowToCamel)(f),rawKey:y}},"listRegisteredKeys",0,function(e={}){let t=(0,r.getDbInstance)(),n="SELECT * FROM registered_keys WHERE 1=1",i=[];return e.provider&&(n+=" AND provider = ?",i.push(e.provider)),e.accountId&&(n+=" AND account_id = ?",i.push(e.accountId)),n+=" ORDER BY created_at DESC LIMIT 500",t.prepare(n).all(...i).map(e=>(0,a.rowToCamel)(e))},"revokeRegisteredKey",0,function(e){return(0,r.getDbInstance)().prepare(`
    UPDATE registered_keys
    SET is_active = 0, revoked_at = datetime('now'), updated_at = datetime('now')
    WHERE id = ? AND is_active = 1
  `).run(e).changes>0},"setAccountKeyLimit",0,function(e,t){(0,r.getDbInstance)().prepare(`
    INSERT INTO account_key_limits (account_id, max_active_keys, daily_issue_limit, hourly_issue_limit, last_reset_day, last_reset_hour)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(account_id) DO UPDATE SET
      max_active_keys = excluded.max_active_keys,
      daily_issue_limit = excluded.daily_issue_limit,
      hourly_issue_limit = excluded.hourly_issue_limit,
      updated_at = datetime('now')
  `).run(e,t.maxActiveKeys??null,t.dailyIssueLimit??null,t.hourlyIssueLimit??null,i(),o())},"setProviderKeyLimit",0,function(e,t){(0,r.getDbInstance)().prepare(`
    INSERT INTO provider_key_limits (provider, max_active_keys, daily_issue_limit, hourly_issue_limit, last_reset_day, last_reset_hour)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(provider) DO UPDATE SET
      max_active_keys = excluded.max_active_keys,
      daily_issue_limit = excluded.daily_issue_limit,
      hourly_issue_limit = excluded.hourly_issue_limit,
      updated_at = datetime('now')
  `).run(e,t.maxActiveKeys??null,t.dailyIssueLimit??null,t.hourlyIssueLimit??null,i(),o())},"validateRegisteredKey",0,function(e){let t=(0,r.getDbInstance)(),n=s(e),l=t.prepare(`
    SELECT * FROM registered_keys
    WHERE key = ? AND is_active = 1
      AND (expires_at IS NULL OR expires_at > datetime('now'))
  `).get(n);if(!l)return null;let u=i(),c=o();if(l.last_reset_day!==u||l.last_reset_hour!==c){let e=l.last_reset_day!==u,n=l.last_reset_hour!==c;t.prepare(`
      UPDATE registered_keys
      SET daily_used = CASE WHEN last_reset_day <> ? THEN 0 ELSE daily_used END,
          hourly_used = CASE WHEN last_reset_hour <> ? THEN 0 ELSE hourly_used END,
          last_reset_day = ?, last_reset_hour = ?
      WHERE id = ?
    `).run(u,c,u,c,l.id),e&&(l.daily_used=0),n&&(l.hourly_used=0),l.last_reset_day=u,l.last_reset_hour=c}return null!==l.daily_budget&&l.daily_used>=l.daily_budget||null!==l.hourly_budget&&l.hourly_used>=l.hourly_budget?null:(0,a.rowToCamel)(l)}])},324074,e=>{"use strict";var t=e.i(666680),n=e.i(830471),r=e.i(330485);function a(e){let t=(0,n.getDbInstance)().prepare("SELECT * FROM relay_tokens WHERE id = ?").get(e);return t?{...(0,r.rowToCamel)(t),enabled:1===t.enabled}:null}e.s(["checkRateLimit",0,function(e,t){let a=(0,n.getDbInstance)(),i=t;if(!i){let t=a.prepare("SELECT * FROM relay_tokens WHERE id = ?").get(e);if(!t)return{allowed:!1,remaining:0,resetIn:0};i=(0,r.rowToCamel)(t)}let o=Math.floor(Date.now()/1e3),s=60*Math.floor(o/60),l=86400*Math.floor(o/86400),u=a.prepare("SELECT request_count, cost FROM relay_rate_limits WHERE token_id = ? AND window_start = ?").get(e,s),c=u?.request_count||0;if(c>=i.maxRequestsPerMinute)return{allowed:!1,remaining:0,resetIn:60-o%60};let d=a.prepare("SELECT SUM(request_count) as total FROM relay_rate_limits WHERE token_id = ? AND window_start >= ?").get(e,l),p=d?.total||0;return p>=i.maxRequestsPerDay?{allowed:!1,remaining:0,resetIn:86400-o%86400}:{allowed:!0,remaining:Math.min(i.maxRequestsPerMinute-c,i.maxRequestsPerDay-p),resetIn:60-o%60}},"createRelayToken",0,function(a){let i=(0,n.getDbInstance)(),o="rl_"+(0,t.randomBytes)(16).toString("hex"),s="relay_"+(0,t.randomBytes)(24).toString("hex"),l=function(t){let{createHash:n}=e.r(666680);return n("sha256").update(t).digest("hex")}(s),u=Math.floor(Date.now()/1e3),c="rl_"+s.slice(6,14);i.prepare(`
    INSERT INTO relay_tokens (id, name, token_hash, token_prefix, description, combo_id, allowed_models,
      max_tokens_per_request, max_requests_per_minute, max_requests_per_day, max_cost_per_day,
      enabled, created_at, updated_at, expires_at, metadata)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?)
  `).run(o,a.name,l,c,a.description||"",a.comboId||null,JSON.stringify(a.allowedModels||["*"]),a.maxTokensPerRequest||128e3,a.maxRequestsPerMinute||60,a.maxRequestsPerDay||1e4,a.maxCostPerDay||0,u,u,a.expiresAt||null,JSON.stringify(a.metadata||{}));let d=i.prepare("SELECT * FROM relay_tokens WHERE id = ?").get(o);return{...(0,r.rowToCamel)(d),rawToken:s}},"deleteRelayToken",0,function(e){(0,n.getDbInstance)().prepare("DELETE FROM relay_tokens WHERE id = ?").run(e)},"getRelayLogs",0,function(e,t=50){let r=(0,n.getDbInstance)();return e?r.prepare("SELECT * FROM relay_logs WHERE token_id = ? ORDER BY created_at DESC LIMIT ?").all(e,t):r.prepare("SELECT * FROM relay_logs ORDER BY created_at DESC LIMIT ?").all(t)},"getRelayToken",0,a,"getRelayTokenByHash",0,function(e){let t=(0,n.getDbInstance)().prepare("SELECT * FROM relay_tokens WHERE token_hash = ? AND enabled = 1").get(e);return t?{...(0,r.rowToCamel)(t),enabled:1===t.enabled}:null},"getRelayTokens",0,function(){return(0,n.getDbInstance)().prepare("SELECT * FROM relay_tokens ORDER BY created_at DESC").all().map(e=>({...(0,r.rowToCamel)(e),enabled:1===e.enabled}))},"getRelayUsage",0,function(e,t){let r=(0,n.getDbInstance)().prepare("SELECT COUNT(*) as request_count, COALESCE(SUM(cost), 0) as total_cost FROM relay_logs WHERE token_id = ? AND created_at >= ?").get(e,t);return{requestCount:r.request_count,totalCost:r.total_cost}},"recordRelayUsage",0,function(e,t){let r=(0,n.getDbInstance)(),a=Math.floor(Date.now()/1e3),i=60*Math.floor(a/60);r.prepare(`
    INSERT INTO relay_rate_limits (token_id, window_start, request_count, cost)
    VALUES (?, ?, 1, ?)
    ON CONFLICT(token_id, window_start) DO UPDATE SET
      request_count = request_count + 1,
      cost = cost + ?
  `).run(e,i,t.cost||0,t.cost||0),r.prepare("UPDATE relay_tokens SET last_used_at = ? WHERE id = ?").run(a,e),r.prepare(`
    INSERT INTO relay_logs (token_id, request_id, model, prompt_tokens, completion_tokens, cost,
      status, status_code, latency_ms, client_ip, user_agent, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(e,t.requestId||null,t.model||null,t.promptTokens||0,t.completionTokens||0,t.cost||0,t.status||"success",t.statusCode||200,t.latencyMs||0,t.clientIp||null,t.userAgent||null,a)},"toggleRelayToken",0,function(e,t){let r=(0,n.getDbInstance)(),i=Math.floor(Date.now()/1e3);return r.prepare("UPDATE relay_tokens SET enabled = ?, updated_at = ? WHERE id = ?").run(+!!t,i,e),a(e)},"updateRelayToken",0,function(e,t){let r=(0,n.getDbInstance)(),i=Math.floor(Date.now()/1e3),o=["updated_at = ?"],s=[i];return void 0!==t.name&&(o.push("name = ?"),s.push(t.name)),void 0!==t.description&&(o.push("description = ?"),s.push(t.description)),void 0!==t.comboId&&(o.push("combo_id = ?"),s.push(t.comboId)),void 0!==t.allowedModels&&(o.push("allowed_models = ?"),s.push(JSON.stringify(t.allowedModels))),void 0!==t.maxTokensPerRequest&&(o.push("max_tokens_per_request = ?"),s.push(t.maxTokensPerRequest)),void 0!==t.maxRequestsPerMinute&&(o.push("max_requests_per_minute = ?"),s.push(t.maxRequestsPerMinute)),void 0!==t.maxRequestsPerDay&&(o.push("max_requests_per_day = ?"),s.push(t.maxRequestsPerDay)),void 0!==t.maxCostPerDay&&(o.push("max_cost_per_day = ?"),s.push(t.maxCostPerDay)),s.push(e),r.prepare(`UPDATE relay_tokens SET ${o.join(", ")} WHERE id = ?`).run(...s),a(e)}])},146993,e=>{"use strict";var t=e.i(830471),n=e.i(427918);e.s(["resolvePreviousResponseState",0,function(e,r){var a;if(!e)return null;let i=(0,t.getDbInstance)().prepare(`SELECT artifact_relpath, api_key_id FROM call_logs
       WHERE response_id = ? AND detail_state = 'ready'
       ORDER BY timestamp DESC LIMIT 1`).get(e);if(!i||!i.artifact_relpath||!r||i.api_key_id!==r)return null;let{artifact:o,state:s}=(0,n.readCallArtifact)(i.artifact_relpath);if("ready"!==s||!o?.pipeline)return null;let l=o.pipeline.providerRequest,u=o.pipeline.clientResponse,c="object"!=typeof(a=l?.body)||null===a||Array.isArray(a)?void 0:l.body.input,d=u?.output;return Array.isArray(c)&&Array.isArray(d)?{input:c,output:d}:null}])},494330,e=>{"use strict";var t=e.i(830471);let n=["created_at","expires_at","hit_count","tokens_saved","model"];e.s(["deleteSemanticCacheByModel",0,function(e){return{deleted:(0,t.getDbInstance)().prepare("DELETE FROM semantic_cache WHERE model = ?").run(e).changes}},"deleteSemanticCacheBySignature",0,function(e){return(0,t.getDbInstance)().prepare("DELETE FROM semantic_cache WHERE signature = ?").run(e),{deleted:1}},"listSemanticCacheEntries",0,function(e){let r=(0,t.getDbInstance)(),{page:a,limit:i,search:o,model:s,sortBy:l,sortOrder:u}=e,c=[],d=[];o&&(c.push("(signature LIKE ? OR model LIKE ?)"),d.push(`%${o}%`,`%${o}%`)),s&&(c.push("model = ?"),d.push(s));let p=c.length>0?`WHERE ${c.join(" AND ")}`:"",_=n.includes(l)?l:"created_at",E=r.prepare(`SELECT COUNT(*) as total FROM semantic_cache ${p}`).get(...d);return{entries:r.prepare(`SELECT id, signature, model, hit_count, tokens_saved, created_at, expires_at
       FROM semantic_cache ${p}
       ORDER BY ${_} ${"asc"===u?"ASC":"DESC"}
       LIMIT ? OFFSET ?`).all(...d,i,(a-1)*i),total:E?.total||0}}])},709287,e=>{"use strict";var t=e.i(830471);let n=new Set(["enabled","mode","updated_at"]);e.s(["updateSkill",0,function(e,r){let a=(0,t.getDbInstance)(),i=[],o=[];for(let[e,t]of Object.entries(r))n.has(e)&&(i.push(`${e} = ?`),o.push(t));return 0===i.length?0:(i.push("updated_at = datetime('now')"),o.push(e),a.prepare(`UPDATE skills SET ${i.join(", ")} WHERE id = ?`).run(...o).changes)}])},520700,e=>{"use strict";var t=e.i(995031),n=e.i(830471),r=e.i(330485),a=e.i(335273);function i(e){var t;let n=(t=(0,r.rowToCamel)(e))&&"object"==typeof t&&!Array.isArray(t)?t:{};return"string"!=typeof n.id||"string"!=typeof n.name?null:{id:n.id,name:n.name,tokenHash:"string"==typeof n.tokenHash?n.tokenHash:"",syncApiKeyId:"string"==typeof n.syncApiKeyId?n.syncApiKeyId:null,revokedAt:"string"==typeof n.revokedAt?n.revokedAt:null,lastUsedAt:"string"==typeof n.lastUsedAt?n.lastUsedAt:null,createdAt:"string"==typeof n.createdAt?n.createdAt:new Date().toISOString(),updatedAt:"string"==typeof n.updatedAt?n.updatedAt:new Date().toISOString()}}function o(e){e.exec(`
    CREATE TABLE IF NOT EXISTS sync_tokens (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      token_hash TEXT NOT NULL UNIQUE,
      sync_api_key_id TEXT,
      revoked_at TEXT,
      last_used_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_sync_tokens_created_at ON sync_tokens(created_at);
    CREATE INDEX IF NOT EXISTS idx_sync_tokens_last_used_at ON sync_tokens(last_used_at);
    CREATE INDEX IF NOT EXISTS idx_sync_tokens_revoked_at ON sync_tokens(revoked_at);
    CREATE INDEX IF NOT EXISTS idx_sync_tokens_sync_api_key_id ON sync_tokens(sync_api_key_id);
  `)}async function s(){let e=(0,n.getDbInstance)();return o(e),e.prepare("SELECT * FROM sync_tokens ORDER BY datetime(created_at) DESC, name COLLATE NOCASE ASC").all().map(e=>i(e)).filter(e=>null!==e)}async function l(e){let t=(0,n.getDbInstance)();return o(t),i(t.prepare("SELECT * FROM sync_tokens WHERE id = ?").get(e))}async function u(e){let t=(0,n.getDbInstance)();return o(t),i(t.prepare("SELECT * FROM sync_tokens WHERE token_hash = ?").get(e))}async function c(e){let r=(0,n.getDbInstance)();o(r);let i=new Date().toISOString(),s={id:(0,t.v4)(),name:e.name,tokenHash:e.tokenHash,syncApiKeyId:e.syncApiKeyId||null,revokedAt:null,lastUsedAt:null,createdAt:i,updatedAt:i};return r.prepare(`INSERT INTO sync_tokens (
      id, name, token_hash, sync_api_key_id, revoked_at, last_used_at, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(s.id,s.name,s.tokenHash,s.syncApiKeyId,s.revokedAt,s.lastUsedAt,s.createdAt,s.updatedAt),(0,a.backupDbFile)("pre-write"),s}async function d(e){let t=(0,n.getDbInstance)();o(t);let r=await l(e);if(!r)return null;if(r.revokedAt)return r;let i=new Date().toISOString();return t.prepare("UPDATE sync_tokens SET revoked_at = ?, updated_at = ? WHERE id = ?").run(i,i,e),(0,a.backupDbFile)("pre-write"),await l(e)}async function p(e,t=new Date().toISOString()){let r=(0,n.getDbInstance)();return o(r),Number(r.prepare("UPDATE sync_tokens SET last_used_at = ?, updated_at = ? WHERE id = ?").run(t,t,e).changes||0)>0}e.s(["createSyncTokenRecord",0,c,"getSyncTokenByHash",0,u,"getSyncTokenById",0,l,"listSyncTokens",0,s,"revokeSyncToken",0,d,"touchSyncTokenLastUsed",0,p])},65124,e=>{"use strict";var t=e.i(254799),n=e.i(830471),r=e.i(10947);let a=!1;function i(e){return e&&"object"==typeof e&&!Array.isArray(e)?e:{}}function o(e,t=0){if("number"==typeof e&&Number.isFinite(e))return e;if("string"==typeof e&&e.trim().length>0){let n=Number(e);return Number.isFinite(n)?n:t}return t}function s(e){return"model"===e||"provider"===e||"global"===e?e:"global"}function l(e){return"daily"===e||"weekly"===e||"monthly"===e?e:"monthly"}function u(){a||((0,n.getDbInstance)().exec(`
    CREATE TABLE IF NOT EXISTS api_key_token_limits (
      id              TEXT PRIMARY KEY,
      api_key_id      TEXT NOT NULL,
      scope_type      TEXT NOT NULL CHECK (scope_type IN ('model', 'provider', 'global')),
      scope_value     TEXT NOT NULL DEFAULT '',
      token_limit     INTEGER NOT NULL CHECK (token_limit > 0),
      reset_interval  TEXT NOT NULL DEFAULT 'monthly' CHECK (reset_interval IN ('daily', 'weekly', 'monthly')),
      reset_time      TEXT,
      enabled         INTEGER NOT NULL DEFAULT 1,
      created_at      TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at      TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE (api_key_id, scope_type, scope_value)
    );
    CREATE INDEX IF NOT EXISTS idx_aktl_api_key_id ON api_key_token_limits (api_key_id);
    CREATE TABLE IF NOT EXISTS api_key_token_counters (
      limit_id      TEXT NOT NULL,
      window_start  TEXT NOT NULL,
      tokens_used   INTEGER NOT NULL DEFAULT 0,
      updated_at    TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (limit_id, window_start),
      FOREIGN KEY (limit_id) REFERENCES api_key_token_limits (id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS api_key_token_limit_reset_logs (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      limit_id      TEXT NOT NULL,
      reset_at      TEXT NOT NULL DEFAULT (datetime('now')),
      prev_tokens   INTEGER NOT NULL DEFAULT 0,
      window_start  TEXT NOT NULL,
      FOREIGN KEY (limit_id) REFERENCES api_key_token_limits (id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_aktlrl_limit_id ON api_key_token_limit_reset_logs (limit_id);
  `),a=!0)}function c(e){let t=i(e);return{id:"string"==typeof t.id?t.id:"",apiKeyId:"string"==typeof t.api_key_id?t.api_key_id:"",scopeType:s(t.scope_type),scopeValue:"string"==typeof t.scope_value?t.scope_value:"",tokenLimit:o(t.token_limit),resetInterval:l(t.reset_interval),resetTime:"string"==typeof t.reset_time&&t.reset_time?t.reset_time:"00:00",enabled:0!==o(t.enabled,1),createdAt:"string"==typeof t.created_at?t.created_at:"",updatedAt:"string"==typeof t.updated_at?t.updated_at:""}}function d(e,t=Date.now()){let n=(0,r.getBudgetWindow)(e.resetInterval,e.resetTime,t);return{windowStart:String(n.periodStartAt),didReset:!1,periodStartAt:n.periodStartAt,nextResetAt:n.nextResetAt}}e.s(["deleteTokenLimit",0,function(e){u();let t=(0,n.getDbInstance)();return t.prepare("DELETE FROM api_key_token_counters WHERE limit_id = ?").run(e),t.prepare("DELETE FROM api_key_token_limit_reset_logs WHERE limit_id = ?").run(e),t.prepare("DELETE FROM api_key_token_limits WHERE id = ?").run(e).changes>0},"getTokenLimitsForRequest",0,function(e,t,r){return u(),(0,n.getDbInstance)().prepare(`SELECT * FROM api_key_token_limits
       WHERE api_key_id = @apiKeyId
         AND enabled = 1
         AND (
           (scope_type = 'global')
           OR (scope_type = 'model' AND scope_value = @model)
           OR (scope_type = 'provider' AND scope_value = @provider)
         )`).all({apiKeyId:e,model:r||"",provider:t||""}).map(c)},"getWindowUsage",0,function(e,t=Date.now()){u();let r=(0,n.getDbInstance)(),{windowStart:a}=d(e,t);return o(i(r.prepare("SELECT tokens_used FROM api_key_token_counters WHERE limit_id = ? AND window_start = ?").get(e.id,a)).tokens_used)},"incrementWindowTokens",0,function(e,t,r){u();let a=(0,n.getDbInstance)(),s=Math.max(0,Math.floor(o(r)));return o(i(a.prepare(`INSERT INTO api_key_token_counters (limit_id, window_start, tokens_used, updated_at)
       VALUES (@limitId, @windowStart, @tokens, datetime('now'))
       ON CONFLICT(limit_id, window_start)
       DO UPDATE SET tokens_used = tokens_used + excluded.tokens_used,
                     updated_at  = datetime('now')
       RETURNING tokens_used`).get({limitId:e,windowStart:t,tokens:s})).tokens_used)},"listTokenLimits",0,function(e){return u(),(0,n.getDbInstance)().prepare(`SELECT * FROM api_key_token_limits
       WHERE api_key_id = ?
       ORDER BY CASE scope_type WHEN 'model' THEN 0 WHEN 'provider' THEN 1 ELSE 2 END, scope_value`).all(e).map(c)},"logTokenLimitReset",0,function(e,t,r){u(),(0,n.getDbInstance)().prepare(`INSERT INTO api_key_token_limit_reset_logs (limit_id, reset_at, prev_tokens, window_start)
     VALUES (?, datetime('now'), ?, ?)`).run(e,Math.max(0,Math.floor(o(t))),r)},"resetWindowIfElapsed",0,d,"upsertTokenLimit",0,function(e){u();let r=(0,n.getDbInstance)(),a=s(e.scopeType),i="global"===a?"":(e.scopeValue??"").trim(),d=l(e.resetInterval),p="string"==typeof e.resetTime&&e.resetTime?e.resetTime:"00:00",_=+(!1!==e.enabled),E=Math.floor(o(e.tokenLimit)),g=e.id&&e.id.trim()?e.id.trim():(0,t.randomUUID)();return r.prepare(`INSERT INTO api_key_token_limits
       (id, api_key_id, scope_type, scope_value, token_limit, reset_interval, reset_time, enabled, created_at, updated_at)
     VALUES (@id, @apiKeyId, @scopeType, @scopeValue, @tokenLimit, @resetInterval, @resetTime, @enabled, datetime('now'), datetime('now'))
     ON CONFLICT(api_key_id, scope_type, scope_value)
     DO UPDATE SET token_limit    = excluded.token_limit,
                   reset_interval = excluded.reset_interval,
                   reset_time     = excluded.reset_time,
                   enabled        = excluded.enabled,
                   updated_at     = datetime('now')`).run({id:g,apiKeyId:e.apiKeyId,scopeType:a,scopeValue:i,tokenLimit:E,resetInterval:d,resetTime:p,enabled:_}),c(r.prepare("SELECT * FROM api_key_token_limits WHERE api_key_id = ? AND scope_type = ? AND scope_value = ?").get(e.apiKeyId,a,i))}])},675292,e=>{"use strict";var t=e.i(830471),n=e.i(273772),r=e.i(94369);function a(e){return e&&"object"==typeof e?e:{}}let i=new Set(["localhost","127.0.0.1","::1"]);function o(e){return"dario"===e?"dario":"cliproxyapi"}function s(e){let t=null;if(e.cliproxyapi_model_mapping&&"string"==typeof e.cliproxyapi_model_mapping)try{t=JSON.parse(e.cliproxyapi_model_mapping)}catch{t=null}return{id:e.id,providerId:e.provider_id,mode:e.mode,cliproxyapiModelMapping:t,nativePriority:e.native_priority,cliproxyapiPriority:e.cliproxyapi_priority,enabled:1===e.enabled||!0===e.enabled,family:"string"==typeof e.family?e.family:"auto",fallbackBackend:o(e.fallback_backend),createdAt:e.created_at,updatedAt:e.updated_at}}async function l(){return(0,t.getDbInstance)().prepare("SELECT * FROM upstream_proxy_config ORDER BY provider_id").all().map(e=>s(a(e)))}async function u(e){let n=(0,t.getDbInstance)().prepare("SELECT * FROM upstream_proxy_config WHERE provider_id = ?").get(e);return n?s(a(n)):null}async function c(e){let n=(0,t.getDbInstance)(),r=e.mode??"native",a=void 0!==e.cliproxyapiModelMapping?JSON.stringify(e.cliproxyapiModelMapping):null,i=e.nativePriority??1,s=e.cliproxyapiPriority??2,l=+(!1!==e.enabled),c=e.family??"auto",d=o(e.fallbackBackend);return n.prepare(`INSERT INTO upstream_proxy_config
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
       updated_at = datetime('now')`).run(e.providerId,r,a,i,s,l,c,d),u(e.providerId)}async function d(e,n){let r=(0,t.getDbInstance)();if(!await u(e))throw Error(`Provider ${e} not found`);let a=["updated_at = datetime('now')"],i=[];return void 0!==n.mode&&(a.push("mode = ?"),i.push(n.mode)),void 0!==n.cliproxyapiModelMapping&&(a.push("cliproxyapi_model_mapping = ?"),i.push(null===n.cliproxyapiModelMapping?null:JSON.stringify(n.cliproxyapiModelMapping))),void 0!==n.nativePriority&&(a.push("native_priority = ?"),i.push(n.nativePriority)),void 0!==n.cliproxyapiPriority&&(a.push("cliproxyapi_priority = ?"),i.push(n.cliproxyapiPriority)),void 0!==n.enabled&&(a.push("enabled = ?"),i.push(+(!0===n.enabled))),void 0!==n.family&&(a.push("family = ?"),i.push(n.family)),void 0!==n.fallbackBackend&&(a.push("fallback_backend = ?"),i.push(o(n.fallbackBackend))),i.push(e),r.prepare(`UPDATE upstream_proxy_config SET ${a.join(", ")} WHERE provider_id = ?`).run(...i),u(e)}async function p(e){return(0,t.getDbInstance)().prepare("DELETE FROM upstream_proxy_config WHERE provider_id = ?").run(e).changes>0}async function _(e){return(0,t.getDbInstance)().prepare("SELECT * FROM upstream_proxy_config WHERE mode = ? AND enabled = 1 ORDER BY provider_id").all(e).map(e=>s(a(e)))}async function E(e){let t=await u(e);if(!t)return[];let n=[];return t.enabled&&(n.push({executor:"native",priority:t.nativePriority}),"cliproxyapi"===t.mode?n.push({executor:"cliproxyapi",priority:t.cliproxyapiPriority}):"dario"===t.mode?n.push({executor:"dario",priority:t.cliproxyapiPriority}):"fallback"===t.mode&&n.push({executor:t.fallbackBackend,priority:t.cliproxyapiPriority})),n.sort((e,t)=>e.priority-t.priority),n}e.s(["deleteUpstreamProxyConfig",0,p,"getFallbackChainForProvider",0,E,"getProvidersByMode",0,_,"getUpstreamProxyConfig",0,u,"getUpstreamProxyConfigs",0,l,"updateUpstreamProxyConfig",0,d,"upsertUpstreamProxyConfig",0,c,"validateProxyUrl",0,function(e){try{let t=new URL(e);if(!["http:","https:"].includes(t.protocol))return{valid:!1,error:`Unsupported protocol "${t.protocol}" — use http or https`};if(function(e){let t,a=(0,r.normalizeHost)(e),o=(0,n.mappedIpv4Host)(a)??a;return!(i.has(a)||i.has(o))&&((0,n.isCloudMetadataHost)(a)||(0,r.isPrivateHost)(a)||(t=Number.parseInt(o.split(".")[0],10),4===(0,r.ipVersion)(o)&&t>=224&&t<=239))}(t.hostname))return{valid:!1,error:`Proxy URL cannot point to private/internal address "${t.hostname}"`};return{valid:!0,url:e}}catch{return{valid:!1,error:`Invalid URL: "${e}"`}}}])},741017,e=>{"use strict";var t=e.i(830471);e.s(["getAccountCostRows",0,function(e,n){return(0,t.getDbInstance)().prepare(`
      WITH account_events AS (
        SELECT
          COALESCE(
            NULLIF(usage_history.account_key, ''),
            'connection:' || COALESCE(LOWER(usage_history.provider), 'unknown') || ':' || COALESCE(NULLIF(TRIM(usage_history.connection_id), ''), 'unknown')
          ) as resolved_account_key,
          usage_history.provider,
          usage_history.model,
          usage_history.service_tier,
          usage_history.tokens_input,
          usage_history.tokens_output,
          usage_history.tokens_cache_read,
          usage_history.tokens_cache_creation,
          usage_history.tokens_reasoning
        FROM usage_history
        ${e}
      )
      SELECT
        account_events.resolved_account_key as accountKey,
        LOWER(account_events.provider) as provider,
        LOWER(account_events.model) as model,
        COALESCE(NULLIF(account_events.service_tier, ''), 'standard') as serviceTier,
        COALESCE(SUM(account_events.tokens_input), 0) as promptTokens,
        COALESCE(SUM(account_events.tokens_output), 0) as completionTokens,
        COALESCE(SUM(account_events.tokens_cache_read), 0) as cacheReadTokens,
        COALESCE(SUM(account_events.tokens_cache_creation), 0) as cacheCreationTokens,
        COALESCE(SUM(account_events.tokens_reasoning), 0) as reasoningTokens
      FROM account_events
      GROUP BY accountKey, LOWER(account_events.provider), LOWER(account_events.model), serviceTier
    `).all(n)},"getAccountUsageRows",0,function(e,n){return(0,t.getDbInstance)().prepare(`
      WITH account_events AS (
        SELECT
          usage_history.*,
          COALESCE(NULLIF(usage_history.account_key, ''), 'connection:' || COALESCE(LOWER(usage_history.provider), 'unknown') || ':' || COALESCE(NULLIF(TRIM(usage_history.connection_id), ''), 'unknown')) as resolved_account_key
        FROM usage_history
        ${e}
      ),
      stable_account_keys AS (
        SELECT DISTINCT account_key
        FROM account_events
        WHERE account_key > ''
      ),
      stable_labels AS (
        SELECT
          stable_account_keys.account_key,
          (
            SELECT TRIM(usage_history.account_label)
            FROM usage_history
            WHERE usage_history.account_key = stable_account_keys.account_key
              AND NULLIF(TRIM(usage_history.account_label), '') IS NOT NULL
            ORDER BY COALESCE(usage_history.account_label_priority, 0) DESC,
                     usage_history.timestamp DESC,
                     usage_history.id DESC
            LIMIT 1
          ) as account_label
        FROM stable_account_keys
      ),
      legacy_labels AS (
        SELECT account_key, account_label
        FROM (
          SELECT
            account_events.resolved_account_key as account_key,
            TRIM(account_events.account_label) as account_label,
            ROW_NUMBER() OVER (
              PARTITION BY account_events.resolved_account_key
              ORDER BY COALESCE(account_events.account_label_priority, 0) DESC,
                       account_events.timestamp DESC,
                       account_events.id DESC
            ) as label_rank
          FROM account_events
          WHERE (account_events.account_key IS NULL OR account_events.account_key = '')
            AND NULLIF(TRIM(account_events.account_label), '') IS NOT NULL
        )
        WHERE label_rank = 1
      ),
      selected_labels AS (
        SELECT account_key, account_label FROM stable_labels
        UNION ALL
        SELECT account_key, account_label FROM legacy_labels
      )
      SELECT
        account_events.resolved_account_key as accountKey,
        COALESCE(NULLIF(TRIM(selected_labels.account_label), ''), NULLIF(TRIM(account_events.connection_id), ''), 'unknown') as account,
        COUNT(account_events.id) as requests,
        COALESCE(SUM(account_events.tokens_input), 0) as promptTokens,
        COALESCE(SUM(account_events.tokens_output), 0) as completionTokens,
        COALESCE(SUM(account_events.tokens_input + account_events.tokens_output), 0) as totalTokens,
        COALESCE(AVG(account_events.latency_ms), 0) as avgLatencyMs,
        COALESCE(MAX(account_events.timestamp), '') as lastUsed
      FROM account_events
      LEFT JOIN selected_labels
        ON selected_labels.account_key = account_events.resolved_account_key
      GROUP BY accountKey
      ORDER BY requests DESC
      LIMIT 50
    `).all(n)},"getAllDomainBudgets",0,function(){return(0,t.getDbInstance)().prepare("SELECT * FROM domain_budgets").all()},"getAllDomainCostHistory",0,function(){return(0,t.getDbInstance)().prepare("SELECT * FROM domain_cost_history").all()},"getAllUsageHistory",0,function(){return(0,t.getDbInstance)().prepare("SELECT * FROM usage_history").all()},"getApiKeyMetadataRows",0,function(e,n){return(0,t.getDbInstance)().prepare(`
      SELECT
        NULLIF(api_key_id, '') as apiKeyId,
        NULLIF(api_key_name, '') as apiKeyName,
        COALESCE(NULLIF(api_key_id, ''), NULLIF(api_key_name, ''), 'unknown') as apiKeyGroupKey,
        MAX(timestamp) as lastUsed
      FROM usage_history
      ${e}
      GROUP BY NULLIF(api_key_id, ''), NULLIF(api_key_name, '')
      ORDER BY lastUsed DESC
    `).all(n)},"getApiKeyUsageRows",0,function(e,n){return(0,t.getDbInstance)().prepare(`
      SELECT
        NULLIF(api_key_id, '') as apiKeyId,
        COALESCE(NULLIF(api_key_id, ''), NULLIF(api_key_name, ''), 'unknown') as apiKeyGroupKey,
        LOWER(provider) as provider,
        LOWER(model) as model,
        COALESCE(NULLIF(service_tier, ''), 'standard') as serviceTier,
        COUNT(*) as requests,
        COALESCE(SUM(tokens_input), 0) as promptTokens,
        COALESCE(SUM(tokens_output), 0) as completionTokens,
        COALESCE(SUM(tokens_cache_read), 0) as cacheReadTokens,
        COALESCE(SUM(tokens_cache_creation), 0) as cacheCreationTokens,
        COALESCE(SUM(tokens_reasoning), 0) as reasoningTokens,
        COALESCE(SUM(tokens_input + tokens_output), 0) as totalTokens
      FROM usage_history
      ${e}
      GROUP BY COALESCE(NULLIF(api_key_id, ''), NULLIF(api_key_name, ''), 'unknown'), NULLIF(api_key_id, ''), LOWER(provider), LOWER(model), serviceTier
    `).all(n)},"getDailyCostRows",0,function(e,n){return(0,t.getDbInstance)().prepare(`
      SELECT
        DATE(timestamp) as date,
        LOWER(provider) as provider,
        LOWER(model) as model,
        COALESCE(NULLIF(service_tier, ''), 'standard') as serviceTier,
        COALESCE(SUM(tokens_input), 0) as promptTokens,
        COALESCE(SUM(tokens_output), 0) as completionTokens,
        COALESCE(SUM(tokens_cache_read), 0) as cacheReadTokens,
        COALESCE(SUM(tokens_cache_creation), 0) as cacheCreationTokens,
        COALESCE(SUM(tokens_reasoning), 0) as reasoningTokens
      FROM ${e} AS _u
      GROUP BY DATE(timestamp), LOWER(provider), LOWER(model), serviceTier
      ORDER BY date ASC
    `).all(n)},"getDailyUsage",0,function(e,n){return(0,t.getDbInstance)().prepare(`
      SELECT
        DATE(timestamp) as date,
        COALESCE(SUM(requests), 0) as requests,
        COALESCE(SUM(tokens_input), 0) as promptTokens,
        COALESCE(SUM(tokens_output), 0) as completionTokens,
        COALESCE(SUM(tokens_input + tokens_output), 0) as totalTokens
      FROM ${e} AS _u
      GROUP BY DATE(timestamp)
      ORDER BY date ASC
    `).all(n)},"getHeatmapRows",0,function(e,n){return(0,t.getDbInstance)().prepare(`
      SELECT
        DATE(timestamp) as date,
        COALESCE(SUM(tokens_input + tokens_output), 0) as totalTokens
      FROM usage_history
      WHERE ${e.join(" AND ")}
      GROUP BY DATE(timestamp)
      ORDER BY date ASC
    `).all(n)},"getModelUsageRows",0,function(e,n){return(0,t.getDbInstance)().prepare(`
      SELECT
        LOWER(model) as model,
        LOWER(provider) as provider,
        COALESCE(NULLIF(service_tier, ''), 'standard') as serviceTier,
        COALESCE(SUM(requests), 0) as requests,
        COALESCE(SUM(tokens_input), 0) as promptTokens,
        COALESCE(SUM(tokens_output), 0) as completionTokens,
        COALESCE(SUM(tokens_cache_read), 0) as cacheReadTokens,
        COALESCE(SUM(tokens_cache_creation), 0) as cacheCreationTokens,
        COALESCE(SUM(tokens_reasoning), 0) as reasoningTokens,
        COALESCE(SUM(tokens_input + tokens_output), 0) as totalTokens,
        COALESCE(AVG(latency_ms), 0) as avgLatencyMs,
        COALESCE(SUM(CASE WHEN success = 1 THEN requests ELSE 0 END), 0) as successfulRequests,
        COALESCE(MAX(timestamp), '') as lastUsed
      FROM ${e} AS _u
      GROUP BY LOWER(model), LOWER(provider), serviceTier
      ORDER BY requests DESC
    `).all(n)},"getPresetCostModelRows",0,function(e,n){return(0,t.getDbInstance)().prepare(`
      SELECT
        LOWER(model) as model,
        LOWER(provider) as provider,
        COALESCE(NULLIF(service_tier, ''), 'standard') as serviceTier,
        COALESCE(SUM(tokens_input), 0) as promptTokens,
        COALESCE(SUM(tokens_output), 0) as completionTokens,
        COALESCE(SUM(tokens_cache_read), 0) as cacheReadTokens,
        COALESCE(SUM(tokens_cache_creation), 0) as cacheCreationTokens,
        COALESCE(SUM(tokens_reasoning), 0) as reasoningTokens
      FROM ${e} AS _pu
      GROUP BY LOWER(model), LOWER(provider), serviceTier
    `).all(n)},"getProviderCostRows",0,function(e,n){return(0,t.getDbInstance)().prepare(`
      SELECT
        LOWER(provider) as provider,
        LOWER(model) as model,
        COALESCE(NULLIF(service_tier, ''), 'standard') as serviceTier,
        COALESCE(SUM(tokens_input), 0) as promptTokens,
        COALESCE(SUM(tokens_output), 0) as completionTokens,
        COALESCE(SUM(tokens_cache_read), 0) as cacheReadTokens,
        COALESCE(SUM(tokens_cache_creation), 0) as cacheCreationTokens,
        COALESCE(SUM(tokens_reasoning), 0) as reasoningTokens
      FROM ${e} AS _u
      GROUP BY LOWER(provider), LOWER(model), serviceTier
    `).all(n)},"getProviderUsageRows",0,function(e,n){return(0,t.getDbInstance)().prepare(`
      SELECT
        LOWER(provider) as provider,
        COALESCE(SUM(requests), 0) as requests,
        COALESCE(SUM(tokens_input), 0) as promptTokens,
        COALESCE(SUM(tokens_output), 0) as completionTokens,
        COALESCE(SUM(tokens_input + tokens_output), 0) as totalTokens,
        COALESCE(AVG(latency_ms), 0) as avgLatencyMs,
        COALESCE(SUM(CASE WHEN success = 1 THEN requests ELSE 0 END), 0) as successfulRequests
      FROM ${e} AS _u
      GROUP BY LOWER(provider)
      ORDER BY requests DESC
    `).all(n)},"getServiceTierUsageRows",0,function(e,n){return(0,t.getDbInstance)().prepare(`
      SELECT
        COALESCE(NULLIF(service_tier, ''), 'standard') as serviceTier,
        LOWER(provider) as provider,
        LOWER(model) as model,
        COALESCE(NULLIF(service_tier, ''), 'standard') as serviceTier,
        COALESCE(SUM(requests), 0) as requests,
        COALESCE(SUM(tokens_input), 0) as promptTokens,
        COALESCE(SUM(tokens_output), 0) as completionTokens,
        COALESCE(SUM(tokens_cache_read), 0) as cacheReadTokens,
        COALESCE(SUM(tokens_cache_creation), 0) as cacheCreationTokens,
        COALESCE(SUM(tokens_reasoning), 0) as reasoningTokens,
        COALESCE(SUM(tokens_input + tokens_output), 0) as totalTokens
      FROM ${e} AS _u
      GROUP BY serviceTier, LOWER(provider), LOWER(model)
    `).all(n)},"getUsageSummary",0,function(e,n){return(0,t.getDbInstance)().prepare(`
      SELECT
        COALESCE(SUM(requests), 0) as totalRequests,
        COALESCE(SUM(tokens_input), 0) as promptTokens,
        COALESCE(SUM(tokens_output), 0) as completionTokens,
        COALESCE(SUM(tokens_input + tokens_output), 0) as totalTokens,
        COUNT(DISTINCT model) as uniqueModels,
        COUNT(DISTINCT COALESCE(NULLIF(account_key, ''), NULLIF(connection_id, ''))) as uniqueAccounts,
        COUNT(DISTINCT COALESCE(NULLIF(api_key_id, ''), NULLIF(api_key_name, ''))) as uniqueApiKeys,
        COALESCE(SUM(CASE WHEN success = 1 THEN requests ELSE 0 END), 0) as successfulRequests,
        COALESCE(AVG(latency_ms), 0) as avgLatencyMs,
        COALESCE(MIN(timestamp), '') as firstRequest,
        COALESCE(MAX(timestamp), '') as lastRequest
      FROM ${e} AS _u
    `).get(n)??{totalRequests:0,promptTokens:0,completionTokens:0,totalTokens:0,uniqueModels:0,uniqueAccounts:0,uniqueApiKeys:0,successfulRequests:0,avgLatencyMs:0,firstRequest:"",lastRequest:""}},"getWeeklyPatternRows",0,function(e,n){return(0,t.getDbInstance)().prepare(`
      SELECT
        dayOfWeek,
        COUNT(*) as days,
        COALESCE(SUM(requests), 0) as requests,
        COALESCE(SUM(totalTokens), 0) as totalTokens
      FROM (
        SELECT
          DATE(timestamp) as date,
          strftime('%w', timestamp) as dayOfWeek,
          COALESCE(SUM(requests), 0) as requests,
          COALESCE(SUM(tokens_input + tokens_output), 0) as totalTokens
        FROM ${e} AS _u
        GROUP BY DATE(timestamp), strftime('%w', timestamp)
      )
      GROUP BY dayOfWeek
      ORDER BY dayOfWeek ASC
    `).all(n)}])},670440,e=>{"use strict";var t=e.i(830471);e.s(["getAutoRoutingTopProviders",0,function(){return(0,t.getDbInstance)().prepare(`
      SELECT provider, COUNT(*) as count
      FROM call_logs
      WHERE (requested_model = 'auto' OR requested_model LIKE 'auto/%')
        AND provider IS NOT NULL
        AND TRIM(provider) != ''
      GROUP BY provider
      ORDER BY count DESC
      LIMIT 10
      `).all()},"getAutoRoutingTotalCount",0,function(){return(0,t.getDbInstance)().prepare(`
      SELECT COUNT(*) as count
      FROM call_logs
      WHERE requested_model = 'auto' OR requested_model LIKE 'auto/%'
    `).get()??{count:0}},"getAutoRoutingVariantBreakdown",0,function(){return(0,t.getDbInstance)().prepare(`
      SELECT
        CASE
          WHEN requested_model = 'auto' THEN 'default'
          WHEN requested_model LIKE 'auto/%' THEN SUBSTR(requested_model, 6)
          ELSE 'other'
        END as variant,
        COUNT(*) as count
      FROM call_logs
      WHERE requested_model = 'auto' OR requested_model LIKE 'auto/%'
      GROUP BY variant
      ORDER BY count DESC
    `).all()}])},197374,e=>{"use strict";var t=e.i(830471);e.s(["sumUsageTokensThisMonth",0,function(e=(0,t.getDbInstance)()){try{let t=e.prepare(`SELECT
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
           ), 0) AS used`).get();return t?.used??0}catch{return 0}}])},13572,e=>e.a(async(t,n)=>{try{var r=e.i(648830),a=e.i(248084);e.i(413618),e.i(563141),e.i(488608),e.i(381581),e.i(865498),e.i(24854),e.i(363685),e.i(146993);var i=e.i(950412);e.i(974008);var o=e.i(754140);e.i(417358),e.i(196164),e.i(416065),e.i(986039),e.i(335273),e.i(709287),e.i(687267),e.i(707708),e.i(884344),e.i(773412),e.i(301435),e.i(152491),e.i(807836),e.i(595357),e.i(8011),e.i(993053),e.i(556826),e.i(756045),e.i(690915),e.i(998715),e.i(520700),e.i(675292),e.i(874957),e.i(224002),e.i(704553),e.i(719686),e.i(61499),e.i(616118),e.i(682611),e.i(822071),e.i(639015),e.i(528682),e.i(324074),e.i(169730),e.i(767382),e.i(697387),e.i(326151),e.i(758677),e.i(452415),e.i(339176);var s=e.i(839713);e.i(896326);var l=e.i(858013);e.i(160769),e.i(608455),e.i(913184),e.i(954147),e.i(65124),e.i(430508),e.i(204366),e.i(673604),e.i(197374),e.i(31792),e.i(734252),e.i(741017),e.i(670440),e.i(494330),e.i(407417),e.i(843378),e.i(680516),e.i(547053),e.i(727242),e.i(127441),e.i(886515),e.i(637624),e.i(899403);var u=t([r,a,i,o,s,l]);[r,a,i,o,s,l]=u.then?(await u)():u,e.s([]),n()}catch(e){n(e)}},!1),942598,e=>e.a(async(t,n)=>{try{var r=e.i(677850),a=t([r]);[r]=a.then?(await a)():a;let i=r.z.object({id:r.z.string().uuid(),source:r.z.enum(["agent-bridge","custom-host","http-proxy","system-proxy","tproxy"]),agent:r.z.string().optional(),timestamp:r.z.string().datetime(),method:r.z.string(),host:r.z.string(),path:r.z.string(),requestHeaders:r.z.record(r.z.string(),r.z.string()),requestBody:r.z.string().nullable(),requestSize:r.z.number().int().nonnegative(),responseHeaders:r.z.record(r.z.string(),r.z.string()),responseBody:r.z.string().nullable(),responseSize:r.z.number().int().nonnegative(),status:r.z.union([r.z.number().int(),r.z.literal("in-flight"),r.z.literal("error")]),proxyLatencyMs:r.z.number().nonnegative().optional(),upstreamLatencyMs:r.z.number().nonnegative().optional(),totalLatencyMs:r.z.number().nonnegative().optional(),error:r.z.string().optional(),sourceModel:r.z.string().nullable().optional(),mappedModel:r.z.string().nullable().optional(),detectedKind:r.z.enum(["llm","app","unknown"]).optional(),contextKey:r.z.string().optional(),annotation:r.z.string().optional(),sessionId:r.z.string().uuid().optional(),note:r.z.string().optional(),pid:r.z.number().int().nonnegative().optional(),processName:r.z.string().optional()});e.s(["InterceptedRequestSchema",0,i]),n()}catch(e){n(e)}},!1),839713,e=>e.a(async(t,n)=>{try{var r=e.i(254799),a=e.i(830471),i=e.i(942598),o=t([i]);function s(e){return{id:e.id,name:e.name,started_at:e.started_at,ended_at:e.ended_at,request_count:e.request_count,profile:e.profile}}function l(e){let t=(0,a.getDbInstance)().prepare("SELECT * FROM inspector_sessions WHERE id = ?").get(e);return t?s(t):null}function u(e){return(0,a.getDbInstance)().prepare("SELECT seq, payload FROM inspector_session_requests WHERE session_id = ? ORDER BY seq ASC").all(e).map(e=>({seq:e.seq,payload:e.payload}))}[i]=o.then?(await o)():o,e.s(["appendSessionRequest",0,function(e,t){let n=(0,a.getDbInstance)(),r=0;return n.transaction(()=>{let a=n.prepare("SELECT COALESCE(MAX(seq), 0) + 1 AS next_seq FROM inspector_session_requests WHERE session_id = ?").get(e).next_seq;n.prepare("INSERT INTO inspector_session_requests (session_id, seq, payload) VALUES (?, ?, ?)").run(e,a,t),n.prepare("UPDATE inspector_sessions SET request_count = request_count + 1 WHERE id = ?").run(e),r=a})(),r},"createSession",0,function(e){let t=(0,a.getDbInstance)(),n=(0,r.randomUUID)(),i=new Date().toISOString();return t.prepare("INSERT INTO inspector_sessions (id, name, started_at, profile) VALUES (?, ?, ?, ?)").run(n,e?.name??null,i,e?.profile??null),{id:n,started_at:i}},"deleteSession",0,function(e){(0,a.getDbInstance)().prepare("DELETE FROM inspector_sessions WHERE id = ?").run(e)},"getSession",0,l,"getSessionRequests",0,u,"listSessions",0,function(){return(0,a.getDbInstance)().prepare("SELECT * FROM inspector_sessions ORDER BY started_at DESC").all().map(s)},"renameSession",0,function(e,t){(0,a.getDbInstance)().prepare("UPDATE inspector_sessions SET name = ? WHERE id = ?").run(t,e)},"snapshotSession",0,function(e){let t=l(e);if(null===t)return null;let n=u(e),r=[];for(let e of n){let t;try{t=JSON.parse(e.payload)}catch{continue}let n=i.InterceptedRequestSchema.safeParse(t);n.success&&r.push(n.data)}return r},"stopSession",0,function(e){let t=(0,a.getDbInstance)(),n=new Date().toISOString();t.prepare("UPDATE inspector_sessions SET ended_at = ? WHERE id = ?").run(n,e)}]),n()}catch(e){n(e)}},!1),138435,e=>{"use strict";e.s(["DEFAULT_BATCH_EXPIRATION_SECONDS",0,2592e3])}];

//# sourceMappingURL=src_0p4665d._.js.map