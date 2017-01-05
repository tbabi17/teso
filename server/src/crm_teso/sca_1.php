<?
	$crm_id = $_GET['crm_id'];
?>
<!DOCTYPE HTML>
<html>
<head>
  <script type="text/javascript">
  var crm_id = '<?=$crm_id?>';
  window.onload = function () {
	 var data = [];
	$.post('avia.php', {handle: 'web', action: 'select', func: 'crm_risk_result_ui_list', values:'crm_id', where: crm_id, sort: '_date'}, function(obj) {
		data[0] = {x:0, y: 0};
		data[1] = {x:250, y: 250};
		i = 2;
		$.each(obj, function() {
			   var x = this['score'];
			   var y = this['_repeat'];				
			   data[i] = {x: x, y: y, subject: this['question']};
			   i++;
		  });

		var chart = new CanvasJS.Chart("chartContainer", {
		title:{
		  text: "Risk Chart"
		},		
		axisX:{  
			interval: 250,
			gridColor: "lightgreen",
			gridThickness: 1,
			maximum: 500,
			minimun: 0
		},
		axisY:{        
			interval: 250,
			gridThickness: 1,
			gridColor: "lightgreen",
			maximum: 500,
			minimun: 0
		},
		data: [{
			type: "scatter",
			toolTipContent: "{subject}",
			dataPoints: data
		}]
	});
	chart.render();
	});

	
}
</script>
<script type="text/javascript" src="http://canvasjs.com/assets/script/canvasjs.min.js"></script>
<script type='text/javascript' src='funnel/jquery-1.9.1.js'></script>       
</head>
<body>
  <div id="chartContainer" style="height: 600px; width: 600px;">
  </div>
</body>
</html>