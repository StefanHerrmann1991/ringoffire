import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import {
  CollectionReference,
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
  getFirestore
} from '@firebase/firestore';

import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { collectionData, Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.sass']
})
export class GameComponent implements OnInit {

  private pokemonCollection: CollectionReference<DocumentData>;
  game: Game;
  gameID;
  games$: Observable<any>
  coll = collection(this.firestore, 'games');

  constructor(private route: ActivatedRoute, private firestore: Firestore, public dialog: MatDialog) { }

  ngOnInit(): void {

    this.route.params.subscribe((params) => {
      debugger;
      this.gameID = params['id'];
      doc(params['id']);
      this.games$ = collectionData(this.coll);
      this.games$.subscribe((game: any) => {
        console.log(this.game.players)
        this.game.players = game.players,
          this.game.stack = game.stack,
          this.game.playedCards = game.playedCards,
          this.game.currentPlayer = game.currentPlayer,
          this.game.currentCard = game.currentCard,
          this.game.pickCardAnimation = game.pickCardAnimation
      })
    })
  }

  takeCard() {
    if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop();
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length
      this.saveGame();
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
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

  saveGame() {
    const gamesDocumentReference = doc(
      this.firestore,
      `${this.gameID}`
    );
    return updateDoc(gamesDocumentReference, { 'games': this.game });
  }


}





