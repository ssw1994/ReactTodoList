import { Subject } from "rxjs";

let channel = (() => {

    let dbObserver = new Subject();
    let editObserver = new Subject();
    let sortObserver = new Subject();
    return {
        dbObserver,
        editObserver,
        sortObserver
    }
})();

export default channel;