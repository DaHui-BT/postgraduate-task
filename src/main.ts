import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

/**
 * 
 * {
  "properties": {
    "_id": {
      "bsonType": "uuid"
    },
    "date": {
      "bsonType": "date"
    },
    "title": {
      "bsonType": "string"
    },
    "message": {
      "bsonType": "string"
    },
    "file_list": {
      "bsonType": "array",
      "items": {
        "bsonType": "binData"
      }
    },
    "link": {
      "bsonType": "array",
      "items": {
        "bsonType": "string"
      }
    },
    "status": {
      "bsonType": "int"
    }
  },
  "required": [
    "_id",
    "date",
    "title",
    "message",
    "status"
  ]
}
 * 
 */


const app = createApp(App)

app.use(router)
app.mount('#app')
