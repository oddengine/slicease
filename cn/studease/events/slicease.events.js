(function(slicease) {
    slicease.events = {
		// General Events
		ERROR: 'ERROR',
		
		// API Events
		SLICEASE_READY: 'sliceaseReady',
		SLICEASE_RESIZE: 'sliceaseResize',
		SLICEASE_SETUP_ERROR: 'sliceaseSetupError',
		SLICEASE_RENDER_ERROR: 'sliceaseRenderError',
		
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
		SLICEASE_ITEM_CLICK: 'sliceaseItemClick',
		
		// Timer Events
		SLICEASE_TIMER: 'sliceaseTimer',
		SLICEASE_TIMER_COMPLETE: 'sliceaseTimerComplete'
	};
})(slicease);
