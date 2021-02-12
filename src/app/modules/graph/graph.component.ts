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
import {AddNodeDialogComponent} from '../add-node-dialog/add-node-dialog.component';
import {FormControl} from '@angular/forms';
import {InfoEdgeDialogComponent} from '../info-edge-dialog/info-edge-dialog.component';
import {MatSelectChange} from '@angular/material/select';

@Component({
  selector: 'app-graph2d',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  private options = {
    physics: {
      enabled: false
    },
    nodes: {
      shape: 'image',
    },
    interaction: { keyboard: true },
  };

  private orangeColor = '#FF8C00';
  private blackColor = '#404040';

  private container: HTMLElement | null = null;
  private graph2D: Network | undefined;
  private graph3d: ForceGraph3DInstance | undefined;
  // @ts-ignore
  private graphData: GraphData;
  // @ts-ignore
  private allMultiLevelGraph: GraphData;
  // @ts-ignore
  public selectedNode: GraphNode;
  private editingMode = false;
  /**
   * Display mode of view.
   */
  public displayMode = 'sfdp';
  /**
   * Approve filter control.
   */
  public filter = new FormControl(null);
  /**
   * Date filter control.
   */
  public dateFilter = new FormControl(null);

  constructor(
    private dataStorageService: DataStorageService,
    public dialog: MatDialog,
  ) {}

  /**
   * @inheritDoc
   */
  public ngOnInit(): void {
    this.container = document.getElementById('graph-container');
    this.drawGraph();
    setInterval(() => {
      if (!this.editingMode) {
        const approved = this.filter.value;
        const filterDate = (this.dateFilter.value as Date)?.toISOString();
        switch (this.displayMode) {
          case 'sfdp':
            this.dataStorageService.getFlatGraph(approved, filterDate)
              .subscribe(graphData => {
                if (!this.editingMode) {
                  this.graph2D?.setData(graphData);
                }
              });
            break;
          case 'multilevel':
            this.dataStorageService.getMultiLevelGraph(approved, filterDate)
              .subscribe(graphData => {
                if (!this.editingMode) {
                  let newGraphData = graphData;
                  if (this.selectedNode) {
                    const elem = graphData.nodes.filter(node => node.id === this.selectedNode.id)[0];
                    newGraphData = this.createGraphForChild(elem);
                  }
                  this.graph2D?.setData(newGraphData);
                }
              });
            break;
          case 'circo':
            this.dataStorageService.getCircoGraph(approved, filterDate)
              .subscribe(graphData => {
                if (!this.editingMode) {
                  this.graph2D?.setData(graphData);
                }
              });
            break;
        }
      }
    }, 1000);
  }

  public back(): void {
    this.dataStorageService.getMultiLevelGraph(this.filter.value, (this.dateFilter.value as Date)?.toISOString())
      .subscribe(graphData => {
        if (this.displayMode === 'multilevel') {
          this.graph2D?.setData(graphData);
          // @ts-ignore
          this.selectedNode = undefined;
        }
      });
  }

  public addNode(): void {
    const dialog = this.dialog.open(AddNodeDialogComponent, {
      width: '300px',
      panelClass: 'info-dialog',
      hasBackdrop: false,
    });

    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.dataStorageService.addNode(result.result).subscribe();
      }
    });
  }

  public setDisplayMode(mode: MatSelectChange): void {
    // @ts-ignore
    this.displayMode = mode.value;
    switch (this.displayMode) {
      case 'sfdp':
        this.drawGraph();
        break;
      case 'multilevel':
        this.drawLevelGraph();
        break;
      case 'circo':
        this.drawCircoGraph();
        break;
      case '3d':
        this.draw3DGraph();
        break;
    }
  }

  public draw3DGraph(): void {
    this.dataStorageService.get3DGraph().subscribe(graphData => {
      const highlightNodes = new Set();
      const highlightLinks = new Set();
      let hoverNode: Graph3DNode | null = null;

      this.graph3d = ForceGraph3D();


      this.graph3d(this.container as HTMLElement)
        .graphData(graphData)
        .width(785)
        .height(369)
        .backgroundColor('#ffffff')
        .linkThreeObject(link => {
          const material = new THREE.LineBasicMaterial({
            color: highlightLinks.has(link) ? this.orangeColor : this.blackColor,
            linewidth: highlightLinks.has(link) ? 2 : 1,
          });
          const geometry = new THREE.BufferGeometry();

          return new THREE.Line(geometry, material);
        })
        .nodeThreeObject((node) => {
          // @ts-ignore
          const imgTexture = new THREE.TextureLoader().load(node.image);
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

  /**
   * Set data to graph container.
   */
  public drawGraph(): void {
    const approved = this.filter.value;
    const dateFilter = (this.dateFilter.value as Date)?.toISOString();
    this.dataStorageService.getFlatGraph(approved, dateFilter)
      .subscribe(graphData => {
        this.graphData = graphData;
        this.graph2D = new Network(this.container as HTMLElement, graphData, this.options);

        this.graph2D.on('selectNode', async (params) => {
          if (params.nodes.length !== 0) {
            const elem = graphData.nodes.filter(node => node.id === params.nodes[0])[0];

            await this.openNodeInfoDialog(elem);
          }
        });

        this.graph2D.on('selectEdge', async (params) => {
          if (params.nodes.length === 0) {
            const elem = graphData.edges.filter(node => node.id === params.edges[0])[0];

            await this.openEdgeInfoDialog(elem);
          }
        });

        this.graph2D.on('dragStart', async () => {
          this.editingMode = true;
        });

        this.graph2D.on('dragEnd', async () => {
          this.saveGraph();
          this.editingMode = false;
        });
      });
  }

  public drawCircoGraph(): void {
    this.dataStorageService.getCircoGraph()
      .subscribe(graphData => {

        this.graph2D = new Network(this.container as HTMLElement, graphData, this.options);

        this.graph2D.on('dragStart', async (params) => {
          this.editingMode = true;
        });

        this.graph2D.on('dragEnd', async (params) => {
          this.saveGraph();
          this.editingMode = false;
        });
      });
  }

  public drawLevelGraph(): void {
    this.dataStorageService.getMultiLevelGraph(this.filter.value, (this.dateFilter.value as Date)?.toISOString())
      .subscribe(graphData => {
        this.allMultiLevelGraph = graphData;

        this.graph2D = new Network(this.container as HTMLElement, graphData, this.options);

        this.graph2D.on('selectNode', async (params) => {
          const elem = this.allMultiLevelGraph.nodes.filter(node => node.id === params.nodes[0])[0];
          console.log(elem);

          if (elem.children && elem.children.length > 0) {
            this.selectedNode = elem;
            const newGraphData = this.createGraphForChild(elem);
            this.allMultiLevelGraph = newGraphData;

            this.graph2D?.setData(newGraphData);
          } else {
            await this.openNodeInfoDialog(elem);
          }
        });

        this.graph2D.on('selectEdge', async (params) => {
          if (params.nodes.length === 0 && params.edges.length !== 0) {
            const elem = this.allMultiLevelGraph.edges.filter(node => node.id === params.edges[0])[0];

            await this.openEdgeInfoDialog(elem);
          }
        });

        this.graph2D.on('dragStart', async () => {
          this.editingMode = true;
        });

        this.graph2D.on('dragEnd', async () => {
          this.saveGraph();
          this.editingMode = false;
        });
    });
  }

  public createGraphForChild(elem: GraphNode): GraphData {
    const nodes = [];
    const edges = [];

    for (const node of elem.children || []) {
      nodes.push(new GraphNode(node));
      // @ts-ignore
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
  }

  openNodeInfoDialog(node: GraphNode): void {
    const dialog = this.dialog.open(InfoDialogComponent, {
      data: node,
      width: '300px',
      panelClass: 'info-dialog',
      hasBackdrop: false,
    });

    dialog.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openEdgeInfoDialog(edge: GraphEdge): void {
    const dialog = this.dialog.open(InfoEdgeDialogComponent, {
      width: '300px',
      data: edge,
      panelClass: 'info-dialog',
      hasBackdrop: false,
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

    if (this.displayMode === 'sfdp') {
      // @ts-ignore
      const { nodes } = this.graph2D.body;

      this.graphData.nodes.map(node => {
        // @ts-ignore
        const updatedNode = Object.values(nodes).find(graphNode => graphNode.id === node.id);
        if (updatedNode) {
          // @ts-ignore
          node.x = updatedNode.x;
          // @ts-ignore
          node.y = updatedNode.y;
        }
      });

      this.dataStorageService.saveGraph(this.graphData.nodes, this.displayMode)
        .subscribe();
    } else if (this.displayMode === 'multilevel') {
      // @ts-ignore
      const { nodes } = this.graph2D.body;

      this.allMultiLevelGraph.nodes.map(graphNode => {
        // @ts-ignore
        const a = Object.values(nodes).find(node => node.id === graphNode.id);
        if (a) {
          // @ts-ignore
          graphNode.x = a.x;
          // @ts-ignore
          graphNode.y = a.y;
        } else {
          if (graphNode.children) {
            // @ts-ignore
            for (const child of graphNode.children) {
              // @ts-ignore
              const b = Object.values(nodes).find(node => node.id === child.id);
              if (b) {
                // @ts-ignore
                child.x = b.x;
                // @ts-ignore
                child.y = b.y;
              }
            }
          }
        }
        return graphNode;
    });
      this.dataStorageService.saveMultilevelGraph(this.allMultiLevelGraph.nodes)
        .subscribe();
    } else if (this.displayMode === 'circo') {
      // @ts-ignore
      const { nodes } = this.graph2D.body;

      this.graphData.nodes.map(node => {
        // @ts-ignore
        const updatedNode = Object.values(nodes).find(graphNode => graphNode.id === node.id);
        if (updatedNode) {
          // @ts-ignore
          node.x = updatedNode.x;
          // @ts-ignore
          node.y = updatedNode.y;
        }
      });

      this.dataStorageService.saveGraph(this.graphData.nodes, this.displayMode)
        .subscribe();
    }
  }
}
