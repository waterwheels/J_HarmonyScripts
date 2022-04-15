/*

By Jo
23 Nov 2021

v0.3

Returns Key, Name, TypeName and Current Value of each attribute of
the currently selected node

*/


function J_Get_Node_Atributes() {

  function buildAttrList(someNode) {
  /*
  Takes one node, returns a string list of attribues like this:
            "
            Attribute:     ATTRIBUTE NAME
            Keyword:       KEYWORD
            Type:          ATTRIBUTE TYPE
            Current Value: CURRENT VALUE
            "
  */

    var nodeType = node.type(someNode);
    var keywords = node.getAllAttrKeywords(someNode);
    var attrList = [];

    for (i in keywords) {
      var thisKeyword = keywords[i];
      var thisAttr = node.getAttr(someNode, frame.current(), keywords[i]);
  		var thisName = thisAttr.name();
  		var thisTypeName = thisAttr.typeName();
  		var thisValue = node.getTextAttr(someNode, frame.current(),  keywords[i])

      var thisAttrDetails =
        "\nAttribute:     " + thisName + 
        "\nKeyword:       " + thisKeyword + 
        "\nType:          " + thisTypeName + 
        "\nCurrent Value: " + thisValue;

      attrList.push(thisAttrDetails);
    }
    return attrList;
  }

  //SELECTION ERROR CATCHING
  if (selection.numberOfNodesSelected() > 1) {
    // too many nodes selected error dialogue
    MessageLog.trace("Too many nodes selected! Please select only one node!");
  } else if (selection.numberOfNodesSelected() == 0) {
    // no nodes selected error
    MessageLog.trace("No nodes selected! Please choose one node!");
  }

  var thisNode = selection.selectedNode(0);

  MessageLog.trace("BEGIN ATTRIBUTE LIST\Nn" + buildAttrList(thisNode).join("\n\n"));
}
