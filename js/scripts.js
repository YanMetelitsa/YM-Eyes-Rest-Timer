'use strict';

/** Main elements */
const mainElements = {
	mainSwitcher: document.querySelector( '.main-header .switcher' ),

	delaySetting: document.querySelector( '#setting-delay' ),
	titleSetting: document.querySelector( '#setting-title' ),
	messageSetting: document.querySelector( '#setting-message' ),

	alarmInfoEnable: document.querySelector( '.alarm-info__enable' ),
	alarmInfoDisable: document.querySelector( '.alarm-info__disable' ),
};

/** Inits elements */
const Init = {
	switchers: () => {
		/** Get switchers */
		const switchers = document.querySelectorAll( '.switcher' );

		/** Loop */
		switchers.forEach( switcher => {
			switcher.addEventListener( 'click', e => {
				switcher.toggleAttribute( 'active' );
				
				/** Look for action */
				let actionName = null;

				if ( switcher.hasAttribute( 'active' ) ) {
					actionName = switcher.getAttribute( 'on-action' ) ?? null;
				} else {
					actionName = switcher.getAttribute( 'off-action' ) ?? null;
				}

				/** Do action */
				if ( actionName ) window[ actionName ]();
			});

			switcher.classList.add( 'inited' );
		});
	},

	mainSwitcher: () => {
		getAlarm( alarm => {
			if ( alarm ) mainElements.mainSwitcher.setAttribute( 'active', '' );
		});
	},

	settings: () => {
		getSettings( settings => {
			mainElements.delaySetting.value = settings.delay;
			mainElements.titleSetting.value = settings.title;
			mainElements.messageSetting.innerText = settings.message;
		});
	},

	alarmInfo: () => {
		getAlarm( alarm => {
			if ( alarm ) {
				mainElements.alarmInfoEnable.classList.remove( 'hidden' );
				mainElements.alarmInfoDisable.classList.add( 'hidden' );

				chrome.alarms.get( 'eye-timer-alarm', alarm => {
					const notificationTime = new Date( alarm.scheduledTime );
					const textTime = `${( '00' + notificationTime.getHours() ).slice( -2 )}:${( '00' + notificationTime.getMinutes() ).slice( -2 )}`;
		
					mainElements.alarmInfoEnable.querySelector( 'span' ).innerHTML = textTime;
				});
			} else {
				mainElements.alarmInfoDisable.classList.remove( 'hidden' );
				mainElements.alarmInfoEnable.classList.add( 'hidden' );
			}
		});
	},
};

/**
 * Receives settings data and passes it to the callback function.
 * 
 * @param {callable} callBack Callback function.
 */
function getSettings ( callBack = () => {} ) {
	chrome.storage.local.get( 'settings', settings => {
		callBack( settings.settings ?? null );
	});
}

/**
 * Creates new alarm.
 */
function createAlarm () {
	chrome.alarms.create( 'eye-timer-alarm', {
		periodInMinutes: parseInt( mainElements.delaySetting.value ),
	}, () => {
		Init.alarmInfo();
	});
}
/**
 * Receives alarm data and passes it to the callback function.
 * 
 * @param {callable} callBack Callback function.
 */
function getAlarm ( callBack = () => {} ) {
	chrome.alarms.get( 'eye-timer-alarm', alarm => callBack( alarm ) );
}
/**
 * Removes alaram.
 */
function removeAlarm () {
	chrome.alarms.clear( 'eye-timer-alarm', () => {
		Init.alarmInfo();
	});
}

/** Window load event */
window.addEventListener( 'load', e => {
	Init.switchers();

	Init.settings();

	Init.mainSwitcher();

	Init.alarmInfo();
});