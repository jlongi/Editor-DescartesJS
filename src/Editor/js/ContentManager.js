/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

let beautify_html = require("js-beautify").html;

var editor = (function(editor) {

  /**
   *
   */
  editor.ContentManager = { };

  /**
   * Close a file, remove all iframes and edit buttons to clean the editor
   */
  editor.ContentManager.closeFile = function() {
    for (let elem_i of document.querySelectorAll("iframe")) {
      elem_i.win.close(true);
      elem_i.parentNode.removeChild(elem_i);
    }
    
    for (let elem_i of document.querySelectorAll(".SceneContainer")) {
      elem_i.parentNode.removeChild(elem_i);
    }
  }

  /**
   *
   */
  editor.ContentManager.openFile = function(filename) {
    let contents = editor.File.open(filename);

    // parse the content and create a dom object
    editor.contentDoc = (new DOMParser()).parseFromString(contents, "text/html");

    // all the descartes macros scripts
    editor.descMacros = [];
    editor.descMacrosText = [];

    // get all scripts tags to obtain descartes-min.js and macros
    let jsScripts = editor.contentDoc.querySelectorAll("script");
    let desMinScript = [];
    let tmpSrc;

    for (let jsScripts_i of jsScripts) {
      tmpSrc = jsScripts_i.getAttribute("src");

      if (tmpSrc && tmpSrc.match("descartes-min.js")) {
        desMinScript.push(jsScripts_i);
      }

      if ((/^descartes\/(macro|vectorFile|matrixFile|library|archivo|imagen)$/).test(jsScripts_i.getAttribute("type"))) {
        editor.descMacros.push(jsScripts_i);
        editor.descMacrosText.push(jsScripts_i.outerHTML);
      }
    }

    editor.descMinType = null;
    // remove all the scripts that reference descartes-min.js and get the type reference
    for (let desMinScript_i of desMinScript) {
      if (!editor.descMinType) {
        tmpSrc = desMinScript_i.getAttribute("src");

        if ((/http(s)*:\/\/arquimedes.matem.unam.mx\/Descartes5\/lib\/descartes-min.js/).test(tmpSrc)) {
          editor.descMinType = "internet";
        }
        else if ((/^lib\/descartes-min.js$/).test(tmpSrc)) {
          editor.descMinType = "portable";
        }
        else if ((/^..\/lib\/descartes-min.js$/).test(tmpSrc)) {
          editor.descMinType = "proyecto";
        }
        else {
          editor.descMinType = "personalizada";
          editor.customSrc = tmpSrc;
        }
      }

      desMinScript_i.parentNode.removeChild(desMinScript_i);
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
    let metaTags = editor.contentDoc.querySelectorAll("meta");
    let metaTagsArray = [];
    let tmpAttr;

    for (let metaTags_i of metaTags) {
      // if the meta tag is of the type <meta http-equiv="content-type" content="text/html; charset=UTF-8">
      tmpAttr = metaTags_i.getAttribute("http-equiv");
      if (tmpAttr && (tmpAttr.toLowerCase() === "content-type")) {
        metaTagsArray.push(metaTags_i);
      }
      // if the meta tag is of the type <meta charset="UTF-8">
      if (metaTags_i.getAttribute("charset")) {
        metaTagsArray.push(metaTags_i);
      }
    }
    // remove the tags
    for (let metaTagsArray_i of metaTagsArray) {
      metaTagsArray_i.parentNode.removeChild(metaTagsArray_i);
    }
    // add a new meta tag
    let meta = document.createElement("meta");
    meta.setAttribute("http-equiv", "content-type");
    meta.setAttribute("content", "text/html; charset=UTF-8");
    editor.contentDoc.head.insertBefore(meta, editor.contentDoc.head.firstChild);

    // query all applets
    editor.applets = editor.contentDoc.querySelectorAll("applet");
    if (editor.applets.length === 0) {
      editor.applets = editor.contentDoc.querySelectorAll("ajs");
    }

    editor.scenes = [];
    let newApplet;
    let appletParams;
    let whichVersion;
    let versionParam;

    // create a temporal container for every applet
    for (let applet_i of editor.applets) {
      newApplet = editor.contentDoc.createElement("ajs");
      appletParams = applet_i.querySelectorAll("param");

      // create a new param to change the version
      versionParam = editor.contentDoc.createElement("param");
      versionParam.setAttribute("name", "Versión");
      versionParam.setAttribute("value", editor.descartesVersion);

      newApplet.setAttribute("name", applet_i.getAttribute("name") || "Descartes");
      newApplet.setAttribute("code", applet_i.getAttribute("code") || "Descartes");
      newApplet.setAttribute("width", applet_i.getAttribute("width") || 970);
      newApplet.setAttribute("height", applet_i.getAttribute("height") || 550);
      newApplet.appendChild(versionParam);

      for (let appletParams_i of appletParams) {
        if (babel[appletParams_i.getAttribute("name")] === "version") {
          whichVersion = appletParams_i.getAttribute("value") || editor.descartesVersion;
        }
        else {
          newApplet.appendChild(appletParams_i);
        }
      }

      if (whichVersion < 3) {
        newApplet.innerHTML = newApplet.innerHTML.replace(/(Ox|Oy|_w|_h|mouse_x|mouse_y|mouse_pressed|mouse_clicked|clic_izquierdo|escala)/g, "E0.$1").replace(/scale/g, "E0.escala").replace(/eskala/g, "E0.escala").replace(/échelle/g, "E0.escala");
      }

      applet_i.parentNode.replaceChild(newApplet, applet_i);
      applet_i = newApplet;
      applet_i.titleTag = editor.contentDoc.querySelector("title");
      applet_i.titleTag = (applet_i.titleTag) ? applet_i.titleTag.innerHTML : "";

      editor.scenes.push( new editor.Scene(applet_i, filename) );
    }
  }

  /**
   *
   */
  editor.ContentManager.saveFile = function(filename) {
    // set the filename to all scenes in the editor
    for (let scene_i of editor.scenes) {
      scene_i.filename = filename;
    }

    // remove the descartes macros script to prevent a bad formatting
    this.cleanDescMacros();

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get all the macros graphics
    let macros = [];

    for (let scene_i of editor.scenes) {
      for (let graphics_j of (scene_i.model.data.graphics).concat(scene_i.model.data.graphics3D)) {
        if (graphics_j.data.type === "macro") {
          macros.push(graphics_j.data);
        }
      }
    }

    // check if the macros are embedded in the html
    for (let macros_i of macros) {
      expr = macros_i.expression;
      macroPath = path.normalize(`${path.dirname(filename)}/${expr}`);
      handleEmbeddedFile(expr, macroPath, "macro", editor);
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get all the vector objects
    // check if vector files are embedded in the html
    let vecs = [];
    let mtxs = [];

    for (let scenes_i of editor.scenes) {
      for (let definitions_j of scenes_i.model.data.definitions) {
        if (definitions_j.data.type === "array") {
          vecs.push(definitions_j.data);
        }
        else if (definitions_j.data.type === "matrix") {
          mtxs.push(definitions_j.data);
        }
      }
    }

    for (let vec_i of vecs) {
      file = (vec_i.file).trim();
      if (file) {
        handleEmbeddedFile(file, path.normalize(`${path.dirname(filename)}/${file}`), "vectorFile", editor);
      }
    }

    for (let mtx_i of mtxs) {
      file = (mtx_i.file).trim();
      if (file) {
        handleEmbeddedFile(file, path.normalize(`${path.dirname(filename)}/${file}`), "matrixFile", editor);
      }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get all the library objects
    let libs = [];
    let libPath;
    
    for (let scene_i of editor.scenes) {
      for (let definitions_j of scene_i.model.data.definitions) {
        if (definitions_j.data.type === "library") {
          libs.push(definitions_j.data);
        }
      }
    }

    for (let libs_i of libs) {
      file = libs_i.file;
      libPath = path.normalize(`${path.dirname(filename)}/${file}`);

      for (let descMacros_i of editor.descMacros) {
        if (file === descMacros_i.getAttribute("id")) {
          fs.ensureFileSync(libPath);
          fs.writeFileSync(libPath, descMacros_i.innerHTML.replace(/\r\n/g, "\n").replace(/\n\n/g, "\r\n").trim(), "utf8");
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
    if (!tmpSrc.match(/^(http|www)/)) {
      editor.File.copy(path.join(__dirname, "lib/descartes-min.js"), path.normalize(path.join(path.dirname(filename), tmpSrc)));
    }

    let titleTag = "";
    let appletModel;
    // get the last changes in the scene
    for (let scene_i of editor.scenes) {
      appletModel = scene_i.model.getApplet();
      titleTag = appletModel.titleTag;
      scene_i.applet.innerHTML = appletModel.innerHTML;
    }

    // replace the title text
    let titleDOM = editor.contentDoc.querySelector("title");
    if (titleDOM) {
      titleDOM.innerHTML = titleTag;
    }
    else {
      titleDOM = document.createElement("title");
      editor.contentDoc.head.insertBefore(titleDOM, editor.contentDoc.head.firstChild.nextSibling);
      titleDOM.innerHTML = titleTag;
    }

    let content = "<!DOCTYPE html>\r\n<html>\r\n" +
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
    for (let i=0, l=editor.descMacros.length; i<l; i++) {
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
    for (let descMacros_i of editor.descMacros) {
      editor.contentDoc.body.appendChild(descMacros_i);
    }
  }

  /**
   * 
   */
  editor.ContentManager.getDescMacrosText = function() {
    let tmp_embed_content = [];

    for (let i=0, l=editor.descMacros.length; i<l; i++) {
      if ((/library$/).test(editor.descMacros[i].getAttribute("type"))) {
        if (editor.userConf.embed_library) {
          tmp_embed_content.push(editor.descMacrosText[i]);
        }
      }
      else if ((/macro$/).test(editor.descMacros[i].getAttribute("type"))) {
        if (editor.userConf.embed_macro) {
          tmp_embed_content.push(editor.descMacrosText[i]);
        }
      }
      else if ((/vectorFile$/).test(editor.descMacros[i].getAttribute("type"))) {
        if (editor.userConf.embed_vector) {
          tmp_embed_content.push(editor.descMacrosText[i]);
        }
      }
      else if ((/matrixFile$/).test(editor.descMacros[i].getAttribute("type"))) {
        if (editor.userConf.embed_matrix) {
          tmp_embed_content.push(editor.descMacrosText[i]);
        }
      }
      else {
        tmp_embed_content.push(editor.descMacrosText[i]);
      }
    }
    return tmp_embed_content.join("\r\n\r\n");
  }

  // Función auxiliar para manejar archivos incrustados (macros, vectores, matrices)
  function handleEmbeddedFile(id, filePath, type, editor) {
    let content = "";
    let fileExists = fs.existsSync(filePath);

    if (fileExists) {
      content = "\r\n" + (fs.readFileSync(filePath, "utf8")).replace(/</g, "<").replace(/>/g, ">") + "\r\n";
    }

    let found = false;
    
    for (let j = 0, k = editor.descMacros.length; j < k; j++) {
      if (id === editor.descMacros[j].getAttribute("id")) {
        found = true;

        // the file exist, then replace te content of the embedded element
        if (fileExists) {
          editor.descMacros[j].innerHTML = content;
          editor.descMacrosText[j] = (editor.descMacros[j].outerHTML).replace(/(\n)+/g, "\r\n");
        }
        // the file doesn't exist then create it
        else {
          fs.ensureFileSync(filePath);
          fs.writeFileSync(filePath, editor.descMacros[j].innerHTML.replace(/\r\n/g, "\n").replace(/\n\n/g, "\r\n").trim(), "utf8");
        }
        break;
      }
    }

    if (!found) {
      const newScriptElement = document.createElement("script");
      newScriptElement.setAttribute("type", `descartes/${type}`);
      newScriptElement.setAttribute("id", id);

      if (fileExists) {
        newScriptElement.innerHTML = content;
        editor.descMacros.push(newScriptElement);
        editor.descMacrosText.push((newScriptElement.outerHTML).replace(/(\n)+/g, "\r\n"));
      }
    }
  }

  return editor;
})(editor || {});
