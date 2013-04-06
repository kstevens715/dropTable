/*
 * dropTable
 * https://github.com/kstevens715/dropTable
 *
 * Copyright (c) 2013 Kyle Stevens
 * Licensed under the MIT license.
 */

(function($) {

  var options;

  var methods = {

    drop: function(e) {
      var data = e.originalEvent.dataTransfer.getData("Text"); //Text
      var result = $.csv.toArrays(data, { separator: options.fieldDelimiter });
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
        //console.log("Callbacks? " + settings.runCallbacksOnDrop);
        if (options.processOnDrop &&
              typeof(options.fnProcessRow) === "function") {
          options.fnProcessRow(row);
        }

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

  $.fn.dropTable = function(opts) {

    options = $.extend({
      fnProcessRow: null,   // A callback to process each row.
      processOnDrop: true,  // Whether to process rows automatically.
      fieldDelimiter: "\t"  // The field delimiter to parse dropped data.
    }, opts);

    this.on('dragover',  methods.dragOver);
    this.on('drop',      methods.drop);
    this.on('dragenter', methods.dragEnter);
    this.on('dragleave', methods.dragLeave);
    return this;

  };

})(jQuery);

