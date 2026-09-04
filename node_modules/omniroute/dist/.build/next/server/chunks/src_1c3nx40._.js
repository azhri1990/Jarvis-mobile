module.exports=[589812,e=>{e.v(t=>Promise.all(["server/chunks/src_20d6yb8._.js","server/chunks/src_0ofy062._.js"].map(t=>e.l(t))).then(()=>t(439951)))},84321,e=>{e.v(t=>Promise.all(["server/chunks/src_0-bmhhp._.js","server/chunks/src_lib_11r-h4-._.js","server/chunks/open-sse_0h7i_aj._.js","server/chunks/_0r8o9es._.js","server/chunks/_1xtqleg._.js"].map(t=>e.l(t))).then(()=>t(301433)))},348387,e=>{"use strict";let t={mode:"off",policy:"reserve-output",outputReserve:4096,safetyMargin:1024,pct:.85,absoluteBudget:0};function s(e){return e&&"object"==typeof e?e:{}}function n(e,t,s,n){return"number"==typeof e&&Number.isFinite(e)?Math.min(n,Math.max(s,Math.floor(e))):t}let r=new Set(["floor","replace-autotrigger","off"]),a=new Set(["reserve-output","percentage","absolute"]);e.s(["normalizeContextBudgetConfig",0,function(e){var o,i;let u=s(e),_=function(e){if(!Array.isArray(e))return;let t=[];for(let n of e){let e=s(n);"string"==typeof e.engine&&e.engine.trim()&&t.push({engine:e.engine,..."string"==typeof e.intensity?{intensity:e.intensity}:{}})}return t.length>0?t:void 0}(u.ladderOverride);return{...t,mode:"string"==typeof u.mode&&r.has(u.mode)?u.mode:t.mode,policy:"string"==typeof u.policy&&a.has(u.policy)?u.policy:t.policy,outputReserve:n(u.outputReserve,t.outputReserve,0,Number.MAX_SAFE_INTEGER),safetyMargin:n(u.safetyMargin,t.safetyMargin,0,Number.MAX_SAFE_INTEGER),pct:(o=u.pct,i=t.pct,"number"==typeof o&&Number.isFinite(o)?Math.min(1,Math.max(0,o)):i),absoluteBudget:n(u.absoluteBudget,t.absoluteBudget,0,Number.MAX_SAFE_INTEGER),..._?{ladderOverride:_}:{}}}],348387)},643622,e=>{"use strict";let t={tested:0,alive:0};e.s(["getRelayProbeStats",0,function(){return{...t}},"recordRelayProbe",0,function(e){t={tested:t.tested+1,alive:t.alive+ +!!e}},"resetRelayProbeStats",0,function(){t={tested:0,alive:0}}])},154945,e=>{"use strict";e.s(["buildPresetUnifiedSource",0,function(e){let{sinceIso:t,untilIso:s,rawCutoffDate:n,apiKeyWhere:r,apiKeyParams:a}=e,o=t?.split("T")[0]??null,i=(!o||o<n)&&!r,u={},_=[];i?(_.push("timestamp >= @presetRawCutoff"),u.presetRawCutoff=n):t&&(_.push("timestamp >= @presetSince"),u.presetSince=t),r&&(_.push(r),Object.assign(u,a));let c=_.length>0?`WHERE ${_.join(" AND ")}`:"",l=[];i&&(t&&(l.push("date >= @presetSinceDate"),u.presetSinceDate=o),l.push("date < @presetRawCutoffDate"),u.presetRawCutoffDate=n);let p=l.length>0?`WHERE ${l.join(" AND ")}`:"";return{unifiedSource:i?`(
        SELECT timestamp, provider, model, service_tier,
          tokens_input, tokens_output,
          tokens_cache_read, tokens_cache_creation, tokens_reasoning
        FROM usage_history
        ${c}
        UNION ALL
        SELECT
          date || 'T12:00:00.000Z' as timestamp,
          provider, model,
          'standard' as service_tier,
          total_input_tokens as tokens_input,
          total_output_tokens as tokens_output,
          0 as tokens_cache_read,
          0 as tokens_cache_creation,
          0 as tokens_reasoning
        FROM daily_usage_summary
        ${p}
      )`:`(SELECT timestamp, provider, model, service_tier,
          tokens_input, tokens_output,
          tokens_cache_read, tokens_cache_creation, tokens_reasoning
        FROM usage_history
        ${c}
      )`,unifiedParams:u}},"buildUnifiedSource",0,function(e){let{sinceIso:t,untilIso:s,rawCutoffDate:n,apiKeyWhere:r,apiKeyParams:a}=e,o=t?.split("T")[0]??null,i=(!o||o<n)&&!r,u={},_=[];i?(_.push("timestamp >= @rawCutoff"),u.rawCutoff=n):t&&(_.push("timestamp >= @since"),u.since=t),s&&(_.push("timestamp <= @until"),u.until=s),r&&(_.push(r),Object.assign(u,a));let c=_.length>0?`WHERE ${_.join(" AND ")}`:"",l=[];i&&(t&&(l.push("date >= @sinceDate"),u.sinceDate=o),s&&(l.push("date <= @untilDate"),u.untilDate=s.split("T")[0]),l.push("date < @rawCutoffDate"),u.rawCutoffDate=n);let p=l.length>0?`WHERE ${l.join(" AND ")}`:"";return{unifiedSource:i?`(
        SELECT
          timestamp,
          provider,
          model,
          tokens_input,
          tokens_output,
          tokens_cache_read,
          tokens_cache_creation,
          tokens_reasoning,
          service_tier,
          success,
          latency_ms,
          connection_id,
          account_key,
          api_key_id,
          api_key_name,
          1 as requests
        FROM usage_history
        ${c}
        UNION ALL
        SELECT
          date || 'T12:00:00.000Z' as timestamp,
          provider,
          model,
          total_input_tokens as tokens_input,
          total_output_tokens as tokens_output,
          0 as tokens_cache_read,
          0 as tokens_cache_creation,
          0 as tokens_reasoning,
          'standard' as service_tier,
          1 as success,
          NULL as latency_ms,
          NULL as connection_id,
          NULL as account_key,
          NULL as api_key_id,
          NULL as api_key_name,
          total_requests as requests
        FROM daily_usage_summary
        ${p}
       )`:`(SELECT
          timestamp, provider, model,
          tokens_input, tokens_output,
          tokens_cache_read, tokens_cache_creation, tokens_reasoning,
          service_tier, success, latency_ms,
          connection_id, account_key, api_key_id, api_key_name,
          1 as requests
        FROM usage_history
        ${c}
      )`,unifiedParams:u}}])},123492,e=>{e.v(t=>Promise.all(["server/chunks/src_0-bp7vb._.js","server/chunks/src_0y6o1h0._.js","server/chunks/_0j3gevj._.js","server/chunks/_04y0dar._.js","server/chunks/_1xtqleg._.js","server/chunks/src_lib_1605327._.js","server/chunks/src_0eyld72._.js","server/chunks/src_0r8m391._.js"].map(t=>e.l(t))).then(()=>t(20954)))},579042,e=>{e.v(t=>Promise.all(["server/chunks/src_shared_utils_apiKey_ts_1-k4saf._.js"].map(t=>e.l(t))).then(()=>t(65448)))},161002,e=>{"use strict";e.s(["formatCost",0,function(e){let t=Number(e||0);return Number.isFinite(t)&&0!==t?t<.01?`$${t.toFixed(6)}`:t<1?`$${t.toFixed(4)}`:`$${t.toFixed(2)}`:"$0.00"},"formatResetCountdown",0,function(e){if(!e)return null;let t="number"==typeof e?e:new Date(e).getTime();if(isNaN(t))return null;let s=t-Date.now();if(s<=0)return null;let n=Math.floor(s/1e3),r=Math.floor(n/3600),a=Math.floor(n%3600/60),o=n%60;return r>0?`${r}h ${a}m`:a>0?`${a}m ${o}s`:`${o}s`},"safePercentage",0,function(e){return"number"==typeof e&&isFinite(e)?e:void 0}])},263404,e=>{e.v(t=>Promise.all(["server/chunks/_0bk-4w9._.js"].map(t=>e.l(t))).then(()=>t(710876)))}];

//# sourceMappingURL=src_1c3nx40._.js.map