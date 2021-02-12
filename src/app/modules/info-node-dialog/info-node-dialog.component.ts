import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { GraphNode } from '../../core/models/node';

/**
 * Dialog with node info.
 */
@Component({
  selector: 'app-info-node-dialog',
  templateUrl: 'info-node-dialog.component.html',
  styleUrls: ['./info-node-dialog.component.css']
})
export class InfoNodeDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<InfoNodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GraphNode) {
  }

  /**
   * Close dialog.
   */
  public close(): void {
    this.dialogRef.close();
  }



}
