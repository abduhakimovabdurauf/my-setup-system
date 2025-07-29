<template>
  <div class="editor">
    <h1 class="title">Editor</h1>

    <!-- Yangi strategiya yozish -->
    <div class="editor-box">
      <textarea
          v-model="newStrategy"
          placeholder="Strategiya yoki izoh kiriting..."
          class="editor-text"
      ></textarea>
      <button @click="addStrategy" class="btn-save">💾 Saqlash</button>
    </div>

    <div class="strategies-list" v-if="strategies.length">
      <h2>Saqlangan Strategiyalar</h2>
      <ul>
        <li v-for="(strategy, index) in strategies" :key="index">
          <span>{{ index + 1 }}. {{ strategy }}</span>
          <button @click="deleteStrategy(index)" class="delete-btn">❌</button>
        </li>
      </ul>
    </div>
    <p v-else class="no-data">Hali hech narsa yozilmadi.</p>
  </div>
</template>

<script>
export default {
  name: "EditorView",
  data() {
    return {
      newStrategy: "",
      strategies: [],
    };
  },
  methods: {
    addStrategy() {
      if (this.newStrategy.trim()) {
        this.strategies.push(this.newStrategy);
        this.newStrategy = "";
      }
    },
    deleteStrategy(index) {
      this.strategies.splice(index, 1);
    },
  },
};
</script>

<style scoped>
.editor {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #1e3c72;
  margin-bottom: 20px;
  text-align: center;
}

.editor-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.editor-text {
  width: 100%;
  height: 150px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: none;
  margin-bottom: 10px;
  font-size: 16px;
  font-family: inherit;
}

.btn-save {
  background-color: #1e3c72;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
}

.btn-save:hover {
  background-color: #2a5298;
}

.strategies-list ul {
  list-style: none;
  padding: 0;
}

.strategies-list li {
  display: flex;
  justify-content: space-between;
  background: #f9f9f9;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 10px;
}

.delete-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #e74c3c;
  transition: color 0.3s;
}

.delete-btn:hover {
  color: #c0392b;
}

.no-data {
  text-align: center;
  color: #888;
  margin-top: 20px;
}
</style>
