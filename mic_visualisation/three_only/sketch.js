import * as THREE from "https://unpkg.com/three@0.120.1/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.120.1/examples/jsm/controls/OrbitControls.js";
//import { GUI } from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';

// Other Values
var micInputOnline = false;

let grid3d = create3DGrid(3,3,3);

// THREEJS Values
var myScene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );  // Canvas Size
document.body.appendChild( renderer.domElement );

// Camera
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.set( 0, 0, 40 );
camera.lookAt( 0, 0, 0 );

// Controlls
var controls = new OrbitControls( camera, renderer.domElement );

//controls.update() must be called after any manual changes to the camera's transform
camera.position.set( 0, 20, 100 );
controls.update();

var points = [];
points.push( new THREE.Vector3( -10, 0, 0 ) );
points.push( new THREE.Vector3(   0, 10, 0 ) );
points.push( new THREE.Vector3(  10, 0, 0 ) );
points.push( new THREE.Vector3(  0, -10, 0 ) );
points.push( new THREE.Vector3(  -10, 0, 0 ) );

// Geometry
var geometries = [
    new THREE.BoxGeometry(4,4,4),
    new THREE.BufferGeometry().setFromPoints( points ),
];

// Material
var materials = [
    new THREE.MeshPhongMaterial( { color: 0x00aa00 } ),
    new THREE.LineBasicMaterial( { color: 0x0000ff } ),
];

// Lights
const intensity = 2;
const light = new THREE.DirectionalLight( 0xFFFFFF, intensity);
//const light = new THREE.AmbientLight( 0xFFFFFF, intensity);
light.position.set(10, 10, 0);
//light.target.position.set(-10, 0, -10);


// Form
var _cube = new THREE.Mesh( geometries[0], materials[0] );
var _line = new THREE.Line( geometries[1], materials[1] );

var cubes = []
for (let i = 0; i < grid3d.length; i++) {
    let cube = new THREE.Mesh( geometries[0], materials[0])
    cubes.push(cube)
    myScene.add(cube)
}

myScene.add(light);
myScene.add(_cube);
//myScene.add(_line);
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

    if (micInputOnline || 0 == 0) {
        //let mosX = map(mouseX, 0, window.innerWidth, -10, 10)
        //let mosY = map(mouseY, 0, window.innerHeight, -10, 10)

        _cube.rotation.x += treble/1000; 
        _cube.rotation.y += bass/10000;

        for (let i = 0; i < cubes.length; i++) {
            const cube = cubes[i];
            cube.rotation.x = 0.5;
            cube.rotation.y = 0.7;
            //cube.position = grid3d[i].multiplyScalar(10);
            //cube.position = new THREE.Vector3(2,5,-2);
            let vec3 = new THREE.Vector3(grid3d[i].x, grid3d[i].y, grid3d[i].z).multiplyScalar(20);
            cube.position.x = vec3.x;
            cube.position.y = vec3.y;
            cube.position.z = vec3.z;
        }

        cubes.forEach(e => {
            e.rotation.x = 10;
        });

        //_cube.position.x = mosX;
        //_cube.position.y = -mosY;
        //_cube.position.z = mosX/mosY;
        
        //light.target.position.x = mosX
        //light.target.position.z = mosY

    }

    controls.update();
    renderer.render( myScene, camera ); } 
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

function pointsOnCircle(x,y,z,radius,spacing) {
    let coords = [];
    let a = 0.0;
    let inc = TWO_PI / spacing;
    for (let i = 0; i < spacing; i++) {
        coords.push({x:x + sin(a)*radius, y:y + cos(a)*radius, z:z})
        a = a + inc;
    }
    return coords;
}

function createSinLine(width,height,count) {
    let a = 0.0;
    let lineCoords = []
    let inc = TWO_PI / count;
    for (let i = 0; i < count; i++) {
        lineCoords.push({x1:i*3, x2:width, y1:i*3, y2:width+Math.sin(a)*height} )
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

function easeIn(a,b,percent) { return a + (b-a)*Math.pow(percent,2)}
function easeOut(a,b,percent) { return a + (b-a)*(1-Math.pow(1-percent,2))}
function easeInOut(a,b,percent) { return a + (b-a)*((-Math.cos(percent*Math.PI)/2) + 0.5)}

Number.prototype.fl = function(){return Math.floor(this)}
Array.prototype.rngValue = function(){return this[Math.floor(Math.random() * this.length)]}

/*

*/