/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var editor = (function(editor) {

  /**
   *
   */
  editor.Console = function() { }

  editor.Console.prototype.log = function(arg) {
    let str = "";
    for (let arg_i of arg) {
      str += arg_i + " ";
    }

    let logDiv = editor.consoleWin.window.document.body.querySelector("#log");
    (logDiv.appendChild(document.createElement("div"))).textContent = str;

    // scroll to the end of the logDiv
    logDiv.scrollIntoView(false);
  }
  
  return editor;
})(editor || {});
