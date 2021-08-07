const path = require('path');
const fs = require('fs');
module.exports = {
  read: function(file) {
    const load = fs.readFileSync(file, 'utf-8');
    return JSON.parse(load);
  }
}
