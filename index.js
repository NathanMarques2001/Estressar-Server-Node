const express = require('express');
const { Worker } = require('worker_threads');

const app = express();
const port = 3000;

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

// Implementação de Bubble Sort
function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        // Troca os elementos
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}

// Função principal que será chamada no endpoint
async function calculate() {
  try {
    // Criando os dois workers
    const primePromise = runWorker('./primeWorker.js');
    const randomListPromise = runWorker('./randomWorker.js');

    // Esperando o resultado de ambos os workers
    const [primes, randomList] = await Promise.all([primePromise, randomListPromise]);

    // Ordenar a lista de números aleatórios com Bubble Sort
    bubbleSort(randomList);

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

    return primePositions;
  } catch (err) {
    throw new Error(err);
  }
}

// Rota que dispara o cálculo
app.get('/calculate', async (req, res) => {
  try {
    const result = await calculate();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
