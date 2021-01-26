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
  ) {
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
          ip: '10.10.4.2',
          mask: '255.255.255.252',
        }],
      }),
    });
  }

}
