/**
 * Node dto.
 */
export interface NodeDto {
  id: string;
  x?: number;
  y?: number;
  name?: string | null;
  type?: string | null;
}

export interface Node3DDto {
  id: string;
  x: number;
  y: number;
  z: number;
  name?: string | null;
  type?: string | null;
}
