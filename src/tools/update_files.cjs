const fs = require('fs')
const path = require('path')
const Realm = require('realm-web')


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


let database = new Database()
database.initialize().then(() => {
  let data = fs.readFileSync(path.join(__dirname, '../../public/submission.json'), 'utf-8')
  let status_list = data.replace('[', '').replace(']', ']').split(',')
  status_list = status_list.map(status => parseInt(status))
  
  let task_list = fs.readFileSync(path.join(__dirname, '../../public/task'), 'utf8')
  task_list = parse_task(task_list)
  console.log('============================ total task length: ', task_list.length, ' ============================')
  
  task_list.forEach(async (task, index) => {
    let new_task = {
      date: new Date('20' + task.date),
      title: task.title,
      message: task.message,
      file_id_list: [],
      file_name_list: [],
      status: status_list[index] || 0
    }
  
    for (let i = 0; i < task.link.length; ++ i) {
      let img_path = path.join(__dirname, '../../public', task.link[i])
      if (!fs.existsSync(img_path)) {
        continue
      }
      // console.log(database.fileToBinary(image_buff))
      let {insertedId, file_name} = await database.uploadFile('postgraduate-task', 'files', img_path)
  
      new_task.file_id_list.push(insertedId)
      new_task.file_name_list.push(task.file[i])
    }
  
    await database.addOne('postgraduate-task', 'tasks', new_task)
    console.log('total: ', task_list.length, ', current: ', index + 1)
  })
})

