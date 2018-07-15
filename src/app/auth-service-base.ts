import { EventEmitter } from "@angular/core";

export abstract class AuthServiceBase {
    abstract signIn();
    abstract isAuthenticated(): boolean;
    abstract onSignOut();
    abstract Authenticated : EventEmitter<any>;
}