/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import firebase from 'firebase'
Vue.use(Vuex)
var config = {
  apiKey: 'AIzaSyBe7u9FtZ5ATGU69hfd9NBbHiGCGreSWIM',
  authDomain: 'snmp-monitor-fitm.firebaseapp.com',
  databaseURL: 'https://snmp-monitor-fitm.firebaseio.com',
  projectId: 'snmp-monitor-fitm',
  storageBucket: 'snmp-monitor-fitm.appspot.com',
  messagingSenderId: '992008104190'
}
firebase.initializeApp(config)
var provider = new firebase.auth.FacebookAuthProvider()
const store = new Vuex.Store({
  state: {
    info: '',
    authorized: false,
    profile: '',
    ready: false
  },
  getters: {
    info: state => {
      let data = []
      if (state.info === '') {
        return ''
      } else {
        for (var k in state.info) {
          data.push(state.info[k])
        }
        return data
      }
    },
    profile: state => state.profile,
    authorized: state => state.authorized
  },
  actions: {
    getInfo (context) {
      context.commit('getInfo')
    },
    getInfoFire (context) {
      context.commit('getInfoFire')
    },
    addDevice (context, device) {
      // axios.post('http://localhost:3777/data', params).then(function (res) {
      //   console.log(res)
      // })
      console.log(device)
      context.commit('addDevice', device)
    },
    removeDevice (context, name) {
      // var params = new URLSearchParams()
      // params.append('name', name)
      // axios.post('http://localhost:3777/remove', params).then((response) => {
      //   console.log(response)
      // })
      context.commit('removeDevice', name)
    },
    login () {
      firebase.auth().signInWithRedirect(provider)
    },
    logout (context) {
      context.commit('logout')
    },
    checkLogin (context) {
      context.commit('checkLogin')
    }
  },
  mutations: {
    getInfo (state) {
      axios.get('http://localhost:3777/info').then((response) => {
        // console.log(response.data)
        if (response.data.length !== 0) {
          state.info = response.data
        }
      })
    },
    getInfoFire (state) {
      axios.get('https://snmp-monitor-fitm.firebaseio.com/info/' + state.profile.uid + '.json').then(res => {
        // console.log(res.data)
        state.info = res.data
      })
    },
    addDevice (state, device) {
      firebase.database().ref('/devices/' + state.profile.uid + device.name).update(device)
    },
    removeDevice (state, name) {
      // var params = new URLSearchParams()
      // params.append('name', name)
      // axios.post('http://localhost:3777/remove', params).then((response) => {
      //   console.log(response)
      // })
      firebase.database().ref('/devices/' + state.profile.uid + name).remove()
      firebase.database().ref('/info/' + state.profile.uid + '/' + name).remove()
    },
    checkLogin (state) {
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          state.authorized = true
          state.profile = user
        }
        state.ready = true
      })
      firebase.auth().getRedirectResult().then(function (result) {
        if (result.credential) {}
      }).catch((error) => {
        console.error(error)
      })
    },
    logout (state) {
      firebase.auth().signOut().then(function () {
        state.authorized = false
        state.profile = ''
      }, function (error) {
        console.error(error)
      })
    }
  }
})

export default store
