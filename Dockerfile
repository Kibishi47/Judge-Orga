FROM node:18

WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier les fichiers du projet
COPY . .

# Générer le client Prisma
RUN npx prisma generate

# Construire l'application Nuxt
RUN npm run build

# Exposer le port sur lequel l'application s'exécute
EXPOSE 3000

# Définir la commande pour exécuter l'application
CMD ["npm", "run", "start"]