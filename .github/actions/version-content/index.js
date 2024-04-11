const core = require('@actions/core')
// const github = require('@actions/github')
const fs = require('fs')
const path = require('path')

try {
  const {
    PREBUILD,
    SITE_REPO,
    CONTENT_REPO,
    BASE_REF,
    WORKSPACE
  } = process.env

  console.log('PREBUILD', PREBUILD)
  console.log('CONTENT_REPO', CONTENT_REPO)
  console.log('BASE_REF', BASE_REF)
  console.log('WORKSPACE', WORKSPACE)

  let config = {}
  const configPath = path.resolve(WORKSPACE, SITE_REPO, 'docsmobile.config.js')

  if (fs.existsSync(configPath)) {
    config = require(configPath)
  } else {
    throw new Error(
      'Unable to find docsmobile.config.js in the site repository.'
    )
  }

  const { sources, versioning } = config

  const { directories } = sources.find(({ repo }) => repo === CONTENT_REPO)

  directories.forEach(({ versioningSystem }) => {
    console.log('version', versioning[versioningSystem].all)
  })


} catch (error) {
  core.setFailed(error.message)
}
