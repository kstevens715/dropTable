/*
 * dropTable
 * https://github.com/kstevens715/dropTable
 *
 * Copyright (c) 2013 Kyle Stevens
 * Licensed under the MIT license.
 */

//TODO: Anything with keys, hashes, column headers, etc?
//TODO: Fallback to simple csv parsing if csv plugin isn't available.
//      (console.log a warning).
//TODO: Styling.
//TODO: What about escaping the data from the drag and drop operation?
(function($) {

  var DISALLOW_DROP = false;
  var that;
  var options;
  var rows = [];

  var methods = {

    init: function(opts) {

      options = $.extend({
        fnProcessRow: null,     // A callback to process each row.
        fnDropComplete: null,   // Called after drop and all processing.
        delayProcessing: false, // 
        fieldDelimiter: "\t",   // The field delimiter to parse dropped data.
        dataFormat: "Text"      // Text seems to be most compatible.
      }, opts);

      this.on('dragover',  methods.dragOver);
      this.on('drop',      methods.drop);
      this.on('dragenter', methods.dragEnter);
      this.on('dragleave', methods.dragLeave);

    },

    drop: function(e) {
      var data = e.originalEvent.dataTransfer.getData(options.dataFormat);
      //TODO: Put $.csv behind a facade.
      rows = $.csv.toArrays(data, { separator: options.fieldDelimiter });
      methods.drawHtml();
      if (typeof(options.fnDropComplete) === 'function') {
        options.fnDropComplete();
      }
      return true;
    },

    dragOver: function() {
      return DISALLOW_DROP;
    },

    dragEnter: function() {
      //TODO: addClass
      return false;
    },

    dragLeave: function() {
      //TODO: removeClass
      return false;
    },

    drawHtml: function() {

      var output = "<table>";
      var row;

      for (var rowIndex=0; rowIndex<rows.length; rowIndex++) {
        row = rows[rowIndex];

        //TODO: Pass an object instead of an array if we have column headers.
        if (!options.delayProcessing &&
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

  var publicMethods = {

    process: function() {
      //TODO: DRY this, and the similar functionality in drawHTML.
      var row;
      for (var rowIndex=0; rowIndex<rows.length; rowIndex++) {
        row = rows[rowIndex];

        if (typeof(options.fnProcessRow) === "function") {
          options.fnProcessRow(row);
        }
      }
    }
  };

  $.fn.dropTable = function(method) {

    that = this;

    if (publicMethods[method]) {
      publicMethods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      methods.init.apply(this, arguments);
    } else {
      //TODO: Handle this with an error.
      //See jQuery plugin guide for how they do it.
    }

    return this;

  };

})(jQuery);

