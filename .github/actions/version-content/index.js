const core = require('@actions/core')
// const github = require('@actions/github')
const fs = require('fs')
const path = require('path')

try {
  const prebuild = core.getInput('prebuild')
  const siteRepo = core.getInput('site-repo')
  const contentRepo = core.getInput('content-repo')
  const baseRef = core.getInput('base-ref')
  console.log('prebuild', prebuild)
  console.log('contentRepo', contentRepo)
  console.log('baseRef', baseRef)

  let config = {}
  const configPath = path.resolve(
    process.cwd(),
    siteRepo,
    'docsmobile.config.js'
  )

  if (fs.existsSync(configPath)) {
    config = require(configPath)
  } else {
    throw new Error(
      'Unable to find docsmobile.config.js in the site repository.'
    )
  }

  const { sources, versioning } = config

  const { directories } = sources.find(({ repo }) => repo === contentRepo)

  directories.forEach(({ versioningSystem }) => {
    console.log('version', versioning[versioningSystem].all)
  })


} catch (error) {
  core.setFailed(error.message)
}
