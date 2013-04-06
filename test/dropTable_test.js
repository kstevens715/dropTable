(function($) {
    //http://api.qunitjs.com/
  // This is all that I need from the event
  // e.originalEvent.dataTransfer.getData("text/plain");

  var dropEventMock = function(data) {
    return window._$.Event("drop", {
      originalEvent: {
        dataTransfer: {
          getData: function() {
            return data;
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

  test('can delay callbacks', function() {
    expect(1);
    var count = 0;
    var opts = {
      processOnDrop: false,
      fnProcessRow: function() { count += 1; }
    };
    var e = dropEventMock('a\nb\nc\n');
    this.dTable.dropTable(opts);
    this.dTable.trigger(e);
    strictEqual(count, 0);
  });

  test('callback is called once per row', function() {
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

  test('callback is passed row data', function() {
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

  test('is chainable', function() {
    expect(1);
    strictEqual(this.dTable.dropTable(), this.dTable, 'should be chainable');
  });

}(jQuery));
