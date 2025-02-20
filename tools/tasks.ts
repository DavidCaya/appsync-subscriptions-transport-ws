import { installDeps, runNodeCommand } from '@mdk/node';
import { declareTask } from '@mdk/tasks';
import { release, publishPlugin } from '@mdk/semantic-release';
import { declarePipeline } from '@mdk/pipeline';

declareTask('install-deps', async () => installDeps());

declareTask('lint', ['install-deps'], async () => runNodeCommand('yarn lint'));

declareTask('test', ['install-deps'], async () => runNodeCommand('yarn test'));

declareTask('build', ['install-deps'], async () => runNodeCommand('yarn build'));

declareTask('prepare', async () => runNodeCommand('yarn prepublishOnly'))

// declareTask('release', ['lint', 'test', 'build'], async (task) => {
declareTask('release', ['prepare'], async (task) => {
  await release({ 
    enableNpmPublish: true,
  });
});

declareTask('ci', ['release']);

declarePipeline({
  provider: 'bitbucket',
  on: 'all',
  task: 'ci',
});
