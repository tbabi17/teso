package mxc.optimal.crm;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.zip.GZIPInputStream;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import mxc.app.engine.Collection;
import mxc.app.engine.Shared;
import mxc.app.engine.Variant;

import org.apache.http.Header;
import org.apache.http.HeaderElement;
import org.apache.http.HttpEntity;
import org.apache.http.HttpException;
import org.apache.http.HttpResponse;
import org.apache.http.HttpResponseInterceptor;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.HttpEntityWrapper;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HttpContext;
import org.apache.http.util.EntityUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.preference.PreferenceManager;
import android.util.Log;

public class XMLParser {
	
	public XMLParser() {
		
	}
	
	public String getXmlToLogin(String url, String values) {
		String xml = null;
		Log.v("blah",url);
        try {
            // defaultHttpClient
            DefaultHttpClient httpClient = new DefaultHttpClient();
            HttpPost httpPost = new HttpPost(url);
            httpPost.setHeader("MSISDN", Shared.sid);
            
            List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>();
            nameValuePairs.add(new BasicNameValuePair("handle", "web"));
            nameValuePairs.add(new BasicNameValuePair("action", "login"));         
            nameValuePairs.add(new BasicNameValuePair("where", values));            	           
            httpPost.setEntity(new UrlEncodedFormEntity(nameValuePairs,"UTF-8"));
            
            httpClient.addResponseInterceptor(new HttpResponseInterceptor() {
                
                @Override
				public void process(
                        final HttpResponse response, 
                        final HttpContext context) throws HttpException, IOException {
                    HttpEntity entity = response.getEntity();
                    Header ceheader = entity.getContentEncoding();
                    if (ceheader != null) {
                        HeaderElement[] codecs = ceheader.getElements();
                        for (int i = 0; i < codecs.length; i++) {
                            if (codecs[i].getName().equalsIgnoreCase("gzip")) {
                                response.setEntity(
                                        new GzipDecompressingEntity(response.getEntity())); 
                                return;
                            }
                        }
                    }
                }
                
            });
            
            HttpResponse httpResponse = httpClient.execute(httpPost);
            HttpEntity httpEntity = httpResponse.getEntity();
            xml = EntityUtils.toString(httpEntity, "UTF-8");      
            
            if (httpResponse.getStatusLine().getStatusCode() == 401) {
            	xml = "fail";
            }                            	
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } catch (ClientProtocolException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
        	e.printStackTrace();
        }
        // return XML
        return xml;
	}
	
	public String getXmlToUrl(String url, String table, String values, int crm_id) {
		Variant w = new Variant();
		if (values.length() > 0) {			
	        w.put("table_name", table);
	        w.put("json", values);
	        w.put("crm_id", "i"+crm_id);
	        Shared.sql.insertVariant("JsonList", w, "s,s,i", "table_name,json,crm_id");
		}
		
		String xml = getXmlUnSuccess(url);
        return xml;
	}		
	
	public String getXmlUnSuccess(String url) {
		String xml = "";	
        Collection c = Shared.sql.selectAll("JsonList", "i,s,s", "id,table_name,json", null, null);
        for (int i = 0; i < c.size(); i++) {
        	Variant w = c.elementAt(i);				
	        try {
	            DefaultHttpClient httpClient = new DefaultHttpClient();
	            HttpPost httpPost = new HttpPost(url);            
	            httpPost.setHeader("MSISDN", Shared.sid);	            
	            
	            List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>();
	            nameValuePairs.add(new BasicNameValuePair("handle", "web"));	            
	            nameValuePairs.add(new BasicNameValuePair("action", "insert"));	            	            
	            nameValuePairs.add(new BasicNameValuePair("values", w.getString("json")));
	            nameValuePairs.add(new BasicNameValuePair("table", w.getString("table_name")));	            
	            httpPost.setEntity(new UrlEncodedFormEntity(nameValuePairs,"UTF-8"));
	            
	            httpClient.addResponseInterceptor(new HttpResponseInterceptor() {
	                
	                @Override
					public void process(
	                        final HttpResponse response, 
	                        final HttpContext context) throws HttpException, IOException {
	                    HttpEntity entity = response.getEntity();
	                    Header ceheader = entity.getContentEncoding();
	                    if (ceheader != null) {
	                        HeaderElement[] codecs = ceheader.getElements();
	                        for (int i = 0; i < codecs.length; i++) {
	                            if (codecs[i].getName().equalsIgnoreCase("gzip")) {
	                                response.setEntity(
	                                        new GzipDecompressingEntity(response.getEntity())); 
	                                return;
	                            }
	                        }
	                    }
	                }
	                
	            });
	            
	            HttpResponse httpResponse = httpClient.execute(httpPost);
	            HttpEntity httpEntity = httpResponse.getEntity();
	            xml = EntityUtils.toString(httpEntity, "UTF-8");      
	            
	            int size = xml.length();
	            if (httpResponse.getStatusLine().getStatusCode() == 401) {
	            	xml = "fail";
	            } else
	            if (size > 0) {	            	
	            	Shared.sql.deleteWhere("JsonList", "id="+w.getInt("id"));
	            	xml = "success";
	            }
	            
	    		
	        } catch (UnsupportedEncodingException e) {
	            e.printStackTrace();
	        } catch (ClientProtocolException e) {
	            e.printStackTrace();
	        } catch (IOException e) {
	            e.printStackTrace();
	        } catch (Exception e) {
	        	e.printStackTrace();
	        }
	        // return XML	        
        }
        
        return xml;
	}
	
	public String getXmlUpdateUrl(String url, String table, String values, String where) {		                
		String xml = null;		
        try {
            DefaultHttpClient httpClient = new DefaultHttpClient();
            HttpPost httpPost = new HttpPost(url);                        
            httpPost.setHeader("MSISDN", Shared.sid);
            
            List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>();
            nameValuePairs.add(new BasicNameValuePair("handle", "web"));	            
            nameValuePairs.add(new BasicNameValuePair("action", "update"));	            	            
            nameValuePairs.add(new BasicNameValuePair("values", values));
            nameValuePairs.add(new BasicNameValuePair("table", table));
            nameValuePairs.add(new BasicNameValuePair("where", where));
            httpPost.setEntity(new UrlEncodedFormEntity(nameValuePairs,"UTF-8"));
            
            httpClient.addResponseInterceptor(new HttpResponseInterceptor() {
                
                @Override
				public void process(
                        final HttpResponse response, 
                        final HttpContext context) throws HttpException, IOException {
                    HttpEntity entity = response.getEntity();
                    Header ceheader = entity.getContentEncoding();
                    if (ceheader != null) {
                        HeaderElement[] codecs = ceheader.getElements();
                        for (int i = 0; i < codecs.length; i++) {
                            if (codecs[i].getName().equalsIgnoreCase("gzip")) {
                                response.setEntity(
                                        new GzipDecompressingEntity(response.getEntity())); 
                                return;
                            }
                        }
                    }
                }
                
            });
            
            HttpResponse httpResponse = httpClient.execute(httpPost);
            HttpEntity httpEntity = httpResponse.getEntity();
            xml = EntityUtils.toString(httpEntity, "UTF-8");      
            
            int size = xml.length();
            if (httpResponse.getStatusLine().getStatusCode() == 401) {
            	xml = "fail";
            } else
            if (size > 0 ) {	            	           
            	
            }
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } catch (ClientProtocolException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
        	e.printStackTrace();
        }
        // return XML
        return xml;        
	}
	
	public String getXmlFromUrl(String url, String func, String values, String where) {
        String xml = null;
        Shared.changed = false;
        try {
            // defaultHttpClient
            DefaultHttpClient httpClient = new DefaultHttpClient();
            HttpPost httpPost = new HttpPost(url);
            httpPost.setHeader("MSISDN", Shared.sid);
            
            List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>();
            nameValuePairs.add(new BasicNameValuePair("handle", "web"));
            nameValuePairs.add(new BasicNameValuePair("func", func));
            nameValuePairs.add(new BasicNameValuePair("action", "select"));
            nameValuePairs.add(new BasicNameValuePair("sort", "_date"));
            nameValuePairs.add(new BasicNameValuePair("dir", "asc"));
            nameValuePairs.add(new BasicNameValuePair("values", values));
            nameValuePairs.add(new BasicNameValuePair("where", where));
            httpPost.setEntity(new UrlEncodedFormEntity(nameValuePairs,"UTF-8"));
            
            httpClient.addResponseInterceptor(new HttpResponseInterceptor() {
                
                @Override
				public void process(
                        final HttpResponse response, 
                        final HttpContext context) throws HttpException, IOException {
                    HttpEntity entity = response.getEntity();
                    Header ceheader = entity.getContentEncoding();
                    if (ceheader != null) {
                        HeaderElement[] codecs = ceheader.getElements();
                        for (int i = 0; i < codecs.length; i++) {
                            if (codecs[i].getName().equalsIgnoreCase("gzip")) {
                                response.setEntity(
                                        new GzipDecompressingEntity(response.getEntity())); 
                                return;
                            }
                        }
                    }
                }
                
            });
            
            HttpResponse httpResponse = httpClient.execute(httpPost);
            HttpEntity httpEntity = httpResponse.getEntity();
            xml = EntityUtils.toString(httpEntity, "UTF-8");    
            Log.d("ddd1111", xml);
            int size = xml.length();            
            if (httpResponse.getStatusLine().getStatusCode() == 401) {
            	xml = "fail";
            	return xml;
            } else
            if (size > 0 ) {	            	           
            	
            }
            Collection list = Shared.sql.selectAll("Bytes", "i", "size", "url='"+url+"'", null);
    		if (list.size() > 0) {
    			Variant w = list.elementAt(0);    			
    			if (w.getInt("size") != size) {
    				w.put("size", ""+size);
    				w.put("url", url);
    				Shared.sql.update("Bytes", w, "url,size", "url='"+url+"'");
    				Shared.changed = true;
    			}
    		} else {
    			Shared.changed = true;
    			Variant w = new Variant();
    			w.put("size", ""+size);
				w.put("url", url);
    			Shared.sql.insertVariant("Bytes", w, "s,i", "url,size");
    		}
    		
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } catch (ClientProtocolException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
        	e.printStackTrace();
        }

        return xml;
    }
	
	public String getXmlFromCompleteUrl(String url, String func, String values, String where) {
        String xml = null;        
        try {        	
            // defaultHttpClient
            DefaultHttpClient httpClient = new DefaultHttpClient();
            HttpPost httpPost = new HttpPost(url);
            httpPost.setHeader("MSISDN", Shared.sid);
            
            List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>();
            nameValuePairs.add(new BasicNameValuePair("handle", "web"));
            nameValuePairs.add(new BasicNameValuePair("func", func));
            nameValuePairs.add(new BasicNameValuePair("action", "sales_me"));
            nameValuePairs.add(new BasicNameValuePair("sort", "_date"));
            nameValuePairs.add(new BasicNameValuePair("dir", "asc"));
            nameValuePairs.add(new BasicNameValuePair("values", values));
            nameValuePairs.add(new BasicNameValuePair("where", where));
            httpPost.setEntity(new UrlEncodedFormEntity(nameValuePairs,"UTF-8"));
            
            httpClient.addResponseInterceptor(new HttpResponseInterceptor() {
                
                @Override
				public void process(
                        final HttpResponse response, 
                        final HttpContext context) throws HttpException, IOException {
                    HttpEntity entity = response.getEntity();
                    Header ceheader = entity.getContentEncoding();
                    if (ceheader != null) {
                        HeaderElement[] codecs = ceheader.getElements();
                        for (int i = 0; i < codecs.length; i++) {
                            if (codecs[i].getName().equalsIgnoreCase("gzip")) {
                                response.setEntity(
                                        new GzipDecompressingEntity(response.getEntity())); 
                                return;
                            }
                        }
                    }
                }
                
            });
            
            HttpResponse httpResponse = httpClient.execute(httpPost);
            HttpEntity httpEntity = httpResponse.getEntity();
            xml = EntityUtils.toString(httpEntity, "UTF-8");                  
            int size = xml.length();            
            if (httpResponse.getStatusLine().getStatusCode() == 401) {
            	xml = "fail";
            	return xml;
            } else
            if (size > 0 ) {	            	           
            	Log.d("d", xml);
            }           
    		
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } catch (ClientProtocolException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
        	e.printStackTrace();
        }

        return xml;
    }
	
	static class GzipDecompressingEntity extends HttpEntityWrapper {

        public GzipDecompressingEntity(final HttpEntity entity) {
            super(entity);
        }
    
        @Override
        public InputStream getContent() throws IOException, IllegalStateException {
            InputStream wrappedin = wrappedEntity.getContent();

            return new GZIPInputStream(wrappedin);
        }

        @Override
        public long getContentLength() {
            return -1;
        }

    } 
	
	public Document getDomElement(String xml){
		if (xml == null) return null;
        Document doc = null;
        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
        try {
 
        		DocumentBuilder db = dbf.newDocumentBuilder();
 
            	InputSource is = new InputSource();            	
                is.setCharacterStream(new StringReader(xml));
                doc = db.parse(is); 
 
            } catch (ParserConfigurationException e) {
                Log.e("Error: ", e.getMessage());
                return null;
            } catch (SAXException e) {
                Log.e("Error: ", e.getMessage());
                return null;
            } catch (IOException e) {
                Log.e("Error: ", e.getMessage());
                return null;
            }
                // return DOM
            return doc;
    }
	
	public String getValue(Element item, String str) {      
	    NodeList n = item.getElementsByTagName(str);        
	    return this.getElementValue(n.item(0));
	}
	 
	public final String getElementValue( Node elem ) {
	         Node child;
	         if( elem != null){
	             if (elem.hasChildNodes()){
	                 for( child = elem.getFirstChild(); child != null; child = child.getNextSibling() ){
	                     if (child.getNodeType() == Node.TEXT_NODE) {
	                         return child.getNodeValue();
	                     }
	                 }
	             }
	         }
	         return "";
	}
	

	private void savePreferences(String key, String value, Context context) {
		SharedPreferences sharedPreferences = PreferenceManager.getDefaultSharedPreferences(context);
		Editor editor = sharedPreferences.edit();
		editor.putString(key, value);
		editor.commit();
	}
	
	private String loadSavedPreferences(Context context, String key) {
        SharedPreferences sharedPreferences = PreferenceManager.getDefaultSharedPreferences(context);        
        String value = sharedPreferences.getString(key, "");
        return value;
	}
	
	public boolean workingTime() {
    	Calendar now = Calendar.getInstance();    
    	int hour = now.get(Calendar.HOUR_OF_DAY);    	
    	return (hour >= 10 && hour < 23);
    }
	
	public Collection getCollection(Context context, String url, String fields, String tag, String func, String values, String where) {		
		String xml = getXmlFromUrl(url, func, values, where);				
		if (xml == null || xml.length() < 10) {
			String pxml = loadSavedPreferences(context, func);
			if (pxml != null && pxml.length() > 10) 
				xml = pxml;			
		} else
			savePreferences(func, xml, context);
		
		Log.d("xml", xml);
		Document doc = getDomElement(xml); // getting DOM element		
		if (doc == null) return new Collection();
		Collection collect = new Collection();
			
		NodeList nl = doc.getElementsByTagName(tag);			
		String[] wh = fields.split(",");

		for (int i = 0; i < nl.getLength(); i++) {
			Element e = (Element) nl.item(i);			 
			Variant w = new Variant();
			for (int j = 0; j < wh.length; j++) {
				w.put(wh[j], getValue(e, wh[j]));					
			}
		    collect.addCollection(w);
		}		
		
		return collect;
	}
}
