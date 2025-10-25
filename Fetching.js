const readline = require('readline');
const prompts = readline.createInterface(process.stdin, process.stdout);

/*
PushEvent "repo:name"
WatchEvent "payload:action" started
IssuesEvent "payload:action" closed "issue:title"
IssuesEvent "payload:action" labeled "issue:title"  "labels:name"
IssuesEvent "payload:action" assigned "issue:title" "assignee:login"
IssuesEvent "payload:action" opened "issue:title"
CreateEvent <payload:ref_type> <payload:full_ref>
PublicEvent <repo:name>
MemberEvent "payload:action" added "repo:name"

default: {"type" "repo:name"}
error
*/


function readAction(a){
    if (a["type"] == undefined) return "Made an unrecognized action"
    let reponame = a.repo.name.split("/").at(-1)

    switch (a["type"]){
        case "PushEvent":
            let times = a.times
            return  ((Number(times) != NaN && times>1) ? (" >> Pushed " + a.times + " times ") : " > Pushed ")+"to the " + a.payload.ref.split("/").at(-1) + " branch in the " + reponame + " repo"
        case "WatchEvent":
            return " o Watched the repository " + reponame + " from " + a.org.login
        case "CreateEvent":
            return " + Created the " + a.payload["ref_type"] + " " + a.payload.full_ref + " in the " + reponame + " repo"
        case "PublicEvent":
            return " > Published the " + reponame + " repo"
        case "IssueCommentEvent":
            return " / Commented on the issue [" + a.payload.issue.title + "] of " + reponame
        case "PullRequestEvent":
            switch (a.payload.action){
                case "closed":
                    return " - Closed the PULL REQUEST ["+ a.payload.pull_request.head.ref + "] in the " + reponame + " repo"
            }
        case "MemberEvent":
            if (a.payload.action === "added"){
                return " @ Added " + a.payload.member.login + " to the " + reponame + " repo from " + a.repo.name.split("/")[0]
            }
        case "IssuesEvent":
            switch (a.payload.action){
                case "closed":
                    return " - Closed the issue [" + a.payload.issue.title + "] of " + reponame
                case "opened":
                    return " + Opened the issue [" + a.payload.issue.title + "] in the " + reponame + " repo"
                case "labeled":
                    return " # Labeled the issue [" + a.payload.issue.title + "] as " + a.payload.labels[0].name + " in the " + reponame + " repo"
                case "assigned":
                    return " ^ Assigned the issue [" + a.payload.issue.title + "] to " + a.payload.assignee.login + " in the " + reponame + " repo"
                default:
                    return " * " + a.payload.action + " the issue [" + a.payload.issue.title + "]"
            }   
        default:
            return " * Made the action of " + a.type + " in the repo " + reponame
    }
}


function simplify(a){
    let action = "";
    let repo = "";
    let ref = "";
    let times = 1;

    let simplified = [];

    a.forEach(e => {
        let ac = e.type
        let rep = e.repo.name
        let re = e.payload.ref
        if (action === "PushEvent" && ac === action && rep === repo && ref === re){
            simplified[simplified.length - 1] = {...simplified.at(-1),"times":times++}
        } else {
            simplified.push(e);
            action = ac;
            ref = re
            repo = rep;
            times = 1
        }
    });

    return simplified
}


const getEvents = async (user) => await fetch("https://api.github.com/users/"+user+"/events",
    {headers: {'X-GitHub-Api-Version': '2022-11-28' }})
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }).then(response => {
        let simp = simplify(response)
        simp.map(e => readAction(e)).forEach(e=>console.log(e))
        if (simp.length === 0) console.log("No events were found in the last 30 days")
    }).catch((reason) => {
        console.log("Can't get data " + reason)
    })



async function ask (){
    prompts.question("github-activity> ", async (answer) => {
        let sep = answer.split(" ");
        for (const element of sep) {
            console.log("")
            console.log("===== Actions of " + element + " =====");
            await getEvents(element);
        }
        console.log("");
        ask()
    })
}

ask()

