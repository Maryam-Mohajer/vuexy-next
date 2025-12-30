import { NextResponse } from 'next/server'

const accounts = [
  { id: 1, title: 'صندوق' },
  { id: 2, title: 'بانک ملت' },
  { id: 3, title: 'بانک ملی' },
  { id: 4, title: 'حساب دریافتنی' },
  { id: 5, title: 'حساب پرداختنی' },
  { id: 6, title: 'سرمایه' },
  { id: 7, title: 'درآمد' },
  { id: 8, title: 'هزینه' }
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''

  // شبیه‌سازی تاخیر
  await new Promise(resolve => setTimeout(resolve, 500))

  const filtered = accounts.filter(acc =>
    acc.title.includes(search)
  )

  return NextResponse.json(filtered)
}
