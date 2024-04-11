const core = require('@actions/core')
// const github = require('@actions/github')
const fs = require('fs')
const path = require('path')

try {
  const prebuild = core.getInput('prebuild')
  const siteRepo = core.getInput('site-repo')
  const contentRepo = core.getInput('content-repo')
  console.log('prebuild', prebuild)
  console.log('contentRepo', contentRepo)

  let config = {}
  const configPath = path.resolve(
    process.cwd(),
    siteRepo,
    'docsmobile.config.js'
  )

  if (fs.existsSync(configPath)) {
    config = require(configPath)
    console.log('config', Object.keys(config))
  }

} catch (error) {
  core.setFailed(error.message)
}
