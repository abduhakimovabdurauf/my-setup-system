<template>
  <div class="risk">
    <h1 class="title">Risk Boshqaruvi</h1>

    <div class="card settings">
      <h2 class="section-title">Asosiy sozlamalar</h2>

      <div class="grid">
        <div class="form-group">
          <label>Balans ($)</label>
          <input type="number" v-model.number="balance" @input="persist" min="0" />
        </div>

        <div class="form-group">
          <label>Risk % (bitimga)</label>
          <input type="number" v-model.number="riskPercent" @input="persist" min="0" step="0.1" />
        </div>

        <div class="form-group">
          <label>RR (Risk:Reward)</label>
          <input type="number" v-model.number="rr" @input="persist" min="0" step="0.1" />
        </div>

        <div class="form-group">
          <label>Kundalik maksimal zarar %</label>
          <input type="number" v-model.number="dailyMaxLossPercent" @input="persist" min="0" step="0.1" />
        </div>

        <div class="form-group">
          <label>Bugungi zarar ($)</label>
          <input type="number" v-model.number="todayLoss" @input="persist" step="0.01" />
        </div>
      </div>

      <div class="daily-line">
        <div>
          <span>Maks. kundalik zarar: </span>
          <strong class="loss">-${{ maxDailyLoss }}</strong>
        </div>
        <div>
          <span>Qolgan “yo‘qotish limiti”:</span>
          <strong :class="remainingDailyLoss > 0 ? 'ok' : 'loss'">
            ${{ remainingDailyLoss }}
          </strong>
        </div>
      </div>
    </div>

    <!-- Kalkulyator -->
    <div class="card calculator">
      <h2 class="section-title">Bitim kalkulyatori</h2>

      <div class="grid">
        <div class="form-group">
          <label>Instrument</label>
          <input type="text" v-model="form.symbol" placeholder="XAUUSD / EURUSD ..." />
        </div>

        <div class="form-group">
          <label>SL masofa (pips / points / $)</label>
          <input type="number" v-model.number="form.slDistance" min="0" step="0.01" />
        </div>

        <div class="form-group">
          <label>Pip/Point qiymati ($)</label>
          <input type="number" v-model.number="form.pipValue" min="0" step="0.0001" />
        </div>

        <div class="form-group">
          <label>Yo‘nalish</label>
          <select v-model="form.direction">
            <option value="Buy">Buy</option>
            <option value="Sell">Sell</option>
          </select>
        </div>
      </div>

      <div class="results">
        <div class="res-box">
          <span>Risk summasi:</span>
          <strong class="loss">-${{ riskAmount }}</strong>
        </div>
        <div class="res-box">
          <span>Take Profit maqsad (RR={{ rr }}):</span>
          <strong class="profit">${{ tpAmount }}</strong>
        </div>
        <div class="res-box">
          <span>Pozitsiya hajmi (contract / lot ekv.):</span>
          <strong>{{ positionSize }}</strong>
        </div>
      </div>

      <button class="btn-primary" @click="addToHistory" :disabled="!canAdd">
        ➕ History ga qo‘shish
      </button>
    </div>

    <!-- Bugungi xavf ko'rsatkichi -->
    <div class="card meter">
      <h2 class="section-title">Kundalik risk indikator</h2>
      <div class="bar">
        <div
            class="bar-fill"
            :style="{ width: dailyUsedPercent + '%' }"
            :class="{
            green: dailyUsedPercent < 50,
            orange: dailyUsedPercent >= 50 && dailyUsedPercent < 100,
            red: dailyUsedPercent >= 100
          }"
        ></div>
      </div>
      <div class="bar-labels">
        <span>{{ dailyUsedPercent.toFixed(1) }}% ishlatildi</span>
        <span>{{ (100 - dailyUsedPercent).toFixed(1) }}% qolgan</span>
      </div>
    </div>

    <!-- History -->
    <div class="card history">
      <h2 class="section-title">Hisob-kitoblar tarixi</h2>

      <table v-if="history.length" class="table">
        <thead>
        <tr>
          <th>#</th>
          <th>Sana</th>
          <th>Symbol</th>
          <th>Yo‘nalish</th>
          <th>Risk $</th>
          <th>SL dist.</th>
          <th>Pip val.</th>
          <th>RR</th>
          <th>TP $</th>
          <th>Size</th>
          <th>❌</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(row, i) in history" :key="i">
          <td>{{ i + 1 }}</td>
          <td>{{ row.date }}</td>
          <td>{{ row.symbol }}</td>
          <td :class="row.direction === 'Buy' ? 'buy' : 'sell'">{{ row.direction }}</td>
          <td class="loss">-{{ row.riskAmount }}</td>
          <td>{{ row.slDistance }}</td>
          <td>{{ row.pipValue }}</td>
          <td>{{ row.rr }}</td>
          <td class="profit">{{ row.tpAmount }}</td>
          <td>{{ row.positionSize }}</td>
          <td>
            <button class="delete-btn" @click="removeHistory(i)">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
        </tbody>
      </table>

      <p v-else class="empty">Hali hech qanday hisob-kitob yo‘q.</p>
    </div>
  </div>
</template>

<script>
const LS_KEY = 'my_setup_system_risk';

export default {
  name: 'RiskView',
  data() {
    return {
      balance: 5000,
      riskPercent: 1,
      rr: 2,
      dailyMaxLossPercent: 5,
      todayLoss: 0,

      form: {
        symbol: 'XAUUSD',
        direction: 'Buy',
        slDistance: 100, // misol uchun
        pipValue: 1,     // misol uchun
      },

      history: []
    };
  },
  computed: {
    riskAmount() {
      return Number(((this.balance * this.riskPercent) / 100).toFixed(2));
    },
    tpAmount() {
      return Number((this.riskAmount * this.rr).toFixed(2));
    },
    positionSize() {
      const denom = this.form.slDistance * this.form.pipValue;
      if (!denom) return 0;
      return Number((this.riskAmount / denom).toFixed(3));
    },
    maxDailyLoss() {
      return Number(((this.balance * this.dailyMaxLossPercent) / 100).toFixed(2));
    },
    remainingDailyLoss() {
      const left = (this.maxDailyLoss - this.todayLoss).toFixed(2);
      return left < 0 ? 0 : left;
    },
    dailyUsedPercent() {
      if (this.maxDailyLoss === 0) return 0;
      return Math.min(100, (this.todayLoss / this.maxDailyLoss) * 100);
    },
    canAdd() {
      return (
          this.form.symbol &&
          this.form.slDistance > 0 &&
          this.form.pipValue > 0 &&
          this.riskAmount > 0
      );
    }
  },
  created() {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      try {
        const json = JSON.parse(saved);
        Object.assign(this.$data, json);
      } catch (e) {
        console.warn('RiskView parse error', e);
      }
    }
  },
  methods: {
    persist() {
      localStorage.setItem(
          LS_KEY,
          JSON.stringify({
            balance: this.balance,
            riskPercent: this.riskPercent,
            rr: this.rr,
            dailyMaxLossPercent: this.dailyMaxLossPercent,
            todayLoss: this.todayLoss,
            form: this.form,
            history: this.history
          })
      );
    },
    addToHistory() {
      if (!this.canAdd) return;
      const row = {
        date: new Date().toISOString().slice(0, 10),
        symbol: this.form.symbol,
        direction: this.form.direction,
        slDistance: this.form.slDistance,
        pipValue: this.form.pipValue,
        rr: this.rr,
        riskAmount: this.riskAmount,
        tpAmount: this.tpAmount,
        positionSize: this.positionSize
      };
      this.history.unshift(row);
      this.persist();
    },
    removeHistory(i) {
      this.history.splice(i, 1);
      this.persist();
    }
  },
  watch: {
    balance: 'persist',
    riskPercent: 'persist',
    rr: 'persist',
    dailyMaxLossPercent: 'persist',
    todayLoss: 'persist',
    form: {
      handler: 'persist',
      deep: true
    },
    history: {
      handler: 'persist',
      deep: true
    }
  }
};
</script>

<style scoped>
.risk {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
.title {
  font-size: 28px;
  font-weight: 700;
  color: #1e3c72;
  margin-bottom: 18px;
}
.section-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 14px;
  color: #2a5298;
}
.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,.05);
  padding: 18px 20px;
  margin-bottom: 18px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px 16px;
}
.form-group {
  display: flex;
  flex-direction: column;
}
.form-group label {
  font-weight: 600;
  margin-bottom: 6px;
}
.form-group input,
.form-group select,
.form-group textarea {
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 14px;
}
.daily-line {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 14px 30px;
  font-size: 15px;
}
.ok {
  color: #27ae60;
}
.loss {
  color: #e74c3c;
}
.profit {
  color: #27ae60;
}
.results {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
  margin: 14px 0 10px;
}
.res-box {
  background: #f7f9fc;
  border-radius: 8px;
  padding: 10px 12px;
  min-width: 220px;
  box-shadow: 0 1px 3px rgba(0,0,0,.03);
  display: flex;
  justify-content: space-between;
}
.btn-primary {
  background: #1e3c72;
  color: #fff;
  border: none;
  padding: 9px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: .2s;
}
.btn-primary:disabled {
  opacity: .5;
  cursor: not-allowed;
}
.btn-primary:hover:not(:disabled) {
  background: #2a5298;
}
/* meter */
.meter .bar {
  width: 100%;
  height: 14px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  transition: width .25s;
}
.bar-fill.green { background: #27ae60; }
.bar-fill.orange { background: #f39c12; }
.bar-fill.red { background: #e74c3c; }
.bar-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  font-size: 14px;
}
/* history table */
.table {
  width: 100%;
  border-collapse: collapse;
}
.table th, .table td {
  border: 1px solid #e5e7eb;
  padding: 8px 10px;
  text-align: center;
  font-size: 14px;
}
.table th {
  background: #2a5298;
  color: #fff;
}
.buy {
  color: #27ae60;
  font-weight: 600;
}
.sell {
  color: #e74c3c;
  font-weight: 600;
}
.delete-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #e74c3c;
  font-size: 16px;
  transition: transform .15s;
}
.delete-btn:hover {
  transform: scale(1.15);
}
.empty {
  color: #9ca3af;
  font-style: italic;
  padding: 8px 0;
}

/* DARK MODE */
.dark .risk {
  background: #1a1a1a;
  color: #f1f1f1;
}
.dark .card {
  background: #2b2b2b;
  color: #f1f1f1;
}
.dark .form-group input,
.dark .form-group select,
.dark .form-group textarea {
  background: #1a1a1a;
  color: #fff;
  border: 1px solid #444;
}
.dark .table th {
  background: #444;
  color: #fff;
}
.dark .res-box {
  background: #333;
}
</style>
