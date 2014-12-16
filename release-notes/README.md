# Apigee-127 release notes generator

Generates release notes for GitHub repositories.

## What are release notes?

For each release tag in a repository, we list the commit messages. 

## What do they look like?

The look kind of like this, with a heading, a list of release numbers/dates, and commits for each release:

### apigee-127/a127

#### v0.9.2 - 2014-11-10

* set a127-magic version in template
* 0.9.2

#### v0.9.1 - 2014-10-19

* fix test
* update x-volos tags to new x-127 syntax
* nail down versions, version for release
* checking for different status code for monetization enabled org
* Merge pull request #22 from apigee-127/monetization-enabled-org-patch


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

The tool generates release notes for repositories that have release tags. If a repo doesn't have any tags, then we don't generate anything. 

1. Get a list of valid owners. Currently, they are `apigee-127` and `swagger-api`. The first has all the Apigee-127 repos, and the latter has the Swagger editor repo. 

    ```sh
       $ curl -i http://localhost:10010/owners/

       [{"name":"apigee-127"},{"name":"swagger-api"}]
    ```


2. For an owner, get a list of repos. These are the repository names that you can generate release notes for. So, for owner `apigee-127`, you do:

    ``` sh
        $ curl -i http://localhost:10010/repos/apigee-127
        {
          "0": "apigee-127/a127",
          "1": "apigee-127/a127-documentation",
          "2": "apigee-127/a127-samples",
          "3": "apigee-127/apigee-remote-proxy",
          "4": "apigee-127/avault",
          "5": "apigee-127/example-project",
          "6": "apigee-127/magic",
          "7": "apigee-127/phrixus",
          "8": "apigee-127/project-skeleton",
          "9": "apigee-127/site",
          "10": "apigee-127/swagger-converter",
          "11": "apigee-127/swagger-tools",
          "12": "apigee-127/usergrid-npm",
          "13": "apigee-127/usergrid-swagger",
          "14": "apigee-127/volos"
        }
    ```

3. Generate release notes for a given repository. This example just returns them to your client, in `.md` format. You can also save to a file and you can control how many releases to generate notes for. See the API section below.

    ``` sh 
        $ curl -i 'http://localhost:10010/repos/apigee-127/magic/release_notes

        # apigee-127/magic

        ## v0.7.0 - 2014-11-8

        * update to work with swagger-tools 0.7 async interface
        * update swagger-tools dep to 0.7.1
        * 0.7.0

        ...
    ```


## API

### Get a list of valid owners

URI: `/owners`

This list is specified in ./config/repo.js. For now, the only two valid owners are `apigee-127` and `swagger-api`. Returns a JSON string. 

**Example:**

`curl -i http://localhost:10010/owners/`

### Get list of all repositories owned by owner

URI: `/repos/{owner}`

Gets all the repositories  associated with the owner.

**Example**

`curl -i http://localhost:10010/repos/apigee-127`

### Generate release notes for a repository

URI: `/repos/{owner}/{repo}/release_notes`

Outputs release notes in `.md` format to the response for the specified repository. You also have the option of writing the release notes directly to a file by specifying the `save` query parameter. 

**Query parameters:**

* depth - (optional) Specifies the number of release tags to generate release notes for. Default: 10.
* save - (optional) If "true", the release notes will be saved to `./relnotes/RELEASE_NOTES-<repo-name>.md`. Default: false. 

**Examples:**

Returns release notes for the most recent 20 release tags back to the client:

    ```curl -i 'http://localhost:10010/repos/apigee-127/magic/release_notes?depth=20```


Saves release notes for the most recent 5 release tags in a file:

    ```curl -i 'http://localhost:10010/repos/apigee-127/magic/release_notes?depth=5&save=true'```


## TODO

* Choose to only return repos that have release tags associated with them.
* Choose to only return repos that do not have release tags. 
* Allow user to generate one big release note output/file for all repos associated with an owner. If a repo doesn't have any release tags, output that message. 




