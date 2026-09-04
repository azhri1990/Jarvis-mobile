module.exports=[952893,e=>{"use strict";let n=new Uint8Array(16);e.s(["default",0,function(){return crypto.getRandomValues(n)}])},802097,630855,e=>{"use strict";let n=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;e.s(["default",0,function(e){return"string"==typeof e&&n.test(e)}],630855);let t=[];for(let e=0;e<256;++e)t.push((e+256).toString(16).slice(1));e.s(["unsafeStringify",0,function(e,n=0){return(t[e[n+0]]+t[e[n+1]]+t[e[n+2]]+t[e[n+3]]+"-"+t[e[n+4]]+t[e[n+5]]+"-"+t[e[n+6]]+t[e[n+7]]+"-"+t[e[n+8]]+t[e[n+9]]+"-"+t[e[n+10]]+t[e[n+11]]+t[e[n+12]]+t[e[n+13]]+t[e[n+14]]+t[e[n+15]]).toLowerCase()}],802097)},995031,e=>{"use strict";var n=e.i(952893),t=e.i(802097);e.s(["v4",0,function(e,r,s){return r||e||!crypto.randomUUID?function(e,r,s){let o=(e=e||{}).random??e.rng?.()??(0,n.default)();if(o.length<16)throw Error("Random bytes length must be >= 16");if(o[6]=15&o[6]|64,o[8]=63&o[8]|128,r){if((s=s||0)<0||s+16>r.length)throw RangeError(`UUID byte range ${s}:${s+15} is out of buffer bounds`);for(let e=0;e<16;++e)r[s+e]=o[e];return r}return(0,t.unsafeStringify)(o)}(e,r,s):crypto.randomUUID()}],995031)},853030,e=>{e.v(n=>Promise.all(["server/chunks/[root-of-the-server]__08aok8t._.js"].map(n=>e.l(n))).then(()=>n(260383)))},933762,e=>{e.v(n=>Promise.all(["server/chunks/[root-of-the-server]__0al_daj._.js"].map(n=>e.l(n))).then(()=>n(223764)))},381581,e=>{"use strict";var n=e.i(995031),t=e.i(335273),r=e.i(830471),s=e.i(330485);let o="default-caveman",i="Standard Savings",a="Default RTK + Caveman compression pipeline";function u(){return[{engine:"rtk",intensity:"standard"},{engine:"caveman",intensity:"full"}]}function c(e,n){if(Array.isArray(e))return e;if("string"!=typeof e)return n;try{let t=JSON.parse(e);return Array.isArray(t)?t:n}catch{return n}}let p=["lite","caveman","aggressive","ultra","rtk","headroom","session-dedup","ccr","llmlingua","relevance","codex-responses"];function m(e){return c(e,[]).filter(e=>e&&"object"==typeof e&&p.includes(String(e.engine)))}function l(){let e=(0,r.getDbInstance)();e.exec(`
    CREATE TABLE IF NOT EXISTS compression_combos (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      pipeline TEXT NOT NULL DEFAULT '[]',
      language_packs TEXT DEFAULT '["en"]',
      output_mode INTEGER DEFAULT 0,
      output_mode_intensity TEXT DEFAULT 'full',
      is_default INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS compression_combo_assignments (
      id TEXT PRIMARY KEY,
      compression_combo_id TEXT NOT NULL REFERENCES compression_combos(id) ON DELETE CASCADE,
      routing_combo_id TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(routing_combo_id)
    );

    CREATE INDEX IF NOT EXISTS idx_compression_combos_default
      ON compression_combos(is_default);
    CREATE INDEX IF NOT EXISTS idx_compression_combo_assignments_combo
      ON compression_combo_assignments(compression_combo_id);
    CREATE INDEX IF NOT EXISTS idx_compression_combo_assignments_routing
      ON compression_combo_assignments(routing_combo_id);
  `),e.prepare(`
    INSERT OR IGNORE INTO compression_combos (
      id, name, description, pipeline, language_packs, output_mode, output_mode_intensity, is_default
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(o,i,a,JSON.stringify(u()),JSON.stringify(["en"]),0,"full",1),function(){let e=(0,r.getDbInstance)(),n=e.prepare("SELECT name, description, pipeline FROM compression_combos WHERE id = ?").get(o);if(!n)return;let t=String(n.description??"");String(n.name??"")===i&&("Default Caveman compression pipeline"===t||t===a)&&function(e){if(1!==e.length)return!1;let[n]=e;return"caveman"===n.engine&&(void 0===n.intensity||"full"===n.intensity)}(m(n.pipeline))&&e.prepare(`
    UPDATE compression_combos
    SET description = ?, pipeline = ?, updated_at = ?
    WHERE id = ?
  `).run(a,JSON.stringify(u()),new Date().toISOString(),o)}()}function _(e){let n;if(!e)return null;let t=(0,s.rowToCamel)(e);return{id:String(t.id),name:String(t.name??""),description:String(t.description??""),pipeline:m(t.pipeline),languagePacks:[...new Set((n=c(t.languagePacks,["en"]).filter(e=>"string"==typeof e&&e.trim().length>0)).length>0?n.map(e=>e.trim()):["en"])],outputMode:!!t.outputMode,outputModeIntensity:String(t.outputModeIntensity??"full"),isDefault:!!t.isDefault,createdAt:String(t.createdAt??""),updatedAt:String(t.updatedAt??"")}}function d(e){if(!e)return null;let n=(0,s.rowToCamel)(e);return{id:String(n.id),compressionComboId:String(n.compressionComboId),routingComboId:String(n.routingComboId),createdAt:String(n.createdAt??"")}}function g(e,t){let r=new Date().toISOString();return{id:t?.id??e.id??(0,n.v4)(),name:e.name?.trim()||t?.name||"Compression Combo",description:e.description??t?.description??"",pipeline:e.pipeline&&e.pipeline.length>0?e.pipeline:t?.pipeline&&t.pipeline.length>0?t.pipeline:u(),languagePacks:e.languagePacks&&e.languagePacks.length>0?e.languagePacks:t?.languagePacks&&t.languagePacks.length>0?t.languagePacks:["en"],outputMode:e.outputMode??t?.outputMode??!1,outputModeIntensity:e.outputModeIntensity??t?.outputModeIntensity??"full",isDefault:e.isDefault??t?.isDefault??!1,createdAt:t?.createdAt??r,updatedAt:r}}function f(e){return l(),_((0,r.getDbInstance)().prepare("SELECT * FROM compression_combos WHERE id = ?").get(e))}function E(){return l(),_((0,r.getDbInstance)().prepare("SELECT * FROM compression_combos WHERE is_default = 1 ORDER BY updated_at DESC LIMIT 1").get())}let b={"session-dedup":3,ccr:4,lite:5,rtk:10,headroom:15,caveman:20,aggressive:30,llmlingua:35,ultra:40,"codex-responses":12};e.s(["assignRoutingCombo",0,function(e,s){return l(),!!f(e)&&!!s.trim()&&((0,r.getDbInstance)().prepare(`
      INSERT OR REPLACE INTO compression_combo_assignments (
        id, compression_combo_id, routing_combo_id, created_at
      )
      VALUES (?, ?, ?, ?)
    `).run((0,n.v4)(),e,s.trim(),new Date().toISOString()),(0,t.backupDbFile)("pre-write"),!0)},"createCompressionCombo",0,function(e){l();let n=(0,r.getDbInstance)(),s=g(e);return n.transaction(()=>{s.isDefault&&n.prepare("UPDATE compression_combos SET is_default = 0").run(),n.prepare(`
      INSERT INTO compression_combos (
        id, name, description, pipeline, language_packs, output_mode, output_mode_intensity,
        is_default, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(s.id,s.name,s.description,JSON.stringify(s.pipeline),JSON.stringify(s.languagePacks),+!!s.outputMode,s.outputModeIntensity,+!!s.isDefault,s.createdAt,s.updatedAt)})(),(0,t.backupDbFile)("pre-write"),f(s.id)},"deleteCompressionCombo",0,function(e){l();let n=f(e);if(!n||n.isDefault)return!1;let s=(0,r.getDbInstance)().prepare("DELETE FROM compression_combos WHERE id = ?").run(e);return s.changes>0&&(0,t.backupDbFile)("pre-write"),s.changes>0},"getAssignmentsForCompressionCombo",0,function(e){return l(),(0,r.getDbInstance)().prepare("SELECT * FROM compression_combo_assignments WHERE compression_combo_id = ? ORDER BY routing_combo_id").all(e).map(d).filter(e=>null!==e)},"getCompressionCombo",0,f,"getCompressionComboForRoutingCombo",0,function(e){return l(),_((0,r.getDbInstance)().prepare(`
      SELECT c.*
      FROM compression_combos c
      JOIN compression_combo_assignments a ON a.compression_combo_id = c.id
      WHERE a.routing_combo_id = ?
      LIMIT 1
    `).get(e))},"getDefaultCompressionCombo",0,E,"listCompressionCombos",0,function(){return l(),(0,r.getDbInstance)().prepare("SELECT * FROM compression_combos ORDER BY is_default DESC, name COLLATE NOCASE ASC").all().map(_).filter(e=>null!==e)},"setDefaultCompressionCombo",0,function(e){if(l(),!f(e))return!1;let n=(0,r.getDbInstance)(),s=new Date().toISOString();return n.transaction(()=>{n.prepare("UPDATE compression_combos SET is_default = 0").run(),n.prepare("UPDATE compression_combos SET is_default = 1, updated_at = ? WHERE id = ?").run(s,e)})(),(0,t.backupDbFile)("pre-write"),!0},"setEngineInDefaultCombo",0,function(e,n,s){if(!p.includes(e))return null;l();let o=E();if(!o)return null;let i=[...o.pipeline];if(n){let n=i.findIndex(n=>n.engine===e);n>=0?void 0!==s&&(i[n]={...i[n],config:s}):i.push({engine:e,...s?{config:s}:{}}),i.sort((e,n)=>(b[e.engine]??50)-(b[n.engine]??50))}else i=i.filter(n=>n.engine!==e);let a=(0,r.getDbInstance)(),u=new Date().toISOString();return a.prepare("UPDATE compression_combos SET pipeline = ?, updated_at = ? WHERE id = ?").run(JSON.stringify(i),u,o.id),(0,t.backupDbFile)("pre-write"),f(o.id)},"unassignRoutingCombo",0,function(e,n){l();let s=(0,r.getDbInstance)().prepare("DELETE FROM compression_combo_assignments WHERE compression_combo_id = ? AND routing_combo_id = ?").run(e,n);return s.changes>0&&(0,t.backupDbFile)("pre-write"),s.changes>0},"updateAssignments",0,function(e,s){if(l(),!f(e))return!1;let o=[...new Set(s.map(e=>e.trim()).filter(Boolean))],i=(0,r.getDbInstance)();return i.transaction(()=>{if(i.prepare("DELETE FROM compression_combo_assignments WHERE compression_combo_id = ?").run(e),o.length>0){let t=i.prepare("DELETE FROM compression_combo_assignments WHERE routing_combo_id = ?"),r=i.prepare(`
        INSERT INTO compression_combo_assignments (
          id, compression_combo_id, routing_combo_id, created_at
        )
        VALUES (?, ?, ?, ?)
      `);for(let s of o)t.run(s),r.run((0,n.v4)(),e,s,new Date().toISOString())}})(),(0,t.backupDbFile)("pre-write"),!0},"updateCompressionCombo",0,function(e,n){l();let s=f(e);if(!s)return null;let o=g(n,s),i=(0,r.getDbInstance)();return i.transaction(()=>{o.isDefault&&i.prepare("UPDATE compression_combos SET is_default = 0").run(),i.prepare(`
      UPDATE compression_combos
      SET name = ?, description = ?, pipeline = ?, language_packs = ?, output_mode = ?,
          output_mode_intensity = ?, is_default = ?, updated_at = ?
      WHERE id = ?
    `).run(o.name,o.description,JSON.stringify(o.pipeline),JSON.stringify(o.languagePacks),+!!o.outputMode,o.outputModeIntensity,+!!o.isDefault,o.updatedAt,e)})(),(0,t.backupDbFile)("pre-write"),f(e)}])},833389,e=>{e.v(n=>Promise.all(["server/chunks/[root-of-the-server]__0_mbv8f._.js","server/chunks/_06kegw-._.js","server/chunks/_0u09ium._.js","server/chunks/src_0c7els9._.js","server/chunks/_0tsp696._.js","server/chunks/_00gbtxh._.js","server/chunks/open-sse_1en0bdk._.js","server/chunks/src_lib_db_0q-5o4j._.js","server/chunks/src_02l7t6d._.js","server/chunks/_1zujanj._.js","server/chunks/node_modules_bcryptjs_index_0qfrcpc.js","server/chunks/src_1lk5r5a._.js","server/chunks/src_shared_120yvyy._.js"].map(n=>e.l(n))).then(()=>n(543125)))},136388,e=>{e.v(n=>Promise.all(["server/chunks/_1x71ks1._.js","server/chunks/_0u09ium._.js","server/chunks/src_06c8vs0._.js","server/chunks/_0tsp696._.js","server/chunks/[root-of-the-server]__0g0umdq._.js","server/chunks/src_lib_db_0q-5o4j._.js","server/chunks/src_02l7t6d._.js","server/chunks/open-sse_1en0bdk._.js","server/chunks/src_shared_120yvyy._.js","server/chunks/src_1lk5r5a._.js"].map(n=>e.l(n))).then(()=>n(974210)))}];

//# sourceMappingURL=_0pukt-5._.js.map