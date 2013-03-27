# Drag, Drop & Process data from spreadsheet

A jQuery plugin that allows you to drag and drop data from a spreadsheet, and 
then define an arbitrary handler method to handle each row (so you could call
a web service, for example).

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
