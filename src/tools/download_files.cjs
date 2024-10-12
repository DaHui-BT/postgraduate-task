const fs = require('fs')
const path = require('path')
const Realm = require('realm-web')
const moment = require('moment')


class Database {
  options = {
    app_id: 'postgraduate-task_app-cgoisax',
    api_key: 'cAMxh77dKtSL97n5fi4Jrg3oyC23BrGT0xOp2WZbig5u9XjzRQSX5psKp7eo0L4y',
    cluster: 'mongodb-atlas',
    database: 'postgraduate-task',
    collection: 'tasks'
  }
  
  app
  user = null
  databse = null

  constructor() {
    this.app = new Realm.App({ id: this.options.app_id })
  }

  async initialize() {
    const crediential = Realm.Credentials.apiKey(this.options.api_key)
    this.user = await this.app.logIn(crediential)
    this.databse = this.user.mongoClient("mongodb-atlas")
  }
  
  getCollection(dbName, collectionName) {
    if (!this.databse) {
      throw new Error("MongoDB client not initialized. Call initialize() first.")
    }
    return this.databse.db(dbName).collection(collectionName)
  }

  async findList(dbName, collectionName, filter = {}) {
    const collection = this.getCollection(dbName, collectionName)
    return await collection.find(filter)
  }

  async addOne(dbName, collectionName, document = {}) {
    const collection = this.getCollection(dbName, collectionName)
    const result = await collection.insertOne(document)
    return result.insertedId
  }

  async deleteOne(dbName, collectionName, filter = {}) {
    const collection = this.getCollection(dbName, collectionName)
    const result = await collection.deleteOne(filter)
    return result.deletedCount
  }

  // Batch operations
  async addMany(dbName, collectionName, documents) {
    const collection = this.getCollection(dbName, collectionName)
    const result = await collection.insertMany(documents)
    return Object.values(result.insertedIds)
  }

  getMimeType(extension) {
    // This is a simple mime type guesser. For production, consider using a more comprehensive solution.
    const mimeTypes = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.pdf': 'application/pdf',
      // Add more mime types as needed
    };
    return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
  }
  
  // convert File to Binary
   async fileToBinary(file_path) {
    const file_buffer = fs.readFileSync(file_path)
    const binary = new Realm.BSON.Binary(file_buffer)
    const fileInfo = path.parse(file_path)
    
    const document = {
      filename: fileInfo.base,
      contentType: this.getMimeType(fileInfo.ext),
      length: file_buffer.length,
      uploadDate: new Date(),
      data: binary
    }

    return document
  }


  // upload a file
  async uploadFile(dbName, collectionName, file_path) {
    const collection = this.getCollection(dbName, collectionName)
    const document = await this.fileToBinary(file_path)
    
    const result = await collection.insertOne(document)
    return {insertedId: result.insertedId, file_name: document.filename}
  }
  
  async getFile(dbName, collectionName, fileId) {
    const collection = this.getCollection(dbName, collectionName)
    const document = await collection.findOne({ _id: fileId })

    if (!document || !document.data) {
      throw new Error("File not found")
    }

    const { data, ...metadata } = document
    return {
      fileData: data.buffer,
      metadata
    }
  }

}

function parse_task(text) {
  if (text.trim() == '' || text == undefined || text == null) {
    console.log("Config file error: [task file format not correct]!")
    return
  }

  let lines = text.split('\n')
  let task_list = []

  let task = new Object({
    date: null,
    title: null,
    message: null,
    file: [],
    link: []
  })

  for (let line of lines) {
    line = line.replace('\r', '')

    if (!line.startsWith('#') && line != '') {
      if (line.startsWith('[') && line.endsWith(']')) {
        for (let f of task['file']) {
          task['link'].push('./tasks/' + task['date'] + '/' + f)
        }
        task_list.push(task)
        task = new Object({date: null, title: null, message: null, file: [], link: []})

        let title = line.substring(1, line.length-1)
        task['title'] = title
      } else {
        let pair = line.split('=')
        if (pair[0] == 'file') {
          task['file'].push(pair[1])
        } else {
          task[pair[0].trim()] = pair[1].trim()
        }
      }
    }
  }

  return task_list.slice(1, task_list.length)
}


// let database = new Database()
// database.initialize().then(() => {
//   database.findList('postgraduate-task', 'files').then(async res => {
//     let index = 0
//     console.log(res[0])
//     for (let file of res) {
//       let file_path = path.join(__dirname, '../../dist/tasks_temp/', moment(file.date).format('YY-MM-DD'), file.filename)
//       let dir = path.dirname(file_path)
//       if (!fs.existsSync(dir)) {
//         fs.mkdirSync(dir, {recursive: true})
//       }

//       let metadata = {
//         _id: file._id,
//         contentType: file.contentType,
//         filename: file.filename,
//         length: file.length,
//         uploadDate: file.uploadDate
//       }
  
//       fs.writeFileSync(file_path, file.data.buffer, metadata)
//       index += 1
//       console.log('write finish: ', index)
//     }
//   })
// })

// database.initialize().then(() => {
//   database.findList('postgraduate-task', 'tasks').then(async res => {
//     console.log(res.length)

//     for (let task of res) {
//       for (let file_id of task.file_id_list) {
//         let file = await database.getFile('postgraduate-task', 'files', file_id)
//         let file_path = path.join(__dirname, '../../public/tasks_copy/', moment(task.date).format('YY-MM-DD'), file.metadata.filename)
//         let dir = path.dirname(file_path)
//         if (!fs.existsSync(dir)) {
//           fs.mkdirSync(dir, {recursive: true})
//         }

//         fs.writeFileSync(file_path, file.fileData, file.metadata)
//         console.log(file.fileData)
//         console.log(file.metadata)
//       }
//     }

//     let task_copy_path = path.join(__dirname, '../../public/task_copy.json')
//     fs.writeFileSync(task_copy_path, JSON.stringify(res))
//   })

// })

