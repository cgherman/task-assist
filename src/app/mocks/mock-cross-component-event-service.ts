import { Subject } from "rxjs";

export class MockCrossComponentEventService {
    public configLoaded: Subject<any> = new Subject();
    public dataReadyToLoad: Subject<any> = new Subject();
    public requestTitleChange: Subject<string> = new Subject();
    public requestWarningMessageAppend: Subject<string> = new Subject();
    public requestWarningMessageClear: Subject<any> = new Subject();
}
