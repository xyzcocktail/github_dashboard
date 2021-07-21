# pull_requests

A simple Github dashboard

## Project setup
```
npm install

touch ./src/config.js
```

`config.js` should export the following variables:
```
GITHUB_BEARER_TOKEN // Generate token at: https://github.com/settings/tokens
GITHUB_USERNAME // Your Github username
ORGANIZATION // e.g. siteminder-au
REPOSITORIES // Repositories in that organisation you want to display information for
```

Example: `config.js`:
```
export const GITHUB_BEARER_TOKEN = 'ghp_soopersecret'
export const GITHUB_USERNAME = 'elon_musk'
export const ORGANIZATION = 'tesla'
export const REPOSITORIES = [
  {
    name: 'tesla-ai',
    displayName: 'SpaceX',
  },
  {
    name: 'spacex-launch-codes',
    displayName: 'SpaceX',
  },
]
```

### Compiles and hot-reloads for development
```
npm run serve
visit: http://localhost:8080
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
