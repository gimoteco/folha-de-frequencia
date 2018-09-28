FROM node:8

RUN mkdir -p /code

WORKDIR /code
ADD package.json /code/package.json
RUN npm set progress=false
RUN npm install
ADD . /code/
CMD ["npm", "start"]

EXPOSE 3000