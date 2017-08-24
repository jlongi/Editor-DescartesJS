/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var editor = (function(editor) {

  /**
   *
   */
  editor.LibraryExporter = { };

  /**
   *
   */
  editor.LibraryExporter.export = function(filename) {
    fs.writeFileSync(filename, editor.scenes[0].model.getLibrary(), "utf8");
  }

  return editor;
})(editor || {});
