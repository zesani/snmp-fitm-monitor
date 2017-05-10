<template lang="html">
  <div class="">
    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <div class="columns  is-multiline">
            <div class="column is-8 is-offset-2 is-hidden-mobile">
              <div class="tabs is-toggle is-fullwidth is-small" v-if="!(info === '')">
                <ul>
                  <li :class="{'is-active': device === i.name}" v-for="i in info" @click="setDevice(i.name)">
                    <a>
                      <span class="icon"><i class="fa fa-server"></i></span>
                      <span>{{i.name}}</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="is-hidden-tablet">
              <a class="button is-primary" @click="menu = !menu">Show list device</a>
              <div class="tabs is-toggle is-fullwidth is-small" v-if="!(info === '')" v-show="menu">
                <ul>
                  <li :class="{'is-active': device === i.name}" v-for="i in info" @click="setDeviceMobile(i.name)">
                    <a>
                      <span class="icon"></i></span>
                      <span>{{i.name}}</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="column is-8 is-offset-2 " v-if="!(info === '')">
              <table class="table is-bordered" v-if="!(show === '')">
                <thead>
                  <tr>
                    <th>Interface</th>
                    <th>Status</th>
                    <th>IN</th>
                    <th>OUT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="o in show.interface">
                    <td>{{o.interface}}</td>
                    <td v-if="o.status === 'Down'" class="down">DOWN</td>
                    <td v-else class="up">UP</span></td>
                    <td>{{o.inbound}}</td>
                    <td>{{o.outbound}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'interface',
  props: ['select'],
  data () {
    return {
      device: '',
      menu: false
    }
  },
  mounted () {
    this.select(1)
  },
  computed: {
    ...mapGetters(['info']),
    show () {
      let index = this.info.findIndex(item => item.name === this.device)
      if (index === -1) {
        return ''
      } else {
        return this.info[index]
      }
    }
  },
  methods: {
    setDevice (device) {
      this.device = device
    },
    setDeviceMobile (device) {
      this.device = device
      this.menu = !this.menu
    }
  }
}
</script>

<style lang="css">
.down {
  background-color: #FF3860;
  width: 10px;
}
.up {
  background-color: #23D160;
  width: 10px;
}
</style>
