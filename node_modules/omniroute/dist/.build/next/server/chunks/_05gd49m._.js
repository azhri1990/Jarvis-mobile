module.exports=[232485,e=>e.a(async(t,r)=>{try{var a=e.i(254799),o=e.i(51903),n=e.i(905270),s=t([o]);[o]=s.then?(await s)():s,e.s(["buildCloudflareWorkerScript",0,function(e){return`// OmniRoute Cloudflare Worker proxy relay — generated at deploy time.
const resolveRelayTarget = ${o.resolveRelayTarget.toString()};

const isPrivateHostname = ${n.isPrivateRelayHostname.toString()};

async function handleRelay(request) {
  const auth = request.headers.get("x-relay-auth");
  if (auth !== "${e}") {
    return new Response("Unauthorized", { status: 401 });
  }
  const target = request.headers.get("x-relay-target");
  if (!target) {
    return new Response("missing x-relay-target", { status: 400 });
  }
  let targetUrl;
  try { targetUrl = new URL(target); } catch { return new Response("invalid x-relay-target", { status: 400 }); }
  if (targetUrl.protocol !== "http:" && targetUrl.protocol !== "https:") {
    return new Response("forbidden x-relay-target protocol", { status: 403 });
  }
  if (targetUrl.username || targetUrl.password) {
    return new Response("forbidden x-relay-target (embedded credentials)", { status: 403 });
  }
  if (isPrivateHostname(targetUrl.hostname)) {
    return new Response("forbidden x-relay-target (private/loopback host)", { status: 403 });
  }
  const relayPath = request.headers.get("x-relay-path") || "/";
  const headers = new Headers(request.headers);
  ["x-relay-target", "x-relay-path", "x-relay-auth", "host"].forEach((h) => headers.delete(h));
  const init = {
    method: request.method,
    headers,
  };
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
    init.duplex = "half";
  }
  const resolved = resolveRelayTarget(target, relayPath);
  if (!resolved.ok) {
    return new Response(resolved.reason, { status: resolved.status });
  }
  try {
    const upstream = await fetch(resolved.url, init);
    return new Response(upstream.body, {
      status: upstream.status,
      headers: upstream.headers,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error && error.message ? error.message : "relay error" }), {
      status: 502,
      headers: { "content-type": "application/json" },
    });
  }
}

addEventListener("fetch", (event) => {
  event.respondWith(handleRelay(event.request));
});
`},"buildCloudflareWorkerUploadRequest",0,function(e,t){let r=`----OmniRouteCFWorker${(0,a.randomUUID)().replace(/-/g,"")}`,o=[Buffer.from(`--${r}\r
Content-Disposition: form-data; name="index.js"; filename="index.js"\r
Content-Type: application/javascript\r
\r
`),Buffer.from(e,"utf8"),Buffer.from("\r\n"),Buffer.from(`--${r}\r
Content-Disposition: form-data; name="metadata"; filename="metadata.json"\r
Content-Type: application/json\r
\r
${JSON.stringify(t)}\r
`),Buffer.from(`--${r}--\r
`)];return{headers:{"Content-Type":`multipart/form-data; boundary=${r}`},body:Buffer.concat(o)}}]),r()}catch(e){r(e)}},!1),668427,e=>e.a(async(t,r)=>{try{var a=e.i(254799),o=e.i(15658),n=e.i(858235),s=e.i(200392),i=e.i(860598),l=e.i(245272),u=e.i(33770),d=e.i(507238),c=e.i(232485),p=t([o,i,l,c]);[o,i,l,c]=p.then?(await p)():p;let f=process.env.CLOUDFLARE_API_BASE||"https://api.cloudflare.com/client/v4";async function h(e){let t=await (0,o.requireManagementAuth)(e);if(t)return t;let r={};try{r=await e.json()}catch{return(0,n.createErrorResponse)({status:400,message:"Invalid JSON body",type:"invalid_request"})}let l=(0,s.validateBody)(i.cloudflareDeploySchema,r);if((0,s.isValidationFailure)(l))return(0,n.createErrorResponse)({status:400,message:l.error.message,type:"invalid_request"});let{accountId:p,apiToken:h,projectName:y}=l.data,m=(0,a.randomBytes)(24).toString("hex"),g=(0,c.buildCloudflareWorkerScript)(m);try{let e=`${f}/accounts/${p}/workers/scripts/${y}`,{headers:t,body:r}=(0,c.buildCloudflareWorkerUploadRequest)(g,{body_part:"index.js",compatibility_date:"2026-03-20",observability:{enabled:!0}}),a=await fetch(e,{method:"PUT",headers:{Authorization:`Bearer ${h}`,...t},body:r});if(!a.ok){let e="Cloudflare API rejected the Worker upload";try{let t=await a.json().catch(()=>null),r=t?.errors?.[0]?.message;"string"==typeof r&&r.trim()&&(e=r.trim().slice(0,200))}catch{}return(0,n.createErrorResponse)({status:a.status,message:`Cloudflare Worker upload failed: ${e}`,type:"upstream_error"})}await fetch(`${e}/subdomain`,{method:"POST",headers:{Authorization:`Bearer ${h}`,"Content-Type":"application/json"},body:JSON.stringify({enabled:!0})}).catch(()=>{});let o=await fetch(`${f}/accounts/${p}/workers/subdomain`,{method:"GET",headers:{Authorization:`Bearer ${h}`,"Content-Type":"application/json"}}),s="";if(o.ok){let e=await o.json().catch(()=>null),t=e?.result?.subdomain;"string"==typeof t&&t&&(s=`https://${y}.${t}.workers.dev`)}if(!s)return(0,n.createErrorResponse)({status:400,message:"Worker deployed but failed to retrieve workers.dev subdomain. Set up a workers.dev subdomain in the Cloudflare dashboard first.",type:"upstream_error"});let i=(0,d.encrypt)(m),l=i&&i!==m?{relayAuthEnc:i}:{relayAuth:m},R=s.replace(/^https?:\/\//,""),v=await (0,u.createProxy)({name:`Cloudflare Relay (${y})`,type:"cloudflare",host:R,port:443,notes:JSON.stringify(l),source:"cloudflare-relay"});return Response.json({success:!0,relayUrl:s,poolProxyId:v?.id})}catch(e){return(0,n.createErrorResponseFromUnknown)(e,"Cloudflare deploy failed")}}e.s(["POST",0,h]),r()}catch(e){r(e)}},!1),363547,e=>{"use strict";var t=e.i(747909),r=e.i(174017),a=e.i(996250),o=e.i(759756),n=e.i(561916),s=e.i(174677),i=e.i(869741),l=e.i(316795),u=e.i(487718),d=e.i(995169),c=e.i(47587),p=e.i(666012),h=e.i(570101),f=e.i(626937),y=e.i(10372),m=e.i(193695);e.i(52474);var g=e.i(600220);let R=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/settings/proxy/cloudflare-deploy/route",pathname:"/api/settings/proxy/cloudflare-deploy",filename:"route",bundlePath:""},distDir:".build/next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/settings/proxy/cloudflare-deploy/route.ts",nextConfigOutput:"standalone",userland:()=>e.r(668427),...{}}),{workAsyncStorage:v,workUnitAsyncStorage:w,serverHooks:C}=R;async function x(e,t,a){a.requestMeta&&(0,o.setRequestMeta)(e,a.requestMeta),R.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let v="/api/settings/proxy/cloudflare-deploy/route";v=v.replace(/\/index$/,"")||"/";let w=await R.prepare(e,t,{srcPage:v,multiZoneDraftMode:!1});if(!w)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:C,deploymentId:x,params:b,nextConfig:E,parsedUrl:T,isDraftMode:A,prerenderManifest:S,routerServerContext:P,isOnDemandRevalidate:q,revalidateOnlyGenerated:k,resolvedPathname:U,clientReferenceManifest:O,serverActionsManifest:_}=w,N=(0,i.normalizeAppPath)(v),$=!!(S.dynamicRoutes[N]||S.routes[U]),H=async()=>((null==P?void 0:P.render404)?await P.render404(e,t,T,!1):t.end("This page could not be found"),null);if($&&!A){let e=!!S.routes[U],t=S.dynamicRoutes[N];if(t&&!1===t.fallback&&!e){if(E.adapterPath)return await H();throw new m.NoFallbackError}}let I=null;!$||R.isDev||A||(I="/index"===(I=U)?"/":I);let j=!0===R.isDev||!$,D=$&&!j;_&&O&&(0,s.setManifestsSingleton)({page:v,clientReferenceManifest:O,serverActionsManifest:_});let B=e.method||"GET",M=(0,n.getTracer)(),F=M.getActiveScopeSpan(),W=!!(null==P?void 0:P.isWrappedByNextServer),L=!!(0,o.getRequestMeta)(e,"minimalMode"),K=(0,o.getRequestMeta)(e,"incrementalCache")||await R.getIncrementalCache(e,E,S,L);null==K||K.resetRequestCache(),globalThis.__incrementalCache=K;let G={params:b,previewProps:S.preview,renderOpts:{experimental:{authInterrupts:!!E.experimental.authInterrupts,useCacheTimeout:E.experimental.useCacheTimeout},cacheComponents:!!E.cacheComponents,validationLevel:E.experimental.instantInsights.validationLevel,supportsDynamicResponse:j,incrementalCache:K,hmrRefreshHash:(0,o.getRequestMeta)(e,"hmrRefreshHash"),cacheLifeProfiles:E.cacheLife,staticPageGenerationTimeout:E.staticPageGenerationTimeout,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,o)=>R.onRequestError(e,t,a,o,P)},sharedContext:{buildId:C,deploymentId:x}},z=new l.NodeNextRequest(e),J=new l.NodeNextResponse(t),V=u.NextRequestAdapter.fromNodeNextRequest(z,(0,u.signalFromNodeResponse)(t)),X=async({previousCacheEntry:r})=>{try{if(!L&&q&&k&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let o=await R.handle(V,G);e.fetchMetrics=G.renderOpts.fetchMetrics;let n=G.renderOpts.pendingWaitUntil;n&&a.waitUntil&&(a.waitUntil(n),n=void 0);let s=G.renderOpts.collectedTags;if(!$)return await (0,p.sendResponse)(z,J,o,n),null;{let e=await o.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(o.headers);s&&(t[y.NEXT_CACHE_TAGS_HEADER]=s),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==G.renderOpts.collectedRevalidate&&!(G.renderOpts.collectedRevalidate>=y.INFINITE_CACHE)&&G.renderOpts.collectedRevalidate,a=void 0===G.renderOpts.collectedExpire||G.renderOpts.collectedExpire>=y.INFINITE_CACHE?!1!==r&&r>0?E.expireTime:void 0:G.renderOpts.collectedExpire;return{value:{kind:g.CachedRouteKind.APP_ROUTE,status:o.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await R.onRequestError(e,t,{routerKind:"App Router",routePath:v,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:D,isOnDemandRevalidate:q})},!1,P),t}},Z=async(o,s)=>{try{var i,l;let o=await R.handleResponse({req:e,nextConfig:E,cacheKey:I,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:S,isRoutePPREnabled:!1,isOnDemandRevalidate:q,revalidateOnlyGenerated:k,responseGenerator:X,waitUntil:a.waitUntil,isMinimalMode:L});if(!$)return;if((null==o||null==(i=o.value)?void 0:i.kind)!==g.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==o||null==(l=o.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});L||t.setHeader("x-nextjs-cache",q?"REVALIDATED":o.isMiss?"MISS":o.isStale?"STALE":"HIT"),A&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let n=(0,h.fromNodeOutgoingHttpHeaders)(o.value.headers);L&&$||n.delete(y.NEXT_CACHE_TAGS_HEADER),!o.cacheControl||t.getHeader("Cache-Control")||n.get("Cache-Control")||n.set("Cache-Control",(0,f.getCacheControlHeader)(o.cacheControl)),await (0,p.sendResponse)(z,J,new Response(o.value.body,{headers:n,status:o.value.status||200}));return}catch(t){if(t instanceof m.NoFallbackError||await R.onRequestError(e,t,{routerKind:"App Router",routePath:N,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:D,isOnDemandRevalidate:q})},!1,P),$)throw t;await (0,p.sendResponse)(z,J,new Response(null,{status:500}));return}finally{(()=>{if(!o)return;let e=t.statusCode;o.setAttributes({"http.status_code":e,"next.rsc":!1}),e&&e>=500&&(o.setStatus({code:n.SpanStatusCode.ERROR}),o.setAttribute("error.type",e.toString()));let r=M.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==d.BaseServerSpan.handleRequest)return console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route")||N,i=`${B} ${a}`;o.setAttributes({"next.route":a,"http.route":a,"next.span_name":i}),o.updateName(i),s&&s!==o&&(s.setAttribute("http.route",a),s.updateName(i))})()}};if(W&&F)await Z(F,void 0);else{let t=M.getActiveScopeSpan();await M.withPropagatedContext(e.headers,()=>M.trace(d.BaseServerSpan.handleRequest,{spanName:`${B} ${v}`,kind:n.SpanKind.SERVER,attributes:{"http.method":B,"http.target":e.url}},e=>Z(e,t)),void 0,!W)}}e.s(["handler",0,x,"patchFetch",0,function(){return(0,a.patchFetch)({workAsyncStorage:v,workUnitAsyncStorage:w})},"routeModule",0,R,"serverHooks",0,C,"workAsyncStorage",0,v,"workUnitAsyncStorage",0,w])}];

//# sourceMappingURL=_05gd49m._.js.map