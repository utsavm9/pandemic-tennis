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
* Physics: The ball maintains a constant acceleration and changing velocity to simulate real bouncing.

---

**What we worked on**:
* Dayuen: Background, textures, scene
* Michael: Paddle, table + backboard, bounds
* Utsav: Ball, collision detection, physics

**References**:
* We only utilized the provided libraries/code examples in TinyGraphics.

Documents outside this repo:
* [Initial Proposal (Google Doc)](https://docs.google.com/document/d/11gYp_Cpch9pHaLROfFWWhyT-0MKKXDhjeYqwi35HxDw/edit?usp=sharing)
