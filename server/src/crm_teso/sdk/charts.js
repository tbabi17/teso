Ext.define('OCS.Chart', {
	extend: 'Ext.chart.Chart',

	yearValue: function() {
		return new Date().getFullYear();
	},

	monthValue: function() {
		return new Date().getMonth()+1;
	},

	today: function() {
		var now = new Date();
		return Ext.Date.format(now, 'Y-m-d');
	},

	tommorow: function() {
		 var today = new Date();
		 var d = today.getDate();
		 var m = today.getMonth();
		 var y = today.getFullYear();
		 var nextDate= new Date(y, m, d+1);
		 var ndate=Ext.Date.format(nextDate, 'Y-m-d');
		 return ndate;
	},

	month: function() {
		 var today = new Date();
		 var m = today.getMonth();
		 var y = today.getFullYear();
		 var nextDate= new Date(y, m, 1);
		 var ndate=Ext.Date.format(nextDate, 'Y-m-d');
		 return ndate;
	},
	
	prevmonth: function() {
		 var today = new Date();
		 var m = today.getMonth();
		 var y = today.getFullYear();
		 var nextDate= new Date(y, m-1, 1);
		 var ndate=Ext.Date.format(nextDate, 'Y-m-d');
		 return ndate;
	},

	nextmonth: function() {
		 var today = new Date();
		 var m = today.getMonth();
		 var y = today.getFullYear();
		 var nextDate= new Date(y, m+1, 1);
		 var ndate=Ext.Date.format(nextDate, 'Y-m-d');
		 return ndate;
	},

	monday: function() {
		var today = new Date();
		var day = today.getDay() || 7;
		if( day !== 1 )
		    today.setHours(-24 * (day - 1)); 
		var ndate=Ext.Date.format(today, 'Y-m-d');
		return ndate;
	},

	year: function() {
		 var today = new Date();
		 var m = today.getMonth();
		 var y = today.getFullYear();
		 var nextDate= new Date(y, 0, 1);
		 var ndate=Ext.Date.format(nextDate, 'Y-m-d');
		 return ndate;
	},

	nextyear: function() {
		 var today = new Date();
		 var m = today.getMonth();
		 var y = today.getFullYear();
		 var nextDate= new Date(y+1, 0, 1);
		 var ndate=Ext.Date.format(nextDate, 'Y-m-d');
		 return ndate;
	},

	reloadData: function() {
		var me = this;
		me.start = me.month();
		me.end = me.nextmonth();
		me.store.load();
	}
});

Ext.define('OCS.SalesFunnel', {
	extend: 'OCS.Chart',
	animate: true,
	shadow: false,
	legend: {
		position: 'right',

	},
	insetPadding: 30,
	theme: 'Base:gradients',

	initComponent: function() {
		var me = this;
		
		me.store = Ext.create('Ext.data.Store', {
			fields: ['name', 'value'],
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
    	            totalProperty: 'results'
    	        },				
				simpleSortMode: true,
				extraParams: {handle: 'web', action: 'select', func: 'crm_deal_funnel_list'}
			}
		});
		
		me.rangeData(me.month(), me.nextmonth());

		me.series = [{
			type: 'pie',
			field: 'value',
			showInLegend: true,
			donut: false,
			tips: {
			  trackMouse: true,
			  width: 250,
			  height: 28,
			  renderer: function(storeItem, item) {				
				this.setTitle(storeItem.get('name') + ': ' + renderMoney(storeItem.get('value')));
			  }
			},
			highlight: {
			  segment: {
				margin: 5
			  }
			},
			label: {
				field: 'name',
				display: 'rotate',
				contrast: true,
				font: '11px Segoe UI'		
			}
		}];

		me.callParent(arguments);
	},

	rangeData: function(e1, e2) {
		var me = this;
		me.start = e1;
		me.end = e2;
		me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: 'crm_deal_funnel_list', start_date: me.start, end_date: me.end};
		me.store.load();
	}
});

Ext.define('OCS.SalesServiceFunnel', {
	extend: 'OCS.Chart',
	animate: true,
	shadow: false,
	legend: {
		position: 'right',

	},
	insetPadding: 30,
	theme: 'Base:gradients',

	initComponent: function() {
		var me = this;
		
		me.store = Ext.create('Ext.data.Store', {
			fields: ['name', 'value'],
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
    	            totalProperty: 'results'
    	        },				
				simpleSortMode: true,
				extraParams: {handle: 'web', action: 'select', func: 'crm_service_funnel_list'}
			}
		});
		
		me.rangeData(me.month(), me.nextmonth());

		me.series = [{
			type: 'pie',
			field: 'value',
			showInLegend: true,
			donut: false,
			tips: {
			  trackMouse: true,
			  width: 250,
			  height: 28,
			  renderer: function(storeItem, item) {				
				this.setTitle(storeItem.get('name') + ': ' + renderMoney(storeItem.get('value')));
			  }
			},
			highlight: {
			  segment: {
				margin: 5
			  }
			},
			label: {
				field: 'name',
				display: 'rotate',
				contrast: true,
				font: '11px Segoe UI'		
			}
		}];

		me.callParent(arguments);
	},

	rangeData: function(e1, e2) {
		var me = this;
		me.start = e1;
		me.end = e2;
		me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: 'crm_service_funnel_list', start_date: me.start, end_date: me.end};
		me.store.load();
	}
});

Ext.define('OCS.CampaignChartRevenue', {
	extend: 'OCS.Chart',
	animate: true,
	shadow: false,
	insetPadding: 50,
	legend: {
		position: 'bottom'
	},

	initComponent: function() {
		var me = this;

		me.store = Ext.create('Ext.data.Store', {
			fields: ['campaign_type', 'campaign_target', 'campaign_cost', 'actual_revenue', 'in_progress'],
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
    	            totalProperty: 'results'
    	        },				
				simpleSortMode: true,
				extraParams: {handle: 'web', action: 'select', func: 'crm_campaign_by_revenue_list', start_date: new Date(new Date().getFullYear(), 0, 1), end_date: new Date(new Date().getFullYear(), 11, 31)}
			}
		});	

		me.rangeData(me.month(), me.nextmonth());

		me.axes = [{
			type: 'Numeric',
			position: 'left',
			fields: ['campaign_target', 'campaign_cost', 'actual_revenue', 'in_progress'],
			title: false,
			grid: false,
			majorTickSteps: 1,
			minimum: 0,
			label: {
				renderer: function(v) {
					return String(v).replace(/(.)00000$/, '.$1M');
				}
			}
		}, {
			type: 'Category',
			position: 'bottom',
			fields: ['campaign_type'],
			title: true
		}];

		me.series = [{
			type: 'column',
			axis: 'bottom',
			gutter: 80,
			xField: 'campaign_type',
			yField: ['campaign_cost', 'in_progress', 'actual_revenue', 'campaign_target'],
			tips: {
				trackMouse: true,
				width: 65,
				height: 28,
				renderer: function(storeItem, item) {
					this.setTitle(String(item.value[1] / 1000000) + 'M');
				}
			}
		}];
		
		me.callParent(arguments);
	},

	rangeData: function(e1, e2) {
		var me = this;
		me.start = e1;
		me.end = e2;
		me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: 'crm_campaign_by_revenue_list', start_date: e1, end_date: e2};
		me.store.load();
	}
});


Ext.define('OCS.OpportunityRevenueChart', {
	extend: 'OCS.Chart',
	animate: true,
	shadow: false,
	insetPadding: 30,
	legend: {
		position: 'bottom'
	},

	initComponent: function() {
		var me = this;
		me.start = me.month();
		me.end = me.nextmonth();
		me.store = Ext.create('Ext.data.Store', {
			fields: ['owner', 'team', 'actual_revenue', 'expected_revenue', 'target_revenue'],
			groupField: 'team',
			sortField: 'actual_revenue',
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
    	            totalProperty: 'results'
    	        },				
				simpleSortMode: true,
				extraParams: {handle: 'web', action: 'select', func: 'crm_opportunity_by_revenue_list', start_date: new Date(new Date().getFullYear(), 0, 1), end_date: new Date(new Date().getFullYear(), 11, 31), values: 'user_level', where: 0}
			}
		});

		me.rangeData(me.month(), me.nextmonth());

		me.axes = [{
			type: 'Numeric',
			position: 'left',
			fields: ['actual_revenue', 'expected_revenue', 'target_revenue'],
			title: true,
			grid: false,
			majorTickSteps: 0,
			minimum: 0,
			label: {
				renderer: function(v) {
					return String(v).replace(/(.)00000$/, '.$1M');
				}
			}
		}, {
			type: 'Category',
			position: 'bottom',
			fields: ['owner'],
			label: {
                renderer: function(v) {
                    return Ext.String.ellipsis(v, 15, false);
                },
                font: '11px Arial',
                rotate: {
                    degrees: 270
                }
            }
		}];

		me.series = [{
			type: 'column',
			axis: 'bottom',
			gutter: 120,
			xField: 'owner',
			yField: ['actual_revenue', 'expected_revenue', 'target_revenue'],
//			stacked: true,
			tips: {
				trackMouse: true,
				width: 150,
				height: 28,
				renderer: function(storeItem, item) {
					this.setTitle(item.value[0]+' '+String(item.value[1] / 1000000) + 'M');
				}
			}
		}];

		me.callParent(arguments);
	},

	rangeData: function(e1, e2) {
		var me = this;
		me.start = e1;
		me.end = e2;
		me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: 'crm_opportunity_by_revenue_list', start_date: e1, end_date: e2};
		me.store.load();
	},

	createWindow: function() {
		var me = this;

		me.grid = new Ext.create('Ext.grid.Panel', {
			selType: 'checkboxmodel',
			store: me.store,
			region: 'center',
			border: false,
			features : [{
				ftype: 'grouping',
				groupHeaderTpl: '{columnName}: {name} ({rows.length} бичлэг)',
				hideGroupedHeader: false,
				startCollapsed: false,
				id: 'grouping_opportunity_chart'
			}],
			flex: 1,
			columns : [
                {text: "owner", flex: 1, dataIndex: 'owner', renderer: renderOwner, sortable: true},
                {text: "team", width: 120, dataIndex: 'team'},
                {text: "actual_revenue", width: 115, dataIndex: 'actual_revenue', align: 'right', renderer: renderMoney, sortable: true},
                {text: "expected_revenue", width: 115, dataIndex: 'expected_revenue', align: 'right', renderer: renderMoney, sortable: true},
                {text: "target_revenue", width: 115, dataIndex: 'target_revenue', renderer: renderMoney, align: 'right', sortable: true}
            ],
			tbar: [{
				xtype: 'textfield',
				emptyText: 'filter',
				listeners: {
					specialkey: function(field, e){
						if (e.getKey() == e.ENTER) {
							var g = field.up('grid'),
							value = field.getValue(); 
							if (value.length > 0) {							
								g.store.filter({scope: this, filterFn: function(rec) { 
										var rege = new RegExp(".*" + value + ".*"); 
										if (rege.test(rec.data.owner) || rege.test(rec.data.team)) {
											return true;
										}
										return false;
									} 
								});
							} else {
								g.store.clearFilter();
							}
						}
					},
					change: function (radio2, newvalue, oldvalue) {				
						if (newvalue) {	
							me.store.clearFilter();
							me.store.filter({scope: this, filterFn: function(rec) { 
									var rege = new RegExp(".*" + newvalue + ".*"); 
									if (rege.test(rec.data.owner) || rege.test(rec.data.team)) {
										return true;
									}
									return false;
								} 
							});
						} else {
							me.store.clearFilter();
						}
					}
				}
			},{

			}],
			buttons: [{
				text: 'Reset',
				iconCls: 'reset',
				handler: function() {
					me.store.clearFilter();
				}
			},{
				text: 'View',
				iconCls: 'commit',
				handler: function() {
					var records = me.grid.getView().getSelectionModel().getSelection();
					var owners = '';
					for (i = 0;  i < records.length; i++) {
						var rec = records[i];
						owners += rec.get('owner')+',';
					}

					me.store.filter(function(r) {
						var value = r.get('owner');
						return (owners.indexOf(value+',') != -1);
					});
				}
			}]
		});

		me.win = new Ext.create('Ext.Window', {
			title: 'Filter',
			width: 650,
			height: 350,
			layout: 'border',
			items: me.grid
		});
		
		me.win.show();
	}	
});

Ext.define('OCS.StatUserChart', {
	extend: 'OCS.Chart',
	animate: true,
	shadow: false,
	insetPadding: 50,
	values: '',
	where: '',
	legend: {
		position: 'bottom'
	},

	initComponent: function() {
		var me = this;

		me.store = Ext.create('Ext.data.Store', {
			fields: ['stat_type', 'actual', 'planning'],
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
    	            totalProperty: 'results'
    	        },				
				simpleSortMode: true,
				extraParams: {handle: 'web', action: 'select', func: 'crm_user_stat_by_summary_list', values: '', where: 0, start_date: new Date().getFullYear(), end_date: new Date().getMonth()+1}
			}
		});

		me.rangeData(me.yearValue(), me.monthValue());

		me.axes = [{
			type: 'Numeric',
			position: 'left',
			fields: ['actual', 'planning'],
			title: false,
			grid: false,
			majorTickSteps: 0,
			minimum: 0			
		}, {
			type: 'Category',
			position: 'bottom',
			fields: ['stat_type'],
			label   : {
	             rotation:{
					 degrees:345
				 }
	        },
			title: true
		}];

		me.series = [{
			type: 'column',
			axis: 'bottom',
			gutter: 80,
			xField: 'stat_type',
			yField: ['actual', 'planning'],
//			stacked: true,
			tips: {
				trackMouse: true,
				width: 150,
				height: 28,
				renderer: function(storeItem, item) {
					this.setTitle(item.value[0]+' '+String(item.value[1]));
				}
			}
		}];

		me.callParent(arguments);
	},

	rangeData: function(e1, e2) {
		var me = this;
		me.start = e1;
		me.end = e2;
		me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: 'crm_user_stat_by_summary_list', start_date: e1, end_date: e2, values: me.values, where: me.where};
		me.store.load();
	},

	createWindow: function() {
		var me = this;		
		
		me.form = Ext.create('OCS.FormPanel', {
			id : 'user_plan_stat',				
			title: 'Custom',	
			region: 'center',
			hidden: false,
			closable: false,
			title: '',
			items: [{
				xtype: 'numberfield',
				fieldLabel: 'Year',				
				name: 'year',
				value: me.yearValue()
			},	
			{
				xtype: 'numberfield',
				fieldLabel: 'Month',				
				name: 'month',
				value: me.monthValue()
			},
			{
				xtype: 'searchcombo',
				fieldLabel: 'Owner',				
				table: 'crm_users',
				name: 'owner'
			}],
			buttons: [{
				text: 'Commit',
				handler: function() {
					var form = this.up('form').getForm();
					if (form.isValid())	{
						me.start = form.findField('year').getValue();
						me.end = form.findField('month').getValue();
						if (form.findField('owner').getValue()) {
							me.values = 'owner';
							me.where = form.findField('owner').getValue();
						} else {
							me.values = '';
							me.where = '';
						}
						
						me.rangeData(me.start, me.end);
						me.win.close();
					}
					else
					  Ext.MessageBox.alert('Status', 'Invalid data !', function() {});
				}
			}]
		});
		

		me.win = new Ext.create('Ext.Window', {
			title: 'Filter',
			width: 280,
			height: 180,
			layout: 'border',
			items: me.form
		});
		
		me.win.show();
	}	
});

Ext.define('OCS.CampaignChartSuccess', {
	extend: 'OCS.Chart',
	animate: true,
	shadow: true,
	insetPadding: 50,
	legend: {
		position: 'bottom'
	},

	initComponent: function() {
		var me = this;

		me.store = Ext.create('Ext.data.Store', {
			fields: ['campaign_type', 'target', 'success', 'unsuccess', 'pending'],
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
    	            totalProperty: 'results'
    	        },				
				simpleSortMode: true,
				extraParams: {handle: 'web', action: 'select', func: 'crm_campaign_by_status_list'}
			}
		});
		
		me.reloadData();

		me.axes = [{
			type: 'Numeric',
			position: 'left',
			fields: ['target', 'success', 'unsuccess', 'pending'],
			title: false,
			grid: false,
			majorTickSteps: 1,
			minimum: 0
		}, {
			type: 'Category',
			position: 'bottom',
			fields: ['campaign_type'],
			title: true
		}];

		me.series = [{
			type: 'column',
			axis: 'bottom',
			gutter: 80,
			xField: 'campaign_type',
			yField: ['target', 'success', 'unsuccess', 'pending'],
			stacked: true,
			tips: {
				trackMouse: true,
				width: 65,
				height: 28,
				renderer: function(storeItem, item) {
					this.setTitle(String(item.value[1]));
				}
			}
		}];

		me.callParent(arguments);
	},

	reloadData: function() {
		var me = this;
		me.store.load();
	}
});


Ext.define('OCS.CasesByStatus', {
	extend: 'OCS.Chart',
	animate: true,
	shadow: false,
	insetPadding: 30,
	legend: {
		position: 'bottom'
	},

	initComponent: function() {
		var me = this;
		
		me.store = Ext.create('Ext.data.JsonStore', {
			fields: ['name', 'value'],
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
    	            totalProperty: 'results'
    	        },				
				simpleSortMode: true,
				extraParams: {handle: 'web', action: 'select', func: 'crm_complain_by_status_list'}
			}
		});
		
		me.rangeData(me.month(), me.nextmonth());
		
		me.series = [{
			type: 'column',
			field: 'value',
			showInLegend: true,
			donut: false,
			tips: {
			  trackMouse: true,
			  width: 140,
			  height: 28,
			  renderer: function(storeItem, item) {				
				this.setTitle(storeItem.get('name') + ': ' + storeItem.get('value'));
			  }
			},
			highlight: {
			  segment: {
				margin: 5
			  }
			},
			label: {
				field: 'name',
				display: 'rotate',
				contrast: true,
				font: '11px Segoe UI',
				renderer: function(v) {
					return v;
				}
			}
		}];

		me.callParent(arguments);
	},

	rangeData: function(e1, e2) {
		var me = this;
		me.start = e1;
		me.end = e2;
		me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: 'crm_complain_by_status_list', start_date: e1, end_date: e2};
		me.store.load();
	}
});

Ext.define('OCS.SalesStagePipeLine', {
	extend: 'OCS.Chart',
	animate: true,
	shadow: false,
	legend: {
		position: 'right'
	},
	insetPadding: 50,
	theme: 'Base:gradients',

	initComponent: function() {
		var me = this;
		
		me.store = Ext.create('Ext.data.Store', {
			fields: ['name', 'value'],
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
    	            totalProperty: 'results'
    	        },				
				simpleSortMode: true,
				extraParams: {handle: 'web', action: 'select', func: 'crm_stage_of_sales_pipeline_list'}
			}
		});
		
		me.rangeData(me.month(), me.nextmonth());

		me.series = [{
			type: 'pie',
			field: 'value',
			showInLegend: true,
			donut: false,
			tips: {
			  trackMouse: true,
			  width: 140,
			  height: 28,
			  renderer: function(storeItem, item) {				
				this.setTitle(storeItem.get('name') + ': ' + storeItem.get('value'));
			  }
			},
			highlight: {
			  segment: {
				margin: 5
			  }
			},
			label: {
				field: 'name',
				display: 'rotate',
				contrast: true,
				font: '11px Segoe UI'		
			}
		}];

		me.callParent(arguments);
	},

	rangeData: function(e1, e2) {
		var me = this;
		me.start = e1;
		me.end = e2;
		me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: 'crm_stage_of_sales_pipeline_list', start_date: e1, end_date: e2};
		me.store.load();
	}
});


Ext.define('OCS.AccountByIndustry', {
	extend: 'OCS.Chart',
	animate: true,
	shadow: false,
	legend: {
		position: 'right'
	},
	insetPadding: 50,
	theme: 'Base:gradients',

	initComponent: function() {
		var me = this;
		
		me.store = Ext.create('Ext.data.Store', {
			fields: ['name', 'value'],
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
    	            totalProperty: 'results'
    	        },				
				simpleSortMode: true,
				extraParams: {handle: 'web', action: 'select', func: 'crm_account_by_industry_list'}
			}
		});
		
		me.rangeData(me.month(), me.nextmonth());

		me.series = [{
			type: 'pie',
			field: 'value',
			showInLegend: true,
			donut: false,
			tips: {
			  trackMouse: true,
			  width: 140,
			  height: 28,
			  renderer: function(storeItem, item) {				
				this.setTitle(storeItem.get('name') + ': ' + storeItem.get('value'));
			  }
			},
			highlight: {
			  segment: {
				margin: 5
			  }
			},
			label: {
				field: 'name',
				display: 'rotate',
				contrast: true,
				font: '11px Segoe UI'		
			}
		}];

		me.callParent(arguments);
	},

	rangeData: function(e1, e2) {
		var me = this;
		me.start = e1;
		me.end = e2;
		me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: 'crm_account_by_industry_list', start_date: e1, end_date: e2};
		me.store.load();
	}
});

Ext.define('OCS.OpportunityByProbability', {
	extend: 'OCS.Chart',
	animate: true,
	shadow: false,
	legend: {
		position: 'right'
	},
	insetPadding: 50,
	theme: 'Base:gradients',

	initComponent: function() {
		var me = this;
		
		me.store = Ext.create('Ext.data.Store', {
			fields: ['name', 'value'],
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
    	            totalProperty: 'results'
    	        },				
				simpleSortMode: true,
				extraParams: {handle: 'web', action: 'select', func: 'crm_potential_by_probablity_list'}
			}
		});
		
		me.reloadData();

		me.series = [{
			type: 'pie',
			field: 'value',
			showInLegend: true,
			donut: false,
			tips: {
			  trackMouse: true,
			  width: 140,
			  height: 28,
			  renderer: function(storeItem, item) {				
				this.setTitle(storeItem.get('name') + ' %: ' + storeItem.get('value'));
			  }
			},
			highlight: {
			  segment: {
				margin: 5
			  }
			},
			label: {
				field: 'name',
				display: 'rotate',
				contrast: true,
				font: '11px Segoe UI'		
			}
		}];

		me.callParent(arguments);
	}
});

Ext.define('OCS.LeadBySource', {
	extend: 'OCS.Chart',
	animate: true,
	shadow: false,
	legend: {
		position: 'right'
	},
	insetPadding: 50,
	theme: 'Base:gradients',

	initComponent: function() {
		var me = this;
		
		me.store = Ext.create('Ext.data.Store', {
			fields: ['name', 'value'],
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
    	            totalProperty: 'results'
    	        },				
				simpleSortMode: true,
				extraParams: {handle: 'web', action: 'select', func: 'crm_lead_by_source_list'}
			}
		});
		
		me.rangeData(me.month(), me.nextmonth());

		me.series = [{
			type: 'pie',
			field: 'value',
			showInLegend: true,
			donut: false,
			tips: {
			  trackMouse: true,
			  width: 140,
			  height: 28,
			  renderer: function(storeItem, item) {				
				this.setTitle(storeItem.get('name') + ': ' + storeItem.get('value'));
			  }
			},
			highlight: {
			  segment: {
				margin: 5
			  }
			},
			label: {
				field: 'name',
				display: 'rotate',
				contrast: true,
				font: '11px Segoe UI'				
			}
		}];

		me.callParent(arguments);
	},

	rangeData: function(e1, e2) {
		var me = this;
		me.start = e1;
		me.end = e2;
		me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: 'crm_lead_by_source_list', start_date: e1, end_date: e2};
		me.store.load();
	}
});


Ext.define('OCS.ProductChart', {
	extend: 'OCS.Chart',
	animate: true,
	shadow: false,
	legend: {
		position: 'bottom',
		visible: false,
		labelFont: '10px Segoe UI'
	},
	insetPadding: 20,
	region: 'center',
	theme: 'Base:gradients',

	initComponent: function() {
		var me = this;
		
		me.store = Ext.create('Ext.data.Store', {
			fields: ['product_name', 'amount'],
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
    	            totalProperty: 'results'
    	        },				
				simpleSortMode: true,
				extraParams: {handle: 'web', action: 'select', func: 'crm_chart_product_list'}
			}
		});
		
		me.rangeData(me.month(), me.nextmonth());

		me.series = [{
			type: 'pie',
			field: 'amount',
			showInLegend: true,
			donut: false,
			tips: {
			  trackMouse: true,
			  width: 200,
			  height: 32,
			  renderer: function(storeItem, item) {				
				this.setTitle(storeItem.get('product_name') + ': </br>' + renderMoney(storeItem.get('amount'))+'</br>');
			  }
			},
			highlight: {
			  segment: {
				margin: 5
			  }
			},
			label: {
				field: 'product_name',
				renderer: function(v) {
					if (v.length > 32)
						return v.substring(0, 32)+'...';
					return v;
				},
				display: 'rotate',
				contrast: true,
				font: '11px Segoe UI'				
			}
		}];

		me.callParent(arguments);
	},

	rangeData: function(e1, e2) {
		var me = this;
		me.start = e1;
		me.end = e2;
		me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: 'crm_chart_product_list', start_date: e1, end_date: e2, sort:'_date', dir: 'asc'};
		me.store.load({callback: function() {
				me.refresh();
				me.redraw();
			}
		});
	},

	setStore: function(store) {
		var me = this;
		store.each(function(rec){
			if (rec.get('product_name')){
				me.store.add({
					product_name: rec.get('product_name'),
					amount: rec.get('amount')
				});
			}
		});
	}
});



Ext.define('OCS.MapOnline', {
	extend: 'Ext.panel.Panel',
	layout: 'border',
	border: false,
	region: 'center',
	
	initComponent: function() {
		var me = this;
		me.markers = [];
		
		me.store = Ext.create('Ext.data.Store', {
			fields: ['id', 'owner', 'lat', 'lng', '_date'],
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
    	            totalProperty: 'results'
    	        },				
				simpleSortMode: true,
				extraParams: {handle: 'web', action: 'select', func: 'crm_chart_product_list'}
			}
		});
		me.map = Ext.create('Ext.ux.GMapPanel', {
			region: 'center',
			border: false,
			xtype: 'gmappanel',
			center: {
				geoCodeAddr: '15171, Ulaanbaatar, Mongolia'
			},
			markers: me.markers			
		});
		
		me.items = [me.map];

		setTimeout(function() {
			 me.reload(me.today());
		}, 2000);

		me.callParent(arguments);
	},
	
	removeMarkers: function() {
		var me = this;
		if (me.markers) {		
			for (i = 0; i < me.markers.length; i++) {
				me.markers[i].setMap(null);
			}
		}	

		//me.map.getMap().clearOverlays();

		me.markers = [];
		me.polylines = [];
		me.overlay = [];
	},

	reload: function(start) {
		var me = this;			
		me.start = start;
		end = new Date(start);
		end.setDate(end.getDate()+1);
		end = Ext.Date.format(end, 'Y-m-d');
		i = 0;
		me.removeMarkers();
		me.store.getProxy().extraParams = {handle: 'web', action: 'select', func: 'crm_chart_gps_list', sort:'_date', dir: 'asc', start_date: start, end_date: end, values: me.values, where: me.where};
		me.store.load({callback: function() {			
				me.store.each(function(rec){
					var size = 24;
					var dt = renderCreatedDate(rec.data['_date']);
					var url = 'images/greendot.png';
					if (dt.indexOf('минут') == -1 || dt.indexOf('дөнгөж') == -1) {
							url = 'images/greendot.png';
							size = 16;
					}

					if (i == me.store.getCount() - 1) {
							url = 'images/online.png';
							size = 24;
					}

					var icon = new google.maps.MarkerImage(	    		
						url,
						new google.maps.Size(size, size), //size
						new google.maps.Point(0,0), //origin
						new google.maps.Point(size/2, size),
						new google.maps.Size(size, size)//scale 
					);
					

					var marker = {
						lat: rec.data['lat'],
						lng: rec.data['lng'],					
						title: rec.data['owner'],			
						_date: rec.data['_date'],
						icon: icon,
						listeners: {
							'click': function(m) {
								var dt = renderCreatedDate(this._date);
								me.infowindow.setContent(this.title+'</br>'+dt);
								me.infowindow.open(me.map.gmap, this);
							}
						}
					};		
					
					me.polylines.push(new google.maps.LatLng(rec.data['lat'], rec.data['lng']));
					
					if (me.polylines.length == 2) {		
						var lineSymbol = {
						   path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
						};

						me.flightPath = new google.maps.Polyline({
							path: me.polylines,
							geodesic: true,
							strokeColor: '#ff6633',
							strokeOpacity: 1.0,
							icons: [{
							  icon: lineSymbol,
							  offset: '50%'
							}],
							strokeWeight: 2
						});

						me.flightPath.setMap(me.map.gmap);
						me.overlay.push(me.flightPath);
						me.polylines.splice(0, 1);
						me.lineCount++;
					}

					me.infowindow = new google.maps.InfoWindow({
						content: rec.data['owner']+'</br>'+renderCreatedDate(rec.data['_date'])
					});

					me.markers.push(me.map.addMarker(marker));
				});					
			}
		});
	},

	today: function() {
		var now = new Date();
		return Ext.Date.format(now, 'Y-m-d');
	},

	tommorow: function() {
		 var today = new Date();
		 var d = today.getDate();
		 var m = today.getMonth();
		 var y = today.getFullYear();
		 var nextDate= new Date(y, m, d+1);
		 var ndate=Ext.Date.format(nextDate, 'Y-m-d');
		 return ndate;
	},

	createWindow: function() {
		var me = this;		
		
		me.form = Ext.create('OCS.FormPanel', {
			id : 'user_plan_stat',				
			title: 'Custom',	
			region: 'center',
			hidden: false,
			closable: false,
			title: '',
			items: [
			{
				xtype: 'searchcombo',
				fieldLabel: 'Борлуулагч',				
				table: 'crm_users',
				name: 'owner'
			}],
			buttons: [{
				text: 'Илгээх',
				handler: function() {
					var form = this.up('form').getForm();
					if (form.isValid())	{
						if (form.findField('owner').getValue()) {
							me.values = 'owner';
							me.where = form.findField('owner').getValue();
						} else {
							me.values = '';
							me.where = '';
						}
						
						me.reload(me.start);
						me.win.close();
					}
					else
					  Ext.MessageBox.alert('Status', 'Invalid data !', function() {});
				}
			}]
		});
		

		me.win = new Ext.create('Ext.Window', {
			title: 'Шүүлтүүр',
			width: 320,
			height: 180,
			layout: 'border',
			items: me.form
		});
		
		me.win.show();
	}	
});