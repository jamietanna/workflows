const core = require('@actions/core')
// const github = require('@actions/github')

try {
  console.log('••• Versioning')
  console.log('cwd', process.cwd())

} catch (error) {
  core.setFailed(error.message)
}
