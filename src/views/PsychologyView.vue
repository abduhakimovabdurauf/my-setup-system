<template>
  <div class="psychology">
    <h1 class="title">📚 Trading Psixologiyasi</h1>

    <!-- Matn qo'shish formasi -->
    <div class="add-text-section">
      <h2>➕ Yangi Matn Qo‘shish</h2>
      <textarea
          v-model="newText"
          placeholder="Katta matn kiriting (1000 - 10 000 qator)..."
          rows="10"
      ></textarea>
      <button class="btn-add" @click="addText">Qo‘shish</button>
    </div>

    <!-- Matnlar ro'yxati -->
    <div class="text-list">
      <h2>Matnlar Ro‘yxati</h2>
      <div
          v-for="(text, index) in store.psychologyTexts"
          :key="index"
          class="text-card"
      >
        <p>{{ text }}</p>
        <button class="delete-btn" @click="deleteText(index)">🗑</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useMainStore } from "@/store";

export default {
  name: "PsychologyView",
  setup() {
    const store = useMainStore();
    const newText = ref("");

    const addText = () => {
      if (!newText.value.trim()) return;
      store.addPsychologyText(newText.value.trim());
      newText.value = "";
    };

    const deleteText = (index) => {
      store.deletePsychologyText(index);
    };

    return { store, newText, addText, deleteText };
  },
};
</script>

<style scoped>
.psychology {
  padding: 20px;
}

.title {
  text-align: center;
  font-size: 30px;
  font-weight: bold;
  color: #2a5298;
  margin-bottom: 20px;
}

.add-text-section {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
}

.add-text-section h2 {
  margin-bottom: 10px;
  color: #213448;
}

textarea {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  resize: vertical;
  font-size: 16px;
  min-height: 150px;
}

.btn-add {
  margin-top: 10px;
  background: #27ae60;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-add:hover {
  background: #1e8449;
}

.text-list h2 {
  margin-bottom: 15px;
  color: #213448;
}

.text-card {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 10px;
  position: relative;
}

.text-card p {
  white-space: pre-wrap;
}

.delete-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
  color: #e74c3c;
  transition: transform 0.2s;
}

.delete-btn:hover {
  transform: scale(1.2);
}

/* ==== DARK MODE ==== */
.dark .psychology {
  background: #1a1a1a;
  color: #f1f1f1;
}

.dark .title {
  color: #9dc1ff;
}

.dark .add-text-section {
  background: #2b2b2b;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.dark .add-text-section h2 {
  color: #cbd5ff;
}

.dark textarea {
  background: #1a1a1a;
  border: 1px solid #444;
  color: #fff;
}

.dark .text-list h2 {
  color: #cbd5ff;
}

.dark .text-card {
  background: #2b2b2b;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
}
</style>
