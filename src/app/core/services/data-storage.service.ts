import { Injectable } from '@angular/core';
import circo_json from '../../../data_circo.json';
import dot_json from '../../../data_dot.json';
import sfdp_json from '../../../data_sfdp.json';
import {Node3DDto, NodeDto} from './dto/node-dto';
import { Graph3DNode, GraphNode, Node3DInitData } from '../models/node';
import { EdgeDto } from './dto/edge-dto';
import { EdgeInitData, GraphEdge } from '../models/edge';
import { GraphData } from '../models/graph-data';
import { Graph3dData } from '../models/graph-3d-data';
import { Graph3DEdge } from '../models/edge-3d';

/**
 * Service for working with data.
 */
@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  public getJson(layoutName: string, savedGraphName: string) {
    let json;

    const savedGraph = localStorage.getItem(savedGraphName);
    if (savedGraph) {
      json = JSON.parse(savedGraph);
    } else {
      switch (layoutName) {
        case('circo'):
          json = circo_json;
          break;
        case('dot'):
          json = dot_json;
          break;
        case('sfdp'):
        default:
          json = sfdp_json;
      }
    }

    return json;
  }

  /**
   * Get data by layout name from json (get 2d json data and modify it).
   */
  public get2DGraphDataByLayoutName(layoutName: string, savedGraphName: string): any {
    const json = this.getJson(layoutName, savedGraphName);

    const nodes = json.nodes.map((node: NodeDto) => new GraphNode(node));
    const edges = json.edges.map((edge: EdgeDto) => new GraphEdge({
      id: edge.id,
      from: edge.source,
      to: edge.target,
    }));

    return new GraphData({ nodes, edges });
  }

  /**
   * Get data by layout name from json (get 2d json data and modify it).
   */
  public get3DGraphDataByLayout(layoutName: string, savedGraphName: string): Graph3dData {
    const json = this.getJson(layoutName, savedGraphName);

    return new Graph3dData({
      nodes: json.nodes.map((node: Node3DDto) => new Graph3DNode(node)),
      links: json.edges.map((edge: EdgeDto) => new Graph3DEdge({
        id: edge.id,
        source: edge.source,
        target: edge.target
      })),
    });
  }
}
