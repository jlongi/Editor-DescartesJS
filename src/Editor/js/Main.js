/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var os = require("os"), 
    path = require("path"), 
    fs = require("fs-extra"), 
    beautify_html = require("js-beautify").html, 
    PDFDoc = require("pdfkit"), 
    __dirname = path.normalize(global.__dirname + "/src/Editor");

var editor = (function(editor) {

  /**
   * Extends an object with inheritance
   * @param {Object} child is the object that extends
   * @param {Object} parent is the objecto to extends
   */
  editor.extend = function(child, parent) {
    child.prototype = Object.create(parent.prototype);

    // add the uber (super) property to execute functions of the parent
    child.prototype.uber = parent.prototype;
  }

  /**
   * Prevent open the links in the same window, instead use a new browser
   */
  nw.Window.get().on("new-win-policy", function(frame, url, policy) {
    policy.ignore();
    nw.Shell.openExternal(url);
  });

  /**
   * Entry function
   */
  nw.Window.get().once("loaded", function(evt) {
    editor.descartesVersion = "5.5";

    ////////////////////////////////////////////////////////////////////////////////////////////
    // read user configuration
    var filename = path.normalize(__dirname + "/lib/config.json");
    if (!fs.existsSync(filename)) {
      fs.writeFileSync(filename, '{\n"language":"esp",\n"theme":"default"\n}');
    }
    editor.userConfiguration = JSON.parse(editor.File.open(path.normalize(__dirname + "/lib/config.json")));
    if (editor.userConfiguration.language == undefined) {
      editor.userConfiguration.language = "esp";
    }
    if (editor.userConfiguration.theme == undefined) {
      editor.userConfiguration.theme = "default";
    }
    if (editor.userConfiguration.embed_library == undefined) {
      editor.userConfiguration.embed_library = true;
    }
    if (editor.userConfiguration.embed_macro == undefined) {
      editor.userConfiguration.embed_macro = true;
    }
    if (editor.userConfiguration.embed_vector == undefined) {
      editor.userConfiguration.embed_vector = true;
    }
    
    if (editor.editorManager) {
      nw.Window.get().editorManager = editor.editorManager;
    }

    babel.setLanguage(editor.userConfiguration.language);

    //
    editor.arqToolbar = new editor.ArquimedesToolbar();
    editor.symbolTable = new editor.SymbolTable();
    editor.colorPanel = new editor.ColorDialog();
    //

    ////////////////////////////////////////////////////////////////////////////////////////////
    // init the menubar
    editor.configGUI();

    // for open files in drop
    // check if the app has a parameter
    if ((editor.editorManager) && (editor.editorManager.drop_file)) {
      // open a file
      editor.Controller.exec("openFile", editor.editorManager.drop_file);
    }
    else {
      // create a new file
      editor.Controller.exec("newFile");
    }

    ////////////////////////////////////////////////////////////////////////////////////////////
    // init the console window
    editor.console = new editor.Console();

    // overwrites the console.error messages
    // console.log = console.info = console.debug = console.error = console.warn = console.assert = console.trace = function() { 
    console.info = function() {
      editor.console.log(arguments);
      console.log(arguments);
    };

    var winConf = {
      icon: "src/editor/favicon.png",
      title: babel.transGUI("title_console"),
      position: "center",
      width: 600,
      height: 300,
      focus: true,
      show: false
    };

    function callback(win) {
      editor.consoleWin = win;

      // when try to close, only hide the window
      win.on("close", function() {
        win.hide();
        editor.consoleWin.window.document.body.querySelector("#log").innerHTML = "";
      });

      // the window finish to load its content
      win.on("loaded", function() { });
    }

    nw.Window.open("src/Editor/console.html", winConf, callback);
  });

  return editor;
})(editor || {});
