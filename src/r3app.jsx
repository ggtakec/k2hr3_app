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

import style				from '../public/css/style.css';						// eslint-disable-line no-unused-vars

import React				from 'react';
import { createRoot }		from 'react-dom/client';
import { ThemeProvider }	from '@mui/material/styles';
import { StyledEngineProvider, CssBaseline}	from '@mui/material';				// for jss and reset.css

import r3Theme				from './components/r3theme';						// custom theme
import R3Container			from './components/r3container';

//
// Main Container
//
const root = createRoot(document.getElementById('r3app'));
root.render(
	<React.StrictMode>
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={ r3Theme } >
				<CssBaseline />
				<R3Container
					theme={ r3Theme }
					title='K2HR3'
				/>
			</ThemeProvider>
		</StyledEngineProvider>
	</React.StrictMode>
);

/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * End:
 * vim600: noexpandtab sw=4 ts=4 fdm=marker
 * vim<600: noexpandtab sw=4 ts=4
 */
