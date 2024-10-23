import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [HttpClientModule,CommonModule],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
})
export class TodoListComponent implements OnInit{
  todos: any[] = [];
  constructor(private todoService: TodoService) {}
  ngOnInit(): void {
      this.loadTodos();
  }

  loadTodos(): void {
    this.todoService.getTodos().subscribe((data) => {
      this.todos = Array.isArray(data) ? data : [];
      (error: any) => console.error('Error fetching todos', error)
    })
  }
  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.loadTodos(); 
    });
  }
   markComplete(id: number): void {
    this.todoService.markComplete(id).subscribe(() => {
      this.loadTodos(); 
    });
  }
}

