import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

import { GraphNode } from '../../core/models/node';

/**
 * Dialog for add new node.
 */
@Component({
  selector: 'app-add-node-dialog',
  templateUrl: 'add-node-dialog.component.html',
  styleUrls: ['./add-node-dialog.component.css']
})
export class AddNodeDialogComponent {
  /**
   * Name control.
   */
  public name = new FormControl('');
  /**
   * Type control.
   */
  public type = new FormControl('');
  /**
   * IP control.
   */
  public ip = new FormControl('');
  /**
   * Mask control.
   */
  public mask = new FormControl('');

  constructor(
    public dialogRef: MatDialogRef<AddNodeDialogComponent>,
  ) {
  }

  /**
   * Close dialog.
   */
  public close(): void {
    this.dialogRef.close();
  }

  /**
   * Save new node.
   */
  public saveData(): void {
    const random = Math.floor(Math.random() * 100 + 10); // In real project generate uuid.
    const id = `${this.type.value.substring(0, 1).toLowerCase()}${random}`;

    this.dialogRef.close({
      result: new GraphNode({
        id,
        name: this.name.value,
        type: this.type.value,
        interfaces: [{
          ip: this.ip.value,
          mask: this.mask.value,
        }],
        createdAt: new Date().toISOString(),
        neighbors: [],
      }),
    });
  }

}
