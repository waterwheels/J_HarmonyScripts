// By Jo
// 24 Mar 2021

// v0.6
// select a bunch of nodes, this lets you choose from existing function columns
// or make your own, and links all drawing nodes selected LW mult functions to
// the selection function

// filters out all columns with ":" in their names (ie all the columns that are
// part of other nodes)

function J_Link_LW_to_Existing_Function() {

  function findColons(string) {
    var len = string.length;
    for (i = 0; i < len; i++) {
      if (string.charAt(i) == ":") {
        return true;
      }
    }
    return false;
  }

  function getFunctionColumns() {
    var functionColumns = [];
    for (columnIndex = 0; columnIndex < column.numberOf(); columnIndex++) {
      var thisColumn = column.getName(columnIndex);
      if (column.type(thisColumn) == "BEZIER" || column.type(thisColumn) == "EASE") {
        var thisName = column.getDisplayName(thisColumn);
        if (!findColons(thisName)) {
          functionColumns.push(column.getDisplayName(thisColumn));
        }
      }
    }
    return functionColumns;
  }

  Scene.beginUndoRedoAccum("Link LW Function");

  var functionColumns = getFunctionColumns();
  functionColumns.unshift("New");

  var chosenFunction = Input.getItem("Which function?", functionColumns);

  if (chosenFunction) {
    if (chosenFunction == "New") {
      chosenFunction = "LW_" + Input.getText("New column name: LW_ + ___", "new", "Name");
      chosenFunction = chosenFunction.replace(/ /g, "_");
      column.add(chosenFunction, "BEZIER");
    }
    for (var selection_index = 0;
         selection_index < selection.numberOfNodesSelected();
         selection_index++) {
      var currentNode = selection.selectedNode(selection_index);
      if (node.type(currentNode) == "READ") {
        node.unlinkAttr(currentNode, "multLineArtThickness");
        node.linkAttr(currentNode, "multLineArtThickness", chosenFunction);
        node.setTextAttr(currentNode, "adjustPencilThickness", 0, "Y")
      }
    }
  }
  Scene.endUndoRedoAccum();
}
