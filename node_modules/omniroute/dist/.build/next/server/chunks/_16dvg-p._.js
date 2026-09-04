module.exports=[765923,e=>{e.v(s=>Promise.all(["server/chunks/open-sse_services_adobeFireflyBrowserLogin_ts_061yd_0._.js","server/chunks/open-sse_services_adobeFireflySession_ts_1k5v6xm._.js"].map(s=>e.l(s))).then(()=>s(87344)))},416916,e=>{e.v(e=>Promise.resolve().then(()=>e(993388)))},241997,e=>{e.v(s=>Promise.all(["server/chunks/open-sse_services_autoCombo_freeAccessQuota_ts_1u8_ov2._.js"].map(s=>e.l(s))).then(()=>s(436194)))},536952,e=>{e.v(s=>Promise.all(["server/chunks/open-sse_services_combo_nativeCodexTurnPin_ts_1qbbfnk._.js"].map(s=>e.l(s))).then(()=>s(329066)))},209329,e=>{e.v(s=>Promise.all(["server/chunks/open-sse_services_0tblwfm._.js"].map(s=>e.l(s))).then(()=>s(184498)))},456734,e=>{e.v(e=>Promise.resolve().then(()=>e(719201)))},33456,e=>{e.v(s=>Promise.all(["server/chunks/open-sse_utils_proxyFallback_ts_0gkn32o._.js"].map(s=>e.l(s))).then(()=>s(675308)))},13076,e=>{e.v(s=>Promise.all(["server/chunks/[root-of-the-server]__0wlcpiw._.js"].map(s=>e.l(s))).then(()=>s(144480)))},42405,e=>{e.v(e=>Promise.resolve().then(()=>e(25687)))},530537,e=>{"use strict";var s=e.i(899378);let t=new Set(["status","prompt","source","options","result","activities","error","completed_at"]);e.s(["createCloudAgentTaskTable",0,function(){let e=(0,s.getDbInstance)();e.exec(`
    CREATE TABLE IF NOT EXISTS cloud_agent_tasks (
      id TEXT PRIMARY KEY,
      provider_id TEXT NOT NULL,
      external_id TEXT,
      status TEXT NOT NULL DEFAULT 'queued',
      prompt TEXT NOT NULL,
      source TEXT NOT NULL,
      options TEXT DEFAULT '{}',
      result TEXT,
      activities TEXT DEFAULT '[]',
      error TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      completed_at TEXT
    )
  `),e.exec(`
    CREATE INDEX IF NOT EXISTS idx_cloud_agent_tasks_provider
    ON cloud_agent_tasks(provider_id)
  `),e.exec(`
    CREATE INDEX IF NOT EXISTS idx_cloud_agent_tasks_status
    ON cloud_agent_tasks(status)
  `),e.exec(`
    CREATE INDEX IF NOT EXISTS idx_cloud_agent_tasks_created
    ON cloud_agent_tasks(created_at DESC)
  `)},"deleteCloudAgentTask",0,function(e){(0,s.getDbInstance)().prepare("DELETE FROM cloud_agent_tasks WHERE id = ?").run(e)},"getAllCloudAgentTasks",0,function(e=100){return(0,s.getDbInstance)().prepare("SELECT * FROM cloud_agent_tasks ORDER BY created_at DESC LIMIT ?").all(e)},"getCloudAgentTaskById",0,function(e){return(0,s.getDbInstance)().prepare("SELECT * FROM cloud_agent_tasks WHERE id = ?").get(e)},"getCloudAgentTasksByProvider",0,function(e,t=50){return(0,s.getDbInstance)().prepare("SELECT * FROM cloud_agent_tasks WHERE provider_id = ? ORDER BY created_at DESC LIMIT ?").all(e,t)},"getCloudAgentTasksByStatus",0,function(e,t=50){return(0,s.getDbInstance)().prepare("SELECT * FROM cloud_agent_tasks WHERE status = ? ORDER BY created_at DESC LIMIT ?").all(e,t)},"insertCloudAgentTask",0,function(e){(0,s.getDbInstance)().prepare(`
    INSERT INTO cloud_agent_tasks (
      id, provider_id, external_id, status, prompt, source,
      options, result, activities, error, created_at, updated_at, completed_at
    ) VALUES (
      @id, @provider_id, @external_id, @status, @prompt, @source,
      @options, @result, @activities, @error, @created_at, @updated_at, @completed_at
    )
  `).run(e)},"updateCloudAgentTask",0,function(e,r){let _=(0,s.getDbInstance)(),a={};for(let[e,s]of Object.entries(r))t.has(e)&&(a[e]=s);let n=Object.keys(a).map(e=>`${e} = @${e}`).join(", ");n&&_.prepare(`
    UPDATE cloud_agent_tasks
    SET ${n}, updated_at = datetime('now')
    WHERE id = @id
  `).run({id:e,...a})}])},589812,e=>{e.v(s=>Promise.all(["server/chunks/src_1nza9gd._.js"].map(s=>e.l(s))).then(()=>s(439951)))},727431,e=>{e.v(s=>Promise.all(["server/chunks/_064yotq._.js","server/chunks/src_lib_04wbzqh._.js","server/chunks/_1ye2ne6._.js","server/chunks/src_lib_0sjhhvv._.js","server/chunks/src_1a8hkds._.js"].map(s=>e.l(s))).then(()=>s(791588)))},84321,e=>{e.v(s=>Promise.all(["server/chunks/src_lib_contextWindowResolver_ts_0dkh2ir._.js"].map(s=>e.l(s))).then(()=>s(301433)))},379812,e=>{e.v(e=>Promise.resolve().then(()=>e(901686)))},500929,e=>{e.v(s=>Promise.all(["server/chunks/src_lib_db_adapters_sqljsAdapter_ts_1nouht5._.js"].map(s=>e.l(s))).then(()=>s(854474)))},734680,e=>{e.v(e=>Promise.resolve().then(()=>e(125852)))},94633,e=>{e.v(s=>Promise.all(["server/chunks/src_lib_db_models_activeSyncedCatalog_ts_1u5t5rk._.js"].map(s=>e.l(s))).then(()=>s(437843)))},789543,e=>{e.v(s=>Promise.all(["server/chunks/src_lib_db_providers_ts_0gomjr1._.js"].map(s=>e.l(s))).then(()=>s(385498)))},879780,e=>{e.v(e=>Promise.resolve().then(()=>e(403122)))},606102,e=>{e.v(s=>Promise.all(["server/chunks/src_lib_db_settings_ts_1m9ee3a._.js"].map(s=>e.l(s))).then(()=>s(548941)))},605589,e=>{e.v(s=>Promise.all(["server/chunks/src_lib_db_02v9l8q._.js","server/chunks/src_lib_localDb_ts_11n2jj9._.js"].map(s=>e.l(s))).then(()=>s(969738)))},799879,e=>{e.v(s=>Promise.all(["server/chunks/_1us1ka2._.js"].map(s=>e.l(s))).then(()=>s(60216)))},123492,e=>{e.v(s=>Promise.all(["server/chunks/src_lib_quota_0i2k8bq._.js"].map(s=>e.l(s))).then(()=>s(20954)))},897333,e=>{e.v(e=>Promise.resolve().then(()=>e(757239)))},521433,e=>{e.v(s=>Promise.all(["server/chunks/src_lib_020tu-y._.js"].map(s=>e.l(s))).then(()=>s(897114)))},422013,e=>{e.v(e=>Promise.resolve().then(()=>e(514138)))},49794,e=>{e.v(s=>Promise.all(["server/chunks/src_shared_constants_pricing_ts_0ut6kl4._.js","server/chunks/src_shared_constants_pricing_ts_1y5sqnp._.js"].map(s=>e.l(s))).then(()=>s(404503)))},73006,e=>{e.v(s=>Promise.all(["server/chunks/src_shared_services_0alhikv._.js"].map(s=>e.l(s))).then(()=>s(910263)))},579042,e=>{e.v(s=>Promise.all(["server/chunks/src_shared_utils_apiKey_ts_1-k4saf._.js"].map(s=>e.l(s))).then(()=>s(65448)))},252568,e=>{e.v(e=>Promise.resolve().then(()=>e(931680)))},263404,e=>{e.v(s=>Promise.all(["server/chunks/_1t1k-jz._.js"].map(s=>e.l(s))).then(()=>s(710876)))}];

//# sourceMappingURL=_16dvg-p._.js.map