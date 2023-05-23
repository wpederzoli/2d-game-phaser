# 2d-game-phaser
This mini game was developed as part of a challenge with the following instructions:

- Using Phaser3, create a 2D pixel mini-game that demonstrates knowledge of arcade physics, sprite sheets, loading assets externally and communication between scenes. 
- Using NodeJS, create a backend server that communicates with the mini game in real time. 

https://github.com/wpederzoli/2d-game-phaser/assets/29479944/fd92d980-7376-4790-bf9a-aa3d1268d87b

# Pirate Dodgeball
The goal of the game is pretty simple, you have to hit the enemy pirate.

## Controlls
Left mouse click to select the square where you want to move (you can only move to squares you can get to walking)
Right mouse click to select the enemy square where you want to shoot your cannon at.

## About implementation
The most relevant concepts beside the Phaser3 specifics are:

### Multiplayer system
This feature allows the user to create and join "parties". The communication then, is between players inside the same party

### Turn based mechanics
Each player has 10 seconds to make their move and they both move and shoot at the same time.

### Path finding
The current implementation uses Dijkstra's A* algorithm to find the best possible path


