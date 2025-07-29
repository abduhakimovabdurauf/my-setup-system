// src/store/trades.js
import { defineStore } from 'pinia'

export const useTradesStore = defineStore('trades', {
    state: () => ({
        trades: [],
        totalProfit: 0,
    }),
    actions: {
        addTrade(trade) {
            this.trades.push(trade)
            this.calculateProfit()
            this.saveToLocal()
        },
        removeTrade(index) {
            this.trades.splice(index, 1)
            this.calculateProfit()
            this.saveToLocal()
        },
        calculateProfit() {
            this.totalProfit = this.trades.reduce((sum, t) => sum + (t.profit || 0), 0)
        },
        saveToLocal() {
            localStorage.setItem('my_trades', JSON.stringify(this.trades))
        },
        loadFromLocal() {
            const saved = localStorage.getItem('my_trades')
            if (saved) {
                this.trades = JSON.parse(saved)
                this.calculateProfit()
            }
        }
    }
})
