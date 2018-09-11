/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  /**
   *
   */
  paramEditor.PanelPrograms = function(type) {
    paramEditor.panelName = "Programs";
    this.container = document.createElement("div"),
    this.container.setAttribute("class", "panel");
    this.components = {};

    // info component
    this.components.info = new paramEditor.LabelTextfield("info", 100, "");
    this.container.appendChild(this.components.info.domObj);

    // id component
    this.components.id = new paramEditor.LabelTextfield("id", 30, "");
    this.container.appendChild(this.components.id.domObj);

    // condition component
    this.components.condition = new paramEditor.LabelTextfield("condition", 65, "");
    this.container.appendChild(this.components.condition.domObj);

    // action component
    this.components.action = new paramEditor.LabelMenu("action", 52, ["", "calculate", "openURL", "openScene", "init", "clear", "animate", "initAnimation", "playAudio"], "");
    this.container.appendChild(this.components.action.domObj);

    // execution component
    this.components.execution = new paramEditor.LabelMenu("execution", 44, ["onlyOnce", "alternate", "always"], "onlyOnce");
    this.container.appendChild(this.components.execution.domObj);

    // parameter component
    this.components.parameter = new paramEditor.LabelTextfieldCode("parameter", 100, "");
    this.container.appendChild(this.components.parameter.domObj);

    this.components.equalsign = { domObj: document.createElement("span") };
    this.components.equalsign.domObj.innerHTML = " = ";
    this.components.equalsign.domObj.setAttribute("style", "display:none; padding-top:15px;");
    this.container.appendChild(this.components.equalsign.domObj);

    // expression component
    this.components.expression = new paramEditor.LabelTextarea("expression", 48, 28, "", true);
    this.container.appendChild(this.components.expression.domObj);

    // evaluate component
    this.components.evaluate = new paramEditor.LabelMenu("evaluate", 33, ["onlyOnce", "always"], "onlyOnce");
    this.container.appendChild(this.components.evaluate.domObj);

    // init component
    this.components.init = new paramEditor.LabelTextfieldCode("init", 100, "");
    this.container.appendChild(this.components.init.domObj);

    // doExpr component
    this.components.doExpr = new paramEditor.LabelTextarea("doExpr", 100, 318, "");
    this.container.appendChild(this.components.doExpr.domObj);

    // whileExpr component
    this.components.whileExpr = new paramEditor.LabelTextfield("whileExpr", 100, "");
    this.container.appendChild(this.components.whileExpr.domObj);

  }

  /**
   *
   */
  paramEditor.PanelPrograms.prototype.setEditPanel = function(panel) {
    this.editPanel = panel;
  }

  /**
   *
   */
  paramEditor.PanelPrograms.prototype.setModelObj = function(objModel) {
    this.objModel = objModel;

    // traverse the values of the components to asign the object model
    for (var propName in this.components) {
      // verify the own properties of the object
      if (this.components.hasOwnProperty(propName)) {
        // show only the attributes of the object
        this.components[propName].domObj.style.display = ( (objModel.data[propName] !== undefined) || ((propName == "equalsign") && (objModel.data.type == "constant")) ) ? paramEditor.displayProperty : "none";

        // verify the own properties of the object
        if ((this.components[propName].setModelObj) && (objModel.data[propName] !== undefined)) {
          this.components[propName].setModelObj(objModel.data, this.editPanel);
        }
      }
    }
  }

  return paramEditor;
})(paramEditor || {});