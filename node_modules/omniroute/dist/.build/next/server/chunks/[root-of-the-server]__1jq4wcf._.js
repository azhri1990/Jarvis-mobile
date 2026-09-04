module.exports=[427699,(e,t,o)=>{t.exports=e.x("events",()=>require("events"))},688947,(e,t,o)=>{t.exports=e.x("stream",()=>require("stream"))},224361,(e,t,o)=>{t.exports=e.x("util",()=>require("util"))},406461,(e,t,o)=>{t.exports=e.x("zlib",()=>require("zlib"))},705765,e=>{"use strict";let t={"gemini-pro":"gemini-2.5-pro","gemini-pro-vision":"gemini-2.5-pro","gemini-1.5-pro":"gemini-2.5-pro","gemini-1.5-flash":"gemini-2.5-flash","gemini-1.0-pro":"gemini-2.5-pro","gemini-2.0-flash":"gemini-2.5-flash","gemini-2.0-flash-lite":"gemini-3.1-flash-lite","gemini-3.1-flash-lite-preview":"gemini-3.1-flash-lite","gemini-3-pro-high":"gemini-3.1-pro-high","gemini-3-pro-low":"gemini-3.1-pro-low","gemma-4":"gemini-3.1-flash-lite","claude-3-opus-20240229":"claude-opus-4-20250514","claude-3-sonnet-20240229":"claude-sonnet-4-20250514","claude-3-haiku-20240307":"claude-3-5-sonnet-20241022","claude-3-5-sonnet-latest":"claude-sonnet-4-20250514","claude-3-5-haiku-latest":"claude-3-5-sonnet-20241022","accounts/fireworks/models/kimi-k2p5":"moonshotai/Kimi-K2.5","fireworks/accounts/fireworks/models/kimi-k2p5":"moonshotai/Kimi-K2.5","kimi-k2p5":"moonshotai/Kimi-K2.5","accounts/fireworks/models/kimi-k2":"moonshotai/Kimi-K2","fireworks/accounts/fireworks/models/kimi-k2":"moonshotai/Kimi-K2","kimi-k2":"moonshotai/Kimi-K2","qwen3.8-max":"qwen3.8-max-preview","mistral-large":"mistral-large-latest","mistral-small":"mistral-small-latest",codestral:"codestral-latest","codestral-2405":"codestral-2508","llama-3.3":"llama-3.3-70b-versatile","llama-3-70b":"llama-3.3-70b-versatile","llama-3-8b":"llama3-8b-8192"},o="__omniroute_customAliases__",n=globalThis;function i(){return n[o]||(n[o]={}),n[o]}e.s(["addCustomAlias",0,function(e,t){i()[e]=t},"getAllAliases",0,function(){return{...t,...i()}},"getBuiltInAliases",0,function(){return{...t}},"getCustomAliases",0,function(){return{...i()}},"removeCustomAlias",0,function(e){let t=i();return!!t[e]&&(delete t[e],!0)},"resolveModelAlias",0,function(e){if(!e)return e;let o=i();return o[e]?o[e]:t[e]?t[e]:e},"setCustomAliases",0,function(e){n[o]={...e}}])},662636,e=>e.a(async(t,o)=>{try{var n=e.i(614639),i=e.i(440959),s=t([n,i]);[n,i]=s.then?(await s)():s,e.s(["getAccountDisplayName",0,function(e){if(!e)return"Unknown Account";let t="string"==typeof e.name&&e.name.trim()||"string"==typeof e.displayName&&e.displayName.trim()||"string"==typeof e.email&&e.email.trim();return t||("string"==typeof e.id&&e.id?`Account #${e.id.slice(0,6)}`:"Unknown Account")},"getProviderDisplayName",0,function(e,t){if(t?.name?.trim())return t.name.trim();if(t?.prefix?.trim())return t.prefix.trim();if(!e)return"Unknown Provider";if((0,n.isCompatibleProviderConnectionId)(e)){if((0,i.isClaudeCodeCompatibleProvider)(e))return"CC Compatible";if((0,i.isOpenAICompatibleProvider)(e))return"Compatible (openai)";if((0,i.isAnthropicCompatibleProvider)(e))return"Compatible (anthropic)"}return e}]),o()}catch(e){o(e)}},!1),918521,e=>{"use strict";e.i(899378);var t=e.i(167213);async function o(){let e=(0,t.getUserDatabaseSettings)().retention.usageHistory,o=new Date;return o.setDate(o.getDate()-e),o.toISOString().split("T")[0]}async function n(){return(0,t.getUserDatabaseSettings)().aggregation.enabled}e.s(["getRawDataCutoffDate",0,o,"isAggregationEnabled",0,n])},15844,e=>{"use strict";var t=e.i(284655);let o=new Set(["minimax","kimi-coding","kimi-coding-apikey","xiaomi-mimo","bailian-coding-plan","qwen-cloud-token-plan","glm","glm-cn","claude","cc","opencode-go"]);function n(e){if(!e||!e.includes("/"))return e;let t=e.split("/");return t[t.length-1]}function i(e){let t=e?.cost_in_usd_ticks;return"number"==typeof t&&Number.isFinite(t)&&t>=0?t/1e10:null}function s(e,t=0){if("number"==typeof e&&Number.isFinite(e))return e;if("string"==typeof e&&e.trim().length>0){let o=Number(e);return Number.isFinite(o)?o:t}return t}function r(e){return"string"==typeof e?e.trim().toLowerCase():""}function a(e){return e.replace(/-(?:ultra|max|xhigh|high|medium|low|none)$/i,"")}function c(e,t,o){let i=r(e),s=r(o);if("codex"!==i&&"cx"!==i)return 1;if("flex"===s)return .5;if("priority"!==s&&"fast"!==s)return 1;let c=a(n(String(t||"")).toLowerCase()),u=c.replace(/-/g,"");return/^gpt-5\.6-(?:sol|terra|luna)$/.test(c)||/^gpt5\.6(?:sol|terra|luna)$/.test(u)?1.5:"gpt-5.5"===c||"gpt5.5"===u?2.5:"gpt-5.4"===c||"gpt5.4"===u?2:1}function u(e,n,r={}){if(!n)return 0;let a=i(n);if(null!==a)return a;if(!e||r.flatRateAsZero&&function(e){if(!e||"string"!=typeof e)return!1;let n=e.trim().toLowerCase();return!!n&&(!!o.has(n)||Object.prototype.hasOwnProperty.call(t.WEB_COOKIE_PROVIDERS,n))}(r.provider))return 0;let _=s(e.input,0),l=s(e.cached,_),p=s(e.output,0),m=s(e.reasoning,p),d=s(e.cache_creation,_),k=0,C=n.input??n.prompt_tokens??n.input_tokens??0,g=n.cacheRead??n.cached_tokens??n.cache_read_input_tokens??0,E=n.cacheCreation??n.cache_creation_input_tokens??0;k+=_/1e6*Math.max(0,C-g-E),g>0&&(k+=l/1e6*g),k+=p/1e6*(n.output??n.completion_tokens??n.output_tokens??0);let f=n.reasoning??n.reasoning_tokens??0;return f>0&&void 0!==e.reasoning&&null!==e.reasoning&&(k+=(m-p)/1e6*f),E>0&&(k+=d/1e6*E),k*c(r.provider,r.model,r.serviceTier)}async function _(t,o,s,c={}){if(!s||!t||!o)return 0;let l=i(s);if(null!==l)return l;try{let{getPricingForModel:i}=await e.A(605589),_=await i(t,o);if(!_){let e=n(o);e!==o&&(_=await i(t,e));let s=r(t);if(!_&&("codex"===s||"cx"===s)){let o=a(e);o!==e&&(_=await i(t,o))}}if(!_)return 0;let l=_&&"object"==typeof _&&!Array.isArray(_)?_:{};return u(l,s,{provider:t,model:o,...c})}catch(e){return console.error("Error calculating cost:",e),0}}async function l(t,o,i,r){if(!o||!i)return 0;try{let{getPricingForModel:a}=await e.A(605589),c=await a(o,i);if(!c){let e=n(i);e!==i&&(c=await a(o,e))}if(!c)return 0;let u=c;switch(t){case"image":if(!u)return 0;return s(u.output_cost_per_image??u.input_cost_per_image,0)*Math.max(0,Math.floor(s(r.n,0)));case"audio":if(!u)return 0;let _=s(r.seconds,0);if(_>0){let e=s(u.input_cost_per_second??u.output_cost_per_second,0);if(e>0)return e*_}let l=s(r.characters,0);if(l>0){let e=s(u.input_cost_per_character??u.output_cost_per_character,0);if(e>0)return Math.round(e*l*1e10)/1e10}return 0;case"rerank":if(!u)return 0;return s(u.search_unit_cost??u.input_cost_per_query,0)*Math.max(0,s(r.searchUnits,0));case"video":if(!u)return 0;return s(u.output_cost_per_video_per_second??u.input_cost_per_video_per_second,0)*s(r.seconds,0);default:return 0}}catch(e){return console.error("Error calculating modal cost:",e),0}}e.s(["calculateCost",0,_,"calculateModalCost",0,l,"computeCostFromPricing",0,u,"getCodexFastCostMultiplier",0,c,"normalizeModelName",0,n],15844)},897114,e=>e.a(async(t,o)=>{try{var n=e.i(899378),i=e.i(125852),s=e.i(27663),r=e.i(662636),a=e.i(15844),c=e.i(918521),u=e.i(538154),_=t([i,s,r]);function l(e){return e&&"object"==typeof e&&!Array.isArray(e)?e:{}}function p(e){return"string"==typeof e?e:""}[i,s,r]=_.then?(await _)():_;let g=`
  SUM(request_count) as request_count,
  COALESCE(SUM(tokens_input), 0) as tokens_input,
  COALESCE(SUM(tokens_output), 0) as tokens_output,
  COALESCE(SUM(tokens_cache_read), 0) as tokens_cache_read,
  COALESCE(SUM(tokens_cache_creation), 0) as tokens_cache_creation,
  COALESCE(SUM(tokens_reasoning), 0) as tokens_reasoning,
  COALESCE(SUM(cost_tokens_input), 0) as cost_tokens_input,
  COALESCE(SUM(cost_tokens_output), 0) as cost_tokens_output,
  COALESCE(SUM(cost_tokens_cache_read), 0) as cost_tokens_cache_read,
  COALESCE(SUM(cost_tokens_cache_creation), 0) as cost_tokens_cache_creation,
  COALESCE(SUM(cost_tokens_reasoning), 0) as cost_tokens_reasoning,
  COALESCE(SUM(stored_cost), 0.0) as stored_cost,
  MAX(timestamp) as last_used
`;async function m(e){let t=p(e.provider)||"unknown",o=p(e.model)||"unknown",n=p(e.service_tier)||"standard",i=(0,u.toNumber)(e.stored_cost),s=await (0,a.calculateCost)(t,o,{input:(0,u.toNumber)(e.cost_tokens_input??e.tokens_input),output:(0,u.toNumber)(e.cost_tokens_output??e.tokens_output),cacheRead:(0,u.toNumber)(e.cost_tokens_cache_read??e.tokens_cache_read),cacheCreation:(0,u.toNumber)(e.cost_tokens_cache_creation??e.tokens_cache_creation),reasoning:(0,u.toNumber)(e.cost_tokens_reasoning??e.tokens_reasoning)},{provider:t,serviceTier:n,flatRateAsZero:!0});return i+s}function d(e,t,o,n,i){e.requests+=t,e.promptTokens+=o,e.completionTokens+=n,e.cost+=i}async function k(e,t){if(!e||!t)return{costUsd:0,requests:0};let o=(0,n.getDbInstance)().prepare(`SELECT model,
          COALESCE(SUM(tokens_input), 0) AS input,
          COALESCE(SUM(tokens_output), 0) AS output,
          COALESCE(SUM(tokens_cache_read), 0) AS cacheRead,
          COALESCE(SUM(tokens_cache_creation), 0) AS cacheCreation,
          COALESCE(SUM(tokens_reasoning), 0) AS reasoning,
          COUNT(*) AS requests
       FROM usage_history
       WHERE connection_id = ? AND provider = ? AND success = 1
       GROUP BY model`).all(t,e),i=0,s=0;for(let t of o){s+=Math.max(0,Number(t.requests??0));let o="string"==typeof t.model?t.model:"",n={input:Number(t.input??0),output:Number(t.output??0),cacheRead:Number(t.cacheRead??0),cacheCreation:Number(t.cacheCreation??0),reasoning:Number(t.reasoning??0)};i+=await (0,a.calculateCost)(e,o,n,{provider:e,model:o,flatRateAsZero:!0})}return{costUsd:Math.max(0,i),requests:s}}async function C(){let t=(0,n.getDbInstance)(),o=await (0,c.isAggregationEnabled)(),a=o?await (0,c.getRawDataCutoffDate)():null,_=o?`
    SELECT
      provider,
      model,
      timestamp,
      connection_id,
      api_key_id,
      api_key_name,
      COALESCE(tokens_input, 0) as tokens_input,
      COALESCE(tokens_output, 0) as tokens_output,
      COALESCE(tokens_cache_read, 0) as tokens_cache_read,
      COALESCE(tokens_cache_creation, 0) as tokens_cache_creation,
      COALESCE(tokens_reasoning, 0) as tokens_reasoning,
      COALESCE(tokens_input, 0) as cost_tokens_input,
      COALESCE(tokens_output, 0) as cost_tokens_output,
      COALESCE(tokens_cache_read, 0) as cost_tokens_cache_read,
      COALESCE(tokens_cache_creation, 0) as cost_tokens_cache_creation,
      COALESCE(tokens_reasoning, 0) as cost_tokens_reasoning,
      0.0 as stored_cost,
      COALESCE(service_tier, 'standard') as service_tier,
      1 as request_count
    FROM usage_history
    WHERE DATE(timestamp) >= ?

    UNION ALL

    SELECT
      provider,
      model,
      date || 'T12:00:00.000Z' as timestamp,
      NULL as connection_id,
      NULL as api_key_id,
      NULL as api_key_name,
      COALESCE(total_input_tokens, 0) as tokens_input,
      COALESCE(total_output_tokens, 0) as tokens_output,
      0 as tokens_cache_read,
      0 as tokens_cache_creation,
      0 as tokens_reasoning,
      0 as cost_tokens_input,
      0 as cost_tokens_output,
      0 as cost_tokens_cache_read,
      0 as cost_tokens_cache_creation,
      0 as cost_tokens_reasoning,
      COALESCE(total_cost, 0.0) as stored_cost,
      'standard' as service_tier,
      COALESCE(total_requests, 0) as request_count
    FROM daily_usage_summary
    WHERE date < ?
  `:`
      SELECT
        provider,
        model,
        timestamp,
        connection_id,
        api_key_id,
        api_key_name,
        COALESCE(tokens_input, 0) as tokens_input,
        COALESCE(tokens_output, 0) as tokens_output,
        COALESCE(tokens_cache_read, 0) as tokens_cache_read,
        COALESCE(tokens_cache_creation, 0) as tokens_cache_creation,
        COALESCE(tokens_reasoning, 0) as tokens_reasoning,
        COALESCE(tokens_input, 0) as cost_tokens_input,
        COALESCE(tokens_output, 0) as cost_tokens_output,
        COALESCE(tokens_cache_read, 0) as cost_tokens_cache_read,
        COALESCE(tokens_cache_creation, 0) as cost_tokens_cache_creation,
        COALESCE(tokens_reasoning, 0) as cost_tokens_reasoning,
        0.0 as stored_cost,
        COALESCE(service_tier, 'standard') as service_tier,
        1 as request_count
      FROM usage_history
    `,k=o&&a?[a,a]:[],{getProviderConnections:C}=await e.A(605589),E=[];try{let e=await C();E=Array.isArray(e)?e:[]}catch{}let f={};for(let e of E){let t=l(e),o=p(t.id);o&&(f[o]=p(t.name)||p(t.email)||o)}let h=new Map;try{for(let e of(await (0,i.getApiKeys)()))"string"==typeof e.id&&"string"==typeof e.name&&h.set(e.id,e.name)}catch{}let A=(0,s.getPendingRequests)(),S={totalRequests:0,totalPromptTokens:0,totalCompletionTokens:0,totalCost:0,byProvider:{},byModel:{},byAccount:{},byApiKey:{},last10Minutes:[],pending:A,activeRequests:[]};for(let[e,t]of Object.entries(A.byAccount))for(let[o,n]of Object.entries(t))if(n>0){let t=f[e]||(0,r.getAccountDisplayName)({id:e}),i=o.match(/^(.*) \((.*)\)$/);S.activeRequests.push({model:i?i[1]:o,provider:i?i[2]:"unknown",account:t,count:n})}let y=new Date,O=new Date(6e4*Math.floor(y.getTime()/6e4)),b={};for(let e=0;e<10;e++){let t=new Date(O.getTime()-(9-e)*6e4).getTime();b[t]={requests:0,promptTokens:0,completionTokens:0,cost:0},S.last10Minutes.push(b[t])}let L=new Date(O.getTime()-54e4);for(let e of t.prepare(`
        WITH usage_source AS (${_})
        SELECT provider, model, service_tier, ${g}
        FROM usage_source
        GROUP BY provider, model, service_tier
      `).all(...k)){let t=l(e),o=p(t.provider)||"unknown",n=p(t.model)||"unknown",i=p(t.last_used)||new Date(0).toISOString(),s=(0,u.toNumber)(t.request_count),r=(0,u.toNumber)(t.tokens_input),a=(0,u.toNumber)(t.tokens_output),c=await m(t);S.totalRequests+=s,S.totalPromptTokens+=r,S.totalCompletionTokens+=a,S.totalCost+=c,S.byProvider[o]||(S.byProvider[o]={requests:0,promptTokens:0,completionTokens:0,cost:0}),d(S.byProvider[o],s,r,a,c);let _=`${n} (${o})`;S.byModel[_]||(S.byModel[_]={requests:0,promptTokens:0,completionTokens:0,cost:0,rawModel:n,provider:o,lastUsed:i}),d(S.byModel[_],s,r,a,c),new Date(i)>new Date(S.byModel[_].lastUsed||i)&&(S.byModel[_].lastUsed=i)}for(let e of t.prepare(`
        WITH usage_source AS (${_})
        SELECT provider, model, connection_id, service_tier, ${g}
        FROM usage_source
        WHERE connection_id IS NOT NULL AND connection_id != ''
        GROUP BY provider, model, connection_id, service_tier
      `).all(...k)){let t=l(e),o=p(t.provider)||"unknown",n=p(t.model)||"unknown",i=p(t.last_used)||new Date(0).toISOString(),s=p(t.connection_id),a=(0,u.toNumber)(t.request_count),c=(0,u.toNumber)(t.tokens_input),_=(0,u.toNumber)(t.tokens_output),k=await m(t);if(s){let e=f[s]||(0,r.getAccountDisplayName)({id:s}),t=`${n} (${o} - ${e})`;S.byAccount[t]||(S.byAccount[t]={requests:0,promptTokens:0,completionTokens:0,cost:0,rawModel:n,provider:o,connectionId:s,accountName:e,lastUsed:i}),d(S.byAccount[t],a,c,_,k),new Date(i)>new Date(S.byAccount[t].lastUsed||i)&&(S.byAccount[t].lastUsed=i)}}for(let e of t.prepare(`
        WITH usage_source AS (${_})
        SELECT provider, model, api_key_id, api_key_name, service_tier, ${g}
        FROM usage_source
        WHERE (api_key_id IS NOT NULL AND api_key_id != '')
           OR (api_key_name IS NOT NULL AND api_key_name != '')
        GROUP BY provider, model, api_key_id, api_key_name, service_tier
      `).all(...k)){let t=l(e),o=p(t.last_used)||new Date(0).toISOString(),n=p(t.api_key_id)||null,i=p(t.api_key_name)||null,s=(0,u.toNumber)(t.request_count),r=(0,u.toNumber)(t.tokens_input),a=(0,u.toNumber)(t.tokens_output),c=await m(t);if(n||i){let e=n?`id:${n}`:`name:${i||"unknown"}`,t=(n?h.get(n):void 0)||i||n||"unknown";S.byApiKey[e]||(S.byApiKey[e]={requests:0,promptTokens:0,completionTokens:0,cost:0,apiKeyId:n,apiKeyName:t,historicalApiKeyNames:[],lastUsed:o});let u=S.byApiKey[e];i&&!u.historicalApiKeyNames?.includes(i)&&u.historicalApiKeyNames?.push(i),u.apiKeyName=t,d(u,s,r,a,c),new Date(o)>new Date(u.lastUsed||o)&&(u.lastUsed=o)}}for(let e of t.prepare(`
        SELECT
          strftime('%Y-%m-%dT%H:%M:00.000Z', timestamp) as minute,
          provider,
          model,
          COALESCE(service_tier, 'standard') as service_tier,
          COUNT(*) as request_count,
          COALESCE(SUM(tokens_input), 0) as tokens_input,
          COALESCE(SUM(tokens_output), 0) as tokens_output,
          COALESCE(SUM(tokens_cache_read), 0) as tokens_cache_read,
          COALESCE(SUM(tokens_cache_creation), 0) as tokens_cache_creation,
          COALESCE(SUM(tokens_reasoning), 0) as tokens_reasoning
        FROM usage_history
        WHERE timestamp >= ? AND timestamp <= ?
        GROUP BY minute, provider, model, service_tier
      `).all(L.toISOString(),y.toISOString())){let t=l(e),o=p(t.minute),n=new Date(o).getTime();if(!b[n])continue;let i=(0,u.toNumber)(t.request_count),s=(0,u.toNumber)(t.tokens_input),r=(0,u.toNumber)(t.tokens_output),a=await m(t);d(b[n],i,s,r,a)}return S}e.s(["getConnectionSpendUsdSinceAdded",0,k,"getMonthlyProviderTokensForConnection",0,function(e,t){if(!e||!t)return 0;let o=(0,n.getDbInstance)(),i=new Date,s=new Date(Date.UTC(i.getUTCFullYear(),i.getUTCMonth(),1)).toISOString(),r=o.prepare(`SELECT COALESCE(SUM(tokens_input), 0)
            + COALESCE(SUM(tokens_output), 0)
            + COALESCE(SUM(tokens_cache_read), 0)
            + COALESCE(SUM(tokens_cache_creation), 0)
            + COALESCE(SUM(tokens_reasoning), 0) AS total
       FROM usage_history
       WHERE provider = ? AND connection_id = ? AND timestamp >= ?`).get(e,t,s);return Math.max(0,Number(r?.total??0))},"getUsageStats",0,C]),o()}catch(e){o(e)}},!1),614639,e=>e.a(async(t,o)=>{try{var n=e.i(440959),i=t([n]);[n]=i.then?(await i)():i;let s=RegExp(`^(?:${n.OPENAI_COMPATIBLE_PREFIX}(?:chat|responses)-|${n.ANTHROPIC_COMPATIBLE_PREFIX}(?:cc-)?)[0-9a-f-]+$`,"i");e.s(["isCompatibleProviderConnectionId",0,function(e){return"string"==typeof e&&s.test(e)}]),o()}catch(e){o(e)}},!1),538154,e=>{"use strict";e.s(["toNumber",0,function(e,t=0){if("number"==typeof e&&Number.isFinite(e))return e;if("string"==typeof e&&e.trim().length>0){let o=Number(e.trim());return Number.isFinite(o)?o:t}return t},"toNumberOrNull",0,function(e){if("number"==typeof e&&Number.isFinite(e))return e;if("string"==typeof e&&e.trim().length>0){let t=Number(e.trim());return Number.isFinite(t)?t:null}return null}])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__1jq4wcf._.js.map