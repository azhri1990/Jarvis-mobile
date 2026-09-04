module.exports=[918622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},120635,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/action-async-storage.external.js",()=>require("next/dist/server/app-render/action-async-storage.external.js"))},324725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},556704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},559043,(e,t,r)=>{t.exports=e.x("next/dist/server/runtime-reacts.external.js",()=>require("next/dist/server/runtime-reacts.external.js"))},193695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},81111,(e,t,r)=>{t.exports=e.x("node:stream",()=>require("node:stream"))},819481,(e,t,r)=>{"use strict";var o=Object.defineProperty,s=Object.getOwnPropertyDescriptor,a=Object.getOwnPropertyNames,n=Object.prototype.hasOwnProperty,i={},l={RequestCookies:()=>E,ResponseCookies:()=>f,parseCookie:()=>d,parseSetCookie:()=>p,stringifyCookie:()=>u};for(var c in l)o(i,c,{get:l[c],enumerable:!0});function u(e){var t;let r=["path"in e&&e.path&&`Path=${e.path}`,"expires"in e&&(e.expires||0===e.expires)&&`Expires=${("number"==typeof e.expires?new Date(e.expires):e.expires).toUTCString()}`,"maxAge"in e&&"number"==typeof e.maxAge&&`Max-Age=${e.maxAge}`,"domain"in e&&e.domain&&`Domain=${e.domain}`,"secure"in e&&e.secure&&"Secure","httpOnly"in e&&e.httpOnly&&"HttpOnly","sameSite"in e&&e.sameSite&&`SameSite=${e.sameSite}`,"partitioned"in e&&e.partitioned&&"Partitioned","priority"in e&&e.priority&&`Priority=${e.priority}`].filter(Boolean),o=`${e.name}=${encodeURIComponent(null!=(t=e.value)?t:"")}`;return 0===r.length?o:`${o}; ${r.join("; ")}`}function d(e){let t=new Map;for(let r of e.split(/; */)){if(!r)continue;let e=r.indexOf("=");if(-1===e){t.set(r,"true");continue}let[o,s]=[r.slice(0,e),r.slice(e+1)];try{t.set(o,decodeURIComponent(null!=s?s:"true"))}catch{}}return t}function p(e){if(!e)return;let[[t,r],...o]=d(e),{domain:s,expires:a,httponly:n,maxage:i,path:l,samesite:c,secure:u,partitioned:p,priority:E}=Object.fromEntries(o.map(([e,t])=>[e.toLowerCase().replace(/-/g,""),t]));{var f,g,x={name:t,value:decodeURIComponent(r),domain:s,...a&&{expires:new Date(a)},...n&&{httpOnly:!0},..."string"==typeof i&&{maxAge:Number(i)},path:l,...c&&{sameSite:_.includes(f=(f=c).toLowerCase())?f:void 0},...u&&{secure:!0},...E&&{priority:m.includes(g=(g=E).toLowerCase())?g:void 0},...p&&{partitioned:!0}};let e={};for(let t in x)x[t]&&(e[t]=x[t]);return e}}t.exports=((e,t,r)=>{if(t&&"object"==typeof t||"function"==typeof t)for(let i of a(t))n.call(e,i)||void 0===i||o(e,i,{get:()=>t[i],enumerable:!(r=s(t,i))||r.enumerable});return e})(o({},"__esModule",{value:!0}),i);var _=["strict","lax","none"],m=["low","medium","high"],E=class{constructor(e){this._parsed=new Map,this._headers=e;const t=e.get("cookie");if(t)for(const[e,r]of d(t))this._parsed.set(e,{name:e,value:r})}[Symbol.iterator](){return this._parsed[Symbol.iterator]()}get size(){return this._parsed.size}get(...e){let t="string"==typeof e[0]?e[0]:e[0].name;return this._parsed.get(t)}getAll(...e){var t;let r=Array.from(this._parsed);if(!e.length)return r.map(([e,t])=>t);let o="string"==typeof e[0]?e[0]:null==(t=e[0])?void 0:t.name;return r.filter(([e])=>e===o).map(([e,t])=>t)}has(e){return this._parsed.has(e)}set(...e){let[t,r]=1===e.length?[e[0].name,e[0].value]:e,o=this._parsed;return o.set(t,{name:t,value:r}),this._headers.set("cookie",Array.from(o).map(([e,t])=>u(t)).join("; ")),this}delete(e){let t=this._parsed,r=Array.isArray(e)?e.map(e=>t.delete(e)):t.delete(e);return this._headers.set("cookie",Array.from(t).map(([e,t])=>u(t)).join("; ")),r}clear(){return this.delete(Array.from(this._parsed.keys())),this}[Symbol.for("edge-runtime.inspect.custom")](){return`RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`}toString(){return[...this._parsed.values()].map(e=>`${e.name}=${encodeURIComponent(e.value)}`).join("; ")}},f=class{constructor(e){var t,r,o;this._parsed=new Map,this._headers=e;const s=null!=(o=null!=(r=null==(t=e.getSetCookie)?void 0:t.call(e))?r:e.get("set-cookie"))?o:[];for(const e of Array.isArray(s)?s:function(e){if(!e)return[];var t,r,o,s,a,n=[],i=0;function l(){for(;i<e.length&&/\s/.test(e.charAt(i));)i+=1;return i<e.length}for(;i<e.length;){for(t=i,a=!1;l();)if(","===(r=e.charAt(i))){for(o=i,i+=1,l(),s=i;i<e.length&&"="!==(r=e.charAt(i))&&";"!==r&&","!==r;)i+=1;i<e.length&&"="===e.charAt(i)?(a=!0,i=s,n.push(e.substring(t,o)),t=i):i=o+1}else i+=1;(!a||i>=e.length)&&n.push(e.substring(t,e.length))}return n}(s)){const t=p(e);t&&this._parsed.set(t.name,t)}}get(...e){let t="string"==typeof e[0]?e[0]:e[0].name;return this._parsed.get(t)}getAll(...e){var t;let r=Array.from(this._parsed.values());if(!e.length)return r;let o="string"==typeof e[0]?e[0]:null==(t=e[0])?void 0:t.name;return r.filter(e=>e.name===o)}has(e){return this._parsed.has(e)}set(...e){let[t,r,o]=1===e.length?[e[0].name,e[0].value,e[0]]:e,s=this._parsed;return s.set(t,function(e={name:"",value:""}){return"number"==typeof e.expires&&(e.expires=new Date(e.expires)),e.maxAge&&(e.expires=new Date(Date.now()+1e3*e.maxAge)),(null===e.path||void 0===e.path)&&(e.path="/"),e}({name:t,value:r,...o})),function(e,t){for(let[,r]of(t.delete("set-cookie"),e)){let e=u(r);t.append("set-cookie",e)}}(s,this._headers),this}delete(...e){let[t,r]="string"==typeof e[0]?[e[0]]:[e[0].name,e[0]];return this.set({...r,name:t,value:"",expires:new Date(0)})}[Symbol.for("edge-runtime.inspect.custom")](){return`ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`}toString(){return[...this._parsed.values()].map(u).join("; ")}}},442315,(e,t,r)=>{"use strict";t.exports=e.r(918622)},347540,(e,t,r)=>{"use strict";t.exports=e.r(442315).vendored["react-rsc"].React},463448,e=>{"use strict";let t={400:{type:"invalid_request_error",code:"bad_request"},401:{type:"authentication_error",code:"invalid_api_key"},402:{type:"billing_error",code:"payment_required"},403:{type:"permission_error",code:"insufficient_quota"},404:{type:"invalid_request_error",code:"model_not_found"},406:{type:"invalid_request_error",code:"model_not_supported"},410:{type:"invalid_request_error",code:"model_shutdown"},429:{type:"rate_limit_error",code:"rate_limit_exceeded"},499:{type:"client_disconnected",code:"client_disconnected"},500:{type:"server_error",code:"internal_server_error"},502:{type:"server_error",code:"bad_gateway"},503:{type:"server_error",code:"service_unavailable"},504:{type:"server_error",code:"gateway_timeout"}},r={400:"Bad request",401:"Invalid API key provided",402:"Payment required",403:"You exceeded your current quota",404:"Model not found",406:"Model not supported",410:"Model has been shut down",429:"Rate limit exceeded",499:"Client disconnected",500:"Internal server error",502:"Bad gateway - upstream provider error",503:"Service temporarily unavailable",504:"Gateway timeout"},o={base:1e3,max:12e4,maxLevel:15},s={unauthorized:12e4,paymentRequired:12e4,notFound:12e4,notFoundLocal:5e3,transientInitial:5e3,transientMax:6e4,transient:5e3,requestNotAllowed:5e3,rateLimit:12e4,serviceUnavailable:2e3,authExpired:12e4,geoBlocked:864e5,gcpProjectRequired:864e5},a=[{id:"no_credentials",text:"no credentials",cooldownMs:s.notFound,reason:"auth_error"},{id:"request_not_allowed",text:"request not allowed",cooldownMs:s.requestNotAllowed,reason:"rate_limit_exceeded"},{id:"improperly_formed_request",text:"improperly formed request",cooldownMs:0,reason:"model_capacity"},{id:"rate_limit",text:"rate limit",backoff:!0,reason:"rate_limit_exceeded"},{id:"too_many_requests",text:"too many requests",backoff:!0,reason:"rate_limit_exceeded"},{id:"hour_quota_exceeded",text:"hour quota",backoff:!0,reason:"quota_exhausted"},{id:"quota_has_been_exceeded",text:"quota has been exceeded",backoff:!0,reason:"quota_exhausted"},{id:"quota_exceeded",text:"quota exceeded",backoff:!0,reason:"quota_exhausted"},{id:"quota_will_reset",text:"quota will reset",backoff:!0,reason:"quota_exhausted"},{id:"capacity_exhausted",text:"exhausted your capacity",backoff:!0,reason:"quota_exhausted"},{id:"quota_exhausted",text:"quota exhausted",backoff:!0,reason:"quota_exhausted"},{id:"free_tier_exhausted",text:"free tier of the model has been exhausted",backoff:!0,reason:"quota_exhausted"},{id:"out_of_extra_usage",text:"out of extra usage",backoff:!0,reason:"quota_exhausted"},{id:"extra_usage_required",text:"extra usage required",backoff:!0,reason:"quota_exhausted"},{id:"capacity",text:"capacity",backoff:!0,reason:"model_capacity"},{id:"overloaded",text:"overloaded",backoff:!0,reason:"model_capacity"},{id:"high_demand",text:"high demand",backoff:!0,reason:"model_capacity"},{id:"status_401",status:401,cooldownMs:0,reason:"auth_error"},{id:"status_402",status:402,cooldownMs:0,reason:"quota_exhausted"},{id:"status_403",status:403,cooldownMs:0,reason:"quota_exhausted"},{id:"status_404",status:404,cooldownMs:s.notFound,reason:"unknown"},{id:"status_406",status:406,backoff:!0,reason:"server_error"},{id:"status_408",status:408,backoff:!0,reason:"server_error"},{id:"status_429",status:429,backoff:!0,reason:"rate_limit_exceeded"},{id:"status_500",status:500,backoff:!0,reason:"server_error"},{id:"status_502",status:502,backoff:!0,reason:"server_error"},{id:"status_503",status:503,backoff:!0,reason:"server_error"},{id:"status_504",status:504,backoff:!0,reason:"server_error"}];function n(e){let t=String(e||"").toLowerCase();return t&&a.find(e=>e.text&&t.includes(e.text))||null}function i(e){return a.find(t=>t.status===e)||null}let l=[/\bfunction\b[\s\S]{0,80}?\bDEGRADED\b/i,/\bDEGRADED\b[\s\S]{0,80}?\bfunction\b/i];e.s(["BACKOFF_CONFIG",0,o,"COOLDOWN_MS",0,s,"TRANSIENT_COOLDOWN_MS",0,5e3,"calculateBackoffCooldown",0,function(e=0){let t=Math.max(0,Math.floor(e));return Math.min(o.base*Math.pow(2,t),o.max)},"findMatchingErrorRule",0,function(e,t){return n(t)||i(e)},"getDefaultErrorMessage",0,function(e){return r[e]||"An error occurred"},"getErrorInfo",0,function(e){return t[e]||(e>=500?{type:"server_error",code:"internal_server_error"}:{type:"invalid_request_error",code:""})},"isNimFunctionDegraded",0,function(e){return l.some(t=>t.test(e))},"matchErrorRuleByStatus",0,i,"matchErrorRuleByText",0,n,"serviceSupervisorCooldown",0,function(e,t){if(503!==e||!t)return null;let r="function"==typeof t.get?t.get("x-omni-fallback-hint"):t["x-omni-fallback-hint"]||t["X-Omni-Fallback-Hint"];return"string"!=typeof r||"connection_cooldown"!==r.toLowerCase()?null:{shouldFallback:!0,cooldownMs:5e3,baseCooldownMs:5e3,newBackoffLevel:0,reason:"service_not_running",skipProviderBreaker:!0}}])},496425,e=>{"use strict";var t=e.i(899378);e.s(["getErrorTypeBreakdown",0,function(e,r){return(0,t.getDbInstance)().prepare(`
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
      `).all()}])},469960,e=>{"use strict";var t=e.i(899378),r=e.i(529646);function o(e){let t=(0,r.rowToCamel)(e)??{};return{model:String(t.model??""),source:String(t.source??""),category:String(t.category??""),score:"number"==typeof t.score?t.score:0,eloRaw:"number"==typeof t.eloRaw?t.eloRaw:null,confidence:"string"==typeof t.confidence?t.confidence:null,syncedAt:String(t.syncedAt??""),expiresAt:"string"==typeof t.expiresAt?t.expiresAt:null}}function s(e,r){let s=(0,t.getDbInstance)().prepare(`SELECT * FROM model_intelligence
       WHERE model = ? AND category = ?
         AND source IN ('user_override', 'arena_elo', 'models_dev_tier')
         AND (expires_at IS NULL OR datetime(expires_at) > datetime('now'))
       ORDER BY CASE source
         WHEN 'user_override' THEN 1
         WHEN 'arena_elo' THEN 2
         WHEN 'models_dev_tier' THEN 3
       END
       LIMIT 1`).get(e,r);return s?o(s):null}function a(e){(0,t.getDbInstance)().prepare(`INSERT OR REPLACE INTO model_intelligence
       (model, source, category, score, elo_raw, confidence, synced_at, expires_at)
     VALUES (?, ?, ?, ?, ?, ?, datetime('now'), ?)`).run(e.model,e.source,e.category,e.score,e.eloRaw??null,e.confidence??null,e.expiresAt??null)}function n(e,r,o){return((0,t.getDbInstance)().prepare(`DELETE FROM model_intelligence
       WHERE model = ? AND source = ? AND category = ?`).run(e,r,o).changes??0)>0}e.s(["bulkUpsertModelIntelligence",0,function(e){if(0===e.length)return 0;let r=(0,t.getDbInstance)(),o=r.prepare(`INSERT OR REPLACE INTO model_intelligence
       (model, source, category, score, elo_raw, confidence, synced_at, expires_at)
     VALUES (?, ?, ?, ?, ?, ?, datetime('now'), ?)`);return r.transaction(()=>{let t=0;for(let r of e)o.run(r.model,r.source,r.category,r.score,r.eloRaw??null,r.confidence??null,r.expiresAt??null),t++;return t})()},"deleteExpiredIntelligence",0,function(e){let r=(0,t.getDbInstance)(),o=["expires_at IS NOT NULL","datetime(expires_at) < datetime('now')"],s=[];e&&(o.push("source = ?"),s.push(e));let a=o.join(" AND ");return r.prepare(`DELETE FROM model_intelligence WHERE ${a}`).run(...s).changes??0},"deleteModelIntelligence",0,n,"deleteModelIntelligenceBySource",0,function(e){return(0,t.getDbInstance)().prepare("DELETE FROM model_intelligence WHERE source = ?").run(e).changes??0},"deleteUserFitnessOverrideEntry",0,function(e,t){return n(e.toLowerCase(),"user_override",t.toLowerCase())},"getModelIntelligence",0,s,"getModelIntelligenceBySource",0,function(e,r,s){let a=(0,t.getDbInstance)().prepare(`SELECT * FROM model_intelligence
       WHERE model = ? AND source = ? AND category = ?
         AND (expires_at IS NULL OR datetime(expires_at) > datetime('now'))`).get(e,r,s);return a?o(a):null},"getResolvedTaskFitness",0,function(e,t){let r=s(e,t);return r?r.score:null},"listModelIntelligence",0,function(e){let r=(0,t.getDbInstance)(),s=[],a=[];e?.source&&(s.push("source = ?"),a.push(e.source)),e?.category&&(s.push("category = ?"),a.push(e.category));let n=s.length>0?`WHERE ${s.join(" AND ")}`:"",i=`SELECT * FROM model_intelligence ${n} ORDER BY model ASC, source ASC, category ASC`;return r.prepare(i).all(...a).map(o)},"setUserFitnessOverrideEntry",0,function(e,t,r){a({model:e.toLowerCase(),source:"user_override",category:t.toLowerCase(),score:Math.max(0,Math.min(1,r)),eloRaw:null,confidence:null,expiresAt:null})},"upsertModelIntelligence",0,a])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__1_wj1lg._.js.map