// Copyright 1999-2025. WebPros International GmbH. All rights reserved.

import Firehose from 'aws-sdk/clients/firehose';

if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector;
}

const getElement = event => {
    let { target } = event;
    const { currentTarget, type } = event;

    if (currentTarget
        && currentTarget.tagName
        && (type === 'load'
            || type === 'error'
            || (type === 'click'
                && currentTarget.tagName.toLowerCase() === 'input'
                && currentTarget.type === 'radio'
            )
        )
    ) {
        target = currentTarget;
    }

    return target.nodeType === Node.TEXT_NODE ? target.parentNode : target;
};

const findElement = (event, selector) => {
    let element = getElement(event);

    if (!selector) {
        return element;
    }

    while (element) {
        if (element.nodeType === Node.ELEMENT_NODE && element.matches(selector)) {
            return element;
        }
        element = element.parentNode;
    }

    return null;
};

export const prepareNodeData = (el, textEl, config) => {
    const data = {};
    if (config && config.attributes) {
        config.attributes.forEach(attr => {
            if (!el.hasAttribute(attr)) {
                return;
            }
            const value = el.getAttribute(attr);
            if (value) {
                data[attr] = value;
            }
        });
    }
    return data;
};

const preparePostData = (action, target) => {
    const data = {};

    if (action.post && target) {
        if (action.post.self) {
            action.post.self.forEach(attr => {
                if (attr === 'value') {
                    return;
                }
                const value = target.getAttribute(attr);
                if (value) {
                    data[attr] = value;
                }
            });
        }
        if (action.post.selfText) {
            data.text = target.innerText;
        }
    }

    if (action.data) {
        Object.keys(action.data).forEach(key => data[key] = action.data[key]);
    }

    return data;
};

let firehose;
let config;

const request = (action, target) => {
    if (!config) {
        return;
    }
    if (!firehose) {
        firehose = new Firehose(config);
    }

    const timestamp = (new Date()).toISOString();
    const dataId = preparePostData(action, target)['data-id'] || '';

    firehose.putRecord({
        DeliveryStreamName: config.stream,
        Record: {
            Data: `${timestamp}|${action.name}|${dataId}\n`,
        },
    }, () => {
        // empty callback
    });
};

let watchers = {
    loading: (contentConfig, expect, action) => {
        request(action, document);
    },

    click: ({ elements }, expect, action, eventName) => {
        document.addEventListener(eventName, event => {
            if (event.uatHandled) {
                return;
            }
            for (let i = 0; i < elements.length; i++) {
                let el;
                let { selector } = elements[i];
                if (selector) {
                    selector = Array.isArray(selector) ? selector : [selector];
                    for (let j = 0; j < selector.length && !el; j++) {
                        el = findElement(event, selector[j]);
                    }
                }
                if (el) {
                    event.uatHandled = true;
                    request({
                        ...action,
                        name: action.name.toUpperCase(),
                        data: prepareNodeData(el, event.target, elements[i]),
                    }, el);
                    break;
                }
            }
        }, true);
    },
};

const actions = [
    {
        name: 'VIEW',
        expects: [{
            loading: {},
        }],
    },
    {
        name: 'CLICK',
        expects: [{
            click: {
                elements: [
                    {
                        selector: '[data-id]',
                        attributes: ['data-id'],
                    },
                ],
            },
        }],
    },
];

const startTracking = () => {
    actions.forEach(action =>
        action.expects.forEach(expect =>
            Object.keys(expect).forEach(event =>
                watchers[event] && watchers[event](expect[event], expect, action, event)
            )
        )
    );
};

export default {
    init: initConfig => {
        config = initConfig;
        startTracking();
    },
};
