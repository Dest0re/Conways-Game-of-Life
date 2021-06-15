class PixelGrid {
	constructor(height, width, canvasId, pixelSize=5, parent=document.body) {
		this.height = height;
		this.width = width;
		this.pixelSize = pixelSize;

		this.canvas = document.createElement('canvas');
		this.canvas.height = this.height * this.pixelSize;
		this.canvas.width = this.width * this.pixelSize;
		this.canvas.id = canvasId;
		this.canvas.style.display = "inline-block";
		parent.append(this.canvas);

		this.ctx = this.canvas.getContext("2d");

		this.grid = new Array(this.width);
		for (let i = 0; i < this.width; i++) {
			this.grid[i] = new Array(this.height);
			for (let j = 0; j < this.height; j++) {
				this.grid[i][j] = 0;//xffffff;
			}
		}
	}

	update(customStrokeColor=false) {
		let strokeColor = this.ctx.strokeStyle;

		let fillColor = this.ctx.fillStyle;
		for (let i = 0; i < this.width; i++) {
			for (let j = 0; j < this.height; j++) {
				let hex = this.decToHex(this.grid[i][j]);
				this.ctx.fillStyle = `rgb(${hex[0] * 16 + hex[1]}, ${hex[2] * 16 + hex[3]}, ${hex[4] * 16 + hex[5]})`;
				if (strokeColor == null) {
					this.ctx.fillStyle = `rgb(${hex[0] * 16 + hex[1]}, ${hex[2] * 16 + hex[3]}, ${hex[4] * 16 + hex[5]})`;
				} else {
					this.ctx.strokeStyle = `rgb(${customStrokeColor[0] * 16 + customStrokeColor[1]}, ${customStrokeColor[2] * 16 + customStrokeColor[3]}, ${customStrokeColor[4] * 16 + customStrokeColor[5]})`;
				}
				this.ctx.fillRect(i * this.pixelSize, j * this.pixelSize, (i+1) * this.pixelSize, (j+1) * this.pixelSize);
			}
		}

		this.ctx.fillStyle = fillColor;
		this.ctx.strokeStyle = strokeColor;
	}

	decToHex(dec) {
		let hexNum = new Array(6);

		for (let i = 0; i < 6; i++) {
			hexNum[6 - i - 1] = dec % 16;
			dec = parseInt(dec / 16);
		}

		return hexNum;
	}

	hexToDec(hex) {
		let dec = 0;

		for (let i = hex.length - 1; i >= 0; i--) {
			dec += hex[i] * (16 ** (hex.length - i - 1));
		}

		return dec;
	}
}

let genNumLabel = document.createElement('div');
genNumLabel.style.display = 'inline-block';
genNumLabel.innerText = 'Generation #0';

let genNum = 0;
function step() {
	let buffer = new Array(pixelGrid.grid.length);
	for (let i = 0; i < buffer.length; i++) {
		buffer[i] = pixelGrid.grid[i].slice();
	}

	for (let i = 0; i < buffer.length; i++) {
		for (let j = 0; j < buffer[i].length; j++) {
			let alive = 0;

			for (let x = -1; x <= 1; x++) {
				for (let y = -1; y <= 1; y++) {
					if (!(x == 0 && y == 0)) {
						let x_ = x + i;
						let y_ = y + j;

						if (x_ < 0) {
							x_ = buffer.length + x_;
						}
						if (x_ >= buffer.length) {
							x_ = buffer.length % x_;
						}
						if (y_ < 0) {
							y_ = buffer[i].length + y_;
						}
						if (y_ >= buffer[i].length) {
							y_ = buffer[i].length % y_;
						}

						if (pixelGrid.grid[x_][y_] == 0xFFFFFF) {
							alive++;
						}
					}
				}
			}

			if (alive == 3) {
				buffer[i][j] = 0xFFFFFF;
			} else if (alive == 2 && pixelGrid.grid[i][j] == 0xFFFFFF) {
				buffer[i][j] = 0xFFFFFF;
			} else if (pixelGrid.grid[i][j] != 0) {
				buffer[i][j] = 0;
			}
		}
	}

	pixelGrid.grid = buffer;
	pixelGrid.update();
	genNumLabel.innerText = `Generation #${++genNum}`;
}


let pixelGrid = new PixelGrid(64, 64, "canvas", 10);

let button = document.createElement('input');
button.type = 'button';
button.value = 'Start';
button.style.display = 'inline-block';

let randomButton = document.createElement('input');
randomButton.type = 'button';
randomButton.value = 'Random';
randomButton.style.display = 'inline-block';
randomButton.style.marginLeft = '10px';

let clearButton = document.createElement('input');
clearButton.type = 'button';
clearButton.value = 'Clear';
clearButton.style.display = 'inline-block';
clearButton.style.marginLeft = '10px';

let nextButton = document.createElement('input');
nextButton.type = 'button';
nextButton.value = 'Next';
nextButton.style.display = 'inline-block';
nextButton.style.marginLeft = '10px';

let filenameField = document.createElement('input');
filenameField.type = 'text';
filenameField.placeholder = 'Filename';
filenameField.style.display = 'none';
filenameField.style.marginLeft = '10px';

let saveButton = document.createElement('input');
saveButton.type = 'button';
saveButton.value = 'Save';
saveButton.style.display = 'inline-block';
saveButton.style.marginLeft = '10px';

let openButton = document.createElement('input');
openButton.type = 'file';
openButton.style.display = 'none';

let fakeOpenButton = document.createElement('input');
fakeOpenButton.type = 'button';
fakeOpenButton.value = 'Open';
fakeOpenButton.style.marginLeft = '10px';
fakeOpenButton.style.display = 'inline-block';

let input = document.createElement('input');
input.type = 'range';
input.min = 1;
input.max = 999;
input.value = 800;
input.style.marginLeft = '10px';

let dataBlock = document.createElement('div');
dataBlock.style.display = 'inline-block';
dataBlock.style.marginLeft = '8px';

let buttonBlock = document.createElement('div');
buttonBlock.style.display = 'block';
buttonBlock.style.marginTop = '10px';
buttonBlock.style.marginLeft = '10px';

let speed = 1000 - parseInt(input.value);
let speedLabel = document.createElement('div');
speedLabel.style.display = '';
speedLabel.innerText = `One generation: ${speed}ms`;

dataBlock.append(speedLabel);
dataBlock.append(genNumLabel);
buttonBlock.append(button);
buttonBlock.append(nextButton);
buttonBlock.append(randomButton);
buttonBlock.append(clearButton);
buttonBlock.append(filenameField);
buttonBlock.append(saveButton);
buttonBlock.append(fakeOpenButton);
document.body.append(dataBlock);
document.body.append(buttonBlock);
document.body.append(input);
document.body.append(openButton);


function onClick(e) {
	let x = parseInt((e.pageX - canvas.offsetLeft) / pixelGrid.pixelSize);
	let y = parseInt((e.pageY - canvas.offsetTop) / pixelGrid.pixelSize);

	if (pixelGrid.grid[x][y] == 0xFFFFFF) {
		pixelGrid.grid[x][y] = 0;
	} else {
		pixelGrid.grid[x][y] = 0xFFFFFF;
	}

	pixelGrid.update();
}


pixelGrid.canvas.onmousedown = onClick;
pixelGrid.canvas.ontouchend = onClick;

let interval;
button.onclick = () => {
	speed = 1000 - parseInt(input.value);

	if (button.value == 'Start') {
		interval = setInterval(step, speed);
		button.value = 'Stop';
	} else {
		clearInterval(interval);
		button.value = 'Start';
	}
}

nextButton.onclick = () => {
	step();
}

input.oninput = () => {
	speed = 1000 - parseInt(input.value);
	speedLabel.innerText = `One generation: ${speed}ms`;
	if (button.value == 'Stop') {
		clearInterval(interval);
		interval = setInterval(step, speed);
	}
}

randomButton.onclick = () => {
	for (let i = 0; i < pixelGrid.grid.length; i++) {
		for (let j = 0; j < pixelGrid.grid[i].length; j++) {
			pixelGrid.grid[i][j] = 0;
			if (Math.floor(Math.random() * 5) + 1 == 5) {
				pixelGrid.grid[i][j] = 0xFFFFFF;
			}
		}
	}
	genNum = 0;
	pixelGrid.update();
	genNumLabel.innerText = `Generation #${genNum}`;
}

clearButton.onclick = () => {
	for (let i = 0; i < pixelGrid.grid.length; i++) {
		for (let j = 0; j < pixelGrid.grid[i].length; j++) {
			pixelGrid.grid[i][j] = 0;
		}
	}
	genNum = 0;
	pixelGrid.update();
	genNumLabel.innerText = `Generation #${genNum}`;
}

function downloadFile(blob, filename) {
	let url = window.URL.createObjectURL(blob);

	let a = document.createElement('a');
	a.style.display = 'none';
	a.href = url;
	a.download = filename;

	document.body.append(a);

	a.click()

	window.URL.revokeObjectURL(blob);
	delete a;
}

function saveFile(filename) {
	let arr = new Uint8Array(parseInt((pixelGrid.grid.length * pixelGrid.grid[0].length) / 8));

	let byteCounter = 0;
	let counter = 7;
	let a = 0;
	for (let i = 0; i < pixelGrid.grid.length; i++) {
		for (let j = 0; j < pixelGrid.grid[i].length; j++) {
			arr[byteCounter] += (pixelGrid.grid[i][j] == 0xFFFFFF) * (2 ** counter--);

			if (counter == -1) {
				counter = 7;
				byteCounter++;
			}
		}
	}


	downloadFile(new Blob([arr]), filename);
}

async function openFile() {
	let reader = await openButton.files[0].stream().getReader();
	let {value: chunk, done: readerDone} = await reader.read();
	
	let pixelNum = 0;
	let chunkI = 0;
	pixelGridLen = pixelGrid.grid.length * pixelGrid.grid[0].length;

	while (pixelNum < pixelGridLen) {
		if (!readerDone) {
			let num = chunk[chunkI];
			let bits = (num >>> 0).toString(2);
			if (bits.length != 8) {
				bits = '0'.repeat(8 - bits.length) + bits;
			}
			bits = bits.split('')
			bits.map(Number);

			for (let i = 0; i < 8; i++) {
				if (pixelNum + i >= pixelGridLen) return;
				pixelGrid.grid[parseInt((pixelNum + i) / pixelGrid.grid[0].length)][(pixelNum + i) % pixelGrid.grid.length] = bits[i] * 0xFFFFFF;
			}
			
			if (chunkI == (chunk.length - 1) * 8) {
				chunkI = 0;
				({value: chunk, done: readerDone} = await reader.read());
			} else {
				chunkI++;
			}
		} else {
			for (let i = 0; i < 8; i++) {
				if (pixelNum + i >= pixelGridLen) return;
				pixelGrid.grid[parseInt((pixelNum + i) / pixelGrid.grid[0].length)][(pixelNum + i) % pixelGrid.grid.length] = 0;
			}
		}

		pixelNum += 8;
	}
	pixelGrid.update();
}


saveButton.onclick = () => {
	saveButton.style.display = 'none';
	filenameField.style.display = 'inline-block';

	filenameField.onkeypress = (e) => {
		if (e.key == 'Enter') {
			let filename = (filenameField.value != '' ? filenameField.value : 'data');
			saveFile(filename);

			saveButton.style.display = 'inline-block';
			filenameField.value = '';
			filenameField.onkeypressed = null;
			filenameField.style.display = 'none';
		}
	}
}
openButton.onchange = openFile;


fakeOpenButton.onclick = () => {
	openButton.click();
}


pixelGrid.update();
