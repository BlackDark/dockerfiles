#!/usr/bin/env python
"""Cloudflare API code - example"""

import logging
import os
import sys
from functools import reduce

import requests

logging.basicConfig(
format='%(asctime)s %(levelname)-8s %(message)s',
level=logging.INFO,
datefmt='%Y-%m-%d %H:%M:%S')

sys.path.insert(0, os.path.abspath('..'))

DOMAIN = os.environ['CF_DOMAIN']
SCHEDULE_MINUTES = int(os.environ['SCHEDULE_MINUTES']) or 5
RECORDS = os.environ['CF_RECORDS'].split(',')
DNS_NAMES = [record + '.' + DOMAIN for record in RECORDS]

import CloudFlare


def my_ip_address():
    """Cloudflare API code - example"""

    # This list is adjustable - plus some v6 enabled services are needed
    # url = 'http://myip.dnsomatic.com'
    # url = 'http://www.trackip.net/ip'
    # url = 'http://myexternalip.com/raw'
    url = 'https://api.ipify.org'
    try:
        ip_address = requests.get(url).text
    except:
        exit('%s: failed' % (url))
    if ip_address == '':
        exit('%s: failed' % (url))

    if ':' in ip_address:
        ip_address_type = 'AAAA'
    else:
        ip_address_type = 'A'

    return ip_address, ip_address_type

def do_dns_update(cf, zone_name, zone_id, dns_name, ip_address, ip_address_type):
    """Cloudflare API code - example"""

    try:
        params = {'name':dns_name, 'match':'all', 'type':ip_address_type}
        dns_records = cf.zones.dns_records.get(zone_id, params=params)
    except CloudFlare.exceptions.CloudFlareAPIError as e:
        exit('/zones/dns_records %s - %d %s - api call failed' % (dns_name, e, e))

    updated = False

    # update the record - unless it's already correct
    for dns_record in dns_records:
        logging.info(dns_record)
        old_ip_address = dns_record['content']
        old_ip_address_type = dns_record['type']

        if ip_address_type not in ['A', 'AAAA']:
            # we only deal with A / AAAA records
            continue

        if ip_address_type != old_ip_address_type:
            # only update the correct address type (A or AAAA)
            # we don't see this becuase of the search params above
            logging.info('IGNORED: %s %s ; wrong address family' % (dns_name, old_ip_address))
            continue

        if ip_address == old_ip_address:
            logging.info('UNCHANGED: %s %s' % (dns_name, ip_address))
            updated = True
            continue

        proxied_state = dns_record['proxied']
 
        # Yes, we need to update this record - we know it's the same address type

        dns_record_id = dns_record['id']
        dns_record = {
            'name':dns_name,
            'type':ip_address_type,
            'content':ip_address,
            'proxied':proxied_state
        }
        try:
            logging.info('DIGGA PUT')
            #dns_record = cf.zones.dns_records.put(zone_id, dns_record_id, data=dns_record)
        except CloudFlare.exceptions.CloudFlareAPIError as e:
            exit('/zones.dns_records.put %s - %d %s - api call failed' % (dns_name, e, e))
        logging.info('UPDATED: %s %s -> %s' % (dns_name, old_ip_address, ip_address))
        updated = True

    if updated:
        return

    # no exsiting dns record to update - so create dns record
    dns_record = {
        'name':dns_name,
        'type':ip_address_type,
        'content':ip_address
    }
    try:
        logging.info('DIGGA POST')
        #dns_record = cf.zones.dns_records.post(zone_id, data=dns_record)
    except CloudFlare.exceptions.CloudFlareAPIError as e:
        exit('/zones.dns_records.post %s - %d %s - api call failed' % (dns_name, e, e))
    logging.info('CREATED: %s %s' % (dns_name, ip_address))

def do_dns_update2(cf, zone_name, zone_id, dns_name, ip_address, ip_address_type):
    """Cloudflare API code - example"""

    try:
        params = {'match':'all', 'type': ip_address_type}
        dns_records = cf.zones.dns_records.get(zone_id, params=params)
    except CloudFlare.exceptions.CloudFlareAPIError as e:
        exit('/zones/dns_records %s - %d %s - api call failed' % (dns_name, e, e))

    filtered_dns_records = [a for a in dns_records if a['name'] in DNS_NAMES]
    existing_records_names = [a['name'] for a in filtered_dns_records]
    missing_dns_records = [a for a in DNS_NAMES if a not in existing_records_names]
    
    # logging.info('FILTERED')
    # logging.info(filtered_dns_records)
    # logging.info('EXIST')
    # logging.info(existing_records_names)
    # logging.info('MISSING')
    # logging.info(missing_dns_records)
    
    logging.info('Filtered matching DNS records: ' + str(len(filtered_dns_records)))
    
    # update the record - unless it's already correct
    for dns_record in filtered_dns_records:
        old_ip_address = dns_record['content']
        dns_record_name = dns_record['name']
        dns_record_id = dns_record['id']

        if ip_address == old_ip_address:
            logging.info('UNCHANGED: %s %s' % (dns_record_name, ip_address))
            continue

        
        dns_record = {
            'name':dns_record_name,
            'type':ip_address_type,
            'content':ip_address,
            'proxied':True
        }
        try:
            dns_record = cf.zones.dns_records.put(zone_id, dns_record_id, data=dns_record)
        except CloudFlare.exceptions.CloudFlareAPIError as e:
            exit('/zones.dns_records.put %s - %d %s - api call failed' % (dns_record_name, e, e))
        logging.info('UPDATED: %s %s -> %s' % (dns_record_name, old_ip_address, ip_address))

    # create the record
    for dns_record_name in missing_dns_records:
        dns_record = {
            'name':dns_record_name,
            'type':ip_address_type,
            'content':ip_address,
            'proxied':True
        }
        try:
            dns_record = cf.zones.dns_records.post(zone_id, data=dns_record)
        except CloudFlare.exceptions.CloudFlareAPIError as e:
            exit('/zones.dns_records.post %s - %d %s - api call failed' % (dns_record_name, e, e))
        logging.info('CREATED: %s %s' % (dns_record_name, ip_address))
    print()


def main():
    """Cloudflare API code - example"""

    try:
        #dns_name = sys.argv[1]
        dns_name = DOMAIN
    except IndexError:
        exit('usage: example-update-dynamic-dns.py fqdn-hostname')

    host_name, zone_name = '.'.join(dns_name.split('.')[:2]), '.'.join(dns_name.split('.')[-2:])

    ip_address, ip_address_type = my_ip_address()

    logging.info('MY IP: %s %s' % (dns_name, ip_address))

    cf = CloudFlare.CloudFlare()

    # grab the zone identifier
    try:
        params = {'name':zone_name}
        zones = cf.zones.get(params=params)
    except CloudFlare.exceptions.CloudFlareAPIError as e:
        exit('/zones %d %s - api call failed' % (e, e))
    except Exception as e:
        exit('/zones.get - %s - api call failed' % (e))

    if len(zones) == 0:
        exit('/zones.get - %s - zone not found' % (zone_name))

    if len(zones) != 1:
        exit('/zones.get - %s - api call returned %d items' % (zone_name, len(zones)))

    zone = zones[0]

    zone_name = zone['name']
    zone_id = zone['id']

    do_dns_update2(cf, zone_name, zone_id, dns_name, ip_address, 'A')
    #exit(0)

# if __name__ == '__main__':
#     main()

import time

import schedule

logging.info('Refreshing every %d minutes ...' % (SCHEDULE_MINUTES))
schedule.every(SCHEDULE_MINUTES).minutes.do(main)

try:
    main()
except Exception as e:
    logging.error(e)

while True:
    schedule.run_pending()
    time.sleep(1)
