const fs = require("fs");

const dataFileBuffer = fs.readFileSync(__dirname + '/train-images-idx3-ubyte');
const labelFileBuffer = fs.readFileSync(__dirname + '/train-labels-idx1-ubyte');

const dataFileBufferTest = fs.readFileSync(__dirname + '/t10k-images-idx3-ubyte');
const labelFileBufferTest = fs.readFileSync(__dirname + '/t10k-labels-idx1-ubyte');


module.exports.parse = (train = true) => {
    let pixelValues     = [];

    /*let dataFileBuffer;
    let labelFileBuffer;
    let length;*/

    let data;
    let label;
    let length;

    if(train) {
        data = dataFileBuffer;
        label = labelFileBuffer;
        length = 59999;
    }
    else {
        length = 9999;
        data = dataFileBufferTest;
        label = labelFileBufferTest;
    }

    //if(train) {

    //}
    /*else {
        length = 9999;
        dataFileBuffer = fs.readFileSync(__dirname + '/t10k-images-idx3-ubyte');
        labelFileBuffer = fs.readFileSync(__dirname + '/t10k-labels-idx1-ubyte');
    }*/

    for (let image = 0; image <= length; image++) {
        let pixels = [];

        for (let x = 0; x <= 27; x++) {
            for (let y = 0; y <= 27; y++) {
                pixels.push(data[(image * 28 * 28) + (x + (y * 28)) + 15]);
            }
        }

        let desired = JSON.stringify(label[image + 8]);
        let desiredArray = [];

        for(let i = 0; i < 10; i++) {
            if(i === parseInt(desired)) {
                desiredArray.push(1);
            }
            else {
                desiredArray.push(0);
            }
        }
        let imageData = {};
        imageData.entry = pixels.map(x => x/255);
        imageData.desired = desiredArray;
        imageData.result = parseInt(desired);

        pixelValues.push(imageData);
    }
    return pixelValues;

};