module.exports=[643622,e=>{"use strict";let t={tested:0,alive:0};e.s(["getRelayProbeStats",0,function(){return{...t}},"recordRelayProbe",0,function(e){t={tested:t.tested+1,alive:t.alive+ +!!e}},"resetRelayProbeStats",0,function(){t={tested:0,alive:0}}])},154945,e=>{"use strict";e.s(["buildPresetUnifiedSource",0,function(e){let{sinceIso:t,untilIso:s,rawCutoffDate:a,apiKeyWhere:n,apiKeyParams:i}=e,o=t?.split("T")[0]??null,u=(!o||o<a)&&!n,r={},_=[];u?(_.push("timestamp >= @presetRawCutoff"),r.presetRawCutoff=a):t&&(_.push("timestamp >= @presetSince"),r.presetSince=t),n&&(_.push(n),Object.assign(r,i));let c=_.length>0?`WHERE ${_.join(" AND ")}`:"",p=[];u&&(t&&(p.push("date >= @presetSinceDate"),r.presetSinceDate=o),p.push("date < @presetRawCutoffDate"),r.presetRawCutoffDate=a);let d=p.length>0?`WHERE ${p.join(" AND ")}`:"";return{unifiedSource:u?`(
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
        ${d}
      )`:`(SELECT timestamp, provider, model, service_tier,
          tokens_input, tokens_output,
          tokens_cache_read, tokens_cache_creation, tokens_reasoning
        FROM usage_history
        ${c}
      )`,unifiedParams:r}},"buildUnifiedSource",0,function(e){let{sinceIso:t,untilIso:s,rawCutoffDate:a,apiKeyWhere:n,apiKeyParams:i}=e,o=t?.split("T")[0]??null,u=(!o||o<a)&&!n,r={},_=[];u?(_.push("timestamp >= @rawCutoff"),r.rawCutoff=a):t&&(_.push("timestamp >= @since"),r.since=t),s&&(_.push("timestamp <= @until"),r.until=s),n&&(_.push(n),Object.assign(r,i));let c=_.length>0?`WHERE ${_.join(" AND ")}`:"",p=[];u&&(t&&(p.push("date >= @sinceDate"),r.sinceDate=o),s&&(p.push("date <= @untilDate"),r.untilDate=s.split("T")[0]),p.push("date < @rawCutoffDate"),r.rawCutoffDate=a);let d=p.length>0?`WHERE ${p.join(" AND ")}`:"";return{unifiedSource:u?`(
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
        ${d}
       )`:`(SELECT
          timestamp, provider, model,
          tokens_input, tokens_output,
          tokens_cache_read, tokens_cache_creation, tokens_reasoning,
          service_tier, success, latency_ms,
          connection_id, account_key, api_key_id, api_key_name,
          1 as requests
        FROM usage_history
        ${c}
      )`,unifiedParams:r}}])}];

//# sourceMappingURL=src_lib_db_0cywiix._.js.map