import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const AttentionTutorial = () => {
  const [seqLength, setSeqLength] = useState(512);
  const [headDim, setHeadDim] = useState(64);
  const [activeTab, setActiveTab] = useState('basic');

  const styles = {
    container: {
      maxWidth: '800px',
      margin: 'auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    title: { fontSize: '24px', marginBottom: '20px' },
    slider: { width: '100%', marginBottom: '20px' },
    tabs: { display: 'flex', justifyContent: 'center', marginBottom: '20px' },
    tab: {
      padding: '10px 20px',
      cursor: 'pointer',
      border: '1px solid #ccc',
      backgroundColor: '#f0f0f0',
    },
    activeTab: { backgroundColor: '#007bff', color: 'white' },
    visualizationContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '20px',
    },
    block: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      backgroundColor: '#007bff',
      transition: 'all 0.3s ease',
    },
    sharedMemory: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      backgroundColor: '#ffc107',
      marginBottom: '10px',
      transition: 'all 0.3s ease',
    },
    warp: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      backgroundColor: '#28a745',
      transition: 'all 0.3s ease',
    },
    metric: { marginBottom: '10px' },
    bar: {
      height: '20px',
      backgroundColor: '#007bff',
      transition: 'all 0.3s ease',
    },
  };

  const BasicAttention = ({ seqLength }) => {
    const [highlightedInput, setHighlightedInput] = useState(null);

    useEffect(() => {
      const interval = setInterval(() => {
        setHighlightedInput((prev) => (prev === null ? 0 : (prev + 1) % Math.min(4, seqLength)));
      }, 1000);
      return () => clearInterval(interval);
    }, [seqLength]);

    return (
      <div>
        <h2 style={styles.title}>Basic Attention Mechanism</h2>
        <p>
          Attention allows a model to focus on specific parts of an input sequence when processing or generating output.
          It works by assigning different weights to different parts of the input, allowing the model to "pay attention"
          to the most relevant information for a given task.
        </p>
        <svg viewBox={`0 0 ${Math.min(4, seqLength) * 100 + 100} 200`} style={{width: '100%', height: '200px'}}>
          {[...Array(Math.min(4, seqLength))].map((_, i) => (
            <g key={i}>
              <rect
                x={i * 100}
                y={0}
                width={80}
                height={40}
                fill={highlightedInput === i ? "#48bb78" : "#4299e1"}
              />
              <text x={i * 100 + 40} y={25} textAnchor="middle" fill="white">Input {i + 1}</text>
              <line
                x1={i * 100 + 40}
                y1={50}
                x2={Math.min(4, seqLength) * 50}
                y2={150}
                stroke="#ed8936"
                strokeWidth={highlightedInput === i ? 4 : 2}
                opacity={highlightedInput === i ? 1 : 0.5}
              />
              <text x={i * 100 + 40} y={80} textAnchor="middle" fill="#ed8936">Weight {i + 1}</text>
            </g>
          ))}
          <rect x={Math.min(4, seqLength) * 50 - 40} y={150} width={80} height={40} fill="#48bb78" />
          <text x={Math.min(4, seqLength) * 50} y={175} textAnchor="middle" fill="white">Output</text>
        </svg>
        <p>
          In this animation, you can see how the model attends to different inputs over time. The highlighted input
          and its corresponding weight represent the current focus of the attention mechanism.
        </p>
      </div>
    );
  };

  const StandardAttention = ({ seqLength, headDim }) => {
    const memoryUsage = (seqLength * seqLength * 4 * headDim) / (1024 * 1024); // in MB
    const computeTime = (seqLength * seqLength * headDim) / 1000000; // simplified computation time

    return (
      <div>
        <h2 style={styles.title}>Standard Attention Implementation</h2>
        <p>The standard way to implement attention has some limitations:</p>
        <ul>
          <li>It requires storing the full attention matrix (QK^T) in memory, which is O(N^2 * H) for sequence length N and head dimension H.</li>
          <li>For long sequences and large head dimensions, this can be very memory-intensive and slow.</li>
        </ul>
        <svg viewBox="0 0 400 200" style={{width: '100%', height: '200px'}}>
          <rect x={0} y={0} width={80} height={200} fill="#4299e1" />
          <text x={40} y={100} textAnchor="middle" fill="white" transform="rotate(-90 40 100)">Sequence Length (N)</text>
          <rect x={100} y={0} width={200} height={200} fill="#ed8936" />
          <text x={200} y={100} textAnchor="middle" fill="white">Attention Matrix (N x N x H)</text>
          <rect x={320} y={0} width={80} height={200} fill="#48bb78" />
          <text x={360} y={100} textAnchor="middle" fill="white" transform="rotate(-90 360 100)">Head Dimension (H)</text>
        </svg>
        <p>As the sequence length and head dimension increase, the memory requirement grows, which can be problematic.</p>
        <div style={{backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px'}}>
          <p><strong>Memory usage: O(N^2 * H)</strong></p>
          <p>Current sequence length: {seqLength}</p>
          <p>Current head dimension: {headDim}</p>
          <p>Attention matrix size: {seqLength} x {seqLength} x {headDim} = {seqLength * seqLength * headDim} elements</p>
          <p>Memory required (assuming 4 bytes per element): {memoryUsage.toFixed(2)} MB</p>
          <p>Estimated compute time: {computeTime.toFixed(2)} ms</p>
        </div>
      </div>
    );
  };

  const FlashAttention = ({ seqLength, headDim }) => {
    const [currentBlock, setCurrentBlock] = useState(0);
    const blockSize = 256; // Typical block size for FlashAttention
    const numBlocks = Math.ceil(seqLength / blockSize);
    const memoryUsage = (3 * seqLength * headDim * 4) / (1024 * 1024); // in MB, for Q, K, V
    const computeTime = (seqLength * headDim * Math.log(seqLength)) / 1000000; // simplified computation time

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentBlock((prev) => (prev + 1) % (numBlocks * numBlocks));
      }, 1000);
      return () => clearInterval(interval);
    }, [numBlocks]);

    return (
      <div>
        <h2 style={styles.title}>FlashAttention</h2>
        <p>FlashAttention is an optimization technique that reduces memory usage and improves speed:</p>
        <ul>
          <li>It avoids storing the full attention matrix in high-bandwidth memory (HBM).</li>
          <li>Uses tiling to compute attention in smaller blocks.</li>
          <li>Recomputes certain values instead of storing them, trading computation for memory efficiency.</li>
        </ul>
        <svg viewBox={`0 0 ${numBlocks * 110} ${numBlocks * 110}`} style={{width: '100%', height: '400px'}}>
          {[...Array(numBlocks * numBlocks)].map((_, i) => {
            const row = Math.floor(i / numBlocks);
            const col = i % numBlocks;
            return (
              <rect
                key={i}
                x={col * 110}
                y={row * 110}
                width={100}
                height={100}
                fill={i === currentBlock ? "#48bb78" : "#4299e1"}
              />
            );
          })}
        </svg>
        <p>This animation shows how FlashAttention processes the attention matrix in blocks, reducing memory usage and often improving speed. The highlighted block represents the current block being processed.</p>
        <div style={{backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px'}}>
          <p><strong>Memory usage: O(N * H)</strong></p>
          <p>Current sequence length: {seqLength}</p>
          <p>Current head dimension: {headDim}</p>
          <p>Memory required for Q, K, V: {memoryUsage.toFixed(2)} MB</p>
          <p>Estimated compute time: {computeTime.toFixed(2)} ms</p>
          <p>Number of blocks: {numBlocks} x {numBlocks}</p>
        </div>
      </div>
    );
  };

  const FlashAttention2 = () => {
    const [highlightedBlock, setHighlightedBlock] = useState(0);
    const [highlightedWarp, setHighlightedWarp] = useState(0);

    useEffect(() => {
      const blockInterval = setInterval(() => {
        setHighlightedBlock((prev) => (prev + 1) % 3);
      }, 2000);
      const warpInterval = setInterval(() => {
        setHighlightedWarp((prev) => (prev + 1) % 3);
      }, 1000);
      return () => {
        clearInterval(blockInterval);
        clearInterval(warpInterval);
      };
    }, []);

    return (
      <div>
        <h2 style={styles.title}>FlashAttention-2: Further Optimizations</h2>
        <p>FlashAttention-2 builds upon FlashAttention with additional optimizations:</p>
        <ul>
          <li>Improved work partitioning between GPU thread blocks and warps.</li>
          <li>Reduced non-matrix multiplication operations.</li>
          <li>Better parallelization across sequence length, batch size, and number of heads.</li>
        </ul>
        <svg viewBox="0 0 400 240" style={{width: '100%', height: '240px'}}>
          {/* Thread Blocks */}
          <rect
            x={0} y={0}
            width={120} height={60}
            fill={highlightedBlock === 0 ? "#48bb78" : "#4299e1"}
          />
          <text x={60} y={30} textAnchor="middle" fill="white">Thread Block 1</text>
          <rect
            x={130} y={0}
            width={120} height={60}
            fill={highlightedBlock === 1 ? "#48bb78" : "#ed8936"}
          />
          <text x={190} y={30} textAnchor="middle" fill="white">Thread Block 2</text>
          <rect
            x={260} y={0}
            width={120} height={60}
            fill={highlightedBlock === 2 ? "#48bb78" : "#9f7aea"}
          />
          <text x={320} y={30} textAnchor="middle" fill="white">Thread Block 3</text>

          {/* Shared Memory */}
          <rect x={0} y={70} width={380} height={40} fill="#f6e05e" />
          <text x={190} y={90} textAnchor="middle" fill="white">Shared Memory</text>

          {/* Warps */}
          <rect
            x={0} y={120}
            width={120} height={60}
            fill={highlightedWarp === 0 ? "#48bb78" : "#d53f8c"}
          />
          <text x={60} y={150} textAnchor="middle" fill="white">Warp 1</text>
          <rect
            x={130} y={120}
            width={120} height={60}
            fill={highlightedWarp === 1 ? "#48bb78" : "#805ad5"}
          />
          <text x={190} y={150} textAnchor="middle" fill="white">Warp 2</text>
          <rect
            x={260} y={120}
            width={120} height={60}
            fill={highlightedWarp === 2 ? "#48bb78" : "#dd6b20"}
          />
          <text x={320} y={150} textAnchor="middle" fill="white">Warp 3</text>

          {/* Explanation */}
          <text x={200} y={220} textAnchor="middle" fontSize="12">
            {highlightedBlock === 0 && "Thread blocks process different parts of the sequence in parallel"}
            {highlightedBlock === 1 && "Each thread block handles a portion of the attention computation"}
            {highlightedBlock === 2 && "Improved parallelization across sequence length and batch size"}
            {highlightedWarp === 0 && "Warps within a thread block cooperate on matrix multiplications"}
            {highlightedWarp === 1 && "Efficient work distribution reduces shared memory access"}
            {highlightedWarp === 2 && "Warps process different parts of Q, K, and V matrices"}
          </text>
        </svg>
        <p>This animation demonstrates how FlashAttention-2 optimizes work distribution across thread blocks and warps, leading to even faster computation and better utilization of GPU resources.</p>
      </div>
    );
  };

const Performance = ({ seqLength, headDim }) => {
    const [maxSeqLength, setMaxSeqLength] = useState(4096);

    const generatePerformanceData = (maxLength, headDim) => {
      const data = [];
      for (let length = 128; length <= maxLength; length *= 2) {
        data.push({
          seqLength: length,
          standard: Math.min(300, 1000 / (length * headDim * 0.0001)),
          flashAttention: Math.min(300, 1000 / (Math.sqrt(length * headDim) * 0.01)),
          flashAttention2: Math.min(300, 1000 / (Math.sqrt(length * headDim) * 0.007)),
        });
      }
      return data;
    };

    const performanceData = generatePerformanceData(maxSeqLength, headDim);

    return (
      <div>
        <h2 style={styles.title}>Performance Comparison</h2>
        <p>Let's compare the performance of different attention implementations:</p>
        <div style={{marginBottom: '20px'}}>
          <label htmlFor="max-seq-length" style={{display: 'block', marginBottom: '10px'}}>
            Max Sequence Length: {maxSeqLength}
          </label>
          <input
            type="range"
            id="max-seq-length"
            min={1024}
            max={16384}
            step={1024}
            value={maxSeqLength}
            onChange={(e) => setMaxSeqLength(Number(e.target.value))}
            style={{width: '100%'}}
          />
        </div>
        <div style={{height: '400px', width: '100%'}}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="seqLength"
                scale="log"
                domain={['dataMin', 'dataMax']}
                type="number"
                tickFormatter={(value) => value.toString()}
              />
              <YAxis label={{ value: 'Speed (TFLOPs/s)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="standard" stroke="#4299e1" name="Standard Attention" />
              <Line type="monotone" dataKey="flashAttention" stroke="#ed8936" name="FlashAttention" />
              <Line type="monotone" dataKey="flashAttention2" stroke="#48bb78" name="FlashAttention-2" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p>
          This chart shows the performance of different attention implementations as the sequence length increases.
          The head dimension is set to {headDim}. FlashAttention-2 demonstrates significant improvements, especially for longer sequences.
        </p>
        <div style={{backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px', marginTop: '20px'}}>
          <h3 style={{marginTop: 0}}>Key Takeaways:</h3>
          <ul>
            <li>Standard attention performance degrades quickly with increasing sequence length and head dimension</li>
            <li>FlashAttention maintains better performance for longer sequences and larger head dimensions</li>
            <li>FlashAttention-2 shows the best performance, especially for very long sequences and large head dimensions</li>
            <li>The performance gap widens as sequence length and head dimension increase</li>
          </ul>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'basic':
        return <BasicAttention seqLength={seqLength} />;
      case 'standard':
        return <StandardAttention seqLength={seqLength} headDim={headDim} />;
      case 'flash':
        return <FlashAttention seqLength={seqLength} headDim={headDim} />;
      case 'flash2':
        return <FlashAttention2 />;
      case 'performance':
        return <Performance seqLength={seqLength} headDim={headDim} />;
      default:
        return <BasicAttention seqLength={seqLength} />;
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Attention Mechanism Tutorial</h1>
      <div style={{marginBottom: '20px'}}>
        <label style={{display: 'block', marginBottom: '10px'}}>
          Sequence Length: {seqLength}
        </label>
        <input
          type="range"
          min={128}
          max={4096}
          step={128}
          value={seqLength}
          onChange={(e) => setSeqLength(Number(e.target.value))}
          style={styles.slider}
        />
      </div>
      <div style={{marginBottom: '20px'}}>
        <label style={{display: 'block', marginBottom: '10px'}}>
          Head Dimension: {headDim}
        </label>
        <input
          type="range"
          min={32}
          max={128}
          step={32}
          value={headDim}
          onChange={(e) => setHeadDim(Number(e.target.value))}
          style={styles.slider}
        />
      </div>
      <div style={styles.tabs}>
        {['basic', 'standard', 'flash', 'flash2', 'performance'].map((tab) => (
          <button
            key={tab}
            style={{
              ...styles.tab,
              ...(activeTab === tab ? styles.activeTab : {}),
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'internalGPU' ? 'Internal GPU Data' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <div>{renderContent()}</div>
    </div>
  );
};

export default AttentionTutorial;
