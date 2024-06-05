/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var editor = (function(editor) {

  // gui elements
  var file_menu_new,
      file_menu_new_window,
      file_menu_open,
      file_menu_open_url,
      file_menu_reload,
      file_menu_save,
      file_menu_save_as,
      file_menu_open_container_dir,
      file_menu_open_in_browser,
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
      edit_scene,
      export_menu,
      option_menu_lib_inter, 
      option_menu_lib_porta, 
      option_menu_lib_proye, 
      option_menu_lib_custom,
      option_menu_zoom,
      option_menu_zoom_plus,
      option_menu_zoom_minus,
      option_menu_zoom_original,
      option_menu_console,
      option_menu_embed,
      option_menu_embed_library,
      option_menu_embed_vector,
      option_menu_embed_macro,
      option_menu_language,
      option_menu_language_Esp,
      option_menu_language_Ing,
      option_menu_language_Ale,
      option_menu_language_Cat,
      option_menu_language_Eus,
      option_menu_language_Gal,
      option_menu_language_Val,
      option_menu_language_Por,
      option_menu_theme,
      option_menu_theme_Default,
      option_menu_theme_Dark,
      option_menu_theme_Light,
      option_menu_theme_Blue,
      help_menu_documentation,
      help_menu_about,
      help_menu_release_notes,
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

    editor.unsavedDialog.setOkLabel(babel.transGUI("continue"));
    editor.unsavedDialog.setCancelLabel(babel.transGUI("cancel_btn"));
    editor.unsavedDialog.setContent(babel.transGUI("reload_content"));

    editor.reloadDialog.setOkLabel(babel.transGUI("continue"));
    editor.reloadDialog.setCancelLabel(babel.transGUI("cancel_btn"));
    editor.reloadDialog.setContent(babel.transGUI("reload_content"));

    editor.saveDialog.setOkLabel(babel.transGUI("save"));
    editor.saveDialog.setCancelLabel(babel.transGUI("cancel_btn"));
    editor.saveDialog.setContent(babel.transGUI("save_content"));

    editor.sceneCodeEditor.btn_accept_code_editor.innerHTML = babel.transGUI("ok_btn");
    editor.sceneCodeEditor.btn_cancel_code_editor.innerHTML = babel.transGUI("cancel_btn");

    file_menu_new.label = babel.transGUI("new");
    file_menu_new_window.label = babel.transGUI("new_window");
    file_menu_open.label = babel.transGUI("open");
    file_menu_open_url.label = babel.transGUI("open_url");
    file_menu_reload.label = babel.transGUI("reload");
    file_menu_save.label = babel.transGUI("save");
    file_menu_save_as.label = babel.transGUI("save_as");
    file_menu_open_container_dir.label = babel.transGUI("container_dir");
    file_menu_open_in_browser.label = babel.transGUI("open_in_browser");
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
    edit_scene.label = babel.transGUI("edit_scene");
    export_menu.label = babel.transGUI("export");
    option_menu_lib_inter.label = babel.transGUI("internet");
    option_menu_lib_porta.label = babel.transGUI("portable");
    option_menu_lib_proye.label = babel.transGUI("project");
    option_menu_lib_custom.label = babel.transGUI("custom");
    option_menu_zoom.label = babel.transGUI("zoom");
    option_menu_zoom_plus.label = babel.transGUI("zoom_plus");
    option_menu_zoom_minus.label = babel.transGUI("zoom_minus");
    option_menu_zoom_original.label = babel.transGUI("zoom_original");
    option_menu_console.label = babel.transGUI("console");
    option_menu_embed_library.label = babel.transGUI("library");
    option_menu_embed_vector.label = babel.transGUI("array");
    option_menu_embed_macro.label = babel.transGUI("macro");
    option_menu_embed.label = babel.transGUI("embed_menu");
    option_menu_language.label = babel.transGUI("language_menu");
    option_menu_language_Esp.label = babel.transGUI("language_Esp");
    option_menu_language_Ing.label = babel.transGUI("language_Ing");
    option_menu_language_Ale.label = babel.transGUI("language_Ale");
    option_menu_language_Cat.label = babel.transGUI("language_Cat");
    option_menu_language_Eus.label = babel.transGUI("language_Eus");
    option_menu_language_Fra.label = babel.transGUI("language_Fra");
    option_menu_language_Gal.label = babel.transGUI("language_Gal");
    option_menu_language_Ita.label = babel.transGUI("language_Ita");
    option_menu_language_Val.label = babel.transGUI("language_Val");
    option_menu_language_Por.label = babel.transGUI("language_Por");
    help_menu_documentation.label = babel.transGUI("documentation");
    help_menu_about.label = babel.transGUI("about_menu");
    help_menu_release_notes.label = babel.transGUI("release_notes_menu");
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

    if (editor.arqToolbar) {
      editor.arqToolbar.translate();
    }
  }
  
  /**
   * Build configuration dialogs
   */
  editor.initDialogs = function() {
    var self = this;
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

    // unsaved dialog
    editor.unsavedDialog = new editor.Dialog("330px", "140px", "", "Continuar", "Cancelar");
    editor.unsavedDialog.setOkCallback(function() {
      editor.hasChanges = false;
      if (editor.forceAction !== "GUIOpenFile") {
        editor.Controller.exec("execForceAction");
      }
      else {
        self.clickInput("open_input");
      }
    });
    editor.unsavedDialog.setCancelCallback(function() {
      editor.forceAction = "";
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
    editor.sceneCodeEditor = new editor.SceneCodeEditor();
  }

  /**
   *
   */
  editor.initHiddenInput = function() {
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
        nw.global.editorManager.addWindow();
      }
    });
    file_menu_open = new nw.MenuItem({
      label: babel.transGUI("open"),
      key: "O",
      modifiers: modifier,
      click: function() {
        if (editor.hasChanges) {
          editor.forceAction = "GUIOpenFile";
          editor.unsavedDialog.open();
        }
        else {
          self.clickInput("open_input");
        }
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

    file_menu_open_container_dir = new nw.MenuItem({
      label: babel.transGUI("container_dir"),
      click: function() {
        if (editor.filename) {
          nw.Shell.showItemInFolder(editor.filename);
        }
      }
    });

    file_menu_open_in_browser = new nw.MenuItem({
      label: babel.transGUI("open_in_browser"),
      click: function() {
        if (editor.filename) {
          nw.Shell.openExternal(editor.filename);
        }
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
    edit_scene = new nw.MenuItem({
      label: babel.transGUI("edit_scene"),
      key: "E",
      modifiers: modifier,
      click: function() {
        if ((editor.scenes) && (editor.scenes.length>0)) {
          editor.scenes[0].divEdit.click();
        }
      }
    });

    
    //
    this.openRecentMenubar = new nw.Menu();
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
    // exportMenubar.append(file_menu_to_pstricks);

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
    file_menu.append(file_menu_open_container_dir);
    file_menu.append(file_menu_open_in_browser);

    file_menu.append(edit_scene);

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

    option_menu_zoom = new nw.Menu();
    option_menu_zoom_plus = new nw.MenuItem({
      label: babel.transGUI("zoom_plus"),
      key: "+",
      modifiers: modifier,
      click: function() {
        var win = nw.Window.get();
        win.zoomLevel += 0.2;
      }
    });
    option_menu_zoom_minus = new nw.MenuItem({
      label: babel.transGUI("zoom_minus"),
      key: "-",
      modifiers: modifier,
      click: function() {
        nw.Window.get().zoomLevel = Math.max( -7, nw.Window.get().zoomLevel - 0.2 );
      }
    });
    option_menu_zoom_original = new nw.MenuItem({
      label: babel.transGUI("zoom_original"),
      key: "0",
      modifiers: modifier,
      click: function() {
        nw.Window.get().zoomLevel = 0;
      }
    });

    option_menu_zoom.append(option_menu_zoom_plus);
    option_menu_zoom.append(option_menu_zoom_minus);
    option_menu_zoom.append(option_menu_zoom_original);


    option_menu_console = new nw.MenuItem({
      label: babel.transGUI("console"),
      click: function() {
        editor.consoleWin.show();
      }
    });

    option_menu_embed = new nw.Menu();
    
    option_menu_embed_library = new nw.MenuItem({
      type: "checkbox",
      label: babel.transGUI("library"),
      click: function() {
        editor.userConfiguration.embed_library = this.checked;
        fs.writeFileSync(path.normalize(__dirname + "/lib/config.json"), JSON.stringify(editor.userConfiguration));
      }
    });
    option_menu_embed_macro = new nw.MenuItem({
      type: "checkbox",
      label: babel.transGUI("macro"),
      click: function() {
        editor.userConfiguration.embed_macro = this.checked;
        fs.writeFileSync(path.normalize(__dirname + "/lib/config.json"), JSON.stringify(editor.userConfiguration));
      }
    });
    option_menu_embed_vector = new nw.MenuItem({
      type: "checkbox",
      label: babel.transGUI("array"),
      click: function() {
        editor.userConfiguration.embed_vector = this.checked;
        fs.writeFileSync(path.normalize(__dirname + "/lib/config.json"), JSON.stringify(editor.userConfiguration));
      }
    });
    

    option_menu_embed.append(option_menu_embed_library);
    option_menu_embed.append(option_menu_embed_macro);
    option_menu_embed.append(option_menu_embed_vector);

    if (editor.userConfiguration.embed_library) {
      option_menu_embed_library.checked = true;
    }
    if (editor.userConfiguration.embed_macro) {
      option_menu_embed_macro.checked = true;
    }
    if (editor.userConfiguration.embed_vector) {
      option_menu_embed_vector.checked = true;
    }


    /**
     * 
     */
    function clearLanguages() {
      option_menu_language_Esp.checked = option_menu_language_Ing.checked = option_menu_language_Ale.checked = option_menu_language_Cat.checked = option_menu_language_Eus.checked = option_menu_language_Fra.checked = option_menu_language_Gal.checked = option_menu_language_Ita.checked = option_menu_language_Val.checked = option_menu_language_Por.checked = false;
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
    option_menu_language_Ale = new nw.MenuItem({
      type: "checkbox",
      label: babel.transGUI("language_Ale"),
      click: function() {
        clearLanguages();
        this.checked = true;
        editor.saveLanguage("ale");
      }
    });
    option_menu_language_Cat = new nw.MenuItem({
      type: "checkbox",
      label: babel.transGUI("language_Cat"),
      click: function() {
        clearLanguages();
        this.checked = true;
        editor.saveLanguage("cat");
      }
    });
    option_menu_language_Eus = new nw.MenuItem({
      type: "checkbox",
      label: babel.transGUI("language_Eus"),
      click: function() {
        clearLanguages();
        this.checked = true;
        editor.saveLanguage("eus");
      }
    });
    option_menu_language_Fra = new nw.MenuItem({
      type: "checkbox",
      label: babel.transGUI("language_Fra"),
      click: function() {
        clearLanguages();
        this.checked = true;
        editor.saveLanguage("fra");
      }
    });
    option_menu_language_Gal = new nw.MenuItem({
      type: "checkbox",
      label: babel.transGUI("language_Gal"),
      click: function() {
        clearLanguages();
        this.checked = true;
        editor.saveLanguage("gal");
      }
    });
    option_menu_language_Ita = new nw.MenuItem({
      type: "checkbox",
      label: babel.transGUI("language_Ita"),
      click: function() {
        clearLanguages();
        this.checked = true;
        editor.saveLanguage("ita");
      }
    });
    option_menu_language_Val = new nw.MenuItem({
      type: "checkbox",
      label: babel.transGUI("language_Val"),
      click: function() {
        clearLanguages();
        this.checked = true;
        editor.saveLanguage("val");
      }
    });
    option_menu_language_Por = new nw.MenuItem({
      type: "checkbox",
      label: babel.transGUI("language_Por"),
      click: function() {
        clearLanguages();
        this.checked = true;
        editor.saveLanguage("por");
      }
    });
    option_menu_language.append(option_menu_language_Esp);
    option_menu_language.append(option_menu_language_Ing);
    option_menu_language.append(option_menu_language_Ale);
    option_menu_language.append(option_menu_language_Cat);
    option_menu_language.append(option_menu_language_Eus);
    option_menu_language.append(option_menu_language_Fra);
    option_menu_language.append(option_menu_language_Gal);
    option_menu_language.append(option_menu_language_Ita);
    option_menu_language.append(option_menu_language_Val);
    option_menu_language.append(option_menu_language_Por);

    // check the corresponding language
    if (editor.userConfiguration.language == "ing") {
      option_menu_language_Ing.checked = true;
    }
    else if (editor.userConfiguration.language == "ale") {
      option_menu_language_Ale.checked = true;
    }
    else if (editor.userConfiguration.language == "cat") {
      option_menu_language_Cat.checked = true;
    }
    else if (editor.userConfiguration.language == "eus") {
      option_menu_language_Eus.checked = true;
    }
    else if (editor.userConfiguration.language == "fra") {
      option_menu_language_Fra.checked = true;
    }
    else if (editor.userConfiguration.language == "gal") {
      option_menu_language_Gal.checked = true;
    }
    else if (editor.userConfiguration.language == "ita") {
      option_menu_language_Ita.checked = true;
    }
    else if (editor.userConfiguration.language == "val") {
      option_menu_language_Val.checked = true;
    }
    else if (editor.userConfiguration.language == "por") {
      option_menu_language_Por.checked = true;
    }
    // default language
    else {
      option_menu_language_Esp.checked = true;
    }
    /**
     * 
     */
    function clearThemes() {
      option_menu_theme_Default.checked = option_menu_theme_Dark.checked = option_menu_theme_Light.checked = option_menu_theme_Blue.checked = false;
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
    option_menu_theme_Light = new nw.MenuItem({
      type: "checkbox",
      label: babel.transGUI("theme_light"),
      click: function() {
        clearThemes();
        this.checked = true;
        editor.changeTheme("light");
      }
    });
    option_menu_theme_Blue = new nw.MenuItem({
      type: "checkbox",
      label: babel.transGUI("theme_blue"),
      click: function() {
        clearThemes();
        this.checked = true;
        editor.changeTheme("blue");
      }
    });
    option_menu_theme.append(option_menu_theme_Default);
    option_menu_theme.append(option_menu_theme_Dark);
    option_menu_theme.append(option_menu_theme_Light);
    option_menu_theme.append(option_menu_theme_Blue);

    // check the corresponding theme
    if (editor.userConfiguration.theme == "dark") {
      option_menu_theme_Dark.checked = true;
      editor.changeTheme("dark");
    }
    else if (editor.userConfiguration.theme == "light") {
      option_menu_theme_Light.checked = true;
      editor.changeTheme("light");
    }
    else if (editor.userConfiguration.theme == "blue") {
      option_menu_theme_Blue.checked = true;
      editor.changeTheme("blue");
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
      label: babel.transGUI("embed_menu"), 
      submenu: option_menu_embed
    }));
    option_menu.append(new nw.MenuItem({ 
      label: babel.transGUI("language_menu"), 
      submenu: option_menu_language
    }));
    option_menu.append(new nw.MenuItem({
      label: babel.transGUI("zoom"),
      submenu: option_menu_zoom
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
    help_menu_release_notes = new nw.MenuItem({
      label: babel.transGUI("release_notes_menu"),
      click: openReleaseNotes
    });
    help_menu_about = new nw.MenuItem({
      label: babel.transGUI("about_menu"),
      click: openAbout
    });

    help_menu.append(help_menu_documentation);
    help_menu.append(help_menu_release_notes);
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
    var element = document.getElementById(id);

    if (editor.filename) {
      element.setAttribute("nwworkingdir", path.dirname(editor.filename));
    }
    element.dispatchEvent(event);
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
   * Construct the list of items in the open recent menu
   */
  editor.buildOpenRecent = function() {
    var filename = path.join(__dirname, "/lib/openFiles.txt");
    fs.ensureFileSync(filename);

    var openFiles = (editor.File.open(filename) || "").split("\n");
    openFiles = removeDuplicates(openFiles);

    // Clean the menu
    for (var i=0, l=this.openRecentMenubar.items.length; i<l; i++) {
      this.openRecentMenubar.removeAt(0);
    }

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
    editor.descMinType = (editor.descMinType) ? editor.descMinType : "portable";
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
    nw.Shell.openExternal("https://descartes.matem.unam.mx/doc/DescartesJS/DescartesJS.pdf");
  }

  /**
   * Open a window with information about the editor
   */
  function openAbout() {
    if (!nw.global.editorManager.aboutWindow) {
      nw.Window.open(
        "src/Editor/info/about/index.html", 
        { 
          position: "center",
          width: 600,
          min_width: 600,
          max_width: 600,
          height: 500,
          min_height: 500,
          max_height: 500,
          focus: true,
          show: true
        }, 
        function(win) {
          nw.global.editorManager.aboutWindow = win;

          win.on("loaded", function(evt) {
            var version_properties = editor.File.open( path.normalize(__dirname + "/lib/version.properties") );
            win.window.document.getElementById("editor_version").innerHTML = version_properties.match(/EditorDescartesJS.version=(.*)/)[1];
            win.window.document.getElementById("interpreter_version").innerHTML = version_properties.match(/descartes-min.js.version=(.*)/)[1];
            win.window.document.getElementById("nwjs_version").innerHTML = process.versions['node-webkit'];
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
      nw.global.editorManager.aboutWindow.show();
      nw.global.editorManager.aboutWindow.focus();
    }
  }

  /**
   * Open a window with information about the editor
   */
  function openReleaseNotes() {
    if (!nw.global.editorManager.releaseNotesWindow) {
      nw.Window.open(
        "https://descartes.matem.unam.mx/release_notes/index.html",
        { 
          position: "center",
          width: 900,
          min_width: 900,
          height: 600,
          min_height: 600,
          focus: true,
          show: true
        }, 
        function(win) {
          nw.global.editorManager.releaseNotesWindow = win;

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
      nw.global.editorManager.releaseNotesWindow.show();
      nw.global.editorManager.releaseNotesWindow.focus();
    }
  }

  return editor;
})(editor || {});
