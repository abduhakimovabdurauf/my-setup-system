<template>
  <div class="trades">
    <h1 class="title">Bitimlar (Trades)</h1>

    <div class="trade-layout">
      <!-- Chap tomonda yangi bitim -->
      <div class="form-wrapper">
        <form class="trade-form" @submit.prevent="addTrade">
          <h2>Yangi Bitim Qo‘shish</h2>

          <div class="form-group">
            <label for="instrument">Instrument:</label>
            <input v-model="newTrade.instrument" id="instrument" placeholder="Masalan: XAUUSD" required />
          </div>

          <div class="form-group">
            <label for="direction">Yo‘nalish:</label>
            <select v-model="newTrade.direction" id="direction" required>
              <option value="Buy">Buy</option>
              <option value="Sell">Sell</option>
            </select>
          </div>

          <div class="form-group">
            <label for="profit">Profit ($):</label>
            <input v-model.number="newTrade.profit" id="profit" type="number" required />
          </div>

          <div class="form-group">
            <label for="date">Sana:</label>
            <input v-model="newTrade.date" id="date" type="date" required />
          </div>

          <button type="submit" class="btn-add">➕ Qo‘shish</button>
        </form>
      </div>

      <!-- O‘ng tomonda jadval -->
      <div class="trades-list">
        <table class="trade-table">
          <thead>
          <tr>
            <th>#</th>
            <th>Instrument</th>
            <th>Yo‘nalish</th>
            <th>Profit ($)</th>
            <th>Sana</th>
            <th>O‘chirish</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(trade, index) in store.trades" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ trade.instrument }}</td>
            <td :class="trade.direction === 'Buy' ? 'buy' : 'sell'">{{ trade.direction }}</td>
            <td :class="trade.profit >= 0 ? 'profit' : 'loss'">{{ trade.profit }}</td>
            <td>{{ trade.date }}</td>
            <td><button class="delete-btn" @click="deleteTrade(index)">🗑</button></td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { useMainStore } from "@/store";

export default {
  name: "TradesView",
  setup() {
    const store = useMainStore();
    store.init(); // localStorage dan yuklash

    const newTrade = {
      instrument: "",
      direction: "Buy",
      profit: 0,
      date: "",
    };

    const addTrade = () => {
      if (!newTrade.instrument || !newTrade.date) return;
      store.addTrade({ ...newTrade });
      newTrade.instrument = "";
      newTrade.direction = "Buy";
      newTrade.profit = 0;
      newTrade.date = "";
    };

    const deleteTrade = (index) => store.deleteTrade(index);

    return { store, newTrade, addTrade, deleteTrade };
  },
};
</script>

<style scoped>
.trades {
  padding: 20px;
  transition: background 0.3s, color 0.3s;
}
.dark .trades {
  background: #1a1a1a;
  color: #f5f5f5;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #213448;
  margin-bottom: 20px;
  text-align: center;
  transition: color 0.3s;
}
.dark .title {
  color: #f5f5f5;
}

.trade-layout {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.form-wrapper {
  flex: 0.8;
}

.trade-form {
  background: #fff;
  padding: 15px 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: background 0.3s, color 0.3s;
}
.dark .trade-form {
  background: #2c2c2c;
  color: #f5f5f5;
}

.trade-form h2 {
  text-align: center;
  font-size: 20px;
  margin-bottom: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 5px;
}

.form-group input,
.form-group select {
  padding: 7px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  transition: background 0.3s, color 0.3s, border 0.3s;
}
.dark .form-group input,
.dark .form-group select {
  background: #333;
  color: #fff;
  border: 1px solid #555;
}

.btn-add {
  background-color: #27ae60;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
  width: 100%;
}
.btn-add:hover {
  background-color: #1f8f4d;
}

.trades-list {
  flex: 1.4;
  background: #f8f9fa;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: background 0.3s, color 0.3s;
}
.dark .trades-list {
  background: #2c2c2c;
  color: #f5f5f5;
}

.trade-table {
  width: 100%;
  border-collapse: collapse;
}

.trade-table th,
.trade-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
  transition: background 0.3s, color 0.3s;
}
.dark .trade-table th,
.dark .trade-table td {
  border: 1px solid #252323;
  padding: 8px;
  text-align: center;
  transition: background 0.3s, color 0.3s;
}

.trade-table th {
  background-color: #213448;
  color: white;
  font-size: 14px;
}
.dark .trade-table th {
  background-color: #22223b
}

.buy {
  color: #27ae60;
  font-weight: bold;
}
.sell {
  color: #e74c3c;
  font-weight: bold;
}
.profit {
  color: #27ae60;
}
.loss {
  color: #e74c3c;
}

.delete-btn {
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  transition: transform 0.2s;
}
.delete-btn:hover {
  transform: scale(1.2);
  color: #e74c3c;
}
</style>
