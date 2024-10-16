import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})

export class UserEditComponent {

  editUserForm!: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<UserEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private fb: FormBuilder, private toastr: ToastrService
  ) {
    // Initialize form with user data
    this.editUserForm = this.fb.group({
      name: [this.data.name, Validators.required],
      email: [this.data.email, [Validators.required, Validators.email]],
      role: [this.data.role, Validators.required],
      id: [this.data.id]
    });
  }

  onSubmit(): void {
    if (this.editUserForm.valid) {
      this.toastr.success('User updated successfully!');
      this.dialogRef.close(this.editUserForm.value);
    }
  }

}
