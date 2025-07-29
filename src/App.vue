<template>
  <div id="app">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="nav-links">
        <router-link to="/">Bosh sahifa</router-link>
        <router-link to="/about">Haqida</router-link>
        <router-link to="/trades">My Positsa</router-link>
        <router-link to="/journal">Jurnal</router-link>
        <router-link to="/risk">Risk</router-link>
        <router-link to="/strategies">Strategiyalar</router-link>
        <router-link to="/psychology">Psixologiya</router-link>
      </div>

      <!-- Dark mode toggle -->
      <button @click="toggleDark" class="btn-toggle">
        <span v-if="isDark">🌙</span>
        <span v-else>☀️</span>
      </button>
    </nav>

    <!-- Main content -->
    <main class="container">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      isDark: false,
    };
  },
  mounted() {
    this.isDark = localStorage.getItem("theme") === "dark";
    document.documentElement.classList.toggle("dark", this.isDark);
  },
  methods: {
    toggleDark() {
      this.isDark = !this.isDark;
      document.documentElement.classList.toggle("dark", this.isDark);
      localStorage.setItem("theme", this.isDark ? "dark" : "light");
    },
  },
};
</script>

<style>
/* NAVBAR */
.navbar {
  background: linear-gradient(90deg, #9ECAD6, #748DAE);
  padding: 15px 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.1);
}

.nav-links {
  display: flex;
  gap: 90px;
}

.nav-links a {
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  font-size: 18px;
  transition: all 0.3s;
  position: relative;
}

.nav-links a::after {
  content: "";
  position: absolute;
  width: 0%;
  height: 2px;
  bottom: -4px;
  left: 0;
  background-color: #F5F5F5;
  transition: width 0.3s ease;
}

.nav-links a:hover::after {
  width: 100%;
}

.nav-links a:hover {
  color: #F5F5F5;
}

/* TOGGLE BUTTON */
.btn-toggle {
  position: absolute;
  right: 30px;
  background: transparent;
  border: 2px solid #3e4a60;
  color: #fff;
  font-size: 18px;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-toggle:hover {
  background: #3e4a60;
  border-color: #3e4a60;
  color: #2C313C;
}

/* CONTAINER */
.container {
  padding: 20px 40px;

}

/* DARK MODE */
.dark body {
  background: #1a1a1a;
  color: #f5f5f5;
}

.dark .navbar {
  background: linear-gradient(90deg, #22223b, #22223b);
}

.dark .btn-toggle {
  border-color: #ff7f50;
  color: #ff7f50;
}
</style>
