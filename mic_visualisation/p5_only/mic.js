let osc;
let fft;
let mic;
let ampMic;

var widthW = window.innerWidth;
var heightW = window.innerHeight;
var widthS = screen.width;
var heightS = screen.height;


let mic_AverageAmp = 0;
let micValsum = 0;
let elementNr = 0;
let volumeText = 0;

let test = false;
let amplitudes_Saved = false;
let gotAverage = false;
let ele_Radius_Flag = true;


let colors1 = ['#319E0A','#7A7DEB','#87EB63','#EB7F4B','#9E5B3A'];
let colors2 = ['#59D9FF','#4EDEA0','#76F563','#DEE089','#FACE3E'];
let colors3 = ['#FA9939','#4B41FF','#49D6DE','#60F55D','#E0D784'];
let colors4 = ['#ffffff','#cccccc','#999999','#737373','#404040','#d9d9d9','#a6a6a6'];
let all_colors = [
    ['#319E0A','#7A7DEB','#87EB63','#EB7F4B','#9E5B3A'],
    ['#59D9FF','#4EDEA0','#76F563','#DEE089','#FACE3E'],
    ['#FA9939','#4B41FF','#49D6DE','#60F55D','#E0D784'],
];

let elements = [];
let savedMicValues = [];


//===============================================================================
//  ------------------------------- CLASSES ---------------------------------
//===============================================================================
class Element {
    constructor(_x, _y, _d, _shape) {
        this.nr = elementNr++;
        this.x = _x;
        this.y = _y;
        this.diameter = _d;
        this.shape = _shape;
        this.speed = random(0.01,2);
        this.maxRad = 100;
        this.color = random(colors3);
        this.closest_Nbr = 0;
        this.distToNbr = 0;
    }
    display(input,seconds) {
        stroke(this.color)
        //fill(this.color)
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

    popping() {
        // pop with effect and relocate yourself
        this.x = random(0,width);
        this.y = random(0,height);
        this.diameter = 0;
        this.searchNearestNeighbor();
    }

    shrinking() {
        if (this.diameter <= 0) {
            this.x = random(0,width);
            this.y = random(0,height);
            this.diameter = 0;
            this.speed = random(0.01,2);
            this.searchNearestNeighbor();
        } else {
            this.diameter -= this.speed;
        }
    }

    popAtTouche(behaviour) {
        // check if bubble touches other bubble
        this.searchNearestNeighbor();
        if (this.diameter/2 + this.closest_Nbr.diameter/2 >= this.distToNbr) {
            console.log("this.r",this.diameter, " nbr.r",this.closest_Nbr.diameter, " a+b ",this.diameter + this.closest_Nbr.diameter)
            if (this.diameter > this.closest_Nbr.diameter) {
                this.popping(); // pop
                //this.speed = this.closest_Nbr.speed; this.shrinking()
            }
            else {
                this.closest_Nbr.popping(); // pop'em
                //this.closest_Nbr.speed = this.speed; this.closest_Nbr.shrinking()
            }
        }
    }

    searchNearestNeighbor() {
        // search your neighbor
        let distance = 99999;
        for (let i = 0; i < elements.length; i++) {
            let temp = dist(this.x,this.y,elements[i].x,elements[i].y);
            if (temp < distance && temp != 0) {
                distance = temp;
                this.closest_Nbr = elements[i];
            }
        }
        this.distToNbr = distance;
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
    mic = new p5.AudioIn()
    mic.start();

    for (let i = 0; i<=40; i++) {
        elements.push(new Element(random(0,width),random(0,height),random(4,40),"circle"))
    }
    elements.sort((a, b) => {return (a.x) - (b.x);})
    
    elements.forEach(e => {
        let nearest_Ele = 0;
        let distance = 99999;
        for (let i = 0; i < elements.length; i++) {
            let temp = dist(e.x,e.y,elements[i].x,elements[i].y);
            if (temp < distance && temp != 0) {
                distance = temp;
                nearest_Ele = elements[i];
            }
        }
        e.closest_Nbr = nearest_Ele;
        e.distToNbr = distance;
    })

    console.log(elements);
}

//===============================================================================
//  ------------------------------- DRAW ---------------------------------
//===============================================================================
function draw() {
    background(10,10,10,10);
    stroke(255);
    strokeWeight(1)
    fill(255);
    let s = second();
    let vol = mic.getLevel();
    let volEx = vol*10_000;

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

    if (test) {
        if(frameCount % 10 == 0) volumeText = volEx;
        text(Math.floor(volumeText*1000)/1000,10,30);
        rect(width/2 + micMap, height-60, 10,50);
    }

    noFill();
    elements.forEach(e => {
        e.display(micMap,s);
        e.wobble(micMap);
        //e.popAtTouche();
    });

/* 
    if(frameCount % 100 == 0) {
        elements = [];
        for (let i = 0; i<=100; i++) {
            elements.push(new Element(random(0,width),random(0,height),random(4,40)))
        }
    }
*/

    if (keyIsDown(73)) { // i = info
        console.log("Audio In Ex:",volEx);
        console.log("micMap:",micMap);
        
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

function drawCricleGrid(micValue) {
    
}

function getRoomNoise(frameCount, micInput) {
    if (frameCount <= 100) savedMicValues.push(micInput);
    else {
        console.log("Amps saved")
        amplitudes_Saved = true;
    }
}



function easyTri(x,y,nr) {
    triangle(x,y, x+nr/2,y+(Math.sqrt(3)/2)*nr, x-nr/2,y+(Math.sqrt(3)/2)*nr);
}

// Random Color
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


Number.prototype.fl = function(){return Math.floor(this)}
Array.prototype.rngValue = function(){return this[Math.floor(Math.random() * this.length)]}
function rndTo(nr,decimals) {return Math.floor(nr*decimals)/100;}