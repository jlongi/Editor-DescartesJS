/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var editor = (function(editor) {

  /**
   *
   */
  editor.MacroExporter = { };

  /**
   *
   */
  editor.MacroExporter.export = function(filename) {
    fs.writeFileSync(filename, editor.scenes[0].model.getMacro(), "utf8");
  }

  return editor;
})(editor || {});
