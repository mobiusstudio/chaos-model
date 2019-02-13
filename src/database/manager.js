/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import fs from 'fs'
import path from 'path'

export class DbManager {
  constructor({connections, version, patchPath}) {
    this.connections = connections
    this.version = version
    this.patchPath = patchPath
  }

  async dropDbIfExists() {
    const dbname = this.connections.postgres.default.db
    const queryTerminate = `
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = $1
      ;`
    await db.query('postgres', queryTerminate, [dbname])
    const queryDrop = `DROP DATABASE IF EXISTS "${dbname}";`
    await db.query('postgres', queryDrop)
  }

  async createDbIfNotExists() {
    if (!this.connections.postgres.postgres) return // Can't create database
    const dbname = this.connections.postgres.default.db
    const queryCheck = `
      SELECT 1 AS exists
      FROM pg_database
      WHERE datname = $1
      `
    const result = await db.query('postgres', queryCheck, [dbname])
    if (result.rowCount === 0) {
      const queryCreate = `CREATE DATABASE "${dbname}"`
      await db.query('postgres', queryCreate)
    }
  }

  async getCurrentVersion() {
    const queryCheck = `
      SELECT 1 AS exists FROM pg_class WHERE relname = 'version';
    `
    const resultCheck = await db.query(queryCheck)
    if (resultCheck.rowCount === 0) {
      return -1
    }
    const queryGetVersion = 'SELECT ver FROM version ORDER BY ver DESC LIMIT 1;'
    const resultVersion = await db.query(queryGetVersion)
    if (resultVersion.rowCount === 0) {
      return -1
    }
    const currentVer = resultVersion.rows[0].ver
    this.version = currentVer

    return currentVer
  }

  async getPatchFiles() {
    const currentVer = await this.getCurrentVersion()
    const files = fs.readdirSync(this.patchPath)
    const patchFiles = []
    files.forEach((file) => {
      // eslint-disable-next-line no-continue
      if (file.charAt(0) !== '.') {
        const ver = Number.parseFloat(file.split('.')[0])
        if (ver > currentVer) {
          patchFiles.push({ version: ver, path: path.join(this.patchPath, file) })
        }
      }
    })
    patchFiles.sort((a, b) => a[0] - b[0])
    return patchFiles
  }

  async updateVersion(client, patchVer) {
    const currentVer = await this.getCurrentVersion()
    if (patchVer <= currentVer) return
    const query = 'INSERT INTO version (ver) VALUES ($1);'
    await client.query(query, [patchVer])
    this.version = patchVer
  }

  async update() {
    await this.createDbIfNotExists()
    const patchFiles = await this.getPatchFiles()
    await db.transaction(async (client) => {
      const ver = await this.getCurrentVersion()
      for (const patchFile of patchFiles) {
        const patchVer = patchFile.version
        if (patchVer > ver) {
          const query = fs.readFileSync(patchFile.path, 'utf8')
          await client.query(query)
          await this.updateVersion(client, patchVer)
        }
      }
    })
  }

  async rebuild() {
    await this.dropDbIfExists()
    await this.update()
  }
}
