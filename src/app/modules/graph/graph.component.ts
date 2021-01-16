import { Component, OnInit } from '@angular/core';
import { Network } from 'vis-network/peer';
import { NodeDto } from '../../core/services/dto/node-dto';
import {Graph3DNode, GraphNode} from '../../core/models/node';
import { EdgeDto } from '../../core/services/dto/edge-dto';
import { GraphEdge } from '../../core/models/edge';
import { DataStorageService } from '../../core/services/data-storage.service';
import {GraphData} from '../../core/models/graph-data';
import {MatDialog} from '@angular/material/dialog';
import {InfoDialogComponent} from '../info-dialog/info-dialog.component';
import ForceGraph3D, {ForceGraph3DInstance} from '3d-force-graph';
import * as THREE from 'three';

@Component({
  selector: 'app-graph2d',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  private container: HTMLElement | null = null;
  private orangeColor = '#FF8C00';
  private blackColor = '#404040';
  private imageUrl = '../assets/pc.svg';
  private nameToSave = 'sfdp2D';
  private graph2D: Network | undefined;
  private graph3d: ForceGraph3DInstance | undefined;

  constructor(private dataStorageService: DataStorageService,
              public dialog: MatDialog) {}

  /**
   * @inheritDoc
   */
  public ngOnInit(): void {
    this.container = document.getElementById('graph-container');
    this.drawGraph();
  }

  public draw3DGraph(): void {
    this.dataStorageService.get3DGraph().subscribe(graphData => {
      graphData.links.forEach(link => {
        const source = graphData.nodes.find(node => node.id === link.source) as Graph3DNode;
        const target = graphData.nodes.find(node => node.id === link.target) as Graph3DNode;
        !source.neighbors && (source.neighbors = []);
        !target.neighbors && (target.neighbors = []);
        source.neighbors.push(target);
        target.neighbors.push(source);

        !source.links && (source.links = []);
        !target.links && (target.links = []);
        source.links.push(link);
        target.links.push(link);
      });

      const highlightNodes = new Set();
      const highlightLinks = new Set();
      let hoverNode: Graph3DNode | null = null;

      this.graph3d = ForceGraph3D();

      this.graph3d(this.container as HTMLElement)
        .graphData(graphData)
        .backgroundColor('#ffffff')
        .linkThreeObject(link => {
          const material = new THREE.LineBasicMaterial({
            color: highlightLinks.has(link) ? this.orangeColor : this.blackColor,
            linewidth: highlightLinks.has(link) ? 2 : 1,
          });
          const geometry = new THREE.BufferGeometry();

          return new THREE.Line(geometry, material);
        })
        .nodeThreeObject(() => {
          const imgTexture = new THREE.TextureLoader().load(this.imageUrl);
          const material = new THREE.SpriteMaterial({ map: imgTexture });
          const sprite = new THREE.Sprite(material);
          sprite.scale.set(10, 10, 10);
          return sprite;
        })
        .onNodeDragEnd(node => {
          const myNode = node as Graph3DNode;
          myNode.fx = myNode.x;
          myNode.fy = myNode.y;
          myNode.fz = myNode.z;
        })
        .onNodeHover(node => {
          if ((!node && !highlightNodes.size) || (node && hoverNode === node)) {
            return;
          }

          highlightNodes.clear();
          highlightLinks.clear();
          const myNode = node as Graph3DNode;
          if (myNode) {
            highlightNodes.add(node);
            myNode.neighbors.forEach(neighbor => highlightNodes.add(neighbor));
            myNode.links.forEach(link => highlightLinks.add(link));
          }

          hoverNode = myNode || null;

          this.updateHighlight(this.graph3d as ForceGraph3DInstance);
        });
    });
  }

  private updateHighlight(graph: ForceGraph3DInstance): void {
    // trigger update of highlighted objects in scene
    graph.linkThreeObject(graph.linkThreeObject());
  }

  public drawGraph(): void {
    this.dataStorageService.getFlatGraph()
      .subscribe(graphData => {
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
      });
  }

  public drawCircoGraph(): void {
    this.dataStorageService.getCircoGraph()
      .subscribe(graphData => {
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
      });
  }

  public drawLevelGraph(layout: string): void {
    this.dataStorageService.getMultiLevelGraph()
      .subscribe(graphData => {
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
}
