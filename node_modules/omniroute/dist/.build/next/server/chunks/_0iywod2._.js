module.exports=[496727,e=>{"use strict";e.s(["FORMATS",0,{OPENAI:"openai",OPENAI_RESPONSES:"openai-responses",OPENAI_RESPONSE:"openai-response",CLAUDE:"claude",GEMINI:"gemini",CODEX:"codex",ANTIGRAVITY:"antigravity",KIRO:"kiro",CURSOR:"cursor"}])},662636,e=>e.a(async(t,o)=>{try{var n=e.i(614639),r=e.i(440959),s=t([n,r]);[n,r]=s.then?(await s)():s,e.s(["getAccountDisplayName",0,function(e){if(!e)return"Unknown Account";let t="string"==typeof e.name&&e.name.trim()||"string"==typeof e.displayName&&e.displayName.trim()||"string"==typeof e.email&&e.email.trim();return t||("string"==typeof e.id&&e.id?`Account #${e.id.slice(0,6)}`:"Unknown Account")},"getProviderDisplayName",0,function(e,t){if(t?.name?.trim())return t.name.trim();if(t?.prefix?.trim())return t.prefix.trim();if(!e)return"Unknown Provider";if((0,n.isCompatibleProviderConnectionId)(e)){if((0,r.isClaudeCodeCompatibleProvider)(e))return"CC Compatible";if((0,r.isOpenAICompatibleProvider)(e))return"Compatible (openai)";if((0,r.isAnthropicCompatibleProvider)(e))return"Compatible (anthropic)"}return e}]),o()}catch(e){o(e)}},!1),15844,e=>{"use strict";var t=e.i(284655);let o=new Set(["minimax","kimi-coding","kimi-coding-apikey","xiaomi-mimo","bailian-coding-plan","qwen-cloud-token-plan","glm","glm-cn","claude","cc","opencode-go"]);function n(e){if(!e||!e.includes("/"))return e;let t=e.split("/");return t[t.length-1]}function r(e){let t=e?.cost_in_usd_ticks;return"number"==typeof t&&Number.isFinite(t)&&t>=0?t/1e10:null}function s(e,t=0){if("number"==typeof e&&Number.isFinite(e))return e;if("string"==typeof e&&e.trim().length>0){let o=Number(e);return Number.isFinite(o)?o:t}return t}function a(e){return"string"==typeof e?e.trim().toLowerCase():""}function i(e){return e.replace(/-(?:ultra|max|xhigh|high|medium|low|none)$/i,"")}function c(e,t,o){let r=a(e),s=a(o);if("codex"!==r&&"cx"!==r)return 1;if("flex"===s)return .5;if("priority"!==s&&"fast"!==s)return 1;let c=i(n(String(t||"")).toLowerCase()),u=c.replace(/-/g,"");return/^gpt-5\.6-(?:sol|terra|luna)$/.test(c)||/^gpt5\.6(?:sol|terra|luna)$/.test(u)?1.5:"gpt-5.5"===c||"gpt5.5"===u?2.5:"gpt-5.4"===c||"gpt5.4"===u?2:1}function u(e,n,a={}){if(!n)return 0;let i=r(n);if(null!==i)return i;if(!e||a.flatRateAsZero&&function(e){if(!e||"string"!=typeof e)return!1;let n=e.trim().toLowerCase();return!!n&&(!!o.has(n)||Object.prototype.hasOwnProperty.call(t.WEB_COOKIE_PROVIDERS,n))}(a.provider))return 0;let _=s(e.input,0),l=s(e.cached,_),p=s(e.output,0),d=s(e.reasoning,p),m=s(e.cache_creation,_),k=0,C=n.input??n.prompt_tokens??n.input_tokens??0,E=n.cacheRead??n.cached_tokens??n.cache_read_input_tokens??0,S=n.cacheCreation??n.cache_creation_input_tokens??0;k+=_/1e6*Math.max(0,C-E-S),E>0&&(k+=l/1e6*E),k+=p/1e6*(n.output??n.completion_tokens??n.output_tokens??0);let f=n.reasoning??n.reasoning_tokens??0;return f>0&&void 0!==e.reasoning&&null!==e.reasoning&&(k+=(d-p)/1e6*f),S>0&&(k+=m/1e6*S),k*c(a.provider,a.model,a.serviceTier)}async function _(t,o,s,c={}){if(!s||!t||!o)return 0;let l=r(s);if(null!==l)return l;try{let{getPricingForModel:r}=await e.A(605589),_=await r(t,o);if(!_){let e=n(o);e!==o&&(_=await r(t,e));let s=a(t);if(!_&&("codex"===s||"cx"===s)){let o=i(e);o!==e&&(_=await r(t,o))}}if(!_)return 0;let l=_&&"object"==typeof _&&!Array.isArray(_)?_:{};return u(l,s,{provider:t,model:o,...c})}catch(e){return console.error("Error calculating cost:",e),0}}async function l(t,o,r,a){if(!o||!r)return 0;try{let{getPricingForModel:i}=await e.A(605589),c=await i(o,r);if(!c){let e=n(r);e!==r&&(c=await i(o,e))}if(!c)return 0;let u=c;switch(t){case"image":if(!u)return 0;return s(u.output_cost_per_image??u.input_cost_per_image,0)*Math.max(0,Math.floor(s(a.n,0)));case"audio":if(!u)return 0;let _=s(a.seconds,0);if(_>0){let e=s(u.input_cost_per_second??u.output_cost_per_second,0);if(e>0)return e*_}let l=s(a.characters,0);if(l>0){let e=s(u.input_cost_per_character??u.output_cost_per_character,0);if(e>0)return Math.round(e*l*1e10)/1e10}return 0;case"rerank":if(!u)return 0;return s(u.search_unit_cost??u.input_cost_per_query,0)*Math.max(0,s(a.searchUnits,0));case"video":if(!u)return 0;return s(u.output_cost_per_video_per_second??u.input_cost_per_video_per_second,0)*s(a.seconds,0);default:return 0}}catch(e){return console.error("Error calculating modal cost:",e),0}}e.s(["calculateCost",0,_,"calculateModalCost",0,l,"computeCostFromPricing",0,u,"getCodexFastCostMultiplier",0,c,"normalizeModelName",0,n],15844)},897114,e=>e.a(async(t,o)=>{try{var n=e.i(899378),r=e.i(125852),s=e.i(27663),a=e.i(662636),i=e.i(15844),c=e.i(918521),u=e.i(538154),_=t([r,s,a]);function l(e){return e&&"object"==typeof e&&!Array.isArray(e)?e:{}}function p(e){return"string"==typeof e?e:""}[r,s,a]=_.then?(await _)():_;let E=`
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
`;async function d(e){let t=p(e.provider)||"unknown",o=p(e.model)||"unknown",n=p(e.service_tier)||"standard",r=(0,u.toNumber)(e.stored_cost),s=await (0,i.calculateCost)(t,o,{input:(0,u.toNumber)(e.cost_tokens_input??e.tokens_input),output:(0,u.toNumber)(e.cost_tokens_output??e.tokens_output),cacheRead:(0,u.toNumber)(e.cost_tokens_cache_read??e.tokens_cache_read),cacheCreation:(0,u.toNumber)(e.cost_tokens_cache_creation??e.tokens_cache_creation),reasoning:(0,u.toNumber)(e.cost_tokens_reasoning??e.tokens_reasoning)},{provider:t,serviceTier:n,flatRateAsZero:!0});return r+s}function m(e,t,o,n,r){e.requests+=t,e.promptTokens+=o,e.completionTokens+=n,e.cost+=r}async function k(e,t){if(!e||!t)return{costUsd:0,requests:0};let o=(0,n.getDbInstance)().prepare(`SELECT model,
          COALESCE(SUM(tokens_input), 0) AS input,
          COALESCE(SUM(tokens_output), 0) AS output,
          COALESCE(SUM(tokens_cache_read), 0) AS cacheRead,
          COALESCE(SUM(tokens_cache_creation), 0) AS cacheCreation,
          COALESCE(SUM(tokens_reasoning), 0) AS reasoning,
          COUNT(*) AS requests
       FROM usage_history
       WHERE connection_id = ? AND provider = ? AND success = 1
       GROUP BY model`).all(t,e),r=0,s=0;for(let t of o){s+=Math.max(0,Number(t.requests??0));let o="string"==typeof t.model?t.model:"",n={input:Number(t.input??0),output:Number(t.output??0),cacheRead:Number(t.cacheRead??0),cacheCreation:Number(t.cacheCreation??0),reasoning:Number(t.reasoning??0)};r+=await (0,i.calculateCost)(e,o,n,{provider:e,model:o,flatRateAsZero:!0})}return{costUsd:Math.max(0,r),requests:s}}async function C(){let t=(0,n.getDbInstance)(),o=await (0,c.isAggregationEnabled)(),i=o?await (0,c.getRawDataCutoffDate)():null,_=o?`
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
    `,k=o&&i?[i,i]:[],{getProviderConnections:C}=await e.A(605589),S=[];try{let e=await C();S=Array.isArray(e)?e:[]}catch{}let f={};for(let e of S){let t=l(e),o=p(t.id);o&&(f[o]=p(t.name)||p(t.email)||o)}let g=new Map;try{for(let e of(await (0,r.getApiKeys)()))"string"==typeof e.id&&"string"==typeof e.name&&g.set(e.id,e.name)}catch{}let A=(0,s.getPendingRequests)(),h={totalRequests:0,totalPromptTokens:0,totalCompletionTokens:0,totalCost:0,byProvider:{},byModel:{},byAccount:{},byApiKey:{},last10Minutes:[],pending:A,activeRequests:[]};for(let[e,t]of Object.entries(A.byAccount))for(let[o,n]of Object.entries(t))if(n>0){let t=f[e]||(0,a.getAccountDisplayName)({id:e}),r=o.match(/^(.*) \((.*)\)$/);h.activeRequests.push({model:r?r[1]:o,provider:r?r[2]:"unknown",account:t,count:n})}let y=new Date,O=new Date(6e4*Math.floor(y.getTime()/6e4)),L={};for(let e=0;e<10;e++){let t=new Date(O.getTime()-(9-e)*6e4).getTime();L[t]={requests:0,promptTokens:0,completionTokens:0,cost:0},h.last10Minutes.push(L[t])}let b=new Date(O.getTime()-54e4);for(let e of t.prepare(`
        WITH usage_source AS (${_})
        SELECT provider, model, service_tier, ${E}
        FROM usage_source
        GROUP BY provider, model, service_tier
      `).all(...k)){let t=l(e),o=p(t.provider)||"unknown",n=p(t.model)||"unknown",r=p(t.last_used)||new Date(0).toISOString(),s=(0,u.toNumber)(t.request_count),a=(0,u.toNumber)(t.tokens_input),i=(0,u.toNumber)(t.tokens_output),c=await d(t);h.totalRequests+=s,h.totalPromptTokens+=a,h.totalCompletionTokens+=i,h.totalCost+=c,h.byProvider[o]||(h.byProvider[o]={requests:0,promptTokens:0,completionTokens:0,cost:0}),m(h.byProvider[o],s,a,i,c);let _=`${n} (${o})`;h.byModel[_]||(h.byModel[_]={requests:0,promptTokens:0,completionTokens:0,cost:0,rawModel:n,provider:o,lastUsed:r}),m(h.byModel[_],s,a,i,c),new Date(r)>new Date(h.byModel[_].lastUsed||r)&&(h.byModel[_].lastUsed=r)}for(let e of t.prepare(`
        WITH usage_source AS (${_})
        SELECT provider, model, connection_id, service_tier, ${E}
        FROM usage_source
        WHERE connection_id IS NOT NULL AND connection_id != ''
        GROUP BY provider, model, connection_id, service_tier
      `).all(...k)){let t=l(e),o=p(t.provider)||"unknown",n=p(t.model)||"unknown",r=p(t.last_used)||new Date(0).toISOString(),s=p(t.connection_id),i=(0,u.toNumber)(t.request_count),c=(0,u.toNumber)(t.tokens_input),_=(0,u.toNumber)(t.tokens_output),k=await d(t);if(s){let e=f[s]||(0,a.getAccountDisplayName)({id:s}),t=`${n} (${o} - ${e})`;h.byAccount[t]||(h.byAccount[t]={requests:0,promptTokens:0,completionTokens:0,cost:0,rawModel:n,provider:o,connectionId:s,accountName:e,lastUsed:r}),m(h.byAccount[t],i,c,_,k),new Date(r)>new Date(h.byAccount[t].lastUsed||r)&&(h.byAccount[t].lastUsed=r)}}for(let e of t.prepare(`
        WITH usage_source AS (${_})
        SELECT provider, model, api_key_id, api_key_name, service_tier, ${E}
        FROM usage_source
        WHERE (api_key_id IS NOT NULL AND api_key_id != '')
           OR (api_key_name IS NOT NULL AND api_key_name != '')
        GROUP BY provider, model, api_key_id, api_key_name, service_tier
      `).all(...k)){let t=l(e),o=p(t.last_used)||new Date(0).toISOString(),n=p(t.api_key_id)||null,r=p(t.api_key_name)||null,s=(0,u.toNumber)(t.request_count),a=(0,u.toNumber)(t.tokens_input),i=(0,u.toNumber)(t.tokens_output),c=await d(t);if(n||r){let e=n?`id:${n}`:`name:${r||"unknown"}`,t=(n?g.get(n):void 0)||r||n||"unknown";h.byApiKey[e]||(h.byApiKey[e]={requests:0,promptTokens:0,completionTokens:0,cost:0,apiKeyId:n,apiKeyName:t,historicalApiKeyNames:[],lastUsed:o});let u=h.byApiKey[e];r&&!u.historicalApiKeyNames?.includes(r)&&u.historicalApiKeyNames?.push(r),u.apiKeyName=t,m(u,s,a,i,c),new Date(o)>new Date(u.lastUsed||o)&&(u.lastUsed=o)}}for(let e of t.prepare(`
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
      `).all(b.toISOString(),y.toISOString())){let t=l(e),o=p(t.minute),n=new Date(o).getTime();if(!L[n])continue;let r=(0,u.toNumber)(t.request_count),s=(0,u.toNumber)(t.tokens_input),a=(0,u.toNumber)(t.tokens_output),i=await d(t);m(L[n],r,s,a,i)}return h}e.s(["getConnectionSpendUsdSinceAdded",0,k,"getMonthlyProviderTokensForConnection",0,function(e,t){if(!e||!t)return 0;let o=(0,n.getDbInstance)(),r=new Date,s=new Date(Date.UTC(r.getUTCFullYear(),r.getUTCMonth(),1)).toISOString(),a=o.prepare(`SELECT COALESCE(SUM(tokens_input), 0)
            + COALESCE(SUM(tokens_output), 0)
            + COALESCE(SUM(tokens_cache_read), 0)
            + COALESCE(SUM(tokens_cache_creation), 0)
            + COALESCE(SUM(tokens_reasoning), 0) AS total
       FROM usage_history
       WHERE provider = ? AND connection_id = ? AND timestamp >= ?`).get(e,t,s);return Math.max(0,Number(a?.total??0))},"getUsageStats",0,C]),o()}catch(e){o(e)}},!1),312125,e=>e.a(async(t,o)=>{try{var n=e.i(461145),r=e.i(27663);e.i(15844);var s=e.i(897114),a=e.i(828688),i=t([n,r,s,a]);[n,r,s,a]=i.then?(await i)():i,e.s([]),o()}catch(e){o(e)}},!1),208896,e=>{"use strict";function t(e,o=""){for(let t of e){let e=function(e,t=3){if(!e)return"";let o=e.trim();return o?o.includes("@")?function(e,t=3){if(!e)return"";if(!e.includes("@"))return e;let o=e.lastIndexOf("@"),n=e.slice(0,o),r=e.slice(o+1);if(n.length<=t)return e;let s=n.slice(0,t)+"*".repeat(n.length-t);if(r.length<=t)return`${s}@${r}`;let a="*".repeat(r.length-t)+r.slice(r.length-t);return`${s}@${a}`}(o,t):o:""}(t);if(e)return e}return o}e.s(["pickDisplayValue",0,function(e,o,n=""){if(o){for(let t of e)if(t?.trim())return t.trim();return n}return t(e,n)},"pickMaskedDisplayValue",0,t])}];

//# sourceMappingURL=_0iywod2._.js.map