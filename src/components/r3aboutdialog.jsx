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
 * CREATE:   Mon Sep 4 2017
 * REVISION:
 *
 */

import React						from 'react';
import ReactDOM						from 'react-dom';						// eslint-disable-line no-unused-vars
import PropTypes					from 'prop-types';

import Button						from '@mui/material/Button';
import Dialog						from '@mui/material/Dialog';
import DialogTitle					from '@mui/material/DialogTitle';
import DialogContent				from '@mui/material/DialogContent';
import DialogContentText			from '@mui/material/DialogContentText';
import DialogActions				from '@mui/material/DialogActions';
import Typography					from '@mui/material/Typography';
import CancelIcon					from '@mui/icons-material/Cancel';

import { r3IsEmptyString }			from '../util/r3util';
import { r3AboutDialogStyles }		from './r3styles';

//
// Local variables
//
const k2hr3Title		=	'K2HR3';
const k2hr3LicenseType	=	'MIT';
const k2hr3Content		=	'K2HR3 is K2hdkc based Resource and Roles and policy Rules, gathers common' + 
							'management information for the cloud.' + 
							'K2HR3 can dynamically manage information as "who", "what", "operate".' + 
							'These are stored as roles, resources, policies in K2hdkc, and the client' +
							'system can dynamically read and modify these information.';
const k2hr3License		=	'Copyright(C) 2017 Yahoo Japan Corporation.';

//
// User Data(with role token) Information Class
//
export default class R3AboutDialog extends React.Component
{
	static propTypes = {
		r3provider:		PropTypes.object.isRequired,
		open:			PropTypes.bool.isRequired,
		onClose:		PropTypes.func.isRequired,

		licensePackage:	PropTypes.string,
		licenseType:	PropTypes.string,
		licenseText:	PropTypes.string,
		r3VersionText:	PropTypes.string
	};

	static defaultProps = {
		licensePackage:	null,
		licenseType:	null,
		licenseText:	null,
		r3VersionText:	null
	};

	constructor(props)
	{
		super(props);

		// Binding(do not define handlers as arrow functions for performance)
		this.handleClose	= this.handleClose.bind(this);

		// styles
		this.sxClasses		= r3AboutDialogStyles(props.theme);
	}

	handleClose(event, reason)
	{
		this.props.onClose(event, reason);
	}

	getHtmlLicenseText()
	{
		// Output by <p> tag per line
		//
		let	lines = this.props.licenseText.split('\n');

		return (
			lines.map( (item, pos) => {
				return (
					<Typography key={ pos }>
						{ item }
						<br />
					</Typography>
				);
			})
		);
	}

	getr3VersionText()
	{
		if(r3IsEmptyString(this.props.r3VersionText)){
			return '(unknown)';
		}
		return this.props.r3VersionText;
	}

	getLicenseType()
	{
		return (
			<Typography { ...this.props.theme.r3AboutDialog.licenseType }>
				License: { (r3IsEmptyString(this.props.licensePackage) ? k2hr3LicenseType : this.props.licenseType) }
				<br />
			</Typography>
		);
	}

	getContentText()
	{
		if(r3IsEmptyString(this.props.licensePackage)){
			let	version_str	= 'Version: ' + this.getr3VersionText();
			return (
				<Typography { ...this.props.theme.r3AboutDialog.content }>
					{ k2hr3Content }
					<br />
					<br />
					{ k2hr3License }
					<br />
					<br />
					{ version_str }
				</Typography>
			);
		}else{
			return (
				<Typography { ...this.props.theme.r3AboutDialog.content }>
					{ this.getHtmlLicenseText() }
				</Typography>
			);
		}
	}

	render()
	{
		const { theme, r3provider } = this.props;

		let	licenseType	= this.getLicenseType();
		let	contentText	= this.getContentText();

		return (
			<Dialog
				open={ this.props.open }
				onClose={ (event, reason) => this.handleClose(event, reason) }
				{ ...theme.r3AboutDialog.root }
				sx={ this.sxClasses.root }
			>
				<DialogTitle
					{ ...theme.r3AboutDialog.dialogTitle }
					sx={ this.sxClasses.dialogTitle }
				>
					<Typography
						{ ...theme.r3AboutDialog.title }
						sx={ this.sxClasses.title }
					>
						About { (r3IsEmptyString(this.props.licensePackage) ? k2hr3Title : this.props.licensePackage) }
					</Typography>
				</DialogTitle>
				<DialogContent 
					sx={ this.sxClasses.dialogContent }
				>
					<DialogContentText
						{ ...theme.r3AboutDialog.dialogContentText }
						sx={ this.sxClasses.dialogContentText }
					>
						{ licenseType }
						{ contentText }
					</DialogContentText>
				</DialogContent>
				<DialogActions
					sx={ this.sxClasses.dialogAction }
				>
					<Button
						onClick={ (event) => this.handleClose(event, null) }
						{ ...theme.r3AboutDialog.button }
						sx={ this.sxClasses.button }
					>
						{ r3provider.getR3TextRes().tResButtonClose }
						<CancelIcon
							sx={ this.sxClasses.buttonIcon }
						/>
					</Button>
				</DialogActions>
			</Dialog>
		);
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
