import request from '@/utils/request'

var apitpl = {
  url: '/',
  init: function(data){
    this.url = data.url
    return this
  },
  getList: function(params) {
    return request({
      url: this.url,
      method: 'get',
      params: params
    })
  },
  add: function(data) {
    return request({
      url: this.url,
      method: 'post',
      data
    })
  },
  get: function(id) {
    return request({
      url: this.url + '/' + id,
      method: 'get',
    })
  },
  patch: function (id, data) {
    return request({
      url: this.url + '/' + id,
      method: 'put',
      data
    })
  },
  delete: function (id) {
    return request({
      url: this.url + '/' + id,
      method: 'delete'
    })
  }
}

export default apitpl
