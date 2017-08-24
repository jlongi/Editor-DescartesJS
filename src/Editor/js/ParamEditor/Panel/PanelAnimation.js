/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  /**
   *
   */
  paramEditor.PanelAnimation = function(type) {
    var self = this;
    paramEditor.panelName = "Animation";
    this.container = document.createElement("div"),
    this.container.setAttribute("class", "panel");
    this.components = {};

    // info component
    this.components.info = new paramEditor.LabelTextfield("info", 100, "");
    this.container.appendChild(this.components.info.domObj);

    // useAnimation component
    this.components.useAnimation = new paramEditor.LabelCheckbox("useAnimation", 22, false);
    this.container.appendChild(this.components.useAnimation.domObj);
    
    this.components.useAnimation.checkbox.addEventListener("change", function(evt) {
      self.enableElements(this.checked);
    });

    // delay component
    this.components.delay = new paramEditor.LabelTextfield("delay", 40, "");
    this.container.appendChild(this.components.delay.domObj);

    // // controls component
    // this.components.controls = new paramEditor.LabelCheckbox("controls", false);
    // this.container.appendChild(this.components.controls.domObj);

    // auto component
    this.components.auto = new paramEditor.LabelCheckbox("auto", 15, false);
    this.container.appendChild(this.components.auto.domObj);

    // loop component
    this.components.loop = new paramEditor.LabelCheckbox("loop", 15, false);
    this.container.appendChild(this.components.loop.domObj);

    // init component
    this.components.init = new paramEditor.LabelTextfieldCode("init", 100, "");
    this.container.appendChild(this.components.init.domObj);

    // doExpr component
    this.components.doExpr = new paramEditor.LabelTextarea("doExpr", 100, 303, "");
    this.container.appendChild(this.components.doExpr.domObj);

    // whileExpr component
    this.components.whileExpr = new paramEditor.LabelTextfield("whileExpr", 100, "");
    this.container.appendChild(this.components.whileExpr.domObj);
  }

  /**
   *
   */
  paramEditor.PanelAnimation.prototype.enableElements = function(checked) {
    if (checked) {
      this.components.info.enable();
      this.components.delay.enable();
      this.components.auto.enable();
      this.components.loop.enable();
      this.components.init.enable();
      this.components.doExpr.enable();
      this.components.whileExpr.enable();
    }
    else {
      this.components.info.disable();
      this.components.delay.disable();
      this.components.auto.disable();
      this.components.loop.disable();
      this.components.init.disable();
      this.components.doExpr.disable();
      this.components.whileExpr.disable();
    }
  }

  /**
   *
   */
  paramEditor.PanelAnimation.prototype.setEditPanel = function(panel) {
    this.editPanel = panel;
  }

  /**
   *
   */
  paramEditor.PanelAnimation.prototype.setModelObj = function(objModel) {
    this.objModel = objModel;

    // traverse the values of the components to asign the object model
    for (var propName in this.components) {
      // verify the own properties of the object
      if (this.components.hasOwnProperty(propName)) {
        // show only the attributes of the object
        this.components[propName].domObj.style.display = (objModel.data[propName] !== undefined) ? paramEditor.displayProperty : "none";

        // verify the own properties of the object
        if ((this.components[propName].setModelObj) && (objModel.data[propName] !== undefined)) {
          this.components[propName].setModelObj(objModel.data, this.editPanel);
        }
      }
    }

    this.enableElements(this.components.useAnimation.checkbox.checked);
  }

  return paramEditor;
})(paramEditor || {});
