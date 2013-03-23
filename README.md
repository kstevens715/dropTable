ddTables
========

A jQuery plugin that allows dragging and dropping data from desktop spreadsheet applications. 
You can then define a callback function to arbitrarily process each record.

* Have a shell of a jQuery plugin.
* Have basic testing framework in place.
* Have drag and drop functionality creating data structure.
* It should also create an HTML table.

Example
=======

$('#spreadsheet').dropify({
  fields: { "field1": true, "field2": false }
  processRecords: function(record) {
    someAjaxCall(record.field1, record.field2);
  }
});

