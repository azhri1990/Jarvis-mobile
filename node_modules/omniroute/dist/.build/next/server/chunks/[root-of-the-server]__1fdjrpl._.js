module.exports=[918622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},120635,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/action-async-storage.external.js",()=>require("next/dist/server/app-render/action-async-storage.external.js"))},324725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},556704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},559043,(e,t,r)=>{t.exports=e.x("next/dist/server/runtime-reacts.external.js",()=>require("next/dist/server/runtime-reacts.external.js"))},193695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},81111,(e,t,r)=>{t.exports=e.x("node:stream",()=>require("node:stream"))},130146,(e,t,r)=>{t.exports=e.x("pino",()=>require("pino"))},819481,(e,t,r)=>{"use strict";var s=Object.defineProperty,a=Object.getOwnPropertyDescriptor,n=Object.getOwnPropertyNames,o=Object.prototype.hasOwnProperty,i={},l={RequestCookies:()=>h,ResponseCookies:()=>g,parseCookie:()=>c,parseSetCookie:()=>d,stringifyCookie:()=>p};for(var u in l)s(i,u,{get:l[u],enumerable:!0});function p(e){var t;let r=["path"in e&&e.path&&`Path=${e.path}`,"expires"in e&&(e.expires||0===e.expires)&&`Expires=${("number"==typeof e.expires?new Date(e.expires):e.expires).toUTCString()}`,"maxAge"in e&&"number"==typeof e.maxAge&&`Max-Age=${e.maxAge}`,"domain"in e&&e.domain&&`Domain=${e.domain}`,"secure"in e&&e.secure&&"Secure","httpOnly"in e&&e.httpOnly&&"HttpOnly","sameSite"in e&&e.sameSite&&`SameSite=${e.sameSite}`,"partitioned"in e&&e.partitioned&&"Partitioned","priority"in e&&e.priority&&`Priority=${e.priority}`].filter(Boolean),s=`${e.name}=${encodeURIComponent(null!=(t=e.value)?t:"")}`;return 0===r.length?s:`${s}; ${r.join("; ")}`}function c(e){let t=new Map;for(let r of e.split(/; */)){if(!r)continue;let e=r.indexOf("=");if(-1===e){t.set(r,"true");continue}let[s,a]=[r.slice(0,e),r.slice(e+1)];try{t.set(s,decodeURIComponent(null!=a?a:"true"))}catch{}}return t}function d(e){if(!e)return;let[[t,r],...s]=c(e),{domain:a,expires:n,httponly:o,maxage:i,path:l,samesite:u,secure:p,partitioned:d,priority:h}=Object.fromEntries(s.map(([e,t])=>[e.toLowerCase().replace(/-/g,""),t]));{var g,N,S={name:t,value:decodeURIComponent(r),domain:a,...n&&{expires:new Date(n)},...o&&{httpOnly:!0},..."string"==typeof i&&{maxAge:Number(i)},path:l,...u&&{sameSite:m.includes(g=(g=u).toLowerCase())?g:void 0},...p&&{secure:!0},...h&&{priority:E.includes(N=(N=h).toLowerCase())?N:void 0},...d&&{partitioned:!0}};let e={};for(let t in S)S[t]&&(e[t]=S[t]);return e}}t.exports=((e,t,r)=>{if(t&&"object"==typeof t||"function"==typeof t)for(let i of n(t))o.call(e,i)||void 0===i||s(e,i,{get:()=>t[i],enumerable:!(r=a(t,i))||r.enumerable});return e})(s({},"__esModule",{value:!0}),i);var m=["strict","lax","none"],E=["low","medium","high"],h=class{constructor(e){this._parsed=new Map,this._headers=e;const t=e.get("cookie");if(t)for(const[e,r]of c(t))this._parsed.set(e,{name:e,value:r})}[Symbol.iterator](){return this._parsed[Symbol.iterator]()}get size(){return this._parsed.size}get(...e){let t="string"==typeof e[0]?e[0]:e[0].name;return this._parsed.get(t)}getAll(...e){var t;let r=Array.from(this._parsed);if(!e.length)return r.map(([e,t])=>t);let s="string"==typeof e[0]?e[0]:null==(t=e[0])?void 0:t.name;return r.filter(([e])=>e===s).map(([e,t])=>t)}has(e){return this._parsed.has(e)}set(...e){let[t,r]=1===e.length?[e[0].name,e[0].value]:e,s=this._parsed;return s.set(t,{name:t,value:r}),this._headers.set("cookie",Array.from(s).map(([e,t])=>p(t)).join("; ")),this}delete(e){let t=this._parsed,r=Array.isArray(e)?e.map(e=>t.delete(e)):t.delete(e);return this._headers.set("cookie",Array.from(t).map(([e,t])=>p(t)).join("; ")),r}clear(){return this.delete(Array.from(this._parsed.keys())),this}[Symbol.for("edge-runtime.inspect.custom")](){return`RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`}toString(){return[...this._parsed.values()].map(e=>`${e.name}=${encodeURIComponent(e.value)}`).join("; ")}},g=class{constructor(e){var t,r,s;this._parsed=new Map,this._headers=e;const a=null!=(s=null!=(r=null==(t=e.getSetCookie)?void 0:t.call(e))?r:e.get("set-cookie"))?s:[];for(const e of Array.isArray(a)?a:function(e){if(!e)return[];var t,r,s,a,n,o=[],i=0;function l(){for(;i<e.length&&/\s/.test(e.charAt(i));)i+=1;return i<e.length}for(;i<e.length;){for(t=i,n=!1;l();)if(","===(r=e.charAt(i))){for(s=i,i+=1,l(),a=i;i<e.length&&"="!==(r=e.charAt(i))&&";"!==r&&","!==r;)i+=1;i<e.length&&"="===e.charAt(i)?(n=!0,i=a,o.push(e.substring(t,s)),t=i):i=s+1}else i+=1;(!n||i>=e.length)&&o.push(e.substring(t,e.length))}return o}(a)){const t=d(e);t&&this._parsed.set(t.name,t)}}get(...e){let t="string"==typeof e[0]?e[0]:e[0].name;return this._parsed.get(t)}getAll(...e){var t;let r=Array.from(this._parsed.values());if(!e.length)return r;let s="string"==typeof e[0]?e[0]:null==(t=e[0])?void 0:t.name;return r.filter(e=>e.name===s)}has(e){return this._parsed.has(e)}set(...e){let[t,r,s]=1===e.length?[e[0].name,e[0].value,e[0]]:e,a=this._parsed;return a.set(t,function(e={name:"",value:""}){return"number"==typeof e.expires&&(e.expires=new Date(e.expires)),e.maxAge&&(e.expires=new Date(Date.now()+1e3*e.maxAge)),(null===e.path||void 0===e.path)&&(e.path="/"),e}({name:t,value:r,...s})),function(e,t){for(let[,r]of(t.delete("set-cookie"),e)){let e=p(r);t.append("set-cookie",e)}}(a,this._headers),this}delete(...e){let[t,r]="string"==typeof e[0]?[e[0]]:[e[0].name,e[0]];return this.set({...r,name:t,value:"",expires:new Date(0)})}[Symbol.for("edge-runtime.inspect.custom")](){return`ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`}toString(){return[...this._parsed.values()].map(p).join("; ")}}},442315,(e,t,r)=>{"use strict";t.exports=e.r(918622)},347540,(e,t,r)=>{"use strict";t.exports=e.r(442315).vendored["react-rsc"].React},750015,e=>{"use strict";var t=e.i(89171),r=e.i(130146),s=e.i(719201),a=e.i(496425),n=e.i(538154);let o=(0,r.default)({name:"provider-metrics-api"});async function i(){try{let e=(0,a.getProviderMetrics)(),r={},s="",o=0,i="",l=0;for(let t of e){let e="string"==typeof t.provider&&t.provider.trim().length>0?t.provider:"unknown",a=(0,n.toNumber)(t.totalRequests),u=(0,n.toNumber)(t.totalSuccesses),p=(0,n.toNumber)(t.avgLatencyMs),c="string"==typeof t.lastRequestAt?t.lastRequestAt:null,d="string"==typeof t.lastErrorAt?t.lastErrorAt:null,m=null==t.lastStatus?null:(0,n.toNumber)(t.lastStatus),E=null==t.lastErrorStatus?null:(0,n.toNumber)(t.lastErrorStatus);r[e]={totalRequests:a,totalSuccesses:u,successRate:a>0?Math.round(u/a*100):0,avgLatencyMs:p,lastRequestAt:c,lastErrorAt:d,lastStatus:m,lastErrorStatus:E};let h=c?Date.parse(c):0;Number.isFinite(h)&&h>o&&(s=e,o=h);let g=null!==m&&(m<200||m>=400)&&d?Date.parse(d):0;Number.isFinite(g)&&g>l&&(i=e,l=g)}return t.NextResponse.json({metrics:r,topology:{providers:Object.keys(r),lastProvider:s,errorProvider:i}})}catch(e){return o.error({err:e},"Failed to load provider metrics"),t.NextResponse.json((0,s.buildErrorBody)(500,"Failed to load provider metrics"),{status:500})}}e.s(["GET",0,i])},283041,e=>{"use strict";var t=e.i(747909),r=e.i(174017),s=e.i(996250),a=e.i(759756),n=e.i(561916),o=e.i(174677),i=e.i(869741),l=e.i(316795),u=e.i(487718),p=e.i(995169),c=e.i(47587),d=e.i(666012),m=e.i(570101),E=e.i(626937),h=e.i(10372),g=e.i(193695);e.i(52474);var N=e.i(600220);let S=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/provider-metrics/route",pathname:"/api/provider-metrics",filename:"route",bundlePath:""},distDir:".build/next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/provider-metrics/route.ts",nextConfigOutput:"standalone",userland:()=>e.r(750015),...{}}),{workAsyncStorage:v,workUnitAsyncStorage:f,serverHooks:R}=S;async function A(e,t,s){s.requestMeta&&(0,a.setRequestMeta)(e,s.requestMeta),S.isDev&&(0,a.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let v="/api/provider-metrics/route";v=v.replace(/\/index$/,"")||"/";let f=await S.prepare(e,t,{srcPage:v,multiZoneDraftMode:!1});if(!f)return t.statusCode=400,t.end("Bad Request"),null==s.waitUntil||s.waitUntil.call(s,Promise.resolve()),null;let{buildId:R,deploymentId:A,params:y,nextConfig:x,parsedUrl:C,isDraftMode:O,prerenderManifest:_,routerServerContext:b,isOnDemandRevalidate:T,revalidateOnlyGenerated:L,resolvedPathname:D,clientReferenceManifest:w,serverActionsManifest:U}=f,q=(0,i.normalizeAppPath)(v),H=!!(_.dynamicRoutes[q]||_.routes[D]),I=async()=>((null==b?void 0:b.render404)?await b.render404(e,t,C,!1):t.end("This page could not be found"),null);if(H&&!O){let e=!!_.routes[D],t=_.dynamicRoutes[q];if(t&&!1===t.fallback&&!e){if(x.adapterPath)return await I();throw new g.NoFallbackError}}let M=null;!H||S.isDev||O||(M="/index"===(M=D)?"/":M);let k=!0===S.isDev||!H,P=H&&!k;U&&w&&(0,o.setManifestsSingleton)({page:v,clientReferenceManifest:w,serverActionsManifest:U});let j=e.method||"GET",F=(0,n.getTracer)(),W=F.getActiveScopeSpan(),$=!!(null==b?void 0:b.isWrappedByNextServer),B=!!(0,a.getRequestMeta)(e,"minimalMode"),G=(0,a.getRequestMeta)(e,"incrementalCache")||await S.getIncrementalCache(e,x,_,B);null==G||G.resetRequestCache(),globalThis.__incrementalCache=G;let Y={params:y,previewProps:_.preview,renderOpts:{experimental:{authInterrupts:!!x.experimental.authInterrupts,useCacheTimeout:x.experimental.useCacheTimeout},cacheComponents:!!x.cacheComponents,validationLevel:x.experimental.instantInsights.validationLevel,supportsDynamicResponse:k,incrementalCache:G,hmrRefreshHash:(0,a.getRequestMeta)(e,"hmrRefreshHash"),cacheLifeProfiles:x.cacheLife,staticPageGenerationTimeout:x.staticPageGenerationTimeout,waitUntil:s.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,s,a)=>S.onRequestError(e,t,s,a,b)},sharedContext:{buildId:R,deploymentId:A}},K=new l.NodeNextRequest(e),X=new l.NodeNextResponse(t),V=u.NextRequestAdapter.fromNodeNextRequest(K,(0,u.signalFromNodeResponse)(t)),z=async({previousCacheEntry:r})=>{try{if(!B&&T&&L&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let a=await S.handle(V,Y);e.fetchMetrics=Y.renderOpts.fetchMetrics;let n=Y.renderOpts.pendingWaitUntil;n&&s.waitUntil&&(s.waitUntil(n),n=void 0);let o=Y.renderOpts.collectedTags;if(!H)return await (0,d.sendResponse)(K,X,a,n),null;{let e=await a.blob(),t=(0,m.toNodeOutgoingHttpHeaders)(a.headers);o&&(t[h.NEXT_CACHE_TAGS_HEADER]=o),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==Y.renderOpts.collectedRevalidate&&!(Y.renderOpts.collectedRevalidate>=h.INFINITE_CACHE)&&Y.renderOpts.collectedRevalidate,s=void 0===Y.renderOpts.collectedExpire||Y.renderOpts.collectedExpire>=h.INFINITE_CACHE?!1!==r&&r>0?x.expireTime:void 0:Y.renderOpts.collectedExpire;return{value:{kind:N.CachedRouteKind.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:s}}}}catch(t){throw(null==r?void 0:r.isStale)&&await S.onRequestError(e,t,{routerKind:"App Router",routePath:v,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:P,isOnDemandRevalidate:T})},!1,b),t}},J=async(a,o)=>{try{var i,l;let a=await S.handleResponse({req:e,nextConfig:x,cacheKey:M,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:_,isRoutePPREnabled:!1,isOnDemandRevalidate:T,revalidateOnlyGenerated:L,responseGenerator:z,waitUntil:s.waitUntil,isMinimalMode:B});if(!H)return;if((null==a||null==(i=a.value)?void 0:i.kind)!==N.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==a||null==(l=a.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});B||t.setHeader("x-nextjs-cache",T?"REVALIDATED":a.isMiss?"MISS":a.isStale?"STALE":"HIT"),O&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let n=(0,m.fromNodeOutgoingHttpHeaders)(a.value.headers);B&&H||n.delete(h.NEXT_CACHE_TAGS_HEADER),!a.cacheControl||t.getHeader("Cache-Control")||n.get("Cache-Control")||n.set("Cache-Control",(0,E.getCacheControlHeader)(a.cacheControl)),await (0,d.sendResponse)(K,X,new Response(a.value.body,{headers:n,status:a.value.status||200}));return}catch(t){if(t instanceof g.NoFallbackError||await S.onRequestError(e,t,{routerKind:"App Router",routePath:q,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:P,isOnDemandRevalidate:T})},!1,b),H)throw t;await (0,d.sendResponse)(K,X,new Response(null,{status:500}));return}finally{(()=>{if(!a)return;let e=t.statusCode;a.setAttributes({"http.status_code":e,"next.rsc":!1}),e&&e>=500&&(a.setStatus({code:n.SpanStatusCode.ERROR}),a.setAttribute("error.type",e.toString()));let r=F.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==p.BaseServerSpan.handleRequest)return console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let s=r.get("next.route")||q,i=`${j} ${s}`;a.setAttributes({"next.route":s,"http.route":s,"next.span_name":i}),a.updateName(i),o&&o!==a&&(o.setAttribute("http.route",s),o.updateName(i))})()}};if($&&W)await J(W,void 0);else{let t=F.getActiveScopeSpan();await F.withPropagatedContext(e.headers,()=>F.trace(p.BaseServerSpan.handleRequest,{spanName:`${j} ${v}`,kind:n.SpanKind.SERVER,attributes:{"http.method":j,"http.target":e.url}},e=>J(e,t)),void 0,!$)}}e.s(["handler",0,A,"patchFetch",0,function(){return(0,s.patchFetch)({workAsyncStorage:v,workUnitAsyncStorage:f})},"routeModule",0,S,"serverHooks",0,R,"workAsyncStorage",0,v,"workUnitAsyncStorage",0,f])},496425,e=>{"use strict";var t=e.i(899378);e.s(["getErrorTypeBreakdown",0,function(e,r){return(0,t.getDbInstance)().prepare(`
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
      `).all()}])},538154,e=>{"use strict";e.s(["toNumber",0,function(e,t=0){if("number"==typeof e&&Number.isFinite(e))return e;if("string"==typeof e&&e.trim().length>0){let r=Number(e.trim());return Number.isFinite(r)?r:t}return t},"toNumberOrNull",0,function(e){if("number"==typeof e&&Number.isFinite(e))return e;if("string"==typeof e&&e.trim().length>0){let t=Number(e.trim());return Number.isFinite(t)?t:null}return null}])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__1fdjrpl._.js.map