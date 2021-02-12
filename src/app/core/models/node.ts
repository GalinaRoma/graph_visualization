import { NeighborConnection } from '../services/dto/node-dto';

/**
 * IP address.
 */
export interface IPAddress {
  ip: string;
  mask: string;
}

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
   * Created at date.
   */
  createdAt: string;
  /**
   * Node type.
   */
  type?: string | null;
  /**
   * Children list.
   */
  children?: GraphNode[] | null;
  /**
   * Interfaces of device.
   */
  interfaces: IPAddress[] | null;
  /**
   * Neighbors.
   */
  neighbors: NeighborConnection[];
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

  /**
   * Created at date.
   */
  public createdAt: string;
  /**
   * Children list.
   */
  public children?: GraphNode[] | null;
  /**
   * Interfaces of device.
   */
  public interfaces: IPAddress[] | null;
  /**
   * Neighbors.
   */
  public neighbors: NeighborConnection[];
  /**
   * Image for device calculating on type.
   */
  public image: string;

  public constructor(data: NodeInitData) {
    this.id = data.id;
    this.name = data.name || null;
    this.type = data.type || null;
    this.children = data.children || null;
    this.interfaces = data.interfaces || null;
    this.neighbors = data.neighbors || null;
    this.createdAt = data.createdAt;
    this.x = data.x || 0;
    this.y = data.y || 0;
    this.image =
      data.type === 'router' ?
        '../assets/router.svg' :
        data.type === 'switch' ?
          '../assets/switch.svg' :
          data.type === 'network' ?
            '../assets/molecular.svg' :
            data.type === 'plc' ?
              '../assets/plc.svg' :
              '../assets/pc.svg';
  }
}
