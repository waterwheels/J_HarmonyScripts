include("openHarmony.js");

var someNodes = $.scn.selectedNodes;

j_moveKeys(someNodes, 10);


// TODO: step thru oH oNode.linkedColumns call to see what's up

// Move keyframes for a bunch of nodes in the timeline
// Progress is an optional oProgress bar if you want to have one
// Don't worry about substeps, it's for integratign this process into a bigger process
function j_moveKeys(nodes, offset, progress, substeps) {
	if (typeof progress == "undefined") var progress = {value: 0};
	if (typeof substeps == "undefined") var substeps = 100;
	if (typeof offset == "undefined") var offset = $.scn.length;

	beginUndo("Move keyframes");

	log("MOVING KEYFRAMES " + offset + " FRAMES\n");

	// Function to get all the columns, recursively
	function getColumns (nodes) {
		var columns = [];
		for (var i = 0; i < nodes.length; i++) {
			var thisNode = nodes[i];
			var thisNodeColumns = [];

			
			// Loop through all the attibutes in the current node
			var attr = thisNode.attributes;
			for (var iA in attr){
      			thisNodeColumns = thisNodeColumns.concat(attr[iA].getLinkedColumns());
    		}
			columns = columns.concat(thisNodeColumns);

			// If the current node is a group, recurse, running this function on
			// each node the group contains
			if (node.type == "GROUP") {
				columns = columns.concat(getColumns(node.nodes));
			}
		}
		return columns;
	}

	// get all the columns
	var allColumns = getColumns(nodes);
	var seenColumns = {}; // to record what we've seen (there may be duplicates in the array)

	// Map progress to num columns
	// This is so I can pass in an oProgressDialog in the main func I'm using this in
	var perColumnStep = substeps / allColumns.length;
	var subProgress = 0;
	var startprogress = progress.value;

	// Loop through each column
	for (var j = allColumns.length - 1; j >= 0; j--) {
		var thisColumn = allColumns[j];

		// Check if we've done it yet (there might be dupes in allColumns)
		if (!seenColumns.hasOwnProperty(thisColumn.name)) {
			seenColumns[thisColumn.name] = true;

			log("MOVING KEYFRAMES FOR COLUMN " + thisColumn.name);

			// Loop tru all the keys. Store key in temp array, clear the current one
			var thisColumnKeys = thisColumn.keyframes;
			var tempKeys = [];

			for (var k = thisColumnKeys.length - 1; k >= 0; k--) {
				var thisFrame = thisColumnKeys[k];

				// Store a temp copy of the data so we're not overwriting
				var tempFrame = {
					frameNumber: thisFrame.frameNumber,
					value: thisFrame.value,
					ease: thisFrame.ease,
					duration: thisFrame.duration,
				};

				tempKeys.push(tempFrame);


				// thisFrame.isKey = false; // Also doesn't work

				// This is the content of the oFrame.isKey (false) setter. the funcs return true, but the frames remain
				// We need to look at drawing columns ans other columns separately, since we use different funcs to edit them
				if (thisColumn.type == "DRAWING") {
					log("Clearing key at " + thisFrame +
						column.removeKeyDrawingExposureAt(thisFrame.column.uniqueName, thisFrame.frameNumber));
				} else {
					log("Clearing key at " + thisFrame +
						column.clearKeyFrame(thisFrame.column.uniqueName, thisFrame.frameNumber));
				}
				
			}

			// Loop through all the temp keys we created, set them again in new location
			for (var k2 = tempKeys.length - 1; k2 >= 0; k2--) {
				var tempKey = tempKeys[k2];

				// Set the destKey to be a keyframe, with the tempKey's value and ease
				var destKey = thisColumn.frames[tempKey.frameNumber + offset];
				destKey.isKey = true;
				destKey.value = tempKey.value;
				if (tempKey.ease) destKey.ease = tempKey.ease;
				if (thisColumn.type == "DRAWING" && tempKey.value) {
					destKey.extend(tempKey.duration);
				}
			}
		}
		subProgress += perColumnStep;
		progress.value = startprogress + Math.floor(subProgress);

	}
	endUndo();
}

