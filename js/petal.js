class Petal {
  constructor(id, lotus, serial, currectID) {
    this.id = id;
    this.lotus = lotus;
    this.serial = serial;
    this.currectID = currectID ? currectID : false;
    //this.meshs = meshs ? meshs : [];
    switch (Math.floor(this.serial/2)){
    		case 0: {
          this.direction = "N";
        	break;
    		}
    		case 1: {
          this.direction = "ENE";
    	    break;
    		}
        case 2: {
          this.direction = "ESE";
        	break;
    		}
    		case 3: {
          this.direction = "S";
    	    break;
    		}
        case 4: {
          this.direction = "WSW";
        	break;
    		}
    		case 5: {
          this.direction = "WNW";
    	    break;
    		}
  	}

  }
}
