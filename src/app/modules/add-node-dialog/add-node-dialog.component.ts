import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {GraphNode} from '../../core/models/node';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-add-node-dialog',
  templateUrl: 'add-node-dialog.component.html',
})
export class AddNodeDialogComponent {
  id = 50;
  constructor(
    public dialogRef: MatDialogRef<AddNodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { x: number, y: number}) {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  saveData() {
    this.id += 1;
    this.dialogRef.close({
      result: new GraphNode({
        id: `h${this.id}`,
        name: 'Host 50',
        type: 'host',
        interfaces: [],
        networks: [{
          ip: '192.168.10.1',
          mask: '255.255.255.0',
        }],
        x: this.data.x,
        y: this.data.y,
      }),
    });
  }

}
