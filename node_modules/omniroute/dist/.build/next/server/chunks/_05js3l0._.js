module.exports=[769494,e=>e.a(async(t,n)=>{try{var i=e.i(899378),o=e.i(245272),r=e.i(95825),l=t([o]);[o]=l.then?(await l)():l;let s=new Map;function a(e,t=Date.now()){let n,{periodStartAt:o}=(0,r.resetWindowIfElapsed)(e,t),l=new Date(o).toISOString(),s=(0,i.getDbInstance)(),u=`COALESCE(SUM(
      COALESCE(tokens_input, 0) + COALESCE(tokens_output, 0)
      + COALESCE(tokens_reasoning, 0)
    ), 0) AS total`,d=(n="model"===e.scopeType?s.prepare(`SELECT ${u} FROM usage_history
         WHERE api_key_id = ? AND model = ? AND timestamp >= ?`).get(e.apiKeyId,e.scopeValue,l):"provider"===e.scopeType?s.prepare(`SELECT ${u} FROM usage_history
         WHERE api_key_id = ? AND provider = ? AND timestamp >= ?`).get(e.apiKeyId,e.scopeValue,l):s.prepare(`SELECT ${u} FROM usage_history
         WHERE api_key_id = ? AND timestamp >= ?`).get(e.apiKeyId,l))&&"object"==typeof n?n.total:0,c="number"==typeof d?d:Number(d);return Number.isFinite(c)&&c>0?Math.floor(c):0}e.s(["checkTokenLimits",0,function(e,t="",n="",i=Date.now()){if(!e)return null;let o=(0,r.getTokenLimitsForRequest)(e,t,n);if(!o||0===o.length)return null;let l=null;for(let e of o){if(!1===e.enabled)continue;let t=e.tokenLimit;if(!Number.isFinite(t)||t<=0)continue;let n=function(e,t=Date.now(),n=!1){let{windowStart:i}=(0,r.resetWindowIfElapsed)(e,t),o=s.get(e.id);if(!n&&o&&o.windowStart===i&&t-o.syncedAt<5e3)return o.tokensUsed;let l=(0,r.getWindowUsage)(e,t);if(0===l&&(!o||o.windowStart!==i)){let n=a(e,t);n>0&&(l=(0,r.incrementWindowTokens)(e.id,i,n))}return s.set(e.id,{windowStart:i,tokensUsed:l,syncedAt:t}),l}(e,i,!0);if(n<t)continue;let{windowStart:o,nextResetAt:u}=(0,r.resetWindowIfElapsed)(e,i),d=Math.max(0,t-n),c={limitId:e.id,scopeType:e.scopeType,scopeValue:e.scopeValue,limitValue:t,tokensUsed:n,remaining:d,windowStart:o,nextResetAt:u};(null===l||c.remaining<l.remaining||c.remaining===l.remaining&&c.limitValue<l.limitValue)&&(l=c)}return l},"recordTokenUsage",0,function(e,t,n,o){if(!e)return;let l=Number.isFinite(o)&&o>0?Math.floor(o):0;l<=0||Promise.resolve().then(()=>{let o=Date.now(),u=(0,r.getTokenLimitsForRequest)(e,t||"",n||"");if(!u||0===u.length)return;let d=(0,i.getDbInstance)(),c=[],f=d.transaction(()=>{for(let e of u){if(!1===e.enabled)continue;let{windowStart:t}=(0,r.resetWindowIfElapsed)(e,o);if(!d.prepare("SELECT tokens_used FROM api_key_token_counters WHERE limit_id = ? AND window_start = ?").get(e.id,t)){let n=d.prepare(`SELECT window_start, tokens_used FROM api_key_token_counters
                 WHERE limit_id = ? AND window_start < ?
                 ORDER BY window_start DESC LIMIT 1`).get(e.id,t),i=n&&"number"==typeof n.tokens_used?n.tokens_used:0;i>0&&(0,r.logTokenLimitReset)(e.id,i,t);let l=a(e,o);l>0&&(0,r.incrementWindowTokens)(e.id,t,l)}let n=(0,r.incrementWindowTokens)(e.id,t,l);c.push({limitId:e.id,windowStart:t,total:n})}});try{for(let e of(f(),c)){var w,p,m;w=e.limitId,p=e.windowStart,m=e.total,s.set(w,{windowStart:p,tokensUsed:m,syncedAt:Date.now()})}}catch(e){if(d.inTransaction)try{d.exec("ROLLBACK")}catch{}}}).catch(()=>{})}]),n()}catch(e){n(e)}},!1),43433,e=>{"use strict";var t=e.i(889771),n=e.i(719201);e.s(["isAllRateLimitedCredentials",0,function(e){return!!e&&"object"==typeof e&&!0===e.allRateLimited},"rateLimitedProviderResponse",0,function(e,i){return(0,n.unavailableResponse)(t.HTTP_STATUS.RATE_LIMITED,`[${e}] All accounts rate limited`,i.retryAfter,i.retryAfterHuman)}])},283439,e=>e.a(async(t,n)=>{try{var i=e.i(446980),o=e.i(245272),r=e.i(403122),l=e.i(125852),a=e.i(283834),s=e.i(582109),u=t([i,o,l]);async function d(e){if(!e||0===e.length)return{connectionIds:[],providers:[],poolSlugs:[]};let t=new Set,n=new Set,o=new Set,l=new Set;for(let t of e){let e=(0,i.getPool)(t);e&&l.add(e.groupId)}for(let e of l){let l=(0,i.getPoolsByGroup)(e),u=!1;for(let e of l)for(let i of Array.isArray(e.connectionIds)&&e.connectionIds.length>0?e.connectionIds:[e.connectionId]){let e=await (0,r.getCachedProviderConnectionById)(i);if(!e)continue;let o=e.provider;"string"==typeof o&&0!==o.length&&(t.add(i),n.add(o),u=!0)}if(u){let t=(0,s.getGroupName)(e)??e;o.add((0,a.quotaGroupSlug)(t))}}return{connectionIds:Array.from(t),providers:Array.from(n),poolSlugs:Array.from(o)}}async function c(e,t,n,i){for(let o of new Set([...t,...n]))try{let t,r=await (0,l.getApiKeyById)(o);if(!r)continue;let a=Array.isArray(r.allowedQuotas)?r.allowedQuotas:[];if(i&&n.includes(o)){if(a.includes(e))continue;t=[...a,e]}else{if(!a.includes(e))continue;t=a.filter(t=>t!==e)}await (0,l.updateApiKeyPermissions)(o,{allowedQuotas:t})}catch{}}[i,o,l]=u.then?(await u)():u,e.s(["constrainConnectionsToQuota",0,function(e,t){return 0===t.length?e:0===e.length?t:e.filter(e=>t.includes(e))},"reconcilePoolExclusivity",0,c,"resolveQuotaKeyScope",0,d]),n()}catch(e){n(e)}},!1),283834,e=>{"use strict";let t="qtSd/";function n(e){let t=e.toLowerCase().replace(/[^a-z0-9]/g,"");return t.length>0?t:"pool"}e.s(["QUOTA_MODEL_PREFIX",0,t,"isQuotaModelName",0,function(e){return e.startsWith(t)},"parseQuotaModelName",0,function(e){if(!e.startsWith(t))return null;let n=e.slice(t.length).split("/");if(n.length<3)return null;let i=n[0],o=n[1],r=n.slice(2).join("/");return 0===i.length||0===o.length||0===r.length?null:{groupSlug:i,provider:o,model:r}},"quotaGroupSlug",0,n,"quotaModelName",0,function(e,i,o){return`${t}${n(e)}/${i}/${o}`}])},710876,e=>{"use strict";let t,n=process.env.REDIS_URL?.trim()||"",i=process.env.REDIS_KEY_PREFIX?.trim()||"omniroute:";n||console.warn("[REDIS] REDIS_URL is not set in production. Using in-memory rate limiting.");let o=null;function r(){return n.length>0}let l=(t=null,{shouldLog:e=>e!==t&&(t=e,!0),reset(){t=null}});function a(){if(!r())throw Error("Redis is not configured");return o||(o=(async()=>{let t=await e.A(906538),o=new(t.default??t)(n,{maxRetriesPerRequest:3,enableReadyCheck:!1,keyPrefix:i,retryStrategy:e=>Math.min(50*e,2e3)});return o.on("error",e=>{l.shouldLog(e.message)&&console.error("[REDIS] Error:",e.message)}),o.on("ready",()=>l.reset()),o})()),o}let s=`
local key_prefix = KEYS[1]
local current_time = tonumber(ARGV[1])

local rules = {}
for i = 2, #ARGV, 2 do
  table.insert(rules, {
    limit = tonumber(ARGV[i]),
    window = tonumber(ARGV[i+1])
  })
end

-- First pass: check if any limit is exceeded
for i, rule in ipairs(rules) do
  local current_window = math.floor(current_time / rule.window)
  local window_key = key_prefix .. ":" .. rule.window .. ":" .. current_window

  local count = tonumber(redis.call("GET", window_key) or "0")
  if count >= rule.limit then
    return { 0, rule.window } -- Reject, return which window failed
  end
end

-- Second pass: increment all rules
for i, rule in ipairs(rules) do
  local current_window = math.floor(current_time / rule.window)
  local window_key = key_prefix .. ":" .. rule.window .. ":" .. current_window

  local count = redis.call("INCR", window_key)
  if count == 1 then
    -- TTL is twice the window size to ensure it covers the current window safely
    redis.call("EXPIRE", window_key, rule.window * 2)
  end
end

return { 1, 0 } -- Accepted
`,u=new Map,d=new Map;function c(e,t,n){let i=Math.floor(Date.now()/1e3);for(let o of(e.size>50&&function(e,t){for(let n of e.keys()){let i=n.lastIndexOf(":");if(-1===i)continue;let o=n.lastIndexOf(":",i-1);if(-1===o)continue;let r=Number(n.slice(i+1)),l=Number(n.slice(o+1,i));Number.isFinite(r)&&Number.isFinite(l)&&!(l<=0)&&(r+1)*l<=t&&e.delete(n)}}(e,i),n)){let n=Math.floor(i/o.window),r=`rl:api_key:${t}:${o.window}:${n}`;if((e.get(r)||0)>=o.limit)return{allowed:!1,failedWindow:o.window}}for(let o of n){let n=Math.floor(i/o.window),r=`rl:api_key:${t}:${o.window}:${n}`;e.set(r,(e.get(r)||0)+1)}return{allowed:!0}}async function f(e,t){if(!t||0===t.length)return{allowed:!0};if("true"===process.env.DISABLE_SQLITE_AUTO_BACKUP)return c(u,e,t);if(!r())return c(d,e,t);let n=await a(),i=[Math.floor(Date.now()/1e3)];for(let e of t)i.push(e.limit,e.window);try{let t=await n.eval(s,1,`rl:api_key:${e}`,...i);if(0===t[0])return{allowed:!1,failedWindow:t[1]};return{allowed:!0}}catch(e){return console.error("[RATE_LIMITER] Redis eval failed, bypassing rate limit:",e),{allowed:!0}}}e.s(["checkRateLimit",0,f,"getRedisClient",0,a,"isRedisConfigured",0,r])}];

//# sourceMappingURL=_05js3l0._.js.map