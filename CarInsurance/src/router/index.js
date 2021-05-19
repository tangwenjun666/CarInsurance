import Vue from 'vue'
import Router from 'vue-router'

import home from '@/components/home.vue'
import login from '@/components/login.vue'

import headerBox from '@/components/headerBox.vue'
import leftBox from '@/components/leftBox.vue'
import mainBox from '@/components/mainBox.vue'
import userInfo from '@/components/userInfo.vue'
import roleInfo from '@/components/roleInfo.vue'
import menuInfo from '@/components/menuInfo.vue'

import clientInfo from '@/components/clientInfo.vue'
import warrantyInfo from '@/components/warrantyInfo.vue'
import dangerInfo from '@/components/dangerInfo.vue'
import surveyInfo from '@/components/surveyInfo.vue'
import claimInfo from '@/components/claimInfo.vue'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/',
			name: 'login',
			component: login
		},
		{
			path: '/home',
			components: {
				default: home,
				header: headerBox,
				left: leftBox,
				main: mainBox
			},
			children: [
				{
					path: "",
					components: {
						header: headerBox,
						left: leftBox,
						main: mainBox
					},
					children: [
						{
							path: "userInfo",
							name: "userInfo",
							components: {
								info: userInfo
							}
						},
						{
							path: "roleInfo",
							name: "roleInfo",
							components: {
								info: roleInfo
							}
						},
						{
							path: "menuInfo",
							name: "menuInfo",
							components: {
								info: menuInfo
							}
						},
						{
							path: "clientInfo",
							name: "clientInfo",
							components: {
								info: clientInfo
							}
						},
						{
							path: "warrantyInfo",
							name: "warrantyInfo",
							components: {
								info: warrantyInfo
							}
						},
						{
							path: "dangerInfo",
							name: "dangerInfo",
							components: {
								info: dangerInfo
							}
						},
						{
							path: "surveyInfo",
							name: "surveyInfo",
							components: {
								info: surveyInfo
							}
						},
						{
							path: "claimInfo",
							name: "claimInfo",
							components: {
								info: claimInfo
							}
						}
					]
				}
			]
		}
	]
})
