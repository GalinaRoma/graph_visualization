import { Component, OnInit } from '@angular/core';
import { Network } from 'vis-network/peer';
import { NodeDto } from '../../core/services/dto/node-dto';
import { GraphNode } from '../../core/models/node';
import { EdgeDto } from '../../core/services/dto/edge-dto';
import { GraphEdge } from '../../core/models/edge';
import { DataStorageService } from '../../core/services/data-storage.service';
import { Position } from 'vis-network/declarations/network/Network';

@Component({
  selector: 'app-graph2d',
  templateUrl: './graph2d.component.html',
  styleUrls: ['./graph2d.component.css']
})
export class Graph2dComponent implements OnInit {
  private container: HTMLElement | null = null;
  private orangeColor = '#FF8C00';
  private blackColor = '#404040';
  private imageUrl = '../assets/router.png';
  private nameToSave = 'sfdp2D';
  private graph2D: Network | undefined;

  constructor(private dataStorageService: DataStorageService) {}

  /**
   * @inheritDoc
   */
  public ngOnInit(): void {
    this.container = document.getElementById('graph2d-container');
  }

  /**
   * Draw graph layout by name.
   * @param layout Layout name
   */
  public drawGraph(layout: string): void {
    const graphData = this.dataStorageService.get2DGraphDataByLayoutName(layout, this.nameToSave);

    const options = {
      physics: {
        enabled: false
      },
      nodes: {
        shape: 'image',
        image: this.imageUrl,
      },
      edges: {
        color: {
          color: this.blackColor,
          highlight: this.orangeColor,
        },
      }
    };

    this.graph2D = new Network(this.container as HTMLElement, graphData, options);
    this.graph2D.on('selectNode', (params) => {
      // const results = {
      //   nodes: [] as NodeDto[],
      //   edges: [] as EdgeDto[],
      // };
      // // @ts-ignore
      // const { nodes, edges } = this.graph2D.body;
      //
      // const clusterNodes = this.graph2D?.getNodesInCluster(params.nodes[0]);
      // for (const nodeId of clusterNodes) {
      //   const node = nodes[nodeId];
      //   results.nodes.push(node);
      //   const edgesId = this.graph2D?.getConnectedEdges(nodeId);
      //   for (const edgeId of edgesId) {
      //       const edge = edges[edgeId];
      //       if (results.edges.filter(edge => edge.id === edgeId).length === 0) {
      //         results.edges.push(edge);
      //       }
      //   }
      // }
      // this.graph2D?.setData(results);

      if (params.nodes.length === 1) {
        if (this.graph2D?.isCluster(params.nodes[0]) === true) {
          this.graph2D.openCluster(params.nodes[0], {
            releaseFunction: (
              clusterPosition: Position,
              containedNodesPositions: { [nodeId: string]: Position }) => {
              const nodeId = Object.keys(containedNodesPositions)[0];
              const position = containedNodesPositions[nodeId];

              return { nodeId: position };
            }
          });
        }
      }
    });

    const clusterOptionsByData = {
      processProperties: (clusterOptions: any, childNodes: any) => {
        clusterOptions.label = '[' + childNodes.length + ']';
        return clusterOptions;
      },
      clusterNodeProperties: {
        borderWidth: 3,
        shape: 'box',
        font: { size: 30 },
      },
    };
    this.graph2D.clusterByHubsize(3, clusterOptionsByData);

  }

  /**
   * Save updated coordinates.
   */
  public saveGraph(): void {
    if (!this.graph2D) {
      return;
    }

    const results = {
      nodes: [] as NodeDto[],
      edges: [] as EdgeDto[],
    };
    // @ts-ignore
    const { nodes, edges } = this.graph2D.body;

    for (const node of Object.values(nodes)) {
      // To avoid nodes which vis.js add to nodes array (with id start with edgeId:)
      // @ts-ignore
      if (!node.parentEdgeId) {
        results.nodes.push({
          id: (node as GraphNode).id,
          x: (node as GraphNode).x,
          y: (node as GraphNode).y,
        });
      }
    }

    for (const edge of Object.values(edges)) {
      results.edges.push({
        id: (edge as GraphEdge).id,
        // @ts-ignore
        source: edge.fromId,
        // @ts-ignore
        target: edge.toId,
      });
    }

    localStorage.setItem(this.nameToSave, JSON.stringify(results));
  }

  /**
   * Clear saved graph with updated positions.
   */
  public clearSavedGraph(): void {
    localStorage.removeItem(this.nameToSave);
  }
}
