const express = require('express'),
      moment = require('moment'),
      service = express(),
      request = require('superagent')



service.get('/service/:location', (req, res, next) => {

  // TODO: rm this key pre-commit
  // transform city name to lat & lng...
  request.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${req.params.location}&key=AIzaSyDaZZQrwHVpvjVpullwZmVohMPniMn-tII`, (err, response) => {
    if (err) {
      console.log(err)
      return res.sendStatus(500)
    }

    const {lat, lng} = response.body.results[0].geometry.location,
          timestamp = Number(moment().format('X')) // + coerces into integer, X gives Unix timestamp

    // ...and use lat & lng to get time at that location
    request.get(`https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${timestamp}&key=AIzaSyCafAMvOgT7OHTvw_eRsDnwhof5Uk9hXKQ`, (err, response) => {
      if (err) {
        console.log(err)
        return res.sendStatus(500)
      }

      const result = response.body,
            timeString = moment.unix(timestamp + result.dstOffset + result.rawOffset).utc()
              .format('dddd, MMMM Do YYYY, h:mm:ss a')

      res.json({result: timeString})
    })
  })

})

module.exports = service
