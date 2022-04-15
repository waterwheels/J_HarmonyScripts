// By Jo
// 2 Mar 2021

// v0.3
// Recursively selects children of selection

function J_select_Children_Recursively () {

  function recursiveSelect(someNodes){ //Thanks Mathieu C and Open Harmony
    var resultNodes = [];
    for (var i in someNodes) {
      var thisNode = someNodes[i];
      resultNodes.push(thisNode);
      if (node.isGroup(thisNode)) {
        resultNodes = resultNodes.concat(recursiveSelect(node.subNodes(thisNode)));
      }
    }
    return resultNodes;
  }

  var initialSelection = selection.numberOfNodesSelected();
  var selectedNodes = recursiveSelect(selection.selectedNodes());
  var netSelection = selectedNodes.length - initialSelection;


  selection.addNodesToSelection(selectedNodes);


  MessageLog.trace("J_select_Children_Recursively: Added " + netSelection + " children of selected nodes to selection")
}
