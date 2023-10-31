import { handler } from './index.mjs';


const EVENT = {
    "somekey": {
        "somesubkey": "somevalue"
    }
}

handler(
    // event
    EVENT,
    // context
    {},
    // callback function with two arguments
    function (err, payload) {
        console.log;       console.log(payload);
    }
);
