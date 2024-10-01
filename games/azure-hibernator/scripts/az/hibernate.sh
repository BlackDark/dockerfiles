#!/bin/bash
source /scripts/env.sh

az vm deallocate --resource-group $VM_RG --name $VM_NAME --hibernate true
