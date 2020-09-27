<template>
  <div class="user-edit-container">
    <h1>Edit user</h1>
    <user-edit :uid="uid" />
  </div>
</template>

<script>
import UserEdit from './components/UserEdit'

export default {
  name: 'CreateUser',
  components: { UserEdit },
  data() {
    return {
      uid: this.$route.params.uid
    }
  }
}
</script>
