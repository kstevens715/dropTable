(function($) {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */

  // This is all that I need from the event
  // e.originalEvent.dataTransfer.getData("text/plain");
  //

  dropEventMock = function(data) {
    return jQuery.Event("drop", {
      originalEvent: {
        dataTransfer: {
          getData: function(methType) {
            return data;
          }
        }
      }
    });
  };

  module('jQuery#dropTable', {
    // This will run before each test in this module.
    setup: function() {
      this.spreadsheet = $('#spreadsheet');
    }
  });

  test('callback is called once per row', function() {
    expect(1);
    var count = 0;
    var e = dropEventMock('a\nb\nc\n');
    this.spreadsheet.dropTable(function(row) { count += 1; });
    this.spreadsheet.trigger(e);
    strictEqual(count, 3)
  });

  test('callback is passed row data', function() {
    expect(1);
    var e = dropEventMock('a\tb\tc\n');
    var data = null;
    this.spreadsheet.dropTable(function(row) { data = row; });
    this.spreadsheet.trigger(e);
    deepEqual(data, ['a', 'b', 'c'])
  });

  test('is chainable', function() {
    expect(1);
    strictEqual(this.spreadsheet.dropTable(), this.spreadsheet, 'should be chainable');
  });

  // test('is awesome', function() {
  //   expect(1);
  //   strictEqual(this.elems.awesome().text(), 'awesome0awesome1awesome2', 'should be awesome');
  // });

  // module('jQuery.awesome');

  // test('is awesome', function() {
  //   expect(2);
  //   strictEqual($.awesome(), 'awesome.', 'should be awesome');
  //   strictEqual($.awesome({punctuation: '!'}), 'awesome!', 'should be thoroughly awesome');
  // });

  // module(':awesome selector', {
  //   // This will run before each test in this module.
  //   setup: function() {
  //     this.elems = $('#qunit-fixture').children();
  //   }
  // });

  // test('is awesome', function() {
  //   expect(1);
  //   // Use deepEqual & .get() when comparing jQuery objects.
  //   deepEqual(this.elems.filter(':awesome').get(), this.elems.last().get(), 'knows awesome when it sees it');
  // });

}(jQuery));
