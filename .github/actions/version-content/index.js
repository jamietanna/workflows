const core = require('@actions/core')
// const github = require('@actions/github')

try {
  const prebuild = core.getInput('prebuild')
  const siteRepo = core.getInput('site-repo')
  console.log('••• Versioning')
  console.log('cwd', process.cwd())
  console.log('prebuild', prebuild)
  console.log('siteRepo', siteRepo)

} catch (error) {
  core.setFailed(error.message)
}
