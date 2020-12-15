import { Component, OnInit } from '@angular/core';
import ForceGraph3D, { ForceGraph3DInstance } from '3d-force-graph';
import * as THREE from 'three';
import { DataStorageService } from '../../core/services/data-storage.service';
import { Graph3DNode } from '../../core/models/node';
import { Node3DDto } from '../../core/services/dto/node-dto';
import { EdgeDto } from '../../core/services/dto/edge-dto';
import { Graph3DEdge } from '../../core/models/edge-3d';

@Component({
  selector: 'app-graph3d',
  templateUrl: './graph3d.component.html',
  styleUrls: ['./graph3d.component.css']
})
export class Graph3dComponent implements OnInit {
  private container: HTMLElement | null = null;
  private orangeColor = '#FF8C00';
  private blackColor = '#404040';
  private imageUrl = '../assets/router.png';
  private nameToSave = 'sfdp3D';
  private graph3d: ForceGraph3DInstance | undefined;

  constructor(private dataStorageService: DataStorageService) {}

  /**
   * @inheritDoc
   */
  public ngOnInit(): void {
    this.container = document.getElementById('graph3d-container');
  }


  /**
   * Draw 3D graph by name layout
   * @param layout Layout name.
   */
  public draw3DGraph(layout: string): void {
    const graphData = this.dataStorageService.get3DGraphDataByLayout(layout, this.nameToSave);

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
          linewidth: highlightLinks.has(link) ? 4 : 2,
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
  }

  public saveGraph(): void {
    if (!this.graph3d?.graphData()) {
      return;
    }

    const results = {
      nodes: [] as Node3DDto[],
      edges: [] as EdgeDto[],
    };
    const { nodes, links } = this.graph3d.graphData();

    for (const node of Object.values(nodes)) {
      results.nodes.push({
        id: (node as Graph3DNode).id,
        x: (node as Graph3DNode).x,
        y: (node as Graph3DNode).y,
        z: (node as Graph3DNode).z,
      });
    }

    for (const edge of Object.values(links)) {
      results.edges.push({
        id: (edge as Graph3DEdge).id,
        // @ts-ignore
        source: (edge as Graph3DEdge).source.id,
        // @ts-ignore
        target: (edge as Graph3DEdge).target.id,
      });
    }

    localStorage.setItem(this.nameToSave, JSON.stringify(results));
  }

  private updateHighlight(graph: ForceGraph3DInstance): void {
    // trigger update of highlighted objects in scene
    graph.linkThreeObject(graph.linkThreeObject());
  }

}
