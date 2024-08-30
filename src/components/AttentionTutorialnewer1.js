import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AttentionTutorial = () => {
  const [seqLength, setSeqLength] = useState(512);
  const [headDim, setHeadDim] = useState(64);
  const [activeTab, setActiveTab] = useState('basic');

  const BasicAttention = ({ seqLength }) => {
    const [highlightedInput, setHighlightedInput] = useState(null);

    useEffect(() => {
      const interval = setInterval(() => {
        setHighlightedInput((prev) => (prev === null ? 0 : (prev + 1) % Math.min(4, seqLength)));
      }, 1000);
      return () => clearInterval(interval);
    }, [seqLength]);

    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Basic Attention Mechanism</h2>
        <p className="text-lg">
          Attention allows a model to focus on specific parts of an input sequence when processing or generating output.
          It works by assigning different weights to different parts of the input, allowing the model to "pay attention"
          to the most relevant information for a given task.
        </p>
        <div className="border p-4 bg-gray-100 rounded-lg">
          <svg viewBox={`0 0 ${Math.min(4, seqLength) * 100 + 100} 200`} className="w-full">
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
        </div>
        <p className="text-lg">
          In this animation, you can see how the model attends to different inputs over time. The highlighted input
          and its corresponding weight represent the current focus of the attention mechanism.
        </p>
      </div>
    );
  };

  const AttentionMatrix = () => {
    const [animationStep, setAnimationStep] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setAnimationStep((prev) => (prev + 1) % 4);
      }, 1500);
      return () => clearInterval(interval);
    }, []);

    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Attention Matrix Computation</h2>
        <p className="text-lg">Attention is computed using matrix multiplication. Let's break down the process:</p>
        <div className="border p-4 bg-gray-100 rounded-lg space-y-2">
          <svg viewBox="0 0 500 250" className="w-full">
            <rect x={0} y={0} width={60} height={100} fill="#4299e1" />
            <text x={30} y={50} textAnchor="middle" fill="white">Q</text>
            <rect x={100} y={0} width={100} height={60} fill="#ed8936" />
            <text x={150} y={30} textAnchor="middle" fill="white">K^T</text>
            <rect x={240} y={0} width={60} height={100} fill="#48bb78" />
            <text x={270} y={50} textAnchor="middle" fill="white">V</text>
            
            <path
              d="M70 50 L90 50 L90 30 L110 30"
              fill="none"
              stroke="black"
              strokeWidth={2}
              opacity={animationStep >= 1 ? 1 : 0}
            />
            <text x={90} y={20} textAnchor="middle" opacity={animationStep >= 1 ? 1 : 0}>*</text>
            
            <rect
              x={100}
              y={100}
              width={100}
              height={100}
              fill="#9f7aea"
              opacity={animationStep >= 1 ? 1 : 0}
            />
            <text
              x={150}
              y={150}
              textAnchor="middle"
              fill="white"
              opacity={animationStep >= 1 ? 1 : 0}
            >
              QK^T
            </text>
            
            <path
              d="M200 150 L220 150 L220 50 L230 50"
              fill="none"
              stroke="black"
              strokeWidth={2}
              opacity={animationStep >= 2 ? 1 : 0}
            />
            <text x={220} y={40} textAnchor="middle" opacity={animationStep >= 2 ? 1 : 0}>*</text>
            
            <rect
              x={340}
              y={100}
              width={60}
              height={100}
              fill="#f6e05e"
              opacity={animationStep >= 3 ? 1 : 0}
            />
            <text
              x={370}
              y={150}
              textAnchor="middle"
              opacity={animationStep >= 3 ? 1 : 0}
            >
              Output
            </text>
            
            <text
              x={250}
              y={230}
              textAnchor="middle"
              className="text-lg font-bold"
            >
              {animationStep === 0 && "Step 1: Start with Q, K, and V matrices"}
              {animationStep === 1 && "Step 2: Compute QK^T"}
              {animationStep === 2 && "Step 3: Apply softmax to QK^T"}
              {animationStep === 3 && "Step 4: Multiply result with V to get output"}
            </text>
          </svg>
        </div>
        <p className="text-lg">
          This animation shows how the attention matrix is computed step by step, allowing the model to determine
          how much each input element should influence each output element.
        </p>
      </div>
    );
  };

  const StandardAttention = () => {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Standard Attention Implementation</h2>
        <p className="text-lg">The standard way to implement attention has some limitations:</p>
        <ul className="list-disc pl-5 space-y-2 text-lg">
          <li>It requires storing the full attention matrix (QK^T) in memory, which is O(N^2) for sequence length N.</li>
          <li>For long sequences, this can be very memory-intensive and slow.</li>
        </ul>
        <div className="border p-4 bg-gray-100 rounded-lg">
          <svg viewBox="0 0 400 200" className="w-full">
            <rect x={0} y={0} width={80} height={200} fill="#4299e1" />
            <text x={40} y={100} textAnchor="middle" fill="white" transform="rotate(-90 40 100)">Sequence Length (N)</text>
            <rect x={100} y={0} width={200} height={200} fill="#ed8936" />
            <text x={200} y={100} textAnchor="middle" fill="white">Attention Matrix (N x N)</text>
            <rect x={320} y={0} width={80} height={200} fill="#48bb78" />
            <text x={360} y={100} textAnchor="middle" fill="white" transform="rotate(-90 360 100)">Sequence Length (N)</text>
          </svg>
        </div>
        <p className="text-lg">As the sequence length increases, the memory requirement grows quadratically, which can be problematic for long sequences.</p>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="font-semibold">Memory usage: O(N^2)</p>
          <p>Current sequence length: {seqLength}</p>
          <p>Attention matrix size: {seqLength} x {seqLength} = {seqLength * seqLength} elements</p>
          <p>Memory required (assuming 4 bytes per element): {(seqLength * seqLength * 4 / (1024 * 1024)).toFixed(2)} MB</p>
        </div>
      </div>
    );
  };

  const FlashAttention = () => {
    const [currentBlock, setCurrentBlock] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentBlock((prev) => (prev + 1) % 4);
      }, 1000);
      return () => clearInterval(interval);
    }, []);

    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">FlashAttention</h2>
        <p>FlashAttention is an optimization technique that reduces memory usage and improves speed:</p>
        <ul className="list-disc pl-5 space-y-2 text-lg">
          <li>It avoids storing the full attention matrix in high-bandwidth memory (HBM).</li>
          <li>Uses tiling to compute attention in smaller blocks.</li>
          <li>Recomputes certain values instead of storing them, trading computation for memory efficiency.</li>
        </ul>
        <div className="border p-4 bg-gray-100 rounded-lg">
          <svg viewBox="0 0 400 200" className="w-full">
            <rect
              x={0} y={0}
              width={100} height={100}
              fill={currentBlock === 0 ? "#48bb78" : "#4299e1"}
            />
            <text x={50} y={50} textAnchor="middle" fill="white">Block 1</text>
            <rect
              x={110} y={0}
              width={100} height={100}
              fill={currentBlock === 1 ? "#48bb78" : "#ed8936"}
            />
            <text x={160} y={50} textAnchor="middle" fill="white">Block 2</text>
            <rect
              x={0} y={110}
              width={100} height={90}
              fill={currentBlock === 2 ? "#48bb78" : "#9f7aea"}
            />
            <text x={50} y={155} textAnchor="middle" fill="white">Block 3</text>
            <rect
              x={110} y={110}
              width={100} height={90}
              fill={currentBlock === 3 ? "#48bb78" : "#f6e05e"}
            />
            <text x={160} y={155} textAnchor="middle" fill="white">Block 4</text>
            <path
              d={`M${220 + (currentBlock % 2) * 110} ${50 + Math.floor(currentBlock / 2) * 110} L240 ${50 + Math.floor(currentBlock / 2) * 110} L240 100 L260 100`}
              fill="none"
              stroke="black"
              strokeWidth={2}
            />
            <rect x={270} y={75} width={120} height={50} fill="#48bb78" />
            <text x={330} y={100} textAnchor="middle">Compute Block</text>
            <path
              d={`M330 125 L330 145 L${50 + (currentBlock % 2) * 110} 145 L${50 + (currentBlock % 2) * 110} ${155 + Math.floor(currentBlock / 2) * 110}`}
              fill="none"
              stroke="black"
              strokeWidth={2}
              markerEnd="url(#arrowhead)"
            />
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" />
              </marker>
            </defs>
          </svg>
        </div>
        <p>
          This animation shows how FlashAttention processes the attention matrix in blocks, reducing memory usage
          and often improving speed. The highlighted block represents the current block being processed.
        </p>
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
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">FlashAttention-2: Further Optimizations</h2>
        <p>FlashAttention-2 builds upon FlashAttention with additional optimizations:</p>
        <ul className="list-disc pl-5 space-y-2 text-lg">
          <li>Improved work partitioning between GPU thread blocks and warps.</li>
          <li>Reduced non-matrix multiplication operations.</li>
          <li>Better parallelization across sequence length, batch size, and number of heads.</li>
        </ul>
        <div className="border p-4 bg-gray-100 rounded-lg">
          <svg viewBox="0 0 400 240" className="w-full">
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
            <text x={200} y={220} textAnchor="middle" className="text-sm">
              {highlightedBlock === 0 && "Thread blocks process different parts of the sequence in parallel"}
              {highlightedBlock === 1 && "Each thread block handles a portion of the attention computation"}
              {highlightedBlock === 2 && "Improved parallelization across sequence length and batch size"}
              {highlightedWarp === 0 && "Warps within a thread block cooperate on matrix multiplications"}
              {highlightedWarp === 1 && "Efficient work distribution reduces shared memory access"}
              {highlightedWarp === 2 && "Warps process different parts of Q, K, and V matrices"}
            </text>
          </svg>
        </div>
        <p>This animation demonstrates how FlashAttention-2 optimizes work distribution across thread blocks and warps, leading to even faster computation and better utilization of GPU resources.</p>
      </div>
    );
  };

  const Performance = () => {
    const [maxSeqLength, setMaxSeqLength] = useState(4096);
  
    const generatePerformanceData = (maxLength) => {
      const data = [];
      for (let length = 128; length <= maxLength; length *= 2) {
        data.push({
          seqLength: length,
          standard: Math.min(300, 1000 / (length * 0.01)),
          flashAttention: Math.min(300, 1000 / (Math.sqrt(length) * 0.1)),
          flashAttention2: Math.min(300, 1000 / (Math.sqrt(length) * 0.07)),
        });
      }
      return data;
    };
  
    const performanceData = generatePerformanceData(maxSeqLength);
  
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Performance Comparison</h2>
        <p className="text-lg">Let's compare the performance of different attention implementations:</p>
        <div className="space-y-2">
          <label htmlFor="max-seq-length" className="block text-sm font-medium text-gray-700">
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
            className="w-full"
          />
        </div>
        <div className="h-80 w-full">
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
        <p className="text-lg">
          This chart shows the performance of different attention implementations as the sequence length increases.
          FlashAttention-2 demonstrates significant improvements, especially for longer sequences, reaching up to 
          70% of theoretical maximum GPU throughput.
        </p>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Key Takeaways:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Standard attention performance degrades quickly with increasing sequence length</li>
            <li>FlashAttention maintains better performance for longer sequences</li>
            <li>FlashAttention-2 shows the best performance, especially for very long sequences</li>
            <li>The performance gap widens as sequence length increases</li>
          </ul>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'basic':
        return <BasicAttention seqLength={seqLength} />;
      case 'matrix':
        return <AttentionMatrix />;
      case 'standard':
        return <StandardAttention />;
      case 'flash':
        return <FlashAttention />;
      case 'flash2':
        return <FlashAttention2 />;
      case 'performance':
        return <Performance />;
      default:
        return <BasicAttention seqLength={seqLength} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Attention Mechanism Tutorial</h1>
      <div>
        <label className="block mb-2 text-lg font-medium">
          Sequence Length: {seqLength}
        </label>
        <input
          type="range"
          min={128}
          max={4096}
          step={128}
          value={seqLength}
          onChange={(e) => setSeqLength(Number(e.target.value))}
          className="w-full"
        />
      </div>
      <div>
        <label className="block mb-2 text-lg font-medium">
          Head Dimension: {headDim}
        </label>
        <input
          type="range"
          min={32}
          max={128}
          step={32}
          value={headDim}
          onChange={(e) => setHeadDim(Number(e.target.value))}
          className="w-full"
        />
      </div>
      <div className="flex space-x-2">
        {['basic', 'matrix', 'standard', 'flash', 'flash2', 'performance'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <div>{renderContent()}</div>
    </div>
  );
};

export default AttentionTutorial;

