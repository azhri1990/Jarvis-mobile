module.exports=[853030,e=>{e.v(s=>Promise.all(["server/chunks/[root-of-the-server]__08aok8t._.js"].map(s=>e.l(s))).then(()=>s(260383)))},933762,e=>{e.v(s=>Promise.all(["server/chunks/[root-of-the-server]__0al_daj._.js"].map(s=>e.l(s))).then(()=>s(223764)))},865498,e=>{"use strict";var s=e.i(830471);function t(){(0,s.getDbInstance)().exec(`
    CREATE TABLE IF NOT EXISTS compression_run_telemetry (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp INTEGER NOT NULL,
      request_id TEXT,
      model TEXT,
      provider TEXT,
      source TEXT,
      tokens_before INTEGER NOT NULL,
      tokens_after INTEGER NOT NULL,
      ratio REAL,
      cost_delta REAL,
      output_styles TEXT,
      output_style_bypass TEXT,
      output_tokens INTEGER
    )
  `)}e.s(["getCompressionRunTelemetrySummary",0,function(){let e=(0,s.getDbInstance)();t();let r=e.prepare(`SELECT tokens_before, tokens_after, output_styles, output_style_bypass, output_tokens
       FROM compression_run_telemetry`).all(),o={totalRuns:r.length,totalTokensSaved:0,runsWithStyles:0,bypassCount:0,totalOutputTokens:0,appliedStyleCounts:{}};for(let e of r)if(o.totalTokensSaved+=Math.max(0,e.tokens_before-e.tokens_after),o.totalOutputTokens+=e.output_tokens??0,e.output_style_bypass&&(o.bypassCount+=1),e.output_styles){o.runsWithStyles+=1;try{for(let s of JSON.parse(e.output_styles))o.appliedStyleCounts[s.id]=(o.appliedStyleCounts[s.id]??0)+1}catch{}}return o},"insertCompressionRunTelemetryRow",0,function(e){try{let r=(0,s.getDbInstance)();t(),r.prepare(`INSERT INTO compression_run_telemetry (
        timestamp, request_id, model, provider, source,
        tokens_before, tokens_after, ratio, cost_delta,
        output_styles, output_style_bypass, output_tokens
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(Date.now(),e.requestId??null,e.model??null,e.provider??null,e.source??null,e.tokensBefore,e.tokensAfter,e.ratio,e.costDelta??null,e.outputStyles&&e.outputStyles.length>0?JSON.stringify(e.outputStyles):null,e.outputStyleBypass??null,e.outputTokens??null)}catch{}}])},833389,e=>{e.v(s=>Promise.all(["server/chunks/[root-of-the-server]__0_mbv8f._.js","server/chunks/_06kegw-._.js","server/chunks/_0u09ium._.js","server/chunks/src_0c7els9._.js","server/chunks/_0tsp696._.js","server/chunks/_00gbtxh._.js","server/chunks/open-sse_1en0bdk._.js","server/chunks/src_lib_db_0q-5o4j._.js","server/chunks/src_02l7t6d._.js","server/chunks/_1zujanj._.js","server/chunks/node_modules_bcryptjs_index_0qfrcpc.js","server/chunks/src_1lk5r5a._.js","server/chunks/src_shared_120yvyy._.js"].map(s=>e.l(s))).then(()=>s(543125)))},136388,e=>{e.v(s=>Promise.all(["server/chunks/_1x71ks1._.js","server/chunks/_0u09ium._.js","server/chunks/src_06c8vs0._.js","server/chunks/_0tsp696._.js","server/chunks/[root-of-the-server]__0g0umdq._.js","server/chunks/src_lib_db_0q-5o4j._.js","server/chunks/src_02l7t6d._.js","server/chunks/open-sse_1en0bdk._.js","server/chunks/src_shared_120yvyy._.js","server/chunks/src_1lk5r5a._.js"].map(s=>e.l(s))).then(()=>s(974210)))}];

//# sourceMappingURL=src_lib_db_1pvpsoe._.js.map