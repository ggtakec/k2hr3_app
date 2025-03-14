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
 * CREATE:   Tue Aug 15 2017
 * REVISION:
 *
 */

'use strict';

var	express		= require('express');
var	router		= express.Router();

var	libTokens	= require('./lib/libr3tokens').r3UserToken;
var	appConfig	= require('./lib/libr3appconfig').r3AppConfig;

//
// Mountpath				: '/' or '/index.html'
//
// GET '/'					: get main page
//
router.get('/', function(req, res, next)
{
	var	_req	= req;												// eslint-disable-line no-unused-vars
	var	_res	= res;
	var	_next	= next;												// eslint-disable-line no-unused-vars

	var	_appConf= new appConfig();

	//
	// Get unscoped token & user name
	//
	var	tokensObj	= new libTokens(req);
	tokensObj.getUnscopedUserToken(function(error, token)
	{
		var	errormsg	= '';

		if(null !== error){
			// [NOTE]
			// Only set error message when error.message starts with 'ERROR RESPONSE'.
			//
			errormsg = (undefined !== error.message && null !== error.message && 'string' == typeof error.message && -1 !== error.message.indexOf('K2HR3 API SERVER ERROR')) ? error.message : '';
			console.error(errormsg);

			// [NOTE]
			// Do not respond error here, this case is almost not sign in(or credential mode).
			//
			//error.status(400);										// 400: Bad Request
			//_next(error);
			//return;
		}
		var	dateobj			= new Date();
		var	copyyear		= dateobj.getFullYear();
		var	username		= tokensObj.getUserName();
		var	apischeme		= _appConf.getApiScheme();
		var	apihost			= _appConf.getApiHost();
		var	apiport			= _appConf.getApiPort();
		var	appmenu			= _appConf.getAppMenu();					// this is object(array)
		var	userdata		= _appConf.getUserData();					// this is string for User Date Script
		var	secretyaml		= _appConf.getSecretYaml();					// this is string for Secret Yaml
		var	sidecaryaml		= _appConf.getSidecarYaml();				// this is string for Sidecar Yaml
		var	crcobj			= _appConf.getCRCObject();					// Custom Registration Codes(CRC) object
		var	signintype		= tokensObj.getSignInType();
		var	signinurl		= tokensObj.getSignInUrl();
		var	signouturl		= tokensObj.getSignOutUrl();
		var	configname		= tokensObj.getConfigName();				// If using ExtRouter(ex. OIDC) and has a token, the config name that created the token is set.
		var	uselocaltenant	= _appConf.useLocalTenant();
		var	lang			= _appConf.getLang();
		var	dbgheader		= '';
		var	dbgvalue		= '';
		var	dbgresheader	= '';
		if('development' === req.app.get('env')){
			dbgheader		= 'x-k2hr3-debug';
			dbgvalue		= 'debug';
			dbgresheader	= 'x-k2hr3-error';
		}

		_res.render(
			'index',
			{
				title:			'K2HR3',
				apischeme:		apischeme,
				apihost:		apihost,
				apiport:		apiport,
				appmenu:		escape(JSON.stringify(appmenu)),
				userdata:		escape(JSON.stringify(userdata)),
				secretyaml:		escape(JSON.stringify(secretyaml)),
				sidecaryaml:	escape(JSON.stringify(sidecaryaml)),
				crcobj:			escape(JSON.stringify(crcobj)),
				username:		username,
				unscopedtoken:	token,
				signintype:		signintype,
				signinurl:		escape(JSON.stringify(signinurl)),
				signouturl:		escape(JSON.stringify(signouturl)),
				configname:		escape(JSON.stringify(configname)),
				uselocaltenant:	uselocaltenant,
				lang:			lang,
				dbgheader:		dbgheader,
				dbgvalue:		dbgvalue,
				dbgresheader:	dbgresheader,
				errormsg:		errormsg,
				copyyear:		copyyear
			}
		);
	});
});

module.exports = router;

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * End:
 * vim600: noexpandtab sw=4 ts=4 fdm=marker
 * vim<600: noexpandtab sw=4 ts=4
 */
