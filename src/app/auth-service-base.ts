import { EventEmitter } from "@angular/core";

export interface IAuthService {
    signIn();
    isAuthenticated(): boolean;
    onSignOut();
    Authenticated : EventEmitter<any>;
}

export abstract class AuthServiceBase implements IAuthService {
    abstract signIn();
    abstract isAuthenticated(): boolean;
    abstract onSignOut();
    abstract Authenticated : EventEmitter<any>;
}