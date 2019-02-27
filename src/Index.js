/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var path = require("path"),
    fs = require("fs-extra"),
    url = require("url"), 
    http = require("http"),
    unzip = require("unzip"),
    __dirname = path.normalize(global.__dirname + "/src/Editor");

var verPropFile, 
    versionPropertiesPath = path.join(__dirname + "/lib/version.properties"), 
    configPath = path.join(__dirname + "/lib/config.json"), 
    userDirectory = nw.App.dataPath, 
    updateInterpreter = updateEditor = false;

/**
 *
 */
var editorManager = (function(editorManager) {
  // varible holding the color copy value
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

  /**
   * Create a new instance of the editor
   */
  editorManager.addWindow = function(args) {
    // open a new editor
    nw.Window.open("src/Editor/main.html", winConf, function(win) {
      // event fired only when the window is loaded the first time (once)
      win.once("loaded", function(evt) {
	      win.resizeTo(winConf.width, winConf.height);
        win.restore();
        // win.maximize() // open the editor in fullscreen

        if (process.versions['node-webkit'] >= "0.31.5") {
          editorManager.drop_file = (args || "").replace("file://", "");
        }
        
        win.window.editor.editorManager = editorManager;
        numWindows++;
      });
    });
  }

  /**
   * Close all remaining windows and clear the app cache
   */
  editorManager.closeAll = function() {
    nw.App.clearCache();
    nw.Window.get().close();
    nw.App.closeAllWindows();
    nw.App.quit();
  }

  /**
   * Close an editor instance
   */
  editorManager.closeWindow = function(win) {
    //close the window
    win.close(true);

    // close the app when only have one instance
    if (numWindows === 1) {
      editorManager.closeAll();
    }
    else {
      numWindows--;
    }
  }

  /**
   * Donwload the version.properties file, and check if has a new version
   */
  function getVersionProperties() {
    verPropFile = new XMLHttpRequest();

    /**
     * 
     */
    verPropFile.onreadystatechange = function () {
      // check that the document is ready to parse
      if (verPropFile.readyState === 4) {
        // make sure that the file was found
        if (verPropFile.status === 200) {
          var localVerPropFile  = fs.readFileSync(versionPropertiesPath, "utf-8");
          var interpreterOnline = verPropFile.responseText.match(/descartes-min.js.version=(.*)/)[1];
          var interpreterLocal  = localVerPropFile.match(/descartes-min.js.version=(.*)/)[1];
          var editorOnline      = verPropFile.responseText.match(/EditorDescartesJS.version=(.*)/)[1];
          var editorLocal       = localVerPropFile.match(/EditorDescartesJS.version=(.*)/)[1];

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
        else {
          initApp();
        }
      }
    }

    verPropFile.open("GET", "http://arquimedes.matem.unam.mx/Descartes5/lib/version.properties", true);
    verPropFile.send(null);
  }

  /**
   * Init the app, open an instance of the editor
   */
  function initApp() {
    nw.Window.get().hide();

    nw.App.on("open", function(args) {
      editorManager.addWindow(args);
    });

    editorManager.addWindow((nw.App.argv.length > 0) ? nw.App.argv[0] : "");
  }

  /**
   * Entry function
   */
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
      downloadFiles(verPropFile.responseText);
    });

    // don't update editor
    var btn_cancel = document.getElementById("btn_cancel");
    btn_cancel.addEventListener("click", function(evt) {
      initApp();
    });

    // read the config.json file
    if (!fs.existsSync(configPath)) {
      fs.writeFileSync(configPath, '{\n"language":"esp",\n"theme":"default"\n}');
    }
    let userConfiguration = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    let language = userConfiguration.language || "esp";

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
    getVersionProperties();
  });

  //////////////////////////////////////////////////////////////////////
  /**
   * Download the new files if needed
   */
  function downloadFiles(content) {
    if (updateEditor) {
      downloadZip(content);
    }
    else if (updateInterpreter) {
      downloadDescartesMin(content);
    }
    else {
      initApp();
    }
  }

  /**
   * Download the zip file with the editor code
   */
  function downloadZip(content) {
    var fileUrl = "http://arquimedes.matem.unam.mx/Descartes5/lib/EditorDescartesJS.zip";
    var options = {
      host: url.parse(fileUrl).host,
      port: 80,
      path: url.parse(fileUrl).pathname
    };
    var filename = url.parse(fileUrl).pathname.split('/').pop();
    var tmpPath = path.normalize(userDirectory + "/zip/");
    var zipPath = path.join(tmpPath + filename);
    fs.ensureDirSync(tmpPath);
    var file = fs.createWriteStream(zipPath);

    // make the petition to get the file
    http.get(options, function(res) {
      // write the file adding the data donwloaded
      res.on("data", function(data) {
        file.write(data);
      })
      // when the download is complete
      .on("end", function() {
        // close the file
        file.end();

        var uncompressPath = path.normalize(path.join(tmpPath + "/extracted/"));

        // extract the file
        fs.createReadStream(zipPath)
        .pipe(unzip.Extract({ path: uncompressPath }))
        .on("close", function(){
          // copy the package.json file
          fs.copySync(path.join(uncompressPath + "/package.json"), path.normalize(path.join(global.__dirname + "/package.json")), {clover:true});

          // copy the source code
          fs.copySync(path.join(uncompressPath + "/src"), path.normalize(path.join(global.__dirname + "/src")), {clover:true});

          // remove the downloaded files
          fs.removeSync(tmpPath);

          if (updateInterpreter) {
            downloadDescartesMin(content);
          }
          else {
            // overwrite the file version.properties, with the new data
            fs.writeFileSync(versionPropertiesPath, content, "utf-8");
            initApp();
          }
        })
        .on("error", function() {
          initApp();
        })
      })
      .on("error", function() {
        initApp();
      });
    });   
  }

  /**
   * Download the descartes-min.js file
   */
  function downloadDescartesMin(content) {
    var fileUrl = url.parse("http://arquimedes.matem.unam.mx/Descartes5/lib/descartes-min.js");

    var options = {
      host: fileUrl.host,
      port: 80,
      path: fileUrl.pathname
    };
    var filename = fileUrl.pathname.split("/").pop();
    var file = fs.createWriteStream(path.join(__dirname + "/lib/" + filename));

    http.get(options, function(res) {
      res.on("data", function(data) {
        file.write(data);
      })
      .on("end", function() {
        file.end();

        // overwrite the file version.properties, with the new data
        fs.writeFileSync(versionPropertiesPath, content, "utf-8");
        initApp();
      })
      .on("error", function() {
        initApp();
      });
    });
  }
  //////////////////////////////////////////////////////////////////////

  return editorManager;
})(editorManager || {});
