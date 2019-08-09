/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  /**
   *
   */
  paramEditor.PanelListEdit = function(name, whitMenuList) {
    var self = this;
    this.name = name;
    this.components = {};
    this.container = document.createElement("div");
    this.container.setAttribute("class", "panelListEdit");

    this.filterValue = "*";

    // make the dialog
    this.createAddDialog(name);
    this.createCloneDialog(name);
    this.createRemoveDialog(name);
    this.translate();

    var rnd = parseInt(Math.random()*1000);

    this.menu = document.createElement("select");
    this.menu.setAttribute("id", name+"_menu_"+rnd);
    this.setOptions([]);
    this.menu.addEventListener("change", function(evt) {
      if (self.name === "definitions") {
        self.filterValue = this.value;
        self.createListLibrary();
      }
      else {
        self.filterValue = this.value;
        self.createList();
      }
    });

    this.btnName = document.createElement("button");
    this.btnName.addEventListener("click", function(evt) {
      paramEditor.codePanel.show(self);
    });
    this.setButtonName(name);

    var btnContainer = document.createElement("div");
    btnContainer.setAttribute("class", "btnContainer");

    this.addBtn = document.createElement("button");
    this.addBtn.innerHTML = '<div style="-webkit-mask-image:url(css/icons/add.svg);"></div>';
    this.addBtn.addEventListener("click", function(evt) {
      self.addDialog.id_input.value = self.getPrefix() + (self.divList.length+1);

      // hide the library option when the list is inside a library to prevent add a library inside a another
      var libraryOption = self.addDialog.content.querySelector('option[value="library"]');
      if (libraryOption) {
        if (self.filterValue !== "*") {
          libraryOption.style.display = "none";
          if (libraryOption.parentNode.value === "library") {
            libraryOption.parentNode.value = "array";
          }
        }
        else {
          libraryOption.style.display = "block";
        }
      }
      //

      self.addDialog.open();
    });

    this.cloneBtn = document.createElement("button");
    this.cloneBtn.innerHTML = '<div style="-webkit-mask-image:url(css/icons/clone.svg);"></div>';
    this.cloneBtn.addEventListener("click", function(evt) {
      if (self.divList.length > 0) {
        if (self.data[self.name][self.lastIndex].data.id != undefined) {
          self.cloneDialog.id_input.value = self.data[self.name][self.lastIndex].data.id;
          self.cloneDialog.open();
        }
        else {
          self.cloneElement();
        }
      }
    });

    this.removeBtn = document.createElement("button");
    this.removeBtn.innerHTML = '<div style="-webkit-mask-image:url(css/icons/remove.svg);"></div>';
    this.removeBtn.addEventListener("click", function(evt) {
      if (self.divList.length > 0) {
        var elemTxt = "<span>" + self.divList[self.lastIndex].innerHTML.substring(0,200) + "</span>";
        self.removeDialog.container.querySelector("#message_"+self.name).innerHTML = "¿ " + babel.transGUI("remove_element") + ": " + elemTxt + " ?";
        self.removeDialog.open();
      }
    });

    var intervalUpdateTime = 250;

    this.upBtn = document.createElement("button");
    this.upBtn.innerHTML = '<div style="-webkit-mask-image:url(css/icons/up.svg);"></div>';
    var upBtnInterval;
    this.upBtn.addEventListener("mousedown", function(evt) { self.moveListElements(-1); upBtnInterval = setInterval(function() {self.moveListElements(-1);}, intervalUpdateTime); });
    this.upBtn.addEventListener("mouseup", function(evt) { clearInterval(upBtnInterval); } );
    this.upBtn.addEventListener("mouseout", function(evt) { clearInterval(upBtnInterval); } );

    this.downBtn = document.createElement("button");
    this.downBtn.innerHTML = '<div style="-webkit-mask-image:url(css/icons/down.svg);"></div>';
    var downBtnInterval;
    this.downBtn.addEventListener("mousedown", function(evt) { self.moveListElements(1); downBtnInterval = setInterval(function() {self.moveListElements(1);}, intervalUpdateTime); });
    this.downBtn.addEventListener("mouseup", function(evt) { clearInterval(downBtnInterval); } );
    this.downBtn.addEventListener("mouseout", function(evt) { clearInterval(downBtnInterval); } );

    this.listPanel = document.createElement("div");
    this.listPanel.setAttribute("class", "listPanel");

    this.container.appendChild(this.btnName);
    if (whitMenuList) {
      this.container.appendChild(this.menu);
    }
    else {
      this.listPanel.style.top = "72px";
    }
    this.container.appendChild(btnContainer);
    this.container.appendChild(this.listPanel);
    btnContainer.appendChild(this.addBtn);
    btnContainer.appendChild(this.cloneBtn);
    btnContainer.appendChild(this.removeBtn);
    btnContainer.appendChild(this.upBtn);
    btnContainer.appendChild(this.downBtn);
  }

  /**
   *
   */
  paramEditor.PanelListEdit.prototype.setButtonName = function(name) {
    this.btnName.innerHTML = name;
  }

  /**
   *
   */
  paramEditor.PanelListEdit.prototype.setOptions = function(options) {
    // remove all previous children
    while (this.menu.firstChild) {
      this.menu.removeChild(this.menu.firstChild);
    }

    // add the new children
    var tmpOption;
    for (var i=0, l=options.length; i<l; i++) {
      tmpOption = document.createElement("option");
      tmpOption.setAttribute("value", options[i]);
      tmpOption.innerHTML = options[i];
      this.menu.appendChild(tmpOption);
    }
  }

  /**
   *
   */
  paramEditor.PanelListEdit.prototype.translate = function() {
    this.removeDialog.setTitle(babel.transGUI("remove_"+this.name))
    this.removeDialog.setOkLabel(babel.transGUI("remove_element"));
    this.removeDialog.setCancelLabel(babel.transGUI("cancel_btn"));
    if (this.lastIndex > -1) {
      var elemTxt = "<span>" + this.divList[this.lastIndex].innerHTML.substring(0,200) + "</span>";
      this.removeDialog.container.querySelector("#message_"+this.name).innerHTML = "¿ " + babel.transGUI("remove_element") + ": " + elemTxt + " ?";
    }

    this.cloneDialog.setTitle(babel.transGUI("clone_"+this.name))
    this.cloneDialog.setOkLabel(babel.transGUI("clone_element"));
    this.cloneDialog.setCancelLabel(babel.transGUI("cancel_btn"));

    this.addDialog.setTitle(babel.transGUI("add_"+this.name))
    this.addDialog.setOkLabel(babel.transGUI("add_element"));
    this.addDialog.setCancelLabel(babel.transGUI("cancel_btn"));
    var menu = this.addDialog.container.querySelector("#type_"+this.name);
    var options = menu.querySelectorAll("option");
    for (var i=0, l=options.length; i<l; i++) {
      options[i].innerHTML = babel.transGUI( options[i].getAttribute("value") );
    }

    if (this.btnName) {
      this.setButtonName(babel.transGUI(this.name));
    }

    try { this.updatePresentation(); } catch(e) { };
  }

  /**
   *
   */
  paramEditor.PanelListEdit.prototype.createRemoveDialog = function(name) {
    var self = this;

    this.removeDialog = new editor.Dialog("60%", "190px", babel.transGUI("remove_"+name), "Eliminar", "Cancelar");

    var id_div = document.createElement("div");
    id_div.setAttribute("id", "message_"+name);

    var content = document.createElement("div");
    content.appendChild(id_div);

    this.removeDialog.setContent(content, true);

    // add events to the buttons
    this.removeDialog.setOkCallback( function(evt) {
      self.removeElement();
    });
  }

  /**
   *
   */
  paramEditor.PanelListEdit.prototype.createCloneDialog = function(name) {
    var self = this;

    this.cloneDialog = new editor.Dialog("60%", "190px", babel.transGUI("clone_"+name), "Clonar", "Cancelar");

    var id_div = document.createElement("div");
    this.cloneDialog.id_input = document.createElement("input");
    this.cloneDialog.id_input.setAttribute("id", "id_"+this.name);
    this.cloneDialog.id_input.setAttribute("type", "text");
    id_div.appendChild(this.cloneDialog.id_input);

    var content = document.createElement("div");
    content.appendChild(id_div);

    this.cloneDialog.setContent(content, true);

    // add events to the buttons
    this.cloneDialog.setOkCallback( function(evt) {
      self.cloneIdValue = self.cloneDialog.id_input.value;
      self.cloneElement();
    });
  }

  /**
   *
   */
  paramEditor.PanelListEdit.prototype.createAddDialog = function(name) {
    var self = this;

    this.addDialog = new editor.Dialog("70%", "230px", babel.transGUI("add_"+name), "Agregar", "Cancelar");

    var type_div = document.createElement("div");
    var type_select = document.createElement("select");
    type_select.setAttribute("id", "type_"+name);
    type_div.appendChild(type_select);

    var id_div = document.createElement("div");
    this.addDialog.id_input = document.createElement("input");
    this.addDialog.id_input.setAttribute("id", "id_"+name);
    this.addDialog.id_input.setAttribute("type", "text");
    id_div.appendChild(this.addDialog.id_input);

    var content = document.createElement("div");
    content.appendChild(type_div);
    content.appendChild(document.createElement("br"));
    content.appendChild(id_div);

    // set the options
    var options = [];
    if (name == "spaces") {
      options = ["R2", "R3", "HTMLIFrame"];
    }
    else if (name == "controls") {
      options = ["spinner", "textfield", "menu", "scrollbar", "button", "checkbox", "graphic", "text", "audio", "video"];
    }
    else if (name == "definitions") {
      options = ["array", "matrix", "function", "variable", "library"];
    }
    else if (name == "programs") {
      options = ["event"];
    }
    else if (name == "graphics") {
      options = ["equation", "curve", "point", "segment", "polygon", "rectangle", "arrow", "arc", "text", "image", "macro", "sequence", "fill"];
      id_div.style.display = "none";
    }
    else if (name == "graphics3D") {
      options = ["point", "segment", "polygon", "curve", "triangle", "face", "polireg", "surface", "text", "macro", "cube", "box", "tetrahedron", "octahedron", "dodecahedron", "icosahedron", "sphere", "ellipsoid", "cone", "cylinder", "torus"];
      id_div.style.display = "none";
    }

    var tmpOption;
    for (var i=0, l=options.length; i<l; i++) {
      tmpOption = document.createElement("option");
      tmpOption.setAttribute("value", options[i]);
      tmpOption.innerHTML = babel.transGUI(options[i]);
      type_select.appendChild(tmpOption);
    }

    this.addDialog.setContent(content, true);

    // add events to the buttons
    type_select.addEventListener("change", function(evt) {
      self.addTypeValue = type_select.value;
      self.addDialog.id_input.value = self.getPrefix() + (self.divList.length+1);
    });

    this.addDialog.setOkCallback( function(evt) {
      self.addTypeValue = type_select.value;
      self.addIdValue   = self.addDialog.id_input.value;
      self.addElement();
    });
  }

  /**
   *
   */
  paramEditor.PanelListEdit.prototype.addElement = function() {
    var self = this;
    var currentSpace = null;

    var libraryModification = false;

    if (this.filterValue === "*") {
      if (this.menu.length > 1) {
        currentSpace = { 
          name: "space",
          value: this.menu.options[1].value
        };
      }
    }
    else {
      currentSpace = { 
          name: "space",
          value: this.filterValue
        };
    }

    // if the list have elements remove the data-active attribute
    if (this.lastIndex >= 0) {
      this.divList[this.lastIndex].setAttribute("data-active", "false");
    }

    var tmpElement;
    if (this.name == "spaces") {
      tmpElement = new paramEditor.ModelSpace([
          { name: "type", value: self.addTypeValue },
          { name: "id", value: (self.addIdValue) || (self.getPrefix()+ (this.divList.length+1)) }
        ]);
    }
    else if (this.name == "controls") {
      var expr = "(0,0)";
      var name = "";
      var gui = "";
      if ( (self.addTypeValue == "spinner") || (self.addTypeValue == "textfield") || (self.addTypeValue == "menu") || (self.addTypeValue == "scrollbar") || (self.addTypeValue == "button") ) {
        self.gui = self.addTypeValue;
        self.addTypeValue = "numeric";
      }

      if (self.addTypeValue == "numeric") {
        expr = "(0,0,"+ this.model.data.attributes.buttons.data.widthWest +","+ (this.model.data.attributes.buttons.data.heightRows.trim()) +")";
        name = { name: "name", value: (self.addIdValue) || (self.getPrefix()+ (this.divList.length+1)) };
        gui = { name: "gui", value: self.gui};
      }
      else if (self.addTypeValue == "checkbox") {
        expr = "(0,0,"+ this.model.data.attributes.buttons.data.widthWest +","+ (this.model.data.attributes.buttons.data.heightRows.trim()) +")";
        name = { name: "name", value: (self.addIdValue) || (self.getPrefix()+ (this.divList.length+1)) };
      }
      tmpElement = new paramEditor.ModelControl([
        { name: "type", value: self.addTypeValue },
        { name: "expression", value: expr },
        { name: "id", value: (self.addIdValue) || (self.getPrefix()+ (this.divList.length+1)) },
        name,
        gui,
        currentSpace
      ]
      );
    }
    else if (this.name == "definitions") {
      var expr = "0";
      if (self.addTypeValue == "array") {
        expr = "V[0]=0;V[1]=0;V[2]=0".replace(/V/g, (self.addIdValue || (self.getPrefix()+ (this.divList.length+1))));
      }
      else if (self.addTypeValue == "matrix") {
        expr = "M[0,0]=0;M[1,0]=0;M[2,0]=0;M[0,1]=0;M[1,1]=0;M[2,1]=0;M[0,2]=0;M[1,2]=0;M[2,2]=0;".replace(/M/g, (self.addIdValue || (self.getPrefix()+ (this.divList.length+1))));
      }
      else if (self.addTypeValue == "function") {
        if (self.addIdValue) {
          if (!self.addIdValue.match(/\(/)) {
            self.addIdValue += "()";
          }
        }
        else {
          self.addIdValue = self.getPrefix()+ (this.divList.length+1) + "(x)";
          expr = "x";
        }
      }
      else if (self.addTypeValue == "library") {
        self.fileValue = ((self.addIdValue || (self.getPrefix()+ (this.divList.length+1))) + ".txt").replace(/\.txt\.txt/g, ".txt");
        libraryModification = true;
      }
      tmpElement = new paramEditor.ModelDefinition([
        { name: "type", value: self.addTypeValue },
        { name: "expression", value: expr },
        { name: "id", value: (self.addIdValue) || (self.getPrefix()+ (this.divList.length+1)) },
        { name: "file", value: (self.addTypeValue === "library") ? (self.fileValue) : "" }
      ],
      self.addTypeValue
      );
    }
    else if (this.name == "programs") {
      tmpElement = new paramEditor.ModelProgram([
        { name: "type", value: "event" },
        // { name: "expression", value: "0" },
        { name: "id", value: (self.addIdValue) || (self.getPrefix()+ (this.divList.length+1)) }
      ],
      "event"
      );
    }
    else if (this.name == "graphics") {
      tmpElement = new paramEditor.ModelGraphic([
        { name: "type", value: self.addTypeValue },
        currentSpace
      ]
      );
    }
    else if (this.name == "graphics3D") {
      tmpElement = new paramEditor.ModelGraphic3D([
        { name: "type", value: self.addTypeValue },
        currentSpace
      ]
      );
    }

    this.data[this.name].push(tmpElement);

    var div = document.createElement("div");
    div.index = this.divList.length;

    div.innerHTML = tmpElement.data[this.nameElem] + "【" + tmpElement.data[this.nameValue] + "】";
    div.addEventListener("click", function(evt) {
      self.divList[self.lastIndex].setAttribute("data-active", "false");
      self.lastIndex = this.index;
      this.setAttribute("data-active", "true");

      self.setPanelModelObj(this.index);
    });
    div.addEventListener("mouseenter", onMouseEnter);
    div.addEventListener("mouseleave", onMouseLeave);


    this.divList.push(div);

    this.listPanel.appendChild(div);

    self.setPanelModelObj(div.index);

    this.lastIndex = this.divList.length-1;
    this.divList[this.lastIndex].setAttribute("data-active", "true");

    // update the info shown
    this.updatePresentation();

    // update the space list if needed
    if (this.name == "spaces") {
      paramEditor.updateSpaceList();
    }
    // update the library list if needed
    if (libraryModification) {
      paramEditor.updateLibraryList();
    }

    this.listPanel.scrollTop = this.divList[this.lastIndex].offsetTop;
  }

  /**
   *
   */
  paramEditor.PanelListEdit.prototype.cloneElement = function() {
    var self = this;

    // if the list have elements
    if (this.lastIndex >= 0) {
      this.divList[this.lastIndex].setAttribute("data-active", "false");

      var tmpElement = clone(this.data[this.name][this.lastIndex], this.cloneIdValue);

      this.data[this.name].push(tmpElement);

      var div = document.createElement("div");
      div.index = this.divList.length;
      div.innerHTML = tmpElement.data[this.nameElem] + "【" + tmpElement.data[this.nameValue] + "】";
      div.addEventListener("click", function(evt) {
        self.divList[self.lastIndex].setAttribute("data-active", "false");
        self.lastIndex = this.index;
        this.setAttribute("data-active", "true");

        self.setPanelModelObj(this.index);
      });
      div.addEventListener("mouseenter", onMouseEnter);
      div.addEventListener("mouseleave", onMouseLeave);
      

      this.divList.push(div);

      this.listPanel.appendChild(div);

      self.setPanelModelObj(div.index);

      this.lastIndex = this.divList.length-1;
      this.divList[this.lastIndex].setAttribute("data-active", "true");

      // update the info shown
      this.updatePresentation();

      // update the space list if needed
      if (this.name == "spaces") {
        paramEditor.updateSpaceList();
      }    

      this.listPanel.scrollTop = this.divList[this.lastIndex].offsetTop;
    }
  }

  /**
   *
   */
  paramEditor.PanelListEdit.prototype.removeElement = function() {
    var libraryModification = false;

    if (this.divList.length > 0) {
      // deactivate element
      this.divList[this.lastIndex].setAttribute("data-active", "false");

      // remove element from the dom list
      this.divList[this.lastIndex].parentNode.removeChild(this.divList[this.lastIndex]);

      libraryModification = this.data[this.name][this.lastIndex].data.type === "library";

      // move elements
      for (var i=this.lastIndex, l=this.divList.length-1; i<l; i++) {
        this.divList[i] = this.divList[i+1];
        this.divList[i].index = i;
        this.data[this.name][i] = this.data[this.name][i+1];
      }

      this.divList.pop();
      this.data[this.name].pop();

      if (this.lastIndex > this.divList.length-1) {
        this.lastIndex = this.divList.length-1;
      }
    }

    var firstDiv = null;
    for (var i=0, l=this.divList.length; i<l; i++) {
      if (this.divList[i].parentNode) {
        firstDiv = i;
        break;
      }
    }

    if (firstDiv !== null) {
      this.lastIndex = firstDiv;
      this.divList[firstDiv].setAttribute("data-active", "true");
      this.setPanelModelObj(this.lastIndex);
    }
    else {
      this.editPanel.setModelObj({data:{}});
    }

    // update the space list if needed
    if (this.name == "spaces") {
      paramEditor.updateSpaceList();
    }

    // update the library list if needed
    if (libraryModification) {
      paramEditor.updateLibraryList();
    }
  }

  var temp1 = document.createElement("span");
  var temp2 = document.createElement("span");

  /**
   *
   */
  paramEditor.PanelListEdit.prototype.moveLastIndex = function(inc) {
    var swapIndex = this.lastIndex+inc;

    // swap elements in the dom
    this.listPanel.insertBefore(temp1, this.divList[this.lastIndex]);
    this.listPanel.insertBefore(temp2, this.divList[swapIndex]);
    this.listPanel.insertBefore(this.divList[swapIndex], temp1);
    this.listPanel.insertBefore(this.divList[this.lastIndex], temp2);
    this.listPanel.removeChild(temp1);
    this.listPanel.removeChild(temp2);

    // swap elements in the divList
    var tmp = this.divList[swapIndex];
    this.divList[swapIndex] = this.divList[this.lastIndex];
    this.divList[this.lastIndex] = tmp;
    this.divList[swapIndex].index = swapIndex;
    this.divList[this.lastIndex].index = this.lastIndex;

    // swap elements in the model
    tmp = this.data[this.name][swapIndex];
    this.data[this.name][swapIndex] = this.data[this.name][this.lastIndex];
    this.data[this.name][this.lastIndex] = tmp;

    this.lastIndex = swapIndex;
  }

  /**
   *
   */
  paramEditor.PanelListEdit.prototype.moveListElements = function(dir) {
    var lastIndex = this.lastIndex;
    var cond = (dir > 0) ? (lastIndex < this.divList.length-1) : (lastIndex > 0);

    if (cond) {
      var swapIndex = dir;
      while (this.divList[lastIndex+swapIndex].parentNode == null) {
        swapIndex += dir;
        if ( ((lastIndex+swapIndex) < 0) || ((lastIndex+swapIndex) > this.divList.length-1) ) {
          return;
        }
      }

      this.moveLastIndex(swapIndex);
    }

  }

  /**
   *
   */
  paramEditor.PanelListEdit.prototype.updatePresentation = function() {
    var list = this.data[this.name];
    var name;
    var info;
    var useIcons = true;
    for (var i=0, l=this.divList.length; i<l; i++) {
      if (this.name.match(/graphics/i)) {
        name = "<span class='iconSpan' style='-webkit-mask-image:url(css/icons/" + this.name + "/" + list[i].data[this.nameElem] +".svg);'></span>";

        // if contain info show it
        if (list[i].data.info !== '') {
          info = list[i].data.info;
        }
        // if not contain info then show the name
        else {
          if (list[i].data.type == "arc") {
            info = list[i].data.center + "," + list[i].data.radius + "," + list[i].data.init  + "," + list[i].data.end;
          }
          else {
            info = babel.transGUI(babel[list[i].data[this.nameValue].toLowerCase()]);
            if (info === babel.transGUI("undefined")) {
              info = list[i].data[this.nameValue] || "";
            }
          }
        }
        this.divList[i].innerHTML = name + "【" + info + "】";
      }
      else if ( (this.name.match(/definitions/i)) || (this.name.match(/programs/i)) ) {
        name = "<span class='iconSpan' style='-webkit-mask-image:url(css/icons/" + this.name + "/" + list[i].data[this.nameValue] +".svg);'></span>";

        info = (list[i].data[this.nameElem] || "") + ((list[i].data.info) ? (" │ "+list[i].data.info) : "");

        if (list[i].data.type === "library") {
          info = (info === "") ? list[i].data.file : list[i].data.info;
        }

        this.divList[i].innerHTML = name + "【" + info + "】";
      }
      else if (this.name.match(/controls/i)) {
        name = "<span class='iconSpan' style='-webkit-mask-image:url(css/icons/" + this.name + "/" + (list[i].data["gui"] || list[i].data[this.nameValue]) +".svg);'></span>";

        info = (list[i].data[this.nameElem] || "") + ((list[i].data.info) ? (" │ "+list[i].data.info) : "");

        this.divList[i].innerHTML = name + "【" + info + "】";
      }
      else if (this.name.match(/spaces/i)) {
        name = "<span class='iconSpan' style='-webkit-mask-image:url(css/icons/" + this.name + "/" + list[i].data[this.nameValue] +".svg);'></span>";

        info = (list[i].data[this.nameElem] || "") + ((list[i].data.info) ? (" │ "+list[i].data.info) : "");

        this.divList[i].innerHTML = name + "【" + info + "】";
      }

      else {
        this.divList[i].innerHTML = list[i].data[this.nameElem] + "  【" + babel.transGUI(list[i].data[this.nameValue]) + "】";
      }
    }
  }

  /**
   *
   */
  paramEditor.PanelListEdit.prototype.updateSpaceList = function() {
    // get the space list
    var spaceList = this.model.data.spaces;
    var spaceNames = ["*"];

    for (var i=0, l=spaceList.length; i<l; i++) {
      if ( (this.name == "controls") ||
           ((this.name == "graphics") && (spaceList[i].data.type == "R2")) ||
           ((this.name == "graphics3D") && (spaceList[i].data.type == "R3")) 
         ){
        spaceNames.push(spaceList[i].data.id);
      }
    }
    this.setOptions(spaceNames);
  }

  /**
   * 
   */
  paramEditor.PanelListEdit.prototype.updateLibraryList = function() {
    var definitionsList = this.model.data.definitions;
    var libraryNames = ["*", "escena"];

    for (var i=0, l=definitionsList.length; i<l; i++) {
      if (definitionsList[i].data.type === "library") {
        libraryNames.push(definitionsList[i].data.file);
      }
    }
    this.setOptions(libraryNames);
  }
  

  /**
   *
   */
  paramEditor.PanelListEdit.prototype.setModelObj = function(model, resetFilter) {
    if (resetFilter) {
      this.filterValue = "*";
      this.lastIndex = -1;
      this.filterLibraries = false;
    }

    this.setButtonName(babel.transGUI(this.name));

    this.model = model;
    this.data = model.data;
    this.nameElem  = (this.name.match(/graphics/i)) ? "type" : "id";
    this.nameValue = (this.name.match(/graphics/i)) ? "expression" : "type";

    var list  = this.data[this.name];
    this.lastIndex = -1;

    this.createList();

    if (list.length > 0) {
      this.lastIndex = 0;
      this.divList[0].setAttribute("data-active", "true");
      this.setPanelModelObj(0);
    }
    else {
      this.editPanel.setModelObj({data:{}});
    }
  }

  /**
   *
   */
  paramEditor.PanelListEdit.prototype.createList = function() {
    var list  = this.data[this.name];
    var div;
    var self = this;
    var name = this.filterValue;

    this.divList = [];
    this.listPanel.innerHTML = "";

    this.listPanel.addEventListener("scroll", function(evt) {
      var extra_info = document.getElementById("extra_info");
      var target = self.listPanel.querySelector("[data-over=true]");
      if (target) {
        var rect = target.getBoundingClientRect();
        extra_info.style.left = rect.left + "px";
        extra_info.style.top = rect.top + "px";
        extra_info.style.height = rect.height + "px";
      }
    });

    for (var i=0, l=list.length; i<l; i++) {
      div = document.createElement("div");
      div.index = i;

      div.addEventListener("click", function(evt) {
        self.divList[self.lastIndex].setAttribute("data-active", "false");
        self.lastIndex = this.index;
        this.setAttribute("data-active", "true");

        self.setPanelModelObj(this.index);
      });

      div.addEventListener("mouseenter", onMouseEnter);
      div.addEventListener("mouseleave", onMouseLeave);

      this.divList[i] = div;

      if (!this.filterLibraries) {
        if ((name == "*") || (name == list[i].data.space)) {
          this.listPanel.appendChild(div);
        }
      }
      else {
        if (list[i].data.type !== "library") {
          this.listPanel.appendChild(div);
        }
      }
    }

    if (this.lastIndex != -1) {
      if (this.divList[this.lastIndex].parentNode) {
        this.divList[this.lastIndex].setAttribute("data-active", "true");
        this.setPanelModelObj(this.lastIndex);
      }
      else {
        if (this.listPanel.childNodes.length > 0) {
          this.lastIndex = this.listPanel.childNodes[0].index;
          this.divList[this.lastIndex].setAttribute("data-active", "true");
          this.setPanelModelObj(this.lastIndex);
        }
        else {
          this.editPanel.setModelObj({data:{}});
        }
      }
    }

    this.updatePresentation();
  }

  /**
   *
   */
  paramEditor.PanelListEdit.prototype.createListLibrary = function() {
    var list;

    if (this.filterValue === "*") {
      this.filterLibraries = false;
      this.data = this.model.data;
      list = this.data[this.name];
      this.lastIndex = -1;
      this.createList();
      if (list.length > 0) {
        this.lastIndex = 0;
        this.divList[0].setAttribute("data-active", "true");
        this.setPanelModelObj(0);
      }
      else {
        this.editPanel.setModelObj({data:{}});
      }
    }
    else if (this.filterValue === "escena") {
      this.filterLibraries = true;
      this.data = this.model.data;
      list = this.data[this.name];
      this.lastIndex = -1;
      this.createList();

      var firstDiv = null;
      for (var i=0, l=this.divList.length; i<l; i++) {
        if (this.divList[i].parentNode) {
          firstDiv = i;
          break;
        }
      }

      if (firstDiv !== null) {
        this.lastIndex = firstDiv;
        this.divList[firstDiv].setAttribute("data-active", "true");
        this.setPanelModelObj(this.lastIndex);
      }
      else {
        this.editPanel.setModelObj({data:{}});
      }
    }
    else {
      this.filterLibraries = false;

      var newData = null;
      for (var i=0, l=this.model.data.definitions.length; i<l; i++) {
        if (this.model.data.definitions[i].data.file === this.filterValue) {
          newData = this.model.data.definitions[i].data.content;
          break;
        }
      }

      this.data = newData.data;
      this.lastIndex = -1;

      list = this.data[this.name];
      var div;
      var self = this;

      this.divList = [];
      this.listPanel.innerHTML = "";

      this.listPanel.addEventListener("scroll", function(evt) {
        var extra_info = document.getElementById("extra_info");
        var target = self.listPanel.querySelector("[data-over=true]");
        if (target) {
          var rect = target.getBoundingClientRect();
          extra_info.style.left = rect.left + "px";
          extra_info.style.top = rect.top + "px";
          extra_info.style.height = rect.height + "px";
        }
      });
  
      for (var i=0, l=list.length; i<l; i++) {
        div = document.createElement("div");
        div.index = i;
  
        div.addEventListener("click", function(evt) {
          self.divList[self.lastIndex].setAttribute("data-active", "false");
          self.lastIndex = this.index;
          this.setAttribute("data-active", "true");
  
          self.setPanelModelObj(this.index);
        });
  
        div.addEventListener("mouseenter", onMouseEnter);
        div.addEventListener("mouseleave", onMouseLeave);
  
        this.divList[i] = div;
  
        this.listPanel.appendChild(div);
      }
  
      if (this.lastIndex != -1) {
        if (this.divList[this.lastIndex].parentNode) {
          this.divList[this.lastIndex].setAttribute("data-active", "true");
          this.setPanelModelObj(this.lastIndex);
        }
        else {
          if (this.listPanel.childNodes.length > 0) {
            this.lastIndex = this.listPanel.childNodes[0].index;
            this.divList[this.lastIndex].setAttribute("data-active", "true");
            this.setPanelModelObj(this.lastIndex);
          }
          else {
            this.editPanel.setModelObj({data:{}});
          }
        }
      }
  
      if (list.length > 0) {
        this.lastIndex = 0;
        this.divList[0].setAttribute("data-active", "true");
        this.setPanelModelObj(0);
      }
      else {
        this.editPanel.setModelObj({data:{}});
      }
      
      this.updatePresentation();
    }

  }

  /**
   *
   */
  paramEditor.PanelListEdit.prototype.setEditPanel = function(panel) {
    this.editPanel = panel;
  }

  /**
   *
   */
  paramEditor.PanelListEdit.prototype.setPanelModelObj = function(index) {
    this.editPanel.setModelObj(this.data[this.name][index]);
  }


  /**
   *
   */
  function clone(obj, newId) {
    var objClone = new obj.constructor([ { name: "gui", value: obj.data.gui }, { name: "type", value: obj.data.type } ], obj.data.type);

    for (var propName in obj.data) {
      if (obj.data.hasOwnProperty(propName)) {
        // prevent the copy of the content of a library
        if (propName !== "content") {
          objClone.data[propName] = obj.data[propName];
          if (propName == "id") {
            objClone.data[propName] = newId;
          }
        }
      }
    }

    return objClone;
  }

  /**
   *
   */
  paramEditor.PanelListEdit.prototype.getPrefix = function() {
    var prefix = "E";

    if (this.name == "controls") {
      if (this.addTypeValue) {
        prefix = this.addTypeValue.charAt(0);
      }
      else {
        prefix = "n";
      }
    }
    else if (this.name == "definitions") {
      if ((this.addTypeValue == "variable") || (this.addTypeValue == "function")) {
        prefix = this.addTypeValue.charAt(0);
      }
      else if (this.addTypeValue == "array") {
        prefix = "V";
      }
      else if (this.addTypeValue == "matrix") {
        prefix = this.addTypeValue.charAt(0).toUpperCase();
      }
      else if (this.addTypeValue == "library") {
        prefix = "l";
      }
      else {
        prefix = "v";
      }
    }
    else if (this.name == "programs") {
      prefix = "e";
    }

    return prefix;   
  }

  /**
   * 
   */
  function onMouseEnter(evt) {
    var extra_info = document.getElementById("extra_info");
    extra_info.style.display = "block";

    var rect = evt.target.getBoundingClientRect();
    var targetStyle = window.getComputedStyle(evt.target); 

    evt.target.setAttribute("data-over", true);

    extra_info.innerHTML = evt.target.innerHTML;
    extra_info.style.left = rect.left + "px";
    extra_info.style.top = rect.top + "px";
    extra_info.style.height = rect.height + "px";
    extra_info.style.minWidth = targetStyle.width;
    extra_info.style.background = targetStyle["background-color"];
    extra_info.style.color = targetStyle["color"];
    extra_info.setAttribute("data-active", (evt.target.getAttribute("data-active")=="true"));
  }
  function onMouseLeave(evt) {
    document.getElementById("extra_info").style.display = "none";
    evt.target.setAttribute("data-over", false);
  }

  return paramEditor;
})(paramEditor || {});
