const {BFast} = require('../dist/bfast_node');
BFast.init({applicationId: 'smartstock_lb', projectId: 'smartstock'});
BFast.database.collection('_User').query().limit(1).find().then(console.log);
