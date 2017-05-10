/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    info: ''
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
    }
  },
  actions: {
    getInfo (context) {
      context.commit('getInfo')
    },
    getInfoFire (context) {
      context.commit('getInfoFire')
    },
    addDevice (context, params) {
      axios.post('http://localhost:3777/data', params).then(function (res) {
        console.log(res)
      })
    },
    removeDevice (context, name) {
      var params = new URLSearchParams()
      params.append('name', name)
      axios.post('http://localhost:3777/remove', params).then((response) => {
        console.log(response)
      })
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
      axios.get('https://snmp-monitor-fitm.firebaseio.com/info.json').then(res => {
        // console.log(res.data)
        state.info = res.data
      })
    }
  }
})

export default store
