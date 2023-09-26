# Guardian RSS

RSS feed for topics exposed by [The Guardian Openplatform](https://open-platform.theguardian.com/documentation/)

## Run locally

- add environment variable

```sh
export APIKEY='<your-api-key>'
export APIURL='https://content.guardianapis.com'
```

- `yarn install`
- `yarn local` - starts server in localhost, not intended to use in prod.
- `yarn build && yarn start` - used in production to start the app.

## Configuration and Setup

Node version is managed with [nvm](https://github.com/nvm-sh/nvm).
`.nvmrc` file can be used to specify nodeJS version used for the project.
`nvm use` or `nvm install` command would respect the `.nvmrc` file and detect the node version specified in the .nvmrc file and would install or switch to that specific nodeJS version.

## w3c Validataion

[🆗](https://validator.w3.org/feed/check.cgi)
