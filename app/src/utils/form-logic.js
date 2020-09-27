export default {
  msg: {
    success: {
      title: "Message",
      message: "Successfully saved.",
      type: 'success',
      duration: 2000
    },
    fail: {
      title: "Error",
      message: "Failed to save.",
      type: 'error',
      duration: 2000
    }
  },
  loading: false,
  submit: function (vm, id, api, data) {
    var msg = this.msg
    vm.$refs.postForm.validate(valid => {
      if (valid) {
        vm.loading = true
        if (id !== '') {
          api.patch(id, data)
            .then(response => {
              vm.$notify(msg.success)
              vm.loading = false
            })
            .catch(err => {
              vm.$notify(msg.fail)
              vm.loading = false
            })
        }
        else {
          api.add(data)
            .then(response => {
              vm.$notify(msg.success)
              vm.loading = false
            })
            .catch(err => {
              vm.$notify(msg.fail)
              vm.loading = false
            })
        }
      }
      else {
        console.log('Failed to submit')
        return false;
      }
    })
  }
}
