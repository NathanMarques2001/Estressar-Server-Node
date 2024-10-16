const express = require('express');
const { Worker } = require('worker_threads');

const app = express();
const port = 3000;

// Função para criar um novo worker para calcular números primos
function runPrimeWorker(limit) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./primeWorker.js', { workerData: { limit } });  // Envia o limite para o worker
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

// Rota que dispara o cálculo de números primos
app.get('/so', async (req, res) => {
  try {
    const primeLimit = parseInt(req.query.limit, 10) || 100000;  // Pega o parâmetro "limit", padrão é 100000
    const primes = await runPrimeWorker(primeLimit);  // Chama o worker para calcular os primos
    res.json({ primes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


// const express = require('express');
// const { Worker } = require('worker_threads');

// const app = express();
// const port = 3000;

// function runWorker(file, workerData) {
//   return new Promise((resolve, reject) => {
//     const worker = new Worker(file, { workerData });  // Passa o workerData
//     worker.on('message', resolve);
//     worker.on('error', reject);
//     worker.on('exit', (code) => {
//       if (code !== 0) {
//         reject(new Error(`Worker stopped with exit code ${code}`));
//       }
//     });
//   });
// }


// // Implementação de Bubble Sort
// function bubbleSort(arr) {
//   let n = arr.length;
//   for (let i = 0; i < n - 1; i++) {
//     for (let j = 0; j < n - 1 - i; j++) {
//       if (arr[j] > arr[j + 1]) {
//         // Troca os elementos
//         let temp = arr[j];
//         arr[j] = arr[j + 1];
//         arr[j + 1] = temp;
//       }
//     }
//   }
//   return arr;
// }

// async function calculate(primeLimit) {
//   try {
//     // Passa primeLimit para o worker de primos
//     const primePromise = runWorker('./primeWorker.js', { limit: primeLimit });
//     const randomListPromise = runWorker('./randomWorker.js');
//     const memoryStressPromise = runWorker('./memoryWorker.js'); // Worker de memória

//     const [primes, randomList, memoryResult] = await Promise.all([
//       primePromise,
//       randomListPromise,
//       memoryStressPromise
//     ]);

//     bubbleSort(randomList);

//     function findInsertPosition(arr, target) {
//       let left = 0;
//       let right = arr.length;
//       while (left < right) {
//         const mid = Math.floor((left + right) / 2);
//         if (arr[mid] < target) {
//           left = mid + 1;
//         } else {
//           right = mid;
//         }
//       }
//       return left;
//     }

//     const primePositions = primes.map(prime => ({
//       prime,
//       position: findInsertPosition(randomList, prime)
//     }));

//     return { primePositions, memoryResult };
//   } catch (err) {
//     throw new Error(err);
//   }
// }


// // Rota que dispara o cálculo
// app.get('/so', async (req, res) => {
//   try {
//     const primeLimit = parseInt(req.query.limit, 10) || 100000;  // Pega o parâmetro "limit", padrão é 100000
//     const result = await calculate(primeLimit);
//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// // Iniciar o servidor
// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });
