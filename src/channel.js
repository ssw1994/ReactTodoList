import { Subject } from "rxjs";

let channel = (() => {

    let dbObserver = new Subject();
    let editObserver = new Subject();
    return {
        dbObserver,
        editObserver
    }
})();

export default channel;