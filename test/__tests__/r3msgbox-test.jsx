/*
 *
 * K2HR3 Web Application
 *
 * Copyright 2017 Yahoo! Japan Corporation.
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
 * CREATE:   Mon Jul 9 2018
 * REVISION:
 *
 */

import React					from 'react';										// eslint-disable-line no-unused-vars
import renderer					from 'react-test-renderer';
import getElementWithContext	from 'react-test-context-provider';					// for context provider
import { ThemeProvider }		from '@material-ui/styles';							// for custom theme
import CssBaseline				from '@material-ui/core/CssBaseline';				// for reset.css

import r3Theme					from '../../src/components/r3theme';				// custom theme
import R3MsgBox					from '../../src/components/r3msgbox';
import R3Message				from '../../src/util/r3message';
import { errorType }			from '../../src/util/r3types';
import R3Provider				from '../../src/util/r3provider';

import mock_fetch				from '../__mocks__/fetchMock';						// eslint-disable-line no-unused-vars
import { createNodeMock }		from '../__mocks__/materialUiMock';					// for material-ui

//
// Dummy data
//
const message = new R3Message('Dummy error message', errorType);

//
// Main test
//
describe('R3MsgBox', () => {											// eslint-disable-line no-undef
	it('test snapshot for R3MsgBox', () => {							// eslint-disable-line no-undef
		/* eslint-disable indent */
		const r3provider	= new R3Provider(null);
		const element		= getElementWithContext({
									r3Context:	r3provider.getR3Context()
								},
								<ThemeProvider theme={ r3Theme } >
									<CssBaseline />
									<R3MsgBox
										message={ message }
									/>
								</ThemeProvider>
							);
		/* eslint-enable indent */

		const component = renderer.create(element, { createNodeMock });
		let tree		= component.toJSON();
		expect(tree).toMatchSnapshot();									// eslint-disable-line no-undef
	});
});

/*
 * VIM modelines
 *
 * vim:set ts=4 fenc=utf-8:
 *
 */
