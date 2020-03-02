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

const Patterns = require('./patterns');
const Pixel = require('./pixel');
const anypixel = require('anypixel');

// Initial color column width.
const NUM_COLUMNS = 4;

// Color values.
const BLUE = '#4285F4';
const RED = '#DB4437';
const YELLOW = '#F4B400';
const GREEN = '#0F9D58';
const COLORS = [BLUE, RED, YELLOW, GREEN];

// Game of life rule constants.
const MIN_LIVE = 2;
const MAX_LIVE = 3;
const BRING_TO_LIFE = 3;
// Probability that a pixel with a 50% chance of being alive will be alive in
// the next generation.
const RANDOM_LIFE_PROBABILITY = 0.5;
const GENERATION_LIFE = 42;

const RANDOM_DROP_FREQUENCY = 1000;
const NUM_PATTERNS_TO_DROP = 4;

const ctx = anypixel.canvas.getContext2D();

const width = anypixel.config.width;
const height = anypixel.config.height;
const pixelsPerColumn = Math.floor(width / NUM_COLUMNS);

// Maintain a map and a copy of the map. This allows us to 'tick' without
// altering the current state of the map.
let pixelMap = new Array(width);
const pixelMapCopy = new Array(width);

// Initialize the game.
const init = () => {
  // Drop a random pattern when a button is pressed.
  document.addEventListener('onButtonDown', (event) => {
    const x = event.detail.x;
    const y = event.detail.y;
    dropPattern(x, y, colorForX(x));
  });

  populateBoard();

  // Evolve.
  setInterval(() => {
    doConway();
    drawBoard();
  }, GENERATION_LIFE);

  // Randomly drop patterns.
  setInterval(() => {
    for (var i = 0; i < NUM_PATTERNS_TO_DROP; i++) {
      dropRandomPattern()
    }
  }, RANDOM_DROP_FREQUENCY);
}

// Fill the board's initial state.
const populateBoard = () => {
  for (var i = 0; i < width; i++) {
    pixelMap[i] = new Array(height);
    pixelMapCopy[i] = new Array(height);
    for (var j = 0; j < height; j++) {
      const on = !!(Math.random() <= RANDOM_LIFE_PROBABILITY);
      const color = colorForX(i);
      pixelMap[i][j] = new Pixel(on, color);
      pixelMapCopy[i][j] = new Pixel(on, color);
    }
  }
  drawBoard();
}

// Return the color that should be used for a pixel at the provided x position.
const colorForX = (x) => {
  return COLORS[Math.floor(x / pixelsPerColumn) % COLORS.length];
}

// Draw the board from the Pixel array.
const drawBoard = () => {
  for (var i = 0; i < pixelMap.length; i++) {
    for (var j = 0; j < pixelMap[i].length; j++) {
      if (pixelMap[i][j].on) {
        ctx.fillStyle = pixelMap[i][j].color; 
      } else {
        ctx.fillStyle = '#000';
      }
      ctx.fillRect(i, j, 1, 1);
    }
  }
}

// Drop a random pattern at a random location.
const dropRandomPattern = () => {
  const x = Math.floor(Math.random() * width);
  const y = Math.floor(Math.random() * height);
  dropPattern(x, y, colorForX(x));
}

// Drop a random pattern at the coordinates and of the color specified.
const dropPattern = (x, y, color) => {
  const pattern =
      Patterns.PATTERNS[Math.floor(Math.random() * Patterns.PATTERNS.length)];
  for (var i = 0; i < pattern.length; i++) {
    for (var j = 0; j < pattern[i].length; j++) {
      const newx = x + i;
      const newy = y + j;
      if (newx < width && newy < height) {
        if (pattern[i][j]) {
          ctx.fillStyle = color;
          ctx.fillRect(newx, newy, 1, 1);
          pixelMap[newx][newy].on = true;
          pixelMap[newx][newy].color = color;
        } else {
          ctx.fillStyle = '#000';
          ctx.fillRect(newx, newy, 1, 1);
          pixelMap[newx][newy].on = false;
          pixelMap[newx][newy].color = color;
        }
      }
    }
  }
}

// Iterate one generation of the game.
const doConway = () => {
  for (var i = 0; i < width; i++) {
    for (var j = 0; j < height; j++) {
      neighborInfo = countNeighbors(i, j);
      liveNeighbors = neighborInfo[0];
      winningColor = neighborInfo[1];
      pixel = pixelMap[i][j];
      pixelCopy = pixelMapCopy[i][j];
      if (pixel.on && (liveNeighbors < MIN_LIVE || liveNeighbors > MAX_LIVE)) {
        pixelCopy.on = false;
      } else if (!pixel.on && liveNeighbors == BRING_TO_LIFE) {
        pixelCopy.on = true;
      } else {
        pixelCopy.on = pixel.on;
      }
      pixelCopy.color = winningColor;
    }
  }
  pixelMap = deepCopy(pixelMapCopy);
}

// Count the live neighbors of a particular cell. Returns an array of
// [live_neighbors, dominant_color].
const countNeighbors = (x, y) => {
  let count = 0;
  const colorMap = {
    [BLUE]: 0,
    [RED]: 0,
    [YELLOW]: 0,
    [GREEN]: 0
  };

  for (var i = -1; i < 2; i++) {
    for (var j = -1; j < 2; j++) {
      if (i == 0 && i == j) {
        continue;
      }
      var newx = x+i;
      var newy = y+j;
      if ((newx > -1 && newy > -1 && newx < width && newy < height) &&
          pixelMap[newx][newy].on) {
        count++;
        colorMap[pixelMap[newx][newy].color]++;
      }
    }
  }

  let max = 0;
  Object.keys(colorMap).forEach(function(key) {
    if (colorMap[key] > max) {
      max = colorMap[key];
    }
  });

  const maxes = new Array();
  Object.keys(colorMap).forEach(function(key) {
    if (colorMap[key] == max) {
      maxes.push(key);
    }
  });

  if (maxes.length == 1) {
    return [count, maxes[0]];
  } else {
    winner = Math.floor(Math.random() * maxes.length)
    return [count, maxes[winner]];
  }
}

// Deep copy the provided 2d map.
const deepCopy = (map) => {
  const newMap = new Array();
  for (var i = 0; i < map.length; i++) {
    newMap[i] = new Array(map[i].length);
    for (var j = 0; j < map[i].length; j++) {
      newMap[i][j] = map[i][j].deepCopy();
    }
  }
  return newMap;
}

init();