<template>
  <div id="app">
    <section class="section">
      <div class="container">
        <div class="tabs menu-bar">
          <ul>
            <li :class="selectMenu[0].style" @click="select(0)"><router-link to="/">Monitor</router-link></li>
            <li :class="selectMenu[1].style" @click="select(1)"><router-link to="/interface">Interface</router-link></li>
          </ul>
        </div>
        <router-view :select="select"></router-view>
      </div>
    </section>
  </div>
</template>

<script>
var firebase = require('firebase')
var config = {
  apiKey: 'AIzaSyBe7u9FtZ5ATGU69hfd9NBbHiGCGreSWIM',
  authDomain: 'snmp-monitor-fitm.firebaseapp.com',
  databaseURL: 'https://snmp-monitor-fitm.firebaseio.com',
  projectId: 'snmp-monitor-fitm',
  storageBucket: 'snmp-monitor-fitm.appspot.com',
  messagingSenderId: '992008104190'
}
firebase.initializeApp(config)
import { mapActions } from 'vuex'
export default {
  name: 'app',
  data () {
    return {
      selectMenu: [{
        style: ''
      },
      {
        style: ''
      },
      {
        style: ''
      },
      {
        style: ''
      }]
    }
  },
  mounted () {
    var vm = this
    this.select(0)
    setInterval(() => {
      // vm.getInfo()
      vm.getInfoFire()
    }, 2000)
  },
  methods: {
    ...mapActions(['getInfo', 'getInfoFire']),
    select (menu) {
      this.selectMenu[0].style = ''
      this.selectMenu[1].style = ''
      this.selectMenu[2].style = ''
      this.selectMenu[3].style = ''
      this.selectMenu[menu].style = 'is-active'
    }
  }
}
</script>

<style>
/*#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}*/
</style>
