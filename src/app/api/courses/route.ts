import { NextRequest, NextResponse } from 'next/server'
import { coursesDetail } from '@app/lib/courses-detail'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const page = parseInt(searchParams.get('page') || '1', 10)
  
    let filteredItems = category
      ? coursesDetail.filter(item => item.category === category)
      : coursesDetail
  
    const totalItems = filteredItems.length
    const totalPages = Math.ceil(totalItems / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
  
    filteredItems = filteredItems.slice(startIndex, endIndex)
  
    return NextResponse.json({
      coursesDetail: filteredItems,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
      }
    })
  }