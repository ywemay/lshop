import request from '@/utils/request'
import apitpl from '@/utils/apitpl'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

var usersAPI = apitpl.init({ url: '/users'});

console.log(usersAPI)

export { usersAPI };

/**
export function getList(params) {
  return request({
    url: '/users',
    method: 'get',
    params: params
  })
}

export function addUser(data) {
  return request({
    url: '/users/',
    method: 'post',
    data
  })
}

export function getUser(uid) {
  return request({
    url: '/users/' + uid,
    method: 'get',
  })
}

export function patchUser(uid, data) {
  return request({
    url: '/users/' + uid,
    method: 'put',
    data
  })
}

export function deleteUser(uid) {
  return request({
    url: '/users/' + uid,
    method: 'delete'
  })
}*/
