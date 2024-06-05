/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var consoleWin = (function(consoleWin) {

  window.addEventListener("load", function() {
    let clearBtn = document.getElementById("clear_log");
    let logDiv = document.getElementById("log");
    clearBtn.addEventListener("click", () => {
      logDiv.innerHTML = "";
    });
  });

  /**
   * 
   */
  consoleWin.Console = function() {}
  
  return consoleWin;
})(consoleWin || {});
