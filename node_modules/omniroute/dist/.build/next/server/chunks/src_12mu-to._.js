module.exports=[662636,e=>e.a(async(t,o)=>{try{var n=e.i(614639),a=e.i(440959),s=t([n,a]);[n,a]=s.then?(await s)():s,e.s(["getAccountDisplayName",0,function(e){if(!e)return"Unknown Account";let t="string"==typeof e.name&&e.name.trim()||"string"==typeof e.displayName&&e.displayName.trim()||"string"==typeof e.email&&e.email.trim();return t||("string"==typeof e.id&&e.id?`Account #${e.id.slice(0,6)}`:"Unknown Account")},"getProviderDisplayName",0,function(e,t){if(t?.name?.trim())return t.name.trim();if(t?.prefix?.trim())return t.prefix.trim();if(!e)return"Unknown Provider";if((0,n.isCompatibleProviderConnectionId)(e)){if((0,a.isClaudeCodeCompatibleProvider)(e))return"CC Compatible";if((0,a.isOpenAICompatibleProvider)(e))return"Compatible (openai)";if((0,a.isAnthropicCompatibleProvider)(e))return"Compatible (anthropic)"}return e}]),o()}catch(e){o(e)}},!1),918521,e=>{"use strict";e.i(899378);var t=e.i(167213);async function o(){let e=(0,t.getUserDatabaseSettings)().retention.usageHistory,o=new Date;return o.setDate(o.getDate()-e),o.toISOString().split("T")[0]}async function n(){return(0,t.getUserDatabaseSettings)().aggregation.enabled}e.s(["getRawDataCutoffDate",0,o,"isAggregationEnabled",0,n])},15844,e=>{"use strict";var t=e.i(284655);let o=new Set(["minimax","kimi-coding","kimi-coding-apikey","xiaomi-mimo","bailian-coding-plan","qwen-cloud-token-plan","glm","glm-cn","claude","cc","opencode-go"]);function n(e){if(!e||!e.includes("/"))return e;let t=e.split("/");return t[t.length-1]}function a(e){let t=e?.cost_in_usd_ticks;return"number"==typeof t&&Number.isFinite(t)&&t>=0?t/1e10:null}function s(e,t=0){if("number"==typeof e&&Number.isFinite(e))return e;if("string"==typeof e&&e.trim().length>0){let o=Number(e);return Number.isFinite(o)?o:t}return t}function r(e){return"string"==typeof e?e.trim().toLowerCase():""}function i(e){return e.replace(/-(?:ultra|max|xhigh|high|medium|low|none)$/i,"")}function c(e,t,o){let a=r(e),s=r(o);if("codex"!==a&&"cx"!==a)return 1;if("flex"===s)return .5;if("priority"!==s&&"fast"!==s)return 1;let c=i(n(String(t||"")).toLowerCase()),u=c.replace(/-/g,"");return/^gpt-5\.6-(?:sol|terra|luna)$/.test(c)||/^gpt5\.6(?:sol|terra|luna)$/.test(u)?1.5:"gpt-5.5"===c||"gpt5.5"===u?2.5:"gpt-5.4"===c||"gpt5.4"===u?2:1}function u(e,n,r={}){if(!n)return 0;let i=a(n);if(null!==i)return i;if(!e||r.flatRateAsZero&&function(e){if(!e||"string"!=typeof e)return!1;let n=e.trim().toLowerCase();return!!n&&(!!o.has(n)||Object.prototype.hasOwnProperty.call(t.WEB_COOKIE_PROVIDERS,n))}(r.provider))return 0;let _=s(e.input,0),p=s(e.cached,_),l=s(e.output,0),d=s(e.reasoning,l),m=s(e.cache_creation,_),k=0,C=n.input??n.prompt_tokens??n.input_tokens??0,E=n.cacheRead??n.cached_tokens??n.cache_read_input_tokens??0,g=n.cacheCreation??n.cache_creation_input_tokens??0;k+=_/1e6*Math.max(0,C-E-g),E>0&&(k+=p/1e6*E),k+=l/1e6*(n.output??n.completion_tokens??n.output_tokens??0);let S=n.reasoning??n.reasoning_tokens??0;return S>0&&void 0!==e.reasoning&&null!==e.reasoning&&(k+=(d-l)/1e6*S),g>0&&(k+=m/1e6*g),k*c(r.provider,r.model,r.serviceTier)}async function _(t,o,s,c={}){if(!s||!t||!o)return 0;let p=a(s);if(null!==p)return p;try{let{getPricingForModel:a}=await e.A(605589),_=await a(t,o);if(!_){let e=n(o);e!==o&&(_=await a(t,e));let s=r(t);if(!_&&("codex"===s||"cx"===s)){let o=i(e);o!==e&&(_=await a(t,o))}}if(!_)return 0;let p=_&&"object"==typeof _&&!Array.isArray(_)?_:{};return u(p,s,{provider:t,model:o,...c})}catch(e){return console.error("Error calculating cost:",e),0}}async function p(t,o,a,r){if(!o||!a)return 0;try{let{getPricingForModel:i}=await e.A(605589),c=await i(o,a);if(!c){let e=n(a);e!==a&&(c=await i(o,e))}if(!c)return 0;let u=c;switch(t){case"image":if(!u)return 0;return s(u.output_cost_per_image??u.input_cost_per_image,0)*Math.max(0,Math.floor(s(r.n,0)));case"audio":if(!u)return 0;let _=s(r.seconds,0);if(_>0){let e=s(u.input_cost_per_second??u.output_cost_per_second,0);if(e>0)return e*_}let p=s(r.characters,0);if(p>0){let e=s(u.input_cost_per_character??u.output_cost_per_character,0);if(e>0)return Math.round(e*p*1e10)/1e10}return 0;case"rerank":if(!u)return 0;return s(u.search_unit_cost??u.input_cost_per_query,0)*Math.max(0,s(r.searchUnits,0));case"video":if(!u)return 0;return s(u.output_cost_per_video_per_second??u.input_cost_per_video_per_second,0)*s(r.seconds,0);default:return 0}}catch(e){return console.error("Error calculating modal cost:",e),0}}e.s(["calculateCost",0,_,"calculateModalCost",0,p,"computeCostFromPricing",0,u,"getCodexFastCostMultiplier",0,c,"normalizeModelName",0,n],15844)},897114,e=>e.a(async(t,o)=>{try{var n=e.i(899378),a=e.i(125852),s=e.i(27663),r=e.i(662636),i=e.i(15844),c=e.i(918521),u=e.i(538154),_=t([a,s,r]);function p(e){return e&&"object"==typeof e&&!Array.isArray(e)?e:{}}function l(e){return"string"==typeof e?e:""}[a,s,r]=_.then?(await _)():_;let E=`
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
`;async function d(e){let t=l(e.provider)||"unknown",o=l(e.model)||"unknown",n=l(e.service_tier)||"standard",a=(0,u.toNumber)(e.stored_cost),s=await (0,i.calculateCost)(t,o,{input:(0,u.toNumber)(e.cost_tokens_input??e.tokens_input),output:(0,u.toNumber)(e.cost_tokens_output??e.tokens_output),cacheRead:(0,u.toNumber)(e.cost_tokens_cache_read??e.tokens_cache_read),cacheCreation:(0,u.toNumber)(e.cost_tokens_cache_creation??e.tokens_cache_creation),reasoning:(0,u.toNumber)(e.cost_tokens_reasoning??e.tokens_reasoning)},{provider:t,serviceTier:n,flatRateAsZero:!0});return a+s}function m(e,t,o,n,a){e.requests+=t,e.promptTokens+=o,e.completionTokens+=n,e.cost+=a}async function k(e,t){if(!e||!t)return{costUsd:0,requests:0};let o=(0,n.getDbInstance)().prepare(`SELECT model,
          COALESCE(SUM(tokens_input), 0) AS input,
          COALESCE(SUM(tokens_output), 0) AS output,
          COALESCE(SUM(tokens_cache_read), 0) AS cacheRead,
          COALESCE(SUM(tokens_cache_creation), 0) AS cacheCreation,
          COALESCE(SUM(tokens_reasoning), 0) AS reasoning,
          COUNT(*) AS requests
       FROM usage_history
       WHERE connection_id = ? AND provider = ? AND success = 1
       GROUP BY model`).all(t,e),a=0,s=0;for(let t of o){s+=Math.max(0,Number(t.requests??0));let o="string"==typeof t.model?t.model:"",n={input:Number(t.input??0),output:Number(t.output??0),cacheRead:Number(t.cacheRead??0),cacheCreation:Number(t.cacheCreation??0),reasoning:Number(t.reasoning??0)};a+=await (0,i.calculateCost)(e,o,n,{provider:e,model:o,flatRateAsZero:!0})}return{costUsd:Math.max(0,a),requests:s}}async function C(){let t=(0,n.getDbInstance)(),o=await (0,c.isAggregationEnabled)(),i=o?await (0,c.getRawDataCutoffDate)():null,_=o?`
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
    `,k=o&&i?[i,i]:[],{getProviderConnections:C}=await e.A(605589),g=[];try{let e=await C();g=Array.isArray(e)?e:[]}catch{}let S={};for(let e of g){let t=p(e),o=l(t.id);o&&(S[o]=l(t.name)||l(t.email)||o)}let A=new Map;try{for(let e of(await (0,a.getApiKeys)()))"string"==typeof e.id&&"string"==typeof e.name&&A.set(e.id,e.name)}catch{}let f=(0,s.getPendingRequests)(),y={totalRequests:0,totalPromptTokens:0,totalCompletionTokens:0,totalCost:0,byProvider:{},byModel:{},byAccount:{},byApiKey:{},last10Minutes:[],pending:f,activeRequests:[]};for(let[e,t]of Object.entries(f.byAccount))for(let[o,n]of Object.entries(t))if(n>0){let t=S[e]||(0,r.getAccountDisplayName)({id:e}),a=o.match(/^(.*) \((.*)\)$/);y.activeRequests.push({model:a?a[1]:o,provider:a?a[2]:"unknown",account:t,count:n})}let h=new Date,O=new Date(6e4*Math.floor(h.getTime()/6e4)),L={};for(let e=0;e<10;e++){let t=new Date(O.getTime()-(9-e)*6e4).getTime();L[t]={requests:0,promptTokens:0,completionTokens:0,cost:0},y.last10Minutes.push(L[t])}let b=new Date(O.getTime()-54e4);for(let e of t.prepare(`
        WITH usage_source AS (${_})
        SELECT provider, model, service_tier, ${E}
        FROM usage_source
        GROUP BY provider, model, service_tier
      `).all(...k)){let t=p(e),o=l(t.provider)||"unknown",n=l(t.model)||"unknown",a=l(t.last_used)||new Date(0).toISOString(),s=(0,u.toNumber)(t.request_count),r=(0,u.toNumber)(t.tokens_input),i=(0,u.toNumber)(t.tokens_output),c=await d(t);y.totalRequests+=s,y.totalPromptTokens+=r,y.totalCompletionTokens+=i,y.totalCost+=c,y.byProvider[o]||(y.byProvider[o]={requests:0,promptTokens:0,completionTokens:0,cost:0}),m(y.byProvider[o],s,r,i,c);let _=`${n} (${o})`;y.byModel[_]||(y.byModel[_]={requests:0,promptTokens:0,completionTokens:0,cost:0,rawModel:n,provider:o,lastUsed:a}),m(y.byModel[_],s,r,i,c),new Date(a)>new Date(y.byModel[_].lastUsed||a)&&(y.byModel[_].lastUsed=a)}for(let e of t.prepare(`
        WITH usage_source AS (${_})
        SELECT provider, model, connection_id, service_tier, ${E}
        FROM usage_source
        WHERE connection_id IS NOT NULL AND connection_id != ''
        GROUP BY provider, model, connection_id, service_tier
      `).all(...k)){let t=p(e),o=l(t.provider)||"unknown",n=l(t.model)||"unknown",a=l(t.last_used)||new Date(0).toISOString(),s=l(t.connection_id),i=(0,u.toNumber)(t.request_count),c=(0,u.toNumber)(t.tokens_input),_=(0,u.toNumber)(t.tokens_output),k=await d(t);if(s){let e=S[s]||(0,r.getAccountDisplayName)({id:s}),t=`${n} (${o} - ${e})`;y.byAccount[t]||(y.byAccount[t]={requests:0,promptTokens:0,completionTokens:0,cost:0,rawModel:n,provider:o,connectionId:s,accountName:e,lastUsed:a}),m(y.byAccount[t],i,c,_,k),new Date(a)>new Date(y.byAccount[t].lastUsed||a)&&(y.byAccount[t].lastUsed=a)}}for(let e of t.prepare(`
        WITH usage_source AS (${_})
        SELECT provider, model, api_key_id, api_key_name, service_tier, ${E}
        FROM usage_source
        WHERE (api_key_id IS NOT NULL AND api_key_id != '')
           OR (api_key_name IS NOT NULL AND api_key_name != '')
        GROUP BY provider, model, api_key_id, api_key_name, service_tier
      `).all(...k)){let t=p(e),o=l(t.last_used)||new Date(0).toISOString(),n=l(t.api_key_id)||null,a=l(t.api_key_name)||null,s=(0,u.toNumber)(t.request_count),r=(0,u.toNumber)(t.tokens_input),i=(0,u.toNumber)(t.tokens_output),c=await d(t);if(n||a){let e=n?`id:${n}`:`name:${a||"unknown"}`,t=(n?A.get(n):void 0)||a||n||"unknown";y.byApiKey[e]||(y.byApiKey[e]={requests:0,promptTokens:0,completionTokens:0,cost:0,apiKeyId:n,apiKeyName:t,historicalApiKeyNames:[],lastUsed:o});let u=y.byApiKey[e];a&&!u.historicalApiKeyNames?.includes(a)&&u.historicalApiKeyNames?.push(a),u.apiKeyName=t,m(u,s,r,i,c),new Date(o)>new Date(u.lastUsed||o)&&(u.lastUsed=o)}}for(let e of t.prepare(`
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
      `).all(b.toISOString(),h.toISOString())){let t=p(e),o=l(t.minute),n=new Date(o).getTime();if(!L[n])continue;let a=(0,u.toNumber)(t.request_count),s=(0,u.toNumber)(t.tokens_input),r=(0,u.toNumber)(t.tokens_output),i=await d(t);m(L[n],a,s,r,i)}return y}e.s(["getConnectionSpendUsdSinceAdded",0,k,"getMonthlyProviderTokensForConnection",0,function(e,t){if(!e||!t)return 0;let o=(0,n.getDbInstance)(),a=new Date,s=new Date(Date.UTC(a.getUTCFullYear(),a.getUTCMonth(),1)).toISOString(),r=o.prepare(`SELECT COALESCE(SUM(tokens_input), 0)
            + COALESCE(SUM(tokens_output), 0)
            + COALESCE(SUM(tokens_cache_read), 0)
            + COALESCE(SUM(tokens_cache_creation), 0)
            + COALESCE(SUM(tokens_reasoning), 0) AS total
       FROM usage_history
       WHERE provider = ? AND connection_id = ? AND timestamp >= ?`).get(e,t,s);return Math.max(0,Number(r?.total??0))},"getUsageStats",0,C]),o()}catch(e){o(e)}},!1),614639,e=>e.a(async(t,o)=>{try{var n=e.i(440959),a=t([n]);[n]=a.then?(await a)():a;let s=RegExp(`^(?:${n.OPENAI_COMPATIBLE_PREFIX}(?:chat|responses)-|${n.ANTHROPIC_COMPATIBLE_PREFIX}(?:cc-)?)[0-9a-f-]+$`,"i");e.s(["isCompatibleProviderConnectionId",0,function(e){return"string"==typeof e&&s.test(e)}]),o()}catch(e){o(e)}},!1)];

//# sourceMappingURL=src_12mu-to._.js.map