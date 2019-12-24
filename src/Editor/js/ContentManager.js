/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var editor = (function(editor) {

  var i, l;

  /**
   *
   */
  editor.ContentManager = { };

  /**
   * Close a file, remove all iframes and edit buttons to clean the editor
   */
  editor.ContentManager.closeFile = function() {
    // clear the console logs
    // console.clear();

    var elems = Array.prototype.slice.call( document.querySelectorAll("iframe") );
    for (i=0, l=elems.length; i<l; i++) {
      elems[i].win.close(true);
      elems[i].parentNode.removeChild(elems[i]);
    }
    
    elems = Array.prototype.slice.call( document.querySelectorAll(".SceneContainer") );
    for (i=0, l=elems.length; i<l; i++) {
      elems[i].parentNode.removeChild(elems[i]);
    }
  }

  /**
   *
   */
  editor.ContentManager.openFile = function(filename) {
// console.log('Open file:', filename);

    var contents = editor.File.open(filename);
    // parse the content and create a dom object
    editor.contentDoc = (new DOMParser()).parseFromString(contents, "text/html");

    // get the font style
    editor.fontStyle = editor.contentDoc.getElementById("descartes_fonts");
    if (!editor.fontStyle) {
      editor.fontStyle = document.createElement("link");
      editor.fontStyle.setAttribute("id", "descartes_fonts");
      editor.fontStyle.setAttribute("rel", "stylesheet");
      editor.fontStyle.setAttribute("type", "text/css");
    }
    editor.contentDoc.head.appendChild(editor.fontStyle);

    // all the descartes macros scripts
    editor.descMacros = [];
    editor.descMacrosText = [];

    // get all scripts tags to obtain descartes-min.js and macros
    var jsScripts = editor.contentDoc.querySelectorAll("script"), 
        desminScript = [], 
        tmpSrc;

    for (i=0, l=jsScripts.length; i<l; i++) {
      tmpSrc = jsScripts[i].getAttribute("src");

      if (tmpSrc && tmpSrc.match("descartes-min.js")) {
        desminScript.push(jsScripts[i]);
      }

      if ( (jsScripts[i].getAttribute("type") === "descartes/macro") ||
           (jsScripts[i].getAttribute("type") === "descartes/vectorFile") || 
           (jsScripts[i].getAttribute("type") === "descartes/library") || 
           (jsScripts[i].getAttribute("type") === "descartes/archivo") 
         ) {
        editor.descMacros.push(jsScripts[i]);
        editor.descMacrosText.push(jsScripts[i].outerHTML);
      }
    }

    editor.descMinType = null;
    // remove all the scripts that reference descartes-min.js and get the type reference
    for (i=0, l=desminScript.length; i<l; i++) {
      if (!editor.descMinType) {
        tmpSrc = desminScript[i].getAttribute("src");

        if (tmpSrc.match(/http(s)*:\/\/arquimedes.matem.unam.mx\/Descartes5\/lib\/descartes-min.js/)) {
          editor.descMinType = "internet";
        }
        else if (tmpSrc.match(/^lib\/descartes-min.js$/)) {
          editor.descMinType = "portable";
        }
        else if (tmpSrc.match(/^..\/lib\/descartes-min.js$/)) {
          editor.descMinType = "proyecto";
        }
        else {
          editor.descMinType = "personalizada";
          editor.customSrc = tmpSrc;
        }
      }

      desminScript[i].parentNode.removeChild(desminScript[i]);
    }
    editor.descMinType = editor.descMinType || "portable";

    // add a check mark in the menu, to show the type of descartes-min.js to use
    editor.markDescMinTypeMenu();

    // add a descartes-min.js script
    editor.descMinScript = document.createElement("script");
    editor.descMinScript.setAttribute("type", "text/javascript");
    if (editor.descMinType === "internet") {
      tmpSrc = "https://arquimedes.matem.unam.mx/Descartes5/lib/descartes-min.js";
    }
    else if (editor.descMinType === "portable") {
      tmpSrc = "lib/descartes-min.js";
    }
    else if (editor.descMinType === "proyecto") {
      tmpSrc = "../lib/descartes-min.js";
    }
    else {
      tmpSrc = editor.customSrc || "";
    }
    editor.descMinScript.setAttribute("src", tmpSrc);
    editor.contentDoc.head.appendChild(editor.descMinScript);


    // find and remove all the meta tags with http-equiv="Content-Type"
    var metatags = editor.contentDoc.querySelectorAll("meta"), 
        metaTagsArrary = [], 
        tmpAttr;

    for (i=0, l=metatags.length; i<l; i++) {
      // if the meta tag is of the type <meta http-equiv="content-type" content="text/html; charset=UTF-8">
      tmpAttr = metatags[i].getAttribute("http-equiv");
      if (tmpAttr && (tmpAttr.toLowerCase() === "content-type")) {
        metaTagsArrary.push(metatags[i]);
      }
      // if the meta tag is of the type <meta charset="UTF-8">
      tmpAttr = metatags[i].getAttribute("charset");
      if (tmpAttr) {
        metaTagsArrary.push(metatags[i]);
      }
    }
    // remove the tags
    for (i=0, l=metaTagsArrary.length; i<l; i++) {
      metaTagsArrary[i].parentNode.removeChild(metaTagsArrary[i]);
    }
    // add a new meta tag
    var meta = document.createElement("meta");
    meta.setAttribute("http-equiv", "content-type");
    meta.setAttribute("content", "text/html; charset=UTF-8");
    editor.contentDoc.head.insertBefore(meta, editor.contentDoc.head.firstChild);

    // query all applets
    editor.applets = editor.contentDoc.querySelectorAll("applet");
    if (editor.applets.length === 0) {
      editor.applets = editor.contentDoc.querySelectorAll("ajs");
    }

    editor.scenes = [];
    var applet_i,
        newApplet, 
        appletParams,
        whichVersion,
        versionParam;

    // create a temporal container for every applet
    for (i=0, l=editor.applets.length; i<l; i++) {
      applet_i = editor.applets[i];
      newApplet = document.createElement("ajs");
      appletParams = applet_i.querySelectorAll("param");

      versionParam = document.createElement("param"); // create a new param to change the version
      versionParam.setAttribute("name", "Versión");
      versionParam.setAttribute("value", editor.descartesVersion);

      newApplet.setAttribute("name", applet_i.getAttribute("name") || "Descartes");
      newApplet.setAttribute("code", applet_i.getAttribute("code") || "Descartes");
      newApplet.setAttribute("width", applet_i.getAttribute("width") || 970);
      newApplet.setAttribute("height", applet_i.getAttribute("height") || 550);
      newApplet.appendChild(versionParam);

      for (var ai=0, al=appletParams.length; ai<al; ai++) {
        if (babel[appletParams[ai].getAttribute("name")] === "version") {
          whichVersion = appletParams[ai].getAttribute("value") || editor.descartesVersion;
        }
        else {
          newApplet.appendChild(appletParams[ai]);
        }
      }

      if (whichVersion < 3) {
        newApplet.innerHTML = newApplet.innerHTML.replace(/Ox/g, "E0.Ox")
                                                 .replace(/Oy/g, "E0.Oy")
                                                 .replace(/_w/g, "E0._w")
                                                 .replace(/_h/g, "E0._h")
                                                 .replace(/mouse_x/g, "E0.mouse_x")
                                                 .replace(/mouse_y/g, "E0.mouse_y")
                                                 .replace(/mouse_pressed/g, "E0.mouse_pressed")
                                                 .replace(/mouse_clicked/g, "E0.mouse_clicked")
                                                 .replace(/clic_izquierdo/g, "E0.clic_izquierdo")
                                                 .replace(/escala/g, "E0.escala")
                                                 .replace(/scale/g, "E0.escala")
                                                 .replace(/eskala/g, "E0.escala")
                                                 .replace(/échelle/g, "E0.escala");
      }

      applet_i.parentNode.replaceChild(newApplet, applet_i);
      applet_i = newApplet;

      editor.scenes.push( new editor.Scene(applet_i, filename) );
    }

  }

  /**
   *
   */
  editor.ContentManager.saveFile = function(filename) {
    // set the filename to all scenes in the editor
    for (i=0, l=editor.scenes.length; i<l; i++) {
      editor.scenes[i].filename = filename;
    }

    // remove the descartes macros script to prevent a bad formating
    this.cleanDescMacros();

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get all the macros graphics
    var graphics, 
        macros = [];

    for (i=0,l=editor.scenes.length; i<l; i++) {
      graphics = (editor.scenes[i].model.data.graphics).concat(editor.scenes[i].model.data.graphics3D);

      for (var j=0, k=graphics.length; j<k; j++) {
        if (graphics[j].data.type === "macro") {
          macros.push(graphics[j].data);
        }
      }
    }

    // check if the macros are embedded in the html
    var missing, 
        expr, 
        newMacro, 
        macroPath,
        macroContent;

    for (i=0,l=macros.length; i<l; i++) {
      expr = macros[i].expression;
      missing = true;

      // get the content
      macroPath = path.normalize( path.dirname(filename) + "/" + expr );
      if (fs.existsSync(macroPath)) {
        macroContent = "\r\n" + (fs.readFileSync(macroPath, "utf8")).replace(/</g, "&lt;").replace(/>/g, "&gt;") + "\r\n";
      }

      for (var j=0,k=editor.descMacros.length; j<k; j++) {
        if (expr === editor.descMacros[j].getAttribute("id")) {
          missing = false;
          // the file exist then replace te content of the embedded element
          if (fs.existsSync(macroPath)) {
            editor.descMacros[j].innerHTML = macroContent;
            editor.descMacrosText[j] = (editor.descMacros[j].outerHTML).replace(/(\n)+/g, "\r\n");
          }
          // the file doesn't exist then create it
          else {
            fs.ensureFileSync(macroPath);
            fs.writeFileSync(macroPath, editor.descMacros[j].innerHTML.replace(/\r\n/g, "\n").replace(/\n\n/g, "\r\n").trim(), "utf8");
          }
        }
      }

      if (missing) {
        newMacro = document.createElement("script");
        newMacro.setAttribute("type", "descartes/macro");
        newMacro.setAttribute("id", expr);

        if (fs.existsSync(macroPath)) {
          newMacro.innerHTML = macroContent;

          editor.descMacros.push(newMacro);
          editor.descMacrosText.push( (newMacro.outerHTML).replace(/(\n)+/g, "\r\n") );
        }
      }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get all the vector objects
    // check if vector files are embedded in the html
    var definitions;
    var vecs = [];
    var vecPath;
    var vecContent;

    for (i=0,l=editor.scenes.length; i<l; i++) {
      definitions = editor.scenes[i].model.data.definitions;

      for (var j=0, k=definitions.length; j<k; j++) {
        if (definitions[j].data.type === "array") {
          vecs.push(definitions[j].data);
        }
      }
    }

    for (i=0,l=vecs.length; i<l; i++) {
      file = (vecs[i].file).trim();
      
      if (file) {
        vecPath = path.normalize( path.dirname(filename) + "/" + file );
        missing = true;

        if (fs.existsSync(vecPath)) {
          vecContent = "\r\n" + (fs.readFileSync(vecPath, "utf8")).replace(/</g, "&lt;").replace(/>/g, "&gt;") + "\r\n";
        }

        for (var j=0,k=editor.descMacros.length; j<k; j++) {
          if (file === editor.descMacros[j].getAttribute("id")) {
            missing = false;
            // the file exist then replace te content of the embedded element
            if (fs.existsSync(vecPath)) {
              editor.descMacros[j].innerHTML = vecContent;
              editor.descMacrosText[j] = (editor.descMacros[j].outerHTML).replace(/(\n)+/g, "\r\n");
            }
            // the file doesn't exist then create it
            else {
              fs.ensureFileSync(vecPath);
              fs.writeFileSync(vecPath, editor.descMacros[j].innerHTML.replace(/\r\n/g, "\n").replace(/\n\n/g, "\r\n").trim(), "utf8");
            }
          }
        }

        if (missing) {
          newMacro = document.createElement("script");
          newMacro.setAttribute("type", "descartes/vectorFile");
          newMacro.setAttribute("id", file);

          if (fs.existsSync(vecPath)) {
            newMacro.innerHTML = vecContent;

            editor.descMacros.push(newMacro);
            editor.descMacrosText.push( (newMacro.outerHTML).replace(/(\n)+/g, "\r\n") );
          }
        }
      }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get all the library objects
    var libs = [];
    var libPath;
    
    for (i=0,l=editor.scenes.length; i<l; i++) {
      definitions = editor.scenes[i].model.data.definitions;

      for (var j=0, k=definitions.length; j<k; j++) {
        if (definitions[j].data.type === "library") {
          libs.push(definitions[j].data);
        }
      }
    }

    for (i=0,l=libs.length; i<l; i++) {
      file = libs[i].file;
      libPath = path.normalize( path.dirname(filename) + "/" + file );

      for (var j=0,k=editor.descMacros.length; j<k; j++) {
        if (file === editor.descMacros[j].getAttribute("id")) {
          fs.ensureFileSync(libPath);
          fs.writeFileSync(libPath, editor.descMacros[j].innerHTML.replace(/\r\n/g, "\n").replace(/\n\n/g, "\r\n").trim(), "utf8");
        }
      }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // set descartes-min.js script
    if (editor.descMinType === "internet") {
      tmpSrc = "https://arquimedes.matem.unam.mx/Descartes5/lib/descartes-min.js";
    }
    else if (editor.descMinType === "portable") {
      tmpSrc = "lib/descartes-min.js";
    }
    else if (editor.descMinType === "proyecto") {
      tmpSrc = "../lib/descartes-min.js";
    }
    else {
      tmpSrc = editor.customSrc || "";
    }
    editor.descMinScript.setAttribute("src", tmpSrc);
    editor.descMinScript.setAttribute("charset", "utf-8");

    // copy descartes-min if the type is not internet
    if ((tmpSrc.substring(0,7) !== "http://") && (tmpSrc.substring(0,8) !== "https://")) {
      editor.File.copy(path.join(__dirname, "lib/descartes-min.js"), path.normalize(path.join(path.dirname(filename), tmpSrc)));
    }

    // get the last changes in the scene
    for (var i=0, l=editor.scenes.length; i<l; i++) {
      editor.scenes[i].applet.innerHTML = editor.scenes[i].model.getApplet().innerHTML;
    }

    var content = "<!DOCTYPE html>\r\n<html>\r\n" +
                  beautify_html( 
                    editor.contentDoc.querySelector("html").innerHTML, {
                      indent_size:2,
                      max_preserve_newlines:0,
                      wrap_line_length:0,
                      extra_liners:["head","body","/html","div","p"]
                    }
                  )
                  .replace(/\n/g, "\r\n")
                  .replace(/&amp;/g, "&")
                  .replace("</body>", "")
                  .replace('<link id="descartes_fonts" rel="stylesheet" type="text/css">', "")
                  + "\r\n" +
                  editor.ContentManager.getDescMacrosText().replace(/\r\n/g, "\n").replace(/\n/g, "\r\n") +
                  "\r\n\r\n</body>\r\n</html>"

    // write the file
    editor.File.save(filename, content);
    // return the macros elements to the doc
    this.restoreDescMacros();
  }

  /**
   *
   */
  editor.ContentManager.cleanDescMacros = function() {
    // remove all the macro scripts
    for (i=0, l=editor.descMacros.length; i<l; i++) {
      if (editor.descMacros[i].parentNode) {
        editor.descMacros[i].parentNode.removeChild(editor.descMacros[i]);
        editor.descMacrosText[i] = (editor.descMacros[i].outerHTML).replace(/(\n)+/g, "\r\n");
      }
    }
  }

  /**
   *
   */
  editor.ContentManager.restoreDescMacros = function() {
    // restore all the macro scripts
    for (i=0, l=editor.descMacros.length; i<l; i++) {
      editor.contentDoc.body.appendChild(editor.descMacros[i]);
    }
  }

  /**
   * 
   */
  editor.ContentManager.getDescMacrosText = function() {
    let tmp_embed_content = [];

    for (let i=0, l=editor.descMacros.length; i<l; i++) {
      if (editor.descMacros[i].getAttribute("type") === "descartes/library") {
        if (editor.userConfiguration.embed_library) {
          tmp_embed_content.push(editor.descMacrosText[i]);
        }
      }
      else if (editor.descMacros[i].getAttribute("type") === "descartes/macro") {
        if (editor.userConfiguration.embed_macro) {
          tmp_embed_content.push(editor.descMacrosText[i]);
        }
      }
      else if (editor.descMacros[i].getAttribute("type") === "descartes/vectorFile") {
        if (editor.userConfiguration.embed_vector) {
          tmp_embed_content.push(editor.descMacrosText[i]);
        }
      }
      else {
        tmp_embed_content.push(editor.descMacrosText[i]);
      }
    }
    return tmp_embed_content.join("\r\n\r\n");
  }

  return editor;
})(editor || {});
