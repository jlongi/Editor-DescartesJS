/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var editor = (function(editor) {

  var indexBullet = true;

  /**
   *
   */
  editor.Console = function() { }

  editor.Console.prototype.log = function(arg) {
    indexBullet = !indexBullet;
    var str = (indexBullet) ? "● " : "○ ";
    for (i = 0; i < arg.length; i++) {
      str += arg[i] + " ";
    }

    var logDiv = editor.consoleWin.window.document.body.querySelector("#log");
    (logDiv.appendChild(document.createElement("div"))).innerHTML = str;

    // scroll to the end of the logDiv
    logDiv.scrollIntoView(false);
  }
  
  return editor;
})(editor || {});
