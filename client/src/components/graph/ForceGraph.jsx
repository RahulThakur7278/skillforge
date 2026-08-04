import { useRef, useEffect, useCallback, useState } from 'react';
import * as d3 from 'd3';
import { NODE_COLORS, NODE_RADII, getPrimaryLabel } from '../../utils/constants';

/**
 * ForceGraph — D3.js force-directed graph visualization.
 *
 * Renders nodes and links with zoom/pan, highlighting,
 * tooltips, and click-to-select behavior.
 */
export default function ForceGraph({ data, onNodeClick, selectedNode, width, height }) {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const simulationRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  const getNodeColor = useCallback((node) => {
    const label = getPrimaryLabel(node._labels);
    return NODE_COLORS[label] || '#6b7280';
  }, []);

  const getNodeRadius = useCallback((node) => {
    const label = getPrimaryLabel(node._labels);
    return NODE_RADII[label] || 8;
  }, []);

  useEffect(() => {
    if (!data?.nodes?.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const w = width || svgRef.current.parentElement.clientWidth;
    const h = height || svgRef.current.parentElement.clientHeight;

    svg.attr('viewBox', [0, 0, w, h]);

    /* ---- Defs (arrow marker) ---- */
    const defs = svg.append('defs');
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', 'rgba(255,255,255,0.2)');

    /* ---- Container with zoom ---- */
    const container = svg.append('g');

    const zoom = d3.zoom()
      .scaleExtent([0.2, 4])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Map node IDs for link lookups
    const nodeById = new Map(data.nodes.map((n) => [n._id, n]));

    // Filter valid links
    const validLinks = data.links.filter(
      (l) => nodeById.has(l.source) && nodeById.has(l.target)
    );

    /* ---- Links ---- */
    const link = container.append('g')
      .selectAll('line')
      .data(validLinks)
      .join('line')
      .attr('class', 'graph-link')
      .attr('stroke-width', 1);

    /* ---- Nodes ---- */
    const node = container.append('g')
      .selectAll('g')
      .data(data.nodes)
      .join('g')
      .attr('class', 'graph-node')
      .call(d3.drag()
        .on('start', (event, d) => {
          if (!event.active) simulationRef.current?.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulationRef.current?.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    // Node circles
    node.append('circle')
      .attr('r', (d) => getNodeRadius(d))
      .attr('fill', (d) => getNodeColor(d))
      .attr('stroke', (d) => getNodeColor(d))
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.3)
      .attr('fill-opacity', 0.85);

    // Node labels
    node.append('text')
      .text((d) => d.name || d.title || '')
      .attr('dy', (d) => getNodeRadius(d) + 14)
      .attr('font-size', (d) => {
        const label = getPrimaryLabel(d._labels);
        return label === 'Domain' ? '11px' : '9px';
      })
      .attr('font-weight', (d) => {
        const label = getPrimaryLabel(d._labels);
        return label === 'Domain' ? '700' : '500';
      });

    /* ---- Interaction ---- */
    node.on('click', (_event, d) => {
      onNodeClick?.(d);
    });

    node.on('mouseenter', (event, d) => {
      setHoveredNode(d);
      // Highlight connected
      const connectedIds = new Set([d._id]);
      validLinks.forEach((l) => {
        const sId = typeof l.source === 'object' ? l.source._id : l.source;
        const tId = typeof l.target === 'object' ? l.target._id : l.target;
        if (sId === d._id) connectedIds.add(tId);
        if (tId === d._id) connectedIds.add(sId);
      });

      node.classed('dimmed', (n) => !connectedIds.has(n._id));
      node.classed('highlighted', (n) => n._id === d._id);
      link.classed('dimmed', (l) => {
        const sId = typeof l.source === 'object' ? l.source._id : l.source;
        const tId = typeof l.target === 'object' ? l.target._id : l.target;
        return sId !== d._id && tId !== d._id;
      });
      link.classed('highlighted', (l) => {
        const sId = typeof l.source === 'object' ? l.source._id : l.source;
        const tId = typeof l.target === 'object' ? l.target._id : l.target;
        return sId === d._id || tId === d._id;
      });

      // Position tooltip
      if (tooltipRef.current) {
        tooltipRef.current.style.display = 'block';
        tooltipRef.current.style.left = `${event.pageX - svgRef.current.parentElement.getBoundingClientRect().left + 12}px`;
        tooltipRef.current.style.top = `${event.pageY - svgRef.current.parentElement.getBoundingClientRect().top - 10}px`;
      }
    });

    node.on('mousemove', (event) => {
      if (tooltipRef.current) {
        tooltipRef.current.style.left = `${event.pageX - svgRef.current.parentElement.getBoundingClientRect().left + 12}px`;
        tooltipRef.current.style.top = `${event.pageY - svgRef.current.parentElement.getBoundingClientRect().top - 10}px`;
      }
    });

    node.on('mouseleave', () => {
      setHoveredNode(null);
      node.classed('dimmed', false).classed('highlighted', false);
      link.classed('dimmed', false).classed('highlighted', false);
      if (tooltipRef.current) {
        tooltipRef.current.style.display = 'none';
      }
    });

    /* ---- Simulation ---- */
    const simulation = d3.forceSimulation(data.nodes)
      .force('link', d3.forceLink(validLinks).id((d) => d._id).distance(80).strength(0.4))
      .force('charge', d3.forceManyBody().strength(-200).distanceMax(300))
      .force('center', d3.forceCenter(w / 2, h / 2))
      .force('collision', d3.forceCollide().radius((d) => getNodeRadius(d) + 5))
      .force('x', d3.forceX(w / 2).strength(0.05))
      .force('y', d3.forceY(h / 2).strength(0.05));

    simulationRef.current = simulation;

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    // Auto-zoom to fit after settling
    setTimeout(() => {
      const bounds = container.node()?.getBBox();
      if (bounds) {
        const scale = Math.min(w / (bounds.width + 80), h / (bounds.height + 80), 1.5);
        const tx = (w - bounds.width * scale) / 2 - bounds.x * scale;
        const ty = (h - bounds.height * scale) / 2 - bounds.y * scale;
        svg.transition().duration(800).call(
          zoom.transform,
          d3.zoomIdentity.translate(tx, ty).scale(scale)
        );
      }
    }, 2000);

    return () => {
      simulation.stop();
    };
  }, [data, width, height, getNodeColor, getNodeRadius, onNodeClick]);

  const tooltipLabel = hoveredNode ? getPrimaryLabel(hoveredNode._labels) : '';
  const tooltipColor = hoveredNode ? getNodeColor(hoveredNode) : '';

  return (
    <div className="graph-container">
      <svg ref={svgRef} />

      {/* Legend */}
      <div className="graph-legend">
        {Object.entries(NODE_COLORS).map(([label, color]) => (
          <div className="graph-legend-item" key={label}>
            <span className="graph-legend-dot" style={{ background: color }} />
            {label}
          </div>
        ))}
      </div>

      {/* Tooltip */}
      <div ref={tooltipRef} className="graph-tooltip" style={{ display: 'none' }}>
        {hoveredNode && (
          <>
            <div className="graph-tooltip-title">{hoveredNode.name || hoveredNode.title || 'Unknown'}</div>
            <span
              className="graph-tooltip-type"
              style={{ background: `${tooltipColor}22`, color: tooltipColor }}
            >
              {tooltipLabel}
            </span>
            {hoveredNode.category && (
              <div className="graph-tooltip-row">
                <span>Category</span><span>{hoveredNode.category}</span>
              </div>
            )}
            {hoveredNode.difficulty && (
              <div className="graph-tooltip-row">
                <span>Difficulty</span><span>{'⭐'.repeat(hoveredNode.difficulty)}</span>
              </div>
            )}
            {hoveredNode.level && (
              <div className="graph-tooltip-row">
                <span>Level</span><span>{hoveredNode.level}</span>
              </div>
            )}
            {hoveredNode.avg_salary && (
              <div className="graph-tooltip-row">
                <span>Avg Salary</span><span>${Math.round(hoveredNode.avg_salary / 1000)}k</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
