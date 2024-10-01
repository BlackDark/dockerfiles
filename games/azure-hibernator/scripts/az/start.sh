#!/bin/bash
source /scripts/env.sh

az vm start --resource-group $VM_RG --name $VM_NAME
