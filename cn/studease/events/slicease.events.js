(function(slicease) {
	slicease.events = {
		// General Events
		ERROR: 'error',
		RESIZE: 'resize',
		
		// API Events
		SLICEASE_READY: 'sliceaseReady',
		SLICEASE_SETUP_ERROR: 'sliceaseSetupError',
		SLICEASE_RENDER_ERROR: 'sliceaseRenderError',
		
		SLICEASE_STATE: 'sliceaseState',
		
		SLICEASE_RENDER_UPDATE_START: 'sliceaseRenderUpdateStart',
		SLICEASE_RENDER_UPDATE_END: 'sliceaseRenderUpdateEnd',
		
		// View Events
		SLICEASE_VIEW_PLAY: 'sliceaseViewPlay',
		SLICEASE_VIEW_STOP: 'sliceaseViewStop',
		SLICEASE_VIEW_PREV: 'sliceaseViewPrev',
		SLICEASE_VIEW_NEXT: 'sliceaseViewNext',
		
		// Loader Events
		SLICEASE_PROGRESS: 'sliceaseProgress',
		SLICEASE_COMPLETE: 'sliceaseComplete',
		
		// Timer Events
		SLICEASE_TIMER: 'sliceaseTimer',
		SLICEASE_TIMER_COMPLETE: 'sliceaseTimerComplete'
	};
})(slicease);
