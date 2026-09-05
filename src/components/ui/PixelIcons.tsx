import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

/**
 * PixelSearchIcon: 8-bit retro pixel magnifying glass
 */
export function PixelSearchIcon({ className = 'w-5 h-5', ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
      className={`inline-block flex-shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    >
      {/* Balanced 2px-thick rounded pixel lens */}
      <rect x="3" y="1" width="5" height="1" />
      <rect x="2" y="2" width="7" height="1" />
      <rect x="1" y="3" width="2" height="5" />
      <rect x="8" y="3" width="2" height="5" />
      <rect x="2" y="8" width="7" height="1" />
      <rect x="3" y="9" width="5" height="1" />

      {/* Sturdy 2px continuous 45-degree diagonal handle */}
      <rect x="8" y="8" width="2" height="2" />
      <rect x="9" y="9" width="2" height="2" />
      <rect x="10" y="10" width="2" height="2" />
      <rect x="11" y="11" width="2" height="2" />
      <rect x="12" y="12" width="2" height="2" />
      <rect x="13" y="13" width="2" height="2" />
      <rect x="14" y="14" width="2" height="2" />
    </svg>
  );
}

/**
 * PixelChevronDown: 8-bit stepped V arrow
 */
export function PixelChevronDown({ className = 'w-3.5 h-3.5', ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
      className={`inline-block flex-shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    >
      <rect x="2" y="5" width="2" height="2" />
      <rect x="12" y="5" width="2" height="2" />
      <rect x="4" y="7" width="2" height="2" />
      <rect x="10" y="7" width="2" height="2" />
      <rect x="6" y="9" width="4" height="2" />
      <rect x="7" y="10" width="2" height="2" />
    </svg>
  );
}

/**
 * PixelMenuIcon: 8-bit hamburger menu icon
 */
export function PixelMenuIcon({ className = 'w-6 h-6', ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
      className={`inline-block flex-shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    >
      <rect x="1" y="2" width="14" height="2" />
      <rect x="1" y="7" width="14" height="2" />
      <rect x="1" y="12" width="14" height="2" />
    </svg>
  );
}

/**
 * PixelCloseIcon: 8-bit X close icon
 */
export function PixelCloseIcon({ className = 'w-6 h-6', ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
      className={`inline-block flex-shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    >
      <rect x="2" y="2" width="2" height="2" />
      <rect x="12" y="2" width="2" height="2" />
      <rect x="4" y="4" width="2" height="2" />
      <rect x="10" y="4" width="2" height="2" />
      <rect x="6" y="6" width="4" height="4" />
      <rect x="4" y="10" width="2" height="2" />
      <rect x="10" y="10" width="2" height="2" />
      <rect x="2" y="12" width="2" height="2" />
      <rect x="12" y="12" width="2" height="2" />
    </svg>
  );
}

/**
 * PixelArrowUpRight: 8-bit external/dropdown navigation arrow
 */
export function PixelArrowUpRight({ className = 'w-3 h-3', ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
      className={`inline-block flex-shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    >
      <rect x="7" y="2" width="7" height="2" />
      <rect x="12" y="4" width="2" height="5" />
      <rect x="10" y="4" width="2" height="2" />
      <rect x="8" y="6" width="2" height="2" />
      <rect x="6" y="8" width="2" height="2" />
      <rect x="4" y="10" width="2" height="2" />
      <rect x="2" y="12" width="2" height="2" />
    </svg>
  );
}

/**
 * PixelArrowRight: 8-bit directional forward arrow
 */
export function PixelArrowRight({ className = 'w-3.5 h-3.5', ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
      className={`inline-block flex-shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    >
      <rect x="1" y="7" width="11" height="2" />
      <rect x="9" y="5" width="2" height="2" />
      <rect x="9" y="9" width="2" height="2" />
      <rect x="11" y="4" width="2" height="2" />
      <rect x="11" y="10" width="2" height="2" />
      <rect x="13" y="6" width="2" height="4" />
    </svg>
  );
}

/**
 * PixelTrendingUp: 8-bit stepped upward trending chart arrow
 */
export function PixelTrendingUp({ className = 'w-4 h-4', ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
      className={`inline-block flex-shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    >
      {/* Arrowhead */}
      <rect x="10" y="3" width="5" height="2" />
      <rect x="13" y="5" width="2" height="3" />
      {/* Zigzag diagonal upward line */}
      <rect x="11" y="5" width="2" height="2" />
      <rect x="9" y="7" width="2" height="2" />
      <rect x="7" y="9" width="2" height="2" />
      <rect x="5" y="7" width="2" height="2" />
      <rect x="3" y="9" width="2" height="2" />
      <rect x="1" y="11" width="2" height="2" />
    </svg>
  );
}
