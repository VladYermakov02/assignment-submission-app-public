FROM node:18-alpine3.17

# COPY [host machine] [container] (first path is relative to the Dockerfile, second is relative to root on the container) ". ." - means copy all the files
# so to speak the first "." takes the folder Dockerfile is located and the second "." is the root folder of the container machine
# COPY . . - means all, but all we don't need because node_modules folder is giant and we don't need everything from it
COPY package.json package-lock.json .

RUN npm install

COPY . .

RUN npm run build