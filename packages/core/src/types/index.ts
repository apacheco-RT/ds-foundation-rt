/** DTCG 2025.10 token types */
export type DTCGTokenType =
  | 'color'
  | 'dimension'
  | 'font-family'
  | 'font-weight'
  | 'duration'
  | 'cubic-bezier'
  | 'number'
  | 'stroke-style'
  | 'border'
  | 'transition'
  | 'shadow'
  | 'gradient'
  | 'typography';

/** DTCG color value (2025.10 format — NOT hex string) */
export interface DTCGColorValue {
  colorSpace: string;
  components: (number | 'none')[];
  alpha?: number;
  hex?: string; // 6-digit fallback
}

/** DTCG dimension value */
export interface DTCGDimensionValue {
  value: number;
  unit: 'px' | 'rem' | 'em' | '%' | 'vw' | 'vh' | 'ch';
}

/** Component spec status */
export type SpecStatus = 'draft' | 'beta' | 'stable' | 'deprecated';

/** Supported frameworks */
export type Framework = 'react' | 'angular' | 'webcomponent';

/** Supported adapters */
export type Adapter = 'tailwind' | 'material' | 'bootstrap';
