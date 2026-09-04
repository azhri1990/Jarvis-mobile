module.exports=[536952,e=>{e.v(s=>Promise.all(["server/chunks/[root-of-the-server]__0iczplx._.js"].map(s=>e.l(s))).then(()=>s(329066)))},33456,e=>{e.v(s=>Promise.all(["server/chunks/[root-of-the-server]__11a_hka._.js","server/chunks/_0-ob8_-._.js","server/chunks/_0j3gevj._.js","server/chunks/src_0r8m391._.js","server/chunks/_1n86fjr._.js","server/chunks/_1_2w6s7._.js","server/chunks/open-sse_1k8ubco._.js","server/chunks/_1r37jgk._.js","server/chunks/node_modules_undici_20gvchs._.js","server/chunks/_07pfj6-._.js","server/chunks/src_lib_db_1hppq3d._.js","server/chunks/src_lib_1j91939._.js","server/chunks/src_lib_db_1timp40._.js","server/chunks/_146uqra._.js","server/chunks/_1xtqleg._.js"].map(s=>e.l(s))).then(()=>s(675308)))},589812,e=>{e.v(s=>Promise.all(["server/chunks/src_lib_14h9cu4._.js","server/chunks/[root-of-the-server]__135m_lh._.js"].map(s=>e.l(s))).then(()=>s(439951)))},727431,e=>{e.v(s=>Promise.all(["server/chunks/_1jlzjpx._.js","server/chunks/src_lib_11r-h4-._.js","server/chunks/_1ye2ne6._.js","server/chunks/src_lib_04wbzqh._.js","server/chunks/_1-132ds._.js","server/chunks/open-sse_1k8ubco._.js","server/chunks/_0j3gevj._.js","server/chunks/src_lib_resilience_settings_ts_1stfu5h._.js","server/chunks/open-sse_0m0pnio._.js","server/chunks/src_0r8m391._.js","server/chunks/_0qosah5._.js","server/chunks/_1xtqleg._.js","server/chunks/open-sse_0h7i_aj._.js","server/chunks/_1_2w6s7._.js","server/chunks/_17dunaw._.js","server/chunks/src_lib_db_1timp40._.js","server/chunks/open-sse_services_07jb4wz._.js","server/chunks/open-sse_0sifrof._.js","server/chunks/_1n86fjr._.js","server/chunks/open-sse_05dhyd4._.js","server/chunks/_07pfj6-._.js","server/chunks/src_lib_1j91939._.js","server/chunks/_0yvzd1q._.js","server/chunks/_099ro22._.js","server/chunks/_1r37jgk._.js","server/chunks/_1979dzt._.js","server/chunks/_0-ob8_-._.js","server/chunks/src_lib_db_1hppq3d._.js","server/chunks/src_lib_usage_1u13rm3._.js","server/chunks/_077zfsr._.js","server/chunks/src_lib_0sjhhvv._.js","server/chunks/open-sse_services_1k938ch._.js","server/chunks/_1-dtiuy._.js","server/chunks/_1shgqip._.js","server/chunks/[root-of-the-server]__0jl6j_w._.js","server/chunks/node_modules_undici_20gvchs._.js"].map(s=>e.l(s))).then(()=>s(791588)))},84321,e=>{e.v(s=>Promise.all(["server/chunks/_08_olrb._.js","server/chunks/src_lib_11r-h4-._.js","server/chunks/open-sse_0h7i_aj._.js","server/chunks/_1n86fjr._.js","server/chunks/_1p5siiw._.js","server/chunks/_1xtqleg._.js","server/chunks/src_lib_db_1timp40._.js","server/chunks/_1r37jgk._.js","server/chunks/src_lib_db_1hppq3d._.js","server/chunks/_0r8o9es._.js","server/chunks/[root-of-the-server]__0m8cok2._.js"].map(s=>e.l(s))).then(()=>s(301433)))},348387,e=>{"use strict";let s={mode:"off",policy:"reserve-output",outputReserve:4096,safetyMargin:1024,pct:.85,absoluteBudget:0};function r(e){return e&&"object"==typeof e?e:{}}function t(e,s,r,t){return"number"==typeof e&&Number.isFinite(e)?Math.min(t,Math.max(r,Math.floor(e))):s}let _=new Set(["floor","replace-autotrigger","off"]),n=new Set(["reserve-output","percentage","absolute"]);e.s(["normalizeContextBudgetConfig",0,function(e){var u,o;let i=r(e),c=function(e){if(!Array.isArray(e))return;let s=[];for(let t of e){let e=r(t);"string"==typeof e.engine&&e.engine.trim()&&s.push({engine:e.engine,..."string"==typeof e.intensity?{intensity:e.intensity}:{}})}return s.length>0?s:void 0}(i.ladderOverride);return{...s,mode:"string"==typeof i.mode&&_.has(i.mode)?i.mode:s.mode,policy:"string"==typeof i.policy&&n.has(i.policy)?i.policy:s.policy,outputReserve:t(i.outputReserve,s.outputReserve,0,Number.MAX_SAFE_INTEGER),safetyMargin:t(i.safetyMargin,s.safetyMargin,0,Number.MAX_SAFE_INTEGER),pct:(u=i.pct,o=s.pct,"number"==typeof u&&Number.isFinite(u)?Math.min(1,Math.max(0,u)):o),absoluteBudget:t(i.absoluteBudget,s.absoluteBudget,0,Number.MAX_SAFE_INTEGER),...c?{ladderOverride:c}:{}}}],348387)},879780,e=>{e.v(e=>Promise.resolve().then(()=>e(403122)))},643622,e=>{"use strict";let s={tested:0,alive:0};e.s(["getRelayProbeStats",0,function(){return{...s}},"recordRelayProbe",0,function(e){s={tested:s.tested+1,alive:s.alive+ +!!e}},"resetRelayProbeStats",0,function(){s={tested:0,alive:0}}])},154945,e=>{"use strict";e.s(["buildPresetUnifiedSource",0,function(e){let{sinceIso:s,untilIso:r,rawCutoffDate:t,apiKeyWhere:_,apiKeyParams:n}=e,u=s?.split("T")[0]??null,o=(!u||u<t)&&!_,i={},c=[];o?(c.push("timestamp >= @presetRawCutoff"),i.presetRawCutoff=t):s&&(c.push("timestamp >= @presetSince"),i.presetSince=s),_&&(c.push(_),Object.assign(i,n));let a=c.length>0?`WHERE ${c.join(" AND ")}`:"",h=[];o&&(s&&(h.push("date >= @presetSinceDate"),i.presetSinceDate=u),h.push("date < @presetRawCutoffDate"),i.presetRawCutoffDate=t);let l=h.length>0?`WHERE ${h.join(" AND ")}`:"";return{unifiedSource:o?`(
        SELECT timestamp, provider, model, service_tier,
          tokens_input, tokens_output,
          tokens_cache_read, tokens_cache_creation, tokens_reasoning
        FROM usage_history
        ${a}
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
        ${a}
      )`,unifiedParams:i}},"buildUnifiedSource",0,function(e){let{sinceIso:s,untilIso:r,rawCutoffDate:t,apiKeyWhere:_,apiKeyParams:n}=e,u=s?.split("T")[0]??null,o=(!u||u<t)&&!_,i={},c=[];o?(c.push("timestamp >= @rawCutoff"),i.rawCutoff=t):s&&(c.push("timestamp >= @since"),i.since=s),r&&(c.push("timestamp <= @until"),i.until=r),_&&(c.push(_),Object.assign(i,n));let a=c.length>0?`WHERE ${c.join(" AND ")}`:"",h=[];o&&(s&&(h.push("date >= @sinceDate"),i.sinceDate=u),r&&(h.push("date <= @untilDate"),i.untilDate=r.split("T")[0]),h.push("date < @rawCutoffDate"),i.rawCutoffDate=t);let l=h.length>0?`WHERE ${h.join(" AND ")}`:"";return{unifiedSource:o?`(
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
        ${a}
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
        ${a}
      )`,unifiedParams:i}}])},123492,e=>{e.v(s=>Promise.all(["server/chunks/_0kxtplu._.js","server/chunks/open-sse_1k8ubco._.js","server/chunks/_0j3gevj._.js","server/chunks/_1n86fjr._.js","server/chunks/_1_2w6s7._.js","server/chunks/src_lib_db_1timp40._.js","server/chunks/[root-of-the-server]__04_8a5j._.js","server/chunks/_1r37jgk._.js","server/chunks/src_lib_db_1hppq3d._.js","server/chunks/_1xtqleg._.js","server/chunks/[root-of-the-server]__1umiv1m._.js","server/chunks/_1p0gx54._.js","server/chunks/src_0r8m391._.js","server/chunks/src_lib_1605327._.js"].map(s=>e.l(s))).then(()=>s(20954)))},49794,e=>{e.v(s=>Promise.all(["server/chunks/src_shared_constants_pricing_ts_0ut6kl4._.js","server/chunks/src_shared_constants_pricing_ts_1y5sqnp._.js"].map(s=>e.l(s))).then(()=>s(404503)))},73006,e=>{e.v(s=>Promise.all(["server/chunks/_01a2ghu._.js","server/chunks/_122vdig._.js","server/chunks/[root-of-the-server]__0m8cok2._.js","server/chunks/src_lib_db_1hppq3d._.js","server/chunks/_1xtqleg._.js","server/chunks/src_lib_db_1timp40._.js","server/chunks/_1n86fjr._.js","server/chunks/_1r37jgk._.js"].map(s=>e.l(s))).then(()=>s(910263)))},579042,e=>{e.v(s=>Promise.all(["server/chunks/src_shared_utils_apiKey_ts_1-k4saf._.js"].map(s=>e.l(s))).then(()=>s(65448)))},161002,e=>{"use strict";e.s(["formatCost",0,function(e){let s=Number(e||0);return Number.isFinite(s)&&0!==s?s<.01?`$${s.toFixed(6)}`:s<1?`$${s.toFixed(4)}`:`$${s.toFixed(2)}`:"$0.00"},"formatResetCountdown",0,function(e){if(!e)return null;let s="number"==typeof e?e:new Date(e).getTime();if(isNaN(s))return null;let r=s-Date.now();if(r<=0)return null;let t=Math.floor(r/1e3),_=Math.floor(t/3600),n=Math.floor(t%3600/60),u=t%60;return _>0?`${_}h ${n}m`:n>0?`${n}m ${u}s`:`${u}s`},"safePercentage",0,function(e){return"number"==typeof e&&isFinite(e)?e:void 0}])},263404,e=>{e.v(s=>Promise.all(["server/chunks/_05r-j0o._.js"].map(s=>e.l(s))).then(()=>s(710876)))}];

//# sourceMappingURL=_1wl_e5o._.js.map