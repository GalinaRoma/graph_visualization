import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Network } from 'vis-network/peer';
import ForceGraph3D, { ForceGraph3DInstance } from '3d-force-graph';
import * as THREE from 'three';

import { DataStorageService } from '../../core/services/data-storage.service';
import { Graph3DNode } from '../../core/models/node-3d';
import { GraphData } from '../../core/models/graph-data';
import { GraphEdge } from '../../core/models/edge';
import { GraphNode } from '../../core/models/node';
import { AddNodeDialogComponent } from '../add-node-dialog/add-node-dialog.component';
import { InfoEdgeDialogComponent } from '../info-edge-dialog/info-edge-dialog.component';
import { InfoNodeDialogComponent } from '../info-node-dialog/info-node-dialog.component';

/**
 * Graph component.
 */
@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  /**
   * Options for Vis.js graph
   * To disable physics interaction.
   * And nodes should use image for view.
   */
  private options = {
    physics: {
      enabled: false
    },
    nodes: {
      shape: 'image',
    },
    interaction: { keyboard: true },
  };
  /**
   * Options for open dialog.
   */
  private dialogOptions = {
    width: '300px',
    panelClass: 'info-dialog',
    hasBackdrop: false,
  };
  /**
   * HTML container.
   */
  private container: HTMLElement | null = null;
  /**
   * Graph2d structure.
   */
  private graph2D: Network | undefined;
  /**
   * Graph3d structure.
   */
  private graph3d: ForceGraph3DInstance | undefined;
  /**
   * Current flat graph data (circo or sfdp).
   */
  private flatGraphData: GraphData | undefined;
  /**
   * Current multilevel graph data (all levels).
   */
  private allMultiLevelGraph: GraphData | undefined;
  /**
   * Current multilevel graph data (current view levels).
   */
  private currentMultiLevelGraph: GraphData | undefined;
  /**
   * Selected node (for multilevel graph).
   */
  public selectedNode: GraphNode | undefined;
  /**
   * Flag for editing mode (when user change node position).
   */
  private editingMode = false;
  /**
   * Display mode of view.
   */
  public displayMode = 'sfdp';
  /**
   * Approve filter control.
   */
  public approveFilter = new FormControl(null);
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
    this.initDraw();
    // Set interval for auto update data from server.
    setInterval(() => {
      if (!this.editingMode) {
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
        }
      }
    }, 1000);
  }

  private initDraw(): void {
    this.graph2D = new Network(this.container as HTMLElement, {}, this.options);

    this.graph2D?.on('selectNode', async (params) => {
      if (this.displayMode === 'multilevel') {
        const elem = this.currentMultiLevelGraph?.nodes.filter(node => node.id === params.nodes[0])[0];

        if (elem && elem.children && elem.children.length > 0) {
          this.selectedNode = elem;
          const newGraphData = this.createGraphForChild(elem);
          this.currentMultiLevelGraph = newGraphData;

          this.graph2D?.setData(newGraphData);
        } else if (elem) {
          await this.openNodeInfoDialog(elem);
        }
      }
      if (this.displayMode === 'sfdp') {
        if (params.nodes.length !== 0) {
          const elem = this.flatGraphData?.nodes.filter(node => node.id === params.nodes[0])[0];
          if (elem) {
            await this.openNodeInfoDialog(elem);
          }
        }
      }
    });

    this.graph2D?.on('selectEdge', async (params) => {
      if (this.displayMode === 'multilevel') {
        if (params.nodes.length === 0 && params.edges.length !== 0) {
          const elem = this.currentMultiLevelGraph?.edges.filter(node => node.id === params.edges[0])[0];
          if (elem) {
            await this.openEdgeInfoDialog(elem);
          }
        }
      }
      if (this.displayMode === 'sfdp') {
        if (params.nodes.length === 0) {
          const elem = this.flatGraphData?.edges.filter(node => node.id === params.edges[0])[0];
          if (elem) {
            await this.openEdgeInfoDialog(elem);
          }
        }
      }
    });

    this.graph2D?.on('dragStart', async () => {
      this.editingMode = true;
    });

    this.graph2D?.on('dragEnd', async () => {
      this.saveGraph();
      this.editingMode = false;
    });
  }

  /**
   * Set data to flat sfdp graph container.
   */
  public drawGraph(): void {
    const approved = this.approveFilter.value;
    const dateFilter = (this.dateFilter.value as Date)?.toISOString();
    this.dataStorageService.getFlatGraph(approved, dateFilter)
      .subscribe(graphData => {
        if (!this.editingMode) {
          this.flatGraphData = graphData;
          if (this.graph2D) {
            this.graph2D?.setData(graphData);
          }
        }
      });
  }

  /**
   * Set data to flat circo graph container.
   */
  public drawCircoGraph(): void {
    this.dataStorageService.getCircoGraph()
      .subscribe(graphData => {
        if (!this.editingMode) {
          this.flatGraphData = graphData;
          if (this.graph2D) {
            this.graph2D?.setData(graphData);
          }
        }
      });
  }

  /**
   * Set data to multilevel graph container.
   */
  public drawLevelGraph(): void {
    this.dataStorageService.getMultiLevelGraph(this.approveFilter.value, (this.dateFilter.value as Date)?.toISOString())
      .subscribe(graphData => {
        this.allMultiLevelGraph = graphData;
        if (!this.editingMode) {
          let newGraphData = graphData;
          if (this.selectedNode) {
            const elem = graphData.nodes.filter(node => node.id === this.selectedNode?.id)[0];
            newGraphData = this.createGraphForChild(elem);
          }
          if (this.graph2D) {
            this.currentMultiLevelGraph = newGraphData;
            this.graph2D?.setData(newGraphData);
          }
        }
    });
  }

  /**
   * Save updated coordinates.
   */
  public saveGraph(): void {
    if (!this.graph2D) {
      return;
    }

    if (this.displayMode === 'sfdp' || this.displayMode === 'circo') {
      // @ts-ignore
      const { nodes } = this.graph2D.body;

      this.flatGraphData?.nodes.map(node => {
        // @ts-ignore
        const updatedNode = Object.values(nodes).find(graphNode => graphNode.id === node.id);
        if (updatedNode) {
          // @ts-ignore
          node.x = updatedNode.x;
          // @ts-ignore
          node.y = updatedNode.y;
        }
      });

      if (this.flatGraphData) {
        this.dataStorageService.saveGraph(this.flatGraphData.nodes, this.displayMode)
          .subscribe();
      }
    } else if (this.displayMode === 'multilevel') {
      // @ts-ignore
      const { nodes } = this.graph2D.body;

      this.allMultiLevelGraph?.nodes.map(graphNode => {
        // @ts-ignore
        const updatedNode = Object.values(nodes).find(node => node.id === graphNode.id);
        if (updatedNode) {
          // @ts-ignore
          graphNode.x = updatedNode.x;
          // @ts-ignore
          graphNode.y = updatedNode.y;
        } else {
          if (graphNode.children) {
            for (const child of graphNode.children) {
              // @ts-ignore
              const updatedChildNode = Object.values(nodes).find(node => node.id === child.id);
              if (updatedChildNode) {
                // @ts-ignore
                child.x = updatedChildNode.x;
                // @ts-ignore
                child.y = updatedChildNode.y;
              }
            }
          }
        }
        return graphNode;
      });

      if (this.allMultiLevelGraph) {
        this.dataStorageService.saveMultilevelGraph(this.allMultiLevelGraph.nodes)
          .subscribe();
      }
    }
  }

  /**
   * Set display mode and draw mode.
   */
  public setDisplayMode(mode: MatSelectChange): void {
    this.displayMode = mode.value;
    switch (this.displayMode) {
      case 'sfdp':
        this.initDraw();
        this.drawGraph();
        break;
      case 'multilevel':
        this.initDraw();
        this.drawLevelGraph();
        break;
      case 'circo':
        this.initDraw();
        this.drawCircoGraph();
        break;
      case '3d':
        this.draw3DGraph();
        break;
    }
  }

  /**
   * Draw 3D graph.
   */
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
            color: highlightLinks.has(link) ? '#FF8C00' : '#404040',
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

          // trigger update of highlighted objects in scene
          (this.graph3d as ForceGraph3DInstance).linkThreeObject((this.graph3d as ForceGraph3DInstance).linkThreeObject());
        });
    });
  }

  /**
   * Open node info dialog.
   */
  public openNodeInfoDialog(node: GraphNode): void {
    const dialog = this.dialog.open(InfoNodeDialogComponent, {
      ...this.dialogOptions,
      data: node,
    });

    dialog.afterClosed().subscribe();
  }

  /**
   * Open edge info dialog.
   */
  public openEdgeInfoDialog(edge: GraphEdge): void {
    const dialog = this.dialog.open(InfoEdgeDialogComponent, {
      ...this.dialogOptions,
      data: edge,
    });

    dialog.afterClosed().subscribe();
  }

  /**
   * Return to first level of multilevel graph.
   */
  public back(): void {
    this.selectedNode = undefined;
    if (this.displayMode === 'multilevel' && this.allMultiLevelGraph) {
      this.graph2D?.setData(this.allMultiLevelGraph);
    }
  }

  /**
   * Add new node to graph.
   */
  public addNode(): void {
    const dialog = this.dialog.open(AddNodeDialogComponent, this.dialogOptions);

    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.dataStorageService.addNode(result.result).subscribe();
      }
    });
  }

  private createGraphForChild(elem: GraphNode): GraphData {
    const nodes = [];
    const edges = [];

    for (const node of elem.children || []) {
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
  }
}
