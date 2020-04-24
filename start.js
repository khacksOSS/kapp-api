const app = require('./server.js')

app.listen(process.env.PORT || 3000, () => console.log('Server Started') )