module.exports=[446908,e=>{"use strict";var t=e.i(899378),r=e.i(719201);e.s(["getDeliveries",0,function(e,r){return(0,t.getDbInstance)().prepare(`SELECT id, webhook_id, event_type, status, http_status, latency_ms, error, created_at
       FROM webhook_deliveries
       WHERE webhook_id = ?
       ORDER BY created_at DESC, id DESC
       LIMIT ?`).all(e,r)},"insertDelivery",0,function(e){let o=(0,t.getDbInstance)(),s=o.prepare(`INSERT INTO webhook_deliveries
       (webhook_id, event_type, status, http_status, latency_ms, error, payload_snapshot)
     VALUES (?, ?, ?, ?, ?, ?, ?)`),a=o.prepare(`DELETE FROM webhook_deliveries
     WHERE webhook_id = ?
       AND id NOT IN (
         SELECT id FROM webhook_deliveries
         WHERE webhook_id = ?
         ORDER BY created_at DESC, id DESC
         LIMIT ?
       )`),i=null!=e.error&&(0,r.sanitizeErrorMessage)(e.error)||null;o.transaction(()=>{s.run(e.webhookId,e.eventType,e.status,e.httpStatus??null,e.latencyMs??null,i,e.payloadSnapshot??null),a.run(e.webhookId,e.webhookId,100)})()}])}];

//# sourceMappingURL=src_lib_db_webhookDeliveries_ts_1h47ls-._.js.map