#!/usr/bin/env bash

function run() {
    MAIL=$1
    PASS=$2

    curl pop3s://pop3.web.de --user "$MAIL:$PASS" --silent --fail
    RESULT=$?
    
    echo "Request with $MAIL - Result: ${RESULT}"
}

run $WEB1_MAIL $WEB1_PASS
