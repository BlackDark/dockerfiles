#!/bin/bash
source /scripts/env.sh

az vm get-instance-view --resource-group $VM_RG --name $VM_NAME --query instanceView.statuses[1] --output table
