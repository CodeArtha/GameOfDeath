/* lbl = text displayed in the Button
 * fct = name of the function to be executed when clicked
 * type = eighter toggle or flash
 * state = 1 or 0 if it starts as active or inactive
 */
function Button(lbl, fct, type, state){
	this.id;
    this.lbl = lbl;
    this.fct = fct;
    this.typ = type;
    this.state = state;
    this.wait = -1; // set to a higher value to wait a few frames before going back in color for the flash mode

    // deprecated
    this.show = function(){
		//decreasing wait time then going back to previous state for flashing buttons
		if(this.wait > 0){
			this.wait = this.wait -1;
		}
		if(this.wait == 0){
			this.wait = -1;
			this.state = !this.state;
		}
    }

    this.htmlAdd = function(){
		var p = document.getElementById("controls");
		p.innerHTML = p.innerHTML + '<button type="button" class="btn btn-primary">'+this.lbl+'</button>';
    }

    this.onClick = function() {
        if(this.typ == "toggle"){
            window[this.fct]();
            this.state = !this.state;
        }
        if(this.typ == "flash"){
            window[this.fct]();
            this.state = !this.state;
			this.wait = 3; //wait three frames before going back to previous state.
        }
    }
}
