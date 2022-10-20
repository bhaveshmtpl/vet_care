# -*- coding: utf-8 -*-
# Copyright (c) 2020, 9T9IT and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.desk.reportview import get_match_cond, get_filters_cond
# from erpnext.stock.doctype.batch.batch import get_batch_no

# @frappe.whitelist()
# def set_batch_no(item_code,warehouse,qty):
#     # for d in items:
#     #     has_batch_no = frappe.db.get_value("Item", d.item_code, "has_batch_no")
#     #     if has_batch_no:
#     #         batch = get_batch_no(d.get("item_code"),d.get("warehouse"),throw=False)
#     #         return batch
#     # has_batch_no = frappe.db.get_value("Item", '{0}', "has_batch_no")
#     # if has_batch_no:
#     # batch = get_batch_no('{0}','{1}',throw=False)
#     batch_no = None
#     batches = frappe.db.sql('''SELECT distinct b.name,b.item,`tabStock Ledger Entry`.warehouse, sum(`tabStock Ledger Entry`.actual_qty) as qty from `tabBatch` b join `tabStock Ledger Entry` ignore index (item_code, warehouse) on (b.name = `tabStock Ledger Entry`.batch_no ) where `tabStock Ledger Entry`.item_code = '{0}'  and (b.expiry_date >= CURDATE() or b.expiry_date IS NULL) and `tabStock Ledger Entry`.warehouse = '{1}'  group by batch_id order by b.expiry_date ASC, b.creation ASC'''.format(item_code,warehouse),as_dict=1)
#     for batch in batches:
# 		if cint(qty) <= cint(batch.qty):
# 			batch_no = batch.batch_id
# 			break

# 	if not batch_no:
# 		frappe.msgprint(_('Please select a Batch for Item {0}. Unable to find a single batch that fulfills this requirement').format(frappe.bold(item_code)))
# 		if throw:
# 			raise UnableToSelectBatchError

# 	return batch_no
  
    # print("////////////////",batch)
@frappe.whitelist(allow_guest=True)
def get_warehouse(item_code):
  if item_code:
    pos_profile = frappe.db.get_single_value("Vetcare Settings", "pos_profile")
    warehouse = frappe.db.get_value("POS Profile", pos_profile, "warehouse")
    return warehouse
    frappe.msgprint(str(warehouse))

@frappe.whitelist(allow_guest=True)
def get_batch_no(doctype, txt, searchfield, start, page_len, filters):
	cond = ""

	meta = frappe.get_meta("Batch")
	searchfield = meta.get_search_fields()

	searchfields = " or ".join(["batch." + field + " like %(txt)s" for field in searchfield])

	if filters.get("posting_date"):
		cond = "and (batch.expiry_date is null or batch.expiry_date >= %(posting_date)s)"

	batch_nos = None
	args = {
		'item_code': filters.get("item_code"),
		'warehouse': filters.get("warehouse"),
		'posting_date': filters.get('posting_date'),
		'txt': "%{0}%".format(txt),
		"start": start,
		"page_len": page_len
	}

	if args.get('warehouse'):
		batch_nos = frappe.db.sql("""select sle.batch_no,round(sum(sle.actual_qty),2), sle.stock_uom,sle.warehouse
				from `tabStock Ledger Entry` sle
					INNER JOIN `tabBatch` batch on sle.batch_no = batch.name
				where
					sle.item_code = %(item_code)s
					and sle.warehouse = %(warehouse)s
					and batch.docstatus < 2
					and (sle.batch_no like %(txt)s or {searchfields})
					{0}
					{match_conditions}
				group by batch_no having sum(sle.actual_qty) > 0
				order by batch.expiry_date, sle.batch_no desc
				limit %(start)s, %(page_len)s""".format(cond, match_conditions=get_match_cond(doctype), searchfields=searchfields), args)

	if batch_nos:
		return batch_nos
	else:
		return frappe.db.sql("""select name, expiry_date from `tabBatch` batch
			where item = %(item_code)s
			and name like %(txt)s
			and docstatus < 2
			{0}
			{match_conditions}
			order by expiry_date, name desc
			limit %(start)s, %(page_len)s""".format(cond, match_conditions=get_match_cond(doctype)), args)		