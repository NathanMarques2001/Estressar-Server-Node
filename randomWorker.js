const { parentPort } = require('worker_threads');

function generateRandomNumbers(limit, maxValue) {
  const randomNumbers = [];
  for (let i = 0; i < limit; i++) {
    randomNumbers.push(Math.floor(Math.random() * maxValue));
  }
  return randomNumbers;
}

const randomList = generateRandomNumbers(100000, 2000000); // Gera 100.000 números aleatórios até 2.000.000
parentPort.postMessage(randomList);
