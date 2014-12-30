# GitHub release notes generator

Generates release notes for GitHub repositories.

## About this project

The API is written using Apigee-127. A client app is provided that uses this API to build the release notes.

## What do the release notes look like?

For each release tag in a repository, we list the commit messages and the Apigee-127-related dependencies (with links to their repos):


### apigee-127/a127 Release Notes

#### v0.10.1 - 2014-12-15

##### Commits

* fix to work with config and swagger validator changes
* 0.10.1


##### Apigee-127 Dependencies

* [a127-magic](https://github.com/apigee-127/swagger-tools): ^0.7.0
* [volos-management-apigee](https://github.com/apigee-127/swagger-tools): ''
* [usergrid-installer](https://github.com/apigee-127/swagger-tools): ^0.0.5
* [swagger-editor-for-apigee-127](https://github.com/swagger-api/swagger-editor): 2.7.2
* [apigeetool](https://github.com/apigee/apigeetool-node): ''
* [swagger-tools](https://github.com/apigee-127/swagger-tools): ^0.7.0


## Configuration

1. Copy `./config/secrets-sample.js` to `./config/secrets.js`. 
2. Edit `./config.secrets.js` with your GitHub information as follows:

    ```
            exports.user = {

               username: 'Your GitHub username',
               password: 'Your GitHub password',
               agent: "Arbitrary string -- typically your GitHub username"

    };
    ```

3. Save the file.

## Start the project

1. CD to the project root. For example, `./release_notes`. 
2. Execute `a127 project start`.

## How to use it

1. CD to the ./client folder.
2. Open app.js and configure the account and repo variables for the GitHub account and repository you want to generate release notes for. For example:

```javascript
   var account = "apigee-127";
   var repo = "a127";
```

2. Execute the node app. Optionally, redirect output to a .md file. For example:

    ``` sh 
        $ node app > release_notes.md
    ```


## Client App

See ./client/app.js. Builds release notes in .md format. For now, outputs dependencies that are pertinient to Apigee-127, but this can be changed to just return all dependencies, or any that you wish.

As it builds release notes, returns output to the terminal. For now, to save in a file, you need to do `node app > file.md`.

Note. It currently builds notes for ALL tags associated with a repository. It can take a minute or two to finish if there are a lot of tags. TODO: add a way to limit the number of tags processed. 

## API

### Get list of all repositories associated with an account

URI: `/accounts/{account}/repos`

Gets all the repositories  associated with the account.

**Example**

`curl -i http://localhost:10010/accounts/apigee-127/repos`

### Get a repository

URI: `/accounts/{account}/repos/{repo}`

Returns a JSON representation of the repository.

**Example**

`curl -i http://localhost:10010/accounts/apigee-127/repos/a127`

### Get all the tags associated with a repository

URI: `/accounts/{account}/repos/{repo}/tags`

Returns a JSON array of all the tags.

**Example**

`curl -i http://localhost:10010/accounts/apigee-127/repos/a127/tags`

### Get a specific release tag

URI: `/accounts/{account}/repos/{repo}/tags/{tag}`

Returns a JSON representation of the tag. 

Note: {tag} is the SHA value of the tag, which you can get with `/accounts/{account}/repos/{repo}/tags`.

**Example**

`curl -i http://localhost:10010/accounts/apigee-127/repos/a127/tags/26064c8041eec3aa460e23fcdd1f196bc8664dbe`

### Get dependencies for a tag

URI: `/accounts/{account}/repos/{repo}/tags/{tag}/dependencies`

where {tag} is the release version number. For example: `v0.1.2`

Returns a JSON object containing all of the dependencies. 

**Example**

`curl -i http://localhost:10010/accounts/apigee-127/repos/a127/tags`

### Get all the commits associated with a tag

URI: `/accounts/{account}/repos/{repo}/tags/{tag}/commits`

Returns the commits for that tag. 

**Example**

`curl -i http://localhost:10010/accounts/apigee-127/repos/a127/tags/v0.10.0/commits`



## TODO

* Configure how many tags to generate for. Currently builds release notes for all tags.
* Add command-line UI for entering the account and repo names.
* Add file save.
* Add A-127 caching.



