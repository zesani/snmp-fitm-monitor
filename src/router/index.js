import Vue from 'vue'
import Router from 'vue-router'
import Monitor from '@/pages/Monitor'
import Interface from '@/pages/Interface'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Monitor',
      component: Monitor
    },
    {
      path: '/interface',
      name: 'Interface',
      component: Interface
    }
  ]
})
