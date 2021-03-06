var http = require('http');
var request = require('request');
var async = require('async');
var utils = require('../api/controllers/utils');
var a127_deps = require('../config/dependencies').a127_deps;

var options = {
    url: ""
};

var app;
var repo;

if (process.argv.length = 2 ) {
    console.log("You must provide your Git Account Name and Repo Name");
    return;
}
if (process.argv[2] == '-h') {
       console.log("node app [git account name] [git repo name]");
       return;
} 

    app = process.argv[2];
    repo = process.argv[3];
}


console.log('first arg: ' + process.argv[2]);
console.log('second arg: ' + process.argv[3]);

//-- GitHub Projects
var account = "apigee-127";
//var account = "swagger-api";
//var account = "zettajs";

//-- Project repos
//var rep = "swagger-editor";
//var repo = "swagger-tools";
//var repo = "usergrid-npm";
//var repo = "swagger-converter";
//var repo = "apigee-remote-proxy";
//var repo = "volos-connectors";
//var repo ="magic";
var repo = "a127";
//var repo = "swagger-node";
//var repo = "zetta";

var tags = "";
var tagObj = {};
var date = "";
var tagIndex = 0;
//var rn = "# " + account + "/" + repo + " Release Notes\n\n";
var rn = "## " + account + "/" + repo + " release notes\n\n";
var release_notes = "";

// Assemble the release notes
function buildNotes(tagIndex) {
    async.series([
            function getTags(callback) {

                options.url = "http://localhost:10010/accounts/" + account + "/repos/" + repo + "/tags";

                request(options, function (error, response, body) {
                    if (error) {
                        throw error;
                    } else {
                        tags = JSON.parse(body);
                        tags = tags.reverse();
                        callback(null, "Getting all tags...");
                    }
                });

            },
            function getTag(callback) {

                var sha = tags[tagIndex].object.sha;
                options.url = "http://localhost:10010/accounts/" + account + "/repos/" + repo + "/tags/" + sha;

                request(options, function (error, response, body) {
                    if (error) {
                        throw error;
                    } else {
                        tagObj = JSON.parse(body);
                        callback(null, "Getting latest tag...");
                    }
                });

            },
            function addDateAndVersion(callback) {
                var date = "Date Unavailable";
                var version = "Version Unavailable";
                if (tagObj) {
                    version = tagObj.tag;
                    if (tagObj.tagger) {
                        date = utils.formatDate(tagObj.tagger.date);
                    }
                }
                rn += "### Release " + version + " - " + date + "\n\n";
                callback(null, "Getting date and version number...");

            },
            function addCommits(callback) {

                options.url = "http://localhost:10010/accounts/" + account + "/repos/" + repo + "/tags/" + tagObj.tag + "/commits";

                request(options, function (error, response, body) {
                    if (error) {
                        throw error;
                    } else {
                        if (body.length == 0) {
                            rn += "##### Commits\n\n" + "None" + "\n\n";
                        } else {
                            rn += "##### Commits\n\n" + body + "\n\n";
                        }
                        callback(null, "Getting commits...");
                    }
                });

            },
            function addDependencies(callback) {

                options.url = "http://localhost:10010/accounts/" + account + "/repos/" + repo + "/tags/" + tagObj.tag + "/dependencies";

                request(options, function (error, response, body) {
                    if (error) {
                        throw error;
                    } else {
                        rn += "##### Apigee-127 specific dependencies\n\n" + processDependencies(body) + "\n\n";
                        callback(null, "Getting dependenices...");
                    }
                });

            },
            function getReleaseNotes(callback) {
                callback(null, rn);
            }
        ],

        function callback(err, results) {
            release_notes = results[results.length - 1];
            console.log(release_notes);
            rn = "";
            tagIndex++;
            if (tagIndex < tags.length) {
                buildNotes(tagIndex);
            } else {
                console.log("DONE");
            }

        });
}

buildNotes(tagIndex);

function processDependencies(body) {

    var dependencies;
    if (body.length > 0) {
        dependencies = JSON.parse(body);
    } else {
        return "None";
    }
    var data = "";

    for (var i = 0; i < a127_deps.length; i++) {
        var dep = a127_deps[i];

        if (dependencies.hasOwnProperty(dep)) {
            if (dependencies[dep] == "") {
                data = "* " + link(dep, dependencies) + "''\n" + data;
            } else {
                data = "* " + link(dep, dependencies) + "\n" + data;
            }
        }
    }
    if (data.length == 0) {
        data = "None";
    }
    return data;

}

function link(mod, dependencies) {

    var url = "";

    if (mod == "apigeetool") {
        url = "https://github.com/apigee/apigeetool-node"
    } else if (mod == "swagger-tools") {
        url = "https://github.com/apigee-127/swagger-tools"
    } else if (mod == "volos-swagger") {
        url = "https://github.com/apigee-127/volos/tree/master/swagger"
    } else if (mod == "swagger-editor-for-apigee-127") {
        url = "https://github.com/swagger-api/swagger-editor"
    } else if (mod == "usergrid-installer") {
        url = "https://github.com/apigee-127/usergrid-npm"
    } else if (mod == "volos-management-apigee") {
        url = "https://github.com/apigee-127/volos"
    } else if (mod == "a127-magic") {
        url = "https://github.com/apigee-127/magic"
    } else if (mod == "apigee-remote-proxy") {
        url = "https://github.com/apigee-127/swagger-tools"
    } else if (mod == "swagger-converter") {
        url = "https://github.com/apigee-127/swagger-converter"
    }

    return "[" + mod + "]" + "(" + url + ")" + ": " + dependencies[mod];
}
