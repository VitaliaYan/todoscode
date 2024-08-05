import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  newTask: string = '';
  tasks: Array<{ title: string, completed: boolean, editing?: boolean }> = [];
  filter: 'all' | 'active' | 'completed' = 'all';

  addTask() {
    if (this.newTask.trim()) {
      this.tasks.push({ title: this.newTask.trim(), completed: false });
      this.newTask = '';
    }
  }

  editTask(task: { title: string, completed: boolean, editing?: boolean }) {
    task.editing = true;
    setTimeout(() => {
      const input = document.querySelector('.edit-input') as HTMLInputElement;
      if (input) input.focus();
    }, 0);
  }

  saveTask(task: { title: string, completed: boolean, editing?: boolean }) {
    task.editing = false;
    task.title = task.title.trim();
    if (!task.title) {
      this.removeTask(task);
    }
  }

  cancelEdit(task: { title: string, completed: boolean, editing?: boolean }) {
    task.editing = false;
  }

  removeTask(task: { title: string, completed: boolean, editing?: boolean }) {
    this.tasks = this.tasks.filter(t => t !== task);
  }

  get filteredTasks() {
    switch (this.filter) {
      case 'active': return this.tasks.filter(task => !task.completed);
      case 'completed': return this.tasks.filter(task => task.completed);
      default: return this.tasks;
    }
  }

  get remainingTasks() {
    return this.tasks.filter(task => !task.completed).length;
  }

  toggleAllTasks() {
    const allCompleted = this.tasks.every(task => task.completed);
    this.tasks.forEach(task => task.completed = !allCompleted);
  }

  hasCompletedTasks() {
    return this.tasks.some(task => task.completed);
  }

  clearCompleted() {
    this.tasks = this.tasks.filter(task => !task.completed);
  }

  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.edit-input') && !target.closest('.edit')) {
      this.tasks.forEach(task => {
        if (task.editing) {
          this.saveTask(task);
        }
      });
    }
  }
}
