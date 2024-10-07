const { Worker } = require('worker_threads');

// Função para criar um novo worker
function runWorker(file) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(file);
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

async function main() {
  try {
    // Criando os dois workers
    const primePromise = runWorker('./primeWorker.js');
    const randomListPromise = runWorker('./randomWorker.js');

    // Esperando o resultado de ambos os workers
    const [primes, randomList] = await Promise.all([primePromise, randomListPromise]);

    console.log(`Primeiros 100.000 números primos calculados.`);
    console.log(`Lista de números aleatórios até 2.000.000 gerada.`);

    // Ordenar a lista de primos do maior para o menor
    const sortedPrimes = primes.sort((a, b) => b - a);

    // Função de busca binária
    function binarySearch(arr, target) {
      let left = 0;
      let right = arr.length - 1;
      
      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
      }
      
      return -1; // Se o número primo não estiver na lista
    }

    // Verificar onde os números primos estão na lista
    const primePositions = sortedPrimes.map(prime => ({
      prime,
      position: binarySearch(randomList, prime)
    }));

    console.log(primePositions);
  } catch (err) {
    console.error(err);
  }
}

main();
