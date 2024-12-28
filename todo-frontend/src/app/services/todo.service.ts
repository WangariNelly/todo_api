import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from '../Interfaces/Todo.interface';


@Injectable({
  providedIn: 'root'
})

export class TodoService {
private apiUrl = 'http://localhost:3000/api/v1/tasks';
  constructor( private http: HttpClient) { }

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.apiUrl}/fetch/todos`);
  }
  getTodoById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/fetch/todo/${id}`);
  }

  createTodo(todo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/new/todo`, todo);
  }

  updateTodo(id: number, todo: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/todo/${id}`, todo);
  }

  deleteTodo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/todo/${id}`);
  }

  markComplete(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/todos/${id}`, { completed: true });
  }
}
