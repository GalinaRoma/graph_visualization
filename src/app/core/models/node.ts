import { Graph3DEdge } from './edge-3d';

/**
 * Node initialize data.
 */
export interface NodeInitData {
  /**
   * Node id.
   */
  id: string;
  /**
   * Node x position.
   */
  x?: number;
  /**
   * Node y position.
   */
  y?: number;
  /**
   * Node name.
   */
  name?: string | null;
  /**
   * Node type.
   */
  type?: string | null;
}

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
   * Neighbor nodes.
   */
  neighbors?: Graph3DNode[];
  /**
   * Links with neighbors.
   */
  links?: Graph3DEdge[];

  childLinks?: Graph3DEdge[];
  collapsed?: boolean;
}

/**
 * Node class.
 */
export class GraphNode {
  /**
   * Node id.
   */
  public id: string;
  /**
   * Node x position.
   */
  public x: number;
  /**
   * Node y position.
   */
  public y: number;
  /**
   * Node name.
   */
  public name: string | null;
  /**
   * Node type.
   */
  public type: string | null;

  public constructor(data: NodeInitData) {
    this.id = data.id;
    this.name = data.name || null;
    this.type = data.type || null;
    this.x = data.x || 0;
    this.y = data.y || 0;
  }
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
   * Neighbor nodes.
   */
  public neighbors: Graph3DNode[];
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
