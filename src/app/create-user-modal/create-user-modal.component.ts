import { Component, OnInit} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-user-modal',
  templateUrl: './create-user-modal.component.html',
  styleUrls: ['./create-user-modal.component.css']
})
export class CreateUserModalComponent {
  
    constructor(public dialogRef: MatDialogRef<CreateUserModalComponent>) {}
  
    closeDialog() {
      this.dialogRef.close();
    }
}
