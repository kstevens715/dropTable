# Drag, Drop & Process data from spreadsheet

Drag and drop data from LibreOffice and other spreadsheet applications and then process each row.

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/kstevens715/dropTable/master/dist/dropTable.min.js
[max]: https://raw.github.com/kstevens715/dropTable/master/dist/dropTable.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/dropTable.min.js"></script>
<script>
jQuery(function($) {
  $('#spreadsheet').dropTable({
    fields: { "field1": true, "field2": false }
    processRecords: function(record) {
      someAjaxCall(record.field1, record.field2);
    }
  });
});
</script>
<div id="spreadsheet"></div>
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Release History
_(Nothing yet)_
