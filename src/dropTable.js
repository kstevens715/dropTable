/*
 * dropTable
 * https://github.com/kstevens715/dropTable
 *
 * Copyright (c) 2013 Kyle Stevens
 * Licensed under the MIT license.
 */

//TODO: Callback when data is dropped.
//TODO: Manually call method to process rows.
//TODO: Anything with keys, hashes, column headers, etc?
//TODO: Fallback to simple csv parsing if csv plugin isn't available.
//      (console.log a warning).
//TODO: Styling.
//TODO: What about escaping the data from the drag and drop operation?
(function($) {

  var that;
  var options;

  var methods = {

    drop: function(e) {
      var data = e.originalEvent.dataTransfer.getData(options.dataFormat);
      var result = $.csv.toArrays(data, { separator: options.fieldDelimiter });
      methods.drawHtml(result);
      if (typeof(options.fnDropComplete) === 'function') {
        options.fnDropComplete();
      }
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

      var output = "<table>";
      var row;

      for (var rowIndex=0; rowIndex<rows.length; rowIndex++) {
        row = rows[rowIndex];

        //TODO: Pass an object instead of an array if we have column headers.
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
      that.html(output);
    }
  };

  $.fn.dropTable = function(opts) {

    that = this;

    options = $.extend({
      fnProcessRow: null,   // A callback to process each row.
      fnDropComplete: null, // Called after drop and all processing.
      processOnDrop: true,  // Whether to process rows automatically.
      fieldDelimiter: "\t", // The field delimiter to parse dropped data.
      dataFormat: "Text"    // Text seems to be most compatible.
    }, opts);

    //bind?
    this.on('dragover',  methods.dragOver);
    this.on('drop',      methods.drop);
    this.on('dragenter', methods.dragEnter);
    this.on('dragleave', methods.dragLeave);

    return this;

  };

})(jQuery);

