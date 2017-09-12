/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var editor = (function(editor) {

  // gui elements
  var btn_accept_code_editor,
      btn_cancel_code_editor,
      file_menu_new,
      file_menu_new_window,
      file_menu_open,
      file_menu_open_url,
      file_menu_reload,
      file_menu_save,
      file_menu_save_as,
      file_menu_to_macro,
      file_menu_to_library,
      file_menu_to_png,
      file_menu_to_jpg,
      file_menu_to_svg,
      file_menu_to_pdf,
      file_menu_to_pstricks,
      file_menu_close,
      file_menu_exit,
      open_recent_menu,
      export_menu,
      option_menu_lib_inter, 
      option_menu_lib_porta, 
      option_menu_lib_proye, 
      option_menu_lib_custom,
      option_menu_console,
      option_menu_language,
      option_menu_language_Esp,
      option_menu_language_Ing,
      option_menu_theme,
      option_menu_theme_Default,
      option_menu_theme_Dark,
      help_menu_documentation,
      help_menu_about,
      file_menu_top,
      option_menu_top,
      help_menu_top,
      clear_open_recent;

  var MAXFILES = 12;
      
  /**
   * Configure the GUI
   */
  editor.configGUI = function() {
    // prevent the drag of a external file
    window.addEventListener("dragover", function(e){ e.preventDefault(); e.stopPropagation(); }, false);
    window.addEventListener("drop", function(e){ e.preventDefault(); e.stopPropagation(); }, false);

    this.initDialogs();
    // this.initMenu();
    this.initHiddenInput();
    this.translateGUI();
  }

  /**
   * 
   */
  editor.translateGUI = function() {
    babel.setLanguage(editor.userConfiguration.language);

    editor.initMenu();

    editor.customDescMinDialog.setOkLabel(babel.transGUI("ok_btn"));
    editor.customDescMinDialog.setCancelLabel(babel.transGUI("cancel_btn"));
    editor.customDescMinDialog.txt_content.innerHTML = babel.transGUI("descartes_location_question");

    editor.PsTricksExportOptions.setOkLabel(babel.transGUI("ok_btn"));
    editor.PsTricksExportOptions.setCancelLabel(babel.transGUI("cancel_btn"));
    editor.PsTricksExportOptions.setTitle(babel.transGUI("pstricks_title"));
    var content = '<input type="checkbox" id="PsTricksExportOptions_grayscale"> <label for="PsTricksExportOptions_grayscale">' +
                  babel.transGUI("to_grayscale") +
                  '</label><br><br>' +
                  '<input type="checkbox" id="PsTricksExportOptions_whiteBackground" checked> <label for="PsTricksExportOptions_whiteBackground">' +
                  babel.transGUI("white_background") +
                  '</label>';
    editor.PsTricksExportOptions.setContent(content);

    editor.reloadDialog.setOkLabel(babel.transGUI("continue"));
    editor.reloadDialog.setCancelLabel(babel.transGUI("cancel_btn"));
    editor.reloadDialog.setContent(babel.transGUI("reload_content"));

    editor.saveDialog.setOkLabel(babel.transGUI("save"));
    editor.saveDialog.setCancelLabel(babel.transGUI("cancel_btn"));
    editor.saveDialog.setContent(babel.transGUI("save_content"));

    btn_accept_code_editor.innerHTML = babel.transGUI("ok_btn");
    btn_cancel_code_editor.innerHTML = babel.transGUI("cancel_btn");

    file_menu_new.label = babel.transGUI("new");
    file_menu_new_window.label = babel.transGUI("new_window");
    file_menu_open.label = babel.transGUI("open");
    file_menu_open_url.label = babel.transGUI("open_url");
    file_menu_reload.label = babel.transGUI("reload");
    file_menu_save.label = babel.transGUI("save");
    file_menu_save_as.label = babel.transGUI("save_as");
    file_menu_to_macro.label = babel.transGUI("export_macro");
    file_menu_to_library.label = babel.transGUI("export_library");
    file_menu_to_png.label = babel.transGUI("export_png");
    file_menu_to_jpg.label = babel.transGUI("export_jpg");
    file_menu_to_svg.label = babel.transGUI("export_svg");
    file_menu_to_pdf.label = babel.transGUI("export_pdf");
    file_menu_to_pstricks.label = babel.transGUI("export_pstricks");
    file_menu_close.label = babel.transGUI("close_scene");
    file_menu_exit.label = babel.transGUI("exit");
    open_recent_menu.label = babel.transGUI("open_recent");
    export_menu.label = babel.transGUI("export");
    option_menu_lib_inter.label = babel.transGUI("internet");
    option_menu_lib_porta.label = babel.transGUI("portable");
    option_menu_lib_proye.label = babel.transGUI("project");
    option_menu_lib_custom.label = babel.transGUI("custom");
    option_menu_console.label = babel.transGUI("console");
    option_menu_language.label = babel.transGUI("language_menu");
    option_menu_language_Esp.label = babel.transGUI("language_Esp");
    option_menu_language_Ing.label = babel.transGUI("language_Ing");
    help_menu_documentation.label = babel.transGUI("documentation");
    help_menu_about.label = babel.transGUI("about_menu");
    file_menu_top.label = babel.transGUI("file_menu");
    option_menu_top.label = babel.transGUI("option_menu");
    help_menu_top.label = babel.transGUI("help_menu");
    clear_open_recent.label = babel.transGUI("clear_open_recent");

    if (editor.consoleWin) {
      editor.consoleWin.title = babel.transGUI("title_console");
    }

    if (editor.scenes) {
      for (var i=0,l=editor.scenes.length; i<l; i++) {
        editor.scenes[i].translate();
      }
    }
  }
  
  /**
   * Build configuration dialogs
   */
  editor.initDialogs = function() {
    //
    editor.customDescMinDialog = new editor.Dialog("575px", "165px", "", "Aceptar", "Cancelar");
    editor.customDescMinDialog.txt_content = document.createElement("div");
    var src_input = document.createElement("input");
    src_input.setAttribute("id", "descartes_min_src_input");
    src_input.setAttribute("type", "text");
    src_input.value = (editor.customSrc) ? editor.customSrc : "../../lib/descartes-min.js";

    var content = document.createElement("div");
    content.appendChild(editor.customDescMinDialog.txt_content);
    content.appendChild(document.createElement("br"));
    content.appendChild(src_input);

    editor.customDescMinDialog.setContent(content, true);
 
    editor.customDescMinDialog.setOkCallback(function() {
      var inputSrc = editor.customDescMinDialog.container.querySelector("#descartes_min_src_input"); 
      var newSrc = inputSrc.value;
      if (!newSrc.match(/descartes-min.js$/)) {
        if (newSrc.charAt(newSrc.length-1) === "/") {
          newSrc += "descartes-min.js";
        }
        else {
          newSrc += "/descartes-min.js";
        }
      }

      editor.descMinType = "personalizada";
      editor.customSrc = newSrc;
      inputSrc.value = newSrc;

      editor.markDescMinTypeMenu();
    });
    
    // PsTricksExportOptions dialog
    editor.PsTricksExportOptions = new editor.Dialog("610px", "220px", "Opciones", "Aceptar", "Cancelar");
    editor.PsTricksExportOptions.setOkCallback(function() {
      editor.PsTricksExportOptions_grayscale = document.getElementById("PsTricksExportOptions_grayscale").checked;
      editor.PsTricksExportOptions_whiteBackground = document.getElementById("PsTricksExportOptions_whiteBackground").checked;
      editor.clickInput("save_image_pstricks_input");
    });

    // reload dialog
    editor.reloadDialog = new editor.Dialog("330px", "140px", "", "Continuar", "Cancelar");
    editor.reloadDialog.setOkCallback(function() {
      editor.hasChanges = false;
      (editor.filename) ? editor.Controller.exec("openFile", editor.filename) : editor.Controller.exec("newFile");
    });

    // save dialog
    editor.saveDialog = new editor.Dialog("330px", "120px", "", "Guardar", "Cancelar");
    editor.saveDialog.setOkCallback(function() {
      if (editor.filename) {
        editor.Controller.exec("saveFile", editor.filename);
        editor.Controller.exec("execForceAction");
      }
      else {
        editor.clickInput("save_input");
      }
    });
    editor.saveDialog.setCancelCallback(function() {
      editor.Controller.exec("execForceAction");
    });

    // scene code editor
    editor.sceneCodeEditor = new editor.Dialog("calc(100% - 20px)", "calc(100% - 20px)", "", "", "");
    editor.sceneCodeEditor.content.style.padding = "10px";
    editor.sceneCodeEditor.content.style.height = "100%";

    editor.sceneCodeEditor.textArea = document.createElement("div");
    editor.sceneCodeEditor.textArea.setAttribute("class", "textEditorTextArea");
    editor.sceneCodeEditor.textArea.setAttribute("contenteditable", "true");
    editor.sceneCodeEditor.textArea.setAttribute("style", "cursor:text; line-height:1.5em; width:calc(100% - 10px); height:calc(100% - 75px); flex-grow:1; text-align:left; padding:5px; margin:0; white-space:pre-wrap; display:inline-block; overflow-y:scroll; font-family:editorDescartesJS_monospace;");

    var btn_div = document.createElement("div");
    btn_div.setAttribute("style", "text-align:center;")
    btn_accept_code_editor = document.createElement("button");
    btn_accept_code_editor.setAttribute("id", "btn_accept_code_editor");
    btn_accept_code_editor.innerHTML = "Aceptar";
    btn_cancel_code_editor = document.createElement("button");
    btn_cancel_code_editor.setAttribute("id", "btn_cancel_code_editor");
    btn_cancel_code_editor.innerHTML = "Cancelar";
    btn_div.appendChild(btn_accept_code_editor);
    btn_div.appendChild(btn_cancel_code_editor);

    editor.sceneCodeEditor.content.appendChild(editor.sceneCodeEditor.textArea);
    editor.sceneCodeEditor.btnContainer.appendChild(btn_div);

    // add events to the buttons
    btn_accept_code_editor.addEventListener("click", function(evt) {
      editor.sceneCodeEditor.scene.applet.innerHTML = editor.sceneCodeEditor.textArea.innerText;

      // get the size parameter to change the scene dimension
      var allParams = editor.sceneCodeEditor.scene.applet.querySelectorAll("param");
      for (var i=0, l=allParams.length; i<l; i++) {
        if (babel[allParams[i].getAttribute("name")] == "size") {
          var size = allParams[i].getAttribute("value").split("x");
          if (size.length == 2) {
            editor.sceneCodeEditor.scene.applet.setAttribute("width", Math.abs(parseInt(size[0])));
            editor.sceneCodeEditor.scene.applet.setAttribute("height", Math.abs(parseInt(size[1])));
          }
        }
      }

      // modify the content of the applet
      editor.sceneCodeEditor.scene.okAction(editor.sceneCodeEditor.scene.applet);
      // modify the model of the paramEditor object
      editor.sceneCodeEditor.scene.closeAction();
      
      // close the dialog
      editor.sceneCodeEditor.close();
    });

    btn_cancel_code_editor.addEventListener("click", function(evt) {
      editor.sceneCodeEditor.close();
    });
  }

  /**
   *
   */
  editor.initHiddenInput = function() {
    var self = this;
    // open input
    document.getElementById("open_input").addEventListener("change", function(evt) {
      editor.Controller.exec("openFile", this.value);
      this.value = "";
    });

    // save input
    document.getElementById("save_input").addEventListener("change", function(evt) {
      editor.Controller.exec("saveFile", this.value);
      this.value = "";
    });

    // save export macro input
    document.getElementById("save_macro_input").addEventListener("change", function(evt) {
      editor.MacroExporter.export(this.value);
      this.value = "";
    });

    // save export library input
    document.getElementById("save_library_input").addEventListener("change", function(evt) {
      editor.LibraryExporter.export(this.value);
      this.value = "";
    });

    // save export image png input
    document.getElementById("save_image_png_input").addEventListener("change", function(evt) {
      editor.BitmapExporter.export(this.value, "png");
      this.value = "";
    });

    // save export image jpg input
    document.getElementById("save_image_jpg_input").addEventListener("change", function(evt) {
      editor.BitmapExporter.export(this.value, "jpg");
      this.value = "";
    });

    // save export image pstricks input
    document.getElementById("save_image_pstricks_input").addEventListener("change", function(evt) {
      editor.PsTricksExporter.export(this.value);
      this.value = "";
    });

    // save export image svg input
    document.getElementById("save_image_svg_input").addEventListener("change", function(evt) {
      editor.SVGExporter.export(this.value);
      this.value = "";
    });

    // save export image pdf input
    document.getElementById("save_image_pdf_input").addEventListener("change", function(evt) {
      editor.PdfExporter.export(this.value);
      this.value = "";
    });
  }

  /**
   * Init the node webkit window menu
   */
  editor.initMenu = function() {
    var self = this;
    var modifier = (os.platform() === "darwin") ? "cmd" : "ctrl";

    // Create an empty menu
    var menu = new nw.Menu();

    // Get the current window
    var win = nw.Window.get();

    // Create a menubar for window menu
    var menubar = new nw.Menu({ type: "menubar" });

    // Create a menuitem
    var file_menu = new nw.Menu();

    file_menu_new = new nw.MenuItem({
      label: babel.transGUI("new"),
      key: "N",
      modifiers: modifier,
      click: function() {
        editor.Controller.exec("newFile");
      }
    });
    file_menu_new_window = new nw.MenuItem({
      label: babel.transGUI("new_window"),
      key: "N",
      modifiers: modifier+"shift",
      click: function() {
        nw.Window.get().editorManager.addWindow();
      }
    });
    file_menu_open = new nw.MenuItem({
      label: babel.transGUI("open"),
      key: "O",
      modifiers: modifier,
      click: function() {
        self.clickInput("open_input");
      }
    });
    file_menu_open_url = new nw.MenuItem({
      label: babel.transGUI("open_url"),
      click: function() {
        // self.clickInput("open_input");
      }
    });
    file_menu_reload = new nw.MenuItem({
      label: babel.transGUI("reload"),
      key: "U",
      modifiers: modifier,
      click: function() {
        editor.Controller.exec("reload");
      }
    });
    file_menu_save = new nw.MenuItem({
      label: babel.transGUI("save"),
      key: "S",
      modifiers: modifier,
      click: function() {
        // if has a filename, then save the file
        if (editor.filename) {
          editor.Controller.exec("saveFile", editor.filename);
        }
        // if dont have filename, then show a save dialog
        else {
          self.clickInput("save_input");
        }
      }
    });
    file_menu_save_as = new nw.MenuItem({
      label: babel.transGUI("save_as"),
      key: "S",
      modifiers: modifier + "+shift",
      click: function() {
        // show a save dialog
        self.clickInput("save_input");
      }
    });

    file_menu_to_macro = new nw.MenuItem({
      label: babel.transGUI("export_macro"),
      click: function() {
        var macroName = "descartes_macro.txt";

        // set a suggested value to the filename
        if (editor.filename) {
          macroName = path.basename(editor.filename);
          macroName = macroName.replace(path.extname(macroName), ".txt");
        }
        document.getElementById("save_macro_input").setAttribute("nwsaveas", macroName);

        // show a save dialog
        self.clickInput("save_macro_input");
      }
    });
    file_menu_to_library = new nw.MenuItem({
      label: babel.transGUI("export_library"),
      click: function() {
        var libraryName = "descartes_library.txt";

        // set a suggested value to the filename
        if (editor.filename) {
          libraryName = path.basename(editor.filename);
          libraryName = libraryName.replace(path.extname(libraryName), ".txt");
        }
        document.getElementById("save_library_input").setAttribute("nwsaveas", libraryName);

        // show a save dialog
        self.clickInput("save_library_input");
      }
    });
    file_menu_to_png = new nw.MenuItem({
      label: babel.transGUI("export_png"),
      click: function() {
        var imgName = "descartes.png";

        // set a suggested value to the filename
        if (editor.filename) {
          imgName = path.basename(editor.filename);
          imgName = imgName.replace(path.extname(imgName), ".png");
        }
        document.getElementById("save_image_png_input").setAttribute("nwsaveas", imgName);

        // show a save dialog
        self.clickInput("save_image_png_input");
      }
    });
    file_menu_to_jpg = new nw.MenuItem({
      label: babel.transGUI("export_jpg"),
      click: function() {
        var imgName = "descartes.jpg";

        // set a suggested value to the filename
        if (editor.filename) {
          imgName = path.basename(editor.filename);
          imgName = imgName.replace(path.extname(imgName), ".jpg");
        }
        document.getElementById("save_image_jpg_input").setAttribute("nwsaveas", imgName);

        // show a save dialog
        self.clickInput("save_image_jpg_input");
      }
    });
    file_menu_to_svg = new nw.MenuItem({
      label: babel.transGUI("export_svg"),
      click: function() {
        var imgName = "descartes.svg";

        // set a suggested value to the filename
        if (editor.filename) {
          imgName = path.basename(editor.filename);
          imgName = imgName.replace(path.extname(imgName), ".svg");
        }
        document.getElementById("save_image_svg_input").setAttribute("nwsaveas", imgName);

        // show a save dialog
        self.clickInput("save_image_svg_input");
      }
    });
    file_menu_to_pdf = new nw.MenuItem({
      label: babel.transGUI("export_pdf"),
      click: function() {
        var imgName = "descartes.pdf";

        // set a suggested value to the filename
        if (editor.filename) {
          imgName = path.basename(editor.filename);
          imgName = imgName.replace(path.extname(imgName), ".pdf");
        }
        document.getElementById("save_image_pdf_input").setAttribute("nwsaveas", imgName);

        // show a save dialog
        self.clickInput("save_image_pdf_input");
      }
    });    
    file_menu_to_pstricks = new nw.MenuItem({
      label: babel.transGUI("export_pstricks"),
      click: function() {
        var imgName = "descartes.tex";

        // set a suggested value to the filename
        if (editor.filename) {
          imgName = path.basename(editor.filename);
          imgName = imgName.replace(path.extname(imgName), ".tex");
        }
        document.getElementById("save_image_pstricks_input").setAttribute("nwsaveas", imgName);

        editor.PsTricksExportOptions.open();
      }
    });
    file_menu_close = new nw.MenuItem({
      label: babel.transGUI("close_scene"),
      click: function() {
        editor.Controller.exec("closeFile");
      }
    });
    file_menu_exit = new nw.MenuItem({
      label: babel.transGUI("exit"),
      click: function() {
        editor.Controller.exec("closeWindow");
      }
    });

    //
    this.openRecentMenubar = new nw.Menu();
    editor.checkOpenRecenteFile();    
    editor.buildOpenRecent();

    //
    var exportMenubar = new nw.Menu();
    exportMenubar.append(file_menu_to_macro);
    exportMenubar.append(file_menu_to_library);
    exportMenubar.append(new nw.MenuItem({ type: "separator" }));
    exportMenubar.append(file_menu_to_png);
    exportMenubar.append(file_menu_to_jpg);
    exportMenubar.append(new nw.MenuItem({ type: "separator" }));
    exportMenubar.append(file_menu_to_svg);
    exportMenubar.append(file_menu_to_pdf);
    exportMenubar.append(file_menu_to_pstricks);

    file_menu.append(file_menu_new);
    file_menu.append(file_menu_new_window);
    file_menu.append(file_menu_open);
    open_recent_menu = new nw.MenuItem({ 
      label: babel.transGUI("open_recent"), 
      submenu: this.openRecentMenubar
    });
    file_menu.append(open_recent_menu);
    // file_menu.append(file_menu_open_url);
    file_menu.append(file_menu_reload);
    file_menu.append(file_menu_save);
    file_menu.append(file_menu_save_as);
    file_menu.append(new nw.MenuItem({ type: "separator" }));
    export_menu = new nw.MenuItem({ 
      label: babel.transGUI("export"), 
      submenu: exportMenubar
    });
    file_menu.append(export_menu);
    file_menu.append(new nw.MenuItem({ type: "separator" }));
    file_menu.append(file_menu_close);
    file_menu.append(file_menu_exit);

    // Create options menuitem
    var option_menu_library = new nw.Menu();

    option_menu_lib_inter = new nw.MenuItem({
      type: "checkbox",
      label: babel.transGUI("internet"),
      click: function() {
        editor.descMinType = "internet";
        editor.markDescMinTypeMenu();
      }
    });
    option_menu_lib_porta = new nw.MenuItem({
      type: "checkbox",
      label: babel.transGUI("portable"),
      click: function() {
        editor.descMinType = "portable";
        editor.markDescMinTypeMenu();
      }
    });
    option_menu_lib_proye = new nw.MenuItem({
      type: "checkbox",
      label: babel.transGUI("project"),
      click: function() {
        editor.descMinType = "proyecto";
        editor.markDescMinTypeMenu();
      }
    });
    option_menu_lib_custom = new nw.MenuItem({
      type: "checkbox",
      label: babel.transGUI("custom"),
      click: function() {
        editor.customDescMinDialog.open();
      }
    });
    editor.customDescMinDialog.setCancelCallback(function() {
      option_menu_lib_custom.checked = false;
    });

    option_menu_library.append(option_menu_lib_inter);
    option_menu_library.append(option_menu_lib_porta);
    option_menu_library.append(option_menu_lib_proye);
    option_menu_library.append(option_menu_lib_custom);

    option_menu_console = new nw.MenuItem({
      label: babel.transGUI("console"),
      click: function() {
        editor.consoleWin.show();
      }
    });

    /**
     * 
     */
    function clearLanguages() {
      option_menu_language_Esp.checked = option_menu_language_Ing.checked = false;
    }

    option_menu_language = new nw.Menu();
    option_menu_language_Esp = new nw.MenuItem({
      type: "checkbox",
      label: babel.transGUI("language_Esp"),
      click: function() {
        clearLanguages();
        this.checked = true;
        editor.saveLanguage("esp");
      }
    });
    option_menu_language_Ing = new nw.MenuItem({
      type: "checkbox",
      label: babel.transGUI("language_Ing"),
      click: function() {
        clearLanguages();
        this.checked = true;
        editor.saveLanguage("ing");
      }
    });
    option_menu_language.append(option_menu_language_Esp);
    option_menu_language.append(option_menu_language_Ing);

    // check the corresponding language
    if (editor.userConfiguration.language == "ing") {
      option_menu_language_Ing.checked = true;
    }
    // default language
    else {
      option_menu_language_Esp.checked = true;
    }
    /**
     * 
     */
    function clearThemes() {
      option_menu_theme_Default.checked = option_menu_theme_Dark.checked = false;
    }

    option_menu_theme = new nw.Menu();
    option_menu_theme_Default = new nw.MenuItem({
      type: "checkbox",
      label: babel.transGUI("theme_default"),
      click: function() {
        clearThemes();
        this.checked = true;
        editor.changeTheme("default");
      }
    });
    option_menu_theme_Dark = new nw.MenuItem({
      type: "checkbox",
      label: babel.transGUI("theme_dark"),
      click: function() {
        clearThemes();
        this.checked = true;
        editor.changeTheme("dark");
      }
    });
    option_menu_theme.append(option_menu_theme_Default);
    option_menu_theme.append(option_menu_theme_Dark);

    // check the corresponding theme
    if (editor.userConfiguration.theme == "dark") {
      option_menu_theme_Dark.checked = true;
      editor.changeTheme("dark");
    }
    // default theme
    else {
      option_menu_theme_Default.checked = true;
      editor.changeTheme("default");
    }

    option_menu = new nw.Menu();
    option_menu.append(new nw.MenuItem({ 
      label: "descartes-min.js", 
      submenu: option_menu_library
    }));
    option_menu.append(new nw.MenuItem({ 
      label: babel.transGUI("language_menu"), 
      submenu: option_menu_language
    }));
    option_menu.append(new nw.MenuItem({
      label: babel.transGUI("theme"), 
      submenu: option_menu_theme
    }));
    option_menu.append(option_menu_console);


    // Create menuitem
    var help_menu = new nw.Menu();

    help_menu_documentation = new nw.MenuItem({
      label: babel.transGUI("documentation"),
      click: openDocumentation
    });
    help_menu_about = new nw.MenuItem({
      label: babel.transGUI("about_menu"),
      click: openAbout
    });

    help_menu.append(help_menu_documentation);
    help_menu.append(help_menu_about);

    file_menu_top = new nw.MenuItem({ 
      label: babel.transGUI("file_menu"), 
      submenu: file_menu
    });

    // create MacBuiltin
    if (os.platform() == "darwin") {
      menubar.createMacBuiltin('Descartes', {
        hideEdit: false,
        hideWindow: true
      });

      menubar.insert(file_menu_top, 1)
    }
    else {
      menubar.append(file_menu_top);
    }

    // add the menu items to the menu
    option_menu_top = new nw.MenuItem({ 
      label: babel.transGUI("option_menu"), 
      submenu: option_menu
    });
    menubar.append(option_menu_top);

    help_menu_top = new nw.MenuItem({ 
      label: babel.transGUI("help_menu"), 
      submenu: help_menu
    });
    menubar.append(help_menu_top);

    //assign the menubar to window menu
    win.menu = menubar;

    win.on("close", function(evt) {
      editor.Controller.exec("closeWindow");
    });
  }


  /**
   * Do a click in a DOM object with some id, used for hidden inputs for save and open files
   */
  editor.clickInput = function(id) {
    var event = document.createEvent("MouseEvents");
    event.initMouseEvent("click");
    document.getElementById(id).dispatchEvent(event);
  }

  /**
   * Remove duplicates in an array
   */
  function removeDuplicates(arr) {
    var newArr = [];
    for (var i=0; i<arr.length; i++) {
      if (newArr.indexOf(arr[i]) < 0) {
        newArr.push(arr[i]);
      }
    }
    return newArr;
  }

  /**
   * 
   */
  editor.checkOpenRecenteFile = function() {
    var filename = path.normalize(__dirname + "/lib/openFiles.txt");
    if (!fs.existsSync(filename)) {
      fs.writeFileSync(filename, "");
    }
  }

  /**
   * Construct the list of items in the open recent menu
   */
  editor.buildOpenRecent = function() {
    var openFiles = (editor.File.open(path.normalize(__dirname + "/lib/openFiles.txt")) || "").split("\n");
    openFiles = removeDuplicates(openFiles);

    // Clean the menu
    for (var i=0, l=this.openRecentMenubar.items.length; i<l; i++) {
      this.openRecentMenubar.removeAt(0);
    }

    var filename;
    var enable = false;
    // fill the menu
    for (var i=0, l=openFiles.length; i<l; i++) {
      filename = openFiles[i].trim();
      
      if ((filename != "") && (fs.existsSync(filename))) {
        enable = true;
        var item = new nw.MenuItem({
          label: openFiles[i],
          click: function() {
            editor.Controller.exec("openFile", this.label);
          }
        });
        this.openRecentMenubar.append(item);
      }
    }

    var self = this;
    clear_open_recent = null;
    clear_open_recent = new nw.MenuItem({
      label: babel.transGUI("clear_open_recent"),
      enabled: enable,
      click: function() {
        self.clearOpenRecent();
      }
    })
    this.openRecentMenubar.append(new nw.MenuItem({ type: "separator" }));
    this.openRecentMenubar.append(clear_open_recent);
    
  }

  /**
   * Add an items in the open recent menu
   */
  editor.addToOpenRecent = function(filename) {
    var openFiles = filename + "\n" + (editor.File.open(path.normalize(__dirname + "/lib/openFiles.txt")) || "");
    openFiles = removeDuplicates(openFiles.split("\n"));
    openFiles = (openFiles.slice(0, MAXFILES)).join("\n");
    editor.File.save(path.normalize(__dirname + "/lib/openFiles.txt"), openFiles);

    editor.buildOpenRecent();
  }

  /**
   * Clear the item list in the open recent menu
   */
  editor.clearOpenRecent = function() {
    editor.File.save(path.normalize(__dirname + "/lib/openFiles.txt"), "");
    editor.buildOpenRecent();
  }

  /**
   * 
   */
  editor.saveLanguage = function(lang) {
    editor.userConfiguration.language = lang;
    fs.writeFileSync(path.normalize(__dirname + "/lib/config.json"), JSON.stringify(editor.userConfiguration));

    editor.translateGUI();
    editor.markDescMinTypeMenu();
  }

  /**
   * Check the library menu
   */
  editor.markDescMinTypeMenu = function() {
    option_menu_lib_inter.checked  = (editor.descMinType == "internet");
    option_menu_lib_porta.checked  = (editor.descMinType == "portable");
    option_menu_lib_proye.checked  = (editor.descMinType == "proyecto");
    option_menu_lib_custom.checked = (editor.descMinType == "personalizada");

    editor.setTitle();
  }

  /**
   * Set the window title
   */
  editor.setTitle = function() {
    document.title =  "Descartes【lib_" + babel.transGUI("min_type_"+editor.descMinType) + "】" + (editor.filename || "");
  }

  /**
   * 
   */
  editor.saveTheme = function(theme) {
    editor.userConfiguration.theme = theme;
    fs.writeFileSync(path.normalize(__dirname + "/lib/config.json"), JSON.stringify(editor.userConfiguration));
  }

  /**
   * 
   */
  editor.changeTheme = function(themeName) {
    var theme = document.getElementById("theme");
    theme.setAttribute("href", "css/theme_" + themeName + ".css");

    editor.saveTheme(themeName);

    if (editor.scenes) {
      for (var i=0,l=editor.scenes.length; i<l; i++) {
        editor.scenes[i].changeTheme();
      }
    }    
  }

  /**
   * Open the documentation
   */
  function openDocumentation() {
    nw.Shell.openExternal("http://arquimedes.matem.unam.mx/Descartes5/desarrollo/doc/DescartesJS/DescartesJS.pdf");
  }

  /**
   * Open a window with information about the editor
   */
  function openAbout() {
    if (!nw.Window.get().editorManager.aboutWindow) {
      nw.Window.open(
        "src/Editor/about_info/about.html", 
        { 
          position: "center",
          width: 800,
          min_width: 800,
          max_width: 800,
          height: 460,
          min_height: 460,
          max_height: 460,
          focus: true,
          show: true
        }, 
        function(win) {
          nw.Window.get().editorManager.aboutWindow = win;

          win.on("loaded", function(evt) {
            var version_properties = editor.File.open( path.normalize(__dirname + "/lib/version.properties") );
            win.window.document.getElementById("editor_version").innerHTML = version_properties.match(/EditorDescartesJS.version=(.*)/)[1];
            win.window.document.getElementById("interpreter_version").innerHTML = version_properties.match(/descartes-min.js.version=(.*)/)[1];
          });

          win.on("close", function(evt) { win.hide(); });
      
          // prevent open the links in the same window, instead use a browser
          win.on("new-win-policy", function(frame, url, policy) {
            policy.ignore();
            nw.Shell.openExternal(url);
          });
        }
      );
    }
    else {
      nw.Window.get().editorManager.aboutWindow.show();
      nw.Window.get().editorManager.aboutWindow.focus();
    }
  }

  return editor;
})(editor || {});
