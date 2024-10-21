import { CommonModule } from '@angular/common';
import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TodoService } from '../../services/todo.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-todo-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.css']
})
export class TodoDetailComponent implements OnInit {
  todo: any;

  constructor(private todoService: TodoService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.todoService.getTodoById(Number(id)).subscribe((data) => {
      this.todo = data;
    });
  }
}

