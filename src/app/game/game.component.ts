import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collectionData, collection, doc } from '@angular/fire/firestore';
import { setDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { updateDoc } from "firebase/firestore";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.sass']
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string = '';
  game: Game;
  games$: Observable<any>

  constructor(private firestore: Firestore, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.newGame();
    const coll = collection(this.firestore, 'games');
    this.games$ = collectionData(coll);
    this.games$.subscribe((game) => {
      console.log('neue todos sind:', game);      
    })
  }


  /*  todos$: Observable<any>;
  todos: Array<any>;
  todotext = '';
    constructor(private firestore: Firestore) {
    const coll = collection(firestore, 'todos');
    this.todos$ = collectionData(coll);
    this.todos$.subscribe((newTodos) => {
      console.log('neue todos sind:', newTodos);
      this.todos = newTodos;
    })
  }

  newTodo() {
    const coll = collection(this.firestore, 'todos');
    setDoc(doc(coll), { name: this.todotext })
  };
} */

  newGame() {
    this.game = new Game();
    console.log(this.game);
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      this.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length

      setTimeout(() => {
        this.pickCardAnimation = false
        this.game.playedCards.push(this.currentCard);
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe(name => {
      if (name && name.length > 0)
        this.game.players.push(name);
    });
  }
}





