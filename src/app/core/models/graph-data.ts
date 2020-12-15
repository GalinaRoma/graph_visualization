import { GraphNode } from './node';
import { GraphEdge } from './edge';

/**
 * Graph data initialize.
 */
export interface GraphDataInitData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

/**
 * Graph data class.
 */
export class GraphData {
  public nodes: GraphNode[];
  public edges: GraphEdge[];

  public constructor(data: GraphDataInitData) {
    this.nodes = data.nodes;
    this.edges = data.edges;
  }
}
