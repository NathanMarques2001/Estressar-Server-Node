const { parentPort } = require('worker_threads');

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

const primes = generatePrimes(100000); // Calcula os primeiros 100.000 primos
parentPort.postMessage(primes);
