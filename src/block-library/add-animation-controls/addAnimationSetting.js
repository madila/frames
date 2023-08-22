/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

import { addFilter } from '@wordpress/hooks';
import { enableOn } from "./enableOn";
import { createHigherOrderComponent } from '@wordpress/compose';
import {
    InspectorControls,
} from '@wordpress/block-editor';
import {
    Fragment
} from '@wordpress/element';

import { SelectControl } from '@wordpress/components';

const withAnimationSettings = createHigherOrderComponent( ( BlockEdit ) => {
    return ( props ) => {

        // If current block is not allowed
        if ( ! enableOn.includes( props.name ) ) {
            return (
                <BlockEdit { ...props } />
            );
        }

        const { attributes, setAttributes } = props;
        const { animation } = attributes;

        return (
            <Fragment>
                <BlockEdit { ...props } />
                <InspectorControls group="position">
                    <SelectControl
                        __nextHasNoMarginBottom
                        label={ __( 'Animation' ) }
                        options={ [
                            { label: __( 'None' ), value: '' },
                            { label: __( 'Fade In' ), value: 'fade-in' },
                            { label: __( 'Slide in upwards' ), value: 'slide-up' },
                            { label: __( 'Slide in downwards' ), value: 'slide-down' },
                            { label: __( 'Scale up' ), value: 'scale-up' },
                        ] }
                        value={ animation }
                        onChange={ ( value ) =>
                            setAttributes( { animation: value } ) }
                    />
                </InspectorControls>
            </Fragment>
        );
    };
}, 'withAnimationSettings' );

addFilter(
    'editor.BlockEdit',
    'frames/with-animation-controls',
    withAnimationSettings
);
