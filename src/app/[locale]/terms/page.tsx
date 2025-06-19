import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function TermsPage() {
  return (
    <div className='max-w-3xl mx-auto p-6' dir='rtl'>
      <Card className='space-y-4'>
        <CardHeader>
          <CardTitle className='text-2xl'>תקנון ותנאי שימוש</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className='pr-4'>
            <section dir='rtl' className='space-y-4'>
              <h2 className='text-xl font-semibold'>1. כללי</h2>
              <p>
                מסמך זה מגדיר את ההסכמות וההתחייבויות בין SpareBite
                (&quot;האתר&quot;) ובין משתמשיו (&quot;המשתמש&quot; או
                &quot;אתה&quot;). הכניסה והשימוש באתר מותנים בקבלת תקנון זה
                במלואו.
              </p>
              <Separator />
              <h2 className='text-xl font-semibold'>2. תיאור השירות</h2>
              <p>
                SpareBite מאפשר פלטפורמה לשיתוף אוכל בחינם בין אנשים. כל פרסום
                והצעת מזון באתר נעשים על אחריות המשתמש המפרסם.
              </p>
              <Separator />
              <h2 className='text-xl font-semibold'>
                3. הרשאות ואחריות המשתמש
              </h2>
              <ul className='list-disc list-inside space-y-2'>
                <li>
                  על כל משתמש לוודא כי המזון המוצע במצב תקין, עונה לכללי בטיחות
                  המזון המוכרים ברפואה ובחוק.
                </li>
                <li>
                  משתמש מתחייב לא לחלק מוצרי מזון שפג תוקפם, מזון מסוכן או מזון
                  שעלול לגרום נזק.
                </li>
                <li>
                  המשתמש מגן על SpareBite מכל תביעה הנובעת ממזון שהועבר באמצעות
                  האתר.
                </li>
              </ul>
              <Separator />
              <h2 className='text-xl font-semibold'>
                4. חובת עמידה בחוק עידוד תרומות מזון
              </h2>
              <p>
                לפי חוק עידוד תרומות מזון תשמ&quot;א–1981, תרומות מזון למטרות
                הומניטריות נהנות מהגנות והטבות מסוימות. משתמשי האתר מצהירים כי
                ידועים להם תנאי החוק ושיחולו עליהם הגנותיו.
              </p>
              <Separator />
              <h2 className='text-xl font-semibold'>5. זכויות קניין רוחני</h2>
              <p>
                תוכן האתר הוא רכוש SpareBite או של צדדים שלישיים שהעניקו רישוי.
                אין להעתיק או להפיץ ללא אישור.
              </p>
              <Separator />
              <h2 className='text-xl font-semibold'>6. הגבלת אחריות</h2>
              <p>
                האתר מסופק &quot;כפי שהוא&quot;. SpareBite לא תהיה אחראית לכל
                נזק ישיר או עקיף הנובע מהשימוש באתר.
              </p>
              <Separator />
              <h2 className='text-xl font-semibold'>7. סיום והשעיה</h2>
              <p>
                SpareBite רשאית לשלול הרשאות או להשעות משתמש העובר את התקנון.
                פריטים ומשתמשים שמוחקו נשמרים לצרכי סטטיסטיקה במחיקה רכה.
              </p>
              <Separator />
              <h2 className='text-xl font-semibold'>8. שינויים בתקנון</h2>
              <p>
                עדכונים יפורסמו באתר ובדוא&quot;ל; המשך השימוש יהווה הסכמה
                לתקנון המעודכן.
              </p>
              <Separator />
              <p>עודכן בתאריך 19.6.25</p>
            </section>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
