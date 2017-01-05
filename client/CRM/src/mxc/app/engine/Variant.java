package mxc.app.engine;

import java.util.Hashtable;

public class Variant {	
	Hashtable<String, String> items;	
	
	public Variant() {
		items = new Hashtable<String, String>();		
	}
	
	public int size() {
		return items.size();
	}
	
	public String nextKey(String key) {		
		return key;
	}
	
	public void put(String key, String value) {
		if (key == null) return;
		if (value == null) value = "";
		if (items.containsKey(key))			
			key = nextKey(key);		
		
		items.put(key.trim(), value);
	}
	
	public void put_append(String key, String value) {
		if (key == null) 			
			return;
		
		if (value == null) value = "";
		if (items.containsKey(key)) {										
			String v = items.get(key.trim()); 
			items.put(key.trim(), v+value);
		} else
			items.put(key.trim(), value); 
	}
	
	public void put(String key, Float value) {
		if (key == null) return;
		if (value == null) value = 0.0f;
		if (items.containsKey(key))			
			key = nextKey(key);		
		
		items.put(key.trim(), value.toString());
	}	
	
	public boolean found(String key) {
		return items.containsKey(key);			
	}
	
	public String get(String key) {
		if (items.containsKey(key))
			return items.get(key).toString();
		
		return "";
	}
	
	public String getDate(String key) {
		if (items.containsKey(key)) {
			String value = items.get(key).toString();
			if (value.length() < 10) return value; 
			value = value.substring(0, 10);
			return value;
		}
		
		return "";
	}
	
	public long getLong(String key) {
		if (items.containsKey(key)) {
			String value = items.get(key).toString();
			char c = value.charAt(0);
			if (c == 'i') value = value.substring(1, value.length());
			return Long.parseLong(value);
		}
		
		return 0;
	}
	
	public int getInt(String key) {
		if (items.containsKey(key)) {
			String value = items.get(key).toString();
			char c = value.charAt(0);
			if (c == 'i') value = value.substring(1, value.length());
			return Integer.parseInt(value);
		}
		
		return 0;
	}
	
	public float getFloat(String key) {
		if (items.containsKey(key)) {
			String value = items.get(key).toString();
			char c = value.charAt(0);
			if (c == 'f') value = value.substring(1, value.length());
			return Float.parseFloat(value);
		}
		
		return 0;
	}
	
	public String getString(String key) {
		if (items.containsKey(key)) {
			String value = items.get(key).toString();
			if (value == null || value.length() == 0) value = " ";
			char c = value.charAt(0);
			if (c == 's') value = value.substring(1, value.length());
			return value;
		}
		
		return key;
	}
	
	public String xml(String tag) {
		String xml="<"+tag+">";
		for (String key : items.keySet()) {
			xml += "<"+key+">"+items.get(key)+"</"+key+">";		    
		}
		xml += "</"+tag+">";
		return xml;
	}
	
	public String json(String xfields) {
		String json = "";
		for (String key : items.keySet()) {
			String value = items.get(key);
			if (key.equals("index") || xfields.indexOf(key+",") != -1) continue;
			if (value.length() > 0) {
				if (value.charAt(0) == 'i')
					json += key+"="+getInt(key)+"&"; else
				if (value.charAt(0) == 'f')
					json += key+"="+getFloat(key)+"&";else
				if (value.charAt(0) == 's')
					json += key+"="+getString(key)+"&";
				
			} else
				json += key+"="+getString(key)+"&";		    
		}		
		json = json.substring(0, json.length() - 1);
		return json;
	}
}