Ext.define('OCS.RetailForm', {
	extend: 'Ext.form.Panel',
	border: false,
	region: 'center',
	height: 380,
	autoScroll: true,
	closeAction: 'hide',	
	split: true,
	bodyPadding: '5 5 0',	
	func: 'crm_retail_list',
	fieldDefaults: {
		labelAlign: 'right',
		labelWidth: 70,
		msgTarget: 'qtip'
	},
	autoClose: true,

	constructor: function(cnfg) {
        this.callParent(arguments);
        this.initConfig(cnfg);	
    },
	
	onTextFieldChange: function(v) {
		var me = this;			
		if (v) {
			me.duplicateCheck = true;
			me.query = v;
			views['retail'].store.getProxy().extraParams = {handle: 'web', action: 'select', func: me.func, query: me.query};
			views['retail'].store.loadPage(1, {callback: function() {
				if (me.up().down("#customer_duplicate_warning")) {												
					if (me.duplicateCheck && views['retail'].store.getCount() > 0)						
						me.up().down("#customer_duplicate_warning").setText('Ижил мэдээлэл '+views['retail'].store.getTotalCount()+' ширхэг байна !');
					else
						me.up().down("#customer_duplicate_warning").setText('');
				}
			}});
		} else {
			me.duplicateCheck = false;
			views['retail'].store.getProxy().extraParams = {handle: 'web', action: 'select', func: me.func};
			views['retail'].store.loadPage(1);
		}
	},
	
	convertLatin: function(value, value1) {
		if (typeof value == 'undefined') value = '';
		if (typeof value1 == 'undefined') value1 = '';
		
		value = value.toLowerCase();
		value1 = value1.toLowerCase();
		value = value.trim();
		value1 = value1.trim();

		chrs = [];
		chrs['а'] = 'a';chrs['ж'] = 'j';chrs['ө'] = 'u';chrs['ц'] = 'ts';chrs['ю'] = 'yu';
		chrs['б'] = 'b';chrs['и'] = 'i';chrs['п'] = 'p';chrs['ч'] = 'ch';chrs['я'] = 'ya';
		chrs['в'] = 'v';chrs['й'] = 'i';chrs['р'] = 'r';chrs['ш'] = 'sh';chrs['ф'] = 'f';
		chrs['г'] = 'g';chrs['к'] = 'k';chrs['с'] = 's';chrs['щ'] = 'sch';
		chrs['д'] = 'd';chrs['л'] = 'l';chrs['т'] = 't';chrs['ь'] = 'i';
		chrs['е'] = 'е';chrs['м'] = 'm';chrs['у'] = 'u';chrs['ъ'] = 'i';
		chrs['ё'] = 'yo';chrs['н'] = 'n';chrs['ү'] = 'u';chrs['ы'] = 'i';
		chrs['з'] = 'z';chrs['о'] = 'o';chrs['х'] = 'kh';chrs['э'] = 'e';
		chrs['.'] = '.';chrs['-'] = '-';;chrs[' '] = ' ';
		
		v1 = ''; v2 = '';
		if (value.length > 0)
		{
			for (i = 0; i < value.length; i++) {
				if (chrs[value.charAt(i)])
					v1 = v1 + chrs[value.charAt(i)];
				else
					v1 = v1 + value.charAt(i);
			}
		}

		if (value1.length > 0)
		{		
			for (i = 0; i < value1.length; i++) {
				if (chrs[value1.charAt(i)])
					v2 = v2 + chrs[value1.charAt(i)];
				else
					v2 = v2 + value1.charAt(i);
			}
		}

		return v1.toUpperCase()+' '+v2.toUpperCase(); //this.capitalise(v1)+' '+this.capitalise(v2);
	},

	initComponent: function() {
		var me = this;

		me.listeners = {
			'afterrender': function() {
				if (me.selected && me.selected.get('crm_id') > 0)
					me.getForm().loadRecord(me.selected);
			}
		};

		me.items = [{
				xtype: 'fieldset',
				title: 'Үндсэн мэдээлэл',
				collapsible: true,
				defaultType: 'textfield',
				layout: 'anchor',
				defaults: {
					anchor: '100%',
					margin: '15 15 15 15',
				},
				items: [{
					xtype: 'fieldcontainer',
					fieldLabel: 'Харилцагч',
					layout: 'hbox',
					combineErrors: true,
					defaultType: 'textfield',
					defaults: {
						hideLabel: 'true'
					},
					items: [{
						name: 'customer_type',
						value: '0',
						hidden: true
					},{
						name: 'type',
						value: 'ХУВЬ ХҮН',
						hidden: true
					},{
						id: 'firstName',
						name: 'firstName',
						fieldLabel: 'Нэр',
						flex: 0.5,
						labelWidth: 70,
						focused: true,
						maskRe : /[а-яөүА-ЯӨҮёЁ]/,
						emptyText: 'Нэр',
						allowBlank: false,
						listeners: {
							keyup: {
								element: 'el',
								fn: function() {
									me.firstName = Ext.getCmp('retail_form').getForm().findField('firstName').getValue();
									me.lastName = Ext.getCmp('retail_form').getForm().findField('lastName').getValue();
									Ext.getCmp('retail_form').getForm().findField("engName").setValue(me.convertLatin(me.firstName, me.lastName));
								//	me.onTextFieldChange(me.firstName, 'firstName');
								},
								scope: this,
								buffer: 100
							},
							afterrender: function(field) {
								field.focus();
							}
						}
					},{
						id: 'lastName',
						name: 'lastName',
						fieldLabel: 'Овог',
						flex: 0.5,
						margins: '0 0 0 6',
						maskRe : /[а-яөүА-ЯӨҮёЁ]/,
						emptyText: 'Овог',
						allowBlank: false,
						listeners: {
							keyup: {
								element: 'el',
								fn: function() {
									me.firstName = Ext.getCmp('retail_form').getForm().findField('firstName').getValue();
									me.lastName = Ext.getCmp('retail_form').getForm().findField('lastName').getValue();
									Ext.getCmp('retail_form').getForm().findField("engName").setValue(me.convertLatin(me.firstName, me.lastName));
//									me.onTextFieldChange(me.lastName, 'lastName');
								},
								scope: this,
								buffer: 100
							},
							afterrender: function(field) {
								field.focus();
							}
						}
					},{
						name: 'engName',
						fieldLabel: 'engName',
						flex: 0.5,
						margins: '0 0 0 6',
						emptyText: 'Латин'
					}]
				},{
					xtype: 'container',
					layout: 'hbox',
					defaultType: 'textfield',
					items: [{
						name: 'birthday',
						fieldLabel: 'Төрсөн өдөр',
						labelWidth: 70,
						flex: 0.5,
						hideLabel: false,
						value: '1970-01-01',
						format: 'Y-m-d',
						xtype: 'datefield'
					},{
						name: 'gender',
						flex: 0.3,
						fieldLabel: 'Хүйс',
						labelWidth: 40,
						margins: '0 0 0 6',
						xtype: 'combo',
						store: Ext.create('Ext.data.Store', {
						  model: 'CRM_ITEM',
						  data: [{value: 'эр'},{value: 'эм'}]
						}),
						queryMode: 'local',
						displayField: 'value',
						value: 'эр',
						valueField: 'value',
						triggerAction: 'all',
						editable: false
					},{
						id: 'regNo',
						name: 'regNo',
						fieldLabel: 'Регистр №',
						hideLabel: false,
						labelWidth: 70,
						flex:0.5,
						margins: '0 0 0 6',
						emptyText: '',
						maxLength: 10,
						maskRe : /[0-9А-ЯӨҮа-яөү]/,
						listeners: {
							keyup: {
								element: 'el',
								fn: function() {
//									me.onTextFieldChange(Ext.getCmp('retail_form').getForm().findField('regNo').getValue(), 'regNo');
								},
								scope: this,
								buffer: 100
							}
						}
					}]
				}, {
					xtype: 'container',
					layout: 'hbox',
					defaultType: 'textfield',
					items: [{
						fieldLabel: 'Түвшин',
						xtype: 'combo',
						labelWidth: 70,
						name: 'level',
						store: Ext.create('Ext.data.Store', {
						  model: 'CRM_ITEM',
						  data: [{value: 'customer'},{value: 'prospect'},{value: 'suspect'}]
						}),
						queryMode: 'local',
						displayField: 'value',
						valueField: 'value',
						triggerAction: 'all',
						editable: false,
					    allowBlank: false,
						flex: 0.5
					},{
						fieldLabel: 'Зэрэглэл',
						xtype: 'combo',
						name: 'priority',
						labelWidth: 50,
						store: Ext.create('Ext.data.Store', {
						  model: 'CRM_ITEM',
						  data: [{value: 'low'},{value: 'medium'},{value: 'top100'}]
						}),	
						queryMode: 'local',
						displayField: 'value',
						valueField: 'value',
						triggerAction: 'all',
						value: 'medium',
						editable: false,
					    allowBlank: false,
						flex: 0.5
					},{
						fieldLabel: 'Төрөл',
						xtype: 'combo',
						name: '_class',
						margins: '0 0 0 6',
						labelWidth: 30,
						value: 'RETAIL',
						store: Ext.create('Ext.data.Store', {
						  model: 'CRM_ITEM',
						  data: [{value: 'RETAIL'},{value: 'VIP'},{value: 'SME'},{value: 'AGENT'},{value: 'EXPAT'}]
						}),
						listeners: {
							change:    function(field, newValue, oldValue) {
								if (newValue == 'EXPAT' || newValue == 'AGENT') {
									Ext.getCmp('retail_form').getForm().findField('regNo').maskRe = /[0-9A-Za-z]/;
									Ext.getCmp('retail_form').getForm().findField('phone').maxLength = 16;
								}
								else {
									Ext.getCmp('retail_form').getForm().findField('regNo').maskRe = /[0-9А-ЯӨҮа-яөү]/;
									Ext.getCmp('retail_form').getForm().findField('phone').maxLength = 16;
								}
							}
						},
						queryMode: 'local',
						displayField: 'value',
						valueField: 'value',
						triggerAction: 'all',
						editable: false,
						flex: 0.5
					},{
						name: 'source',
						fieldLabel: 'Эх сурвалж',
						xtype: 'combo',
						labelWidth: 50,
						value: 'employee referral',
						store: Ext.create('Ext.data.Store', {
						  model: 'CRM_ITEM',
						  data: [{value: 'partner'},{value: 'employee referral'},{value: 'external referral'},{value: 'public relations'},{value: 'party'},{value: 'advertisement'},{value: 'cold call'},{value: 'web research'}]
						}),							  
						queryMode: 'local',
						displayField: 'value',
						valueField: 'value',
						triggerAction: 'all',
						editable: true,
						flex: 0.6
					}]
				},{
					xtype: 'container',
					layout: 'hbox',
					defaultType: 'textfield',
					items: [{
						fieldLabel: 'Н.Байдал',
						xtype: 'combo',
						labelWidth: 70,
						value: 'ажилладаг',
						name: 'work_status',
						store: Ext.create('Ext.data.Store', {
						  model: 'CRM_ITEM',
						  data: [{value: 'ажилладаг'},{value: 'сурдаг'},{value: 'тэтгэвэрт'},{value:'бусад'}]
						}),
						queryMode: 'local',
						displayField: 'value',
						valueField: 'value',
						triggerAction: 'all',
						editable: false,
						flex: 0.5
					},{
						fieldLabel: 'Ажлын газар',
						labelWidth: 60,
						xtype: 'searchcombo',
						name: 'title',
						table: 'crm_customer',
						margins: '0 0 0 6',
						flex: 0.75
					}, {
						emptyText: 'Албан тушаал',
						xtype: 'searchcombo',
						table: 'crm_customer',
						name: 'job_title',
						margins: '0 0 0 6',
						flex: 0.5
					}, {
						emptyText: 'Мэргэжил',
						xtype: 'searchcombo',
						table: 'crm_customer',
						margins: '0 0 0 6',
						hidden: true,
						name: 'job_type',
						flex: 0.5
					}]
				}]
			},{
				xtype: 'fieldset',
				title: 'Холбоо барих',
				defaultType: 'textfield',
				layout: 'anchor',
				collapsible: true,
				defaults: {
					anchor: '100%',
					margin: '15 15 15 15'
				},
				items: [{
						xtype: 'container',
						layout: 'hbox',
						defaultType: 'textfield',
						items: [{
							id: 'phone',
							fieldLabel: 'Утас 1',
							labelWidth: 70,
							name: 'phone',
							flex: 0.5,
							emptyText: 'xxxxxxxx',
							maxLength: 12,
							maskRe: /[\d\-]/,
							regex: /^\d{8}$/,
							allowBlank: false,
							regexText: 'Must be in the format xxx-xxx-xxxx',
							listeners: {
								keyup: {
									element: 'el',
									fn: function(e) {
//										me.onTextFieldChange(Ext.getCmp('retail_form').getForm().findField('phone1').getValue(), 'phone');
									},
									scope: this,
									buffer: 100
								}
							}
						}, {
							fieldLabel: 'Утас 2',
							labelWidth: 60,
							name: 'phone1',
							flex: 0.5,
							emptyText: 'xxxxxxxx',
							maskRe: /[\d\-]/,
							regex: /^\d{8}$/,
							maxLength: 8,
							regexText: 'Must be in the format xxx-xxx-xxxx'
						}, {
							fieldLabel: 'Факс',
							labelWidth: 40,
							name: 'fax',
							flex: 0.5,
							emptyText: 'xxxxxxxx',
							maskRe: /[\d\-]/,
							regex: /^\d{8}$/,
							maxLength: 8,
							regexText: 'Must be in the format xxx-xxx-xxxx'
						}]
					},{
						xtype: 'container',
						layout: 'hbox',
						defaultType: 'textfield',
						items: [{
							fieldLabel: 'И-майл',
							labelWidth: 70,
							name: 'email',
							vtype: 'email',
							maxLength: 60,
							flex: 1
						}, {
							fieldLabel: 'FB хаяг',
							name: 'www',
//							vtype: 'url',
							labelWidth: 70,
							maxLength: 128,
							flex: 1
						},{
							xtype: 'textfield',
							fieldLabel: 'Шуудан код',
							labelWidth: 60,
							name: 'postalCode',
							width: 150,
							maxLength: 10,
							regexText: 'Must be in the format xxxxx or xxxxx-xxxx'
						}]
					},{
						xtype: 'container',
						layout: 'hbox',								
						items: [{
							xtype: 'searchcombo',
							name: 'country',							
							fieldLabel: 'Улс',
							value: 'Монгол',
							table: 'crm_customer',
							labelWidth: 70,
							flex: 1
						}, {
							xtype: 'searchcombo',
							name: 'city',							
							fieldLabel: 'Хот',
							value: 'Улаанбаатар',
							table: 'crm_customer',
							labelWidth: 50,
							flex: 1
						},{
							xtype: 'searchcombo',
							name: 'district',							
							fieldLabel: 'District',
							table: 'crm_customer',
							labelWidth: 50,
							flex: 1
						}]
					},{
						xtype: 'container',
						layout: 'hbox',
						defaultType: 'textfield',
						items: [{
							labelWidth: 70,
							xtype: 'searchcombo',
							fieldLabel: 'Хороо',
							table: 'crm_customer',
							name: 'horoo',
							flex: 0.5
						},{
							labelWidth: 50,
							fieldLabel: 'Хаяг',
							name: 'address',
							flex: 1
						}]
					}
				]
			},{
				xtype: 'fieldset',
				id: 'contact_campaign_list',
				hidden: true,
				title: 'Campaigns',
				collapsible: true,
				collapsed: false,
				defaultType: 'checkbox',
				layout: 'anchor',
				defaults: {
					anchor: '100%',
					hideEmptyLabel: false,
					margin: '15 15 15 15'
				},
				items: [{
					xtype: 'container',
					layout: 'hbox',
					defaultType: 'checkbox',
					items: me.campaign_list
				}]					
			},{
				xtype: 'fieldset',
				title: 'Нэмэлт мэдээлэл',
				collapsible: true,
				collapsed: false,
				defaultType: 'textfield',
				layout: 'anchor',
				defaults: {
					anchor: '100%'
				},
				items: [{
					xtype: 'textarea',
					fieldLabel: 'Тайлбар',
					emptyText: 'Тайлбар...',
					labelWidth: 70,
					name: 'descr',
					flex: 1
				},{
					hidden: true,
					name: 'userCode',
					value: logged
				},{
					hidden: true,
					name: 'owner',
					value: logged
				}]					
			}
		];		

		me.buttons = [{
			itemId: 'customer_duplicate_warning',
			xtype: 'tbtext',
			text: '',
			cls: 'warning'
		},{
			itemId: 'commit_after_close',
			xtype: 'checkbox',
			labelWidth: 140,
			id: 'autoclose',
			checked: true,
			boxLabel: 'илгээсний дараа автоматаар хаагдах',
			handler: function (field, value) {
				me.autoClose = field.getValue();
			}
		},'->',{
			text : 'Арилгах',
			iconCls: 'reset',
			handler: function() {
				var form = this.up('form').getForm();
				form.reset();
			}
		},{
			iconCls: 'commit',
			text: 'Илгээх',
			handler: function() {
				var form = this.up('form').getForm();
				if (form.isValid())	{
					var values = form.getValues(true);	
					if (values.indexOf('autoclose-inputEl=on')!=-1)
						values = values.substring(0, values.lastIndexOf('&'));
					me.level = form.findField('level').getValue();
					
					if (me.selected && me.selected.get('crm_id') > 0) {
						values = values.replaceAll("=", "='");
						values = values.replaceAll("&", "',");
						values += "'";
						Ext.Ajax.request({
						   url: 'avia.php',
						   params: {handle: 'web', action: 'update', func: '', table: 'crm_customer', values:values, where: 'crm_id='+me.selected.get('crm_id')},
						   success: function(response, opts) {
								Ext.getBody().unmask();

								if (me.autoClose)
									me.win.close();
								if (me.level == 'customer' && campaigns_static.length > 0)							
									new OCS.CustomerCampaignWindowCheckList({
										crm_id: response.responseText
									}).show();

								views['retail'].store.loadPage(1);	
						   },
						   failure: function(response, opts) {										   
							  Ext.MessageBox.alert('Status', 'Error !', function() {});
						   }
						});
					} else {	
						values = values.replaceAll("%26", "and7");
						Ext.Ajax.request({
						   url: 'avia.php',
						   params: {handle: 'web', action: 'insert', func: '', table: 'crm_customer', values:values},
						   success: function(response, opts) {
								if (response.responseText == '0') {
								  Ext.MessageBox.alert('Status', 'Error !', function() {});
								  return;
								} 

								if (me.autoClose)
									me.win.close();
								if (me.level == 'customer' && campaigns_static.length > 0) {							
									new OCS.CustomerCampaignWindowCheckList({
										crm_id: response.responseText
									}).show();
								}

								views['retail'].store.loadPage(1);	
						   },
						   failure: function(response, opts) {										   
							  Ext.MessageBox.alert('Status', 'Error !', function() {});
						   }
						});
					}
				}
			}
		}];

		me.callParent(arguments);
	}
});


Ext.define('OCS.CorporateForm', {
	extend: 'Ext.form.Panel',
	border: false,
	region: 'center',
	height: 380,
	autoScroll: true,
	split: true,
	autoClose: true,
	func: 'crm_corporate_list',
	bodyPadding: '5 5 5 5',	
	fieldDefaults: {
		labelAlign: 'right',
		labelWidth: 60,
		msgTarget: 'qtip'
	},

	constructor: function(cnfg) {
        this.callParent(arguments);
        this.initConfig(cnfg);	
    },
		
	onTextFieldChange: function(v) {
		var me = this;			
		if (v && 1==0) {
			me.duplicateCheck = true;
			me.query = v;
			views['corporate'].store.getProxy().extraParams = {handle: 'web', action: 'select', func: me.func, query: me.query};
			views['corporate'].store.loadPage(1, {callback: function() {
				if (me.up().down("#customer_duplicate_warning")) {												
					if (me.duplicateCheck && views['corporate'].store.getCount() > 0)						
						me.up().down("#customer_duplicate_warning").setText('Ижил мэдээлэл '+views['corporate'].store.getTotalCount()+' ширхэг байна !');
					else
						me.up().down("#customer_duplicate_warning").setText('');
				}
			}});
		} else {
			me.duplicateCheck = false;
			views['corporate'].store.getProxy().extraParams = {handle: 'web', action: 'select', func: me.func};
			views['corporate'].store.loadPage(1);
		}
	},

	convertLatin: function(value) {
		value = value.toLowerCase();

		chrs = [];
		chrs['а'] = 'a';chrs['ж'] = 'j';chrs['ө'] = 'u';chrs['ц'] = 'ts';chrs['ю'] = 'yu';
		chrs['б'] = 'b';chrs['и'] = 'i';chrs['п'] = 'p';chrs['ч'] = 'ch';chrs['я'] = 'ya';
		chrs['в'] = 'v';chrs['й'] = 'i';chrs['р'] = 'r';chrs['ш'] = 'sh';chrs['ф'] = 'f';
		chrs['г'] = 'g';chrs['к'] = 'k';chrs['с'] = 's';chrs['щ'] = 'sch';
		chrs['д'] = 'd';chrs['л'] = 'l';chrs['т'] = 't';chrs['ь'] = 'i';
		chrs['е'] = 'е';chrs['м'] = 'm';chrs['у'] = 'u';chrs['ъ'] = 'i';
		chrs['ё'] = 'yo';chrs['н'] = 'n';chrs['ү'] = 'u';chrs['ы'] = 'i';
		chrs['з'] = 'z';chrs['о'] = 'o';chrs['х'] = 'kh';chrs['э'] = 'e';
		chrs['.'] = '.';chrs['-'] = '-'; chrs[' '] = ' ';
		
		v1 = '';
		for (i = 0; i < value.length; i++) {
			if (chrs[value.charAt(i)])						
				v1 = v1 + chrs[value.charAt(i)];
			else
				v1 = v1 + value.charAt(i);
		}

		return v1.toUpperCase(); //this.capitalise(v1)+' '+this.capitalise(v2);
	},


	initComponent: function() {
		var me = this;
		
		me.listeners = {
			'afterrender': function() {
				if (me.selected && me.selected.get('crm_id') > 0)
					me.getForm().loadRecord(me.selected);
			}
		};

		me.items = [{
				xtype: 'fieldset',
				title: 'Main information',
				collapsible: true,
				defaultType: 'textfield',
				layout: 'anchor',
				defaults: {
					anchor: '100%',
					margin: '15 15 15 15',
					labelWidth: 60
				},
				items: [{
					xtype: 'container',
					layout: 'hbox',
					combineErrors: true,
					defaultType: 'textfield',
					defaults: {
						hideLabel: true
					},
					items: [{
						id: 'firstName',
						name: 'firstName',
						fieldLabel: 'Нэр',
						hideLabel: false,
						flex: 0.5,
						maskRe : /[а-яөүА-ЯӨҮёЁ0-9- ]/,
						focused: true,
						emptyText: 'Нэр',
						allowBlank: false,
						listeners: {
							keyup: {
								element: 'el',
								fn: function() {
									me.firstName = Ext.getCmp('corporate_form').getForm().findField('firstName').getValue();
									Ext.getCmp('corporate_form').getForm().findField("engName").setValue(me.convertLatin(me.firstName));
//									me.onTextFieldChange(me.firstName, 'firstName');
								},
								scope: this,
								buffer: 100
							},
							afterrender: function(field) {
								field.focus();
							}
						}
					},{
						name: 'lastName',
						fieldLabel: 'Групп',
						flex: 0.4,
						maskRe : /[а-яөүА-ЯӨҮёЁ0-9 ]/,
						margins: '0 0 0 6',
						emptyText: 'Групп нэр'
					},{
						name: 'customer_type',
						value: '1',
						hidden: true
					},{
						name: 'type',
						value: 'БАЙГУУЛЛАГА',
						hidden: true
					},{
						name: 'engName',
						fieldLabel: 'engName',
						flex: 0.4,
						margins: '0 0 0 6',
						emptyText: 'Латин'
					},{
						name: 'company_torol',
						width: 60,
						emptyText: 'Company type',
						margins: '0 0 0 6',
						xtype: 'combo',
						value: 'ХХК',
						store: Ext.create('Ext.data.Store', {
						  model: 'CRM_ITEM',
						  data: [{value: 'ХХК'},{value: 'ХК'},{value: 'ТӨХК'},{value: 'ТББ'},{value: 'ББСБ'},{value: 'ТӨҮГ'},{value: 'ОНӨҮГ'},{value: 'ХЗХ'}]
						}),
						queryMode: 'local',
						displayField: 'value',
						valueField: 'value',
						triggerAction: 'all',
						editable: false
					}]
				}, {
					xtype: 'container',
					layout: 'hbox',
					defaultType: 'textfield',
					items: [{
						fieldLabel: 'Төрөл',
						xtype: 'combo',
						name: '_class',
						allowBlank: false,
						store: Ext.create('Ext.data.Store', {
						  model: 'CRM_ITEM',
						  data: [{value: 'CORPORATE'},{value: 'SME'},{value: 'RESELLER'},{value: 'BROKER'}]
						}),
						queryMode: 'local',
						displayField: 'value',
						valueField: 'value',
						triggerAction: 'all',
						editable: false,
						flex: 0.5
					},{
						fieldLabel: 'Зэрэглэл',
						xtype: 'combo',
						name: 'priority',
						labelWidth: 50,
						store: Ext.create('Ext.data.Store', {
						  model: 'CRM_ITEM',
						  data: [{value: 'low'},{value: 'medium'},{value: 'top100'}]
						}),	
						queryMode: 'local',
						displayField: 'value',
						valueField: 'value',
						triggerAction: 'all',
						value: 'medium',
						editable: false,
					    allowBlank: false,
						flex: 0.5
					},{
						fieldLabel: 'Түвшин',
						xtype: 'combo',
						name: 'level',
						labelWidth: 40,
						store: Ext.create('Ext.data.Store', {
						  model: 'CRM_ITEM',
						  data: [{value: 'customer'},{value: 'prospect'},{value: 'suspect'}]
						}),	
						queryMode: 'local',
						displayField: 'value',
						valueField: 'value',
						triggerAction: 'all',
						editable: false,
					    allowBlank: false,
						flex: 0.5
					},{
						id: 'regNo',
						name: 'regNo',
						fieldLabel: 'Регистр №',
						hideLabel: false,
						width: 180,
						labelWidth: 70,
						margins: '0 0 0 6',
						emptyText: '',
						maxLength: 10,
						maskRe : /[0-9]/,
						listeners: {
							keyup: {
								element: 'el',
								fn: function() {
//									me.onTextFieldChange(Ext.getCmp('regNo').getValue(), 'regNo');
								},
								scope: this,
								buffer: 100
							}
						}
					}]
				}, {
					xtype: 'container',
					layout: 'hbox',
					defaultType: 'textfield',
					items: [{
						name: 'industry',
						flex: 0.5,
						fieldLabel: 'Ү/А төрөл',
						xtype: 'combo',
						store: Ext.create('Ext.data.Store', {
						  model: 'CRM_ITEM',
						  data: [{value: 'Уул уурхай'},{value: 'Барилга'},{value: 'Банк, санхүү'},{value: 'Үйлдвэрлэл'},{value: 'Худалдаа, үйлчилгээ'},{value: 'Тээвэр'},{value: 'Зам, гүүр'},{value: 'Шугам сүлжээ'},{value: 'Аялал жуулчлал'},{value: 'Худалдаа'}]							   
						}),							 
						queryMode: 'local',
						displayField: 'value',
						valueField: 'value',
						triggerAction: 'all',
						editable: true
					},{
						flex: 0.7,
						margins: '0 0 0 6',
						xtype: 'searchcombo',
						name: 'industry_sub',							
						emptyText: 'Ү/А чиглэл',
						table: 'crm_corporate_types'
					},{
						emptyText: 'Ажилчд.тоо',
						xtype: 'combo',
						name: 'employees',
						margins: '0 0 0 6',
						store: Ext.create('Ext.data.Store', {
						  model: 'CRM_ITEM',
						  data: [{value: 'тодорхойгүй'},{value: '10 доош'},{value: '10-50'},{value: '50-100'},{value:'100-500'},{value:'500-1000'},{value:'1000-с дээш'}]
						}),
						queryMode: 'local',
						displayField: 'value',
						valueField: 'value',
						triggerAction: 'all',
						editable: false,
						flex: 0.3
					}]
				},{
					xtype: 'container',
					layout: 'hbox',
					defaultType: 'textfield',
					items: [{
						fieldLabel: 'Хөрөнгө',
						xtype: 'currencyfield',
						name: 'capital',
						value: 0,
						flex: 0.5
					},{
						fieldLabel: 'Орлого',
						xtype: 'currencyfield',
						name: 'annual_revenue',
						margins: '0 0 0 6',
						value: 0,
						flex: 0.5
					},{
						fieldLabel: 'Татвар',
						xtype: 'currencyfield',
						name: 'tatvar',
						margins: '0 0 0 6',
						labelWidth: 50,
						value: 0,
						flex: 0.5
					}]
				}]
			},{
				xtype: 'fieldset',
				title: 'Холбоо барих',
				defaultType: 'textfield',
				layout: 'anchor',
				collapsible: true,
				defaults: {
					anchor: '100%',
					margin: '15 15 15 15',
					labelWidth: 60
				},
				items: [{
							xtype: 'container',
							layout: 'hbox',
							defaultType: 'textfield',
							items: [{
								id: 'phone',
								fieldLabel: 'Утас 1',
								labelWidth: 60,
								name: 'phone',
								flex: 0.5,
								emptyText: 'xxxxxxxx',
								maxLength: 8,
								maskRe: /[\d\-]/,
								regex: /^\d{8}$/,
								allowBlank: false,
								regexText: 'Must be in the format xxx-xxx-xxxx',
								listeners: {
									keyup: {
										element: 'el',
										fn: function(e) {
//											me.onTextFieldChange(Ext.getCmp('phone1').getValue(), 'phone');
										},
										scope: this,
										buffer: 100
									}
								}
							}, {
								fieldLabel: 'Утас 2',
								labelWidth: 60,
								name: 'phone1',
								flex: 0.5,
								emptyText: 'xxxxxxxx',
								maskRe: /[\d\-]/,
								regex: /^\d{8}$/,
								maxLength: 8,
								regexText: 'Must be in the format xxx-xxx-xxxx'
							}, {
								fieldLabel: 'Факс',
								labelWidth: 40,
								name: 'fax',
								flex: 0.5,
								emptyText: 'xxxxxxxx',
								maskRe: /[\d\-]/,
								regex: /^\d{8}$/,
								maxLength: 8,
								regexText: 'Must be in the format xxx-xxx-xxxx'
							}]
						},{
							xtype: 'container',
							layout: 'hbox',
							defaultType: 'textfield',
							items: [{
								fieldLabel: 'И-майл',
								name: 'email',
								vtype: 'email',
								maxLength: 60,
								flex: 0.5
							}, {
								fieldLabel: 'Веб',
								name: 'www',
//								vtype: 'url',
								labelWidth: 50,
								maxLength: 128,
								flex: 0.5
							},{
								xtype: 'textfield',
								fieldLabel: 'Шуудан код',
								labelWidth: 60,
								name: 'postalCode',
								width: 150,
								maxLength: 10,
								regexText: 'Must be in the format xxxxx or xxxxx-xxxx'
							}]
						},{
							xtype: 'container',
							layout: 'hbox',								
							items: [{
								xtype: 'searchcombo',
								name: 'country',							
								fieldLabel: 'Улс',
								value: 'Монгол',
								table: 'crm_customer',
								flex: 1
							}, {
								xtype: 'searchcombo',
								name: 'city',							
								fieldLabel: 'Хот',
								table: 'crm_customer',
								value: 'Улаанбаатар',
								labelWidth: 50,
								flex: 1
							},{
								xtype: 'searchcombo',
								name: 'district',							
								fieldLabel: 'Дүүрэг',
								table: 'crm_customer',
								labelWidth: 50,
								flex: 1
							}]
						},{
							xtype: 'container',
							layout: 'hbox',
							defaultType: 'textfield',
							items: [{
								xtype: 'searchcombo',
								fieldLabel: 'Хороо',
								table: 'crm_customer',
								name: 'horoo',
								flex: 0.5
							},{
								labelWidth: 50,
								fieldLabel: 'Хаяг',
								name: 'address',
								flex: 1
							},{
								hidden: true,
								name: 'userCode',
								value: logged
							},{
								hidden: true,
								name: 'owner',
								value: logged
							}]
						}
				]
			},{
				xtype: 'fieldset',
				title: 'Урамшуулалын мэдээлэл ба Үнийн сонголт',
				collapsible: true,
				collapsed: false,
				defaultType: 'textfield',
				layout: 'anchor',
				defaults: {
					anchor: '100%',
					margin: '15 15 15 15',
					labelWidth: 100
				},
				items: [{
					xtype: 'container',
					layout: 'hbox',
					height: 30,
					defaultType: 'textfield',
					items: [{
						xtype: 'combo',
						store: Ext.create('Ext.data.Store', {
							 model: 'CRM_PREV',
							 data: [{value: 'U0',name:'Хоосон'},{value: 'U1',name:'Нийлүүлэлтээс /сарын/'},{value: 'U2',name:'Төлөлтийн дүнгээс'},{value: 'U3',name:'Нийлүүлэлт+Төлөвлөгөөт'},{value: 'U4', name:'Бэлэн борлуулалтын хувьд'}] 
						}),
						name: 'promo_code',
						queryMode: 'local',
						fieldLabel: 'Урам.код',
						displayField: 'name',
						valueField: 'value',
						triggerAction: 'all',
						editable: false
					},{
						fieldLabel: 'Хөнгө%',
						xtype: 'textfield',
						name: 'promo_precent',
						margins: '0 0 0 6',
						value: 0,
						labelWidth: 50,
						flex: 0.5
					},{
						fieldLabel: 'Төлөвлөгөө',
						xtype: 'currencyfield',
						name: 'promo_amount',
						margins: '0 0 0 6',
						labelWidth: 70,
						value: 0,
						flex: 0.5
					},{
						xtype: 'combo',
						store: Ext.create('Ext.data.Store', {
							 model: 'CRM_PREV',
							 data: [{value: 'loan',name:'Зээлийн'},{value: 'cash', name: 'Бэлэн'}] 
						}),
						name: 'payment_type',
						queryMode: 'local',
						emptyText: 'Төлбөрийн хэлбэр',
						displayField: 'name',
						flex: 0.3,
						margins: '0 0 0 6',
						valueField: 'value',
						triggerAction: 'all',
						editable: false
					},{
						emptyText: 'Үнийн соноголт',
						xtype: 'combo',
						name: 'pricetag',
						margins: '0 0 0 6',
						store: Ext.create('Ext.data.Store', {
						  model: 'CRM_PREV',
						  data: [{value: 'price', name: price_text[0]},
								 {value: 'price1', name: price_text[1]},
								 {value: 'price2', name: price_text[2]},
								 {value: 'price3', name: price_text[3]},
								 {value: 'price4', name: price_text[4]},
								 {value: 'price5', name: price_text[5]},							  
								 {value: 'price6', name: price_text[6]},
								 {value: 'price7', name: price_text[7]},
								 {value: 'price8', name: price_text[8]},
								 {value: 'price9', name: price_text[9]},
								 {value: 'price10', name: price_text[10]}]
						}),
						queryMode: 'local',
						displayField: 'name',
						valueField: 'value',
						triggerAction: 'all',
						editable: false,
						flex: 0.3
					}]
				}]					
			},{
				xtype: 'fieldset',
				title: 'Нэмэлт мэдээлэл',
				collapsible: true,
				collapsed: false,
				defaultType: 'textfield',
				layout: 'anchor',
				defaults: {
					anchor: '100%'
				},
				items: [{
					xtype: 'textarea',
					fieldLabel: 'Тайлбар',
					emptyText: 'Тайлбар...',
					labelWidth: 70,
					name: 'descr',
					flex: 1
				}]					
			}
		];				

		me.buttons = [{
			itemId: 'customer_duplicate_warning',
			xtype: 'tbtext',
			text: '',
			cls: 'warning'
		},{
			itemId: 'commit_after_close',
			xtype: 'checkbox',
			labelWidth: 140,
			id: 'autoclose',
			checked: true,
			boxLabel: 'илгээсний дараа автоматаар цонхыг хаах',
			handler: function (field, value) {
				me.autoClose = field.getValue();
			}
		},'->',{
			text : 'Арилгах',
			iconCls: 'reset',
			handler: function() {
				var form = this.up('form').getForm();
				form.reset();
			}
		},{
			text: 'Илгээх',
			iconCls: 'commit',
			handler: function() {
				var form = this.up('form').getForm();
				if (form.isValid())	{
					var values = form.getValues(true);	
					if (values.indexOf('autoclose-inputEl=on')!=-1)
						values = values.substring(0, values.lastIndexOf('&'));
					me.level = form.findField('level').getValue();
					Ext.getBody().mask('Saving...');
					
					if (me.selected && me.selected.get('crm_id') > 0) {
						values = values.replaceAll("=", "='");
						values = values.replaceAll("&", "',");
						values += "'";
						Ext.Ajax.request({
						   url: 'avia.php',
						   params: {handle: 'web', action: 'update', func: '', table: 'crm_customer', values:values, where: 'crm_id='+me.selected.get('crm_id')},
						   success: function(response, opts) {
								Ext.getBody().unmask();
								
								if (response.responseText == '0') {
								  Ext.MessageBox.alert('Status', 'Error !', function() {});
								  return;
								}

								if (me.autoClose)
									me.win.close();
								if (me.level == 'customer' && campaigns_static.length > 0)							
									new OCS.CustomerCampaignWindowCheckList({
										crm_id: response.responseText
									}).show();

								views['corporate'].store.loadPage(1);	
						   },
						   failure: function(response, opts) {										   
							  Ext.MessageBox.alert('Status', 'Error !', function() {});
						   }
						});
					} else {						
						values = values.replaceAll("%26", "and7");
						Ext.Ajax.request({
						   url: 'avia.php',
						   params: {handle: 'web', action: 'insert', func: '', table: 'crm_customer', values:values},
						   success: function(response, opts) {
								Ext.getBody().unmask();

								if (response.responseText == '0') {
								  Ext.MessageBox.alert('Status', 'Error !', function() {});
								  return;
								}

								if (me.autoClose)
									me.win.close();
								if (me.level == 'customer' && campaigns_static.length > 0)							
									new OCS.CustomerCampaignWindowCheckList({
										crm_id: response.responseText
									}).show();

								views['corporate'].store.loadPage(1);	
						   },
						   failure: function(response, opts) {										   
							  Ext.MessageBox.alert('Status', 'Error !', function() {});
						   }
						});
					}
				}
			}
		}];


		me.callParent(arguments);
	}
});

Ext.define('OCS.ContactForm', {
	extend: 'Ext.form.Panel',
	border: false,
	region: 'center',
	height: 410,
	autoScroll: true,
	closeAction: 'hide',	
	split: true,
	bodyPadding: '10 10 0',	
	fieldDefaults: {
		labelAlign: 'right',
		labelWidth: 70,
		msgTarget: 'qtip'
	},

	constructor: function(cnfg) {
        this.callParent(arguments);
        this.initConfig(cnfg);	
    },		
	
	onTextFieldChange: function(v) {
		var me = this;			
		if (v && 1==0) {
			me.duplicateCheck = true;
			me.query = v;
			views['retail'].store.getProxy().extraParams = {handle: 'web', action: 'select', func: me.func, query: me.query};
			views['retail'].store.loadPage(1, {callback: function() {
				if (me.up().down("#customer_duplicate_warning")) {												
					if (me.duplicateCheck && views['retail'].store.getCount() > 0)						
						me.up().down("#customer_duplicate_warning").setText('Ижил мэдээлэл '+views['retail'].store.getTotalCount()+' ширхэг байна !');
					else
						me.up().down("#customer_duplicate_warning").setText('');
				}
			}});
		} else {
			me.duplicateCheck = false;
			views['retail'].store.getProxy().extraParams = {handle: 'web', action: 'select', func: me.func};
			views['retail'].store.loadPage(1);
		}
	},

	
	convertLatin: function(value, value1) {
		if (typeof value == 'undefined') value = '';
		if (typeof value1 == 'undefined') value1 = '';
		
		value = value.toLowerCase();
		value1 = value1.toLowerCase();
		value = value.trim();
		value1 = value1.trim();

		chrs = [];
		chrs['а'] = 'a';chrs['ж'] = 'j';chrs['ө'] = 'u';chrs['ц'] = 'ts';chrs['ю'] = 'yu';
		chrs['б'] = 'b';chrs['и'] = 'i';chrs['п'] = 'p';chrs['ч'] = 'ch';chrs['я'] = 'ya';
		chrs['в'] = 'v';chrs['й'] = 'i';chrs['р'] = 'r';chrs['ш'] = 'sh';chrs['ф'] = 'f';
		chrs['г'] = 'g';chrs['к'] = 'k';chrs['с'] = 's';chrs['щ'] = 'sch';
		chrs['д'] = 'd';chrs['л'] = 'l';chrs['т'] = 't';chrs['ь'] = 'i';
		chrs['е'] = 'е';chrs['м'] = 'm';chrs['у'] = 'u';chrs['ъ'] = 'i';
		chrs['ё'] = 'yo';chrs['н'] = 'n';chrs['ү'] = 'u';chrs['ы'] = 'i';
		chrs['з'] = 'z';chrs['о'] = 'o';chrs['х'] = 'kh';chrs['э'] = 'e';
		chrs['.'] = '.';chrs['-'] = '-';;chrs[' '] = ' ';
		
		v1 = ''; v2 = '';
		if (value.length > 0)
		{
			for (i = 0; i < value.length; i++) {
				if (chrs[value.charAt(i)])
					v1 = v1 + chrs[value.charAt(i)];
				else
					v1 = v1 + value.charAt(i);
			}
		}

		if (value1.length > 0)
		{		
			for (i = 0; i < value1.length; i++) {
				if (chrs[value1.charAt(i)])
					v2 = v2 + chrs[value1.charAt(i)];
				else
					v2 = v2 + value1.charAt(i);
			}
		}

		return v1.toUpperCase()+' '+v2.toUpperCase(); //this.capitalise(v1)+' '+this.capitalise(v2);
	},


	initComponent: function() {
		var me = this;	
		var name = '';
		if (me.record.data['crm_name'])
			name = me.record.data['crm_name'].split(',')[0];
		else
			name = me.record.data['firstName'];

		var companyName = name;
		if (name.indexOf('<g>') != -1) {
			companyName = name.substring(name.indexOf('<g>')+3, name.indexOf('</g'));			
			companyName = companyName.trim();
		}
		me.crm_id = 0;
		if (me.record)
			me.parent_crm_id = me.record.data['crm_id'];

		me.items = [{
				xtype: 'fieldset',
				title: 'Үндсэн мэдээлэл',
				collapsible: true,
				defaultType: 'textfield',
				layout: 'anchor',
				defaults: {
					anchor: '100%',
					margin: '20 20 20 20'
				},
				items: [{
					xtype: 'fieldcontainer',
					fieldLabel: 'Contact',
					layout: 'hbox',
					combineErrors: true,
					defaultType: 'textfield',
					defaults: {
						hideLabel: 'true'
					},
					items: [{
						id: 'firstName',
						name: 'firstName',
						fieldLabel: 'Нэр',
						flex: 0.5,
						value: '',
						focused: true,
						maskRe : /[а-яөүА-ЯӨҮёЁ]/,
						emptyText: 'Нэр',
						allowBlank: false,
						listeners: {
							keyup: {
								element: 'el',
								fn: function() {
									me.firstName = Ext.getCmp('contact_form').getForm().findField('firstName').getValue();
									me.lastName = Ext.getCmp('contact_form').getForm().findField('lastName').getValue();
									Ext.getCmp('contact_form').getForm().findField("engName").setValue(me.convertLatin(me.firstName, me.lastName));
								},
								scope: this,
								buffer: 100
							},
							afterrender: function(field) {
								field.focus();
							}
						}
					},{
						id: 'lastName',
						name: 'lastName',
						fieldLabel: 'Овог',
						flex: 0.5,
						value: '',
						margins: '0 0 0 6',
						maskRe : /[а-яөүА-ЯӨҮёЁ]/,
						emptyText: 'Овог',
						allowBlank: true,
						listeners: {
							keyup: {
								element: 'el',
								fn: function() {
									me.firstName = Ext.getCmp('contact_form').getForm().findField('firstName').getValue();
									me.lastName = Ext.getCmp('contact_form').getForm().findField('lastName').getValue();
									Ext.getCmp('contact_form').getForm().findField("engName").setValue(me.convertLatin(me.firstName, me.lastName));									
								},
								scope: this,
								buffer: 100
							},
							afterrender: function(field) {
								field.focus();
							}
						}
					},{
						name: 'engName',
						fieldLabel: 'engName',
						flex: 0.5,
						margins: '0 0 0 6',
						emptyText: 'Латин'
					},{
						name: 'gender',
						width: 60,
						emptyText: 'Хүйс',
						margins: '0 0 0 6',
						xtype: 'combo',
						store: Ext.create('Ext.data.Store', {
						  model: 'CRM_ITEM',
						  data: [{value: 'эр'},{value: 'эм'}]
						}),
						queryMode: 'local',
						displayField: 'value',
						value: 'эр',
						valueField: 'value',
						triggerAction: 'all',
						editable: false
					}]
				}, {
					xtype: 'container',
					layout: 'hbox',
					defaultType: 'textfield',
					items: [{
						fieldLabel: 'И-майл',
						name: 'email',
						vtype: 'email',
						maxLength: 60,
						flex: 0.5
					}, {
						id: 'phone',
						fieldLabel: 'Утас 1',
						labelWidth: 60,
						name: 'phone',
						width: 160,
						emptyText: 'xxxxxxxx',
						maxLength: 8,
						maskRe: /[\d\-]/,
						regex: /^\d{8}$/,
						allowBlank: false,
						regexText: 'Must be in the format xxx-xxx-xxxx',
						listeners: {
							keyup: {
								element: 'el',
								fn: function(e) {
//									me.onTextFieldChange(Ext.getCmp('contact_form').getForm().findField('phone1').getValue(), 'phone');
								},
								scope: this,
								buffer: 100
							}
						}
					},{
						name: 'source',
						labelWidth: 50,
						flex: 0.5,
						fieldLabel: 'Эх сурвалж',
						margins: '0 0 0 6',
						xtype: 'combo',
						value: 'employee referral',
						store: Ext.create('Ext.data.Store', {
						  model: 'CRM_ITEM',
						  data: [{value: 'partner'},{value: 'employee referral'},{value: 'external referral'},{value: 'public relations'},{value: 'party'},{value: 'advertisement'},{value: 'cold call'},{value: 'web research'}]
						}),							  
						queryMode: 'local',
						displayField: 'value',
						valueField: 'value',
						triggerAction: 'all',
						editable: true
					}]
				}, {
					xtype: 'container',
					layout: 'hbox',
					defaultType: 'textfield',
					items: [{
						fieldLabel: 'Түвшин',
						xtype: 'combo',
						value: 'suspect',
						name: 'level',
						store: Ext.create('Ext.data.Store', {
						  model: 'CRM_ITEM',
						  data: [{value: 'customer'},{value: 'prospect'},{value: 'suspect'}]
						}),
						queryMode: 'local',
						displayField: 'value',
						valueField: 'value',
						hidden: true,
						triggerAction: 'all',
						editable: false,
						flex: 0.5
					},{
						fieldLabel: 'Ранк',
						xtype: 'combo',
						allowBlank: false,
						name: 'decision_maker',
						store: Ext.create('Ext.data.Store', {
						  model: 'CRM_ITEM',
						  data: [{value: 'manager'}, {value: 'decision maker'}]
						}),
						queryMode: 'local',
						displayField: 'value',
						valueField: 'value',
						triggerAction: 'all',
						editable: false,
						flex: 0.6
					},{
						fieldLabel: 'Н.Байдал',
						xtype: 'combo',
						value: 'ажилладаг',
						name: 'work_status',
						store: Ext.create('Ext.data.Store', {
						  model: 'CRM_ITEM',
						  data: [{value: 'ажилладаг'},{value: 'сурдаг'},{value: 'тэтгэвэрт'},{value:'бусад'}]
						}),
						queryMode: 'local',
						displayField: 'value',
						valueField: 'value',
						triggerAction: 'all',
						hidden: true,
						editable: false,
						flex: 0.5
					},{
						xtype: 'searchcombo',
						name: 'title',
						margins: '0 0 0 6',
						readOnly: true,
						value: companyName,
						flex: 0.75
					},{
						name: 'crm_id',
						margins: '0 0 0 6',
						readOnly: true,
						hidden: true,
						width: 40,
						value: me.crm_id
					},{
						name: 'parent_crm_id',
						margins: '0 0 0 6',
						readOnly: true,
						hidden: true,
						width: 40,
						value: me.parent_crm_id
					},{
						emptyText: 'Албан тушаал',
						xtype: 'searchcombo',
						table: 'crm_customer',
						name: 'job_title',
						margins: '0 0 0 6',
						flex: 0.5
					},{
						hidden: true,
						name: 'userCode',
						value: logged
					},{
						hidden: true,
						name: 'owner',
						value: logged
					}]
				}]
			}
		];

		me.buttons = [{
			text : 'Арилгах',
			iconCls: 'reset',
			handler: function() {
				var form = this.up('form').getForm();
				form.reset();
			}
		},{
			text: 'Илгээх',
			iconCls: 'commit',
			handler: function() {
				var form = this.up('form').getForm();
				if (form.isValid())	{
					var values = form.getValues(true);	
					if (form.findField('crm_id').getValue() > 0) {					
						Ext.Ajax.request({
						   url: 'avia.php',
						   params: {handle: 'web', action: 'update', table: 'crm_customer', func: '', values: "decision_maker='"+me.form.findField('decision_maker').getValue()+"',parent_crm_id="+me.parent_crm_id, fields: '', where: 'crm_id='+form.findField('crm_id').getValue()},
						   success: function(response, opts) {
								if (me.win) me.win.close();
								form.reset();
						   },
						   failure: function(response, opts) {										   
							  Ext.MessageBox.alert('Status', 'Error !', function() {});
						   }
						});
					} else {
						values = values.replaceAll("%26", "and7");
						Ext.Ajax.request({
						   url: 'avia.php',
						   params: {handle: 'web', action: 'insert', table: 'crm_customer', func: '', values: values, fields: '', where: ''},
						   success: function(response, opts) {							   
								if (me.win) me.win.close();
								form.reset();
						   },
						   failure: function(response, opts) {										   
							  Ext.MessageBox.alert('Status', 'Error !', function() {});
						   }
						});
					}
				}
			}
		}];

		me.callParent(arguments);
	}
});


Ext.define('OCS.CustomerCampaignForm', {
	extend: 'Ext.form.Panel',
	border: false,
	region: 'center',
	height: 410,
	autoScroll: true,
	closeAction: 'hide',	
	split: true,
	bodyPadding: '10 10 0',	
	fieldDefaults: {
		labelAlign: 'right',
		labelWidth: 70,
		msgTarget: 'qtip'
	},

	constructor: function(cnfg) {
        this.callParent(arguments);
        this.initConfig(cnfg);	
    },			

	initComponent: function() {
		var me = this;
		
		me.campaign_list = [];
		me.array = campaigns_static.split(":");
		for (i = 0; i < me.array.length; i++) {
			if (me.array[i].length > 0)						
				me.campaign_list.push({
					xtype: 'checkbox',
					boxLabel: me.array[i],
					flex: 1,
					checked: true,
					name: 'checkbox'+i,
					inputValue: me.array[i]
				});
		}

		me.items = [{
				xtype: 'fieldset',
				title: 'Campaings',
				collapsible: true,
				defaultType: 'checkbox',
				layout: 'anchor',
				defaults: {
					anchor: '100%',
					margin: '15 15 15 15'
				},
				items: [{
					xtype: 'container',
					layout: 'vbox',
					defaultType: 'checkbox',
					items: me.campaign_list
				}]
			}
		];

		me.buttons = [{
			text : 'Арилгах',
			iconCls: 'reset',
			handler: function() {
				var form = this.up('form').getForm();
				form.reset();
			}
		},{
			text: 'Илгээх',
			iconCls: 'commit',
			handler: function() {
				var form = this.up('form').getForm();
				if (form.isValid())	{					
					Ext.Ajax.request({
					   url: 'avia.php',
					   params: {handle: 'web', action: 'insert_customer_campaign', table: 'crm_customer_campaigns', func: '', values: form.getValues(true), fields: '', where: me.crm_id},
					   success: function(response, opts) {
						    me.win.close();
							form.reset();
					   },
					   failure: function(response, opts) {										   
						  Ext.MessageBox.alert('Status', 'Error !', function() {});
					   }
					});
				}
			}
		}];

		me.callParent(arguments);
	}
});

Ext.define('OCS.CustomerCompanyForm', {
	extend: 'Ext.form.Panel',
	border: false,
	region: 'center',
	height: 410,
	autoScroll: true,
	closeAction: 'hide',	
	split: true,
	bodyPadding: '10 10 0',	
	fieldDefaults: {
		labelAlign: 'right',
		labelWidth: 70,
		msgTarget: 'qtip'
	},

	constructor: function(cnfg) {
        this.callParent(arguments);
        this.initConfig(cnfg);	
    },			

	initComponent: function() {
		var me = this;
		
		me.company_list = [];
		me.array = company.split(":");
		for (i = 0; i < me.array.length; i++) {
			if (me.array[i].length > 0) {
				me.company_list.push({
					xtype: 'checkbox',
					boxLabel: me.array[i],
					flex: 1,
					checked: (company == me.array[i]),
					name: 'checkbox'+i,
					inputValue: me.array[i]
				});
			}
		}

		me.items = [{
				xtype: 'fieldset',
				title: 'Company list',
				collapsible: true,
				defaultType: 'checkbox',
				layout: 'anchor',
				defaults: {
					anchor: '100%',
					margin: '15 15 15 15'
				},
				items: [{
					xtype: 'container',
					layout: 'vbox',
					defaultType: 'checkbox',
					items: me.company_list
				}]
			}
		];

		me.buttons = [{
			text : 'Арилгах',
			iconCls: 'reset',
			handler: function() {
				var form = this.up('form').getForm();
				form.reset();
			}
		},{
			text: 'Илгээх',
			iconCls: 'commit',
			handler: function() {
				var form = this.up('form').getForm();
				if (form.isValid())	{					
					Ext.Ajax.request({
					   url: 'avia.php',
					   params: {handle: 'web', action: 'insert_customer_company', table: 'crm_customer_company', func: '', values: form.getValues(true), fields: '', where: me.crm_id},
					   success: function(response, opts) {
						    me.win.close();
							form.reset();
					   },
					   failure: function(response, opts) {										   
						  Ext.MessageBox.alert('Status', 'Error !', function() {});
					   }
					});
				}
			}
		}];

		me.callParent(arguments);
	}
});


Ext.define('OCS.ContactFormWithDeal', {
	extend: 'Ext.form.Panel',
	border: false,
	region: 'center',
	height: 410,
	autoScroll: true,
	closeAction: 'hide',	
	split: true,
	bodyPadding: '10 10 0',	
	fieldDefaults: {
		labelAlign: 'right',
		labelWidth: 70,
		msgTarget: 'qtip'
	},

	constructor: function(cnfg) {
        this.callParent(arguments);
        this.initConfig(cnfg);	
    },		
	
	onTextFieldChange: function(v) {
		var me = this;			
		if (v && 1==0) {
			me.duplicateCheck = true;
			me.query = v;
			views['retail'].store.getProxy().extraParams = {handle: 'web', action: 'select', func: me.func, query: me.query};
			views['retail'].store.loadPage(1, {callback: function() {
				if (me.up().down("#customer_duplicate_warning")) {												
					if (me.duplicateCheck && views['retail'].store.getCount() > 0)						
						me.up().down("#customer_duplicate_warning").setText('Ижил мэдээлэл '+views['retail'].store.getTotalCount()+' ширхэг байна !');
					else
						me.up().down("#customer_duplicate_warning").setText('');
				}
			}});
		} else {
			me.duplicateCheck = false;
			views['retail'].store.getProxy().extraParams = {handle: 'web', action: 'select', func: me.func};
			views['retail'].store.loadPage(1);
		}
	},

	
	convertLatin: function(value, value1) {
		if (typeof value == 'undefined') value = '';
		if (typeof value1 == 'undefined') value1 = '';
		
		value = value.toLowerCase();
		value1 = value1.toLowerCase();
		value = value.trim();
		value1 = value1.trim();

		chrs = [];
		chrs['а'] = 'a';chrs['ж'] = 'j';chrs['ө'] = 'u';chrs['ц'] = 'ts';chrs['ю'] = 'yu';
		chrs['б'] = 'b';chrs['и'] = 'i';chrs['п'] = 'p';chrs['ч'] = 'ch';chrs['я'] = 'ya';
		chrs['в'] = 'v';chrs['й'] = 'i';chrs['р'] = 'r';chrs['ш'] = 'sh';chrs['ф'] = 'f';
		chrs['г'] = 'g';chrs['к'] = 'k';chrs['с'] = 's';chrs['щ'] = 'sch';
		chrs['д'] = 'd';chrs['л'] = 'l';chrs['т'] = 't';chrs['ь'] = 'i';
		chrs['е'] = 'е';chrs['м'] = 'm';chrs['у'] = 'u';chrs['ъ'] = 'i';
		chrs['ё'] = 'yo';chrs['н'] = 'n';chrs['ү'] = 'u';chrs['ы'] = 'i';
		chrs['з'] = 'z';chrs['о'] = 'o';chrs['х'] = 'kh';chrs['э'] = 'e';
		chrs['.'] = '.';chrs['-'] = '-';;chrs[' '] = ' ';
		
		v1 = ''; v2 = '';
		if (value.length > 0)
		{
			for (i = 0; i < value.length; i++) {
				if (chrs[value.charAt(i)])
					v1 = v1 + chrs[value.charAt(i)];
				else
					v1 = v1 + value.charAt(i);
			}
		}

		if (value1.length > 0)
		{		
			for (i = 0; i < value1.length; i++) {
				if (chrs[value1.charAt(i)])
					v2 = v2 + chrs[value1.charAt(i)];
				else
					v2 = v2 + value1.charAt(i);
			}
		}

		return v1.toUpperCase()+' '+v2.toUpperCase(); //this.capitalise(v1)+' '+this.capitalise(v2);
	},
		
	initComponent: function() {
		var me = this;	
		me.items = [{
				xtype: 'fieldset',
				title: 'Main information',
				collapsible: true,
				defaultType: 'textfield',
				layout: 'anchor',
				defaults: {
					anchor: '100%',
					margin: '20 20 20 20'
				},
				items: [{
					xtype: 'fieldcontainer',
					fieldLabel: 'Contact',
					layout: 'hbox',
					combineErrors: true,
					defaultType: 'textfield',
					defaults: {
						hideLabel: 'true'
					},
					items: [{
						id: 'firstName',
						name: 'firstName',
						fieldLabel: 'Нэр',
						flex: 0.5,
						value: '',
						focused: true,
						maskRe : /[а-яөүА-ЯӨҮёЁ]/,
						emptyText: 'Нэр',
						allowBlank: false,
						listeners: {
							keyup: {
								element: 'el',
								fn: function() {
									me.firstName = Ext.getCmp('contact_form').getForm().findField('firstName').getValue();
									me.lastName = Ext.getCmp('contact_form').getForm().findField('lastName').getValue();
									Ext.getCmp('contact_form').getForm().findField("engName").setValue(me.convertLatin(me.firstName, me.lastName));
								},
								scope: this,
								buffer: 100
							},
							afterrender: function(field) {
								field.focus();
							}
						}
					},{
						id: 'lastName',
						name: 'lastName',
						fieldLabel: 'Нэр',
						flex: 0.5,
						value: '',
						margins: '0 0 0 6',
						maskRe : /[а-яөүА-ЯӨҮёЁ]/,
						emptyText: 'Овог',
						allowBlank: true,
						listeners: {
							keyup: {
								element: 'el',
								fn: function() {
									me.firstName = Ext.getCmp('contact_form').getForm().findField('firstName').getValue();
									me.lastName = Ext.getCmp('contact_form').getForm().findField('lastName').getValue();
									Ext.getCmp('contact_form').getForm().findField("engName").setValue(me.convertLatin(me.firstName, me.lastName));									
								},
								scope: this,
								buffer: 100
							},
							afterrender: function(field) {
								field.focus();
							}
						}
					},{
						name: 'engName',
						fieldLabel: 'engName',
						flex: 0.5,
						margins: '0 0 0 6',
						emptyText: 'Latin'
					},{
						name: 'gender',
						width: 60,
						emptyText: 'Gender',
						margins: '0 0 0 6',
						xtype: 'combo',
						store: Ext.create('Ext.data.Store', {
						  model: 'CRM_ITEM',
						  data: [{value: 'эр'},{value: 'эм'}]
						}),
						queryMode: 'local',
						displayField: 'value',
						value: 'эр',
						valueField: 'value',
						triggerAction: 'all',
						editable: false
					}]
				}, {
					xtype: 'container',
					layout: 'hbox',
					defaultType: 'textfield',
					items: [{
						fieldLabel: 'Email',
						name: 'email',
						vtype: 'email',
						maxLength: 60,
						flex: 0.5
					}, {
						id: 'phone',
						fieldLabel: 'Phone 1',
						labelWidth: 60,
						name: 'phone',
						width: 160,
						emptyText: 'xxxxxxxx',
						maxLength: 8,
						maskRe: /[\d\-]/,
						regex: /^\d{8}$/,
						allowBlank: false,
						regexText: 'Must be in the format xxx-xxx-xxxx',
						listeners: {
							keyup: {
								element: 'el',
								fn: function(e) {
//									me.onTextFieldChange(Ext.getCmp('contact_form').getForm().findField('phone1').getValue(), 'phone');
								},
								scope: this,
								buffer: 100
							}
						}
					},{
						name: 'source',
						labelWidth: 50,
						flex: 0.5,
						fieldLabel: 'Source',
						margins: '0 0 0 6',
						xtype: 'combo',
						value: 'employee referral',
						store: Ext.create('Ext.data.Store', {
						  model: 'CRM_ITEM',
						  data: [{value: 'partner'},{value: 'employee referral'},{value: 'external referral'},{value: 'public relations'},{value: 'party'},{value: 'advertisement'},{value: 'cold call'},{value: 'web research'}]
						}),							  
						queryMode: 'local',
						displayField: 'value',
						valueField: 'value',
						triggerAction: 'all',
						editable: false
					}]
				}, {
					xtype: 'container',
					layout: 'hbox',
					defaultType: 'textfield',
					items: [{
						fieldLabel: 'Level',
						xtype: 'combo',
						value: 'suspect',
						name: 'level',
						store: Ext.create('Ext.data.Store', {
						  model: 'CRM_ITEM',
						  data: [{value: 'customer'},{value: 'prospect'},{value: 'suspect'}]
						}),
						queryMode: 'local',
						displayField: 'value',
						valueField: 'value',
						hidden: true,
						triggerAction: 'all',
						editable: false,
						flex: 0.5
					},{
						fieldLabel: 'Rank',
						xtype: 'combo',
						allowBlank: false,
						name: 'decision_maker',
						store: Ext.create('Ext.data.Store', {
						  model: 'CRM_ITEM',
						  data: [{value: 'manager'}, {value: 'decision maker'}]
						}),
						queryMode: 'local',
						displayField: 'value',
						valueField: 'value',
						triggerAction: 'all',
						editable: false,
						flex: 0.6
					},{
						fieldLabel: 'Social status',
						xtype: 'combo',
						value: 'ажилладаг',
						name: 'work_status',
						store: Ext.create('Ext.data.Store', {
						  model: 'CRM_ITEM',
						  data: [{value: 'ажилладаг'},{value: 'сурдаг'},{value: 'тэтгэвэрт'},{value:'бусад'}]
						}),
						queryMode: 'local',
						displayField: 'value',
						valueField: 'value',
						triggerAction: 'all',
						hidden: true,
						editable: false,
						flex: 0.5
					},{
						xtype: 'searchcombo',
						name: 'title',
						margins: '0 0 0 6',
						readOnly: true,
						value: '',
						flex: 0.75
					},{
						name: 'crm_id',
						margins: '0 0 0 6',
						readOnly: true,
						hidden: true,
						width: 40,
						value: '0'
					},{
						name: 'parent_crm_id',
						margins: '0 0 0 6',
						readOnly: true,
						hidden: true,
						width: 40,
						value: '0'
					},{
						emptyText: 'Position',
						xtype: 'searchcombo',
						table: 'crm_customer',
						name: 'job_title',
						margins: '0 0 0 6',
						flex: 0.5
					},{
						hidden: true,
						name: 'userCode',
						value: logged
					},{
						hidden: true,
						name: 'owner',
						value: logged
					}]
				}]
			}
		];

		me.buttons = [{
			text : 'Арилгах',
			iconCls: 'reset',
			handler: function() {
				var form = this.up('form').getForm();
				form.reset();
			}
		},{
			text: 'Commit with Deal',
			iconCls: 'commit',
			handler: function() {
				var form = this.up('form').getForm();
				if (form.isValid())	{
					var values = form.getValues(true);	
					if (form.findField('crm_id').getValue() > 0) {					
						Ext.Ajax.request({
						   url: 'avia.php',
						   params: {handle: 'web', action: 'update', table: 'crm_customer', func: '', values: "decision_maker='"+me.form.findField('decision_maker').getValue()+"',parent_crm_id="+me.parent_crm_id, fields: '', where: 'crm_id='+form.findField('crm_id').getValue()},
						   success: function(response, opts) {
								if (me.win) me.win.close();
								form.reset();
						   },
						   failure: function(response, opts) {										   
							  Ext.MessageBox.alert('Status', 'Error !', function() {});
						   }
						});
					} else {
						Ext.Ajax.request({
						   url: 'avia.php',
						   params: {handle: 'web', action: 'insert', table: 'crm_customer', func: '', values: values, fields: '', where: ''},
						   success: function(response, opts) {
								if (me.win) me.win.close();
								form.reset();
						   },
						   failure: function(response, opts) {										   
							  Ext.MessageBox.alert('Status', 'Error !', function() {});
						   }
						});
					}
				}
			}
		}];

		me.callParent(arguments);
	}
});

Ext.define('OCS.CompotetorForm', {
	extend: 'Ext.form.Panel',
	border: false,
	region: 'center',
	height: 410,
	autoScroll: true,
	closeAction: 'hide',	
	split: true,
	bodyPadding: '10 10 0',	
	fieldDefaults: {
		labelAlign: 'right',
		labelWidth: 70,
		msgTarget: 'qtip'
	},

	constructor: function(cnfg) {
        this.callParent(arguments);
        this.initConfig(cnfg);	
    },		
	
	onTextFieldChange: function(v) {
		var me = this;			
		if (v && 1==0) {
			me.duplicateCheck = true;
			me.query = v;
			views['corporate'].store.getProxy().extraParams = {handle: 'web', action: 'select', func: me.func, query: me.query};
			views['corporate'].store.loadPage(1, {callback: function() {
				if (me.up().down("#customer_duplicate_warning")) {												
					if (me.duplicateCheck && views['corporate'].store.getCount() > 0)						
						me.up().down("#customer_duplicate_warning").setText('Ижил мэдээлэл '+views['corporate'].store.getTotalCount()+' ширхэг байна !');
					else
						me.up().down("#customer_duplicate_warning").setText('');
				}
			}});
		} else {
			me.duplicateCheck = false;
			views['corporate'].store.getProxy().extraParams = {handle: 'web', action: 'select', func: me.func};
			views['corporate'].store.loadPage(1);
		}
	},

	convertLatin: function(value) {
		value = value.toLowerCase();

		chrs = [];
		chrs['а'] = 'a';chrs['ж'] = 'j';chrs['ө'] = 'u';chrs['ц'] = 'ts';chrs['ю'] = 'yu';
		chrs['б'] = 'b';chrs['и'] = 'i';chrs['п'] = 'p';chrs['ч'] = 'ch';chrs['я'] = 'ya';
		chrs['в'] = 'v';chrs['й'] = 'i';chrs['р'] = 'r';chrs['ш'] = 'sh';chrs['ф'] = 'f';
		chrs['г'] = 'g';chrs['к'] = 'k';chrs['с'] = 's';chrs['щ'] = 'sch';
		chrs['д'] = 'd';chrs['л'] = 'l';chrs['т'] = 't';chrs['ь'] = 'i';
		chrs['е'] = 'е';chrs['м'] = 'm';chrs['у'] = 'u';chrs['ъ'] = 'i';
		chrs['ё'] = 'yo';chrs['н'] = 'n';chrs['ү'] = 'u';chrs['ы'] = 'i';
		chrs['з'] = 'z';chrs['о'] = 'o';chrs['х'] = 'kh';chrs['э'] = 'e';
		chrs['.'] = '.';chrs['-'] = '-'; chrs[' '] = ' ';
		
		v1 = '';
		for (i = 0; i < value.length; i++) {
			if (chrs[value.charAt(i)])						
				v1 = v1 + chrs[value.charAt(i)];
			else
				v1 = v1 + value.charAt(i);
		}

		return v1.toUpperCase(); //this.capitalise(v1)+' '+this.capitalise(v2);
	},


	initComponent: function() {
		var me = this;
		var name = me.record.get('firstName');

		me.items = [{
				xtype: 'fieldset',
				title: 'Main information',
				collapsible: true,
				defaultType: 'textfield',
				layout: 'anchor',
				defaults: {
					anchor: '100%',
					margin: '20 20 20 20'
				},
				items: [{
					xtype: 'fieldcontainer',
					fieldLabel: 'Account',
					layout: 'hbox',
					combineErrors: true,
					defaultType: 'textfield',
					defaults: {
						hideLabel: 'true'
					},
					items: [{
						id: 'firstName',
						name: 'firstName',
						fieldLabel: 'Name',
						flex: 0.5,
						value: '',
						focused: true,
						maskRe : /[а-яөүА-ЯӨҮ]/,
						emptyText: 'Нэр',
						allowBlank: false,
						listeners: {
							keyup: {
								element: 'el',
								fn: function() {
									me.firstName = Ext.getCmp('contact_form').getForm().findField('firstName').getValue();
									me.lastName = Ext.getCmp('contact_form').getForm().findField('lastName').getValue();
									Ext.getCmp('contact_form').getForm().findField("engName").setValue(me.convertLatin(me.firstName, me.lastName));
								},
								scope: this,
								buffer: 100
							},
							afterrender: function(field) {
								field.focus();
							}
						}
					},{
						id: 'lastName',
						name: 'lastName',
						fieldLabel: 'Нэр',
						flex: 0.5,
						value: '',
						margins: '0 0 0 6',
						maskRe : /[а-яөүА-ЯӨҮ]/,
						emptyText: 'Group',
						allowBlank: false,
						listeners: {
							keyup: {
								element: 'el',
								fn: function() {
									me.firstName = Ext.getCmp('contact_form').getForm().findField('firstName').getValue();
									me.lastName = Ext.getCmp('contact_form').getForm().findField('lastName').getValue();
									Ext.getCmp('contact_form').getForm().findField("engName").setValue(me.convertLatin(me.firstName, me.lastName));									
								},
								scope: this,
								buffer: 100
							},
							afterrender: function(field) {
								field.focus();
							}
						}
					},{
						name: 'engName',
						fieldLabel: 'engName',
						flex: 0.5,
						margins: '0 0 0 6',
						emptyText: 'Latin'
					},{
						name: 'company_torol',
						width: 60,
						emptyText: 'Company type',
						margins: '0 0 0 6',
						xtype: 'combo',
						value: 'ХХК',
						store: Ext.create('Ext.data.Store', {
						  model: 'CRM_ITEM',
						  data: [{value: 'ХХК'},{value: 'ХК'},{value: 'ТӨХК'},{value: 'ТББ'},{value: 'ББСБ'},{value: 'ТӨҮГ'},{value: 'ОНӨҮГ'},{value: 'ХЗХ'}]
						}),
						queryMode: 'local',
						displayField: 'value',
						valueField: 'value',
						triggerAction: 'all',
						editable: false
					}]
				}, {
					xtype: 'container',
					layout: 'hbox',
					defaultType: 'textfield',
					items: [{
						fieldLabel: 'Web',
						name: 'www',
//						vtype: 'url',
						maxLength: 32,
						flex: 0.5
					}, {
						name: 'source',
						labelWidth: 50,
						flex: 0.5,
						fieldLabel: 'Source',
						margins: '0 0 0 6',
						xtype: 'combo',
						value: 'employee referral',
						store: Ext.create('Ext.data.Store', {
						  model: 'CRM_ITEM',
						  data: [{value: 'partner'},{value: 'employee referral'},{value: 'external referral'},{value: 'public relations'},{value: 'party'},{value: 'advertisement'},{value: 'cold call'},{value: 'web research'}]
						}),							  
						queryMode: 'local',
						displayField: 'value',
						valueField: 'value',
						triggerAction: 'all',
						editable: false
					}]
				}, {
					xtype: 'container',
					layout: 'hbox',
					defaultType: 'textfield',
					items: [{
						fieldLabel: 'Level',
						xtype: 'combo',
						value: 'suspect',
						name: 'level',
						store: Ext.create('Ext.data.Store', {
						  model: 'CRM_ITEM',
						  data: [{value: 'customer'},{value: 'prospect'},{value: 'suspect'}]
						}),
						queryMode: 'local',
						displayField: 'value',
						valueField: 'value',
						hidden: true,
						triggerAction: 'all',
						editable: false,
						flex: 0.5
					}]
				}]
			}
		];

		me.buttons = [{
			itemId: 'customer_duplicate_warning',
			xtype: 'tbtext',
			text: '',
			cls: 'warning'
		},'->',{
			text : 'Арилгах',
			iconCls:'reset',
			handler: function() {
				var form = this.up('form').getForm();
				form.reset();
			}
		},{
			text: 'Илгээх',
			iconCls:'commit',
			handler: function() {
				var form = this.up('form').getForm();
				if (form.isValid())	{
					var values = form.getValues(true);	
					
					Ext.Ajax.request({
					   url: 'avia.php',
					   params: {handle: 'web', action: 'insert', table: 'crm_customer', func: '', values: values, fields: '', where: ''},
					   success: function(response, opts) {
						    Ext.MessageBox.alert('Status', 'Success !', function() {});
							form.reset();
					   },
					   failure: function(response, opts) {										   
						  Ext.MessageBox.alert('Status', 'Error !', function() {});
					   }
					});
				}
			}
		}];

		me.callParent(arguments);
	}
});



Ext.define('OCS.UploadForm', {
	extend: 'Ext.form.Panel',
	border: false,
	region: 'center',
	width: 480,
	height: 210,
	bodyPadding: '10 10 0',	

	constructor: function(cnfg) {
        this.callParent(arguments);
        this.initConfig(cnfg);	
    },				

	initComponent: function() {
		var me = this;

		me.items = [{
			id: 'upload-name',
			name: 'upload-name',
            xtype: 'textfield',
            fieldLabel: 'Name',
			value: this.name,
			width: 430
        },{
            xtype: 'filefield',
            id: 'form-file',
            emptyText: 'Select an file',
            fieldLabel: 'File',
            name: 'xls-path',
			width: 430,
            buttonText: '',
            buttonConfig: {
                iconCls: 'upload-icon'
            }
        }];
		
		me.buttons = [{
            text: 'Импорт',
			iconCls: 'commit',
            handler: function(){
                var form = this.up('form').getForm();
                if(form.isValid()){
                    form.submit({
                        url: 'avia.php',
						params: {handle: 'file', action:'import', where: form.findField('upload-name').getValue()},
                        waitMsg: 'Uploading your data...',
						headers: {
							'MSISDN': '19840717703599101790'
						},
						standardSubmit: false,
                        success: function(fp, o) {
							var data = Ext.decode(o.response.responseText);
							me.win.close();
                  			Ext.MessageBox.alert('Status', data.msg, function() {
								if (me.name == 'Contact')								
									views['retail'].store.loadPage(1);
								if (me.name == 'Account')								
									views['corporate'].store.loadPage(1);
								if (me.name == 'Deal')								
									views['deals'].reload();
							});
                        },
						failure: function(form, action) {
							alert('failed');
						}
                    });
                }
            }
        },{
			text: 'Download template',
			iconCls: '',
			handler: function() {
				if (me.name == 'Contact')
					window.open('tmpl/contact.xls');
				if (me.name == 'Account')								
					window.open('tmpl/account.xls');
				if (me.name == 'Deal')								
					window.open('tmpl/account.xls');
				if (me.name == 'Storage')								
					window.open('tmpl/storage.xls');
				if (me.name == 'Product')								
					window.open('tmpl/product.xls');
			}
		},{
            text: 'Арилгах',
			iconCls: 'reset',
            handler: function() {
                this.up('form').getForm().reset();
            }
        }];

		me.callParent(arguments);
	}
});

Ext.define('OCS.UploadImageForm', {
	extend: 'Ext.form.Panel',
	border: false,
	region: 'center',
	width: 480,
	height: 210,
	bodyPadding: '10 10 0',	

	constructor: function(cnfg) {
        this.callParent(arguments);
        this.initConfig(cnfg);	
    },				

	initComponent: function() {
		var me = this;

		me.items = [{
			id: 'upload-name',
			name: 'upload-name',
            xtype: 'textfield',
            fieldLabel: 'Name',
			value: me.selected.get(product_image_field),
			width: 430
        },{
            xtype: 'filefield',
            id: 'form-file',
            emptyText: 'Select an file',
            fieldLabel: 'File',
            name: 'file-path',
			width: 430,
            buttonText: '',
            buttonConfig: {
                iconCls: 'upload-icon'
            }
        }];
		
		me.buttons = [{
            text: 'Импорт',
			iconCls: 'commit',
            handler: function(){
                var form = this.up('form').getForm();
                if(form.isValid()){
                    form.submit({
                        url: 'avia.php',
						params: {handle: 'file', action:'image_upload', where: form.findField('upload-name').getValue()},
                        waitMsg: 'Uploading your data...',
						headers: {
							'MSISDN': '19840717703599101790'
						},
						standardSubmit: false,
                        success: function(fp, o) {
							var data = Ext.decode(o.response.responseText);
							me.win.close();
                  			Ext.MessageBox.alert('Status', data.msg, function() {
							});
                        },
						failure: function(form, action) {
							alert('failed');
						}
                    });
                }
            }
        },{
            text: 'Арилгах',
			iconCls: 'reset',
            handler: function() {
                this.up('form').getForm().reset();
            }
        }];

		me.callParent(arguments);
	}
});

Ext.define('OCS.UploadManImageForm', {
	extend: 'Ext.form.Panel',
	border: false,
	region: 'center',
	width: 480,
	height: 210,
	bodyPadding: '10 10 0',	

	constructor: function(cnfg) {
        this.callParent(arguments);
        this.initConfig(cnfg);	
    },				

	initComponent: function() {
		var me = this;

		me.items = [{
			id: 'upload-name',
			name: 'upload-name',
            xtype: 'textfield',
            fieldLabel: 'Name',
			value: me.selected.get('owner'),
			width: 430
        },{
            xtype: 'filefield',
            id: 'form-file',
            emptyText: 'Select an file',
            fieldLabel: 'File',
            name: 'file-path',
			width: 430,
            buttonText: '',
            buttonConfig: {
                iconCls: 'upload-icon'
            }
        }];
		
		me.buttons = [{
            text: 'Импорт',
			iconCls: 'commit',
            handler: function(){
                var form = this.up('form').getForm();
                if(form.isValid()){
                    form.submit({
                        url: 'avia.php',
						params: {handle: 'file', action:'image_upload', where: form.findField('upload-name').getValue()},
                        waitMsg: 'Uploading your data...',
						headers: {
							'MSISDN': '19840717703599101790'
						},
						standardSubmit: false,
                        success: function(fp, o) {
							var data = Ext.decode(o.response.responseText);
							me.win.close();
                  			Ext.MessageBox.alert('Status', data.msg, function() {
							});
                        },
						failure: function(form, action) {
							alert('failed');
						}
                    });
                }
            }
        },{
            text: 'Арилгах',
			iconCls: 'reset',
            handler: function() {
                this.up('form').getForm().reset();
            }
        }];

		me.callParent(arguments);
	}
});

Ext.define('OCS.MergeRecordForm', {
	extend: 'Ext.form.Panel',
	border: false,
	region: 'center',
	autoScroll: true,
	bodyPadding: '10 10 0',		
	table: 'crm_customer',
	key: 'crm_id',

	constructor: function(cnfg) {
        this.callParent(arguments);
        this.initConfig(cnfg);	
    },				

	initComponent: function() {
		var me = this;
		me.fields = '';
		if (me.name == 'Contact')				
			me.fields = 'firstName,lastName,gender,regNo,work_status,title,job_title,phone,phone1,email,country,city,district,horoo,address,descr,source';
		else
		if (me.name == 'Account')		
			me.fields = 'firstName,lastName,company_torol,regNo,industry,industry_sub,capital,annual_revenue,tatvar,phone,phone1,fax,email,www,country,city,district,horoo,address,descr,source';
		else
		if (me.name == 'Product') {
			me.fields = 'product_name,product_type,price';
			me.table = 'crm_products';
			me.key = 'product_id';
		}
		else
		if (me.name == 'Service') {
			me.fields = 'subject';
			me.table = 'crm_services';
			me.key = 'service_id';
		}

		me.fs = me.fields.split(',');
		me.items = [];
		for (i = 0; i < me.fs.length; i++) {
			me.items[i] = {
				xtype: 'radiogroup',
				fieldLabel: me.fs[i],	
				items: [
					{boxLabel: me.master.get(me.fs[i]), name: me.fs[i], labelAlign: 'right', inputValue: me.master.get(me.fs[i]), checked: true},
					{boxLabel: me.slave.get(me.fs[i]), name: me.fs[i], inputValue: me.slave.get(me.fs[i])}
				]
			};
		}
		
		me.buttons = [{
            text: 'Илгээх',
			iconCls: 'commit',
            handler: function(){
                var form = this.up('form').getForm();
                if(form.isValid()){
					var values = '';
					for (i = 0; i < me.fs.length; i++) {
						values += me.fs[i]+"='"+form.findField(me.fs[i]).getGroupValue()+"',";
					}

					values = values.substring(0, values.length - 1);
					Ext.Ajax.request({
					   url: 'avia.php',					   
					   params : {handle: 'web', action: 'merge_records', func: '', table: me.table, values:values, where: me.master.get(me.key)+','+me.slave.get(me.key)},
					   success: function(response, opts) {						  
						  Ext.MessageBox.alert('Status', 'Success !', function() {							
							  views[pk].store.loadPage(1);
							  me.win.close();
						  });
					   },
					   failure: function(response, opts) {										   
						  Ext.MessageBox.alert('Status', 'Error !', function() {});
					   }
					});		

					
                }
            }
        },{
            text: 'Арилгах',
			iconCls: 'reset',
            handler: function() {
                this.up('form').getForm().reset();
            }
        }];

		me.callParent(arguments);
	}
});