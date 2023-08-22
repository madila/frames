import { addFilter } from '@wordpress/hooks';
import { enableOn } from "./enableOn";
import { createHigherOrderComponent } from '@wordpress/compose';

const withAnimationProp = createHigherOrderComponent( ( BlockListBlock ) => {
    return ( props ) => {

        // If current block is not allowed
        if ( ! enableOn.includes( props.name ) ) {
            return (
                <BlockListBlock { ...props } />
            );
        }

        const { attributes } = props;
        const { animation } = attributes;

        if ( animation && animation.length ) {
            return <BlockListBlock { ...props } animation={ animation } />
        } else {
            return <BlockListBlock { ...props } />
        }
    };
}, 'withAnimationProp' );

addFilter(
    'editor.BlockListBlock',
    'frames/with-animation-prop',
    withAnimationProp
);
