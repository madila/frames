import { registerBlockVariation } from '@wordpress/blocks';

registerBlockVariation (
    'core/group', {
        name: 'group-card',
        title: 'Card',
        icon: 'screenoptions',
        scope: [ 'inserter', 'block', 'transform' ],
        isActive: ( blockAttributes, variationAttributes ) => {
            console.log(variationAttributes.className);
            return blockAttributes.type === variationAttributes.type
        },
        attributes: {
            layout: {
                type: 'flex',
                flexWrap: 'nowrap'
            },
            className: 'frames-card',
            template: [
                [ 'core/group', {
                    lock: {
                        remove: true,
                        move: true
                    }
                } ],
                [ 'core/group', {
                    lock: {
                        remove: true,
                        move: true
                    }
                } ]
            ],
            templateLock: true
        },
        innerBlocks: [
            [ 'core/group', {
                lock: {
                    remove: true,
                    move: true
                }
            }, [
                ['core/paragraph', { placeholder: 'Enter the content of the front face' }]
            ] ],
            [ 'core/group', {
                lock: {
                    remove: true,
                    move: true
                }
            }, [
                ['core/paragraph', { placeholder: 'Enter the content of the back face' }]
            ] ]
        ]
    }
);
