import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {Observable, of} from 'rxjs';

import { Node3DDto } from './dto/node-dto';
import { Graph3DNode, GraphNode } from '../models/node';
import { EdgeDto } from './dto/edge-dto';
import { GraphEdge } from '../models/edge';
import { GraphData } from '../models/graph-data';
import { Graph3dData } from '../models/graph-3d-data';
import { Graph3DEdge } from '../models/edge-3d';
import {boolean} from 'random';

/**
 * Service for working with data.
 */
@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  constructor(private http: HttpClient) {}

  public getFlatGraph(filter: boolean | null, dateFrom: string|undefined): Observable<GraphData> {
    return this.http.get(`http://127.0.0.1:5000/flat-graph?filter=${filter}&date_from=${dateFrom ?? null}`)
      .pipe(map(json => {
        const nodes = [];
        const edges = [];

        // @ts-ignore
        for (const node of json) {
          nodes.push(new GraphNode(node));
          for (const neighbor of node.neighbors) {
            edges.push(new GraphEdge({
              id: `${node.id}-${neighbor.neighbor_id}`,
              from: node.id,
              to: neighbor.neighbor_id,
              protocols: neighbor.protocols,
              approved: neighbor.approved,
            }));
          }
        }

        return new GraphData({ nodes, edges });
      }));
  }

  public getCircoGraph(filter?: boolean | null, dateFrom?: string|undefined): Observable<GraphData> {
    return this.http.get(`http://127.0.0.1:5000/circo-graph?filter=${filter ?? null}&date_from=${dateFrom ?? null}`)
      .pipe(map(json => {
        const nodes = [];
        const edges = [];

        // @ts-ignore
        for (const node of json) {
          nodes.push(new GraphNode(node));
          for (const neighbor of node.neighbors) {
            edges.push(new GraphEdge({
              id: `${node.id}-${neighbor.neighbor_id}`,
              from: node.id,
              to: neighbor.neighbor_id,
              protocols: neighbor.protocols,
              approved: neighbor.approved,
            }));
          }
        }

        return new GraphData({ nodes, edges });
      }));
  }

  public getMultiLevelGraph(filter: boolean | null, dateFrom: string|undefined): Observable<GraphData> {
    return this.http.get(`http://127.0.0.1:5000/multilevel-graph?filter=${filter}&date_from=${dateFrom ?? null}`)
      .pipe(map(json => {
        const nodes = [];
        const edges = [];

        // @ts-ignore
        for (const node of json) {
          nodes.push(new GraphNode(node));
          for (const neighbor of node.neighbors) {
            edges.push(new GraphEdge({
              id: `${node.id}-${neighbor.neighbor_id}`,
              from: node.id,
              to: neighbor.neighbor_id,
              protocols: neighbor.protocols,
              approved: neighbor.approved,
            }));
          }
        }

        return new GraphData({ nodes, edges });
      }));
  }

  public get3DGraph(filter?: boolean | null, dateFrom?: string|undefined): Observable<Graph3dData> {
    return this.http.get(`http://127.0.0.1:5000/flat-graph?filter=${filter ?? null}&date_from=${dateFrom ?? null}`)
      .pipe(map(json => {
        const nodes = [];
        const links = [];

        // @ts-ignore
        for (const node of json) {
          nodes.push(new Graph3DNode(node));
          for (const neighbor of node.neighbors) {
            links.push(new Graph3DEdge({
              id: `${node.id}-${neighbor.neighbor_id}`,
              source: node.id,
              target: neighbor.neighbor_id,
            }));
          }
        }

        return new Graph3dData({ nodes, links });
      }));
  }

  public saveGraph(nodes: GraphNode[], layoutName: string): Observable<any> {
    if (layoutName === 'sfdp') {
      return this.http.post('http://127.0.0.1:5000/flat-graph', nodes);
    }
    if (layoutName === 'circo') {
      return this.http.post('http://127.0.0.1:5000/circo-graph', nodes);
    }
    return of();
  }


  public saveMultilevelGraph(nodes: GraphNode[]): Observable<any> {
    return this.http.post('http://127.0.0.1:5000/multilevel-graph', nodes);
  }


  public addNode(node: GraphNode): Observable<any> {
    return this.http.put('http://127.0.0.1:5000/flat-graph', node);
  }
}
