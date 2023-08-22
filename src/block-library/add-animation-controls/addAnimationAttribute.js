
import { addFilter } from '@wordpress/hooks';
import { setAnimationAttribute } from "./enableOn";


addFilter(
    'blocks.registerBlockType',
    'frames/animation',
    setAnimationAttribute
);
