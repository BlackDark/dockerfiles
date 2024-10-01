#!/bin/bash
# Should be configured or provided via env
#APP_ID=xx
#TENANT_ID=xx
#SECRET=xx

export VM_RG=xx
export VM_NAME=xx

az login --service-principal -u $APP_ID -p $SECRET --tenant $TENANT_ID -o none


# az vm start --resource-group $VM_RG --name $VM_NAME
