// Copyright 1999-2020. Plesk International GmbH. All rights reserved.

import Mustache from 'mustache'
import content from './content.mustache';
import './gtm';

document.addEventListener('DOMContentLoaded', function () {
    document.write(
        Mustache.render(content, {
            domain_page: __DOMAIN_PAGE__,
            domain_name: location.hostname,
            domain_link: location.protocol + '//' + location.hostname,
            plesk_login: 'https://' + location.hostname + (location.protocol === 'https:' ? ':8443' : ''),
        })
    );
});
