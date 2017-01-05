package mxc.app.engine;

import java.util.List;

import android.content.Context;
import android.graphics.Typeface;

public class Shared {
	public static int hamtlag = 2;
	public static List<String> w;
	public static Typeface[] tf;
	public static String current = "", day = "", night = "";
	public static SQLManager sql;	   
    public static boolean changed = false;
    public static boolean FRONT_SALE = false;    
	public static String url = "http://10.0.0.250/";
	public static String sid = "";
	public static int batteryLevel = 0;
	public static double currentLat = 100, currentLng = 100;	
	
	public static void init(Context context) {
		if (sql == null) {
			sql = new SQLManager(context);
			
		}
		
		tf = new Typeface[3];
		tf[2] = Typeface.createFromAsset(context.getAssets(), "font.ttf");
	}

	public static String convertToLatin(String string) {
    	if (string.indexOf('|') != -1) string = string.substring(0, string.indexOf('|'));
    	String [] array = new String[10000];
    	array['а'] = "a";array['й'] = "i";array['т'] = "t";array['я'] = "ya";
    	array['б'] = "b";array['к'] = "k";array['у'] = "u";
    	array['в'] = "v";array['л'] = "l";array['ү'] = "u";
    	array['г'] = "g";array['м'] = "m";array['ф'] = "f";
    	array['д'] = "d";array['н'] = "n";array['ц'] = "ts";
    	array['е'] = "e";array['о'] = "o";array['ч'] = "ch";
    	array['ё'] = "yo";array['ө'] = "u";array['х'] = "x";
    	array['з'] = "z";array['п'] = "p";array['ш'] = "sh";
    	array['ж'] = "j";array['р'] = "r";array['э'] = "e";
    	array['и'] = "i";array['с'] = "s";array['ю'] = "yu"; array['ь'] = "";
    	
    	array['А'] = "A";array['Й'] = "I";array['Т'] = "T";array['Я'] = "Ya";
    	array['Б'] = "B";array['К'] = "K";array['У'] = "U";
    	array['В'] = "V";array['Л'] = "L";array['Ү'] = "U";
    	array['Г'] = "G";array['М'] = "M";array['Ф'] = "F";
    	array['Д'] = "D";array['Н'] = "N";array['Ц'] = "Ts";
    	array['Е'] = "E";array['О'] = "O";array['Ч'] = "Ch";
    	array['Ё'] = "Yo";array['Ө'] = "U";array['Х'] = "X";
    	array['З'] = "Z";array['П'] = "P";array['Ш'] = "Sh";
    	array['Ж'] = "J";array['Р'] = "R";array['Э'] = "E";
    	array['И'] = "I";array['С'] = "S";array['Ю'] = "Yu";
    	
    	String result = "";
    	for (int i = 0; i < string.length(); i++) {
    		if (array[string.charAt(i)] != null)
    			result += array[string.charAt(i)];
    		else
    			result += string.charAt(i);
    	}
    	
    	return result;
    }
}
