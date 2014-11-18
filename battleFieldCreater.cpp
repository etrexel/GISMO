#include <iostream>
#include <fstream>
#include <stdlib.h>
using namespace std;

int main () {
	srand (time(NULL));
	
	ofstream myfile;
	myfile.open ("battlefield.csv");
	int randNum;

	for(int y = 0; y <= 250; y++ ) {
		for(int x = 0 ; x <= 250; x++ ) {
			randNum = rand() % 100;

			//plane
			if(randNum < 75) {
				myfile << 0;
			}
			//Tree
			if(randNum >= 75 && randNum < 85) {
				myfile << 1;
			}
			//water
			if(randNum >= 85 && randNum < 95) {
				myfile << 2;
			}
			//mountian
			if(randNum >= 95 && randNum < 100) {
				myfile << 3;
			}

				if(x != 250) {
					myfile << ",";
				}
			}
			myfile << "\n";
		}

		myfile.close();
		return 0;
	}