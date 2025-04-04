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

import React						from 'react';
import ReactDOM						from 'react-dom';						// eslint-disable-line no-unused-vars
import PropTypes					from 'prop-types';

import IconButton					from '@mui/material/IconButton';
import Avatar						from '@mui/material/Avatar';
import Chip							from '@mui/material/Chip';
import AppBar						from '@mui/material/AppBar';
import Toolbar						from '@mui/material/Toolbar';
import Typography					from '@mui/material/Typography';
import Tooltip						from '@mui/material/Tooltip';
import Box							from '@mui/material/Box';

import DescriptionIcon				from '@mui/icons-material/Description';
import ArrowUpwardIcon				from '@mui/icons-material/ArrowUpwardRounded';
import AddIcon						from '@mui/icons-material/AddRounded';
import DeleteIcon					from '@mui/icons-material/ClearRounded';

import { r3Toolbar }				from './r3styles';
import R3PathInfoDialog				from './r3pathinfodialog';
import R3CreatePathDialog			from './r3createpathdialog';
import R3CreateServiceDialog		from './r3createservicedialog';
import R3CreateServiceTenantDialog	from './r3createservicetenantdialog';
import R3PopupMsgDialog				from './r3popupmsgdialog';
import R3Message					from '../util/r3message';

import { errorType, infoType, resourceType, roleType, policyType, serviceType, serviceResTypeUrl }					from '../util/r3types';
import { r3CompareCaseString, r3IsEmptyStringObject, r3IsEmptyEntityObject, r3IsEmptyString, r3IsSafeTypedEntity }	from '../util/r3util';

//
// Local variables
//
const tooltipValues = {
	pathInfoChip:	'pathInfoChipButton',
	toUpperPath:	'toUpperPathButton',
	createPath:		'createPathButton',
	deletePath:		'deletePathButton'
};

//
// Toolbar Class
//
export default class R3Toolbar extends React.Component
{
	static propTypes = {
		r3provider:				PropTypes.object.isRequired,
		enDock:					PropTypes.bool,
		toolbarData:			PropTypes.object.isRequired,

		onArrawUpward:			PropTypes.func.isRequired,
		onCreatePath:			PropTypes.func.isRequired,
		onCheckPath:			PropTypes.func.isRequired,
		onDeletePath:			PropTypes.func.isRequired,
		onCreateServiceTenant:	PropTypes.func.isRequired,
		onCreateService:		PropTypes.func.isRequired,
		onCheckServiceName:		PropTypes.func.isRequired,
		onDeleteService:		PropTypes.func.isRequired,
		onCheckUpdating:		PropTypes.func
	};

	static defaultProps = {
		enDock:					true,
		onCheckUpdating:		null
	};

	state = {
		pathInfoDialogOpen:				false,
		createPathDialogOpen:			false,
		createServiceDialogOpen:		false,
		createServiceTenantDialogOpen:	false,
		newServiceName:					'',
		newServiceResType:				serviceResTypeUrl,
		newVerify:						'',
		newStaticRes:					[],
		aliasRole:						'',
		r3DeleteServiceMessage:			null,
		newPath:						'',
		r3Message:						null,

		tooltips: {
			toUpperPathTooltip:			false,
			pathInfoChipTooltip:		false,
			createPathTooltip:			false,
			deletePathTooltip:			false
		}
	};

	constructor(props)
	{
		super(props);

		// Binding(do not define handlers as arrow functions for performance)
		this.handlePathInfoDialogOpen				= this.handlePathInfoDialogOpen.bind(this);
		this.handlePathInfoDialogClose				= this.handlePathInfoDialogClose.bind(this);
		this.handleCreatePathDialogOpen				= this.handleCreatePathDialogOpen.bind(this);
		this.handleCreatePathDialogClose			= this.handleCreatePathDialogClose.bind(this);
		this.handleDeletePath						= this.handleDeletePath.bind(this);
		this.handleCreateServiceDialogOpen			= this.handleCreateServiceDialogOpen.bind(this);
		this.handleCreateServiceDialogClose			= this.handleCreateServiceDialogClose.bind(this);
		this.handleCreateServiceTenant				= this.handleCreateServiceTenant.bind(this);
		this.handleCreateServiceTenantDialogClose	= this.handleCreateServiceTenantDialogClose.bind(this);
		this.handleDeleteService					= this.handleDeleteService.bind(this);
		this.handleDeleteServiceDialogClose			= this.handleDeleteServiceDialogClose.bind(this);
		this.handleToUpperPathButton				= this.handleToUpperPathButton.bind(this);
		this.handleMessageDialogClose				= this.handleMessageDialogClose.bind(this);

		// styles
		this.sxClasses								= r3Toolbar(props.theme);
	}

	handlePathInfoDialogOpen(event)											// eslint-disable-line no-unused-vars
	{
		this.setState({
			pathInfoDialogOpen:			true,
			tooltips: {
				pathInfoChipTooltip:	false
			}
		});
	}

	handlePathInfoDialogClose(event, reason)								// eslint-disable-line no-unused-vars
	{
		this.setState({ pathInfoDialogOpen:	false });
	}

	handleCreatePathDialogOpen(event)										// eslint-disable-line no-unused-vars
	{
		if(!this.checkContentUpdating()){
			return;
		}
		this.setState({
			newPath:				'',
			createPathDialogOpen:	true,
			tooltips: {
				createPathTooltip:	false
			}
		});
	}

	handleCreatePathDialogClose(event, reason, isAgree, newPath)
	{
		if(!isAgree){
			this.setState({
				newPath:				'',
				createPathDialogOpen:	false
			});
			return;
		}
		if(r3IsEmptyString(newPath)){
			this.setState({
				newPath:	'',
				r3Message:	new R3Message(this.props.r3provider.getR3TextRes().eNewPath, errorType)
			});
			return;
		}

		// check '/' parser
		if(-1 !== newPath.indexOf('/')){
			this.setState({
				newPath:	newPath,
				r3Message:	new R3Message(this.props.r3provider.getR3TextRes().eNewPathHasParser, errorType)
			});
			return;
		}

		// check path conflict
		let	newAllPath = (r3IsEmptyString(this.props.toolbarData.currentpath) ? '' : (this.props.toolbarData.currentpath + '/')) + newPath.trim();
		if(this.props.onCheckPath(newAllPath)){
			this.setState({
				newPath:	newPath,
				r3Message:	new R3Message(this.props.r3provider.getR3TextRes().eNewPathConflict, errorType)
			});
			return;
		}

		// create path
		this.props.onCreatePath(newPath, newAllPath);

		// close dialog
		this.setState({
			newPath:				'',
			createPathDialogOpen:	false
		});
	}

	handleCreateServiceDialogOpen(event)									// eslint-disable-line no-unused-vars
	{
		if(!this.checkContentUpdating()){
			return;
		}

		// create service confirm dialog
		this.setState({
			newServiceName:				'',
			newServiceResType:			serviceResTypeUrl,
			newVerify:					'',
			newStaticRes:				[],
			createServiceDialogOpen:	true,
			tooltips: {
				createPathTooltip:		false
			}
		});
	}

	handleCreateServiceDialogClose(event, reason, isAgree, newServiceName, newServiceResType, newVerify, newStaticRes)
	{
		if(!isAgree){
			this.setState({
				newServiceName:			'',
				newServiceResType:		serviceResTypeUrl,
				newVerify:				'',
				newStaticRes:			[],
				createServiceDialogOpen:false
			});
			return;
		}
		if(r3IsEmptyString(newServiceName)){
			this.setState({
				newServiceName:			newServiceName,
				newServiceResType:		newServiceResType,
				newVerify:				newVerify,
				newStaticRes:			newStaticRes,
				r3Message:				new R3Message(this.props.r3provider.getR3TextRes().eNewServiceName, errorType)
			});
			return;
		}

		// check service name conflict
		if(this.props.onCheckServiceName(newServiceName)){
			this.setState({
				newServiceName:			newServiceName,
				newServiceResType:		newServiceResType,
				newVerify:				newVerify,
				newStaticRes:			newStaticRes,
				r3Message:				new R3Message(this.props.r3provider.getR3TextRes().eNewServiceNameConflict, errorType)
			});
			return;
		}

		// check type and verify/static resource
		let	serviceData;
		if(serviceResTypeUrl == newServiceResType){
			serviceData = newVerify;
		}else{	// serviceResTypeObject == newServiceResType
			serviceData = JSON.stringify(newStaticRes);
		}

		// check service data
		let	errorVerify = this.props.r3provider.getErrorServiceResourceVerify(serviceData);
		if(null !== errorVerify){
			this.setState({
				newServiceName:			newServiceName,
				newServiceResType:		newServiceResType,
				newVerify:				newVerify,
				newStaticRes:			newStaticRes,
				r3Message:				new R3Message(errorVerify, errorType)
			});
			return;
		}

		// create service name
		this.props.onCreateService(newServiceName, serviceData);

		// close dialog
		this.setState({
			newServiceName:				'',
			newServiceResType:			serviceResTypeUrl,
			newVerify:					'',
			newStaticRes:				[],
			createServiceDialogOpen:	false
		});
	}

	handleCreateServiceTenant(event)										// eslint-disable-line no-unused-vars
	{
		if(!this.checkContentUpdating()){
			return;
		}

		// create service tenant confirm dialog
		this.setState({
			aliasRole:						'',
			createServiceTenantDialogOpen:	true
		});
	}

	handleCreateServiceTenantDialogClose(event, reason, isAgree, aliasRole)
	{
		if(!isAgree){
			this.setState({
				aliasRole:						'',
				createServiceTenantDialogOpen:	false,
				tooltips: {
					createPathTooltip:			false
				}
			});
			return;
		}

		// create service tenant
		this.props.onCreateServiceTenant(aliasRole);

		// close dialog
		this.setState({
			aliasRole:						'',
			createServiceTenantDialogOpen:	false,
			tooltips: {
				createPathTooltip:			false
			}
		});
	}

	handleToUpperPathButton(event)											// eslint-disable-line no-unused-vars
	{
		if(!this.checkContentUpdating()){
			return;
		}

		// undisplay tooltip
		this.setState({
			tooltips: {
				toUpperPathTooltip:			false
			}
		});

		this.props.onArrawUpward();
	}

	handTooltipChange = (event, type, isOpen) =>
	{
		if(tooltipValues.pathInfoChip === type){
			this.setState({
				tooltips: {
					pathInfoChipTooltip:	isOpen
				}
			});
		}else if(tooltipValues.toUpperPath === type){
			this.setState({
				tooltips: {
					toUpperPathTooltip:		isOpen
				}
			});
		}else if(tooltipValues.createPath === type){
			this.setState({
				tooltips: {
					createPathTooltip:		isOpen
				}
			});
		}else if(tooltipValues.deletePath === type){
			this.setState({
				tooltips: {
					deletePathTooltip:		isOpen
				}
			});
		}
	};

	handleDeletePath(event)													// eslint-disable-line no-unused-vars
	{
		if(!this.checkContentUpdating()){
			return;
		}

		// undisplay tooltip
		this.setState({
			tooltips: {
				deletePathTooltip:	false
			}
		});

		this.props.onDeletePath();
	}

	handleDeleteService(event)												// eslint-disable-line no-unused-vars
	{
		if(!this.checkContentUpdating()){
			return;
		}

		let	message;
		if(this.props.toolbarData.serviceOwner && !this.props.toolbarData.hasServiceTenant){
			// Delete SERVICE
			message = new R3Message(this.props.r3provider.getR3TextRes().cDeletingService, infoType);
		}else{
			// Delete SERVICE TENANT
			message = new R3Message(this.props.r3provider.getR3TextRes().cDeletingServiceTenant, infoType);
		}

		// confirm message
		this.setState({
			r3DeleteServiceMessage:	message,
			tooltips: {
				deletePathTooltip:	false
			}
		});
	}

	//
	// Handle Confirm Dialog for Delete Service(Tenant): Close( OK / Cancel )
	//
	handleDeleteServiceDialogClose(event, reason, result)
	{
		if(result){
			// case for 'deleting' to do

			//
			// [NOTE]
			//
			// The service is owner(serviceOwner = false), thus this handler try to remove ServiceTenant.
			// If service is owner(serviceOwner = true) and has children(hasServiceTenant = true), this handler try to remove ServiceTenant.
			// If service is owner(serviceOwner = true) and does not have children(hasServiceTenant = false), this handler try to remove Service.
			//
			this.props.onDeleteService(this.props.toolbarData.serviceOwner, this.props.toolbarData.hasServiceTenant);
		}

		// clear dialog
		this.setState({
			r3DeleteServiceMessage:	null
		});
	}

	handleMessageDialogClose(event, reason, result)							// eslint-disable-line no-unused-vars
	{
		this.setState({
			r3Message:	null
		});
	}

	checkContentUpdating()
	{
		if(null !== this.props.onCheckUpdating && this.props.onCheckUpdating()){
			this.setState({
				r3Message:	new R3Message(this.props.r3provider.getR3TextRes().eNowUpdating, errorType)
			});
			return false;
		}
		return true;
	}

	getArrawUpwardButton()
	{
		const { theme, r3provider } = this.props;

		if(r3IsEmptyString(this.props.toolbarData.service) && r3IsEmptyString(this.props.toolbarData.currentpath)){
			return;
		}

		return (
			<Tooltip
				title={ r3provider.getR3TextRes().tResToUpperPathTT }
				open={ ((r3IsEmptyEntityObject(this.state, 'tooltips') || !r3IsSafeTypedEntity(this.state.tooltips.toUpperPathTooltip, 'boolean')) ? false : this.state.tooltips.toUpperPathTooltip) }
			>
				<IconButton
					onClick={ this.handleToUpperPathButton }
					onMouseEnter={ event => this.handTooltipChange(event, tooltipValues.toUpperPath, true) }
					onMouseLeave={ event => this.handTooltipChange(event, tooltipValues.toUpperPath, false) }
					{ ...theme.r3AppBar.toUpperPathButton }
					size="large"
				>
					<ArrowUpwardIcon />
				</IconButton>
			</Tooltip>
		);
	}

	getCreatePathButton()
	{
		const { theme, r3provider } = this.props;

		let	tooltipText;
		let	handler;
		if(this.props.toolbarData.canCreatePath){
			// Create Path under ROLE/POLICY/RESOURCE
			tooltipText	= r3provider.getR3TextRes().tResCreateChildPathTT;
			handler		= this.handleCreatePathDialogOpen;
		}else if(this.props.toolbarData.canCreateService){
			// Create SERVICE
			tooltipText	= r3provider.getR3TextRes().tResCreateOwnerServiceTT;
			handler		= this.handleCreateServiceDialogOpen;
		}else if(r3CompareCaseString(serviceType, this.props.toolbarData.type) && !r3IsEmptyString(this.props.toolbarData.service) && !this.props.toolbarData.hasServiceTenant){
			// Create SERVICE/TENANT for service name under SERVICE
			tooltipText	= r3provider.getR3TextRes().tResCreateServiceTT;
			handler		= this.handleCreateServiceTenant;
		}else{
			return;
		}

		return (
			<Tooltip
				title={ tooltipText }
				open={ ((r3IsEmptyEntityObject(this.state, 'tooltips') || !r3IsSafeTypedEntity(this.state.tooltips.createPathTooltip, 'boolean')) ? false : this.state.tooltips.createPathTooltip) }
			>
				<IconButton
					onClick={ handler }
					onMouseEnter={ event => this.handTooltipChange(event, tooltipValues.createPath, true) }
					onMouseLeave={ event => this.handTooltipChange(event, tooltipValues.createPath, false) }
					{ ...theme.r3AppBar.createPathButton }
					size="large"
				>
					<AddIcon />
				</IconButton>
			</Tooltip>
		);
	}

	getDeletePathButton()
	{
		const { theme, r3provider } = this.props;

		let	isDeleteService	= false;
		let	isServiceTenant	= false;
		if(r3CompareCaseString(serviceType, this.props.toolbarData.type) || !r3IsEmptyString(this.props.toolbarData.service)){
			// under SERVICE type
			if(!r3CompareCaseString(serviceType, this.props.toolbarData.type)){
				// under SERVICE > service name > ROLE/POLICY/RESOURCE
				return;
			}else{
				if(r3IsEmptyString(this.props.toolbarData.service)){
					// under SERVICE top
					return;
				}else{
					// under SERVICE > service name
					isDeleteService = true;

					if(this.props.toolbarData.serviceOwner){
						if(this.props.toolbarData.hasServiceTenant){
							// Delete SERVICE TENANT(service is owner, but service tenant exists)
							isServiceTenant = true;
						}else{
							// Delete SERVICE
							isServiceTenant = false;
						}
					}else{
						if(this.props.toolbarData.hasServiceTenant){
							// Delete SERVICE TENANT
							isServiceTenant = true;
						}else{
							// not owner & not service tenant
							return;
						}
					}
				}
			}
		}else{
			// under ROLE/POLICY/RESOURCE type
			if(r3IsEmptyString(this.props.toolbarData.name)){
				// under ROLE/POLICY/RESOURCE
				return;
			}else{
				// under ROLE/POLICY/RESOURCE > path
				isDeleteService = false;
			}
		}

		let	tooltipText;
		let	handler;
		if(!isDeleteService){
			tooltipText		= r3provider.getR3TextRes().tResDeletePathTT;
			handler			= this.handleDeletePath;
		}else{
			if(isServiceTenant){
				tooltipText	= r3provider.getR3TextRes().tResDeleteOwnerServiceTT;
			}else{
				tooltipText	= r3provider.getR3TextRes().tResDeleteServiceTT;
			}
			handler			= this.handleDeleteService;
		}

		return (
			<Tooltip
				title={ tooltipText }
				open={ ((r3IsEmptyEntityObject(this.state, 'tooltips') || !r3IsSafeTypedEntity(this.state.tooltips.deletePathTooltip, 'boolean')) ? false : this.state.tooltips.deletePathTooltip) }
			>
				<IconButton
					onClick={ handler }
					onMouseEnter={ event => this.handTooltipChange(event, tooltipValues.deletePath, true) }
					onMouseLeave={ event => this.handTooltipChange(event, tooltipValues.deletePath, false) }
					{ ...theme.r3AppBar.deletePathButton }
					size="large"
				>
					<DeleteIcon />
				</IconButton>
			</Tooltip>
		);
	}

	getChipInToolbar()
	{
		const { theme, r3provider } = this.props;

		let	strLabel = r3provider.getR3TextRes().tResUnselected;

		if(r3CompareCaseString(serviceType, this.props.toolbarData.type)){
			strLabel = this.props.toolbarData.type.toUpperCase();
		}else if(r3CompareCaseString(resourceType, this.props.toolbarData.type) || r3CompareCaseString(roleType, this.props.toolbarData.type) || r3CompareCaseString(policyType, this.props.toolbarData.type)){
			if(r3IsEmptyString(this.props.toolbarData.service)){
				strLabel = this.props.toolbarData.type.toUpperCase();
			}else{
				strLabel = serviceType + '/' + this.props.toolbarData.type;
				strLabel = strLabel.toUpperCase();
			}
		}else if(!r3IsEmptyStringObject(this.props.toolbarData.tenant, 'name') ){
			strLabel = r3provider.getR3TextRes().tResTenantPathLabel;
		}

		let	avatar = (
			<Avatar
				sx={ this.sxClasses.avatar }
			>
				<DescriptionIcon
					sx={ this.sxClasses.descriptionIcon }
				/>
			</Avatar>
		);

		let	label = (
			<Typography
				{ ...theme.r3Toolbar.chipText }
				sx={ this.sxClasses.chipText }
			>
				{ strLabel }
			</Typography>
		);

		return (
			<Tooltip
				title={ r3provider.getR3TextRes().tResPathChipTT }
				open={ ((r3IsEmptyEntityObject(this.state, 'tooltips') || !r3IsSafeTypedEntity(this.state.tooltips.pathInfoChipTooltip, 'boolean')) ? false : this.state.tooltips.pathInfoChipTooltip) }
			>
				<Chip
					avatar={ avatar }
					label={ label }
					onClick={ this.handlePathInfoDialogOpen }
					onMouseEnter={ event => this.handTooltipChange(event, tooltipValues.pathInfoChip, true) }
					onMouseLeave={ event => this.handTooltipChange(event, tooltipValues.pathInfoChip, false) }
					{ ...theme.r3Toolbar.chip }
					sx={ this.sxClasses.chip }
				/>
			</Tooltip>
		);
	}

	render()
	{
		const { theme, r3provider } = this.props;

		let	themeToolbar	= this.props.enDock ? theme.r3Toolbar.toolbar : theme.r3Toolbar.smallToolbar;
		let	name			= '';
		let	ownerTag;
		if(r3IsEmptyString(this.props.toolbarData.name)){
			if(r3CompareCaseString(serviceType, this.props.toolbarData.type) && !r3IsEmptyString(this.props.toolbarData.service)){
				name		= this.props.toolbarData.service;
				if(this.props.toolbarData.serviceOwner){
					ownerTag = (
						<Typography
							{ ...theme.r3Toolbar.ownerText }
							sx={ this.sxClasses.ownerText }
						>
							{ r3provider.getR3TextRes().tResOwnerServiceTag }
						</Typography>
					);
				}
			}
		}else{
			name			= this.props.toolbarData.hasParent ? ('.../' + this.props.toolbarData.name) : this.props.toolbarData.name;
		}

		return (
			<Box>
				<AppBar
					{ ...theme.r3Toolbar.root }
					sx={ this.sxClasses.root }
				>
					<Toolbar
						{ ...themeToolbar }
						sx={ this.sxClasses.toolbar }
					>
						{ this.getChipInToolbar() }

						{ ownerTag }
						<Typography
							{ ...theme.r3Toolbar.title }
							sx={ this.sxClasses.title }
						>
							{ name }
						</Typography>

						{ this.getArrawUpwardButton() }

						<Box
							sx={ this.sxClasses.spacerInToolbar }
						/>

						{ this.getCreatePathButton() }
						{ this.getDeletePathButton() }
					</Toolbar>
				</AppBar>
				<R3PathInfoDialog
					theme={ theme }
					r3provider={ this.props.r3provider }
					open={ this.state.pathInfoDialogOpen }
					tenant={ this.props.toolbarData.tenant }
					service={ this.props.toolbarData.service }
					type={ this.props.toolbarData.type }
					fullpath={ this.props.toolbarData.fullpath }
					currentpath={ this.props.toolbarData.currentpath }
					onClose={ this.handlePathInfoDialogClose }
				/>
				<R3CreatePathDialog
					theme={ theme }
					r3provider={ this.props.r3provider }
					open={ this.state.createPathDialogOpen }
					tenant={ this.props.toolbarData.tenant }
					type={ this.props.toolbarData.type }
					parentPath={ (null === this.props.toolbarData.currentpath ? '/' : ('/' + this.props.toolbarData.currentpath)) }
					newPath={ this.state.newPath }
					onClose={ this.handleCreatePathDialogClose }
				/>
				<R3CreateServiceDialog
					theme={ theme }
					r3provider={ this.props.r3provider }
					open={ this.state.createServiceDialogOpen }
					createMode={ true }
					tenant={ this.props.toolbarData.tenant }
					newServiceName={ this.state.newServiceName }
					newServiceResType={ this.state.serviceResTypeUrl }
					newVerify={ this.state.newVerify }
					newStaticRes={ this.state.newStaticRes }
					onClose={ this.handleCreateServiceDialogClose }
				/>
				<R3CreateServiceTenantDialog
					theme={ theme }
					r3provider={ this.props.r3provider }
					open={ this.state.createServiceTenantDialogOpen }
					tenant={ this.props.toolbarData.tenant }
					service={ this.props.toolbarData.service }
					aliasRole={ this.state.aliasRole }
					onClose={ this.handleCreateServiceTenantDialogClose }
				/>
				<R3PopupMsgDialog
					theme={ theme }
					r3provider={ this.props.r3provider }
					title={ this.props.r3provider.getR3TextRes().cUpdatingTitle }
					r3Message={ this.state.r3DeleteServiceMessage }
					twoButton={ true }
					onClose={ this.handleDeleteServiceDialogClose }
				/>
				<R3PopupMsgDialog
					theme={ theme }
					r3provider={ this.props.r3provider }
					r3Message={ this.state.r3Message }
					onClose={ this.handleMessageDialogClose }
				/>
			</Box>
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
