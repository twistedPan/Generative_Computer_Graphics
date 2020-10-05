<h1>Generative Computer Graphics HS2020</h1>

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



![soundBubbles](https://github.com/twistedPan/genCom/blob/master/pictures/week1.1%20randomBubbles%20(1).png?raw=true)
![soundBubbles](https://github.com/twistedPan/genCom/blob/master/pictures/week1.1%20randomBubbles%20(2).png?raw=true)
![soundBubbles](https://github.com/twistedPan/genCom/blob/master/pictures/week1.1%20randomBubbles%20(3).png?raw=true)







  - ### Day 2
  
  
      idea:
      bubbles grow in size through the mic input
      bubbbles pop if they collide


![soundBubbles](https://github.com/twistedPan/genCom/blob/master/pictures/week1.2%20poppingBubbles%20(1).png?raw=true)
![soundBubbles](https://github.com/twistedPan/genCom/blob/master/pictures/week1.2%20poppingBubbles%20(2).png?raw=true)



      started to look at three.js
      idea: foggy Cube grid to work  

  

![soundBubbles](https://github.com/twistedPan/genCom/blob/master/pictures/week1.3%20startWithThreejs%20(1).png?raw=true)
![soundBubbles](https://github.com/twistedPan/genCom/blob/master/pictures/week1.3%20startWithThreejs%20(2).png?raw=true)







  - ### Day 3
  
      Finallized the microphone input handler

      continued to work with three.js

      learned about materials and geometries














### Week 2:



  - ### Day 1


      idea: Display each of the 1024 frequencies as point on a circle and create a soundwave-like circle.


      1. created a 2D sketch in p5.js 

    
![soundBubbles](https://github.com/twistedPan/genCom/blob/master/pictures/Week2.1%20prototype2D%20(1).png?raw=true)
![soundBubbles](https://github.com/twistedPan/genCom/blob/master/pictures/Week2.1%20prototype2D%20(3).png?raw=true)
![soundBubbles](https://github.com/twistedPan/genCom/blob/master/pictures/Week2.1%20prototype2D%20(2).png?raw=true)



      2. moved the whole thing to three.js


![soundBubbles](https://github.com/twistedPan/genCom/blob/master/pictures/Week2.2%20protoMovedToThreejs%20(1).png?raw=true)
![soundBubbles](https://github.com/twistedPan/genCom/blob/master/pictures/Week2.2%20protoMovedToThreejs%20(2).png?raw=true)
![soundBubbles](https://github.com/twistedPan/genCom/blob/master/pictures/Week2.2%20protoMovedToThreejs%20(3).png?raw=true)






  
  - ### Day 2


      Switched the cubes with lines and ended up playing with it the whole day
    
    
![soundBubbles](https://github.com/twistedPan/genCom/blob/master/pictures/Week2.3%20linesNoCubes%20(1).png?raw=true)
![soundBubbles](https://github.com/twistedPan/genCom/blob/master/pictures/Week2.3%20linesNoCubes%20(3).png?raw=true)
![soundBubbles](https://github.com/twistedPan/genCom/blob/master/pictures/Week2.3%20linesNoCubes%20(4).png?raw=true)
![soundBubbles](https://github.com/twistedPan/genCom/blob/master/pictures/Week2.3%20linesNoCubes%20(1).gif?raw=true)



      deactivated the canvas refresh mode 


![soundBubbles](https://github.com/twistedPan/genCom/blob/master/pictures/Week2.4%20noCanRefresh%20(2).png?raw=true)
![soundBubbles](https://github.com/twistedPan/genCom/blob/master/pictures/Week2.4%20noCanRefresh%20(3).png?raw=true)
![soundBubbles](https://github.com/twistedPan/genCom/blob/master/pictures/Week2.4%20noCanRefresh%20(4).png?raw=true)
![soundBubbles](https://github.com/twistedPan/genCom/blob/master/pictures/Week2.4%20noCanRefresh%20(1).gif?raw=true)


  
  - ### Day 3


      Spend the day trying to rearrange the blocks to have a progressive amount from center to end (hangover)
      Did it after 3 hours

      Calculating new positioning for cubes:

          old 16 * 64 / 64 . 64 . 64 . 64 . 64 . 64 .... 1024

          new
          8 . 12 . 16 . 24 . 32 . 48 . 64 . 96 . 128 . 192 . 256 . 384 ....	no

          8 . 16 . 24 . 32 . 40 . 48 . 54 . 62 . 68 . 74 . 82 . 90 . 98 . 106 ...  no

          6 . 12 . 18 . 24 . 30 . 36 . 42 . 48 . 54 . 60 . . . . . 106 = 1024 ok
    
    
![soundBubbles](https://github.com/twistedPan/genCom/blob/master/pictures/Week2.5%20sortedSectors%20(1).png?raw=true)
![soundBubbles](https://github.com/twistedPan/genCom/blob/master/pictures/Week2.5%20sortedSectors%20(2).png?raw=true)
![soundBubbles](https://github.com/twistedPan/genCom/blob/master/pictures/Week2.5%20sortedSectors%20(3).png?raw=true)


      Realisation:
        Math is even harder if hangover.



### Week 3:



  - ### Day 1






  - ### Day 2







  - ### Day 3








