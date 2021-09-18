import { fastify } from 'fastify'
import fastifyStatic from 'fastify-static'
import fs from 'fs'
import { spawn, execSync, exec } from 'child_process'

import path from 'path'
import { fileURLToPath } from 'url'

const app = fastify()

const PORT_NUMBER = 8000

// ESM Specific Jank
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const buildPath = __dirname.split('/').slice(0, -1).join('/')
const DEPLOY_PATH = buildPath + '/deploy'

const args = process.argv.slice(2)

const startServer = async () => {

	if (args.includes('--build')) {
		const buildCode = execSync('npm run build', { stdio: 'inherit' })
		const deployCode = execSync(`rsync -av ${buildPath}/public/ ${DEPLOY_PATH}`, { stdio: 'inherit' })
	}

	try {
		app.register(fastifyStatic, {
			root: path.join(buildPath, 'deploy'),
		})

		app.get('/', async (request, reply) => {
			return reply.sendFile('index.html')
		})

		app.get('/api/build', {}, async (request, reply) => {

			try {
				const child = spawn('npm', ['run', 'build'])

				child.on('close', code => {
					if (code != 0) {
						console.log("BUILD FAILED")
					} else {
						const copyProcess = spawn('rsync', ['-av', buildPath + '/public/', DEPLOY_PATH])
						copyProcess.on('close', (code) => console.log(code))
					}
				})
			} catch (error) {
				console.log(error)
			}
		})

		await app.listen(PORT_NUMBER)
		console.log(`🚀 Server listening on ${PORT_NUMBER}... `)
	} catch (error) {
		console.error(error)
		process.exit(1)
	}
}

startServer()