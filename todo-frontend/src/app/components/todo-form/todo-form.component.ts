import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css']
})
export class TodoFormComponent implements OnInit {
  todoForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private todoService: TodoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.todoForm = this.formBuilder.group({
      task: ['', Validators.required],
      description: ['', Validators.maxLength(250)],
    });
  }

  onSubmit(): void {
    if (this.todoForm.valid) {
      this.todoService.createTodo(this.todoForm.value).subscribe(() => {
        this.router.navigate(['/todos']);
     });
    }
  }
}

