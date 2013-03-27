/*! Drag, Drop & Process data from spreadsheet - v0.1.0 - 2013-03-26
* https://github.com/kstevens715/dropTable
* Copyright (c) 2013 Kyle Stevens; Licensed MIT */
//TODO: Next step is to copy a raw csv string into a div for testing, and allow it to be drag and dropped.
//      It will simulate dragging and dropping from a spreadsheet.
(function($) {

  // A user defined callback to process each row.
  var onRowProcessed;

  var methods = {
    drop: function(e) {
      var data = e.originalEvent.dataTransfer.getData("text/plain"); //Text
      var result = $.csv.toArrays(data, { separator: "\t" });
      methods.drawHtml(result);
      return true;
    },
    dragOver: function() {
      // return false to allow drops, true otherwise.
      return false;
    },
    dragEnter: function() {
      //todo: addClass
      return false;
    },
    dragLeave: function() {
      //todo: removeClass
      return false;
    },
    drawHtml: function(rows) {
      var sheet = document.getElementById('spreadsheet');
      var output = "<table>";
      for (var rowIndex=0; rowIndex<rows.length; rowIndex++) {
        var row = rows[rowIndex];

        //TODO: Pass an object instead of an array if we have column headers.
        onRowProcessed(row);

        output += "<tr>";
        for (var colIndex=0; colIndex<row.length; colIndex++) {
          output = output + "<td>" + row[colIndex] + "</td>";
        }
        output += "</tr>";
      }
      output += "</table>";
      sheet.innerHTML = output;
    }
  };

  $.fn.dropTable = function(callback) {

    onRowProcessed = callback;

    this.on('dragover',  methods.dragOver);
    this.on('drop',      methods.drop);
    this.on('dragenter', methods.dragEnter);
    this.on('dragleave', methods.dragLeave);
    return this;

  };

})(jQuery);

