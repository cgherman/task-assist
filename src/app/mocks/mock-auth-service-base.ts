import { Subject } from "rxjs";

export class MockAuthServiceBase {
    public authenticated: Subject<any> = new Subject();
    public failedToLoadAuth: Subject<any> = new Subject();

    isAuthenticated(): boolean {
        return true;
    }
}
