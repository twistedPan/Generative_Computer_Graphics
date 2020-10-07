let widthW = window.innerWidth;
let heightW = window.innerHeight;
let widthS = screen.width;
let heightS = screen.height;

let osc;
let fft;
let mic;

let mic_AverageAmp = 0;
let micValsum = 0;
let volumeText = 0;
let t_counter = 0;

let test = false;
let amplitudes_Saved = false;
let gotAverage = false;
let recordingRoom = false;
let colorChanged_flag = false;


let colors1 = ['#319E0A','#7A7DEB','#87EB63','#EB7F4B','#9E5B3A'];
let colors2 = ['#F0EF97','#A3A35F','#A356A1','#67F090','#4EA368'];
let colors3 = ['#FA9939','#4B41FF','#49D6DE','#60F55D','#E0D784'];
let colors4 = ['#ffffff','#cccccc','#999999','#737373','#404040','#d9d9d9','#a6a6a6'];
let all_colors = [
    ['#319E0A','#7A7DEB','#87EB63','#EB7F4B','#9E5B3A'],
    ['#F0EF97','#A3A35F','#A356A1','#67F090','#4EA368'],
    ['#FA9939','#4B41FF','#49D6DE','#60F55D','#E0D784'],
    ['#ffffff','#cccccc','#999999','#737373','#404040','#d9d9d9','#a6a6a6'],
];
let elements = [];
let savedMicValues = [];

let randomColorIndex = Math.floor(Math.random()*all_colors.length);

//===============================================================================
//  ------------------------------- CLASSES ---------------------------------
//===============================================================================
class Element {
    constructor(_x, _y, _d, _shape) {
        this.x = _x;
        this.y = _y;
        this.diameter = _d;
        this.shape = _shape;
        this.speed = random(0.01,2);
        this.maxRad = 100;
        this.color = random(all_colors[randomColorIndex]);
        //this.color = random(colors2);
        this.closest_Nbr = 0;
        this.distToNbr = 0;
    }
    display(s) {
        //stroke(this.color)
        fill(this.color)
        switch(this.shape) {
            case "circle": {
                ellipse(this.x,this.y,this.diameter);
                break;
            }
            case "rectangle": {
                rect(this.x-this.diameter/2, this.y-this.diameter/2, this.diameter, this.diameter);
                break;
            }
            case "triangle": {
                easyTri(this.x-this.diameter/2, this.y-this.diameter/2, this.diameter);
                break;
            }
            default: {
                easyTri(this.x,this.y,this.diameter);
                break;
            }
        }
        if(test){
            fill(255);
            noStroke();
            text(this.nr, this.x-10,this.y+20)
            text(this.closest_Nbr.nr, this.x+10,this.y+20)
            noFill();
        }
    }

    move() {
        // fly around
        this.y += this.speed;
        if (this.y >= height) {
            this.y = -10;
            this.x = random(0,width);
        }
    }

    wobble(input) {
        // grow in size
        this.diameter += input/100;
        //this.diameter += this.speed;
    }

}

//===============================================================================
//  ------------------------------- SETUP ---------------------------------
//===============================================================================
function setup() {
    createCanvas(widthW, heightW);
    frameRate(30)
    textSize(10)
    noStroke();
    rectMode(CENTER)
    mic = new p5.AudioIn()
    mic.start();
    
    fft = new p5.FFT();
    fft.setInput(mic);

    let radius = 66;
    for (let i=0; i<16; i++, radius+=66) {
        elements[i] = [0];
        let circleArr = pointsOnCircle(0,0,0,radius,64);
        for (let j=0; j<64; j++) {
            elements[i][j] = new Element(circleArr[j].x,circleArr[j].y,5,"circle")
        }
        
    }
}

//===============================================================================
//  ------------------------------- DRAW ---------------------------------
//===============================================================================
function draw() {
    background(10,10,10,10);
    //stroke(255);
    strokeWeight(1)
    fill(255);
    translate(width/2, height/2);

    let s = second();
    let vol = mic.getLevel();
    let volEx = vol*10_000;

    let spectrum = fft.analyze();
    let waveform = fft.waveform();
    let bass = fft.getEnergy( "bass" );
    let treble = fft.getEnergy( "treble" );
    let mid = fft.getEnergy( "mid" );     
    let custom = fft.getEnergy( 100, 200 );

    for (let i=0, d=0; i<elements.length; i++) {
        for (let j = 0; j < elements[i].length; j++, d++) {
            elements[i][j].diameter = spectrum[d];
        }
    }


    // get mic amplitudes of n frames
    if (!amplitudes_Saved) getRoomNoise(frameCount, volEx);
    // calc the average mic amplitude
    if(amplitudes_Saved && !gotAverage) {
        for (let i = 0; i < savedMicValues.length; i++) micValsum += savedMicValues[i];
        mic_AverageAmp = micValsum / savedMicValues.length;
        console.log("Average Amp",mic_AverageAmp)
        gotAverage = true;
    } 

    // create map for no sound(micAverageAmp) and full sound(??? 500) from -n to n
    let micMap = map(volEx, mic_AverageAmp, 500, 0, 500);


    
    elements.forEach(i => {
        i.forEach(e => {
            e.display(s);
            //console.log(e)
        })
    })


    // change color every n seconds
    let colorTimer = 8
    randomColorIndex = Math.floor(s/colorTimer % (all_colors.length));
    if (randomColorIndex == s/colorTimer % all_colors.length) {
        
        if (!colorChanged_flag) {
            elements.forEach(i => {
                i.forEach(e => {
                    e.color = random(all_colors[randomColorIndex])
                })
            })
        }
        
        colorChanged_flag = true;
    } 
    else colorChanged_flag = false;


    if (test) {
        if(frameCount % 10 == 0) volumeText = volEx;
        text(Math.floor(volumeText*1000)/1000,10,30);
        rect(width/2 + micMap, height-60, 10,50);
    }


    if (keyIsDown(73)) { // i = info
        //console.log("Audio In Ex:",volEx);
        //console.log("micMap:",micMap);
        console.log("elements:",elements);
    }

/* 
    noStroke();
    textSize(10)
    for (let i = 0; i < e_combo.length; i++) {
        fill(elements[i].color)
        ellipse((elements[i].x+elements[i].y)/2, (elements[i].x+elements[i].y)/2,10)
        text(elements[i].nr, (elements[i].x+elements[i].y)/2 -10 ,(elements[i].x+elements[i].y)/2 + 30)
    } 
*/


    //noLoop();
} // END OF DRAW


//===============================================================================
//  ------------------------------- FUNCTIONS ---------------------------------
//===============================================================================

// return array of points on cirlce
function pointsOnCircle(x,y,z,radius,points) {
    let coords = [];
    let slice = 2 * Math.PI / points;
    for (let i = 0; i < points; i++) {
        let angle = slice * i;
        coords.push({
            x : x + Math.sin(angle) * radius, 
            y : y + Math.cos(angle) * radius,
            z : z})
    }
    return coords;
}

// records every 5 seconds for 1second the room noise
function getRoomNoise(micInput) {

    // start recording room noise
    if (t_counter == 0) {
        recordingRoom = true;
        amplitudes_Saved = false;
        gotAverage = false;
    }

    // reset counter every 5 secs 
    if (t_counter >= 5){
        //console.log("Amps saved")
        t_counter = 0;
    }

    // record room for 1 sec
    if (recordingRoom && t_counter <= 1) {
        saveRoomNoise(micInput);
    }
    else // stop recording after 1 sec
    {
        amplitudes_Saved = true;
        recordingRoom = false;
    }
}
function saveRoomNoise(micInput) {
    savedMicValues.push(micInput);
}


function easyTri(x,y,nr) {
    triangle(x,y, x+nr/2,y+(Math.sqrt(3)/2)*nr, x-nr/2,y+(Math.sqrt(3)/2)*nr);
}

// Random Color
function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


Number.prototype.fl = function(){return Math.floor(this)}
Array.prototype.rngValue = function(){return this[Math.floor(Math.random() * this.length)]}
function rndTo(nr,decimals) {return Math.floor(nr*decimals)/100;}