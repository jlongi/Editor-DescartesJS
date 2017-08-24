/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var editor = (function(editor) {

  var indexBullet = 0;

  /**
   *
   */
  editor.Console = function() { }

  editor.Console.prototype.log = function(arg) {
    var str = "";
    for (i = 0; i < arg.length; i++) {
      str += arg[i] + " ";
    }

    var logDiv = editor.consoleWin.window.document.body.querySelector("#log");
    var message = document.createElement("div");
    message.innerHTML = getBullet() + str;
    logDiv.appendChild(message);

    // scroll to the end of the logDiv
    logDiv.scrollIntoView(false);
  }

  function getBullet() {
    return ((indexBullet++) % 2) ? "● " : "○ ";
  }
  
  return editor;
})(editor || {});
