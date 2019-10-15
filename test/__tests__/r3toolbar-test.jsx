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
 * CREATE:   Mon Jul 10 2018
 * REVISION:
 *
 */

import React					from 'react';										// eslint-disable-line no-unused-vars
import renderer					from 'react-test-renderer';
import getElementWithContext	from 'react-test-context-provider';					// for context provider
import { ThemeProvider }		from '@material-ui/styles';							// for custom theme
import CssBaseline				from '@material-ui/core/CssBaseline';				// for reset.css

import r3Theme					from '../../src/components/r3theme';				// custom theme
import R3Toolbar				from '../../src/components//r3toolbar';
import R3Provider				from '../../src/util/r3provider';

import mock_fetch				from '../__mocks__/fetchMock';						// eslint-disable-line no-unused-vars
import { createNodeMock }		from '../__mocks__/materialUiMock';					// for material-ui

//
// Mock functions
//
// [NOTE]
// If you need to customize return value, you can call methods
// for return value by each mock function.
// see: https://jestjs.io/docs/ja/mock-functions
//
// ex)	mockfunc
//			.mockReturnValueOnce(10)
//			.mockReturnValueOnce('x')
//			.mockReturnValue(true);
//
const ArrawUpward			= jest.fn();								// eslint-disable-line no-undef
const CreatePath			= jest.fn();								// eslint-disable-line no-undef
const CheckPath				= jest.fn();								// eslint-disable-line no-undef
const DeletePath			= jest.fn();								// eslint-disable-line no-undef
const CreateService			= jest.fn();								// eslint-disable-line no-undef
const CreateServiceTenant	= jest.fn();								// eslint-disable-line no-undef
const CheckServiceName		= jest.fn();								// eslint-disable-line no-undef
const DeleteService			= jest.fn();								// eslint-disable-line no-undef
const CheckUpdating			= jest.fn();								// eslint-disable-line no-undef

//
// Dummy datas
//
const toolbardata = {
	tenant:				{name: '10000', display: 'GROUP0:TENANT0'},
	service:			'dummyservice',
	serviceOwner:		true,
	hasServiceTenant:	false,
	type:				'service',
	name:				'dummyresource',
	fullpath:			'yrn:yahoo:dummyservice::dummytenant:resource:dummyresource',
	currentpath:		'dummyresource',
	hasParent:			true,
	canCreatePath:		false,
	canCreateService:	false
};

const r3provider = new R3Provider(null);

const userdata = {
	userDataScript:		r3provider.getR3Context().getUserData(),
	roleToken:			'R=RoleToken_ForTestByJEST'
};

//
// Main test
//
describe('R3ToolBar', () => {											// eslint-disable-line no-undef
	it('test snapshot for R3ToolBar', () => {							// eslint-disable-line no-undef
		/* eslint-disable indent */
		const element		= getElementWithContext({
									r3Context:	r3provider.getR3Context()
								},
								<ThemeProvider theme={ r3Theme } >
									<CssBaseline />
									<R3Toolbar
										toolbarData={ toolbardata }
										r3provider={ r3provider }
										userData={ userdata }
										onArrawUpward={ ArrawUpward }
										onCreatePath={ CreatePath }
										onCheckPath={ CheckPath }
										onDeletePath={ DeletePath }
										onCreateService={ CreateService }
										onCreateServiceTenant={ CreateServiceTenant }
										onCheckServiceName={ CheckServiceName }
										onDeleteService={ DeleteService }
										onCheckUpdating={ CheckUpdating }
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
