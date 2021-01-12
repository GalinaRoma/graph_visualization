import { Component, OnInit } from '@angular/core';
import { Network } from 'vis-network/peer';
import { NodeDto } from '../../core/services/dto/node-dto';
import { GraphNode } from '../../core/models/node';
import { EdgeDto } from '../../core/services/dto/edge-dto';
import { GraphEdge } from '../../core/models/edge';
import { DataStorageService } from '../../core/services/data-storage.service';
import {GraphData} from '../../core/models/graph-data';
import {MatDialog} from '@angular/material/dialog';
import {InfoDialogComponent} from '../info-dialog/info-dialog.component';

@Component({
  selector: 'app-graph2d',
  templateUrl: './graph2d.component.html',
  styleUrls: ['./graph2d.component.css']
})
export class Graph2dComponent implements OnInit {
  private container: HTMLElement | null = null;
  private orangeColor = '#FF8C00';
  private blackColor = '#404040';
  private imageUrl = '../assets/pc.svg';
  private nameToSave = 'sfdp2D';
  private graph2D: Network | undefined;

  constructor(private dataStorageService: DataStorageService,
              public dialog: MatDialog) {}

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
    const graphData = this.dataStorageService.getAllGraph();

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

  }

  public drawLevelGraph(layout: string): void {
    let graphData = this.dataStorageService.getLevelGraph();

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

    this.graph2D.on('selectNode', async (params) => {
      const elem = graphData.nodes.filter(node => node.id === params.nodes[0])[0];
      const nodes = [];
      const edges = [];

      if (elem.children && elem.children.length > 0) {
        for (const node of elem.children) {
          nodes.push(new GraphNode(node));
          // @ts-ignore
          for (const neighbor of node.neighbors) {
            edges.push(new GraphEdge({
              id: `${node.id}-${neighbor}`,
              from: node.id,
              to: neighbor,
            }));
          }
        }

        graphData = new GraphData({ nodes, edges });

        this.graph2D?.setData(graphData);
      } else {
        await this.openDialog(elem);
      }
    });
  }


  openDialog(node: GraphNode): void {
    const dialog = this.dialog.open(InfoDialogComponent, {
      width: '300px',
      data: node,
    });

    dialog.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
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
