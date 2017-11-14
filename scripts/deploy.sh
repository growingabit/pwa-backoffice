#!/bin/bash

gsutil -m rm -r gs://backoffice-growbit-xyz/**

gsutil -m cp -R ./dist/* gs://backoffice-growbit-xyz/

gsutil -m acl ch -r -u AllUsers:R gs://backoffice-growbit-xyz

gsutil web set -m index.html -e index.html gs://backoffice-growbit-xyz

gcloud compute url-maps invalidate-cdn-cache growingabit-io --path "/*"
