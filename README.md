<h1>Generative Computer Graphics HS2020</h1>

##### Table of Contents
- [Week 1](#week-1)
  - [Day 1](#day-1)
  - [Day 2](#day-2)
  - [Day 3](#day-3)
- [Week 2](#week-2)
  - [Day 1](#day-1-1)
  - [Day 2](#day-2-1)
  - [Day 3](#day-3-1)
- [Week 3](#week-3)
  - [Day 1](#day-1-2)
  - [Day 2](#day-2-2)
  - [Day 3](#day-3-2)
  
---
---


## Week 1:
  - ### Day 1
  
  
      idea: 
      get Mic input and create interactable sketch

      problem: 
      Web technologies safety standarts

      Web browser didn't get the input from the mic, p5 was throwing error messages, some older sketches still working the new ones didn't worked.

      Solution:
      Took an older sketch and copy paste the mic part, 
      wrote a intro page to get trough the chrome safety part
      ( create user input before audio can play ), 

      realization:
      Mic input consists only of volume, no frequenzies possible.

1 | 2 | 3
------------ | ------------ | -------------
<img src="https://github.com/twistedPan/genCom/blob/master/pictures/week1.1%20randomBubbles%20(1).png" width="100%"> | <img src="https://github.com/twistedPan/genCom/blob/master/pictures/week1.1%20randomBubbles%20(2).png" width="100%"> | <img src="https://github.com/twistedPan/genCom/blob/master/pictures/week1.1%20randomBubbles%20(3).png" width="100%">

```javascript
function setup() {

    mic = new p5.AudioIn()
    mic.start();

}
```




  - ### Day 2
  
  
  idea:
  bubbles grow in size through the mic input
  bubbbles pop if they collide

1 | 2
------------ | ------------
<img src="https://github.com/twistedPan/genCom/blob/master/pictures/week1.2%20poppingBubbles%20(1).png" width="100%"> | <img src="https://github.com/twistedPan/genCom/blob/master/pictures/week1.2%20poppingBubbles%20(2).png" width="100%">



  started to look at three.js
  idea: foggy Cube grid to work  

  
1 | 2
------------ | ------------
<img src="https://github.com/twistedPan/genCom/blob/master/pictures/week1.3%20startWithThreejs%20(1).png" width="100%"> | <img src="https://github.com/twistedPan/genCom/blob/master/pictures/week1.3%20startWithThreejs%20(2).png" width="100%">



  realization:
  Mic input can also be analyzed with fft

```javascript
function setup() {

    mic = new p5.AudioIn()
    mic.start();
    
    fft = new p5.FFT();
    fft.setInput(mic);
    
}
```

  started to work at an easy-to-implement script for others to use the microphone input



  - ### Day 3
  
    Finallized the microphone input handler --> [Microphone Input Analyzer](https://github.com/twistedPan/p5_microphone_input_analyzer "GitHub Link")
    
    continued to work with three.js

    learned about materials, geometries, cameras, lights, etc.











---


## Week 2:



  - ### Day 1


      idea: Display each of the 1024 frequencies as point on a circle and create a soundwave-like circle.


  1. created a 2D sketch in p5.js 

1 | 2 | 3
------------ | ------------ | -------------
<img src="https://github.com/twistedPan/genCom/blob/master/pictures/Week2.1%20prototype2D%20(1).png" width="100%"> | <img src="https://github.com/twistedPan/genCom/blob/master/pictures/Week2.1%20prototype2D%20(3).png" width="100%"> | <img src="https://github.com/twistedPan/genCom/blob/master/pictures/Week2.1%20prototype2D%20(2).png" width="100%">

To create the circles around the circles, i fill a 2-dimensional Array 
```javascript
let elements = [];
let radius = 66;

for (let i=0; i<16; i++, radius+=66) {
    // create second dimension for Array elements
    elements[i] = [0];
    
    // save positions of 64 points even spaced on a cirlce with radius 'radius'
    let circleArr = pointsOnCircle(0,0,0,radius,64);
    
    // place elements on the current circle 
    for (let j=0; j<64; j++) {
        elements[i][j] = new Element(circleArr[j].x,circleArr[j].y,5,"circle")
    }   
    
}
```


  2. moved the whole thing to three.js

1 | 2 | 3
------------ | ------------ | -------------
<img src="https://github.com/twistedPan/genCom/blob/master/pictures/Week2.2%20protoMovedToThreejs%20(1).png" width="100%"> | <img src="https://github.com/twistedPan/genCom/blob/master/pictures/Week2.2%20protoMovedToThreejs%20(2).png" width="100%"> | <img src="https://github.com/twistedPan/genCom/blob/master/pictures/Week2.2%20protoMovedToThreejs%20(3).png" width="100%">






  
  - ### Day 2


      Switched the cubes with lines and ended up playing with it the whole day
    
1 | 2 | 3
------------ | ------------ | -------------
<img src="https://github.com/twistedPan/genCom/blob/master/pictures/Week2.3%20linesNoCubes%20(1).png" width="100%"> | <img src="https://github.com/twistedPan/genCom/blob/master/pictures/Week2.3%20linesNoCubes%20(3).png" width="100%"> | <img src="https://github.com/twistedPan/genCom/blob/master/pictures/Week2.3%20linesNoCubes%20(4).png" width="100%">

<img src="https://github.com/twistedPan/genCom/blob/master/pictures/Week2.3%20linesNoCubes%20(1).gif" width="50%">



    deactivated the canvas refresh mode 

1 | 2 | 3
------------ | ------------ | -------------
<img src="https://github.com/twistedPan/genCom/blob/master/pictures/Week2.4%20noCanRefresh%20(2).png" width="100%"> | <img src="https://github.com/twistedPan/genCom/blob/master/pictures/Week2.4%20noCanRefresh%20(3).png" width="100%"> | <img src="https://github.com/twistedPan/genCom/blob/master/pictures/Week2.4%20noCanRefresh%20(4).png" width="100%">

<img src="https://github.com/twistedPan/genCom/blob/master/pictures/Week2.4%20noCanRefresh%20(1).gif" width="50%">


  
  - ### Day 3


    Spend the day trying to rearrange the blocks to have a progressive amount from center to end (hangover)
    Did it after 3 hours

    Calculating new positioning for cubes:

          old 16 * 64 / 64 . 64 . 64 . 64 . 64 . 64 .... 1024

          new
          8 . 12 . 16 . 24 . 32 . 333 . 64 . 96 . 128 . 192 . 333 . 384 ....	no

          8 . 16 . 24 . 32 . 40 . 333 . 54 . 62 . 68 . 74 . 82 . 90 . 98 . 106 ...  no

          6 . 12 . 18 . 24 . 30 . 36 . 42 . 333 . 54 . 60 . . . . . 106 = 1024 ok
    
    
1 | 2 | 3
------------ | ------------ | -------------
<img src="https://github.com/twistedPan/genCom/blob/master/pictures/Week2.5%20sortedSectors%20(1).png" width="100%"> | <img src="https://github.com/twistedPan/genCom/blob/master/pictures/Week2.5%20sortedSectors%20(2).png" width="100%"> | <img src="https://github.com/twistedPan/genCom/blob/master/pictures/Week2.5%20sortedSectors%20(3).png" width="100%">


  Realisation:
    Math is even harder if you've a hangover.


---


## Week 3:



  - ### Day 1






  - ### Day 2







  - ### Day 3








