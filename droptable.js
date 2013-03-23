(function( $ ) {

  $.fn.dropTable = function() {

    this.on('dragover', dragOver);
    this.on('drop', dragDrop);
    this.on('dragenter', dragEnter);
    this.on('dragleave', dragLeave);
  };

  function dragDrop(e) {
    //text/plain
    var src = e.originalEvent.dataTransfer.getData("text/html");

    c = $('<div></div>')
    c.html(src)
    $(this).html('<table>' + $('table', c).html() + '</table>')

    console.log(src);
    return true;
  };

  function dragOver(e) {
    // return false to allow drops, true otherwise.
    return false;
  };

  function dragEnter(e) {
    //todo: addClass
    return false;
  };

  function dragLeave(e) {
    //todo: removeClass
    return false;
  };

})( jQuery );

//   // $('#droppablediv').dropImport(
//   //  fields: { one: true, two: false}
//   //  processRecords: function(record) { }
// function processRecords(fn) {
//   // for each record
//   // record = { colname: value, col2name: value }
//   // fn(record)
// }
// 
// function parseData(data) {
//   var lines = [];
//   var rows = data.split("\n");
//   for (var rowIndex=0; rowIndex<rows.length; rowIndex++) {
//     row = rows[rowIndex].split("\t");
//     lines[rowIndex] = []
//     for (var colIndex=0; colIndex<row.length; colIndex++) {
//       lines[rowIndex][colIndex] = row[colIndex]
//     }
//   }
//   return lines
// }
// 
// function drawHtml(rows) {
//   sheet = document.getElementById('spreadsheet');
//   output = "<table>";
//   for (var rowIndex=0; rowIndex<rows.length; rowIndex++) {
//     row = rows[rowIndex];
//     output += "<tr>"
//     for (var colIndex=0; colIndex<row.length; colIndex++) {
//       output = output + "<td>" + row[colIndex] + "</td>";
//     }
//     output += "</tr>";
//   }
//   output += "</table>";
//   sheet.innerHTML = output;
// }
// 
