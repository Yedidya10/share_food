import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

export default function PrivacyPage() {
  return (
    <div
      className="max-w-3xl mx-auto p-6"
      dir="rtl"
    >
      <Card className="space-y-4">
        <CardHeader>
          <CardTitle className="text-2xl">מדיניות פרטיות</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="pr-4">
            <section
              dir="rtl"
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold">1. המידע שאנו אוספים</h2>
              <ul className="list-disc list-inside">
                <li>מידע אישי: שם, דוא&quot;ל, טלפון (אם סופק).</li>
                <li>מידע שימושי: היסטוריית פרסומים, בקשות ושיתופי מזון.</li>
                <li>מידע טכני: IP, סוג דפדפן, נתוני שימוש.</li>
              </ul>
              <Separator />
              <h2 className="text-xl font-semibold">2. מטרות העיבוד</h2>
              <p>ניהול חשבון, דיוור התראות, מחקר פנימי ושיפור השירות.</p>
              <Separator />
              <h2 className="text-xl font-semibold">3. בסיס החוק והסכמה</h2>
              <p>עיבוד מבוסס הסכמה ובהתאם לחוק עידוד תרומות מזון.</p>
              <Separator />
              <h2 className="text-xl font-semibold">4. שיתוף עם צד ג&apos;</h2>
              <p>Supabase ושירותי אימות ודיוור. אין העברת נתונים ללא הסכמה.</p>
              <Separator />
              <h2 className="text-xl font-semibold">5. שמירת נתונים</h2>
              <p>
                פריטים ומשתמשים עוברים soft delete ב־Supabase
                (`shouldSoftDelete: true`) לצרכי סטטיסטיקה, עד 5 שנים.
              </p>
              <Separator />
              <h2 className="text-xl font-semibold">6. אבטחת מידע</h2>
              <p>אמצעים פיזיים, טכניים וארגוניים להגנה על המידע.</p>
              <Separator />
              <h2 className="text-xl font-semibold">7. זכויות המשתמש</h2>
              <p>זכות גישה, תיקון, מחיקה וביטול הסכמה לעיבוד שיווקי.</p>
              <Separator />
              <h2 className="text-xl font-semibold">8. עדכונים במדיניות</h2>
              <p>שינויים יתפרסמו באתר ובדוא&quot;ל; המשך השימוש יהווה הסכמה.</p>
              <Separator />
              <p>עודכן בתאריך 19.6.25</p>
            </section>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
