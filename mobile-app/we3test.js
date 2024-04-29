const web3 = require('./modules/web3lib.js');
const {verifyToken} =  require('./modules/web3lib.js');

var block = web3.createBlock({
    name: 'Amr'
});

console.log("Block: ", block);

verifyToken(block, (err, decoded) => {
    if (err) {
        console.log(err)
    } else {
        console.log(decoded);
    }
});