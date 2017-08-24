/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var editor = (function(editor) {

  var auxFilename;

  /**
   *
   */
  editor.Controller = { functions: {} };

  /**
   *
   */
  editor.Controller.exec = function(funName, params) {
    this.functions[funName](params);
  }

  /**
   *
   */
  editor.Controller.functions.newFile = function() {
    // hide the scene code editor
    editor.sceneCodeEditor.close();

    if (editor.hasChanges) {
      editor.forceAction = "NewFile";
      this.tryToSave();
    }
    else {
      // console.log("new file");
      this.closeFile();
      editor.filename = null;
      editor.ContentManager.closeFile();

      editor.ContentManager.openFile( path.normalize(__dirname + "/template/index.html") );
      editor.setTitle();

      editor.hasChanges = false;
    }
  }

  /**
   *
   */
  editor.Controller.functions.openFile = function(filename) {
    // hide the scene code editor
    editor.sceneCodeEditor.close();

    if (editor.hasChanges) {
      editor.forceAction = "OpenFile";
      auxFilename = filename;
      this.tryToSave();
    }
    else {
      // console.log("open file");
      this.closeFile();
      editor.filename = filename;
      editor.ContentManager.openFile(filename);

      editor.addToOpenRecent(filename);

      editor.setTitle();

      editor.hasChanges = false;
    }
  }

  /**
   *
   */
  editor.Controller.functions.closeFile = function() {
    if (editor.hasChanges) {
      editor.forceAction = "CloseFile";
      this.tryToSave();
    }
    else {
      // console.log("close file");
      editor.filename = null;
      editor.ContentManager.closeFile();

      editor.setTitle();

      editor.hasChanges = false;
    }
  }

  /**
   *
   */
  editor.Controller.functions.reload = function() {
    var reloadScene = false;
    var filename = editor.filename;
    if (editor.hasChanges) {
      editor.reloadDialog.open();
    } 
    else {
      (filename) ? this.openFile(filename) : this.newFile();
    }
  }

  /**
   *
   */
  editor.Controller.functions.saveFile = function(filename) {
    // console.log("save file");
    editor.filename = filename;
    editor.ContentManager.saveFile(filename);

    editor.addToOpenRecent(filename);

    editor.setTitle();

    editor.hasChanges = false;

    if (editor.forceAction) {
      this.execForceAction();
    }
  }

  /**
   *
   */
  editor.Controller.functions.tryToSave = function() {
    var saveScene = false;
    if (editor.hasChanges) {
      editor.saveDialog.open();
    }
  }

  /**
   *
   */
  editor.Controller.functions.execForceAction = function() {
    editor.hasChanges = false;

    if (editor.forceAction === "NewFile") {
      this.newFile();
    }
    else if (editor.forceAction === "OpenFile") {
      this.openFile(auxFilename);
    }
    else if (editor.forceAction === "CloseFile") {
      this.closeFile();
    }
    else if (editor.forceAction === "ReloadFile") {
      this.closeFile();
    }
    else if (editor.forceAction === "CloseWindow") {
      this.closeWindow();
    }

    editor.forceAction = "";
  }

  /**
   *
   */
  editor.Controller.functions.closeWindow = function() {
    if (editor.hasChanges) {
      editor.forceAction = "CloseWindow";
      this.tryToSave();
    }
    else {
      var win = nw.Window.get();
      win.editorManager.closeWindow(win);
    }
  }

  return editor;
})(editor || {});
