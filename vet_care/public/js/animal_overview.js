
// frappe.ui.form.on('Animal Overview', {
//     refresh(frm) {
// frm.fields_dict['items'].grid.get_field('batch').get_query = function(doc, cdt, cdn) {
//         var child = locals[cdt][cdn];
//         //console.log(child);
//         return {    
//             filters:[
//                 ['item', '=', child.item_code]
//             ]
//         }
//     }
// }
// })
this.frm.cscript.onload = function (frm) {
    this.frm.set_query("batch_no", "items", function (doc, cdt, cdn) {
        let d = locals[cdt][cdn];
        if (!d.item_code) {
            frappe.msgprint(__("Please select Item Code"));
        }
        else if (!d.warehouse) {
            frappe.msgprint(__("Please select source warehouse"));
        }
        else {
            return {
                query: "vet_care.doc_events.animal_overview.get_batch_no",
                filters: {
                    'item_code': d.item_code,
                    'warehouse': d.warehouse
                }
            }
        }
    });
}

// frappe.ui.form.on('Animal Overview Item', 'warehouse', function(frm, cdt, cdn) {
//     $.each(frm.doc.items || [], function(i, d) {
//         // has_batch_no = frappe.db.get_value("Item", d.item_code, "has_batch_no")
//         // if (has_batch_no) {
//         frappe.call({
//                 method: "vet_care.doc_events.animal_overview.set_batch_no",
//                 args: {item_code:d.item_code,warehouse:d.warehouse,qty:d.qty},
//                 callback: function(r) {
//                     console.log(r.message[0].name);
//                     var batch = r.message[0].name
//                     frappe.model.set_value(cdt, cdn, d.batch, r.message[0].name);
//         d.batch=r.message[0].name
//                 }
//             });	
//         //}
//      })
//       refresh_field("item_code");
//     })
frappe.ui.form.on('Animal Overview Item', 'item_code', function(frm, cdt, cdn) {
$.each(frm.doc.items || [], function(i, d) {
    frappe.call({
        method: "vet_care.doc_events.animal_overview.get_warehouse",
        args: {"item_code":d.item_code},
        callback: function(r) {
            console.log(r.message);
            var warehouse = r.message
            frappe.model.set_value(cdt, cdn, d.warehouse, r.message);
            d.warehouse=warehouse
        }
    })
})
      refresh_field("item_code");
})