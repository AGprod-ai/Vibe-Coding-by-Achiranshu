import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { WordCloudItem } from '../types';

interface Props {
  data: WordCloudItem[];
}

export const WordCloud: React.FC<Props> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const width = svgRef.current.clientWidth;
    const height = 300;
    
    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Scale for circle size based on value (1-100 usually)
    const sizeScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 100])
      .range([20, 65]);

    // Simulation for packing
    const simulation = d3.forceSimulation(data as any)
      .force("charge", d3.forceManyBody().strength(5))
      .force("center", d3.forceCenter(0, 0))
      .force("collision", d3.forceCollide().radius((d: any) => sizeScale(d.value) + 2));

    const nodes = svg.selectAll("g")
      .data(data)
      .enter()
      .append("g");

    // Circles
    nodes.append("circle")
      .attr("r", (d) => sizeScale(d.value))
      .attr("fill", (d) => {
        if (d.type === 'complaint') return '#fecaca'; // red-200
        if (d.type === 'praise') return '#bbf7d0'; // green-200
        return '#e2e8f0'; // slate-200
      })
      .attr("stroke", (d) => {
         if (d.type === 'complaint') return '#ef4444';
         if (d.type === 'praise') return '#22c55e';
         return '#94a3b8';
      })
      .attr("stroke-width", 1.5)
      .style("cursor", "default");

    // Text
    nodes.append("text")
      .text((d) => d.text)
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .style("font-size", (d) => Math.min(sizeScale(d.value) / 2.5, 14) + "px")
      .style("font-weight", "600")
      .style("fill", "#1e293b")
      .style("pointer-events", "none");

    simulation.on("tick", () => {
      nodes.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [data]);

  return (
    <div className="h-[300px] w-full bg-white rounded-xl shadow-sm border border-slate-100 p-4 overflow-hidden">
       <h3 className="text-lg font-semibold text-slate-800 mb-4">Key Themes</h3>
       <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
};