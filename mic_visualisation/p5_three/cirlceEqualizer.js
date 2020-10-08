import * as THREE from "https://unpkg.com/three@0.120.1/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.120.1/examples/jsm/controls/OrbitControls.js";
//import { GUI } from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';


// THREEJS Values
var myScene = new THREE.Scene();
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({
    canvas,
    //preserveDrawingBuffer: true,
    alpha: true,
});
renderer.setSize( window.innerWidth, window.innerHeight );  // Canvas Size
//renderer.autoClearColor = false;
renderer.setClearColor( "#000000");
document.body.appendChild( renderer.domElement );

// Fog (color, near, far)
//myScene.fog = new THREE.Fog(0xdddddd, 10, 2000);


// Camera
var myCamera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
//var myCamera = new THREE.OrthographicCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
myCamera.position.set( 0, -700, 400 );
myCamera.lookAt( 0, 0, 0 );

// Controlls
var controls = new OrbitControls( myCamera, renderer.domElement );
//controls.update() must be called after any manual changes to the camera's transform
controls.update();


//===============================================================================
//  ------------------------------- LIGHTS ---------------------------------
//===============================================================================

// Lights
const directional_light = new THREE.DirectionalLight( "#0000ff", 0.8);
directional_light.position.set(0, 0, 400);
directional_light.target.position.set(0, 0, 0);
//const helper = new THREE.DirectionalLightHelper(directional_light);
//myScene.add(directional_light);

const point_light = new THREE.PointLight("#ffffff", 1);
point_light.position.set(0,0,300);
const helper = new THREE.PointLightHelper(point_light);
myScene.add(point_light);

//myScene.add(helper);

const skyColor = "#ffffff"; const groundColor = "#ffffff";
const hemisphere_light = new THREE.HemisphereLight( skyColor, groundColor, 0.6);
hemisphere_light.position.set(0,0,-10);
myScene.add(hemisphere_light);



//===============================================================================
//  ------------------------------- CLASSES ---------------------------------
//===============================================================================
class Element {
    constructor(_x, _y, _z, _size, _color) {
        this.x = _x;
        this.y = _y;
        this.z = _z;
        this.vec = new THREE.Vector3( _x, _y, _z);
        this.sX = _size[0];
        this.sY = _size[1];
        this.sZ = _size[2];
        //this.color = _color;
        this.ringIndex = 0; // 0 -> ring number
        this.color = colBW[Math.floor(Math.random() * colBW.length)];
        this.model = 0; // mesh
        this.specFreq = 0; // 0 - 255
    }

    createModel(points) {
        //let cMap = mapRange(this.ringIndex)
        let color = lerpFromTo(fromC, toC, this.ringIndex / (ringCount+lerpBonus))
        this.model = new THREE.Mesh( 
            new THREE.BoxGeometry(this.sX,this.sY,this.sZ),
            new THREE.MeshPhongMaterial( { color: rgbToHex(color) } ) 
        );
/* 
        this.model = new THREE.Line( 
            new THREE.BufferGeometry().setFromPoints( points ), 
            new THREE.LineBasicMaterial( { color: 0xffffff } ) 
        );
*/
        myScene.add(this.model)
    }

    display(inc) {
        let vec3 = new THREE.Vector3(this.x, this.y, this.z);
        this.model.position.set(vec3.x + sin(inc), vec3.y + cos(inc), vec3.z-(this.ringIndex*cos(inc)*5)) //  + this.specFreq
        //this.model.position.set(vec3.x + sin(inc) * (this.ringIndex*20),vec3.y + cos(inc) * (this.ringIndex*20),vec3.z) //  + this.specFreq
    }
}


// Other Values
var micInputOnline = false;
let test = false;
let pitchColor_flag = false;
let elements = [];
let points = [];
let elePerRing = [];
let colBW = ['#ffffff', '#000000'];
let fromC = [255, 0, 204]; // [255, 0, 255]; // 
let toC =   [25, 25, 77]; // [51, 153, 51]; // 
let ringCount = 0;
let inc = 0;
let radius = 20;
let colorTimer = 8;
let colorIndex = 0;
let lerpBonus = 4;
// Nice color: #442443 / rgb(68, 36, 67)


// array of count of elements per ring
for (let i=6, k=0; k<=1024; i+=6, k+=i){
    elePerRing.push(i);
}

// place on every position an Element
for (let i=0; i<18; i++, radius+=20 ) {
    elements[i] = [0]; points[i] = [0]; // create second dimension
    let eleC = elePerRing[i];
    ringCount = i;
    if (i == 17) eleC = 106; // or else it doesn't add up
    let circleArr = pointsOnCircle(0,0,0,radius,eleC);

    for (let j=0; j<eleC; j++) {
        //points[i].push(new THREE.Vector3(circleArr[j].x, circleArr[j].y, 0))
        points[i][j] = new THREE.Vector3(circleArr[j].x, circleArr[j].y, 0);
        elements[i][j] = new Element(circleArr[j].x,circleArr[j].y, 0, [10,10,10], 0x111111)
        elements[i][j].ringIndex = i;
    }
}

// create the threejs models
let eleCount = 0;
elements.forEach(i => {
    i.forEach(e => {
        e.createModel(points[eleCount]);
    })
    eleCount++;
})


// Form
var _cube = new THREE.Mesh( new THREE.BoxGeometry(100,100,100), new THREE.MeshPhongMaterial( { color: 0x00aa00 } ) );

if (test) myScene.add(_cube);




//===============================================================================
//  ------------------------------- SCENE ---------------------------------
//=============================================================================== 
function animate() { 
    requestAnimationFrame( animate );
    //console.log(window.soundValues);
    
    if (typeof window.soundValues != "undefined") {
        micInputOnline = true;
        var spectrum = window.soundValues.spectrum;
        var waveform = window.soundValues.waveform;
        var bass = window.soundValues.bass;
        var mid = window.soundValues.mid; 
        var treble = window.soundValues.treble;
        var micVolEx = window.soundValues.ampAverage;
        var micAmp = window.soundValues.amp;
    }

    if (micInputOnline) {

        let s = second();
        colorIndex = Math.floor(s/colorTimer % ringCount);
        if (colorIndex == s/colorTimer % ringCount) {
            
        }

        // update spectrum values
        for (let i=0, d=0; i<elements.length; i++) {
            for (let j = 0; j < elements[i].length; j++, d++) {
                elements[i][j].specFreq = spectrum[d];
            }
        }

        // change cubes
        elements.forEach(i => {
            i.forEach(e => {
                e.display(inc);

                let clampFreq = clamp(e.specFreq / 10, 5,255);
                
                // corner right bottom back
                //e.model.geometry.vertices[1].z = -e.specFreq/2;
                e.model.geometry.vertices[1].y = clampFreq;
                e.model.geometry.vertices[1].x = clampFreq;
                
                // corner right bottom front 
                //e.model.geometry.vertices[3].z = -e.specFreq/2;
                e.model.geometry.vertices[3].y = -clampFreq;
                e.model.geometry.vertices[3].x = clampFreq;
                
                // corner left bottom back 
                //e.model.geometry.vertices[4].z = -e.specFreq/2;
                e.model.geometry.vertices[4].y = clampFreq;
                e.model.geometry.vertices[4].x = -clampFreq;
                
                // corner left bottom front 
                //e.model.geometry.vertices[6].z = -e.specFreq/2;
                e.model.geometry.vertices[6].y = -clampFreq;
                e.model.geometry.vertices[6].x = -clampFreq;

                // corner top right front 
                e.model.geometry.vertices[2].z = e.specFreq/2;
                
                // corner top right back
                e.model.geometry.vertices[0].z = e.specFreq/2;
                
                // corner top left front
                e.model.geometry.vertices[7].z = e.specFreq/2;
                
                // corner top left back
                e.model.geometry.vertices[5].z = e.specFreq/2;
                

                //e.model.material.color.set("#442443");

                e.model.geometry.verticesNeedUpdate = true;
                //e.model.geometry.colorsNeedUpdate=true
            })
        })

        if (bass > 200) {
            console.log("animate -> bass", bass)
        }
        if (mid > 190) {
            console.log("animate -> mid", mid)
        }
        if (treble > 130) {
            console.log("animate -> treble", treble)
        }

        let bassMap = mapRange(bass, 0,255, 0,18);
        let midMap = mapRange(mid, 0,255, 0,18);
        let trebleMap = mapRange(treble, 0,255, 0,55);
        let bgColor = [bassMap, midMap, trebleMap];
        console.log("animate -> bass", bass, "mid", mid, "treble", treble)
        renderer.setClearColor(rgbToHex(bgColor));
        
        // Test Cube
        if (test) {
            
            _cube.geometry.vertices[0].z = spectrum[0];
            _cube.geometry.vertices[2].z = spectrum[0];
            _cube.geometry.vertices[5].z = spectrum[0];
            _cube.geometry.vertices[7].z = spectrum[0];
            
            let moX = map(mouseX, 0,window.innerWidth, -600,600)
            let moY = map(mouseY, 0,window.innerHeight, -600,600)
            
            _cube.position.x = moX;
            _cube.position.y = -moY;
            
            _cube.geometry.verticesNeedUpdate = true;
            
        }

        //light.target.position.x = mosX
        //light.target.position.z = mosY
    }
    inc += 0.01;


    controls.update();
    renderer.render( myScene, myCamera ); } 
animate();













//===============================================================================
//  ------------------------------- FUNCTIONS ---------------------------------
//===============================================================================

// grid from {-5,-5,-5} to {5,5,5}
function create3DGrid(w,h,d) {
    let grid = []
    for (let i = -w/2; i <= w/2; i++) {
        for (let j = -h/2; j <= h/2; j++) {
            for (let k = -d/2; k <= d/2; k++) {
                grid.push({x:i,y:j,z:k})
                //grid.push(new THREE.Vector3(i,j,k));
            }
        }
    }
    return grid;
}

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


function createSinLine(width,height,count) {
    let a = 0.0;
    let lineCoords = []
    let inc = 2 * Math.PI / count;
    for (let i = 0; i < count; i++) {
        lineCoords.push({
          x1 : i*3, 
          x2 : width, 
          y1 : i*3, 
          y2 : width + Math.sin(a) * height
        })
        a = a + inc;
    }
    return lineCoords;
}



//===============================================================================
//  ------------------------------- HELPER FUNC -------------------------------
//===============================================================================

// KeyPressed Map
const KEYMAP = {}
const keyUpdate = e => {
    KEYMAP[e.code] = e.type === 'keydown'
    //e.preventDefault()
    if (e.type === "keydown") {
        
        if (KEYMAP.Space) {
            if (KEYMAP.Digit1) console.log("Mic Input AMP: ", window.soundValues.amp);
            
            if (KEYMAP.Digit2) console.log("Mic Average AMP: ", window.soundValues.ampAverage);
            
            if (KEYMAP.Digit3) console.log("Bass: ", window.soundValues.bass);
            
            if (KEYMAP.Digit4) console.log("Mid: ", window.soundValues.mid);
            
            if (KEYMAP.Digit5) console.log("Treble: ", window.soundValues.treble);
            
            if (KEYMAP.KeyT) {
                //console.table("Mic Values", window.soundValues );
                //console.table(createSinLine(40,50,100));
                console.table(createSinLine(40,50,100));
            }
            if (KEYMAP.KeyK) console.log(KEYMAP)
        }
    }
}
addEventListener(`keydown`, keyUpdate)
addEventListener(`keyup`, keyUpdate)

function printObject(obj) {
    obj.forEach(e => {
        console.log("printObject -> e", e)
    });
}


// lerps from color1 to color2
function lerpFromTo(from, to, amt) {
    amt = clamp(amt,0,1);
    let f1 = from[0]; let f2 = from[1]; let f3 = from[2];
    let t1 = to[0]; let t2 = to[1]; let t3 = to[2];

    // lerp = amt * (stop - start) + start

    let r = amt * (t1 - f1) + f1;
    r = clamp(r,0,255);
    let g = amt * (t2 - f2) + f2;
    g = clamp(g,0,255);
    let b = amt * (t3 - f3) + f3;
    b = clamp(b,0,255);
    
    let color = [r,g,b]
    return color;
}

// lerps from from to to
function lerpFromToVal(from, to, amt) {
    amt = clamp(amt,0,1);
    let v = amt * (to - from) + from;
    return v;
}


function componentToHex(c) {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(color) {
    color = floorArr(color);
    return "#" + componentToHex(color[0]) + componentToHex(color[1]) + componentToHex(color[2]);
  }


// Map n to range of start1, stop1 to start2, stop2
function mapRange(n, start1, stop1, start2, stop2) {const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;if (newval) {return newval;}if (start2 < stop2) {return limit(newval, start2, stop2);} else {return limit(newval, stop2, start2);}}

// Keep n between low and high
function limit(n, from, to) {return Math.max(Math.min(n, to), from);}

// Random Number between min and max, with rounding type if wanted
function rngOf(from,to,roundType) {switch (roundType) {case "floor" :return Math.floor((Math.random() * (to - from) + from));case "round" :return Math.round((Math.random() * (to - from) + from));case "ceil" :return Math.ceil((Math.random() * (to - from) + from));default :return (Math.round((Math.random() * (to - from) + from)*100))/100;}}

function rngProperty(obj,range) {let keys = Object.keys(obj); if (range) return obj[keys[ (keys.length-range) * Math.random() << 0]];else return obj[keys[ (keys.length) * Math.random() << 0]]}
// choose random a or b
function getOne(a, b) {arr = [a, b];return arr[Math.round(Math.random())]}
function getRng(a) {return a[Math.floor(Math.random() * a.length)];}

function easeIn(a,b,percent) { return a + (b-a)*Math.pow(percent,2)}
function easeOut(a,b,percent) { return a + (b-a)*(1-Math.pow(1-percent,2))}
function easeInOut(a,b,percent) { return a + (b-a)*((-Math.cos(percent*Math.PI)/2) + 0.5)}

function clamp(val, min, max) {return Math.max(min, Math.min(max, val));}

function floorArr(a) {return a.map(e => Math.floor(e))}

Number.prototype.fl = function(){return Math.floor(this)}
Array.prototype.rngValue = function(){return this[Math.floor(Math.random() * this.length)]}
/*

*/