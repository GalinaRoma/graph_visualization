import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {GraphNode} from '../../core/models/node';
import {GraphEdge} from '../../core/models/edge';

@Component({
  selector: 'app-info-edge-dialog',
  templateUrl: 'info-edge-dialog.component.html',
  styleUrls: ['./info-edge-dialog.component.css']
})
export class InfoEdgeDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<InfoEdgeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GraphEdge) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }



}
