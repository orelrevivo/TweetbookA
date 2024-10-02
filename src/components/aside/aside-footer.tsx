import { useState, useEffect } from 'react';
import { Modal } from '@components/modal/modal'; // Assuming you have a modal component
import { Button } from '@components/ui/button'; // Assuming you have a Button component
import { doc, setDoc, getDoc } from 'firebase/firestore';
import type { MouseEvent } from 'react';
import { useWindow } from '@lib/context/window-context';
import { More } from '../sidebar/More';
import { useRouter } from 'next/router';


// Define translations for multiple languages
const translations = {
  en: {
    footerLinks: [
      // ['Terms of Service', `
      //   Summary of our terms
      //   Terms of Service: These govern the use of tweetbook, forming a legal contract.
      //   Advertising: tweetbook and partners may display ads as part of accessing services.
      //   Content Usage: Users must comply with the User Agreement and applicable laws.
      //   Acceptable Use: Services must be accessed via provided interfaces; scraping is prohibited.
      //   Enforcement: tweetbook can enforce terms by removing content, limiting access, or legal action.
      //   Intellectual Property: Users retain ownership of content but grant broad rights; use of tweetbook software is licensed.
      //   Risk Disclaimer: Services are provided "AS IS"; tweetbook disclaims warranties and liabilities.
      //   Remedies: Users can terminate their agreement; tweetbook limits liability for damages.
      //   Privacy Policy: Terms include a Privacy Policy and other applicable terms.
      //   Age Requirement: Users must be at least 13 years old to use tweetbook.
      //   Liability Limitation: tweetbook's liability is capped at $100 USD or recent service fees.
      //   Copyright Protection: Procedures for reporting copyright infringement are outlined in the terms.
      // `],
      ['Privacy Policy', `
        Details about our privacy policy.
        It's really hard to make everyone happy with a Privacy Policy. Most people who use tweetbook want something short and easy to understand. While we wish we could fit everything you need to know into a post, our regulators ask us to meet our legal obligations by describing them all in a lot of detail.

        With that in mind, we've written our Privacy Policy as simply as possible to empower you to make informed decisions when you use tweetbook by making sure you understand and have control over the information we collect, how it's used, and when it's shared.

        So if you skip reading every word of the Privacy Policy, at least know this:
      `],
      ['Cookie Policy', `
        Details about our cookie policy.
        Cookies and similar technologies like pixels and local storage provide you with a better, faster, and safer experience on tweetbook. Cookies are also used to operate our services, which include our websites, applications, APIs, pixels, embeds, and email communications. Specifically, tweetbook uses these technologies to:

        Keep you logged in to tweetbook.
        Deliver features and functionality of tweetbook services.
        Save and honor your preferences.
        Personalize the content you see.
        Protect you against spam and abuse.
        Show you more relevant ads.
        Provide subscription features and distribute certain content.
        Understand how you interact with our services and where we can improve.
        Measure the effectiveness of our advertising and marketing.
        Rate how our services perform and identify bugs and other quality issues.
        Gather data used to operate our business — from measuring our audience size to enforcing the tweetbook Rules.
      `],
      ['Accessibility', `
        Information about accessibility options.
        Here at tweetbook, our mission is to give everyone the power to create and share ideas and information instantly without barriers, including people with disabilities. We have a dedicated group of cross-functional inclusive designers and engineers, with and without lived experience of disability, focused on providing the best experience regardless of device, platform, or disability by incorporating established guidelines and best practices.

        Accessibility features
        While we know that our work never stops, here are just some of the ways we have worked towards improving the accessibility of tweetbook for various disabilities.
        Visual

        Screen reader and refreshable braille display support
        Font size and high contrast settings
        Dark mode support, with themes for dim or lights out
        Auditory

        Auto-caption support for videos, tweetbook Spaces, and voice posts
        Upload caption files (SRT) for videos posted via posts on the web
        Turn on sounds
        Mobility

        Keyboard shortcuts
        Switch device, Voice Control (iOS), and Voice Access (Android) support
        Custom Magic Tap shortcuts (iOS)
        Cognitive

        Reduce motion/animation settings
        Prevent video autoplay
        Turn off sounds
        For more information on accessibility features, see Accessibility features of tweetbook.
      `],
      ['Ads Info', `
        Overview: tweetbook Ads aim to show you relevant and useful advertisements. They include Promoted Ads, Follower Ads, and Trend Takeover, clearly labeled as "Ad".

        Personalization: Ads are tailored based on your tweetbook activity, profile information, location data, and interactions with content and accounts. This customization helps show you ads aligned with your interests.

        Data Usage: tweetbook uses hashed email addresses, mobile identifiers, and browser information to personalize ads. This includes displaying promotions from websites or newsletters you engage with.

        Privacy Controls: You can manage ad personalization settings through tweetbook settings or opt-out tools like the Digital Advertising Alliance's consumer choice tool and device-specific settings (iOS and Android).

        Third-Party Partners: tweetbook collaborates with third-party advertisers like Google. Privacy options for tweetbook's ads do not extend to ads served by these partners off of tweetbook.

        Additional Options: iOS users (version 14 and later) can disable iOS Identifier for Advertising requests. Dismissing unwanted Promoted Ads provides feedback to improve ad relevance.
      `],
      // ['learn more language', `
      //  When you change your language right now, it changes it only with the existing models in these squares that you are currently seeing; later you will also see them in the whole application!
      // `]
    ]
  },
  he: {
    footerLinks: [
      ['Terms of Service', `
        סיכום התנאים שלנו
        תנאי השימוש: אלה מסדירים את השימוש בטוויטבוק, ומקנים חוזה חוקי.
        פרסום: טוויטבוק ושותפיה עשויים להציג פרסומות כחלק מהשימוש בשירותים.
        שימוש בתוכן: על המשתמשים לציית להסכם המשתמש ולחוקי המדינה.
        שימוש מקובל: יש לגשת לשירותים באמצעות ממשקים שניתנים; סקרייפינג אסור.
        אכיפה: טוויטבוק יכולה לאכוף את התנאים על ידי הסרת תוכן, הגבלת גישה, או פעולה משפטית.
        קניין רוחני: למשתמשים יש בעלות על התוכן אך מוענקים זכויות רחבות; השימוש בתוכנה של טוויטבוק הוא ברישיון.
        אחריות סיכון: השירותים ניתנים "כפי שהם"; טוויטבוק מנתקת אחריות ואחריות.
        תרופות: למשתמשים יש את האפשרות להפסיק את ההסכם; טוויטבוק מגבילה את האחריות לנזקים.
        מדיניות פרטיות: התנאים כוללים מדיניות פרטיות ותנאים נוספים.
        דרישת גיל: המשתמשים חייבים להיות בני 13 לפחות כדי להשתמש בטוויטבוק.
        הגבלת אחריות: אחריות טוויטבוק מוגבלת ל-100 דולר אמריקאי או דמי שירות אחרונים.
        הגנה על זכויות יוצרים: נהלים לדיווח על הפרת זכויות יוצרים מפורטים בתנאים.
      `],
      ['Privacy Policy', `
        פרטים על מדיניות הפרטיות שלנו.
        קשה מאוד לרצות את כולם עם מדיניות פרטיות. רוב האנשים המשתמשים בטוויטבוק רוצים משהו קצר וקל להבנה. בעוד שאנחנו מקווים שנוכל להכניס הכל לפוסט, הרגולטורים שלנו מבקשים מאיתנו לעמוד בהתחייבויות החוקיות שלנו על ידי תיאור כל הפרטים בפירוט.

        על כן, כתבנו את מדיניות הפרטיות שלנו בצורה פשוטה ככל האפשר כדי לאפשר לך לקבל החלטות מודעות כשאתה משתמש בטוויטבוק ולוודא שאתה מבין ומבקר את המידע שאנו אוספים, כיצד הוא משמש, ומתי הוא משתף.

        אז אם אתה מדלג על כל מילה של מדיניות הפרטיות, לפחות דע את זה:
      `],
      ['Cookie Policy', `
        פרטים על מדיניות העוגיות שלנו.
        עוגיות וטכנולוגיות דומות כמו פיקסלים ואחסון מקומי מספקות לך חוויה טובה, מהירה ובטוחה יותר בטוויטבוק. עוגיות משמשות גם לתפעול השירותים שלנו, הכוללים את האתרים, היישומים, ה-APIs, הפיקסלים, ההטמעות, ותקשורות דוא"ל. במיוחד, טוויטבוק משתמשת בטכנולוגיות אלו כדי:

        לשמור אותך מחובר לטוויטבוק.
        לספק תכונות ופונקציות של שירותי טוויטבוק.
        לשמור ולכבד את ההעדפות שלך.
        להתאים את התוכן שאתה רואה.
        להגן עליך מפני ספאם וניצול לרעה.
        להראות לך פרסומות רלוונטיות יותר.
        לספק תכונות מנוי ולפרסם תוכן מסוים.
        להבין כיצד אתה מקיים אינטראקציה עם השירותים שלנו ואיפה נוכל לשפר.
        למדוד את האפקטיביות של הפרסום והשיווק שלנו.
        לדרג את ביצועי השירותים שלנו ולזהות תקלות בעיות איכות אחרות.
        לאסוף נתונים לשם תפעול העסק שלנו — החל ממדידת גודל הקהל שלנו ועד אכיפת כללי טוויטבוק.
      `],
      ['Accessibility', `
        מידע על אפשרויות הנגישות.
        כאן בטוויטבוק, המשימה שלנו היא לתת לכל אחד את הכוח ליצור ולשתף רעיונות ומידע מיידית ללא חסמים, כולל אנשים עם מוגבלויות. יש לנו קבוצת מעצבים ומהנדסים רב-תחומיים ומכלול חוויות של מוגבלות, המתמקדים במתן החוויה הטובה ביותר ללא קשר למכשיר, פלטפורמה, או מוגבלות על ידי שילוב של הנחיות וטכניקות מומלצות.

        תכונות נגישות
        בעוד שאנו יודעים שהעבודה שלנו לא נגמרת, הנה רק חלק מהדרכים בהן עבדנו לשפר את הנגישות של טוויטבוק עבור מוגבלויות שונות.
        חזותי

        תמיכה בקוראי מסך ותצוגת ברייל מתחדשת
        הגדרת גודל פונט והתאמת קונטרסט גבוה
        תמיכה במצב כהה, עם ערכות נושא למצב דימור או כיבוי אור
        שמיעתי

        תמיכה בכיתוב אוטומטי עבור סרטונים, שטחי טוויטבוק, ופוסטים קוליים
        העלאת קבצי כיתוב (SRT) עבור סרטונים המועלים דרך הפוסטים באינטרנט
        הפעלת צלילים
        ניידות

        קיצורי מקשים
        תמיכה בהחלפת מכשירים, שליטה קולית (iOS), וגישה קולית (אנדרואיד)
        קיצורי Magic Tap מותאמים אישית (iOS)
        קוגניטיבי

        הגדרות הפחתת תנועה/אנימציה
        מניעת הפעלת סרטונים אוטומטית
        כיבוי צלילים
        למידע נוסף על תכונות נגישות, ראה תכונות נגישות של טוויטבוק.
      `],
      ['Ads Info', `
        סקירה: פרסומות טוויטבוק מיועדות להראות לך פרסומות רלוונטיות ושימושיות. הן כוללות פרסומות מקודמות, פרסומות עוקבות, וטרנד takeover, המסומנות בבירור כ"מודעה".

        התאמה אישית: הפרסומות מותאמות בהתאם לפעילות שלך בטוויטבוק, מידע פרופיל, נתוני מיקום, ואינטראקציות עם תוכן וחשבונות. התאמה זו מסייעת להראות לך פרסומות התואמות את תחומי העניין שלך.

        שימוש בנתונים: טוויטבוק משתמשת בכתובת דוא"ל מוצפנת, מזהים ניידים, ומידע על דפדפן כדי להתאים אישית את הפרסומות. זה כולל הצגת קידומים מאתרים או ניוזלטרים שאתה מתעניין בהם.

        בקרות פרטיות: תוכל לנהל את הגדרות ההתאמה האישית של הפרסומות דרך הגדרות טוויטבוק או כלי ההשבתה כמו כלי הבחירה של הברית הדיגיטלית לפרסום והגדרות מכשירים (iOS ואנדרואיד).

        שותפים של צד שלישי: טוויטבוק משתפת פעולה עם מפרסמים צד שלישי כמו גוגל. אפשרויות הפרטיות עבור פרסומות טוויטבוק אינן מתפרשות על פרסומות המוצגות על ידי שותפים אלה מחוץ לטוויטבוק.

        אפשרויות נוספות: משתמשי iOS (גרסה 14 ומעלה) יכולים להשבית בקשות מזהה פרסום של iOS. דחיית פרסומות מקודמות לא רצויות מספקת משוב לשיפור רלוונטיות הפרסומות.
      `],
      ['learn more language', `
      כאשר אתה משנה את השפה שלך עכשיו, זה משנה אותה רק עם הדגמים הקיימים בריבועים שאתה רואה כרגע; מאוחר יותר תראה אותם גם בכל האפליקציה!
      `]
    ]
  },
  zh: {
    footerLinks: [
      ['Terms of Service', `
        我们的条款总结
        服务条款：这些条款管理您对 tweetbook 的使用，形成法律合同。
        广告：tweetbook 和合作伙伴可能会在访问服务时展示广告。
        内容使用：用户必须遵守用户协议和适用法律。
        可接受使用：必须通过提供的接口访问服务；禁止抓取。
        执法：tweetbook 可以通过删除内容、限制访问或采取法律行动来执行条款。
        知识产权：用户保留内容的所有权，但授予广泛的权利；使用 tweetbook 软件是许可的。
        风险免责声明：服务按“原样”提供；tweetbook 免责声明和责任。
        补救措施：用户可以终止其协议；tweetbook 限制对损害的责任。
        隐私政策：条款包括隐私政策和其他适用条款。
        年龄要求：用户必须年满 13 岁才能使用 tweetbook。
        责任限制：tweetbook 的责任限制为 100 美元或最近的服务费用。
        版权保护：条款中概述了报告版权侵犯的程序。
      `],
      ['Privacy Policy', `
        关于我们的隐私政策的详细信息。
        满足每个人的隐私政策很难。大多数使用 tweetbook 的人希望有简短且易于理解的内容。虽然我们希望能够将所有信息放在一篇帖子中，但我们的监管机构要求我们通过详细描述所有细节来满足法律义务。

        鉴于此，我们尽可能简单地编写了隐私政策，以帮助您在使用 tweetbook 时做出明智的决策，确保您了解并控制我们收集的信息、如何使用这些信息以及何时共享。

        所以，即使你跳过了隐私政策中的每一个字，也至少要知道这一点：
      `],
      ['Cookie Policy', `
        关于我们的 Cookie 政策的详细信息。
        Cookie 和类似的技术（如像素和本地存储）为您提供更好、更快、更安全的 tweetbook 体验。Cookie 也用于操作我们的服务，包括我们的网站、应用程序、API、像素、嵌入和电子邮件通信。特别是，tweetbook 使用这些技术来：

        保持您登录 tweetbook。
        提供 tweetbook 服务的功能和特性。
        保存并尊重您的首选项。
        个性化您看到的内容。
        保护您免受垃圾邮件和滥用。
        向您展示更相关的广告。
        提供订阅功能和分发某些内容。
        了解您如何与我们的服务互动以及我们可以在哪里改进。
        测量我们的广告和营销的有效性。
        评估我们的服务表现并识别错误和其他质量问题。
        收集用于运营业务的数据 — 从测量受众规模到执行 tweetbook 规则。
      `],
      ['Accessibility', `
        关于无障碍选项的信息。
        在 tweetbook，我们的使命是让每个人都有能力快速创建和分享创意和信息，不受障碍，包括残疾人士。我们有一个专注于提供最佳体验的跨职能包容性设计师和工程师团队，无论设备、平台或残疾，通过整合已建立的指南和最佳实践。

        无障碍功能
        虽然我们知道我们的工作永远不会停止，但以下是我们为各种残疾改进 tweetbook 无障碍性的方式之一。
        视觉

        支持屏幕阅读器和可刷新的盲文显示
        字体大小和高对比度设置
        支持黑暗模式，提供暗光或完全黑暗的主题
        听觉

        视频、tweetbook Spaces 和语音帖子支持自动字幕
        上传字幕文件（SRT）用于通过 Web 发布的帖子中的视频
        启用声音
        移动性

        键盘快捷键
        支持切换设备、语音控制（iOS）和语音访问（Android）
        自定义 Magic Tap 快捷键（iOS）
        认知

        减少运动/动画设置
        防止视频自动播放
        关闭声音
        有关无障碍功能的更多信息，请参见 tweetbook 的无障碍功能。
      `],
      ['Ads Info', `
        概述：tweetbook 广告旨在向您展示相关和有用的广告。包括推广广告、关注者广告和趋势接管广告，明确标记为“广告”。

        个性化：广告根据您的 tweetbook 活动、个人资料信息、位置数据以及与内容和帐户的互动进行定制。这种定制帮助展示与您的兴趣相关的广告。

        数据使用：tweetbook 使用加密的电子邮件地址、移动标识符和浏览器信息来个性化广告。这包括展示您与之互动的网站或新闻通讯的推广。

        隐私控制：您可以通过 tweetbook 设置或选择退出工具（如数字广告联盟的消费者选择工具和设备特定设置（iOS 和 Android））管理广告个性化设置。

        第三方合作伙伴：tweetbook 与第三方广告商（如 Google）合作。tweetbook 的广告隐私选项不适用于这些合作伙伴在 tweetbook 之外展示的广告。

        附加选项：iOS 用户（版本 14 及更高版本）可以禁用 iOS 广告标识符请求。关闭不需要的推广广告可提供反馈，以提高广告相关性。
      `],
      ['learn more language', `
        当你现在更改语言时，它只会改变当前在这些方块中看到的现有模型; 以后你也会在整个应用程序中看到它们！
      `]
    ]
  },
  ar: {
    footerLinks: [
      ['Terms of Service', `
        ملخص شروطنا
        شروط الخدمة: هذه تحكم استخدامك لـ tweetbook، مما يشكل عقدًا قانونيًا.
        الإعلان: قد تعرض tweetbook وشركاؤها الإعلانات كجزء من الوصول إلى الخدمات.
        استخدام المحتوى: يجب على المستخدمين الامتثال لاتفاقية المستخدم والقوانين المعمول بها.
        الاستخدام المقبول: يجب الوصول إلى الخدمات عبر الواجهات المقدمة؛ الحفر ممنوع.
        التنفيذ: يمكن لـ tweetbook تنفيذ الشروط عن طريق إزالة المحتوى، وتقييد الوصول، أو اتخاذ إجراءات قانونية.
        الملكية الفكرية: يحتفظ المستخدمون بملكية المحتوى لكنهم يمنحون حقوقًا واسعة؛ استخدام برنامج tweetbook مرخص.
        إخلاء المسؤولية من المخاطر: يتم تقديم الخدمات "كما هي"؛ تتنصل tweetbook من الضمانات والمسؤوليات.
        التعويضات: يمكن للمستخدمين إنهاء اتفاقهم؛ تقيد tweetbook مسؤوليتها عن الأضرار.
        سياسة الخصوصية: تشمل الشروط سياسة الخصوصية وشروط أخرى قابلة للتطبيق.
        متطلبات العمر: يجب أن يكون عمر المستخدمين 13 عامًا على الأقل لاستخدام tweetbook.
        تحديد المسؤولية: مسؤولية tweetbook محدودة بـ 100 دولار أمريكي أو أحدث رسوم خدمة.
        حماية حقوق الطبع والنشر: الإجراءات الخاصة بالإبلاغ عن انتهاك حقوق الطبع والنشر موضحة في الشروط.
      `],
      ['Privacy Policy', `
        تفاصيل حول سياسة الخصوصية لدينا.
        من الصعب جدًا إرضاء الجميع بسياسة الخصوصية. يريد معظم الأشخاص الذين يستخدمون tweetbook شيئًا قصيرًا وسهل الفهم. بينما نتمنى أن نتمكن من وضع كل شيء في منشور واحد، يطلب منا المنظمون الوفاء بالتزاماتنا القانونية من خلال وصفها جميعًا بتفصيل كبير.

        مع وضع ذلك في الاعتبار، قمنا بكتابة سياسة الخصوصية الخاصة بنا ببساطة قدر الإمكان لتمكينك من اتخاذ قرارات مستنيرة عند استخدامك لـ tweetbook من خلال التأكد من أنك تفهم وتتحكم في المعلومات التي نقوم بجمعها، وكيفية استخدامها، ومتى يتم مشاركتها.

        لذا، إذا تخطيت قراءة كل كلمة من سياسة الخصوصية، فاعلم على الأقل هذا:
      `],
      ['Cookie Policy', `
        تفاصيل حول سياسة ملفات تعريف الارتباط لدينا.
        توفر ملفات تعريف الارتباط والتقنيات المماثلة مثل البكسلات والتخزين المحلي تجربة أفضل وأسرع وأكثر أمانًا على tweetbook. تُستخدم ملفات تعريف الارتباط أيضًا لتشغيل خدماتنا، بما في ذلك مواقعنا الإلكترونية وتطبيقاتنا وواجهات برمجة التطبيقات والبكسلات والدمج والاتصالات عبر البريد الإلكتروني. على وجه التحديد، تستخدم tweetbook هذه التقنيات لـ:

        إبقائك مسجلاً في tweetbook.
        تقديم ميزات ووظائف خدمات tweetbook.
        حفظ وتقدير تفضيلاتك.
        تخصيص المحتوى الذي تراه.
        حمايتك من الرسائل غير المرغوب فيها والإساءة.
        عرض إعلانات أكثر صلة.
        توفير ميزات الاشتراك وتوزيع محتوى معين.
        فهم كيفية تفاعلك مع خدماتنا وأين يمكننا تحسين.
        قياس فعالية إعلاناتنا وتسويقنا.
        تقييم أداء خدماتنا وتحديد الأخطاء ومشكلات الجودة الأخرى.
        جمع البيانات المستخدمة لتشغيل أعمالنا - من قياس حجم جمهورنا إلى تنفيذ قواعد tweetbook.
      `],
      ['Accessibility', `
        معلومات حول خيارات الوصول.
        هنا في tweetbook، مهمتنا هي منح الجميع القدرة على إنشاء ومشاركة الأفكار والمعلومات على الفور دون حواجز، بما في ذلك الأشخاص ذوي الإعاقة. لدينا مجموعة مخصصة من المصممين والمهندسين الشاملين المتعددي التخصصات، مع وبدون خبرة حية بالإعاقة، تركز على تقديم أفضل تجربة بغض النظر عن الجهاز أو النظام الأساسي أو الإعاقة من خلال دمج الإرشادات وأفضل الممارسات المعمول بها.

        ميزات الوصول
        بينما نعلم أن عملنا لا يتوقف أبدًا، فإليك بعض الطرق التي عملنا بها على تحسين وصول tweetbook للأشخاص ذوي الإعاقات المختلفة.
        بصري

        دعم قراءة الشاشة وعرض بريل القابل للتحديث
        إعدادات حجم الخط والتباين العالي
        دعم الوضع الداكن، مع مواضيع للضوء الخافت أو الإيقاف الكامل
        سمعي

        دعم الترجمة التلقائية للفيديوهات، ومناطق tweetbook، والمنشورات الصوتية
        تحميل ملفات الترجمة (SRT) للفيديوهات التي يتم نشرها عبر المنشورات على الويب
        تشغيل الأصوات
        حركة

        اختصارات لوحة المفاتيح
        دعم تبديل الجهاز، التحكم الصوتي (iOS)، والوصول الصوتي (Android)
        اختصارات Magic Tap مخصصة (iOS)
        إدراكي

        إعدادات تقليل الحركة/الرسوم المتحركة
        منع تشغيل الفيديو التلقائي
        إيقاف الأصوات
        لمزيد من المعلومات حول ميزات الوصول، راجع ميزات الوصول في tweetbook.
      `],
      ['Ads Info', `
        نظرة عامة: تهدف إعلانات tweetbook إلى عرض إعلانات ذات صلة ومفيدة لك. تشمل الإعلانات المعززة، وإعلانات المتابعين، وتغطي الاتجاهات، والتي يتم تمييزها بوضوح كـ "إعلان".

        التخصيص: يتم تخصيص الإعلانات بناءً على نشاطك في tweetbook، ومعلومات ملفك الشخصي، وبيانات الموقع، وتفاعلاتك مع المحتوى والحسابات. تساعد هذه التخصيصات في عرض إعلانات تتماشى مع اهتماماتك.

        استخدام البيانات: تستخدم tweetbook عناوين البريد الإلكتروني المشفرة، والمحددات المحمولة، ومعلومات المتصفح لتخصيص الإعلانات. يشمل ذلك عرض الترويج لمواقع الويب أو النشرات الإخبارية التي تتفاعل معها.

        عناصر التحكم في الخصوصية: يمكنك إدارة إعدادات تخصيص الإعلانات من خلال إعدادات tweetbook أو أدوات إلغاء الاشتراك مثل أداة اختيار المستهلكين من التحالف الرقمي للإعلانات وإعدادات الجهاز المحددة (iOS وAndroid).

        الشركاء من الأطراف الثالثة: تتعاون tweetbook مع المعلنين من الأطراف الثالثة مثل Google. لا تمتد خيارات الخصوصية لإعلانات tweetbook إلى الإعلانات المقدمة من هؤلاء الشركاء خارج tweetbook.

        خيارات إضافية: يمكن لمستخدمي iOS (الإصدار 14 وما بعده) تعطيل طلبات معرّف الإعلانات من iOS. إن رفض الإعلانات المعززة غير المرغوب فيها يوفر ملاحظات لتحسين ملاءمة الإعلانات.
      `],
      ['learn more language', `
        عندما تقوم بتغيير لغتك الآن، فإنها تغيرها فقط مع النماذج الحالية في هذه المربعات التي تراها الآن؛ لاحقاً سترى هذه النماذج أيضاً في جميع أنحاء التطبيق!
      `]
    ]
  }
};

export function AsideFooter(): JSX.Element {
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<'en' | 'he'>('en'); // Default language is English

  const openModal = (content: string) => {
    setLoading(true);
    setModalContent(content);
    setTimeout(() => {
      setLoading(false);
    }, 1000); // Simulate loading delay
  };
  const router = useRouter();

  // Function to handle button navigation
  const handleNavigation = (page: string) => {
    router.push(page);
  };
  const closeModal = () => {
    setModalContent(null);
  };

  const handleLanguageChange = (lang: 'en' | 'he') => {
    setLanguage(lang);
  };

  const currentTranslations = translations[language];

  return (
    <footer className="sticky top-16 flex flex-col gap-3 text-center text-sm text-light-secondary dark:text-dark-secondary">
      <nav className="flex flex-wrap justify-center gap-2">
      <Button
          className="custom-underline cursor-pointer"
                onClick={() => handleNavigation('/HelpCenter/Terms_of_Service')}
              >
                Terms of Service
              </Button>
        {currentTranslations.footerLinks.map(([linkName, content], index) => (
          <button
            key={index}
            onClick={() => openModal(content)}
            className="custom-underline cursor-pointer"
          >
            {linkName}
          </button>
        ))}       <More />
      </nav>
      <p>© 2024 tweetbook, Inc.</p>
      {/* <h1>language popular:</h1> */}
      {/* Language Switcher */}
      {/* <div className="language flex justify-center gap-2 mt-4">
        <Button onClick={() => handleLanguageChange('en')}>English</Button>
        <Button onClick={() => handleLanguageChange('he')}>עברית</Button>
        <Button onClick={() => handleLanguageChange('zh')}>中文</Button> */}
        {/* <Button onClick={() => handleLanguageChange('ar')}>العربية</Button> */}
        {/* Add more language buttons here */}
      {/* </div> */}

      {/* Modal */}
      {modalContent && (
        <Modal open={modalContent !== null} closeModal={closeModal}>
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md overflow-y-auto h-[500px] relative custom-scrollbar">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : (
                <>
                  <div dangerouslySetInnerHTML={{ __html: modalContent }} />
                  <button
                    onClick={closeModal}
                    className="mt-4 text-sm px-3 py-2 w-52 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-200"
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #f1f1f1;
        }
      `}</style>
    </footer>
  );
}
