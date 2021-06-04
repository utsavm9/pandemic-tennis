# Pandemic Tennis

Team Members:
* Michael Inoue, michaelinoue@g.ucla.edu, UID: 405171527 
* Utsav Munendra, utsavm9@g.ucla.edu, UID: 805127226
* Da Yuen Kim, dayuen7@g.ucla.edu, UID: 305096821

---

Pandemic Tennis is 3D single-player table tennis. Because it is hard to draw a mask in the game and the pandemic is still ongoing, the player will be playing alone, hitting the ball to a wall, trying to not miss it. 

---

**Gameplay:**
* Through collision detection, the wall will send back the ball to the player. 
* The goal of the game is to keep hitting the ball back for as long as possible, and the game ends when the player does not place the paddle at the right position and misses the ball. 
* As the player keeps sending back the ball, the score will keep increasing. 
* We can keep track of the high score for the current gameplay. However, it would not be persistent between page reloads.

--- 

**Advanced features**:
* Collision detection: We utilize collision detection calculations to determine if the ball will bounce off of the paddle, backboard, and table.
* Mouse picking: The paddle's position is updated via mouse picking, set up with a **mouse_move** event handler.

---

**What we worked on**:
* Dayuen:
   * **Background**: 
       * Utilized a Skybox where all the action is taken place inside
      * Skybox is 4 side of a cube where a sky texture is applied
      * Each side is drawn using seperate add functions.
      * Skybox gives depth to the scene
      * Used assignment 4 Texture_Scroll_X to give the effect of the clouds moving
      * Added a secondary grass ground for depth 
   * **Textures**:
       * Added textures for table, backboard, and net for visual effects.
   * **Scene**:
       * Start scene begins upon startup
      * Start scene end and game begins on click of start text
      * Gameover scene begins when player misses the ball
* Michael: 
  * **Paddle**: 
    * A flat cylinder for paddle’s blade, uniform red color
    * A long cylinder for paddle’s stick, wood texture
    * Movable in the up-down/left-right plane
    * The paddle gets moved by the paddle object’s **move()** function, which takes a set of Cartesian coordinates and updates the coordinates of the paddle
    * The JavaScript object for paddle has a bounds property, with corresponding fields **UP, DOWN, LEFT, RIGHT,** and **FORWARD,** which will indicate the respective bounded plane of the paddle to be used for collision detection with the ball.
  * **Table + Backboard**
    * The table is a stationary field that the ball bounces on top of, with corresponding **UP, DOWN, LEFT, RIGHT,** and **FRONT** bounds properties 
    * The backboard is a stationary field that the ball bounces off of, with corresponding **UP, DOWN, LEFT, RIGHT,** and **FRONT** bounds properties
    * Both are cuboids that are scaled appropriately
  * **Bounds**
    * The bounds property specifies the bounding box of each object to be used in collision detection calculations
  * **Mouse Picking**
    * Set up the mouse picking for paddle movement
* Utsav: Ball, collision detection, physics

**References**:
* We only utilized the provided libraries/code examples in TinyGraphics.

Documents outside this repo:
* [Initial Proposal (Google Doc)](https://docs.google.com/document/d/11gYp_Cpch9pHaLROfFWWhyT-0MKKXDhjeYqwi35HxDw/edit?usp=sharing)
