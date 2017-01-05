package mxc.app.engine;

import java.util.ArrayList;

import android.content.Context;
import android.os.Parcelable;
import android.support.v4.view.PagerAdapter;
import android.support.v4.view.ViewPager;
import android.view.View;
import android.widget.ListView;

public class PageAdapter extends PagerAdapter {

	private ArrayList<View> views;

	public PageAdapter(Context context) {
		views = new ArrayList<View>();		
	}
	
	public void addPage(View sc) {
		views.add(sc);
	}
	
	public void addPage(ListView sc) {
		views.add(sc);
	}

	@Override
	public void destroyItem(View view, int arg1, Object object) {
		((ViewPager) view).removeView((View) object);
	}

	@Override
	public void finishUpdate(View arg0) {

	}

	@Override
	public int getCount() {
		return views.size();
	}

	@Override
	public Object instantiateItem(View view, int position) {
		View myView = views.get(position);
		((ViewPager) view).addView(myView);
		return myView;
	}

	@Override
	public boolean isViewFromObject(View view, Object object) {
		return view == object;
	}

	@Override
	public void restoreState(Parcelable arg0, ClassLoader arg1) {

	}

	@Override
	public Parcelable saveState() {
		return null;
	}

	@Override
	public void startUpdate(View arg0) {

	}

}
