import { addFilter } from '@wordpress/hooks';
import { enableOn } from "./enableOn";

const saveAnimationAttribute = ( extraProps, blockType, attributes ) => {
    // Do nothing if it's another block than our defined ones.
    if ( enableOn.includes( blockType.name ) ) {
        const { animation } = attributes;
        if ( animation && animation.length ) {
            extraProps.animation = animation
        }
    }

    return extraProps;

};
addFilter(
    'blocks.getSaveContent.extraProps',
    'custom-attributes/save-toolbar-button-attribute',
    saveAnimationAttribute
);
