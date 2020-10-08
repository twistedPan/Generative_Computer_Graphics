import * as THREE from "https://unpkg.com/three@0.120.1/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.120.1/examples/jsm/controls/OrbitControls.js";


// Other Values
var micInputOnline = false;
let grid3d = create3DGrid(4,4,4);
let blockAbs = 10;

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
renderer.setClearColor( "#FFFFFF");
document.body.appendChild( renderer.domElement );

const color = 0xFFFFFF;  // white
const near = 10;
const far = 100;
myScene.fog = new THREE.Fog(color, near, far);

// Camera
var myCamera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
myCamera.position.set( 0, 0, 60 );
myCamera.lookAt( 0, 0, 0 );

// Controlls
var controls = new OrbitControls( myCamera, renderer.domElement );
//controls.update() must be called after any manual changes to the camera's transform
controls.update();



// Lights
const directional_light = new THREE.DirectionalLight( 0xFFFFFF, 0.8);
directional_light.position.set(10, 1, 5);
directional_light.target.position.set(0, 0, 0);
//const helper = new THREE.DirectionalLightHelper(directional_light);
myScene.add(directional_light);

const point_light = new THREE.PointLight("#F0DA49", 5);
point_light.position.set(0,30,0);
const helper = new THREE.PointLightHelper(point_light);
myScene.add(point_light);

const skyColor = "#ffff55"; const groundColor = "#224433";
const hemisphere_light = new THREE.HemisphereLight( skyColor, groundColor, 0.1);
hemisphere_light.position.set(0,0,0);
//myScene.add(hemisphere_light);

//myScene.add(helper);

var cubes = [];
let randomValues = [];
let inc = 0;


for (let i=0; i<grid3d.length; i++) {
    randomValues.push(Math.random());
}

// Form
var _cube = new THREE.Mesh( new THREE.BoxGeometry(4,4,4), new THREE.MeshPhongMaterial( { color: 0x00aa00 } ) );

for (let i = 0; i < grid3d.length; i++) {
    //let cube = new THREE.Mesh( new THREE.BoxGeometry(4,4,4), new THREE.MeshPhongMaterial( { color: 0x00aa00, shininess: 150 } ))
    //let cube = new THREE.Mesh( new THREE.BoxGeometry(4,4,4), new THREE.MeshToonMaterial( { color: 0x00aa00, shininess: 100 } ))
    let cube = new THREE.Mesh( new THREE.BoxGeometry(4,4,4), new THREE.MeshPhysicalMaterial( { color: 0x00aa00 } ))
    cubes.push(cube)
    myScene.add(cube)
}

//myScene.add(_cube);
//myScene.add(light.target);

//===============================================================================
//  ------------------------------- SCENE ---------------------------------
//=============================================================================== 

function animate() { 
    requestAnimationFrame( animate );
    
    //let mosX = mapRange(mouseX, 0, window.innerWidth, -10, 10)
    //let mosY = mapRange(mouseY, 0, window.innerHeight, -10, 10)


    for (let i = 0; i < cubes.length; i++) {
        const cube = cubes[i];

        let vec3 = new THREE.Vector3(grid3d[i].x, grid3d[i].y, grid3d[i].z).multiplyScalar(blockAbs);

        cube.position.set(
            vec3.x,
            vec3.y,
            vec3.z
        )
    }

    directional_light.position.set(myCamera.position.x,myCamera.position.y,myCamera.position.z)



    inc += 0.01;
    controls.update();
    renderer.render( myScene, myCamera ); 
} 
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

function easeIn(a,b,percent) { return a + (b-a)*Math.pow(percent,2)}
function easeOut(a,b,percent) { return a + (b-a)*(1-Math.pow(1-percent,2))}
function easeInOut(a,b,percent) { return a + (b-a)*((-Math.cos(percent*Math.PI)/2) + 0.5)}

Number.prototype.fl = function(){return Math.floor(this)}
Array.prototype.rngValue = function(){return this[Math.floor(Math.random() * this.length)]}

/*

*/