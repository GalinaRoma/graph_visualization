import { Graph3DEdge } from './edge-3d';
import { Graph3DNode } from './node-3d';

/**
 * Graph 3d data initialize.
 */
export interface Graph3dDataInitData {
  nodes: Graph3DNode[];
  links: Graph3DEdge[];
}

/**
 * Graph 3d data class.
 */
export class Graph3dData {
  public nodes: Graph3DNode[];
  public links: Graph3DEdge[];

  public constructor(data: Graph3dDataInitData) {
    this.nodes = data.nodes;
    this.links = data.links;
  }
}
