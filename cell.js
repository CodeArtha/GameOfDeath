/**
Cell state:
0 = dead (black)
1 = alive (blue)
2 = alive (red)

Cell nextState:
0 = going to die (black)
1 = born (blue)
2 = born (red)
*/

function Cell(c, r, s){
	this.col = c;
	this.row = r;
	this.x = c*scl;
	this.y = r*scl;
	this.state = s;
	this.nextState;
	this.redCount; // neighbouring red cells count
	this.blueCount; // neighbouring blue cells count
	this.totalCount; //neighbours count

	this.show = function(){
		//drawing whole cell in it's current state
		if(this.state == 0){ // dead cell
			if(this.col == 0 || this.col == cols -1  || this.row == 0 || this.row == rows-1){
				// very black border arround gameboard
				fill(0);
			}else{
				// dark gray dead cell
				fill(20);
			}
			rect(this.x, this.y, scl, scl);
		} else if( this.state == 1) { // blue team cell
			blueScore++; //updating blue player's score (aka number of blue cells drawed)
			fill(29, 105, 205);
			rect(this.x, this.y, scl, scl);
		} else if( this.state == 2) { // red team cell
			redScore++; //updating red player's score (aka number of red cells drawed
			fill(234, 28, 33);
			rect(this.x, this.y, scl, scl);
		}

		//drawing indicator square in the center of the cell representing it's next state
		if(show_nextgen_helper){
			if(this.nextState == 0 && this.state == 1){ // next state is dead
				fill(20);
				rect(this.x + (scl/2) - (scl/10), this.y + (scl/2) - (scl/10), scl/5, scl/5);
			} else if (this.nextState == 1) { // next state is blue
				fill(29, 105, 205);
				rect(this.x + (scl/2) - (scl/10), this.y + (scl/2) - (scl/10), scl/5, scl/5);
			} else if (this.nextState == 2) { // next state is red
				fill(234, 28, 33);
				rect(this.x + (scl/2) - (scl/10), this.y + (scl/2) - (scl/10), scl/5, scl/5);
			}
		}

		//writing the number of neighbours in the center of the cells
		if(show_neighbors_count){
			if(this.state == 1 || (this.state == 0 && this.nextState == 1)){
				let r,g,b;
				if(this.nextState == this.state){
					r = 0; g = 0; b = 0;
				} else if (this.nextState == 0){
					r = 200; g = 20; b = 20;
				} else if(this.nextState == 1){
					r = 20; g = 150; b = 20;
				}

				fill(r,g,b);
				textAlign(CENTER,CENTER);
				textSize(12);
				text(this.totalCount, scl * (this.col + 0.5), scl * ( this.row + 0.5));
			}
		}
	}


	/** Rules (from wikipedia):
    Any live cell with fewer than two live neighbours dies (referred to as underpopulation or exposure[1]).
    Any live cell with more than three live neighbours dies (referred to as overpopulation or overcrowding).
    Any live cell with two or three live neighbours lives, unchanged, to the next generation.
    Any dead cell with exactly three live neighbours will come to life.
	+ A cell borns with the same color as the majority of it's neighbours. (This rule has been added to take account of the two players)
	*/
	this.update = function(){
		if(this.col == 0 || this.col == cols - 1 || this.row == 0 || this.row == rows - 1){
			//cells from the border should remain dead at all times
			this.state = 0;
			this.nextState = 0;
		}else{
			[this.blueCount, this.redCount, this.totalCount] = this.countNeighbors();

			if(this.state == 1){
				if(this.totalCount < 2) {
					this.nextState = 0; //cell is alive and will die from underpopulation
				}else if(this.totalCount > 3){
					this.nextState = 0; //cell is alive and will die from overpopulation
				}else if(this.totalCount == 2 || this.totalCount == 3){
					this.nextState = this.state; //cell stays alive
				}
			}else if (this.state == 0) {
				if (this.totalCount == 3) {
					// since the total count is 3 there is always an odd number of cells so there are eighter more blues or more reds. We do not need to handle a tie. If blueCount is bigger than redCount, cell will born blue (nextstate = 1), else it can only mean that redCount is bigger thus cell will be born red (nextstate = 2).
					this.nextState = (this.blueCount > this.redCount) ? 1 : 2;
				}else{
					this.nextState = this.state; //cell is dead and stays dead
				}
			}
		}
	}

	/**
	This function counts the number of neighbouring cells and which player they belong to
	return array(blue player's cells, red player's cells).
	*/
	this.countNeighbors = function(){
		let bc = 0;
		let rc = 0;

		// run trough a 3*3 square arrond the cell
		for( let colOff = -1 ; colOff <= 1 ; colOff++){
			for( let rowOff = -1 ; rowOff <= 1; rowOff++){
				// we only count neighbours so we skip the cell itself
				if(colOff === 0 && rowOff === 0) continue;

				let c = grid[this.col + colOff][this.row + rowOff];
				if(c.state === 1) bc++;
				if(c.state === 2) rc++;
			}
		}
		return [bc, rc, bc+rc];
	}

	this.nextGen = function(){
		this.state = this.nextState;
	}

	/**
	Checks if the x,y coordinates that the player clicked are on the cell.
	Returns true if that's the case.
	*/
	this.isClicked = function(ix, iy){
		//is this cell the one we clicked on
		if(ix >= this.x && ix <= this.x + scl){
			if(iy >= this.y && iy <= this.y + scl) {
				return true;
			}else{return false;}
		}else{return false;}
	}

	this.onClick = function(){
		if(this.state == 0){
			this.state = 1;
		}else{
			this.state = 0;
		}
		// this.update();
		// this.show();
		// updating the cells then drawing them on screen.
		// updating changes the current state to the state stored in NextGen
		for(let r = 0; r < rows; r++){
			for(let c = 0; c < cols; c++){
				grid[c][r].update();
				grid[c][r].show();
			}
		}
	}
}
