

import chalk from 'chalk'
// import { resolve, join } from 'path'
import updateNotifier from 'update-notifier-cjs'


interface Package {
	name: string;
	version: string;
	description: string;
}

const UPDATE_CHECK_INTERVAL_HOURS = 1


const checkUpdate = (pkg: Package): void => {

	const notifier = updateNotifier({ pkg, updateCheckInterval: 1000 * 60 * 60 * UPDATE_CHECK_INTERVAL_HOURS })

    if (notifier.update) {

      const pluginMode = true // resolve(__dirname).includes(join('@commercelayer', 'cli', 'node_modules', pkg.name))
      const updateCommand = pluginMode ? 'commercelayer plugins:update' : '{updateCommand}'

      notifier.notify({
        isGlobal: !pluginMode,
        message: `-= ${chalk.bgWhite.black.bold(` ${pkg.description} `)} =-\n\nNew version available: ${chalk.dim('{currentVersion}')} -> ${chalk.green('{latestVersion}')}\nRun ${chalk.cyanBright(updateCommand)} to update`,
      })

    }

}


export { checkUpdate, type Package }
