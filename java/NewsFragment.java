package com.cs571hw9.stockapp;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;

/**
 * Created by ashiralam on 11/28/17.
 */

public class NewsFragment extends Fragment {

    Context context;
    JSONArray newsList = null;
    NewsRecyclerAdapter newsRecyclerAdapter;
    static String symb;
    View view;

    public static NewsFragment newInstance(String pageName, String symbol, Context ctx) {
        NewsFragment fragmentFirst = new NewsFragment();
        fragmentFirst.setContext(ctx);
        Bundle args = new Bundle();
        args.putString("pageName", pageName);
        args.putString("someTitle", symbol);
        fragmentFirst.setArguments(args);
        symb = symbol;
        return fragmentFirst;
    }

    public void setContext(Context context) {
        this.context = context;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {

         view = inflater.inflate(R.layout.fragment_news, container, false);

        final RecyclerView recyclerView = view.findViewById(R.id.newsRecyclerView);

        newsRecyclerAdapter = new NewsRecyclerAdapter();
        recyclerView.setAdapter(newsRecyclerAdapter);
        fetchNews();


        return view;
    }

    public void fetchNews(){
        String url = "http://nodejsashir.us-east-2.elasticbeanstalk.com/12?symbol=" + symb;
        Log.e("NEWS", "Fetching news: " + url);
        JsonArrayRequest jsonArrayRequest = new JsonArrayRequest(Request.Method.GET, url, null, new Response.Listener<JSONArray>() {
            @Override
            public void onResponse(JSONArray response) {

                view.findViewById(R.id.newsRecyclerView).setVisibility(View.VISIBLE);
                view.findViewById(R.id.newsProgress).setVisibility(View.GONE);
                newsRecyclerAdapter.newsList = response;
                newsRecyclerAdapter.notifyDataSetChanged();

                Log.e("News Success", response.toString());
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.e("News", "Error: " + error.getLocalizedMessage());

                view.findViewById(R.id.errorNews).setVisibility(View.VISIBLE);
                view.findViewById(R.id.newsProgress).setVisibility(View.GONE);
            }
        });
        RequestQueue requestQueue = Volley.newRequestQueue(context);
        requestQueue.add(jsonArrayRequest);
    }


    public class NewsRecyclerAdapter extends RecyclerView.Adapter<NewsRecyclerAdapter.ViewHolder> {

        JSONArray newsList;




        @Override
        public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {

            View itemView = LayoutInflater.from(parent.getContext()).inflate(R.layout.news_list_item, parent, false);
            return new ViewHolder(itemView);
        }

        @Override
        public void onBindViewHolder(ViewHolder holder, final int position) {
            try {
                holder.headingTextView.setText(newsList.getJSONObject(position).optString("title"));
                holder.authorTextView.setText("Author: "+newsList.getJSONObject(position).optString("name"));
                holder.dateTextView.setText("Date: "+newsList.getJSONObject(position).optString("pubdate"));

                holder.containerLL.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        try {
                            Uri uriUrl = Uri.parse(newsList.getJSONObject(position).optString("hl"));

                            Intent intent = new Intent();
                            intent.setAction(Intent.ACTION_VIEW);
                            intent.addCategory(Intent.CATEGORY_BROWSABLE);
                            intent.setData(uriUrl);
                            startActivity(intent);
                            Log.e("NEWS", "Clicked on link");

                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                });

            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

        @Override
        public int getItemCount() {

            if(newsList==null){
                return 0;
            }
            else if(newsList.length()>5) {
                Log.e("NEWS", "NewsLength:" + newsList.length());
                return 5;
            }
            else {
                Log.e("NEWS", "NewsLength:" + newsList.length());
                return newsList.length();
            }
        }

        // Provide a direct reference to each of the views within a data item
        // Used to cache the views within the item layout for fast access
        public class ViewHolder extends RecyclerView.ViewHolder {
            // Your holder should contain a member variable
            // for any view that will be set as you render a row
            public TextView headingTextView;
            public TextView dateTextView;
            public TextView authorTextView;
            public LinearLayout containerLL;
            // We also create a constructor that accepts the entire item row
            // and does the view lookups to find each subview
            public ViewHolder(View itemView) {
                // Stores the itemView in a public final member variable that can be used
                // to access the context from any ViewHolder instance.
                super(itemView);
                headingTextView = (TextView) itemView.findViewById(R.id.heading);
                authorTextView = (TextView) itemView.findViewById(R.id.author);
                dateTextView = (TextView) itemView.findViewById(R.id.date);
                containerLL = itemView.findViewById(R.id.containerLL);
            }
        }
    }


}
