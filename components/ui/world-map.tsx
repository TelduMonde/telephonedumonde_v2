/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import DottedMap from "dotted-map";
import Image from "next/image";
// import { useTheme } from "next-themes";

interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>;
  lineColor?: string;
}

export default function WorldMap({
  dots = [],
  lineColor = "#b80b07",
}: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const map = new DottedMap({ height: 200, grid: "diagonal" });

  // const { theme } = useTheme();

  const svgMap = map.getSVG({
    radius: 0.22,
    color: "white",
    shape: "circle",
    backgroundColor: "#020202",
  });

  // const projectPoint = (lat: number, lng: number) => {
  //   const x = (lng + 180) * (800 / 360);
  //   const y = (90 - lat) * (400 / 180);
  //   return { x, y };
  // };

  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  function debounce(func: Function, wait: number) {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  useEffect(() => {
    const updateDimensions = debounce(() => {
      const container = svgRef.current?.getBoundingClientRect();
      if (container) {
        setDimensions({
          width: container.width,
          height: container.height,
        });
      }
    }, 100); // Ajustez la valeur pour équilibrer fluidité et réactivité

    updateDimensions(); // Appel initial
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  // const projectPoint = (lat: number, lng: number) => {
  //   const mapWidth = 1056; // Largeur de référence de l'image SVG
  //   const mapHeight = 495; // Hauteur de référence de l'image SVG

  //   // Calcul proportionnel des offsets
  //   const offsetX = -15 * (dimensions.width / mapWidth); // Ajustement horizontal relatif
  //   const offsetY = 30 * (dimensions.height / mapHeight); // Ajustement vertical relatif

  //   // Application de l'échelle
  //   const scaleX = dimensions.width / mapWidth; // Échelle horizontale
  //   const scaleY = dimensions.height / mapHeight; // Échelle verticale

  //   const x = ((lng + 180) * (dimensions.width / 360) + offsetX) * scaleX;
  //   const y = ((90 - lat) * (dimensions.height / 180) + offsetY) * scaleY;

  //   return { x, y };
  // };

  const projectPoint = (lat: number, lng: number) => {
    const width = dimensions.width;
    const height = dimensions.height;

    const offsetX = -5; // Ajustez si nécessaire
    const offsetY = -30; // Ajustez si nécessaire

    const x = (lng + 180) * (width / 360) - offsetX;
    const y = (90 - lat) * (height / 180) - offsetY;
    return { x, y };
  };

  // const projectPoint = (lat: number, lng: number) => {
  //   const x = (lng + 180) * (1056 / 360); // Utiliser la largeur réelle de l'image SVG
  //   const y = (90 - lat) * (495 / 180); // Utiliser la hauteur réelle de l'image SVG
  //   return { x, y };
  // };

  const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 50;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  return (
    <div className="w-full lg:w-3/4 aspect-[2/1] bg-noir-900 rounded-md relative font-sans">
      <Image
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        className="h-full w-full [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] pointer-events-none select-none"
        alt="world map"
        height="495"
        width="1056"
        draggable={false}
      />
      <svg
        ref={svgRef}
        viewBox="0 800 400"
        className="w-full h-full absolute inset-0 pointer-events-none select-none"
      >
        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);
          return (
            <g key={`path-group-${i}`}>
              <motion.path
                d={createCurvedPath(startPoint, endPoint)}
                fill="none"
                stroke="url(#path-gradient)"
                strokeWidth="1"
                initial={{
                  pathLength: 0,
                }}
                animate={{
                  pathLength: 1,
                }}
                transition={{
                  duration: 1,
                  delay: 0.5 * i,
                  ease: "easeOut",
                }}
                key={`start-upper-${i}`}
              ></motion.path>
            </g>
          );
        })}

        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {dots.map((dot, i) => (
          <g key={`points-group-${i}`}>
            <g key={`start-${i}`}>
              <circle
                cx={projectPoint(dot.start.lat, dot.start.lng).x}
                cy={projectPoint(dot.start.lat, dot.start.lng).y}
                r="2"
                fill={lineColor}
              />
              <circle
                cx={projectPoint(dot.start.lat, dot.start.lng).x}
                cy={projectPoint(dot.start.lat, dot.start.lng).y}
                r="2"
                fill={lineColor}
                opacity="0.5"
              >
                <animate
                  attributeName="r"
                  from="2"
                  to="8"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.5"
                  to="0"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
            <g key={`end-${i}`}>
              <circle
                cx={projectPoint(dot.end.lat, dot.end.lng).x}
                cy={projectPoint(dot.end.lat, dot.end.lng).y}
                r="2"
                fill={lineColor}
              />
              <circle
                cx={projectPoint(dot.end.lat, dot.end.lng).x}
                cy={projectPoint(dot.end.lat, dot.end.lng).y}
                r="2"
                fill={lineColor}
                opacity="0.5"
              >
                <animate
                  attributeName="r"
                  from="2"
                  to="8"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.5"
                  to="0"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}
