const sigmoidPrime = require("sigmoid-prime");
const matrix = require("node-matrix");
const fs = require("fs");
const imageParser = require("./imageParser");


module.exports =  class Network {
    constructor(layers) {
        this.layers = layers;
        this.outputLayer = this.layers[this.layers.length - 1];
        this.hiddenLayer = this.layers[0];
        this.rate = 0.07;
    }

    run(inputs) {
        let currentInput = inputs;

        this.layers.forEach(layer => {
            currentInput = layer.run(currentInput);
        });

        return currentInput;
    }

    train(inputs, desiredOutput) {
        const output = this.run(inputs);

        const error = output.map((o, i) => desiredOutput[i] - o);

        let deltaHiddenLayer = this.outputLayer.neurons.map((n, i) => n.weights.map(w => w * error[i]));

        let deltaHiddenLayerSum = [];

        deltaHiddenLayer[0].forEach((x, i) => {
            deltaHiddenLayerSum[i] = 0;
            deltaHiddenLayer.forEach((a, b) => {
                deltaHiddenLayerSum[i] += deltaHiddenLayer[b][i];
            });
        });

        let hiddenWeights = this.hiddenLayer.neurons.map((n, neuronIndex) => n.weights.map((w, weightIndex) => w + this.rate * deltaHiddenLayerSum[neuronIndex] * sigmoidPrime(n.neuronSum) * inputs[weightIndex]));

        let outputWeights = this.outputLayer.neurons.map((n, neuronIndex) => n.weights.map((w, weightIndex) => w + this.rate * error[neuronIndex] * sigmoidPrime(n.neuronSum) * this.hiddenLayer.getResults()[weightIndex]));

        for(let i = 0; i < this.hiddenLayer.neurons.length; i++) {
            this.hiddenLayer.neurons[i].weights = hiddenWeights[i];
        }

        for(let i = 0; i < this.outputLayer.neurons.length; i++) {
            this.outputLayer.neurons[i].weights = outputWeights[i];
        }

        return {
            error: error.reduce((a, b) => a + b) / error.length
        };
    }

    save(iteration) {
        const networkConfig = {
            rate: this.rate,
            hidden: {
                weights: this.hiddenLayer.neurons.map(n => n.weights),
                biases: this.hiddenLayer.neurons.map(n => n.bias)
            },
            output: {
                weights: this.outputLayer.neurons.map(n => n.weights),
                biases: this.outputLayer.neurons.map(n => n.bias)
            },
            iteration: iteration
        };

        fs.writeFileSync("config.json", JSON.stringify(networkConfig));
    }

    test() {
        const testImages = imageParser.parse(false);
        let errorsNumber = 0;

        for(let i = 0; i < testImages.length; i++) {
            console.log(" Entry: " + i + " of " + testImages.length + "     Errors: " + errorsNumber);
            let result = this.run(testImages[i].entry).map(x => Math.round(x)).findIndex(x => x === 1);

            if(result !== testImages[i].result) errorsNumber += 1;
        }
        return errorsNumber;
    }

    load() {
        const config = JSON.parse(fs.readFileSync("config.json", "utf8"));

        this.hiddenLayer.neurons.forEach((n,ni) => {
            this.hiddenLayer.neurons[ni].weights = config.hidden.weights[ni];
            this.hiddenLayer.neurons[ni].bias = config.hidden.biases[ni];
        });

        this.outputLayer.neurons.forEach((n,ni) => {
            this.outputLayer.neurons[ni].weights = config.output.weights[ni];
            this.outputLayer.neurons[ni].bias = config.output.biases[ni];
        });

        return config.iteration;
    }
};