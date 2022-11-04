import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import {
  CollectionReference,
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from '@firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Game } from 'src/models/game';


@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.sass']
})
export class StartScreenComponent implements OnInit {

  constructor(private firestore: AngularFirestore, private router: Router) { }

  ngOnInit(): void {
  }



  newGame() {
    let game = new Game();
    this
      .firestore
      .collection('games')
      .add(game.toJson())
      .then((gameinfo: any) => { this.router.navigateByUrl('/game/' + gameinfo.id) })
  }
}
