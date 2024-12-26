const pixelWidth = res / spaces;

function showGrid(boxTotal, resolution, ignore) {
    if (ignore) {
        let boxSize = resolution / boxTotal;
        let weight;
        if (boxTotal <= 12) {weight = 3;}
        else if (boxTotal > 12 && boxTotal <= 45) {weight = 2;}
        else if (boxTotal > 45) {weight = 1;}
        for (let i = 1; i < boxTotal; i++)
        {
            line(boxSize * i, res, boxSize * i, 0);
            strokeWeight(weight);
        }
        for (let j = 1; j < boxTotal; j++)
        {
            line(0, boxSize * j, res, boxSize * j);
            strokeWeight(weight);
        }
    }
}

function make2dArray (spacesPerSide) {
    let array = [];
    for (let i = 0; i < spacesPerSide; i++) 
    {
        array[i] = [];
        for (let j = 0; j < spacesPerSide; j++)
        {
            array[i][j] = 0;
        }
    }
    return array
}

function randomizeArray(array, probabilityOfTen) {
    for (let i = 0; i < array.length; i++)
    {
        for (let j = 0; j < array[0].length; j++)
        {
            if (Math.floor(Math.random() * 10) <= probabilityOfTen - 1) {array[i][j] = 1;}
        }
    }
    return array
}

function boxFill(boxTotal, resolution, row, col) {
    fill(0);
    square(col * (resolution / boxTotal), row * (resolution / boxTotal), resolution / boxTotal);
}

function arrayShow(array, boxTotal, resolution) {
    for (let i = 0; i < array.length; i++)
    {
        for (let j = 0; j < array[0].length; j++)
        {
            if (array[i][j] == 1) {
                boxFill(boxTotal, resolution, i, j);
            }
        }
    }
}



// OPTIMIZATION
// if there is a row of the array full of 1s, that array and the following ones dont need to be checked
// if there is a row full of 0s, it doesnt need to be checked

let noCheckLine = 0;

function searchLower(array, y, x) {
    direction = 0;
    for (let i = 1, finished = 0; i < spaces && finished == 0; i++)
    {
        if (array[y + 1][x + i] == 0) {finished++; direction = 1;}
        else if (array[y + 1][x - i] == 0) {finished++; direction = -1;}
    }
    return direction;
}

function nextFrame(array) {
    for (let i = array.length - 2 - noCheckLine; i >= 0; i--)
    {
        let noSpace = 0;
        for (let j = array[0].length; j >= 0; j--)
        {
            if (array[i][j] == 1 && array[i + 1][j] == 0) {
                array[i + 1][j] = 1;
                array[i][j] = 0;
            }
            else if (array[i][j] == 1 && array[i + 1][j] == 1)
            {
                // if some side is empty and not in border
                if ((array[i][j + 1] == 0 || array[i][j - 1] == 0) && (j != 0) && (j != array[0].length - 1)) {
                    array[i][j] = 0;
                    // if both sides are empty
                    if (array[i][j + 1] == 0 && array[i][j - 1] == 0) {
                        let moveTo = searchLower(array, i, j);
                        Math.floor(Math.random() * 10) <= 7 ? array[i][j + moveTo] = 1 : array[i][j - moveTo] = 1;
                    }
                    // if right side is empty
                    else if (array[i][j + 1] == 0) {array[i][j + 1] = 1;}
                    // if left side is empty
                    else if (array[i][j - 1] == 0) {array[i][j - 1] = 1;}
                }
                // if in border
                else if (j == 0 || j == array[0].length - 1) {
                    // left border
                    if (j == 0 && array[i][j + 1] == 0) {
                        array[i][j] = 0;
                        array[i][j + 1] = 1;
                    } else if (j == 0 && array[i][j + 1] == 1) {noSpace++;}
                    // right border
                    if (j == array[0].length - 1 && array[i][j - 1] == 0) {
                        array[i][j] = 0;
                        array[i][j - 1] = 1;
                    } else if (j == array[0].length - 1 && array[i][j - 1] == 1) {noSpace++;}
                }
                // if cannot move
                else if (array[i][j + 1] == 1 && array[i][j - 1] == 1) {noSpace++;}
                if (noSpace == array[0].length - 1) {noCheckLine = array.length - i - 1}
            }
        }
    }
    return array;
}

let randomArray = randomizeArray(make2dArray(spaces), totalPercent);

function toggle(button) {
    if (button.value == "OFF") {
        button.value = "ON";
    } else {
        button.value = "OFF";
    }
}

function setup() {
    createCanvas(res, res);
}

function draw() {
    background(200);
    showGrid(spaces, res, document.getElementById("grid").value == "ON");
    arrayShow(randomArray, spaces, res);
    let nextRandomArray = nextFrame(make2dArray(spaces));
    arrayShow(nextFrame(randomArray), spaces, res);
}

