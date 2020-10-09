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
myCamera.position.set( 0, -600, 500 );
myCamera.lookAt( 0, 0, 0 );

// Controlls
var controls = new OrbitControls( myCamera, renderer.domElement );
//controls.update() must be called after any manual changes to the camera's transform
controls.update();


//===============================================================================
//  ------------------------------- LIGHTS ---------------------------------
//===============================================================================

// Lights
const directional_light = new THREE.DirectionalLight( 0x00FF00, 10);
directional_light.position.set(0, 0, 400);
directional_light.target.position.set(0, 0, 0);
//const helper = new THREE.DirectionalLightHelper(directional_light);
myScene.add(directional_light);

const point_light = new THREE.PointLight("#ffffff", 2);
point_light.position.set(0,0,200);
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
        this.color = colors4[Math.floor(Math.random() * colors4.length)];
        this.model = 0;
        this.specFreq = 0;
    }

    createModel(points) {
        this.model = new THREE.Mesh( 
            new THREE.BoxGeometry(this.sX,this.sY,this.sZ), 
            new THREE.MeshPhongMaterial( { color: "#222222" } ) );
        myScene.add(this.model)
    }

    display(input,seconds) {
        let vec3 = new THREE.Vector3(this.x, this.y, this.z);
        this.model.position.set(vec3.x,vec3.y,vec3.z + this.specFreq)
    }
}

// Other Values
var micInputOnline = false;
let blockAbs = 10;
let elements = [];
let points = [];
let colors4 = ['#ffffff','#cccccc','#999999','#737373','#404040','#d9d9d9','#a6a6a6'];

let radius = 20;
for (let i=0; i<16; i++, radius+=20) {
    elements[i] = [0];
    points[i] = [0];
    let circleArr = pointsOnCircle(0,0,0,radius,64);
    for (let j=0; j<64; j++) {
        points[i].push(new THREE.Vector3(circleArr[j].x, circleArr[j].y, 0))
        elements[i][j] = new Element(circleArr[j].x,circleArr[j].y, 0, [10,10,10], 0x111111)
    }
}
let eleC = 0;
elements.forEach(i => {

    i.forEach(e => {
        e.createModel(points[eleC]);
    })
    eleC++;
})


// Form
var _cube = new THREE.Mesh( new THREE.BoxGeometry(4,4,4), new THREE.MeshPhongMaterial( { color: 0x00aa00 } ) );


//myScene.add(_cube);
//myScene.add(light.target);

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

        for (let i=0, d=0; i<elements.length; i++) {
            for (let j = 0; j < elements[i].length; j++, d++) {
                elements[i][j].specFreq = spectrum[d];
                //elements[i][j].sZ = spectrum[d];
            }
        }

        elements.forEach(i => {
            i.forEach(e => {
                e.display();

                //e.model.rotation.x = 0.5;
                //e.model.rotation.z = 0.5;
            })
        })

/* 
        for (let i = 0; i < cubes.length; i++) {
            const cube = cubes[i];
            //cube.rotation.x = 0.5;
            //cube.rotation.y = 0.7;
            let vec3 = new THREE.Vector3(grid3d[i].x, grid3d[i].y, grid3d[i].z).multiplyScalar(blockAbs);
            cube.position.set(vec3.x,vec3.y,vec3.z)
        }
        
        cubes.forEach(e => {
            e.rotation.x = mosX/10;
        });
*/


        //_cube.position.x = mosX;
        //_cube.position.y = -mosY;
        //_cube.position.z = (mosX+mosY) / 2;
        //light.target.position.x = mosX
        //light.target.position.z = mosY
    }


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


Number.prototype.fl = function(){return Math.floor(this)}
Array.prototype.rngValue = function(){return this[Math.floor(Math.random() * this.length)]}

/*
*/ 