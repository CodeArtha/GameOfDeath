let cfg = new Config();
let btns = [];
let grid = [];
let score;
let updateFrameRate = cfg.drawFrameRate / 1;
let frameCounter = updateFrameRate;
// let framesToPlay = -1;
let framesToPlay = 1;

function setup() {
	//creating the frame in which everything will be drown.
	//createCanvas((cols * scl) + btnWidth + scl,rows * scl);
	// Adding the canvas to a htm div element as to better style it
	// set the size of the HTML div to the canvas size to get correct centering
	let myCanvas = createCanvas(cfg.cols * cfg.scl, cfg.rows * cfg.scl);
	myCanvas.parent("gameboard");
	document.getElementById("gameboard").style.width = width;
	document.getElementById("gameboard").style.height = height;
	document.getElementById("gameWrapper").style.width = width;
	document.getElementById("gameWrapper").style.height = height;
	document.getElementById("defaultCanvas0").classList.add("rounded");
	document.getElementById("pageWrapper").style.width = width + 24;

	// number of times per second the function draw() is called
	frameRate(cfg.drawFrameRate);

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
		score = 0;
		// updating the cells then drawing them on screen.
		// updating evaluates what nextState will be, but doesn't apply it
		for(let r = 0; r < cfg.rows; r++){
			for(let c = 0; c < cfg.cols; c++){
				grid[c][r].update();
				grid[c][r].show();
			}
		}

		//draws the score on top of the board
		fill(150);
		textAlign(CENTER,CENTER);
		textSize(15);
		text("Score: " + score, cfg.scl * cfg.cols * 0.5, 0.5 * cfg.scl);

		// applies state of cells in next generation
		// warning: can't be added to the loop responsible for updating and drawing the cells
		// or else neighbour count will be off.
		for(let r = 0; r < cfg.rows; r++){
			for(let c = 0; c < cfg.cols; c++){
				grid[c][r].nextGen();
			}
		}
	}
}

function initGrid(){
	for(let c = 0; c < cfg.cols; c++){
		grid[c] = [];
	}
}

function randomGrid(density = 0.3){
	for(let r = 0; r < cfg.rows; r++){
		for(let c = 0; c < cfg.cols; c++){
			if(random() <= density){
				let color = (random() > 0.5) ? 1 : 2;
				//have to add empty cells on the borders and can't do for(1 to row -1) else there is just no cell
				if(!(r == 0 || c == 0 || c == cfg.cols - 1 || r == cfg.rows - 1)){
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
	//sending signal to all cells except borders
	//sending to borders don't break anything as
	//a border born will be killed before the next tick
	for(let r = 1; r < cfg.rows - 1; r++){
		for(let c = 1; c < cfg.cols - 1; c++){
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
	for(let r = 1; r < cfg.rows - 1; r++){
		for(let c = 1; c < cfg.cols - 1; c++){
			str = str + grid[c][r].state.toString();
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
	cfg.show_nextgen_helper = !cfg.show_nextgen_helper;
}

function toggleNCount(){
	cfg.show_neighbors_count = !cfg.show_neighbors_count;
}
