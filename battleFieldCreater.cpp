#include <iostream>
#include <fstream>
#include <stdlib.h>
#include "DeckOfCards.h"
#include "Hand.h"
#include "Card.h"

using namespace std;

int main () {
	srand (time(NULL));
	
	int randNum;
	int mapSize = 250;
	int map[mapSize][mapSize];
	int growthSize = 4;

    //plane = 0
	//Tree = 1
	//Water = 2
	//Mountain = 3


	//seed
	for(int y = 0; y < mapSize; y++ ) {
		for(int x = 0 ; x < mapSize; x++ ) {
			randNum = rand() % 1000;

			
			if(x == 0 || y == 0 || x == mapSize - 1 || y == mapSize - 1){
				map[x][y] = 0;
			} else if(randNum < 95) {
				map[x][y] = 0;
			} else if(randNum == 96 || randNum == 99) {
				map[x][y] = 1;
			} else if(randNum == 97) {
				map[x][y] = 2;
			} else if(randNum == 98) {
				map[x][y] = 3;
			} else {
				map[x][y] = 0;
			}

		}
	}

	//grow
	for(int j = 0; j < growthSize; j++){
		for(int y = 0; y < mapSize; y++ ) {
			for(int x = 0 ; x < mapSize; x++ ) {
				if(map[x][y] == 1){
					map[x - rand() % 2][y - rand() % 2] = map[x][y];
				}
				if(map[x][y] == 2){
					map[x][y - rand() % 2] = map[x][y];
					map[x][y - rand() % 2] = map[x][y];
				}
				//if(map[x][y] == 3){
				//	map[x - rand() % 2][y - rand() % 2] = map[x][y];
				//}
			}
		}
	}

	//grow
	for(int j = 0; j < growthSize; j++){
		for(int y = mapSize - 1; y > 1; y-- ) {
			for(int x = mapSize - 1; x > 1; x-- ) {
				if(map[x][y] == 1){
					map[x + rand() % 2][y + rand() % 2] = map[x][y];
				}
				if(map[x][y] == 2){
					//cout << x + rand() % 2 << " ";
					map[x][y + rand() % 2] = map[x][y];
					map[x][y + rand() % 2] = map[x][y];

				}
				//if(map[x][y] == 3){
				//	map[x + rand() % 2][y + rand() % 2] = map[x][y];
				//}
			}
		}
	}

	//grow
	for(int j = 0; j < growthSize; j++){
		for(int y = 0; y < mapSize; y++ ) {
			for(int x = mapSize - 1; x > 1; x-- ) {
				if(map[x][y] == 1){
					map[x + rand() % 2][y - rand() % 2] = map[x][y];
				}
				if(map[x][y] == 2){
					//cout << x + rand() % 2 << " ";
					map[x][y - rand() % 2] = map[x][y];

				}
				//if(map[x][y] == 3){
				//	map[x + rand() % 2][y - rand() % 2] = map[x][y];
				//}
			}
		}
	}

	//grow
	for(int j = 0; j < growthSize; j++){
		for(int y = mapSize - 1; y > 1; y-- ) {
			for(int x = 0 ; x < mapSize; x++ ) {
				if(map[x][y] == 1){
					map[x - rand() % 2][y + rand() % 2] = map[x][y];
				}
				if(map[x][y] == 2){
					//cout << x + rand() % 2 << " ";
					map[x - rand() % 2][y + rand() % 2] = map[x][y];

				}
				if(map[x][y] == 3){
					map[x - rand() % 2][y + rand() % 2] = map[x][y];
				}
			}
		}
	}

	ofstream myfile;
	myfile.open ("battlefield.csv");

	for(int y = 0; y < mapSize; y++ ) {
		for(int x = 0 ; x < mapSize; x++ ) {
			myfile << map[x][y];

			if(x != mapSize - 1) {
				myfile << ",";
			}
		}
		myfile << "\n";
	}

	myfile.close();
	return 0;
}