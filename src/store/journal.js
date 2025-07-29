import { defineStore } from 'pinia'

export const useJournalStore = defineStore('journal', {
    state: () => ({
        journalEntries: JSON.parse(localStorage.getItem('journalEntries')) || [],
    }),
    actions: {
        addEntry(entry) {
            this.journalEntries.push(entry)
            this.saveToLocalStorage()
        },
        deleteEntry(index) {
            this.journalEntries.splice(index, 1)
            this.saveToLocalStorage()
        },
        saveToLocalStorage() {
            localStorage.setItem('journalEntries', JSON.stringify(this.journalEntries))
        },
    },
})
