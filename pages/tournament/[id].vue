<template>
    <div class="container p-4 mx-auto">
      <h1 class="mb-6 text-3xl font-bold">{{ tournament.name }}</h1>
      
      <div class="mb-8 space-y-4">
        <div>
          <label class="block mb-1 text-lg font-medium">Number of Tables:</label>
          <input 
            v-model.number="tableCount" 
            type="number" 
            min="1"
            class="w-full max-w-xs p-2 border rounded-md shadow-sm"
            @change="updateTableCount"
          />
        </div>
  
        <div>
          <label class="block mb-1 text-lg font-medium">Change all tables to:</label>
          <div class="flex items-center gap-2">
            <select 
              v-model="selectedState" 
              class="p-2 pr-8 border rounded-md shadow-sm"
            >
              <option v-for="state in states" :key="state.id" :value="state">
                {{ state.name }}
              </option>
            </select>
            <button 
              @click="changeAllTableStates" 
              class="px-4 py-2 text-sm text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Apply to all
            </button>
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12">
        <div 
          v-for="table in tournament.tables" 
          :key="table.id"
          @click="changeTableState(table)"
          class="flex items-center justify-center text-xs font-bold transition-shadow rounded-md shadow-sm cursor-pointer aspect-square hover:shadow-md"
          :style="{ backgroundColor: table.state?.color || '#FFFFFF' }"
        >
          {{ table.number }}
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useRoute } from 'vue-router'
  
  const route = useRoute()
  const tournament = ref({ id: null, name: '', tableCount: 0, tables: [] })
  const tableCount = ref(0)
  const states = ref([])
  const selectedState = ref(null)
  const refreshInterval = ref(null)
  
  onMounted(async () => {
    await fetchTournament()
    await fetchStates()
    refreshInterval.value = setInterval(fetchTournament, 1000)
  })
  
  onUnmounted(() => {
    if (refreshInterval.value) {
      clearInterval(refreshInterval.value)
    }
  })
  
  async function fetchTournament() {
    try {
      const response = await fetch(`/api/tournaments/${route.params.id}`)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      tournament.value = data
      tableCount.value = data.tableCount
    } catch (error) {
      console.error('Error fetching tournament:', error)
    }
  }
  
  async function fetchStates() {
    try {
      const response = await fetch('/api/states')
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      states.value = data
      selectedState.value = data[0]
    } catch (error) {
      console.error('Error fetching states:', error)
    }
  }
  
  async function updateTableCount() {
    try {
      const response = await fetch(`/api/tournaments/${tournament.value.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableCount: tableCount.value })
      })
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const updatedTournament = await response.json()
      tournament.value = updatedTournament
    } catch (error) {
      console.error('Error updating tournament:', error)
      tableCount.value = tournament.value.tableCount
    }
  }
  
  async function changeTableState(table) {
    const currentStateIndex = states.value.findIndex(s => s.id === table.stateId)
    const nextStateIndex = (currentStateIndex + 1) % states.value.length
    const nextState = states.value[nextStateIndex]
  
    try {
      const response = await fetch(`/api/tables/${table.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stateId: nextState.id })
      })
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      // La mise à jour se fera via le rafraîchissement automatique
    } catch (error) {
      console.error('Error updating table state:', error)
    }
  }
  
  async function changeAllTableStates() {
    if (!selectedState.value) return
  
    try {
      const response = await fetch(`/api/tournaments/${tournament.value.id}/change-all-states`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stateId: selectedState.value.id })
      })
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      // La mise à jour se fera via le rafraîchissement automatique
    } catch (error) {
      console.error('Error updating all table states:', error)
    }
  }
  </script>