Ext.namespace('OSS');
Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.ux', 'ux/');
Ext.Loader.setPath('Ext.ux.DataView', 'ux/DataView/');

Ext.require([
	'Ext.data.*',
    'Ext.grid.*',
    'Ext.util.*',
    'Ext.toolbar.*',
	'Ext.form.*',
	'Ext.state.*',
	'Ext.ux.PreviewPlugin',
	'Ext.ProgressBar',
    'Ext.ux.ToolbarDroppable',
    'Ext.ux.BoxReorderer',
	'Ext.toolbar.TextItem',
	'Ext.view.View',
    'Ext.ux.DataView.Animated',
	'Ext.ux.grid.FiltersFeature',
	'Ext.grid.feature.Grouping',
    'Ext.XTemplate',
	'Ext.ux.data.PagingMemoryProxy',
	'Ext.slider.Multi',
	'Ext.ux.CellDragDrop',
	'Ext.ux.form.SearchField',
	'Ext.ux.form.ItemSelector',
	'Ext.ux.window.Notification',
	'Ext.ux.GMapPanel'
]);

function getCookie(c_name) {
	var c_value = document.cookie;
	var c_start = c_value.indexOf(" " + c_name + "=");
	if (c_start == -1) {
	  c_start = c_value.indexOf(c_name + "=");
	}
	if (c_start == -1)
	  c_value = null;    
	else {
	  c_start = c_value.indexOf("=", c_start) + 1;
	  var c_end = c_value.indexOf(";", c_start);
	  if (c_end == -1)
	    c_end = c_value.length;    
	  c_value = unescape(c_value.substring(c_start,c_end));
	}
	return c_value;
}

function setCookie(c_name,value,exdays)
{
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;
}

function checkCookie()
{
	var username=getCookie("username");
	return username;
}

Ext.onReady(function() {

	Ext.QuickTips.init();

	Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));
	
	var win;

	function login_request(username,password) {
		Ext.Ajax.request({
		   url: 'avia.php',
		   params: {handle: 'web', action: 'login', where: username+','+password},
		   success: function(response, opts) {
			   if (response.responseText.split(',')[0] == 'logged')			   
				   location.reload();
			   else
				  Ext.MessageBox.alert('Status', response.responseText, function() {});
		   },
		   failure: function(response, opts) {
				alert('error');
		   }
		});		
	}
	
	function mac_request() {
		Ext.Ajax.request({
		   url: 'test.php',
		   params: {},
		   success: function(response, opts) {
				Ext.Ajax.request({
				   url: 'avia.php',
				   params: {handle: 'web', action: 'login'},
				   success: function(response, opts) {
					   Ext.get('loading').remove();
					   if (response.responseText.split(',')[0] == 'logged')
					   {			  
							setCookie('username', logged, 60);
							new Ext.create('OCS.Viewport', {
								id: 'ocr-viewport',
								layout: 'border',
								margins: '0'
							});	
							
					   } else {
							 var win = Ext.create('Ext.panel.Panel', {
								renderTo: 'way',
								closable: false,
								width: 400,
								cls: 'white',
								height: 350,
								border: false,
								frame: false,
								minWidth: 320,
								minHeight: 350,
								layout: 'fit',
								items: [
									{
										bodyPadding: 100,
										xtype: 'panel',
										frame: false,
										border: false,
										layout: {
											xtype: 'vbox',
											align: 'stretch'
										},
										items: [Ext.create('Ext.Component', {
											height: 50, 
											width: 250,
											autoEl: {
												tag: 'div',
												html:'<span style="font-size: 14px; valign:center">Тавтай морил, Та нэвтэрнэ үү !</span>'
											}
										}),{
											id: 'username',
											xtype: 'textfield',
											cls: 'login',
											width: 210,								
											value: checkCookie(),
											emptyText: 'user name',
											listeners: {									
												afterrender: function(field) {
												  field.focus();
												}
											}
										},
										{
											id : 'password',
											xtype: 'textfield',
											inputType: 'password',
											emptyText: 'password',
											width: 210,
											cls: 'login',
											enableKeyEvents: true,
											listeners: {
												keyup : function(textfield,eventObject){
													if (eventObject.getCharCode() == Ext.EventObject.ENTER) {
														var user = Ext.getCmp('username').getValue();
														var password = Ext.getCmp('password').getValue();
														login_request(user,password);
													}
												},
												afterrender: function(field) {
													if (checkCookie())										
														field.focus();
												}
											}
										}]
								   }
								],
								dockedItems: [{
									xtype: 'toolbar',
									dock: 'bottom',
									height: 40,
									cls: 'login-button',
									layout: {
										pack: 'center'
									},
									items: [{
										minWidth: 80,
										text: 'Sign up',
										hidden: true
									},{
										minWidth: 100,
										cls: 'login-button',
										text: 'Нэвтрэх',
										handler: function() {
											var user = Ext.getCmp('username').getValue();
											var password = Ext.getCmp('password').getValue();
											login_request(user,password);
										}
									}]
								}]
							});		
					   }
				   },
				   failure: function(response, opts) {
						alert('error');
				   }
				});
		   },
		   failure: function(response, opts) {
				alert('error');
		   }
		});		
	}

	mac_request(); 	
});
