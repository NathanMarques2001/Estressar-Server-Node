const { parentPort } = require('worker_threads');

function isPrime(num) {
  if (num < 2) return false;
  for (let i = 2, sqrt = Math.sqrt(num); i <= sqrt; i++) {
    if (num % i === 0) return false;
  }
  return true;
}

function calculatePrimes(limit) {
  const primes = [];
  let num = 2;

  while (primes.length < limit) {
    if (isPrime(num)) {
      primes.push(num);
    }
    num++;
  }

  return primes;
}

const primes = calculatePrimes(100000);
parentPort.postMessage(primes);
