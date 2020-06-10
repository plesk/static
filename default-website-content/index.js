// Copyright 1999-2020. Plesk International GmbH. All rights reserved.

import Mustache from 'mustache';
import content from './content.mustache';
import UAT from './uat';
import styles from './style.css';

document.open();
document.write(
    Mustache.render(content, {
        domain_page: __DOMAIN_PAGE__,
        domain_name: location.hostname,
        domain_link: location.protocol + '//' + location.hostname,
        plesk_login:
            'https://' +
            location.hostname +
            (location.protocol === 'https:' ? ':8443' : ''),
    })
);
document.close();

styles.use();

UAT.init(
    JSON.parse(
        atob(
            'eyJlbmRwb2ludCI6Imh0dHBzOi8vZmlyZWhvc2UudXMtd2VzdC0yLmFtYXpvbmF3cy5jb20iLCJyZWdpb24iOiJ1cy13ZXN0LTIiLCJjcmVkZW50aWFscyI6eyJhY2Nlc3NLZXlJZCI6IkFLSUFSNFlFWVJKTDZKS0JOUkdQIiwic2VjcmV0QWNjZXNzS2V5IjoiRkUxNFBIK3VjMTFUZWt5U3RoRG9TR3NhT1hTQXg5b1JDc1RHc0ZOOCJ9LCJzdHJlYW0iOiJkZWZhdWx0LXBhZ2Utc3RhdHMifQ=='
        )
    )
);
