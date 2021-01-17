import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Node3DDto } from './dto/node-dto';
import { Graph3DNode, GraphNode } from '../models/node';
import { EdgeDto } from './dto/edge-dto';
import { GraphEdge } from '../models/edge';
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
  constructor(private http: HttpClient) {}

  public getFlatGraph(): Observable<GraphData> {
    return this.http.get('http://127.0.0.1:5000/flat-graph')
      .pipe(map(json => {
        console.log(json);
        const nodes = [];
        const edges = [];

        // @ts-ignore
        for (const node of json) {
          nodes.push(new GraphNode(node));
          for (const neighbor of node.neighbors) {
            edges.push(new GraphEdge({
              id: `${node.id}-${neighbor}`,
              from: node.id,
              to: neighbor,
            }));
          }
        }

        return new GraphData({ nodes, edges });
      }));
  }

  public getCircoGraph(): Observable<GraphData> {
    return this.http.get('http://127.0.0.1:5000/circo-graph')
      .pipe(map(json => {
        const nodes = [];
        const edges = [];

        // @ts-ignore
        for (const node of json) {
          nodes.push(new GraphNode(node));
          for (const neighbor of node.neighbors) {
            edges.push(new GraphEdge({
              id: `${node.id}-${neighbor}`,
              from: node.id,
              to: neighbor,
            }));
          }
        }

        return new GraphData({ nodes, edges });
      }));
  }

  public getMultiLevelGraph(): Observable<GraphData> {
    return this.http.get('http://127.0.0.1:5000/multilevel-graph')
      .pipe(map(json => {
        const nodes = [];
        const edges = [];

        // @ts-ignore
        for (const node of json) {
          nodes.push(new GraphNode(node));
          for (const neighbor of node.neighbors) {
            edges.push(new GraphEdge({
              id: `${node.id}-${neighbor}`,
              from: node.id,
              to: neighbor,
            }));
          }
        }

        return new GraphData({ nodes, edges });
      }));
  }

  public get3DGraph(): Observable<Graph3dData> {
    return this.http.get('http://127.0.0.1:5000/flat-graph')
      .pipe(map(json => {
        const nodes = [];
        const links = [];

        // @ts-ignore
        for (const node of json) {
          nodes.push(new Graph3DNode(node));
          for (const neighbor of node.neighbors) {
            links.push(new Graph3DEdge({
              id: `${node.id}-${neighbor}`,
              source: node.id,
              target: neighbor,
            }));
          }
        }

        return new Graph3dData({ nodes, links });
      }));
  }

  public saveGraph(nodes: GraphNode[]): Observable<any> {
    return this.http.post('http://127.0.0.1:5000/flat-graph', nodes);
  }


  public saveMultilevelGraph(nodes: GraphNode[]): Observable<any> {
    return this.http.post('http://127.0.0.1:5000/multilevel-graph', nodes);
  }
}
