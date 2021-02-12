/**
 * Edge initialize data.
 */
export interface EdgeInitData {
  /**
   * Edge id.
   */
  id: string;
  /**
   * Source node id.
   */
  from: string;
  /**
   * Target node id.
   */
  to: string;
  /**
   * List of protocols.
   */
  protocols: string[];
  /**
   * Approved status.
   */
  approved: boolean;
}

/**
 * Edge class.
 */
export class GraphEdge {
  /**
   * Edge id.
   */
  id: string;
  /**
   * Source node id.
   */
  from: string;
  /**
   * Target node id.
   */
  to: string;
  /**
   * List of protocols.
   */
  protocols: string[];
  /**
   * Approved status.
   */
  approved: boolean;
  /**
   * Color for edge.
   */
  color: string;

  public constructor(data: EdgeInitData) {
    this.id = data.id;
    this.from = data.from;
    this.to = data.to;
    this.protocols = data.protocols;
    this.approved = data.approved;
    this.color = this.approved ? 'green' : 'red';
  }
}
