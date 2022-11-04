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
import { AngularFirestore } from '@angular/fire/compat/firestore/';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.sass']
})
export class GameComponent implements OnInit {




  constructor(private route: ActivatedRoute, private firestore: AngularFirestore, public dialog: MatDialog) { }
  game: Game;
  gameID;
 
  ngOnInit(): void {

    this.route.params.subscribe((params) => {
      this.gameID = params['id'];
      console.log(this.gameID)
      this
        .firestore
        .collection('games')
        .doc(this.gameID)
        .valueChanges()
        .subscribe((game: any) => {
          this.game.players = game.players;
          this.game.stack = game.stack;
          this.game.playedCards = game.playedCards;
          this.game.currentPlayer = game.currentPlayer;
          this.game.currentCard = game.currentCard;
          this.game.pickCardAnimation = game.pickCardAnimation;
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
    this
    .firestore
    .collection('games')
    .doc(this.gameID)
    .update(this.game.toJson());
  }
}





