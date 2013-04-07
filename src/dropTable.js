/*
 * dropTable
 * https://github.com/kstevens715/dropTable
 *
 * Copyright (c) 2013 Kyle Stevens
 * Licensed under the MIT license.
 */

(function($) {

  var BADGE = "Badge";

  var that,
      options,
      rows = [];

  var methods = {

    init: function(opts) {

      options = $.extend({
        fnProcessRow: null,     // A callback to process each row.
        fnDropComplete: null,   // Called after drop and all processing.
        delayProcessing: false, // 
        fieldDelimiter: "\t",   // The field delimiter to parse dropped data.
        dataFormat: "Text",     // Text seems to be most compatible.
        columnDefinitions: null
      }, opts);

      this.on('dragover',  methods.dragOver);
      this.on('drop',      methods.drop);
      this.on('dragenter', methods.dragEnter);
      this.on('dragleave', methods.dragLeave);

      methods.renderDropTable();

    },

    drop: function(e) {
      var data = e.originalEvent.dataTransfer.getData(options.dataFormat);
      rows = methods.parseData(data);

      if (!options.delayProcessing) {
        publicMethods.process();
      }

      methods.renderTable();

      if (typeof(options.fnDropComplete) === 'function') {
        options.fnDropComplete();
      }

      return true;
    },

    dragOver: function(e) {
      return methods.isBadge(e);
    },

    dragEnter: function() {
      return false;
    },

    dragLeave: function() {
      return false;
    },

    isBadge: function(e) {
      var data = e.originalEvent.dataTransfer.getData(BADGE);
      return data === "" ? false : true;
    },

    parseData: function(data) {
      return $.csv.toArrays(data, { separator: options.fieldDelimiter });
    },

    renderDropTable: function() {
      var output =
        "<div class='droptable-sidebar'>" +
        "</div>" +
        "<div class='droptable-droparea'>" +
        "<p>Drop Data Here!</p>"+
        "</div>";
      that.html(output);
      methods.renderSidebar();
    },

    renderSidebar: function() {
      var output = '<div><ul class="droptable-columndefinitions unstyled">';
      for (var column in options.columnDefinitions) {
        output += '<li>';
        output += '<span class="badge" draggable="true" ';
        output += 'ondragstart="';
        output += 'event.dataTransfer.setData(\'Badge\', \'' + column + '\')"';
        output += '>';
        output += column ;
        output += '</span></li>';
      }
      output += "</ul></div>";
      that.find('.droptable-sidebar').html(output);
    },

    renderTable: function() {

      var output = '<table class="table table-striped table-bordered">';
      var row, 
          rowIndex,
          colIndex;

      output += '<thead>';
      output += '<tr><th><span class="badge">test</span></th><th></th><th></th></tr>';
      output += '</thead>';
      output += '<tbody>';

      for (rowIndex=0; rowIndex<rows.length; rowIndex++) {
        row = rows[rowIndex];

        output += "<tr>";

        for (colIndex=0; colIndex<row.length; colIndex++) {
          output = output + "<td>" + row[colIndex] + "</td>";
        }

        output += "</tr>";
      }
      output += "</tbody>";
      output += "</table>";
      that.find('.droptable-droparea').html(output);
    }
  };

  var publicMethods = {

    process: function() {
      var row,
          rowIndex;

      if (typeof(options.fnProcessRow) === "function") {
        for (rowIndex=0; rowIndex<rows.length; rowIndex++) {
          row = rows[rowIndex];
          options.fnProcessRow(row, rowIndex + 1);
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

