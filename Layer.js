const Neuron = require("./Neuron");

module.exports = class Layer {
    constructor(neuronsCount, inputsCount) {
        this.neurons = new Array(neuronsCount).fill(undefined);

        this.neurons = this.neurons.map(() => new Neuron(inputsCount));
    }

    run(inputs) {
        return this.neurons.map(neuron => neuron.calculate(inputs));
    }

    getResults() {
        return this.neurons.map(n => n.result);
    }
};