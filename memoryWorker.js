const { parentPort } = require('worker_threads');

function stressMemory(sizeInMB, durationInSeconds) {
  const memoryBlocks = [];
  const blockSize = 1024 * 1024; // 1MB por bloco

  // Função que aloca memória em intervalos
  const interval = setInterval(() => {
    for (let i = 0; i < sizeInMB; i++) {
      memoryBlocks.push(Buffer.alloc(blockSize, 'a')); // Aloca 1MB de memória
    }

    parentPort.postMessage({ status: 'Memory allocated', size: memoryBlocks.length });

  }, 1000); // Preenche 5GB de memória a cada segundo

  // Finaliza o processo de alocação após a duração especificada
  setTimeout(() => {
    clearInterval(interval);
    parentPort.postMessage({ status: 'Memory allocation completed', size: memoryBlocks.length });
  }, durationInSeconds * 1000); // Duração total em segundos
}

// Exemplo: Preencher 500MB por 30 segundos (ajustável)
const sizeInMB = 500;
const durationInSeconds = 30;
stressMemory(sizeInMB, durationInSeconds);
