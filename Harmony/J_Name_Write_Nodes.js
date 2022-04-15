/*
  This script names the movie and image outputs of all the write nodes
  in the scene after the scene name and write node name.
  It strips out "Write" with any combination of capital or lower case W,
  trailing hyphen or underscore, and names the outputs of each write node:

  [scene name]_[write node name without "write"]

  A write node just named "Write" (like the default write) will output
  frames or movies just named after the scene.

*/
function J_Name_Write_Nodes () {
  //VALUES
  var sceneName = scene.currentScene();

  var writeNodes = node.getNodes(["WRITE"]);

  scene.beginUndoRedoAccum("J_Name_Write_Nodes");

  if (writeNodes.length == 0) {
    MessageLog.trace("Scene contains no write nodes");

  } else {
    for (i in writeNodes) {
      const thisNode = writeNodes[i];
      var name = node.getName(thisNode).replace(/^[wW]rite[-_]*/, "");
      if (name.length > 0) name = "_" + name;
      node.setTextAttr(thisNode, "MOVIE_PATH", frame.current(), "frames/" + sceneName + name);
      node.setTextAttr(thisNode, "DRAWING_NAME", frame.current(), "frames/" + sceneName + name + "-");
    }
  }
  scene.endUndoRedoAccum();
}
