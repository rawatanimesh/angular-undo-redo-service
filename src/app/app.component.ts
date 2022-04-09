import { Component, OnInit } from '@angular/core';
import { UndoRedoService } from './services/undoRedo.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    public undoRedoService: UndoRedoService,
    private snackBar: MatSnackBar
  ) {}
  actionInputValue: string = 'Sample Value';
  prevValue;

  ngOnInit(): void {
    this.undoRedoService.dataEmit.subscribe((event) => {
      this.handleEvent(event);
    });
  }

  addAction() {
    console.log(this.prevValue, this.actionInputValue);
    this.undoRedoService.newAction({
      oldValue: this.prevValue,
      newValue: this.actionInputValue,
    });
  }

  handleEvent(event) {
    console.log(event);
    switch (event.type) {
      case 'undo': {
        this.actionInputValue = event.data.oldValue;
        break;
      }
      case 'redo': {
        this.actionInputValue = event.data.newValue;
        break;
      }
    }
  }

  showSnackBar(message) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
}
