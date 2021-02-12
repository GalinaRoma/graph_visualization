import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { GraphNode } from '../models/node';
import { GraphEdge } from '../models/edge';
import { GraphData } from '../models/graph-data';
import { Graph3dData } from '../models/graph-3d-data';
import { Graph3DEdge } from '../models/edge-3d';
import { NodeDto } from './dto/node-dto';
import { Graph3DNode } from '../models/node-3d';

/**
 * Service for working with data.
 */
@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  private url = 'http://127.0.0.1:5000/';

  constructor(
    private http: HttpClient,
  ) {}

  /**
   * Get data for flat sfdp graph.
   */
  public getFlatGraph(approvedFilter?: boolean, dateFilter?: string): Observable<GraphData> {
    return this.http.get(`${this.url}flat-graph?is_approved=${approvedFilter ?? null}&filter_date=${dateFilter ?? null}`)
      .pipe(
        map(json => this.mapGraphData(json as NodeDto[])),
      );
  }

  /**
   * Get data for flat circo graph.
   */
  public getCircoGraph(approvedFilter?: boolean, dateFilter?: string): Observable<GraphData> {
    return this.http.get(`${this.url}circo-graph?is_approved=${approvedFilter ?? null}&filter_date=${dateFilter ?? null}`)
      .pipe(
        map(json => this.mapGraphData(json as NodeDto[])),
      );
  }

  /**
   * Get data for multilevel sfdp graph.
   */
  public getMultiLevelGraph(approvedFilter?: boolean, dateFilter?: string): Observable<GraphData> {
    return this.http.get(`${this.url}multilevel-graph?is_approved=${approvedFilter ?? null}&filter_date=${dateFilter ?? null}`)
      .pipe(
        map(json => this.mapGraphData(json as NodeDto[])),
      );
  }

  /**
   * Get data for flat sfdp graph and make it 3d.
   */
  public get3DGraph(approvedFilter?: boolean, dateFilter?: string): Observable<Graph3dData> {
    return this.http.get(`${this.url}flat-graph?is_approved=${approvedFilter ?? null}&filter_date=${dateFilter ?? null}`)
      .pipe(
        map(json => {
          const nodes = [];
          const links = [];

          for (const nodeDto of json as NodeDto[]) {
            nodes.push(new Graph3DNode({
              id: nodeDto.id,
              x: nodeDto.x,
              y: nodeDto.y,
              z: 0,
              name: nodeDto.name,
              createdAt: nodeDto.created_at,
              type: nodeDto.type,
              children: nodeDto.children,
              interfaces: nodeDto.interfaces,
              neighbors: nodeDto.neighbors,
            }));
            for (const neighbor of nodeDto.neighbors) {
              links.push(new Graph3DEdge({
                id: `${nodeDto.id}-${neighbor.neighbor_id}`,
                source: nodeDto.id,
                target: neighbor.neighbor_id,
              }));
            }
          }

          return new Graph3dData({ nodes, links });
      }));
  }

  /**
   * Save graph with nodes positions according to layout.
   */
  public saveGraph(nodes: GraphNode[], layoutName: string): Observable<any> {
    if (layoutName === 'sfdp') {
      return this.http.post(`${this.url}flat-graph`, nodes);
    }
    if (layoutName === 'circo') {
      return this.http.post(`${this.url}circo-graph`, nodes);
    }
    return of();
  }

  /**
   * Save multilevel graph.
   */
  public saveMultilevelGraph(nodes: GraphNode[]): Observable<any> {
    return this.http.post(`${this.url}multilevel-graph`, nodes);
  }


  /**
   * Add new node to sfdp graph.
   */
  public addNode(node: GraphNode): Observable<any> {
    return this.http.put(`${this.url}flat-graph`, node);
  }

  private mapGraphData(json: NodeDto[]): GraphData {
    const nodes = [];
    const edges = [];

    for (const nodeDto of json) {
      nodes.push(new GraphNode({
        id: nodeDto.id,
        x: nodeDto.x,
        y: nodeDto.y,
        name: nodeDto.name,
        createdAt: nodeDto.created_at,
        type: nodeDto.type,
        children: nodeDto.children,
        interfaces: nodeDto.interfaces,
        neighbors: nodeDto.neighbors,
      }));
      for (const neighbor of nodeDto.neighbors) {
        edges.push(new GraphEdge({
          id: `${nodeDto.id}-${neighbor.neighbor_id}`,
          from: nodeDto.id,
          to: neighbor.neighbor_id,
          protocols: neighbor.protocols,
          approved: neighbor.approved,
        }));
      }
    }

    return new GraphData({ nodes, edges });
  }
}
