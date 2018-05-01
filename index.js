const imageParser = require("./imageParser");
const Network = require("./Network");
const Layer = require("./Layer");
const images = imageParser.parse(true);

const network = new Network([new Layer(15, 784), new Layer(10, 15)]);

let iteration = network.load();

//let iteration = 1;

for(let x = iteration - 1; x < 5; x++) {
    iteration = x + 1;
    for (let i = 0; i < images.length; i++) {
        network.train(images[i].entry, images[i].desired);
        console.log("Iteration: " + iteration + " Entry: " + i + " of " + images.length);
    }
    network.save(iteration + 1);
}


console.log(network.test());

//console.log("\n Result: " + network.run(images[0].entry).map(x => Math.round(x)).findIndex(x => x === 1));
