import { IPAddress } from '../../models/node';

export interface NeighborConnection {
  neighbor_id: string;
  approved: boolean;
  protocols: string[];
}

/**
 * Node dto.
 */
export interface NodeDto {
  id: string;
  x: number;
  y: number;
  name: string | null;
  type: string | null;
  created_at: string;
  interfaces: IPAddress[];
  children: any[];
  neighbors: NeighborConnection[];
}

export interface Node3DDto {
  id: string;
  x: number;
  y: number;
  z: number;
  name?: string | null;
  type?: string | null;
}
