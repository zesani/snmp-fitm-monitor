<template>
  <div id="app">
    <section class="hero is-primary">
      <div class="hero-body  cf level">
        <div class="level-left">
          <div class="level-item">
            <p class="subtitle is-5">
              <strong><i class="fa fa-television fa-5x aa" aria-hidden="true"></i></strong>  SNMP Monitor
            </p>
          </div>
        </div>
       </div>
    </section>
    <section class="section" v-if="authorized">
      <div class="container" >
        <div class="tabs menu-bar">
          <ul>
            <li :class="selectMenu[0].style" @click="select(0)"><router-link to="/">Monitor</router-link></li>
            <li :class="selectMenu[1].style" @click="select(1)"><router-link to="/interface">Interface</router-link></li>
            <!-- <li v-if="!authorized" :class="selectMenu[1].style" @click="login"><a>login</a></li> -->
            <li v-if="authorized" @click="logout"><a><img :src="profile.photoURL" width="20px"alt=""></img>&nbsp; {{profile.displayName}} (logout)</a></li>
          </ul>
        </div>
        <router-view :select="select"></router-view>
      </div>
      <!-- <div class="container" v-if="!authorized">
        <button type="button" name="button" @click="login">Login with facebook</button>
      </div> -->
    </section>
    <section class="section" v-if="!authorized">
    <div class="container">
      <div class="columns is-multiline">
        <div class="column is-12-mobile box is-2-tablet is-offset-5-tablet">
          <img src="https://cdn4.iconfinder.com/data/icons/marketing-and-business-flat-icons/512/monitor_display_imac_marketing_business_flat_icon_symbol-512.png" width="100%" alt="">
        </div>
        <div class="column is-12-mobile box2 is-6-tablet is-offset-3-tablet level">
          <h3 class="title is-3 level-item has-text-centered">Everything Can be Monitored</h3>
          <!-- <img src="http://www.freeiconspng.com/uploads/facebook-logo-png-20.png" width="100%" alt=""> -->
        </div>
        <div class="column is-8-mobile is-offset-2-mobile box3 is-2-tablet is-offset-5-tablet level">
          <!-- <h3 class="title is-3 level-item has-text-centered"></h3> -->
          <div class="level-item has-text-centered">
            <img class="" src="http://www.freeiconspng.com/uploads/facebook-logo-png-20.png" width="20%" alt="">&nbsp;
            <h3 class="title level-item has-text-centered" @click="login">Login With Facebook</h3>
          </div>
        </div>
      </div>
    </div>
  </section>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
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
  computed: {
    ...mapGetters(['profile', 'authorized'])
  },
  mounted () {
    var vm = this
    this.select(0)
    this.checkLogin()
    setInterval(() => {
      // vm.getInfo()
      vm.getInfoFire()
    }, 2000)
  },
  methods: {
    ...mapActions(['getInfo', 'getInfoFire', 'login', 'checkLogin', 'logout']),
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
.cd {
  /*margin-bottom: 100px;*/

}
.cf {
  height: 1px;
  padding-left: 5vw !important;
}
.aa {
  font-size: 50px;
}
.box {
  /*border: 1px solid black;*/
  height: 40vh;
}
.box2 {
  /*border: 1px solid black;
  border-radius: 5px;*/
  height: 15vh;
  /*cursor: pointer;*/
}
.box3 {
  /*border: 1px solid black;*/
  border-radius: 5px;
  height: 10vh;
  cursor: pointer;
}
#app {
  /*font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;*/
}
</style>
