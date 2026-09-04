module.exports=[71251,e=>{"use strict";var t=e.i(689960),n=e.i(899378);function a(e){return e&&"object"==typeof e?e:{}}function r(e){let t=a(e);return{id:String(t.id??""),apiKeyId:"string"==typeof t.api_key_id?t.api_key_id:null,fingerprintHash:String(t.fingerprint_hash??""),turnCount:Number(t.turn_count??1),firstSeenAt:String(t.first_seen_at??""),lastSeenAt:String(t.last_seen_at??"")}}function i(e){let t,n=a(e);return{...{id:String((t=a(e)).id??""),conversationId:String(t.conversation_id??""),parentId:"string"==typeof t.parent_id?t.parent_id:null,role:String(t.role??""),contentHash:String(t.content_hash??""),lastCorrelationId:"string"==typeof t.last_correlation_id?t.last_correlation_id:null,firstSeenAt:String(t.first_seen_at??""),lastSeenAt:String(t.last_seen_at??"")},seq:Number(n.seq??0)}}e.s(["createAgenticConversation",0,function(e){let a=(0,n.getDbInstance)(),r=new Date().toISOString(),i=e.id||`conv_${(0,t.v4)()}`;return a.prepare(`INSERT INTO agentic_conversations
       (id, api_key_id, fingerprint_hash, last_message_count, last_messages_hash, turn_count, first_seen_at, last_seen_at)
     VALUES (?, ?, ?, 0, '', 1, ?, ?)`).run(i,e.apiKeyId,e.fingerprintHash,r,r),{id:i,apiKeyId:e.apiKeyId,fingerprintHash:e.fingerprintHash,turnCount:1,firstSeenAt:r,lastSeenAt:r}},"findAgenticConversationsByFingerprint",0,function(e){return(0,n.getDbInstance)().prepare("SELECT * FROM agentic_conversations WHERE fingerprint_hash = ? ORDER BY last_seen_at DESC LIMIT 20").all(e).map(r)},"getConversationTurnIndex",0,function(e){let t=(0,n.getDbInstance)().prepare("SELECT id, parent_id, content_hash FROM conversation_turn_nodes WHERE conversation_id = ?").all(e),r=new Set,i=new Map,o=new Set;for(let e of t){let t=a(e),n=String(t.id??""),s="string"==typeof t.parent_id?t.parent_id:null,l=String(t.content_hash??"");if(r.add(n),s&&o.add(s),!l)continue;let u=i.get(l);u?u.push(n):i.set(l,[n])}return{nodeIds:r,byContentHash:i,parentsWithChildren:o}},"getConversationTurnPage",0,function(e,t={}){let a=(0,n.getDbInstance)(),r=Math.max(1,Math.min(t.limit??20,500));if(null!=t.afterSeq)return{nodes:a.prepare(`SELECT rowid as seq, * FROM conversation_turn_nodes
         WHERE conversation_id = ? AND rowid > ? ORDER BY rowid ASC`).all(e,t.afterSeq).map(i),hasMore:!1};let o=null!=t.beforeSeq?a.prepare(`SELECT rowid as seq, * FROM conversation_turn_nodes
             WHERE conversation_id = ? AND rowid < ? ORDER BY rowid DESC LIMIT ?`).all(e,t.beforeSeq,r+1):a.prepare(`SELECT rowid as seq, * FROM conversation_turn_nodes
             WHERE conversation_id = ? ORDER BY rowid DESC LIMIT ?`).all(e,r+1),s=o.length>r;return{nodes:(s?o.slice(0,r):o).reverse().map(i),hasMore:s}},"insertConversationTurnNodes",0,function(e,t,a){if(0===a.length)return;let r=(0,n.getDbInstance)(),i=new Date().toISOString(),o=r.prepare(`INSERT OR IGNORE INTO conversation_turn_nodes
       (id, conversation_id, parent_id, role, content_hash, last_correlation_id, first_seen_at, last_seen_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);r.transaction(n=>{for(let a of n)o.run(a.id,e,a.parentId,a.role,a.contentHash,t,i,i)})(a)},"listMultiTurnConversations",0,function(e={}){let t=(0,n.getDbInstance)(),i=Math.max(1,Math.min(e.limit??50,200)),o=Math.max(0,e.offset??0),s=a(t.prepare(`SELECT COUNT(*) as c FROM agentic_conversations ac
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
       LIMIT ? OFFSET ?`).all(i,o);return{total:Number(s??0),rows:l.map(e=>{let t=a(e);return{...r(t),lastCallLogId:"string"==typeof t.last_call_log_id?t.last_call_log_id:null,lastModel:"string"==typeof t.last_model?t.last_model:null,lastProvider:"string"==typeof t.last_provider?t.last_provider:null,lastStatus:"number"==typeof t.last_status?t.last_status:null}})}},"resolveCallLogIdsByCorrelationIds",0,function(e){let t=[...new Set(e.filter(Boolean))],r=new Map;if(0===t.length)return r;let i=(0,n.getDbInstance)(),o=t.map(()=>"?").join(",");for(let e of i.prepare(`SELECT id, correlation_id FROM call_logs WHERE correlation_id IN (${o})`).all(...t)){let t=a(e),n="string"==typeof t.correlation_id?t.correlation_id:null,i="string"==typeof t.id?t.id:null;n&&i&&!r.has(n)&&r.set(n,i)}return r},"touchOrCreateExternalConversation",0,function(e,t){let a=(0,n.getDbInstance)(),r=new Date().toISOString();a.prepare("SELECT id FROM agentic_conversations WHERE id = ?").get(e)?a.prepare("UPDATE agentic_conversations SET turn_count = turn_count + 1, last_seen_at = ? WHERE id = ?").run(r,e):a.prepare(`INSERT INTO agentic_conversations
       (id, api_key_id, fingerprint_hash, last_message_count, last_messages_hash, turn_count, first_seen_at, last_seen_at)
     VALUES (?, ?, '', 0, '', 1, ?, ?)`).run(e,t.apiKeyId,r,r)},"updateAgenticConversation",0,function(e,t){(0,n.getDbInstance)().prepare("UPDATE agentic_conversations SET turn_count = ?, last_seen_at = ? WHERE id = ?").run(t.turnCount,new Date().toISOString(),e)}])},224136,e=>{"use strict";var t=e.i(899378);function n(e){return{apiKeyId:e.api_key_id,sourceType:e.source_type,token:e.token,baseUrl:e.base_url,vaultPath:e.vault_path,enabled:1===e.enabled}}e.s(["deleteApiKeyContextSource",0,function(e,n){(0,t.getDbInstance)().prepare("DELETE FROM api_key_context_sources WHERE api_key_id = ? AND source_type = ?").run(e,n)},"getApiKeyContextSource",0,function(e,a){if(!e)return null;let r=(0,t.getDbInstance)().prepare("SELECT * FROM api_key_context_sources WHERE api_key_id = ? AND source_type = ? AND enabled = 1").get(e,a);return r?n(r):null},"listApiKeyContextSources",0,function(e){return(0,t.getDbInstance)().prepare("SELECT * FROM api_key_context_sources WHERE api_key_id = ?").all(e).map(n)},"setApiKeyContextSource",0,function(e,n,a){let r=(0,t.getDbInstance)(),i=r.prepare("SELECT * FROM api_key_context_sources WHERE api_key_id = ? AND source_type = ?").get(e,n),o=new Date().toISOString();i?r.prepare(`UPDATE api_key_context_sources SET
        token = COALESCE(?, token),
        base_url = COALESCE(?, base_url),
        vault_path = COALESCE(?, vault_path),
        enabled = COALESCE(?, enabled),
        updated_at = ?
      WHERE api_key_id = ? AND source_type = ?`).run(a.token??null,a.baseUrl??null,a.vaultPath??null,void 0!==a.enabled?+!!a.enabled:null,o,e,n):r.prepare(`INSERT INTO api_key_context_sources
        (api_key_id, source_type, token, base_url, vault_path, enabled, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(e,n,a.token??null,a.baseUrl??null,a.vaultPath??null,void 0!==a.enabled?+!!a.enabled:1,o,o)}])},362360,e=>{"use strict";var t=e.i(666680),n=e.i(899378);function a(e){return{id:e.id,apiKeyId:e.api_key_id,autoChannel:e.auto_channel,connectionId:e.connection_id,excluded:1===e.excluded,createdAt:e.created_at}}async function r(e,t){return e&&t?new Set((0,n.getDbInstance)().prepare(`SELECT connection_id FROM auto_candidate_overrides
       WHERE api_key_id = ? AND auto_channel = ? AND excluded = 1`).all(e,t).map(e=>e.connection_id)):new Set}async function i(e,r,i,o){let s=(0,n.getDbInstance)(),l=(0,t.randomUUID)(),u=new Date().toISOString();return s.prepare(`INSERT INTO auto_candidate_overrides
       (id, api_key_id, auto_channel, connection_id, excluded, created_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(api_key_id, auto_channel, connection_id)
     DO UPDATE SET excluded = excluded.excluded`).run(l,e,r,i,+!!o,u),a(s.prepare(`SELECT id, api_key_id, auto_channel, connection_id, excluded, created_at
       FROM auto_candidate_overrides
       WHERE api_key_id = ? AND auto_channel = ? AND connection_id = ?`).get(e,r,i))}async function o(e,t){return e&&t?(0,n.getDbInstance)().prepare(`SELECT id, api_key_id, auto_channel, connection_id, excluded, created_at
       FROM auto_candidate_overrides
       WHERE api_key_id = ? AND auto_channel = ?
       ORDER BY created_at ASC`).all(e,t).map(a):[]}e.s(["getExcludedConnectionIds",0,r,"listOverrides",0,o,"setExcluded",0,i])},226420,e=>{"use strict";var t=e.i(899378),n=e.i(529646),a=e.i(521215),r=e.i(689960);function i(e){let t=(0,n.rowToCamel)(e);if(t.metadata&&"string"==typeof t.metadata)try{t.metadata=JSON.parse(t.metadata)}catch{t.metadata=null}if(t.errors&&"string"==typeof t.errors)try{t.errors=JSON.parse(t.errors)}catch{t.errors=null}if(t.usage&&"string"==typeof t.usage)try{t.usage=JSON.parse(t.usage)}catch{t.usage=null}let a=e=>{if("number"==typeof e&&Number.isFinite(e))return e;if(null==e)return null;let t=Number(e);return Number.isFinite(t)?t:null};return t.createdAt=a(t.createdAt)??0,t.inProgressAt=a(t.inProgressAt),t.expiresAt=a(t.expiresAt),t.finalizingAt=a(t.finalizingAt),t.completedAt=a(t.completedAt),t.failedAt=a(t.failedAt),t.expiredAt=a(t.expiredAt),t.cancellingAt=a(t.cancellingAt),t.cancelledAt=a(t.cancelledAt),t}function o(e){if(null==e)return null;if("string"!=typeof e)return e;try{return JSON.parse(e)}catch{return null}}function s(e){let n=(0,t.getDbInstance)().prepare("SELECT * FROM batches WHERE id = ?").get(e);return n?i(n):null}e.s(["countBatchItemCheckpoints",0,function(e){let n=(0,t.getDbInstance)().prepare("SELECT COUNT(*) AS c FROM batch_item_checkpoints WHERE batch_id = ?").get(e);return n?Number(n.c):0},"countBatches",0,function(e){let n=(0,t.getDbInstance)();if(e){let t=n.prepare("SELECT COUNT(*) as c FROM batches WHERE api_key_id = ?").get(e);return t?Number(t.c):0}{let e=n.prepare("SELECT COUNT(*) as c FROM batches").get();return e?Number(e.c):0}},"createBatch",0,function(e){let a=(0,t.getDbInstance)(),i="batch_"+(0,r.v4)().replaceAll("-","").substring(0,24),o=Math.floor(Date.now()/1e3),s={...e,id:i,createdAt:o,status:e.status||"validating",requestCountsTotal:0,requestCountsCompleted:0,requestCountsFailed:0,errors:e.errors||null,model:e.model||null,usage:e.usage||null,outputExpiresAfterSeconds:e.outputExpiresAfterSeconds||null,outputExpiresAfterAnchor:e.outputExpiresAfterAnchor||null},l=(0,n.objToSnake)({...s,metadata:s.metadata?JSON.stringify(s.metadata):null,errors:s.errors?JSON.stringify(s.errors):null,usage:s.usage?JSON.stringify(s.usage):null}),u=Object.keys(l),c=Object.values(l),d=u.map(()=>"?").join(", ");return a.prepare(`INSERT INTO batches (${u.join(", ")}) VALUES (${d})`).run(...c),s},"deleteBatch",0,function(e){let n=(0,t.getDbInstance)(),r=s(e);if(!r)return!1;if(n.prepare("DELETE FROM batch_item_checkpoints WHERE batch_id = ?").run(e),r.inputFileId)try{(0,a.deleteFile)(r.inputFileId)}catch{}if(r.outputFileId)try{(0,a.deleteFile)(r.outputFileId)}catch{}if(r.errorFileId)try{(0,a.deleteFile)(r.errorFileId)}catch{}return n.prepare("DELETE FROM batches WHERE id = ?").run(e).changes>0},"deleteCompletedBatches",0,function(){let e=(0,t.getDbInstance)(),n=e.prepare("SELECT input_file_id, output_file_id, error_file_id FROM batches WHERE status = 'completed'").all(),r=new Set;for(let e of n)e.input_file_id&&r.add(e.input_file_id),e.output_file_id&&r.add(e.output_file_id),e.error_file_id&&r.add(e.error_file_id);let i=0;for(let e of r)try{(0,a.deleteFile)(e)&&i++}catch{}return e.prepare("DELETE FROM batch_item_checkpoints WHERE batch_id IN (SELECT id FROM batches WHERE status = 'completed')").run(),{deletedBatches:e.prepare("DELETE FROM batches WHERE status = 'completed'").run().changes,deletedFiles:i}},"ensureBatchItemCheckpoints",0,function(e,n){if(0===n.length)return;let a=(0,t.getDbInstance)(),r=Math.floor(Date.now()/1e3),i=a.prepare(`
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
  `);a.transaction(()=>{for(let t of n)i.run(e,t.lineNumber,t.customId,r,r)})()},"getBatch",0,s,"getPendingBatches",0,function(){return(0,t.getDbInstance)().prepare("SELECT * FROM batches WHERE status IN ('validating', 'in_progress', 'finalizing', 'cancelling')").all().map(e=>i(e))},"getTerminalBatches",0,function(){return(0,t.getDbInstance)().prepare("SELECT * FROM batches WHERE status IN ('completed', 'failed', 'cancelled', 'expired') ORDER BY created_at ASC").all().map(e=>i(e))},"listBatchItemCheckpoints",0,function(e){return(0,t.getDbInstance)().prepare(`
      SELECT batch_id, line_number, custom_id, status, result_json, error_json, created_at, updated_at
      FROM batch_item_checkpoints
      WHERE batch_id = ?
      ORDER BY line_number ASC
    `).all(e).map(e=>({batchId:e.batch_id,lineNumber:Number(e.line_number),customId:e.custom_id??null,status:e.status,result:o(e.result_json),error:o(e.error_json),createdAt:Number(e.created_at),updatedAt:Number(e.updated_at)}))},"listBatches",0,function(e,n=20,a){let r=(0,t.getDbInstance)(),o=a?s(a):null;return(e?o?r.prepare("SELECT * FROM batches WHERE api_key_id = ? AND (created_at < ? OR (created_at = ? AND id < ?)) ORDER BY created_at DESC, id DESC LIMIT ?").all(e,o.createdAt,o.createdAt,a,n):r.prepare("SELECT * FROM batches WHERE api_key_id = ? ORDER BY created_at DESC, id DESC LIMIT ?").all(e,n):o?r.prepare("SELECT * FROM batches WHERE (created_at < ? OR (created_at = ? AND id < ?)) ORDER BY created_at DESC, id DESC LIMIT ?").all(o.createdAt,o.createdAt,a,n):r.prepare("SELECT * FROM batches ORDER BY created_at DESC, id DESC LIMIT ?").all(n)).map(e=>i(e))},"markBatchItemError",0,function(e,n,a){let r=(0,t.getDbInstance)(),i=Math.floor(Date.now()/1e3);r.prepare(`
    UPDATE batch_item_checkpoints
    SET custom_id = ?,
        status = 'errored',
        result_json = NULL,
        error_json = ?,
        updated_at = ?
    WHERE batch_id = ? AND line_number = ?
  `).run(n.customId,JSON.stringify(a),i,e,n.lineNumber)},"markBatchItemProcessing",0,function(e,n){let a=(0,t.getDbInstance)(),r=Math.floor(Date.now()/1e3);a.prepare(`
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
  `).run(e,n.lineNumber,n.customId,r,r)},"markBatchItemResult",0,function(e,n,a){let r=(0,t.getDbInstance)(),i=Math.floor(Date.now()/1e3);r.prepare(`
    UPDATE batch_item_checkpoints
    SET custom_id = ?,
        status = 'completed',
        result_json = ?,
        error_json = NULL,
        updated_at = ?
    WHERE batch_id = ? AND line_number = ?
  `).run(n.customId,JSON.stringify(a),i,e,n.lineNumber)},"updateBatch",0,function(e,a){let r=(0,t.getDbInstance)(),i=(0,n.objToSnake)(a);i.metadata&&"string"!=typeof i.metadata&&(i.metadata=JSON.stringify(i.metadata)),i.errors&&"string"!=typeof i.errors&&(i.errors=JSON.stringify(i.errors)),i.usage&&"string"!=typeof i.usage&&(i.usage=JSON.stringify(i.usage));let o=Object.keys(i);if(0===o.length)return!1;let s=o.map(e=>`${e} = ?`).join(", "),l=Object.values(i);return r.prepare(`UPDATE batches SET ${s} WHERE id = ?`).run(...l,e).changes>0}])},948055,e=>{"use strict";var t=e.i(605845),n=e.i(899378),a=e.i(319560);let r="ccDiscoveryAliases",i="EXPOSE_CC_DISCOVERY_ALIASES";function o(e){return`provider:${e}`}function s(e,t){return`model:${e}/${t}`}function l(e){return"on"===e||"off"===e?e:null}function u(){let e;if("1"===(e=process.env[i])||"true"===e)return{enabled:!0,source:"env"};let n=(0,t.getFeatureFlagOverride)(i);return void 0!==n?{enabled:"true"===n||"1"===n,source:"db"}:{enabled:!1,source:"default"}}e.s(["getCcAliasGlobalState",0,u,"getCcAliasModelSetting",0,function(e,t){let a=(0,n.getDbInstance)().prepare("SELECT value FROM key_value WHERE namespace = ? AND key = ?").get(r,s(e,t));return l(a?.value)},"getCcAliasProviderSetting",0,function(e){let t=(0,n.getDbInstance)().prepare("SELECT value FROM key_value WHERE namespace = ? AND key = ?").get(r,o(e));return l(t?.value)},"getCcAliasSettingsBulk",0,function(){let e=(0,n.getDbInstance)().prepare("SELECT key, value FROM key_value WHERE namespace = ?").all(r),t=new Map,a=new Map;for(let n of e){let e=l(n.value);null!==e&&(n.key.startsWith("provider:")?t.set(n.key.slice(9),e):n.key.startsWith("model:")&&a.set(n.key.slice(6),e))}return{providers:t,models:a}},"isCcAliasGlobalEnabled",0,function(){return u().enabled},"resolveCcAliasEnabled",0,function(e){return"on"===e.model||"off"!==e.model&&("on"===e.provider||"off"!==e.provider&&e.global)},"setCcAliasModelSetting",0,function(e,t,i){let o=(0,n.getDbInstance)(),l=s(e,t);if(null===i){o.prepare("DELETE FROM key_value WHERE namespace = ? AND key = ?").run(r,l),(0,a.finishModelCatalogWriteWithoutBackup)();return}o.prepare("INSERT OR REPLACE INTO key_value (namespace, key, value) VALUES (?, ?, ?)").run(r,l,i),(0,a.finishModelCatalogWriteWithoutBackup)()},"setCcAliasProviderSetting",0,function(e,t){let i=(0,n.getDbInstance)(),s=o(e);if(null===t){i.prepare("DELETE FROM key_value WHERE namespace = ? AND key = ?").run(r,s),(0,a.finishModelCatalogWriteWithoutBackup)();return}i.prepare("INSERT OR REPLACE INTO key_value (namespace, key, value) VALUES (?, ?, ?)").run(r,s,t),(0,a.finishModelCatalogWriteWithoutBackup)()}])},546217,e=>{"use strict";var t=e.i(899378);let n="ccDiscoveryMetrics",a="req:total",r="discovery:hits",i="req:model:";function o(e){(0,t.getDbInstance)().prepare(`INSERT INTO key_value (namespace, key, value) VALUES (?, ?, '1')
       ON CONFLICT(namespace, key)
       DO UPDATE SET value = CAST(CAST(value AS INTEGER) + 1 AS TEXT)`).run(n,e)}e.s(["getCcDiscoveryMetrics",0,function(){try{let e=(0,t.getDbInstance)().prepare("SELECT key, value FROM key_value WHERE namespace = ?").all(n),o=0,s=0,l={};for(let t of e){if("string"!=typeof t.key)continue;let e="string"==typeof t.value?parseInt(t.value,10):Number(t.value),n=Number.isFinite(e)&&e>=0?e:0;t.key===a?o=n:t.key===r?s=n:t.key.startsWith(i)&&(l[t.key.slice(i.length)]=n)}return{aliasRequests:o,discoveryHits:s,byModel:l}}catch{return{aliasRequests:0,discoveryHits:0,byModel:{}}}},"incrementCcAliasRequestCount",0,function(e){try{o(a),"string"==typeof e&&e.length>0&&o(`${i}${e}`)}catch{}},"incrementCcDiscoveryHitCount",0,function(){try{o(r)}catch{}}])},953692,e=>{"use strict";var t=e.i(899378);let n="conductor",a="last_event_id";e.s(["getConductorCursor",0,function(){let e=(0,t.getDbInstance)().prepare("SELECT value FROM key_value WHERE namespace = ? AND key = ?").get(n,a);if(!e)return null;try{let t=JSON.parse(e.value);return"string"==typeof t?t:null}catch{return null}},"setConductorCursor",0,function(e){(0,t.getDbInstance)().prepare("INSERT OR REPLACE INTO key_value (namespace, key, value) VALUES (?, ?, ?)").run(n,a,JSON.stringify(e))}])},783414,e=>{"use strict";var t=e.i(899378);function n(e){let t;if(e.models)try{let n=JSON.parse(e.models);Array.isArray(n)&&(t=n.map(String))}catch{t=void 0}return{id:e.id,providerId:e.provider_id,method:e.method,endpoint:e.endpoint,authType:e.auth_type??"none",models:t,rateLimit:e.rate_limit,feasibility:e.feasibility??0,riskLevel:e.risk_level??"none",status:e.status,notes:e.notes,discoveredAt:e.discovered_at,verifiedAt:e.verified_at}}function a(e){let a=(0,t.getDbInstance)().prepare("SELECT * FROM discovery_results WHERE id = ?").get(e);return a?n(a):null}e.s(["deleteDiscoveryResult",0,function(e){return(0,t.getDbInstance)().prepare("DELETE FROM discovery_results WHERE id = ?").run(e).changes>0},"getDiscoveryResultById",0,a,"getDiscoveryResults",0,function(e){let a=(0,t.getDbInstance)();return(e?a.prepare("SELECT * FROM discovery_results WHERE provider_id = ? ORDER BY discovered_at DESC, id DESC").all(e):a.prepare("SELECT * FROM discovery_results ORDER BY discovered_at DESC, id DESC").all()).map(n)},"markVerified",0,function(e){return 0===(0,t.getDbInstance)().prepare("UPDATE discovery_results SET status = 'verified', verified_at = datetime('now') WHERE id = ?").run(e).changes?null:a(e)},"upsertDiscoveryResult",0,function(e){let a=(0,t.getDbInstance)(),r=e.models?JSON.stringify(e.models):null;return a.prepare(`INSERT INTO discovery_results
       (provider_id, method, endpoint, auth_type, models, rate_limit, feasibility, risk_level, status, notes)
     VALUES (@provider_id, @method, @endpoint, @auth_type, @models, @rate_limit, @feasibility, @risk_level, @status, @notes)
     ON CONFLICT(provider_id, method, endpoint) DO UPDATE SET
       auth_type = excluded.auth_type,
       models = excluded.models,
       rate_limit = excluded.rate_limit,
       feasibility = excluded.feasibility,
       risk_level = excluded.risk_level,
       status = excluded.status,
       notes = excluded.notes`).run({provider_id:e.providerId,method:e.method,endpoint:e.endpoint??null,auth_type:e.authType,models:r,rate_limit:e.rateLimit??null,feasibility:e.feasibility,risk_level:e.riskLevel,status:e.status,notes:e.notes??null}),n(a.prepare(`SELECT * FROM discovery_results
       WHERE provider_id = ? AND method = ? AND ifnull(endpoint, '') = ifnull(?, '')`).get(e.providerId,e.method,e.endpoint??null))}])},926554,e=>{"use strict";var t=e.i(666680),n=e.i(899378),a=e.i(529646);function r(e,t,n){return e.prepare(`PRAGMA table_info(${t})`).all().some(e=>e&&"string"==typeof e.name&&e.name===n)}function i(e){e.prepare(`CREATE TABLE IF NOT EXISTS eval_suites (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`).run(),r(e,"eval_suites","description")||e.prepare("ALTER TABLE eval_suites ADD COLUMN description TEXT").run(),r(e,"eval_suites","created_at")||e.prepare("ALTER TABLE eval_suites ADD COLUMN created_at TEXT NOT NULL DEFAULT ''").run(),r(e,"eval_suites","updated_at")||e.prepare("ALTER TABLE eval_suites ADD COLUMN updated_at TEXT NOT NULL DEFAULT ''").run(),e.prepare(`CREATE TABLE IF NOT EXISTS eval_cases (
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
    )`).run(),r(e,"eval_cases","sort_order")||e.prepare("ALTER TABLE eval_cases ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0").run(),r(e,"eval_cases","model")||e.prepare("ALTER TABLE eval_cases ADD COLUMN model TEXT").run(),r(e,"eval_cases","input_json")||e.prepare("ALTER TABLE eval_cases ADD COLUMN input_json TEXT NOT NULL DEFAULT '{}'").run(),r(e,"eval_cases","expected_strategy")||e.prepare("ALTER TABLE eval_cases ADD COLUMN expected_strategy TEXT NOT NULL DEFAULT 'contains'").run(),r(e,"eval_cases","expected_value")||e.prepare("ALTER TABLE eval_cases ADD COLUMN expected_value TEXT").run(),r(e,"eval_cases","tags_json")||e.prepare("ALTER TABLE eval_cases ADD COLUMN tags_json TEXT").run(),r(e,"eval_cases","created_at")||e.prepare("ALTER TABLE eval_cases ADD COLUMN created_at TEXT NOT NULL DEFAULT ''").run(),r(e,"eval_cases","updated_at")||e.prepare("ALTER TABLE eval_cases ADD COLUMN updated_at TEXT NOT NULL DEFAULT ''").run(),e.prepare("CREATE INDEX IF NOT EXISTS idx_eval_suites_updated_at ON eval_suites(updated_at DESC)").run(),e.prepare("CREATE INDEX IF NOT EXISTS idx_eval_cases_suite_order ON eval_cases(suite_id, sort_order ASC, created_at ASC)").run()}function o(e){if(e&&"object"==typeof e&&!Array.isArray(e))return e;if("string"!=typeof e||0===e.trim().length)return{};try{let t=JSON.parse(e);return t&&"object"==typeof t&&!Array.isArray(t)?t:{}}catch{return{}}}function s(e){let t=Number(e);return Number.isFinite(t)?t:0}function l(e){var t;let n=e&&"object"==typeof e&&!Array.isArray(e)?e:{},a=s(n.max_tokens),r={messages:Array.isArray(t=n.messages)?t.map(e=>{if(!e||"object"!=typeof e||Array.isArray(e))return null;let t="string"==typeof e.role?e.role.trim():"",n="string"==typeof e.content?e.content:"";return t&&n.trim()?{role:t,content:n}:null}).filter(e=>null!==e):[]};return a>0&&(r.max_tokens=Math.floor(a)),r}function u(e){let t=e&&"object"==typeof e&&!Array.isArray(e)?e:{},n="string"==typeof t.strategy?t.strategy.trim():"",a="string"==typeof t.value&&t.value.trim().length>0?t.value:void 0;return{strategy:"exact"===n||"regex"===n||"custom"===n?n:"contains",...a?{value:a}:{}}}function c(e,t){return`${e}:${"string"==typeof t&&t.trim().length>0?t.trim():"__default__"}`}function d(e){let t,n,r,i,l=(0,a.rowToCamel)(e);if(!l)return null;let u=o(l.summary??l.summaryJson),d=Object.fromEntries(Object.entries(o(l.outputs??l.outputsJson)).filter(e=>"string"==typeof e[0]).map(([e,t])=>[e,"string"==typeof t?t:String(t??"")]));return{id:"string"==typeof l.id?l.id:"",runGroupId:"string"==typeof l.runGroupId&&l.runGroupId.trim().length>0?l.runGroupId:null,suiteId:"string"==typeof l.suiteId?l.suiteId:"",suiteName:"string"==typeof l.suiteName?l.suiteName:"",target:(t=l.targetType,r="string"==typeof(n=l.targetId)&&n.trim().length>0?n.trim():null,{type:i="combo"===t||"model"===t||"suite-default"===t?t:"suite-default",id:r,key:c(i,r),label:"string"==typeof l.targetLabel&&l.targetLabel.trim().length>0?l.targetLabel.trim():"combo"===i?`Combo: ${r||"Unknown"}`:"model"===i?`Model: ${r||"Unknown"}`:"Suite defaults"}),apiKeyId:"string"==typeof l.apiKeyId&&l.apiKeyId.trim().length>0?l.apiKeyId:null,avgLatencyMs:s(l.avgLatencyMs),summary:{total:s(u.total??l.total),passed:s(u.passed??l.passed),failed:s(u.failed??l.failed),passRate:s(u.passRate??l.passRate)},results:function(e){if(Array.isArray(e))return e.filter(e=>!!e&&"object"==typeof e&&!Array.isArray(e));if("string"!=typeof e||0===e.trim().length)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t.filter(e=>!!e&&"object"==typeof e&&!Array.isArray(e)):[]}catch{return[]}}(l.results??l.resultsJson),outputs:d,createdAt:"string"==typeof l.createdAt?l.createdAt:""}}function p(e={}){let t=(0,n.getDbInstance)(),a=[],r=[];e.suiteId&&(a.push("suite_id = ?"),r.push(e.suiteId)),e.runGroupId&&(a.push("run_group_id = ?"),r.push(e.runGroupId));let i=Number.isFinite(Number(e.limit))?Math.min(200,Math.max(1,Math.floor(Number(e.limit)))):20;r.push(i);let o=`SELECT *
    FROM eval_runs
    ${a.length>0?`WHERE ${a.join(" AND ")}`:""}
    ORDER BY created_at DESC
    LIMIT ?`;return t.prepare(o).all(...r).map(e=>d(e)).filter(e=>null!==e)}function _(){let e=(0,n.getDbInstance)();i(e);let t=e.prepare("SELECT * FROM eval_suites ORDER BY updated_at DESC, created_at DESC").all(),r=e.prepare("SELECT * FROM eval_cases ORDER BY suite_id ASC, sort_order ASC, created_at ASC, id ASC").all(),c=new Map;for(let e of r){let t=function(e){let t=(0,a.rowToCamel)(e);if(!t)return null;let n=l(o(t.input??t.inputJson)),r=u({strategy:t.expectedStrategy,value:t.expectedValue});return{id:"string"==typeof t.id?t.id:"",suiteId:"string"==typeof t.suiteId?t.suiteId:"",name:"string"==typeof t.name?t.name:"",..."string"==typeof t.model&&t.model.trim().length>0?{model:t.model.trim()}:{},input:n,expected:r,tags:function(e){if(Array.isArray(e))return e.filter(e=>"string"==typeof e).map(e=>e.trim()).filter(e=>e.length>0);if("string"!=typeof e||0===e.trim().length)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t.filter(e=>"string"==typeof e).map(e=>e.trim()).filter(e=>e.length>0):[]}catch{return[]}}(t.tags??t.tagsJson),sortOrder:s(t.sortOrder),createdAt:"string"==typeof t.createdAt?t.createdAt:"",updatedAt:"string"==typeof t.updatedAt?t.updatedAt:""}}(e);if(!t||!t.suiteId)continue;let n=c.get(t.suiteId)||[];n.push(t),c.set(t.suiteId,n)}return t.map(e=>{var t;let n,r=(0,a.rowToCamel)(e),i=r&&"string"==typeof r.id?r.id:"";return t=c.get(i)||[],(n=(0,a.rowToCamel)(e))?{id:"string"==typeof n.id?n.id:"",name:"string"==typeof n.name?n.name:"",..."string"==typeof n.description&&n.description.trim().length>0?{description:n.description}:{},source:"custom",caseCount:t.length,cases:t,createdAt:"string"==typeof n.createdAt?n.createdAt:"",updatedAt:"string"==typeof n.updatedAt?n.updatedAt:""}:null}).filter(e=>null!==e)}function E(e){let t=e.trim();return t&&_().find(e=>e.id===t)||null}e.s(["deleteCustomEvalSuite",0,function(e){let t=(0,n.getDbInstance)();i(t);let a=e.trim();if(!a)return!1;t.prepare("BEGIN").run();try{t.prepare("DELETE FROM eval_cases WHERE suite_id = ?").run(a);let e=t.prepare("DELETE FROM eval_suites WHERE id = ?").run(a);return t.prepare("COMMIT").run(),e.changes>0}catch(e){throw t.prepare("ROLLBACK").run(),e}},"getCustomEvalSuite",0,E,"getEvalScorecard",0,function(e={}){var t;let n,a,r=p({suiteId:e.suiteId,limit:e.limit||50});if(0===r.length)return null;let i=new Map;for(let e of r){let t=`${e.suiteId}:${e.target.key}`;i.has(t)||i.set(t,e)}return n=(t=Array.from(i.values()).map(e=>({suiteId:`${e.suiteId}:${e.target.key}`,suiteName:`${e.suiteName} \xb7 ${e.target.label}`,results:e.results,summary:e.summary}))).reduce((e,t)=>e+t.summary.total,0),a=t.reduce((e,t)=>e+t.summary.passed,0),{suites:t.length,totalCases:n,totalPassed:a,overallPassRate:n>0?Math.round(a/n*100):0,perSuite:t.map(e=>({id:e.suiteId,name:e.suiteName,passRate:e.summary.passRate}))}},"listCustomEvalSuites",0,_,"listEvalRuns",0,p,"listModelEvalRunsForRouting",0,function(e){let t=[...new Set(e.targetIds.map(e=>e.trim()).filter(Boolean))].slice(0,200);if(0===t.length)return[];let a=Array.isArray(e.suiteIds)?[...new Set(e.suiteIds.map(e=>e.trim()).filter(Boolean))].slice(0,50):[],r=(0,n.getDbInstance)(),i=["target_type = 'model'"],o=[];i.push(`target_id IN (${t.map(()=>"?").join(", ")})`),o.push(...t),a.length>0&&(i.push(`suite_id IN (${a.map(()=>"?").join(", ")})`),o.push(...a));let s=Number(e.maxAgeHours);Number.isFinite(s)&&s>0&&(i.push("created_at >= ?"),o.push(new Date(Date.now()-60*s*6e4).toISOString()));let l=Number.isFinite(Number(e.limit))?Math.min(1e3,Math.max(1,Math.floor(Number(e.limit)))):Math.min(1e3,Math.max(50,t.length*Math.max(3,a.length||5)*2));return o.push(l),r.prepare(`SELECT *
       FROM eval_runs
       WHERE ${i.join(" AND ")}
       ORDER BY created_at DESC
       LIMIT ?`).all(...o).map(e=>d(e)).filter(e=>null!==e)},"saveCustomEvalSuite",0,function(e){let a=(0,n.getDbInstance)();i(a);let r=new Date().toISOString(),o="string"==typeof e.id&&e.id.trim().length>0?e.id.trim():(0,t.randomUUID)(),s=e.name.trim(),c="string"==typeof e.description&&e.description.trim().length>0?e.description.trim():null;if(!s)throw Error("Suite name is required");if(!Array.isArray(e.cases)||0===e.cases.length)throw Error("At least one eval case is required");a.prepare("BEGIN").run();try{a.prepare("SELECT id FROM eval_suites WHERE id = ?").get(o)?a.prepare(`UPDATE eval_suites
         SET name = ?, description = ?, updated_at = ?
         WHERE id = ?`).run(s,c,r,o):a.prepare(`INSERT INTO eval_suites (id, name, description, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?)`).run(o,s,c,r,r),a.prepare("DELETE FROM eval_cases WHERE suite_id = ?").run(o),e.cases.forEach((e,n)=>{let i="string"==typeof e.id&&e.id.trim().length>0?e.id.trim():(0,t.randomUUID)(),s=e.name.trim(),c="string"==typeof e.model&&e.model.trim().length>0?e.model.trim():null,d=l(e.input),p=u(e.expected),_=Array.isArray(e.tags)?e.tags.map(e=>e.trim()).filter(e=>e.length>0):[];if(!s)throw Error(`Case ${n+1} is missing a name`);if(0===d.messages.length)throw Error(`Case ${n+1} must include at least one message`);if(("contains"===p.strategy||"exact"===p.strategy||"regex"===p.strategy)&&!p.value)throw Error(`Case ${n+1} must include an expected value`);a.prepare(`INSERT INTO eval_cases
          (id, suite_id, sort_order, name, model, input_json, expected_strategy, expected_value,
           tags_json, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(i,o,n,s,c,JSON.stringify(d),p.strategy,p.value||null,JSON.stringify(_),r,r)}),a.prepare("COMMIT").run()}catch(e){throw a.prepare("ROLLBACK").run(),e}let d=E(o);if(!d)throw Error("Failed to persist eval suite");return d},"saveEvalRun",0,function(e){let a=(0,n.getDbInstance)(),r=e.createdAt||new Date().toISOString(),i=(0,t.randomUUID)(),o="string"==typeof e.target.id&&e.target.id.trim().length>0?e.target.id.trim():null,s=Number.isFinite(Number(e.avgLatencyMs))?Math.max(0,Math.round(Number(e.avgLatencyMs))):0;return a.prepare(`INSERT INTO eval_runs
      (id, run_group_id, suite_id, suite_name, target_type, target_id, target_label, api_key_id,
       pass_rate, total, passed, failed, avg_latency_ms, summary_json, results_json, outputs_json, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(i,e.runGroupId||null,e.suiteId,e.suiteName,e.target.type,o,e.target.label,e.apiKeyId||null,e.summary.passRate,e.summary.total,e.summary.passed,e.summary.failed,s,JSON.stringify(e.summary),JSON.stringify(e.results||[]),JSON.stringify(e.outputs||{}),r),{id:i,runGroupId:e.runGroupId||null,suiteId:e.suiteId,suiteName:e.suiteName,target:{type:e.target.type,id:o,key:c(e.target.type,o),label:e.target.label},apiKeyId:e.apiKeyId||null,avgLatencyMs:s,summary:e.summary,results:e.results||[],outputs:e.outputs||{},createdAt:r}},"serializeEvalTargetKey",0,c])},404585,e=>{"use strict";var t=e.i(666680),n=e.i(899378),a=e.i(529646);let r=/^vlo_[A-Za-z0-9_-]{43}$/,i=()=>(0,n.getDbInstance)(),o=e=>(0,a.rowToCamel)(e);function s(e){let t=Date.parse(e??new Date().toISOString());if(!Number.isFinite(t))throw Error("now must be a valid ISO timestamp");return new Date(t).toISOString()}function l(e,t){let n=Math.min(18e5,Math.max(1e3,t??12e4));return new Date(Date.parse(e)+n).toISOString()}function u(e){if(!r.test(e))throw Error("lease owner must use the canonical vlo_ base64url format");return(0,t.createHash)("sha256").update(e).digest("hex")}function c(e){let t;if(i().immediate(()=>t=e()),void 0===t)throw Error("lease transaction did not produce a result");return t}function d(e){return i().prepare(`UPDATE exclusive_connection_leases
       SET state = 'EXPIRED', ended_at = ?, end_reason = 'TTL_EXPIRED'
       WHERE state = 'ACTIVE' AND expires_at <= ?`).run(e,e).changes}function p(e,t){return i().prepare(`SELECT * FROM exclusive_connection_leases WHERE state = 'ACTIVE' AND ${e} = ?`).get(t)}function _(e){let t=i().prepare(`INSERT INTO exclusive_connection_leases
       (lease_owner_hash, api_key_id, provider, connection_id, generation, state,
        acquired_at, renewed_at, expires_at)
       VALUES (?, ?, ?, ?, ?, 'ACTIVE', ?, ?, ?)`).run(e.ownerHash,e.apiKeyId,e.provider,e.connectionId,e.generation,e.now,e.now,l(e.now,e.ttlMs));return o(i().prepare("SELECT * FROM exclusive_connection_leases WHERE id = ?").get(t.lastInsertRowid))}function E(e){return e instanceof Error&&(/UNIQUE constraint failed: exclusive_connection_leases\.(connection_id|lease_owner_hash)/i.test(e.message)||/idx_exclusive_lease_active_(connection|owner)/i.test(e.message))}function y(e,t){let n=p("lease_owner_hash",e);return n?{kind:"OWNER_ALREADY_ACTIVE",lease:o(n)}:{kind:"CONNECTION_BUSY",retryAfter:p("connection_id",t)?.expires_at??null}}function m(e){return c(()=>{var t,n;d(e.now);let a=1===i().prepare(e.sql).run(...e.args).changes,r=(t=e.ownerHash,n=e.generation,i().prepare(`SELECT * FROM exclusive_connection_leases
       WHERE lease_owner_hash = ? AND generation = ? ORDER BY id DESC LIMIT 1`).get(t,n));return a||e.accept?.(r)?{kind:e.kind,lease:o(r)}:{kind:"STALE"}})}function g(e){return c(()=>d(s(e)))}e.s(["LEASE_OWNER_PATTERN",0,r,"acquireExclusiveConnectionLease",0,function(e){let t=u(e.leaseOwnerId),n=s(e.now);try{return c(()=>{d(n);let a=p("lease_owner_hash",t);if(a)return a.api_key_id!==e.apiKeyId||a.connection_id!==e.connectionId?{kind:"OWNER_ALREADY_ACTIVE",lease:o(a)}:(i().prepare(`UPDATE exclusive_connection_leases SET renewed_at = ?, expires_at = ?,
             provider = ? WHERE id = ? AND state = 'ACTIVE' AND api_key_id = ?`).run(n,l(n,e.ttlMs),e.provider,a.id,e.apiKeyId),{kind:"REUSED",lease:o(p("lease_owner_hash",t))});let r=p("connection_id",e.connectionId);return r?{kind:"CONNECTION_BUSY",retryAfter:r.expires_at}:{kind:"ACQUIRED",lease:_({...e,ownerHash:t,generation:function(e){let t=Number(i().prepare("SELECT COALESCE(MAX(generation), 0) AS generation FROM exclusive_connection_leases WHERE lease_owner_hash = ?").get(e).generation)+1;if(!Number.isSafeInteger(t)||t<=0)throw Error("lease generation exhausted");return t}(t),now:n})}})}catch(n){if(!E(n))throw n;return y(t,e.connectionId)}},"assertExclusiveConnectionLeaseFence",0,function(e){let t=u(e.leaseOwnerId);g(e.now);let n=p("lease_owner_hash",t);if(!n)return{kind:"REQUIRED"};if(n.generation!==e.generation)return{kind:"STALE"};let a=o(n);return n.api_key_id!==e.apiKeyId?{kind:"AUTHORIZATION_MISMATCH",lease:a}:n.connection_id===e.connectionId?{kind:"VALID",lease:a}:{kind:"CONNECTION_MISMATCH",lease:a}},"getActiveExclusiveConnectionLease",0,function(e,t){let n=u(e);g(t);let a=p("lease_owner_hash",n);return a?o(a):null},"getExclusiveLeaseOccupancy",0,function(e,t){return(g(t),0===e.length)?new Map:new Map(i().prepare(`SELECT connection_id, lease_owner_hash, expires_at FROM exclusive_connection_leases
       WHERE state = 'ACTIVE' AND connection_id IN (${e.map(()=>"?").join(", ")})`).all(...e).map(e=>[e.connection_id,{leaseOwnerHash:e.lease_owner_hash,expiresAt:e.expires_at}]))},"hashLeaseOwnerId",0,u,"invalidateExclusiveConnectionLease",0,function(e){let t=u(e.leaseOwnerId),n=s(e.now);return m({ownerHash:t,generation:e.generation,now:n,kind:"INVALIDATED",sql:`UPDATE exclusive_connection_leases SET state = 'INVALIDATED', ended_at = ?, end_reason = ?
          WHERE lease_owner_hash = ? AND generation = ? AND api_key_id = ?
          AND state = 'ACTIVE' AND expires_at > ?`,args:[n,e.reason,t,e.generation,e.apiKeyId,n]})},"isExclusiveConnectionActivelyLeased",0,function(e,t){return!!e&&(g(t),void 0!==p("connection_id",e))},"reconcileExpiredExclusiveConnectionLeases",0,g,"releaseExclusiveConnectionLease",0,function(e){let t=u(e.leaseOwnerId),n=s(e.now);return m({ownerHash:t,generation:e.generation,now:n,kind:"RELEASED",sql:`UPDATE exclusive_connection_leases SET state = 'RELEASED', ended_at = ?, end_reason = ?
          WHERE lease_owner_hash = ? AND generation = ? AND api_key_id = ?
          AND state = 'ACTIVE' AND expires_at > ?`,args:[n,e.reason??"OWNER_EXIT",t,e.generation,e.apiKeyId,n],accept:t=>t?.state==="RELEASED"&&t.api_key_id===e.apiKeyId})},"renewExclusiveConnectionLease",0,function(e){let t=u(e.leaseOwnerId),n=s(e.now);return m({ownerHash:t,generation:e.generation,now:n,kind:"RENEWED",sql:`UPDATE exclusive_connection_leases SET renewed_at = ?, expires_at = ?
          WHERE lease_owner_hash = ? AND generation = ? AND api_key_id = ?
          AND state = 'ACTIVE' AND expires_at > ?`,args:[n,l(n,e.ttlMs),t,e.generation,e.apiKeyId,n]})},"transitionExclusiveConnectionLease",0,function(e){let t=u(e.leaseOwnerId),n=s(e.now);try{return c(()=>{d(n);let a=p("lease_owner_hash",t);if(!a||a.generation!==e.generation||a.api_key_id!==e.apiKeyId)return{kind:"STALE"};if(a.connection_id===e.connectionId)return{kind:"REUSED",lease:o(a)};let r=p("connection_id",e.connectionId);return r?{kind:"CONNECTION_BUSY",retryAfter:r.expires_at}:(i().prepare(`UPDATE exclusive_connection_leases SET state = 'INVALIDATED', ended_at = ?,
           end_reason = ? WHERE id = ? AND state = 'ACTIVE'`).run(n,e.reason,a.id),{kind:"TRANSITIONED",lease:_({...e,ownerHash:t,now:n})})})}catch(n){if(!E(n))throw n;return y(t,e.connectionId)}}])},521215,e=>{"use strict";var t=e.i(899378),n=e.i(529646),a=e.i(689960);let r="id, bytes, created_at, filename, purpose, mime_type, api_key_id, expires_at, deleted_at";function i(e){let a=(0,t.getDbInstance)().prepare(`SELECT ${r} FROM files WHERE id = ? AND deleted_at IS NULL`).get(e);return a?(0,n.rowToCamel)(a):null}e.s(["countFiles",0,function(e={}){let n=(0,t.getDbInstance)(),{apiKeyId:a,purpose:r}=e,i="SELECT COUNT(*) as c FROM files WHERE deleted_at IS NULL",o=[];a&&(i+=" AND api_key_id = ?",o.push(a)),r&&(i+=" AND purpose = ?",o.push(r));let s=n.prepare(i).get(...o);return s?Number(s.c):0},"createFile",0,function(e){let n=(0,t.getDbInstance)(),r="file-"+(0,a.v4)().replaceAll("-","").substring(0,24),i=Math.floor(Date.now()/1e3),o=e.expiresAt;void 0===o&&"batch"===e.purpose&&(o=i+2592e3);let s={id:r,bytes:e.bytes,createdAt:i,filename:e.filename,purpose:e.purpose,content:e.content??null,mimeType:e.mimeType??null,apiKeyId:e.apiKeyId??null,expiresAt:o??null,deletedAt:null};return n.prepare(`
    INSERT INTO files (id, bytes, created_at, filename, purpose, content, mime_type, api_key_id, expires_at, deleted_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(s.id,s.bytes,s.createdAt,s.filename,s.purpose,s.content,s.mimeType,s.apiKeyId,s.expiresAt,s.deletedAt),s},"deleteFile",0,function(e){return(0,t.getDbInstance)().prepare("UPDATE files SET deleted_at = ?, content = NULL WHERE id = ?").run(Math.floor(Date.now()/1e3),e).changes>0},"formatFileResponse",0,function(e){let t="number"==typeof e.createdAt&&Number.isFinite(e.createdAt)?e.createdAt:0,n="number"==typeof e.expiresAt&&Number.isFinite(e.expiresAt)?e.expiresAt:null;return{id:e.id,bytes:e.bytes,created_at:t,filename:e.filename,object:"file",purpose:e.purpose,expires_at:n}},"getFile",0,i,"getFileContent",0,function(e){let n=(0,t.getDbInstance)().prepare("SELECT content FROM files WHERE id = ? AND deleted_at IS NULL").get(e);return n?.content?Buffer.isBuffer(n.content)?n.content:Buffer.from(n.content):null},"listFiles",0,function(e={}){let a=(0,t.getDbInstance)(),{apiKeyId:o,purpose:s,limit:l=20,after:u,order:c="desc"}=e,d=`SELECT ${r} FROM files WHERE deleted_at IS NULL`,p=[];if(o&&(d+=" AND api_key_id = ?",p.push(o)),s&&(d+=" AND purpose = ?",p.push(s)),u){let e=i(u);e&&("desc"===c?d+=" AND (created_at < ? OR (created_at = ? AND id < ?))":d+=" AND (created_at > ? OR (created_at = ? AND id > ?))",p.push(e.createdAt,e.createdAt,u))}return d+=` ORDER BY created_at ${"asc"===c?"ASC":"DESC"}, id ${"asc"===c?"ASC":"DESC"} LIMIT ?`,p.push(l),a.prepare(d).all(...p).map(e=>(0,n.rowToCamel)(e))}],521215)},539979,e=>{"use strict";var t=e.i(605845),n=e.i(899378);let a="functionalGatewayMirrors",r="EXPOSE_FUNCTIONAL_GATEWAY_MIRRORS";function i(e){return"on"===e||"off"===e?e:null}function o(e){return`provider:${e}`}function s(e){return`model:${e}`}function l(){let e;if("1"===(e=process.env[r])||"true"===e)return{enabled:!0,source:"env"};let n=(0,t.getFeatureFlagOverride)(r);return void 0!==n?{enabled:"true"===n||"1"===n,source:"db"}:{enabled:!1,source:"default"}}e.s(["getFunctionalGatewayGlobalState",0,l,"getFunctionalGatewayModelSetting",0,function(e){let t=(0,n.getDbInstance)().prepare("SELECT value FROM key_value WHERE namespace = ? AND key = ?").get(a,s(e));return i(t?.value)},"getFunctionalGatewayProviderSetting",0,function(e){let t=(0,n.getDbInstance)().prepare("SELECT value FROM key_value WHERE namespace = ? AND key = ?").get(a,o(e));return i(t?.value)},"getFunctionalGatewaySettingsBulk",0,function(){let e=(0,n.getDbInstance)().prepare("SELECT key, value FROM key_value WHERE namespace = ?").all(a),t=new Map,r=new Map;for(let n of e){let e=i(n.value);null!==e&&(n.key.startsWith("provider:")?t.set(n.key.slice(9),e):n.key.startsWith("model:")&&r.set(n.key.slice(6),e))}return{providers:t,models:r}},"isFunctionalGatewayGlobalEnabled",0,function(){return l().enabled},"setFunctionalGatewayModelSetting",0,function(e,t){let r=(0,n.getDbInstance)(),i=s(e);null===t?r.prepare("DELETE FROM key_value WHERE namespace = ? AND key = ?").run(a,i):r.prepare("INSERT OR REPLACE INTO key_value (namespace, key, value) VALUES (?, ?, ?)").run(a,i,t)},"setFunctionalGatewayProviderSetting",0,function(e,t){let r=(0,n.getDbInstance)(),i=o(e);null===t?r.prepare("DELETE FROM key_value WHERE namespace = ? AND key = ?").run(a,i):r.prepare("INSERT OR REPLACE INTO key_value (namespace, key, value) VALUES (?, ?, ?)").run(a,i,t)}])},845042,e=>{"use strict";var t=e.i(899378);let n="interception_rules",a=null;function r(e){return null!==e&&"object"==typeof e&&!Array.isArray(e)}function i(e){return"string"==typeof e&&e.trim().length>0?e.trim():null}function o(e){return"boolean"==typeof e?e:void 0}function s(e){return"firecrawl"===e||"jina"===e||"tavily"===e?e:void 0}function l(e){return i(e)?(null===a&&(a=function(){let e=function(e){let n=(0,t.getDbInstance)().prepare("SELECT key, value FROM key_value WHERE namespace = ?").all(e),a={};for(let e of n)a[e.key]=function(e){if("string"!=typeof e)return e;try{return JSON.parse(e)}catch{return e}}(e.value);return a}(n),a=new Map;for(let[t,n]of Object.entries(e)){let e=function(e){if(!r(e))return null;let t=function(e){let t={};if(!r(e))return t;for(let[n,a]of Object.entries(e)){let e=function(e){if(!r(e))return null;let t={interceptSearch:o(e.interceptSearch),interceptFetch:o(e.interceptFetch),fetchBackend:s(e.fetchBackend),fetchProxyUrl:i(e.fetchProxyUrl)??void 0};return Object.values(t).some(e=>void 0!==e)?t:null}(a);e&&(t[n]=e)}return t}(e.models);return{interceptSearch:o(e.interceptSearch),interceptFetch:o(e.interceptFetch),fetchBackend:s(e.fetchBackend),fetchProxyUrl:i(e.fetchProxyUrl)??void 0,models:Object.keys(t).length>0?t:void 0}}(n);e&&a.set(t,e)}return a}()),a).get(e)??null:null}e.s(["deleteInterceptionRules",0,function(e){let r=i(e);r&&((0,t.getDbInstance)().prepare("DELETE FROM key_value WHERE namespace = ? AND key = ?").run(n,r),a=null)},"getInterceptionRules",0,l,"resolveInterceptFetch",0,function(e,t){let n=i(e);if(!n)return;let a=l(n);if(!a)return;let r=i(t);return r&&a.models?.[r]?.interceptFetch!==void 0?a.models[r].interceptFetch:a.interceptFetch},"resolveInterceptSearch",0,function(e,t){let n=i(e);if(!n)return;let a=l(n);if(!a)return;let r=i(t);return r&&a.models?.[r]?.interceptSearch!==void 0?a.models[r].interceptSearch:a.interceptSearch},"setInterceptionRules",0,function(e,r){let o=i(e);if(!o)return;let s=(0,t.getDbInstance)().prepare("INSERT OR REPLACE INTO key_value (namespace, key, value) VALUES (?, ?, ?)"),l={interceptSearch:r.interceptSearch,interceptFetch:r.interceptFetch,fetchBackend:r.fetchBackend,fetchProxyUrl:r.fetchProxyUrl,models:r.models&&Object.keys(r.models).length>0?r.models:void 0};s.run(n,o,JSON.stringify(l)),a=null}])},90886,e=>{"use strict";var t=e.i(899378);let n="local_corpus",a="root_path";function r(){try{let e=(0,t.getDbInstance)().prepare("SELECT value FROM key_value WHERE namespace = ? AND key = ?").get(n,a);if("string"!=typeof e?.value)return null;let r=JSON.parse(e.value);return"string"==typeof r&&r.trim()?r:null}catch{return null}}e.s(["clearLocalCorpusRoot",0,function(){(0,t.getDbInstance)().prepare("DELETE FROM key_value WHERE namespace = ? AND key = ?").run(n,a)},"getLocalCorpusConfig",0,function(){let e=r();return{rootPath:e,configured:null!==e}},"getLocalCorpusRoot",0,r,"setLocalCorpusRoot",0,function(e){(0,t.getDbInstance)().prepare("INSERT OR REPLACE INTO key_value (namespace, key, value) VALUES (?, ?, ?)").run(n,a,JSON.stringify(e))}])},524630,e=>{"use strict";var t=e.i(899378);function n(){let e=(0,t.getDbInstance)().prepare("SELECT active_dim, embedding_signature, last_reset_at, vec_loaded FROM memory_vec_meta WHERE id = 1").get();return e?{activeDim:e.active_dim,embeddingSignature:e.embedding_signature,lastResetAt:e.last_reset_at,vecLoaded:1===e.vec_loaded}:{activeDim:null,embeddingSignature:null,lastResetAt:null,vecLoaded:!1}}e.s(["countMemoryReindexPending",0,function(){return(0,t.getDbInstance)().prepare("SELECT COUNT(*) AS cnt FROM memories WHERE needs_reindex = 1").get().cnt},"getMemoryReindexQueue",0,function(e){return(0,t.getDbInstance)().prepare(`SELECT id, content, COALESCE(key, '') AS key
       FROM memories
       WHERE needs_reindex = 1
       ORDER BY created_at ASC
       LIMIT ?`).all(e)},"getMemoryVecMeta",0,n,"markAllMemoriesNeedReindex",0,function(){return(0,t.getDbInstance)().prepare("UPDATE memories SET needs_reindex = 1").run().changes},"markMemoryNeedsReindex",0,function(e,n){(0,t.getDbInstance)().prepare("UPDATE memories SET needs_reindex = ? WHERE id = ?").run(+!!n,e)},"setMemoryVecMeta",0,function(e){let a=(0,t.getDbInstance)(),r=n(),i="activeDim"in e?e.activeDim??null:r.activeDim,o="embeddingSignature"in e?e.embeddingSignature??null:r.embeddingSignature,s="lastResetAt"in e?e.lastResetAt??null:r.lastResetAt,l="vecLoaded"in e?+!!e.vecLoaded:+!!r.vecLoaded;a.prepare(`INSERT OR REPLACE INTO memory_vec_meta
       (id, active_dim, embedding_signature, last_reset_at, vec_loaded)
     VALUES (1, ?, ?, ?, ?)`).run(i,o,s,l)}])},992088,e=>{"use strict";var t=e.i(899378);function n(e){return{name:e.name,description:e.description,priority:e.priority,scope:"combo"===e.scope_type&&e.combo_id?{type:"combo",comboId:e.combo_id}:{type:"global"},enabled:1===e.enabled,code:e.code,createdAt:e.created_at,updatedAt:e.updated_at,runCount:e.run_count,lastError:e.last_error||void 0}}function a(e){return{name:e.name,description:e.description,priority:e.priority,scope_type:e.scope.type,combo_id:"combo"===e.scope.type?e.scope.comboId:null,enabled:+!!e.enabled,code:e.code,created_at:e.createdAt||new Date().toISOString(),updated_at:new Date().toISOString(),run_count:e.runCount||0,last_error:e.lastError}}function r(e){let a=(0,t.getDbInstance)().prepare("SELECT * FROM middleware_hooks WHERE name = ?").get(e);return a?n(a):void 0}e.s(["cleanupHookLogs",0,function(e=1e4){return(0,t.getDbInstance)().prepare(`
    DELETE FROM middleware_logs WHERE id NOT IN (
      SELECT id FROM middleware_logs ORDER BY timestamp DESC LIMIT ?
    )
  `).run(e).changes},"createMiddlewareHook",0,function(e){let n=(0,t.getDbInstance)(),i=a(e);return i.created_at=new Date().toISOString(),i.updated_at=i.created_at,n.prepare(`
    INSERT INTO middleware_hooks (name, description, priority, scope_type, combo_id, enabled, code, created_at, updated_at, run_count, last_error)
    VALUES (@name, @description, @priority, @scope_type, @combo_id, @enabled, @code, @created_at, @updated_at, @run_count, @last_error)
  `).run(i),r(e.name)},"deleteMiddlewareHook",0,function(e){return(0,t.getDbInstance)().prepare("DELETE FROM middleware_hooks WHERE name = ?").run(e).changes>0},"getAllMiddlewareHooks",0,function(){return(0,t.getDbInstance)().prepare("SELECT * FROM middleware_hooks ORDER BY priority ASC, name ASC").all().map(n)},"getComboMiddlewareHooks",0,function(e){return(0,t.getDbInstance)().prepare("SELECT * FROM middleware_hooks WHERE enabled = 1 AND (scope_type = 'global' OR (scope_type = 'combo' AND combo_id = ?)) ORDER BY priority ASC").all(e).map(n)},"getEnabledMiddlewareHooks",0,function(){return(0,t.getDbInstance)().prepare("SELECT * FROM middleware_hooks WHERE enabled = 1 ORDER BY priority ASC").all().map(n)},"getHookLogs",0,function(e,n=50){let a=(0,t.getDbInstance)();return(e?a.prepare("SELECT * FROM middleware_logs WHERE hook_name = ? ORDER BY timestamp DESC LIMIT ?").all(e,n):a.prepare("SELECT * FROM middleware_logs ORDER BY timestamp DESC LIMIT ?").all(n)).map(e=>({id:e.id,hookName:e.hook_name,requestId:e.request_id,durationMs:e.duration_ms,mutated:1===e.mutated,skipped:1===e.skipped,error:e.error,timestamp:e.timestamp}))},"getMiddlewareHook",0,r,"insertHookLog",0,function(e){(0,t.getDbInstance)().prepare(`
    INSERT INTO middleware_logs (id, hook_name, request_id, duration_ms, mutated, skipped, error, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(e.id,e.hookName,e.requestId,e.durationMs,+!!e.mutated,+!!e.skipped,e.error||null,e.timestamp)},"recordHookExecution",0,function(e,n){let a=(0,t.getDbInstance)();n?a.prepare("UPDATE middleware_hooks SET run_count = run_count + 1, last_error = ?, updated_at = datetime('now') WHERE name = ?").run(n,e):a.prepare("UPDATE middleware_hooks SET run_count = run_count + 1, last_error = NULL, updated_at = datetime('now') WHERE name = ?").run(e)},"updateMiddlewareHook",0,function(e,n){let i=r(e);if(!i)return;let o=a({...i,...n,updatedAt:new Date().toISOString()});return(0,t.getDbInstance)().prepare(`
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
  `).run(o),r(e)}])},576992,e=>{"use strict";var t=e.i(446786),n=e.i(814747),a=e.i(1872);function r(){try{if(process.versions.bun)return(0,a.runtimeRequire)("bun:sqlite").Database;return(0,a.runtimeRequire)("better-sqlite3")}catch{return null}}function i(e=!1){return e?{readonly:!0}:{readwrite:!0,create:!0}}let o=()=>n.default.join(n.default.join(t.default.homedir(),".omp","agent"),"agent.db");e.s(["deleteOmpCredentials",0,function(e){let t=r();if(!t)return;let n=new t(o(),i());n.prepare("DELETE FROM auth_credentials WHERE provider = ?").run(e),n.close()},"getOmpCredentials",0,function(e){let t=r();if(!t)return{hasOmniRoute:!1,baseUrl:null,apiKey:null};let n=o();try{let a=new t(n,i(!0)),r=a.prepare("SELECT data FROM auth_credentials WHERE provider = ? AND credential_type = 'api_key'").get(e);if(a.close(),r?.data){let e=JSON.parse(r.data);return{hasOmniRoute:!0,baseUrl:e.baseUrl||null,apiKey:e.apiKey||null}}return{hasOmniRoute:!1,baseUrl:null,apiKey:null}}catch{return{hasOmniRoute:!1,baseUrl:null,apiKey:null}}},"saveOmpCredentials",0,function(e,t,n){let a=r();if(!a)return;let s=new a(o(),i());s.prepare("DELETE FROM auth_credentials WHERE provider = ?").run(e),s.prepare("INSERT INTO auth_credentials (provider, credential_type, data, disabled_cause, identity_key, created_at, updated_at) VALUES (?, ?, ?, NULL, NULL, ?, ?)").run(e,"api_key",JSON.stringify({apiKey:t,baseUrl:n}),Math.floor(Date.now()/1e3),Math.floor(Date.now()/1e3)),s.close()}])},291823,e=>{"use strict";var t=e.i(254799),n=e.i(899378),a=e.i(935050);function r(e){return e&&"object"==typeof e?e:{}}function i(e){let t=r(e);return{id:"string"==typeof t.id?t.id:"",name:"string"==typeof t.name?t.name:"",type:"string"==typeof t.type?t.type:"http",host:"string"==typeof t.host?t.host:"",port:Number(t.port)||0,region:"string"==typeof t.region?t.region:null,notes:"string"==typeof t.notes?t.notes:null,status:"string"==typeof t.status?t.status:"active",source:"string"==typeof t.source?t.source:"oneproxy",qualityScore:"number"==typeof t.quality_score?t.quality_score:null,latencyMs:"number"==typeof t.latency_ms?t.latency_ms:null,anonymity:"string"==typeof t.anonymity?t.anonymity:null,googleAccess:1===t.google_access||!0===t.google_access,lastValidated:"string"==typeof t.last_validated?t.last_validated:null,countryCode:"string"==typeof t.country_code?t.country_code:null,createdAt:"string"==typeof t.created_at?t.created_at:"",updatedAt:"string"==typeof t.updated_at?t.updated_at:""}}async function o(e){let t=(0,n.getDbInstance)(),a="SELECT * FROM proxy_registry WHERE source = 'oneproxy' AND status = 'active'",r=[];return e?.protocol&&(a+=" AND type = ?",r.push(e.protocol)),e?.countryCode&&(a+=" AND country_code = ?",r.push(e.countryCode)),e?.minQuality!=null&&(a+=" AND quality_score >= ?",r.push(e.minQuality)),a+=" ORDER BY quality_score DESC, last_validated DESC",e?.limit&&(a+=" LIMIT ?",r.push(e.limit)),t.prepare(a).all(...r).map(i)}async function s(){let e,t=(0,n.getDbInstance)(),a={total:Number((e=r(t.prepare(`SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        AVG(quality_score) as avg_quality,
        MAX(last_validated) as last_validated
       FROM proxy_registry WHERE source = 'oneproxy'`).get())).total)||0,active:Number(e.active)||0,avgQuality:null!==e.avg_quality&&void 0!==e.avg_quality?Math.round(100*Number(e.avg_quality))/100:null,lastValidated:"string"==typeof e.last_validated?e.last_validated:null},i=t.prepare("SELECT type as protocol, COUNT(*) as count FROM proxy_registry WHERE source = 'oneproxy' GROUP BY type ORDER BY count DESC").all(),o=t.prepare("SELECT country_code as countryCode, COUNT(*) as count FROM proxy_registry WHERE source = 'oneproxy' AND country_code IS NOT NULL GROUP BY country_code ORDER BY count DESC LIMIT 20").all();return{...a,byProtocol:i.map(e=>({protocol:String(e.protocol||"unknown"),count:Number(e.count)||0})),byCountry:o.map(e=>({countryCode:String(e.countryCode||"unknown"),count:Number(e.count)||0}))}}async function l(e){let r=(0,n.getDbInstance)(),i=new Date().toISOString(),o=`${e.protocol?.toUpperCase()||"HTTP"} - ${e.countryCode||"Unknown"} - ${e.ip}`,s=r.prepare("SELECT id FROM proxy_registry WHERE host = ? AND port = ? AND source = 'oneproxy'").get(e.ip,e.port);if(s?.id)return r.prepare(`UPDATE proxy_registry
       SET status = ?, quality_score = ?, latency_ms = ?, anonymity = ?,
           google_access = ?, last_validated = ?, country_code = ?, updated_at = ?
       WHERE id = ?`).run("active",e.qualityScore??null,e.latencyMs??null,e.anonymity??null,+!!e.googleAccess,e.lastValidated??i,e.countryCode??null,i,s.id),(0,a.backupDbFile)("pre-write"),{proxy:await u(s.id),action:"updated"};let l=(0,t.randomUUID)();return r.prepare(`INSERT INTO proxy_registry
     (id, name, type, host, port, region, notes, status, source,
      quality_score, latency_ms, anonymity, google_access, last_validated, country_code,
      created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(l,o,e.protocol||"http",e.ip,e.port,e.countryCode??null,null,"active","oneproxy",e.qualityScore??null,e.latencyMs??null,e.anonymity??null,+!!e.googleAccess,e.lastValidated??i,e.countryCode??null,i,i),(0,a.backupDbFile)("pre-write"),{proxy:await u(l),action:"created"}}async function u(e){let t=(0,n.getDbInstance)().prepare("SELECT * FROM proxy_registry WHERE id = ? AND source = 'oneproxy'").get(e);return t?i(t):null}async function c(e){let t=(0,n.getDbInstance)().prepare("DELETE FROM proxy_registry WHERE id = ? AND source = 'oneproxy'").run(e);return(0,a.backupDbFile)("pre-write"),t.changes>0}async function d(){let e=(0,n.getDbInstance)().prepare("DELETE FROM proxy_registry WHERE source = 'oneproxy'").run();return(0,a.backupDbFile)("pre-write"),e.changes}async function p(e){let t=(0,n.getDbInstance)(),a=e?.strategy||"quality",r="SELECT * FROM proxy_registry WHERE source = 'oneproxy' AND status = 'active'";switch(a){case"quality":r+=" ORDER BY quality_score DESC, latency_ms ASC LIMIT 1";break;case"random":r+=" ORDER BY RANDOM() LIMIT 1";break;case"sequential":r+=" ORDER BY last_validated ASC LIMIT 1"}let o=t.prepare(r).get();return o?i(o):null}async function _(e,t){let r=(0,n.getDbInstance)().prepare(`UPDATE proxy_registry
       SET quality_score = MAX(0, COALESCE(quality_score, 50) - 10),
           status = CASE WHEN COALESCE(quality_score, 50) <= 10 THEN 'inactive' ELSE status END,
           updated_at = datetime('now')
       WHERE host = ? AND port = ? AND source = 'oneproxy'`).run(e,t);return(0,a.backupDbFile)("pre-write"),r.changes>0}e.s(["clearAllOneproxyProxies",0,d,"deleteOneproxyProxy",0,c,"getOneproxyProxyById",0,u,"getOneproxyProxyForRotation",0,p,"getOneproxyStats",0,s,"listOneproxyProxies",0,o,"markOneproxyProxyFailed",0,_,"upsertOneproxyProxy",0,l])},13123,e=>{"use strict";var t=e.i(899378),n=e.i(666680);function a(e){let t={};try{let n=JSON.parse(e.params_json);null===n||"object"!=typeof n||Array.isArray(n)||(t=n)}catch{t={}}return{id:e.id,name:e.name,endpoint:e.endpoint,model:e.model,system:e.system,params:t,created_at:e.created_at}}function r(e){let n=(0,t.getDbInstance)().prepare("SELECT * FROM playground_presets WHERE id = ? LIMIT 1").get(e);return n?a(n):null}e.s(["createPlaygroundPreset",0,function(e){let a=(0,t.getDbInstance)(),i=(0,n.randomUUID)(),o=JSON.stringify(e.params??{}),s=e.system??null;return a.prepare("INSERT INTO playground_presets (id, name, endpoint, model, system, params_json) VALUES (?, ?, ?, ?, ?, ?)").run(i,e.name,e.endpoint,e.model,s,o),r(i)},"deletePlaygroundPreset",0,function(e){return(0,t.getDbInstance)().prepare("DELETE FROM playground_presets WHERE id = ?").run(e).changes>0},"getPlaygroundPreset",0,r,"listPlaygroundPresets",0,function(e){let n=(0,t.getDbInstance)(),r=e?.limit,i=e?.offset??0,o="SELECT * FROM playground_presets ORDER BY created_at DESC",s=[];void 0!==r&&(o+=" LIMIT ? OFFSET ?",s.push(r,i));let l=n.prepare(o).all(...s),u=n.prepare("SELECT count(*) as cnt FROM playground_presets").get();return{items:l.map(a),total:u.cnt}},"updatePlaygroundPreset",0,function(e,n){let a=(0,t.getDbInstance)(),i=r(e);if(!i)return null;let o=[],s=[];return(void 0!==n.name&&(o.push("name = ?"),s.push(n.name)),void 0!==n.endpoint&&(o.push("endpoint = ?"),s.push(n.endpoint)),void 0!==n.model&&(o.push("model = ?"),s.push(n.model)),"system"in n&&(o.push("system = ?"),s.push(n.system??null)),void 0!==n.params&&(o.push("params_json = ?"),s.push(JSON.stringify(n.params))),0===o.length)?i:(s.push(e),a.prepare(`UPDATE playground_presets SET ${o.join(", ")} WHERE id = ?`).run(...s),r(e))}])},409500,e=>{"use strict";var t=e.i(899378);function n(){return(0,t.getDbInstance)()}function a(e){let t=[];try{t=JSON.parse(e.dimensions_json)}catch{t=[]}return{connectionId:e.connection_id,provider:e.provider,dimensions:t,source:e.source}}e.s(["deletePlan",0,function(e){return n().prepare("DELETE FROM provider_plans WHERE connection_id = ?").run(e).changes>0},"getPlan",0,function(e){let t=n().prepare(`SELECT connection_id, provider, dimensions_json, source, updated_at
       FROM provider_plans WHERE connection_id = ?`).get(e);return t?a(t):null},"listPlans",0,function(){return n().prepare(`SELECT connection_id, provider, dimensions_json, source, updated_at
       FROM provider_plans ORDER BY provider ASC`).all().map(a)},"upsertPlan",0,function(e,t,a,r){let i=new Date().toISOString(),o=JSON.stringify(a);n().prepare(`INSERT INTO provider_plans (connection_id, provider, dimensions_json, source, updated_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(connection_id)
       DO UPDATE SET
         provider = excluded.provider,
         dimensions_json = excluded.dimensions_json,
         source = excluded.source,
         updated_at = excluded.updated_at`).run(e,t,o,r,i)}])},489259,e=>{"use strict";var t=e.i(899378);function n(){return(0,t.getDbInstance)()}e.s(["gcOlderThan",0,function(e){return n().prepare("DELETE FROM quota_consumption WHERE updated_at < ?").run(e).changes},"getBucket",0,function(e,t,a){let r=n().prepare(`SELECT consumed FROM quota_consumption
       WHERE api_key_id = ? AND dimension_key = ? AND bucket_index = ?`).get(e,t,a);return r?.consumed??0},"getPair",0,function(e,t,a){let r=n().prepare(`SELECT consumed FROM quota_consumption
       WHERE api_key_id = ? AND dimension_key = ? AND bucket_index = ?`).get(e,t,a),i=n().prepare(`SELECT consumed FROM quota_consumption
       WHERE api_key_id = ? AND dimension_key = ? AND bucket_index = ?`).get(e,t,a-1);return{curr:r?.consumed??0,prev:i?.consumed??0}},"incrementBucket",0,function(e,t,a,r,i){n().prepare(`INSERT INTO quota_consumption (api_key_id, dimension_key, bucket_index, consumed, updated_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(api_key_id, dimension_key, bucket_index)
       DO UPDATE SET
         consumed = consumed + excluded.consumed,
         updated_at = excluded.updated_at`).run(e,t,a,r,i)},"listConsumptionForPool",0,function(e,t){let a=Math.max(1,Math.min(t,500)),r=e.replace(/[%_\\]/g,"\\$&")+":%";return n().prepare(`SELECT api_key_id, dimension_key, bucket_index, consumed, updated_at
       FROM quota_consumption
       WHERE dimension_key LIKE ? ESCAPE '\\'
       ORDER BY updated_at DESC
       LIMIT ?`).all(r,a).map(e=>{let t=e.dimension_key.split(":"),n=t[1]??"",a=t.slice(2).join(":")??"";return{apiKeyId:e.api_key_id,dimensionKey:e.dimension_key,unit:n,window:a,bucketIndex:e.bucket_index,consumed:e.consumed,updatedAt:e.updated_at}})},"sumPoolDimension",0,function(e,t){let a=n().prepare(`SELECT COALESCE(SUM(consumed), 0) AS total
       FROM quota_consumption
       WHERE dimension_key = ? AND bucket_index = ?`).get(e,t),r=n().prepare(`SELECT COALESCE(SUM(consumed), 0) AS total
       FROM quota_consumption
       WHERE dimension_key = ? AND bucket_index = ?`).get(e,t-1);return{currTotal:a?.total??0,prevTotal:r?.total??0}}])},582109,e=>{"use strict";var t=e.i(899378),n=e.i(403122);function a(){return(0,t.getDbInstance)()}function r(e){return{id:e.id,name:e.name,createdAt:e.created_at}}e.s(["createGroup",0,function(e){let t=crypto.randomUUID(),n=new Date().toISOString();return a().prepare("INSERT INTO quota_groups (id, name, created_at) VALUES (?, ?, ?)").run(t,e,n),{id:t,name:e,createdAt:n}},"deleteGroup",0,function(e){if("group-demo"===e)throw Error("Cannot delete the protected seed group 'group-demo'. Reassign its pools to another group first.");let t=a().prepare("SELECT COUNT(*) AS cnt FROM quota_pools WHERE group_id = ?").get(e);if(t&&t.cnt>0)throw Error(`Group '${e}' has pools; reassign or delete them first.`);return a().prepare("DELETE FROM quota_groups WHERE id = ?").run(e).changes>0},"getGroup",0,function(e){let t=a().prepare("SELECT id, name, created_at FROM quota_groups WHERE id = ?").get(e);return t?r(t):null},"getGroupName",0,function(e){let t=a().prepare("SELECT name FROM quota_groups WHERE id = ?").get(e);return t?t.name:null},"listGroups",0,function(){return a().prepare("SELECT id, name, created_at FROM quota_groups ORDER BY created_at ASC").all().map(r)},"renameGroup",0,function(e,t){return a().prepare("UPDATE quota_groups SET name = ? WHERE id = ?").run(t,e).changes>0&&((0,n.invalidateModelCatalogCache)(),!0)}])},365164,e=>{"use strict";var t=e.i(899378);function n(e){return{poolId:e.pool_id,apiKeyId:e.api_key_id,model:e.model,capValue:e.cap_value,capUnit:e.cap_unit}}function a(){return(0,t.getDbInstance)()}e.s(["deleteModelCap",0,function(e,t,n){a().prepare(`DELETE FROM quota_allocation_model_caps
       WHERE pool_id = ? AND api_key_id = ? AND model = ?`).run(e,t,n)},"getModelCap",0,function(e,t,r){let i=a().prepare(`SELECT pool_id, api_key_id, model, cap_value, cap_unit
       FROM quota_allocation_model_caps
       WHERE pool_id = ? AND api_key_id = ? AND model = ?`).get(e,t,r);return i?n(i):null},"listModelCaps",0,function(e,t){return a().prepare(`SELECT pool_id, api_key_id, model, cap_value, cap_unit
       FROM quota_allocation_model_caps
       WHERE pool_id = ? AND api_key_id = ?`).all(e,t).map(n)},"setModelCap",0,function(e){a().prepare(`INSERT INTO quota_allocation_model_caps
         (pool_id, api_key_id, model, cap_value, cap_unit)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(pool_id, api_key_id, model) DO UPDATE SET
         cap_value = excluded.cap_value,
         cap_unit  = excluded.cap_unit`).run(e.poolId,e.apiKeyId,e.model,e.capValue,e.capUnit)}])},446980,e=>e.a(async(t,n)=>{try{var a=e.i(899378),r=e.i(125852),i=e.i(403122),o=t([r]);[r]=o.then?(await o)():o;let f=new Map,A=new Set;function s(e,t){let n=f.get(e),a=n?n.catch(()=>void 0).then(t):t();f.set(e,a);let r=()=>{f.get(e)===a&&f.delete(e)};return a.then(r,r),a}async function l(t){try{let{syncQuotaCombos:n}=await e.A(123492);await n(t)}catch(e){console.warn("[quota-pools] syncQuotaCombos failed (non-fatal):",e?.message)}}async function u(t){try{let{removeQuotaCombosForPool:n}=await e.A(123492);await n(t)}catch(e){console.warn("[quota-pools] removeQuotaCombosForPool failed (non-fatal):",e?.message)}}function c(){return(0,a.getDbInstance)()}function d(e){if(!e||e.length<=1)return;let t=c(),n=e.map(()=>"?").join(","),a=t.prepare(`SELECT DISTINCT provider FROM provider_connections WHERE id IN (${n})`).all(...e).map(e=>e.provider).filter(Boolean);if(new Set(a).size>1)throw Error(`A quota pool must use a single provider (got: ${[...new Set(a)].join(", ")})`)}let O=new Set(["hard","soft","burst"]);function p(e){var t;let n={apiKeyId:e.api_key_id,weight:e.weight,policy:(t=e.policy,O.has(t)?t:"hard")};return null!=e.cap_value&&(n.capValue=e.cap_value),null!=e.cap_unit&&(n.capUnit=e.cap_unit),n}function _(e,t){var n,a;let r;return{id:e.id,connectionId:e.connection_id,connectionIds:(n=e.id,a=e.connection_id,(r=c().prepare("SELECT connection_id FROM quota_pool_connections WHERE pool_id = ? ORDER BY created_at ASC").all(n)).length>0?r.map(e=>e.connection_id):a?[a]:[]),name:e.name,groupId:e.group_id||"group-demo",createdAt:e.created_at,allocations:t}}function E(e){if(0===e.length)return[];let t=e.map(e=>e.id),n=t.map(()=>"?").join(","),a=c(),r=a.prepare(`SELECT pool_id, api_key_id, weight, cap_value, cap_unit, policy FROM quota_allocations WHERE pool_id IN (${n})`).all(...t),i=new Map;for(let e of r){let t=i.get(e.pool_id);t?t.push(e):i.set(e.pool_id,[e])}let o=a.prepare(`SELECT pool_id, connection_id FROM quota_pool_connections WHERE pool_id IN (${n}) ORDER BY created_at ASC`).all(...t),s=new Map;for(let e of o){let t=s.get(e.pool_id);t?t.push(e.connection_id):s.set(e.pool_id,[e.connection_id])}return e.map(e=>({id:e.id,connectionId:e.connection_id,connectionIds:s.get(e.id)||[e.connection_id],name:e.name,groupId:e.group_id||"group-demo",createdAt:e.created_at,allocations:(i.get(e.id)||[]).map(p)}))}function y(e){return c().prepare("SELECT pool_id, api_key_id, weight, cap_value, cap_unit, policy FROM quota_allocations WHERE pool_id = ?").all(e).map(p)}function m(e){let t=e?.limit,n=e?.offset,a="SELECT id, connection_id, name, group_id, created_at FROM quota_pools ORDER BY created_at ASC",r=[];void 0!==t&&t>0&&(a+=" LIMIT ?",r.push(t),void 0!==n&&(a+=" OFFSET ?",r.push(n)));let i=c().prepare(a).all(...r),o=c().prepare("SELECT count(*) as cnt FROM quota_pools").get();return{items:E(i),total:o.cnt}}function g(e){let t=crypto.randomUUID(),n=new Date().toISOString(),a=e.connectionIds&&e.connectionIds.length>0?e.connectionIds:[e.connectionId],r=a[0];e.connectionIds&&e.connectionIds.length>1&&d(e.connectionIds);let o=e.groupId||"group-demo",u=c();u.transaction(()=>{u.prepare("INSERT INTO quota_pools (id, connection_id, name, group_id, created_at) VALUES (?, ?, ?, ?, ?)").run(t,r,e.name,o,n);let i=u.prepare("INSERT OR IGNORE INTO quota_pool_connections (pool_id, connection_id) VALUES (?, ?)");for(let e of a)i.run(t,e);if(e.allocations&&e.allocations.length>0){let n=u.prepare(`INSERT INTO quota_allocations (pool_id, api_key_id, weight, cap_value, cap_unit, policy)
         VALUES (?, ?, ?, ?, ?, ?)`);for(let a of e.allocations)n.run(t,a.apiKeyId,a.weight,a.capValue??null,a.capUnit??null,a.policy)}})();let p=_({id:t,connection_id:r,name:e.name,group_id:o,created_at:n},y(t));return s(t,()=>l(t)),(0,i.invalidateModelCatalogCache)(),p}function T(e=[]){return JSON.stringify(e.map(e=>({apiKeyId:e.apiKeyId,weight:e.weight,capValue:e.capValue??null,capUnit:e.capUnit??null,policy:e.policy})).sort((e,t)=>e.apiKeyId.localeCompare(t.apiKeyId)))}function S(e,t){if(A.has(e))return null;let n=c(),a=n.prepare("SELECT id, connection_id, name, group_id, created_at FROM quota_pools WHERE id = ?").get(e);if(!a)return null;t.connectionIds&&t.connectionIds.length>1&&d(t.connectionIds),n.transaction(()=>{if(void 0!==t.name&&(n.prepare("UPDATE quota_pools SET name = ? WHERE id = ?").run(t.name,e),a.name=t.name),void 0!==t.groupId&&(n.prepare("UPDATE quota_pools SET group_id = ? WHERE id = ?").run(t.groupId,e),a.group_id=t.groupId),void 0!==t.connectionIds&&t.connectionIds.length>0){let r=t.connectionIds[0];n.prepare("DELETE FROM quota_pool_connections WHERE pool_id = ?").run(e);let i=n.prepare("INSERT OR IGNORE INTO quota_pool_connections (pool_id, connection_id) VALUES (?, ?)");for(let n of t.connectionIds)i.run(e,n);n.prepare("UPDATE quota_pools SET connection_id = ? WHERE id = ?").run(r,e),a.connection_id=r}if(void 0!==t.allocations){n.prepare("DELETE FROM quota_allocations WHERE pool_id = ?").run(e);let a=n.prepare(`INSERT INTO quota_allocations (pool_id, api_key_id, weight, cap_value, cap_unit, policy)
         VALUES (?, ?, ?, ?, ?, ?)`);for(let n of t.allocations)a.run(e,n.apiKeyId,n.weight,n.capValue??null,n.capUnit??null,n.policy)}})();let r=_(a,y(e));return s(e,()=>l(e)),(0,i.invalidateModelCatalogCache)(),r}async function R(e){if(A.has(e)||!c().prepare("SELECT id FROM quota_pools WHERE id = ?").get(e))return!1;A.add(e);let t=s(e,async()=>{await u(e);let t=c();return!(t.transaction(()=>(t.prepare("DELETE FROM quota_pool_connections WHERE pool_id = ?").run(e),t.prepare(`UPDATE api_keys SET allowed_quotas = COALESCE(
         (SELECT json_group_array(value) FROM json_each(api_keys.allowed_quotas) WHERE value != ?),
         '[]')
       WHERE allowed_quotas IS NOT NULL AND allowed_quotas != '[]'
         AND EXISTS (SELECT 1 FROM json_each(api_keys.allowed_quotas) WHERE value = ?)`).run(e,e),t.prepare("DELETE FROM quota_pools WHERE id = ?").run(e)))().changes<=0)&&((0,r.clearApiKeyCaches)(),(0,i.invalidateModelCatalogCache)(),!0)}),n=()=>A.delete(e);return t.then(n,n),t}e.s(["createPool",0,g,"deletePool",0,R,"ensurePool",0,function(e){let t=e.connectionIds&&e.connectionIds.length>0?e.connectionIds:[e.connectionId],n=e.groupId||"group-demo",a=m().items.find(t=>t.name===e.name&&t.groupId===n);if(!a)return{pool:g(e),created:!0,updated:!1};let r=void 0!==e.allocations&&T(a.allocations)!==T(e.allocations),i=a.connectionIds.length!==t.length||a.connectionIds.some(e=>!t.includes(e));if(!r&&!i)return{pool:a,created:!1,updated:!1};let o={connectionIds:t};void 0!==e.allocations&&(o.allocations=e.allocations),void 0!==e.groupId&&(o.groupId=e.groupId);let s=S(a.id,o);if(!s)throw Error(`Quota pool disappeared during ensure: ${a.id}`);return{pool:s,created:!1,updated:!0}},"getPool",0,function(e){let t=c().prepare("SELECT id, connection_id, name, group_id, created_at FROM quota_pools WHERE id = ?").get(e);return t?E([t])[0]:null},"getPoolsByGroup",0,function(e,t,n){let a="SELECT id, connection_id, name, group_id, created_at FROM quota_pools WHERE group_id = ? ORDER BY created_at ASC",r=[e];void 0!==t&&t>0&&(a+=" LIMIT ?",r.push(t),void 0!==n&&(a+=" OFFSET ?",r.push(n)));let i=c().prepare(a).all(...r);return E(i)},"listAllocationsForApiKey",0,function(e){return c().prepare(`SELECT pool_id, api_key_id, weight, cap_value, cap_unit, policy
       FROM quota_allocations
       WHERE api_key_id = ?`).all(e).map(e=>({poolId:e.pool_id,allocation:p(e)}))},"listPools",0,m,"updatePool",0,S,"upsertAllocations",0,function(e,t){if(A.has(e))return;let n=c(),a=t.reduce((e,t)=>e+(Number.isFinite(t.weight)?t.weight:0),0),r=0===a&&t.length>0?t.map(e=>({...e,weight:100/t.length})):t,i=n.prepare("SELECT id, connection_id, name, group_id, created_at FROM quota_pools WHERE id = ?").get(e),o=[e];if(i?.group_id){let e=n.prepare("SELECT id FROM quota_pools WHERE group_id = ?").all(i.group_id);e.length>0&&(o=e.map(e=>e.id))}n.transaction(()=>{let e=n.prepare(`INSERT INTO quota_allocations (pool_id, api_key_id, weight, cap_value, cap_unit, policy)
       VALUES (?, ?, ?, ?, ?, ?)`);for(let t of o)for(let a of(n.prepare("DELETE FROM quota_allocations WHERE pool_id = ?").run(t),r))e.run(t,a.apiKeyId,a.weight,a.capValue??null,a.capUnit??null,a.policy)})(),s(e,()=>l(e))}]),n()}catch(e){n(e)}},!1),583281,e=>{"use strict";var t=e.i(254799),n=e.i(689960),a=e.i(899378),r=e.i(529646);function i(){return new Date().toISOString().slice(0,10)}function o(){return new Date().toISOString().slice(0,13)}function s(e){return e&&"string"==typeof e?(0,t.createHash)("sha256").update(e).digest("hex"):""}function l(e,t,n,a){let r=i(),s=o();e.prepare(`
    UPDATE ${t}
    SET daily_issued = CASE WHEN last_reset_day <> ? THEN 0 ELSE daily_issued END,
        hourly_issued = CASE WHEN last_reset_hour <> ? THEN 0 ELSE hourly_issued END,
        last_reset_day = ?,
        last_reset_hour = ?
    WHERE ${n} = ?
  `).run(r,s,r,s,a)}e.s(["checkQuota",0,function(e="",t=""){let n=(0,a.getDbInstance)();if(i(),o(),e){l(n,"provider_key_limits","provider",e);let t=n.prepare("SELECT * FROM provider_key_limits WHERE provider = ?").get(e);if(t){if(null!==t.hourly_issue_limit&&t.hourly_issued>=t.hourly_issue_limit)return{allowed:!1,errorCode:"PROVIDER_QUOTA_EXCEEDED",errorMessage:`Hourly issue limit (${t.hourly_issue_limit}) reached for provider '${e}'`,provider:e};if(null!==t.daily_issue_limit&&t.daily_issued>=t.daily_issue_limit)return{allowed:!1,errorCode:"PROVIDER_QUOTA_EXCEEDED",errorMessage:`Daily issue limit (${t.daily_issue_limit}) reached for provider '${e}'`,provider:e};if(null!==t.max_active_keys){let{activeCount:a}=n.prepare("SELECT COUNT(*) as activeCount FROM registered_keys WHERE provider = ? AND is_active = 1").get(e);if(a>=t.max_active_keys)return{allowed:!1,errorCode:"MAX_ACTIVE_KEYS_EXCEEDED",errorMessage:`Max active keys (${t.max_active_keys}) reached for provider '${e}'`,provider:e,providerActiveKeys:a}}}}if(t){l(n,"account_key_limits","account_id",t);let e=n.prepare("SELECT * FROM account_key_limits WHERE account_id = ?").get(t);if(e){if(null!==e.hourly_issue_limit&&e.hourly_issued>=e.hourly_issue_limit)return{allowed:!1,errorCode:"ACCOUNT_QUOTA_EXCEEDED",errorMessage:`Hourly issue limit (${e.hourly_issue_limit}) reached for account '${t}'`,accountId:t};if(null!==e.daily_issue_limit&&e.daily_issued>=e.daily_issue_limit)return{allowed:!1,errorCode:"ACCOUNT_QUOTA_EXCEEDED",errorMessage:`Daily issue limit (${e.daily_issue_limit}) reached for account '${t}'`,accountId:t};if(null!==e.max_active_keys){let{activeCount:a}=n.prepare("SELECT COUNT(*) as activeCount FROM registered_keys WHERE account_id = ? AND is_active = 1").get(t);if(a>=e.max_active_keys)return{allowed:!1,errorCode:"MAX_ACTIVE_KEYS_EXCEEDED",errorMessage:`Max active keys (${e.max_active_keys}) reached for account '${t}'`,accountId:t,accountActiveKeys:a}}}}return{allowed:!0}},"getAccountKeyLimit",0,function(e){let t=(0,a.getDbInstance)().prepare("SELECT * FROM account_key_limits WHERE account_id = ?").get(e);return t?(0,r.rowToCamel)(t):null},"getProviderKeyLimit",0,function(e){let t=(0,a.getDbInstance)().prepare("SELECT * FROM provider_key_limits WHERE provider = ?").get(e);return t?(0,r.rowToCamel)(t):null},"getRegisteredKey",0,function(e){let t=(0,a.getDbInstance)().prepare("SELECT * FROM registered_keys WHERE id = ?").get(e);return t?(0,r.rowToCamel)(t):null},"incrementRegisteredKeyUsage",0,function(e){(0,a.getDbInstance)().prepare(`
    UPDATE registered_keys
    SET daily_used = daily_used + 1, hourly_used = hourly_used + 1, updated_at = datetime('now')
    WHERE id = ?
  `).run(e)},"issueRegisteredKey",0,function(e){let u=(0,a.getDbInstance)(),{name:c,provider:d="",accountId:p="",idempotencyKey:_,expiresAt:E,dailyBudget:y,hourlyBudget:m}=e;if(_){let e=u.prepare("SELECT * FROM registered_keys WHERE idempotency_key = ?").get(_);if(e)return{idempotencyConflict:!0,existing:(0,r.rowToCamel)(e)}}let g="ork_"+(0,t.randomBytes)(24).toString("base64url"),T=(0,n.v4)(),S=s(g),R=g.slice(0,12);u.prepare(`
    INSERT INTO registered_keys
      (id, key, key_prefix, name, provider, account_id, idempotency_key, expires_at, daily_budget, hourly_budget, last_reset_day, last_reset_hour)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(T,S,R,c,d,p,_??null,E??null,y??null,m??null,i(),o()),d&&(l(u,"provider_key_limits","provider",d),u.prepare(`
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
    `).run(p,i(),o()));let f=u.prepare("SELECT * FROM registered_keys WHERE id = ?").get(T);return{...(0,r.rowToCamel)(f),rawKey:g}},"listRegisteredKeys",0,function(e={}){let t=(0,a.getDbInstance)(),n="SELECT * FROM registered_keys WHERE 1=1",i=[];return e.provider&&(n+=" AND provider = ?",i.push(e.provider)),e.accountId&&(n+=" AND account_id = ?",i.push(e.accountId)),n+=" ORDER BY created_at DESC LIMIT 500",t.prepare(n).all(...i).map(e=>(0,r.rowToCamel)(e))},"revokeRegisteredKey",0,function(e){return(0,a.getDbInstance)().prepare(`
    UPDATE registered_keys
    SET is_active = 0, revoked_at = datetime('now'), updated_at = datetime('now')
    WHERE id = ? AND is_active = 1
  `).run(e).changes>0},"setAccountKeyLimit",0,function(e,t){(0,a.getDbInstance)().prepare(`
    INSERT INTO account_key_limits (account_id, max_active_keys, daily_issue_limit, hourly_issue_limit, last_reset_day, last_reset_hour)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(account_id) DO UPDATE SET
      max_active_keys = excluded.max_active_keys,
      daily_issue_limit = excluded.daily_issue_limit,
      hourly_issue_limit = excluded.hourly_issue_limit,
      updated_at = datetime('now')
  `).run(e,t.maxActiveKeys??null,t.dailyIssueLimit??null,t.hourlyIssueLimit??null,i(),o())},"setProviderKeyLimit",0,function(e,t){(0,a.getDbInstance)().prepare(`
    INSERT INTO provider_key_limits (provider, max_active_keys, daily_issue_limit, hourly_issue_limit, last_reset_day, last_reset_hour)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(provider) DO UPDATE SET
      max_active_keys = excluded.max_active_keys,
      daily_issue_limit = excluded.daily_issue_limit,
      hourly_issue_limit = excluded.hourly_issue_limit,
      updated_at = datetime('now')
  `).run(e,t.maxActiveKeys??null,t.dailyIssueLimit??null,t.hourlyIssueLimit??null,i(),o())},"validateRegisteredKey",0,function(e){let t=(0,a.getDbInstance)(),n=s(e),l=t.prepare(`
    SELECT * FROM registered_keys
    WHERE key = ? AND is_active = 1
      AND (expires_at IS NULL OR expires_at > datetime('now'))
  `).get(n);if(!l)return null;let u=i(),c=o();if(l.last_reset_day!==u||l.last_reset_hour!==c){let e=l.last_reset_day!==u,n=l.last_reset_hour!==c;t.prepare(`
      UPDATE registered_keys
      SET daily_used = CASE WHEN last_reset_day <> ? THEN 0 ELSE daily_used END,
          hourly_used = CASE WHEN last_reset_hour <> ? THEN 0 ELSE hourly_used END,
          last_reset_day = ?, last_reset_hour = ?
      WHERE id = ?
    `).run(u,c,u,c,l.id),e&&(l.daily_used=0),n&&(l.hourly_used=0),l.last_reset_day=u,l.last_reset_hour=c}return null!==l.daily_budget&&l.daily_used>=l.daily_budget||null!==l.hourly_budget&&l.hourly_used>=l.hourly_budget?null:(0,r.rowToCamel)(l)}])},711109,e=>{"use strict";var t=e.i(899378),n=e.i(757239);e.s(["resolvePreviousResponseState",0,function(e,a){var r;if(!e)return null;let i=(0,t.getDbInstance)().prepare(`SELECT artifact_relpath, api_key_id FROM call_logs
       WHERE response_id = ? AND detail_state = 'ready'
       ORDER BY timestamp DESC LIMIT 1`).get(e);if(!i||!i.artifact_relpath||!a||i.api_key_id!==a)return null;let{artifact:o,state:s}=(0,n.readCallArtifact)(i.artifact_relpath);if("ready"!==s||!o?.pipeline)return null;let l=o.pipeline.providerRequest,u=o.pipeline.clientResponse,c="object"!=typeof(r=l?.body)||null===r||Array.isArray(r)?void 0:l.body.input,d=u?.output;return Array.isArray(c)&&Array.isArray(d)?{input:c,output:d}:null}])},631716,e=>{"use strict";var t=e.i(899378);let n=["created_at","expires_at","hit_count","tokens_saved","model"];e.s(["deleteSemanticCacheByModel",0,function(e){return{deleted:(0,t.getDbInstance)().prepare("DELETE FROM semantic_cache WHERE model = ?").run(e).changes}},"deleteSemanticCacheBySignature",0,function(e){return(0,t.getDbInstance)().prepare("DELETE FROM semantic_cache WHERE signature = ?").run(e),{deleted:1}},"listSemanticCacheEntries",0,function(e){let a=(0,t.getDbInstance)(),{page:r,limit:i,search:o,model:s,sortBy:l,sortOrder:u}=e,c=[],d=[];o&&(c.push("(signature LIKE ? OR model LIKE ?)"),d.push(`%${o}%`,`%${o}%`)),s&&(c.push("model = ?"),d.push(s));let p=c.length>0?`WHERE ${c.join(" AND ")}`:"",_=n.includes(l)?l:"created_at",E=a.prepare(`SELECT COUNT(*) as total FROM semantic_cache ${p}`).get(...d);return{entries:a.prepare(`SELECT id, signature, model, hit_count, tokens_saved, created_at, expires_at
       FROM semantic_cache ${p}
       ORDER BY ${_} ${"asc"===u?"ASC":"DESC"}
       LIMIT ? OFFSET ?`).all(...d,i,(r-1)*i),total:E?.total||0}}])},130273,e=>{"use strict";var t=e.i(254799),n=e.i(899378);let a="session_account_affinity",r=null;function i(e){return Number.isFinite(e)&&Number(e)>0?Number(e):0}function o(e,n){let a=(0,t.createHash)("sha256").update(`${n}:${e}`).digest("hex");return`${n}:${a}`}function s(e){return new Date(e).toISOString()}function l(e){if("string"!=typeof e)return null;try{let t=JSON.parse(e);if("string"!=typeof t.connectionId||0===t.connectionId.trim().length||"string"!=typeof t.expiresAt||Number.isNaN(Date.parse(t.expiresAt)))return null;return{connectionId:t.connectionId,createdAt:"string"!=typeof t.createdAt||Number.isNaN(Date.parse(t.createdAt))?t.expiresAt:t.createdAt,lastUsedAt:"string"!=typeof t.lastUsedAt||Number.isNaN(Date.parse(t.lastUsedAt))?t.expiresAt:t.lastUsedAt,expiresAt:t.expiresAt}}catch{return null}}function u(e){(0,n.getDbInstance)().prepare("DELETE FROM key_value WHERE namespace = ? AND key = ?").run(a,e)}function c(e,t,r=0,s=Date.now()){if(!e||!t||0>=i(r))return null;let d=o(e,t),p=(0,n.getDbInstance)().prepare("SELECT value FROM key_value WHERE namespace = ? AND key = ?").get(a,d),_=l(p?.value);return _?Date.parse(_.expiresAt)<=s?(u(d),null):_:null}function d(e,t,r,l=Date.now(),u=0){let p=i(u);if(!e||!t||!r||p<=0)return;let _=o(e,t),E=c(e,t,p,l),y=s(l),m={connectionId:r,createdAt:E?.createdAt??y,lastUsedAt:y,expiresAt:s(l+p)};(0,n.getDbInstance)().prepare("INSERT OR REPLACE INTO key_value (namespace, key, value) VALUES (?, ?, ?)").run(a,_,JSON.stringify(m))}function p(e=18e5,t=Date.now()){let r=(0,n.getDbInstance)(),i=r.prepare("SELECT key, value FROM key_value WHERE namespace = ?").all(a),o=0;return r.transaction(()=>{for(let e of i){if("string"!=typeof e.key)continue;let n=l(e.value);(!n||Date.parse(n.expiresAt)<=t)&&(r.prepare("DELETE FROM key_value WHERE namespace = ? AND key = ?").run(a,e.key),o++)}})(),o}e.s(["cleanupStaleSessionAccountAffinities",0,p,"deleteSessionAccountAffinity",0,function(e,t){e&&t&&u(o(e,t))},"evictSessionAccountAffinityForConnection",0,function(e,t,r){if(!e||!t||!r)return!1;let i=o(e,t),s=(0,n.getDbInstance)().prepare("SELECT value FROM key_value WHERE namespace = ? AND key = ?").get(a,i),c=l(s?.value);return!!c&&c.connectionId===r&&(u(i),!0)},"getSessionAccountAffinity",0,c,"startSessionAccountAffinityCleanup",0,function(){if(!r){try{p()}catch(e){console.warn("[SESSION_AFFINITY] Startup cleanup failed:",e)}"object"==typeof(r=setInterval(()=>{try{p()}catch(e){console.warn("[SESSION_AFFINITY] Periodic cleanup failed:",e)}},3e5))&&"unref"in r&&r.unref?.()}},"stopSessionAccountAffinityCleanupForTests",0,function(){r&&(clearInterval(r),r=null)},"touchSessionAccountAffinity",0,function(e,t,n=Date.now(),a=0){let r=i(a);if(r<=0)return;let o=c(e,t,r,n);o&&d(e,t,o.connectionId,n,r)},"upsertSessionAccountAffinity",0,d])},964183,e=>{"use strict";var t=e.i(899378);let n=new Set(["enabled","mode","updated_at"]);e.s(["updateSkill",0,function(e,a){let r=(0,t.getDbInstance)(),i=[],o=[];for(let[e,t]of Object.entries(a))n.has(e)&&(i.push(`${e} = ?`),o.push(t));return 0===i.length?0:(i.push("updated_at = datetime('now')"),o.push(e),r.prepare(`UPDATE skills SET ${i.join(", ")} WHERE id = ?`).run(...o).changes)}])},559339,e=>{"use strict";var t=e.i(689960),n=e.i(899378),a=e.i(529646),r=e.i(935050);function i(e){var t;let n=(t=(0,a.rowToCamel)(e))&&"object"==typeof t&&!Array.isArray(t)?t:{};return"string"!=typeof n.id||"string"!=typeof n.name?null:{id:n.id,name:n.name,tokenHash:"string"==typeof n.tokenHash?n.tokenHash:"",syncApiKeyId:"string"==typeof n.syncApiKeyId?n.syncApiKeyId:null,revokedAt:"string"==typeof n.revokedAt?n.revokedAt:null,lastUsedAt:"string"==typeof n.lastUsedAt?n.lastUsedAt:null,createdAt:"string"==typeof n.createdAt?n.createdAt:new Date().toISOString(),updatedAt:"string"==typeof n.updatedAt?n.updatedAt:new Date().toISOString()}}function o(e){e.exec(`
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
  `)}async function s(){let e=(0,n.getDbInstance)();return o(e),e.prepare("SELECT * FROM sync_tokens ORDER BY datetime(created_at) DESC, name COLLATE NOCASE ASC").all().map(e=>i(e)).filter(e=>null!==e)}async function l(e){let t=(0,n.getDbInstance)();return o(t),i(t.prepare("SELECT * FROM sync_tokens WHERE id = ?").get(e))}async function u(e){let t=(0,n.getDbInstance)();return o(t),i(t.prepare("SELECT * FROM sync_tokens WHERE token_hash = ?").get(e))}async function c(e){let a=(0,n.getDbInstance)();o(a);let i=new Date().toISOString(),s={id:(0,t.v4)(),name:e.name,tokenHash:e.tokenHash,syncApiKeyId:e.syncApiKeyId||null,revokedAt:null,lastUsedAt:null,createdAt:i,updatedAt:i};return a.prepare(`INSERT INTO sync_tokens (
      id, name, token_hash, sync_api_key_id, revoked_at, last_used_at, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(s.id,s.name,s.tokenHash,s.syncApiKeyId,s.revokedAt,s.lastUsedAt,s.createdAt,s.updatedAt),(0,r.backupDbFile)("pre-write"),s}async function d(e){let t=(0,n.getDbInstance)();o(t);let a=await l(e);if(!a)return null;if(a.revokedAt)return a;let i=new Date().toISOString();return t.prepare("UPDATE sync_tokens SET revoked_at = ?, updated_at = ? WHERE id = ?").run(i,i,e),(0,r.backupDbFile)("pre-write"),await l(e)}async function p(e,t=new Date().toISOString()){let a=(0,n.getDbInstance)();return o(a),Number(a.prepare("UPDATE sync_tokens SET last_used_at = ?, updated_at = ? WHERE id = ?").run(t,t,e).changes||0)>0}e.s(["createSyncTokenRecord",0,c,"getSyncTokenByHash",0,u,"getSyncTokenById",0,l,"listSyncTokens",0,s,"revokeSyncToken",0,d,"touchSyncTokenLastUsed",0,p])},95825,e=>{"use strict";var t=e.i(254799),n=e.i(899378),a=e.i(362225);let r=!1;function i(e){return e&&"object"==typeof e&&!Array.isArray(e)?e:{}}function o(e,t=0){if("number"==typeof e&&Number.isFinite(e))return e;if("string"==typeof e&&e.trim().length>0){let n=Number(e);return Number.isFinite(n)?n:t}return t}function s(e){return"model"===e||"provider"===e||"global"===e?e:"global"}function l(e){return"daily"===e||"weekly"===e||"monthly"===e?e:"monthly"}function u(){r||((0,n.getDbInstance)().exec(`
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
  `),r=!0)}function c(e){let t=i(e);return{id:"string"==typeof t.id?t.id:"",apiKeyId:"string"==typeof t.api_key_id?t.api_key_id:"",scopeType:s(t.scope_type),scopeValue:"string"==typeof t.scope_value?t.scope_value:"",tokenLimit:o(t.token_limit),resetInterval:l(t.reset_interval),resetTime:"string"==typeof t.reset_time&&t.reset_time?t.reset_time:"00:00",enabled:0!==o(t.enabled,1),createdAt:"string"==typeof t.created_at?t.created_at:"",updatedAt:"string"==typeof t.updated_at?t.updated_at:""}}function d(e,t=Date.now()){let n=(0,a.getBudgetWindow)(e.resetInterval,e.resetTime,t);return{windowStart:String(n.periodStartAt),didReset:!1,periodStartAt:n.periodStartAt,nextResetAt:n.nextResetAt}}e.s(["deleteTokenLimit",0,function(e){u();let t=(0,n.getDbInstance)();return t.prepare("DELETE FROM api_key_token_counters WHERE limit_id = ?").run(e),t.prepare("DELETE FROM api_key_token_limit_reset_logs WHERE limit_id = ?").run(e),t.prepare("DELETE FROM api_key_token_limits WHERE id = ?").run(e).changes>0},"getTokenLimitsForRequest",0,function(e,t,a){return u(),(0,n.getDbInstance)().prepare(`SELECT * FROM api_key_token_limits
       WHERE api_key_id = @apiKeyId
         AND enabled = 1
         AND (
           (scope_type = 'global')
           OR (scope_type = 'model' AND scope_value = @model)
           OR (scope_type = 'provider' AND scope_value = @provider)
         )`).all({apiKeyId:e,model:a||"",provider:t||""}).map(c)},"getWindowUsage",0,function(e,t=Date.now()){u();let a=(0,n.getDbInstance)(),{windowStart:r}=d(e,t);return o(i(a.prepare("SELECT tokens_used FROM api_key_token_counters WHERE limit_id = ? AND window_start = ?").get(e.id,r)).tokens_used)},"incrementWindowTokens",0,function(e,t,a){u();let r=(0,n.getDbInstance)(),s=Math.max(0,Math.floor(o(a)));return o(i(r.prepare(`INSERT INTO api_key_token_counters (limit_id, window_start, tokens_used, updated_at)
       VALUES (@limitId, @windowStart, @tokens, datetime('now'))
       ON CONFLICT(limit_id, window_start)
       DO UPDATE SET tokens_used = tokens_used + excluded.tokens_used,
                     updated_at  = datetime('now')
       RETURNING tokens_used`).get({limitId:e,windowStart:t,tokens:s})).tokens_used)},"listTokenLimits",0,function(e){return u(),(0,n.getDbInstance)().prepare(`SELECT * FROM api_key_token_limits
       WHERE api_key_id = ?
       ORDER BY CASE scope_type WHEN 'model' THEN 0 WHEN 'provider' THEN 1 ELSE 2 END, scope_value`).all(e).map(c)},"logTokenLimitReset",0,function(e,t,a){u(),(0,n.getDbInstance)().prepare(`INSERT INTO api_key_token_limit_reset_logs (limit_id, reset_at, prev_tokens, window_start)
     VALUES (?, datetime('now'), ?, ?)`).run(e,Math.max(0,Math.floor(o(t))),a)},"resetWindowIfElapsed",0,d,"upsertTokenLimit",0,function(e){u();let a=(0,n.getDbInstance)(),r=s(e.scopeType),i="global"===r?"":(e.scopeValue??"").trim(),d=l(e.resetInterval),p="string"==typeof e.resetTime&&e.resetTime?e.resetTime:"00:00",_=+(!1!==e.enabled),E=Math.floor(o(e.tokenLimit)),y=e.id&&e.id.trim()?e.id.trim():(0,t.randomUUID)();return a.prepare(`INSERT INTO api_key_token_limits
       (id, api_key_id, scope_type, scope_value, token_limit, reset_interval, reset_time, enabled, created_at, updated_at)
     VALUES (@id, @apiKeyId, @scopeType, @scopeValue, @tokenLimit, @resetInterval, @resetTime, @enabled, datetime('now'), datetime('now'))
     ON CONFLICT(api_key_id, scope_type, scope_value)
     DO UPDATE SET token_limit    = excluded.token_limit,
                   reset_interval = excluded.reset_interval,
                   reset_time     = excluded.reset_time,
                   enabled        = excluded.enabled,
                   updated_at     = datetime('now')`).run({id:y,apiKeyId:e.apiKeyId,scopeType:r,scopeValue:i,tokenLimit:E,resetInterval:d,resetTime:p,enabled:_}),c(a.prepare("SELECT * FROM api_key_token_limits WHERE api_key_id = ? AND scope_type = ? AND scope_value = ?").get(e.apiKeyId,r,i))}])},126603,e=>{"use strict";var t=e.i(899378);e.s(["getAccountCostRows",0,function(e,n){return(0,t.getDbInstance)().prepare(`
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
    `).all(n)},"getProviderDailyUsageRows",0,function(e,n){return(0,t.getDbInstance)().prepare(`
      SELECT
        DATE(timestamp) as date,
        LOWER(provider) as provider,
        COUNT(*) as requests,
        COALESCE(SUM(tokens_input), 0) as promptTokens,
        COALESCE(SUM(tokens_output), 0) as completionTokens,
        COALESCE(SUM(tokens_input + tokens_output), 0) as totalTokens
      FROM ${e} AS _u
      GROUP BY DATE(timestamp), LOWER(provider)
      ORDER BY date DESC, requests DESC
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
    `).all(n)}])},702826,e=>{"use strict";var t=e.i(899378);e.s(["getAutoRoutingTopProviders",0,function(){return(0,t.getDbInstance)().prepare(`
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
    `).all()}])},245272,e=>e.a(async(t,n)=>{try{var a=e.i(748648),r=e.i(186920);e.i(151205),e.i(568730),e.i(894278),e.i(926028),e.i(747369),e.i(422359),e.i(315963),e.i(711109);var i=e.i(125852);e.i(926554);var o=e.i(238521);e.i(167213),e.i(404585),e.i(33770),e.i(751183),e.i(935050),e.i(964183),e.i(403122),e.i(583281),e.i(68392),e.i(521215),e.i(226420),e.i(554730),e.i(362360),e.i(879032),e.i(446908),e.i(783414),e.i(517551),e.i(130273),e.i(188693),e.i(13985),e.i(559339),e.i(790883),e.i(829422),e.i(870766),e.i(983427),e.i(306860),e.i(291823),e.i(850803),e.i(605845),e.i(403098),e.i(992088),e.i(323681),e.i(795769),e.i(54572),e.i(13123),e.i(524630),e.i(343379),e.i(51829),e.i(775957),e.i(682815);var s=e.i(519854);e.i(576992);var l=e.i(446980);e.i(365164),e.i(582109),e.i(489259),e.i(409500),e.i(95825),e.i(131470),e.i(224136),e.i(90886),e.i(441273),e.i(469960),e.i(496425),e.i(126603),e.i(702826),e.i(631716),e.i(683844),e.i(575869),e.i(845042),e.i(948055),e.i(546217),e.i(539979),e.i(984844),e.i(953692),e.i(71251);var u=t([a,r,i,o,s,l]);[a,r,i,o,s,l]=u.then?(await u)():u,e.s([]),n()}catch(e){n(e)}},!1)];

//# sourceMappingURL=src_lib_12rfjeq._.js.map