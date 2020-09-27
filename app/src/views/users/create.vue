<template>
  <div class="user-edit-container">
    <h1>Create new user</h1>
    <user-edit />
  </div>
</template>

<script>
import UserEdit from './components/UserEdit'

export default {
  name: 'CreateUser',
  components: { UserEdit }
}
</script>
