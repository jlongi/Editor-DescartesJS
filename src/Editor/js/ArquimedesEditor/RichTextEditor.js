/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * 
   */
  descartesJS.JSONtoTextNodes = function(json, evaluator) {
    var node = new descartesJS.TextNode(json.V || "", json.NT, new descartesJS.TextStyle(json.S), evaluator);
    node.insideFormula = json.insideFormula;

    if (json.C) {
      for (var i=0, l=json.C.length; i<l; i++) {
        node.addChild(descartesJS.JSONtoTextNodes(json.C[i], evaluator));
      }
    }

    return node;
  }  

  /**
   * 
   */
  descartesJS.stringifyAux = function(key, value) {
    if (key === "children") {
      key = "C";
      return value;
    }

    if ((key !== "parent") && (key !== "metrics") && (key !== "styleString")) {
      return value;
    }
  }

  return descartesJS;
})(descartesJS || {});
