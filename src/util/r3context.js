/*
 *
 * K2HR3 Web Application
 *
 * Copyright 2017 Yahoo Japan Corporation.
 *
 * K2HR3 is K2hdkc based Resource and Roles and policy Rules, gathers
 * common management information for the cloud.
 * K2HR3 can dynamically manage information as "who", "what", "operate".
 * These are stored as roles, resources, policies in K2hdkc, and the
 * client system can dynamically read and modify these information.
 *
 * For the full copyright and license information, please view
 * the license file that was distributed with this source code.
 *
 * AUTHOR:   Takeshi Nakatani
 * CREATE:   Thu Sep 7 2017
 * REVISION:
 *
 */

import { kwApiHostForUD, kwIncludePathForUD, kwRoleTokenForSecret, kwRawRoleToken, kwRoleTokenForRoleYrn, signinUnknownType, signinUnscopedToken, signinCredential }	from '../util/r3types';
import { r3ConvertFromJSON, r3UnescapeHTML, r3CompareCaseString, r3IsEmptyString, r3IsEmptyEntity, r3IsSafeTypedEntity, r3IsEmptyEntityObject, r3DeepClone }			from '../util/r3util';

//
// Load Global object for K2HR3 Context
//
const r3GlobalObject = (function()
{
	//
	// K2HR3 global variables from k2hr3global which is the only global variable.
	//
	let	r3globaltmp	= k2hr3global;										// eslint-disable-line no-undef

	// global app menu
	let	_appmenu = null;
	if(!r3IsEmptyEntity(r3globaltmp.r3appmenu)){
		let	_decodemenu	= unescape(r3globaltmp.r3appmenu);				// decode
		let	_objmenu	= r3ConvertFromJSON(_decodemenu);				// parse
		if(r3IsSafeTypedEntity(_objmenu, 'array') && 0 < _objmenu.length){
			_appmenu = _objmenu;
		}else{
			console.info('There is no application global menu.');
		}
	}else{
		console.info('There is no application global menu.');
	}

	// user script
	let	_userdata = null;
	if(!r3IsEmptyEntity(r3globaltmp.r3userdata)){
		let	_decodeuserdata	= unescape(r3globaltmp.r3userdata);			// decode
		let	_templuserdata	= r3ConvertFromJSON(_decodeuserdata);		// parse
		if(r3IsSafeTypedEntity(_templuserdata, 'string')){
			_userdata = _templuserdata;
		}else{
			console.info('There is no user script template.');
		}
	}else{
		console.info('There is no user script template.');
	}

	// secret yaml
	let	_secretyaml = null;
	if(!r3IsEmptyEntity(r3globaltmp.r3secretyaml)){
		let	_decodesecretyaml	= unescape(r3globaltmp.r3secretyaml);	// decode
		let	_templsecretyaml	= r3ConvertFromJSON(_decodesecretyaml);	// parse
		if(r3IsSafeTypedEntity(_templsecretyaml, 'string')){
			_secretyaml = _templsecretyaml;
		}else{
			console.info('There is no secret yaml template.');
		}
	}else{
		console.info('There is no secret yaml template.');
	}

	// sidecar yaml
	let	_sidecaryaml = null;
	if(!r3IsEmptyEntity(r3globaltmp.r3sidecaryaml)){
		let	_decodesidecaryaml	= unescape(r3globaltmp.r3sidecaryaml);	// decode
		let	_templsidecaryaml	= r3ConvertFromJSON(_decodesidecaryaml);// parse
		if(r3IsSafeTypedEntity(_templsidecaryaml, 'string')){
			_sidecaryaml = _templsidecaryaml;
		}else{
			console.info('There is no sidecar yaml template.');
		}
	}else{
		console.info('There is no sidecar yaml template.');
	}

	// custom registration codes
	let	_crcobj = {};
	if(!r3IsEmptyEntity(r3globaltmp.r3crcobj)){
		let	_decodecrcobj	= unescape(r3globaltmp.r3crcobj);			// decode
		let	_objcrcobj		= r3ConvertFromJSON(_decodecrcobj);			// parse

		if(r3IsSafeTypedEntity(_objcrcobj, 'object')){
			Object.keys(_objcrcobj).forEach(function(key){
				let	_tmporgobj	= _objcrcobj[key];
				let	_tmpobj		= {};

				if(r3IsSafeTypedEntity(_tmporgobj, 'object')){
					Object.keys(_tmporgobj).forEach(function(subkey){
						if(r3IsSafeTypedEntity(_tmporgobj[subkey], 'string')){
							_tmpobj[subkey] = _tmporgobj[subkey];
						}else{
							console.warn('object(' + subkey + ') in crcobj(' + key + ') is not string, skip it.');
						}
					});
				}else{
					console.warn('crcobj(' + key + ') entity is not object, skip it.');
				}
				if(0 < Object.keys(_tmpobj).length){
					_crcobj[key] = _tmpobj;
				}else{
					console.warn('crcobj(' + key + ') entity is empty, skip it.');
				}
			});
		}else{
			console.info('There is no crcobj.');
		}
	}else{
		console.info('There is no crcobj.');
	}

	// signinurl
	let	_signinurl = null;
	if(!r3IsEmptyEntity(r3globaltmp.signinurl)){
		let	_signinurljson	= unescape(r3globaltmp.signinurl);		// decode
		let	_signinurlobj	= r3ConvertFromJSON(_signinurljson);	// parse
		if(!r3IsEmptyEntity(_signinurlobj)){
			_signinurl = r3DeepClone(_signinurlobj);
		}else{
			console.info('signinurl object is not safe object.');
		}
	}else{
		console.info('There is no signinurl object.');
	}

	// signouturl
	let	_signouturl = null;
	if(!r3IsEmptyEntity(r3globaltmp.signouturl)){
		let	_signouturljson	= unescape(r3globaltmp.signouturl);		// decode
		let	_signouturlobj	= r3ConvertFromJSON(_signouturljson);	// parse
		if(!r3IsEmptyEntity(_signouturlobj)){
			_signouturl = r3DeepClone(_signouturlobj);
		}else{
			console.info('signouturl object is not safe object.');
		}
	}else{
		console.info('There is no signouturl object.');
	}

	// configname
	let	_configname = null;
	if(!r3IsEmptyEntity(r3globaltmp.configname)){
		let	_confignamejson	= unescape(r3globaltmp.configname);		// decode
		let	_confignamestr	= r3ConvertFromJSON(_confignamejson);	// parse
		if(!r3IsEmptyString(_confignamestr)){
			_configname = _confignamestr;
		}else{
			console.info('configname is not safe string.');
		}
	}else{
		console.info('There is no configname string.');
	}

	// default object values
	let	r3globalobj	= {
		apischeme:		(r3IsEmptyString(r3globaltmp.r3apischeme)	? '' : r3globaltmp.r3apischeme),
		apihost:		(r3IsEmptyString(r3globaltmp.r3apihost)		? '' : r3globaltmp.r3apihost),
		apiport:		((r3IsEmptyEntity(r3globaltmp.r3apiport) || isNaN(r3globaltmp.r3apiport)) ? 0 : r3globaltmp.r3apiport),
		appmenu:		_appmenu,
		userdata:		_userdata,
		secretyaml:		_secretyaml,
		sidecaryaml:	_sidecaryaml,
		crcobj:			_crcobj,
		login:			false,
		username:		'',
		unscopedtoken:	'',
		signintype:		(r3CompareCaseString(r3globaltmp.signintype, signinUnscopedToken) ? signinUnscopedToken : r3CompareCaseString(r3globaltmp.signintype, signinCredential) ? signinCredential : signinUnknownType),
		signinurl:		_signinurl,
		signouturl:		_signouturl,
		configname:		_configname,
		uselocaltenant:	(r3IsEmptyEntity(r3globaltmp.uselocaltenant) ? true : r3globaltmp.uselocaltenant),
		lang:			(r3IsEmptyString(r3globaltmp.lang)			? 'en'	: r3globaltmp.lang),
		dbgheader:		(r3IsEmptyString(r3globaltmp.dbgheader)		? ''	: r3globaltmp.dbgheader),
		dbgvalue:		(r3IsEmptyString(r3globaltmp.dbgvalue)		? ''	: r3globaltmp.dbgvalue),
		dbgresheader:	(r3IsEmptyString(r3globaltmp.dbgresheader)	? ''	: r3globaltmp.dbgresheader),
		errormsg:		(r3IsEmptyString(r3globaltmp.errormsg)		? null	: r3globaltmp.errormsg)
	};

	if(	!r3IsEmptyEntity(r3globaltmp)				&&
		!r3IsEmptyString(r3globaltmp.username)		&&
		!r3IsEmptyString(r3globaltmp.unscopedtoken)	)
	{
		r3globalobj.login			= true;
		r3globalobj.username		= r3globaltmp.username;
		r3globalobj.unscopedtoken	= r3globaltmp.unscopedtoken;
	}
	return r3globalobj;
}());

//
// K2HR3 Context Class
//
export default class R3Context
{
	// [NOTE]
	// If signin parameter is undefined(null), it is just after loading(initializing) application.
	// When user is signin/out, this parameter is not undefined(null).
	//
	constructor(signin, username, unscopedtoken)
	{
		this.apischeme			= r3GlobalObject.apischeme;		// k2hr3 api scheme
		this.apihost			= r3GlobalObject.apihost;		// k2hr3 api hostname
		this.apiport			= r3GlobalObject.apiport;		// k2hr3 api port
		this.appmenu			= r3GlobalObject.appmenu;		// k2hr3 app menu array
		this.userdata			= r3GlobalObject.userdata;		// k2hr3 user data script template
		this.secretyaml			= r3GlobalObject.secretyaml;	// k2hr3 secret yaml template
		this.sidecaryaml		= r3GlobalObject.sidecaryaml;	// k2hr3 sidecar yaml template
		this.crcobj				= r3GlobalObject.crcobj;		// k2hr3 Custom Registration Code(CRC) object
		this.signintype			= r3GlobalObject.signintype;	// SignIn Type
		this.signinurl			= r3GlobalObject.signinurl;		// SignIn URL
		this.signouturl			= r3GlobalObject.signouturl;	// SignOut URL
		this.configname			= r3GlobalObject.configname;	// Config Name(If using ExtRouter(ex. OIDC) and has a token, the config name that created the token is set.)
		this.uselocaltenant		= r3GlobalObject.uselocaltenant;// Use Local Tenant
		this.lang				= r3GlobalObject.lang;			// Text resource language
		this.dbgHeaderName		= r3GlobalObject.dbgheader;		// Debug header name(= 'x-k2hr3-debug')
		this.dbgHeaderValue		= r3GlobalObject.dbgvalue;		// Debug header value
		this.dbgResHeaderName	= r3GlobalObject.dbgresheader;	// Debug response header name(= 'x-k2hr3-error')
		this.errormsg			= r3GlobalObject.errormsg;		// Error message

		// User name and Unscoped User Token
		if(	r3IsSafeTypedEntity(signin, 'boolean')	&&
			!r3IsEmptyString(username)				&&
			!r3IsEmptyString(unscopedtoken)			)
		{
			this.login					= true;							// Signed in
			this.user					= username;						// Using parameter
			this.unscopedUserToken		= unscopedtoken;				// 
		}else{
			if(r3IsSafeTypedEntity(signin, 'boolean')){
				this.login				= false;						// Signed out
				this.user				= '';							// 
				this.unscopedUserToken	= '';							// 
			}else{
				this.login				= r3GlobalObject.login;			// login / logout
				this.user				= r3GlobalObject.username;		// Using configuration
				this.unscopedUserToken	= r3GlobalObject.unscopedtoken;	// 
			}
		}
	}

	getApiScheme()
	{
		return this.apischeme;
	}

	getSafeApiScheme()
	{
		return (r3IsEmptyString(this.apischeme) ? 'http' : this.apischeme);
	}

	getApiHost()
	{
		return this.apihost;
	}

	getSafeApiHost()
	{
		return (r3IsEmptyString(this.apihost) ? 'localhost' : this.apihost);
	}

	getApiPort()
	{
		return this.apiport;
	}

	getSafeApiPort()
	{
		return ((r3IsEmptyEntity(this.apiport) || isNaN(this.apiport)) ? 80 : this.apiport);
	}

	getAppMenu()
	{
		return this.appmenu;
	}

	getSafeAppMenu()
	{
		return (r3IsEmptyEntity(this.appmenu) ? null : this.appmenu);
	}

	getUserData()
	{
		return this.userdata;
	}

	getSecretYaml()
	{
		return this.secretyaml;
	}

	getSidecarYaml()
	{
		return this.sidecaryaml;
	}

	getCRCObject()
	{
		return this.crcobj;
	}

	getExpandUserData(registerpath)
	{
		if(r3IsEmptyString(this.userdata)){
			console.info('There is no user script template.');
			return '';
		}
		if(r3IsEmptyString(registerpath)){
			console.error('Register path is empty.');
			return '';
		}

		// replace keyword in template
		let	expanded= this.userdata.replace(kwIncludePathForUD, registerpath);
		expanded	= expanded.replace(kwApiHostForUD, this.getApiUrlBase());

		return expanded;
	}

	getExpandSecretYaml(roleToken)
	{
		if(r3IsEmptyString(this.secretyaml)){
			console.info('There is no secret yaml template.');
			return '';
		}
		if(r3IsEmptyString(roleToken)){
			console.error('role token is empty.');
			return '';
		}

		let	roleToken64;
		try{
			// encode base64
			var	buff64	= Buffer.from(roleToken, 'ascii');
			roleToken64	= buff64.toString('base64');
			if(r3IsEmptyString(roleToken64)){
				console.error('failed to encoding by base64.');
				return '';
			}
		}catch(exception){									// eslint-disable-line no-unused-vars
			console.error('failed to encoding by base64.');
			return '';
		}

		// replace keyword in template
		let	expanded = this.secretyaml.replace(kwRoleTokenForSecret, roleToken64);

		return expanded;
	}

	getExpandSidecarYaml(roleyrn)
	{
		if(r3IsEmptyString(this.sidecaryaml)){
			console.info('There is no sidecar yaml template.');
			return '';
		}
		if(r3IsEmptyString(roleyrn)){
			console.error('role full yrn path is empty.');
			return '';
		}

		// replace keyword in template
		let	expanded = this.sidecaryaml.replace(kwRoleTokenForRoleYrn, roleyrn);

		return expanded;
	}

	getExpandCRCObject(roleToken, roleyrn, registerpath)
	{
		let	expandedall = {};
		if(!r3IsSafeTypedEntity(this.crcobj, 'object') || r3IsSafeTypedEntity(this.crcobj, 'array')){
			console.info('There is no safe crcobj');
			return expandedall;
		}
		let	apiHost		= this.getApiUrlBase();
		let	_localcrc	= this.crcobj;

		Object.keys(_localcrc).forEach(function(key){
			let	_subobj = _localcrc[key];

			if(r3IsSafeTypedEntity(_subobj, 'object') && !r3IsSafeTypedEntity(_subobj, 'array')){
				let	_expanded_subobj = {};

				Object.keys(_subobj).forEach(function(subkey){
					if(!r3IsEmptyString(_subobj[subkey])){
						// API host
						let	expanded = _subobj[subkey].replace(kwApiHostForUD, apiHost);

						// Role token
						if(!r3IsEmptyString(roleToken)){
							expanded = expanded.replace(kwRawRoleToken, roleToken);

							try{
								// encode base64
								let	buff64		= Buffer.from(roleToken, 'ascii');
								let	roleToken64	= buff64.toString('base64');
								if(!r3IsEmptyString(roleToken64)){
									expanded = expanded.replace(kwRoleTokenForSecret, roleToken64);
								}else{
									console.error('failed to encoding by base64.');
								}
							}catch(exception){									// eslint-disable-line no-unused-vars
								console.error('failed to encoding by base64.');
							}
						}

						// Role YRN path
						if(!r3IsEmptyString(roleyrn)){
							expanded = expanded.replace(kwRoleTokenForRoleYrn, roleyrn);
						}

						// RegisterPath
						if(!r3IsEmptyString(registerpath)){
							expanded = expanded.replace(kwIncludePathForUD, registerpath);
						}

						// set
						_expanded_subobj[subkey] = expanded;

					}else{
						console.info('sub object(' + key + ') key(' + subkey + ') in crcobj is not safe string, skip it.');

						// set empty
						_expanded_subobj[subkey] = '';
					}
				});

				if(0 < Object.keys(_expanded_subobj).length){
					expandedall[key] = r3DeepClone(_expanded_subobj);
				}
			}else{
				console.info('sub object(' + key + ') in crcobj is not safe object, skip it.');
				expandedall[key] = {};
			}
		});

		return expandedall;
	}

	getApiUrlBase()
	{
		return (this.getSafeApiScheme() + '://' + this.getSafeApiHost() + ':' + String(this.getSafeApiPort()));
	}

	isLogin()
	{
		return this.login;
	}

	getUserName()
	{
		return this.user;
	}

	getSafeUserName()
	{
		return (r3IsEmptyString(this.user) ? '' : this.user);
	}

	getUnscopedToken()
	{
		return this.unscopedUserToken;
	}

	getSafeUnscopedToken()
	{
		return (r3IsEmptyString(this.unscopedUserToken) ? '' : this.unscopedUserToken);
	}

	getSignInType()
	{
		return this.signintype;
	}

	getSafeSignInUrl(configName)
	{
		if(r3IsEmptyString(configName)){
			//
			// Return all object
			//
			return (r3IsEmptyEntity(this.signinurl) ? {} : r3DeepClone(this.signinurl));

		}else if(!r3IsEmptyEntityObject(this.signinurl, configName)){
			//
			// Return single object
			//
			return this.signinurl[configName];
		}else{
			return null;
		}
	}

	getSafeSignOutUrl(configName)
	{
		if(r3IsEmptyString(configName)){
			//
			// Return all object
			//
			return (r3IsEmptyEntity(this.signouturl) ? {} : r3DeepClone(this.signouturl));

		}else if(!r3IsEmptyEntityObject(this.signouturl, configName)){
			//
			// Return single string
			//
			return this.signouturl[configName];
		}else{
			return null;
		}
	}

	getSafeConfigName()
	{
		return (r3IsEmptyEntity(this.configname) ? '' : r3UnescapeHTML(this.configname));
	}

	getSafeConfigCount(isSignin)
	{
		if(isSignin){
			if(r3IsEmptyEntity(this.signinurl)){
				return 0;
			}else{
				return Object.keys(this.signinurl).length;
			}
		}else{
			if(r3IsEmptyEntity(this.signouturl)){
				return 0;
			}else{
				return Object.keys(this.signouturl).length;
			}
		}
	}

	useLocalTenant()
	{
		return this.uselocaltenant;
	}

	getSafeLang()
	{
		return (r3IsEmptyString(this.lang) ? '' : r3UnescapeHTML(this.lang));
	}

	isDbgHeader()
	{
		if(r3IsEmptyString(this.dbgHeaderName) || r3IsEmptyString(this.dbgHeaderValue)){
			return false;
		}
		return true;
	}

	getDbgHeader(headers)
	{
		if(r3IsEmptyEntity(headers)){
			return false;
		}
		if(!this.isDbgHeader()){
			return true;
		}
		headers[this.getSafeDbgHeaderName()] = this.getSafeDbgHeaderValue();

		return true;
	}

	getDbgHeaderName()
	{
		return this.dbgHeaderName;
	}

	getSafeDbgHeaderName()
	{
		return (this.isDbgHeader() ? this.dbgHeaderName : '');
	}

	getDbgHeaderValue()
	{
		return this.dbgHeaderValue;
	}

	getSafeDbgHeaderValue()
	{
		return (this.isDbgHeader() ? this.dbgHeaderValue : '');
	}

	getDbgResHeaderName()
	{
		return this.dbgResHeaderName;
	}

	getSafeDbgResHeaderName()
	{
		return (this.isDbgHeader() ? this.dbgResHeaderName : '');
	}

	getErrorMsg()
	{
		return this.errormsg;
	}
}

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * End:
 * vim600: noexpandtab sw=4 ts=4 fdm=marker
 * vim<600: noexpandtab sw=4 ts=4
 */
