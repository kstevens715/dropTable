/*
 * dropTable
 * https://github.com/kstevens715/dropTable
 *
 * Copyright (c) 2013 Kyle Stevens
 * Licensed under the MIT license.
 */

//TODO: Next step is to copy a raw csv string into a div for testing, and allow it to be drag and dropped.
//      It will simulate dragging and dropping from a spreadsheet.
(function($) {

  // A user defined callback to process each row.
  var onRowProcessed;

  $.fn.dropTable = function(callback) {

    onRowProcessed = callback;

    this.on('dragover', dragOver);
    this.on('drop', dragDrop);
    this.on('dragenter', dragEnter);
    this.on('dragleave', dragLeave);
    return this;

  },

  dragDrop = function(e) {
    var data = e.originalEvent.dataTransfer.getData("text/plain"); //Text
    var result = $.csv.toArrays(data, { separator: "\t" });
    drawHtml(result);
    return true;
  },

  dragOver = function() {
    // return false to allow drops, true otherwise.
    return false;
  },

  dragEnter = function() {
    //todo: addClass
    return false;
  },

  dragLeave = function() {
    //todo: removeClass
    return false;
  },

  drawHtml = function(rows) {
    sheet = document.getElementById('spreadsheet');
    output = "<table>";
    for (var rowIndex=0; rowIndex<rows.length; rowIndex++) {
      row = rows[rowIndex];

      //TODO: Pass an object instead of an array if we have column headers.
      onRowProcessed(row);

      output += "<tr>"
      for (var colIndex=0; colIndex<row.length; colIndex++) {
        output = output + "<td>" + row[colIndex] + "</td>";
      }
      output += "</tr>";
    }
    output += "</table>";
    sheet.innerHTML = output;
  }

})(jQuery);

