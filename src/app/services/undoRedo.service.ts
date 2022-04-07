import { EventEmitter, Injectable, Output } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class UndoRedoService {
  dataUndoArray: Array<any> = [];
  dataRedoArray: Array<any> = [];
  undoLimit: number = 10;
  showUndo: boolean = false;
  showRedo: boolean = false;
  @Output() dataEmit = new EventEmitter();

  /* give optional feature to listen to ctrl+z and ctrl+y keypress event listeners to trigger undoredo */

  constructor() {}

  newAction(actionData): void {
    console.log("*****NEW ACTION****", actionData);
    // first we cross check if we are getting valid action data
    if (actionData.event != "") {
      //if we push any new action then we empty redo array
      this.dataRedoArray = [];
      this.showRedo = false;
      //if the undo array reaches stack limit than we need to pop the oldest action
      //we do this by reversing the array, because when we push item it gets added on last index
      //and when we pop, the item gets removed from last index, hence array.reverse.pop
      if (this.dataUndoArray.length == this.undoLimit) {
        this.dataUndoArray.reverse().pop();
        this.dataUndoArray.reverse();
      }
      //after checking for stack limit, we can push action data into undo stack
      this.dataUndoArray.push(actionData);
      this.showUndo = true;
    } else {
      console.log("Invalid action data.");
    }

    console.log("dataUndoArray");
    console.log(this.dataUndoArray);
    console.log("dataRedoArray");
    console.log(this.dataRedoArray);
  }

  clearAll(): void {
    this.dataUndoArray = [];
    this.dataRedoArray = [];
    this.showUndo = false;
    this.showRedo = false;
  }

  undo(): void {
    this.showRedo = true;
    if (this.dataUndoArray.length != 0) {
      console.log(
        "undo Item",
        this.dataUndoArray[this.dataUndoArray.length - 1]
      );
      //emit undo event details
      this.dataEmit.emit({
        type: "undo",
        data: this.dataUndoArray[this.dataUndoArray.length - 1],
      });
      //we push most recent action from undo to redo list
      this.dataRedoArray.push(this.dataUndoArray.pop());
      if (this.dataUndoArray.length == 0) {
        this.showUndo = false;
      }
    }

    console.log("dataUndoArray");
    console.log(this.dataUndoArray);
    console.log("dataRedoArray");
    console.log(this.dataRedoArray);
  }

  redo(): void {
    if (this.dataRedoArray.length != 0) {
      console.log(
        "redo Item",
        this.dataRedoArray[this.dataRedoArray.length - 1]
      );
      //emit redo event details
      this.dataEmit.emit({
        type: "redo",
        data: this.dataRedoArray[this.dataRedoArray.length - 1],
      });
      //we push most recent action from redo to undo list
      this.dataUndoArray.push(this.dataRedoArray.pop());
      if (this.dataRedoArray.length == 0) {
        this.showRedo = false;
      }
    }

    if (this.dataUndoArray.length > 0) {
      this.showUndo = true;
    } else {
      this.showUndo = false;
    }

    console.log("dataUndoArray");
    console.log(this.dataUndoArray);
    console.log("dataRedoArray");
    console.log(this.dataRedoArray);
  }
}
