'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ============================================
// TYPE DEFINITIONS
// ============================================

type CellType = 'empty' | 'wall' | 'start' | 'end';
type CellState = 'unvisited' | 'visiting' | 'visited' | 'path';

interface Cell {
  row: number;
  col: number;
  type: CellType;
  state: CellState;
  g: number; // Distance from start
  h: number; // Heuristic distance to end
  f: number; // f = g + h
  parent: Cell | null;
  amplitude?: number; // Wave amplitude for QIAP
}

interface AlgorithmStats {
  nodesExplored: number;
  pathLength: number;
  executionTime: number;
  status: 'idle' | 'running' | 'completed' | 'no-path';
}

type AlgorithmStep = {
  current?: Cell;
  visited?: Cell[];
  path?: Cell[];
  stats: AlgorithmStats;
};

interface Maze {
  grid: Cell[][];
  start: { row: number; col: number };
  end: { row: number; col: number };
}

// ============================================
// PRIORITY QUEUE (MIN HEAP)
// ============================================

class PriorityQueue<T> {
  private heap: T[] = [];

  constructor(private compareFn: (a: T, b: T) => number) {}

  enqueue(item: T): void {
    this.heap.push(item);
    this.bubbleUp(this.heap.length - 1);
  }

  dequeue(): T | null {
    if (this.heap.length === 0) return null;
    const min = this.heap[0];
    const end = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = end;
      this.bubbleDown(0);
    }
    return min;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  private bubbleUp(index: number): void {
    const element = this.heap[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];
      if (this.compareFn(element, parent) >= 0) break;
      this.heap[index] = parent;
      index = parentIndex;
    }
    this.heap[index] = element;
  }

  private bubbleDown(index: number): void {
    const length = this.heap.length;
    const element = this.heap[index];

    while (true) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      let swap = null;

      if (leftChildIndex < length) {
        const leftChild = this.heap[leftChildIndex];
        if (this.compareFn(leftChild, element) < 0) {
          swap = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        const rightChild = this.heap[rightChildIndex];
        if (
          (swap === null && this.compareFn(rightChild, element) < 0) ||
          (swap !== null && this.compareFn(rightChild, this.heap[leftChildIndex]) < 0)
        ) {
          swap = rightChildIndex;
        }
      }

      if (swap === null) break;
      this.heap[index] = this.heap[swap];
      index = swap;
    }

    this.heap[index] = element;
  }
}

// ============================================
// MAZE GENERATION
// ============================================

class MazeGenerator {
  static generateRandomMaze(rows: number, cols: number): Maze {
    const grid: Cell[][] = Array(rows)
      .fill(null)
      .map((_, row) =>
        Array(cols)
          .fill(null)
          .map((_, col) => ({
            row,
            col,
            type: Math.random() > 0.7 ? 'wall' : 'empty',
            state: 'unvisited' as CellState,
            g: Infinity,
            h: 0,
            f: Infinity,
            parent: null,
          }))
      );

    // Create a connected maze using DFS from a random point
    const visited: boolean[][] = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(false));

    const emptyCells: { row: number; col: number }[] = [];

    function dfs(r: number, c: number): void {
      visited[r][c] = true;
      grid[r][c].type = 'empty';
      emptyCells.push({ row: r, col: c });

      const directions = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ].sort(() => Math.random() - 0.5);

      for (const [dr, dc] of directions) {
        const newRow = r + dr;
        const newCol = c + dc;

        if (
          newRow >= 0 &&
          newRow < rows &&
          newCol >= 0 &&
          newCol < cols &&
          !visited[newRow][newCol] &&
          Math.random() > 0.3
        ) {
          dfs(newRow, newCol);
        }
      }
    }

    // Start DFS from a random point
    const randomStartRow = Math.floor(Math.random() * rows);
    const randomStartCol = Math.floor(Math.random() * cols);
    dfs(randomStartRow, randomStartCol);

    // Get all empty cells
    const availableCells = emptyCells.filter(
      (cell) => grid[cell.row][cell.col].type === 'empty'
    );

    if (availableCells.length < 2) {
      // Fallback: use corners if not enough empty cells
      const startRow = 0;
      const startCol = 0;
      const endRow = rows - 1;
      const endCol = cols - 1;
      grid[startRow][startCol].type = 'start';
      grid[endRow][endCol].type = 'end';

      return {
        grid,
        start: { row: startRow, col: startCol },
        end: { row: endRow, col: endCol },
      };
    }

    // Randomly select start point
    const startIdx = Math.floor(Math.random() * availableCells.length);
    const start = availableCells[startIdx];
    availableCells.splice(startIdx, 1);

    // Select end point that's reasonably far from start (at least 30% of grid diagonal distance)
    const minDistance = Math.sqrt(rows * rows + cols * cols) * 0.3;
    const endCandidates = availableCells.filter((cell) => {
      const distance = Math.sqrt(
        Math.pow(cell.row - start.row, 2) + Math.pow(cell.col - start.col, 2)
      );
      return distance >= minDistance;
    });

    const endCandidatesToUse = endCandidates.length > 0 ? endCandidates : availableCells;
    const endIdx = Math.floor(Math.random() * endCandidatesToUse.length);
    const end = endCandidatesToUse[endIdx];

    // Set start and end types
    grid[start.row][start.col].type = 'start';
    grid[end.row][end.col].type = 'end';

    return {
      grid,
      start: { row: start.row, col: start.col },
      end: { row: end.row, col: end.col },
    };
  }
}

// ============================================
// PATHFINDING ALGORITHMS
// ============================================

class PathfindingAlgorithms {
  static getNeighbors(cell: Cell, grid: Cell[][], rows: number, cols: number): Cell[] {
    const neighbors: Cell[] = [];
    const directions = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];

    for (const [dr, dc] of directions) {
      const newRow = cell.row + dr;
      const newCol = cell.col + dc;

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        grid[newRow][newCol].type !== 'wall'
      ) {
        neighbors.push(grid[newRow][newCol]);
      }
    }

    return neighbors;
  }

  static manhattanDistance(cell1: Cell, cell2: Cell): number {
    return Math.abs(cell1.row - cell2.row) + Math.abs(cell1.col - cell2.col);
  }

  static reconstructPath(endCell: Cell): Cell[] {
    const path: Cell[] = [];
    let current: Cell | null = endCell;
    while (current !== null) {
      path.unshift(current);
      current = current.parent;
    }
    return path;
  }

  static* dijkstra(maze: Maze, rows: number, cols: number): Generator<AlgorithmStep> {
    const { grid, start, end } = maze;
    const stats: AlgorithmStats = {
      nodesExplored: 0,
      pathLength: 0,
      executionTime: 0,
      status: 'running',
    };

    const startTime = performance.now();

    // Reset grid
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        grid[row][col].g = Infinity;
        grid[row][col].state = 'unvisited';
        grid[row][col].parent = null;
      }
    }

    const startCell = grid[start.row][start.col];
    startCell.g = 0;
    startCell.state = 'visiting';

    const openSet = new PriorityQueue<Cell>((a, b) => a.g - b.g);
    openSet.enqueue(startCell);

    const visited: Cell[] = [];

    while (!openSet.isEmpty()) {
      const current = openSet.dequeue()!;

      if (current === grid[end.row][end.col]) {
        const path = this.reconstructPath(current);
        stats.nodesExplored = visited.length;
        stats.pathLength = current.g;
        stats.executionTime = performance.now() - startTime;
        stats.status = 'completed';

        yield { path, stats };
        return;
      }

      current.state = 'visited';
      visited.push(current);
      stats.nodesExplored = visited.length;

      yield { current, visited: [...visited], stats };

      const neighbors = this.getNeighbors(current, grid, rows, cols);

      for (const neighbor of neighbors) {
        if (neighbor.state === 'visited') continue;

        const tentativeG = current.g + 1;

        if (tentativeG < neighbor.g) {
          neighbor.parent = current;
          neighbor.g = tentativeG;

          if (neighbor.state !== 'visiting') {
            neighbor.state = 'visiting';
            openSet.enqueue(neighbor);
          }
        }
      }
    }

    stats.executionTime = performance.now() - startTime;
    stats.status = 'no-path';
    yield { stats };
  }

  static* aStar(maze: Maze, rows: number, cols: number): Generator<AlgorithmStep> {
    const { grid, start, end } = maze;
    const stats: AlgorithmStats = {
      nodesExplored: 0,
      pathLength: 0,
      executionTime: 0,
      status: 'running',
    };

    const startTime = performance.now();
    const endCell = grid[end.row][end.col];

    // Reset grid
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        grid[row][col].g = Infinity;
        grid[row][col].h = 0;
        grid[row][col].f = Infinity;
        grid[row][col].state = 'unvisited';
        grid[row][col].parent = null;
      }
    }

    const startCell = grid[start.row][start.col];
    startCell.g = 0;
    startCell.h = this.manhattanDistance(startCell, endCell);
    startCell.f = startCell.g + startCell.h;
    startCell.state = 'visiting';

    const openSet = new PriorityQueue<Cell>((a, b) => {
      if (a.f !== b.f) return a.f - b.f;
      return a.h - b.h;
    });
    openSet.enqueue(startCell);

    const visited: Cell[] = [];

    while (!openSet.isEmpty()) {
      const current = openSet.dequeue()!;

      if (current === endCell) {
        const path = this.reconstructPath(current);
        stats.nodesExplored = visited.length;
        stats.pathLength = current.g;
        stats.executionTime = performance.now() - startTime;
        stats.status = 'completed';

        yield { path, stats };
        return;
      }

      current.state = 'visited';
      visited.push(current);
      stats.nodesExplored = visited.length;

      yield { current, visited: [...visited], stats };

      const neighbors = this.getNeighbors(current, grid, rows, cols);

      for (const neighbor of neighbors) {
        if (neighbor.state === 'visited') continue;

        const tentativeG = current.g + 1;
        const h = this.manhattanDistance(neighbor, endCell);

        if (tentativeG < neighbor.g) {
          neighbor.parent = current;
          neighbor.g = tentativeG;
          neighbor.h = h;
          neighbor.f = neighbor.g + neighbor.h;

          // Always enqueue to update priority if already in queue
          if (neighbor.state !== 'visiting') {
            neighbor.state = 'visiting';
          }
          openSet.enqueue(neighbor);
        }
      }
    }

    stats.executionTime = performance.now() - startTime;
    stats.status = 'no-path';
    yield { stats };
  }

  static* explorationFirstOptimal(maze: Maze, rows: number, cols: number): Generator<AlgorithmStep> {
    const { grid, start, end } = maze;
    const stats: AlgorithmStats = {
      nodesExplored: 0,
      pathLength: 0,
      executionTime: 0,
      status: 'running',
    };

    const startTime = performance.now();
    const startCell = grid[start.row][start.col];
    let discoveredEnd: Cell | null = null;

    // PHASE 1: Fast Exploration - Discover goal using BFS (fast, no heuristics needed)
    // PHASE 2: Once goal found, use A* for fastest path (faster than Dijkstra!)
    
    // Reset grid for exploration
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        grid[row][col].state = 'unvisited';
        grid[row][col].parent = null;
        grid[row][col].g = Infinity;
        grid[row][col].h = 0;
        grid[row][col].f = Infinity;
      }
    }

    // Phase 1: Fast BFS exploration to find goal
    const explorationQueue: Cell[] = [startCell];
    const explorationVisited: Set<string> = new Set();
    const explorationParent: Map<string, Cell | null> = new Map();
    const explorationDist: Map<string, number> = new Map();
    
    const startKey: string = `${start.row},${start.col}`;
    explorationDist.set(startKey, 0);
    explorationParent.set(startKey, null);
    startCell.state = 'visiting';
    const allVisited: Cell[] = [];

    // Fast exploration phase
    while (explorationQueue.length > 0) {
      const current = explorationQueue.shift()!;
      const currentKey: string = `${current.row},${current.col}`;

      if (current.type === 'end') {
        // Goal discovered! Now switch to A* for fastest path
        discoveredEnd = current;
        
        // Reset for A* optimal path finding
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            grid[row][col].g = Infinity;
            grid[row][col].h = 0;
            grid[row][col].f = Infinity;
            grid[row][col].parent = null;
            // Keep visited state for visualization
          }
        }

        startCell.g = 0;
        startCell.h = this.manhattanDistance(startCell, discoveredEnd);
        startCell.f = startCell.g + startCell.h;
        startCell.state = 'visiting';

        // Use A* now that we know where the goal is (faster than Dijkstra!)
        const aStarQueue = new PriorityQueue<Cell>((a, b) => {
          if (a.f !== b.f) return a.f - b.f;
          return a.h - b.h; // Tie-breaking with heuristic
        });

        aStarQueue.enqueue(startCell);
        const aStarVisited: Cell[] = [];

        while (!aStarQueue.isEmpty()) {
          const aCurrent = aStarQueue.dequeue()!;

          if (aCurrent === discoveredEnd) {
            // Found fastest path using A*!
            const path = this.reconstructPath(aCurrent);
            stats.nodesExplored = allVisited.length + aStarVisited.length;
            stats.pathLength = aCurrent.g;
            stats.executionTime = performance.now() - startTime;
            stats.status = 'completed';
            yield { path, stats };
            return;
          }

          aCurrent.state = 'visited';
          aStarVisited.push(aCurrent);
          allVisited.push(aCurrent);
          stats.nodesExplored = allVisited.length;

          yield { current: aCurrent, visited: [...allVisited], stats };

          const neighbors = this.getNeighbors(aCurrent, grid, rows, cols);

          for (const neighbor of neighbors) {
            if (aStarVisited.includes(neighbor)) continue;

            const tentativeG = aCurrent.g + 1;
            const h = this.manhattanDistance(neighbor, discoveredEnd);

            if (tentativeG < neighbor.g) {
              neighbor.parent = aCurrent;
              neighbor.g = tentativeG;
              neighbor.h = h;
              neighbor.f = neighbor.g + neighbor.h;

              if (neighbor.state !== 'visiting') {
                neighbor.state = 'visiting';
                aStarQueue.enqueue(neighbor);
              } else {
                // Re-enqueue to update priority
                aStarQueue.enqueue(neighbor);
              }
            }
          }
        }

        // Fallback: use exploration path if A* somehow fails
        const fallbackPath: Cell[] = [];
        let node: Cell | null = current;
        while (node) {
          fallbackPath.unshift(node);
          const nodeKey: string = `${node.row},${node.col}`;
          node = explorationParent.get(nodeKey) || null;
        }

        stats.nodesExplored = allVisited.length;
        stats.pathLength = explorationDist.get(currentKey) || 0;
        stats.executionTime = performance.now() - startTime;
        stats.status = 'completed';
        yield { path: fallbackPath, stats };
        return;
      }

      current.state = 'visited';
      allVisited.push(current);
      explorationVisited.add(currentKey);
      stats.nodesExplored = allVisited.length;

      yield { current, visited: [...allVisited], stats };

      const neighbors = this.getNeighbors(current, grid, rows, cols);
      const currentDist = explorationDist.get(currentKey) || 0;

      for (const neighbor of neighbors) {
        const neighborKey: string = `${neighbor.row},${neighbor.col}`;
        
        if (explorationVisited.has(neighborKey)) continue;

        const tentativeDist = currentDist + 1;
        const existingDist = explorationDist.get(neighborKey) || Infinity;

        if (tentativeDist < existingDist) {
          explorationDist.set(neighborKey, tentativeDist);
          explorationParent.set(neighborKey, current);

          if (neighbor.state !== 'visiting' && neighbor.state !== 'visited') {
            neighbor.state = 'visiting';
            explorationQueue.push(neighbor);
          }
        }
      }
    }

    stats.executionTime = performance.now() - startTime;
    stats.status = 'no-path';
    yield { stats };
  }
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function FastestPathPage() {
  const ROWS = 25;
  const COLS = 25;

  const [maze, setMaze] = useState<Maze | null>(null);
  const [speed, setSpeed] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [dijkstraStats, setDijkstraStats] = useState<AlgorithmStats>({
    nodesExplored: 0,
    pathLength: 0,
    executionTime: 0,
    status: 'idle',
  });

  const [aStarStats, setAStarStats] = useState<AlgorithmStats>({
    nodesExplored: 0,
    pathLength: 0,
    executionTime: 0,
    status: 'idle',
  });

  const [bidirectionalStats, setBidirectionalStats] = useState<AlgorithmStats>({
    nodesExplored: 0,
    pathLength: 0,
    executionTime: 0,
    status: 'idle',
  });

  const [dijkstraPath, setDijkstraPath] = useState<Cell[]>([]);
  const [aStarPath, setAStarPath] = useState<Cell[]>([]);
  const [bidirectionalPath, setBidirectionalPath] = useState<Cell[]>([]);
  const [dijkstraVisited, setDijkstraVisited] = useState<Set<string>>(new Set());
  const [aStarVisited, setAStarVisited] = useState<Set<string>>(new Set());
  const [bidirectionalVisited, setBidirectionalVisited] = useState<Set<string>>(new Set());
  const [dijkstraCurrent, setDijkstraCurrent] = useState<Cell | null>(null);
  const [aStarCurrent, setAStarCurrent] = useState<Cell | null>(null);
  const [bidirectionalCurrent, setBidirectionalCurrent] = useState<Cell | null>(null);

  const dijkstraGenRef = useRef<Generator<AlgorithmStep> | null>(null);
  const aStarGenRef = useRef<Generator<AlgorithmStep> | null>(null);
  const bidirectionalGenRef = useRef<Generator<AlgorithmStep> | null>(null);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize maze
  useEffect(() => {
    generateMaze();
  }, []);

  const generateMaze = () => {
    const newMaze = MazeGenerator.generateRandomMaze(ROWS, COLS);
    setMaze(newMaze);
    resetVisualization();
  };

  const resetVisualization = () => {
    setIsRunning(false);
    setIsPaused(false);
    setDijkstraStats({
      nodesExplored: 0,
      pathLength: 0,
      executionTime: 0,
      status: 'idle',
    });
    setAStarStats({
      nodesExplored: 0,
      pathLength: 0,
      executionTime: 0,
      status: 'idle',
    });
    setBidirectionalStats({
      nodesExplored: 0,
      pathLength: 0,
      executionTime: 0,
      status: 'idle',
    });
    setDijkstraPath([]);
    setAStarPath([]);
    setBidirectionalPath([]);
    setDijkstraVisited(new Set());
    setAStarVisited(new Set());
    setBidirectionalVisited(new Set());
    setDijkstraCurrent(null);
    setAStarCurrent(null);
    setBidirectionalCurrent(null);

    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
  };

  const deepCopyMaze = (original: Maze): Maze => {
    const newGrid: Cell[][] = original.grid.map((row) =>
      row.map((cell) => ({
        ...cell,
        parent: null,
      }))
    );
    return {
      grid: newGrid,
      start: { ...original.start },
      end: { ...original.end },
    };
  };

  const startComparison = () => {
    if (!maze) return;

    resetVisualization();
    setIsRunning(true);
    setIsPaused(false);

    // Create separate copies of the maze for each algorithm
    const dijkstraMaze = deepCopyMaze(maze);
    const aStarMaze = deepCopyMaze(maze);
    const bidirectionalMaze = deepCopyMaze(maze);

    dijkstraGenRef.current = PathfindingAlgorithms.dijkstra(dijkstraMaze, ROWS, COLS);
    aStarGenRef.current = PathfindingAlgorithms.aStar(aStarMaze, ROWS, COLS);
    bidirectionalGenRef.current = PathfindingAlgorithms.explorationFirstOptimal(bidirectionalMaze, ROWS, COLS);

    animate();
  };

  const animate = useCallback(() => {
    if (isPaused) return;
    if (!dijkstraGenRef.current || !aStarGenRef.current || !bidirectionalGenRef.current) {
      setIsRunning(false);
      return;
    }

    let dijkstraStillRunning = false;
    let aStarStillRunning = false;
    let bidirectionalStillRunning = false;

    // Step Dijkstra
    if (dijkstraGenRef.current) {
      const dijkstraResult = dijkstraGenRef.current.next();
      if (!dijkstraResult.done && dijkstraResult.value) {
        const value = dijkstraResult.value;
        if (value.current) {
          setDijkstraCurrent(value.current);
          setDijkstraVisited((prev) => new Set([...prev, `${value.current!.row},${value.current!.col}`]));
        }
        if (value.visited) {
          const visitedSet = new Set(value.visited.map((c) => `${c.row},${c.col}`));
          setDijkstraVisited(visitedSet);
        }
        if (value.path) {
          setDijkstraPath(value.path);
          setDijkstraCurrent(null);
          dijkstraStillRunning = false;
        }
        if (value.stats) {
          setDijkstraStats(value.stats);
          dijkstraStillRunning = value.stats.status === 'running';
        }
      } else if (dijkstraResult.done) {
        // Generator finished
        dijkstraStillRunning = false;
      }
    }

    // Step A*
    if (aStarGenRef.current) {
      const aStarResult = aStarGenRef.current.next();
      if (!aStarResult.done && aStarResult.value) {
        const value = aStarResult.value;
        if (value.current) {
          setAStarCurrent(value.current);
          setAStarVisited((prev) => new Set([...prev, `${value.current!.row},${value.current!.col}`]));
        }
        if (value.visited) {
          const visitedSet = new Set(value.visited.map((c) => `${c.row},${c.col}`));
          setAStarVisited(visitedSet);
        }
        if (value.path) {
          setAStarPath(value.path);
          setAStarCurrent(null);
          aStarStillRunning = false;
        }
        if (value.stats) {
          setAStarStats(value.stats);
          aStarStillRunning = value.stats.status === 'running';
        }
      } else if (aStarResult.done) {
        // Generator finished
        aStarStillRunning = false;
      }
    }

    // Step Bidirectional A*
    if (bidirectionalGenRef.current) {
      const bidirectionalResult = bidirectionalGenRef.current.next();
      if (!bidirectionalResult.done && bidirectionalResult.value) {
        const value = bidirectionalResult.value;
        if (value.current) {
          setBidirectionalCurrent(value.current);
          setBidirectionalVisited((prev) => new Set([...prev, `${value.current!.row},${value.current!.col}`]));
        }
        if (value.visited) {
          const visitedSet = new Set(value.visited.map((c) => `${c.row},${c.col}`));
          setBidirectionalVisited(visitedSet);
        }
        if (value.path) {
          setBidirectionalPath(value.path);
          setBidirectionalCurrent(null);
          bidirectionalStillRunning = false;
        }
        if (value.stats) {
          setBidirectionalStats(value.stats);
          bidirectionalStillRunning = value.stats.status === 'running';
        }
      } else if (bidirectionalResult.done) {
        // Generator finished
        bidirectionalStillRunning = false;
      }
    }

    // Continue if any is still running
    if (dijkstraStillRunning || aStarStillRunning || bidirectionalStillRunning) {
      animationRef.current = setTimeout(() => {
        animate();
      }, speed);
    } else {
      setIsRunning(false);
    }
  }, [isPaused, speed]);

  const togglePause = () => {
    setIsPaused(!isPaused);
    if (isPaused && isRunning) {
      animate();
    }
  };

  const getCellColor = (
    cell: Cell,
    path: Cell[],
    visited: Set<string>,
    current: Cell | null,
    algorithmIndex: number // 0 = Dijkstra, 1 = A*, 2 = QIAP
  ): string => {
    const cellKey = `${cell.row},${cell.col}`;

    if (cell.type === 'start') return 'bg-green-500';
    if (cell.type === 'end') return 'bg-red-500';
    if (cell.type === 'wall') return 'bg-gray-800';

    if (path.some((p) => p.row === cell.row && p.col === cell.col)) {
      return 'bg-yellow-400';
    }

    if (current && current.row === cell.row && current.col === cell.col) {
      return 'bg-blue-500 animate-pulse';
    }

    if (visited.has(cellKey)) {
      if (algorithmIndex === 0) return 'bg-green-300'; // Dijkstra
      if (algorithmIndex === 1) return 'bg-cyan-300'; // A*
      if (algorithmIndex === 2) return 'bg-purple-300'; // Bidirectional A*
    }

    return 'bg-gray-100';
  };

  const renderMaze = (
    maze: Maze | null,
    path: Cell[],
    visited: Set<string>,
    current: Cell | null,
    title: string,
    algorithmIndex: number
  ) => {
    if (!maze) return null;

    return (
      <div className="flex flex-col items-center">
        <h3 className="text-xl font-bold mb-4 text-center text-white">{title}</h3>
        <div
          className="grid gap-0 border-2 border-gray-800 bg-gray-900"
          style={{
            gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
            width: '400px',
            height: '400px',
          }}
        >
          {maze.grid.flat().map((cell) => (
            <div
              key={`${cell.row}-${cell.col}`}
              className={`${getCellColor(cell, path, visited, current, algorithmIndex)} border border-gray-700 transition-colors duration-100`}
              style={{
                minWidth: `${400 / COLS}px`,
                minHeight: `${400 / COLS}px`,
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  const getStatsPanel = (stats: AlgorithmStats, title: string, timeComplexity: string) => (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <h4 className="text-lg font-semibold mb-3 text-white">{title}</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-300">Nodes Explored:</span>
          <span className="text-blue-400 font-bold">{stats.nodesExplored}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Path Length:</span>
          <span className="text-green-400 font-bold">
            {stats.pathLength > 0 ? stats.pathLength : 'N/A'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Time Taken:</span>
          <span className="text-yellow-400 font-bold">
            {stats.executionTime > 0 ? `${stats.executionTime.toFixed(2)} ms` : 'N/A'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Status:</span>
          <span
            className={`font-bold ${
              stats.status === 'completed'
                ? 'text-green-400'
                : stats.status === 'running'
                ? 'text-blue-400'
                : stats.status === 'no-path'
                ? 'text-red-400'
                : 'text-gray-400'
            }`}
          >
            {stats.status === 'completed'
              ? 'Path Found!'
              : stats.status === 'running'
              ? 'Searching...'
              : stats.status === 'no-path'
              ? 'No Path'
              : 'Idle'}
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="text-xs text-gray-400">Time Complexity:</div>
          <div className="text-xs text-purple-300 font-mono mt-1">{timeComplexity}</div>
        </div>
      </div>
    </div>
  );

  const getComparisonPanel = () => {
    if (dijkstraStats.status === 'idle' && aStarStats.status === 'idle' && bidirectionalStats.status === 'idle') return null;

    const maxNodes = Math.max(dijkstraStats.nodesExplored, aStarStats.nodesExplored, bidirectionalStats.nodesExplored);
    const maxTime = Math.max(dijkstraStats.executionTime || 1, aStarStats.executionTime || 1, bidirectionalStats.executionTime || 1);
    
    const nodesReductionAStar =
      dijkstraStats.nodesExplored > 0
        ? ((1 - aStarStats.nodesExplored / dijkstraStats.nodesExplored) * 100).toFixed(1)
        : '0';
    const nodesReductionBidirectional =
      dijkstraStats.nodesExplored > 0
        ? ((1 - bidirectionalStats.nodesExplored / dijkstraStats.nodesExplored) * 100).toFixed(1)
        : '0';
    const timeReductionAStar =
      dijkstraStats.executionTime > 0
        ? ((1 - aStarStats.executionTime / dijkstraStats.executionTime) * 100).toFixed(1)
        : '0';
    const timeReductionBidirectional =
      dijkstraStats.executionTime > 0
        ? ((1 - bidirectionalStats.executionTime / dijkstraStats.executionTime) * 100).toFixed(1)
        : '0';

    return (
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-6 mt-6">
        <h3 className="text-2xl font-bold mb-4 text-white text-center">Performance Comparison</h3>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800/50 rounded p-4">
            <h4 className="font-semibold mb-2 text-white">Nodes Explored</h4>
            <div className="flex items-end space-x-2 h-32">
              <div className="flex flex-col items-center flex-1">
                <div
                  className="bg-blue-500 w-full rounded-t transition-all duration-500"
                  style={{
                    height: `${Math.max((dijkstraStats.nodesExplored / maxNodes) * 100, 10)}%`,
                  }}
                />
                <span className="text-xs mt-2 text-gray-300">Dijkstra</span>
                <span className="text-xs text-blue-400">{dijkstraStats.nodesExplored}</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div
                  className="bg-green-500 w-full rounded-t transition-all duration-500"
                  style={{
                    height: `${Math.max((aStarStats.nodesExplored / maxNodes) * 100, 10)}%`,
                  }}
                />
                <span className="text-xs mt-2 text-gray-300">A*</span>
                <span className="text-xs text-green-400">{aStarStats.nodesExplored}</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div
                  className="bg-purple-500 w-full rounded-t transition-all duration-500"
                  style={{
                    height: `${Math.max((bidirectionalStats.nodesExplored / maxNodes) * 100, 10)}%`,
                  }}
                />
                <span className="text-xs mt-2 text-gray-300">Exploration-First</span>
                <span className="text-xs text-purple-400">{bidirectionalStats.nodesExplored}</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 rounded p-4">
            <h4 className="font-semibold mb-2 text-white">Execution Time</h4>
            <div className="flex items-end space-x-2 h-32">
              <div className="flex flex-col items-center flex-1">
                <div
                  className="bg-blue-500 w-full rounded-t transition-all duration-500"
                  style={{
                    height: `${Math.max((dijkstraStats.executionTime / maxTime) * 100, 10)}%`,
                  }}
                />
                <span className="text-xs mt-2 text-gray-300">Dijkstra</span>
                <span className="text-xs text-blue-400">
                  {dijkstraStats.executionTime > 0 ? `${dijkstraStats.executionTime.toFixed(2)} ms` : 'N/A'}
                </span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div
                  className="bg-green-500 w-full rounded-t transition-all duration-500"
                  style={{
                    height: `${Math.max((aStarStats.executionTime / maxTime) * 100, 10)}%`,
                  }}
                />
                <span className="text-xs mt-2 text-gray-300">A*</span>
                <span className="text-xs text-green-400">
                  {aStarStats.executionTime > 0 ? `${aStarStats.executionTime.toFixed(2)} ms` : 'N/A'}
                </span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div
                  className="bg-purple-500 w-full rounded-t transition-all duration-500"
                  style={{
                    height: `${Math.max((bidirectionalStats.executionTime / maxTime) * 100, 10)}%`,
                  }}
                />
                <span className="text-xs mt-2 text-gray-300">Exploration-First</span>
                <span className="text-xs text-purple-400">
                  {bidirectionalStats.executionTime > 0 ? `${bidirectionalStats.executionTime.toFixed(2)} ms` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
        {(dijkstraStats.status === 'completed' || aStarStats.status === 'completed' || bidirectionalStats.status === 'completed') && (
          <div className="bg-yellow-500/20 border border-yellow-500 rounded p-4">
            <p className="text-yellow-200 text-center font-bold text-sm">
              🏆 A* explored <span className="text-yellow-300">{nodesReductionAStar}%</span> fewer nodes than Dijkstra.
              Exploration-First Optimal explored <span className="text-yellow-300">{nodesReductionBidirectional}%</span> fewer nodes than Dijkstra.
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Pathfinding Algorithm Visualizer
        </h1>
        <p className="text-center text-gray-300 mb-8">
          Compare Dijkstra's, A*, and Exploration-First Optimal Algorithms
        </p>

        {/* Controls */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <button
              onClick={startComparison}
              disabled={isRunning}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              Start Comparison
            </button>
            <button
              onClick={resetVisualization}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all"
            >
              Reset
            </button>
            <button
              onClick={generateMaze}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all"
            >
              Generate New Maze
            </button>
            <button
              onClick={togglePause}
              disabled={!isRunning}
              className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <div className="flex items-center gap-3">
              <label className="text-sm">Speed:</label>
              <input
                type="range"
                min="1"
                max="100"
                value={100 - speed}
                onChange={(e) => setSpeed(100 - parseInt(e.target.value))}
                className="w-32"
                disabled={isRunning}
              />
              <span className="text-sm w-20">{speed < 20 ? 'Fast' : speed < 50 ? 'Medium' : 'Slow'}</span>
            </div>
          </div>
        </div>

        {/* Maze Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Dijkstra Side */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-6">
            {getStatsPanel(dijkstraStats, "Dijkstra's Algorithm", "O((V + E) log V)")}
            {renderMaze(maze, dijkstraPath, dijkstraVisited, dijkstraCurrent, "Dijkstra's Algorithm", 0)}
          </div>

          {/* A* Side */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-6">
            {getStatsPanel(aStarStats, 'A* Algorithm', "O(E log V)")}
            {renderMaze(maze, aStarPath, aStarVisited, aStarCurrent, 'A* Algorithm', 1)}
          </div>

          {/* Exploration-First Optimal Side */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-6">
            {getStatsPanel(bidirectionalStats, 'Exploration-First Optimal Algorithm', "O(V+E) explore + O(E log V) A* - Faster than Dijkstra!")}
            {renderMaze(maze, bidirectionalPath, bidirectionalVisited, bidirectionalCurrent, 'Exploration-First Optimal Algorithm', 2)}
          </div>
        </div>

        {/* Comparison Panel */}
        {getComparisonPanel()}

        {/* Legend */}
        <div className="mt-6 bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
          <h4 className="text-lg font-semibold mb-3 text-center">Color Legend</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 rounded border border-gray-300"></div>
              <span>Start (Point A)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500 rounded border border-gray-300"></div>
              <span>End (Point B)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-800 rounded border border-gray-300"></div>
              <span>Wall</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded border border-gray-300 animate-pulse"></div>
              <span>Currently Exploring</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-300 rounded border border-gray-300"></div>
              <span>Visited (Dijkstra)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-cyan-300 rounded border border-gray-300"></div>
              <span>Visited (A*)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-purple-300 rounded border border-gray-300"></div>
              <span>Visited (Exploration-First Optimal)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-yellow-400 rounded border border-gray-300"></div>
              <span>Final Path</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
