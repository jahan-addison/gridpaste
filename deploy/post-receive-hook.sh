#!/bin/bash

target_branch="master"
working_tree="/home/wired/gridpaste"

while read oldrev newrev refname
do
    branch=$(git rev-parse --symbolic --abbrev-ref $refname)
    if [ -n "$branch" ] && [ "$target_branch" == "$branch" ]; then
        GIT_WORK_TREE=$working_tree git checkout $target_branch -f
        NOW=$(date +"%Y%m%d-%H%M")
        git tag release_$NOW $target_branch
        sudo systemctl restart gunicorn.service

        echo "Deployment completed, target branch: $target_branch, folder: $working_tree, tag: release_$NOW"
    fi
done
