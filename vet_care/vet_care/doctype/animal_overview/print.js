function print_history(frm) {
  frappe.ui.get_print_settings(
    false,
    (print_settings) =>
      _print_clinical_history(
        {
          patient: frm.doc.animal,
          animal_name:frm.doc.animal_name,
          default_owner:frm.doc.default_owner,
          owner_name:frm.doc.owner_name,
          data: frm.clinical_history,
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

  // get current date and time 
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
  const content = frappe.render_template("clinical_history", {
    patient: data.patient,
    animal_name:data.animal_name,
    default_owner:data.default_owner,
    owner_name:data.owner_name,
    printed_on:dateTime,
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
