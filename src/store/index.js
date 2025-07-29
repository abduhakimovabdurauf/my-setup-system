// src/store/index.js
import { defineStore } from 'pinia'

const LS_KEY = 'my_setup_system_state_v1'

export const useMainStore = defineStore('main', {
    state: () => ({
        balance: 1000,
        riskPercent: 10,
        rrDefault: 2,
        dailyMaxLossPercent: 5,
        todayLoss: 0,
        darkMode: false,

        trades: [],

        journal: [
            {
                pair: "XAUUSD",
                setup: "Order Block + FVG",
                result: 120,
                date: "2025-01-12",
                note: "TP ishladi, asosiy trend buy",
            },
            {
                pair: "EURUSD",
                setup: "Liquidity Grab",
                result: -40,
                date: "2025-01-13",
                note: "SL bo‘ldi, FVG to‘liq to‘ldirilmadi",
            },
        ],

        // --- STRATEGIES ---
        strategies: [
            {
                name: "SMC Strategiyasi",
                description: `Trend bo‘yicha ishlanadi.
Order Block + FVG asosida kiriladi $$$ tomon
IDM olgandan keyin kuchli OB dan 
Swing hight yoki swing low tomon kiriladi trendga moslab
SL: OB pastida (5 pips).
TP: Oldingi cho‘qqi / pastlik.
Lot: 10% risk balancga qaraganda.`
            },
            {
                name: "Grand TP Strategiyasi",
                description: `HTF Bias: Bullish.
Risk %: 50$ uchun 0.01 lot
SL turi: Structure singanda
TP logikasi: 100 pips
1 kunda faqat 1 ta H4 swich asosida entry.`
            },
            {
                name: "Return go aut",
                description: `Bozor keskin kuchli inpuls bolshlaganda,
qarama-qarshi 2 ta M15 swich kuzatiladi.
3-chi M15 swich paydo bo‘lganda entry ochiladi.
Risk %: 20% balancga nisbatan
SL: M15 pastida.
TP: Harakatning 50% retracement nuqtasi.`
            }
        ],

        // --- PSYCHOLOGY ---
        psychologyTexts: [],

        _inited: false,
    }),

    // ---------- GETTERS ----------
    getters: {
        totalTrades: (state) => state.trades.length,
        totalProfit: (state) =>
            state.trades
                .filter((t) => t.profit > 0)
                .reduce((sum, t) => sum + t.profit, 0)
                .toFixed(2),
        totalLoss: (state) =>
            state.trades
                .filter((t) => t.profit < 0)
                .reduce((sum, t) => sum + Math.abs(t.profit), 0)
                .toFixed(2),
        netProfit: (state) =>
            state.trades.reduce((sum, t) => sum + t.profit, 0).toFixed(2),
        latestTrades: (state) => [...state.trades].slice(-5).reverse(),
        winRate: (state) => {
            if (!state.trades.length) return 0
            const wins = state.trades.filter(t => t.profit > 0).length
            return ((wins / state.trades.length) * 100).toFixed(2)
        },

        // Risk
        maxDailyLoss(state) {
            return Number(((state.balance * state.dailyMaxLossPercent) / 100).toFixed(2))
        },
        remainingDailyLoss(state) {
            const max = (state.balance * state.dailyMaxLossPercent) / 100
            const left = (max - state.todayLoss).toFixed(2)
            return left < 0 ? 0 : Number(left)
        },
        dailyUsedPercent(state) {
            const max = (state.balance * state.dailyMaxLossPercent) / 100
            if (max === 0) return 0
            return Math.min(100, (state.todayLoss / max) * 100)
        },

        // Equity curve
        equityCurve: (state) => {
            let acc = 0
            return state.trades.map(t => {
                acc += t.profit
                return acc
            })
        }
    },

    actions: {
        // Persistence
        init() {
            if (this._inited) return
            const raw = localStorage.getItem(LS_KEY)
            if (raw) {
                try {
                    Object.assign(this.$state, JSON.parse(raw))
                } catch (e) {
                    console.warn('Pinia load error', e)
                }
            }
            this._inited = true
        },
        save() {
            localStorage.setItem(LS_KEY, JSON.stringify(this.$state))
        },

        // Trades
        addTrade(trade) {
            this.trades.push(trade)
            if (trade.profit < 0) this.todayLoss += Math.abs(trade.profit)
            this.save()
        },
        deleteTrade(index) {
            const removed = this.trades.splice(index, 1)[0]
            if (removed && removed.profit < 0) {
                this.todayLoss = Math.max(0, this.todayLoss - Math.abs(removed.profit))
            }
            this.save()
        },

        // Journal
        addJournalEntry(entry) {
            this.journal.push(entry)
            this.save()
        },
        deleteJournalEntry(index) {
            this.journal.splice(index, 1)
            this.save()
        },

        // Strategies
        addStrategy(strategy) {
            this.strategies.push(strategy)
            this.save()
        },
        deleteStrategy(index) {
            this.strategies.splice(index, 1)
            this.save()
        },

        // Psychology
        addPsychologyText(text) {
            this.psychologyTexts.push(text)
            this.save()
        },
        deletePsychologyText(index) {
            this.psychologyTexts.splice(index, 1)
            this.save()
        },

        // Global
        setBalance(v) { this.balance = Number(v); this.save() },
        setRiskPercent(v) { this.riskPercent = Number(v); this.save() },
        setRR(v) { this.rrDefault = Number(v); this.save() },
        setDailyMaxLossPercent(v) { this.dailyMaxLossPercent = Number(v); this.save() },
        addTodayLoss(v) { this.todayLoss += Number(v); this.save() },
        resetTodayLoss() { this.todayLoss = 0; this.save() },
        toggleDark(val) {
            this.darkMode = typeof val === 'boolean' ? val : !this.darkMode
            this.save()
        },

        wipeAll() {
            localStorage.removeItem(LS_KEY)
            this.$reset()
            this._inited = false
        }
    }
})
