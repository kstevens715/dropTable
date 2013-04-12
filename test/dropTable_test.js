(function($) {
    //http://api.qunitjs.com/
  // This is all that I need from the event
  // e.originalEvent.dataTransfer.getData("text/plain");

  var dropEventMock = function(data, srcFormat) {
    srcFormat = typeof srcFormat !== 'undefined' ? srcFormat : 'Text';
    return window._$.Event("drop", {
      originalEvent: {
        dataTransfer: {
          getData: function(dataFormat) {
            return dataFormat === srcFormat ? data : "";
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
    expect(3);
    var columns,
        e = dropEventMock('a\nb\nc\n'),
        opts = {
          columnDefinitions: {
            title: true,
            body: false,
            assignee: false
          }
        };
    this.dTable.dropTable(opts);
    this.dTable.trigger(e);
    columns = this.dTable.find('.droptable-columndefinitions > li');
    equal(columns[0].innerText, 'title');
    equal(columns[1].innerText, 'body');
    equal(columns[2].innerText, 'assignee');
  });

  test('badges cannot be dropped as data', function() {
    var e = dropEventMock('title', 'Badge'),
        dataDropped = false,
        opts = {
          columnDefinitions: {
            title: true,
            body: false
          },
          fnDropComplete: function() {
            dataDropped = true;
          }
        };
    this.dTable.dropTable(opts);
    this.dTable.trigger(e);
    ok(!dataDropped);
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

  test('can map columns', function() {
    expect(3);
    var e = dropEventMock('10001\tBLK\tS\n'),
        opts = {
          columnDefinitions: ['style', 'color', 'size'],
          delayProcessing: true,
          fnProcessRow: function(row) {
            equal(row.style, '10001');
            equal(row.color, 'BLK');
            equal(row.size, 'S');
        }
    };

    this.dTable.dropTable(opts);
    this.dTable.trigger(e);
    $('#dTable th:eq(0)').trigger(dropEventMock('style', 'Badge'));
    $('#dTable th:eq(1)').trigger(dropEventMock('Color', 'Badge'));
    $('#dTable th:eq(2)').trigger(dropEventMock('SIZE', 'Badge'));
    this.dTable.dropTable('process');
  });

  test('column headers can be automatically mapped', function() {
    expect(3);var e = dropEventMock('style\tColor\tSIZE\n10001\tBLK\tS\n'),
        opts = {
          firstRowIsHeader: true,
          fnProcessRow: function(row) {
            equal(row.style, '10001'); 
            equal(row.color, 'BLK');
            equal(row.size, 'S');
          } 
        };
     this.dTable.dropTable(opts);
     this.dTable.trigger(e);
   });

  test('fnProcessRow is passed row data', function() {
    expect(1);
    var e = dropEventMock('a\tb\tc\n');
    var data = null;
    var opts = {
      fnProcessRow: function(row) {
        data = row.rawData;
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
        data = row.rawData;
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
    var data,
        e = dropEventMock('a\tb\tc\n', 'text/html'),
        opts = {
          dataFormat: 'text/html',
          fnProcessRow: function(row) { data = row.rawData; }
        };
    this.dTable.dropTable(opts);
    this.dTable.trigger(e);
    deepEqual(data, ['a', 'b', 'c']);
  });

  test('is chainable', function() {
    expect(1);
    strictEqual(this.dTable.dropTable(), this.dTable, 'should be chainable');
  });

}(jQuery));
