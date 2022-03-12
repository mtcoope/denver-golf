const fs = require('fs').promises;

exports.readSettingsFile = async () => {
    return JSON.parse(await fs.readFile('settings.json', 'utf8', (err, data) => {
        if(err) {
            console.log('Failed to read')
            return;
        }
    }))
}