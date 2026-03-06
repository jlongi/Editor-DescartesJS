/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var richTextEditor = (function(richTextEditor) {

  /**
   * 
   */
  richTextEditor.JSONtoTextNodes = function(json) {
    let node = new richTextEditor.TextNode(json.V || "", json.NT, new richTextEditor.TextStyle(json.S));
    node.insideFormula = json.insideFormula;

    if (json.C) {
      for (let json_c_i of json.C) {
        node.addChild(richTextEditor.JSONtoTextNodes(json_c_i));
      }
    }
    
    return node;
  }  

  /**
   * 
   */
  richTextEditor.stringifyAux = function(key, value) {
    if (key === "children") {
      key = "C";
      return value;
    }

    if ((key !== "parent") && (key !== "metrics") && (key !== "styleString")) {
      return value;
    }
  }

  return richTextEditor;
})(richTextEditor || {});
