import { spawn } from 'node:child_process'
import { resolve } from 'node:path'

const repoRoot = resolve(import.meta.dirname, '..')
const adminDir = import.meta.dirname
const workerDir = resolve(repoRoot, 'server/landing')
const workerCli = resolve(workerDir, 'node_modules/.bin/wrangler')
const viteCli = resolve(repoRoot, 'web/node_modules/.bin/vite')

const processes = [
  spawn(workerCli, ['dev', '--config', resolve(adminDir, 'wrangler.jsonc'), '--ip', '127.0.0.1', '--port', '8790'], {
    cwd: workerDir,
    stdio: 'inherit',
  }),
  spawn(viteCli, ['--config', resolve(repoRoot, 'web/vite.admin.config.ts')], {
    cwd: repoRoot,
    stdio: 'inherit',
  }),
]

const stop = () => {
  for (const child of processes) child.kill('SIGTERM')
}

process.on('SIGINT', stop)
process.on('SIGTERM', stop)

for (const child of processes) {
  child.on('error', (error) => {
    console.error(error)
    stop()
    process.exitCode = 1
  })
  child.on('exit', (code) => {
    if (code && code !== 0) {
      process.exitCode = code
      stop()
    }
  })
}
