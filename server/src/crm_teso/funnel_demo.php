<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="content-type" content="text/html; charset=UTF-8">
  <title> - jsFiddle demo</title>
  
  <script type='text/javascript' src='funnel/jquery-1.9.1.js'></script>       
  
  <style type='text/css'>
    
  </style>
  


<script type='text/javascript'>//<![CDATA[ 

$(function () {
	var data = [['lead', 0],
				['opportunity', 0],
				['quote', 0],
				['close', 0]];
	$.post('avia.php', {handle: 'web', action: 'select', func: 'crm_deal_funnel_list'}, function(d) {
		var obj = $.parseJSON(d);
		

		for (i = 0; i < obj.items.length; i++) {
			var x = [obj.items[i].name, obj.items[i].value];
			if (obj.items[i].name == 'lead')
				data[0] = x;
			if (obj.items[i].name == 'opportunity')
				data[1] = x;
			if (obj.items[i].name == 'quote')
				data[2] = x;
			if (obj.items[i].name == 'close as won')
				data[3] = x;
		}
		$('#container').highcharts({
			chart: {
				type: 'funnel',
				marginRight: 80
			},
			title: {
				text: '',
				x: -50
			},
			plotOptions: {
				series: {
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b><br>({point.y:,.0f}₮)',
						color: 'black',
						softConnector: true
					},
					neckWidth: '30%',
					neckHeight: '25%'               
				}
			},
			legend: {
				enabled: true
			},
			series: [{
				name: 'Орлого:',
				data: data
			}]
		});
	});
});
//]]>  

</script>


</head>
<body>
  <script src="funnel/highcharts.js"></script>
  <script src="funnel/modules/funnel.js"></script>
  <script src="funnel/modules/exporting.js"></script>
  <div id="container" style="min-width: 410px; max-width: 450px; height: 300px; margin: 0 auto"></div>  
</body>


</html>

