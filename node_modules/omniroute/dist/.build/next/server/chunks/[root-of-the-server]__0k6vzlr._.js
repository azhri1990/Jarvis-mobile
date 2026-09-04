module.exports=[427699,(e,t,o)=>{t.exports=e.x("events",()=>require("events"))},688947,(e,t,o)=>{t.exports=e.x("stream",()=>require("stream"))},224361,(e,t,o)=>{t.exports=e.x("util",()=>require("util"))},406461,(e,t,o)=>{t.exports=e.x("zlib",()=>require("zlib"))},662636,e=>e.a(async(t,o)=>{try{var n=e.i(614639),s=e.i(440959),a=t([n,s]);[n,s]=a.then?(await a)():a,e.s(["getAccountDisplayName",0,function(e){if(!e)return"Unknown Account";let t="string"==typeof e.name&&e.name.trim()||"string"==typeof e.displayName&&e.displayName.trim()||"string"==typeof e.email&&e.email.trim();return t||("string"==typeof e.id&&e.id?`Account #${e.id.slice(0,6)}`:"Unknown Account")},"getProviderDisplayName",0,function(e,t){if(t?.name?.trim())return t.name.trim();if(t?.prefix?.trim())return t.prefix.trim();if(!e)return"Unknown Provider";if((0,n.isCompatibleProviderConnectionId)(e)){if((0,s.isClaudeCodeCompatibleProvider)(e))return"CC Compatible";if((0,s.isOpenAICompatibleProvider)(e))return"Compatible (openai)";if((0,s.isAnthropicCompatibleProvider)(e))return"Compatible (anthropic)"}return e}]),o()}catch(e){o(e)}},!1),918521,e=>{"use strict";e.i(899378);var t=e.i(167213);async function o(){let e=(0,t.getUserDatabaseSettings)().retention.usageHistory,o=new Date;return o.setDate(o.getDate()-e),o.toISOString().split("T")[0]}async function n(){return(0,t.getUserDatabaseSettings)().aggregation.enabled}e.s(["getRawDataCutoffDate",0,o,"isAggregationEnabled",0,n])},897114,e=>e.a(async(t,o)=>{try{var n=e.i(899378),s=e.i(125852),a=e.i(27663),r=e.i(662636),i=e.i(15844),c=e.i(918521),_=e.i(538154),u=t([s,a,r]);function p(e){return e&&"object"==typeof e&&!Array.isArray(e)?e:{}}function l(e){return"string"==typeof e?e:""}[s,a,r]=u.then?(await u)():u;let E=`
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
`;async function d(e){let t=l(e.provider)||"unknown",o=l(e.model)||"unknown",n=l(e.service_tier)||"standard",s=(0,_.toNumber)(e.stored_cost),a=await (0,i.calculateCost)(t,o,{input:(0,_.toNumber)(e.cost_tokens_input??e.tokens_input),output:(0,_.toNumber)(e.cost_tokens_output??e.tokens_output),cacheRead:(0,_.toNumber)(e.cost_tokens_cache_read??e.tokens_cache_read),cacheCreation:(0,_.toNumber)(e.cost_tokens_cache_creation??e.tokens_cache_creation),reasoning:(0,_.toNumber)(e.cost_tokens_reasoning??e.tokens_reasoning)},{provider:t,serviceTier:n,flatRateAsZero:!0});return s+a}function m(e,t,o,n,s){e.requests+=t,e.promptTokens+=o,e.completionTokens+=n,e.cost+=s}async function k(e,t){if(!e||!t)return{costUsd:0,requests:0};let o=(0,n.getDbInstance)().prepare(`SELECT model,
          COALESCE(SUM(tokens_input), 0) AS input,
          COALESCE(SUM(tokens_output), 0) AS output,
          COALESCE(SUM(tokens_cache_read), 0) AS cacheRead,
          COALESCE(SUM(tokens_cache_creation), 0) AS cacheCreation,
          COALESCE(SUM(tokens_reasoning), 0) AS reasoning,
          COUNT(*) AS requests
       FROM usage_history
       WHERE connection_id = ? AND provider = ? AND success = 1
       GROUP BY model`).all(t,e),s=0,a=0;for(let t of o){a+=Math.max(0,Number(t.requests??0));let o="string"==typeof t.model?t.model:"",n={input:Number(t.input??0),output:Number(t.output??0),cacheRead:Number(t.cacheRead??0),cacheCreation:Number(t.cacheCreation??0),reasoning:Number(t.reasoning??0)};s+=await (0,i.calculateCost)(e,o,n,{provider:e,model:o,flatRateAsZero:!0})}return{costUsd:Math.max(0,s),requests:a}}async function C(){let t=(0,n.getDbInstance)(),o=await (0,c.isAggregationEnabled)(),i=o?await (0,c.getRawDataCutoffDate)():null,u=o?`
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
    `,k=o&&i?[i,i]:[],{getProviderConnections:C}=await e.A(605589),S=[];try{let e=await C();S=Array.isArray(e)?e:[]}catch{}let A={};for(let e of S){let t=p(e),o=l(t.id);o&&(A[o]=l(t.name)||l(t.email)||o)}let g=new Map;try{for(let e of(await (0,s.getApiKeys)()))"string"==typeof e.id&&"string"==typeof e.name&&g.set(e.id,e.name)}catch{}let y=(0,a.getPendingRequests)(),O={totalRequests:0,totalPromptTokens:0,totalCompletionTokens:0,totalCost:0,byProvider:{},byModel:{},byAccount:{},byApiKey:{},last10Minutes:[],pending:y,activeRequests:[]};for(let[e,t]of Object.entries(y.byAccount))for(let[o,n]of Object.entries(t))if(n>0){let t=A[e]||(0,r.getAccountDisplayName)({id:e}),s=o.match(/^(.*) \((.*)\)$/);O.activeRequests.push({model:s?s[1]:o,provider:s?s[2]:"unknown",account:t,count:n})}let h=new Date,L=new Date(6e4*Math.floor(h.getTime()/6e4)),b={};for(let e=0;e<10;e++){let t=new Date(L.getTime()-(9-e)*6e4).getTime();b[t]={requests:0,promptTokens:0,completionTokens:0,cost:0},O.last10Minutes.push(b[t])}let f=new Date(L.getTime()-54e4);for(let e of t.prepare(`
        WITH usage_source AS (${u})
        SELECT provider, model, service_tier, ${E}
        FROM usage_source
        GROUP BY provider, model, service_tier
      `).all(...k)){let t=p(e),o=l(t.provider)||"unknown",n=l(t.model)||"unknown",s=l(t.last_used)||new Date(0).toISOString(),a=(0,_.toNumber)(t.request_count),r=(0,_.toNumber)(t.tokens_input),i=(0,_.toNumber)(t.tokens_output),c=await d(t);O.totalRequests+=a,O.totalPromptTokens+=r,O.totalCompletionTokens+=i,O.totalCost+=c,O.byProvider[o]||(O.byProvider[o]={requests:0,promptTokens:0,completionTokens:0,cost:0}),m(O.byProvider[o],a,r,i,c);let u=`${n} (${o})`;O.byModel[u]||(O.byModel[u]={requests:0,promptTokens:0,completionTokens:0,cost:0,rawModel:n,provider:o,lastUsed:s}),m(O.byModel[u],a,r,i,c),new Date(s)>new Date(O.byModel[u].lastUsed||s)&&(O.byModel[u].lastUsed=s)}for(let e of t.prepare(`
        WITH usage_source AS (${u})
        SELECT provider, model, connection_id, service_tier, ${E}
        FROM usage_source
        WHERE connection_id IS NOT NULL AND connection_id != ''
        GROUP BY provider, model, connection_id, service_tier
      `).all(...k)){let t=p(e),o=l(t.provider)||"unknown",n=l(t.model)||"unknown",s=l(t.last_used)||new Date(0).toISOString(),a=l(t.connection_id),i=(0,_.toNumber)(t.request_count),c=(0,_.toNumber)(t.tokens_input),u=(0,_.toNumber)(t.tokens_output),k=await d(t);if(a){let e=A[a]||(0,r.getAccountDisplayName)({id:a}),t=`${n} (${o} - ${e})`;O.byAccount[t]||(O.byAccount[t]={requests:0,promptTokens:0,completionTokens:0,cost:0,rawModel:n,provider:o,connectionId:a,accountName:e,lastUsed:s}),m(O.byAccount[t],i,c,u,k),new Date(s)>new Date(O.byAccount[t].lastUsed||s)&&(O.byAccount[t].lastUsed=s)}}for(let e of t.prepare(`
        WITH usage_source AS (${u})
        SELECT provider, model, api_key_id, api_key_name, service_tier, ${E}
        FROM usage_source
        WHERE (api_key_id IS NOT NULL AND api_key_id != '')
           OR (api_key_name IS NOT NULL AND api_key_name != '')
        GROUP BY provider, model, api_key_id, api_key_name, service_tier
      `).all(...k)){let t=p(e),o=l(t.last_used)||new Date(0).toISOString(),n=l(t.api_key_id)||null,s=l(t.api_key_name)||null,a=(0,_.toNumber)(t.request_count),r=(0,_.toNumber)(t.tokens_input),i=(0,_.toNumber)(t.tokens_output),c=await d(t);if(n||s){let e=n?`id:${n}`:`name:${s||"unknown"}`,t=(n?g.get(n):void 0)||s||n||"unknown";O.byApiKey[e]||(O.byApiKey[e]={requests:0,promptTokens:0,completionTokens:0,cost:0,apiKeyId:n,apiKeyName:t,historicalApiKeyNames:[],lastUsed:o});let _=O.byApiKey[e];s&&!_.historicalApiKeyNames?.includes(s)&&_.historicalApiKeyNames?.push(s),_.apiKeyName=t,m(_,a,r,i,c),new Date(o)>new Date(_.lastUsed||o)&&(_.lastUsed=o)}}for(let e of t.prepare(`
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
      `).all(f.toISOString(),h.toISOString())){let t=p(e),o=l(t.minute),n=new Date(o).getTime();if(!b[n])continue;let s=(0,_.toNumber)(t.request_count),a=(0,_.toNumber)(t.tokens_input),r=(0,_.toNumber)(t.tokens_output),i=await d(t);m(b[n],s,a,r,i)}return O}e.s(["getConnectionSpendUsdSinceAdded",0,k,"getMonthlyProviderTokensForConnection",0,function(e,t){if(!e||!t)return 0;let o=(0,n.getDbInstance)(),s=new Date,a=new Date(Date.UTC(s.getUTCFullYear(),s.getUTCMonth(),1)).toISOString(),r=o.prepare(`SELECT COALESCE(SUM(tokens_input), 0)
            + COALESCE(SUM(tokens_output), 0)
            + COALESCE(SUM(tokens_cache_read), 0)
            + COALESCE(SUM(tokens_cache_creation), 0)
            + COALESCE(SUM(tokens_reasoning), 0) AS total
       FROM usage_history
       WHERE provider = ? AND connection_id = ? AND timestamp >= ?`).get(e,t,a);return Math.max(0,Number(r?.total??0))},"getUsageStats",0,C]),o()}catch(e){o(e)}},!1),614639,e=>e.a(async(t,o)=>{try{var n=e.i(440959),s=t([n]);[n]=s.then?(await s)():s;let a=RegExp(`^(?:${n.OPENAI_COMPATIBLE_PREFIX}(?:chat|responses)-|${n.ANTHROPIC_COMPATIBLE_PREFIX}(?:cc-)?)[0-9a-f-]+$`,"i");e.s(["isCompatibleProviderConnectionId",0,function(e){return"string"==typeof e&&a.test(e)}]),o()}catch(e){o(e)}},!1),538154,e=>{"use strict";e.s(["toNumber",0,function(e,t=0){if("number"==typeof e&&Number.isFinite(e))return e;if("string"==typeof e&&e.trim().length>0){let o=Number(e.trim());return Number.isFinite(o)?o:t}return t},"toNumberOrNull",0,function(e){if("number"==typeof e&&Number.isFinite(e))return e;if("string"==typeof e&&e.trim().length>0){let t=Number(e.trim());return Number.isFinite(t)?t:null}return null}])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__0k6vzlr._.js.map