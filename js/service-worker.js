'use strict';

/**
 * Returns manifest version.
 * 
 * @returns Manifest version.
 */
function getManifestVersion () {
	return chrome.runtime.getManifest().version;
}

/**
 * Sets default local storage.
 */
function setDefaultLocalStorage () {
	chrome.storage.local.set({
		version: getManifestVersion(),
		settings: {
			delay: 45,
			title: 'Пора отдохнуть!',
			message: 'Да, дела не ждут, но дать время глазам на отдых - крайне важно',
		},
	});
}
/**
 * Receives local storage data and passes it to the callback function.
 * 
 * @param {callable} callBack Callback function.
 */
function getLocalStorage ( callBack = () => {} ) {
	chrome.storage.local.get( null, storage => {
		callBack( storage );
	});
}
/**
 * Clears local storage.
 */
function clearLocalStorage () {
	chrome.storage.local.clear();
}

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
 * Returns plugin version.
 * 
 * @param {callable} callBack Callback function.
 */
function getVersion ( callBack = () => {} ) {
	chrome.storage.local.get( 'version', version => {
		callBack( version.version ?? null );
	});
}

/** On message */
chrome.runtime.onMessage.addListener( message => {
	const messageActions = {
	
	};

	messageActions[ message.action ]( message.args );
});

/** On alarm */
chrome.alarms.onAlarm.addListener( alram => {
	getSettings( settings => {
		chrome.notifications.create( 'eyes-rest-timer-main', {
			type: 'basic',
			iconUrl: '../icons/icon-128-white.png',
			title: settings.title,
			message: settings.message,
		});

		setTimeout( () => {
			chrome.notifications.clear( 'eyes-rest-timer-main' );
		}, 5000 );
	});
});

/** Setup */
getVersion( version => {
	if ( !version || version !== getManifestVersion() ) {
		setDefaultLocalStorage();
	}
});
getLocalStorage( storage => console.log( storage ) );