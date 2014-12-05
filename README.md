GISMO
=====

Michael Schem
Jason Etter
Eric Trexel

Term Project Deliverable 1

Non-functional requirements

1. The software shall use client-server organization consisting of a client-side UI and a server-side game processor.
2. The user-interface portion of the software shall be written in HTML and JavaScript.
3. The UI shall be drawn with the help of the Phaser library.
4. The server portion of the software shall be written in Object Orient JavaScript.
5. The game engine shall transmit state of the board to the AI through JSON HTTP post
6. The game engine shall transmit state of the board to the UI through a JSON file
7. The AIs shall respond to the game engine's JSON state with a move every time tick

Functional requirements

1. The blockhouse shall have a health of 3
2. The tank shall have a health of 2
3. The tank shall lose mobility upon 1 hit
4. The tank shall be destroyed on 2 hits
5. Smoke shall be reported upon a hit from an enemy at the square of the tank
6. Mountains shall be impassable and translucent
7. Lakes shall be impassible and transparent
8. Planes shall be passable and transparent
9. Tanks shall be able to shoot up to 100 squares away and cause 1 damage
10. Tanks shall cause up to 2 damage under 50 squares away
11. There shall be 7 tanks for each team
12. There shall be 1 blockhouse for each team
13. The game Engine shall accept any AI, but must use JSON as a communication format.



URL to Source Control: https://github.com/michaelschem/GISMO
