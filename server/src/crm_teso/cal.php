<?
	function curl_download($Url){
	 
		// is cURL installed yet?
		if (!function_exists('curl_init')){
			die('Sorry cURL is not installed!');
		}
	 
		// OK cool - then let's create a new cURL resource handle
		$ch = curl_init();
	 
		// Now set some options (most are optional)
	 
		// Set URL to download
		curl_setopt($ch, CURLOPT_URL, $Url);
	 
		// Set a referer
		curl_setopt($ch, CURLOPT_REFERER, "http://www.example.org/yay.htm");
		curl_setopt($ch, CURLOPT_MAXREDIRS, 10);
	 
		// User agent
		curl_setopt($ch, CURLOPT_USERAGENT, "MozillaXYZ/1.0");
	 
		// Include header in result? (0 = yes, 1 = no)
		curl_setopt($ch, CURLOPT_HEADER, 0);
	 
		// Should cURL return or print out the data? (true = return, false = print)
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		//curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
		 
	 
		// Timeout in seconds
		curl_setopt($ch, CURLOPT_TIMEOUT, 10);
	 
		// Download the given URL, and return output
		$output = curl_exec($ch);
	 
		// Close the cURL resource, and free system resources
		curl_close($ch);
	 
		return $output;
	}

	$account = $_GET['account'];
	$t = curl_download('https://www.google.com/calendar/embed?bgcolor=%23ccccff&output=embed&src='.$account.'&ctz=Asia/Ulaanbaatar');
	$t = str_replace('rel="stylesheet" href="', 'rel="stylesheet" href="https://', $t);
	$t = str_replace('type="text/javascript" src="', 'type="text/javascript" src="https://', $t);
	print $t;
?>