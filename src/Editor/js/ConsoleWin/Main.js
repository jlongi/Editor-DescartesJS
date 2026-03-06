/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var consoleWin = (function(consoleWin) {

  window.addEventListener("load", function() {
    document.getElementById("clear_log").addEventListener("click", () => {
      document.getElementById("log").innerHTML = "";
    });
  });

  /**
   * 
   */
  consoleWin.Console = function() {}
  
  return consoleWin;
})(consoleWin || {});
