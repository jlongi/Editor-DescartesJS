/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var path = require("path"),
    fs = require("fs-extra");

/**
 * 
 */
var paramEditor = (function(paramEditor) {

  paramEditor.displayProperty = "inline-flex";

  /**
   * Manage the resize of paramEditor window
   */
  window.addEventListener("resize", function(evt) {
    var adjust = evt.target.innerHeight - paramEditor.initHeight;

    paramEditor.definitionsPanel.components.expression.adjustHeight(adjust);
    paramEditor.definitionsPanel.components.doExpr.adjustHeight(adjust);
    paramEditor.definitionsPanel.components.doc.adjustHeight(adjust);
    paramEditor.definitionsPanel.components.code.adjustHeight(adjust);

    paramEditor.programsPanel.components.doExpr.adjustHeight(adjust);

    paramEditor.animationPanel.components.doExpr.adjustHeight(adjust);
  });

  // prevent the drop of a external file
  window.addEventListener("dragover", function(e){ e.preventDefault(); e.stopPropagation(); }, false);
  window.addEventListener("drop", function(e){ e.preventDefault(); e.stopPropagation(); }, false);

  /**
   * Entry function
   */
  window.addEventListener("load", function(evt) {
    paramEditor.initHeight = window.innerHeight;

    // only for test purposes in chrome web browser
    if ((typeof process === "undefined") && (typeof require === "undefined")) {
      paramEditor.init({ userConfiguration:{language:"esp", theme:"default"} });
      paramEditor.setParams({ applet: document.querySelector("ajs") });
    }
  });

  /**
   * 
   */
  paramEditor.init = function(editor) {
    paramEditor.editor = editor;

    paramEditor.theme = editor.userConfiguration.theme;
    paramEditor.changeTheme();

    paramEditor.lang = editor.userConfiguration.language;
    babel.setLanguage(paramEditor.lang);
    paramEditor.initGUI();
    paramEditor.initPanels();
  }

  /**
   *
   */
  paramEditor.initGUI = function() {
    // init the tabs
    var tabs = document.querySelectorAll(".tab");
    var tabpages = document.querySelectorAll(".tabpage");
    var tabs_container = document.querySelector("#tabs");
    var current = tabs_container.getAttribute("data-current");

    for (var i=0, l=tabs.length; i<l; i++) {
      if (current == i) {
        tabs[i].setAttribute("class", "tabActiveHeader");
        tabpages[i].style.display = "block";
      }
      tabs[i].addEventListener("click", displayPage);
    }

    /**
     * Shows a page associated with a tab
     */
    function displayPage() {
      tabs[current].setAttribute("class", "tab");
      tabpages[current].style.display = "none";
      current = this.id.split("_")[1];

      tabs[current].setAttribute("class", "tabActiveHeader");
      tabpages[current].style.display = "block";
    }

    // init the buttons
    var ok_btn = document.getElementById("ok_btn");
    var close_btn = document.getElementById("close_btn");
    var apply_btn = document.getElementById("apply_btn");

    ok_btn.addEventListener("click", function(evt) {
      paramEditor.scene.okAction( paramEditor.model.getApplet(), false );
      nw.Window.get().hide();
    });
    close_btn.addEventListener("click", function(evt) {
      paramEditor.scene.closeAction();
      nw.Window.get().hide();
    });
    apply_btn.addEventListener("click", function(evt) {
      paramEditor.scene.okAction( paramEditor.model.getApplet(), true );
    });

    // show tabs with control #
    window.addEventListener("keydown", (evt) => {
      if (evt.ctrlKey) {
        // scene
        if (evt.key === "1") {
          tabs[0].click();
        }
        // spaces
        else if (evt.key === "2") {
          tabs[1].click();
        }
        // controls
        else if (evt.key === "3") {
          tabs[2].click();
        }
        // definitions
        else if (evt.key === "4") {
          tabs[3].click();
        }
        // program
        else if (evt.key === "5") {
          tabs[4].click();
        }
        // 2D graphics
        else if (evt.key === "6") {
          if (tabs[5].style.visibility != "hidden") {
            tabs[5].click();
          }
        }
        // 3D graphics
        else if (evt.key === "7") {
          if (tabs[6].style.visibility != "hidden") {
            tabs[6].click();
          }
        }
        // animation
        else if (evt.key === "8") {
          tabs[7].click();
        }

        // accept
        else if ((evt.altKey) && (evt.key.toLowerCase() === "enter")) {
          window.document.activeElement.blur();
          ok_btn.click();
        }
        // apply
        else if (evt.key.toLowerCase() === "enter") {
          window.document.activeElement.blur();
          apply_btn.click();
        }
        // close
        else if (evt.key.toLowerCase() === "w") {
          window.document.activeElement.blur();
          close_btn.click();
        }

      }
    });

  }

  /**
   * Build the panels that hold the GUI elements
   */
  paramEditor.initPanels = function() {
    this.symbolTable = new paramEditor.SymbolTable();
    this.colorPanel = new paramEditor.ColorDialog();
    this.codePanel = new paramEditor.CodeDialog();
    this.codeEditor = new paramEditor.CodeEditor();
    this.textEditor = new paramEditor.TextEditor();
    this.richTextEditor = new paramEditor.RTFTextEditor();

    this.buttonsPanel = new paramEditor.PanelButtons();
    document.querySelector("#tabpage_buttons_0 .full_panel").appendChild(this.buttonsPanel.container);

    //
    this.spacesPanelListEdit = new paramEditor.PanelListEdit("spaces", false);
    document.querySelector("#tabpage_spaces_1 .left_panel").appendChild(this.spacesPanelListEdit.container);
    this.spacesPanel = new paramEditor.PanelSpaces();
    document.querySelector("#tabpage_spaces_1 .right_panel").appendChild(this.spacesPanel.container);

    this.spacesPanelListEdit.setEditPanel(this.spacesPanel);
    this.spacesPanel.setEditPanel(this.spacesPanelListEdit);

    //
    this.controlsPanelListEdit = new paramEditor.PanelListEdit("controls", true);
    document.querySelector("#tabpage_controls_2 .left_panel").appendChild(this.controlsPanelListEdit.container);
    this.controlsPanel = new paramEditor.PanelControls();
    document.querySelector("#tabpage_controls_2 .right_panel").appendChild(this.controlsPanel.container);

    this.controlsPanelListEdit.setEditPanel(this.controlsPanel);
    this.controlsPanel.setEditPanel(this.controlsPanelListEdit);

    //
    this.definitionsPanelListEdit = new paramEditor.PanelListEdit("definitions", true);
    document.querySelector("#tabpage_definitions_3 .left_panel").appendChild(this.definitionsPanelListEdit.container);
    this.definitionsPanel = new paramEditor.PanelDefinitions();
    document.querySelector("#tabpage_definitions_3 .right_panel").appendChild(this.definitionsPanel.container);

    this.definitionsPanelListEdit.setEditPanel(this.definitionsPanel);
    this.definitionsPanel.setEditPanel(this.definitionsPanelListEdit);

    //
    this.programsPanelListEdit = new paramEditor.PanelListEdit("programs", false);
    document.querySelector("#tabpage_programs_4 .left_panel").appendChild(this.programsPanelListEdit.container);
    this.programsPanel = new paramEditor.PanelPrograms();
    document.querySelector("#tabpage_programs_4 .right_panel").appendChild(this.programsPanel.container);

    this.programsPanelListEdit.setEditPanel(this.programsPanel);
    this.programsPanel.setEditPanel(this.programsPanelListEdit);

    //
    this.graphicsPanelListEdit = new paramEditor.PanelListEdit("graphics", true);
    document.querySelector("#tabpage_graphics_5 .left_panel").appendChild(this.graphicsPanelListEdit.container);
    this.graphicsPanel = new paramEditor.PanelGraphics();
    document.querySelector("#tabpage_graphics_5 .right_panel").appendChild(this.graphicsPanel.container);

    this.graphicsPanelListEdit.setEditPanel(this.graphicsPanel);
    this.graphicsPanel.setEditPanel(this.graphicsPanelListEdit);

    //
    this.graphics3DPanelListEdit = new paramEditor.PanelListEdit("graphics3D", true);
    document.querySelector("#tabpage_graphics3D_6 .left_panel").appendChild(this.graphics3DPanelListEdit.container);
    this.graphics3DPanel = new paramEditor.PanelGraphics3D();
    document.querySelector("#tabpage_graphics3D_6 .right_panel").appendChild(this.graphics3DPanel.container);

    this.graphics3DPanelListEdit.setEditPanel(this.graphics3DPanel);
    this.graphics3DPanel.setEditPanel(this.graphics3DPanelListEdit);

    //
    this.animationPanel = new paramEditor.PanelAnimation();
    document.querySelector("#tabpage_animation_7 .full_panel").appendChild(this.animationPanel.container);
  }

  /**
   * Set the language and translate the GUI buttons 
   */
  paramEditor.translate = function() {
    paramEditor.lang = paramEditor.editor.userConfiguration.language;
    babel.setLanguage(paramEditor.lang);

    // translate the names of the principal buttons
    var tmp_tooltip = tooltip[paramEditor.lang]["Panels"];
    var tmp = document.querySelector("#buttons_0");
    tmp.setAttribute("title", tmp_tooltip["Buttons"]);
    tmp.innerHTML = babel.transGUI("buttons");

    tmp = document.querySelector("#spaces_1");
    tmp.setAttribute("title", tmp_tooltip["Spaces"]);
    tmp.innerHTML = babel.transGUI("spaces");

    tmp = document.querySelector("#controls_2");
    tmp.setAttribute("title", tmp_tooltip["Controls"]);
    tmp.innerHTML = babel.transGUI("controls");

    tmp = document.querySelector("#definitions_3");
    tmp.setAttribute("title", tmp_tooltip["Definitions"]);
    tmp.innerHTML = babel.transGUI("definitions");

    tmp = document.querySelector("#programs_4");
    tmp.setAttribute("title", tmp_tooltip["Programs"]);
    tmp.innerHTML    = babel.transGUI("programs");

    tmp = document.querySelector("#graphics_5");
    tmp.setAttribute("title", tmp_tooltip["Graphics"]);
    tmp.innerHTML    = babel.transGUI("graphics");

    tmp = document.querySelector("#graphics3D_6");
    tmp.setAttribute("title", tmp_tooltip["Graphics3D"]);
    tmp.innerHTML  = babel.transGUI("graphics3D");

    tmp = document.querySelector("#animation_7");
    tmp.setAttribute("title", tmp_tooltip["Animation"]);
    tmp.innerHTML   = babel.transGUI("animation");

    document.getElementById("ok_btn").innerHTML    = babel.transGUI("ok_btn");
    document.getElementById("close_btn").innerHTML = babel.transGUI("close_btn");
    document.getElementById("apply_btn").innerHTML = babel.transGUI("apply_btn");

    this.symbolTable.translate();
    this.colorPanel.transOptions();
    this.codePanel.translate();
    this.codeEditor.translate();
    this.textEditor.translate();
    this.richTextEditor.translate();

    this.spacesPanelListEdit.translate();
    this.controlsPanelListEdit.translate();
    this.definitionsPanelListEdit.translate();
    this.programsPanelListEdit.translate();
    this.graphicsPanelListEdit.translate();
    this.graphics3DPanelListEdit.translate();

    paramEditor.translatePanel(this.buttonsPanel);
    paramEditor.translatePanel(this.spacesPanelListEdit.editPanel);
    paramEditor.translatePanel(this.controlsPanelListEdit.editPanel);
    paramEditor.translatePanel(this.definitionsPanelListEdit.editPanel);
    paramEditor.translatePanel(this.programsPanelListEdit.editPanel);
    paramEditor.translatePanel(this.graphicsPanelListEdit.editPanel);
    paramEditor.translatePanel(this.graphics3DPanelListEdit.editPanel);
    paramEditor.translatePanel(this.animationPanel);
  }

  /**
   *
   */
  paramEditor.translatePanel = function(panel) {
    // traverse the values of the components to asign the object model
    for (var propName in panel.components) {
      // verify the own properties of the object
      if (panel.components.hasOwnProperty(propName)) {
        if (panel.components[propName].transLabel) {
          panel.components[propName].transLabel();
        }
        if (panel.components[propName].transOptions) {
          panel.components[propName].transOptions();
        }
      }
    }
  }  

  /**
   * Update the menu with the space names
   */
  paramEditor.updateSpaceList = function() {
    this.controlsPanelListEdit.updateSpaceList();
    this.graphicsPanelListEdit.updateSpaceList();
    this.graphics3DPanelListEdit.updateSpaceList();

    this.controlsPanel.updateSpaceList(this.model);
    this.graphicsPanel.updateSpaceList(this.model);
    this.graphics3DPanel.updateSpaceList(this.model);

    // show or hide the graphics and 3d graphics tabs
    var spaceList = this.model.data.spaces;
    var has2D = false;
    var has3D = false;
    for (var i=0, l=spaceList.length; i<l; i++) {
      if (spaceList[i].data.type === "R2") {
        has2D = true;
      }
      if (spaceList[i].data.type === "R3") {
        has3D = true;
      }
    }

    document.getElementById("graphics_5").style.visibility = (has2D) ? "visible" : "hidden";
    document.getElementById("graphics3D_6").style.visibility = (has3D) ? "visible" : "hidden";
  }

  /**
   * Update the menu with the library names
   */
  paramEditor.updateLibraryList = function() {
    this.definitionsPanelListEdit.updateLibraryList();
  }

  /**
   * Set the scene and build the model for the parameters of the Descartes scene
   */
  paramEditor.setParams = function(scene) {
    // hack to make the external window console the same from the principal window
    if (scene.console) {
      window.console = scene.console;
    }

    this.scene = scene;
    this.model = new paramEditor.Model(scene.applet, scene);

    // set the appropiated model in the paramEditor
    this.buttonsPanel.setModelObj(this.model.data.attributes);
    this.spacesPanelListEdit.setModelObj(this.model);
    this.controlsPanelListEdit.setModelObj(this.model);
    this.definitionsPanelListEdit.setModelObj(this.model, true);
    this.programsPanelListEdit.setModelObj(this.model);
    this.graphicsPanelListEdit.setModelObj(this.model);
    this.graphics3DPanelListEdit.setModelObj(this.model);
    this.animationPanel.setModelObj(this.model.data.animation);

    // update the space name list
    paramEditor.updateSpaceList();

    // update the library name list
    paramEditor.updateLibraryList();

    this.translate();

    return this.model;
  }

  /**
   * 
   */
  paramEditor.changeTheme = function() {
    paramEditor.theme = paramEditor.editor.userConfiguration.theme;
    
    var theme = document.getElementById("theme");
    theme.setAttribute("href", "css/theme_" + paramEditor.theme + ".css");
  }

  /**
   * 
   */
  paramEditor.getFontValues = function(fontStr) {
    var font = {
      bold: "false",
      italics: "false",
      font_size: "18",
      font_family: "SansSerif"
    }
    if (fontStr == "") {
      return font;
    }

    var fontTokens = fontStr.split(",");

    // font name
    font.font_family = fontTokens[0];

    // font style
    var font_style = fontTokens[1].toLowerCase();
    if (font_style.match("bold")) {
      font.bold = "true";
    }
    if (font_style.match("italic")) {
      font.italics = "true";
    }

    // font size
    font.font_size = fontTokens[2];

    return font;
  }

  /**
   * Set the scene and build the model for the parameters of the Descartes scene
   */
  paramEditor.replaceSeparators = function(value) {
    value = Array.prototype.slice.call(value);
    var inStr = false;

    for (var i=0, l=value.length; i<l; i++) {
      // inside or outside of a string
      if (value[i] === "'") {
        inStr = !inStr;
      }

      // if outside of a string then replace \\n and ; for a new line
      if (!inStr) {
        if ( (value[i] === "\\") && (value[i+1] === "n") ) {
          value[i] = "\n";
          value[i+1] = "";
          i++;
        }
        if (value[i] === ";") {
          value[i] = "\n";
        }
      }
    }

    return value.join("");
  }

  /**
   * Extends an object with inheritance
   * @param {Object} child is the object that extends
   * @param {Object} parent is the objecto to extends
   */
  paramEditor.extend = function(child, parent) {
    // updated method
    if (typeof Object.create == "function") {
      child.prototype = Object.create(parent.prototype);
    }
    // old method
    else {
      if (child.prototype.__proto__) {
        child.prototype.__proto__ = parent.prototype;
      }
      else {
        // copy all the functions of the parent
        for( var i in parent.prototype ) {
          if (parent.prototype.hasOwnProperty(i)) {
            child.prototype[i] = parent.prototype[i];
          }
        }
      }
    }

    // add the uber (super) property to execute functions of the parent
    child.prototype.uber = parent.prototype;
  }  

  return paramEditor;
})(paramEditor || {});
