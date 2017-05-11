var express = require('express')
var app = express()
var snmp = require('snmp-native')
let firebase = require('firebase')
var bodyParser = require('body-parser')
var path = require('path')
var config = {
  apiKey: 'AIzaSyBe7u9FtZ5ATGU69hfd9NBbHiGCGreSWIM',
  authDomain: 'snmp-monitor-fitm.firebaseapp.com',
  databaseURL: 'https://snmp-monitor-fitm.firebaseio.com',
  projectId: 'snmp-monitor-fitm',
  storageBucket: 'snmp-monitor-fitm.appspot.com',
  messagingSenderId: '992008104190'
}
firebase.initializeApp(config)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// var moment = require('moment')
var staticPath = path.join(__dirname, './dist')
app.use('/', express.static(staticPath))
var devices = []
var Devices = firebase.database().ref('devices')
Devices.on('child_added', function (data) {
  var item = data.val()
  item.id = data.key
  devices.push(item)
  console.log(item)
})
Devices.on('child_removed', function (data) {
  var id = data.key
  console.log(id)
  console.log(data.val())
  // firebase.database().ref('/info/' + data.val().uid + '/' + data.val().name).remove()
  var index = devices.findIndex(story => story.id === id)
  devices.splice(index, 1)
  let indexInfo = Info.findIndex(item => item.name === data.val().name)
  if (indexInfo === -1) {
  } else {
    Info.splice(indexInfo, 1)
  }
})
var Info = []
setInterval(() => {
  devices.forEach(item => {
    getInfo(item)
  })
}, 5000)
app.get('/info', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.send(Info)
})
app.post('/data', function (req, res) {
  console.log(req.body)
  let device = {
    ip: req.body.ip,
    community: req.body.community,
    name: req.body.name
  }
  // devices.push(device)
  firebase.database().ref('/devices/' + req.body.name).update(device)
})
app.post('/remove', function (req, res) {
  console.log(req.body.name)
  firebase.database().ref('/devices/' + req.body.name).remove()
  firebase.database().ref('/info/' + req.body.name).remove()
})
function getInfo (device) {
  let info = {}
  // os
  let deviceNetwork = new snmp.Session({ host: device.ip, community: device.community })
  deviceNetwork.get({ oid: [1, 3, 6, 1, 2, 1, 1, 1, 0] }, function (err, varbinds) {
    if (err) {
      console.log(err)
    } else {
      info = {
        os: varbinds[0].value,
        name: device.name
      }
    }
  })
  // cpu
  deviceNetwork.get({ oid: [1, 3, 6, 1, 4, 1, 9, 9, 109, 1, 1, 1, 1, 5, 1] }, function (err, varbinds) {
    if (err) {
      console.log(err)
    } else {
      info.cpu = varbinds[0].value
    }
  })
  deviceNetwork.get({ oid: [1, 3, 6, 1, 4, 1, 9, 9, 48, 1, 1, 1, 5, 1] }, function (err, varbinds) {
    if (err) {
      console.log(err)
    } else {
      info.mem = bytesToSize(varbinds[0].value)
    }
  })
  // temp
  deviceNetwork.getSubtree({ oid: [1, 3, 6, 1, 4, 1, 9, 9, 13, 1, 3, 1, 3] }, function (err, varbinds) {
    if (err) {
      console.log(err)
    } else {
      info.temp = varbinds[0].value
    }
  })
  // inbound
  var inbound = []
  deviceNetwork.getSubtree({ oid: [1, 3, 6, 1, 2, 1, 2, 2, 1, 10] }, function (err, varbinds) {
    if (err) {
      console.log(err)
    } else {
      for (var index in varbinds) {
        let data = {
          indexOID: varbinds[index].oid[10],
          inbound: parseInt(varbinds[index].value / 1048576)
        }
        inbound.push(data)
      }
    }
  })
  // outbound
  let outbound = []
  deviceNetwork.getSubtree({ oid: [1, 3, 6, 1, 2, 1, 2, 2, 1, 16] }, function (err, varbinds) {
    if (err) {
      console.log(err)
    } else {
      for (var index in varbinds) {
        let data = {
          indexOID: varbinds[index].oid[10],
          outbound: parseInt(varbinds[index].value / 1048576)
        }
        outbound.push(data)
      }
    }
  })
  // status
  var status = []
  deviceNetwork.getSubtree({ oid: [1, 3, 6, 1, 2, 1, 2, 2, 1, 8] }, function (err, varbinds) {
    if (err) {
      console.log(err)
    } else {
      for (var index in varbinds) {
        if (varbinds[index].value === 1) {
          status.push('Up')
        } else if (varbinds[index].value === 2) {
          status.push('Down')
        } else {
          status.push('')
        }
      }
    }
  })
  // name interface
  var sumInbound = 0
  var sumOutbound = 0
  deviceNetwork.getSubtree({ oid: [1, 3, 6, 1, 2, 1, 2, 2, 1, 2] }, function (err, varbinds) {
    if (err) {
      firebase.database().ref('/devices/' + device.uid + device.name).remove()
      console.log(err)
    } else {
      if ((inbound.length !== 0) && (outbound.length !== 0) && (status.length !== 0)) {
        info.interface = []
        info.inbound = ''
        info.outbound = ''
        for (var index in varbinds) {
          for (var i in inbound) {
            if (varbinds[index].oid[10] === inbound[i].indexOID) {
              sumInbound += inbound[i].inbound
              sumOutbound += outbound[i].outbound
              let data = {
                interface: varbinds[index].value,
                status: status[index],
                inbound: inbound[i].inbound,
                outbound: outbound[i].outbound
              }
              info.interface.push(data)
            }
          }
        }
        info.inbound = sumInbound
        info.outbound = sumOutbound
        let indexInfo = Info.findIndex(item => item.name === device.name)
        if (indexInfo === -1) {
          Info.push(info)
          console.log(indexInfo)
        } else {
          Info.splice(indexInfo, 1, info)
        }
        // info.uid = device.uid
        firebase.database().ref('/info/' + device.uid + '/' + device.name).update(info)
        // firebase.database().ref('/info/' + device.name).push(info)
        deviceNetwork.close()
      }
    }
  })
}

function bytesToSize (bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Byte'
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
}
app.listen('3777', function () {
  console.log('https://snmp-monitor-fitm.firebaseapp.com')
  console.log('http://localhost:3777')
})
