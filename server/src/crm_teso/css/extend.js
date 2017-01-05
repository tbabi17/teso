Ext.define('OCS.Module', {
	modelName: '',
	remoteSort : true,
	func : '',
	where: '',
	values: '',
	sortField: '',
	sortDirection: 'DESC',
	groupField: '',
	autoSelect: false,
	duplicateCheck: false,
	dateField: '_date',
	tab: '',
	title: '',
	primaryFields: '',
	highlights: {},

	createStore: function() {
		var me = this;
		me.store = Ext.create('Ext.data.Store', {
			model: me.modelName,
			pageSize: 100,
			autoLoad: true,
			remoteSort: me.remoteSort,
			groupField: me.groupField,
			proxy: {				
				type: 'ajax',
    			url: 'avia.php',
				actionMethods: {
					create : 'POST',
					read   : 'POST',
					update : 'POST',
					destroy: 'POST'
				},
    	        reader: {
    	            root:'items',
    	            totalProperty: 'results',
					idProperty: 'id'
    	        },
				writer: {
					root:'items',
    	            totalProperty: 'results',
					encode : false
				},
				simpleSortMode: true,
				extraParams: {handle: 'web', action: 'select', func: me.func, values: me.values, fields: '', where: me.where},
			},
			sorters: [{
				property: me.sortField?me.sortField:'_date',
				direction: me.sortDirection
			}],
			listeners: {
				load : function(store, records, successful, operation, eOpts) {
						if (me.func == 'crm_campaign_list') {
							me.store.each(function(rec){
								campaigns[rec.get('campaign')] = rec;
							});
						}
						
						if (me.func == 'crm_alarm_list' && me.store.getCount() > 0) {
							Ext.getCmp('alarm_window').show();
						}

						if (me.tab) {
							if (Ext.getCmp(me.tab))
								Ext.getCmp(me.tab).setTitle(Ext.String.format(me.title+' ({0})', me.store.getTotalCount()));	

							if (me.where && me.where.indexOf('alldate') != -1 && me.calendar)
							{							
								me.highlights = [];
								me.calendar.selectedDates = me.highlights;
								me.calendar.update(new Date(), true);
								me.store.each(function(rec){
									if (rec.data[me.dateField]) {																	
										var sub = rec.data[me.dateField].substring(0, 10);
										sub = sub.substring(5,7)+'/'+sub.substring(8,10)+'/'+sub.substring(0, 4);
										me.highlights[new Date(sub).getTime()] = 'on';
										me.calendar.selectedDates = me.highlights;
										me.calendar.update(new Date(), true);
									}
								});
							}
						} 											
						
						if (me.func == 'crm_calendar_list' && me.where.indexOf('alldate') != -1) {
							me.highlights = [];
							Ext.getCmp('my_calendar').selectedDates = me.highlights;
							Ext.getCmp('my_calendar').update(new Date(), true);
							me.store.each(function(rec){
								if (rec.data[me.dateField]) {																	
									var sub = rec.data[me.dateField].substring(0, 10);
									sub = sub.substring(5,7)+'/'+sub.substring(8,10)+'/'+sub.substring(0, 4);
									me.highlights[new Date(sub).getTime()] = 'on';
									Ext.getCmp('my_calendar').selectedDates = me.highlights;
									Ext.getCmp('my_calendar').update(new Date(), true);
								}
							});
						}

						if (me.func == 'crm_retail_list') {
							me.store.each(function(rec){
								customers[rec.get('crm_id')] = me.getCustomerName(rec);
								customers[rec.get('phone')] = rec;
							});
						}			
				}				
			}
		});

		me.store.loadPage(1);
	},
	
	loadStore: function() {
		var me = this;
		me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: me.func, values: me.values, where: me.where};
		me.store.loadPage(1);
	},

	createStandardColumns: function() {	
		var me = this;
		var columns = fields[me.modelName+'_FIELDS'];
		var headers = [];
		for (i = 0; i < columns.length; i++) {							
				headers[i] = {					
						hidden	 : columns[i].hidden,	
						text	 : columns[i].text,
						dataIndex: columns[i].name,
						flex	 : columns[i].flex,
						width	 : columns[i].width,
					//	locked	 : columns[i].lock,
						align	 : columns[i].align,
						filter   : columns[i].filter,
						renderer : columns[i].renderer,
						summaryType: columns[i].summaryType,
						summaryRenderer : columns[i].summaryRenderer
				};			

				if (columns[i].primary)
					me.primaryFields += columns[i].name+',';
		}
		
		return headers;
	},

	createColumns: function() {	
		var me = this;
		var columns = fields[me.modelName+'_FIELDS'];
		var headers = [];//Ext.create('Ext.grid.RowNumberer', {width: 32})];
		for (i = 0; i < columns.length; i++) {							
				headers[i] = {				
						hidden	 : columns[i].hidden,	
						text	 : columns[i].text,
						dataIndex: columns[i].name,
						flex	 : columns[i].flex,
						width	 : columns[i].width,
						filter   : columns[i].filter,
						//locked	 : columns[i].lock,
						align	 : columns[i].align,
						renderer : columns[i].renderer,
						summaryType: columns[i].summaryType,
						summaryRenderer : columns[i].summaryRenderer
				};		
				if (columns[i].primary)
					me.primaryFields += columns[i].name+',';						
		}
		
		return headers;
	},
	
	capitalise: function(string) {
	    return string.charAt(0).toUpperCase() + string.slice(1);
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
		chrs['.'] = '.';chrs['-'] = '-';
		
		v = value;
		v1 = '';
		for (i = 0; i < v[0].length; i++)
			v1 = v1 + chrs[v[0].charAt(i)];

		return v1.toUpperCase();//this.capitalise(v1)+' '+this.capitalise(v2);
	},

	getCustomerName: function(rec) {
		if (rec.get('firstName'))
			return rec.get('firstName')+' '+rec.get('lastName');
		else {
			return rec.get('crm_name').split(',')[0];			
		}

//		v = rec.get('level');
//		if (rec.data['_class'] && rec.data['_class'].indexOf('VIP') != -1) v = 'vip';	
//		return '<span class="circle '+v+'">&nbsp;</span> '+rec.get('firstName')+' <span style="color:gray">'+rec.get('lastName')+'</span>';
	},

	selectCustomer: function(rec) {
		var me = this;
		crm_id = rec.get('crm_id');
		selected = rec;
	
		views['property'].updateSource(rec);
		views['activity'].updateSource(rec);
		views['opportunity'].updateSource(rec);
		views['case'].updateSource(rec);
		views['csales'].updateSource(rec);
		if (me.form)
			me.form.loadRecord(rec);			
		Ext.getCmp('customerComponent').setTitle(me.getCustomerName(rec));
	},

	commitRecord: function() {		
		var me = this;
		var values = '', values1 = '';
		var action = 'insert';
		var captcha = '';
		var owner = '';
		me.form.getStore().each(function(rec){
			var name = rec.get('name').substring(2, rec.get('name').length);

			if (me.primaryFields.indexOf(name) != -1) {
				if (rec.get('value') == '')	{
				    Ext.MessageBox.alert('Status', 'Invalid data ! ['+name+']', function() {});
					action = 'fail';
					return;
				}
			}

			values += rec.get('name').substring(2, rec.get('name').length)+'='+me.rawValue(rec)+'&';
			values1 += rec.get('name').substring(2, rec.get('name').length)+"='"+me.rawValue(rec)+"',";
			if (me.table == 'crm_customer' && rec.get('name').substring(2, rec.get('name').length) == 'crm_id' && rec.get('value') != '0')
			{
				action = 'update';
				captcha = 'crm_id='+rec.get('value');
			} else
			if (me.table == 'crm_deals' && rec.get('name').substring(2, rec.get('name').length) == 'deal_id' && rec.get('value') != '0') {
				action = 'update';
				captcha = 'deal_id='+rec.get('value');
			} else
			if (me.table == 'crm_complain' && rec.get('name').substring(2, rec.get('name').length) == 'case_id' && rec.get('value') != '0') {
				action = 'update';
				captcha = 'case_id='+rec.get('value');
			} else
			if (rec.get('name').substring(2, rec.get('name').length) == 'id' && rec.get('value') != '0') {
				action = 'update';
				captcha = 'id='+rec.get('value');
			}

			if (rec.get('name').substring(2, rec.get('name').length) == 'owner') {
				owner = rec.get('value');
			}
        });
		
		if (action == 'fail')
			return;
		
		if (me.form)
			me.form.setVisible(false);				

		if (action == 'insert')
		{		
			values = values.substring(0, values.length - 1);
			Ext.Ajax.request({
			   url: 'avia.php',
			   params: {handle: 'web', action: action, func: me.func, table: me.table, values:values, where: me.where},
			   success: function(response, opts) {
				  Ext.MessageBox.alert('Status', 'Success !', function() {});
  				  me.store.loadPage(1);
			   },
			   failure: function(response, opts) {										   
				  Ext.MessageBox.alert('Status', 'Error !', function() {});
			   }
			});
		} else {				
			values1 = values1.substring(0, values1.length - 1);
			Ext.Ajax.request({
			   url: 'avia.php',
			   params: {handle: 'web', action: action, func: me.func, table: me.table, values:values1, where: captcha},
			   success: function(response, opts) {
				  Ext.MessageBox.alert('Status', 'Success !', function() {});
				  me.store.loadPage(1);									  
				  if (me.grid)				
						me.grid.getSelectionModel().clearSelections();

				  if (me.table == 'crm_users' && logged == owner) {
						Ext.Msg.confirm('Warning','Мэдээлэл өөрчлөгдсөн тул дахин нэвтрэх шаардлагатай !',function(btn){
							if(btn === 'yes'){
								document.location.href = "logout.php";
							} else {
								
							}	
						});		
				  }
			   },
			   failure: function(response, opts) {										   
				  Ext.MessageBox.alert('Status', 'Error !', function() {});
			   }
			});
		}

		me.form.createSource();
	},

	initSource: function() {
	},
	
	updateRecord: function() {		
		var me = this;
		var values = '', values1 = '';
		var action = 'insert';
		var captcha = '';
		me.form.getStore().each(function(rec){
			values += rec.get('name').substring(2, rec.get('name').length)+'='+me.rawValue(rec)+'&';
			values1 += rec.get('name').substring(2, rec.get('name').length)+"='"+me.rawValue(rec)+"',";

			if (me.table == 'crm_customer' && rec.get('name').substring(2, rec.get('name').length) == 'crm_id' && rec.get('value') != '0')
			{
				action = 'update';
				captcha = 'crm_id='+rec.get('value');
			} else
			if (me.table == 'crm_deals' && rec.get('name').substring(2, rec.get('name').length) == 'deal_id' && rec.get('value') != '0')
			{
				action = 'update';
				captcha = 'deal_id='+rec.get('value');
			} else
			if (me.table == 'crm_complain' && rec.get('name').substring(2, rec.get('name').length) == 'case_id' && rec.get('value') != '0')
			{
				action = 'update';
				captcha = 'case_id='+rec.get('value');
			}
        });	
		
		if (action == 'update') {			
			values1 = values1.substring(0, values1.length - 1);
			Ext.Ajax.request({
			   url: 'avia.php',					   
			   params : {handle: 'web', action: action, func: '', table: me.table, values:values1, where: captcha},
			   success: function(response, opts) {
				  Ext.MessageBox.alert('Status', 'Success !', function() {});
				  views['corporate'].store.loadPage(1);
			   },
			   failure: function(response, opts) {										   
				  Ext.MessageBox.alert('Status', 'Error !', function() {});
			   }
			});			
		}
	},

	deleteRecord: function() {		
		var me = this;
		var selection = me.grid.getSelectionModel().getSelection();
		if (selection.length == 0) {
			Ext.MessageBox.alert('Status', 'Not selected !', function() {});
			return;
		}

		if (selection[0].get('owner') != logged && selection[0].get('userCode') != logged) {
			Ext.MessageBox.alert('Status', 'Not available !', function() {});
			return;
		}	

		Ext.Msg.confirm('Warning ','Устгах уу ?',function(btn){
			if(btn === 'yes'){
				var id = selection[0].get(me.primary);
				me.ep = me.store.getProxy().extraParams;				
				me.store.getProxy().extraParams = {handle: 'web', action: 'delete', func: me.func, table: me.table, where: id};
				me.store.load(function(data) {
					me.store.getProxy().extraParams = me.ep;
					me.store.loadPage(1);
				});
			}else{
				
			}	
		});		
	},

	rawValue: function(rec) {
		if (rec.get('name').indexOf('birthday') != -1 || rec.get('name').indexOf('date') != -1 || rec.get('name').substring(2, rec.get('name').length) == 'remind_at') {
			if (rec.get('value').length == 10)
				return rec.get('value');
			if (rec.get('name').substring(2, rec.get('name').length) == '_date')
				return rec.get('value');
		    return Ext.Date.format(rec.get('value'), 'Y-m-d');
		}
		
		value = rec.get('value');
		if (value == '' && 
			(
			 rec.get('name').indexOf('_cost') != -1 || 
			 rec.get('name').indexOf('_revenue') != -1 || 
			 rec.get('name').indexOf('amount') != -1 || 
			 rec.get('name').indexOf('qty') != -1 ||
			 rec.get('name').indexOf('crm_id') != -1 || 
			 rec.get('name').indexOf('tatvar') != -1 || 
			 rec.get('name').indexOf('capital') != -1 || 
			 rec.get('name').indexOf('customer_type') != -1
			)
		   ) {		
			value = '0';
		}
		if (value == null)
			return '';

		return value;
	}
});
	
Ext.define('OSS.SearchCombo', {
    extend  : 'Ext.form.field.ComboBox',
    alias   : 'widget.searchcombo',
	pageSize: 10,
	valueField: 'value',
	displayField: 'value',
    typeAhead: true,
    hideLabel: false,
    hideTrigger:true,
	minChars: 1,
	anchor: '100%',		
	table: 'crm_customer',
	listConfig : {
		loadingText: 'Хайж байна...',
		emptyText: '<span class="search_result">илэрц байхгүй !</span>',
		getInnerTpl: function() {
			return '<span class="search_result">{value}</span>';
		}
	},
	
	constructor: function(cnfg) {
        this.callParent(arguments);
        this.initConfig(cnfg);
    },

	initComponent: function() {
		var me = this;
	
		me.store = Ext.create('Ext.data.Store', {
			pageSize: 10,
			proxy: {
				type: 'ajax',
				url : 'avia.php',
				reader: {
					type:'json',
    	            root:'items',
    	            totalProperty: 'results'
    	        },
				actionMethods: {
					create : 'POST',
					read   : 'POST',
					update : 'POST',
					destroy: 'POST'
				},
				extraParams: {handler: 'web', func: 'crm_query_list', action: 'select', table: me.table, fields: me.name}
			},
			fields: [{name: me.name, name: 'value'}]
		});

		me.callParent(arguments);
	}
});

Ext.define('OCS.GridWithFormPanel', {	
	extend: 'OCS.Module',
	table: '',
	searchBar: true,
	defaultRec: {},
	primary : 'id',
	region: 'center',
	hidden: false,

	constructor: function(config) {
        this.initConfig(config);
        this.callParent(arguments);

		Ext.apply(this, this.initialConfig);	
    },
	
	reload: function() {
		var me = this;
		me.store.loadPage(1);
	},
	
	setDefaultRec: function(rec) {
		var me = this;
		me.defaultRec = rec;
	},

	loadStore: function(where) {
		var me = this;
		me.where = where;
		me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: me.func, values: me.values, where: me.where};
		me.store.loadPage(1);
	},

	onTextFieldChange: function(v, field) {
		var me = this;			
		if (v) {
			me.duplicateCheck = true;
			me.where = v;
			me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: 'crm_retail_list', values: field, where: me.where};
			me.store.loadPage(1);
		} else {
			me.duplicateCheck = false;
			me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: 'crm_retail_list'};
			me.store.loadPage(1);
		}
	},
	
	createGrid: function() {
		var me = this;
		me.createStore();

		me.features = [];
		if (me.groupField) {
			me.features = [{
				ftype: 'grouping',
				groupHeaderTpl: '{columnName}: {name} ({rows.length} бичлэг)',
				hideGroupedHeader: true,
				startCollapsed: true,
				disabled: (me.groupField.length == 0),
				id: 'grouping_'+me.modelName
			}];
		}
				
		me.grid = Ext.create('OCS.GridView', {	
			store: me.store,
			columns: me.createColumns(),
			features: me.features,
			actions: me.createActions(),
			func: me.func,
			hidden: me.hidden,
			listeners : {
				scope: this,
				single: true,
				itemdblclick: function(dv, record, item, index, e) {
					if (me.form)				
						me.form.setVisible(true);	
				}
			}
		});				

		me.grid.getSelectionModel().on({
			selectionchange: function(sm, selections) {
				if (selections.length) {
					me.form.updateSource(selections[0]);
//					me.form.setVisible(true);
				} else {
					me.form.updateSource(me.defaultRec);
					me.form.setVisible(false);
				}				
			},			
			rowselect: function(sm, rowIdx, r) {
				me.form.updateSource(selections[0]);				
			}
		});
		
		me.form = new OCS.PropertyGrid({
			modelName: me.modelName,
			region: 'east',
			hidden: true,
			title: me.title,			
			split: true,
			flex: 0.65,
			closable: true,
			closeAction: 'hide',
			sealedColumns: true,		
			buttons: [{
					iconCls: 'reset',
					text: 'Reset',
					handler: function() {
						me.form.updateSource(me.defaultRec);
					}				
				},'->',{
					iconCls: 'commit',
					text: 'Commit',
					handler: function() {
						me.commitRecord();	
					}
				}
			]
		});
		
		me.initSource();

		me.panel = Ext.create('Ext.panel.Panel', {
			layout: 'border',
			border: false,
			region: me.region,
			items : [me.grid, me.form]	
		});

		return me.panel;
	},

	createActions: function(actions) {
		var me = this;
		me.actions = [
			Ext.create('Ext.Action', {
				iconCls   : 'add',
				text: 'New...',
				handler: function(widget, event) {
					me.form.updateSource(me.defaultRec);
					me.form.setVisible(true);
				}
			}),
			Ext.create('Ext.Action', {
				iconCls   : 'edit',
				text: 'Expand...',
				handler: function(widget, event) {
					me.showForm();
				}
			}),
			Ext.create('Ext.Action', {
				iconCls   : 'delete',
				text: 'Delete',
				handler: function(widget, event) {
					me.deleteRecord();
				}
			})
		];

		return me.actions;
	},
	
	selectionModel: function() {
		var me = this;
		return me.grid.getSelectionModel();
	},

	recordSelected: function() {
		var me = this;
		var recs = me.grid.getView().getSelectionModel().getSelection();
		if (recs && recs.length > 0)
			return true;

		return false;
	},

	showForm: function() {
		var me = this;
		if (me.recordSelected())		
			me.form.setVisible(true);
		else
			Ext.MessageBox.alert('Status', 'No selection !', function() {});
	},
	
	initSource: function() {
		var me = this;
		me.rec = {
			data: {
				id: '0'
			}
		};
	},

	updateSource: function(rec) {
		var me = this;
		me.rec = rec;
		me.form.updateSource(me.defaultRec);
		me.form.setVisible(true);
	}
});

Ext.define('OCS.Window', {
	extend : 'Ext.Window',
	table: '',
	layout: 'border',
	closable: true,
	modal: true,
	minWidth: 350,

	constructor: function(cnfg) {
        this.callParent(arguments);
        this.initConfig(cnfg);
    },

	commitRecord: function(values) {
		var me = this;
		Ext.Ajax.request({
		   url: 'avia.php',
		   params: {handle: 'web', table: me.table, action: 'insert', values: values},
		   success: function(response, opts) {
				me.close();
		   },
		   failure: function(response, opts) {										   
			  Ext.MessageBox.alert('Status', 'Error !', function() {});
		   }
		});
	}
});

Ext.define('OCS.AddProductWindow', {
	extend: 'OCS.Window',
	title: 'Add product',
	table: 'crm_quote_details',
	width: 350,
	height: 300,

	initComponent: function() {
		var me = this;

		me.form = Ext.create('OCS.FormPanel', {
			id : 'add_quote_product',				
			region: 'center',
			hidden: false,
			closable: false,
			title: '',
			items: [
			{
				xtype: 'textfield',
				fieldLabel: 'Quote ID',
				name: 'quote_id',
				value: selectedQuote.get('id'),
				readOnly: true
			},
			{
				xtype: 'searchcombo',
				fieldLabel: 'Product',
				table: 'crm_products',
				name: 'product_name'
			},
			{
				xtype: 'numberfield',
				fieldLabel: 'Qty',
				name: 'qty',
				value: 1
			},{
				xtype: 'currencyfield',
				fieldLabel: 'Price',
				name: 'price',
				value: 0
			},{
				xtype: 'currencyfield',
				fieldLabel: 'Amount (Discount)',
				name: 'amount',
				value: 0
			},{
				xtype: 'datefield',
				fieldLabel: 'Date',
				value: new Date(),
				format: 'Y-m-d',
				hidden: true,
				name: '_date'
			}],
			buttons: [{
				text: 'Commit',
				handler: function() {
					var form = this.up('form').getForm();
					if (form.isValid())	{
						var values = form.getValues(true);
						me.commitRecord(values);
					}
					else
					  Ext.MessageBox.alert('Status', 'Invalid data !', function() {});
				}
			}]
		});
	
		me.items = [me.form];		
		me.callParent(arguments);
	}
});

Ext.define('OCS.AlarmWindow', {
	extend: 'OCS.Window',
	id: 'alarm_window',
	title: 'Alarms',
	width: 350,
	height: 300,
	layout: 'border',

	initComponent: function() {
		var me = this;
		me.view = new OCS.AnimateView();
		me.items = [me.view.createView()];		
		me.callParent(arguments);
	}
});

Ext.define('OCS.MessageWindow', {
	extend: 'OCS.Window',
	title: 'Compose message',
	table: 'crm_message',
	width: 350,
	height: 300,

	initComponent: function() {
		var me = this;
		me.form = Ext.create('OCS.FormPanel', {
			id : 'message_to_window',				
			region: 'center',
			hidden: false,
			closable: false,
			title: '',
			items: [
			{
				xtype: 'textfield',
				fieldLabel: 'Subject',
				selectOnFocus: true,
				name: 'subject'
			},
			{
				xtype: 'textfield',
				fieldLabel: 'From',
				name: '_from',
				value: logged,
				readOnly: true
			},
			{
				xtype: 'searchcombo',
				fieldLabel: 'To',
				table: 'crm_users',
				name: 'owner'
			},
			{
				xtype: 'textarea',
				fieldLabel: 'Тайлбар',
				hideLabel: true,
				name: 'descr',
				emptyText: 'Тайлбар бичнэ үү !',
				style: 'margin:0', 
				flex: 1 
			}],
			buttons: [{
				text: 'Commit',
				handler: function() {
					var form = this.up('form').getForm();
					if (form.isValid())	{
						var values = form.getValues(true);
						me.commitRecord(values);
					}
					else
					  Ext.MessageBox.alert('Status', 'Invalid data !', function() {});
				}
			}]
		});
		
		me.items = [me.form];		
		me.callParent(arguments);
	}
});



Ext.define('OCS.DropGridPanel', {	
	extend: 'OCS.GridWithFormPanel',
	table: 'crm_products',
	searchBar: true,
	defaultRec: {},
	primary : 'id',
	region : 'center',
	
	constructor: function(config) {
        this.initConfig(config);
        this.callParent(arguments);
		
		Ext.apply(this, this.initialConfig);	
    },

	createActions: function() {
		var me = this;
		me.actions = [
			Ext.create('Ext.Action', {
				iconCls   : 'add',
				text: 'New ...',
				handler: function(widget, event) {
					if (selectedQuote.get('quote_status') != 'draft') {
					  Ext.MessageBox.alert('Status', 'Not available !', function() {});
					  return;
					}
					
					if (selectedQuote)
					{					
						new OCS.AddProductWindow({
							listeners:{
								close:function(){								
									me.loadStore(me.where);
								}
							}
						}).show();
					} else {
						  Ext.MessageBox.alert('Status', 'No selection !', function() {});
					}
				}
			}),
			Ext.create('Ext.Action', {
				iconCls   : 'delete',
				text: 'Delete',
				handler: function(widget, event) {
					if (selectedQuote.get('quote_status') != 'draft') {
					  Ext.MessageBox.alert('Status', 'Not available !', function() {});
					  return;
					}
					me.deleteRecord();
				}
			})
		];

		return me.actions;
	},

	createGrid: function() {
		var me = this;
		me.createStore();

		me.grid = Ext.create('OCS.GridView', {	
			store: me.store,
			title: me.title,
			region: me.region,
			actions: me.createActions(),
			feature: true,
			hidden: me.hidden,
			columns: me.createColumns(),
			flex: me.flex			
		});	


		return me.grid;
	}
});


Ext.define('OCS.PropertyGrid', {
    extend: 'Ext.grid.PropertyGrid',
    alias: 'widget.ocspropertygrid',
	
    constructor: function(cnfg) {
        this.callParent(arguments);
        this.initConfig(cnfg);
		this.createSource();
    },
	
    config: {
        title: 'Property',
		closable: true,
		closeAction: 'hide',
		border: false,
		iconCls: 'detail',
		closeAction: 'hide',
		flex: 1,
		viewConfig: { 
			stripeRows: false, 
			getRowClass: function(record) { 
				var name = record.data.name.substring(2, record.data.name.length);
				if (name == 'mayDuplicate' || name == 'parent_crm_id' || name == 'customer_type' || name == 'crm_id' || name == 'case_id' || name == 'deal_id' || name == 'id' || name == 'userCode' || name == '_date')
					return 'zero-adult-row';
				
				if (name == 'descr')
					return 'descr-adult-row';

				return 'adult-row';
				//return record.get('value') =='' ? 'child-row' : 'adult-row'; 
			} 
		}
    },

    onRender: function() {
        this.callParent(arguments);
    },
	
	createSource: function() {
		var me = this;
		me.array = [];
		me.render = [];
		for (i = 0; i < fields[me.modelName+'_FIELDS'].length; i++) {
			f = fields[me.modelName+'_FIELDS'][i];
			if (f.name == 'crm_name' || f.name == 'deal_name') continue;
			me.array[(i < 10?'0'+i:i)+f.name] = '';
			me.render[(i < 10?'0'+i:i)+f.name] = {
				displayName: f.text,
                editor: me.getEditor(f.name)
			};
		}

		me.setSource(me.array, me.render);
	},
	
	updateSource: function(rec) {
		var me = this;
		me.array = [];
		me.render = [];
		for (i = 0; i < fields[me.modelName+'_FIELDS'].length; i++) {
			f = fields[me.modelName+'_FIELDS'][i];
			if (f.name == 'crm_name' || f.name == 'deal_name') continue;
			me.array[(i < 10?'0'+i:i)+f.name] = (rec.data[f.name]?rec.data[f.name]:''); 
			me.render[(i < 10?'0'+i:i)+f.name] = {
				displayName: f.text,
				renderer: f.text == '#'?'':f.renderer,
                editor: me.getEditor(f.name,(rec.data[f.name]?rec.data[f.name]:''))
			};
		}

		me.setSource(me.array, me.render);
	},

	getEditor: function(name, value) {
		var me = this;
		if (name == 'type')
			return {
				xtype: 'textfield',
				readOnly: true,
				name: name
			};
		
		if (name == 'password')
			return {
				xtype: 'textfield',
				inputType: 'password',
				name: name
			};

		if (name == '_date' || name == 'id')
			return {
				xtype: 'textfield',
				readOnly: true,
				name: name
			};

		if (name.indexOf('date') != -1 || name.indexOf('remind_at') != -1 || name.indexOf('birthday') != -1)
			return {
				xtype: 'datefield',
				format: 'Y-m-d',
				value: value,
				name: name
			};

		if (name.indexOf('time') != -1)
			return {
				xtype: 'timefield',
				name: name,
				minValue: '09:00',
			    maxValue: '20:00',
				format: 'H:i',
			    altFormats:'H:i',
				increment: 30,
				renderer: ''
			};

		if (name == 'crm_id' || name == 'deal_id' || name == 'case_id' || name == 'quote_code' || name == 'quote_id') {
			return {
				xtype: 'searchcombo',
				name: name,
				table: 'crm_customer',
				disabled: true
			};		
		}

		if (name == 'product_name') {
			return {
				xtype: 'searchcombo',
				name: 'product_name',
				table: 'crm_products'
			};
		}								  

		if (name == 'customer_type')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_OBJECT',
 				  data: [{id:0, value: 'retail'},{id: 1, value: 'corporate'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'id',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'level')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: 'suspect'},{value: 'prospect'},{value: 'customer'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'stage')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: 'lead'},{value: 'opportunity'},{value: 'quote'},{value: 'close'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'gender')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: 'эр'},{value: 'эм'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'case_stage')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: 'identify'},{value: 'research'},{value: 'resolve'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'campaign_status')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: 'planning'},{value: 'active'},{value: 'inactive'},{value:'complete'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'campaign_type')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: 'phone call'},{value: 'appointment'},{value: 'email'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}
		
		if (name == 'status')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: 'open'},{value: 'inactive'},{value: 'postponed'},{value: 'won'},{value: 'lost'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'quote_status')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: 'draft'},{value: 'confirmed'}, {value: 'close as won'}, {value: 'close as lost'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'calltype')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: 'inbound'},{value: 'outbound'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'callresult')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
				  model: 'CRM_ITEM',
				  data: [{value: 'pending'},{value: 'success'},{value: 'unsuccess'},{value: 'remind'}]
			  }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == '_from')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
				  model: 'CRM_ITEM',
				  data: [{value: 'office'},{value: 'mobile'}]
			  }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'complain_origin')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
				model: 'CRM_ITEM',
				data: [{value: 'phone'},{value: 'web'},{value: 'email'}]
			  }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}
		
		if (name == 'complain_type')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
				model: 'CRM_ITEM',
				data: [{value: 'problem'},{value: 'feature request'},{value: 'question'}]
			  }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}
		
		if (name == 'user_level')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_OBJECT',
 				  data: [{id: 0, value: 'sales man'},{id: 1, value: 'manager'}, {id: 2, value:'head'}, {id: 3, value:'ceo'}, {id: 10, value:'president'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'id',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'event_type')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: 'meeting'},{value: 'send e-mail'},{value:'other'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'remind_type')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: 'popup'},{value: 'email'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
			  valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}
		
		if (name == '_class')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: 'RETAIL'},{value: 'VIP'},{value: 'EXPAT'},{value: 'SME'},{value: 'RESELLER'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
		      valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'employees')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: '10 доош'},{value: '10-50'},{value: '50-100'},{value:'100-500'},{value:'500-1000'},{value:'1000-с дээш'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
		      valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}
		
		if (name == 'company_torol')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: 'ХХК'},{value: 'ХК'},{value: 'ТӨХК'},{value: 'ТББ'},{value: 'ББСБ'},{value: 'ТӨҮГ'},{value: 'ОНӨҮГ'},{value: 'ХЗХ'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
		      valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'industry')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: 'Уул уурхай'},{value: 'Барилга'},{value: 'Банк, санхүү'},{value: 'Үйлдвэрлэл'},{value: 'Худалдаа, үйлчилгээ'},{value: 'Тээвэр'},{value: 'Зам, гүүр'},{value: 'Шугам сүлжээ'},{value: 'Аялал жуулчлал'},{value: 'Худалдаа'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
		      valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'priority')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: 'low'},{value: 'medium'},{value: 'high'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
		      valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}
		
		if (name == 'regNo')
			return {
				xtype: 'searchcombo',
				name: name,
				emptyText: '',
				maxLength: 10,
				maskRe : /[0-9А-ЯӨҮ]/,
				table: 'crm_customer'
			};
		
		if (name == 'descr' || name == 'address' || name == 'horoo' || name == 'strength' || name == 'weakness' || name == 'current_situation' || name == 'customer_need' || name == 'proposed_solution') {
			return {
				xtype: 'textarea',
				hideLabel: true,
				height: 150,
				emptyText: 'Тайлбар бичнэ үү !',
				style: 'margin-top:130px', 
				name: name
			};		
		}

		if (name == 'firstName' || name == 'lastName' || name == 'job_title' || name == 'job_postion' || name == 'country' || name == 'city' || name == 'district' || name == 'horoo' || name == 'type') {
			return {
				xtype: 'searchcombo',
				name: name,
				table: 'crm_customer'
			};		
		}
		
		if (name == 'owner') {
			return {
				xtype: 'searchcombo',
				name: name,
				table: 'crm_users'
			};		
		}
		
		if (name == 'personal')
		{
			return {
				xtype: 'searchcombo',
				name: name,
				table: 'crm_personal_view'
			};
		}

		if (name == 'campaign')
		{
			return {
				xtype: 'searchcombo',
				name: name,
				table: 'crm_campaign'
			};
		}
		
		if (name == 'field')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
				  model: 'CRM_ITEM',
 				  data: [{value: 'firstName'},{value: 'lastName'},{value: 'birthday'},{value: 'gender'},{value: 'title'},{value: 'job_title'},{value: 'phone'},{value: 'email'},{value: 'district'},{value: 'horoo'},{value: 'annual_revenue'},{value: 'capital'},{value:'tatvar'},{value:'industry'},{value:'industry_sub'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
		      valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'equals')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
				  model: 'CRM_ITEM',
 				  data: [{value: 'equal'},{value: 'does not equal'},{value: 'is greater than'},{value: 'is less than'},{value: 'begins with'},{value: 'ends with'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
		      valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'purpose')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
				  model: 'CRM_ITEM',
 				  data: [{value: 'sales'},{value: 'care'},{value: 'broadcast'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
		      valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}
		
		if (name == 'email_status')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
				  model: 'CRM_ITEM',
 				  data: [{value: 'draft'},{value: 'sent'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
		      valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'event_status')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
				  model: 'CRM_ITEM',
 				  data: [{value: 'pending'},{value: 'completed'},{value: 'cancelled'},{value: 'remind'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
		      valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'complain_status')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
				  model: 'CRM_ITEM',
 				  data: [{value: 'active'},{value: 'inactive'},{value: 'solved'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
		      valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'task_status')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
				  model: 'CRM_ITEM',
 				  data: [{value: 'open'},{value: 'processing'},{value: 'completed'},{value: 'remind'}]
              }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
		      valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'complain_status')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
				 model: 'CRM_ITEM',
				 data: [{value: 'active'},{value: 'inactive'},{value: 'solved'}]
			  }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
		      valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}
		
		if (name == 'resolution_type')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
				 model: 'CRM_ITEM',
				 data: [{value: 'problem solved'},{value: 'information provided'}]
			  }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
		      valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}

		if (name == 'decision_maker')
		{
			return {
			  xtype: 'combo',
			  store: Ext.create('Ext.data.Store', {
				 model: 'CRM_ITEM',
				 data: [{value: 'manager'}, {value: 'decision maker'}]
			  }),
			  name: name,
			  queryMode: 'local',
		      displayField: 'value',
		      valueField: 'value',
			  triggerAction: 'all',
			  editable: false
			};
		}
	  
		if (name == 'phone' || name == 'phone1' || name == 'fax')
			return {
				xtype: 'textfield',
				name: name,
				emptyText: 'xxxxxxxx',
				maskRe: /[\d\-]/,
				regex: /^\d{8}$/,
				maxLength: 8,
				regexText: 'Must be in the format xxx-xxx-xxxx'			
			};
			
		if (name == 'email')
			return {
				xtype: 'textfield',
				name: name,
				vtype: 'email',
				maxLength: 32
			};
		
		if (name == 'duration' || name == 'total_members')
			return {
				xtype: 'numberfield',
				name: name
			};

		if (name == 'price' || name == 'amount' || name == 'budgeted_cost' || name == 'reported_revenue' || name == 'actual_cost' || name == 'expected_revenue' || name == 'amountTheshold')
			return {
				xtype: 'currencyfield',
				value: 0,				
				name: name,
				id: name
			};
		
		if (name == 'userCode')
			return {
				xtype: 'textfield',
				disabled: true,
				name: name
			};

		return {
			xtype: 'textfield',
			name: name,
			listeners: {
				keypress : function(field, e){
					
				}
			}
		};				
	}
});


Ext.define('OCS.FormPanel', {
	extend: 'Ext.form.Panel',
	
	border: false,
	region: 'east',
	width: 250,
	autoScroll: true,
	frame: false,
	split: true,
	closable: true,
	closeAction: 'hide',
	bodyPadding: '10 10 10 10',
	hidden: true,			
	fieldDefaults: {
		labelWidth: 100,
		anchor: '100%'
	},
	
	layout: {
		type: 'vbox',
		align: 'stretch'  // Child items are stretched to full width
	},

	constructor: function(cnfg) {
        this.callParent(arguments);
        this.initConfig(cnfg);	
    }	
});

Ext.define('OCS.GridView', {
	extend: 'Ext.grid.Panel',	
	border: false,
	region: 'center',
	split: true,
	multiSelect: true,
	columnLines: true,
	stripeRows: true,	
	stateful: false,
	filter: false,
	tbarable: false,
	feature: true,
	emptyText: 'No records.',
	
	constructor: function(cnfg) {
        this.callParent(arguments);
        this.initConfig(cnfg);	
    },
	
	initComponent: function() {
		var me = this;
		
//		me.tbar = me.initSorterBar();
		if (me.actions.length > 0)		
			me.tbar = me.actions;

		me.searchField = new Ext.ux.form.SearchField({
		    width: 220,
		    store: me.store
		});

		me.bbar = Ext.create('Ext.PagingToolbar', {
			store: me.store,
			displayInfo: true,
			displayMsg: '{0}-{1} of {2}',
			emptyMsg: "Empty !",
			items: [me.searchField, {
					xtype: 'textfield',
					width: 150,
					hidden: true,
					emptyText: 'Search value...',
					readOnly: false,
					listeners: {
						 change: {
							 fn: me.onTextFieldChange_,
							 scope: this,
							 buffer: 200
						 }
					}
				},	
				{
					text: 'Clear grouping',
					hidden: !me.feature,
					handler: function() {
						if (me.feature) {
							me.getView().getFeature('group').disable();
						}
					}
				},
				'->'
			]
		});		

		me.contextMenu = Ext.create('Ext.menu.Menu', {
			items: me.actions
		});


		me.viewConfig = {
			emptyText: me.emptyText,
			trackOver: false,
			stripeRows: false,
			listeners: {
				itemcontextmenu: function(view, rec, node, index, e) {
					e.stopEvent();
					if (me.actions.length > 0)
						me.contextMenu.showAt(e.getXY());
					return false;
				},
				containercontextmenu: function(grid, e) {
					var position = e.getXY();
					e.stopEvent();
					if (me.actions.length > 0)
						me.contextMenu.showAt(position);
				},				
				itemclick: function(dv, record, item, index, e) {
					if (me.func == 'crm_corporate_list' || me.func == 'crm_retail_list') {
						me.selectCustomer(record);
						
						if (Ext.getCmp('contact_form') && me.func == 'crm_retail_list')						
							Ext.getCmp('contact_form').getForm().loadRecord(record);
					}
				},
				itemdblclick: function(dv, record, item, index, e) {
					if (me.func == 'crm_corporate_list' || me.func == 'crm_retail_list') {
						me.selectCustomer(record);
						Ext.getCmp('customerComponent').expand();
					}
				}
			},
			getRowClass: function (record, rowIndex, rowParams, store) {
                may = record.get('mayDuplicate') != '0' ? 'may-duplicate' : '';
				return may;
            }
		};
		
		if (me.feature)
		{		
			me.features = [{
				ftype: 'filters',
				encode: true, 
				local: false				
			},{
				id: 'group',
				ftype: 'groupingsummary',				
				groupHeaderTpl: '{name} ({rows.length})'
			},{
				id: 'summary',
				ftype: 'summary',
			}];
		} else
			me.features = [];

		me.callParent(arguments);
	},
	
	onTextFieldChange_: function(e) {
		var me = this;		
		var v = e.getValue();
		if (v) {			
			me.query = v;
			me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: me.func, values: me.values, where: me.where, query: me.query};
			me.store.loadPage(1);
		} else {
			me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: me.func, values: me.values, where: me.where};
			me.store.loadPage(1);
		}
	},
	
	getCustomerName: function(rec) {
		v = rec.get('level');
		if (rec.data['_class'] && rec.data['_class'].indexOf('VIP') != -1) v = 'vip';
		return '<span class="circle '+v+'">&nbsp;</span> '+rec.get('firstName')+' <span style="color:gray">'+rec.get('lastName')+'</span>';
	},

	selectCustomer: function(rec) {
		var me = this;
		crm_id = rec.get('crm_id');
		selected = rec;

		views['property'].updateSource(rec);
		views['activity'].updateSource(rec);
		views['opportunity'].updateSource(rec);
		views['case'].updateSource(rec);
		views['csales'].updateSource(rec);
		
		if (me.form)		
			me.form.loadRecord(rec);
		Ext.getCmp('customerComponent').setTitle(me.getCustomerName(rec));
	},

	initSorterBar: function() {
		var me = this;
		me.reorderer = Ext.create('Ext.ux.BoxReorderer', {
			listeners: {
				scope: this,
				Drop: function(r, c, button) { //update sort direction when button is dropped
					me.changeSortDirection(button, false);
				}
			}
		});

		me.droppable = Ext.create('Ext.ux.ToolbarDroppable', {
			createItem: function(data) {
				var header = data.header,
					headerCt = header.ownerCt,
					reorderer = headerCt.reorderer;

				if (reorderer) {
					reorderer.dropZone.invalidateDrop();
				}

				return me.createSorterButtonConfig({
					text: header.text,
					sortData: {
						property: header.dataIndex,
						direction: "ASC"
					}
				});
			},

			canDrop: function(dragSource, event, data) {
				var sorters = me.getSorters(),
					header  = data.header,
					length = sorters.length,
					entryIndex = this.calculateEntryIndex(event),
					targetItem = this.toolbar.getComponent(entryIndex),
					i;

				if (!header.dataIndex || (targetItem && targetItem.reorderable === false)) {
					return false;
				}

				for (i = 0; i < length; i++) {
					if (sorters[i].property == header.dataIndex) {
						return false;
					}
				}
				return true;
			},

			afterLayout: me.doSort
		});
				

		me.reorderer = Ext.create('Ext.ux.BoxReorderer', {
			listeners: {
				scope: this,
				Drop: function(r, c, button) { 
					me.changeSortDirection(button, false);
				}
			}
		});

		me.droppable = Ext.create('Ext.ux.ToolbarDroppable', {
			createItem: function(data) {
				var header = data.header,
					headerCt = header.ownerCt,
					reorderer = headerCt.reorderer;

				if (reorderer) {
					reorderer.dropZone.invalidateDrop();
				}

				return me.createSorterButtonConfig({
					text: header.text,
					sortData: {
						property: header.dataIndex,
						direction: "ASC"
					}
				});
			},

			canDrop: function(dragSource, event, data) {
				var sorters = me.getSorters(),
					header  = data.header,
					length = sorters.length,
					entryIndex = this.calculateEntryIndex(event),
					targetItem = this.toolbar.getComponent(entryIndex),
					i;

				if (!header.dataIndex || (targetItem && targetItem.reorderable === false)) {
					return false;
				}

				for (i = 0; i < length; i++) {
					if (sorters[i].property == header.dataIndex) {
						return false;
					}
				}
				return true;
			},

			afterLayout: me.doSort
		});

	
		me.bar = Ext.create('Ext.toolbar.Toolbar', {
			height: 32,
			hidden: !me.tbarable,
			items  : [{
				xtype: 'tbtext',
				text: 'Sort by:',
				reorderable: false
			}, me.actions],
			plugins: [me.reorderer, me.droppable]
		});

		return me.bar;
	},

	doSort: function() {
		var me = this;
        me.store.sort(me.getSorters());
    },

	changeSortDirection: function(button, changeDirection) {
		var me = this;
        var sortData = button.sortData,
            iconCls  = button.iconCls;
        
        if (sortData) {
            if (changeDirection !== false) {
                button.sortData.direction = Ext.String.toggle(button.sortData.direction, "ASC", "DESC");
                button.setIconCls(Ext.String.toggle(iconCls, "sort-asc", "sort-desc"));
            }
            me.store.clearFilter();
            me.doSort();
        }
    },
	
	getSorters: function() {
        var sorters = [];
		var me = this;

        Ext.each(me.bar.query('button'), function(button) {
            sorters.push(button.sortData);
        }, this);

        return sorters;
    },
	
	createSorterButtonConfig: function(config) {
		var me = this;
        config = config || {};
        Ext.applyIf(config, {
            listeners: {
                click: function(button, e) {
                    me.changeSortDirection(button, true);
                }
            },
            iconCls: 'sort-' + config.sortData.direction.toLowerCase(),
            reorderable: true,
            xtype: 'button'
        });
        return config;
    },

	loadStore: function() {
		var me = this;
		me.store.loadPage(1);
	}
});