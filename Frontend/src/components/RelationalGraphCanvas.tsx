import cytoscape, { type Core, type ElementDefinition } from "cytoscape";
import { memo, useEffect, useRef } from "react";

type Props = {
  elements: ElementDefinition[];
  centerUid: string;
  onNodeSelect: (uid: string) => void;
  onNodeHover: (uid: string | null) => void;
};

function GraphCanvasComponent({ elements, centerUid, onNodeSelect, onNodeHover }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cyRef = useRef<Core | null>(null);
  const prevTopologyKeyRef = useRef<string | null>(null);
  const prevCenterUidRef = useRef<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || cyRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      elements: [],
      style: [
        {
          selector: "node",
          style: {
            "background-color": "data(color)",
            label: "data(label)",
            color: "#334155",
            "font-size": 10,
            "text-wrap": "wrap",
            "text-max-width": "72px",
            "text-valign": "bottom",
            "text-margin-y": 6,
            "border-width": 1,
            "border-color": "#1e293b",
            width: 15,
            height: 15,
          },
        },
        {
          selector: "node[distance = 0]",
          style: {
            width: 24,
            height: 24,
            "border-width": 2,
            "border-color": "#10b981",
            color: "#14532d",
            "font-size": 11,
          },
        },
        {
          selector: "node:hover",
          style: {
            "overlay-color": "#10b981",
            "overlay-opacity": 0.2,
            "overlay-padding": 6,
          },
        },
        {
          selector: "edge",
          style: {
            width: "mapData(weight, 1, 100, 0.5, 1.8)",
            "line-color": "#6b7280",
            "target-arrow-color": "#6b7280",
            "target-arrow-shape": "triangle",
            "arrow-scale": 0.6,
            "curve-style": "bezier",
            "control-point-step-size": 18,
            opacity: 0.14,
          },
        },
        {
          selector: "edge.edge-hover",
          style: {
            opacity: 0.85,
            "line-color": "#34d399",
            "target-arrow-color": "#34d399",
            "target-arrow-shape": "triangle",
            "arrow-scale": 0.85,
            width: "mapData(weight, 1, 100, 1.2, 2.8)",
          },
        },
      ],
      layout: {
        name: "breadthfirst",
        roots: [centerUid],
        directed: true,
        spacingFactor: 1.45,
        padding: 36,
        animate: false,
        fit: true,
      },
      wheelSensitivity: 0.22,
    });
    cy.minZoom(0.28);
    cy.maxZoom(2.1);

    cy.on("tap", "node", (evt) => {
      const uid = evt.target.id();
      cy.animate({ center: { eles: evt.target }, duration: 180 });
      onNodeSelect(uid);
    });

    cy.on("mouseover", "node", (evt) => {
      onNodeHover(evt.target.id());
    });

    cy.on("mouseout", "node", () => {
      onNodeHover(null);
    });

    cy.on("mouseover", "edge", (evt) => {
      evt.target.addClass("edge-hover");
    });

    cy.on("mouseout", "edge", (evt) => {
      evt.target.removeClass("edge-hover");
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
      cyRef.current = null;
    };
  }, [onNodeHover, onNodeSelect]);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    const nodeElements = elements.filter(
      (el) => el.data && typeof el.data.id === "string" && !("source" in el.data),
    );
    const edgeElements = elements.filter(
      (el) =>
        el.data &&
        typeof el.data.id === "string" &&
        typeof el.data.source === "string" &&
        typeof el.data.target === "string",
    );

    const nodeIds = nodeElements.map((el) => String(el.data?.id)).sort();
    const edgeIds = edgeElements.map((el) => String(el.data?.id)).sort();
    const topologyKey = `${nodeIds.join(",")}||${edgeIds.join(",")}`;
    const topologyUnchanged = prevTopologyKeyRef.current === topologyKey;

    if (topologyUnchanged) {
      // Language switches change labels only; keep existing positions/zoom.
      cy.batch(() => {
        for (const el of nodeElements) {
          const id = String(el.data?.id);
          const node = cy.getElementById(id);
          if (node.nonempty()) node.data(el.data ?? {});
        }
        for (const el of edgeElements) {
          const id = String(el.data?.id);
          const edge = cy.getElementById(id);
          if (edge.nonempty()) edge.data(el.data ?? {});
        }
      });
    } else {
      const shouldFit = prevTopologyKeyRef.current === null || prevCenterUidRef.current !== centerUid;
      cy.elements().remove();
      cy.add(elements);
      cy.layout({
        name: "breadthfirst",
        roots: [centerUid],
        directed: true,
        spacingFactor: 1.45,
        animate: false,
        fit: shouldFit,
        padding: 36,
      }).run();
      if (shouldFit) {
        cy.fit(undefined, 36);
        if (cy.zoom() > 1.18) {
          cy.zoom(1.18);
        }
      }
      prevTopologyKeyRef.current = topologyKey;
    }

    const center = cy.getElementById(centerUid);
    if (center.nonempty()) {
      center.select();
      cy.animate({ center: { eles: center }, duration: 220 });
    }
    prevCenterUidRef.current = centerUid;
  }, [centerUid, elements]);

  return <div ref={containerRef} className="h-full w-full" />;
}

export const RelationalGraphCanvas = memo(GraphCanvasComponent);
