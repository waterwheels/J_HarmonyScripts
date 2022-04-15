///	Made by Jo Lombard
//	25/11/2020
//	v1.0

// 	This script opens a file dialog where the user can select an image
//	to brute-force replace all texture colour pots with the selected
//	image

function changePencilTextures() {

	MessageLog.trace("===== BEGINNING changePencilTextures() SCRIPT =====");

	Scene.beginUndoRedoAccum("Change pencil textures");

	var texImage = QFileDialog.getOpenFileName("/", "Choose New Texture Image"); //or set path to local image

	var numChangedTextures = 0;

	var numberOfPaletteLists = PaletteObjectManager.getNumPaletteLists();
	for (var i=0; i < numberOfPaletteLists; i++) {

		//Iterate over palette lists
		var thisPaletteList = PaletteObjectManager.getPaletteListByIndex(i);

		for (var j=0; j < thisPaletteList.numPalettes; j++) {

			//Iterate over the palettes in the list
			var thisPalette = thisPaletteList.getPaletteByIndex(j);
			MessageLog.trace("START " + thisPalette.getName());

			for (var k=0; k<thisPalette.nColors; k++) {

				//Iterate over colours in paleette
				var thisColour = thisPalette.getColorByIndex(k);
				if (thisColour.isTexture) {
						//MessageLog.trace("CHANGED PENCIL TEXTURE " + thisColour.name + " IN " + thisPalette.getName());

						numChangedTextures++;
						thisColour.setTextureFile(texImage);

				}
			}
			// Force set dirty flag so the scene will save the changes
			// by toggling the palette type between texture and colour
			if(thisPalette.isColorPalette()) {
			    thisPalette.setToTexturePalette();
			    thisPalette.setToColorPalette();
			} else if (thisPalette.isTexturePalette ()) {
			    thisPalette.setToColorPalette();
			    thisPalette.setToTexturePalette();
		  	}
		}
	}

	Scene.endUndoRedoAccum();
	MessageLog.trace("Changed " + numChangedTextures + " textures");
	MessageLog.trace("===== changePencilTextures() Complete =====");
}
