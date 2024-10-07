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

    // Ordenar a lista de números aleatórios
    randomList.sort((a, b) => a - b);

    // Função de busca binária para encontrar a posição de inserção
    function findInsertPosition(arr, target) {
      let left = 0;
      let right = arr.length;

      while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] < target) {
          left = mid + 1; // Continua a busca na metade direita
        } else {
          right = mid; // Continua a busca na metade esquerda
        }
      }
      
      return left; // Retorna a posição de inserção
    }

    // Verificar onde os números primos ficariam na lista
    const primePositions = primes.map(prime => ({
      prime,
      position: findInsertPosition(randomList, prime)
    }));

    console.log(primePositions);
  } catch (err) {
    console.error(err);
  }
}

main();
