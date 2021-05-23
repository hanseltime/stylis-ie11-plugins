// determine the state of the client before polyfilling
import { proxyDefined } from './clientState';

/**
 * Object.entriesFrom() polyfill
 * @author Chris Ferdinandi
 * @license MIT
 */
 if (!Object.fromEntries) {
	Object.fromEntries = function (entries){
		if (!entries || !entries[Symbol.iterator]) { throw new Error('Object.fromEntries() requires a single iterable argument'); }
		let obj = {};
		for (let [key, value] of entries) {
			obj[key] = value;
		}
		return obj;
	};
}

// Note other polyfills that make their own fills based on proxy checks - i.e. pulling enableEs5 for immer and calling it after the polyfill

// We have to include this for now, since framer-motion requires the Promise call immediately
import 'proxy-polyfill';

if (proxyDefined) {
    // Apply post-proxy polyfill logic that was the result of pre-proxy evaluation (i.e. immer)
}