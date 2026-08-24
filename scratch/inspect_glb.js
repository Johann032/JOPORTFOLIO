const fs = require('fs');

const data = fs.readFileSync('public/models/cyber-owl.glb');

// The GLB format has a 12-byte header, then chunks.
// Chunk 0 is always JSON.
const jsonChunkLength = data.readUInt32LE(12);
const jsonString = data.toString('utf8', 20, 20 + jsonChunkLength);

const gltf = JSON.parse(jsonString);

console.log("Meshes:");
gltf.meshes.forEach((m, i) => console.log(`Mesh ${i}: ${m.name}`));

console.log("\nMaterials:");
if (gltf.materials) {
  gltf.materials.forEach((m, i) => {
    console.log(`Material ${i}: ${m.name}`);
    if (m.emissiveFactor) {
      console.log(`  Emissive: ${m.emissiveFactor}`);
    }
  });
}
