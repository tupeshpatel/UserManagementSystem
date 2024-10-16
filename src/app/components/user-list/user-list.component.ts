import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { User } from 'src/app/models/user';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { UserFormComponent } from '../user-form/user-form.component';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})

export class UserListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'email', 'role', 'actions'];
  dataSource: MatTableDataSource<User> = new MatTableDataSource();
  users: User[] = [];

  constructor(public dialog: MatDialog, private userService: UserService,
    private toastr: ToastrService
  ) {
    // Load data from localStorage
    this.users = this.getUsersFromLocalStorage();
    this.dataSource = new MatTableDataSource(this.users);
  }

  ngOnInit(): void {
    this.loadUsers();
    //this.dataSource.data = [...this.users];
    this.dataSource.data = this.users;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Sort and Pagination
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Open the dialog for adding a new user
  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '400px',
      data: {}
    });

    // After dialog closes, reload the users
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();  // Reload the users after adding a new user
      }
    });
  }

  // Method to load the users from the service or local storage
  loadUsers(): void {
    const users = this.userService.getUsers();
    this.dataSource.data = users;
  }

  getUsersFromLocalStorage(): User[] {
    const users = localStorage.getItem('users');
    if (users) {
      console.log('Users from localStorage:', JSON.parse(users));
      return JSON.parse(users);
    }
    return [];
  }

  // Filter (Search functionality)
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // method for deleting a user
  deleteUser(userId: number): void {
    this.userService.deleteUser(userId);
    this.toastr.success('User deleted successfully!');
    this.loadUsers();
  }

  // Open the Edit User Dialog
  openEditDialog(user: User): void {
    const dialogRef = this.dialog.open(UserEditComponent, {
      width: '400px',
      data: { ...user } // Pass the user data to the dialog
    });

    dialogRef.afterClosed().subscribe(updatedUser => {
      if (updatedUser) {
        this.updateUser(updatedUser);
      }
    });
  }

  updateUser(updatedUser: User): void {
    console.log('Attempting to update user with id:', updatedUser.id);
    const users: User[] = JSON.parse(localStorage.getItem('users')!) || [];
    const index = users.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;  // Update the user
      localStorage.setItem('users', JSON.stringify(users));
      this.users = users;
      this.dataSource.data = users;
      console.log('User updated successfully:', updatedUser);
    } else {
      console.error('User not found to update in localStorage');
    }
  }

}