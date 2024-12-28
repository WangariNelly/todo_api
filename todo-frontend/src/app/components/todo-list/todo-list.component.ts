import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { HttpClientModule } from '@angular/common/http';
import { Todo } from '../../Interfaces/Todo.interface';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];  

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos(); 
  }

  loadTodos(): void {
    this.todoService.getTodos().subscribe(
      (todos: Todo[]) => {
        this.todos = todos;
      },
      (error) => console.error('Error fetching todos', error)
    );
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
