const core = require('@actions/core')
const fs = require('fs-extra')
const glob = require('glob')
const path = require('path')

const { PREBUILD, SITE_REPO, CONTENT_REPO, BASE_REF, WORKSPACE } = process.env

const syncFiles = async (path) => {
  const targetDir = path.join(WORKSPACE, PREBUILD, CONTENT_REPO, BASE_REF, path)
  const sourceDir = path.join(WORKSPACE, 'tmp', path)

  const patterns = {
    include: [
      '*.docnav.json',
      '*.apidocs.json',
      '*.mdx',
      '*.png',
      '*.gif',
      '*.jpg',
      '*.svg',
      '*.jpeg',
      '*.webp',
      '*.devdocs.json',
      '*/',
    ],
    exclude: ['cats.mdx', 'infrastructure/ansible/systests/*'],
  }

  // Ensure target directory exists
  await fs.ensureDir(targetDir)

  // Clear target directory
  await fs.emptyDir(targetDir)

  // Process each pattern
  for (const pattern of patterns.include) {
    // Generate glob pattern
    const files = glob.sync(path.join(sourceDir, pattern), { nodir: true })

    for (const file of files) {
      const targetFilePath = path.join(
        targetDir,
        path.relative(sourceDir, file)
      )
      await fs.ensureDir(path.dirname(targetFilePath)) // Ensure directory exists
      await fs.copy(file, targetFilePath) // Copy file
    }
  }

  // Handle exclusions after all files are copied
  for (const pattern of patterns.exclude) {
    const files = glob.sync(path.join(targetDir, pattern), { nodir: true })
    for (const file of files) {
      await fs.remove(file) // Remove excluded files
    }
  }
}

try {
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

  directories.forEach(async ({ versioningSystem, path }) => {
    if (versioning[versioningSystem].all.includes(BASE_REF)) {
      await syncFiles(path)
    }
  })
} catch (error) {
  core.setFailed(error.message)
}
