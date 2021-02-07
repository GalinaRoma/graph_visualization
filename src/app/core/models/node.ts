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
  created_at: string;
  /**
   * Node type.
   */
  type?: string | null;
  children?: GraphNode[] | null;
  networks: {ip: string, mask: string}[] | null;
  interfaces: {ip: string, mask: string}[] | null;

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

export interface NeighborConnectionInitData {
  neighborId: string;
  approved: boolean;
  protocols: string[];
}

export class NeighborConnection {
  public neighborId: string;
  public approved: boolean;
  public protocols: string[];

  constructor(data: NeighborConnectionInitData) {
    this.neighborId = data.neighborId;
    this.approved = data.approved;
    this.protocols = data.protocols;
  }
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

  // tslint:disable-next-line:variable-name
  public created_at: string;

  public children: GraphNode[] | null;
  public networks: {ip: string, mask: string}[] | null;
  public interfaces: {ip: string, mask: string}[] | null;

  public image: string;

  public constructor(data: NodeInitData) {
    this.id = data.id;
    this.name = data.name || null;
    this.type = data.type || null;
    this.children = data.children || null;
    this.networks = data.networks || null;
    this.interfaces = data.interfaces || null;
    this.created_at = data.created_at;
    this.x = data.x || 0;
    this.y = data.y || 0;
    this.image =
      data.type === 'router' ?
        '../assets/router.svg' :
        data.type === 'switch' ?
          '../assets/switch.svg' :
          data.type === 'network' ?
            '../assets/molecular.svg' :
            '../assets/pc.svg';
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
