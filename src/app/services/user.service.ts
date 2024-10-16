import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private users: User[] = JSON.parse(localStorage.getItem('users')!) || [];

  // Fetch users from local storage
  getUsers(): User[] {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];  // Return parsed users from local storage or an empty array
  }

  updateUser(updatedUser: User): void {
    const users: User[] = JSON.parse(localStorage.getItem('users')!) || [];

    // Find the user by ID and update it
    const index = users.findIndex(user => user.id === updatedUser.id);

    if (index !== -1) {
      users[index] = updatedUser;  // Update the user
      console.log('User updated in localStorage:', users[index]);

      // Save the updated users list back to localStorage
      localStorage.setItem('users', JSON.stringify(users));
    } else {
      console.error('User not found to update in localStorage');
    }
  }

  editUser(updatedUser: User): void {
    const users = this.getUsers().map(user =>
      user.id === updatedUser.id ? updatedUser : user
    );
    this.saveUsers(users);
  }

  addUser(user: User): void {
    const users = this.getUsers();
    user.id = new Date().getTime(); // Assign a unique ID
    users.push(user);
    this.saveUsers(users);
  }

  // Delete a user from the local storage by id
  deleteUser(userId: number): void {
    let users = this.getUsers();
    users = users.filter(user => user.id !== userId);  // Filter out the user to delete
    this.saveUsers(users);  // Save updated list
  }

  // Save the list of users to local storage
  private saveUsers(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

}
