import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {GraphNode} from '../../core/models/node';

@Component({
  selector: 'app-info-dialog',
  templateUrl: 'info-dialog.component.html',
  styleUrls: ['./info-dialog.component.css']
})
export class InfoDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<InfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GraphNode) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }



}
