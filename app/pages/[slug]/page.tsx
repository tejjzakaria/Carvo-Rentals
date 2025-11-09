/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Layout from '@/components/Layout'
import { prisma } from '@/lib/prisma'

interface PageParams {
  params: Promise<{
    slug: string
  }>
}

async function getPage(slug: string) {
  const page = await prisma.page.findUnique({
    where: {
      slug,
      isActive: true
    }
  })

  return page
}

export default async function ContentPage({ params }: PageParams) {
  const { slug } = await params
  const page = await getPage(slug)

  if (!page) {
    notFound()
  }

  return (
    <div>
      <Header />

      <Layout>
        <div className='py-16'>
          {/* Page Header */}
          <div className='text-center mb-12'>
            <h1 className='text-5xl md:text-6xl font-bold text-primary mb-4'>
              {page.title}
            </h1>
            <p className='text-sm text-gray-400'>
              Last updated: {new Date(page.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {/* Page Content */}
          <div className='max-w-4xl mx-auto'>
            <div className='bg-white rounded-2xl border-2 border-gray-200 p-8 md:p-12'>
              <div
                className='prose prose-lg max-w-none text-gray-300'
                dangerouslySetInnerHTML={{ __html: page.content }}
                style={{
                  lineHeight: '1.8',
                }}
              />
            </div>
          </div>
        </div>
      </Layout>

      <Footer />
    </div>
  )
}

// Generate static params for all active pages
export async function generateStaticParams() {
  const pages = await prisma.page.findMany({
    where: {
      isActive: true
    },
    select: {
      slug: true
    }
  })

  return pages.map((page) => ({
    slug: page.slug
  }))
}
