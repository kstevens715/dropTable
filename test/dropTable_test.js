(function($) {

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
  },
    init = {
      setup: function() { 
        $('#qunit-fixture').html('<div id="dTable"></div>');
        this.dTable = $('#dTable');
      }
    };


  module('...', init);

  test('each row is class dropTableRow', function() {
    var e = dropEventMock('10001\tBLK\tS\n10001\tBLK\tM\n');
    this.dTable.dropTable();
    this.dTable.trigger(e);
  });

  module('mapping columns', init);

  test('column definitions display as badge list', function() {
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
    expect(3);
    var e = dropEventMock('style\tColor\tSIZE\n10001\tBLK\tS\n'),
    opts = {
      //TODO: column definitions are ignored here. Is this a feature or a bug?
      columnDefinitions: ['style', 'color', 'size'],
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

  test('automatically mapped columns display badge', function() {
    expect(3);
    var e = dropEventMock('style\tcolor\tsize\n10001\tBLK\tS\n'),
        opts = { firstRowIsHeader: true };
    this.dTable.dropTable(opts);
    this.dTable.trigger(e);
    equal($("#dTable th:eq(0)").html(), '<span class="badge">style</span>');
    equal($("#dTable th:eq(1)").html(), '<span class="badge">color</span>');
    equal($("#dTable th:eq(2)").html(), '<span class="badge">size</span>');
  });

  test('automatically mapped columns remove badge from unmapped list', function() {
    expect(5);
    var e = dropEventMock('style\tcolor\tsize\n10001\tBLK\tS\n'),
        opts = { 
          firstRowIsHeader: true,
          columnDefinitions: {'style': true, 'color': true, 'size': true, 'upc': true, 'sku': true}
        };
    this.dTable.dropTable(opts);
    this.dTable.trigger(e);
    equal($(".droptable-sidebar li:contains('style')").length, 0);
    equal($(".droptable-sidebar li:contains('color')").length, 0);
    equal($(".droptable-sidebar li:contains('size')").length, 0);
    equal($(".droptable-sidebar li:contains('sku')").length, 1);
    equal($(".droptable-sidebar li:contains('upc')").length, 1);
  });

  test('headers are only displayed in thead', function() {
    var e = dropEventMock('style\tcolor\tsize\n10001\tBLK\tS\n'),
        opts = { firstRowIsHeader: true };
    this.dTable.dropTable(opts);
    this.dTable.trigger(e);
    equal(this.dTable.find('td:contains("style")').length, 0, 'header displayed in tbody');
  });

  test('by default, all data is mapped as data rows (no headers)', function() {
    var e = dropEventMock('style\tcolor\tsize\n10001\tBLK\tS\n');
    this.dTable.dropTable();
    this.dTable.trigger(e);
    equal(this.dTable.find('tbody tr').length, 2);
  });

  module('callbacks', init);

  test('fnDropComplete called after drop', function() {
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

  test('fnProcessRow success indicator', function() {
    // not sure what the indicator should be. But something.
    // Should also have the same function as a progress bar.
    ok(false);
  });

  test('fnProcessRow failure changes row styling', function() {
    // default row class to 'error'. Make configurable.
    ok(false);
  });

  test('fnProcessRow failure adds error message column', function() {
    ok(false);
  });

  test('delayProcessing delays processing', function() {
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

  module('options', init);

  test('fieldDelimiter can be changed', function() {
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
    var e = dropEventMock('a\tb\tc\n');
    this.dTable.dropTable();
    this.dTable.trigger(e);
    ok(true, "options _are_ optional");
  });

  test('dataFormat can be set', function() {
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
    strictEqual(this.dTable.dropTable(), this.dTable, 'should be chainable');
  });

  test('exceeding maxRecordCount is not allowed', function() {
    //TODO: Probably display an alert box and reset state as if no data were dropped.
    // http://stackoverflow.com/questions/6608278/avoid-capture-verify-a-javascript-alert-when-testing-a-method-that-displays
    // sinonjs.org
    ok(false);
  });

  module('styling', init);

  test('table class defaults to `table`', function() {
    var e = dropEventMock('a\tb\tc\n');
    this.dTable.dropTable();
    this.dTable.trigger(e);
    strictEqual($('#dTable table').attr('class'), 'table');
  });

  test('table class can be overridden', function() {
    var e = dropEventMock('a\tb\tc\n'),
        opts = {
          tableClassNames: ['table-striped', 'table-bordered']
        };

    this.dTable.dropTable(opts);
    this.dTable.trigger(e);
    strictEqual($('#dTable table').attr('class'), 'table-striped table-bordered');

  });

}(jQuery));
