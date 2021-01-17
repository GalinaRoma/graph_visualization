import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {GraphNode} from '../../core/models/node';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-add-edge-dialog',
  templateUrl: 'add-edge-dialog.component.html',
})
export class AddEdgeDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AddEdgeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { sourceId: string, targetId: string}) {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  saveData() {
    this.dialogRef.close({
      result: true,
    });
  }

}
