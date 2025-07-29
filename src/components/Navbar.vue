<template>
  <nav class="navbar">
    <ul>
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/about">Haqida</router-link></li>
      <li><router-link to="/risk">Risk Management</router-link></li>
      <li><router-link to="/strategy">Strategiyalar</router-link></li>
      <li><router-link to="/journal">Jurnal</router-link></li>
      <li><router-link to="/psychology">Psixologiya</router-link></li>
    </ul>
  </nav>
</template>

<style scoped>
.navbar {
  background: #2C313C;
  padding: 35px;
}
ul {
  display: flex;
  gap: 40px;
  list-style: none;
}
li a {
  color: #1b106c;
  text-decoration: none;
  font-weight: bold;
}
li a.router-link-active {
  color: #4CAF50;
}
</style>
<script setup lang="ts">
</script>