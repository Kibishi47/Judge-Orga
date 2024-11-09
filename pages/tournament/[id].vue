<template>
    <div class="container p-4 mx-auto">
      <h1 class="mb-6 text-3xl font-bold">{{ tournament.name }}</h1>
      
      <div class="mb-6">
        <label class="block mb-2">Number of Tables:</label>
        <input 
          v-model.number="tableCount" 
          type="number" 
          min="1"
          class="w-full max-w-xs p-2 border rounded"
          @change="updateTableCount"
        />
      </div>
  
      <div class="mb-6">
        <label class="block mb-2">Change all tables to:</label>
        <select v-model="selectedState" class="p-2 mr-2 border rounded">
          <option v-for="state in states" :key="state.id" :value="state">
            {{ state.name }}
          </option>
        </select>
        <button 
          @click="changeAllTableStates" 
          class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Apply to all tables
        </button>
      </div>
      
      <div class="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
        <div 
          v-for="table in tournament.tables" 
          :key="table.id"
          @click="changeTableState(table)"
          class="flex items-center justify-center text-3xl font-bold transition-all duration-200 rounded-lg shadow-md cursor-pointer aspect-square hover:scale-105"
          :class="table.state?.color || 'bg-white hover:bg-gray-50'"
        >
          {{ table.number }}
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  
  const route = useRoute()
  const tournament = ref({ id: null, name: '', tableCount: 0, tables: [] })
  const tableCount = ref(0)
  const states = ref([])
  const selectedState = ref(null)
  
  onMounted(async () => {
    await fetchTournament()
    await fetchStates()
  })
  
  async function fetchTournament() {
    try {
      const response = await fetch(`/api/tournaments/${route.params.id}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
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
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      states.value = data
      selectedState.value = data[0] // Set the first state as default
    } catch (error) {
      console.error('Error fetching states:', error)
    }
  }
  
  async function updateTableCount() {
    try {
      const response = await fetch(`/api/tournaments/${tournament.value.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tableCount: tableCount.value })
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stateId: nextState.id })
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const updatedTable = await response.json()
      const tableIndex = tournament.value.tables.findIndex(t => t.id === table.id)
      tournament.value.tables[tableIndex] = updatedTable
    } catch (error) {
      console.error('Error updating table state:', error)
    }
  }
  
  async function changeAllTableStates() {
    if (!selectedState.value) return
  
    try {
      const response = await fetch(`/api/tournaments/${tournament.value.id}/change-all-states`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stateId: selectedState.value.id })
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const updatedTournament = await response.json()
      tournament.value = updatedTournament
    } catch (error) {
      console.error('Error updating all table states:', error)
    }
  }
  </script>