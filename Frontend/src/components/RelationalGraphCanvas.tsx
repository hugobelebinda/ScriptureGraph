import cytoscape, { type Core, type ElementDefinition } from "cytoscape";
import { memo, useEffect, useRef } from "react";

type Props = {
  elements: ElementDefinition[];
  centerUid: string;
  compactLabels?: boolean;
  visible?: boolean;
  onNodeSelect: (uid: string) => void;
  onNodeHover: (uid: string | null) => void;
};

function GraphCanvasComponent({
  elements,
  centerUid,
  compactLabels = false,
  visible = true,
  onNodeSelect,
  onNodeHover,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cyRef = useRef<Core | null>(null);
  const prevTopologyKeyRef = useRef<string | null>(null);
  const prevCenterUidRef = useRef<string | null>(null);
  const compactLabelsRef = useRef(compactLabels);
  const visibleRef = useRef(visible);
  const centerUidRef = useRef(centerUid);
  compactLabelsRef.current = compactLabels;
  visibleRef.current = visible;
  centerUidRef.current = centerUid;

  const refitAndCenter = (cy: Core): boolean => {
    const container = containerRef.current;
    if (!container || container.offsetWidth === 0 || container.offsetHeight === 0) return false;

    const padding = compactLabelsRef.current ? 28 : 36;
    const maxZoom = compactLabelsRef.current ? 1.05 : 1.18;

    cy.resize();
    cy.fit(undefined, padding);
    if (cy.zoom() > maxZoom) cy.zoom(maxZoom);

    const center = cy.getElementById(centerUidRef.current);
    if (center.nonempty()) {
      center.select();
      cy.center(center);
    }
    return true;
  };

  const scheduleRefitWhenVisible = (cy: Core) => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const tryRefit = () => {
      if (cancelled || !visibleRef.current) return false;
      return refitAndCenter(cy);
    };

    const raf1 = window.requestAnimationFrame(() => {
      if (tryRefit()) return;
      window.requestAnimationFrame(() => {
        if (tryRefit()) return;
        timeoutId = window.setTimeout(() => {
          tryRefit();
        }, 80);
      });
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf1);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  };

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
            "font-size": compactLabels ? 8 : 10,
            "text-wrap": "wrap",
            "text-max-width": compactLabels ? "44px" : "72px",
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
            "font-size": compactLabels ? 9 : 11,
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
        spacingFactor: compactLabels ? 1.65 : 1.45,
        padding: compactLabels ? 28 : 36,
        animate: false,
        fit: true,
      },
      wheelSensitivity: 0.22,
    });
    cy.minZoom(compactLabels ? 0.2 : 0.28);
    cy.maxZoom(compactLabels ? 1.6 : 2.1);

    cy.on("tap", "node", (evt) => {
      const uid = evt.target.id();
      cy.animate({ center: { eles: evt.target }, duration: 180 });
      onNodeHover(uid);
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

    const container = containerRef.current;
    if (!container) return;

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const observer = new ResizeObserver(() => {
      if (!visibleRef.current) return;
      if (resizeTimer !== undefined) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        refitAndCenter(cy);
      }, 50);
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
      cy.destroy();
      cyRef.current = null;
    };
  }, [compactLabels, onNodeHover, onNodeSelect]);

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
      if (visibleRef.current) refitAndCenter(cy);
    } else {
      cy.elements().remove();
      cy.add(elements);
      cy.layout({
        name: "breadthfirst",
        roots: [centerUid],
        directed: true,
        spacingFactor: compactLabelsRef.current ? 1.65 : 1.45,
        animate: false,
        fit: false,
        padding: compactLabelsRef.current ? 28 : 36,
      }).run();
      prevTopologyKeyRef.current = topologyKey;
      if (visibleRef.current) scheduleRefitWhenVisible(cy);
    }

    prevCenterUidRef.current = centerUid;
  }, [centerUid, elements]);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.style()
      .selector("node")
      .style({
        "font-size": compactLabels ? 8 : 10,
        "text-max-width": compactLabels ? "44px" : "72px",
      })
      .selector("node[distance = 0]")
      .style("font-size", compactLabels ? 9 : 11)
      .update();
    if (visibleRef.current) scheduleRefitWhenVisible(cy);
  }, [compactLabels]);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy || !visible) return;
    return scheduleRefitWhenVisible(cy);
  }, [visible, centerUid, elements.length]);

  return <div ref={containerRef} className="h-full min-h-[12rem] w-full" />;
}

export const RelationalGraphCanvas = memo(GraphCanvasComponent);
