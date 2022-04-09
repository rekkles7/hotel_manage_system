import Vue from 'vue'
import Vuex from 'vuex'
import {getToken, removeToken, setToken} from "@/utils/auth";
import {getInfo, logout,login} from "@/api/login";


Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        operation: '',
        token: getToken(),
        user: {},
        roles: [],
        userId: '',
        userName: ''
    },
    mutations: {
        SET_OP: (state, payload) => {
            state.operation = payload
        },
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_USER: (state, user) => {
            state.user = user
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_USERID: (state, roles) => {
            state.userId = roles
        },
        SET_USERNAME: (state, roles) => {
            state.userName = roles
        }
    },
    actions: {
        // 登录
        Login({ commit }, userInfo) {
            const rememberMe = userInfo.rememberMe
            return new Promise((resolve, reject) => {
                login(userInfo.username, userInfo.password, userInfo.code, userInfo.uuid).then(res => {
                    setToken(res.data.token, rememberMe)
                    commit('SET_USERNAME',res.data.user.admin.username)
                    commit('SET_USERID',res.data.user.admin.id)
                    window.localStorage.setItem('userId', JSON.stringify(res.data.user.admin.id))
                    window.localStorage.setItem('userName', JSON.stringify(res.data.user.admin.username))
                    commit('SET_TOKEN', res.data.token)
                    setUserInfo(res.data.user, commit)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 获取用户信息，用作动态路由
        GetInfo({ commit }) {
            return new Promise((resolve, reject) => {
                getInfo().then(res => {
                    setUserInfo(res.data, commit)
                    console.log('执行完了')
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 登出
        LogOut({ commit }) {
            return new Promise((resolve, reject) => {
                logout().then(res => {
                    logOut(commit)
                    resolve()
                }).catch(error => {
                    logOut(commit)
                    reject(error)
                })
            })
        }
    },
    getters: {
        getUserId: state => {
            let userId = state.userId
            if (!userId) {
                userId = JSON.parse(window.localStorage.getItem('userId') || null)
            }
            return userId
        },
        getUserName: state => {
            let userName = state.userName
            if (!userName) {
                userName = JSON.parse(window.localStorage.getItem('userName') || null)
            }
            return userName
        },
    }

})

const logOut = (commit) => {
    commit('SET_TOKEN', '')
    commit('SET_ROLES', [])
    removeToken()
}

const setUserInfo = (user, commit) => {
    // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
    if (user.roles.length === 0) {
        commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT'])
    } else {
        commit('SET_ROLES', user.roles)
    }
    commit('SET_USER', user.user)
}
