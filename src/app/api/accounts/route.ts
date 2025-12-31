import { NextResponse } from 'next/server'

const accounts = [
  { id: 1, title: 'صندوق' },
  { id: 2, title: 'بانک ملت' },
  { id: 3, title: 'بانک ملی' },
  { id: 4, title: 'حساب دریافتنی' },
  { id: 5, title: 'حساب پرداختنی' },
  { id: 6, title: 'سرمایه' },
  { id: 7, title: 'درآمد' },
  { id: 8, title: 'هزینه' },

  { id: 9, title: 'بانک صادرات' },
  { id: 10, title: 'بانک پاسارگاد' },
  { id: 11, title: 'بانک سامان' },
  { id: 12, title: 'بانک آینده' },

  { id: 13, title: 'بانک دی' },
  { id: 14, title: 'بانک کشاورزی' },
  { id: 15, title: 'بانک مسکن' },
  { id: 16, title: 'بانک رفاه' },
  { id: 17, title: 'بانک تجارت' },
  { id: 18, title: 'بانک سینا' },
  { id: 19, title: 'بانک شهر' },
  { id: 20, title: 'بانک ایران زمین' },

  { id: 21, title: 'بانک خاورمیانه' },
  { id: 22, title: 'بانک انصار' },
  { id: 23, title: 'بانک قوامین' },
  { id: 24, title: 'بانک حکمت ایرانیان' },
  { id: 25, title: 'بانک مهر ایران' },
  { id: 26, title: 'بانک قرض الحسنه رسالت' },
  { id: 27, title: 'بانک توسعه تعاون' },
  { id: 28, title: 'بانک توسعه صادرات' },

  { id: 29, title: 'حساب سرمایه‌گذاری کوتاه مدت' },
  { id: 30, title: 'حساب سرمایه‌گذاری بلند مدت' }
]


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const search = searchParams.get('search') ?? ''
  const page = Number(searchParams.get('page') ?? 1)
  const pageSize = Number(searchParams.get('pageSize') ?? 5)

  // شبیه‌سازی تاخیر
  await new Promise(resolve => setTimeout(resolve, 500))

  // فیلتر
  const filtered = accounts.filter(acc =>
    acc.title.includes(search)
  )

  // صفحه‌بندی
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginated = filtered.slice(start, end)

  return NextResponse.json({
    data: paginated,
    page,
    pageSize,
    total: filtered.length,
    hasMore: end < filtered.length
  })
}
//-------------------------------------------------------------Basic Api------------------------------------------------

// import { NextResponse } from 'next/server'

// const accounts = [
//   { id: 1, title: 'صندوق' },
//   { id: 2, title: 'بانک ملت' },
//   { id: 3, title: 'بانک ملی' },
//   { id: 4, title: 'حساب دریافتنی' },
//   { id: 5, title: 'حساب پرداختنی' },
//   { id: 6, title: 'سرمایه' },
//   { id: 7, title: 'درآمد' },
//   { id: 8, title: 'هزینه' }
// ]

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url)
//   const search = searchParams.get('search') || ''

//   // شبیه‌سازی تاخیر
//   await new Promise(resolve => setTimeout(resolve, 500))

//   const filtered = accounts.filter(acc =>
//     acc.title.includes(search)
//   )

//   return NextResponse.json(filtered)
// }
