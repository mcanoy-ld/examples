import  express from 'express';
import { init } from '@launchdarkly/node-server-sdk';
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = process.env.PORT || 3000
const app = express()

// Set sdkKey to your LaunchDarkly SDK key.
const sdkKey = process.env.LAUNCHDARKLY_SDK_KEY ?? 'your-sdk-key';
const featureFlagKey = process.env.LAUNCHDARKLY_FLAG_KEY ?? 'sample-feature';
const errorMetricKey= process.env.LAUNCHDARKLY_METRIC_KEY ?? 'error event key'

if (!sdkKey) {
  console.log('*** Please edit index.js to set sdkKey to your LaunchDarkly SDK key first.');
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const staticRoot = path.dirname(__filename) + "/public"; // get the name of the directory

const generateRandomUser = (prefix) => {

    const pre = prefix ? prefix : 'nodeuser-';
    return `${pre}-${Math.random().toString(36).substring(2, 6)}`
  }

  function printValueAndBanner(flagValue) {
    console.log(`*** The '${featureFlagKey}' feature flag evaluates to ${flagValue}.`);
  }

// Set up the context properties. Each call will randomly simulate a user
const context = {
    kind: 'user',
    key: generateRandomUser(),
    name: 'Sandy',
  };

const ldClient = init(sdkKey);

app.use('/', express.static('public'));

app.get('/', (req, res) => {
  res.sendFile('release-pipelines/index.html', {root: staticRoot});
});

app.get('/code-ref', (req, res) => {
    res.sendFile('code-references/index.html', {root: staticRoot});
  });

app.get('/rp', async (req, res) => {
  
    res.status(200).send("{}");
  });

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
  })

async function main() {
    try {
      await ldClient.waitForInitialization({timeout: 10});
   
      console.log('*** SDK successfully initialized!');
  
      const eventKey = `update:${featureFlagKey}`;
      ldClient.on(eventKey, async () => {
        const flagValue = await ldClient.variation(featureFlagKey, context, false);
        printValueAndBanner(flagValue);
      });
  
      const flagValue = await ldClient.variation(featureFlagKey, context, false);
      printValueAndBanner(flagValue);
  
      if (typeof process.env.CI !== "undefined") {
        process.exit(0);
      }
    } catch (error) {
      console.log(`*** SDK failed to initialize: ${error}`);
      process.exit(1);
    }
  
  }
  
  main();