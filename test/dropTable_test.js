(function($) {
    //http://api.qunitjs.com/
  // This is all that I need from the event
  // e.originalEvent.dataTransfer.getData("text/plain");

  var dropEventMock = function(data) {
    return window._$.Event("drop", {
      originalEvent: {
        dataTransfer: {
          getData: function(dataFormat) {
            if (dataFormat === "Text") {
              return data;
            } else {
              // A hack to make dataFormat option testable.
              return dataFormat + "\n";
            }
          }
        }
      }
    });
  };

  module('jQuery#dropTable', {
    setup: function() {
      $('#qunit-fixture').html('<div id="dTable"></div>');
      this.dTable = $('#dTable');
    },
    teardown: function() {
      $('#qunit-fixture').html('');
    }
  });

  test('fieldDefinitions display as badge list', function() {
    expect(1);
    var e = dropEventMock('a\nb\nc\n');
    var opts = {
      columnDefinitions: {
        title: true,
        body: false,
        assignee: false
      }
    };
    this.dTable.dropTable(opts);
    this.dTable.trigger(e);
    this.dTable;
    console.log('done');
  });

  test('fnDropComplete called after drop', function() {
    expect(1);
    var e = dropEventMock('a\nb\nc\n');
    var rowsProcessed = 0;
    var opts = {
      fnProcessRow: function() {
        rowsProcessed += 1;
      },
      fnDropComplete: function() {
        equal(rowsProcessed, 3);
      }
    };
    this.dTable.find('ul')
    this.dTable.dropTable(opts);
    this.dTable.trigger(e);

  });

  test('fnProcessRow called once per row', function() {
    expect(1);
    var count = 0;
    var e = dropEventMock('a\nb\nc\n');
    var opts = {
      fnProcessRow: function() {
        count += 1;
      }
    };
    this.dTable.dropTable(opts);
    this.dTable.trigger(e);
    strictEqual(count, 3);
  });

  test('fnProcessRow is passed row data', function() {
    expect(1);
    var e = dropEventMock('a\tb\tc\n');
    var data = null;
    var opts = {
      fnProcessRow: function(row) {
        data = row;
      }
    };
    this.dTable.dropTable(opts);
    this.dTable.trigger(e);
    deepEqual(data, ['a', 'b', 'c']);
  });

  test('fnProcessRow is passed row index', function() {
    expect(3);
    var rowsProcessed = 0;
    var e = dropEventMock('a\nb\nc\n');
    var opts = {
      fnProcessRow: function(row, index) {
        rowsProcessed += 1;
        equal(index, rowsProcessed);
      }
    };
    this.dTable.dropTable(opts);
    this.dTable.trigger(e);
  });

  test('delayProcessing delays processing', function() {
    expect(1);
    var rowsProcessed = 0;
    var e = dropEventMock('a\nb\nc\n');
    var opts = {
      delayProcessing: true,
      fnProcessRow: function() { rowsProcessed += 1; }
    };
    this.dTable.dropTable(opts);
    this.dTable.trigger(e);
    strictEqual(rowsProcessed, 0, "should not process rows automatically");
  });

  test('trigger process rows manually', function() {
    expect(2);
    var e = dropEventMock('a\nb\nc\n');
    var rowsProcessed = 0;
    var opts = {
      delayProcessing: true,
      fnProcessRow: function() { rowsProcessed += 1; }
    };
    this.dTable.dropTable(opts);
    this.dTable.trigger(e);
    equal(rowsProcessed, 0, "no rows should be processed");
    this.dTable.dropTable('process');
    equal(rowsProcessed, 3, "should process rows after `process`");
  });

  test('fieldDelimiter can be changed', function() {
    expect(1);
    var data = null;
    var e = dropEventMock('a,b,c\n');
    var opts = {
      fieldDelimiter: ',',
      fnProcessRow: function(row) {
        data = row;
      }
    };
    this.dTable.dropTable(opts);
    this.dTable.trigger(e);
    deepEqual(data, ['a', 'b', 'c']);
  });

  test('can be called without options', function() {
    expect(1);
    var e = dropEventMock('a\tb\tc\n');
    this.dTable.dropTable();
    this.dTable.trigger(e);
    ok(true, "options _are_ optional");
  });

  test('dataFormat can be set', function() {
    expect(1);
    var format;
    var e = dropEventMock('a\nb\nc\n');
    var opts = {
      dataFormat: 'text/html',
      fnProcessRow: function(row) { format = row; }
    };
    this.dTable.dropTable(opts);
    this.dTable.trigger(e);
    equal(format, "text/html");
  });

  test('is chainable', function() {
    expect(1);
    strictEqual(this.dTable.dropTable(), this.dTable, 'should be chainable');
  });

}(jQuery));
