import { Subject } from "rxjs";

export abstract class AuthServiceBase {
    // event fired when authentication fails to load
    public abstract failedToLoadAuth : Subject<any>;

    // event fired when authentication is complete
    public abstract authenticated : Subject<any>;

    // check to see if user is currently authenticated
    public abstract isAuthenticated(): boolean;

    // trigger sign-in
    public abstract signIn();

    // trigger sign-out
    public abstract signOut();
}