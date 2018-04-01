

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

/**
 * Created by ashiralam on 11/28/17.
 */

public class HistoricalFragment extends Fragment {
    static String symb;
    View view;
    public static HistoricalFragment newInstance(String pageName, String symbol) {
        HistoricalFragment fragmentFirst = new HistoricalFragment();
        

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_compass);
    }
}
setContentView(R.layout.activity_survey_questions2);
        Utils.sharedPreferences = getSharedPreferences(Utils.PREF_NAME, MODE_PRIVATE);
        next2 = (Button) findViewById(R.id.next2);

        gender_male = (RadioButton) findViewById(R.id.gender_male);
        gender_female = (RadioButton) findViewById(R.id.gender_female);
        gender_na = (RadioButton) findViewById(R.id.gender_na);

        next2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (gender_male.isChecked() || gender_female.isChecked() || gender_na.isChecked()) {
                    Intent i = new Intent(surveyQuestions_2.this, surveyQuestions_3.class);
                    startActivity(i);
                }
            }
        });


    }