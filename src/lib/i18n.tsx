import type { ReactNode } from "react";
import { useAppStore } from "../app/store";
import type { LanguageCode } from "../types";

export const TRANSLATIONS = {
  // Navigation & Sidebar
  "nav.dashboard": { en: "Dashboard", ur: "ڈیش بورڈ" },
  "nav.production": { en: "Production", ur: "پیداوار" },
  "nav.inventory": { en: "Inventory", ur: "اسٹاک / گودام" },
  "nav.sales": { en: "Sales", ur: "فروخت" },
  "nav.orders": { en: "Orders", ur: "آرڈرز" },
  "nav.gatePass": { en: "Gate Pass", ur: "گیٹ پاس" },
  "nav.customers": { en: "Customers", ur: "گاہک" },
  "nav.suppliers": { en: "Suppliers", ur: "سپلائرز" },
  "nav.payments": { en: "Payments", ur: "ادائیگیاں" },
  "nav.dues": { en: "Dues & Recovery", ur: "بقایاجات و وصولی" },
  "nav.labour": { en: "Labour", ur: "مزدور" },
  "nav.attendance": { en: "Attendance", ur: "حاضری" },
  "nav.wages": { en: "Wages & Payroll", ur: "اجرت و تنخواہ" },
  "nav.coalFuel": { en: "Coal & Fuel", ur: "کوئلہ اور ایندھن" },
  "nav.expenses": { en: "Expenses", ur: "اخراجات" },
  "nav.purchases": { en: "Purchases", ur: "خریداری" },
  "nav.reports": { en: "Reports", ur: "رپورٹس" },
  "nav.analytics": { en: "Analytics", ur: "تجزیات" },
  "nav.backupRestore": { en: "Backup & Restore", ur: "بیک اپ اور بحالی" },
  "nav.admin": { en: "Admin Panel", ur: "ایڈمن پینل" },
  "nav.settings": { en: "Settings", ur: "ترتیبات" },
  "nav.overview": { en: "Overview", ur: "جائزہ" },
  "nav.operations": { en: "Operations", ur: "آپریشنز" },
  "nav.business": { en: "Business", ur: "کاروبار" },
  "nav.accounts": { en: "Accounts", ur: "اکاؤنٹس" },
  "nav.management": { en: "Management", ur: "انتظام" },
  "nav.system": { en: "System", ur: "سسٹم" },
  "Business, printer, language and application settings": { en: "Business, printer, language and application settings", ur: "کاروبار، پرنٹر، زبان اور ایپ کی ترتیبات" },
  "Kiln identity and contact details": { en: "Kiln identity and contact details", ur: "بھٹے کی شناخت اور رابطے کی تفصیلات" },
  "Manage categories: food, personal fuel, maintenance": { en: "Manage categories: food, personal fuel, maintenance", ur: "کھانے، ذاتی ایندھن اور مرمت کی اقسام کا انتظام" },
  "Driver names, vehicles, and live availability": { en: "Driver names, vehicles, and live availability", ur: "ڈرائیوروں کے نام، گاڑیاں اور دستیابی" },
  "Kiln fuel materials: coal, gas, wood, husk": { en: "Kiln fuel materials: coal, gas, wood, husk", ur: "بھٹے کا ایندھن: کوئلہ، گیس، لکڑی اور بھوسہ" },
  "Daily shift hours and allowed monthly leaves": { en: "Daily shift hours and allowed monthly leaves", ur: "روزانہ کام کے اوقات اور ماہانہ چھٹیوں کی اجازت" },
  "Grades, prices and default grade": { en: "Grades, prices and default grade", ur: "معیار، قیمتیں اور پہلے سے منتخب معیار" },
  "Receipt and invoice printing preferences": { en: "Receipt and invoice printing preferences", ur: "رسیدوں اور انوائس کی پرنٹنگ کی ترتیبات" },
  "Theme and display preferences": { en: "Theme and display preferences", ur: "تھیم اور ڈسپلے کی ترجیحات" },
  "Urdu (Jameel Noori) & English typography": { en: "Urdu (Jameel Noori) & English typography", ur: "اردو (جمیل نوری) اور انگریزی فونٹ" },
  "General application preferences": { en: "General application preferences", ur: "ایپ کی عمومی ترجیحات" },
  "View error logs, export a report and check for app updates": { en: "View error logs, export a report and check for app updates", ur: "ایرر لاگز دیکھیں، رپورٹ برآمد کریں اور اپ ڈیٹس چیک کریں" },

  // Common Actions
  "action.add": { en: "Add", ur: "شامل کریں" },
  "action.save": { en: "Save", ur: "محفوظ کریں" },
  "action.cancel": { en: "Cancel", ur: "منسوخ کریں" },
  "action.edit": { en: "Edit", ur: "ترمیم" },
  "action.view": { en: "View", ur: "دیکھیں" },
  "action.print": { en: "Print", ur: "پرنٹ" },
  "action.refresh": { en: "Refresh", ur: "تازہ کریں" },
  "action.reset": { en: "Reset", ur: "ری سیٹ" },
  "action.close": { en: "Close", ur: "بند کریں" },
  "action.search": { en: "Search", ur: "تلاش کریں" },
  "action.logout": { en: "Logout", ur: "لاگ آؤٹ" },

  // Authentication and common form labels
  "Sign in to manage your brick kiln.": { en: "Sign in to manage your brick kiln.", ur: "اپنی اینٹوں کے بھٹے کا انتظام کرنے کے لیے سائن اِن کریں۔" },
  "Account login": { en: "Account login", ur: "اکاؤنٹ میں داخل ہوں" },
  "Username": { en: "Username", ur: "صارف نام" },
  "Password": { en: "Password", ur: "پاس ورڈ" },
  "Enter your username": { en: "Enter your username", ur: "اپنا صارف نام درج کریں" },
  "Enter your password": { en: "Enter your password", ur: "اپنا پاس ورڈ درج کریں" },
  "Hide password": { en: "Hide password", ur: "پاس ورڈ چھپائیں" },
  "Show password": { en: "Show password", ur: "پاس ورڈ دکھائیں" },
  "Sign in": { en: "Sign in", ur: "سائن اِن" },
  "Signing in...": { en: "Signing in...", ur: "سائن اِن ہو رہا ہے..." },
  "License activation": { en: "License activation", ur: "لائسنس فعال کریں" },
  "Local desktop application": { en: "Local desktop application", ur: "مقامی ڈیسک ٹاپ ایپلیکیشن" },
  "Username and password are required.": { en: "Username and password are required.", ur: "صارف نام اور پاس ورڈ درج کرنا ضروری ہے۔" },
  "Unable to sign in. Please try again.": { en: "Unable to sign in. Please try again.", ur: "سائن اِن نہیں ہو سکا۔ دوبارہ کوشش کریں۔" },
  "Invalid username or password.": { en: "Invalid username or password.", ur: "صارف نام یا پاس ورڈ درست نہیں ہے۔" },
  "This account is inactive.": { en: "This account is inactive.", ur: "یہ اکاؤنٹ غیر فعال ہے۔" },
  "Too many failed attempts. Try again after the lockout period.": { en: "Too many failed attempts. Try again after the lockout period.", ur: "کئی بار غلط کوشش ہوئی ہے۔ کچھ دیر بعد دوبارہ کوشش کریں۔" },

  // Dashboard
  "dash.title": { en: "Dashboard", ur: "ڈیش بورڈ" },
  "dash.subtitle": {
    en: "Overview of your brick kiln operations and business performance.",
    ur: "آپ کے اینٹوں کے بھٹہ کے کام اور کاروباری کارکردگی کا مکمل جائزہ۔",
  },
  "dash.totalProduced": { en: "Total produced", ur: "کل پیداوار" },
  "dash.totalDispatched": { en: "Total dispatched", ur: "کل ترسیل" },
  "dash.availableStock": { en: "Available stock", ur: "دستیاب اسٹاک" },
  "dash.damagedBricks": { en: "Damaged bricks", ur: "خراب اینٹیں" },
  "dash.totalSales": { en: "Total sales", ur: "کل فروخت" },
  "dash.totalReceived": { en: "Total receive amount", ur: "کل موصول شدہ رقم" },
  "dash.totalExpenses": { en: "Total expenses", ur: "کل اخراجات" },
  "dash.pendingAmount": { en: "Pending amount", ur: "واجب الادا رقم" },
  "dash.totalWorkers": { en: "Total workers", ur: "کل مزدور" },
  "dash.presentToday": { en: "Present today", ur: "آج حاضر" },
  "dash.absentToday": { en: "Absent today", ur: "آج غیر حاضر" },
  "dash.pendingWages": { en: "Pending wages", ur: "باقی اجرت" },
  "Refresh Data": { en: "Refresh Data", ur: "ڈیٹا تازہ کریں" },
  "Daily pulse": { en: "Daily pulse", ur: "روزانہ کی صورتحال" },
  "Today at a glance": { en: "Today at a glance", ur: "آج کا خلاصہ" },
  "Sales booked": { en: "Sales booked", ur: "درج شدہ فروخت" },
  "Cash received": { en: "Cash received", ur: "وصول شدہ رقم" },
  "Operating spend": { en: "Operating spend", ur: "کاروباری اخراجات" },
  "Customer dues": { en: "Customer dues", ur: "گاہکوں کے بقایا جات" },
  "Invoices recorded today": { en: "Invoices recorded today", ur: "آج درج شدہ رسیدیں" },
  "Payments collected today": { en: "Payments collected today", ur: "آج وصول شدہ ادائیگیاں" },
  "Expenses recorded today": { en: "Expenses recorded today", ur: "آج درج شدہ اخراجات" },
  "Still outstanding today": { en: "Still outstanding today", ur: "آج کے بقایا جات" },
  "Production & Dispatch Overview": { en: "Production & Dispatch Overview", ur: "پیداوار اور ترسیل کا جائزہ" },
  "Stock Summary & Brick Grades": { en: "Stock Summary & Brick Grades", ur: "اسٹاک اور اینٹوں کے معیار کا خلاصہ" },
  "Labour & Workforce Overview": { en: "Labour & Workforce Overview", ur: "مزدوروں اور عملے کا جائزہ" },
  "Expense Breakdown & Cost Distribution": { en: "Expense Breakdown & Cost Distribution", ur: "اخراجات کی تفصیل" },
  "Financial Overview": { en: "Financial Overview", ur: "مالیاتی جائزہ" },
  "Total produced": { en: "Total produced", ur: "کل پیداوار" },
  "Total dispatched": { en: "Total dispatched", ur: "کل ترسیل" },
  "Available stock": { en: "Available stock", ur: "دستیاب اسٹاک" },
  "Damaged bricks": { en: "Damaged bricks", ur: "خراب اینٹیں" },
  "Total sales": { en: "Total sales", ur: "کل فروخت" },
  "Total receive amount": { en: "Total receive amount", ur: "کل وصول شدہ رقم" },
  "Total expenses": { en: "Total expenses", ur: "کل اخراجات" },
  "Pending amount": { en: "Pending amount", ur: "بقایا رقم" },
  "In Stock": { en: "In Stock", ur: "اسٹاک میں موجود" },
  "Low Stock": { en: "Low Stock", ur: "کم اسٹاک" },
  "Out of Stock": { en: "Out of Stock", ur: "اسٹاک ختم" },
  "Inventory": { en: "Inventory", ur: "ذخیرہ" },
  "Monitor brick stock, ready inventory, reserved dispatch commitments, and physical count adjustments.": { en: "Monitor brick stock, ready inventory, reserved dispatch commitments, and physical count adjustments.", ur: "اینٹوں کے اسٹاک، تیار ذخیرے، مختص ترسیل اور جسمانی گنتی کی تبدیلیوں کا جائزہ لیں۔" },
  "Adjust Stock": { en: "Adjust Stock", ur: "اسٹاک درست کریں" },
  "Print Stock Sheet": { en: "Print Stock Sheet", ur: "اسٹاک شیٹ پرنٹ کریں" },
  "Export CSV": { en: "Export CSV", ur: "CSV برآمد کریں" },
  "Total Stock Valuation": { en: "Total Stock Valuation", ur: "اسٹاک کی کل مالیت" },
  "Based on grade selling prices": { en: "Based on grade selling prices", ur: "معیار کے فروخت نرخ کے مطابق" },
  "Low Stock Alerts": { en: "Low Stock Alerts", ur: "کم اسٹاک کی تنبیہات" },
  "At or below reorder threshold": { en: "At or below reorder threshold", ur: "دوبارہ آرڈر کی حد یا اس سے کم" },
  "Requires fresh kiln output": { en: "Requires fresh kiln output", ur: "نئی بھٹہ پیداوار درکار ہے" },
  "Brick Stock Register": { en: "Brick Stock Register", ur: "اینٹوں کے اسٹاک کا رجسٹر" },
  "Brick Grade": { en: "Brick Grade", ur: "اینٹ کا معیار" },
  "Total Physical Stock": { en: "Total Physical Stock", ur: "کل موجودہ اسٹاک" },
  "Reserved": { en: "Reserved", ur: "مختص" },
  "Available for Sale": { en: "Available for Sale", ur: "فروخت کے لیے دستیاب" },
  "Damaged": { en: "Damaged", ur: "خراب" },
  "Stock Status": { en: "Stock Status", ur: "اسٹاک کی صورتحال" },
  "Actions": { en: "Actions", ur: "اقدامات" },
  "Adjust Brick Stock": { en: "Adjust Brick Stock", ur: "اینٹوں کا اسٹاک درست کریں" },
  "Print stock certificate": { en: "Print stock certificate", ur: "اسٹاک سرٹیفکیٹ پرنٹ کریں" },
  "No inventory records": { en: "No inventory records", ur: "ذخیرے کا کوئی ریکارڈ نہیں" },
  "Inventory records will appear here after stock is added or production is recorded.": { en: "Inventory records will appear here after stock is added or production is recorded.", ur: "اسٹاک شامل کرنے یا پیداوار درج کرنے کے بعد ذخیرے کا ریکارڈ یہاں دکھائی دے گا۔" },
  "Search brick grade...": { en: "Search brick grade...", ur: "اینٹ کا معیار تلاش کریں..." },
  "All stock statuses": { en: "All stock statuses", ur: "اسٹاک کی تمام صورتحال" },
  "Stock Items": { en: "Stock Items", ur: "اسٹاک کی اقسام" },
  "Total Bricks": { en: "Total Bricks", ur: "کل اینٹیں" },
  "Current Physical Stock Count": { en: "Current Physical Stock Count", ur: "موجودہ جسمانی اسٹاک کی گنتی" },
  "Adjustment Type": { en: "Adjustment Type", ur: "درستگی کی قسم" },
  "New Total Count": { en: "New Total Count", ur: "نئی کل گنتی" },
  "Quantity to Change": { en: "Quantity to Change", ur: "تبدیل ہونے والی مقدار" },
  "Reorder Threshold": { en: "Reorder Threshold", ur: "دوبارہ آرڈر کی حد" },
  "Reason / Reference Notes": { en: "Reason / Reference Notes", ur: "وجہ یا حوالہ نوٹس" },
  "Cancel": { en: "Cancel", ur: "منسوخ کریں" },
  "Save Stock Adjustment": { en: "Save Stock Adjustment", ur: "اسٹاک کی تبدیلی محفوظ کریں" },
  "Please select a brick grade.": { en: "Please select a brick grade.", ur: "براہ کرم اینٹ کا معیار منتخب کریں۔" },
  "Quantity must be a valid non-negative whole number.": { en: "Quantity must be a valid non-negative whole number.", ur: "مقدار صفر یا اس سے بڑی مکمل عددی ہونی چاہیے۔" },
  "Change my password": { en: "Change my password", ur: "میرا پاس ورڈ تبدیل کریں" },
  "Kiln Production & Dispatch": { en: "Kiln Production & Dispatch", ur: "بھٹے کی پیداوار اور ترسیل" },
  "Production & Dispatch Trend Analysis": { en: "Production & Dispatch Trend Analysis", ur: "پیداوار اور ترسیل کے رجحان کا تجزیہ" },
  "Daily kiln output compared with gate pass dispatches from your live database.": { en: "Daily kiln output compared with gate pass dispatches from your live database.", ur: "روزانہ بھٹہ پیداوار کا براہ راست ڈیٹا بیس کے گیٹ پاسز کی ترسیل سے موازنہ۔" },
  "produced latest": { en: "produced latest", ur: "تازہ ترین پیداوار" },
  "vs previous": { en: "vs previous", ur: "گزشتہ مدت کے مقابلے میں" },
  "dispatched": { en: "dispatched", ur: "ترسیل شدہ" },
  "Live database": { en: "Live database", ur: "براہ راست ڈیٹا بیس" },
  "Kiln output compared with gate pass dispatches": { en: "Kiln output compared with gate pass dispatches", ur: "بھٹہ پیداوار اور گیٹ پاس ترسیل کا موازنہ" },
  "period": { en: "period", ur: "مدت" },
  "periods": { en: "periods", ur: "مدتیں" },
  "Date range": { en: "Date range", ur: "تاریخ کی مدت" },
  "Chart type": { en: "Chart type", ur: "چارٹ کی قسم" },
  "Area": { en: "Area", ur: "ایریا" },
  "Line": { en: "Line", ur: "لائن" },
  "Bars": { en: "Bars", ur: "بارز" },
  "Table": { en: "Table", ur: "جدول" },
  "All": { en: "All", ur: "تمام" },
  "Production": { en: "Production", ur: "پیداوار" },
  "Gate pass dispatches": { en: "Gate pass dispatches", ur: "گیٹ پاس کے ذریعے ترسیل" },
  "Period": { en: "Period", ur: "مدت" },
  "Produced": { en: "Produced", ur: "پیداوار" },
  "Dispatched": { en: "Dispatched", ur: "ترسیل شدہ" },
  "Dispatch rate": { en: "Dispatch rate", ur: "ترسیل کی شرح" },
  "Dispatch / production": { en: "Dispatch / production", ur: "ترسیل اور پیداوار" },
  "Added to yard stock": { en: "Added to yard stock", ur: "یارڈ کے اسٹاک میں اضافہ" },
  "produced − dispatched": { en: "produced − dispatched", ur: "پیداوار − ترسیل" },
  "Produced Total": { en: "Produced Total", ur: "کل پیداوار" },
  "Dispatched Total": { en: "Dispatched Total", ur: "کل ترسیل" },
  "Dispatch Rate": { en: "Dispatch Rate", ur: "ترسیل کی شرح" },
  "Yard Stock": { en: "Yard Stock", ur: "یارڈ اسٹاک" },
  "Today Produced": { en: "Today Produced", ur: "آج کی پیداوار" },
  "Today Dispatched": { en: "Today Dispatched", ur: "آج کی ترسیل" },
  "Periods": { en: "Periods", ur: "مدتیں" },
  "No production or dispatch records in selected period.": { en: "No production or dispatch records in selected period.", ur: "منتخب مدت میں پیداوار یا ترسیل کا کوئی ریکارڈ نہیں۔" },
  "Operational Reporting Period": { en: "Operational Reporting Period", ur: "کاروباری رپورٹ کی مدت" },
  "Reset to 1 Month": { en: "Reset to 1 Month", ur: "ایک ماہ پر ری سیٹ کریں" },
  "1 Day (Today)": { en: "1 Day (Today)", ur: "ایک دن (آج)" },
  "2 Days": { en: "2 Days", ur: "دو دن" },
  "3 Days": { en: "3 Days", ur: "تین دن" },
  "4 Days": { en: "4 Days", ur: "چار دن" },
  "7 Days (Week)": { en: "7 Days (Week)", ur: "سات دن (ہفتہ)" },
  "15 Days": { en: "15 Days", ur: "پندرہ دن" },
  "1 Month (30 Days)": { en: "1 Month (30 Days)", ur: "ایک ماہ (30 دن)" },
  "1 Year": { en: "1 Year", ur: "ایک سال" },
  "Custom Range": { en: "Custom Range", ur: "اپنی منتخب کردہ مدت" },
  "From Date": { en: "From Date", ur: "شروع کی تاریخ" },
  "To Date": { en: "To Date", ur: "اختتام کی تاریخ" },
  "Custom Date Filter Active": { en: "Custom Date Filter Active", ur: "مخصوص تاریخ کی چھانٹی فعال ہے" },
  "Grades": { en: "Grades", ur: "معیار" },
  "Update quantities, add production receipts, or record broken bricks": { en: "Update quantities, add production receipts, or record broken bricks", ur: "مقدار درست کریں، پیداوار درج کریں یا ٹوٹی ہوئی اینٹیں ریکارڈ کریں۔" },
  "e.g. Monthly physical audit, kiln unloading batch #12...": { en: "e.g. Monthly physical audit, kiln unloading batch #12...", ur: "مثال: ماہانہ جسمانی گنتی، بھٹے سے نکاسی بیچ #12..." },
  "Failed to load dashboard": { en: "Failed to load dashboard", ur: "ڈیش بورڈ لوڈ نہیں ہو سکا" },
  "Nothing to show yet": { en: "Nothing to show yet", ur: "ابھی دکھانے کے لیے کچھ نہیں" },
  "Your dashboard information will appear here once records are added.": { en: "Your dashboard information will appear here once records are added.", ur: "ریکارڈ شامل ہونے کے بعد ڈیش بورڈ کی معلومات یہاں دکھائی دیں گی۔" },
  "Bricks produced in selected period": { en: "Bricks produced in selected period", ur: "منتخب مدت میں تیار کردہ اینٹیں" },
  "Bricks dispatched in selected period": { en: "Bricks dispatched in selected period", ur: "منتخب مدت میں ترسیل شدہ اینٹیں" },
  "Current available brick stock": { en: "Current available brick stock", ur: "اس وقت دستیاب اینٹوں کا اسٹاک" },
  "Recorded damaged stock": { en: "Recorded damaged stock", ur: "ریکارڈ شدہ خراب اسٹاک" },
  "Cash / Bank collected": { en: "Cash / Bank collected", ur: "وصول شدہ نقد یا بینک رقم" },
  "Fuel, labour & overheads": { en: "Fuel, labour & overheads", ur: "ایندھن، مزدوری اور عمومی اخراجات" },
  "Outstanding customer dues": { en: "Outstanding customer dues", ur: "گاہکوں کے بقایا جات" },
  "Net Financial Position": { en: "Net Financial Position", ur: "خالص مالی حیثیت" },
  "Net Cash Flow:": { en: "Net Cash Flow:", ur: "خالص نقد بہاؤ:" },
  "Total Collected": { en: "Total Collected", ur: "کل وصولی" },
  "Total Disbursed": { en: "Total Disbursed", ur: "کل ادائیگی" },
  "Kiln control room": { en: "Kiln control room", ur: "بھٹہ کنٹرول روم" },
  "Welcome back,": { en: "Welcome back,", ur: "خوش آمدید،" },
  "Local-first records": { en: "Local-first records", ur: "مقامی محفوظ ریکارڈ" },
  "Live business overview": { en: "Live business overview", ur: "کاروبار کا تازہ جائزہ" },
  "Today's briefing": { en: "Today's briefing", ur: "آج کی رپورٹ" },
  "Your local workspace is ready": { en: "Your local workspace is ready", ur: "آپ کا مقامی ورک اسپیس تیار ہے" },

  // Production
  "prod.title": { en: "Production", ur: "پیداوار" },
  "prod.newBatch": { en: "New Batch", ur: "نیا بیچ" },
  "prod.pathai": { en: "Pathai (Moulding)", ur: "پتھائی" },
  "prod.bharai": { en: "Bharai (Loading)", ur: "بھرائی" },
  "prod.jalai": { en: "Jalai (Firing)", ur: "جلائی" },
  "prod.nikasi": { en: "Nikasi (Unloading)", ur: "نکاسی" },
  "prod.completed": { en: "Completed", ur: "مکمل" },

  // Settings
  "settings.title": { en: "Settings", ur: "ترتیبات" },
  "settings.language": { en: "Language & Urdu Nastaleeq", ur: "زبان اور اردو نستعلیق" },
  "settings.business": { en: "Business profile", ur: "کاروباری پروفائل" },
  "settings.expenses": { en: "Expense Categories", ur: "اخراجات کی اقسام" },
  "settings.drivers": { en: "Delivery Drivers", ur: "ڈیلیوری ڈرائیورز" },
  "settings.fuelTypes": { en: "Coal & Fuel Types", ur: "کوئلہ اور ایندھن کی اقسام" },
  "settings.labourRules": { en: "Labour & Salary Policy", ur: "مزدوری اور تنخواہ کی پالیسی" },
  "settings.brickGrades": { en: "Brick grades", ur: "اینٹوں کے معیار" },
  "settings.printer": { en: "Printer", ur: "پرنٹر" },
  "settings.appearance": { en: "Appearance", ur: "ظاہری شکل" },
  "settings.general": { en: "General", ur: "عمومی" },
  "settings.support": { en: "Support & updates", ur: "مدد اور اپ ڈیٹس" },
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS;

export function translate(key: TranslationKey, language: LanguageCode): string {
  const entry = TRANSLATIONS[key];
  if (!entry) return key;
  if (language === "ur") return entry.ur;
  if (language === "both") return `${entry.en}\n${entry.ur}`;
  return entry.en;
}

const ENGLISH_TO_URDU: Record<string, string> = Object.values(TRANSLATIONS).reduce(
  (acc, item) => {
    acc[item.en.toLowerCase()] = item.ur;
    return acc;
  },
  {} as Record<string, string>,
);

// Canonical Urdu labels for the inventory register and its nested stock tools.
// These explicit entries also replace older mojibake values in saved builds.
Object.assign(ENGLISH_TO_URDU, {
  "print inventory": "ذخیرہ پرنٹ کریں",
  "first page": "پہلا صفحہ",
  "previous page": "پچھلا صفحہ",
  "next page": "اگلا صفحہ",
  "last page": "آخری صفحہ",
  "clear search": "تلاش صاف کریں",
  rows: "قطاریں",
  "offline brick kiln management": "بھٹے کے انتظام کا آف لائن نظام",
  version: "ورژن",
  "search...": "تلاش کریں...",
  grades: "معیار",
  "monitor brick stock, ready inventory, reserved dispatch commitments, and physical count adjustments.": "اینٹوں کے اسٹاک، تیار ذخیرے، مختص ترسیل اور جسمانی گنتی کی تبدیلیوں کا جائزہ لیں۔",
  "total produced": "کل پیداوار",
  "total dispatched": "کل ترسیل",
  "available stock": "دستیاب اسٹاک",
  "damaged bricks": "خراب اینٹیں",
  "in stock": "اسٹاک میں موجود",
  "low stock": "کم اسٹاک",
  "out of stock": "اسٹاک ختم",
  inventory: "ذخیرہ",
  "adjust stock": "اسٹاک میں ترمیم",
  "export csv": "CSV برآمد کریں",
  "total stock valuation": "اسٹاک کی کل مالیت",
  "based on grade selling prices": "معیار کی فروخت قیمتوں کے مطابق",
  "low stock alerts": "کم اسٹاک کی تنبیہات",
  "at or below reorder threshold": "دوبارہ آرڈر کی مقررہ حد یا اس سے کم",
  "requires fresh kiln output": "بھٹے کی نئی پیداوار درکار ہے",
  "brick stock register": "اینٹوں کے اسٹاک کا رجسٹر",
  "brick grade": "اینٹ کا معیار",
  "total physical stock": "کل موجودہ اسٹاک",
  reserved: "مختص شدہ",
  "available for sale": "فروخت کے لیے دستیاب",
  damaged: "خراب",
  "stock status": "اسٹاک کی صورت حال",
  actions: "اقدامات",
  "adjust brick stock": "اینٹوں کے اسٹاک میں ترمیم",
  "print stock certificate": "اسٹاک سرٹیفکیٹ پرنٹ کریں",
  "no inventory records": "ذخیرے کا کوئی ریکارڈ موجود نہیں",
  "inventory records will appear here after stock is added or production is recorded.": "اسٹاک شامل کرنے یا پیداوار درج کرنے کے بعد ریکارڈ یہاں دکھائی دے گا۔",
  "search brick grade...": "اینٹ کا معیار تلاش کریں...",
  "all stock statuses": "اسٹاک کی تمام صورتیں",
  "stock items": "اسٹاک کی اقسام",
  "total bricks": "کل اینٹیں",
  "adjustment type": "ترمیم کی قسم",
  "new total count": "نئی کل گنتی",
  "quantity to change": "تبدیل ہونے والی مقدار",
  "reorder threshold": "دوبارہ آرڈر کی حد",
  "reason / reference notes": "وجہ / حوالہ نوٹس",
  cancel: "منسوخ کریں",
  "save stock adjustment": "اسٹاک کی ترمیم محفوظ کریں",
  "please select a brick grade.": "براہ کرم اینٹ کا معیار منتخب کریں۔",
  "quantity must be a valid non-negative whole number.": "مقدار صفر یا اس سے بڑی مکمل عددی قدر ہونی چاہیے۔",
  "update quantities, add production receipts, or record broken bricks": "مقدار میں ترمیم کریں، پیداوار شامل کریں، یا ٹوٹی ہوئی اینٹیں درج کریں۔",
  "e.g. monthly physical audit, kiln unloading batch #12...": "مثال: ماہانہ جسمانی گنتی، بھٹے سے نکاسی کی کھیپ #12...",
  "inventory error": "ذخیرے میں خرابی",
  retry: "دوبارہ کوشش کریں",
  "select brick grade": "اینٹ کا معیار منتخب کریں",
  "no stock movements recorded.": "اسٹاک کی کوئی نقل و حرکت درج نہیں۔",
  date: "تاریخ",
  grade: "معیار",
  movement: "نقل و حرکت",
  reference: "حوالہ",
  adjustment: "ترمیم",
  "damaged stock": "خراب اسٹاک",
  return: "واپسی",
  incoming: "موصولہ",
  outgoing: "ارسال شدہ",
  "grade:": "معیار:",
  "type:": "قسم:",
  "quantity:": "مقدار:",
  "reference:": "حوالہ:",
  "created by:": "درج کرنے والا:",
  "date:": "تاریخ:",
  "notes:": "نوٹس:",
  "no low-stock items.": "کم اسٹاک کی کوئی چیز نہیں۔",
  available: "دستیاب",
  "estimated stock value": "اسٹاک کی تخمینی مالیت",
  "search inventory...": "ذخیرہ تلاش کریں...",
  "e.g. stk-0001": "مثال: STK-0001",
  "total damaged bricks": "خراب اینٹوں کی کل تعداد",
  remaining: "باقی",
  "reorder level": "دوبارہ آرڈر کی سطح",
  period: "مدت",
  beginning: "ابتدا",
  today: "آج",
  "stock history": "اسٹاک کی تاریخ",
  "based on the supplied unit price; this is not an accounting valuation.": "دی گئی فی اکائی قیمت کے مطابق؛ یہ حسابی مالیت نہیں ہے۔",
  type: "قسم",
  "created by": "درج کرنے والا",
  notes: "نوٹس",
  "reserved for orders": "آرڈرز کے لیے مختص",
  "available ready stock": "فروخت کے لیے دستیاب تیار اسٹاک",
  "damaged / broken": "خراب / ٹوٹی ہوئی",
  "minimum reorder level": "کم از کم دوبارہ آرڈر کی سطح",
  "selling rate": "فروخت کی قیمت",
  "estimated inventory value": "ذخیرے کی تخمینی مالیت",
  "stock condition": "اسٹاک کی حالت",
  "last stock update": "اسٹاک کی آخری تازہ کاری",
  "bricks": "اینٹیں",
  "current": "موجودہ",
  "current physical count": "موجودہ جسمانی گنتی",
  "quantity": "مقدار",
  status: "صورت حال",
  "current physical stock count": "موجودہ اسٹاک کی جسمانی گنتی",
  "print stock sheet": "اسٹاک شیٹ پرنٹ کریں",
  "stock reorder required": "اسٹاک دوبارہ منگوانا ضروری ہے",
  "reference number": "حوالہ نمبر",
  "stock in": "اسٹاک میں اضافہ",
  "stock out": "اسٹاک میں کمی",
  "stock adjustment": "اسٹاک میں ترمیم",
  "stock adjustment saved": "اسٹاک کی ترمیم محفوظ ہو گئی",
  "all movements": "تمام نقل و حرکت",
  "start date": "آغاز کی تاریخ",
  "end date": "اختتام کی تاریخ",
  "showing": "دکھائے جا رہے ہیں",
  "previous": "پچھلا",
  next: "اگلا",
  page: "صفحہ",
  of: "از",
  "total stock valuation:": "کل اسٹاک کی مالیت:",
  "total stock": "کل اسٹاک",
  "kiln brick inventory register": "بھٹے کی اینٹوں کے ذخیرے کا رجسٹر",
  "brick grade stock certificate": "اینٹ کے معیار کا اسٹاک سرٹیفکیٹ",
  "set total stock (physical count / inventory adjustment)": "کل اسٹاک مقرر کریں (جسمانی گنتی / اسٹاک ترمیم)",
  "add stock (received from kiln nikasi)": "اسٹاک شامل کریں (بھٹے سے نکاسی)",
  "record damaged (broken bricks discarded)": "خراب اینٹیں درج کریں (ٹوٹی اینٹیں خارج)",
  "customer return (added back to stock)": "گاہک کی واپسی (اسٹاک میں دوبارہ شامل)",
  "movement type": "نقل و حرکت کی قسم",
  "save movement": "نقل و حرکت محفوظ کریں",
  "adjustment quantity": "ترمیم کی مقدار",
  reason: "وجہ",
  "submit adjustment": "ترمیم جمع کریں",
  confirm: "تصدیق کریں",
  "total quantity": "کل مقدار",
  "reserved quantity": "مختص مقدار",
  "available quantity": "دستیاب مقدار",
  "damaged quantity": "خراب مقدار",
  "last updated": "آخری تازہ کاری",
  "quantity must be greater than zero.": "مقدار صفر سے زیادہ ہونی چاہیے۔",
  "adjustment reason is required.": "ترمیم کی وجہ درج کرنا ضروری ہے۔",
  "reference is required.": "حوالہ درج کرنا ضروری ہے۔",
  "damaged quantity exceeds available stock.": "خراب مقدار دستیاب اسٹاک سے زیادہ ہے۔",
  english: "انگریزی",
  urdu: "اردو",
  both: "دونوں",
  "application language & typography": "ایپ کی زبان اور تحریر",
  "choose english, urdu, or both. urdu text uses jameel noori nastaleeq.": "انگریزی، اردو یا دونوں زبانیں منتخب کریں۔ اردو کے لیے جمیل نوری نستعلیق استعمال ہوتا ہے۔",
  "urdu nastaleeq typography preview": "اردو نستعلیق تحریر کا نمونہ",
  "bhatta khata pro • complete computerized ledger for your brick kiln": "بھٹہ کھاتہ پرو • آپ کے بھٹے کا مکمل کمپیوٹرائزڈ کھاتہ",
  "daily record of firing, loading, sorting, and dispatch with attendance and wages.": "آوا، بھرائی، چھنٹائی اور نکاسی کے روزانہ ریکارڈ کے ساتھ حاضری اور اجرت۔",
  workspace: "کام کی جگہ",
  "unable to load inventory. please try again.": "ذخیرے کا ریکارڈ نہیں کھل سکا۔ براہ کرم دوبارہ کوشش کریں۔",
  "unable to save the stock adjustment. please try again.": "اسٹاک کی ترمیم محفوظ نہیں ہو سکی۔ براہ کرم دوبارہ کوشش کریں۔",
  "stock was successfully updated.": "کا اسٹاک کامیابی سے محفوظ کر دیا گیا ہے۔",
});

Object.assign(ENGLISH_TO_URDU, {
  language: "زبان",
  notifications: "اطلاعات",
  "no notifications are available yet.": "ابھی کوئی اطلاع موجود نہیں۔",
  "toggle theme": "تھیم تبدیل کریں",
  "change my password": "میرا پاس ورڈ تبدیل کریں",
  "admin panel": "ایڈمن پینل",
  "report issue": "مسئلے کی اطلاع دیں",
  "sign out": "سائن آؤٹ",
  close: "بند کریں",
  "search modules...": "ماڈیول تلاش کریں...",
  "urdu sample text is shown here.": "اردو تحریر کا نمونہ یہاں دکھایا گیا ہے۔",
});

// App-wide labels for feature pages that still contain literal JSX strings.
Object.assign(ENGLISH_TO_URDU, {
  "sales management": "فروخت کا انتظام",
  "create brick sales, manage invoices, record customer payments and process returns.": "اینٹوں کی فروخت درج کریں، رسیدیں سنبھالیں، گاہکوں کی ادائیگیاں لیں اور واپسی ریکارڈ کریں۔",
  "new sale": "نئی فروخت",
  actions: "کارروائیاں",
  "export sales csv": "فروخت کی CSV برآمد کریں",
  discounts: "رعایتیں",
  outstanding: "بقایا رقم",
  received: "وصول شدہ رقم",
  "all payment statuses": "ادائیگی کی تمام حالتیں",
  "all sale statuses": "فروخت کی تمام حالتیں",
  "search invoice or customer...": "رسید یا گاہک تلاش کریں...",
  "sale status": "فروخت کی حالت",
  payment: "ادائیگی",
  "balance due": "واجب الادا رقم",
  "paid amount": "ادا شدہ رقم",
  "grand total": "مجموعی رقم",
  "sale date": "فروخت کی تاریخ",
  "customer name": "گاہک کا نام",
  "invoice #": "رسید نمبر",
  "# invoice": "رسید نمبر",
  "order #": "آرڈر نمبر",
  "invoice number": "رسید نمبر",
  "manage customer advance bookings, delivery schedules, and fulfillment status.": "گاہکوں کی پیشگی بکنگ، ترسیل کے اوقات اور آرڈرز کی تکمیل کا انتظام کریں۔",
  "new order": "نیا آرڈر",
  "search order or customer...": "آرڈر یا گاہک تلاش کریں...",
  "search order number or customer": "آرڈر نمبر یا گاہک تلاش کریں",
  "order status": "آرڈر کی حالت",
  "# order": "آرڈر نمبر",
  "total orders": "کل آرڈرز",
  "paid advance": "ادا شدہ پیشگی رقم",
  "total amount": "کل رقم",
  "delivery date": "ترسیل کی تاریخ",
  "order date": "آرڈر کی تاریخ",
  "order details •": "آرڈر کی تفصیلات •",
  "booking date": "بکنگ کی تاریخ",
  "target delivery": "متوقع ترسیل",
  "current status": "موجودہ حالت",
  "total price": "کل قیمت",
  "print voucher": "واؤچر پرنٹ کریں",
  "create sale": "فروخت درج کریں",
  "create order": "آرڈر بنائیں",
  "create new customer order": "گاہک کا نیا آرڈر بنائیں",
  "create an order to get started.": "شروع کرنے کے لیے پہلا آرڈر بنائیں۔",
  "create your first brick sale to start recording invoices and customer balances.": "رسیدیں اور گاہکوں کے بقایا جات درج کرنے کے لیے پہلی فروخت بنائیں۔",
  "no customer orders found.": "گاہکوں کے کوئی آرڈرز نہیں ملے۔",
  "no orders yet": "ابھی کوئی آرڈر نہیں",
  "no matching sales": "کوئی مماثل فروخت نہیں ملی",
  "no sales recorded yet": "ابھی کوئی فروخت درج نہیں ہوئی",
  "no sales recorded yet.": "ابھی کوئی فروخت درج نہیں ہوئی۔",
  "no sales returns recorded.": "فروخت کی کوئی واپسی درج نہیں ہوئی۔",
  "no payments recorded yet.": "ابھی کوئی ادائیگی درج نہیں ہوئی۔",
  "add at least one brick item.": "کم از کم ایک اینٹ کی قسم شامل کریں۔",
  "at least one brick item is required.": "کم از کم ایک اینٹ کی قسم درکار ہے۔",
  "customer name is required.": "گاہک کا نام درج کرنا ضروری ہے۔",
  "enter customer name": "گاہک کا نام درج کریں",
  "enter or select a customer.": "گاہک کا نام درج کریں یا منتخب کریں۔",
  "select a customer.": "گاہک منتخب کریں۔",
  "select or enter customer...": "گاہک منتخب کریں یا نام درج کریں...",
  "all customers": "تمام گاہک",
  "active customers": "فعال گاہک",
  "no customers found": "کوئی گاہک نہیں ملا",
  "add a customer to start maintaining customer accounts and khata records.": "گاہکوں کے کھاتے درج کرنے کے لیے پہلے گاہک شامل کریں۔",
  "customer sales, payments, returns, and adjustments will appear here.": "گاہک کی فروخت، ادائیگیاں، واپسی اور ترامیم یہاں دکھائی جائیں گی۔",
  "all categories": "تمام زمرے",
  "all dates": "تمام تاریخیں",
  "all stages": "تمام مراحل",
  "all delivery statuses": "ترسیل کی تمام حالتیں",
  "all recorded kiln fuels": "بھٹے کے تمام درج شدہ ایندھن",
  "all movements": "تمام نقل و حرکت",
  "new batch": "نیا بیچ",
  "new gate pass": "نیا گیٹ پاس",
  "new kiln dispatch • gate pass": "بھٹے کی نئی ترسیل • گیٹ پاس",
  "issue gate pass": "گیٹ پاس جاری کریں",
  "gate pass & dispatches": "گیٹ پاس اور ترسیلات",
  "create a gate pass when a shipment is ready.": "مال روانگی کے لیے تیار ہو تو گیٹ پاس بنائیں۔",
  "authorize brick truck release, assign driver, and track delivery": "اینٹوں کے ٹرک کی روانگی منظور کریں، ڈرائیور مقرر کریں اور ترسیل دیکھیں۔",
  "mark dispatched": "روانہ شدہ نشان زد کریں",
  "mark delivered": "پہنچا ہوا نشان زد کریں",
  "shipment has left the kiln.": "کھیپ بھٹے سے روانہ ہو گئی ہے۔",
  "shipment marked as delivered.": "کھیپ کو پہنچا ہوا نشان زد کر دیا گیا ہے۔",
  "driver name and vehicle number are required.": "ڈرائیور کا نام اور گاڑی نمبر درج کرنا ضروری ہے۔",
  "select worker...": "مزدور منتخب کریں...",
  "select a worker before saving attendance.": "حاضری محفوظ کرنے سے پہلے مزدور منتخب کریں۔",
  "save attendance": "حاضری محفوظ کریں",
  "mark worker attendance": "مزدور کی حاضری درج کریں",
  "daily kiln worker attendance register": "بھٹے کے مزدوروں کی روزانہ حاضری کا رجسٹر",
  "no attendance records found": "حاضری کا کوئی ریکارڈ نہیں ملا",
  "present today": "آج حاضر",
  "absent today": "آج غیر حاضر",
  "present days": "حاضری کے دن",
  "present working days": "حاضر کام کے دن",
  "no workers yet": "ابھی کوئی مزدور درج نہیں",
  "worker name is required.": "مزدور کا نام درج کرنا ضروری ہے۔",
  "worker saved.": "مزدور کا ریکارڈ محفوظ ہو گیا۔",
  "new expense": "نیا خرچ",
  "record kiln expense": "بھٹے کا خرچ درج کریں",
  "kiln operational expenses register": "بھٹے کے روزمرہ اخراجات کا رجسٹر",
  "expenses & overheads": "اخراجات اور ضمنی لاگت",
  "no expenses recorded yet.": "ابھی کوئی خرچ درج نہیں ہوا۔",
  "no expenses found matching the criteria.": "منتخب معیار کے مطابق کوئی خرچ نہیں ملا۔",
  "record expense": "خرچ درج کریں",
  "save expense": "خرچ محفوظ کریں",
  "expense category": "خرچ کا زمرہ",
  "expense date": "خرچ کی تاریخ",
  "new fuel purchase": "ایندھن کی نئی خریداری",
  "add fuel": "ایندھن شامل کریں",
  "fuel purchase details": "ایندھن کی خریداری کی تفصیلات",
  "fuel delivery voucher": "ایندھن کی ترسیل کا واؤچر",
  "no fuel purchases or delivery records found.": "ایندھن کی خریداری یا ترسیل کا کوئی ریکارڈ نہیں ملا۔",
  "fuel record cancelled.": "ایندھن کا ریکارڈ منسوخ ہو گیا۔",
  "coal & kiln fuel purchase register": "کوئلے اور بھٹے کے ایندھن کی خریداری کا رجسٹر",
  "current password": "موجودہ پاس ورڈ",
  "confirm new password": "نئے پاس ورڈ کی تصدیق کریں",
  "change password": "پاس ورڈ تبدیل کریں",
  "password changed successfully!": "پاس ورڈ کامیابی سے تبدیل ہو گیا!",
  "passwords do not match": "پاس ورڈ ایک جیسے نہیں ہیں",
  "current password is incorrect.": "موجودہ پاس ورڈ درست نہیں ہے۔",
  "failed to change password": "پاس ورڈ تبدیل نہیں ہو سکا",
  refresh: "تازہ کریں",
  "try again": "دوبارہ کوشش کریں",
  "no data available": "کوئی معلومات دستیاب نہیں",
  "no recent activity to display.": "دکھانے کے لیے کوئی حالیہ سرگرمی نہیں۔",
  "no transactions have been recorded yet.": "ابھی کوئی لین دین درج نہیں ہوا۔",
  "search customers...": "گاہک تلاش کریں...",
  "search invoices...": "رسیدیں تلاش کریں...",
  "search sales...": "فروخت تلاش کریں...",
  "search workers...": "مزدور تلاش کریں...",
  "search suppliers...": "سپلائر تلاش کریں...",
  "search payments...": "ادائیگیاں تلاش کریں...",
  "search expenses by category, note...": "زمرے یا نوٹ سے اخراجات تلاش کریں...",
  "search gate passes...": "گیٹ پاس تلاش کریں...",
  "search purchases...": "خریداری تلاش کریں...",
  "search returns...": "واپسی تلاش کریں...",
  "search transport...": "ٹرانسپورٹ تلاش کریں...",
  "search audit logs...": "آڈٹ لاگز تلاش کریں...",
  "search batch or grade": "بیچ یا معیار تلاش کریں",
  "search production batches": "پیداواری بیچ تلاش کریں",
  "search worker by name / code...": "نام یا کوڈ سے مزدور تلاش کریں...",
  "payment amount must be positive and cannot exceed the due amount.": "ادائیگی صفر سے زیادہ اور واجب الادا رقم سے زیادہ نہیں ہو سکتی۔",
  "return quantity exceeds the remaining sold quantity.": "واپسی کی مقدار فروخت کی باقی مقدار سے زیادہ ہے۔",
  "discount cannot exceed the subtotal.": "رعایت ذیلی کل سے زیادہ نہیں ہو سکتی۔",
  "quantity must be greater than zero.": "مقدار صفر سے زیادہ ہونی چاہیے۔",
  "failed to load orders": "آرڈرز لوڈ نہیں ہو سکے",
  "failed to save order": "آرڈر محفوظ نہیں ہو سکا",
  "failed to update order status": "آرڈر کی حالت تبدیل نہیں ہو سکی",
  "all statuses": "تمام حالتیں",
  draft: "مسودہ",
  pending: "زیرِ التوا",
  processing: "زیرِ عمل",
  completed: "مکمل",
  confirmed: "تصدیق شدہ",
  cancelled: "منسوخ",
  canceled: "منسوخ",
  paid: "ادا شدہ",
  unpaid: "غیر ادا شدہ",
  "partially paid": "جزوی ادا شدہ",
  approved: "منظور شدہ",
  rejected: "مسترد",
  active: "فعال",
  inactive: "غیر فعال",
  "no phone provided": "فون نمبر درج نہیں",
  "not provided": "درج نہیں کیا گیا",
  "not available": "دستیاب نہیں",
  "optional notes for this sale...": "اس فروخت کے لیے اختیاری نوٹ...",
  "payment method": "ادائیگی کا طریقہ",
  "payment date": "ادائیگی کی تاریخ",
  "payment status": "ادائیگی کی حالت",
  "payment amount (pkr)": "ادائیگی کی رقم (PKR)",
  "receive customer payment": "گاہک کی ادائیگی وصول کریں",
  "record customer payment": "گاہک کی ادائیگی درج کریں",
  "record sales return": "فروخت کی واپسی درج کریں",
  "record brick return": "اینٹوں کی واپسی درج کریں",
  "recent payment history": "حالیہ ادائیگیوں کی تاریخ",
  "no payments recorded.": "کوئی ادائیگی درج نہیں ہوئی۔",
  "customer order & delivery voucher": "گاہک کے آرڈر اور ترسیل کا واؤچر",
  "ordered brick grade & quantities": "آرڈر کردہ اینٹوں کے معیار اور مقدار",
  "payment summary": "ادائیگی کا خلاصہ",
  "order information": "آرڈر کی معلومات",
  "notes / destination": "نوٹ / منزل",
  "committed delivery": "طے شدہ ترسیل",
  "balance due on dispatch": "روانگی پر واجب الادا رقم",
  "as per dispatch queue": "ترسیل کی باری کے مطابق",
});

const UI_WORDS: Record<string, string> = {};
for (const [key, value] of Object.entries(ENGLISH_TO_URDU)) {
  if (/^[a-z]+$/.test(key)) UI_WORDS[key] = value;
}
Object.assign(UI_WORDS, {
  add: "شامل کریں", advance: "پیشگی", all: "تمام", amount: "رقم", and: "اور", approve: "منظور کریں", archive: "محفوظات", attendance: "حاضری", available: "دستیاب", back: "واپس", backup: "بیک اپ", balance: "بقایا", batch: "بیچ", booking: "بکنگ", bricks: "اینٹیں", business: "کاروبار", cancel: "منسوخ کریں", cash: "نقد", category: "زمرہ", change: "تبدیل کریں", check: "جانچیں", choose: "منتخب کریں", city: "شہر", close: "بند کریں", coal: "کوئلہ", confirm: "تصدیق کریں", create: "بنائیں", csv: "CSV", customer: "گاہک", customers: "گاہک", daily: "روزانہ", date: "تاریخ", debit: "ڈیبٹ", delete: "حذف کریں", delivery: "ترسیل", description: "تفصیل", details: "تفصیلات", discount: "رعایت", dispatch: "ترسیل", dispatched: "روانہ شدہ", document: "دستاویز", download: "ڈاؤن لوڈ", due: "واجب الادا", edit: "ترمیم کریں", email: "ای میل", enter: "درج کریں", error: "خرابی", expenses: "اخراجات", export: "برآمد کریں", failed: "ناکام", filter: "فلٹر", filters: "فلٹرز", fuel: "ایندھن", from: "سے", gate: "گیٹ", grade: "معیار", grand: "مجموعی", history: "تاریخچہ", invoice: "رسید", invoices: "رسیدیں", item: "آئٹم", items: "آئٹمز", kiln: "بھٹہ", labour: "مزدوری", ledger: "کھاتہ", loading: "لوڈ ہو رہا ہے", manage: "انتظام کریں", management: "انتظام", manager: "منیجر", method: "طریقہ", month: "مہینہ", movement: "نقل و حرکت", name: "نام", next: "اگلا", notes: "نوٹ", number: "نمبر", or: "یا", order: "آرڈر", orders: "آرڈرز", paid: "ادا شدہ", pass: "پاس", password: "پاس ورڈ", payment: "ادائیگی", payments: "ادائیگیاں", pending: "زیرِ التوا", phone: "فون", please: "براہِ کرم", price: "قیمت", print: "پرنٹ کریں", production: "پیداوار", quantity: "مقدار", rate: "نرخ", receive: "وصول کریں", received: "وصول شدہ", record: "درج کریں", refresh: "تازہ کریں", rejected: "مسترد", remove: "ہٹائیں", report: "رپورٹ", reports: "رپورٹس", required: "ضروری", reset: "ری سیٹ کریں", return: "واپسی", returns: "واپسی", save: "محفوظ کریں", search: "تلاش کریں", select: "منتخب کریں", sale: "فروخت", sales: "فروخت", settings: "ترتیبات", status: "حالت", statuses: "حالتیں", stock: "اسٹاک", submit: "جمع کریں", subtotal: "ذیلی کل", supplier: "سپلائر", suppliers: "سپلائرز", table: "جدول", tax: "ٹیکس", total: "کل", transport: "ٹرانسپورٹ", type: "قسم", unpaid: "غیر ادا شدہ", update: "تبدیل کریں", user: "صارف", vehicle: "گاڑی", view: "دیکھیں", voucher: "واؤچر", wage: "اجرت", wages: "اجرتیں", worker: "مزدور", workers: "مزدور",
});

// Short UI vocabulary enables consistent translation for labels assembled from words.
Object.assign(UI_WORDS, {
  and: "اور",
  of: "کا",
  for: "کے لیے",
  with: "کے ساتھ",
  from: "سے",
  in: "میں",
  on: "پر",
  to: "کو",
  or: "یا",
  the: "یہ",
  your: "آپ کا",
  today: "آج",
  previous: "گزشتہ",
  next: "اگلا",
  page: "صفحہ",
  showing: "دکھائے جا رہے ہیں",
  records: "ریکارڈز",
  information: "معلومات",
  history: "تاریخچہ",
  account: "کھاتہ",
  available: "دستیاب",
  unavailable: "دستیاب نہیں",
  current: "موجودہ",
  new: "نیا",
  old: "پرانا",
  customer: "گاہک",
  customers: "گاہک",
  admin: "منتظم",
  manager: "منیجر",
  invoice: "رسید",
  invoices: "رسیدیں",
  sale: "فروخت",
  sales: "فروخت",
  order: "آرڈر",
  orders: "آرڈرز",
  payment: "ادائیگی",
  payments: "ادائیگیاں",
  amount: "رقم",
  quantity: "مقدار",
  number: "نمبر",
  name: "نام",
  date: "تاریخ",
  method: "طریقہ",
  received: "وصول شدہ",
  outstanding: "بقایا",
  completed: "مکمل",
  confirmed: "تصدیق شدہ",
  cancelled: "منسوخ",
  canceled: "منسوخ",
  pending: "زیرِ التوا",
  processing: "زیرِ عمل",
  paid: "ادا شدہ",
  unpaid: "غیر ادا شدہ",
  draft: "مسودہ",
  active: "فعال",
  inactive: "غیر فعال",
  select: "منتخب کریں",
  enter: "درج کریں",
  choose: "منتخب کریں",
  manage: "انتظام کریں",
  record: "درج کریں",
  create: "بنائیں",
  failed: "ناکام",
  unable: "قاصر",
  matching: "مطابق",
  found: "ملا",
});

function getUrduTranslation(text: string): string | undefined {
  const exact = ENGLISH_TO_URDU[text.trim().toLowerCase()];
  if (exact) return exact;
  const tokens = [...text.matchAll(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)];
  if (tokens.length === 1) return UI_WORDS[tokens[0][0].toLowerCase()];
  if (tokens.length < 2) return undefined;
  let translated = 0;
  const output = text.replace(/[A-Za-z]+(?:['’][A-Za-z]+)?/g, (word) => {
    const value = UI_WORDS[word.toLowerCase()];
    if (!value) return word;
    translated += 1;
    return value;
  });
  return translated >= 2 && translated / tokens.length >= 0.66 ? output : undefined;
}

type LocalizedNodeState = { source: string; output: string };
const localizedTextNodes = new WeakMap<Text, LocalizedNodeState>();
const localizedAttributes = new WeakMap<Element, Map<string, LocalizedNodeState>>();
const LOCALIZABLE_ATTRIBUTES = ["placeholder", "title", "aria-label", "aria-description", "alt"];

function languageValue(source: string, language: LanguageCode): string {
  if (language === "en") return source;
  if (/[\u0600-\u06ff]/.test(source)) return source;
  const urdu = getUrduTranslation(source);
  if (!urdu) return source;
  return language === "ur" ? urdu : `${source} / ${urdu}`;
}

function originalValue(value: string): string {
  const newline = value.indexOf("\n");
  if (newline >= 0 && /[\u0600-\u06ff]/.test(value.slice(newline + 1))) {
    return value.slice(0, newline);
  }
  const slash = value.indexOf(" / ");
  if (slash >= 0 && /[\u0600-\u06ff]/.test(value.slice(slash + 3))) {
    return value.slice(0, slash);
  }
  return value;
}

function localizeTextNode(node: Text, language: LanguageCode) {
  const parent = node.parentElement;
  if (!parent || !node.data.trim() || parent.closest("script,style,noscript,pre,code,textarea,[contenteditable='true'],[translate='no'],.font-urdu")) return;
  if (language === "both" && node.nextSibling instanceof Element && node.nextSibling.classList.contains("font-urdu")) return;
  const current = node.data;
  let state = localizedTextNodes.get(node);
  if (!state || current !== state.output) {
state = { source: originalValue(current), output: current };
  }
  const match = state.source.match(/^(\s*)([\s\S]*?)(\s*)$/);
  const output = match ? `${match[1]}${languageValue(match[2], language)}${match[3]}` : languageValue(state.source, language);
  state.output = output;
  localizedTextNodes.set(node, state);
  if (current !== output) node.data = output;
}

function localizeAttributes(element: Element, language: LanguageCode) {
  let states = localizedAttributes.get(element);
  if (!states) { states = new Map(); localizedAttributes.set(element, states); }
  for (const name of LOCALIZABLE_ATTRIBUTES) {
    if (!element.hasAttribute(name)) continue;
    const current = element.getAttribute(name) ?? "";
    let state = states.get(name);
    if (!state || current !== state.output) state = { source: originalValue(current), output: current };
    const output = languageValue(state.source, language);
    state.output = output;
    states.set(name, state);
    if (current !== output) element.setAttribute(name, output);
  }
}

export function installLanguageDomTranslation(language: LanguageCode): () => void {
  const root = document.getElementById("root") ?? document.body;
  const scan = (start: Node) => {
    if (start instanceof Element) {
      localizeAttributes(start, language);
      const walker = document.createTreeWalker(start, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        if (node instanceof Element) localizeAttributes(node, language);
        else if (node instanceof Text) localizeTextNode(node, language);
      }
    } else if (start instanceof Text) localizeTextNode(start, language);
  };
  scan(root);
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "characterData" || mutation.type === "attributes") scan(mutation.target);
      if (mutation.type === "childList") mutation.addedNodes.forEach(scan);
    }
  });
  observer.observe(root, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: LOCALIZABLE_ATTRIBUTES });
  return () => observer.disconnect();
}

export function translateText(englishText: string, language: LanguageCode): string {
  if (language === "en") return englishText;
  const ur = getUrduTranslation(englishText);
  if (!ur) return englishText;
  if (language === "ur") return ur;
  return `${englishText}\n${ur}`;
}

export function translateTextNode(englishText: string, language: LanguageCode): ReactNode {
  if (language === "en") return englishText;
  const ur = getUrduTranslation(englishText);
  if (!ur) return englishText;
  if (language === "ur") {
    return <span lang="ur" dir="rtl" className="font-urdu">{ur}</span>;
  }
  return (
    <>
      {englishText}
      <span lang="ur" dir="rtl" className="font-urdu mt-1 block text-[1.08em] font-bold leading-relaxed">{ur}</span>
    </>
  );
}

export function LocalizedText({ text }: { text: string }) {
  const language = useAppStore((state) => state.language);
  return <>{translateTextNode(text, language)}</>;
}

export function useT() {
  const language = useAppStore((state) => state.language);
  const t = (key: TranslationKey) => translate(key, language);
  return { t, language };
}
