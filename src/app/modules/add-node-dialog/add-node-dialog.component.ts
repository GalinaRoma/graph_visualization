import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {GraphNode} from '../../core/models/node';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-add-node-dialog',
  templateUrl: 'add-node-dialog.component.html',
  styleUrls: ['./add-node-dialog.component.css']
})
export class AddNodeDialogComponent {
  name = new FormControl('');
  type = new FormControl('');
  ip = new FormControl('');
  mask = new FormControl('');
  constructor(
    public dialogRef: MatDialogRef<AddNodeDialogComponent>,
  ) {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  saveData() {
    const random = 51; // TODO: random of id
    const id = `${this.type.value.substring(0, 1).toLowerCase()}${random}`;
    this.dialogRef.close({
      result: new GraphNode({
        id,
        name: this.name.value,
        type: this.type.value,
        interfaces: [],
        networks: [{
          ip: this.ip.value,
          mask: this.mask.value,
        }],
        created_at: new Date().toISOString(),
      }),
    });
  }

}
