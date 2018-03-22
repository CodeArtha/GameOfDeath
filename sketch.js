let cols = 15;
let rows = 15;
let scl = 20;
let btns = [];
let grid = [];
let show_nextgen_helper = true;
let show_neighbors_count = false;
let blueScore, redScore;
let drawFrameRate = 30;
let updateFrameRate = drawFrameRate / 1;
let frameCounter = updateFrameRate;
// let framesToPlay = -1;
let framesToPlay = 1;

function setup() {
	//creating the frame in which everything will be drown.
	//createCanvas((cols * scl) + btnWidth + scl, rows * scl);
	// Adding the canvas to a htm div element as to better style it
	let myCanvas = createCanvas(cols * scl, rows * scl);
	myCanvas.parent("gameboard");
	document.getElementById("gameboard").style.width = width;
	document.getElementById("gameboard").style.height = height;
	document.getElementById("gameWrapper").style.width = width;
	document.getElementById("gameWrapper").style.height = height;
	document.getElementById("defaultCanvas0").classList.add("rounded");
	document.getElementById("pageWrapper").style.width = width + 24;

	// number of times per second the function draw() is called
	frameRate(drawFrameRate);

	//adding buttons to HTML page
	for (let i = 0; i < btns.length; i++) {
		btns[i].showHTML();
	}

	//Button(lbl, fct, type, status, posX, posY, w, h)

	//initialisation of the game grid in memory and filling it with random cells.
	initGrid();
	randomGrid();
}

function draw() {
	frameCounter++;
	if(frameCounter >= updateFrameRate && framesToPlay != 0){
		if (framesToPlay > 0) {
			framesToPlay--;
		}

		frameCounter = 0;
		blueScore = 0;
		redScore = 0;
		// updating the cells then drawing them on screen.
		// updating evaluates what nextState will be, but doesn't apply it
		for(let r = 0; r < rows; r++){
			for(let c = 0; c < cols; c++){
				grid[c][r].update();
				grid[c][r].show();
			}
		}

		//draws the score on top of the board
		fill(150);
		textAlign(CENTER,CENTER);
		textSize(15);
		text("Blue score: " + blueScore, scl * cols * 0.25, 0.6 * scl);
		text("Red score: " + redScore, scl * cols * 0.75, 0.6 * scl);


		// applies state of cells in next generation
		// warning: can't be added to the loop responsible for updating and drawing the cells
		// or else neighbour count will be off.
		for(let r = 0; r < rows; r++){
			for(let c = 0; c < cols; c++){
				grid[c][r].nextGen();
			}
		}
	}
}

function initGrid(){
	for(let c = 0; c < cols; c++){
		grid[c] = [];
	}
}

function randomGrid(density = 0.3){
	for(let r = 0; r < rows; r++){
		for(let c = 0; c < cols; c++){
			if(random() <= density){
				let color = (random() > 0.5) ? 1 : 2;
				//have to add empty cells on the borders and can't do for(1 to row -1) else there is just no cell
				if(!(r == 0 || c == 0 || c == cols - 1 || r == rows - 1)){
					grid[c][r] = new Cell(c, r, color);
				}else {
					grid[c][r] = new Cell(c, r, 0);
				}
			}else{
				grid[c][r] = new Cell(c, r, 0);
			}
		}
	}
}

function symetricGrid(density = 0.3){

}

function mouseClicked(){
	//sending signal to all buttons
	for (let i = 0; i < btns.length; i++) {
		if(btns[i].isClicked(mouseX, mouseY)){
			console.log("Button "+ i + " clicked.");
			btns[i].onClick();
			break;
		}
	}
	//sending signal to all cells except borders
	//sending to borders don't break anything as
	//a border born will be killed before the next tick
	for(let r = 1; r < rows - 1; r++){
		for(let c = 1; c < cols - 1; c++){
			if(grid[c][r].isClicked(mouseX, mouseY)){
				console.log("cell "+c+", "+r+" clicked");
				grid[c][r].onClick();
				break;
			}
		}
	}
}

function grid2string(){
	let str = '';

	// To save space we don't convert the border cells that are always dead.
	for(let r = 1; r < rows - 1; r++){
		for(let c = 1; c < cols - 1; c++){
			console.log(r+","+c);
			str = str + grid[c][r].state;
		}
	}

	return str;
}

// Button actions functions
function resetGrid(){
	console.log("new random grid");
	grid = null;
	grid = [];
	initGrid();
	randomGrid();
}

function toggleAutoplay(){
	if (framesToPlay < 0) {
		framesToPlay = 0; //pause game auto next gen
	} else if (framesToPlay >= 0) {
		framesToPlay = -1; //set the game to auto forward generations
	}
}

function forwardNextGen(){
	framesToPlay = 1;
}

function toggleHelperSquare(){
	show_nextgen_helper = !show_nextgen_helper;
}

function toggleNCount(){
	show_neighbors_count = !show_neighbors_count;
}
