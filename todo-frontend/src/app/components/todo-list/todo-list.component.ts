import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { Router } from '@angular/router';
import { Todo } from '../../Interfaces/Todo.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  todoForm!: FormGroup;
  isEditing: boolean = false;
  editTodoId: number | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private todoService: TodoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTodos();
    this.todoForm = this.formBuilder.group({
      task: ['', Validators.required]
    });
  }

  loadTodos(): void {
    this.todoService.getTodos().subscribe(
      (todos: Todo[]) => {
        console.log('Todos:', todos);
        this.todos = todos;
        console.log('Todos array after assignment:', this.todos)
      },
      (error) => console.error('Error fetching todos', error)
    );
  }

  onSubmit(): void {
    if (this.todoForm.valid) {
      if (this.isEditing && this.editTodoId) {
        // Update the existing todo
        this.todoService.updateTodo(this.editTodoId, this.todoForm.value).subscribe(() => {
          this.resetForm();
          this.loadTodos();
        });
      } else {
        // Create a new todo
        this.todoService.createTodo(this.todoForm.value).subscribe(() => {
          this.resetForm();
          this.loadTodos();
        });
      }
    }
  }

  editTodo(id: number): void {
    this.editTodoId = id;
    const todo = this.todos.find(todo => todo.id === id);
    if (todo) {
      this.todoForm.patchValue({
        task: todo.task
      });
      this.isEditing = true;
    }
  }

  resetForm(): void {
    this.todoForm.reset();
    this.isEditing = false;
    this.editTodoId = null;
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
