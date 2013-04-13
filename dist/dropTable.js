/*! Drag, Drop & Process data from spreadsheet - v0.1.0 - 2013-04-13
* https://github.com/kstevens715/dropTable
* Copyright (c) 2013 Kyle Stevens; Licensed MIT */
(function($) {

  var BADGE = "Badge";

  var that,
      options;

  var methods = {

    init: function(opts) {

      this.each(function() {
        var data = that.data('dropTable');

        if (!data) {
          that.data('dropTable', {
            rows: [],
            columns: []
          });
        }
      });

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
        that.data('dropTable').rows = methods.parseData(data);
        methods.extractHeaders();

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

    extractHeaders: function() {
      if (options.firstRowIsHeader) {
        that.data('dropTable').rows[0].forEach(function(headerText, columnIndex) {
          that.data('dropTable').columns[columnIndex] = headerText.toLowerCase();
        });
      }
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

      var output,
          colHeader;
      
      output = '<table class="table table-striped table-bordered">' +
               '<thead>';

      // Output Header Row
      that.data('dropTable').rows[0].forEach(function(field, index) {
        colHeader = that.data('dropTable').columns[index];
        if (colHeader === undefined) {
          output += "<th>UNMAPPED</th>";
          that.data('dropTable').columns[index] = 'UNMAPPED' + index;
        } else {
          output += "<th><span class='badge'>" + colHeader  + "</span></th>";
        }
      });

      output += "</thead><tbody>";

      that.data('dropTable').rows.forEach(function(row) {
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
      that.data('dropTable').columns[this.cellIndex] = data.toLowerCase();
      $(this).html("<span class='badge'>" + data  + "</span>");
      $("li span.badge:contains('" + data + "')").parent().remove();
    }
  };

  var publicMethods = {

    process: function() {
      var row = {};

      if (typeof options.fnProcessRow === "function") {
        that.data('dropTable').rows.forEach(function(rowArray, rowIndex) {
          if (!options.firstRowIsHeader || rowIndex > 0) {
            row.rawData = rowArray;
            rowArray.forEach(function(cellValue, colIndex) {
              row[that.data('dropTable').columns[colIndex]] = cellValue;
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

