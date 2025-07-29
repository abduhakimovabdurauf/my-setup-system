<template>
  <div class="journal">
    <h1 class="title">Savdo Jurnali</h1>

    <div class="layout">
      <!-- Qo‘shish formasi -->
      <form class="journal-form" @submit.prevent="addJournalEntry">
        <h2 class="form-title">➕ Yangi Yozuv</h2>

        <div class="form-group">
          <label for="pair">Instrument:</label>
          <input v-model="newEntry.pair" id="pair" placeholder="XAUUSD" required />
        </div>

        <div class="form-group">
          <label for="setup">Setup:</label>
          <input v-model="newEntry.setup" id="setup" placeholder="Order Block + FVG" required />
        </div>

        <div class="form-group">
          <label for="result">Natija ($):</label>
          <input v-model.number="newEntry.result" id="result" type="number" placeholder="Profit / zarar" required />
        </div>

        <div class="form-group">
          <label for="date">Sana:</label>
          <input v-model="newEntry.date" id="date" type="date" required />
        </div>

        <div class="form-group">
          <label for="note">Izoh:</label>
          <textarea v-model="newEntry.note" id="note" placeholder="Izoh..." />
        </div>

        <button type="submit" class="btn-add">Qo‘shish</button>
      </form>

      <!-- Kichik 4x grid kartalar -->
      <div class="journal-cards">
        <div class="journal-card" v-for="(entry, index) in journalEntries" :key="index">
          <div class="card-header">
            <h3>{{ entry.pair }}</h3>
            <span class="badge" :class="entry.result >= 0 ? 'tp' : 'sl'">
              {{ entry.result >= 0 ? 'TP' : 'SL' }}
            </span>
          </div>
          <p class="setup"><b>Setup:</b> {{ entry.setup }}</p>
          <p class="date"><b>📅</b> {{ entry.date }}</p>
          <p class="profit-line">
            <b>💰</b>
            <span :class="entry.result >= 0 ? 'profit' : 'loss'">{{ entry.result }} $</span>
          </p>
          <p class="note">{{ entry.note }}</p>

          <button class="delete-btn" @click="deleteJournalEntry(index)" title="O‘chirish">🗑</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useJournalStore } from "../store/journal";

export default {
  name: "JournalView",
  data() {
    return {
      newEntry: { pair: "", setup: "", result: 0, date: "", note: "" },
    };
  },
  computed: {
    journalEntries() {
      return useJournalStore().journalEntries;
    },
  },
  methods: {
    addJournalEntry() {
      if (!this.newEntry.pair || !this.newEntry.date) return;
      useJournalStore().addEntry({ ...this.newEntry });
      this.newEntry = { pair: "", setup: "", result: 0, date: "", note: "" };
    },
    deleteJournalEntry(index) {
      useJournalStore().deleteEntry(index);
    },
  },
};
</script>

<style scoped>
.journal {
  padding: 20px;
  max-width: 1600px;
  margin: 0 auto;
  transition: background 0.3s, color 0.3s;
}
.dark .journal {
  background: #1a1a1a;
  color: #f5f5f5;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #1e3c72;
  margin-bottom: 20px;
  text-align: center;
  transition: color 0.3s;
}
.dark .title {
  color: #f5f5f5;
}

.layout {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

/* Form */
.journal-form {
  background: #ffffff;
  padding: 15px;
  border-radius: 10px;
  width: 250px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: background 0.3s, color 0.3s;
}
.dark .journal-form {
  background: #2c2c2c;
  color: #f5f5f5;
}

.form-title {
  text-align: center;
  margin-bottom: 10px;
  font-size: 18px;
  color: #1e3c72;
}
.dark .form-title {
  color: #f5f5f5;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
}

.form-group label {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 3px;
}

.form-group input,
.form-group textarea {
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 13px;
  transition: background 0.3s, color 0.3s, border 0.3s;
}
.dark .form-group input,
.dark .form-group textarea {
  background: #333;
  color: #fff;
  border: 1px solid #555;
}

textarea {
  resize: vertical;
  min-height: 40px;
}

.btn-add {
  background-color: #1e3c72;
  color: white;
  padding: 8px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  width: 100%;
  transition: background 0.3s;
}
.btn-add:hover {
  background-color: #2a5298;
}

/* Cards */
.journal-cards {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 15px;
}

.journal-card {
  background: #fff;
  border-radius: 10px;
  padding: 10px;
  min-height: 140px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  position: relative;
  font-size: 12px;
  transition: all 0.2s, background 0.3s, color 0.3s;
}
.dark .journal-card {
  background: #2c2c2c;
  color: #f5f5f5;
}

.journal-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3px;
}

.card-header h3 {
  font-size: 14px;
  font-weight: 700;
}

.setup,
.date,
.profit-line,
.note {
  margin: 2px 0;
  font-size: 12px;
}

.note {
  font-style: italic;
  color: #555;
}
.dark .note {
  color: #ccc;
}

.profit {
  color: #27ae60;
  font-weight: bold;
}

.loss {
  color: #e74c3c;
  font-weight: bold;
}

.badge {
  padding: 2px 5px;
  border-radius: 4px;
  font-size: 10px;
  color: white;
}
.badge.tp {
  background-color: #27ae60;
}
.badge.sl {
  background-color: #e74c3c;
}

/* Delete */
.delete-btn {
  background: #e74c3c;
  color: white;
  border: none;
  font-size: 12px;
  padding: 4px 6px;
  border-radius: 4px;
  position: absolute;
  bottom: -25px;
  right: 10px;
  opacity: 0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.journal-card:hover .delete-btn {
  bottom: 5px;
  opacity: 1;
}
</style>
