/*
 * Hello.cpp
 *
 *  Created on: Mar 13, 2014
 *      Author: Parag
 */

#include <math.h>

extern "C" {

	float correlation(float a[], float b[], int n){
		
		float a_mean = 0, b_mean = 0;			// individual mean for both arrays	 	// size of the array
		float a_diff = 0;
		float b_diff = 0;
		float ab = 0;
		float a_square = 0;
		float b_square = 0;

		float total_ab = 0;
		float total_a_square = 0;
		float total_b_square = 0;


		for(int i=0; i<n; i++){				// mean calculation
			a_mean += a[i];
			b_mean += b[i];
		}

		a_mean = a_mean/n;
		b_mean = b_mean/n;

		for(int i=0;i<n;i++){
			a_diff = a[i] - a_mean;
			b_diff = b[i] - b_mean;
			ab = a_diff * b_diff;
			a_square = pow(a_diff,2);
			b_square = pow(b_diff,2);
			total_ab += ab;
			total_a_square += a_square;
			total_b_square += b_square;

		}

		float correlation = total_ab/sqrt(total_a_square*total_b_square);

		return correlation;

	}

}