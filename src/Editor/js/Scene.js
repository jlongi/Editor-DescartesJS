/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var editor = (function(editor) {

  var winConf = {
    icon: "src/editor/favicon.png",
    title: "Configuración",
    position: "center",
    width: 1000,
    min_width: 1000,
    height: 600,
    min_height: 600,
    focus: true,
    show: false
  };

  /**
   *
   */
  editor.Scene = function(applet, filename) {
    this.filename = filename;
    this.applet = applet;

    this.createNewIframe(applet, filename);
  }

  /**
   *
   */
  editor.Scene.prototype.createNewIframe = function(applet, filename) {
// console.log("new iframe");
    var self = this;
    self.console = window.console;

    // translate the title
    winConf.title = babel.transGUI("configuration");

    var tmpIframe = (this.iframe) ? this.iframe : null;
    var tmpParamWin = null;

    if (!this.sceneContainer) {
      this.sceneContainer = document.createElement("div");
      this.sceneContainer.setAttribute("class", "SceneContainer");
      document.body.querySelector("#container").appendChild(this.sceneContainer);
    }
    
    // init new iframe
    this.iframe = document.createElement("iframe");
    this.iframe.setAttribute("nwdisable", "true");
    this.iframe.src = "about:blank";
    this.iframe.width = applet.getAttribute("width");
    this.iframe.height = applet.getAttribute("height");
    this.iframe.frameBorder = 0;
    // this.iframe.scrolling = "no";

    // insert the iframe in the dom
    if (tmpIframe != null) {
      tmpParamWin = tmpIframe.win;
      this.sceneContainer.replaceChild(this.iframe, tmpIframe)
      tmpIframe = null;
    }
    else {
      this.sceneContainer.appendChild(this.iframe);

      this.editorBtns = document.createElement("div");
      this.editorBtns.innerHTML = "";
      this.editorBtns.setAttribute("class", "editor_buttons");
      this.sceneContainer.appendChild(this.editorBtns);
      
      this.divEdit = document.createElement("div");
      this.divEdit.innerHTML = "";
      this.divEdit.setAttribute("class", "descartes_edit_button");
      this.editorBtns.appendChild(this.divEdit);
      this.divEdit.addEventListener("click", editIframe);

      this.codeEdit = document.createElement("div");
      this.codeEdit.innerHTML = "";
      this.codeEdit.setAttribute("class", "descartes_code_edit_button");
      this.editorBtns.appendChild(this.codeEdit);
      this.codeEdit.addEventListener("click", editCode);
    }

    var doc = this.iframe.contentWindow.document;

    var content = "<!DOCTYPE html>" +
      "<head><title></title>" +
      "<script type='text/javascript' src='file://"+ path.normalize(__dirname + "/lib/descartes-min.js") +"'></script>" +
      // needed for arquimedes scenes
      // "<link rel='stylesheet' type='text/css' href='file://"+ path.normalize(__dirname + "/css/richTextEditor.css") +"'>" +
      "<base href='file://"+ path.normalize(filename) +"'>" +
      editor.contentDoc.head.innerHTML +
      "</head>" +
      "<body style='background:rgba(0,0,0,0);'>" +
      applet.outerHTML +
      editor.descMacrosText.join("\n\n") +
      "</body></html>";

    doc.open();
    doc.write(content);
    doc.close();

    // 
    this.iframe.contentWindow.addEventListener("load", function(evt) {
      // replace the console
      self.iframe.contentWindow.console = console;

      // prevent the drag of a external file
      self.iframe.contentWindow.addEventListener("dragover", function(e){ e.preventDefault(); e.stopPropagation(); }, false);
      self.iframe.contentWindow.addEventListener("drop", function(e){ e.preventDefault(); e.stopPropagation(); }, false);

      self.iframe.contentWindow.__dirname = editor.filename;
    });

    // when descartes finish the interpretation then stop the animation if the "apply" button was pressed
    this.iframe.contentWindow.addEventListener("descartesReady", function(evt) {
      if (self.stopAnimation) {
        self.iframe.contentWindow.descartesJS.apps[0].stop();
      }

      var descartesJS_Stage = self.iframe.contentWindow.document.querySelector("#descartesJS_Stage");
      if (descartesJS_Stage) {
        var component = { textArea: descartesJS_Stage};
        var defaultStyle = { fontFamily:"Times New Roman", fontSize:"30px", lineHeight:"30px", fontStyle:"normal", fontWeight:"normal", textDecoration:"none" };

        self.textController = new richTextEditor.TextController(component, defaultStyle, "000000", self.iframe.contentWindow);
      }
    });

    var firstTimeShown = true;

    function callback(win) {
      // save a reference to the parameter window
      self.iframe.win = win;

      // when try to close, only hide the window
      win.on("close", function() {
        self.iframe.win.hide();
      });

      // the window finish to load its content
      win.on("loaded", function() {
        self.iframe.win.window.paramEditor.init(editor);
        self.model = self.iframe.win.window.paramEditor.setParams(self);
      });
    }

    // if the parameter window is null, then open a new window with a parameter editor
    if (tmpParamWin == null) {
      // create the parameEditor window
      nw.Window.open("src/Editor/paramEditor.html", winConf, callback);
    }
    // if the param window is not null, then it exist so use again
    else {
      // recycle param editor
      self.iframe.win = tmpParamWin;
    }

    function editIframe(evt) {
      // stop the animation when the edit button is pressed
      self.iframe.contentWindow.descartesJS.apps[0].stop();

      // center the parameter window over the scene window only the first time
      if (firstTimeShown) {
        var tmpWin = nw.Window.get(),
            win = self.iframe.win;
        win.moveTo(Math.round( tmpWin.x+(tmpWin.width-win.width)/2 ), Math.round( tmpWin.y+(tmpWin.height-win.height)/2 ));
        firstTimeShown = false;
      }

      // when finish the configuration, then show the window
      self.iframe.win.show();
      self.iframe.win.focus();
    }

    /**
     * Show the code of the scene
     */
    function editCode(evt) {
      // stop the animation when the edit button is pressed
      self.iframe.contentWindow.descartesJS.apps[0].stop();
      
      editor.sceneCodeEditor.setCode(self.applet.innerHTML, self);
      editor.sceneCodeEditor.open();
    }

    // this.translate();
  }

  /**
   * 
   */
  editor.Scene.prototype.translate = function() {
    this.iframe.win.title = babel.transGUI("configuration");
    this.iframe.win.window.paramEditor.translate();
  }

  /**
   * 
   */
  editor.Scene.prototype.changeTheme = function() {
    this.iframe.win.window.paramEditor.changeTheme();
  }

  /**
   *
   */
  editor.Scene.prototype.okAction = function(data, stopAnimation) {
// console.log("okAction")
    this.stopAnimation = stopAnimation;

    this.applet.setAttribute("width", data.getAttribute("width"));
    this.applet.setAttribute("height", data.getAttribute("height"));
    this.applet.innerHTML = data.innerHTML;

    this.createNewIframe(this.applet, this.filename);

    document.title = (document.title.charAt(0) === "*") ? document.title : "*" + document.title;
    editor.hasChanges = true;
  }

  /**
   *
   */
  editor.Scene.prototype.closeAction = function() {
    // send the original values to reinit the parameters editor
    this.model = this.iframe.win.window.paramEditor.setParams(this);
  }


  /**
   *
   */
  editor.Scene.prototype.setColor = function(color) {
    nw.Window.get().editorManager.COPY_COLOR = color;
  }

  /**
   *
   */
  editor.Scene.prototype.getColor = function() {
    return nw.Window.get().editorManager.COPY_COLOR;
  }

  return editor;
})(editor || {});
