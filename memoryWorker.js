const { parentPort } = require('worker_threads');

function stressMemory(sizeInMB) {
  const memoryBlocks = [];
  const blockSize = 1024 * 1024; // 1MB por bloco
  
  for (let i = 0; i < sizeInMB; i++) {
    memoryBlocks.push(Buffer.alloc(blockSize, 'a')); // Aloca 1MB de memória
  }

  // Mantém os dados na memória para impedir que o GC libere
  parentPort.postMessage({ status: 'Memory allocated', size: sizeInMB });
}

const sizeInMB = 5000; // Defina a quantidade de memória para alocar (5GB)
stressMemory(sizeInMB);
