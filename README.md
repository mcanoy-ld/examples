# examples


## Release Pipeline

* Note: Must sync with a properly set up LD project.

This example shows how a release pipeline can be run. It expects for environments

- Dev
- QA
- Int
- Production

In production it is expecting 3 types of users

- Alpha (Context key prefixed `alpha-`)
- Beta (Context key prefixed `beta-`)
- Enterprise (Context key prefixed `enterprise-`)

This app will show 6 buttons (checkboxes). When the feature flag for that button is enabled and available its state will be on. Otherwise off.

A file named `utils.js` should be added at `<ROOT>/public/`. This file is .gitignored. It expects this content:

```
clientSideIdMap = new Map();
clientSideIdMap.set('dev', 'dev-key-here');
clientSideIdMap.set('int', 'int-key-here');
clientSideIdMap.set('qa', 'qa-key-here');
clientSideIdMap.set('prod', 'prod-key-here');

function getClientSide(env) {

    return clientSideIdMap.get(env);
}

```

Once this is setup run `npm run dev`. Go to `localhost:3000`. Run your release pipeline to show how the pipeline can change the value progressively.

//TODO remove need for sdk key at start up (not needed for this example).

## Code References

This examples helps to demonstrate the value of code references. There is a github workflow file `code-reference.yaml` that checks references in a project.

To leverage this you would most likely need 
- to add a new flag to your LD instance
- configure your git repo to rerun the action with an access token and project name
- push code to that repo (or just run the existing action)
- observe the linking between LD and Github. 

Use the code that produces content at `/code-ref`. A simple flag run in the `Dev` environment