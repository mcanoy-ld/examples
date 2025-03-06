
const ldcontexts = new Map();
const flagKey = 'release-widget-ui';

const basicContext = {
    kind: 'user',
    key: 'basic-key',
    name: 'Basil'
  };

const alphaContext = {
    kind: 'user',
    key: 'alpha-key',
    name: 'Alfie'
  };

const betacontext = {
    kind: 'user',
    key: 'beta-key',
    name: 'Beto'
  };

const enterprisecontext = {
    kind: 'user',
    key: 'enterprise-key',
    name: 'Enzo'
  };

ldcontexts.set('dev', basicContext);
ldcontexts.set('qa', basicContext);
ldcontexts.set('int', basicContext);
ldcontexts.set('prod-alpha', alphaContext);
ldcontexts.set('prod-beta', betacontext);
ldcontexts.set('prod-enterprise', enterprisecontext);

/*
* Render based on env and target. Requires naming convention for inputs. Part of init
*/
function renderEnv(ldclient, env, target) {
    const flagValue = ldclient.variation(flagKey, false);
    document.getElementById(`${env}-${target}`).checked = flagValue;
}

function initLDClients(...inputEnvs) {
    inputEnvs.forEach(env => {
        if(env === 'prod') {
            ['alpha', 'beta', 'enterprise'].forEach(target => {
                const ldclient = LDClient.initialize(getClientSide(env), ldcontexts.get(`${env}-${target}`));
                addEvents(ldclient, env, target);
            });
            

        } else {
            const ldclient = LDClient.initialize(getClientSide(env), ldcontexts.get(env));
            addEvents(ldclient, env, 'any');
        }
        
    });
}

function addEvents(ldclient, env, target) {
    ldclient.on('failed', () => {  
        document.getElementById(`${env}-${target}`).innerHTML = `${env} ${target} SDK failed to initialize`
    });
    
    ldclient.on('ready', () => {
        renderEnv(ldclient, env, target);
    });

    ldclient.on('change', () => {
        renderEnv(ldclient, env, target);
    });

}
