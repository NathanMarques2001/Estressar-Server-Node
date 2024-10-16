const { parentPort, workerData } = require('worker_threads');

function generatePrimes(limit) {
  const primes = [];
  let num = 2;
  while (primes.length < limit) {
    if (isPrime(num)) primes.push(num);
    num++;
  }
  return primes;
}

function isPrime(num) {
  for (let i = 2, sqrt = Math.sqrt(num); i <= sqrt; i++) {
    if (num % i === 0) return false;
  }
  return num > 1;
}

// Use o limite passado pelos dados do worker
const primes = generatePrimes(workerData.limit); 
parentPort.postMessage(primes);
