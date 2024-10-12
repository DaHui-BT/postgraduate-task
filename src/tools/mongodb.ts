import * as Realm from 'realm-web'
import imageCompression from 'browser-image-compression'


interface DBOptions {
  app_id: string,
  api_key: string,
  cluster: string,
  database: string,
  collection: string 
}

class Database {
  options: DBOptions = {
    app_id: 'postgraduate-task_app-cgoisax',
    api_key: 'cAMxh77dKtSL97n5fi4Jrg3oyC23BrGT0xOp2WZbig5u9XjzRQSX5psKp7eo0L4y',
    cluster: 'mongodb-atlas',
    database: 'postgraduate-task',
    collection: 'tasks'
  }
  
  private app: Realm.App
  private user: Realm.User | null = null
  private databse: Realm.Services.MongoDB | null = null

  constructor() {
    this.app = new Realm.App({ id: this.options.app_id })
  }

  async initialize(): Promise<void> {
    const crediential = Realm.Credentials.apiKey(this.options.api_key)
    this.user = await this.app.logIn(crediential)
    this.databse = this.user.mongoClient("mongodb-atlas")
  }
  
  private getCollection(dbName: string, collectionName: string): Realm.Services.MongoDB.Collection<Document> {
    if (!this.databse) {
      throw new Error("MongoDB client not initialized. Call initialize() first.")
    }
    return this.databse.db(dbName).collection(collectionName)
  }

  async findList(dbName: string, collectionName: string, filter: object = {}): Promise<Array<object> | null> {
    const collection = this.getCollection(dbName, collectionName)
    return await collection.find(filter)
  }

  // Single document operations
  async findOne(dbName: string, collectionName: string, filter: object = {}): Promise<Document | null> {
    const collection = this.getCollection(dbName, collectionName)
    return await collection.findOne(filter)
  }

  async findMany(dbName: string, collectionName: string, filter: object = {}): Promise<Document[]> {
    const collection = this.getCollection(dbName, collectionName)
    return await collection.find(filter)
  }

  async addOne(dbName: string, collectionName: string, document: object = {}): Promise<Realm.BSON.ObjectId> {
    const collection = this.getCollection(dbName, collectionName)
    const result = await collection.insertOne(document)
    return result.insertedId
  }

  async updateOne(dbName: string, collectionName: string, filter: object = {}, update: object): Promise<number> {
    const collection = this.getCollection(dbName, collectionName)
    const result = await collection.updateOne(filter, { $set: update })
    return result.modifiedCount
  }

  async deleteOne(dbName: string, collectionName: string, filter: object = {}): Promise<number> {
    const collection = this.getCollection(dbName, collectionName)
    const result = await collection.deleteOne(filter)
    return result.deletedCount
  }

  // Batch operations
  async addMany(dbName: string, collectionName: string, documents: object[]): Promise<Realm.BSON.ObjectId[]> {
    const collection = this.getCollection(dbName, collectionName)
    const result = await collection.insertMany(documents)
    return Object.values(result.insertedIds)
  }

  async updateMany(dbName: string, collectionName: string, filter: object = {}, update: object): Promise<number> {
    const collection = this.getCollection(dbName, collectionName)
    const result = await collection.updateMany(filter, { $set: update })
    return result.modifiedCount
  }

  async deleteMany(dbName: string, collectionName: string, filter: object = {}): Promise<number> {
    const collection = this.getCollection(dbName, collectionName)
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
    const collection = this.getCollection(dbName, collectionName)
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

  async getImageUrl(dbName: string, collectionName: string, fileId: Realm.BSON.ObjectId): Promise<string | null> {
    try {
      const { fileData, metadata } = await this.getFile(dbName, collectionName, fileId)
      
      // Create a Blob from the file data
      const blob = new Blob([fileData], { type: metadata.contentType })
      
      // Create a URL for the Blob
      const imageUrl = URL.createObjectURL(blob)

      return imageUrl
      
      // // Create an img element and set its src to the Blob URL
      // const imgElement = document.createElement('img')
      // imgElement.src = imageUrl
      
      // // Optionally, you can set other attributes
      // imgElement.alt = metadata.filename || 'Uploaded image'
      
      // // Append the img element to the document body or any other container
      // document.body.appendChild(imgElement)
      
      // // It's a good practice to revoke the Blob URL when you don't need it anymore
      // // You might want to do this when the image is removed from the DOM
      // // URL.revokeObjectURL(imageUrl)
    } catch (error) {
      console.error('Error displaying image:', error)
    }
    return null
  }

  // delete a file
  async deleteFile(dbName: string, collectionName: string, fileId: Realm.BSON.ObjectId): Promise<boolean> {
    const collection = this.getCollection(dbName, collectionName)
    const result = await collection.deleteOne({ _id: fileId })
    return result.deletedCount > 0
  }
}

export default Database
