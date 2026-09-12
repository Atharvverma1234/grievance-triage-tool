const { pipeline } = require('@xenova/transformers');
const departments = require('../data/departments');

let embedder = null;
let departmentEmbeddings = null;

// Load the embedding model once and pre-compute department embeddings.
// This runs on server startup so requests don't pay the model-load cost.
async function initRag() {
  if (embedder) return; // already initialized

  console.log('Loading embedding model for RAG...');
  embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

  departmentEmbeddings = await Promise.all(
    departments.map(async (d) => {
      const output = await embedder(d.text, { pooling: 'mean', normalize: true });
      return { department: d.department, vector: Array.from(output.data) };
    })
  );
  console.log('RAG embeddings ready.');
}

function cosineSimilarity(a, b) {
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
  return dot; // vectors are already normalized, so dot product = cosine similarity
}

async function retrieveDepartment(complaintSummary) {
  if (!embedder) await initRag(); // safety net if startup init didn't run yet

  const output = await embedder(complaintSummary, { pooling: 'mean', normalize: true });
  const queryVector = Array.from(output.data);

  let best = { department: 'General Administration', score: -1 };
  for (const entry of departmentEmbeddings) {
    const score = cosineSimilarity(queryVector, entry.vector);
    if (score > best.score) {
      best = { department: entry.department, score };
    }
  }
  return best.department;
}

module.exports = { initRag, retrieveDepartment };