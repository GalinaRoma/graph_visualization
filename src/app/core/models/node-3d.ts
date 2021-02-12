import { Graph3DEdge } from './edge-3d';
import { GraphNode, NodeInitData } from './node';

/**
 * Node initialize data.
 */
export interface Node3DInitData extends NodeInitData {
  /**
   * Node x position.
   */
  z: number;
  /**
   * Node fx position.
   */
  fx?: number;
  /**
   * Node fy position.
   */
  fy?: number;
  /**
   * Node fz position.
   */
  fz?: number;
  /**
   * Links with neighbors.
   */
  links?: Graph3DEdge[];
  childLinks?: Graph3DEdge[];
  collapsed?: boolean;
}

/**
 * Node 3d.
 */
export class Graph3DNode extends GraphNode {
  /**
   * Node x position.
   */
  public z: number;
  /**
   * Node fx position.
   */
  public fx: number | undefined;
  /**
   * Node fy position.
   */
  public fy: number | undefined;
  /**
   * Node fz position.
   */
  public fz: number | undefined;
  /**
   * Links with neighbors.
   */
  public links: Graph3DEdge[];
  public childLinks: Graph3DEdge[];
  public collapsed: boolean;

  public constructor(data: Node3DInitData) {
    super(data);
    this.z = data.z || 0;
    this.fx = data?.fx;
    this.fy = data?.fy;
    this.fz = data?.fz;
    this.neighbors = [];
    this.links = [];
    this.childLinks = [];
    this.collapsed = data.collapsed || false;
  }
}
