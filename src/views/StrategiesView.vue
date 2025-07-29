<template>
  <div class="strategies">
    <h1 class="title">Savdo Strategiyalari</h1>

    <div class="strategies-container">
      <!-- Chap tomonda yangi strategiya qo'shish -->
      <div class="add-strategy">
        <h2>➕ Yangi Strategiya</h2>
        <form @submit.prevent="addStrategy">
          <div class="form-group">
            <label for="name">Nomi:</label>
            <input v-model="newStrategy.name" id="name" placeholder="Strategiya nomi" required />
          </div>
          <div class="form-group">
            <label for="description">Tavsif:</label>
            <textarea
                v-model="newStrategy.description"
                id="description"
                placeholder="Strategiya tavsifi"
                required
            ></textarea>
          </div>
          <button type="submit" class="btn-add">Qo‘shish</button>
        </form>
      </div>

      <!-- Strategiyalar ro'yxati -->
      <div class="strategy-grid">
        <div class="strategy-card" v-for="(strategy, index) in store.strategies" :key="index">
          <h2>{{ strategy.name }}</h2>
          <ul>
            <li v-for="(line, i) in strategy.description.split('\n')" :key="i">
              {{ line }}
            </li>
          </ul>
          <button class="delete-btn" @click="deleteStrategy(index)">🗑</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useMainStore } from "@/store";

export default {
  name: "StrategiesView",
  setup() {
    const store = useMainStore();

    const newStrategy = {
      name: "",
      description: "",
    };

    const addStrategy = () => {
      if (!newStrategy.name || !newStrategy.description) return;
      store.addStrategy({ ...newStrategy });
      newStrategy.name = "";
      newStrategy.description = "";
    };

    const deleteStrategy = (index) => {
      store.deleteStrategy(index);
    };

    return { store, newStrategy, addStrategy, deleteStrategy };
  },
};
</script>

<style scoped>
.strategies {
  padding: 20px;
}

.title {
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  color: #1e3c72;
  margin-bottom: 20px;
}

.strategies-container {
  display: flex;
  gap: 20px;
}

/* Form chap tomonda */
.add-strategy {
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 270px;
  flex-shrink: 0;
}

.add-strategy h2 {
  font-size: 20px;
  color: #2a5298;
  margin-bottom: 10px;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

.form-group input,
.form-group textarea {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

.form-group textarea {
  min-height: 80px;
  resize: none;
}

.btn-add {
  background: linear-gradient(90deg, #27ae60, #1e8449);
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
  transition: background 0.3s;
}

.btn-add:hover {
  background: linear-gradient(90deg, #1e8449, #145a32);
}

/* Strategiya grid */
.strategy-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  gap: 20px;
}

.strategy-card {
  background: linear-gradient(145deg, #ffffff, #f9f9f9);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  position: relative;
  transition: transform 0.3s ease;
}

.strategy-card:hover {
  transform: translateY(-4px);
}

.strategy-card h2 {
  font-size: 20px;
  color: #2a5298;
  margin-bottom: 10px;
}

.strategy-card ul {
  list-style: disc;
  padding-left: 20px;
  font-size: 15px;
}

.delete-btn {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #e74c3c;
  transition: transform 0.2s;
}

.delete-btn:hover {
  transform: scale(1.3);
}

/* DARK MODE */
.dark .strategies {
  background: #1a1a1a;
  color: #f1f1f1;
}
.dark .add-strategy {
  background: linear-gradient(145deg, #2b2b2b, #1f1f1f);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
}
.dark .add-strategy h2 {
  color: #9dc1ff;
}
.dark .strategy-card {
  background: linear-gradient(145deg, #2b2b2b, #1f1f1f);
  color: #f1f1f1;
}
.dark .strategy-card h2 {
  color: #9dc1ff;
}
.dark .form-group input,
.dark .form-group textarea {
  background: #1a1a1a;
  color: #fff;
  border: 1px solid #444;
}
</style>
