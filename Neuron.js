const sigmoid = require("sigmoid");

module.exports = class Neuron {
    constructor(inputsCount) {
        this.bias = Math.random() * (2 + 2) - 2;
        this.weights = new Array(inputsCount).fill(undefined).map(() => Math.random() * (1 + 1) - 1);
    }

    calculate(inputs) {
        const results = this.weights.map((weight, i) => weight * inputs[i]);
        const sum = results.reduce((a, b) => a + b);
        //console.log("Sum: "+this.weights);
        this.neuronSum = sum + this.bias;
        this.result = sigmoid(this.neuronSum);
        return this.result;
    }

    sigmoid(t) {
        return 1/(1+Math.E**-t);
    }
};