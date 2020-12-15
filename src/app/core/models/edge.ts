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

  public constructor(data: EdgeInitData) {
    this.id = data.id;
    this.from = data.from;
    this.to = data.to;
  }
}
