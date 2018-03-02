const http = require('http'),
      request = require('superagent'),
      service = require('../server/service'),
      server = http.createServer(service)

server.listen()

server.on('listening', () => {
  console.log(`The API for weather is is listening on ${server.address().port} in ${service.get('env')}.`)

  const announce = () => {
    request.get(`http://127.0.0.1:3000/service/weather/${server.address().port}`, (err, res) => {
      if(err) {
        console.error('Could not connect to the Slackbot', err)
        return
      }
      console.log(res.body)
    })
  }

  announce()
  setInterval(announce, 15 * 1000)
})
