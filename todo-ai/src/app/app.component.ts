import {Component, signal} from '@angular/core';
import {MatButton, MatFabButton, MatIconButton} from '@angular/material/button';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatIcon} from '@angular/material/icon';
import {MatList, MatListItem} from '@angular/material/list';
import {NavComponent} from './nav/nav.component';
import {type Todo} from './todo';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatProgressBar} from '@angular/material/progress-bar';

@Component({
  selector: 'app-root',
  imports: [NavComponent, MatFabButton, MatIcon, MatIconButton, MatLabel, MatList, MatListItem, MatCheckbox, MatFormField, MatInput, MatButton],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  protected readonly todos = signal<Todo[]>([
    {text: 'Wash clothes', done: true},
    {text: 'Wash my car', done: true},
    {text: 'Pet the dog', done: false},
  ]);
  protected readonly reply = signal('');

  addTodo() {
    const text = prompt('Enter a new todo.');
    if (text == null) {
      return;
    }

    this.todos.update(todos => [...todos, {text, done: false}]);
  }

  deleteTodo(todo: Todo) {
    this.todos.update(todos => todos.filter(t => t !== todo));
  }

  toggleTodo(todo: Todo) {
    this.todos.update(todos => todos.map(t => t !== todo ? t : {...t, done: !t.done}));
  }

  async runPrompt(userPrompt: string) {
    // @ts-expect-error Origin trial.  
    if (LanguageModel == null) {
      alert('Prompt API is not available in this browser.');
      return;
    }

    let reply = '';
    this.reply.set(reply);

    const systemPrompt = `
      The user will ask questions about their todo list.
      Here's the user's todo list:
      ${this.todos().map(todo => `* ${todo.text} (${todo.done ? 'done' : 'not done'})`).join('\n')}`;
    // @ts-expect-error Origin trial.  
    const session = await LanguageModel.create({
      initialPrompts: [{
        role: 'system',
        content: systemPrompt,
      }],
    });
    const stream = session.promptStreaming(userPrompt);
    for await (const chunk of stream) {
      reply += chunk;
      this.reply.set(reply);
    }
  }
}
