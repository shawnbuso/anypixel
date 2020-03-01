/**
 * Copyright 2020 Google Inc. All Rights Reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/license-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the license.
 */

// Create a 2d array. For creating patterns.
function make2dArray(width, height) {
  const arr = new Array(width);
  for (var i=0; i<width; i++) {
    arr[i] = new Array(height);
    for (var j=0; j<height; j++) {
      arr[i][j] = false;
    }
  }
  return arr;
}

// Pre-defined drop-in patterns.
const GLIDER = make2dArray(3, 3);
GLIDER[0][0] = true;
GLIDER[1][1] = true;
GLIDER[1][2] = true;
GLIDER[2][0] = true;
GLIDER[2][1] = true;

const SMALL_EXPLODER = make2dArray(3, 4);
SMALL_EXPLODER[0][1] = true;
SMALL_EXPLODER[0][2] = true;
SMALL_EXPLODER[1][0] = true;
SMALL_EXPLODER[1][1] = true;
SMALL_EXPLODER[1][3] = true;
SMALL_EXPLODER[2][1] = true;
SMALL_EXPLODER[2][2] = true;

const BIG_EXPLODER = make2dArray(5, 5)
BIG_EXPLODER[0][0] = true;
BIG_EXPLODER[0][1] = true;
BIG_EXPLODER[0][2] = true;
BIG_EXPLODER[0][3] = true;
BIG_EXPLODER[0][4] = true;
BIG_EXPLODER[2][0] = true;
BIG_EXPLODER[2][4] = true;
BIG_EXPLODER[4][0] = true;
BIG_EXPLODER[4][1] = true;
BIG_EXPLODER[4][2] = true;
BIG_EXPLODER[4][3] = true;
BIG_EXPLODER[4][4] = true;

const PATTERNS = [GLIDER, SMALL_EXPLODER, BIG_EXPLODER];

module.exports = Object.freeze({
	PATTERNS: PATTERNS
});