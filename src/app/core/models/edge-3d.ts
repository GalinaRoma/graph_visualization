/**
 * Edge 3D initialize data.
 */
export interface Edge3dInitData {
  /**
   * Edge id.
   */
  id: string;
  /**
   * Source node id.
   */
  source: string;
  /**
   * Target node id.
   */
  target: string;
}

/**
 * Edge 3D class.
 */
export class Graph3DEdge {
  /**
   * Edge id.
   */
  id: string;
  /**
   * Source node id.
   */
  source: string;
  /**
   * Target node id.
   */
  target: string;

  public constructor(data: Edge3dInitData) {
    this.id = data.id;
    this.source = data.source;
    this.target = data.target;
  }
}
