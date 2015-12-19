(function(slicease) {
    slicease.events = {
        // General Events
        ERROR: 'ERROR',
		
        // API Events
        SLICEASE_READY: 'sliceaseReady',
        SLICEASE_RESIZE: 'sliceaseResize',
        SLICEASE_ERROR: 'sliceaseError',
        SLICEASE_SETUP_ERROR: 'sliceaseSetupError',
		
		// Render Mode Event
		SLICEASE_RENDER_MODE: 'sliceaseRenderMode',
		renderMode: {
			CANVAS: 'canvas',
			SPARE: 'spare'
		},
		
        // State Events
        SLICEASE_STATE: 'sliceaseState',
        state: {
            IDLE: 'IDLE',
            PLAYING: 'PLAYING'
        },
        
        // Item Events
        SLICEASE_ITEM: 'sliceaseItem',
        SLICEASE_ITEM_CLICK: 'sliceaseItemClick',
        
        // Mouse Events
        SLICEASE_MOUSE_OVER: 'sliceaseMouseOver',
        SLICEASE_MOUSE_OUT: 'sliceaseMouseOut'
    };
})(slicease);
