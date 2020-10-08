import * as THREE from "https://unpkg.com/three@0.120.1/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.120.1/examples/jsm/controls/OrbitControls.js";
//import { GUI } from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';

let aspect = screen.innerWidth / screen.innerHeight;
let frustumSize = 600;

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
myScene.fog = new THREE.Fog(0xFFFFFF, 50, 300);

// Camera
//let myCamera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
let othoVal = 30;
let myCamera = new THREE.OrthographicCamera(window.innerWidth / -othoVal, window.innerWidth / othoVal, window.innerHeight / othoVal, window.innerHeight / - othoVal, 1, 2000 );
myCamera.position.set( 0, 0, 100);
myCamera.lookAt( 0, 0, 0 );

// Controlls
var controls = new OrbitControls( myCamera, renderer.domElement );
//controls.update() must be called after any manual changes to the camera's transform
controls.update();


//===============================================================================
//  ------------------------------- LIGHTS ---------------------------------
//===============================================================================

// Lights
const directional_light = new THREE.DirectionalLight( 0xFFFFFF, 0.8);
directional_light.position.set(0,0,0);
directional_light.target.position.set(0,0,0);
const helper = new THREE.DirectionalLightHelper(directional_light);
myScene.add(directional_light);

const point_light = new THREE.PointLight("#F0DA49", 1);
point_light.position.set(0,0,0);
//const helper = new THREE.PointLightHelper(point_light);
myScene.add(point_light);

const skyColor = "#ffffff"; const groundColor = "#ffffff";
const hemisphere_light = new THREE.HemisphereLight( skyColor, groundColor, 0.1);
hemisphere_light.position.set(0,0,0);
//myScene.add(hemisphere_light);

//myScene.add(helper);



// Other Values
let blockAbs = 10;
let inc = 0;
let incVal = 0.01
let cubeSize = 20;
let dir = 1;
let colorDir = 1;
let dir_flag = false;
let sinV = 0;
let cosV = 0;
let tanV = 0;
let rotVal = 0;
var micInputOnline = false;
let grid3d = create3DGrid(cubeSize,cubeSize,cubeSize);
let table3d = create3DTable(20,10,0);
var cubes = [];
let randomValues = [];
let randomIndex = 0;

for (let i=0; i<table3d.length; i++) {
    randomValues.push(Math.random());
    //randomValues.push(rngOf(-1,1));
}

// Form
for (let i = 0; i < table3d.length; i++) {
    let cube = new THREE.Mesh( 
        new THREE.BoxGeometry(cubeSize,cubeSize,cubeSize), 
        new THREE.MeshPhongMaterial( { color: 0x00aa00, shininess: 0, reflectivity: 0 } ))
        //new THREE.MeshLambertMaterial( { color: 0x00aa00, reflectivity: 0 } ))
        // MeshStandardMaterial has 2 settings roughness and metalness
        //new THREE.MeshStandardMaterial( { color: 0x00aa00, roughness: 1, metalness: 1 } ))
    cubes.push(cube)
    myScene.add(cube)
}

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
        //let mosX = map(mouseX, 0, window.innerWidth, -10, 10)
        //let mosY = map(mouseY, 0, window.innerHeight, -10, 10)

        
        if (sinV == 0 && !dir_flag) {
            dir_flag = true;
            dir *= -1;
            colorDir *= -1;
            randomIndex = Math.random()*randomValues.length << 0
        } else if (sinV < 0) dir_flag = false;
        else {
            colorDir *=-1;
            rotVal = lerpFromToVal(0,90,Math.abs(Math.sin(inc)))
        }
        //console.log("animate -> sinV", Math.sin(inc), "rotVal", rotVal)

        //console.log("animate -> randomIndex", randomIndex, " sinV", sinV)
        
        sinV = clamp(Math.sin(-inc),-1,0)
        cosV = clamp(Math.cos(inc),-1,0)
        tanV = clamp(Math.tan(inc),-50,50)
        
        for (let i = 0; i < cubes.length; i++) {
            const cube = cubes[i];
            cube.rotation.x = 90 + toRad(rotVal)*2;
            //cube.rotation.y = toRad(rotVal);
            cube.rotation.z = toRad(45) + toRad(rotVal)/2;

            let cubeColor;
            if(colorDir < 0) cubeColor = cubes[(cubes.length-1)-i];
            else cubeColor = cubes[i];
            let startColor = new THREE.Color(0x30cfd0) // 
            let endColor = new THREE.Color(0x330867) // 
            cubeColor.material.color = new THREE.Color(startColor).lerp(endColor, i/cubes.length*tanV)

            let vec3 = new THREE.Vector3(table3d[i].x, table3d[i].y, table3d[i].z).multiplyScalar(blockAbs);
            cube.position.set(
                vec3.x + (sinV*randomValues[i]*20) * dir,
                vec3.y + (cosV*randomValues[i]*20), 
                vec3.z
            )
        }

        let lightRange = clamp(tanV, -50, 50)
        //console.log("animate -> tanV", tanV)
        point_light.intensity = lightRange;
        directional_light.position.set(myCamera.position.x,myCamera.position.y,myCamera.position.z+200)
    }


    incVal = clamp(incVal, 0.001, 0.09);
    inc += incVal;
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

function create3DTable(w,h,d) {
    let grid = []
    let offset = d
    for (let i = -w/2; i <= w/2; i+=1) {
        for (let j = -h/2; j <= h/2; j+=1) {
            if (i%2 == 0) grid.push({x:i,y:j+0.5,z:0.2})
            else grid.push({x:i+0,y:j,z:d})
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
        if (KEYMAP.ArrowUp) {
            incVal += 0.001
        }
        if (KEYMAP.ArrowDown) {
            incVal -= 0.001
        }
        
        console.log("incVal", incVal)
    }
}
addEventListener(`keydown`, keyUpdate)
addEventListener(`keyup`, keyUpdate)


function printObject(obj) {
    obj.forEach(e => {
        console.log("printObject -> e", e)
    });
}


// lerps from from to to
function lerpFromToVal(from, to, amt) {
    amt = clamp(amt,0,1);
    let v = amt * (to - from) + from;
    return v;
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
function clamp(val, min, max) {return Math.max(min, Math.min(max, val));}

function toDeg(rad) {return (rad * 180) / (Math.PI)}

function toRad(deg) {return (deg * Math.PI) / (180)}

Array.prototype.rngValue = function(){return this[Math.floor(Math.random() * this.length)]}

/*

*/