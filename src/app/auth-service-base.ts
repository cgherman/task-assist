import { EventEmitter } from "@angular/core";

export abstract class AuthServiceBase {
    // trigger sign-in
    abstract signIn();
    
    // check to see if user is currently authenticated
    abstract isAuthenticated(): boolean;

    // event fired when authentication is complete
    abstract Authenticated : EventEmitter<any>;

    // trigger sign-out
    abstract signOut();
}