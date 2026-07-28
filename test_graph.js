const fs = require('fs');

const nodes = {
  'r-alibaba': [345, 245],
  'node-alibaba-road': [335, 245],
  'node-family-hub': [250, 260],
  'node-family-entry-road': [290, 310],
  'node-lake-w-mid': [305, 330],
  'node-lake-nw-1': [350, 335],
  'node-thriller-entry-road': [405, 335],
  'node-thriller-curve-1': [425, 300],
  'node-thriller-hub': [450, 260],
  'node-drop-road-1': [495, 305],
  'node-drop-entrance-road': [515, 345],
  'r-drop': [545, 345],
  'node-merch-road-1': [500, 365],
  'node-merch-road-2': [550, 400],
  'node-north-mountain-west': [535, 430],
  'node-north-mountain-center': [540, 500],
  'node-north-mountain-east': [535, 580],
  'node-dino-road-1': [495, 715],
  'node-dino-road-2': [535, 675],
  'node-dino-entrance-road': [565, 660],
  'r-dino': [585, 660],
  'node-castle-bridge-w': [405, 410],
  'node-castle-plaza-front': [425, 500],
  'node-castle-bridge-e': [405, 590],
  'node-lake-nw-2': [395, 350],
  'node-lake-ne-2': [395, 650],
};

function calcDist(a, b) {
  const dy = a[0] - b[0];
  const dx = a[1] - b[1];
  return Math.sqrt(dx * dx + dy * dy);
}

const edges = [
  ['r-alibaba', 'node-alibaba-road'],
  ['node-alibaba-road', 'node-family-hub'],
  ['node-family-hub', 'node-family-entry-road'],
  ['node-family-entry-road', 'node-lake-w-mid'],
  ['node-lake-w-mid', 'node-lake-nw-1'],
  ['node-lake-nw-1', 'node-thriller-entry-road'],
  ['node-thriller-entry-road', 'node-thriller-curve-1'],
  ['node-thriller-curve-1', 'node-thriller-hub'],
  ['node-thriller-hub', 'node-drop-road-1'],
  ['node-drop-road-1', 'node-drop-entrance-road'],
  ['node-drop-entrance-road', 'r-drop'],
  ['node-drop-entrance-road', 'node-merch-road-1'],
  ['node-merch-road-1', 'node-merch-road-2'],
  ['node-merch-road-2', 'node-north-mountain-west'],
  ['node-north-mountain-west', 'node-north-mountain-center'],
  ['node-north-mountain-center', 'node-north-mountain-east'],
  ['node-north-mountain-east', 'node-dino-road-1'],
  ['node-dino-road-1', 'node-dino-road-2'],
  ['node-dino-road-2', 'node-dino-entrance-road'],
  ['node-dino-entrance-road', 'r-dino'],

  // Castle bridges with congestion penalty weight (theme park castle bridge congestion)
  ['node-lake-nw-2', 'node-castle-bridge-w'],
  ['node-castle-bridge-w', 'node-castle-plaza-front'],
  ['node-castle-plaza-front', 'node-castle-bridge-e'],
  ['node-castle-bridge-e', 'node-lake-ne-2'],
];

const adj = {};
Object.keys(nodes).forEach(n => adj[n] = []);

edges.forEach(([u, v]) => {
  if (nodes[u] && nodes[v]) {
    let w = calcDist(nodes[u], nodes[v]);
    if (u.includes('castle-bridge') || v.includes('castle-bridge')) {
      w += 150; // Bridge crowd congestion penalty
    }
    adj[u].push({ to: v, w });
    adj[v].push({ to: u, w });
  }
});

function dijkstra(start, target) {
  const distances = {};
  const previous = {};
  const unvisited = new Set(Object.keys(nodes));
  Object.keys(nodes).forEach(n => { distances[n] = Infinity; previous[n] = null; });
  distances[start] = 0;

  while (unvisited.size > 0) {
    let current = null;
    let minD = Infinity;
    unvisited.forEach(id => {
      if (distances[id] < minD) {
        minD = distances[id];
        current = id;
      }
    });

    if (!current || minD === Infinity || current === target) break;
    unvisited.delete(current);

    (adj[current] || []).forEach(edge => {
      if (unvisited.has(edge.to)) {
        const alt = distances[current] + edge.w;
        if (alt < distances[edge.to]) {
          distances[edge.to] = alt;
          previous[edge.to] = current;
        }
      }
    });
  }

  const path = [];
  let curr = target;
  while (curr) {
    path.unshift(curr);
    curr = previous[curr];
  }
  return { path, total: distances[target] };
}

console.log('Alibaba to Dino (New Graph):', dijkstra('r-alibaba', 'r-dino'));
