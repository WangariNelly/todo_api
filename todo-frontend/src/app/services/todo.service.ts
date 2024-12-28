import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from '../Interfaces/Todo.interface';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'http://localhost:3000/api/v1/tasks';

  constructor(private http: HttpClient) {}

  // Fetch all todos
  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.apiUrl}/fetch/todos`);
  }

  // Fetch a specific todo by ID
  getTodoById(id: number): Observable<Todo> {
    return this.http.get<Todo>(`${this.apiUrl}/fetch/todo/${id}`);
  }

  // Create a new todo
  createTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(`${this.apiUrl}/new/todo`, todo);
  }

  // Update an existing todo
  updateTodo(id: number, todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/update/todo/${id}`, todo);
  }

  // Delete a todo by ID
  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/todo/${id}`);
  }

  // Mark a todo as completed
  markComplete(id: number): Observable<Todo> {
    return this.http.patch<Todo>(`${this.apiUrl}/todos/${id}`, { completed: true });
  }
}
