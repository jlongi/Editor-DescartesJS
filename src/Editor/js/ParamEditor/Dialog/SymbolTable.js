/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  var cell_total;

  /**
   *
   */
  paramEditor.SymbolTable = function() {
    var self = this;

    this.dialog = new editor.Dialog("960px", "560px", "", "Cerrar", "");
    this.dialog.body.setAttribute("style", "max-width:960px; max-height:560px; overflow:auto;");

    this.blockContainer = document.createElement("div");
    this.blockContainer.setAttribute("id", "blockContainer");

    var blockText = new Array(17);

    this.blockTextDisplace = [
      8,     // 0
      40,    // 1
      64,    // 2
      96,    // 3
      220,   // 4
      256,   // 5
      372,   // 6
      384,   // 7
      2048,  // 8
      2088,  // 9
      2112,  // 10
      2132,  // 11
      2148,  // 12
      2176,  // 13
      2368,  // 14
      2400,  // 15
      2432   // 16
    ];

    for (var i=0, l=blockText.length; i<l; i++) {
      var blockTextDiv = document.createElement("div");
      blockTextDiv.innerHTML = blockText[i];
      blockTextDiv.setAttribute("class", "utfBlockText");
      blockTextDiv.index = i;
      blockTextDiv.addEventListener("click", function(evt) {
        self.symbolsContainer.scrollTop = self.blockTextDisplace[this.index];
        self.changeActive(this.index);
      });
      this.blockContainer.appendChild(blockTextDiv);
    }
    this.blockText = this.blockContainer.querySelectorAll(".utfBlockText");


    //
    this.symbolsContainer = document.createElement("div");
    this.symbolsContainer.setAttribute("id", "symbolsContainer");

    var scrollElement = document.createElement("div");
    scrollElement.setAttribute("id", "scrollElement");
    scrollElement.setAttribute("style", "position:absolute; width:100%; height:3260px;")

    var tablePos = 0;
    var cell_row = 16;
    var cell_col = 8;
    cell_total = cell_row*cell_col;
    var cell_w = 43.5;
    var cell_h = 61;
    var cell_margin = 0;
    var cell_pos = { x: 0, y: 0 };
    this.symbols = document.createElement("div");
    this.symbols.setAttribute("id", "symbols");
    this.symbols.setAttribute("style", "position:absolute;")

    for (var i=0; i<cell_total; i++) {
      var charDiv = document.createElement("div");
      charDiv.setAttribute("class", "utfSymbolButton");
      charDiv.setAttribute("style", "background:#fff; width:" + cell_w + "px; height:" + cell_h + "px; left:" + (cell_pos.x + (i%cell_row)*(cell_w+cell_margin)) + "px; top:" + (cell_pos.y + parseInt(i/cell_row)*(cell_h+cell_margin)) + "px; overflow:hidden;");
      this.symbols.appendChild(charDiv);
      charDiv.addEventListener("click", function(evt) { self.close(this.innerText); });
    }

    this.dialog.content.setAttribute("style", "padding:12px;")
    this.dialog.content.appendChild(this.blockContainer);
    this.dialog.content.appendChild(this.symbolsContainer);
    this.symbolsContainer.appendChild(scrollElement);
    this.symbolsContainer.appendChild(this.symbols);

    /**
     *  
     */
    this.charDiv = this.symbols.querySelectorAll(".utfSymbolButton");
    var last_known_scroll_position = 0;
    var ticking = false;
    this.symbolsContainer.addEventListener("scroll", function(evt) {
      last_known_scroll_position = this.scrollTop;
      if (!ticking) {
        window.requestAnimationFrame(function() {
          self.updateSymbols(parseInt(last_known_scroll_position/4)*cell_row);
          ticking = false;
        });
      }
      ticking = true;
      self.symbols.style.top = last_known_scroll_position +"px";
    });   
  }

  /** 
   *
   */
  paramEditor.SymbolTable.prototype.changeActive = function(index) {
      var antActive = this.blockContainer.querySelector("[data-active='true']");
      if (antActive) {
        antActive.setAttribute("data-active", "false");
      }
      if (index >= 0) {
        this.blockText[index].setAttribute("data-active", "true");
      }
    }  

  /**
   *
   */
  paramEditor.SymbolTable.prototype.updateSymbols = function(scroll_pos) {
    var antIndex = null;
    var char;
    for (var i=0; i<cell_total; i++) {
      this.charDiv[i].textContent = String.fromCharCode( scroll_pos +i );
    }
    for (var i=this.blockTextDisplace.length-1; i>=0; i--) {
      if (parseInt(this.symbolsContainer.scrollTop) >= this.blockTextDisplace[i]) {
        antIndex = i;
        break;
      }
    }
    if (antIndex != null) {
      this.changeActive(antIndex);
    }
  }

  /**
   *
   */
  paramEditor.SymbolTable.prototype.open = function(textArea, selection) {
    this.textArea = textArea;
    this.selection = selection;
    this.range = selection.getRangeAt(0);

    this.changeActive(-1);
    this.updateSymbols(0);
    this.symbols.style.top = "0px";

    this.translate();

    this.dialog.open();
  }

  /**
   * 
   */
  paramEditor.SymbolTable.prototype.close = function(symbol) {
    var newTextNode = document.createTextNode(symbol);
    if (this.selection.rangeCount) {
      this.range.deleteContents();
      var indexPos = this.range.endOffset;
      this.selection.focusNode.textContent = this.selection.focusNode.textContent.substring(0, indexPos) + symbol + this.selection.focusNode.textContent.substring(indexPos);
      this.range.setStart(this.selection.focusNode, indexPos+1);

      this.selection.removeAllRanges();
      this.selection.addRange(this.range);
    }

    this.dialog.close();
    this.textArea.focus();
  }

  /**
   * 
   */
  paramEditor.SymbolTable.prototype.translate = function() {
    this.dialog.setOkLabel(babel.transGUI("close_btn"));

    for (var i=0, l=this.blockText.length; i<l; i++) {
      this.blockText[i].innerHTML = babel.transGUI("block_"+i);
    }
  }

  return paramEditor;
})(paramEditor || {});
