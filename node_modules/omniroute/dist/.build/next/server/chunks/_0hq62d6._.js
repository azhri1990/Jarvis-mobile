module.exports=[948187,e=>e.a(async(t,s)=>{try{var r=e.i(623336),n=e.i(574835),o=e.i(260222),l=t([n]);[n]=l.then?(await l)():l;let a={listProviders:()=>r.PoolRegistry.listProviders(),getStats:e=>r.PoolRegistry.getStats(e),getSessionDetails:e=>r.PoolRegistry.getSessionDetails(e),isProviderInCooldown:e=>(0,n.isProviderInCooldown)(e),getProviderCooldownRemainingMs:e=>(0,n.getProviderCooldownRemainingMs)(e),getProviderBreakerState:e=>{let t=(0,o.getAllCircuitBreakerStatuses)().find(t=>t.name===e);return t?{state:t.state,failureCount:t.failureCount,lastFailureTime:t.lastFailureTime,retryAfterMs:t.retryAfterMs}:null}};e.s(["getWebSessionPoolHealth",0,function(e,t=a){let s=new Date().toISOString(),r=(e?[e]:t.listProviders()).map(e=>{let s=t.getStats(e),r=t.getSessionDetails(e),n=function(e){if(!e)return null;let t=Date.now()-e.createdAt;return{totalSessions:e.sessions.total,activeSessions:e.sessions.active,cooldownSessions:e.sessions.cooldown,deadSessions:e.sessions.dead,totalRequests:e.requests.total,successfulRequests:e.requests.success,successRate:e.successRate,throughput:e.throughput,uptime:function(e){if(e<=0)return"none";let t=Math.floor(e/1e3);if(t<60)return`${t}s`;let s=Math.floor(t/60);if(s<60)return`${s}m`;let r=Math.floor(s/60),n=s%60;return 0===n?`${r}h`:`${r}h ${n}m`}(t)}}(s),o=function(e,t){let s=t.getProviderBreakerState(e);if(!s)return null;let r=t.isProviderInCooldown(e),n=t.getProviderCooldownRemainingMs(e);return{state:s.state??"UNKNOWN",inCooldown:r,cooldownRemainingMs:n,failureCount:s.failureCount??0,lastFailureAt:s.lastFailureTime??null}}(e,t),l=r?r.map(e=>({id:e.id,fingerprint:e.fingerprint,status:e.status,totalRequests:e.totalRequests,successfulRequests:e.successfulRequests,successRate:e.successRate,inflight:e.inflight,cooldownRemaining:e.cooldownRemaining,age:e.age})):[],{health:a,issues:i}=function(e,t){let s=[];if(t?.inCooldown)return s.push(`breaker OPEN (cooldown ${t.cooldownRemainingMs??0}ms remaining)`),{health:"down",issues:s};if(e){if(e.totalSessions>0&&0===e.activeSessions&&0===e.cooldownSessions)return s.push(`all ${e.deadSessions} sessions dead`),{health:"down",issues:s};if(e.totalRequests>0){let t=function(e){if(!e)return NaN;let t=parseFloat(e.replace("%",""));return Number.isFinite(t)?t:NaN}(e.successRate);Number.isFinite(t)&&t<80&&s.push(`success rate ${e.successRate} below 80% threshold`)}if(e.totalSessions>0&&(e.cooldownSessions+e.deadSessions)/e.totalSessions>.5&&s.push(`${e.cooldownSessions+e.deadSessions}/${e.totalSessions} sessions in cooldown/dead`),s.length>0)return{health:"degraded",issues:s}}return{health:"healthy",issues:s}}(n,o);return{provider:e,pool:n,breaker:o,sessions:l,health:a,issues:i}});return{checkedAt:s,providers:r}}]),s()}catch(e){s(e)}},!1),458622,e=>e.a(async(t,s)=>{try{var r=e.i(186920),n=e.i(748648),o=e.i(899378),l=e.i(260222),a=e.i(574835),i=e.i(821518),u=e.i(948187),d=t([r,n,a,u]);[r,n,a,u]=d.then?(await d)():d;let w={"1h":36e5,"24h":864e5,"7d":6048e5,"30d":2592e6},C=new Set(["banned","expired","credits_exhausted"]);function c(e){return"string"==typeof e&&e.trim()?e.trim():null}function f(e){let t=c(e);return t?(0,i.resolveProviderAlias)(t)??t:null}function h(e){if("number"==typeof e&&Number.isFinite(e))return e;if("string"==typeof e&&e.trim()){let t=Number(e);if(Number.isFinite(t))return t}return 0}function m(e){if("number"==typeof e&&Number.isFinite(e))return e;if("string"==typeof e&&e.trim()){let t=Number(e);if(Number.isFinite(t))return t;let s=Date.parse(e);return Number.isFinite(s)?s:null}return null}function g(e){return!1!==e&&0!==e}function p(e){let t=c(e.testStatus)?.toLowerCase(),s=c(e.lastErrorType)?.toLowerCase();return!!(t&&C.has(t)||s&&C.has(s))}function S(e,t,s){return`${e}\u0000${t??""}\u0000${s}`}function E(e,t){return`${e}\u0000${t??""}`}function v(e,t,s){return`${e}\u0000${t??""}\u0000${s}`}function N(e,t){return e>0?Math.round(t/e*100):null}function R(e,t){return e?t&&Date.parse(t)>Date.parse(e)?t:e:t}async function A(e={}){var t;let s,i=Date.now(),d=new Date(i).toISOString(),C=(t=e.range,"1h"===t||"7d"===t||"30d"===t?t:"24h"),y=new Date(i-w[C]).toISOString(),M=f(e.provider),L=!1!==e.includeHealthy,[O,P,D,I]=await Promise.all([(0,n.getProviderConnections)({}),(0,l.getAllCircuitBreakerStatuses)(),(0,a.getAllModelLockouts)(),Promise.resolve((s=(0,o.getDbInstance)(),s.prepare(`WITH log_targets AS (
        SELECT
          c.provider,
          COALESCE(c.connection_id, '') as connectionId,
          COALESCE(c.model, c.requested_model, 'unknown') as model,
          c.status,
          c.duration,
          c.timestamp,
          c.id,
          c.error_summary
        FROM call_logs c
        WHERE c.provider IS NOT NULL
          AND c.provider != '-'
          AND c.timestamp >= @cutoff
          
      ), ranked AS (
        SELECT
          provider,
          connectionId,
          model,
          status,
          duration,
          timestamp,
          CASE
            WHEN (status IS NOT NULL AND (status < 200 OR status >= 400))
              OR error_summary IS NOT NULL
            THEN 1
            ELSE 0
          END as isError,
          ROW_NUMBER() OVER (
            PARTITION BY provider, connectionId, model
            ORDER BY timestamp DESC, id DESC
          ) as latestRank,
          ROW_NUMBER() OVER (
            PARTITION BY provider, connectionId, model,
              CASE
                WHEN (status IS NOT NULL AND (status < 200 OR status >= 400))
                  OR error_summary IS NOT NULL
                THEN 1
                ELSE 0
              END
            ORDER BY timestamp DESC, id DESC
          ) as errorRank
        FROM log_targets
      )
      SELECT
        provider,
        connectionId,
        model,
        COUNT(*) as requests,
        SUM(CASE WHEN status >= 200 AND status < 400 THEN 1 ELSE 0 END) as successes,
        ROUND(AVG(duration)) as avgLatencyMs,
        MAX(timestamp) as lastRequestAt,
        MAX(
          CASE
            WHEN isError = 1
            THEN timestamp
            ELSE NULL
          END
        ) as lastErrorAt,
        MAX(CASE WHEN latestRank = 1 THEN status ELSE NULL END) as lastStatus,
        MAX(CASE WHEN isError = 1 AND errorRank = 1 THEN status ELSE NULL END) as lastErrorStatus
      FROM ranked
      GROUP BY provider, connectionId, model`).all({cutoff:y}).map(e=>{let t=c(e.connectionId);return{provider:c(e.provider)||"unknown",connectionId:t||null,model:c(e.model)||"unknown",requests:h(e.requests),successes:h(e.successes),avgLatencyMs:null==e.avgLatencyMs?null:h(e.avgLatencyMs),lastRequestAt:c(e.lastRequestAt),lastErrorAt:c(e.lastErrorAt),lastStatus:null==e.lastStatus?null:h(e.lastStatus),lastErrorStatus:null==e.lastErrorStatus?null:h(e.lastErrorStatus)}})))]),T=O.filter(e=>{let t=f(e.provider);return t&&(!M||t===M)}),b=P.filter(e=>{let t=f(e.name);return t&&(!M||t===M)}),q=D.filter(e=>{let t=f(e.provider);return t&&(!M||t===M)}),k=I.map(e=>({...e,provider:f(e.provider)??e.provider})).filter(e=>!M||e.provider===M),$=new Set;for(let e of T){let t=f(e.provider);t&&$.add(t)}for(let e of b){let t=f(e.name);t&&$.add(t)}for(let e of q){let t=f(e.provider);t&&$.add(t)}for(let e of k)$.add(e.provider);M&&$.add(M);let F=new Map;await Promise.all([...$].map(async e=>{F.set(e,await (0,r.getSyncedAvailableModelsByConnection)(e))}));let U=new Map,H=new Map;for(let e of k){U.set(S(e.provider,e.connectionId,e.model),e);let t=E(e.provider,e.connectionId),s=H.get(t)??[];s.push(e),H.set(t,s)}let _=new Map,W=new Map;for(let e of q){let t=f(e.provider),s=c(e.connectionId),r=c(e.model);t&&r&&(_.set(v(t,s,r),e),W.set(t,(W.get(t)??0)+1))}let B=[];for(let e of[...$].sort()){let t=T.filter(t=>f(t.provider)===e),s=k.filter(t=>t.provider===e),r=b.find(t=>f(t.name)===e),n=r?{state:c(r.state)||"CLOSED",failureCount:h(r.failureCount),retryAfterMs:h(r.retryAfterMs),lastFailureTime:null==r.lastFailureTime?null:h(r.lastFailureTime)}:null,o=new Map;for(let s of t)o.set(E(e,c(s.id)),s);for(let t of s){let s=E(e,t.connectionId);o.has(s)||o.set(s,null)}for(let t of q){if(f(t.provider)!==e)continue;let s=E(e,c(t.connectionId));o.has(s)||o.set(s,null)}let l=[],a=F.get(e)??{};for(let[t,s]of[...o.entries()].sort()){let[,r]=t.split("\0"),n=s?c(s.id):r||null,o=new Set;if(n&&s){for(let e of a[n]??[])e.id&&o.add(e.id);let e=c(s.defaultModel);e&&o.add(e)}for(let t of H.get(E(e,n))??[])o.add(t.model);for(let t of q){if(f(t.provider)!==e||(c(t.connectionId)??"")!==(n??""))continue;let s=c(t.model);s&&o.add(s)}let u=[...o].sort().map(t=>{let s=U.get(S(e,n,t))??null,r=_.get(v(e,n,t))??null,o=!!r,l=function(e,t){var s;if(t)return"locked";if(!e||0===e.requests)return"idle";if(s=e.lastStatus,null!==s&&(s<200||s>=400))return"error";let r=N(e.requests,e.successes);return null!==r&&r<95?"degraded":"healthy"}(s,o);return{model:t,status:l,isLockedOut:o,lockoutReason:r?c(r.reason):null,lockoutRemainingMs:r?Math.max(0,h(r.remainingMs)):0,requests:s?.requests??0,successes:s?.successes??0,successRate:s?N(s.requests,s.successes):null,avgLatencyMs:s?.avgLatencyMs??null,lastStatus:s?.lastStatus??null,lastErrorStatus:s?.lastErrorStatus??null,lastRequestAt:s?.lastRequestAt??null,lastErrorAt:s?.lastErrorAt??null}}),d=s?m(s.rateLimitedUntil):null,R=d?Math.max(0,d-i):0,A=function(e,t,s){if(e){if(!g(e.isActive)||p(e))return"down";let t=m(e.rateLimitedUntil);if(t&&t>s)return"degraded"}return t.some(e=>"error"===e.status||"locked"===e.status)?"degraded":"healthy"}(s,u,i),w=+("healthy"!==A)+u.filter(e=>"error"===e.status||"locked"===e.status).length;l.push({connectionId:n,label:s?function(e){let t=c(e.name)||c(e.displayName)||c(e.email)||c(e.id)||"connection",s=t.includes("@")?t.replace(/^(.).+(@.+)$/,"$1***$2"):t;return s.length>80?`${s.slice(0,77)}…`:s}(s):n||"Unattributed traffic",isSynthetic:!s,isActive:!s||g(s.isActive),state:A,testStatus:s?c(s.testStatus):null,rateLimitedUntil:s?c(s.rateLimitedUntil):null,cooldownRemainingMs:R,lastErrorType:s?c(s.lastErrorType):null,errorCode:s?c(s.errorCode):null,backoffLevel:s?h(s.backoffLevel):0,modelCount:u.length,issueCount:w,models:u})}let u=s.reduce((e,t)=>e+t.requests,0),d=s.reduce((e,t)=>e+t.successes,0),A=s.reduce((e,t)=>e+(t.avgLatencyMs??0)*t.requests,0),w=n?.state==="OPEN"?"down":n?.state==="HALF_OPEN"?"degraded":l.length>0&&l.every(e=>"down"===e.state)?"down":l.some(e=>"healthy"!==e.state)?"degraded":"healthy",C=+("healthy"!==w)+l.reduce((e,t)=>e+t.issueCount,0),y=t.length,M=t.filter(e=>g(e.isActive)).length,O=t.filter(e=>{let t=m(e.rateLimitedUntil);return!!(t&&t>i)}).length,P=t.filter(p).length,D=W.get(e)??0,I=(n?.state==="OPEN"?.4:.2*(n?.state==="HALF_OPEN"))+(y>0?O/y*.2:0)+(y>0?P/y*.25:0)+Math.min(.2,.05*D)+Math.min(.15,.05*l.filter(e=>"down"===e.state).length),$={provider:e,state:w,score:Number(Math.max(0,Math.min(1,1-I)).toFixed(2)),circuitBreaker:n,connections:{total:y,active:M,cooldown:O,inactive:t.filter(e=>!g(e.isActive)).length,terminal:P},modelLockoutCount:D,requests:u,successRate:N(u,d),avgLatencyMs:u>0?Math.round(A/u):null,lastRequestAt:s.reduce((e,t)=>R(e,t.lastRequestAt),null),lastErrorAt:s.reduce((e,t)=>R(e,t.lastErrorAt),null),issueCount:C,accounts:l};(L||"healthy"!==$.state||$.issueCount>0)&&B.push($)}let x=(0,u.getWebSessionPoolHealth)(M??void 0);return{checkedAt:d,range:C,cutoff:y,summary:{providerCount:B.length,connectionCount:B.reduce((e,t)=>e+t.connections.total,0),modelCount:B.reduce((e,t)=>e+t.accounts.reduce((e,t)=>e+t.modelCount,0),0),issueCount:B.reduce((e,t)=>e+t.issueCount,0),healthyCount:B.filter(e=>"healthy"===e.state).length,degradedCount:B.filter(e=>"degraded"===e.state).length,downCount:B.filter(e=>"down"===e.state).length},providers:B,webSessionPools:{totalPools:x.providers.length,healthyPools:x.providers.filter(e=>"healthy"===e.health).length,degradedPools:x.providers.filter(e=>"degraded"===e.health).length,downPools:x.providers.filter(e=>"down"===e.health).length,pools:x.providers.map(e=>({provider:e.provider,health:e.health,pool:e.pool,breaker:e.breaker,sessions:e.sessions,issues:e.issues}))}}}e.s(["RANGE_MS",0,w,"buildProviderHealthMatrix",0,A]),s()}catch(e){s(e)}},!1)];

//# sourceMappingURL=_0hq62d6._.js.map