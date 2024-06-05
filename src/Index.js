/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var path = require("path"),
    fs = require("fs-extra"),
    __dirname = path.normalize(global.__dirname + "/src/Editor");

var verPropFile, 
    versionPropertiesPath = path.join(__dirname, "/lib/version.properties"), 
    configPath = path.join(__dirname, "/lib/config.json"), 
    nullPath = path.join(__dirname, "null.txt"), 
    userDirectory = nw.App.dataPath, 
    updateInterpreter = updateEditor = false,
    appInitialized = false,
    editorLocal = "0",
    web_address = "https://arquimedes.matem.unam.mx/Descartes5/lib/";

/**  */
var editorManager = (function(editorManager) {
  // variable holding the color copy value
  editorManager.COPY_COLOR = "000000";

  // number of editor windows 
  var numWindows = 0;

  // config to open an editor window
  var winConf = {
    icon: "src/Editor/favicon.png",
    position: "center",
    width: 1120,
    min_width: 320,
    height: 750,
    min_height: 200,
    focus: true,
    show: true
  };

  /** Create a new instance of the editor */
  editorManager.addWindow = function(args) {
    // open a new editor
    nw.Window.open("src/Editor/main.html", winConf, function(win) {
      // event fired only when the window is loaded the first time (once)
      win.once("loaded", function(evt) {
	      win.resizeTo(winConf.width, winConf.height);
        win.restore();

        if (process.versions['node-webkit'] >= "0.31.5") {
          editorManager.drop_file = (args || "").replace("file://", "");
        }
        
        nw.global.editorManager = editorManager;

        numWindows++;
      });
    });
  }

  /** Close all remaining windows and clear the app cache */
  editorManager.closeAll = function() {
    nw.App.clearCache();
    nw.Window.get().close();
    nw.App.closeAllWindows();
    nw.App.quit();
  }

  /** Close an editor instance */
  editorManager.closeWindow = function(win) {
    //close the window
    try {
      win.close(true);

      // close the app when only have one instance
      if (numWindows === 1) {
        editorManager.closeAll();
      }
      else {
        numWindows--;
      }
    } catch (e) {
      console.log(e);
    }
  }

  /** Download the version.properties file, and check if has a new version */
  async function getVersionProperties() {
    verPropFile = await fetchFile(web_address + "version.properties");
    if (verPropFile == null) {
      initApp();
    }

    // if (verPropFile == null) {
    //   web_address = "https://github.com/jlongi/DescartesJS/releases/latest/download/";
    //   verPropFile = await fetchFile(web_address + "version.properties");
    //   if (verPropFile == null) {
    //     initApp();
    //   }
    // }

    // version.properties successfully retrieved
    let localVerPropFile  = fs.readFileSync(versionPropertiesPath, "utf-8");
    let interpreterOnline = verPropFile.match(/descartes-min.js.version=(.*)/)[1];
    let interpreterLocal  = localVerPropFile.match(/descartes-min.js.version=(.*)/)[1];
    let editorOnline      = verPropFile.match(/EditorDescartesJS.version=(.*)/)[1];
    editorLocal           = localVerPropFile.match(/EditorDescartesJS.version=(.*)/)[1];

    updateInterpreter = (interpreterLocal < interpreterOnline);
    updateEditor = (editorLocal < editorOnline);

    if (updateInterpreter || updateEditor) {
      nw.Window.get().show();
      nw.Window.get().focus();
      nw.Window.get().setAlwaysOnTop(true);
    }
    else {
      initApp();
    }
  }

  /** Init the app, open an instance of the editor */
  function initApp() {
    if (!appInitialized) {
      appInitialized = true;
      nw.Window.get().hide();

      nw.App.on("open", function(args) {
        editorManager.addWindow(args);
      });

      editorManager.addWindow((nw.App.argv.length > 0) ? nw.App.argv[0] : "");
    }
  }

  /** Entry function */
  window.addEventListener("load", function(evt) {
    // prevent the close event in the principal window
    nw.Window.get().on("close", function(evt) {
      initApp();
      this.hide();
    });

    // update editor
    var btn_ok = document.getElementById("btn_ok");
    btn_ok.addEventListener("click", function(evt) {
      var loaderScreen = document.getElementById("loaderScreen");
      loaderScreen.style.display = "block";
      // download the updated files
      downloadUpdate(verPropFile);
    });

    // don't update editor
    var btn_cancel = document.getElementById("btn_cancel");
    btn_cancel.addEventListener("click", function(evt) {
      initApp();
    });

    // read the config.json file
    if (!fs.existsSync(configPath)) {
      fs.ensureFileSync(configPath);
      fs.writeFileSync(configPath, '{\n"language":"esp",\n"theme":"default"\n}');
    }
    var userConfiguration = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    var language = userConfiguration.language || "esp";

    if (babel && babel["GUI"+language]) {
      btn_ok.innerHTML = babel["GUI"+language].ok_btn;
      btn_cancel.innerHTML = babel["GUI"+language].cancel_btn;
      if (babel["GUI"+language].update_text) {
        document.getElementById("update_text").innerHTML = babel["GUI"+language].update_text;
      }
      if (babel["GUI"+language].loader_text) {
        document.getElementById("loader_text").innerHTML = babel["GUI"+language].loader_text;
      }
    }

    // get the version properties file
    if (fs.existsSync(nullPath)) {
      getVersionProperties();
    } else {
      // force the download of all files
      updateEditor = true;
      nw.Window.get().show();
      nw.Window.get().focus();
      nw.Window.get().setAlwaysOnTop(true);
    }
  });

  //////////////////////////////////////////////////////////////////////
  /** Download the new files if needed */
  async function downloadUpdate(content) {
    if (updateEditor) {
      await downloadEditor(editorLocal);
      if (content) {
        fs.writeFileSync(versionPropertiesPath, content);
      }
    }
    if (updateInterpreter) {
      await downloadFile("", "descartes-min.js", __dirname, "/lib/");
      await downloadFile("", "descartesNF-min.js", __dirname, "/lib/");
      if (content) {
        fs.writeFileSync(versionPropertiesPath, content);
      }
    }

    initApp();
  }

  /** Download editor files */
  async function downloadEditor(version) {
    let files_list = await fetchFile(web_address + "files.txt");
    let f, file_name, file_version;

    if (files_list) {
      files_list = files_list.split("\n");
      for (f of files_list) {
        [file_name, file_version] = f.split(";");

        if (version < file_version.trim()) {
          await downloadFile("EditorDescartesJS/", file_name, __dirname, "../../");
        }
      }
    }
  }

  /** Get a text file */
  async function fetchFile(filename) {
    const response = await fetch(filename);
    if (response.status == 200) {
      return await response.text();
    }
    return null;
  }

  /** Download a file */
  async function downloadFile(prefix, url, base_path, local_path) {
    const response = await fetch(web_address + prefix + url);
    local_path = path.normalize(path.join(base_path, local_path, url));

    if (response.status == 200) {
      fs.ensureFileSync(local_path);
      fs.writeFileSync(local_path, new Uint8Array(await response.arrayBuffer()));
      return true;
    }

    return false;
  }
  //////////////////////////////////////////////////////////////////////

  return editorManager;
})(editorManager || {});
