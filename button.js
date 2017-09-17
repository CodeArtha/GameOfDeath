/* lbl = text displayed in the Button
 * fct = name of the function to be executed when clicked
 * type = eighter toggle or flash
 * state = 1 or 0 if it starts as active or inactive
 */
function Button(lbl, fct, type, state, posX, posY, w, h){
    this.lbl = lbl;
    this.fct = fct;
    this.typ = type;
    this.state = state;
    this.xmin = posX;
    this.xmax = posX + w;
    this.w = w;
    this.ymin = posY;
    this.ymax = posY + h;
    this.h = h;
	this.wait = -1; // set to a higher value to wait a few frames before going back in color for the flash mode


    this.show = function(){
		//decreasing wait time then going back to previous state for flashing buttons
		if(this.wait > 0){
			this.wait = this.wait -1;
		}
		if(this.wait == 0){
			this.wait = -1;
			this.state = !this.state;
		}

		//drawing the button
        if(this.state == 1){
            fill(0, 204, 0);
        }else if(this.state == 0){
            fill(204, 0, 0);
        }
        rect(this.xmin, this.ymin, this.w, this.h, btnRad);

		//drawing text over it
		fill(0, 0, 150);
		textSize(20);
		textAlign(CENTER, CENTER);
		text(lbl, this.xmin + 0.5*btnWidth, this.ymin + 0.5*btnHeight);
    }

    this.onClick = function() {
        if(this.typ == "toggle"){
            window[this.fct]();
            this.state = !this.state;
            this.show();
        }
        if(this.typ == "flash"){
            window[this.fct]();
            this.state = !this.state;
			this.wait = 3; //wait three frames before going back to previous state.
            this.show();
        }
    }

    this.isClicked = function(ix, iy){
		return (ix >= this.xmin &&
                ix <= this.xmax &&
                iy >= this.ymin &&
                iy <= this.ymax) ? true : false;
	}
}
