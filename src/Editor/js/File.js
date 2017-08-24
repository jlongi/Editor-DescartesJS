/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var editor = (function(editor) {

  /**
   *
   */
  editor.File = {};

  /**
   *
   */
  editor.File.open = function(filename) {
    return fs.readFileSync(filename, "utf8");
  }

  /**
   *
   */
  editor.File.save = function(filename, content) {
    fs.writeFileSync(filename, content, "utf8");
  }

  /**
   *
   */
  editor.File.copy = function(src, dst) {
    fs.createFileSync(dst);
    fs.copySync(src, dst);
  }

  /**
   *
   */
  editor.File.move = function(src, dst) {
    fs.moveSync(src, dst);
  }

  return editor;
})(editor || {});
