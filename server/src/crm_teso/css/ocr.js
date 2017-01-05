function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function googleEventDynamic(rec) {	
	_location = '';		
		
	subject = rec.get('subject');
	if (typeof subject == 'undefined') {
		subject = rec.get('work_type');
	}

	subject = subject + ' [from CRM]';

	start_date = rec.get("_date");
	start_date = replaceAll('-', '', start_date);
	htmlContent= rec.get('crm_name').substring(rec.get('crm_name').indexOf('<b>')+3, rec.get('crm_name').indexOf('</b>'));

	descr = rec.get('work_type')+':'+htmlContent+', '+rec.get('descr');
	window.open("https://www.google.com/calendar/render?action=TEMPLATE&trp=false&text="+subject+"&dates="+start_date+"T020000Z/"+start_date+"T030000Z&location="+_location+"&details="+descr+"&sprop&sf=true&output=xml","_blank","toolbar=no, scrollbars=yes, resizable=yes, top=100, left=100, width=850, height=500");	
}

function googleEvent(rec, func) {
	if (func == 'crm_event_list')
	{	
		_location = rec.get('venue');
		if (typeof _location == 'undefined')
			_location = '';
			
		subject = rec.get('subject');
		if (typeof subject == 'undefined')
			subject = '';

		subject = subject + ' [from CRM]';

		start_date = rec.get("start_date");
		start_date = replaceAll('-', '', start_date);
		name = rec.get('crm_name');
		name = name.substring(name.indexOf('<g>')+3, name.indexOf('</g'));
		descr = rec.get('descr');
		if (descr == '')
			descr = name+' : уулзалт хийх';
		window.open("https://www.google.com/calendar/render?action=TEMPLATE&trp=false&text="+subject+"&dates="+start_date+"T020000Z/"+start_date+"T030000Z&location="+_location+"&details="+descr+"&sprop&sf=true&output=xml","_blank","toolbar=no, scrollbars=yes, resizable=yes, top=100, left=100, width=850, height=500");
	} else
	if (func == 'crm_task_list')
	{	
		_location = '';		
			
		subject = rec.get('task_type');
		if (typeof subject == 'undefined')
			subject = '';

		subject = subject + ' [from CRM]';

		start_date = rec.get("duedate");
		start_date = replaceAll('-', '', start_date);
		name = rec.get('crm_name');
		name = name.substring(name.indexOf('<g>')+3, name.indexOf('</g'));
		descr = rec.get('descr');
		if (descr == '')
			descr = name+' : төлөвлөсөн ажил';
		window.open("https://www.google.com/calendar/render?action=TEMPLATE&trp=false&text="+subject+"&dates="+start_date+"T020000Z/"+start_date+"T030000Z&location="+_location+"&details="+descr+"&sprop&sf=true&output=xml","_blank","toolbar=no, scrollbars=yes, resizable=yes, top=100, left=100, width=850, height=500");
	} else
	if (func == 'crm_calllog_list')
	{	
		_location = '';		
			
		subject = rec.get('task_type');
		if (typeof subject == 'undefined')
			subject = '';

		subject = subject + ' [from CRM]';

		start_date = rec.get("duedate");
		start_date = replaceAll('-', '', start_date);
		
		name = rec.get('crm_name');
		name = name.substring(name.indexOf('<g>')+3, name.indexOf('</g'));

		descr = rec.get('descr');
		if (descr == '')
			descr = name+' : харилцагчтай ярих';
		window.open("https://www.google.com/calendar/render?action=TEMPLATE&trp=false&text="+subject+"&dates="+start_date+"T020000Z/"+start_date+"T030000Z&location="+_location+"&details="+descr+"&sprop&sf=true&output=xml","_blank","toolbar=no, scrollbars=yes, resizable=yes, top=100, left=100, width=850, height=500");
	} else
	if (func == 'crm_complain_list')
	{	
		_location = '';		
			
		subject = rec.get('complain_reason');
		if (typeof subject == 'undefined')
			subject = '';
		name = rec.get('crm_name');
		name = name.substring(name.indexOf('<g>')+3, name.indexOf('</g'));
		subject = subject + ' [from CRM]';

		start_date = rec.get("closing_date");
		start_date = replaceAll('-', '', start_date);

		descr = rec.get('descr');
		if (descr == '')
			descr = name+' : асуудал шийдвэрлэх';
		window.open("https://www.google.com/calendar/render?action=TEMPLATE&trp=false&text="+subject+"&dates="+start_date+"T020000Z/"+start_date+"T030000Z&location="+_location+"&details="+descr+"&sprop&sf=true&output=xml","_blank","toolbar=no, scrollbars=yes, resizable=yes, top=100, left=100, width=850, height=500");
	}
}

Ext.define('OCS.AnimateView', {
	extend: 'OCS.Module',
	remoteSort : false,
	func: 'crm_alarm_list',

	createView: function() {
		var me = this;
		me.modelName = 'CRM_ALARM';
		me.createStore();

		me.dataview = Ext.create('Ext.view.View', {
			deferInitialRefresh: false,
			store: me.store,
			tpl  : Ext.create('Ext.XTemplate',
				'<tpl for=".">',
					'<div class="phone">',
						'<div class="content">',
						'<strong>{subject}</strong>',
						'<span class="text">{crm_name}</span></br></br>',
						'<span class="tag Demo">{status}</span>',
						'</div>',
						'</br>',
						'<div class="tag-wrapper"><span class="tag Code Snippet">{type}</span></div>',	
					'</div>',
				'</tpl>'
			),

			plugins : [
				Ext.create('Ext.ux.DataView.Animated', {
					duration  : 450,
					idProperty: 'title'
				})
			],
			id: 'phones',
			itemSelector: 'div.phone',
			overItemCls : 'phone-hover',
			multiSelect : true,
			autoScroll  : true,
			listeners: {
				selectionchange : function(item, selections){
					me.selectCustomer(selections[0]);					
				}
			}
		});
				
		me.panel = Ext.create('Ext.panel.Panel', {
			layout: 'fit',
			border: false,
			items : me.dataview,		
			region: 'center'
		});			

		return me.panel;
	},

	updateStoreSorters: function() {    
        this.store.sort(this.sorters);
    },
	
	dirs: [],
	sorters: []
});

Ext.define('OCS.RetailPanel', {	
	extend: 'OCS.Module',			
	firstName: '',
	table: 'crm_customer',
	primary: 'crm_id',
	lastName: '',
	tab: 'tab_contact_list',
	title: 'Contact List',
	modelName: 'CRM_RETAIL',
	func: 'crm_retail_list',
	autoSelect: true,
	xlsName: 'Contact',

	filterData: function(views) {
		var me = this;		
		me.title = views;
		me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: me.func, values: me.values, where: me.where, views: views};
		me.store.loadPage(1);
	},

	createActions: function() {
		var me = this;
		me.customViews = [
			Ext.create('Ext.Action', {
				icon   : '',  
				text: 'Suspect List',
				handler: function(widget, event) {
					me.filterData('Suspect List');
				}
			}),
			Ext.create('Ext.Action', {
				icon   : '',  
				text: 'Prospect List',
				handler: function(widget, event) {
					me.filterData('Prospect List');
				}
			}),
			Ext.create('Ext.Action', {
				icon   : '',  
				text: 'Customer List',
				handler: function(widget, event) {
					me.filterData('Customer List');
				}
			}),
			Ext.create('Ext.Action', {
				icon   : '',  
				text: 'VIP List',
				handler: function(widget, event) {
					me.filterData('VIP List');
				}
			}),
			Ext.create('Ext.Action', {
				icon   : '',  
				text: 'All '+me.xlsName+' List',
				handler: function(widget, event) {
					me.filterData('');
				}
			}),
			Ext.create('Ext.Action', {
				icon   : '',  
				text: 'My '+me.xlsName+' List',
				handler: function(widget, event) {
					me.filterData('My '+me.xlsName+' List');
				}
			}),
			'-',
			Ext.create('Ext.Action', {
				icon   : '',  
				text: 'Recently Added List',
				handler: function(widget, event) {
					me.filterData('Recently Added List');
				}
			}),
			Ext.create('Ext.Action', {
				icon   : '',  
				text: 'Create Personal View...',
				handler: function(widget, event) {								
					new OCS.PersonalViewWindow({
						selected: me.grid.getView().getSelectionModel().getSelection()[0]
					}).createWindow();
				}
			})
		];

//		if (me.per && me.per.length > 3) {		
			me.per = personals.split(",");
			for (i = 0; i < me.per.length; i++) {
				if (me.per[i] && me.per[i].length > 0)				
					me.customViews.push(
						Ext.create('Ext.Action', {
							icon   : '',  
							text: me.per[i],
							handler: function(widget, event) {					
								me.filterData(widget.text);
							}
						})
					);
			}
//		}

		me.actions = [			
			Ext.create('Ext.Action', {
				iconCls: 'list',
				text: 'Views',
				menu: {
					xtype: 'menu',
					items: me.customViews
				}		
			}),		
			'-',
			Ext.create('Ext.Action', {
				iconCls   : 'add',
				text: 'New...',
				handler: function(widget, event) {
					if (me.modelName == 'CRM_RETAIL')					
						new OCS.RetailNewWindow().show();
					else
						new OCS.CorporateNewWindow().show();

					Ext.getCmp('customerComponent').collapse();
				}
			}),	
			Ext.create('Ext.Action', {
				iconCls   : 'edit',
				text: 'Expand...',
				handler: function(widget, event) {					
					me.selectCustomer(me.grid.getView().getSelectionModel().getSelection()[0]);
					Ext.getCmp('customerComponent').expand();
				}
			}),	
			Ext.create('Ext.Action', {
				iconCls  : 'delete',
				text: 'Delete',
				handler: function(widget, event) {
					me.deleteRecord();
				}
			}),
			'-',
			Ext.create('Ext.Action', {
				iconCls   : 'merge',
				text: 'Merge...',
				handler: function(widget, event) {
					if (user_level > 0) {					
						if (me.grid.getView().getSelectionModel().getSelection().length == 2){					
							new OCS.MergeRecordsWindow({
								name: me.xlsName,
								master: me.grid.getView().getSelectionModel().getSelection()[0],
								slave: me.grid.getView().getSelectionModel().getSelection()[1]
							}).show();
						} else
							Ext.MessageBox.alert('Status', 'Master & Slave record !', function() {});
					} else
						Ext.MessageBox.alert('Error', 'Not available !', function() {});
				}
			}),				
			Ext.create('Ext.Action', {
				iconCls   : 'import',
				text: 'Import...',
				handler: function(widget, event) {
					new OCS.UploadWindow({
						name: me.xlsName
					}).show();
				}
			}),	
			Ext.create('Ext.Action', {
				iconCls   : 'export',
				text: 'Export...',
				disabled: (user_level == '0'),
				handler: function(widget, event) {
					if (!Ext.fly('frmDummy')) {
						var frm = document.createElement('form');
						frm.id = 'frmDummy';
						frm.name = 'url-post';
						frm.className = 'x-hidden';
						document.body.appendChild(frm);
					}

					Ext.Ajax.request({
					   url: 'avia.php',
					   isUpload: true,
					   form: Ext.fly('frmDummy'),
					   params: {handle: 'file', action:'export', where: me.xlsName},					
					   success: function(response, opts) {					
						  Ext.MessageBox.alert('Status', 'Success !', function() {});
					   },
					   failure: function(response, opts) {
						  Ext.MessageBox.alert('Status', 'Error !', function() {});
					   }
					});	
				}
			}),				
			'-',				
			Ext.create('Ext.Action', {
				iconCls: 'activity',
				text: 'Activity',
				menu: {
					xtype: 'menu',
					items: [
						Ext.create('Ext.Action', {
							iconCls   : 'notes',  
							text: 'Notes ...',
							handler: function(widget, event) {
								if (me.recordSelected())
									new OCS.NotesWindow({
										selected: me.grid.getView().getSelectionModel().getSelection()[0]
									}).createWindow();
							}
						}),
						Ext.create('Ext.Action', {
							iconCls   : 'task',  
							text: 'Task ...',
							handler: function(widget, event) {
								if (me.recordSelected())
									new OCS.TaskWindow({
										selected: me.grid.getView().getSelectionModel().getSelection()[0]
									}).createWindow();
							}
						}),
						Ext.create('Ext.Action', {
							iconCls   : 'event',  
							text: 'Appointment ...',
							handler: function(widget, event) {
								if (me.recordSelected())
									new OCS.EventWindow({
										selected: me.grid.getView().getSelectionModel().getSelection()[0]
									}).createWindow();
							}
						}),
						Ext.create('Ext.Action', {
							iconCls   : 'call', 
							text: 'Call ...',
							handler: function(widget, event) {
								if (me.recordSelected())							
									new OCS.CallLogWindow({
										selected: me.grid.getView().getSelectionModel().getSelection()[0]
									}).createWindow();							
							}
						}),
						Ext.create('Ext.Action', {
							iconCls   : 'email',  
							text: 'Email ...',
							handler: function(widget, event) {
								if (me.recordSelected())
									new OCS.EmailWindow({
										selected: me.grid.getView().getSelectionModel().getSelection()[0]
									}).createWindow();
							}
						})
					]
				}		
			}),			
			Ext.create('Ext.Action', {
				iconCls   : 'complain', 
				text: 'Case ...',
				handler: function(widget, event) {
					if (me.recordSelected())
						new OCS.ComplainWindow({
							selected: me.grid.getView().getSelectionModel().getSelection()[0]
						}).createWindow();
				}
			}),	
			Ext.create('Ext.Action', {
				iconCls   : 'deal', 
				text: 'Deal ...',
				handler: function(widget, event) {		
					if (me.recordSelected())
						new OCS.NewDealWindow({
							selected: me.grid.getView().getSelectionModel().getSelection()[0]
						}).createWindow();
				}
			})
		];
			
		return me.actions;
	},

	recordSelected: function() {
		var me = this;
		var recs = me.grid.getView().getSelectionModel().getSelection();
		if (recs && recs.length > 0)
			return true;
		
		Ext.MessageBox.alert('Status', 'No Selection !', function() {});
		return false;
	},

	createGrid: function() {
		var me = this;
		me.createStore();		

		me.grid = Ext.create('OCS.GridView', {	
			store: me.store,
			columns: me.createColumns(),
			actions: me.createActions(),
			func: me.func
		});										

		me.panel = Ext.create('Ext.panel.Panel', {
			layout: 'border',
			border: false,
			region: 'center',
			items : [me.grid]			
		});

		return me.panel;
	}
});

Ext.define('OCS.CorporatePanel', {	
	extend: 'OCS.RetailPanel',			
	firstName: '',
	lastName: '',
	modelName: 'CRM_CORPORATE',
	func: 'crm_corporate_list',
	autoSelect: true,
	xlsName: 'Account',
		
	createGrid: function() {
		var me = this;
		me.createStore();	
		
		me.filters = {
			ftype: 'filters',
			encode: true, 
			local: false, 
			filters: [{
				type: 'string',
				dataIndex: 'level'
			}]
		};

		me.grid = Ext.create('OCS.GridView', {	
			store: me.store,
			columns: me.createColumns(),
			features: [me.filters],
			actions: me.createActions(),
			func: me.func			
		});				
								
		me.panel = Ext.create('Ext.panel.Panel', {
			layout: 'border',
			border: false,
			region: 'center',
			items : [me.grid]			
		});

		return me.panel;
	}
});

Ext.define('OCS.ActivityGrid', {
	extend: 'OCS.Module',
	func: 'crm_customer_activity_list',
	sortField: '_date',
	tab : 'activity_property',
	dateField: '_date',
	sortDirection: 'desc',
	title: 'Activities',
	icon: 'task',
	modelName: 'CRM_CALENDAR',
	collapsed : false,
	action: true,
	
	filterData: function(views) {
		var me = this;		
		me.title = views;
		me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: me.func, values: me.values, where: me.where, views: views};
		me.store.loadPage(1);
	},

	createActions: function() {
		var me = this;
		me.actions = [		
			Ext.create('Ext.Action', {
				iconCls: 'list',
				text: 'Views',
				menu: {
					xtype: 'menu',
					items: [
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Note List',
							handler: function(widget, event) {
								me.filterData('Note List');
							}
						}),
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Task List',
							handler: function(widget, event) {
								me.filterData('Task List');
							}
						}),
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Appointment List',
							handler: function(widget, event) {
								me.filterData('Appointment List');
							}
						}),
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Phone Call List',
							handler: function(widget, event) {
								me.filterData('Phone Call List');
							}
						}),
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Email List',
							handler: function(widget, event) {
								me.filterData('Email List');
							}
						}),
						'-',
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'All Activity List',
							handler: function(widget, event) {
								me.filterData('All Activity List');
							}
						})
					]
				}		
			}),'-',
			Ext.create('Ext.Action', {
				iconCls   : 'notes',  
				text: 'Notes ...',
				handler: function(widget, event) {
					if (me.action)
						new OCS.NotesWindow({
							selected: me.selected,
							backgrid: me.grid
						}).createWindow();
					else
						Ext.MessageBox.alert('Status', 'Not available !', function() {});
				}
			}),
			Ext.create('Ext.Action', {
				iconCls   : 'task',  
				text: 'Task ...',
				handler: function(widget, event) {
					if (me.action)
						new OCS.TaskWindow({
							selected: me.selected,
							backgrid: me.grid
						}).createWindow();
					else
						Ext.MessageBox.alert('Status', 'Not available !', function() {});
				}
			}),
			Ext.create('Ext.Action', {
				iconCls   : 'event',  
				text: 'Appointment ...',
				handler: function(widget, event) {
					if (me.action)
						new OCS.EventWindow({
							selected: me.selected,
							backgrid: me.grid
						}).createWindow();
					else
						Ext.MessageBox.alert('Status', 'Not available !', function() {});
				}
			}),
			Ext.create('Ext.Action', {
				iconCls   : 'call', 
				text: 'Call ...',
				handler: function(widget, event) {
					if (me.action)
						new OCS.CallLogWindow({
							selected: me.selected,
							backgrid: me.grid
						}).createWindow();
					else
						Ext.MessageBox.alert('Status', 'Not available !', function() {});
				}
			}),
			Ext.create('Ext.Action', {
				iconCls   : 'email',  
				text: 'Email ...',
				handler: function(widget, event) {
					if (me.action)
						new OCS.EmailWindow({
							selected: me.selected,
							backgrid: me.grid
						}).createWindow();
					else
						Ext.MessageBox.alert('Status', 'Not available !', function() {});
				}
			})
		];
			
		return me.actions;
	},

	renderTitle: function(value, p, record) {
		if (record.data.work_type == 'task')
		{		
	        return Ext.String.format(
				'<table class="{2}"><tr><td width="50px"><div class="c-task" title="Phone Call"></div></td><td><b><span class="title">{0}</span></b>&nbsp;&nbsp;{5}</br><span class="lightgray">{1}</span></br><span class="gray">{2}&nbsp;by&nbsp;</span><span class="purple">{3}</span>&nbsp;<span class="gray">{4}</span>&nbsp;<img src="images/{6}.png" title="{6}" style="height:12px"/></td></tr></table>',
			    value,
				record.data.descr,
	            record.data.status,
				record.data.owner,
				record.data._date,
				record.data.crm_name.split(',')[0],
				record.data.source
		    );
		} else
		if (record.data.work_type == 'phone call')	
		{
			return Ext.String.format(
		        '<table class="{2}"><tr><td width="50px"><div class="c-call" title="Task"></div></td><td><b><span class="title">{0}</span></b>&nbsp;&nbsp;{5}</br><span class="lightgray">{1}</span></br><span class="gray">{2}&nbsp;by&nbsp;</span><span class="purple">{3}</span>&nbsp;<span class="gray">{4}</span>&nbsp;<img src="images/{6}.png" title="{6}" style="height:12px"/></td></tr></table>',
			    value,
				record.data.descr,
	            record.data.status,
				record.data.owner,
				record.data._date,
				record.data.crm_name.split(',')[0],
				record.data.source
		    );
		} else
		if (record.data.work_type == 'appointment')	
		{
			return Ext.String.format(
				'<table class="{2}"><tr><td width="50px"><div class="c-event" title="Appointment"></div></td><td><b><span class="title">{0}</span></b>&nbsp;&nbsp;{5}</br><span class="lightgray">{1}</span></br><span class="gray">{2}&nbsp;by&nbsp;</span><span class="purple">{3}</span>&nbsp;<span class="gray">{4}</span>&nbsp;<img src="images/{6}.png" title="{6}" style="height:12px"/></td></tr></table>',
			    value,
				record.data.descr,
	            record.data.status,
				record.data.owner,
				record.data._date,
				record.data.crm_name.split(',')[0],
				record.data.source
		    );
		} else
		if (record.data.work_type == 'note')	
		{
			return Ext.String.format(
				'<table class="{2}"><tr><td width="50px"><div class="c-note" title="Note"></div></td><td><b><span class="title">{0}</span></b>&nbsp;&nbsp;{5}</br><span class="lightgray">{1}</span></br><span class="gray">{2}&nbsp;by&nbsp;</span><span class="purple">{3}</span>&nbsp;<span class="gray">{4}</span>&nbsp;<img src="images/{6}.png" title="{6}" style="height:12px"/></td></tr></table>',
			    value,
				record.data.descr,
	            record.data.status,
				record.data.owner,
				record.data._date,
				record.data.crm_name.split(',')[0],
				record.data.source
		    );
		} else
		if (record.data.work_type == 'email')	
		{
			return Ext.String.format(
				'<table class="{2}"><tr><td width="50px"><div class="c-email" title="Email"></div></td><td><b><span class="title">{0}</span></b>&nbsp;&nbsp;{5}</br><span class="lightgray">{1}</span></br><span class="gray">{2}&nbsp;by&nbsp;</span><span class="purple">{3}</span>&nbsp;<span class="gray">{4}</span>&nbsp;<img src="images/{6}.png" title="{6}" style="height:12px"/></td></tr></table>',
			    value,
				record.data.descr,
	            record.data.status,
				record.data.owner,
				record.data._date,
				record.data.crm_name.split(',')[0],
				record.data.source
		    );
		}
    },
	
	updateSource: function(rec) {
		var me = this;
		me.selected = rec;
		me.where = rec.get('crm_id');
		me.values = 'crm_id';
		me.loadStore();
	},
	
	createColumns: function() {
		var me = this;
		return [{
			text: "Activity",
			dataIndex: 'subject',
			flex: 1,
			renderer: me.renderTitle,
			sortable: false
		},{
			text: "Priority",
			dataIndex: 'priority',
			width: 60,
			hidden: true,
			align: 'right',
			renderer: renderPriority,
			sortable: true
		},{
			text: "Status",
			dataIndex: 'status',
			width: 100,
			hidden: true,
			sortable: true
		},{
			text: "Created on",
			dataIndex: 'userCode',
			width: 100,
			hidden: true,
			sortable: true
		}];
	},

	createGrid: function() {
		var me = this;			
		me.createStore();
		
		me.grid = Ext.create('OCS.GridView', {
			store: me.store,
			columns: me.createColumns(),
			actions: me.createActions(),
			flex: 1,
			animCollapse: true,
			collapsed: me.collapsed,
			func: me.func,
			tbarable: false,
			feature: false,
			viewConfig: {
				trackOver: false,
				stripeRows: true,
				plugins: [{
					ptype: 'preview',
					bodyField: 'descr',
					expanded: true,
					pluginId: 'preview'
				}],
			    emptyText: 'No records'				
			}				
		});
	},

	createPanel: function() {
		var me = this;
		me.createGrid();

		me.panel = Ext.create('Ext.Panel', {
			id: me.tab,
			title: me.title,
			layout: 'border',
			items: [me.grid]
		});

		return me.panel;
	}
});

Ext.define('OCS.MyActivityGrid', {
	extend: 'OCS.ActivityGrid',
	func: 'crm_my_activity_list',
	sortField: 'priority',
	tab : 'my_activity_property',
	dateField: '_date',
	title: 'My Activities',
	icon: 'task',
	modelName: 'CRM_CALENDAR',
	collapsed : false,	
	
	createActions: function() {
		var me = this;
		me.actions = [Ext.create('Ext.Action', {
				iconCls: 'list',
				text: 'Views',
				menu: {
					xtype: 'menu',
					items: [						
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Task List',
							handler: function(widget, event) {
								me.filterData('Task List');
							}
						}),
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Appointment List',
							handler: function(widget, event) {
								me.filterData('Appointment List');
							}
						}),
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Phone Call List',
							handler: function(widget, event) {
								me.filterData('Phone Call List');
							}
						}),
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Email List',
							handler: function(widget, event) {
								me.filterData('Email List');
							}
						}),
						'-',					
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'All Activity List (Case)',
							handler: function(widget, event) {
								me.filterData('All Activity List (Case)');
							}
						}),
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'All Activity List',
							handler: function(widget, event) {
								me.filterData('All Activity List');
							}
						})
					]
				}		
			}),
			Ext.create('Ext.Action', {
				iconCls : 'save',
				text: 'Complete',
				handler: function(widget, event) {
					var records = me.grid.getView().getSelectionModel().getSelection();
					if (records.length == 0) {
						 Ext.MessageBox.alert('Status', 'No selection !', function() {});
						 return;
					}

					me.selected = me.grid.getView().getSelectionModel().getSelection()[0];
					if (me.selected.get('work_type') == 'phone call') {
						Ext.Ajax.request({
						   url: 'avia.php',
						   params: {handle: 'web', table: 'crm_calllog', action: 'update', values: "callresult='success'", where: "id="+me.selected.get('id')},
						   success: function(response, opts) {
							   me.store.reload();
						   },
						   failure: function(response, opts) {										   
							  Ext.MessageBox.alert('Status', 'Error !', function() {});
						   }
						});
					} else
					if (me.selected.get('work_type') == 'email') {
						Ext.Ajax.request({
						   url: 'avia.php',
						   params: {handle: 'web', table: 'crm_emails', action: 'update', values: "email_status='sent'", where: "id="+me.selected.get('id')},
						   success: function(response, opts) {
							   me.store.reload();
						   },
						   failure: function(response, opts) {										   
							  Ext.MessageBox.alert('Status', 'Error !', function() {});
						   }
						});
					} else
					if (me.selected.get('work_type') == 'appointment') {
						Ext.Ajax.request({
						   url: 'avia.php',
						   params: {handle: 'web', table: 'crm_events', action: 'update', values: "event_status='completed'", where: "id="+me.selected.get('id')},
						   success: function(response, opts) {
							   me.store.reload();
						   },
						   failure: function(response, opts) {										   
							  Ext.MessageBox.alert('Status', 'Error !', function() {});
						   }
						});
					}  else
					if (me.selected.get('work_type') == 'task') {
						Ext.Ajax.request({
						   url: 'avia.php',
						   params: {handle: 'web', table: 'crm_tasks', action: 'update', values: "task_status='completed'", where: "id="+me.selected.get('id')},
						   success: function(response, opts) {
							   me.store.reload();
						   },
						   failure: function(response, opts) {										   
							  Ext.MessageBox.alert('Status', 'Error !', function() {});
						   }
						});
					}

					me.grid.getView().getSelectionModel().clearSelections();
				}
			})			
		];

		return me.actions;
	},

	createColumns: function() {
		var me = this;
		return [{
			text: "Activity",
			dataIndex: 'subject',
			flex: 1,
			renderer: me.renderTitle,
			sortable: false
		},{
			text: "Priority",
			dataIndex: 'priority',
			width: 50,
			align: 'right',
			hidden: true,
			renderer: renderPriority,
			sortable: true
		},{
			text: "Status",
			dataIndex: 'status',
			width: 100,
			hidden: true,
			sortable: true
		},{
			text: "Created on",
			dataIndex: 'userCode',
			width: 100,
			hidden: true,
			sortable: true
		}];
	},

	updateSource: function(rec) {
		var me = this;
		me.selected = rec;
		me.where = rec.get('crm_id');
		me.values = 'crm_id';
		me.loadStore();
	},		

	createPanel: function() {
		var me = this;
		me.createGrid();

		me.panel = Ext.create('Ext.Panel', {
			id: me.tab,
			title: me.title,
			width: 220,
			split: true,
			border: true,
			layout: 'border',
			region: 'south',
			flex: 1.5,
			items: [me.grid]
		});

		return me.panel;
	}
});

Ext.define('OCS.CaseGrid', {
	extend: 'OCS.ActivityGrid',
	func: 'crm_complain_list',
	tab : 'case_property',
	title: 'Recent cases',
	icon: 'cases',
	dateField: '_date',
	sortField: 'complain_status',
	modelName: 'CRM_COMPLAIN',
	region: 'north',
	
	createActions: function() {
		var me = this;
		me.actions = [
			Ext.create('Ext.Action', {
				iconCls : 'add',  
				text: 'Add ...',
				handler: function(widget, event) {
					new OCS.ComplainWindow({
						selected: me.selected
					}).createWindow();
				}
			})
		];
			
		return me.actions;
	},

	createColumns: function() {
		var me = this;
		return [{
			text: 'Case title',
			dataIndex: 'complain_reason',
			width: 180,
			sortable: false
		},{
			text: "Priority",
			dataIndex: 'priority',
			width: 60,
			renderer: renderPriority,
			sortable: true
		},{
			text: "Status",
			dataIndex: 'complain_status',
			width: 70,
			sortable: true
		},{
			text: 'Created On',
			dataIndex: '_date',
			width:110,
			sortable: true
		}];
	}
});

Ext.define('OCS.OpportunityGrid', {
	extend: 'OCS.CaseGrid',
	func: 'crm_customer_opportunity_list',
	sortField: 'stage',
	tab : 'opportunity_property',
	dateField: 'closing_date',
	title: 'Recent Deals',
	icon: 'sales',
	modelName: 'CRM_DEAL',
	collapsed : false,
	region: 'center',
	
	createActions: function() {
		var me = this;
		me.actions = [
			Ext.create('Ext.Action', {
				iconCls  : 'add',  
				text: 'Add ...',
				handler: function(widget, event) {
					new OCS.NewDealWindow({
						selected: me.selected
					}).createWindow();
				}
			})
		];
			
		return me.actions;
	},

	createColumns: function() {
		var me = this;
		return [{
			text: "Topic",
			dataIndex: 'deal',
			width: 200,
			sortable: false
		},{
			text: "Status",
			dataIndex: 'stage',
			width: 80,		
			renderer: renderDealLevel,
			sortable: true
		},{
			text: "Close Date",
			dataIndex: 'closing_date',
			width: 100,
			sortable: true
		},{
			text: "Expected Revenue",
			dataIndex: 'expected_revenue',
			renderer: renderMoney,
			align: 'right',
			width: 100,
			sortable: true
		}];
	},

	createGrid: function() {
		var me = this;			
		me.createStore();

		me.grid = Ext.create('OCS.GridView', {
			store: me.store,
			columns: me.createColumns(),
			actions: me.createActions(),
			region: me.region,
			animCollapse: true,
			collapsed: me.collapsed,
			func: me.func,
			tbarable: false,
			feature: false,
			emptyText: 'No Opportunity records found.'
		});	
	}
});

Ext.define('OCS.CustomerSalesPanel', {
	extend: 'OCS.CaseGrid',
	func: 'crm_customer_sales_list',
	sortField: 'end_date',
	tab : 'customer_sales_property',
	dateField: '_date',
	title: 'Sales',
	icon: 'sales',
	modelName: 'CRM_SALES',
	collapsed : false,
	region: 'center',
	
	createActions: function() {
		var me = this;
		me.actions = [
			
		];
			
		return me.actions;
	},

	createColumns: function() {
		var me = this;
		return [{
			text: "Product",
			dataIndex: 'product_name',
			width: 200,
			sortable: false
		},{
			text: "Start Date",
			dataIndex: 'start_date',
			width: 80,		
			sortable: true
		},{
			text: "End date",
			dataIndex: 'end_date',
			width: 100,
			sortable: true
		},{
			text: "Amount",
			dataIndex: 'amount',
			renderer: renderMoney,
			align: 'right',
			summaryType: 'sum',
			summaryRenderer: renderTMoney,
			width: 100,
			sortable: true
		}];
	},

	createGrid: function() {
		var me = this;			
		me.createStore();

		me.grid = Ext.create('OCS.GridView', {
			store: me.store,
			columns: me.createColumns(),
			actions: me.createActions(),
			region: me.region,
			animCollapse: true,
			collapsed: me.collapsed,
			func: me.func,
			tbarable: false,
			feature: true,
			emptyText: 'No records found.'
		});	
	}
});

Ext.define('OCS.DetailGrid', {
	extend: 'OCS.ActivityGrid',
	func: 'crm_contact_list',
	tab : 'detail_property',
	title: 'Property',
	icon: 'call',
	table: 'crm_customer',
	dateField: '_date',
	sortField: 'crm_id',
	modelName: 'CRM_RETAIL',
	collapsed: false,
	
	createActions: function() {
		var me = this;

		me.actions = [
			Ext.create('Ext.Action', {
				iconCls   : 'add',
				text: 'Add ...',
				handler: function(widget, event) {
					if (selected.get('type') == 'БАЙГУУЛЛАГА') {					
						new OCS.ContactNewWindow({
							record: selected,
							title: 'Add contact to - '+selected.get('firstName')
						}).show();
					} else
						Ext.MessageBox.alert('Status', 'Not available !', function() {});
				}
			}),
			Ext.create('Ext.Action', {
				iconCls   : 'delete',
				text: 'Remove from list ...',
				handler: function(widget, event) {
					var sel = me.grid.getView().getSelectionModel().getSelection();
					if (sel.length > 0) {
						Ext.Msg.confirm('Warning ','Remove from list ?',function(btn){
							if(btn === 'yes'){
								Ext.Ajax.request({
								   url: 'avia.php',
								   params: {handle: 'web', table: 'crm_customer', action: 'update', values: 'parent_crm_id=0', where: "crm_id="+sel[0].get('crm_id')},
								   success: function(response, opts) {
									  me.loadStore();
								   },
								   failure: function(response, opts) {										   
									  Ext.MessageBox.alert('Status', 'Error !', function() {});
								   }
								});	
							}else{
								
							}	
						});		
					} else 
						Ext.MessageBox.alert('Status', 'No selection !', function() {});
				}
			})
		];

		return me.actions;
	},

	updateSource: function(rec) {
		var me = this;
		if (rec.get('type') == 'БАЙГУУЛЛАГА') {
			me.form.modelName = 'CRM_CORPORATE';
			me.form.createSource(rec);
		} else {
			me.form.modelName = 'CRM_RETAIL';
			me.form.createSource(rec);
		}
		
		me.form.updateSource(rec);
		me.where = crm_id;
		me.values = 'parent_crm_id';
		me.grid.where = crm_id;
		me.grid.values = 'parent_crm_id';
		me.loadStore();
	},

	renderTitle: function(value, p, record) {
        return Ext.String.format(
            '<table><tr><td><div class="c-contact"></div></td><td><b><span class="title">{0}</span></b></br><span class="gray">{1}&nbsp;*{3}</br><a href="mailto:{2}">{2}</a></span></td></tr></table>',
            value,
            record.data.job_title,
            record.data.email,
			record.data.decision_maker
        );
    },
	
	initSource: function() {
		var me = this;
		me.rec = {
		};
	},

	createColumns: function() {
		var me = this;
		return [{
			text: 'Contact name',
			dataIndex: 'crm_name',
			renderer: me.renderTitle,
			flex: 1,
			sortable: false
		},{
			text: 'Хариуцагч',
			dataIndex: 'userCode',
			width: 100,
			hidden: true,
			sortable: true
		},{
			text: 'Phone',
			dataIndex: 'phone',
			width: 80,
			align: 'right',
			sortable: true,
			renderer: renderPhone
		}];
	},

	createPanel: function() {
		var me = this;
		me.createGrid();
		
		me.form = new OCS.PropertyGrid({
			modelName: me.modelName,
			closable: false,
			title: '',
			iconCls: '',
			split: true,
			flex: 1,
			border: false,
			region: 'north',
			sealedColumns: true,
			buttons: [{
					text: 'Commit',
					iconCls: 'commit',
					handler: function() {
						me.updateRecord();
					}
				}
			]
		}); 
		
	//	me.grid.setTitle('Contact list');
		me.panel = Ext.create('Ext.Panel', {
			id: me.tab,
			title: me.title,			
			border: false,
			layout: 'border',
			items: [me.form, me.grid]
		});

		return me.panel;
	}
});

Ext.define('OCS.DealView', {
	extend: 'OCS.GridWithFormPanel',
	func: 'crm_deal_list',	
	sortField: 'closing_date',
	table: 'crm_deals',
	tab: 'my_deal_list',
	title: 'All Deals',
	sub: 'my_open_leads',
	primary: 'deal_id',
	xlsName: 'Deal',
	
	filterData: function(views) {
		var me = this;		
		me.title = views;
		me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: me.func, values: me.values, where: me.where, views: views};
		me.store.loadPage(1);
	},

	createActions: function() {
		var me = this;
		me.actions = [
			Ext.create('Ext.Action', {
				iconCls: 'list',
				text: 'Views',
				menu: {
					xtype: 'menu',
					items: [
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Open Deals',
							handler: function(widget, event) {
								me.filterData('Open Deals');
							}
						}),
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Closed Deals',
							handler: function(widget, event) {
								me.filterData('Closed Deals');
							}
						}),
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Opportunity List',
							handler: function(widget, event) {
								me.filterData('Opportunity List');
							}
						}),
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Quote List',
							handler: function(widget, event) {
								me.filterData('Quote List');
							}
						}),
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'All Deals',
							handler: function(widget, event) {
								me.filterData('All Deals');
							}
						}),
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Recent Opened Deals',
							handler: function(widget, event) {
								me.filterData('Recent Opened Deals');
							}
						}),
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Campaign Deals',
							handler: function(widget, event) {
								me.filterData('Campaign Deals');
							}
						}),
						'-',
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'All deals in current fiscal year',
							handler: function(widget, event) {
								me.filterData('All deals in current fiscal year');
							}
						})
					]
				}		
			}),
			'-',
			Ext.create('Ext.Action', {
				iconCls   : 'edit',
				text: 'Expand...',
				handler: function(widget, event) {
					if (me.grid.getView().getSelectionModel().getSelection().length > 0) {
						new OCS.NewDealWindow({
							selected: me.grid.getView().getSelectionModel().getSelection()[0]
						}).createWindow();
					} else 
						Ext.MessageBox.alert('Status', 'No selection !', function() {});
				}
			}),			
			Ext.create('Ext.Action', {
				iconCls   : 'delete',
				text: 'Delete',
				handler: function(widget, event) {
					me.deleteRecord();
				}
			}),
			'-',
			Ext.create('Ext.Action', {
				iconCls   : 'import',
				text: 'Import...',
				handler: function(widget, event) {
					new OCS.UploadWindow({
						name: me.xlsName						
					}).show();
				}
			}),	
			Ext.create('Ext.Action', {
				iconCls  : 'export',
				text: 'Export...',
				disabled: (user_level == '0'),
				handler: function(widget, event) {
					if (!Ext.fly('frmDummy')) {
						var frm = document.createElement('form');
						frm.id = 'frmDummy';
						frm.name = 'url-post';
						frm.className = 'x-hidden';
						document.body.appendChild(frm);
					}

					Ext.Ajax.request({
					   url: 'avia.php',
					   isUpload: true,
					   form: Ext.fly('frmDummy'),
					   params: {handle: 'file', action:'export', where: me.xlsName},					
					   success: function(response, opts) {					
						  Ext.MessageBox.alert('Status', 'Success !', function() {});
					   },
					   failure: function(response, opts) {
						  Ext.MessageBox.alert('Status', 'Error !', function() {});
					   }
					});	
				}
			})
		];

		return me.actions;
	},

	createView: function() {
		var me = this;
		me.modelName = 'CRM_DEAL';
		me.createStore();

		me.grid = Ext.create('OCS.GridView', {	
			id: me.tab,
			title: me.title,
			store: me.store,
			flex: 1,
			func: me.func,
			feature: true,
			actions: me.createActions(),
			columns: me.createColumns(),
			viewConfig: {
				itemclick: function(dv, record, item, index, e) {
					views['deals'].action.select(record);
				}
			}
		});

		me.grid.on('itemclick', function(dv, record, item, index, e) {
				views['deals'].action.select(record);				
			}
		);

		return me.grid;
	},
		
	reload: function() {
		var me = this;
		me.store.loadPage(1);
	}
});


Ext.define('OCS.Deals', {
	extend: 'OCS.Module',
	
	reload: function(rec) {
		var me = this;
		me.deals.reload();
		me.action.select(rec);
	},

	createPanel: function() {
		var me = this;
		
		me.deals = new OCS.DealView();
		me.action = new OCS.DealAction();

		me.panel = Ext.create('Ext.Panel', {	
			layout: 'border',
			region: 'center',
			border: false,
			bodyPadding: 2,
			defaults: {
				collapsible: true,
				split: true,
				border: false
			},
			items: [{	
				region: 'center',
				layout: 'border',				
				title: '',
				border: false,
				collapsible: false,
				items: [
					{
						region: 'center',	
						flex: 0.55,
						layout: 'border',						
						items: [me.deals.createView()]
					}, me.action.createPanel()
				]
			}]
		});
		

		return me.panel;
	}
});


Ext.define('OCS.DealAction', {
	extend: 'OCS.Module',

	select: function(rec) {
		var me = this;
		if (rec) {		
			me.selected = rec;
			me.detail.update(me.tmplMarkup[rec.get('stage')].apply(rec.data));
			
			me.dealContact.updateSource(rec);
			me.dealActivity.updateSource(rec);
			me.dealProduct.updateSource(rec);
			me.dealCompotetor.updateSource(rec);
			me.dealTeams.updateSource(rec);

			me.panel.expand();
			Ext.getCmp('deal_next_stage').setText('Next Stage');
			if (rec.get('stage') == 'lead')
			{
				Ext.getCmp('deal_delete').setText('Disqualify');
				Ext.getCmp('deal_delete').setDisabled(false);
				Ext.getCmp('deal_closewon').setDisabled(true);
				Ext.getCmp('deal_closelost').setDisabled(true);
				Ext.getCmp('deal_assign').setDisabled(false);
			} else
			if (rec.get('stage') == 'opportunity')
			{
				Ext.getCmp('deal_delete').setText('Postponed');
				Ext.getCmp('deal_delete').setDisabled(false);
				Ext.getCmp('deal_assign').setDisabled(false);
				Ext.getCmp('deal_closewon').setDisabled(false);
				Ext.getCmp('deal_closelost').setDisabled(false)
			} else
			if (rec.get('stage') == 'quote')
			{
				Ext.getCmp('deal_delete').setText('Postponed');
				Ext.getCmp('deal_delete').setDisabled(false);
				Ext.getCmp('deal_assign').setDisabled(false);
				Ext.getCmp('deal_closewon').setDisabled(false);
				Ext.getCmp('deal_closelost').setDisabled(false)
			} else
			if (rec.get('stage') == 'disqualified')
			{
				Ext.getCmp('deal_delete').setText('Qualify');
				Ext.getCmp('deal_delete').setDisabled(true);
				Ext.getCmp('deal_assign').setDisabled(true);
				Ext.getCmp('deal_closewon').setDisabled(true);
				Ext.getCmp('deal_closelost').setDisabled(true);
			} else
			if (rec.get('stage') == 'close as won')
			{
				Ext.getCmp('deal_delete').setDisabled(true);
				Ext.getCmp('deal_assign').setDisabled(true);
				Ext.getCmp('deal_closewon').setDisabled(true);
				Ext.getCmp('deal_closelost').setDisabled(true);

				Ext.getCmp('deal_next_stage').setText('Detail');
			}
		} else
			me.panel.collapse();
	},

	createTmpl: function() {
		var me = this;
		me.tmplMarkup = [];

		me.tmplMarkup['lead'] = new Ext.XTemplate(
			'<table class="level"><tr><td class="active">LEAD</td><td>OPPORTUNITY</td><td>QUOTE</td><td>CLOSE</td></tr></table>',
			'<table class="deals"><tr><td width="120px">Topic:</td><td><b>{deal}</b></td></tr>',
			'<tr><td>Account:</td><td><b>{[this.renderCRMName(values.crm_name)]}</b></td></tr>',
			'<tr><td>Phone:</td><td><b>{phone}</b></td></tr>',
			'<tr><td>Description:</td><td><b>{descr}</b></td></tr></table>',
			{
				renderCRMName: function(v) {
					if (v.indexOf(',') != -1)
					{	
						d = v.split(',');
						return d[0];
					}

					return v;
				}
			}
		);

		me.tmplMarkup['opportunity'] = new Ext.XTemplate(
			'<table class="level"><tr><td>LEAD</td><td class="active">OPPORTUNITY</td><td>QUOTE</td><td>CLOSE</td></tr></table>',
			'<table class="deals"><tr><td width="120px">Topic:</td><td><b>{deal}</b></td></tr>',
			'<tr><td>Account:</td><td><b>{[this.renderCRMName(values.crm_name)]}</b></td></tr>',
			'<tr><td>Probablity %:</td><td><b>{probablity} %</b></td></tr>',
			'<tr><td>Expected revenue:</td><td><b>{[this.renderMoney(values.expected_revenue)]}</b></td></tr>',
			'<tr><td>Identify competitor:</td><td><b>{[this.renderIsEmpty(values.competitor_name)]}</b></td></tr>',
			'<tr><td>Current Situation:</td><td><b>{[this.renderIsEmpty(values.current_situation)]}</b></td></tr>',
			'<tr><td>Customer Need:</td><td><b>{[this.renderIsEmpty(values.customer_need)]}</b></td></tr>',
			'<tr><td>Proposed solution:</td><td><b>{[this.renderIsEmpty(values.proposed_solution)]}</b></td></tr>',
			'</table>',
			{
				renderCRMName: function(v) {
					if (v.indexOf(',') != -1)
					{	
						d = v.split(',');
						return d[0];
					}

					return v;
				},
				
				renderMoney: function(v) {
					return Ext.util.Format.number(v, '00,00,000.00')+'₮';
				},

				renderIsEmpty: function(v) {
					if (!v)
						return '<i>not complete</i>';

					return v;
				}
			}
		);

		me.tmplMarkup['quote'] = new Ext.XTemplate(
			'<table class="level"><tr><td>LEAD</td><td>OPPORTUNITY</td><td class="active">QUOTE</td><td>CLOSE</td></tr></table>',
			'<table class="deals"><tr><td width="120px">Topic:</td><td><b>{deal}</b></td></tr>',
			'<tr><td>Account:</td><td><b>{[this.renderCRMName(values.crm_name)]}</b></td></tr>',
			'<tr><td>Probablity %:</td><td><b>{probablity} %</b></td></tr>',
			'<tr><td>Expected revenue:</td><td><b>{[this.renderMoney(values.expected_revenue)]}</b></td></tr>',
			'<tr><td>Identify competitor:</td><td><b>{[this.renderIsEmpty(values.competitor_name)]}</b></td></tr>',
			'<tr><td>Current Situation:</td><td><b>{[this.renderIsEmpty(values.current_situation)]}</b></td></tr>',
			'<tr><td>Customer Need:</td><td><b>{[this.renderIsEmpty(values.customer_need)]}</b></td></tr>',
			'<tr><td>Proposed solution:</td><td><b>{[this.renderIsEmpty(values.proposed_solution)]}</b></td></tr>',
			'</table>',
			{
				renderCRMName: function(v) {
					if (v.indexOf(',') != -1)
					{	
						d = v.split(',');
						return d[0];
					}

					return v;
				},
				
				renderMoney: function(v) {
					return Ext.util.Format.number(v, '00,00,000.00')+'₮';
				},

				renderIsEmpty: function(v) {
					if (!v)
						return '<i>not complete</i>';

					return v;
				}
			}
		);

		me.tmplMarkup['close as won'] = new Ext.XTemplate(
			'<table class="level"><tr><td>LEAD</td><td>OPPORTUNITY</td><td>QUOTE</td><td class="active">CLOSE</td></tr></table>',
			'<table class="deals"><tr><td width="120px">Topic:</td><td><b>{deal}</b></td></tr>',
			'<tr><td>Account:</td><td><b>{[this.renderCRMName(values.crm_name)]}</b></td></tr>',
			'<tr><td>Probablity %:</td><td><b>{probablity} %</b></td></tr>',
			'<tr><td>Expected revenue:</td><td><b>{[this.renderMoney(values.expected_revenue)]}</b></td></tr>',
			'<tr><td>Current Situation:</td><td><b>{[this.renderIsEmpty(values.current_situation)]}</b></td></tr>',
			'<tr><td>Customer Need:</td><td><b>{[this.renderIsEmpty(values.customer_need)]}</b></td></tr>',
			'<tr><td>Proposed solution:</td><td><b>{[this.renderIsEmpty(values.proposed_solution)]}</b></td></tr>',
			'</table>',
			{
				renderCRMName: function(v) {
					if (v.indexOf(',') != -1)
					{	
						d = v.split(',');
						return d[0];
					}

					return v;
				},
				
				renderMoney: function(v) {
					return Ext.util.Format.number(v, '00,00,000.00')+'₮';
				},

				renderIsEmpty: function(v) {
					if (!v)
						return '<i>not complete</i>';

					return v;
				}
			}
		);

		me.tmplMarkup['disqualified'] = new Ext.XTemplate(
			'<table class="disqualifed"><tr><td>DISQUALIFED</td></tr></table>',
			'<table class="deals"><tr><td width="120px">Topic:</td><td><b>{deal}</b></td></tr>',
			'<tr><td>Account:</td><td><b>{[this.renderCRMName(values.crm_name)]}</b></td></tr>',
			'<tr><td>Disqualified date:</td><td><b>{closing_date}</b></td></tr>',
			'<tr><td>Description:</td><td><b>{descr}</b></td></tr></table>',
			{
				renderCRMName: function(v) {
					if (v.indexOf(',') != -1)
					{	
						d = v.split(',');
						return d[0];
					}

					return v;
				}
			}
		);

		me.tmplMarkup['close as lost'] = new Ext.XTemplate(
			'<table class="disqualifed"><tr><td>DISQUALIFED</td></tr></table>',
			'<table class="deals"><tr><td width="120px">Deal name:</td><td><b>{deal}</b></td></tr>',
			'<tr><td>Account:</td><td><b>{crm_name}</b></td></tr>',
			'<tr><td>Disqualified date:</td><td><b>{closing_date}</b></td></tr>',
			'<tr><td>Description:</td><td><b>{descr}</b></td></tr></table>',
			{
				renderCRMName: function(v) {
					if (v.indexOf(',') != -1)
					{	
						d = v.split(',');
						return d[0];
					}

					return v;
				}
			}
		);
	},	

	createPanel: function() {
		var me = this;
		me.createTmpl();
				
		me.dealContact = new OCS.DealContactGrid();
		me.dealActivity = new OCS.DealActivityGrid();
		me.dealProduct = new OCS.DealProductGrid();
		me.dealCompotetor = new OCS.DealCompetitorGrid();
		me.dealTeams = new OCS.DealSalesTeamGrid();

		me.tabs = Ext.widget('tabpanel', {
			activeTab: 0,
			flex: 1,			
			region: 'center',
			tabPosition: 'top',	
			items: [
				me.dealContact.createPanel(),			
				me.dealActivity.createPanel(),
				me.dealProduct.createPanel(),
				me.dealCompotetor.createPanel(),
				me.dealTeams.createPanel()
			]
		});
		
		me.detail = Ext.create('Ext.Panel', {
				border: false,
				region: 'north',
				height: 250,
				border: true,
				autoScroll: true,
				split: true,
				bodyPadding: 5,
				dockedItems:[{
					xtype: 'toolbar',
					dock: 'bottom',
					items: [ {
						iconCls: 'deal_qualify',
						text: 'Disqualify',
						id: 'deal_delete',
						scope: this,
						handler: function() {
							if (me.selected.get('owner') == logged) {			
								new OCS.DealDescrWindow({
									selected: me.selected,
									title: Ext.getCmp('deal_delete').getText()+' detail'
								}).show();
							}
							else
								Ext.MessageBox.alert('Error', 'Not available !', function() {});
						}
					},'-', {
						iconCls: 'deal_next_stage',
						text: 'Next stage...',
						id: 'deal_next_stage',
						scope: this,
						handler: function() {
							if (me.selected.get('owner') == logged) {							
								new OCS.StageWindow({
									selected: me.selected
								}).show();
							} else 
								Ext.MessageBox.alert('Error', 'Not available !', function() {});
						}
					}, {
						iconCls: 'deal_assign',
						text: 'Assign...',
						id: 'deal_assign',
						scope: this,
						handler: function() {
							if (me.selected.get('owner') == logged)
								new OCS.AssignWindow({
									selected: me.selected
								}).show();
							else
								Ext.MessageBox.alert('Error', 'Not available !', function() {});
						}
					},'-',
					{
						iconCls: 'deal_won',
						text: 'Close as won',
						id: 'deal_closewon',
						scope: this,
						handler: function() {
							if (me.selected.get('owner') == logged) {				
								new OCS.DealDescrWindow({
									selected: me.selected,
									stage: 'close as won',
									title: 'Close as won'
								}).show();
							} else 
								Ext.MessageBox.alert('Error', 'Not available !', function() {});
						}
					},
					{
						iconCls: 'deal_lost',
						text: 'Close as lost',
						id: 'deal_closelost',
						scope: this,
						handler: function() {
							if (me.selected.get('owner') == logged) {		
								new OCS.DealDescrWindow({
									selected: me.selected,
									stage: 'close as lost',
									title: 'Close as lost'
								}).show();
							} else 
								Ext.MessageBox.alert('Error', 'Not available !', function() {});
						}
					}]
				}],
				bodyStyle: "background: #ffffff;",
				html: 'Please select a deal to see additional details.'
		});

		me.panel = Ext.create('Ext.Panel', {	
			layout: 'border',
			border: true,
			flex: 0.45,
			region: 'east',
			title: 'Stage',
			collapsible: true,
			collapsed: true,
			split: true,
			bodyPadding: 4,
			items: [me.detail, me.tabs]
		});		

		return me.panel;
	}
});

Ext.define('OCS.Cases', {
	extend: 'OCS.Module',
	
	reload: function(rec) {
		var me = this;
		me.cases.reload();
		me.action.select(rec);
	},

	createPanel: function() {
		var me = this;
		
		me.cases = new OCS.CaseView();
		me.action = new OCS.CaseAction();

		me.panel = Ext.create('Ext.Panel', {	
			layout: 'border',
			region: 'center',
			border: false,
			bodyPadding: 2,
			defaults: {
				collapsible: true,
				split: true,
				border: false
			},
			items: [{	
				region: 'center',
				layout: 'border',				
				title: '',
				border: false,
				collapsible: false,
				items: [
					{
						region: 'center',	
						flex: 0.5,
						layout: 'border',						
						items: [me.cases.createView()]
					}, me.action.createPanel()
				]
			}]
		});
		

		return me.panel;
	}
});

Ext.define('OCS.CaseActivityGrid', {
	extend: 'OCS.ActivityGrid',
	func: 'crm_customer_activity_list',
	sortField: '_date',
	tab : 'case_activity_property',
	dateField: '_date',
	title: 'Activities',
	values : 'crm_id,case_id',
	icon: 'task',
	modelName: 'CRM_CALENDAR',
	collapsed : false,	
	
	updateSource: function(rec) {
		var me = this;
		me.selected = rec;
		me.action = rec.get('owner') == logged;
		me.where = rec.get('crm_id')+','+rec.get('case_id');
		me.values = 'crm_id,case_id';
		me.loadStore();
	}
});


Ext.define('OCS.CaseView', {
	extend: 'OCS.GridWithFormPanel',
	func: 'crm_complain_list',	
	sortField: 'closing_date',
	table: 'crm_complain',
	tab: 'my_case_list',
	title: 'All Cases',
	sub: 'my_open_cases',
	primary: 'case_id',
	
	filterData: function(views) {
		var me = this;		
		me.title = views;
		me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: me.func, values: me.values, where: me.where, views: views};
		me.store.loadPage(1);
	},

	createActions: function() {
		var me = this;
		me.actions = [			
			Ext.create('Ext.Action', {
				iconCls: 'list',
				text: 'Views',
				menu: {
					xtype: 'menu',
					items: [
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Open Cases',
							handler: function(widget, event) {
								me.filterData('Open Cases');
							}
						}),
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Solved Cases',
							handler: function(widget, event) {
								me.filterData('Solved Cases');
							}
						}),
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'All Cases',
							handler: function(widget, event) {
								me.filterData('All Cases');
							}
						}),
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Recent Opened Cases',
							handler: function(widget, event) {
								me.filterData('Recent Opened Cases');
							}
						})						
					]
				}		
			}),
			'-',
			Ext.create('Ext.Action', {
				iconCls   : 'edit',
				text: 'Expand...',
				handler: function(widget, event) {
					if (me.grid.getView().getSelectionModel().getSelection().length > 0) {
						new OCS.ComplainWindow({
							selected: me.grid.getView().getSelectionModel().getSelection()[0]
						}).createWindow();
					} else 
						Ext.MessageBox.alert('Status', 'No selection !', function() {});					
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

	createView: function() {
		var me = this;
		me.modelName = 'CRM_COMPLAIN';
		me.createStore();

		me.grid = Ext.create('OCS.GridView', {	
			id: me.tab,
			title: me.title,
			store: me.store,
			flex: 1,
			func: me.func,
			feature: true,
			actions: me.createActions(),
			columns: me.createColumns(),			
			viewConfig: {
				itemclick: function(dv, record, item, index, e) {
					views['cases'].action.select(record);
				}
			}
		});

		me.grid.on('itemclick', function(dv, record, item, index, e) {
				views['cases'].action.select(record);				
			}
		);

		return me.grid;
	},
		
	reload: function() {
		var me = this;
		me.store.loadPage(1);
	}
});


Ext.define('OCS.CaseAction', {
	extend: 'OCS.Module',

	select: function(rec) {
		var me = this;
		if (rec) {		
			me.selected = rec;
			me.detail.update(me.tmplMarkup[rec.get('case_stage')].apply(rec.data));
			
			me.caseActivity.updateSource(rec);
			me.caseProduct.updateSource(rec);
			me.caseHistory.updateSource(rec);

			me.panel.expand();
			Ext.getCmp('case_next_stage').setText('Next Stage');

			Ext.getCmp('case_next_stage').setDisabled(false);
			Ext.getCmp('case_resolve').setDisabled(false);
			Ext.getCmp('case_cancel').setDisabled(false);
			Ext.getCmp('case_assign').setDisabled(false);			

			if (rec.get('case_stage') == 'resolve') {
				Ext.getCmp('case_next_stage').setDisabled(true);
				Ext.getCmp('case_resolve').setDisabled(true);
				Ext.getCmp('case_cancel').setDisabled(true);
				Ext.getCmp('case_assign').setDisabled(true);			
			}

			if (rec.get('complain_status') == 'inactive') {
				Ext.getCmp('case_next_stage').setText('Reactive case');		
				Ext.getCmp('case_resolve').setDisabled(true);
				Ext.getCmp('case_cancel').setDisabled(true);
				Ext.getCmp('case_assign').setDisabled(true);			
			}
		} else
			me.panel.collapse();
	},

	createTmpl: function() {
		var me = this;
		me.tmplMarkup = [];

		me.tmplMarkup['identify'] = new Ext.XTemplate(
			'<table class="level"><tr><td class="active">IDENTIFY</td><td>RESEARCH</td><td>RESOLVE</td></tr></table>',
			'<table class="deals"><tr><td width="120px">Case Title:</td><td><b>{complain_reason}</b></td></tr>',
			'<tr><td>Account:</td><td><b>{[this.renderCRMName(values.crm_name)]}</b></td></tr>',
			'<tr><td>Phone:</td><td><b>{phone}</b></td></tr>',
			'<tr><td>Owner:</td><td><b>{owner}</b></td></tr>',
			'<tr><td>Description:</td><td><b>{descr}</b></td></tr></table>',
			{
				renderCRMName: function(v) {
					if (v.indexOf(',') != -1)
					{	
						d = v.split(',');
						return d[0];
					}

					return v;
				}
			}
		);

		me.tmplMarkup['research'] = new Ext.XTemplate(
			'<table class="level"><tr><td>IDENTIFY</td><td class="active">RESEARCH</td><td>RESOLVE</td></tr></table>',
			'<table class="deals"><tr><td width="120px">Case Title:</td><td><b>{complain_reason}</b></td></tr>',
			'<tr><td>Account:</td><td><b>{[this.renderCRMName(values.crm_name)]}</b></td></tr>',
			'<tr><td>Resolution type:</td><td><b>{resolution_type}</b></td></tr>',
			'<tr><td>Resolution:</td><td><b>{resolution}</b></td></tr>',
			'<tr><td>Owner:</td><td><b>{owner}</b></td></tr>',
			'<tr><td>Close date:</td><td><b>{closing_date}</b></td></tr>',
			'</table>',
			{
				renderCRMName: function(v) {
					if (v.indexOf(',') != -1)
					{	
						d = v.split(',');
						return d[0];
					}

					return v;
				}
			}
		);

		me.tmplMarkup['resolve'] = new Ext.XTemplate(
			'<table class="level"><tr><td>IDENTIFY</td><td>RESEARCH</td><td class="active">RESOLVE</td></tr></table>',
			'<table class="deals"><tr><td width="120px">Case Title:</td><td><b>{complain_reason}</b></td></tr>',
			'<tr><td>Account:</td><td><b>{[this.renderCRMName(values.crm_name)]}</b></td></tr>',
			'<tr><td>Resolution type:</td><td><b>{resolution_type}</b></td></tr>',
			'<tr><td>Resolution:</td><td><b>{resolution}</b></td></tr>',
			'<tr><td>Owner:</td><td><b>{owner}</b></td></tr>',
			'<tr><td>Close date:</td><td><b>{closing_date}</b></td></tr>',
			'</table>',
			{
				renderCRMName: function(v) {
					if (v.indexOf(',') != -1)
					{	
						d = v.split(',');
						return d[0];
					}

					return v;
				}
			}
		);
	},	

	createPanel: function() {
		var me = this;
		me.createTmpl();
				
		me.caseActivity = new OCS.CaseActivityGrid();
		me.caseProduct = new OCS.CaseProductGrid();
		me.caseHistory = new OCS.CaseHistoryGrid();

		me.tabs = Ext.widget('tabpanel', {
			activeTab: 0,
			flex: 1,			
			region: 'center',
			tabPosition: 'top',	
			items: [			
				me.caseActivity.createPanel(),
				me.caseProduct.createPanel(),
				me.caseHistory.createPanel()
			]
		});
		
		me.detail = Ext.create('Ext.Panel', {
				border: false,
				region: 'north',
				height: 250,
				border: true,
				autoScroll: true,
				split: true,
				bodyPadding: 5,
				dockedItems:[{
					xtype: 'toolbar',
					dock: 'bottom',
					items: [{
						iconCls: 'deal_next_stage',
						text: 'Next stage...',
						id: 'case_next_stage',
						scope: this,
						handler: function() {
							if (me.selected.get('owner') == logged) {
								if (me.selected.get('complain_status') == 'inactive') {
									Ext.Msg.confirm('Warning ','Reactive case ?',function(btn){
										if(btn === 'yes'){
											Ext.Ajax.request({
											   url: 'avia.php',
											   params: {handle: 'web', table: 'crm_complain', action: 'update', values: "complain_status='open'", where: "case_id="+me.selected.get('case_id')},
											   success: function(response, opts) {
												  views['cases'].reload(me.selected);
											   },
											   failure: function(response, opts) {										   
												  Ext.MessageBox.alert('Status', 'Error !', function() {});
											   }
											});		
										}else{
											
										}	
									});	
								} else {
									new OCS.CaseStageWindow({
										selected: me.selected
									}).show();
								}
							} else
								Ext.MessageBox.alert('Error', 'Not available !', function() {});
						}
					}, {
						iconCls: 'deal_assign',
						text: 'Assign...',
						id: 'case_assign',
						scope: this,
						handler: function() {
							if (me.selected.get('owner') == logged)
								new OCS.CaseAssignWindow({
									selected: me.selected
								}).show();
							else
								Ext.MessageBox.alert('Error', 'Not available !', function() {});
						}
					},'-',
					{
						iconCls: 'deal_won',
						text: 'Resolve case',
						id: 'case_resolve',
						scope: this,
						handler: function() {
							if (me.selected.get('owner') == logged)
								new OCS.CaseResolveWindow({
									selected: me.selected
								}).show();
							else
								Ext.MessageBox.alert('Error', 'Not available !', function() {});
						}
					},
					{
						iconCls: 'deal_lost',
						text: 'Cancel case',
						id: 'case_cancel',
						scope: this,
						handler: function() {
							if (me.selected.get('owner') == logged) {
								Ext.Msg.confirm('Warning ','Cancel case ?',function(btn){
									if(btn === 'yes'){
										Ext.Ajax.request({
										   url: 'avia.php',
										   params: {handle: 'web', table: 'crm_complain', action: 'update', values: "complain_status='inactive'", where: "case_id="+me.selected.get('case_id')},
										   success: function(response, opts) {
											  views['cases'].reload(me.selected);
										   },
										   failure: function(response, opts) {										   
											  Ext.MessageBox.alert('Status', 'Error !', function() {});
										   }
										});		
									}else{
										
									}	
								});		
							}
							else
								Ext.MessageBox.alert('Error', 'Not available !', function() {});
						}
					}]
				}],
				bodyStyle: "background: #ffffff;",
				html: 'Please select a deal to see additional details.'
		});

		me.panel = Ext.create('Ext.Panel', {	
			layout: 'border',
			border: true,
			flex: 0.3,
			region: 'east',
			title: 'Stage',
			collapsible: true,
			collapsed: true,
			split: true,
			bodyPadding: 4,
			items: [me.detail, me.tabs]
		});		

		return me.panel;
	}
});

Ext.define('OCS.SettingsPanel', {
	extend: 'OCS.Module',

	createPanel: function() {
		var me = this;

		me.userList = new Ext.create('OCS.GridWithFormPanel', {
							modelName:'CRM_USERS',
							func:'crm_users_list',
							table: 'crm_users',
							title: 'Users',
							defaultRec: {
								data: {
									id: '0',
									user_level: 0,
									company: company
								}
							},
							tab: 'my_crm_users_list'
						});

		me.userGroup = new Ext.create('OCS.GridWithFormPanel', {
							modelName:'CRM_USERS_GROUP',
							func:'crm_user_group_list',
							title: 'Group members',
							table: 'crm_user_groups',
							tab: 'my_crm_user_group_list',
							values: 'groupName',
							defaultRec: {
								data: {
									id: '0'										
								}
							}
						});

		me.panel = Ext.create('Ext.Panel', {	
			layout: 'border',
			region: 'center',
			border: false,
			bodyPadding: 2,
			defaults: {
				collapsible: true,
				split: true,
				border: false
			},
			items: [{	
				region: 'center',
				layout: 'border',				
				title: '',
				border: false,
				collapsible: false,
				items: [
					{
						region: 'center',
						split: true,			
						border: false,
						flex: 1,
						layout: 'border',
						items: [
							{
								id : 'users_list',
								title: 'Users',
								region: 'center',
								flex: 1,
								split: true,
								closable: false,
								layout: 'border',
								items: [
									me.userList.createGrid()
								]
							}, {
								id : 'user_group_list',
								title: 'Group members',
								hidden: !(user_level > 0),
								region: 'west',
								flex: 1,
								split: true,
								closable: false,
								layout: 'border',
								items: [
									me.userGroup.createGrid()
								]
							}							
						]
					},
					{
						xtype: 'panel',
						region: 'north',
						flex: 1.25,
						split: true,
						border: false,
						title: '',
						layout: 'border',
						items: [{
								id : 'product_list',
								title: 'Products',
								region: 'center',
								flex: 0.5,
								split: true,
								closable: false,
								layout: 'border',
								items: [
									new Ext.create('OCS.GridWithFormPanel', {
										modelName:'CRM_PRODUCT',
										func:'crm_product_list',
										title: 'Products',
										table: 'crm_products',
										tab: 'my_crm_product_list',
										defaultRec: {
											data: {
												product_id: '0',
												price: '0'
											}
										}
									}).createGrid()
								]
							}, {
								id : 'user_planning_list',
								title: 'Goals',
								region: 'west',
								flex: 0.5,
								split: true,
								closable: false,
								layout: 'border',
								hidden: !(user_level > 0),
								items: [
									new Ext.create('OCS.GridWithFormPanel', {
										modelName:'CRM_USER_PLANNING',
										func:'crm_user_planning_list',
										title: 'Goals',
										table: 'crm_user_planning',
										tab: 'my_crm_user_planning_list',
										defaultRec: {
											data: {
												id: '0',
												target: '0',
												start_date: Ext.Date.format(new Date(),'Y-m-d'),
												end_date: Ext.Date.format(new Date(),'Y-m-d')
											}
										}
									}).createGrid()
								]
							}			
						]
					}									
				]
			}]
		});
		
		me.userList.selectionModel().on({
			selectionchange: function(sm, selections) {
				if (selections.length) {
					me.userGroup.setDefaultRec({
						data: {
							id: '0',
							groupName: selections[0].get('owner'),
							_date: Ext.Date.format(new Date(),'Y-m-d h:m:s')
						}
					});
					me.userGroup.loadStore(selections[0].get('owner'));
				}			
			}
		});

		return me.panel;
	}
});

Ext.define('OCS.Workspace', {
	extend: 'OCS.Module',		

	createPanel: function() {
		var me = this;

		me.panel = Ext.create('Ext.Panel', {	
			layout: 'border',
			region: 'center',
			border: false,
			items: [
				new Ext.create('OCS.MyProfile', {
					modelName: 'CRM_CALENDAR',
					func: 'crm_calendar_list'
				}).createPanel()					
			]
		});

		return me.panel;
	}
});

Ext.define('OCS.SalesOrders', {
	extend: 'OCS.Module',		

	createPanel: function() {
		var me = this;

		me.panel = Ext.create('Ext.Panel', {	
			layout: 'border',
			region: 'center',
			border: false,
			bodyPadding: 2,
			items: [{
				xtype: 'panel',
				layout: 'border',
				region: 'west',
				split: true,
				flex: 1,
				items: [new OCS.QuotePanel().createGrid()]
			},{			
				xtype: 'panel',
				layout: 'border',
				region: 'center',
				flex: 1,
				items: [new OCS.SalesPanel().createGrid()]
			}]
		});

		return me.panel;
	}
});

Ext.define('OCS.Dashboard', {
	extend: 'OCS.Module',
	
	initCharts: function() {
		var me = this;
		me.charts = [];
		me.charts[0] = new OCS.CampaignChartRevenue();
		me.charts[7] = new OCS.OpportunityRevenueChart();
		me.charts[1] = new OCS.CampaignChartSuccess();
		me.charts[2] = new OCS.CasesByStatus();
		me.charts[3] = new OCS.LeadBySource();
//		me.charts[4] = new OCS.OpportunityByProbability();
		me.charts[5] = new OCS.SalesStagePipeLine();
		me.charts[6] = new OCS.AccountByIndustry();
	},

	reloadCharts: function() {
		var me = this;
		for (i = 0; i < me.charts.length; i++)
			me.charts[i].reloadData();
	},

	createPanel: function() {
		var me = this;			
		me.initCharts();

		me.panel = Ext.create('Ext.Panel', {	
			layout: 'column',
			id:'main-panel',
			region: 'center',
			bodyBorder: false,
			frame: false,
			baseCls:'x-plain',
			bodyPadding: 5,
			bodyStyle: 'background: white;',
			border: false,		
			items: [{
				columnWidth: 1/2,
				padding: '5 5 5 5',
				border: false,
				items:[{
					title:'Stage of Sales pipeline',		
					layout: 'fit',
					height: 400,
					margin: '0 0 10 0',
					columnWidth: 1/2,
					tbar: [{
						text: 'Views',
						iconCls: 'list',
						menu: {
							xtype: 'menu',
							items: [{
								text: 'Today',
								handler: function() {

								}
							},{
								text: 'This week',
								handler: function() {
								}
							},{
								text: 'This month',
								handler: function() {
								}
							},{
								text: 'This year',
								handler: function() {
								}
							}]
						}
					}],
					items: [{
						xtype: 'panel',
						bodyPadding: 30,
						border: false,
						autoLoad: {
							url: 'funnel.php',
							scripts: true
						}
					}]
				},{
					title:'Leads by Source',		
					layout: 'fit',
					height: 400,
					tbar: [{
						text: 'Views',
						iconCls: 'list',
						menu: {
							xtype: 'menu',
							items: [{
								text: 'Today',
								handler: function() {

								}
							},{
								text: 'This week',
								handler: function() {
								}
							},{
								text: 'This month',
								handler: function() {
								}
							},{
								text: 'This year',
								handler: function() {
								}
							}]
						}
					}],
					items: me.charts[3]
				}]
			},{
				columnWidth: 1/2,
				padding: '5 5 5 5',
				border: false,
				items:[{
					layout: 'fit',
					title:'Deals by revenue',		
					columnWidth: 1/2,
					height: 400,
					margin: '0 0 10 0',
					tbar: [{
						text: 'Views',
						iconCls: 'list',
						menu: {
							xtype: 'menu',
							items: [{
								text: 'Today',
								handler: function() {

								}
							},{
								text: 'This week',
								handler: function() {
								}
							},{
								text: 'This month',
								handler: function() {
								}
							},{
								text: 'This year',
								handler: function() {
								}
							}]
						}
					}],
					items: me.charts[7]
				},{
					title:'Cases by Status',		
					layout: 'fit',
					height: 400,
					tbar: [{
						text: 'Views',
						iconCls: 'list',
						menu: {
							xtype: 'menu',
							items: [{
								text: 'Today',
								handler: function() {

								}
							},{
								text: 'This week',
								handler: function() {
								}
							},{
								text: 'This month',
								handler: function() {
								}
							},{
								text: 'This year',
								handler: function() {
								}
							}]
						}
					}],
					items: me.charts[2]
				}]
			}]
		});

		return me.panel;
	}
});


Ext.define('OCS.CampaignActivityGrid', {
	extend: 'OCS.ActivityGrid',
	func: 'crm_campaign_activity_list',
	sortField: 'priority',
	tab : 'campaign_activity_property',
	dateField: '_date',
	title: 'Campaign Activities',
	icon: 'task',
	modelName: 'CRM_CALENDAR',
	collapsed : false,	

	createActions: function() {
		var me = this;
		me.actions = [
			Ext.create('Ext.Action', {
				iconCls: 'list',
				text: 'Views',
				menu: {
					xtype: 'menu',
					items: [						
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Appointment List',
							handler: function(widget, event) {
								me.filterData('Appointment List');
							}
						}),
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Phone Call List',
							handler: function(widget, event) {
								me.filterData('Phone Call List');
							}
						}),
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Email List',
							handler: function(widget, event) {
								me.filterData('Email List');
							}
						}),
						'-',
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'All Activity List',
							handler: function(widget, event) {
								me.filterData('All Activity List');
							}
						})
					]
				}		
			}),'-',
			Ext.create('Ext.Action', {
				iconCls : 'save',
				text: 'Complete',
				handler: function(widget, event) {
					var records = me.grid.getView().getSelectionModel().getSelection();
					if (records.length == 0) {
						 Ext.MessageBox.alert('Status', 'No selection !', function() {});
						 return;
					}

					if (me.owner != logged) {
						Ext.MessageBox.alert('Error', 'Not available !', function() {});
						return;
					}
					me.selected = records[0];
					if (me.selected.get('work_type') == 'phone call') {
						Ext.Ajax.request({
						   url: 'avia.php',
						   params: {handle: 'web', table: 'crm_calllog', action: 'update', values: "callresult='success'", where: "id="+me.selected.get('id')},
						   success: function(response, opts) {
							   me.store.reload();
						   },
						   failure: function(response, opts) {										   
							  Ext.MessageBox.alert('Status', 'Error !', function() {});
						   }
						});
					} else
					if (me.selected.get('work_type') == 'email') {
						Ext.Ajax.request({
						   url: 'avia.php',
						   params: {handle: 'web', table: 'crm_emails', action: 'update', values: "email_status='sent'", where: "id="+me.selected.get('id')},
						   success: function(response, opts) {
							   me.store.reload();
						   },
						   failure: function(response, opts) {										   
							  Ext.MessageBox.alert('Status', 'Error !', function() {});
						   }
						});
					} else
					if (me.selected.get('work_type') == 'appointment') {
						Ext.Ajax.request({
						   url: 'avia.php',
						   params: {handle: 'web', table: 'crm_events', action: 'update', values: "event_status='completed'", where: "id="+me.selected.get('id')},
						   success: function(response, opts) {
							   me.store.reload();
						   },
						   failure: function(response, opts) {										   
							  Ext.MessageBox.alert('Status', 'Error !', function() {});
						   }
						});
					} 
				}
			}),			
			Ext.create('Ext.Action', {
				iconCls  : 'edit',  
				text: 'Expand...',
				handler: function(widget, event) {
					var records = me.grid.getView().getSelectionModel().getSelection();
					if (records.length == 0) {
						 Ext.MessageBox.alert('Status', 'No selection !', function() {});
						 return;
					}

					if (me.owner != logged) {
						Ext.MessageBox.alert('Error', 'Not available !', function() {});
						return;
					}

					me.selected = records[0];
					if (me.selected.get('work_type') == 'task')										
						new OCS.TaskWindow({
							selected: me.selected
						}).createWindow();
					else if (me.selected.get('work_type') == 'appointment')											
						new OCS.EventWindow({
							selected: me.selected
						}).createWindow();
					else if (me.selected.get('work_type') == 'phone call')											
						new OCS.CallLogWindow({
							selected: me.selected
						}).createWindow();
					else if (me.selected.get('work_type') == 'email')											
						new OCS.EmailWindow({
							selected: record
						}).createWindow();
					else if (me.selected.get('work_type') == 'note')											
						new OCS.NotesWindow({
							selected: me.selected
						}).createWindow();
					else if (me.selected.get('work_type') == 'case')											
						new OCS.ComplainWindow({
							selected: me.selected
						}).createWindow();
				}
			})
		];

		return me.actions;
	},

	createColumns: function() {
		var me = this;
		return [{
			text: "Activity",
			dataIndex: 'subject',
			flex: 1,
			renderer: me.renderTitle,
			sortable: false
		},{
			text: "Priority",
			dataIndex: 'priority',
			width: 50,
			align: 'right',
			hidden: true,
			renderer: renderPriority,
			sortable: true
		},{
			text: "Status",
			dataIndex: 'status',
			width: 100,
			hidden: true,
			sortable: true
		},{
			text: "Created on",
			dataIndex: 'userCode',
			width: 100,
			hidden: true,
			sortable: true
		}];
	},

	updateSource: function(rec) {
		var me = this;
		me.selected = rec;
		me.where = rec.get('campaign');
		me.owner = rec.get('owner');
		me.values = 'campaign';
		me.loadStore();
	},		

	startSource: function() {
		var me = this;
		me.where = 'null';
		me.owner = 'null';
		me.values = 'campaign';
		me.loadStore();
	},		

	createPanel: function() {
		var me = this;
		me.createGrid();

		me.panel = Ext.create('Ext.Panel', {
			id: me.tab,
			title: me.title,
			split: true,
			border: true,
			layout: 'border',
			region: 'center',
			items: [me.grid]
		});
		
		me.startSource();
		return me.panel;
	}
});

Ext.define('OCS.Campaigns', {
	extend: 'OCS.Module',
	
	reload: function(rec) {
		var me = this;
		me.selected = rec;
		me.campaignActivity.updateSource(rec);
	},
	
	refresh: function() {
		var me = this;
		me.campaignActivity.updateSource(me.selected);
	},
	
	createPanel: function() {
		var me = this;
		
		me.campaigns = new OCS.CampaignPanel();
		me.campaignActivity = new OCS.CampaignActivityGrid();

		me.panel = Ext.create('Ext.Panel', {	
			layout: 'border',
			region: 'center',
			border: false,
			bodyPadding: 2,
			defaults: {
				collapsible: true,
				split: true,
				border: false
			},
			items: [{	
				region: 'center',
				layout: 'border',				
				title: '',
				border: false,
				collapsible: false,
				items: [
					{
						region: 'center',	
						flex: 0.7,
						layout: 'border',						
						items: [me.campaigns.createGrid()]
					},
					{
						region: 'west',	
						flex: 0.3,
						layout: 'border',						
						split: true,
						border: false,
						items: [me.campaignActivity.createPanel()]
					}
				]
			}]
		});
		

		return me.panel;
	}
});

Ext.define('OCS.CampaignPanel', {	
	extend: 'OCS.GridWithFormPanel',			
	modelName: 'CRM_CAMPAIGN',
	func: 'crm_campaign_list',
	autoSelect: true,
	title: 'Campaign',
	table: 'crm_campaign',
	tab: 'my_crm_campaign_list',
	
	createActions: function() {
		var me = this;
		me.actions = [
			Ext.create('Ext.Action', {
				iconCls  : 'add',
				text: 'New...',
				handler: function(widget, event) {
					me.initSource();
					me.form.setVisible(true);
					Ext.getCmp('customerComponent').collapse();
				}
			}),	
			Ext.create('Ext.Action', {
				iconCls : 'edit',
				text: 'Expand...',
				handler: function(widget, event) {
					me.form.setVisible(true);
				}
			}),
			Ext.create('Ext.Action', {
				iconCls   : 'delete',
				text: 'Delete',
				handler: function(widget, event) {
					me.deleteRecord();
				}
			}),
			'-',
			Ext.create('Ext.Action', {
				iconCls  : 'cmem',
				text: 'Create members',
				handler: function(widget, event) {
					var record = me.grid.getView().getSelectionModel().getSelection()[0];
					if (record.lenght == 0) {
						Ext.MessageBox.alert('Status', 'Not selection !', function() {});
						return;
					}

					if (record.get('owner') != logged) {
						Ext.MessageBox.alert('Status', 'Not available !', function() {});
						return;
					}
					
					var box = Ext.MessageBox.wait('Please wait while I do something or other', 'Performing Actions');
					Ext.Ajax.request({
					   url: 'avia.php',					   
					   params : {handle: 'web', action: 'select', func: 'crm_campaign_create_crm_list', where: record.get('id')},
					   success: function(response, opts) {						  
						  box.hide();
						  Ext.MessageBox.alert('Status', 'Success !', function() {
							 me.reload();
							 views['campaigns'].refresh();
						  });
					   },
					   failure: function(response, opts) {										   
						  Ext.MessageBox.alert('Status', 'Error !', function() {});
					   }
					});		
				}
			}),
			Ext.create('Ext.Action', {
				iconCls  : 'dmem',
				text: 'Remove members',
				handler: function(widget, event) {
					var record = me.grid.getView().getSelectionModel().getSelection()[0];
					if (record.lenght == 0) {
						Ext.MessageBox.alert('Status', 'Not selection !', function() {});
						return;
					}

					if (record.get('owner') != logged) {
						Ext.MessageBox.alert('Status', 'Not available !', function() {});
						return;
					}
					
					var box = Ext.MessageBox.wait('Please wait while I do something or other', 'Performing Actions');
					Ext.Ajax.request({
					   url: 'avia.php',					   
					   params : {handle: 'web', action: 'select', func: 'crm_campaign_remove_crm_list', where: record.get('id')},
					   success: function(response, opts) {						  
						  box.hide();
						  Ext.MessageBox.alert('Status', 'Success !', function() {
							 me.reload();
							 views['campaigns'].refresh();
						  });
					   },
					   failure: function(response, opts) {										   
						  Ext.MessageBox.alert('Status', 'Error !', function() {});
					   }
					});		
				}
			})
		];

		return me.actions;
	},
	
	initSource: function() {
		var me = this;
		me.defaultRec = {
			data: {
				id: '0',
				_date : Ext.Date.format(new Date(),'Y-m-d'),
				userCode : logged,
				total_members: '0',
				owner: logged,
				budgeted_cost: '0',
				actual_cost: '0',
				expected_revenue: '0',
				start_date: Ext.Date.format(new Date(),'Y-m-d'),
				end_date: Ext.Date.format(new Date(),'Y-m-d'),
				campaign_status: 'planning'
			}			
		};
		
		me.form.updateSource(me.defaultRec);
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
			func: me.func
		});				

		me.grid.getSelectionModel().on({
			selectionchange: function(sm, selections) {
				if (selections.length) {
					me.form.updateSource(selections[0]);
			//		me.form.setVisible(true);
					views['campaigns'].reload(selections[0]);
				} else {
					me.form.updateSource(me.defaultRec);
					me.form.setVisible(false);
				}
			}
		});

		me.form = new OCS.PropertyGrid({
			modelName: me.modelName,
			region: 'east',
			hidden: true,
			title: me.title,			
			split: true,
			flex: 0.5,
			closable: true,
			closeAction: 'hide',
			sealedColumns: true,						
			buttons: [{
					text: 'Reset',
					iconCls: 'reset',
					handler: function() {
						me.form.updateSource(me.defaultRec);
					}				
				},'->',{
					text: 'Commit',
					iconCls: 'commit',
					handler: function() {
						me.commitRecord();	
						me.form.createSource();
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
	}
});

Ext.define('OCS.QuotePanel', {	
	extend: 'OCS.GridWithFormPanel',			
	modelName: 'CRM_QUOTE',
	func: 'crm_quote_list',
	autoSelect: true,
	table: 'crm_quotes',
	title: 'Quote',
	quoteList: false,

	filterData: function(views) {
		var me = this;		
		me.title = views;
		me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: me.func, values: me.values, where: me.where, views: views};
		me.store.loadPage(1);
	},
		
	createActions: function() {
		var me = this;
		me.actions = [
			Ext.create('Ext.Action', {
				iconCls: 'list',
				text: 'Views',
				menu: {
					xtype: 'menu',
					items: [					
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Waiting Invoices',
							handler: function(widget, event) {
								me.filterData('Waiting Quotes');
							}
						}),
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Closed Invoices',
							handler: function(widget, event) {
								me.filterData('Closed Quotes');
							}
						}),						
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Recent Invoices',
							handler: function(widget, event) {
								me.filterData('Recent Quotes');
							}
						}),
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Campaign Invoices',
							handler: function(widget, event) {
								me.filterData('Campaign Quotes');
							}
						}),
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'All Invoices',
							handler: function(widget, event) {
								me.filterData('All Quotes');
							}
						}),
						'-',
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'All Invoices in current fiscal year',
							handler: function(widget, event) {
								me.filterData('All quotes in current fiscal year');
							}
						})
					]
				}		
			}),
			'-',
			Ext.create('Ext.Action', {
				iconCls: 'add',
				text: 'New...',
				handler: function(widget, event) {
					if (selected) {					
						me.initSource();
						me.subpanel.setVisible(true);
						me.gridQuoteList.loadStore('nowhere');
						me.grid.getSelectionModel().clearSelections();
						Ext.getCmp('customerComponent').collapse();
					} else
					  Ext.MessageBox.alert('Status', 'Харилцагч сонгоно уу ! Харилцагч сонгохын тулд Accounts хэсэгт тухайн харилцагч дээр дарна уу !', function() {});
				}
			}),			
			Ext.create('Ext.Action', {
				iconCls : 'delete',
				text: 'Delete',
				handler: function(widget, event) {
					me.deleteRecord();
				}
			}),			
			'-',
			Ext.create('Ext.Action', {
				iconCls : 'contract',
				text: 'Create contract',
				handler: function(widget, event) {
					var selection = me.grid.getSelectionModel().getSelection();
					if (selection.length > 0) {
						if (selection[0].get('owner') == logged) {
							Ext.Msg.confirm('Warning ','Create contract ?',function(btn){
								if(btn === 'yes'){
									Ext.Ajax.request({
									   url: 'avia.php',
									   params: {handle: 'web', action: 'create_sales', where: selection[0].get('id')},
									   success: function(response, opts) {
										  Ext.MessageBox.alert('Status', 'Success !', function() {});
									   },
									   failure: function(response, opts) {										   
										  Ext.MessageBox.alert('Status', 'Error !', function() {});
									   }
									});	
								}
							});
						} else
						  Ext.MessageBox.alert('Status', 'Not available !', function() {});
					} else
					  Ext.MessageBox.alert('Status', 'No selection !', function() {});
				}
			})
		];

		return me.actions;
	},
	
	initSource: function() {
		var me = this;
		me.defaultRec = {
			data: {
				id: '0',
				userCode : logged,
				owner: logged,
				qty: '0',
				amount: '0',
				crm_id: crm_id,
				quote_code: 'P'+new Date().getTime(),
				_date: Ext.Date.format(new Date(),'Y-m-d H:m:s'),
				quote_status: 'draft' //negotiation,delivered,on hold,confirmed,closed won,closed lost
			}			
		};
				
		me.form.updateSource(me.defaultRec);
	},

	createGrid: function() {
		var me = this;
		me.createStore();
	
		me.grid = Ext.create('OCS.GridView', {	
			store: me.store,
			flex: 1,
			actions: me.createActions(),
			columns: me.createColumns(),
			func: me.func	
		});				
		
		me.grid.on('itemclick', function(dv, record, item, index, e) {			
			if (record) {
				selectedQuote = record;
				me.form.updateSource(record);
				me.gridQuoteList.loadStore(selectedQuote.get('id'));
				me.subpanel.setVisible(true);
			} else {
				me.subpanel.setVisible(false);					
			}			
		});
								
		me.form = new OCS.PropertyGrid({
			modelName: me.modelName,
			title: '',
			iconCls: '',
			region: 'center',
			split: true,
			closable: false,
			flex: 1,
			sealedColumns: true,
			buttons: [{
				text : 'Reset',
				iconCls: 'reset',
				handler: function() {
					me.initSource();
					me.gridQuoteList.loadStore('nowhere');
				}
			},'->',{
				text: 'Commit',
				iconCls: 'commit',
				handler: function() {
					me.commitRecord();
				}
			}]
		});						

		me.initSource();
		
		me.gridQuoteList = new Ext.create('OCS.DropGridPanel', {
			modelName:'CRM_QUOTE_DETAIL',
			func:'crm_quote_detail_list',
			title: 'Products',
			tab: 'crm_quote_detail_list',
			region: 'south',
			table: 'crm_quote_details',
			hidden: me.quoteList,
			values: 'quote_id',
			flex: 0.75
		});
		

		me.subpanel = Ext.create('Ext.panel.Panel', {			
			xtype: 'panel',
			layout: 'border',
			flex: 0.5,
			region: 'east',
			title: 'Detail',
			split: true,
			hidden: true,
			closable: true,
			closeAction: 'hide',
			items: [
				me.form,
				me.gridQuoteList.createGrid()
			]
		});

		me.panel = Ext.create('Ext.panel.Panel', {
			layout: 'border',
			border: false,
			region: 'center',
			items : [me.grid, me.subpanel]
		});

		return me.panel;
	}
});

Ext.define('OCS.SalesPanel', {	
	extend: 'OCS.QuotePanel',			
	modelName: 'CRM_SALES',
	func: 'crm_sales_list',
	table: 'crm_sales',
	title: 'Sales',
	quoteList: true,
	
	filterData: function(views) {
		var me = this;		
		me.title = views;
		me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: me.func, values: me.values, where: me.where, views: views};
		me.store.loadPage(1);
	},
		
	createActions: function() {
		var me = this;
		me.actions = [
			Ext.create('Ext.Action', {
				iconCls: 'list',
				text: 'Views',
				menu: {
					xtype: 'menu',
					items: [						
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Service is expiring',
							handler: function(widget, event) {
								me.filterData('Service is expiring');
							}
						}),
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Active Contracts',
							handler: function(widget, event) {
								me.filterData('Active Sales');
							}
						}),
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Recent Contracts',
							handler: function(widget, event) {
								me.filterData('Recent Sales');
							}
						}),
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'Campaign Contracts',
							handler: function(widget, event) {
								me.filterData('Campaign Sales');
							}
						}),
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'All Contracts',
							handler: function(widget, event) {
								me.filterData('All Sales');
							}
						}),
						'-',
						Ext.create('Ext.Action', {
							icon   : '',  
							text: 'All Contract in current fiscal year',
							handler: function(widget, event) {
								me.filterData('All Sales in current fiscal year');
							}
						})
					]
				}		
			}),
			'-',
			Ext.create('Ext.Action', {
				iconCls: 'add',
				text: 'New...',
				handler: function(widget, event) {
					if (selected) {					
						me.initSource();
						me.subpanel.setVisible(true);
						me.gridQuoteList.loadStore('nowhere');
						me.grid.getSelectionModel().clearSelections();
						Ext.getCmp('customerComponent').collapse();
					} else
					  Ext.MessageBox.alert('Status', 'Харилцагч сонгоно уу !', function() {});
				}
			}),			
			Ext.create('Ext.Action', {
				iconCls: 'delete',
				text: 'Delete',
				handler: function(widget, event) {
					me.deleteRecord();
				}
			}),
			'-',			
			Ext.create('Ext.Action', {
				iconCls : 'deal',
				text: 'Deal...',
				handler: function(widget, event) {
					var selection = me.grid.getSelectionModel().getSelection();
					if (selection.length > 0) {
						new OCS.NewDealWindow({
							selected: selection[0]
						}).createWindow();
					} else
					  Ext.MessageBox.alert('Status', 'No selection !', function() {});
				}
			})
		];

		return me.actions;
	}
});


Ext.define('OCS.MyGridWithFormPanel', {	
	extend: 'OCS.GridWithFormPanel',
	filter: false,

	createForm: function() {
		var me = this;
		if (me.func == 'crm_campaign_list')
		{
			me.values = 'company';
			me.where = company;
			me.table = 'crm_campaign';

			me.form = Ext.create('OCS.FormPanel', {
				id : 'event_complete_form',				
				title:'Campaign update',
				width: 350,
				items: [{
					xtype: 'textfield',
					fieldLabel: '',
					hidden: true,
					name: 'id'
				},{
					xtype: 'textfield',
					fieldLabel: 'Customer count',
					readOnly: true,
					value: 0,
					name: 'crm_count'
				},{
					 xtype: 'combo',
					 fieldLabel: 'Status',
					 store: Ext.create('Ext.data.Store', {
						  model: 'CRM_ITEM',
						  data: [{value: 'planning'},{value: 'active'},{value: 'inactive'},{value:'complete'}]
					 }),
					 name: 'campaign_status',
					 queryMode: 'local',
					 displayField: 'value',
					 valueField: 'value',
					 triggerAction: 'all',
					 editable: false
				},{
					xtype: 'textfield',
					fieldLabel: 'Created by',
					hidden: true,
					name: 'userCode'
				},{
					 xtype: 'combo',
					 fieldLabel: 'Type',
					 store: Ext.create('Ext.data.Store', {
						  model: 'CRM_ITEM',
						  data: [{value: 'phone call'},{value: 'appointment'},{value: 'email'}]
					 }),
					 name: 'campaign_type',
					 queryMode: 'local',
					 displayField: 'value',
					 valueField: 'value',
					 triggerAction: 'all',
					 editable: false
				},{
					xtype: 'searchcombo',
					fieldLabel: 'Personal view',
					name: 'personal',
					value: logged,
					table: 'crm_personal_view'
				},{
					xtype: 'searchcombo',
					fieldLabel: 'Owner',
					name: 'owner',
					value: logged,
					table: 'crm_users'
				},{
					xtype: 'textarea',
					fieldLabel: 'Note',
					hideLabel: true,
					name: 'descr',
					emptyText: 'Note...',
					style: 'margin:0', 
					flex: 1 
				}],
				buttons: [{
					text: 'Commit',
					iconCls: 'commit',
					handler: function() {
						var form = this.up('form').getForm();
						if (form.isValid())	{
							var values = form.getValues(true);
							
							me.ep = me.store.getProxy().extraParams;
							values = "crm_count='"+form.findField('crm_count').getValue()+"',campaign_status='"+form.findField('campaign_status').getValue()+"',descr='"+form.findField('descr').getValue()+"',_date=CURRENT_TIMESTAMP";
							me.store.getProxy().extraParams = {handle: 'web', action: 'update', func: me.func, table: me.table, values: values, where: "id="+form.findField('id').getValue()};
							me.store.load(function(data) {
								me.store.getProxy().extraParams = me.ep;
								me.store.loadPage(1);

								me.form.setVisible(false);
							});	

							/*me.createStore();			
							me.store.getProxy().extraParams = {handle: 'web', action: 'campaign_insert_calllog', values: values, where: me.module.where, query: me.module.query};
							me.store.load(function(data) {
								me.module.store.loadPage(1);
								me.win.close();
							});*/	
						}
						else	
						  Ext.MessageBox.alert('Status', 'Invalid data !', function() {});
					}
				}]
			});	
		} else
		if (me.func == 'crm_event_list') {
			me.values = 'owner,event_status';
			me.where = logged+',pending';
			me.table = 'crm_events';

			me.form = Ext.create('OCS.FormPanel', {
				id : 'event_complete_form',				
				title:'Appointment update',
				width: 350,
				items: [{
					xtype: 'textfield',
					fieldLabel: '',
					hidden: true,
					name: 'id'
				},{
					xtype: 'textfield',
					fieldLabel: '',
					hidden: true,
					name: 'crm_id'
				},{
					xtype: 'searchcombo',
					fieldLabel: 'Purpose',
					name: 'purpose',
					hidden: true,
					table: 'crm_calllog'
				},{
					xtype: 'searchcombo',
					hidden: true,
					fieldLabel: 'Owner',
					name: 'owner',
					table: 'crm_users'
				},{
					 xtype: 'combo',
					 fieldLabel: 'Status',
					 store: Ext.create('Ext.data.Store', {
						  model: 'CRM_ITEM',
						  data: [{value: 'pending'},{value: 'success'},{value: 'cancelled'}]
					 }),
					 name: 'event_status',
					 queryMode: 'local',
					 displayField: 'value',
					 valueField: 'value',
					 triggerAction: 'all',
					 editable: false
				},{
					xtype: 'textfield',
					fieldLabel: 'Created by',
					hidden: true,
					name: 'userCode'
				},{
					xtype: 'textfield',
					fieldLabel: 'Location',
					name: 'venue'
				},{
					xtype: 'textarea',
					fieldLabel: 'Note',
					hideLabel: true,
					name: 'descr',
					emptyText: 'Note ...',
					style: 'margin:0', 
					flex: 1 
				}],
				buttons: [{
					text: 'Commit',
					iconCls: 'commit',
					handler: function() {
						var form = this.up('form').getForm();
						if (form.isValid())	{
							var values = form.getValues(true);
							
							me.ep = me.store.getProxy().extraParams;
							values = "event_status='success',descr='yrilaa',_date=CURRENT_TIMESTAMP";
							me.store.getProxy().extraParams = {handle: 'web', action: 'update', func: me.func, table: me.table, values: values, where: "id="+form.findField('id').getValue()};
							me.store.load(function(data) {
								me.store.getProxy().extraParams = me.ep;
								me.store.loadPage(1);

								me.form.setVisible(false);
							});							
						}
						else
						  Ext.MessageBox.alert('Status', 'Invalid data !', function() {});
					}
				}]
			});				
		} else
		if (me.func == 'crm_calllog_list') {
			me.values = 'owner,callresult';
			me.where = logged+',pending';
			me.table = 'crm_calllog';

			me.form = Ext.create('OCS.FormPanel', {
				id : 'calls_complete_form',				
				title:'Call result',
				width: 350,
				items: [{
					xtype: 'textfield',
					fieldLabel: '',
					hidden: true,
					name: 'id'
				},{
					xtype: 'textfield',
					fieldLabel: '',
					hidden: true,
					name: 'crm_id'
				},{
					xtype: 'searchcombo',
					fieldLabel: 'Зорилго',
					name: 'purpose',
					hidden: true,
					table: 'crm_calllog'
				},{
					xtype: 'searchcombo',
					hidden: true,
					fieldLabel: 'Хүлээн авагч',
					name: 'owner',
					table: 'crm_users'
				},{
					 xtype: 'combo',
					 fieldLabel: 'Үр дүн',
					 store: Ext.create('Ext.data.Store', {
						  model: 'CRM_ITEM',
						  data: [{value: 'pending'},{value: 'success'},{value: 'unsuccess'},{value: 'remind'}]
					 }),
					 name: 'callresult',
					 queryMode: 'local',
					 displayField: 'value',
					 valueField: 'value',
					 triggerAction: 'all',
					 editable: false
				},{
					xtype: 'textfield',
					fieldLabel: 'Бүртгэсэн',
					hidden: true,
					name: 'userCode'
				},{
					xtype: 'textfield',
					fieldLabel: 'Хаанаас',
					hidden: true,
					name: '_from'
				},{
					xtype: 'textfield',
					fieldLabel: 'Утасны дугаар',
					name: '_to'
				},{
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
					iconCls: 'commit',
					handler: function() {
						var form = this.up('form').getForm();
						if (form.isValid())	{
							var values = form.getValues(true);
							
							me.ep = me.store.getProxy().extraParams;
							values = "callresult='success',_to='99101790',descr='yrilaa',_date=CURRENT_TIMESTAMP";
							me.store.getProxy().extraParams = {handle: 'web', action: 'update', func: me.func, table: me.table, values: values, where: "id="+form.findField('id').getValue()};
							me.store.load(function(data) {
								me.store.getProxy().extraParams = me.ep;
								me.store.loadPage(1);

								me.form.setVisible(false);
							});							
						}
						else
						  Ext.MessageBox.alert('Status', 'Invalid data !', function() {});
					}
				}]
			});				
		} else
		if (me.func == 'crm_complain_list') {
			me.values = 'owner,complain_status';
			me.where = logged+',escalated';
			me.table = 'crm_complain';
			
			me.form = Ext.create('OCS.FormPanel', {
				id : 'complain_transfer_form',				
				title:'Case action',		
				width: 350,
				items: [{
					xtype: 'textfield',
					fieldLabel: '',
					hidden: true,
					name: 'id'
				},{
					xtype: 'textfield',
					fieldLabel: '',
					hidden: true,
					name: 'crm_id'
				},{
					xtype: 'textfield',
					fieldLabel: 'Case ID',
					hidden: true,
					name: 'groupId'
				},{
					xtype: 'combo',
					store: Ext.create('Ext.data.Store', {
						model: 'CRM_ITEM',
						data: [{value: 'escalated'},{value: 'on hold'},{value: 'closed'}]
					}),
					displayField: 'value',
					valueField: 'value',
					fieldLabel: 'Төлөв',
					queryMode: 'local',
					value: 'pending',
					editable: false,	
					name: 'complain_status',
				},{
					xtype: 'combo',
					store: Ext.create('Ext.data.Store', {
						model: 'CRM_ITEM',
						data: [{value: 'User did not attend any training'},{value: 'complex functionality'},{value: 'existing problem'},{value:'instructions not clear'},{value:'new problem'}]
					}),
					displayField: 'value',
					valueField: 'value',
					fieldLabel: 'Шалтгаан',
					editable: false,
					queryMode: 'local',
					name: 'complain_reason',
				}, {
					xtype: 'searchcombo',
					fieldLabel: 'Хүлээн авагч',
					name: 'owner',
					table: 'crm_users'
				},{
					xtype: 'combo',
					store: Ext.create('Ext.data.Store', {
						model: 'CRM_ITEM',
						data: [{value: 'problem'},{value: 'feature request'},{value: 'question'}]
					}),
					displayField: 'value',
					valueField: 'value',
					fieldLabel: 'Төрөл',
					queryMode: 'local',
					name: 'complain_type',
					hidden: true
				},{
					xtype: 'textfield',
					fieldLabel: 'Бүртгэсэн',
					hidden: true,
					name: 'userCode'
				},{
					xtype: 'textfield',
					fieldLabel: 'Холбоо барих',
					name: 'phone'
				},{
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
					iconCls: 'commit',
					handler: function() {
						var form = this.up('form').getForm();
						if (form.isValid())	{
							var values = form.getValues(true);
							
							/*me.ep = me.store.getProxy().extraParams;
							me.store.getProxy().extraParams = {handle: 'web', action: 'update', func: me.func, table: me.table, values: "complain_status='"+form.findField('complain_status').getValue()+"'", where: "id="+form.findField('id').getValue()};
							me.store.load(function(data) {*/
								//me.store.getProxy().extraParams = me.ep;
								
								me.ep = me.store.getProxy().extraParams;
								me.store.getProxy().extraParams = {handle: 'web', action: 'insert', func: me.func, table: me.table, values:values, where: me.where};
								me.store.load(function(data) {
									me.store.getProxy().extraParams = me.ep;
									me.store.loadPage(1);
								});
							//});							
						}
						else
						  Ext.MessageBox.alert('Status', 'Invalid data !', function() {});
					}
				}]
			});
		} else 
		if (me.func == 'crm_message_list') {
			me.values = 'owner';
			me.where = logged;
			me.table = 'crm_message';
			me.form = Ext.create('OCS.FormPanel', {
				id : 'message_form',				
				title:'Message detail',	
				width: 350,
				items: [{
					xtype: 'textfield',
					fieldLabel: '',
					hidden: true,
					name: 'id'
				},{
					xtype: 'textfield',
					fieldLabel: 'From',
					readOnly: true,
					value: logged,
					name: 'owner'
				},{
					xtype: 'searchcombo',
					fieldLabel: 'Reply to',
					name: '_from',
					table: 'crm_message'
				},{
					xtype: 'textfield',
					fieldLabel: 'Subject',
					name: 'subject'
				},{
					xtype: 'textarea',
					fieldLabel: 'Тайлбар',
					hideLabel: true,
					name: 'descr',
					emptyText: 'Тайлбар бичнэ үү !',
					style: 'margin:0', 
					flex: 1 
				}],
				buttons: [{
					text: 'Read',					
					handler: function() {
						var form = this.up('form').getForm();
						if (form.isValid())	{
							var values = form.getValues(true);
							
							me.ep = me.store.getProxy().extraParams;
							me.store.getProxy().extraParams = {handle: 'web', action: 'update', func: me.func, table: me.table, values: "message_status='read'", where: "id="+form.findField('id').getValue()};
							me.store.load(function(data) {
								me.store.getProxy().extraParams = me.ep;
								me.store.loadPage(1);
							});	
						}
						else
						  Ext.MessageBox.alert('Status', 'Invalid data !', function() {});
					}
				},'->',{
					text: 'Reply',
					handler: function() {
						var form = this.up('form').getForm();
						if (form.isValid())	{				
							var _from = form.findField('_from').getValue();
							form.findField('_from').setValue(form.findField('owner').getValue());
							form.findField('owner').setValue(_from);
							var values = form.getValues(true);

							me.ep = me.store.getProxy().extraParams;
							me.store.getProxy().extraParams = {handle: 'web', action: 'update', func: me.func, table: me.table, values: "message_status='replied'", where: "id="+form.findField('id').getValue()};
							me.store.load(function(data) {
								me.store.getProxy().extraParams = {handle: 'web', action: 'insert', func: me.func, table: me.table, values: values, where: me.where};
								me.store.load(function(data) {
									form.New();
									me.store.getProxy().extraParams = me.ep;
									me.store.loadPage(1);
								});
							});	
						}
						else
						  Ext.MessageBox.alert('Status', 'Invalid data !', function() {});
					}
				}]
			});
		} else 
		if (me.func == 'crm_task_list') {
			me.values = 'owner,task_status';
			me.where = logged+',open';
			me.table = 'crm_tasks';
			me.form = Ext.create('OCS.FormPanel', {
				id : 'task_form',				
				title:'Task detail',	
				width: 350,
				items: [{
					xtype: 'textfield',
					fieldLabel: '',
					hidden: true,
					name: 'id'
				},{
					xtype: 'combo',
					store: Ext.create('Ext.data.Store', {
						model: 'CRM_ITEM',
						data: [{value: 'open'},{value: 'processing'},{value: 'completed'}]
					}),
					displayField: 'value',
					valueField: 'value',
					fieldLabel: 'Төлөв',
					queryMode: 'local',
					selectOnTab: false,
					editable: false,
					value: 'open',
					name: 'task_status',
				},{
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
					iconCls: 'commit',
					handler: function() {
						var form = this.up('form').getForm();
						if (form.isValid())	{
							var values = form.getValues(true);
							
							me.ep = me.store.getProxy().extraParams;
							me.store.getProxy().extraParams = {handle: 'web', action: 'update', func: me.func, table: me.table, values: "task_status='"+form.findField('task_status').getValue()+"',descr='"+form.findField('descr').getValue()+"'", where: "id="+form.findField('id').getValue()};
							me.store.load(function(data) {
								me.store.getProxy().extraParams = me.ep;
								me.store.loadPage(1);
							});	
						}
						else
						  Ext.MessageBox.alert('Status', 'Invalid data !', function() {});
					}
				}]
			});
		}
	},

	createGrid: function() {
		var me = this;		
		me.createForm();
		me.createStore();

		me.grid = Ext.create('OCS.GridView', {
			store: me.store,
			columns: me.createColumns(),
			actions: me.createActions(),
			func: me.func,
			filter: me.filter
		});	

		me.grid.on('itemclick', function(dv, record, item, index, e) {
			if (record) {
				if (me.form) {
					me.form.setVisible(true);					
					me.form.getForm().loadRecord(record);
				}
			}
		});

		me.panel = Ext.create('Ext.panel.Panel', {
			layout: 'border',
			border: false,
			region: 'center',
			items : [me.grid, me.form]			
		});

		return me.panel;
	},
	
	createActions: function() {
		var me = this;
		if (me.func == 'crm_complain_list' || me.func == 'crm_message_list' || me.func == 'crm_task_list' || me.func == 'crm_event_list' || me.func == 'crm_calllog_list')
		{		
			me.actions = [
				Ext.create('Ext.Action', {
					iconCls   : 'add',
					text: 'New ...',
					handler: function(widget, event) {
						if (me.func == 'crm_complain_list')
						{						
							if (selected)						
								new OCS.ComplainWindow({
									selected: selected
								}).createWindow();
							else
							    Ext.MessageBox.alert('Status', 'Харилцагч сонгоно уу !', function() {});
						} else
						if (me.func == 'crm_calllog_list')
						{						
							if (selected)						
								new OCS.CallLogWindow({
									selected: selected
								}).createWindow();
							else
							    Ext.MessageBox.alert('Status', 'Харилцагч сонгоно уу !', function() {});
						} else
						if (me.func == 'crm_task_list')
						{						
							if (selected)						
								new OCS.TaskWindow({
									selected: selected
								}).createWindow();
							else
							    Ext.MessageBox.alert('Status', 'Харилцагч сонгоно уу !', function() {});
						} else
						if (me.func == 'crm_event_list')
						{						
							if (selected)						
								new OCS.EventWindow({
									selected: selected
								}).createWindow();
							else
							    Ext.MessageBox.alert('Status', 'Харилцагч сонгоно уу !', function() {});
						} else
						if (me.func == 'crm_message_list') {						
							new OCS.MessageWindow().show();
						}
					}
				}),
				Ext.create('Ext.Action', {
					iconCls   : 'delete',
					text: 'Delete',
					disabled: true,
					handler: function(widget, event) {
						
					}
				}),
				'-',
				Ext.create('Ext.Action', {
					iconCls   : 'calendar',
					text: 'Calendar',
					handler: function(widget, event) {
						var rec = me.grid.getView().getSelectionModel().getSelection()[0];
						googleEvent(rec, me.func);
					}
				})
			];
		} else {
			me.actions = [				
				Ext.create('Ext.Action', {
					iconCls   : 'calendar',
					text: 'Calendar',
					handler: function(widget, event) {
						var rec = me.grid.getView().getSelectionModel().getSelection()[0];
						googleEventDynamic(rec);
					}
				})		
			];
		}

		return me.actions;
	}
});


Ext.define('OCS.DealGridWithFormPanel', {	
	extend: 'OCS.MyGridWithFormPanel'
});


Ext.define('OCS.MyProfile', {	
	extend: 'OCS.Module',	

	createBars: function() {
		var me = this;	
	},

	createPanel: function() {
		var me = this;
		
		me.calendar = Ext.create('Ext.picker.Date', {
			id: 'my_calendar',
			xtype: 'datepicker',
			region: 'south',			
			border: true,
			split: true,
			width: 220,
			handler: function(picker, date) {					
				me.grid.loadStore(Ext.Date.format(date, 'Y-m-d'));				
			}				
		});
		
		me.mylog = new OCS.MyActivityGrid();

		me.grid = new Ext.create('OCS.MyGridWithFormPanel', {
			modelName: 'CRM_CALENDAR',
			func: 'crm_calendar_list',
			sortField: 'crm_id',			
			//groupField: 'work_type',
			where: 'alldate',
			dateField: '_date',
			sortDirection: 'ASC',
			filter: true,
			searchBar : false
		});
		

		me.panel = Ext.create('Ext.panel.Panel', {
			layout: 'border',
			border: false,
			bodyPadding: 2,
			region: 'center',
			items : [{
				xtype: 'panel',
				layout: 'border',
				width: 380,				
				border: false,
				split: true,
				minWidth: 300,
				region: 'west',
				items: [{
					xtype: 'panel',
					region: 'center',
					flex: 1,
					title: 'Quick notes',
					width: 380,
					bodyPadding: 3,
					autoScroll: true,
					collapsible: true,
					collapsed: true,
					autoLoad: {
						url: 'sticky.php',
						scripts: true
					}
				},me.mylog.createPanel()]	
			}, /*me.grid.createGrid()*/
			new Ext.create('OCS.MyCalendar').createPanel()]
		});

		return me.panel;
	}
});


Ext.define('OCS.MyCalendar', {	
	extend: 'OCS.Module',	

	createPanel: function() {
		var me = this;				

		me.panel = Ext.create('Ext.panel.Panel', {
			layout: 'border',
			border: false,
			region: 'center',
			items : [{
				xtype: 'panel',
				region: 'center',
				bodyPadding: 0,
				frame: false,
				border: false,
				autoLoad: {
					url: 'calenar.php?account='+gmailAccount
				}
			}]
		});

		return me.panel;
	}
});

Ext.define('OCS.UploadWindow', {
	extend: 'OCS.Window',
	title: 'Upload from xls',
	maximizable: true,
	width: 470,
	height: 160,

	initComponent: function() {
		var me = this;

		me.form = Ext.create('OCS.UploadForm', {
			id : 'upload_form',
			region: 'center',
			name: this.name,
			win: this
		});

		me.items = [me.form];
		me.callParent(arguments);
	}
});

Ext.define('OCS.MergeRecordsWindow', {
	extend: 'OCS.Window',
	title: 'Merge...',
	table: 'crm_customer',
	maximizable: true,
	width: 950,
	height: 450,

	initComponent: function() {
		var me = this;

		me.form = Ext.create('OCS.MergeRecordForm', {
			id : 'merge_form',
			region: 'center',
			win: this,
			name: me.name,
			master: me.master,
			slave: me.slave
		});

		me.items = [me.form];
		me.callParent(arguments);
	}
});

Ext.define('OCS.RetailNewWindow', {
	extend: 'OCS.Window',
	title: 'New contact',
	table: 'crm_customer',
	maximizable: true,
	width: 680,
	height: 620,

	initComponent: function() {
		var me = this;

		me.form = Ext.create('OCS.RetailForm', {
			id : 'retail_form',
			region: 'center'
		});

		me.items = [me.form];
		me.callParent(arguments);
	}
});

Ext.define('OCS.ContactNewWindow', {
	extend: 'OCS.Window',
	title: 'New contact',
	table: 'crm_customer',
	maximizable: true,
	modal: false,
	width: 700,
	height: 250,
	
	initComponent: function() {
		var me = this;
		
		me.form = Ext.create('OCS.ContactForm', {
			id: 'contact_form',
			region: 'center',
			record: me.record
		});

		me.items = [me.form];
		me.callParent(arguments);
	}
});

Ext.define('OCS.CorporateNewWindow', {
	extend: 'OCS.Window',
	title: 'New account',
	table: 'crm_customer',
	maximizable: true,
	width: 700,
	height: 610,

	initComponent: function() {
		var me = this;

		me.form = Ext.create('OCS.CorporateForm', {
			id : 'corporate_form',
			region: 'center'
		});

		me.items = [me.form];
		me.callParent(arguments);
	}
});

Ext.define('OCS.LeadWindow', {
	extend: 'OCS.Window',
	title: 'New Lead',
	table: 'crm_customer',
	maximizable: true,
	width: 350,
	height: 400,

	initComponent: function() {
		var me = this;

		me.form = Ext.create('OCS.FormPanel', {
			id : 'lead_form',				
			title:'Lead detail',	
			region: 'center',
			hidden: false,
			closable: false,
			title: '',
			items: [{
				xtype: 'searchcombo',
				fieldLabel: 'Нэр',
				table: 'crm_customer',
				name: 'firstName',
				allowBlank: false,
				typeAhead: true
			},{
				xtype: 'searchcombo',
				fieldLabel: 'Утас',
				allowBlank: false,
				table: 'crm_customer',
				name: 'phone',
				typeAhead: true
			},
			{
				xtype: 'combo',
				fieldLabel: 'Төрөл',
				valueField: 'id',
				displayField: 'value',
				name: 'customer_type',
				value: (userType == 'retail' ?0:1),				
				queryMode: 'local',				
				store: Ext.create('Ext.data.Store', {
				  model: 'CRM_OBJECT',
				  data: [{id: 0, value: 'retail'},{id: 1, value: 'corporate'}]
			    })
			},
			{
				name: 'source',
				fieldLabel: 'Lead source',
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
			},{
				xtype: 'searchcombo',
				fieldLabel: 'Campaign',
				allowBlank: true,
				table: 'crm_campaign',
				name: 'campaign',
				typeAhead: true
			},{
				xtype: 'textfield',
				fieldLabel: 'Owner',				
				name: 'owner',
				value: logged,
				readOnly: true
			},{
				xtype: 'textfield',
				fieldLabel: 'Created by',				
				name: 'userCode',
				value: logged,
				readOnly: true
			},{
				xtype: 'datefield',
				fieldLabel: 'Created on',
				value: new Date(),
				format: 'Y-m-d',
				name: '_date'
			},{
				xtype: 'textarea',
				fieldLabel: 'Note',
				hideLabel: true,
				name: 'descr',
				emptyText: 'Note ...',
				style: 'margin:0', 
				flex: 1 
			}],
			buttons: [{
				text: 'Commit',
				iconCls: 'commit',
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

Ext.define('OCS.LeadImportWindow', {
	extend: 'OCS.Window',
	
	title:  'Import leads',
	id: 'lead_import_window',
	maximizable: true,
	width: 750,
	minWidth: 650,
	height: 450,

	initComponent: function() {
		var me = this;	

		me.store = Ext.create('Ext.data.ArrayStore', {
			fields: [
			   {name: 'firstName'},
			   {name: 'lastName'},
			   {name: 'phone'},
			   {name: 'email'},
			   {name: 'source'},
			   {name: 'campaign'},
			   {name: 'owner'}
			],
			data: []			
		});

		me.pbar = Ext.create('Ext.Toolbar', {
			items: [{
					text: 'Create leads ...',
					iconCls: 'add',
					handler: function() {
						var selectedRecords = me.grid.getSelectionModel().getSelection();
						if (selectedRecords.length == 0)
						{
							Ext.MessageBox.alert('Status', 'No selection !', function() {});
							return;
						}
						Ext.MessageBox.show({
						   title: 'Please wait',
						   msg: 'Loading items...',
						   progressText: 'Initializing...',
						   width:300,
						   progress:true,
						   closable:false,
						   animateTarget: 'mb6'
					   });

					   var values = '';
					   var f = function(v){
							return function(){
								if (v == 3) {
									var selectedRecords = me.grid.getSelectionModel().getSelection();
									
									for (i = 0; i <  selectedRecords.length; i++){			
										data = selectedRecords[i];
										values += 'firstName='+data.get('firstName')+'&'+
												  'phone='+data.get('phone')+'&'+
												  'email='+data.get('email')+'&'+
												  'source='+data.get('source')+'&'+
												  'campaign='+data.get('campaign')+'&'+
												  'owner='+data.get('owner')+'&'+
												  'userCode='+logged+'$';
									}
								} else 
								if (v == 9)
								{ 
									Ext.Ajax.request({
									   url: 'avia.php',
									   params: {handle: 'web', action: 'insert', table: 'crm_customer', func: '', values: values, fields: '', where: ''},
									   success: function(response, opts) {
										  me.store.removeAll();
										  me.setTitle('Import leads');
									   },
									   failure: function(response, opts) {										   
										  Ext.MessageBox.alert('Status', 'Error !', function() {});
									   }
									});
								} else
								if(v == 12){
									Ext.MessageBox.hide();																		
								}else{
									var i = v/11;
									Ext.MessageBox.updateProgress(i, Math.round(100*i)+'% completed');
								}
						   };
					   };
					   for(var i = 1; i < 13; i++){
						   setTimeout(f(i), i*500);
					   }						
					}
				},'-',{
					text: 'Clear all',
					iconCls: 'delete',
					handler: function() {
						me.store.removeAll();
						me.win.setTitle('Lead import');
					}
				},'->',{
					text: 'Хайлт : '				
				},{
					xtype: 'textfield',
					width: 150,
					listeners: {
						 change: {
							 fn: function(e) {
								 me.store.clearFilter(true);
								 me.store.filter('phone', e.getValue());
							 },
							 scope: this,
							 buffer: 200
						 }
					}
				}
			]
		});

		me.grid = Ext.create('Ext.grid.Panel', {	
			id: 'lead_import_grid',
			tbar: me.pbar,
			store: me.store,
			border: false,
			region: 'center',
			columnLines: true,
			selType: 'checkboxmodel',			
			plugins: [{
				ptype: 'datadrop',
				addBulk : true,
				id: 'lead_import_window'
			}],
			columns: [				
				{
					text     : 'Нэр',
					width    : 150,
					sortable : true,
					dataIndex: 'firstName'
				},
				{
					text     : 'Утас',
					width    : 70,
					sortable : true,
					align	 : 'center',
					dataIndex: 'phone',
					renderer : renderWarningByPhone
				},
				{
					text     : 'Email',
					width    : 110,
					sortable : true,
					dataIndex: 'email'
				},
				{
					text     : 'Эх сурвалж',
					width    : 125,
					sortable : true,
					dataIndex: 'source'
				},				
				{
					text     : 'Campaign',
					width    : 150,
					sortable : true,
					dataIndex: 'campaign'
				},
				{
					text     : 'Owner',
					width    : 100,
					sortable : true,
					dataIndex: 'owner',
					renderer : renderOwner
				}
			],
			viewConfig: {
				stripeRows: true,
				deferEmptyText: false,
				emptyText: 'drop here !'
			}
		});	
	
		me.items = [me.grid];		
		me.callParent(arguments);	
	}
});

Ext.define('OCS.PotentialView', {
	extend: 'OCS.GridWithFormPanel',
	func: 'crm_potential_list',	
	table: 'crm_potentials',
	values: 'crm_id',
	
	createActions: function() {
		var me = this;
		me.actions = [
			Ext.create('Ext.Action', {
				icon   : '',
				text: 'New...',
				handler: function(widget, event) {
					selected = me.grid.getView().getSelectionModel().getSelection()[0];
					new OCS.PotentialWindow({
						title: me.getCustomerName(selectedLead)+' - New Potential',
						selected: selectedLead
					}).show();
				}
			}),			
			Ext.create('Ext.Action', {
				icon   : '',
				text: 'Delete',
				handler: function(widget, event) {
					me.deleteRecord();
				}
			})					
		];

		return me.actions;
	},
	
	callStore: function(rec) {
		var me = this;		
		me.loadStore(rec.get('crm_id'));
	},	

	createView: function() {
		var me = this;
		me.modelName = 'CRM_POTENTIAL';
		me.createStore();

		me.grid = Ext.create('OCS.GridView', {	
			store: me.store,
			columns: me.createColumns(),
			actions: me.createActions(),
			func: me.func
		});							

		return me.grid;
	}
});

Ext.define('OCS.PotentialWindow', {
	extend: 'OCS.Window',
	
	title: 'New Potential',
	maximizable: true,
	height: 500,
	width: 400,

	initComponent: function() {
		var me = this;

		me.form = Ext.create('OCS.FormPanel', {
			id : 'potential_form',				
			title: 'Potentail detail',	
			region: 'center',
			hidden: false,
			closable: false,
			title: '',
			items: [{
				xtype: 'textfield',
				fieldLabel: 'CRM ID',
				name: 'crm_id',
				value: me.selected.get('crm_id'),
				readOnly: true
			},
			{
				xtype: 'datefield',
				fieldLabel: 'Closing date',				
				name: 'closing_date',
				value: new Date(),
				format: 'Y-m-d'
			},
			{
				xtype: 'combo',
				fieldLabel: 'Stage',
				valueField: 'value',
				displayField: 'value',
				name: 'stage',
				allowBlank: false,
				forceSelection: true,
				queryMode: 'local',
				store: Ext.create('Ext.data.Store', {
				  model: 'CRM_ITEM',
				  data: [{value: 'qualification'},{value: 'need analysis'},{value: 'value proposition'},{value: 'decision makers'},{value: 'proposal/price quote'},{value: 'negotiation review'},{value: 'renew contract'}, {value: 'closed won'}, {value: 'closed lost'}, {value: 'closed lost to competition'}]
			    })
			},{
				xtype: 'textfield',
				fieldLabel: 'Next step',
				name: 'next_step'				
			},{
				xtype: 'numberfield',
				fieldLabel: 'Probablity %',
				maxValue: 100,
				minValue: 0,
				value: 50,
				name: 'probablity'				
			},{
				xtype: 'searchcombo',
				fieldLabel: 'Product',
				table: 'crm_products',
				name: 'product_name'
			},{
				xtype: 'currencyfield',
				fieldLabel: 'Actual cost',
				value: 0,
				name: 'amount'			
			},{
				xtype: 'currencyfield',
				fieldLabel: 'Expected revenue',
				value: 0,
				name: 'expected_revenue'			
			},{
				xtype: 'searchcombo',
				fieldLabel: 'Campaign',
				table: 'crm_campaign',
				value: me.selected.get('campaign'),
				name: 'campaign'
			},{
				xtype: 'textfield',
				fieldLabel: 'Owner',				
				name: 'owner',
				value: logged,
				readOnly: true
			},{
				xtype: 'textfield',
				fieldLabel: 'Created by',				
				name: 'userCode',
				value: logged,
				readOnly: true
			},{
				xtype: 'textarea',
				fieldLabel: 'Note',
				hideLabel: true,
				name: 'descr',
				emptyText: 'Note ...',
				style: 'margin:0', 
				flex: 1 
			}],
			buttons: [{
				text: 'Commit',
				iconCls: 'commit',
				handler: function() {
					var form = this.up('form').getForm();
					if (form.isValid())	{
						var values = form.getValues(true);

						Ext.Ajax.request({
						   url: 'avia.php',
						   params: {handle: 'web', table: 'crm_potentials', action: 'insert', values: values, where: ''},
						   success: function(response, opts) {
							    views['leadopportunity'].reload();
								me.close();
						   },
						   failure: function(response, opts) {										   
							  Ext.MessageBox.alert('Status', 'Error !', function() {});
						   }
						});	

						if (form.findField('stage').getValue() == 'closed won') {
							Ext.Ajax.request({
							   url: 'avia.php',
							   params: {handle: 'web', table: 'crm_customer', action: 'update', values: "level='prospect'", where: "crm_id="+me.selected.get('crm_id')},
							   success: function(response, opts) {
									Ext.MessageBox.alert('Status', 'Prospect төлөвт шилжлээ !', function() {});
							   },
							   failure: function(response, opts) {										   
								  Ext.MessageBox.alert('Status', 'Error !', function() {});
							   }
							});
						}
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


Ext.define('OCS.GoogleCalendarWindow', {
	extend: 'OCS.Window',
	title: 'Google Calendar',
	maximizable: true,
	width: 550,
	height: 550,

	initComponent: function() {
		var me = this;		
		me.items = [{
			xtype:'panel',
			region: 'center',
			autoLoad: {
				url: 'calendar.php'
			}
		}];
		me.callParent(arguments);
	}
});

Ext.define('OCS.MassCallLogWindow', {
	extend: 'OCS.Window',
	title: 'Multiple Call logs',
	table: 'crm_calllog',
	maximizable: true,
	width: 350,
	height: 550,
	records: [],

	initComponent: function() {
		var me = this;
		me.crm_ids = '';
		for (i = 0; i < me.records.length; i++) {
			if (me.records[i].get('crm_name')) {
				htmlContent= me.records[i].get('crm_name').substring(me.records[i].get('crm_name').indexOf('<b>')+3, me.records[i].get('crm_name').indexOf('</b>'));
				me.crm_ids += me.records[i].get('crm_id')+':'+htmlContent+'\n';
			}
			else
				me.crm_ids += me.records[i].get('crm_id')+':'+me.records[i].get('firstName')+' '+me.records[i].get('lastName')+'\n';
		}

		me.form = Ext.create('OCS.FormPanel', {
			id : 'multiple_calllog_form',				
			region: 'center',
			hidden: false,
			closable: false,
			title: '',
			items: [{
				xtype: 'textarea',
				fieldLabel: 'Сонгогдсон харилцагчид',		
				name: 'crm_ids',
				readOnly: true,
				value: me.crm_ids,
				flex: 1 
			},{
				xtype: 'searchcombo',
				fieldLabel: 'Campaign name',
				table: 'crm_campaign',
				name: 'campaign',
				allowBlank: false,
				typeAhead: true
			},{
				xtype: 'combo',
				fieldLabel: 'Зорилго',
				allowBlank: false,
				name: 'purpose',
				valueField: 'value',
				displayField: 'value',
				value: 'sales',
				queryMode: 'local',
				store: Ext.create('Ext.data.Store', {
				  model: 'CRM_ITEM',
				  data: [{value: 'sales'},{value: 'care'},{value: 'broadcasat'}]
			    })
			},
			{
				xtype: 'combo',
				fieldLabel: 'Зэрэглэл',
				valueField: 'value',
				displayField: 'value',
				name: 'priority',
				value: 'high',
				queryMode: 'local',
				store: Ext.create('Ext.data.Store', {
  				  model: 'CRM_ITEM',
 				  data: [{value: 'low'},{value: 'medium'},{value: 'high'}]
			    }),
			},
			{
				xtype: 'searchcombo',
				fieldLabel: 'Owner',				
				name: 'owner',
				table: 'crm_users',
				value: logged
			},{
				xtype: 'textfield',
				fieldLabel: 'Created by',				
				name: 'userCode',
				value: logged,
				readOnly: true
			},{
				xtype: 'datefield',
				fieldLabel: 'Created on',
				value: new Date(),
				format: 'Y-m-d',
				name: '_date'
			},{
				xtype: 'textarea',
				fieldLabel: 'Note',
				hideLabel: true,
				name: 'descr',
				emptyText: 'Note ...',
				style: 'margin:0', 
				flex: 0.5 
			}],
			buttons: [{
				text: 'Commit',
				iconCls: 'commit',
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
	},

	commitRecord: function(values) {
		var me = this;
		Ext.MessageBox.show({
		   title: 'Please wait',
		   msg: 'Loading items...',
		   progressText: 'Initializing...',
		   width:300,
		   progress:true,
		   closable:false
	   });

	   me.values = values;

	   var f = function(v){
			return function(){				
				if (v == 1)
				{ 
					Ext.Ajax.request({
					   url: 'avia.php',
					   params: {handle: 'web', action: 'insert_multiple_calllog', values: me.values},
					   success: function(response, opts) {
							
					   },
					   failure: function(response, opts) {										   
						  Ext.MessageBox.alert('Status', 'Error !', function() {});
					   }
					});
				} else
				if(v == me.records.length - 1){
					Ext.MessageBox.hide();	
					me.close();
				}else{
					var i = v/(me.records.length - 1);
					Ext.MessageBox.updateProgress(i, Math.round(100*i)+'% completed');
				}
		   };
	   };
	   for(var i = 1; i < me.records.length; i++){
		   setTimeout(f(i), i*500);
	   }		
	}
});