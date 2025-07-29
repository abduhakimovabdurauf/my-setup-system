<template>
  <div class="dashboard">
    <h1 class="dashboard-title">Bosh Sahifa</h1>

    <!-- Umumiy statistika (foyda, zarar) -->
    <div class="stats">
      <div class="stat-card">
        <h2>Umumiy Foyda</h2>
        <p class="profit">{{ store.totalProfit }} $</p>
      </div>
      <div class="stat-card">
        <h2>Umumiy Zarar</h2>
        <p class="loss">{{ store.totalLoss }} $</p>
      </div>
      <div class="stat-card">
        <h2>Sof Natija</h2>
        <p :class="store.netProfit >= 0 ? 'profit' : 'loss'">
          {{ store.netProfit }} $
        </p>
      </div>
    </div>
    <h2 class="section-title">Oxirgi Bitimlar</h2>
    <div class="trades-list">
      <table class="trade-table">
        <thead>
        <tr>
          <th>#</th>
          <th>Instrument</th>
          <th>Yo‘nalish</th>
          <th>Profit ($)</th>
          <th>Sana</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(trade, index) in store.latestTrades" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ trade.instrument }}</td>
          <td :class="trade.direction === 'Buy' ? 'buy' : 'sell'">
            {{ trade.direction }}
          </td>
          <td :class="trade.profit >= 0 ? 'profit' : 'loss'">
            {{ trade.profit }}
          </td>
          <td>{{ trade.date }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Strategiyalar -->
    <h2 class="section-title">Strategiyalar</h2>
    <div class="strategies">
      <div class="strategy-card" v-for="(s, i) in strategies" :key="i">
        <h3>{{ s.name }}</h3>
        <ul>
          <li v-for="(item, idx) in s.rules" :key="idx">{{ item }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { useMainStore } from "@/store";

export default {
  name: "DashboardView",
  setup() {
    const store = useMainStore();

    const strategies = [
      {
        name: "SMC Strategiyasi",
        rules: [
          `Trend bo‘yicha ishlanadi.
           Order Block + FVG asosida kiriladi $$$ tomon
           IDM olgandan keyin kuchli OB dan
           Swing hight yoki swing low tomon kiriladi trendga moslab
           SL: OB pastida (5 pips).
           TP: Oldingi cho‘qqi / pastlik.
           Lot: 10% risk balancga qaraganda.`
        ],
      },
      {
        name: "Grand TP",
        rules: [
          `HTF Bias: Bullish.
           Risk %: 50$ uchun 0.01 lot
           SL turi: Structure singanda
           TP logikasi: 100 pips
           1 kunda faqat 1 ta H4 swich asosida entry.`
        ],
      },
      {
        name: "Impulse Reverse",
        rules: [
          `Bozor keskin kuchli inpuls bolshlaganda,
           qarama-qarshi 2 ta M15 swich kuzatiladi.
           3-chi M15 swich paydo bo‘lganda entry ochiladi.
           Risk %: 20% balancga nisbatan
           SL: M15 pastida.
           TP: Harakatning 50% retracement nuqtasi.`
        ],
      },
    ];

    return { store, strategies };
  },
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
  transition: background 0.3s, color 0.3s;
}
.dark .dashboard {
  background: #1a1a1a;
  color: #f5f5f5;
}

.dashboard-title {
  text-align: center;
  font-size: 32px;
  margin-bottom: 20px;
}

/* Statistika */
.stats {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.stat-card {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  width: 200px;
  text-align: center;
  transition: background 0.3s, color 0.3s;
}
.dark .stat-card {
  background: #2c2c2c;
  color: #f5f5f5;
}

.profit {
  color: #27ae60;
}
.loss {
  color: #e74c3c;
}

/* Table */
.trade-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
}

.trade-table th,
.trade-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}
.dark .trade-table th,
.dark .trade-table td {
  border: 1px solid #252323;
  padding: 10px;
  text-align: center;
}
.trade-table th {
  background-color: #213448;
  color: white;
}
.dark .trade-table th {
  background-color: #22223b;
  color: white;
}

.buy {
  color: #27ae60;
  font-weight: bold;
}

.sell {
  color: #e74c3c;
  font-weight: bold;
}

/* Strategiyalar */
.section-title {
  text-align: center;
  font-size: 26px;
  margin-bottom: 20px;
}

.strategies {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  padding: 0 20px;
}

.strategy-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
  transition: transform 0.3s, background 0.3s, color 0.3s;
}
.dark .strategy-card {
  background: #2c2c2c;
  color: #f5f5f5;
}

.strategy-card:hover {
  transform: translateY(-5px);
}
</style>
