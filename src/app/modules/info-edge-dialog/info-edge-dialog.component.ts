import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { GraphEdge } from '../../core/models/edge';

/**
 * Dialog with edge info.
 */
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

  /**
   * Close dialog.
   */
  public close(): void {
    this.dialogRef.close();
  }
}
