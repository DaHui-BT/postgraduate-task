import * as Realm from 'realm-web'
import imageCompression from 'browser-image-compression'


interface DBOptions {
  app_id: string,
  cluster: string,
  database: string,
  collection: string,
}

class Database {
  private options: DBOptions = {
    app_id: 'postgraduate-task_app-cgoisax',
    cluster: 'mongodb-atlas',
    database: 'postgraduate-task',
    collection: 'tasks'
  }
  
  static instance: Database
  private app: Realm.App | null = null
  private user: Realm.User | null = null
  private databse: Realm.Services.MongoDB | null = null
  isLogin: boolean = false

  constructor(options: DBOptions | {} = {}) {
    if (Database.instance) {
      return Database.instance
    }
    
    this.app = new Realm.App({ id: this.options.app_id })
    this.user = this.app.currentUser
    this.user && (this.isLogin = this.user.isLoggedIn)

    if (this.isLogin && this.user) {
      this.databse = this.user.mongoClient(this.options.cluster)
      this.user.refreshAccessToken()
    }
    Database.instance = this
  }

  async connect(email: string, password: string): Promise<Realm.User> {
    if (!this.user && this.app) {
      const crediential = Realm.Credentials.emailPassword(email, password)
      this.user = await this.app.logIn(crediential)
      this.databse = this.user.mongoClient("mongodb-atlas")
    }
    if (!this.user) {
      throw Error('username or password error')
    }
    this.isLogin = this.user.isLoggedIn
    return this.user
  }
  
  private async getCollection(dbName: string, collectionName: string): Realm.Services.MongoDB.Collection<Document> {
    if (!this.databse) {
      throw new Error("MongoDB client not initialized. Call initialize() first.")
    }
    return this.databse.db(dbName).collection(collectionName)
  }

  async findList(dbName: string, collectionName: string, filter: object = {}): Promise<Array<object> | null> {
    const collection = await this.getCollection(dbName, collectionName)
    return await collection.find(filter)
  }

  // Single document operations
  async findOne(dbName: string, collectionName: string, filter: object = {}): Promise<Document | null> {
    const collection = await this.getCollection(dbName, collectionName)
    return await collection.findOne(filter)
  }

  async findMany(dbName: string, collectionName: string, filter: object = {}): Promise<Document[]> {
    const collection = await this.getCollection(dbName, collectionName)
    return await collection.find(filter)
  }

  async addOne(dbName: string, collectionName: string, document: object = {}): Promise<Realm.BSON.ObjectId> {
    const collection = await this.getCollection(dbName, collectionName)
    const result = await collection.insertOne(document)
    return result.insertedId
  }

  async updateOne(dbName: string, collectionName: string, filter: object = {}, update: object): Promise<number> {
    const collection = await this.getCollection(dbName, collectionName)
    const result = await collection.updateOne(filter, { $set: update })
    return result.modifiedCount
  }

  async deleteOne(dbName: string, collectionName: string, filter: object = {}): Promise<number> {
    const collection = await this.getCollection(dbName, collectionName)
    const result = await collection.deleteOne(filter)
    return result.deletedCount
  }

  // Batch operations
  async addMany(dbName: string, collectionName: string, documents: object[]): Promise<Realm.BSON.ObjectId[]> {
    const collection = await this.getCollection(dbName, collectionName)
    const result = await collection.insertMany(documents)
    return Object.values(result.insertedIds)
  }

  async updateMany(dbName: string, collectionName: string, filter: object = {}, update: object): Promise<number> {
    const collection = await this.getCollection(dbName, collectionName)
    const result = await collection.updateMany(filter, { $set: update })
    return result.modifiedCount
  }

  async deleteMany(dbName: string, collectionName: string, filter: object = {}): Promise<number> {
    const collection = await this.getCollection(dbName, collectionName)
    const result = await collection.deleteMany(filter)
    return result.deletedCount
  }

  
  async compressImage(file: File): Promise<File | null> {
    try {
      // Compression options
      const options = {
        maxSizeMB: 1,              // Maximum size in MB
        maxWidthOrHeight: 1920,    // Maximum width or height
        useWebWorker: true         // Use Web Worker for better performance
      };

      // Compress the image
      const compressedFile = await imageCompression(file, options);

      // Create a new File object with the compressed data
      const compressedImage = new File([compressedFile], file.name, {
        type: compressedFile.type
      });

      return compressedImage
    } catch (error) {
      console.error('Error in compression or upload:', error);
    }
    return null
  }
  // convert File to Binary
  private async fileToBinary(file: File): Promise<Realm.BSON.Binary> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const binary = new Realm.BSON.Binary(new Uint8Array(event.target.result as ArrayBuffer))
          resolve(binary)
        } else {
          reject(new Error("Failed to read file"))
        }
      }
      reader.onerror = (error) => reject(error)
      reader.readAsArrayBuffer(file)
    })
  }

  // upload a file
  async uploadFile(dbName: string, collectionName: string, file: File, metadata: object = {}): Promise<{insertedId: Realm.BSON.ObjectId, file_name: string}> {
    const collection = await this.getCollection(dbName, collectionName)
    const compress_image = await this.compressImage(file)
    if (compress_image == null) {
      throw Error('compress image error')
    }
    const binary = await this.fileToBinary(compress_image)
    
    const document = {
      filename: file.name,
      contentType: file.type,
      length: file.size,
      uploadDate: new Date(),
      ...metadata,
      data: binary
    }

    const result = await collection.insertOne(document)
    return {insertedId: result.insertedId, file_name: file.name}
  }

  // retrieve a file
  async getFile(dbName: string, collectionName: string, fileId: Realm.BSON.ObjectId): Promise<{ fileData: Uint8Array, metadata: any }> {
    const collection = await this.getCollection(dbName, collectionName)
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

  async getImageUrl(dbName: string, collectionName: string, fileId: Realm.BSON.ObjectId): Promise<string | null> {
    try {
      const { fileData, metadata } = await this.getFile(dbName, collectionName, fileId)
      
      // Create a Blob from the file data
      const blob = new Blob([fileData], { type: metadata.contentType })
      
      // Create a URL for the Blob
      const imageUrl = URL.createObjectURL(blob)

      return imageUrl
    } catch (error) {
      console.error('Error displaying image:', error)
    }
    return null
  }

  // delete a file
  async deleteFile(dbName: string, collectionName: string, fileId: Realm.BSON.ObjectId): Promise<boolean> {
    const collection = await this.getCollection(dbName, collectionName)
    const result = await collection.deleteOne({ _id: fileId })
    return result.deletedCount > 0
  }
}

export default Database
