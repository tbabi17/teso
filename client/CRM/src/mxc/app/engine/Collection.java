package mxc.app.engine;

import java.util.ArrayList;
import java.util.LinkedList;

public class Collection {
	ArrayList<Variant> collection;
	
	public Collection() {
		collection = new ArrayList<Variant>();
	}
	
	public ArrayList<Variant> getCollection() {
		return collection;		
	}
	
	public int size() {
		return collection.size();
	}
	
	public void removeAt(int i) {
		collection.remove(i);
	}
	
	public void removeCollection(String key, String value) {
		for (int i = 0; i < collection.size(); i++) {
			Variant v = collection.get(i);
			if (v.get(key).equals(value))
				collection.remove(i);
		}				
	}
	
	public void removeCollection(String key, String value, String key1, String value1) {
		for (int i = 0; i < collection.size(); i++) {
			Variant v = collection.get(i);
			if (v.get(key).equals(value) && v.get(key1).equals(value1))
				collection.remove(i);
		}				
	}
	
	public void addCollection(Variant v) {
		collection.add(v);
	}
	
	public void addCollection(int index, Variant v) {
		collection.add(index, v);
	}
	
	public Variant elementAt(int t) {
		if (t < collection.size())
			return collection.get(t);
		
		return new Variant();
	}
	
	public Variant lastElement() {
		if (collection.size() > 0) 
			return collection.get(collection.size()-1);
		
		return new Variant();
	}
	
	public void setElementAt(int t, Variant v) {
		collection.set(t, v);
	}
	
	public String[] toArray(String key) {
		String[] array = new String[collection.size()];
		for (int i = 0; i < array.length; i++)
			array[i] = collection.get(i).get(key);
		
		return array;
	}		
	
	public String toString(String key) {
		String array = ",";
		for (int i = 0; i < collection.size(); i++)
			array += collection.get(i).get(key)+",";
		
		return array;
	}
	
	public Collection toCollection(String key, String value) {
		Collection array = new Collection();
		for (int i = 0; i < collection.size(); i++)
			if (collection.get(i).get(key).equals(value))
				array.addCollection(collection.get(i));
		
		return array;
	}		
	
	public Variant query(String key, String key_find) {		
		for (int i = 0; i < collection.size(); i++) {
			Variant v = collection.get(i);
			if (v.get(key).equals(key_find))
				return v;
		}
		
		return new Variant();
	}
	
	public Variant queryInt(String key, int key_find) {		
		for (int i = 0; i < collection.size(); i++) {
			Variant v = collection.get(i);
			if (v.getInt(key) == key_find) {
				v.put("index", "i"+i);
				return v;
			}
		}
		
		return new Variant();
	}
		
	public boolean queryIntHave(String key, int key_find) {		
		for (int i = 0; i < collection.size(); i++) {
			Variant v = collection.get(i);
			if (v.getInt(key) == key_find) {
				v.put("index", "i"+i);
				return true;
			}
		}
		
		return false;
	}
	
	public boolean queryHave(String key, String key_find) {		
		for (int i = 0; i < collection.size(); i++) {
			Variant v = collection.get(i);
			if (v.get(key).equals(key_find))
				return true;
		}
		
		return false;
	}
	
	public Variant query(String key, String key_find, String key1, int key_find1) {		
		for (int i = 0; i < collection.size(); i++) {
			Variant v = collection.get(i);
			if (v.get(key).equals(key_find) && v.getInt(key1) == key_find1)
				return v;
		}
		
		return new Variant();
	}
	
	public Variant queryHave(String key, String key_find, String key1, int key_find1) {		
		for (int i = 0; i < collection.size(); i++) {
			Variant v = collection.get(i);
			if (v.getString(key).equals(key_find) && v.getInt(key1) == key_find1)
				return v;
		}
		
		return null;
	}
	
	public LinkedList<Variant> queryList(String key, String key_find) {
		LinkedList<Variant> list = new LinkedList<Variant>();
		for (int i = 0; i < collection.size(); i++) {
			Variant v = collection.get(i);
			if (v.get(key).equals(key_find))
				list.add(v);
		}
		
		return list;
	}
}
