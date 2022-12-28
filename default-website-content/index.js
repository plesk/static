// Copyright 1999-2022. Plesk International GmbH. All rights reserved.

import Mustache from 'mustache';
import content from './content.mustache';
import styles from './style.css';

const init = () => {
    document.write(
        Mustache.render(content, {
            public_path: __PUBLIC_PATH__,
            domain_page: __DOMAIN_PAGE__,
            domain_name: location.hostname,
            domain_link: location.protocol + '//' + location.hostname,
            plesk_login:
                'https://' +
                location.hostname +
                (location.protocol === 'https:' ? ':8443' : ''),
            styles,
        })
    );
};

document.addEventListener('DOMContentLoaded', () => {
    init();
});
