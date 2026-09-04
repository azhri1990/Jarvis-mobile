module.exports=[348387,e=>{"use strict";let t={mode:"off",policy:"reserve-output",outputReserve:4096,safetyMargin:1024,pct:.85,absoluteBudget:0};function s(e){return e&&"object"==typeof e?e:{}}function n(e,t,s,n){return"number"==typeof e&&Number.isFinite(e)?Math.min(n,Math.max(s,Math.floor(e))):t}let a=new Set(["floor","replace-autotrigger","off"]),o=new Set(["reserve-output","percentage","absolute"]);e.s(["normalizeContextBudgetConfig",0,function(e){var i,r;let u=s(e),c=function(e){if(!Array.isArray(e))return;let t=[];for(let n of e){let e=s(n);"string"==typeof e.engine&&e.engine.trim()&&t.push({engine:e.engine,..."string"==typeof e.intensity?{intensity:e.intensity}:{}})}return t.length>0?t:void 0}(u.ladderOverride);return{...t,mode:"string"==typeof u.mode&&a.has(u.mode)?u.mode:t.mode,policy:"string"==typeof u.policy&&o.has(u.policy)?u.policy:t.policy,outputReserve:n(u.outputReserve,t.outputReserve,0,Number.MAX_SAFE_INTEGER),safetyMargin:n(u.safetyMargin,t.safetyMargin,0,Number.MAX_SAFE_INTEGER),pct:(i=u.pct,r=t.pct,"number"==typeof i&&Number.isFinite(i)?Math.min(1,Math.max(0,i)):r),absoluteBudget:n(u.absoluteBudget,t.absoluteBudget,0,Number.MAX_SAFE_INTEGER),...c?{ladderOverride:c}:{}}}],348387)},154945,e=>{"use strict";e.s(["buildPresetUnifiedSource",0,function(e){let{sinceIso:t,untilIso:s,rawCutoffDate:n,apiKeyWhere:a,apiKeyParams:o}=e,i=t?.split("T")[0]??null,r=(!i||i<n)&&!a,u={},c=[];r?(c.push("timestamp >= @presetRawCutoff"),u.presetRawCutoff=n):t&&(c.push("timestamp >= @presetSince"),u.presetSince=t),a&&(c.push(a),Object.assign(u,o));let _=c.length>0?`WHERE ${c.join(" AND ")}`:"",p=[];r&&(t&&(p.push("date >= @presetSinceDate"),u.presetSinceDate=i),p.push("date < @presetRawCutoffDate"),u.presetRawCutoffDate=n);let l=p.length>0?`WHERE ${p.join(" AND ")}`:"";return{unifiedSource:r?`(
        SELECT timestamp, provider, model, service_tier,
          tokens_input, tokens_output,
          tokens_cache_read, tokens_cache_creation, tokens_reasoning
        FROM usage_history
        ${_}
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
        ${l}
      )`:`(SELECT timestamp, provider, model, service_tier,
          tokens_input, tokens_output,
          tokens_cache_read, tokens_cache_creation, tokens_reasoning
        FROM usage_history
        ${_}
      )`,unifiedParams:u}},"buildUnifiedSource",0,function(e){let{sinceIso:t,untilIso:s,rawCutoffDate:n,apiKeyWhere:a,apiKeyParams:o}=e,i=t?.split("T")[0]??null,r=(!i||i<n)&&!a,u={},c=[];r?(c.push("timestamp >= @rawCutoff"),u.rawCutoff=n):t&&(c.push("timestamp >= @since"),u.since=t),s&&(c.push("timestamp <= @until"),u.until=s),a&&(c.push(a),Object.assign(u,o));let _=c.length>0?`WHERE ${c.join(" AND ")}`:"",p=[];r&&(t&&(p.push("date >= @sinceDate"),u.sinceDate=i),s&&(p.push("date <= @untilDate"),u.untilDate=s.split("T")[0]),p.push("date < @rawCutoffDate"),u.rawCutoffDate=n);let l=p.length>0?`WHERE ${p.join(" AND ")}`:"";return{unifiedSource:r?`(
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
        ${_}
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
        ${l}
       )`:`(SELECT
          timestamp, provider, model,
          tokens_input, tokens_output,
          tokens_cache_read, tokens_cache_creation, tokens_reasoning,
          service_tier, success, latency_ms,
          connection_id, account_key, api_key_id, api_key_name,
          1 as requests
        FROM usage_history
        ${_}
      )`,unifiedParams:u}}])}];

//# sourceMappingURL=src_lib_db_1ecv6os._.js.map