(()=>{"use strict";const e=window.wp.hooks,t=["core/group","core/button","core/cover","core/column","core/heading","core/paragraph","frames/frame"];(0,e.addFilter)("blocks.registerBlockType","frames/animation",((e,n)=>t.includes(n)?Object.assign({},e,{attributes:Object.assign({},e.attributes,{animation:{type:"string"}})}):e));const n=window.React,a=window.wp.i18n,i=window.wp.compose,o=window.wp.blockEditor,r=window.wp.element,l=window.wp.components,s=[{label:(0,a.__)("None"),value:""},{label:(0,a.__)("Fade In"),value:"fade-in"},{label:(0,a.__)("Slide in upwards"),value:"slide-up"},{label:(0,a.__)("Slide in downwards"),value:"slide-down"},{label:(0,a.__)("Slide in eastwards"),value:"slide-left"},{label:(0,a.__)("Slide in westwards"),value:"slide-right"},{label:(0,a.__)("Scale up"),value:"scale-up"}],c=(0,i.createHigherOrderComponent)((e=>i=>{if(!t.includes(i.name))return(0,n.createElement)(e,{...i});const{attributes:c,setAttributes:d}=i,{animation:m}=c;return(0,n.createElement)(r.Fragment,null,(0,n.createElement)(e,{...i}),(0,n.createElement)(o.InspectorControls,{group:"position"},(0,n.createElement)(l.SelectControl,{__nextHasNoMarginBottom:!0,label:(0,a.__)("Animation"),options:s,value:m,onChange:e=>d({animation:e})})))}),"withAnimationSettings");(0,e.addFilter)("editor.BlockEdit","frames/with-animation-controls",c);const d=(0,i.createHigherOrderComponent)((e=>a=>{if(!t.includes(a.name))return(0,n.createElement)(e,{...a});const{attributes:i}=a,{animation:o}=i;return o&&o.length?(0,n.createElement)(e,{...a,animation:o}):(0,n.createElement)(e,{...a})}),"withAnimationProp");(0,e.addFilter)("editor.BlockListBlock","frames/with-animation-prop",d),(0,e.addFilter)("blocks.getSaveContent.extraProps","custom-attributes/save-toolbar-button-attribute",((e,n,a)=>{if(t.includes(n.name)){const{animation:t}=a;t&&t.length&&(e.animation=t)}return e}))})();