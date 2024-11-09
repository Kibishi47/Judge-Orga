<template>
    <div class="container p-4 mx-auto">
      <h1 class="mb-6 text-3xl font-bold">TCG Tournaments</h1>
      
      <form @submit.prevent="createTournament" class="mb-6">
        <input 
          v-model="newTournamentName" 
          type="text" 
          placeholder="New tournament name" 
          class="p-2 mr-2 border rounded"
        />
        <button 
          type="submit" 
          class="px-4 py-2 text-white transition-colors bg-blue-500 rounded hover:bg-blue-600"
        >
          Create Tournament
        </button>
      </form>
      
      <ul class="space-y-2">
        <li 
          v-for="tournament in tournaments" 
          :key="tournament.id" 
          class="p-4 transition-colors bg-gray-100 rounded hover:bg-gray-200"
        >
          <NuxtLink 
            :to="`/tournament/${tournament.id}`"
            class="text-blue-500 hover:underline"
          >
            {{ tournament.name }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const tournaments = ref([])
  const newTournamentName = ref('')
  
  onMounted(() => {
    fetchTournaments()
  })
  
  async function fetchTournaments() {
    try {
      const response = await fetch('/api/tournaments')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      tournaments.value = data
    } catch (error) {
      console.error('Error fetching tournaments:', error)
    }
  }
  
  async function createTournament() {
    if (newTournamentName.value.trim()) {
      try {
        const response = await fetch('/api/tournaments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newTournamentName.value.trim() })
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const newTournament = await response.json()
        tournaments.value.push(newTournament)
        newTournamentName.value = ''
      } catch (error) {
        console.error('Error creating tournament:', error)
      }
    }
  }
  </script>