FROM node:16

WORKDIR /usr/src/app

ARG PORT=8080

EXPOSE $PORT

ENV PORT=${PORT}
ENV NODE_ENV=production

COPY package.json ./
COPY yarn.lock ./
RUN yarn install --prod
COPY db ./db
COPY dist ./dist
COPY schema.graphql ./

CMD [ "./node_modules/.bin/nodemon", "--max_old_space_size=1024", "dist/backend.js" ]