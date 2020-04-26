// const {EventController} = require("../../dist/src/controllers/EventController");
// const {EventEmitter} = require('events');
// const axios = require('axios');
//
// const {describe, it} = require("mocha");
//
// const assets = require('assert');
//
// describe('Event Emitter', async function () {
//     it('should emit event', async function () {
//         const emitter = new EventController('test_ev');
//         emitter.emitter.on('test_ev', (data) => {
//             console.log('fuck**********');
//             console.log(data);
//             assets(false, data);
//             done();
//         })
//         emitter.emit({auth: null, payload: 'Hello Joshua'});
//     });
// });