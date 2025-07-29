import { createRouter, createWebHistory } from 'vue-router'

// Views
import DashboardView from '../views/DashboardView.vue'
import EditorView from '../views/EditorView.vue'
import JournalView from '../views/JournalView.vue'
import RiskView from '../views/RiskView.vue'
import StrategiesView from '../views/StrategiesView.vue'
import TradesView from '../views/TradesView.vue'
import PsychologyView from '../views/PsychologyView.vue'
import AboutView from '../views/AboutView.vue'

const routes = [
    {
        path: '/',
        name: 'Dashboard',
        component: DashboardView,
        meta: { title: 'Dashboard' }
    },
    {
        path: '/psychology',
        name: 'Psychology',
        component: PsychologyView,
        meta: { title: 'Psixologiya' }
    },
    {
        path: '/about',
        name: 'About',
        component: AboutView,
        meta: { title: 'Haqida' }
    },
    {
        path: '/editor',
        name: 'Editor',
        component: EditorView,
        meta: { title: 'Editor' }
    },
    {
        path: '/journal',
        name: 'Journal',
        component: JournalView,
        meta: { title: 'Journal' }
    },
    {
        path: '/risk',
        name: 'Risk',
        component: RiskView,
        meta: { title: 'Risk Management' }
    },
    {
        path: '/strategies',
        name: 'Strategies',
        component: StrategiesView,
        meta: { title: 'Strategies' }
    },
    {
        path: '/trades',
        name: 'Trades',
        component: TradesView,
        meta: { title: 'Trades' }
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior() {
        return { top: 0 }
    }
})

router.afterEach((to) => {
    if (to.meta?.title) {
        document.title = `${to.meta.title} | My Setup System`
    }
})

export default router
