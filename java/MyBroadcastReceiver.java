

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.support.v4.content.WakefulBroadcastReceiver;

public class MyBroadcastReceiver extends WakefulBroadcastReceiver {
    public MyBroadcastReceiver() {
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        // TODO: This method is called when the BroadcastReceiver is receiving
        // an Intent broadcast.
        Intent startServiceIntent = new Intent(context, Core_Function.class);
        //context.startService(startServiceIntent);
        startWakefulService(context, startServiceIntent);
    }
}
