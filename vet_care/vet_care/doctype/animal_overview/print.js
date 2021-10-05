function print_history(frm, print_data_) {
  frappe.ui.get_print_settings(
    false,
    (print_settings) =>
      _print_clinical_history(
        {
          patient: frm.doc.animal_name,
          data: frm.clinical_history,
          customer: frm.doc.owner_name,
          cur_date:print_data_.cur_date_,
          chip_id: frm.doc.chip_id,
          dob: frm.doc.dob,
          neutered: frm.doc.neutered,
          color: frm.doc.color,
          deceased: print_data_.deceased ,
          species: frm.doc.species,
          breed: frm.doc.breed
        },
        print_settings
      ),
    null
  );
}

function print_activity(frm) {
  frappe.ui.get_print_settings(
    false,
    (print_settings) =>
      _print_activity(
        {
          patient: frm.doc.animal,
          data: frm.activity_items,
        },
        print_settings
      ),
    null
  );
}

// TODO: make a general function for print
// https://github.com/frappe/frappe/blob/version-11/frappe/public/js/frappe/views/reports/query_report.js#L823
function _print_clinical_history(data, print_settings) {
  const base_url = frappe.urllib.get_base_url();
  const print_css = frappe.boot.print_css;
  const landscape = print_settings.orientation == "Landscape";
  const content = frappe.render_template("clinical_history", {
    patient: data.patient,
    data: data.data,
    cur_date: data.cur_date,
    customer: data.customer,
    chip_id: data.chip_id,
    dob: data.dob,
    neutered: data.neutered,
    color: data.color,
    deceased: data.deceased,
    species: data.species,
    breed: data.breed
  });
  const html = frappe.render_template("print_template", {
    title: "Clinical History",
    columns: [],
    content,
    base_url,
    print_css,
    print_settings,
    landscape,
  });
  frappe.render_pdf(html, print_settings);
}

function _print_activity(data, print_settings) {
  const base_url = frappe.urllib.get_base_url();
  const print_css = frappe.boot.print_css;
  const landscape = print_settings.orientation == "Landscape";
  const content = frappe.render_template("patient_activity", {
    patient: data.patient,
    data: data.data,
  });
  const html = frappe.render_template("print_template", {
    title: "Clinical History",
    columns: [],
    content,
    base_url,
    print_css,
    print_settings,
    landscape,
  });
  frappe.render_pdf(html, print_settings);
}
