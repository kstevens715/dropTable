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
      rows = [],
      columns = [];

  var methods = {

    init: function(opts) {

      options = $.extend({
        fnProcessRow: null,     // A callback to process each row.
        fnDropComplete: null,   // Called after drop and all processing.
        delayProcessing: false, // 
        fieldDelimiter: "\t",   // The field delimiter to parse dropped data.
        dataFormat: "Text",     // Text seems to be most compatible.
        columnDefinitions: null,
        firstRowIsHeader: false
      }, opts);

      this.on('dragover',  methods.dragOver);
      this.on('drop',      methods.drop);
      this.on('dragenter', methods.dragEnter);
      this.on('dragleave', methods.dragLeave);

      methods.renderDropTable();

    },

    drop: function(e) {
      if (!methods.isBadge(e)) {
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
      } else {
        return false; //TODO: What should be the return value of drop?
      }
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
        output += '<li id="droptable-badge-' + column + '">';
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

    applyStyling: function() {
      //TODO: 
    },

    renderTable: function() {

      var output;
      
      output = '<table class="table table-striped table-bordered">' +
               '<thead>';

      rows[0].forEach(function(field, index) {
        output += "<th>UNMAPPED</th>";
        columns[index] = 'UNMAPPED' + index;
      });

      output += "</thead><tbody>";


      rows.forEach(function(row) {
        output += "<tr>";
        row.forEach(function(cellValue) {
          output = output + "<td>" + cellValue + "</td>";
        });
        output += "</tr>";
      });

      output += "</tbody>";
      output += "</table>";
      that.find('.droptable-droparea').html(output);

      var header = that.find('th');
      header.on('dragover', methods.dragOverColumn);
      header.on('drop', methods.mapColumn);
    },

    dragOverColumn: function(e) {
      var data = e.originalEvent.dataTransfer.getData(BADGE);
      return data === BADGE ? true : false;
    },

    mapColumn: function(e) {
      var data = e.originalEvent.dataTransfer.getData(BADGE);
      columns[this.cellIndex] = data.toLowerCase();
      $(this).html("<span class='badge'>" + data  + "</span>");
      $("li span.badge:contains('" + data + "')").parent().remove();
    }
  };

  var publicMethods = {

    process: function() {
      var row = {};

      if (typeof options.fnProcessRow === "function") {
        rows.forEach(function(rowArray, rowIndex) {
          if (rowIndex === 0 && options.firstRowIsHeader) {
            rowArray.forEach(function(cellValue, colIndex) {
              columns[colIndex] = cellValue.toLowerCase();
            });
          } else {
            row.rawData = rowArray;
            rowArray.forEach(function(cellValue, colIndex) {
              row[columns[colIndex]] = cellValue;
            });
            options.fnProcessRow(row, rowIndex + 1);
          }
        });
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

