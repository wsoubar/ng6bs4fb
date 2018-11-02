import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //  private authState: Observable<firebase.User>;
  private userDetails: firebase.User = null;

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.afAuth.authState.subscribe(
      (user) => {
        if (user) {
          this.userDetails = user;
          console.log('userDetails', this.userDetails);
        } else {
          this.userDetails = null;
        }
      }
    );
  }

  signUpWithEmail(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        this.userDetails = userCredentials.user;
      })
      .catch(error => {
        console.log(error)
        throw error
      });
  }

  loginWithEmail(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        this.userDetails = userCredentials.user;
        this.router.navigate(['/'])
      })
      .catch(error => {
        console.log(error)
        throw error
      });
  }

  resetPassword(email: string) {
    return this.afAuth.auth.sendPasswordResetEmail(email)
      .then(() => console.log('sent Password Reset Email!'))
      .catch((error) => console.log(error))
  }

  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.userDetails !== null;
  }

  // Anonymous User
  get currentUserAnonymous(): boolean {
    return this.authenticated ? this.userDetails.isAnonymous : false
  }
  get currentUserDisplayName(): string {
    if (!this.userDetails) { return 'Guest' }
    else if (this.currentUserAnonymous) { return 'Anonymous' }
    else { return this.userDetails['displayName'] || 'User without a Name' }
  }
  
  // Returns current user data
  get currentUser(): any {
    return this.authenticated ? this.userDetails : null;
  }
  
  // Returns
  get currentUserObservable(): any {
    return this.afAuth.authState
  }
  logout() {
    this.afAuth.auth.signOut()
      .then((res) => this.router.navigate(['/']));
  }

  /*
    signInWithTwitter() {
      return this.afAuth.auth.signInWithPopup(
        new firebase.auth.TwitterAuthProvider()
      )
    }
  
    signInWithFacebook() {
      return this.afAuth.auth.signInWithPopup(
        new firebase.auth.FacebookAuthProvider()
      )
    }
  
    signInWithGoogle() {
      return this.afAuth.auth.signInWithPopup(
        new firebase.auth.GoogleAuthProvider()
      )
    }
  
  */

}