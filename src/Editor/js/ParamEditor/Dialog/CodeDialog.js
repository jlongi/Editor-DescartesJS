/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  /**
   *
   */
  paramEditor.CodeDialog = function() {
    var self = this;
    
    this.dialog = document.createElement("dialog");
    this.dialog.setAttribute("style", "width:100%; height:100%; background:rgba(0,0,0,0);");
    
    var container = document.createElement("div");
    container.setAttribute("class", "codeContainer");

    this.textArea = document.createElement("textarea");
    this.textArea.setAttribute("style", "width:100%; height:80%; flex-grow:1; font-family:editorDescartesJS_monospace,monospace; font-size:20px; resize: none; padding:5px; white-space: pre; word-wrap: normal;");

    var btn_div = document.createElement("div");
    var btn_accept = document.createElement("button");
    btn_accept.setAttribute("id", "btn_accept_code");
    btn_accept.innerHTML = "ace";
    var btn_cancel = document.createElement("button");
    btn_cancel.setAttribute("id", "btn_cancel_code");
    btn_cancel.innerHTML = "can";
    btn_div.appendChild(btn_accept);
    btn_div.appendChild(btn_cancel);

    this.dialog.appendChild(container);
    container.appendChild(this.textArea);
    container.appendChild(btn_div);

    document.body.appendChild(this.dialog);

    // add events to the buttons
    btn_accept.addEventListener("click", function(evt) {
      if (self.component) {
        self.changeComponent();
      }
      self.dialog.close();
    });

    btn_cancel.addEventListener("click", function(evt) {
      self.dialog.close();
    });   

    // this.show();
  }

  /**
   *
   */
  paramEditor.CodeDialog.prototype.translate = function() {
    this.dialog.querySelector("#btn_accept_code").innerHTML = babel.transGUI("ok_btn");
    this.dialog.querySelector("#btn_cancel_code").innerHTML = babel.transGUI("cancel_btn");
  }

  /**
   *
   */
  paramEditor.CodeDialog.prototype.setValue = function() {
    var code = "";
    var name = this.component.name;
   
    for (var i=0, l=this.component.data[name].length; i<l; i++) {
      if (
        (this.component.filterValue == "*") || 
        (this.component.data[name][i].data.space == this.component.filterValue) ||
        ((name === "definitions") && (this.component.filterValue !== "*") && (!this.component.filterLibraries))
      ) {
        code = code + this.component.data[name][i].toString() + "\n";
      }

      if ((this.component.filterLibraries) && (this.component.data[name][i].data.type !== "library")) {
        code = code + this.component.data[name][i].toString() + "\n";
      }
    }

    this.oldValue = code;
    this.textArea.value = code;
  }

  /**
   *
   */
  paramEditor.CodeDialog.prototype.changeComponent = function() {
    if (this.oldValue !== this.textArea.value) {
      var name = this.component.name;
      var model = this.component.model;
      var tmpData;
      var tmpLibraries = [];

      // remove all elements in the model
      for (var i=0, l=this.component.data[name].length; i<l; i++) {
        // remove the element in order
        tmpData = this.component.data[name].shift();

        if (tmpData.data.type === "library") {
          tmpLibraries.push(tmpData);
        }

        // if the space name is diferent that the filter value then mantain the value
        if (
          ((this.component.filterValue !== "*") && (tmpData.data.space) && (tmpData.data.space !== this.component.filterValue)) ||
          ((this.component.filterLibraries) && (tmpData.data.type === "library"))
        ) {
          this.component.data[name].push(tmpData);
        }
      }

      var splitCode = this.textArea.value.split("\n");
      var splitCode_i;
      var tmpSplit;
      var tmpType;
      var newModelObj;
      var added;

      for (var i=0, l=splitCode.length; i<l; i++) {
        splitCode_i = splitCode[i];
        added = false;
        if (splitCode_i.trim() !== "") {
          if (name == "spaces") {
            this.component.data[name].push( new paramEditor.ModelSpace(model.split(splitCode_i)) );
          }
          else if (name == "controls") {
            this.component.data[name].push( new paramEditor.ModelControl(model.split(splitCode_i)) );
          }
          else if (name == "definitions") {
            tmpSplit = model.split(splitCode_i);
            tmpType = model.getTypeAux(tmpSplit);
            newModelObj = new paramEditor.ModelDefinition(tmpSplit, tmpType);

            if (tmpType === "library") {
              for (var j=0, k=tmpLibraries.length; j<k; j++) {
                if (tmpLibraries[j].data.file === newModelObj.data.file) {
                  this.component.data[name].push( tmpLibraries[j] );
                  added = true;
                  break;
                }
              }
              if (!added) {
                this.component.data[name].push( newModelObj );
              }
            }
            else {
              this.component.data[name].push( newModelObj );
            }
          }
          else if (name == "programs") {
            tmpSplit = model.split(splitCode_i);
            tmpType = model.getTypeAux(tmpSplit);
            this.component.data[name].push( new paramEditor.ModelProgram(tmpSplit, tmpType) );
          }
          else if (name == "graphics") {
            this.component.data[name].push( new paramEditor.ModelGraphic(model.split(splitCode_i)) );
          }
          else if (name == "graphics3D") {
            this.component.data[name].push( new paramEditor.ModelGraphic3D(model.split(splitCode_i)) );
          }
        }
      }

      // create the new structure in the panelListEdit object
      if ( 
        ((name === "definitions") && (this.component.filterValue !== "*") && (!this.component.filterLibraries)) ||
        (this.component.filterLibraries) ) {
        this.component.createListLibrary();
      }
      else {
        this.component.setModelObj(model);
        paramEditor.updateSpaceList();
        paramEditor.updateLibraryList();
      }
    }
  }

  /**
   *
   */
  paramEditor.CodeDialog.prototype.show = function(component) {
    this.component = component;
    this.setValue();
    this.dialog.showModal();
  }

  return paramEditor;
})(paramEditor || {});
