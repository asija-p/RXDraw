FROM node:18-alpine3.14
#postavi radni direktorijum
WORKDIR /usr/src/app
#kopiraj u radni dir samo paketa za instalaciju
COPY package*.json ./
RUN npm install
#prva tacka -> trenutni dir, druga tacka -> radni dir u kontejneru
COPY . .
RUN npm run build
CMD ["npm", "run", "start:prod"]

